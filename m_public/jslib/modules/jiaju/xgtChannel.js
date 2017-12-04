/**
 * @file 效果图列表:悬浮
 * @author 徐颖(bjxuying@soufun.com)
 * @modified by 袁辉辉(yuanhuihui@soufun.com)
 */
 define('modules/jiaju/xgtChannel', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'footprint/1.0.0/footprint'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;      
        require('footprint/1.0.0/footprint');

        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        var loadMore = require('loadMore/1.0.0/loadMore');

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreChannelPic&channelId=' + vars.channelId + '&limit=' + vars.pagesize,
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

        // 流量统计部署click
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function (e) {
                window.Clickstat.batchEvent('wapjiajuchannel_', '');
            });
        });
    };
});