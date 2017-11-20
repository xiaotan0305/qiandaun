/*
* 小区上新房列表页
* author bjwanghongwei@fang.com
* 1229
* */
define('modules/xiaoqu/newHouseList',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        var preload = [];
        preload.push('lazyload/1.9.1/lazyload');
        require.async(preload);
        // 图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });
        // 列表加载更多
        if ($('#drag').length > 0) {
            require.async('loadMore/1.0.0/loadMore',function (loadMore) {
                loadMore({
                    url: vars.xiaoquSite + '?c=xiaoqu&a=ajaxGetNewHouseRecord'
                    + '&projcode=' + vars.projcode,
                    total: vars.allcount,
                    pagesize: vars.pagesize,
                    pageNumber: vars.stepByNum,
                    contentID: '#content',
                    moreBtnID: '#drag',
                    loadPromptID: '#loading',
                    firstDragFlag: false
                });
            });
        }
    };
});