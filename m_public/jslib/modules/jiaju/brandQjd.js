/**
 * modified by zdl on 15.9.16
 */
define('modules/jiaju/brandQjd', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 图片lazyload
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        // 城市 排序
        var $dd = $('dd');
        vars.tid && $dd.filter('[data-id=' + vars.tid + ']').addClass('active');
        vars.sort && $dd.filter('[data-id=' + vars.sort + ']').addClass('active');
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxbrandQjd&bid=' + vars.bid + '&fid='
            + vars.fid + '&cid=' + vars.cid + '&tid=' + vars.tid + '&sort=' + vars.sort + '&city=' + vars.encity + '&r=' + Math.random(),
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 20,
            // 单页加载条数，可不设置
            pageNumber: 20,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#content'
        });
    };
});
