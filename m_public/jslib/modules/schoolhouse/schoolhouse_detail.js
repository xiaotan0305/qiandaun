define('modules/schoolhouse/schoolhouse_detail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // var vars = seajs.data.vars;
        $(function () {
            $('#disMore1').on('click', function () {
                $('#lessContent1').attr('style', 'display:none');
                $('#moreContent1').attr('style', 'display:block');
            });
            $('#disLess1').on('click', function () {
                $('#moreContent1').attr('style', 'display:none');
                $('#lessContent1').attr('style', 'display:block');
            });
            $('#disMore2').on('click', function () {
                $('#lessContent2').attr('style', 'display:none');
                $('#moreContent2').attr('style', 'display:block');
            });
            $('#disLess2').on('click', function () {
                $('#moreContent2').attr('style', 'display:none');
                $('#lessContent2').attr('style', 'display:block');
            });
        });
    };
});