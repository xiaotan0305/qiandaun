define('modules/my/userPayPasswordSetPage', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var city = vars.city;
        var $ = require('jquery');
        $('#verifyCodeSend').click(function () {
            $(this).attr('disabled', true);
            var wait = 60;
            $('#verifyCodeSend').val(wait + '秒后重新发送');

            function timer() {
                if (wait > 0) {
                    setTimeout(function () {
                        wait--;
                        $('#verifyCodeSend').val(wait + '秒后重新发送');
                        timer();
                    }, 1000);
                } else {
                    $('#verifyCodeSend').removeAttr('disabled');
                    $('#verifyCodeSend').val('获取验证码');
                }
            }
            timer();
            $.ajax({
            // 后台获取当前登录用户手机号，不用传参
                type: 'post',
                url: '/my/?a=ajaxVerifyCodeSend',
                success: function (res) {
                    if (!res) {
                        alert('验证码发送失败，请稍后再试');
                    }
                },
                error: function () {
                    alert('验证码发送失败，请稍后再试');
                }
            });
        });
        function checkForm() {
            var Password = $('#Password').val();
            var ConfirmPassword = $('#ConfirmPassword').val();
            var VerifyCode = $('#VerifyCode').val();
            var reg = /[`~!@#$%^&*()_+<>?:'{},.\/;'[\]]/im;
            if (Password.length === 0) {
                alert('密码不能为空');
                $('#Password').focus();
                return false;
            }
            if (Password.length > 0 && Password.length < 6) {
                alert('密码不能少于6位');
                $('#Password').focus();
                return false;
            }
            if (Password.length > 20) {
                alert('密码不能长于20位');
                $('#Password').focus();
                return false;
            }
            if (reg.test(Password)) {
                alert('密码含有非法特殊字符');
                $('#Password').focus();
                return false;
            }
            if (ConfirmPassword === '再次输入密码' || ConfirmPassword.length === 0) {
                alert('确认密码不能为空');
                $('#ConfirmPassword').focus();
                return false;
            }
            if (ConfirmPassword !== Password) {
                alert('两次输入密码不一致');
                $('#ConfirmPassword').focus();
                return false;
            }
            if (VerifyCode.length === 0) {
                alert('验证码不能为空');
                $('#VerifyCode').focus();
                return false;
            }
            $.ajax({
                type: 'post',
                url: '/my/?a=userPayPasswordSet&city=' + city,
                data: {
                    Password: Password,
                    ConfirmPassword: ConfirmPassword,
                    VerifyCode: VerifyCode
                },
                success: function (data) {
                    var obj = JSON.parse(data);
                    if (obj.result === '003') {
                        alert('密码设置成功');
                        window.location.href = '/my/?a=payindex&city=' + city;
                        return true;
                    }
                    if (obj.result === '001') {
                        alert('两次密码不一致');
                        return false;
                    }
                    if (obj.result === '002') {
                        // 后台自定义的错误代号
                        alert('验证码错误');
                        return false;
                    }
                    if (obj.result === '004') {
                        alert('密码设置失败');
                        return false;
                    }
                    if (obj.result === '005') {
                        alert('密码含有非法特殊字符');
                        return false;
                    }
                }
            });
        }
        $('#tijiao').on('click', function () {
            checkForm();
        });
    };
});