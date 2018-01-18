/**
 * 知识搜索页面
 * by blue
 * 20150924 blue 整理代码，删除冗长代码，提高代码效率
 */
define('modules/zhishi/search', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/zhishi/zhishibuma'], function (require, exports, module) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 页面传入的参数
    var vars = seajs.data.vars;
    // 用户行为对象
    var zhishibuma = require('modules/zhishi/zhishibuma');
    // 图片惰性加载
    require('lazyload/1.9.1/lazyload');
    $('.lazyload').lazyload();
    // 加载更多方法对象
    var loadMore = require('loadMore/1.0.0/loadMore');
    loadMore({
        url: vars.zhishiSite + '?c=zhishi&a=ajaxGetSearch&kw=' + encodeURIComponent(vars.seo),
        total: vars.count,
        pagesize: 30,
        pageNumber: 10,
        moreBtnID: '.more-list',
        loadPromptID: '.more-list',
        contentID: '#know-list',
        loadAgoTxt: '上拉加载更多',
        loadingTxt: '正在加载...',
        firstDragFlag: false
    });
    $('.know-list').on('click', 'li', function () {
        $(this).addClass('visited');
    });
    // 布码
    var keyword = $('#new_searchtext').find('input').attr('placeholder');
    zhishibuma({key: encodeURIComponent(keyword), pageType: 'zs_zs^ss_wap'});
    module.exports = function fn() {
    };
});
