define('modules/my/getBonusByType', ['jquery', 'modules/my/yhxw'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        var vars = seajs.data.vars;
        var city = vars.city;
        var pageUrl = '';
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('name')] = element.value;
        });
        
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/my/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mucmymoneyhbgl';
        // 埋码变量数组
        if (vars.type === '0') {
            var detailtype = '未使用';
        } else if (vars.type === '1') {
            var detailtype = '已使用';
        } else {
            var detailtype = '已过期';
        }
        var maiMaParams = {
            'vmg.page': pageId,
            'vmg.detailtype': encodeURIComponent(detailtype)
        };
        yhxw({type: 0, pageId: pageId, params: maiMaParams});
        
        function resulttoggle(id) {
            var Type = id;
            window.location = '?c=my&a=getBonusByType&type=' + Type + '&city=' + city + '&r=' + Math.random();
        }
        // 分页
        if ($('#drag')) {
            var type = vars.type;
            var count = vars.count;
            pageUrl = '?c=my&a=ajaxgetBonusByType&type=' + type + '&city=' + city;
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
        $('#type0').on('click', function () {
            resulttoggle(0);
        });
        $('#type2').on('click', function () {
            resulttoggle(2);
        });
        $('#type1').on('click', function () {
            resulttoggle(1);
        });
    };
});