/**
 * Created by hanxiao on 2017/10/31.
 */
/**
 *问答UI改版
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/houseProblemList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var lazyload = require('lazyload/1.9.1/lazyload');
        var vars = seajs.data.vars;

        // 对图片加载使用lazyload
        lazyload('img').lazyload();

        // 该页面的加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxGetMoreHouseProblem&newcode=' + vars.newcode,
            total: vars.allcount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.moreList',
            loadPromptID: '.moreList',
            contentID: '#problemBox',
            loadAgoTxt: '<a href="javascript:void(0);" class="bt">上滑加载更多</a>',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            lazyCon: 'img',
            firstDragFlag: false,
        });
    };
});
