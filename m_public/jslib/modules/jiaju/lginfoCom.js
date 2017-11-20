/**
 * Modified by LXM on 15.9.17
 */
define('modules/jiaju/lginfoCom',['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        //加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        //惰性加载
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        // 数据请求失败时, 点击刷新
        $('#reload').on('click', function () {
            window.location.reload();
        });

        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxlginfoCom&city=' + vars.city + '&sid='+ vars.sid,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 20,
            // 单页加载条数，可不设置
            pageNumber: 20,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart'
        });


    };
});