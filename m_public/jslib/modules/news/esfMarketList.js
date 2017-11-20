/**
 * 二手房导购市场资讯列表
 * Created by lijianlin@fang.com 2016-11-16
 */
define('modules/news/esfMarketList',['jquery','lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var lazyload = require('lazyload/1.9.1/lazyload');
        var loadMore = require('loadMore/1.0.0/loadMore');
        var url = vars.newsSite + '?c=news&a=ajaxEsfMarketList&city=' + vars.city + '&pageSize=10';
        // 加载更多
        loadMore({
            url: url,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 30,
            // 单页加载条数
            pageNumber: 10,
            // 加载更多按钮id
            moreBtnID: '.moreList',
            // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
            firstDragFlag: false,
            // 加载数据过程显示提示id
            loadPromptID: '.moreList',
            // 数据加载过来的html字符串容器
            contentID: '.moreMarket',
            // 加载前显示内容
            loadAgoTxt: '<a>点击加载更多</a>',
            // 加载中显示内容
            loadingTxt: '<span><i></i>努力加载中...</span>',
            // 加载完成后显示内容
            loadedTxt: '<a>点击加载更多</a>'
        });
        // 图片惰性加载
        lazyload('img[data-original]').lazyload();
    };
});
