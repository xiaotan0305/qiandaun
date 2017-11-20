/**
 * Created by LXM on 15-3-16.
 * 单量更改于2015-9-9
 */
define('modules/jiaju/zxbj', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var contFlexbox = $('#contFlexbox');
        var contDisplay = contFlexbox.css('display');
        var loadMore = require('loadMore/1.0.0/loadMore');
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetCaseList&CaseStyle=' + vars.CaseStyle + '&CaseRoom=' + vars.CaseRoom + '&Area=' + vars.Area + '&Price=' + vars.Price + '&cityID=' + vars.cityID + '&q=' + vars.q,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: vars.pagesize,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart'
        });
                               

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapzxbj_', '');
            });
        });

        // 搜索用户行为收集20160114
        var page = 'mjjvolumelist';
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            // 所在城市（中文）;
            _ub.biz = 'h';
            _ub.location = vars.ns || 0;
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0

            var b = 1;
            var caseRoom = $.trim($('#room span').text());
            var caseStyle = $.trim($('#style span').text());
            var caseArea = $.trim($('#area span').text());
            var casePrice = vars.m_4.replace(/\^0?/, function (result) {
                if (result === '^') {
                    return '-';
                }
                return '-99999';
            });
            if (caseRoom === '户型') {
                caseRoom = '';
            }
            if (caseStyle === '风格') {
                caseStyle = '';
            }
            if (caseArea === '建筑面积') {
                caseArea = '';
            }

            var pTemp = {
                'vmh.key': encodeURIComponent(vars.q),
                'vmg.page': page,
                'vmh.housetype': encodeURIComponent(caseRoom),
                'vmh.style': encodeURIComponent(caseStyle),
                'vmh.area': encodeURIComponent(caseArea),
                'vmh.totalprice': encodeURIComponent(casePrice)
            };
            var p = {};
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b, p);
        });
        // end 搜索用户行为收集20160114
        
    };
});