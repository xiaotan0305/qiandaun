/**
 * Created on 2018/3/26.
 */
define('modules/ask/jiajuExpertList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxJiajuExpertList',
            total: vars.total,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '#moreList',
            loadPromptID: '#moreList',
            contentID: '#content',
            loadAgoTxt: '查看更多',
            loadingTxt: '加载中...',
            firstDragFlag: true
        });
    };
});