define('modules/shop/agentList', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        // 加载更多
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 加载更多
        loadMore({
            url: vars.mainSite + 'shop/?a=ajaxGetAgentList&c=shop&shopid=' + vars.shopid + '&pagesize=' + vars.pagenum
            + '&shoptype=' + vars.shoptype,
            total: vars.total,
            pagesize: vars.pagesize,
            pageNumber: vars.pagenum,
            // 数据加载过来的html字符串容器
            contentID: '.jjrList',
            // 加载更多按钮id
            moreBtnID: '#drag',
            // 加载数据过程显示提示id
            loadPromptID: '#loading',
            firstDragFlag: false
        });
    };
});