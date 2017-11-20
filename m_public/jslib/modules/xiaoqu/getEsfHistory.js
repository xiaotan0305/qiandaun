/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/xiaoqu/getEsfHistory', ['jquery','loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var LoadMore = require('loadMore/1.0.0/loadMore');
        var vars = seajs.data.vars;
        var priceList = $('#priceList');
        // 加载更多
        LoadMore({
            url: vars.xiaoquSite + '?c=xiaoqu&a=ajaxGetEsfHistory&city=' + vars.city + '&newcode=' + vars.newcode,
            total: vars.allcount,
            pagesize: vars.pagesize,
            pageNumber: 10,
            moreBtnID: '.moreList',
            loadPromptID: '#loadTip',
            contentID: '#priceList',
            loadAgoTxt: '加载更多',
            loadingTxt: '<i></i>努力加载中...',
            loadedTxt: '加载更多',
            firstDragFlag: false
        });
        // 点击展开效果
        priceList.on('click','li',function () {
            $(this).toggleClass('unfold');
        });
    };
});