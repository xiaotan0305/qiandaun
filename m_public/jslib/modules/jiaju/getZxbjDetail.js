/**
 * @file WAP装修报价
 * @author 钟厚财-20170714
 */
define('modules/jiaju/getZxbjDetail', ['jquery', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var jiajuUtils = vars.jiajuUtils;

    function PriceDetail() {}
    PriceDetail.prototype = {
        init: function () {
            var that = this;
            that.inAjax = false;
            // 展开收起按钮
            that.$showDetail = $('.showDetail');
            that.$showDetailInfoEle = that.$showDetail.find('a');
            that.showDetailBtnText = '查看明细收起';
            // 报价明细表格
            that.$priceDetailList = $('.listSq');
            that.$priceDetailItems = that.$priceDetailList.find('li');

            // 提示框
            that.$info = $('.info');
            // 提示框
            that.$floatAlert = $('.floatAlert');
            // 精准报价btn
            that.$accurateQuote = $('.accurateQuote');
            // toast弹框
            that.$sendFloat = $('#sendFloat');
            that.$sendText = $('#sendText');
            // 装修类型导航栏
            that.$decTypeNavWrap = $('.decTypeNavWrap');
            that.$decTypeNav = $('.decTypeNav');
            that.$window = $(window);
            that.refreshOffset();
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            // 展开收起按钮点击事件
            that.$showDetail.on('click', $.proxy(that.showDetailFn, that));
            // 报价明细展开收起点击事件
            that.$priceDetailItems.on('click', 'a', function () {
                if (!that.$priceDetailList.hasClass('listSq') && !that.inAjax) {
                    that.activePriceDetailItem = this.parentNode;
                    that.toggleDetailItems();
                }
            });
            // 提示信息点击事件
            that.$info.on('click', function () {
                that.$floatAlert.show();
                jiajuUtils.toggleTouchmove(1);
            });
            // 提示框关闭按钮点击事件
            that.$floatAlert.find('.jjbj-close').on('click', function () {
                that.$floatAlert.hide();
                jiajuUtils.toggleTouchmove();
            });
            // 精准报价跳转地址按钮
            that.$accurateQuote.length && that.$accurateQuote.on('click', $.proxy(that.accurateQuoteFn, that));
            that.$window.on('scroll', $.proxy(that.scrollFn, that));
        },
        // 报价明细展开菜单
        showDetailFn: function () {
            var that = this;
            var $showDetailInfoEle = that.$showDetailInfoEle;
            var $priceDetailList = that.$priceDetailList;
            // 报价明细切换展开收起
            $showDetailInfoEle.text(that.showDetailBtnText.replace($showDetailInfoEle.text(), '')).toggleClass('arr-down arr-up');
            $priceDetailList.toggleClass('listSq').find('.coverDiv').toggle();
            that.refreshOffset();
            that.scrollFn();
        },
        // 报价明细项目切换
        toggleDetailItems: function () {
            var that = this;
            var $activeItem = $(that.activePriceDetailItem);
            var $content = $activeItem.find('dl');
            if ($content.length) {
                $activeItem.toggleClass('cur').find('a').toggleClass('arr-up arr-down');
                $content.toggle();
                that.refreshOffset();
            } else {
                that.inAjax = true;
                $.ajax({
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxGetPriceDetail',
                    data: {
                        type: $activeItem.data('rommtype'),
                        room: vars.room,
                        area: $activeItem.data('area'),
                        hall: vars.hall,
                        kitchen: vars.kitchen,
                        toilet: vars.toilet,
                        balcony: vars.balcony,
                        level: vars.level
                    },
                    success: function (data) {
                        $activeItem.append(data).toggleClass('cur').find('a').toggleClass('arr-up arr-down');
                        that.refreshOffset();
                    },
                    complete: function () {
                        that.inAjax = false;
                    }
                });
            }
        },
        // 精准报价点击事件
        accurateQuoteFn: function () {
            var that = this;
            that.inAjax = true;
            $.ajax({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxPriciseQuote&judge=1&cityID=' + vars.cityID + '&sc=' + vars.sc + '&src=' + vars.src + '&fapp=' + vars.fapp,
                success: function (data) {
                    if (data.isSuc === '100') {
                        that.showAlertMsg();
                    } else {
                        window.location.href = that.$accurateQuote.data('href');
                    }
                },
                complete: function () {
                    that.inAjax = false;
                }
            });
        },
        // toast 提示错误信息
        showAlertMsg: function (content) {
            var that = this;
            that.$sendFloat.show();
            content && that.$sendText.html(content);
            that.toastTime && clearTimeout(that.toastTime);
            that.toastTime = setTimeout(function () {
                that.$sendFloat.hide();
            }, 2000);
        },
        refreshOffset: function () {
            var that = this;
            if (that.offset) {
                that.offset[1] = that.$showDetail.offset().top;
            } else {
                that.offset = [that.$decTypeNav.offset().top, that.$showDetail.offset().top];
            }
        },
        scrollFn: function () {
            var that = this;
            var scrollTop = that.$window.scrollTop();
            if (scrollTop < that.offset[0] || scrollTop > that.offset[1] + 40) {
                that.$decTypeNavWrap.removeClass('fixedNav');
            } else {
                that.$decTypeNavWrap.addClass('fixedNav');
            }
        }
    };
    module.exports = new PriceDetail();
    // 微信分享
    var wxShare = require('weixin/2.0.0/weixinshare');
    var imageUrl = vars.public + 'img/app_jiaju_logo.png';
    imageUrl = imageUrl.replace(/^(https?)?(?=\/\/)/, location.protocol);
    new wxShare({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        lineLink: vars.sourcepageurl + '&sr=wexin',
        shareTitle: '装修报价',
        descContent: '我们的家预计装修报价是' + vars.HalfPrice + '万元，看看你的吧！——房天下装修',
        imgUrl: imageUrl
    });
});