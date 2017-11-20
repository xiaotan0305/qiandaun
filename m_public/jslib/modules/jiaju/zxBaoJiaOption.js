/**
 * Created by zhangjinyu on 2017/8/29.
 */

define('modules/jiaju/zxBaoJiaOption', ['jquery', 'weixin/2.0.0/weixinshare', 'modules/jiaju/bmOption'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var $document = $(document);
    var $window = $(window);
    // 补充信息部分
    var bmOption = require('modules/jiaju/bmOption');
    bmOption();

    function BaoJiaOption() {}
    BaoJiaOption.prototype = {
        init: function () {
            var that = this;
            // 4个六边形的特效
            that.ppInfo = $('#ppInfo');
            // 查看明细
            that.showDetail = $('.showDetail');
            // 价格明细ul
            that.priceDetailListUl = $('#priceDetailList');
            // 价格明细li
            that.priceDetailListLis = that.priceDetailListUl.find('.bjaarr-rt');

            /* 事件初始化*/
            that.bindEvent();

            /* 4个六边形特效*/
            that.scrollHexagonFade();
        },
        bindEvent: function () {
            var that = this;

            /* 点击查看明细*/
            that.showDetail.on('click', function () {
                var $that = $(this);
                var pos = that.getActiveLi();
                $('.itemDiv' + pos).slideDown().siblings('.ldbjgtr').hide();
                // 改变按钮的状态和文字
                if ($that.hasClass('cur')) {
                    $that.html('查看明细<i></i>').removeClass('cur');
                    that.priceDetailListLis.eq(pos).slideDown().siblings('.bjaarr-rt').hide();
                } else {
                    $that.html('收起<i></i>').addClass('cur');
                    that.priceDetailListLis.slideDown();
                }
            });

            /* 明细每一项li点击*/
            that.priceDetailListLis.on('click', function () {
                var $that = $(this);
                // 如果只有一项展示，并且是【查看明细】
                if (!that.showDetail.hasClass('cur')) {
                    return;
                }
                var pos = $that.attr('data-pos');
                if ($that.hasClass('cur')) {
                    $('.itemDiv' + pos).hide().siblings('.ldbjgtr').hide();
                    $that.removeClass('cur');
                } else {
                    $('.itemDiv' + pos).slideDown().siblings('.ldbjgtr').hide();
                    $that.addClass('cur').siblings('.bjaarr-rt').removeClass('cur');
                }
            });
        },

        /* 获取当前查看的是哪一部分的明细*/
        getActiveLi: function () {
            var that = this;
            var pos = 0;
            that.priceDetailListLis.each(function (index) {
                var $eachThat = $(this);
                if ($eachThat.hasClass('cur')) {
                    pos = index;
                }
            });
            return pos;
        },
        // 当页面滚动到某个位置，4个六边形的动态飞入
        scrollHexagonFade: function () {
            var that = this;
            var thisTop;
            var docHeight = $document.height();
            var winHeight = $window.height();
            var scrollHeight = docHeight - winHeight - 100;
            $document.on('scroll', function () {
                thisTop = $document.scrollTop();
                if (thisTop > scrollHeight) {
                    that.hexagonFade('addClass');
                } else if (thisTop < (scrollHeight - 200)) {
                    that.hexagonFade('removeClass');
                }
            });
        },
        hexagonFade: function (vv) {
            var that = this;
            that.ppInfo.find('li').each(function (index) {
                var $that = $(this),
                    fadeFn;
                switch (index) {
                    case 0:
                    case 3:
                        fadeFn = 'fadeInLeft';
                        break;
                    case 1:
                    case 4:
                        fadeFn = 'fadeInRight';
                        break;
                }
                $that[vv](fadeFn);
            });
        }
    };
    module.exports = new BaoJiaOption();
    // 微信分享
    var wxShare = require('weixin/2.0.0/weixinshare');
    var imageUrl = vars.public + 'img/app_jiaju_logo.png';
    imageUrl = imageUrl.replace(/^(https?)?(?=\/\/)/, location.protocol);
    new wxShare({
        debug: false,
        lineLink: vars.jiajuSite + '?c=jiaju&a=quoteTotalPrice&city=' + vars.city,
        shareTitle: '装修报价',
        descContent: '我们的家预计装修报价是' + vars.HalfPrice + '万元，看看你的吧！——房天下装修',
        imgUrl: imageUrl
    });
});