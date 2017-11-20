/**
 * Created by fang on 2016/04/05.
 */
define('modules/blog/homePage', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 页面传入的参数
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.blogSite + '?c=blog&a=ajaxHomePage&userId=' + vars.userId + '&city=' + vars.city,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.moreList',
            loadPromptID: '.moreList',
            isScroll: true,
            contentID: '.zhyList',
            loadAgoTxt: '<span><i></i>加载更多</span>',
            loadingTxt: '<span><i></i>加载中...</span>',
            loadedTxt: '<span><i></i>加载更多...</span>'
        });
    };
});

