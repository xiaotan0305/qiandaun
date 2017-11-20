/**
 * Created by xuying2016年3月1日14:00:18
 */
define('modules/jiajuds/hotActivityList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: vars.url,
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
            contentID: '#loadstart',
            // 第一次下拉不加载，false第一下拉加载
            firstDragFlag: false
        });
    };
});
