/**
 *问答UI改版 我的问答页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/bask/myAsk', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // 用户id
        var userid = vars.userid;
        // 上拉加载更多
        var url = '';
        if (vars.accept === '1' || vars.accept === '2') {
            url = vars.askSite + '?c=bask&a=ajaxMyAsk' + '&accept=' + vars.accept + '&zhcity=' + vars.zhcity + '&grouptype=' + vars.grouptype
                + '&userid=' + userid;
        } else {
            url = vars.askSite + '?c=bask&a=ajaxMyAsk' + '&userid=' + userid + '&zhcity=' + vars.zhcity + '&grouptype=' + vars.grouptype;
        }
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: url,
            total: vars.totalCount,
            pagesize: 5,
            pageNumber: 5,
            moreBtnID: '#drag',
            loadPromptID: '.gray-5',
            contentID: '#ajax',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            firstDragFlag: false
        });
    };
});