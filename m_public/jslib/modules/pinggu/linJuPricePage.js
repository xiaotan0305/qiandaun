/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/linJuPricePage', ['loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var LoadMore = require('loadMore/1.0.0/loadMore');
        var vars = seajs.data.vars;
        LoadMore({
            url: vars.pingguSite + '?c=pinggu&a=ajaxGetLinJuPrice&city=' + vars.city + '&newcode=' + vars.newcode,
            total: vars.total,
            pagesize: vars.pagesize,
            pageNumber: 20,
            page: 'p',
            moreBtnID: '.moreList',
            loadPromptID: '#loadTip',
            contentID: '#more_add',
            loadAgoTxt: '加载更多',
            loadingTxt: '<i></i>努力加载中...',
            loadedTxt: '加载更多',
            firstDragFlag: false
        });
        // 用户行为布码
        require.async('jsub/_vb.js?c=mcfjneighbor ');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
            _ub.biz = 'v';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // b值 0：浏览
            var b = 0;

            var pTemp = {
                'vmg.page': 'mcfjneighbor',
                'vmv.projectid': vars.newcode
            };

            var p = {};
            for (var temp in pTemp) {
                if (pTemp[temp] && pTemp[temp] !== 'undefined') {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b, p);
        });
    };
});