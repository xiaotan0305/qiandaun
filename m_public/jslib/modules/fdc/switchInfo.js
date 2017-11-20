/*
 * @file fdc底部换一换
 * @author icy<taoxudong@fang.com> 20161122
 */
define('modules/fdc/switchInfo', ['jquery', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var Swiper = require('swipe/3.10/swiper');
    require('lazyload/1.9.1/lazyload');
    // 图表轮播
    var $dataSwiper = $('.dataSwiper');
    $dataSwiper.find('.tit').hide();
    $.each($dataSwiper, function () {
        var $this = $(this);
        var $container = $this.find('.swiper-container');
        var width = $container.width();
        var length = $this.find('.swiper-slide').length;
        $this.find('.swiper-wrapper').css('width', width * (length + 2));
        var $points = $this.find('.point-switch').find('span');
        var $pointNum = $this.find('.point');
        new Swiper($container[0], {
            // 切换速度
            speed: 500,
            // 自动切换间隔
            autoplay: 5000,
            // 交互后是否自动切换
            loop: true,
            autoplayDisableOnInteraction: false,
            onSlideChangeStart: function (swiper) {
                var index = (length + swiper.activeIndex - 1) % length;
                $points.removeClass('cur').eq(index).addClass('cur');
                $pointNum.text(index + 1);
            }
        });
    });
    // 锤子渲染bug
    $dataSwiper.find('.tit').show();
    // 换一换
    var $changeSwiper = $('.changeSwiper');
    $.each($changeSwiper, function () {
        var $this = $(this);
        var width = $this.width();
        var length = $this.find('.swiper-slide').length;
        $this.find('.swiper-wrapper').css('width', width * (length + 2));
        var mySwiper = new Swiper(this, {
            // 切换速度
            speed: 300,
            // 交互后是否自动切换
            loop: true
        });
        var $lazyload = $this.find('.changeLazyload');
        $lazyload.lazyload();
        $this.prev().find('.t-change').on('click', function () {
            $this.find('li').show();
            mySwiper.slideNext();
            $lazyload.trigger('appear');
        });
    });
});
