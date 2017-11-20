define('modules/zhishi/commonList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.zhishiSite + '?c=zhishi&a=ajaxCommonList&city=' + vars.city + '&jtname=' + vars.jtname + '&type=' + vars.type,
            total: vars.count,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.more-list',
            loadPromptID: '.more-list',
            contentID: '#know-list',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '正在加载...'
            // firstDragFlag: false
        });
    };
});