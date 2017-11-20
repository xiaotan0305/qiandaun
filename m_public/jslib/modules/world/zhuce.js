/**
 * @file 海外验证码
 * @author fcwang(wangfengchao@fang.com)
 */
define('modules/world/zhuce', ['jquery', 'modules/world/yhxw', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var verifycode = require('verifycode/1.0.0/verifycode');
    var phonestr, codestr;
    module.exports = function () {
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwregister';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 活动报名页-姓名
            'vmw.name': '',
            // 活动报名页-手机号
            'vmw.phone': ''
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        // 验证姓名合法
        var checkUserName = function () {
            if ($('#username').val()) {
                $('#nametext').hide();
                return true;
            }
            $('#nametext').show();
            return false;
        };
        $('#username').on('focus', function () {
            $('#nametext').hide();
        });
        // 检测手机号格式
        var checkPhone = function () {
            // 手机号格式状态为正确
            if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test($('#phoneNum').val())) {
                $('#phonetext').hide();
                return true;
                // 手机号格式状态为错误
            }
            $('#phonetext').show();
            return false;
        };
        $('#phoneNum').on('focus', function () {
            $('#phonetext').hide();
        });
        // 限制手机号只能输入11位，并且合法时发送验证码变为可点状态
        $('#phoneNum').on('input', function () {
            // 限制为11位数字
            if ($('#phoneNum').val().length > 11) {
                this.value = this.value.substr(0, 11);
            }
            // 手机号合法
            if (/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test($('#phoneNum').val())) {
                $('#sendcode').removeClass('disabled');
            } else {
                $('#sendcode').addClass('disabled');
            }
        });
        // 限制验证码只能输入4位
        $('#code').on('input', function () {
            if ($('#code').val().length > 4) {
                this.value = this.value.substr(0, 4);
            }
        });
        // 检测验证码格式
        var checkCode = function () {
            if (!$('#code').val()) {
                alert('请输入验证码');
                return false;
            } else if (/^[0-9]{4}$/.test($('#code').val())) {
                return true;
            }
            alert('请输入四位验证码');
            return false;
        };
        // 60秒倒计时
        var wait = 60;
        function time(o) {
            if (wait == 0) {
                o.val('发送验证码').removeClass('disabled');
                wait = 60;
            } else {
                o.val( wait + 's').addClass('disabled');
                wait--;
                setTimeout(function () {
                    time(o);
                }, 1000);
            }
        }
        // 点击发送验证码
        $('#sendcode').on('click', function () {
            var that = $(this);
            // 如果手机号格式正确
            if (checkPhone() && wait == 60) {
                // 请求获取验证码
                phonestr = $('#phoneNum').val();
                verifycode.getPhoneVerifyCode(phonestr,
                    function () {
                        time(that);
                    }, function () {
                        alert('发送失败，请重新发送');
                    });
            }
        });
        // 点击立即注册按钮
        $('#subRegist').on('click', function () {
            if (checkUserName() && checkPhone() && checkCode()) {
                phonestr = $('#phoneNum').val();
                codestr = $('#code').val();
                verifycode.sendVerifyCodeAnswer(phonestr, codestr,
                    function () {
                        // 提交这个表单内的内容。提交完之后页面重新刷新
                        var jsondata = {
                            username: $('#username').val(),
                            phone: $('#phoneNum').val()
                        };
                        var ajaxUrl = vars.worldSite + '?c=world&a=zhuceSub&random=' + Math.random();
                        $.get(ajaxUrl, jsondata,
                            function (data) {
                                var result = $.parseJSON(data);
                                if (result == '1') {
                                    $('#registSuccess').css('display', 'block');
                                    setTimeout(function () {
                                        location.reload();
                                    },2000);
                                    // 注册会员埋码
                                    // 姓名
                                    maiMaParams['vmw.name'] = encodeURIComponent(jsondata.username);
                                    // 手机号
                                    maiMaParams['vmw.phone'] = jsondata.phone;
                                    // 添加用户行为分析-埋码
                                    yhxw({type: 28, pageId: pageId, params: maiMaParams});
                                }
                            }
                        );
                    },
                    function () {
                        alert('验证码错误，请重新输入');
                    }
                );
            }
        });
    };
});