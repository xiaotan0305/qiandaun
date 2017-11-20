/**
 * fdc--产业资讯列表页
 * @author chenhuan(chenhuan.bj@soufun.com)
 * @modify icy(taoxudong@soufun.com) 2015-12-07
 */
define('modules/fdc/industryList', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload({
                threshold: 200,
                // 触发懒加载的事件
                event: 'scroll click'
            });
        });

        if (vars.count <= 10) {
            // 列表项数量小于时隐藏加载更多
            $('.moreList').hide();
        } else {
            // 列表项数量大于10，引入加载更多插件
            var loadMore = require('loadMore/1.0.0/loadMore');
            loadMore({
                // 加载地址
                url: vars.fdcSite + '?c=fdc&a=ajaxDataIndustryInfo',
                // 数据量
                total: vars.count,
                // 首屏数据条数
                pagesize: 10,
                // 单页加载条数
                pageNumber: 10,
                // 加载更多按钮节点
                moreBtnID: '.moreList',
                // 加载数据过程显示提示节点
                loadPromptID: '.moreList em',
                // 数据放置容器
                contentID: '#newslist',
                // 加载前显示内容
                loadAgoTxt: '上拉加载更多',
                // 加载中显示内容
                loadingTxt: '正在加载...'
            });
        }
    };
});