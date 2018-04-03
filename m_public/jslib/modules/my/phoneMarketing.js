/**
 * 个人中心电话营销开启/关闭页面
 * Created by limengyang.bj@fang.com 2018-3-22
 */
define('modules/my/phoneMarketing', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    module.exports = function () {
        // ajax标识
        var inAjax = false;
        var $textInput = $('.textInput');
        // 提示框
        var $showMessDiv = $('.showMessDiv');
        // 其他原因输入文字
        var inputText = '';
        // 其他原因输入文字长度
        var inputLen = 0;
        // 其他原因输入文字最大长度
        var inputMax = 100;
        // 原因 筛选后选项标红
        $('.cstab a').on('click', function () {
            var $this = $(this);
            $this.toggleClass('cur');
        });

        // 其他原因输入
        $textInput.on('input', function () {
            inputText = $textInput.val();
            inputLen = inputText.length;
            if (inputLen > inputMax) {
                // 截取字数
                $textInput.val(inputText.substr(0, inputMax));
                // 重新获取值
                inputText = $textInput.val();
                showPrompt('最多可输入' + inputMax + '字，已超出字数');
            }
        });
        // 显示提示信息
        var showPrompt = function (msg) {
            $showMessDiv.html(msg).show();
            // 延时隐藏
            setTimeout(function () {
                $showMessDiv.hide();
            }, 2000);
        };
        // 关闭电话营销
        $('.btn').on('click', function () {
            if (!inAjax) {
                // 选择原因
                var obj = $('.cstab').find('a.cur');
                var reasonStr = '';
                if (obj.length > 0) {
                    for (var i = 0, len = obj.length; i < len; i++) {
                        if (i === 0) {
                            reasonStr += obj.eq(i).attr('data-id');
                        } else {
                            reasonStr += ',' + obj.eq(i).attr('data-id');
                        }
                    }
                    if (inputText.length > inputMax) {
                        showPrompt('最多可输入' + inputMax + '字，已超出字数');
                    } else {
                        inAjax = true;
                        $.ajax({
                            url: vars.mySite + '?c=my&a=ajaxModifyPhoneMarketing',
                            type: 'post',
                            data: {
                                type: 'add',
                                reasonStr: reasonStr,
                                inputText: inputText
                            },
                            success: function (data) {
                                // 返回成功
                                if (data) {
                                    // 刷新页面
                                    location.reload();
                                } else {
                                    showPrompt('关闭失败，请重试');
                                }
                            },
                            complete: function () {
                                inAjax = false;
                            }
                        });
                    }
                } else {
                    showPrompt('请选择关闭原因');
                }
            }
        });
    };
});