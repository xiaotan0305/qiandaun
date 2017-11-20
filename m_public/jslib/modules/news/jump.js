define('modules/news/jump', ['jquery'], function (require) {
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
                window.location = vars.mainSite + 'news/' + vars.city + '.html';
            }
        }, 1000);
    };
});