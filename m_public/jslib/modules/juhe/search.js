define('modules/juhe/search', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.juheSite + '?c=juhe&a=ajaxGetMoreSearch&q=' + vars.q,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#loadMore',
            loadPromptID: '#loadMore',
            contentID: '.jh-list',
            loadAgoTxt: '<span><i></i>努力加载中...</span>',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            loadedTxt: '<span><i></i>努力加载中...</span>',
            lazyCon: '.img[data-original]',
            firstDragFlag: false
        });
    };
});