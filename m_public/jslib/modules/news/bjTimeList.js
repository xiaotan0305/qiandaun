/**
 * 北京时间合作列表页
 * Created by limengyang.bj@fang.com 2017-5-10
 */
define('modules/news/bjTimeList', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // ajax加载更多
        if (vars.totalCount > 20) {
            var loadMore = require('loadMore/1.0.0/loadMore');
            loadMore({
                url: vars.newsSite + '?c=news&a=ajaxGetBjTime&city=' + vars.city,
                // 数据总条数
                total: vars.totalCount,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数
                pageNumber: 20,
                // 加载更多按钮id
                moreBtnID: '#drag',
                // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                firstDragFlag: false,
                // 加载数据过程显示提示id
                loadPromptID: '#draginner',
                // 数据加载过来的html字符串容器
                contentID: '.listUl',
                // 加载前显示内容
                loadAgoTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                // 加载中显示内容
                loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                // 加载完成后显示内容
                loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>'
            });
        }
    };
});