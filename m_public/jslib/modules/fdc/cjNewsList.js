/**
 * fdc--成交资讯列表页
 * @author limengyang.bj@fang.com 2016-9-26
 */
define('modules/fdc/cjNewsList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
        $('.lazyload').lazyload();
        // 加载更多
        if (vars.count > 20) {
            var loadMore = require('loadMore/1.0.0/loadMore');
            loadMore({
                url: vars.fdcSite + '?c=fdc&a=ajaxGetTuDiNews&newsType=' + vars.newsType,
                // 数据总条数
                total: vars.count,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数
                pageNumber: 20,
                // 加载更多按钮id
                moreBtnID: '.moreList',
                // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                firstDragFlag: false,
                // 加载数据过程显示提示id
                loadPromptID: '.moreList',
                // 数据加载过来的html字符串容器
                contentID: 'ul',
                // 加载前显示内容
                loadAgoTxt: '<a>上拉加载更多</a>',
                // 加载中显示内容
                loadingTxt: '<span><i></i>努力加载中...</span>',
                // 加载完成后显示内容
                loadedTxt: '<a>上拉加载更多</a>'
            });
        }
    };
});