/**
 * Created by LXM on 2015/9/18.
 */
define('modules/jiaju/zxOver', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        $('#confirm').on('click', function () {
            window.history.go(-2);
        });
        // 用户行为收集20151012
        require.async('jsub/_ubm.js?v=201407181100',function (){
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = 0;
            var b = 20;
            var p = {
                mp3: 'h'
            };
            // 例如_ub.collect(0,{'mhi':' 123456','mh4':'2^4','mh2':'现代简约'})
            _ub.collect(b,p);
        });
    };
});