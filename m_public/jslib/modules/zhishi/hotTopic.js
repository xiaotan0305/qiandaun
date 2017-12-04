/**
 * 专题列表页
 * @author fcwang(wangfengchao@fang.com) 20151226
 */
define('modules/zhishi/hotTopic', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload', 'modules/zhishi/zhishibuma'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        var page = 2;
        if (vars.jtname !== '') {
            var pageUrl = vars.zhishiSite + '?c=zhishi&a=ajaxHotTopic&city=' + vars.city + '&jtname=' + vars.jtname;
        } else {
            var pageUrl = vars.zhishiSite + '?c=zhishi&a=ajaxYouLiao&city=' + vars.city;
        }

        loadMore({
            total: vars.total_count,
            pagesize: 10,
            firstDragFlag: false,
            pageNumber: 10,
            moreBtnID: '.more-list',
            loadPromptID: '.more-list',
            contentID: '.zt-list',
            loadAgoTxt: '<a href="javascript:void(0);" class="more-list" id="more-list" >上拉加载更多</a>',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            loadedTxt: '<a href="javascript:void(0);" class="more-list" id="more-list" >上拉加载更多</a>',
            url: pageUrl
        });
        // tags跳转到搜索结果页，赋值city与newsnet
        var $tags = $('.otherTag a');
        $tags.click(function () {
            window.location.href = vars.zhishiSite + 'search/?kw=' + $(this).text() + '&city=' + vars.city + '&newsnet=xf';
        });

        /**
         * 浏览埋码
         * @param page 埋码方式
         */
        if (vars.jtname == 'jiaju') {
            var zhishibuma = require('modules/zhishi/zhishibuma');
            zhishibuma({pageType: 'zs_jjremenzt^lb_wap', b: '0'});
        }
    };
});
