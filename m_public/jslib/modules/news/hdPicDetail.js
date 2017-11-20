/**
 * 资讯组图详情页js
 * Created by LXM on 14-12-8.
 * modify by taoxudong@fang.com<2016-6-23>
 */
define('modules/news/hdPicDetail', ['jquery', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var $slider = $('#slider');
        var length = $('.swiper-slide').length;
        var Swiper = require('swipe/3.10/swiper');
        $('.swiper-wrapper').css('width', (length && length + 2) * parseInt($slider.css('width'), 10));
        var $phototext = $('.photo-text');
        $phototext.on('click', (function () {
            var $wrap = $phototext.children();
            return function () {
                var height = parseInt($wrap.css('height'), 10);
                if (height > 150) {
                    $phototext.toggleClass('open').css('height', $phototext.hasClass('open') ? height - 9 : '135px');
                }
            };
        })());
        new Swiper('#slider', {
            // 切换速度
            speed: 500,
            // 循环
            loop: true,
            onTransitionEnd: (function () {
                var $index = $phototext.find('i');
                var $texts = $phototext.find('p');
                var $wrap = $phototext.children();
                return function (swiper) {
                    var index = swiper.activeIndex % length || length;
                    $index.text(index);
                    $texts.eq(index - 1).show().siblings('p').hide();
                    var height = parseInt($wrap.css('height'), 10);
                    $phototext.css({
                        height: height > 150 ? '135px' : 'auto',
                        '-webkit-transition-duration': '0s',
                        'transition-duration': '0s'
                    }).show();
                    setTimeout(function () {
                        $phototext.removeClass('open').css({
                            '-webkit-transition-duration': '1s',
                            'transition-duration': '1s'
                        });
                    }, 500);
                };
            })(),
            onClick: function () {
                $phototext.toggle();
            }
        });
    };
});