define('modules/my/getOutcomeList', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        var vars = seajs.data.vars;
        var city = vars.city;
        var pageUrl = '';
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('name')] = element.value;
        });

        function resulttoggle(id) {
            if (id === 2) {
                window.location = '?c=my&a=getIncomeList&actionid=' + id + '&city=' + city + '&r=' + Math.random();
            } else if (id === 3) {
                window.location = '?c=my&a=getOutcomeList&actionid=' + id + '&city=' + city + '&r=' + Math.random();
            }
        }
        // 分页
        if ($('#drag')) {
            var actionid = vars.actionid,count;
            if (Number(actionid) === 2) {
                count = vars.getIncomeListCount;
                pageUrl = '?c=my&a=ajaxgetIncomeList&actionid=' + actionid + '&city=' + city;
            } else if (Number(actionid) === 3) {
                count = vars.getOutcomeListCount;
                pageUrl = '?c=my&a=ajaxgetOutcomeList&actionid=' + actionid + '&city=' + city;
            }
            require.async('modules/my/pagination', function () {
                $('#drag').pagination({
                    pagesize: 10,
                    curp: 2,
                    totalcount: count,
                    w: $(window),
                    target: $('.graybox_ul01'),
                    pageUrl: pageUrl
                });
            });
        }
        $('#in').on('click', function () {
            resulttoggle(2);
        });
        $('#out').on('click', function () {
            resulttoggle(3);
        });
    };
});