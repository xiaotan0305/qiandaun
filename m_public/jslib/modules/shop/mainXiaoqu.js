/**
 * 店铺主营小区列表页
 * by lipengkun
 * 20160602 lipengkun@fang.com
 */
define('modules/shop/mainXiaoqu', ['jquery','loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery'),
        // 加载更多
            loadMore = require('loadMore/1.0.0/loadMore');
        // 页面传入的参数
        var vars = seajs.data.vars,
        // 列表加载更多
            dragBox = $('#drag');

        // 二手房详情页图片增加惰性加载功能
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });


        // 加载更多功能
        if (dragBox.length > 0) {
            if (parseInt(vars.allCount) < parseInt(vars.firstPgNum)) {
                dragBox.hide();
                return;
            }
            loadMore({
                url: vars.mainSite + 'shop/?c=shop&a=ajaxmainXiaoquList' + '&city=' + vars.cityname + '&ecshopids='
                + vars.ecshopids + '&x=' + vars.coordx + '&y=' + vars.coordy + '&pagesize=' + vars.stepByNum,
                total: vars.allCount,
                pagesize: vars.firstPgNum,
                pageNumber: vars.stepByNum,
                contentID: '.houseList',
                moreBtnID: '#drag',
                loadPromptID: '#loading',
                loadingTxt: '正在加载...',
                firstDragFlag: false
            });
        }
    };
});