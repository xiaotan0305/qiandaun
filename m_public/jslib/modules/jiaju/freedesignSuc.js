/**
 * Created by Young on 15-10-20.
 */
define('modules/jiaju/freedesignSuc',['jquery'],
    function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // var util = require('util');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        function yhxw(type) {
            _ub.city = vars.cityname;
            // 业务---h代表家居
            _ub.biz = 'h';
            // 家居不分南北方，都传0
            _ub.location = 0;
            // 用户动作（浏览0、打电话31、在线咨询24）
            var b = type;
            var p = {mh7: vars.designerid};
            // 收集方法
            _ub.collect(b, p);
        }
        // 用户行为统计
        require.async('jsub/_ubm.js?v=201407181100', function () {
            yhxw(17);
        });

        $('.btnBox').click(function () {
            window.history.go(-2);
        });
    };
});