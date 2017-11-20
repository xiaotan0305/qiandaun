/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/tuangou/ad', ['jquery', 'swipe/swipe'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var PicNumLoaded = 0;
    module.exports = function () {
        PicNumLoaded++;
        if (PicNumLoaded === 1) {
            $('#position').children().filter(':first').addClass('on');
        }
        if (Number(PicNumLoaded) === Number(vars.count)) {
            setTimeout(function () {
                $('#adurl').slideDown(500);
                var slider = new Swipe(document.getElementById('swipePic'), {
                    startSlide: 0,
                    speed: 500,
                    auto: 3000,
                    continuous: true,
                    callback: function (index) {
                        var selectors = $('#position').children();
                        for (var t = 0; t < selectors.length; t++) {
                            selectors[t].className = selectors[t].className = '';
                        }
                        selectors[index % selectors.length].className = 'on';
                    }
                });
            }, 3000);
        }
    };
});