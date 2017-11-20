define('modules/my/userPayPasswordChangePage', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var city = vars.city;

        function checkForm() {
            var curpassword = $('#curpassword').val();
            var newpassword = $('#newpassword').val();
            var confirmpassword = $('#confirmpassword').val();
            var returnUrl = $('#returnUrl').val();
            var reg = /[`~!@#$%^&*()_+<>?:'{},.\/;'[\]]/im;
            if (curpassword.length === 0) {
                alert('请输入当前支付密码');
                $('#curpassword').focus();
                return false;
            }
            if (newpassword.length === 0) {
                alert('新密码不能为空');
                $('#newpassword').focus();
                return false;
            }
            if (newpassword.length > 0 && newpassword.length < 6) {
                alert('密码不能少于6位');
                $('#newpassword').focus();
                return false;
            }
            if (newpassword.length > 20) {
                alert('密码不能长于20位');
                $('#newpassword').focus();
                return false;
            }
            if (reg.test(newpassword)) {
                alert('密码含有非法特殊字符');
                $('#newpassword').focus();
                return false;
            }
            if (confirmpassword === '再次输入密码' || confirmpassword.length === 0) {
                alert('确认密码不能为空');
                $('#confirmpassword').focus();
                return false;
            }
            if (confirmpassword !== newpassword) {
                alert('两次输入密码不一致');
                $('#confirmpassword').focus();
                return false;
            }

            $.ajax({
                type: 'post',
                url: '/my/?a=userPayPasswordChange&city=' + city,
                data: {
                    OldPassword: curpassword,
                    NewPassword: newpassword,
                    ConfirmPassword: confirmpassword
                },
                success: function (data) {
                    var obj = JSON.parse(data);
                    if (obj.result === '003') {
                        alert('密码修改成功');
                        window.location.href = returnUrl;
                        return true;
                    }
                    if (obj.result === '001') {
                        alert('当前密码不正确');
                        return false;
                    }
                    if (obj.result === '002') {
                        // 后台自定义的错误代号
                        alert('两次密码输入不一致');
                        return false;
                    }
                    if (obj.result === '004') {
                        alert('密码设置失败');
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