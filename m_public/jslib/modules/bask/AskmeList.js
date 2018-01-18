/**
 * Created by hanxiao on 2017/12/5.
 */
define('modules/bask/AskmeList', ['jquery', 'loadMore/1.0.2/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 上拉加载更多
        var url = vars.askSite + '?c=bask&a=ajaxGetAskMeList&source' + vars.source;
        var loadMore = require('loadMore/1.0.2/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '.loadingask',
            loadPromptID: '.loadingask',
            contentID: '#quizlist',
            loadAgoTxt: '加载更多',
            loadingTxt: '<i></i>加载中',
            loadedTxt: '没有更多了',
            firstDragFlag: false
        });
    };
});