/**
 * 房产有舞 2017暨第18届业主大会
 */
define('modules/zhuanti/personalstyle', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'superShare/1.0.1/superShare'], function(require, exports, module){
	'use strict';
	module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 左右滑动插件
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');

        /**
         * 提示弹窗
         * @param msg 要显示的文案
         */
        function showMsg(msg) {
            // 意见提交失败的样式,只有网络不好的时候会出现
            var message = $('.outW');
            message.html(msg);
            message.show();
            // 提示框在3秒后隐藏
            setInterval(function () {
                message.hide();
            }, 3000);
        }

        //Logo投票
        $('#votebtn').click(function(){
        	var that = $(this);
        	var num = parseInt(that.prev().text()) + 1;
        	var voteText = num + '<i>+1</i>';
        	$.get(vars.zhuantiSite + '?c=zhuanti&a=squareDanceVote&id=' + vars.id+'&classtype=0&modeltype=0&source=2', function (data) {
                if (data.code === '100') {
                	//投票成功
                    that.prev().text(num + '票');
                } else if (data.code === '106') {
                    that.addClass('gray');
                    that.text('已投票');
                }
        	})
        })

        /*图片视频滑动效果*/
        var $ulList = $('#ulList');
        var videoimgNum = $ulList.find('li').length;
        if (videoimgNum > 0) {
            $ulList.css('width',videoimgNum * 125 + 'px');
            new scrollCtrl('#videoimgList',{
                scrollX:true,
                scrollY:false,
                eventPassthrough: true,
                preventDefault: false
            });
        }

        //视频播放
        var videoBtn = $('#videoBtn');
        var videobg1 = $('.videobg1');
        var videobg2 = $('.videobg2');
        var videobox = $('.videobox');

        $('.videoimg').click(function(){
            var that = $(this);
            var videoUrl = that.attr('data-video');
            var imgUrl = that.attr('data-img');
            $('.status').removeClass('active');
            that.find('.status').addClass('active');
            $('#videoPic').show();
            $('#imgPic').hide();
            videobg1.attr('src', imgUrl);
            videobox.attr('src', videoUrl);
        });

        $('.isimg').click(function(){
            var that = $(this);
            var imgUrl = that.attr('data-img');
            $('.status').removeClass('active');
            that.find('.status').addClass('active');
            $('#videoPic').hide();
            $('#imgPic').show();
            $('.bigImg').attr('src', imgUrl);
        });

        videoBtn.on('click', function () {
            videobg1.hide();
            videoBtn.hide();
            videobox.show();
            videobox[0].play();
            videobg2.show();
        })

        // 点击分享关闭按钮
        $('.close').on('click', function () {
            $('.share-s3').hide();
            $('.icon-nav').css('pointer-events', '');
            enable();
        });
        $(function () {
            /* 分享代码*/
            var SuperShare = require('superShare/1.0.1/superShare');
            //分享按钮
            var config = {
                // 分享的内容title
                title: vars.title + '...',
                // 分享时的图标
                image: vars.imgUrl,
                // 分享内容的详细描述
                desc: vars.description + '...',
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' '
            };
            var superShare = new SuperShare(config);
        });

    };
})