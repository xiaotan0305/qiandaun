/**
 * 买房必读
 * by blue
 * 20151218
 */
define('modules/zhishi/fangRead', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 加载更多方法对象
        var loadMore = require('loadMore/1.0.0/loadMore');
        var url = vars.zhishiSite + '?c=zhishi&a=ajaxFangRead';
        url = vars.isXfds === 'xfds' ? url + '&type=xfds&agentid=' + vars.agentid : url;
        loadMore({
            url: url,
            total: vars.count,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '.more-list',
            loadPromptID: '.more-list',
            contentID: '#buyfang',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '正在加载...',
            firstDragFlag: false
        });
    };
});
