/**
 * Created by LXM on 14-12-8.
 */
define('modules/news/search', ['jquery', 'modules/news/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 加载更多功能
        require.async(['loadMore/1.0.0/loadMore'], function (loadMore) {
            var pagesize = vars.pagesize;
            var pageUrl = vars.newsSite + '?c=news&a=ajaxGetSearch&city=' + vars.city + '&keyword=' + encodeURIComponent(vars.keyword);
            loadMore({
                total: vars.total_count,
                pagesize: pagesize,
                firstDragFlag: false,
                pageNumber: 20,
                moreBtnID: '#drag',
                loadPromptID: '#draginner',
                contentID: '[type_id="content"]:last',
                loadAgoTxt: '<a>查看更多</a>',
                loadingTxt: '<span><i></i>努力加载中...</span>',
                loadedTxt: '<a>上拉自动加载更多</a>',
                url: pageUrl
            });
        });
        // 图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });

        // 埋码变量数组
        var ubParams = {
            'vmg.page': 'mzssearch',
            'vmi.key': encodeURIComponent(vars.keyword)
        };
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/news/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mzxsearch';
        // 添加用户行为分析-埋码
        yhxw({type: 1, pageId: pageId, params: ubParams});
    };
});