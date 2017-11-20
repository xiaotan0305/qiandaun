/**
 * fdc--页面容错跳转处理
 * @author lijianin@fang.com on 2016/8/17
 * @modify circle(yuanhuihui@fang.com) 2016年08月26日13:52:29
 */
define('modules/fdc/jump', ['jquery'], function (require) {
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
                window.location = vars.mainSite + 'industry/';
            }
        }, 1000);
    };
});
