/**
 * 房产有舞 2017暨第18届业主大会
 */
define('modules/zhuanti/squareindex', ['jquery'], function(require, exports, module){
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
        var voteBtn = $('.voteBtn');
        voteBtn.on('click', function(){
            $(".drag-content").show();
            var that = $(this);
            var id = that.attr('data-id');
            var num = parseInt(that.prev().text()) + 1;
            var voteText = num + '<i>+1</i>';
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

                    var data = {'id':id, 'classtype':vars.classtype, 'modeltype':vars.modeltype, 'source':4, 'challenge':result.fc_challenge, 'validate':result.fc_validate, 'gt':result.fc_gt};
                    $.get(vars.zhuantiSite + '?c=zhuanti&a=agentDanceVote', data, function (data) {
                        if (data.checkcode && data.checkcode != '100') {
                            //如果验证失败重新初始化滑动条
                            window.fCheck.reinit();
                            codeshade.show();
                            dragcontent.show();
                        }
                        if (data.code && data.code === '100') {
                            //投票成功
                            that.prev().text(num + '票');
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

            
        });
    };
})