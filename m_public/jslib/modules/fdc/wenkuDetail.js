/**
 * fdc--地产文库详情页
 * @author lixiaoru(lixiaoru@fang.com)
 */
define('modules/fdc/wenkuDetail', ['jquery', 'swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var Swiper = require('swipe/3.10/swiper');
        require('photoswipe/4.0.7/photoswipe');
        require('photoswipe/4.0.7/photoswipe-ui-default.min');
        var vars = seajs.data.vars;
        // toast
        var toast = (function () {
            var time;
            var delay = 2000;
            return function ($toast, $toastText, msg, delayR) {
                msg && $toastText.text(msg);
                $toast.show();
                time && clearTimeout(time);
                if (delayR >= 0) {
                    time = setTimeout(function () {
                        $toast.hide();
                    }, delayR || delay);
                }
            };
        })();
        // 收藏
        $('.collect').on('click', (function () {
            var canAjax = true;
            var $toast = $('.showMsg');
            var $toastText = $('.showMsgText');
            return function () {
                var $this = $(this);
                if (canAjax && !$this.hasClass('scang')) {
                    canAjax = false;
                    $.ajax({
                        url: vars.fdcSite + '?c=fdc&a=ajaxAddFavorite',
                        data: {
                            type: 'doc',
                            favId: vars.id
                        },
                        success: function (res) {
                            if (res === 'tologn') {
                                location.href = 'https://m.fang.com/passport/login.aspx?burl=' + location.href;
                            } else {
                                res ? $this.addClass('scang').find('span').text('已收藏') : toast($toast, $toastText);
                            }
                        },
                        complete: function () {
                            canAjax = true;
                        }
                    });
                }
            };
        })());
        // 滑动图片弹框隐藏按钮
        $('#picOk').on('click', function () {
            $('#picMask').hide();
        });
        // 下载
        $('.wenKuDownBtn').on('click', function (e) {
            e.preventDefault();
            var jsondata = {
                id: vars.id
            };
            $.get(vars.fdcSite + '?c=fdc&a=ajaxGetUrl', jsondata, function (data) {
                if (data) {
                    location.href = data;
                }
            });
        });

        // 相关文章查看更多
        $('.moreList').on('click', function () {
            // 更多文章显示
            $('.fdcartlist').show();
            // 查看更多按钮删除
            $('.moreList').hide();
        });

        // 顶部图片滑动效果
        Swiper('#slider', {
            speed: 500,
            loop: false,
            onSlideChangeStart: function (swiper) {
                $('#pageIndex').text(swiper.activeIndex + 1);
                if (Number(vars.imgCount) > 30 && Number(swiper.activeIndex + 1) === 30) {
                    $('#picMask').show();
                }
            }
        });
        var $imgs = $('#slider').find('img');
        var pswpElement = $('.pswp')[0];
        var index = 0;
        var slides = [];
        var len = $imgs.length;
        var loadImgLen = len;
        for (var i = 0; i < len; i++) {
            var $img = $imgs.eq(i);
            var img = new Image();
            var src = $img.attr('src');
            img.src = src;
            $(img).on('load', imgLoaded);
            slides.push({
                w: $img[0].naturalWidth,
                h: $img[0].naturalHeight,
                src: src
            });
        }

        function imgLoaded() {
            loadImgLen--;
            if (!loadImgLen) {
                $imgs.on('click', function () {
                    var $this = $(this);
                    index = $this.parent().index();
                    var options = {
                        //  history & focus options are disabled on CodePen
                        history: false,
                        focus: false,
                        index: index,
                        escKey: true
                    };
                    var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, slides, options);
                    gallery.init();
                });
            }
        }
    };
});
