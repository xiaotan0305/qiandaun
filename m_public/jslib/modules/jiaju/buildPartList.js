/**
 * @file 建材聚合列表页
 * @author bjzhangxiaowei@fang.com
 */
define('modules/jiaju/buildPartList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var notfound = $('#notfound');
        notfound.on('click', function () {
            window.location.reload();
        });

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxbuildPartList&id=' + vars.id ,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 15,
            // 单页加载条数，可不设置
            pageNumber: 15,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#productlist'
        });
    };
});