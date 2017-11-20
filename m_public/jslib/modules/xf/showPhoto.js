/**
 * 点击小图变大图
 * by WeiRF
 * 20151204 WeiRF
 * 使用说明：调用openPhotoSwipe();
 * 参数：
 * 1.$images：小图变大图的图片标签
 * 2.imgindex：从第几张显示
 */
define('modules/xf/showPhoto',
    ['jquery','photoswipe/4.0.8/photoswipe', 'photoswipe/4.0.8/photoswipe-ui-default'],
    function (require, exports, module) {
        'use strict';
        var $ = require('jquery');
        function showPhoto() {
            this.gallery = '';

        }
        showPhoto.prototype = {
            slides: [],
            ratioX: document.documentElement.clientWidth,
            ratioY: document.documentElement.clientHeight * 2 / 3,
            option: function ($images) {
                var that = this;
                // 初始化将slides清空
                that.slides = [];
                if ($images.length > 0) {
                    $images.each(function () {
                        var width = $(this).width();
                        var height = $(this).height();
                        var resultWH = that.opImgWH(width, height);
                        var itemArr = {src: $(this).attr('src'), w: resultWH.width, h: resultWH.height};
                        that.slides.push(itemArr);
                    });
                }
            },
             // 配置合适的宽高
            opImgWH: function (width, height) {
                var that = this;
                width = width || 400;
                height = height || 300;
                if (isNaN(height)) {
                    height = width / 4 * 3;
                }
                var ratio = 1;
                if (width <= that.ratioX && height <= that.ratioY) {
                    ratio = that.ratioX / width;
                    width = that.ratioX;
                    height *= ratio;
                } else if (width > that.ratioX && height <= that.ratioY) {
                    ratio = that.ratioX / width;
                    width = that.ratioX;
                    height *= ratio;
                } else {
                    ratio = that.ratioY / height;
                    height = that.ratioY;
                    width *= ratio;
                }
                return {width: width, height: height};
            },
            openPhotoSwipe: function ($images,imgindex) {
                var that = this;
                that.option($images);
                imgindex = parseInt(imgindex) || 0;
                var pswpElement = document.querySelectorAll('.pswp')[0];
                var options = {
                    history: false,
                    focus: false,
                    index: imgindex,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                };
                this.gallery = new PhotoSwipe(pswpElement,PhotoSwipeUI_Default, that.slides, options);
                this.gallery.init();
            }
        };

        // 一次click事件的封装
        var startX, startY, endX, endY,
            html = '<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"> <div class="pswp__bg"></div> <div class="pswp__scroll-wrap"> <div class="pswp__container" style="transform: translate3d(0px, 0px, 0px);"> <div class="pswp__item" style="display: block; transform: translate3d(-420px, 0px, 0px);"></div> <div class="pswp__item" style="transform: translate3d(0px, 0px, 0px);"><div class="pswp__zoom-wrap" style="transform: translate3d(21px, 111px, 0px) scale(1);"><div class="pswp__img pswp__img--placeholder pswp__img--placeholder--blank" style="width: 333.739px; height: 444.667px;"></div><img class="pswp__img" src="http://img1.soufun.com/agents1/2016_03/22/12/wap/newcertificate/1458620032448_000.jpg" style="display: block; backface-visibility: hidden; opacity: 1; width: 333.739px; height: 444.667px;"></div></div> <div class="pswp__item" style="display: block; transform: translate3d(420px, 0px, 0px);"></div> </div> <div class="pswp__ui pswp__ui--one-slide pswp__ui--hidden"> <div class="pswp__top-bar"> <div class="pswp__counter">1 / 1</div> <button class="pswp__button pswp__button--close" title="Close (Esc)"></button> <div class="pswp__preloader"> <div class="pswp__preloader__icn"> <div class="pswp__preloader__cut"> <div class="pswp__preloader__donut"></div> </div> </div> </div> </div> <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"> <div class="pswp__share-tooltip"></div> </div> <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"> </button> <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"> </button> <div class="pswp__caption"> <div class="pswp__caption__center"></div> </div> </div> </div> </div>';
        var oneClick = function () {
            $(window).on('touchstart', function (e) {
                var touch = e.originalEvent.targetTouches[0];
                startX = touch.pageX;
                startY= touch.pageY;
            });
            $(window).on('touchend', function (e) {
                var touch = e.originalEvent.changedTouches[0];
                endX = touch.pageX;
                endY = touch.pageY;
                if (Math.abs(endX - startX) < 2 && Math.abs(endY - startY) < 2 && $('.pswp').hasClass('pswp--supports-fs')) {
                    $('.pswp').prev().after(html);
                    $('.pswp--supports-fs').remove();
                }
            })
        };
        oneClick();

        module.exports = new showPhoto;
    });
