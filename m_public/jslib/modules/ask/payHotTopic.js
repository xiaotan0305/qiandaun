/**
 *问答UI改版 我的问答页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/payHotTopic', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        
		/* 图片惰性加载*/
        require('lazyload/1.9.1/lazyload');
        var swipLazy = $('.lazyload'), delay = 0;
        if (swipLazy) {
            swipLazy.lazyload();
            swipLazy.each(function (index, ele) {
                setTimeout(function () {
                    var thisEle = $(ele);
                    if (thisEle.attr('src') !== thisEle.attr('data-original')) {
                        thisEle.attr('src', thisEle.attr('data-original'));
                    }
                }, delay + 20);
            });
        }
        // 上拉加载更多
        
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxHotTopicLists&city=' + vars.city + '&topicid=' + vars.topicid,
            total: vars.hotTopicCount,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '.lodBoxN',
            loadPromptID: '#lodBoxN',
            contentID: '#moreHotTopic',
            loadAgoTxt: '<a href="javascript:void(0);">上拉加载更多</a>',
            loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
            firstDragFlag: false
        });
    };
});