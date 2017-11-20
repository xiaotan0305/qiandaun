/**
 * Created by fang on 2016/04/05.
 */
define('modules/blog/index', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.blogSite + '?c=blog&a=ajaxIndex&city=' + vars.city,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.moreList',
            loadPromptID: '.moreList',
            isScroll: true,
            contentID: '.blogList',
            loadAgoTxt: '<span><i></i>加载更多</span>',
            loadingTxt: '<span><i></i>加载中...</span>',
            loadedTxt: '<span><i></i>加载更多...</span>'
        });
    };
});

