/**
 *问答UI改版 回答提交页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/postAsk',['jquery', 'modules/ask/yhxw'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用于对该的ajax请求加锁 防止用户多次点击提交按钮 重复提交数据
        var flagBool = true;
        // +++++++++++++++++++++++++++++++++++
        // 页面浮沉提示
        // 获取浮层提示div
        var $promptId = $('#prompt');

        /**
         * 隐藏浮层提示函数
         */
        function hidePrompt() {
            setTimeout(function () {
                $promptId.hide();
            }, 2000);
        }

        /**
         * 执行浮层的提示与隐藏操作函数
         * @param content 浮层提示的内容
         */
        function PromptExecution(content) {
            $('#promptContent').html(content);
            $promptId.show();
            hidePrompt();
        }

        /**
         * 标题输入字数限制50
         * @type {*|jQuery|HTMLElement}
         */
        var $title = $('#title');
        var $bc = $('#problem');
        var thisLen,$this;
        var $textLen = $('.num');
        $title.on('input', function(){
            $this = $(this);
            thisLen = $this.val().length;
            if(thisLen && thisLen <= 50){
                $textLen.text(thisLen + '/50');
            }else{
                $textLen.text('0/50');
            }
        });
        // 提交用户数据
        $('#submit').on('click',function () {
            // 如果已经提交过了当再次点击时直接退出 不再进行ajax请求
            if (!flagBool) {
                return false;
            }
            var title = $title.val().trim();

            if (title === '' || title === '您的问题（6到50字以内）') {
                PromptExecution('提交问题不能为空');
                return false;
            } else if (title.length < 6 || title.length > 50){
                PromptExecution('问题须6到50字');
                return false;
            }

            var bc = $bc.val().trim();
            if (bc.length > 500){
                PromptExecution('补充说明不能多于500字');
                return false;
            }
            // 将用户提问的相关数据提交到后台处理
            $.get(vars.askSite + '?c=ask&a=ajaxSubmitProblem&newcode=' + vars.newcode + '&title=' + title + '&bc=' + bc,function (data) {
                // ajax请求返回的数据  用于验证数据提交状态
                var jsondata = data;
                // 注意这里的使用，接口返回问题
                if (jsondata.code === '100') {
                    // 提交成功加锁
                    flagBool = false;
                    PromptExecution('提问成功');
                    window.location.href = vars.askSite + 'ask_' + jsondata.askid +'.html';
                } else {
                    PromptExecution(jsondata.message);
                }
            });
        });
        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 0, pageId: 'maquiz'});
    };
});
