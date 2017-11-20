/**
 * 计算器404页面js
 * by limengyang.bj@fang.com 2016-06-07
 */
define('modules/tools/jump',['jquery'],function (require) {
    'use strict';
    return function () {
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
                window.location = vars.toolsSite;
            }
        }, 1000);
    };
});
