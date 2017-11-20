/**
 * Created by LXM on 14-12-9.
 */
define('modules/world/newsList',['jquery', 'modules/world/yhxw', 'loadMore/1.0.0/loadMore'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwnewslist';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 国家名称
            'vmw.country': encodeURIComponent(vars.zhCountry)
        };
        // 添加用户行为分析
        yhxw({type: 1, pageId: pageId, params: maiMaParams});

         // 还需要一个ajax加载方法，以及图片的lazyload
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        // 加载更多功能
        if (parseInt(vars.total_count) > parseInt(vars.pagesize)) {
            var loadMore=require('loadMore/1.0.0/loadMore');
            loadMore({
                total: vars.total_count,
                pagesize: 20,
                firstDragFlag: false,
                pageNumber: 20,
                moreBtnID: '#drag',
                loadPromptID: '#draginner',
                contentID: '#content',
                loadAgoTxt: '查看更多',
                loadingTxt: '努力加载中...',
                loadedTxt: '上拉自动加载更多',
                url: vars.worldSite + '?c=world&a=ajaxGetNewsList&country=' + vars.country
            });
        }
    };
});