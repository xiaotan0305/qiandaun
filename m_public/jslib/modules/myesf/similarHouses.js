define('modules/myesf/similarHouses', ['jquery','lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

		/* 图片惰性加载*/
        require.async('lazyload/1.9.1/lazyload',function () {
            $('img[data-original]').lazyload();
        });
		// 首页加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.mySite + '?c=myesf&a=ajaxSimilarHouses' + '&city=' + vars.city + '&type=' + vars.type + '&room=' + vars.room
            + '&ProjCode=' + vars.ProjCode,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.moreList',
            loadPromptID: '.draginner',
            contentID: '#houseList',
            loadAgoTxt: '<i></i>上拉加载更多',
            loadingTxt: '<i></i>加载中...',
            firstDragFlag: false
        });
    };
});