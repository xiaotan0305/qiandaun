define('modules/bbs/topicComment', ['jquery', 'util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $submit = $('.submit');
        var $replyContent = $('#replyContent');
        var $floatAlert = $('#floatAlert');
        var $floatText = $floatAlert.find('p');
        var contentPlaceHolder = $replyContent.text();
        // 2S后隐藏提示框
        function hideAlert() {
            setTimeout(function () {
                $floatAlert.hide();
            }, 2000);
        }

        // 校验
        function check(submitContent) {
            // 输入内容是否有效
            if (submitContent === '' || submitContent === contentPlaceHolder) {
                $floatAlert.show();
                $floatText.html('评论内容不可为空');
                hideAlert();
                return false;
            }
            return true;
        }

        /**
         * 内容过滤
         */
        function contentfilter() {
            // 内容
            if ($replyContent.text() === contentPlaceHolder) {
                $replyContent.text('');
            }
        }

        $replyContent.on('focus', function () {
            contentfilter();
        });
        // 输入框输入文字时发送按钮变红 因为ios原生键盘的特点,输入键盘顶部的联想文字时不能触发keyup事件
        // 将keyup事件改成input事件(zhangcongfeng@fang.com 2016-04-21)
        $replyContent.on('input', function () {
            $submit.addClass('active');
            if ($replyContent.text() === '') {
                $submit.removeClass('active');
            }
        });
        // 提交评论
        $submit.on('click', function () {
            var $submitContent = $replyContent.text().trim();
            if (!check($submitContent)) {
                return;
            }
            var url = vars.bbsSite + '?c=bbs&a=ajaxAddComment&city=' + vars.city;
            $.get(url, {
                articleId: vars.articleId,
                toUserBaseInfoId: vars.toUserBaseInfoId,
                commentInfoId: vars.commentInfoId,
                content: $submitContent,
                topicId: vars.topicId
            }, function (data) {
                // 返回success跳回topic页面
                if (data.Content === 'success') {
                    window.location.href = vars.topicBurl + '&r=' + Math.random();
                    // 返回noLogin跳到登陆页
                } else if (data.Content === 'noLogin') {
                    window.location.href = vars.loginBurl;
                } else {
                    $floatAlert.show();
                    $floatText.html(data.Message);
                    hideAlert();
                }
            });
        });
    };
});

