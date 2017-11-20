/**
 *问答UI改版
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/newAsk', ['jquery', 'loadMore/1.0.0/loadMore', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        var pageId;

        if (vars.sort === '1') {
            pageId = 'malistnewquiz';
        } else if (vars.sort === '3') {
            pageId = 'malisthighreward';
        }

        yhxw({type: 1, pageId: pageId});

        // 上拉加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxNewAsk&classid=' + vars.classid + '&sort=' + vars.sort,
            total: vars.totalCount,
            pagesize: 32,
            pageNumber: 16,
            moreBtnID: '#drag',
            loadPromptID: '.draginner',
            contentID: '#ajax',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            firstDragFlag: false
        });
    };
});
