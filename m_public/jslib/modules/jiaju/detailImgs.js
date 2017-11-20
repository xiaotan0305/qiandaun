/**
 * Created by kangkai on 15-6-4.
 * modified by LXM on 15-9-22.
 */
define('modules/jiaju/detailImgs', ['jquery','photoswipe/3.0.5/photoswipe'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        require('photoswipe/3.0.5/photoswipe');
        var strurl = window.location.search;
        (function (window, PhotoSwipe) {
            var options = {
                allowUserZoom: true,
                imageScaleMethod: 'fitNoUpscale',
                newsImg: true,
                loop: false
            };
            var instance = PhotoSwipe.attach(window.document.querySelectorAll('#Gallery a'), options);
            instance.show(Number(vars.detailimgid));
        })(window, window.Code.PhotoSwipe);

        $(document).ready(function () {
            if (strurl.indexOf('?') !== -1) {
                if (strurl.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                }
            }
        });
    };
});