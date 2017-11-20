/**
 * @file 建材聚合详情页
 * @author bjzhangxiaowei@fang.com
 */
define('modules/jiaju/buildPartDetail', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore',
    'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min', 'iscroll/2.0.0/iscroll-lite'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var $nav = $('.icon-nav');
        var $body = $('body');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var Iscroll = require('iscroll/2.0.0/iscroll-lite');

        $(document).ready(function () {
            $('#PhotoSwipeTarget').css('overflow', 'hidden');
            if (window.location.search.indexOf('?') !== -1) {
                if (window.location.search.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                    $('#foot').css('display', 'none');
                }
            }
            $('footer').append('<div style="width: 100%;height: 50px"><span style="display:block"></span></div>');
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

        // 照片轮播
        require.async('swipe/3.10/swiper', function (Swiper) {
            var $per = $('.per');
            // 图片总数
            Swiper('#swiper', {
                speed: 500,
                loop: false,
                onSlideChangeEnd: function (swiper) {
                    // 序号从零开始
                    $per.text(swiper.activeIndex + 1);
                }
            });
        });
        var $imgs = $('#swiper').find('img');
        var slides = [];
        for (var i = 0, len = $imgs.length; i < len; i++) {
            var $img = $imgs.eq(i);
            slides.push({
                src: $img.attr('src'),
                w: $img.width(),
                h: $img.height()
            });
        }
        var pswp = $('.pswp')[0];
        $imgs.on('click', function () {
            var index = $(this).parents('.swiper-slide').eq(0).index();
            var options = {
                history: false,
                focus: false,
                index: index,
                escKey: true
            };
            var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, slides, options);
            gallery.init();
        });
        // 加载失败
        $('#reload').on('click', function () {
            location.reload();
        });

        // 底部横向滑动
        var $jStag = $('.jStag');
        var $a = $jStag.find('a');
        var width = 0;
        width += Array.prototype.reduce.call($a, function (sum, cur) {
            return parseInt($(cur).css('width'), 10) + (typeof sum === 'number' ? sum : parseInt($(sum).css('width'), 10));
        });
        width += parseInt($jStag.css('padding-right'), 10);
        width += $a.length * parseInt($a.css('margin-right'), 10);
        $jStag.css('width', width);
        new Iscroll('.jStag-wrap', {
            scrollX: true,
            scrollY: false,
            bindToWrapper: true,
            // 是否使图表上的竖直方向的默认滚动事件生效
            eventPassthrough: true
        });
    };
});