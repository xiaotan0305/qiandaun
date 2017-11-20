/**
 * @file 优惠券店铺详情页
 * created by muzhaoyang 2017 - 04 - 18
 */
define('modules/jiajuds/shopInfo', ['jquery','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var vars = seajs.data.vars;
        var $body = $('body');
        var jiajuUtils = vars.jiajuUtils;
        var moreDptic = $('.more-dptic');
        var xxDpNav = $('.xxdpNav');
        var navSlider = $('.Tslider');
        var dpFlag = true;
        var total = +vars.total;
        var id = vars.id;
        var page = 2;
        var goodsWidth,videosWidth;
        eventInit();
        function eventInit() {
            // 数据请求失败时, 点击刷新
            $('#dataErr').on('click', function () {
                window.location.reload();
            });
            moreDptic.on('click',function () {
                $('.dp-ticket li').show();
                $(this).hide();
            });
            xxDpNav.on('click','a',function () {
                var self = $(this);
                var index = self.index();
                self.addClass('active').siblings().removeClass('active');
                navSlider.find('div').eq(index).show().siblings().hide();
            });
            navSlider.on('click','.moreList',dpAjaxFn);
            goodsWidth = $('#swiperGoods').width();
            videosWidth = $('#swiperVideos').width();
            //console.log(goodsWidth);
        }
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
                direction: 'horizontal',
                lazyLoading : true
            });
            new Swiper('#swiperGoods', {
                direction: 'horizontal',
                slidesPerView: (goodsWidth - 2*15)/120,
                spaceBetween: 15,
                freeMode: true,
                lazyLoading : true 
            });
            // videosWidth / 160
            new Swiper('#swiperVideos', {
                direction: 'horizontal',
                slidesPerView: 'auto',
                spaceBetween: 0,
                freeMode: true,
                lazyLoading : true 
            });
        });
        function dpAjaxFn() {
            if(dpFlag) {
                $.ajax({
                    url: location.protocol + vars.jiajuSite + '?c=jiajuds&a=ajaxDpqComment&id=' + id + '&page=' + page,
                    type: 'get',
                    async: 'true',
                    success: function (data) {
                        navSlider.find('.sf-bbs-detail ul').append(data);
                        navSlider.find('.lazyload').lazyload();
                    },
                    complete: function () {
                        page ++;
                        if(Math.ceil(total / 3) < page) {
                            dpFlag = false;
                            navSlider.find('.moreList').hide();
                        } else {
                            dpFlag = true;
                        }
                    }
                });
            }
        }
    };
});