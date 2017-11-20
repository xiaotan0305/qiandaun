/**
 *问答UI改版 个人回答列表页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/bask/hisAsk', ['jquery', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var userid = vars.userid;
        var askType = vars.ask_type;
        // +++++++++++++++++++++++++++++++++++

        /**
         * 判断是否为专家
         */
        $.ajax({
            type: 'get',
            url: vars.askSite + '?c=bask&a=ajaxGetExpert',
            data: {
                userid: userid,
                isAdvisor: vars.isAdvisor,
                groupid: vars.groupid
            },
            success: function (result) {
                if (result) {
                    var $result = $(result);
                    $('.my-name').after($result);
                }
            }
        });
        // 上拉加载更多
        var url = vars.askSite + '?c=bask&a=ajaxHisAsk' + '&type=' + askType + '&userid=' + userid + '&zhcity=' + vars.zhcity + '&grouptype=' + vars.grouptype;
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