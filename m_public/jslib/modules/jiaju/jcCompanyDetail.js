/**
 * Created on 2017/7/27.
 */
define('modules/jiaju/jcCompanyDetail', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    "iscroll/2.0.0/iscroll-lite"
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var isScroll = require('iscroll/2.0.0/iscroll-lite');
        //图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({
            threshold: 200,
            event: 'scroll click'
        });
        /**
         * 错误提示
         */
        var alertFloat = $('#alertFloat');
        var alertText = $('#alertText');

        function toastFn(msg) {
            alertText.html(msg);
            alertFloat.show();
            setTimeout(function () {
                alertText.html('');
                alertFloat.hide();
            }, 2000);
        }

        // 详情头部的滑动图
        var stage = $('.but-stage');
        var jcCompanyDetail = $('#jcCompanyDetail');
        require.async('swipe/3.10/swiper', function (Swiper) {
            if (jcCompanyDetail) {
                new Swiper('#jcCompanyDetail', {
                    direction: 'horizontal',
                    lazyLoading: true,
                    onInit: function (swiper) {
                        stage.find('span').text('1/' + swiper.slides.length);
                    },
                    onSlideChangeEnd: function (swiper) {
                        stage.find('span').text(swiper.activeIndex + 1 + '/' + swiper.slides.length);
                    }
                });
            }
        });
        // 店铺导购
        var swiperVideos = $('#swiperVideos');
        if (swiperVideos.length) {
            swiperVideos.find('ul').width(swiperVideos.find('li').length * 174 + 14);
            new isScroll("#swiperVideos", {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        }
        // 主营商品
        var swiperGoods = $('#swiperGoods');
        if (swiperGoods.length) {
            swiperGoods.find('ul').width(swiperGoods.find('li').length * 135);
            new isScroll('#swiperGoods', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        }

        // 优惠券
        var swiperCoupons = $('#swiperCoupons');
        if (swiperCoupons.length) {
            var swiperCouponsWidth = 0;
            swiperCoupons.find('li').each(function () {
                var $that = $(this);
                swiperCouponsWidth += parseFloat($that.width()) + 30;
            });
            swiperCoupons.find('ul').width(swiperCouponsWidth);
            new isScroll('#swiperCoupons', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        }

        /**
         * 商家活动
         */
        var moreActivict = $('#moreActivict');
        if (moreActivict.length) {
            moreActivict.on('click', function () {
                $('div.listBox').show();
                $(this).hide();
            });
        }

        /**
         * 页面底部的聊天
         */
        var onlineChat = $('#onlineChat');
        onlineChat.on('click', function () {
            if (vars.imid) {
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetUserInfoById&uid=' + vars.imid + '&city=' + vars.city, function (data) {
                    if (data && data.userid) {
                        if (vars.localStorage) {
                            vars.localStorage.setItem(String('j:' + data.username), encodeURIComponent(data.username) + ';' + data.imgurl + ';;');
                        }
                        window.location = vars.mainSite + '/chat.d?m=chat&username=j:' + data.username + '&city=' + vars.city + '&type=waphome';
                    } else {
                        toastFn('获取用户信息失败，请重试!');
                    }
                });
            } else {
                toastFn('获取用户信息失败，请重试!');
            }
        });
        /**
         * 判断当前是否登录
         */
        function checkLogin() {
            var res = true;
            if (!vars.login_visit_mode) {
                res = false;
                window.location.href = vars.loginUrl;
            }
            return res;
        }
        /* 统计日志*/
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXLog&city=' + vars.city + '&typeid=52&objid=' + vars.companyid + '&refer='
            + encodeURIComponent(document.referrer) + '&sorce=' + encodeURIComponent(location.href));
        /* 收藏*/
        var collect = $('#collect');
        collect.on('click', function () {
            var canAjax = true;

            if (canAjax && checkLogin()) {
                canAjax = false;
                $.ajax({
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxCompanyCollect&companyid=' + vars.companyid + '&r=' + Math.random(),
                    success: function (data) {
                        if (!data) {
                            var Msg = '收藏失败, 请刷新重试';
                            if (collect.hasClass('on')) {
                                Msg = '取消' + Msg;
                            }
                            toastFn(Msg);
                        } else if (data.IsSuccess === '0') {
                            toastFn(data.Message);
                        } else if (data.IsSuccess === '1') {
                            collect.toggleClass('on');
                            toastFn(data.CollectStatus === '1' ? '收藏成功' : '取消收藏成功');
                        }
                    },
                    complete: function () {
                        canAjax = true;
                    }
                });
            }
        });
        /**
         * 底部的预约到店和优惠券的预约
         */
        var yuyueBtn = $('.yuyueBtn');
        yuyueBtn.on('click', function () {
            var $that = $(this);
            var params = {
                companyId: $that.attr('data-companyId'),
                companyName: $that.attr('data-companyName'),
                sourceType: $that.attr('data-sourceType')
            };
            var objectId = $that.attr('data-objectId');
            var objectName = $that.attr('data-objectName');
            var brandName = $that.attr('data-brandName');
            var brandId = $that.attr('data-brandId');
            var category = $that.attr('data-category');
            if (parseInt(objectId)) {
                params.objectId = objectId;
            }
            if (objectName) {
                params.objectName = encodeURIComponent(objectName);
            }
            if (brandName) {
                params.productBrand = encodeURIComponent(brandName);
            }
            if (parseInt(brandId)) {
                params.productBrandId = brandId;
            }
            if (category) {
                params.category = encodeURIComponent(category);
            }
            params.sourcePageUrl = encodeURIComponent(location.href);
            var yuyueFlag = true;
            if (yuyueFlag && checkLogin()) {
                yuyueFlag = false;
                $.post(vars.jiajuSite + '?c=jiaju&a=ajaxJCAppointment&city=' + vars.city, params, function (data) {
                    yuyueFlag = true;
                    if (data) {
                        toastFn(data.message);
                    } else {
                        toastFn('预约失败');
                    }
                });
            }
        });
    }
});
