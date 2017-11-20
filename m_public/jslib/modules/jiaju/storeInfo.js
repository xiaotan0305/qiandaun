/**
 * @file 爆款详情页
 * Modified by xuying 2016-8-17
 */
define('modules/jiaju/storeInfo', ['jquery', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $nav = $('.icon-nav');
        var $body = $('body');
        var showall = $('#showall');

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
            $body.css('height', window.innerHeight + 100);
            window.scrollTo(0, 1);
            $body.css('height', window.innerHeight);
        }
        var $focus = $('.focus-opt');
        var $head = $('.head2');
        var maxLen = 200;
        var cLen = 150;
        var $window = $(window);
        var scrollFunc = function () {
            var scrollH = $window.scrollTop();
            // 导航切换效果
            if (scrollH <= maxLen) {
                $head.css('opacity', scrollH / maxLen);
                // 向下移动屏幕
                if (scrollH <= cLen) {
                    $focus.css('opacity', 1 - scrollH / cLen);
                } else {
                    $head.children().filter('.left,.head-icon').css('opacity', scrollH / (maxLen - cLen));
                }
                // 向上移动屏幕
            } else {
                $head.css('opacity', 1);
                $focus.css('opacity', 0);
            }
        };
        if ($('.nodata1').length) {
            $head.removeClass('head2');
            $nav.on('click', function () {
                $head.css('position', 'relative');
            });
        } else {
            $window.on('scroll', scrollFunc);
            $nav.on('click', (function () {
                var isShow = 0;
                return function () {
                    isShow = !isShow;
                    if (isShow) {
                        $window.off('scroll');
                        $head.css('opacity', 1);
                        $focus.css('opacity', 0);
                    } else {
                        $window.on('scroll', scrollFunc);
                        $head.css('opacity', 0);
                        $focus.css('opacity', 1);
                    }
                };
            })());
        }
        // 照片轮播
        var imgLen = $('.swiper-slide').length;
        if (imgLen > 1) {
            require.async('swipe/3.10/swiper', function (Swiper) {
                var $per = $('.per');
                var imgLen = $('.swiper-slide').length;
                new Swiper('#swiper', {
                    // 切换速度
                    speed: 500,
                    // 自动切换间隔
                    autoplay: 3000,
                    // 循环
                    loop: true,
                    autoplayDisableOnInteraction: false,
                    onSlideChangeEnd: function (swiper) {
                        // 序号从零开始
                        $per.text(swiper.activeIndex % imgLen || imgLen);
                    }
                });
            });
        }
        //代金券展示
        showall.on('click', function(){
            $('.allSale li').show();
            showall.hide();
        })

    };
});