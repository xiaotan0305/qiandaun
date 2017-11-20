define('modules/ask/jump',['jquery'],function (require) {
    'use strict';
    return function () {
        var $ = require('jquery');
        var numDom, num, intervalTimer;
        numDom = $('#nofound');
        num = parseInt(numDom.text());
        setInterval(function () {
            num--;
            numDom.text(num);
            if (num <= 0) {
                num = 1;
                window.location = $('a.s-btn-r').attr('href');
            }
        }, 1000);
    };
});