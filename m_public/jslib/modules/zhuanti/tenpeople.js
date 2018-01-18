/**
 * 房产有舞 2017暨第18届业主大会
 */
define('modules/zhuanti/tenpeople', ['jquery', 'superShare/1.0.1/superShare'], function(require, exports, module){
	'use strict';
	module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        /**
         * 提示弹窗
         * @param msg 要显示的文案
         */
        function showMsg(msg) {
            // 意见提交失败的样式,只有网络不好的时候会出现
            var message = $('.voteFloat');
            $('.voteMsg').html(msg);
            message.show();
        }
        $('.btns').on('click', function(){
            $('.voteFloat').hide();
        });

        //分享提示浮层
        $('.shareBtn').on('click', function(){
            $('.shareFloat').show();
        });

        //投票
        $('.voteBtn').click(function(){
        	var that = $(this);
        	var voteTip ='<i>+1</i>';
            var userid = parseInt(that.attr('data-value'));
            var data = {'userid':userid};
            $.ajax({
                type: 'GET',
                url: vars.zhuantiSite + '?c=zhuanti&a=oaTenPeopleVote',
                data:data,
                success: function(data){
                   if (data.code && data.code === '100') {
                        //投票成功
                        showMsg('<b>投票成功</b><br/><b>对方累计获得' + data.poll + '票</b><br/><b>分享页面到朋友圈点赞吧~~</b>');
                        that.html(voteTip);
                        that.addClass('cur');
                        that.unbind();
                    } else {
                        showMsg('<b>' + data.msg + '</b>');
                    }
                },
            });
        })

        //点赞
        $('.PraiseBtn').click(function(){
            var that = $(this);
            var praiseTip ='<i>+1</i>';
            var userid = parseInt(that.attr('data-value'));
            var data = {'userid':userid};
            $.ajax({
                type: 'GET',
                url: vars.zhuantiSite + '?c=zhuanti&a=oaTenPeoplePraise',
                data:data,
                success: function(data){
                   if (data.code && data.code === '100') {
                        //投票成功
                        showMsg('<b>点赞成功</b><br/><b>对方累计获得' + data.praise + '个赞</b>');
                        that.html(praiseTip);
                        that.addClass('cur');
                        that.unbind();
                    } else {
                        showMsg('<b>' + data.msg + '</b>');
                    }
                },
            });
        })

    };
})