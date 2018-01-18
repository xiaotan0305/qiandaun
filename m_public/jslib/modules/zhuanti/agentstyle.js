/**
 * 房产有舞 2017暨第18届业主大会
 */
define('modules/zhuanti/agentstyle', ['jquery', 'superShare/1.0.1/superShare'], function(require, exports, module){
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
            var message = $('.outW');
            message.html(msg);
            message.show();
            // 提示框在3秒后隐藏
            setInterval(function () {
                message.hide();
            }, 3000);
        }

        require.async('https://static.soufunimg.com/common_m/m_recaptcha/js/app2.0.js');
        //投票
        $('#votebtn').click(function(){
        	var that = $(this);
        	var num = parseInt(that.prev().text()) + 1;
        	var voteText = num + '票<i>+1</i>';
            var codeshade = $('#codeshade');
            var dragcontent = $('.drag-content');
            codeshade.show();
            dragcontent.show();
            // 调用验证控件
            window.fCheck.init({
                container: '.drag-content',
                url: vars.zhuantiSite + '?c=zhuanti&a=ajaxCodeInit',
                width: 200,
                height: 150,
                customStyle: !0,
                callback: function() {
                    // 验证成功后的回调
                    // 判断是否操作了验证组件。
                    if (window.fCheck.config.result === null){
                        PromptExecution('您尚未完成滚动条验证');
                        return false;
                    }
                    
                    var result = window.fCheck.config.result;

                    var data = {'id':vars.id, 'classtype':vars.classtype, 'modeltype':vars.modeltype, 'source':4, 'challenge':result.fc_challenge, 'validate':result.fc_validate, 'gt':result.fc_gt};
                    $.get(vars.zhuantiSite + '?c=zhuanti&a=agentDanceVote', data, function (data) {
                        if (data.checkcode && data.checkcode != '100') {
                            //如果验证失败重新初始化滑动条
                            codeshade.show();
                            dragcontent.show();
                            window.fCheck.reinit();
                        }
                        if (data.code && data.code === '100') {
                            //投票成功
                            that.prev().html(voteText);
                            that.addClass('yt');
                            that.text('已投票');
                            that.unbind();
                            codeshade.hide();
                            dragcontent.hide();
                        } else if (data.code && data.code === '106') {
                            codeshade.hide();
                            dragcontent.hide();
                            alert(data.msg);
                            that.addClass('yt');
                            that.text('已投票');
                            that.unbind();
                        } else {
                            //如果验证失败重新初始化滑动条
                            codeshade.show();
                            dragcontent.show();
                            window.fCheck.reinit();
                        }
                    })
                }
            });
        })

        //视频播放
        var videoBtn = $('#videoBtn');
        var videobg1 = $('.videobg1');
        var videobg2 = $('.videobg2');
        var videobox = $('.videobox');

        videoBtn.on('click', function () {
            videobg1.hide();
            videoBtn.hide();
            videobox.show();
            videobox[0].play();
            videobg2.show();
        })

        // // 点击分享关闭按钮
        // $('.close').on('click', function () {
        //     $('.share-s3').hide();
        //     $('.icon-nav').css('pointer-events', '');
        //     enable();
        // });
        // $(function () {
        //     /* 分享代码*/
        //     var SuperShare = require('superShare/1.0.1/superShare');
        //     //分享按钮
        //     var config = {
        //         // 分享的内容title
        //         title: vars.title + '...',
        //         // 分享时的图标
        //         image: vars.imgUrl,
        //         // 分享内容的详细描述
        //         desc: vars.description + '...',
        //         // 分享的链接地址
        //         url: location.href,
        //         // 分享的内容来源
        //         from: ' '
        //     };
        //     var superShare = new SuperShare(config);
        // });

    };
})