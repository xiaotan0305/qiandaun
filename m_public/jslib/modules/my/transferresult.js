define('modules/my/transferresult', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        $('.hIcon').click(function () {
            $('.mm-more').toggle();
        });
    };
});