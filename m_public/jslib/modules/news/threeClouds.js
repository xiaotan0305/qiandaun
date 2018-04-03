/**
 * 三朵云合作列表页
 * Created by limengyang.bj@fang.com 2018-2-27
 */
define('modules/news/threeClouds', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.2/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        // 图片惰性加载
        var lazyLoad = require('lazyload/1.9.1/lazyload');
        lazyLoad('img[data-original]').lazyload();
        // ajax加载更多
        if (vars.totalCount > 20) {
            var loadMore = require('loadMore/1.0.2/loadMore');
            loadMore({
                url: vars.newsSite + '?c=news&a=ajaxThreeClouds&city=' + vars.city + '&src=' + vars.src,
                // 数据总条数
                total: vars.totalCount,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数
                pageNumber: 10,
                // 加载更多按钮id
                moreBtnID: '#drag',
                // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                firstDragFlag: false,
                // 加载数据过程显示提示id
                loadPromptID: '#draginner',
                // 数据加载过来的html字符串容器
                contentID: '.news_list',
                // 加载前显示内容
                loadAgoTxt: ' ',
                // 加载中显示内容
                loadingTxt: '<p class="loading_text">努力加载中...</p>',
                // 加载完成后显示内容
                loadedTxt: ' '
            });
        }
    };
});