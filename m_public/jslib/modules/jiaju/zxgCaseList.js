/**
 * @file 装修馆案例列表页
 * @author bjxuying@fang.com on 16-11-11.
 */
define('modules/jiaju/zxgCaseList', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreZxgCase&city='
            + vars.city + '&companyid=' + vars.companyid + '&wkuid=' + vars.wkuid + '&from=' + vars.from + '&src=' + vars.src,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: vars.pagesize,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart'
        });

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
    };
});