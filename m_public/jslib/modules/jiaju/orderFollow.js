/**
 * @fileOverview 跟进列表页
 * Created by Young on 2016-9-9.
 */
define('modules/jiaju/orderFollow', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.1/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        // 加载更多
        if (+vars.total > 10) {
            var loadMore = require('loadMore/1.0.1/loadMore');
            loadMore.add({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetOrderFollow&OrderID=' + vars.OrderID + '&CompanyID=' + vars.CompanyID,
                total: vars.total,
                pagesize: 10,
                perPageNum: 10,
                content: $('#content'),
                moreBtn: $('.moreList'),
                loadPrompt: $('.loadPrompt')
            });
            loadMore.init();
        }

        // 点击显示剩余评论
        $('.diaryList').on('click', '.loadm', function () {
            $(this).hide().prev().find('dd').show();
        });
    };
});