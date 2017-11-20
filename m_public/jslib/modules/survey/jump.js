/**
 * @file 错误页面3秒钟跳转回首页
 * @author 赵天亮(zhaotianliang@fang.com)
 */
define('modules/survey/jump',['jquery'],function (require) {
    'use strict';
    (function () {
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
    })();
});