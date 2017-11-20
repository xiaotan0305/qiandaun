/**
 * 资讯详情图片页js
 * Created by LXM on 14-12-11.
 * modify by taoxudong@fang.com<2016-6-23>
 */
define('modules/news/detailImgs', ['jquery', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var index = 0;
        var imgStrs = $('#slider img');
        var url = imgStrs.eq(0).attr('src');
        var itemArr = [];
        var slides = [];
        if (imgStrs.length > 0) {
            var pswpElement = document.querySelectorAll('.pswp')[0];

            for (var i = 0, len = imgStrs.length; i < len; i++) {
                var ele = imgStrs[i],
                    $ele = $(ele),
                    thisSrc = $ele.attr('src');
                itemArr = [];
                itemArr = {
                    src: thisSrc,
                    w: ele.naturalWidth || 450,
                    h: ele.naturalHeight || 300
                };
                if (thisSrc === url) {
                    index = i;
                }
                slides.push(itemArr);
            }
            var options = {
                history: false,
                focus: false,
                index: index,
                loop: false,
                escKey: true,
                pinchToClose: false,
                closeOnVerticalDrag: false,
                tapToToggleControls: false,
                addCaptionHTMLFn: (function () {
                    var $count = $('#count');
                    return function (item, captionEl) {
                        var cArr = $count.text().replace(/\s/g, '').split('/');
                        $(captionEl).children().html('<div class="photo-num"><span class="f15">' + cArr[0] + '</span>/' + cArr[1] + '</div>');
                        return true;
                    };
                })()
            };
            var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, slides, options);
            gallery.init();
            gallery.goTo(Number(vars.detailimgid));
        }
    };
});