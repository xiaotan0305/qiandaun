/**
 * Modified by LXM on 15.9.17
 */
define('modules/jiaju/lgaddcom', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // $('.head-icon a').attr('href', vars.back);
        var $p1 = $('#p1');
        var $text2 = $('#text2');
        var $sendCom = $('#sendCom');
        // 显示输入字数
        var changnum = function () {
            var textnum = $text2.val().length;
            $p1.text(textnum);
            if (textnum) {
                $sendCom.addClass('active');
                textnum > 150 && alert('请不要超过150字');
            } else {
                $sendCom.removeClass('active');
            }
        };
        // 校验输入字数
        $text2.on('input change', function () {
            changnum();
        });
        // 提交评论
        var isAjaxing = 0;
        $sendCom.on('click', function () {
            if (!isAjaxing && $(this).hasClass('active')) {
                isAjaxing = 1;
                var i = {
                    content: encodeURIComponent($text2.val()),
                    other: 'c'
                };
                var k = vars.ajax + '&r=' + Math.random();
                $.get(k, i, function (q) {
                    isAjaxing = 0;
                    alert(q.message);
                    if (q.result === '0') {
                        window.location.href = vars.back + '&r=' + Math.random();
                    }
                });
            }
        });
    };
});