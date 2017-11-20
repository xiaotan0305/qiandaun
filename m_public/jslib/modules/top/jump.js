/**
 * Created by zdl on 2016/8/29.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/jump', ['jquery'], function (require) {
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
                window.location = vars.topSite + 'xf-' + vars.city + '/';
            }
        }, 1000);
    };
});