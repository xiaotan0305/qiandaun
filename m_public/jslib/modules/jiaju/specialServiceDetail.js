/**
 * @file 品牌馆-新版商铺详情
 */
 define('modules/jiaju/specialServiceDetail', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/jiaju/yhxw', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var  win = window;
        var comImg = $('#sjztEx');
        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'mjjspecialservicedetail',
            companyid: vars.companyid
        });

        require.async('swipe/3.10/swiper', function (Swiper) {
            new Swiper('#sjztEx', {
                direction: 'horizontal',
                slidesPerView: 'auto',
                spaceBetween: 0,
                freeMode: true,
                lazyLoading: true,
                watchSlidesProgress: true,
                watchSlidesVisibility: true
            });
            new Swiper('#sjsbEx', {
                direction: 'horizontal',
                slidesPerView: 'auto',
                spaceBetween: 0,
                freeMode: true,
                lazyLoading: true,
                watchSlidesProgress: true,
                watchSlidesVisibility: true
            });
        });

         // 点击帖子内容图片，图片放大功能
         comImg.on('click', 'img', function () {
            var url = $(this).attr('original');
            var slides = [];
            var index = 0;
            var allImg = comImg.find('img');
                // 点击缩放大图浏览
                if (allImg.length > 0) {
                    var pswpElement = $('.pswp')[0];
                    for (var i = 0, len = allImg.length; i < len; i++) {
                        var ele = allImg[i],
                        src = $(ele).attr('original');
                        if (src === url) {
                            index = i;
                        }
                        slides.push({
                            src: src,
                            w: 640,
                            h: 480
                        });
                    }
                    var options = {
                        history: false,
                        focus: false,
                        index: index,
                        escKey: true
                    };
                    var gallery = new win.PhotoSwipe(pswpElement, win.PhotoSwipeUI_Default, slides, options);
                    gallery.init();
                }
            });
     };
 });