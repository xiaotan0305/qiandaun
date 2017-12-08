define('modules/ask/getListByTag', ['jquery','loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 上拉加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxGetMoreListByTag&tagname=' + vars.tagname,
            total: vars.allcount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#drag',
            loadPromptID: '#dragmore',
            contentID: '.answerlist',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            firstDragFlag: false
        });
    };
});