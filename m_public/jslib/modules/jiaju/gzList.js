/**
 * Created by Young on 2015-8-13.
 */
define('modules/jiaju/gzList', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/jiaju/loadnewmore'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            // 加载更多
            var loadnewmore = require('modules/jiaju/loadnewmore');
            loadnewmore({
                a: 'jiaju',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreGz&city=' + vars.city + '&workAge=' + vars.workAge + '&serviceRange=' + vars.serviceRange + '&all=' + vars.all
            });
            //惰性加载
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload();
            // 数据请求失败时, 点击刷新
            $('#notfound').on('click', function () {
                window.location.reload();
            });
            // 搜索用户行为收集20160114
            var page = 'mjjforemanlist';
            var $city = $('#city');
            var $age = $('#age');
            var $service = $('#service');
            require.async('jsub/_vb.js?c=' + page);
            require.async('jsub/_ubm.js', function () {
                _ub.city = $city.text();
                _ub.biz = 'h';
                _ub.location = 0;
                var b = 1;
                var ubAge = $age.text() === '工龄' ? '' : $age.text();
                var service = $service.text() === '服务' ? '' : $service.text();
                var pTemp = {
                    'vmh.city': encodeURIComponent($city.text()),
                    'vmg.page': page,
                    'vmh.workage': encodeURIComponent(ubAge),
                    'vmh.service': encodeURIComponent(service)
                };
                var p = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp in pTemp) {
                    if (pTemp[temp]) {
                        p[temp] = pTemp[temp];
                    }
                }
                _ub.collect(b, p);
            });
        };
    });