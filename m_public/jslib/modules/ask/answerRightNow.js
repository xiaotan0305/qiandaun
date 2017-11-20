/**
 *问答UI改版 立即回答页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/answerRightNow', ['jquery', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var askId = vars.ask_id;
        var answerId = vars.user_id;
        var answerIp = vars.user_ip;
        // 用于对立即回答的ajax请求加锁 防止用户多次点击提交按钮 重复提交数据
        var flagBool = true;
        // +++++++++++++++++++++++++++++++++++
        // 页面浮沉提示div
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
         * 设置焦点函数
         * @param obj 包含文本内容的div的id
         * 解决如果文本框中存在类容 焦点定位在文本的前面 而不是文本末尾的问题
         * 在非IE浏览器（Firefox、Safari、Chrome、Opera）下可以使用window.getSelection()获得selection对象
         */
        function getSelectPos(obj) {
            if (typeof obj === 'string') obj = document.getElementById(obj);
            obj.focus();
            // createTextRange ie支持的属性
            if (obj.createTextRange) {
                // ie
                var rtextRange = obj.createTextRange();
                rtextRange.moveStart('character', obj.value.length);
                rtextRange.collapse(true);
                rtextRange.select();
            } else if (obj.selectionStart) {
                // chrome "<input>"、"<textarea>"
                obj.selectionStart = obj.value.length;
            } else if (window.getSelection) {
                var sel = window.getSelection();
                var tempRange = document.createRange();
                tempRange.setStart(obj.firstChild, obj.firstChild.length);
                sel.removeAllRanges();
                sel.addRange(tempRange);
            }
        }

        // 获取回答内容div
        var $submitContentId = $('#submitContent');
        // 从localStorage里面取出上一次提问的内容
        var locVariable = 'ans_after_content' + askId;
        var mycontent = localStorage.getItem(locVariable);
        // 如果localStorage里面有值则将内容写入文本狂并把焦点设置在文本内容的末尾
        if (mycontent || mycontent === '在这输入回答，被采纳最多获40积分') {
            $submitContentId.val(mycontent);
            // 把焦点设置到文本的末尾
            getSelectPos('submitContent');
        } else {
            $submitContentId.one('focus', function () {
                $(this).text('');
            });
        }

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 0, pageId: 'maanswer'});

        // 点击提交按钮将用户回答的问题内容提交到后台
        $('.submit').on('click', function () {
            // 如果已经提交过了当再次点击时直接退出 不再进行ajax请求
            if (!flagBool) {
                return false;
            }
            flagBool = false;
            // 获取用户回答的内容
            var content = $submitContentId.val().trim();
            // 当用户回答的内容为空时 提示用户
            if (content === '' || content === '在这输入回答，被采纳最多获40积分') {
                PromptExecution('提交内容不能为空');
            } else {
                var burl;
                // 用户回答的内容不为空时 将数据存入localStorage
                localStorage.setItem(locVariable, content);
                // 进行登录验证
                if (answerId === '') {
                    // 没有登录
                    burl = vars.askSite + '?c=ask&a=answerRightNow&id=' + askId;
                    window.location.href = vars.loginUrl + '?burl=' + encodeURIComponent(burl);
                } else if (vars.mobvalid !== '1') {
                    // 需要验证手机号
                    burl = vars.askSite + '?c=ask&a=answerRightNow&id=' + askId;
                    window.location.href = vars.resetmobileUrl + '?burl=' + encodeURIComponent(burl);
                } else {
                    // 对提交内容的判断
                    // ajax提交内容，并且做提交的判断
                    $.get(vars.askSite + '?c=ask&a=ajaxPostAnswer&id=' + askId + '&answer_id=' + answerId + '&answer_ip='
                        + answerIp + '&content=' + content + '&r=' + Math.random(), function (returnData) {
                        var data = returnData;
                        if (data.code === '100') {
                            // 用户行为对象
                            yhxw({type: 93, pageId: 'maanswer'});
                            // 跳转到该问题详情页，并且定位
                            window.location.href = vars.askSite + 'ask_' + askId + '.html';
                            // 回答成功，用户行为。
                            localStorage.removeItem(locVariable);
                        } else {
                            flagBool = true;
                            // 回复失败
                            PromptExecution(data.message);
                        }
                    });
                }
            }
        });
    };
});