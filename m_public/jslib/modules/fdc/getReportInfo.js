/**
 * fdc--中指报告列表页
 * @author lvyan(lvyan.bj@soufun.com)
 */
define('modules/fdc/getReportInfo', ['loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // 加载更多
        if (vars.count > 10) {
            // 列表项数量大于10，引入加载更多插件
            var loadMore = require('loadMore/1.0.0/loadMore');
            loadMore({
                // 加载地址
                url: vars.fdcSite + '?c=fdc&a=ajaxReportInfo&type=' + vars.type,
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
                contentID: '#reportList',
                // 加载前显示内容
                loadAgoTxt: '上拉加载更多',
                // 加载中显示内容
                loadingTxt: '正在加载...'
            });
        }
    };
});