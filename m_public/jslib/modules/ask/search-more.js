/**
 * 问答搜索结果页
 * 问答搜索页主类
 * by blue
 * 20150924 整理代码，优化代码，提高代码效率，替换原有的滑动搜索框固定写法
 * modified zdl 20160111
 */
define('modules/ask/search-more', ['jquery', 'loadMore/1.0.0/loadMore', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        /* 惰性加载*/
        var lazyLoad = $('.lazyload');
        if (lazyLoad.length) {
            require.async('lazyload/1.9.1/lazyload');
            lazyLoad.lazyload();
        }
        // 获取搜索框容器实例
        var $searchCon = $('.search');
        // 搜索结果页请求加载更多的url
        var reqUrl = vars.askSite + '?c=ask&a=ajaxGetSearch&city=' + vars.city;
        var asktitle = vars.asktitle;
        var cid = vars.cid;
        if (asktitle) {
            reqUrl += '&asktitle=' + encodeURIComponent(asktitle);
        }
        if (cid) {
            reqUrl += '&cid=' + cid;
        }
        // 上拉加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: reqUrl,
            total: vars.allcount,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '#drag',
            loadPromptID: '.draginner',
            contentID: '.searchList',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            firstDragFlag: false
        });

        // 滑动页面，将搜索框固定到顶部
        // 搜索框距离顶部的距离
        var fixTop = $searchCon.offset().top;
        $(window).on('scroll', function () {
            if ($(document).scrollTop() > fixTop) {
                $searchCon.addClass('search-b');
            } else {
                $searchCon.removeClass('search-b');
            }
        });

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'masearch'});
    };
});