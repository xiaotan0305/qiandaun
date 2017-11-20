define('modules/fdc/searchResult', ['loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('img[data-original]').lazyload();
        // 加载更多功能
        var loadMore = require('loadMore/1.0.0/loadMore');
        var totalcount = vars.totalcount,
            pageUrl = vars.fdcSite + '?c=fdc&a=ajaxSearchResult&type=' + vars.type + '&keyword=' + vars.keyword;
        loadMore({
            // 数据总条数
            total: totalcount,
            // 首屏显示数据条数
            pagesize: 10,
            // 单页加载条数
            pageNumber: 10,
            // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
            firstDragFlag: false,
            // 加载更多按钮id
            moreBtnID: '#drag',
            // 是否需要上拉加载更多功能即是否需要scroll事件监听，可为空，默认为true
            isScroll: true,
            // 加载数据过程显示提示id
            loadPromptID: '#loadmore',
            // 数据加载过来的html字符串容器
            contentID: '#searchList',
            // 加载前显示内容
            loadAgoTxt: '查看更多',
            // 加载中显示内容
            loadingTxt: '努力加载中...',
            // 加载完成后显示内容
            loadedTxt: '查看更多',
            // 接口地址
            url: pageUrl
        });
    };
});