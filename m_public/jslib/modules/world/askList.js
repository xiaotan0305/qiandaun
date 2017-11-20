/**
 * Created by LY on 15-11-6.
 */
define('modules/world/askList', ['jquery', 'modules/world/yhxw', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 隐藏变量
        var vars = seajs.data.vars;
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwasklist';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 国家名称
            'vmw.country': encodeURIComponent(vars.zhCountry),
            // 关键字
            'vmw.key': encodeURIComponent(vars.keyword)
        };
        // 添加用户行为分析,有关键字才走搜索
        yhxw({type: 1, pageId: pageId, params: maiMaParams});

        // 加载更多功能
      /*  if (parseInt(vars.total_count) > parseInt(vars.pagesize)) {
            var loadMore=require('loadMore/1.0.0/loadMore');
            /// if (vars.keyword) {
                var keyword = vars.keyword.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
                vars.keyword = keyword.replace(/(^\s+)|(\s+$)/g, '');
            //}
            var param = vars.keyword ? '&keyword=' + encodeURIComponent(vars.keyword) : '&country=' + vars.country;
            loadMore({
                total: vars.total_count,
                pagesize: 20,
                firstDragFlag: false,
                pageNumber: 20,
                moreBtnID: '#drag',
                loadPromptID: '#draginner',
                contentID: '#content',
                loadAgoTxt: '<a>查看更多</a>',
                loadingTxt: '<span><i></i>努力加载中...</span>',
                loadedTxt: '<a>上拉自动加载更多</a>',
                url: vars.worldSite + '?c=world&a=ajaxGetAskList' + param
            });
        }*/
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        var param = vars.keyword ? '&keyword=' + encodeURIComponent(vars.keyword) : '&country=' + vars.country;
        var l = loadMore({
            // 接口地址
            url:vars.worldSite + '?c=world&a=ajaxGetAskList' + param,
            // 数据总条数
            total: vars.total_count,
            // 首屏显示数据条数
            pagesize: 20,
            // 单页加载条数，可不设置
            pageNumber: 20,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#productlist',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            loadedTxt: '上拉加载更多',
            no_lazyload: 1,
           /* callback:function(){
                if($('#productlist>section').length >= this.total){
                    $('#bottBox').show();
                }
            }*/
        });
    };
});