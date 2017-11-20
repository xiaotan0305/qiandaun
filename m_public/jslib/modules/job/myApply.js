/**
 * Created by yangchuanlong on 2017/7/7.
 */
define('modules/job/myApply', ['jquery', 'loadMore/1.0.2/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 页面传入的数据
        var vars = seajs.data.vars;        
        // 加载更多
        var loadMore = require('loadMore/1.0.2/loadMore');
		loadMore({
            url: vars.jobSite + '?c=job&a=ajaxGetMyApply',
            total: vars.totalCount,
            pagesize: 6,
            pageNumber: 6,
            moreBtnID: '.moreList',
            loadPromptID: '.a_more',
            contentID: '#ul_zwlist',
            loadAgoTxt: '<a href="javascript:void(0);" class="bt">加载更多...</a>',
            loadingTxt: '<a href="javascript:void(0);" class="bt">努力加载中...</a>',
            loadedTxt: '<a href="javascript:void(0);" class="bt">加载更多...</a>',
            loadedMsg: '<a href="javascript:void(0);" class="bt">没有更多了...</a>',
            firstDragFlag: false
        });
    }
});