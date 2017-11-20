/**
 * @file 优惠券商品详情
 * created by muzhaoyang 2017 - 04 - 20
 */
define('modules/jiajuds/goodsInfo', ['jquery','lazyload/1.9.1/lazyload'], function(require, exports, module) {
    'use strict';
    module.exports = function() {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        require.async('swipe/3.10/swiper', function (Swiper) {
            new Swiper('#swiper', {
                // 切换速度
                speed: 500,
                // 自动切换间隔
                autoplay: 3000,
                // 循环
                loop: true,
                autoplayDisableOnInteraction: false,
                direction: 'horizontal',
                lazyLoading : true
            });
        });   
    }
});