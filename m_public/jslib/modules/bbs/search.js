define('modules/bbs/search', ['jquery', 'loadMore/1.0.0/loadMore', 'modules/bbs/bbsbuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户行为对象
        var bbsbuma = require('modules/bbs/bbsbuma');
        // 上拉加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        var q = $('#q').val();
        bbsbuma({type: 1, pageId: 'mbbssearch', key: q});
        loadMore({
            url: vars.bbsSite + '?c=bbs&a=ajaxGetSearch&city=' + vars.city + '&q=' + encodeURIComponent(q),
            total: vars.totalCount,
            pagesize: 15,
            pageNumber: 15,
            moreBtnID: '.moreList',
            loadPromptID: '.moreList',
            contentID: '#bbsList',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            firstDragFlag: false
        });
        $('#bbsList').on('click', '.con', function () {
            var url = $(this).attr('data-url');
            if (url) {
                window.location = url;
            }
        });
    };
});