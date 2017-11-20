define('modules/my/bankCardDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
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
                    $('#verifyCodeSend').removeAttr('disabled').val('获取验证码');
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
            var BankID = $('#BankID').val();
            var CardNumber = $('#CardNumber').val();
            var Name = $('#Name').val();
            var VerifyCode = $('#VerifyCode').val();
            var returnUrl = $('#returnUrl').val();
            var reg = /^\d{15,21}$/g;
            var kongge = /^\s+/;
            if (CardNumber.length === 0) {
                alert('银行卡号不能为空');
                return false;
            }

            if (!reg.test(CardNumber)) {
                alert('请输入正确的银行卡号');
                return false;
            }
            if (Name.length === 0) {
                alert('姓名不能为空');
                return false;
            }
            if (kongge.test(Name)) {
                alert('姓名不能为空格');
                return false;
            }
            if (VerifyCode.length === 0) {
                alert('验证码不能为空');
                return false;
            }

            $.ajax({
                type: 'post',
                url: '/my/?a=addBankCard&city={/literal}{$cityInfo.thiscity.encity}{literal}',
                data: {
                    BankID: BankID,
                    CardNumber: CardNumber,
                    Name: Name,
                    VerifyCode: VerifyCode
                },
                success: function (data) {
                    var obj = JSON.parse(data);
                    if (obj.result === '003') {
                        alert('银行卡添加成功');

                        window.location.href = returnUrl;
                        return true;
                    }
                    if (obj.result === '001') {
                        alert('验证码错误');
                        return false;
                    }
                    if (obj.result === '002') {
                        // 后台自定义的错误代号
                        alert('此银行卡已经添加过，无需再添加');
                        return false;
                    }
                    if (obj.result === '004') {
                        alert('银行卡添加失败');
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