/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/world/worldImgDetail',['jquery','photoswipe/3.0.5/photoswipe'], function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('photoswipe/3.0.5/photoswipe');
        (function (i, h) {
            var g = {
                    allowUserZoom: true,
                    preventHide: true,
                    captionAndToolbarHide: true,
                    loop: false
                }, f = h.attach(i.document.querySelectorAll('#Gallery a'), g);
            f.show(Number($('input#curnumber').val()));
        })(window, window.Code.PhotoSwipe);
    };
});