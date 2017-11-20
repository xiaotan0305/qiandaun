define('modules/shop/jump',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var numDom, num, intervalTimer;
        numDom = $('#nofound');
        num = parseInt(numDom.text());
        setInterval(function () {
            num--;
            numDom.text(num);
            if (num <= 0) {
                num = 1;
                window.location = vars.mainSite;
            }
        }, 1000);
    };
});