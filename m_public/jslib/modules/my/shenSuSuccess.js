define('modules/my/shenSuSuccess', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        $('.hIcon').click(function () {
            $('.mm-more').toggle();
        });
    };
});