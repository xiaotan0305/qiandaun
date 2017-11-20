/**
 * @file 2016WAP第四期改版 聚优惠
 * @author xuying(xuying@fang.com)
 */
define('modules/jiaju/saleTogether', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
       
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        // 数据请求失败时, 点击刷新
        var $notFound = $('#notfound');
        if ($notFound.length) {
            $('body').addClass('whitebg');
            $('footer').hide();
            $notFound.on('click', function () {
                window.location.reload();
            });
        }

        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreSaleCateInfo&city=' + vars.city + '&categoryId=' + vars.categoryId+'&origin='+vars.origin+'&src='+vars.src,
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
    };
});
		