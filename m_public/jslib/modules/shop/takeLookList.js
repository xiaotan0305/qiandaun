define('modules/shop/takeLookList', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 加载更多
        loadMore({
            url: vars.mainSite + 'shop/index.php?c=shop&a=ajaxTakeLookList&shopid=' + vars.shopid + '&pagesize='
            + vars.stepByNum + '&shoptype=' + vars.shoptype,
            total: vars.allCount,
            pagesize: vars.firstPgNum,
            pageNumber: vars.stepByNum,
            moreBtnID: '#drag',
            loadPromptID: '.draginner',
            contentID: '.jjrtimeline',
            loadAgoTxt: '点击加载更多',
            loadingTxt: '正在加载...',
            loadedTxt: '点击加载更多',
            firstDragFlag: false
        });
    };
});