/**
 * Modified by LXM 2015-9-15
 */
define('modules/jiaju/xgtList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'modules/jiaju/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var preload = [];
        var style = $('#style');
        var type = $('#type');
        var word = $('#word');
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });

        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMorePic&sortid=' + vars.sortid + '&RoomType=' + vars.RoomType + '&CaseStyle=' + vars.CaseStyle + '&Word=' + vars.word + '&q=' + vars.q + '&newtitle=' + vars.newtitle,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 19,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart'
        });
        
        require.async(['footprint/1.0.0/footprint'], function (run) {
            run.push('装修美图', vars.siteUrl + vars.city + '/xgt.html', vars.city);
        });

        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapzxxgt_', '');
            });
        });

        // 搜索用户行为收集20160114
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'jj_mt^xgtlb_wap',
            type: 1,
            roomtype: $('#type').text().trim(),
            style: $('#style').text().trim(),
            part: $('#word').text().trim(),
            key: $('#searchtext').text().trim()
        });
    };
});
