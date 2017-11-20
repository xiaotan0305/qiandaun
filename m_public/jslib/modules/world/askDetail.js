/**
 * Created by liuying on 16-05-05.
 */
define('modules/world/askDetail', ['jquery', 'modules/world/yhxw', 'loadMore/1.0.0/loadMore', 'photoswipe/4.0.7/photoswipe',
    'photoswipe/4.0.7/photoswipe-ui-default.min', 'lazyload/1.9.1/lazyload'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');

        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        // 点击问答内容图片，图片放大功能
        var $conImg = $('.ask');
        var $imgs = $conImg.find('img');
        $imgs.each(function () {
            $(this).parent().removeAttr('href');
        });
        $conImg.on('click', 'img', function () {
            var url = $(this).attr('original');
            var slides = [];
            var index = 0;
            var allImg = $conImg.find('img');
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
                        w: ele.naturalWidth,
                        h: ele.naturalHeight
                    });
                }
                var options = {
                    history: false,
                    focus: false,
                    index: index,
                    escKey: true
                };
                var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, slides, options);
                gallery.init();
            }
        });
    };
});