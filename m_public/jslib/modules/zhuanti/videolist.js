/**
 * 2018楼市大感想活动
 */
define('modules/zhuanti/videolist', ['jquery','iscroll/2.0.0/iscroll-lite', 'loadMore/1.0.0/loadMore'], function(require, exports, module){
	'use strict';
	module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 筛选框插件
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 浏览器类型
        var ua = navigator.userAgent.toLowerCase();
        // 微信浏览器
        var isWX = /micromessenger/.test(ua);

        // 上拉加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        var url = vars.zhuantiSite + '?c=zhuanti&a=ajaxGetVideoList&type=' + vars.type + '&r=' + Math.random();
        loadMore({
            url: url,
            total:vars.totalSum,
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '#moreContents',
            loadPromptID: '#moreContents',
            contentID: '#content',
            loadAgoTxt: '<a href="javascript:void(0);">查看更多视频</a>',
            loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
            loadedTxt: '',
            firstDragFlag: false,
        });
        /**
         * 提示弹窗
         * @param msg 要显示的文案
         */
        function showMsg(msg) {
            // 意见提交失败的样式,只有网络不好的时候会出现
            var message = $('#tipBox');
            $('#tipMsg').text(msg);
            message.show();
        }
        $("#closeBox").on('click', function(){
            $('#tipBox').hide();
        });
        //%7B%22openid%22%3A%22ovraf0qTv1cknXpAl6RHO0MdIq2c%22%2C%22nickname%22%3A%22%5Cu9648%5Cu6d2a%5Cu8273%22%2C%22headimgurl%22%3A%22http%3A%5C%2F%5C%2Fwx.qlogo.cn%5C%2Fmmopen%5C%2Fvi_32%5C%2FoFTRDGzXSiaow13nZWZFu3hYclNeRnZX4nomgemgYG9Q60UZ7pibM4UBB8RKxP9cCqN0yWh8TFu1kl0uBKK8lh8Q%5C%2F132%22%7D 
        //点击公开或不公开修改状态
        $('#content').on('click', '.show span', function () {
            var that = $(this);
            var status = that.attr('data-status');
            var vid = that.attr('data-val');
            $.get(vars.zhuantiSite + '?c=zhuanti&a=ajaxChangeStatus', {vid:vid,status:status}, function(data){
                if (data.status == 'success') {
                    if (status == 'unlock') {
                        that.removeClass('show_no').text('公开').attr('data-status', 'lock');
                    } else {
                        that.addClass('show_no').text('不在列表展示').attr('data-status', 'unlock');
                    }
                } else {
                    showMsg(data.message);
                }
            });
        });
    };
})