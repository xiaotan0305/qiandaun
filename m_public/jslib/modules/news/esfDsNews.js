/**
 * 二手房电商资讯app入口
 * Created by lijianlin@fang.com 2016-11-16
 */
define('modules/news/esfDsNews',['jquery','lazyload/1.9.1/lazyload','swipe/3.10/swiper'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        var Swiper = require('swipe/3.10/swiper');
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
            var $lazyload = $this.find('.lazyload');
            $lazyload.lazyload();
            $this.prev().find('.t-change').on('click', function () {
                mySwiper.slideNext();
                $lazyload.trigger('appear');
            });
        });
    };
});
