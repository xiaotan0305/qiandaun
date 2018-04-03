/**
 * fdc--fdc首页
 * @author chenhuan(chenhuan.bj@soufun.com)
 * @modify icy(taoxudong@soufun.com) 2015-12-07
 */
define('modules/fdc/index', ['jquery', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload', 'chart/line/1.0.5/line'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var Swiper = require('swipe/3.10/swiper');
        var Line = require('chart/line/1.0.5/line');
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        (function () {
            // 广告轮播图
            var $ad = $('.banShow');
            var $wrap = $ad.find('.swiper-wrapper');
            var $slides = $ad.find('.swiper-slide');
            var length = $slides.length;
            var $points = $ad.find('.swipe-point').find('li');
            if (length) {
                $wrap.css('width', parseInt($ad.css('width'), 10) * (length + (length < 2 ? 0 : 2)));
                $slides.show();
                Swiper('.banShow', {
                    // 切换速度
                    speed: 500,
                    // 自动切换间隔
                    autoplay: 2000,
                    // 交互后是否自动切换
                    autoplayDisableOnInteraction: false,
                    // 循环
                    loop: true,
                    onSlideChangeStart: function (swiper) {
                        $points.eq((swiper.activeIndex + length - 1) % length).addClass('cur').siblings().removeClass('cur');
                    }
                });
            }
        })();

        /**
         * 绘制图表
         * @param {object} data 图表数据
         */
        (function () {
            // ajax请求图表数据，成功后绘制图表
            $.ajax({
                url: '?c=fdc&a=ajaxGetIndex&index=Bc',
                success: function (data) {
                    if (data && data.length === 6) {
                        new Line({
                            width: $('.main').width(),
                            height: 200,
                            data: [data],
                            lastDataImpt: true,
                            horizontalLineCount: 5,
                            isCurve: true
                        });
                        $('.indexChart').show();
                    }
                }
            });
        })();
    };
});