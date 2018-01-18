/**
 * Created by hanxiao on 2017/12/4.
 */
define('modules/bask/hotProblemList', ['jquery', 'loadMore/1.0.2/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 上拉加载更多
        var url = vars.askSite + '?c=bask&a=ajaxGetMoreHotProblem&grouptype' + vars.grouptype;
        var loadMore = require('loadMore/1.0.2/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.loadingask',
            loadPromptID: '.loadingask',
            contentID: '#proList',
            loadAgoTxt: '加载更多',
            loadingTxt: '<i></i>加载中',
            loadedTxt: '',
            firstDragFlag: false
        });
    };
});