/**
 * @Author: 坤鹏
 * @Date: 2015/12/14 17:04
 * @description: car.js
 * @Last Modified by:   **
 * @Last Modified time:
 */
$(function () {
    'use strict';
    // 自定义弹层
    var tanceng = $('#tancheng'),
        closeTC = $('#closeTC'),
        content = $('#content');
    closeTC.on('click', function () {
        tanceng.hide();
    });
    // 设置弹层宽高
    var bg3 = $('.bg3');
    bg3.css('height', $(document.body).height());
    var wheelLotteryId = $('#lotteryId').val();
    var isPLogin = parseInt($('#isPLogin').val());
    var isZXApp = parseInt($('#isZXApp').val());
    $('#receive1').on('click', function () {
        if (!isPLogin) {
            $('#gameResult').hide();
            $('#signOn').show();
        } else {
            var couponCount = parseInt($('#privilege').html());
            var jifenCount = parseInt($('#score').html());
            var giftCount = couponCount + jifenCount;
            var url = '/jiaju/?c=jiajuact&a=ajaxCarGameGetGift&cID=' + window.cID + '&jf=' + window.jf;
            $.get(url, function (data) {
                var issuccess = data.issuccess,
                    uPhone = data.uPhone,
                    message = data.message;
                if (issuccess && issuccess === 'T') {
                    $('#gameResult').hide();
                    $('#phone').html(uPhone);
                    $('#getSuccess').show();
                } else {
                    $('#gameResult').hide();
                    $('#secondGet').show();
                }
            });
        }
    });
    var timer = null;

    // 获取验证码
    var getCode = $('#btn0');
    // 设置获取验证码开关
    var allowGet = true;
    var timeCount = 60;

    function toDou(num) {
        return num < 10 ? '0' + num : num;
    }

    function updateTime() {
        allowGet = false;
        getCode.html('重新发送(' + toDou(timeCount) + ')');
        clearInterval(timer);
        timer = setInterval(function () {
            timeCount--;
            getCode.html('重新发送(' + toDou(timeCount) + ')');
            if (timeCount < 0) {
                clearInterval(timer);
                getCode.html('获取验证码');
                timeCount = 60;
                allowGet = true;
            }
        }, 1000);
    }

    // 获取手机验证码
    var phone = $('#inpTel');
    var mobileReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
    getCode.on('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (allowGet) {
            if (!mobileReg.test(phone.val())) {
                content.html('请输入正确格式的手机号~');
                tanceng.show();
                return;
            }
            getPhoneVerifyCode(phone.val(),
                function () {
                    updateTime();
                },
                function () {
                    clearInterval(timer);
                    getCode.html('获取验证码');
                    timeCount = 60;
                    allowGet = true;
                }
            );
        }
    });
    var verify = $('#verifyCode'),
        sure = $('#sure');
    verify.on('input', function () {
        var len = $(this).val().length;
        if (len === 4) {
            sure.css('background-color', 'rgb(218, 42, 42)');
        } else {
            sure.css('background-color', 'rgb(153, 153, 153)');
        }
    });
    // 提交验证码
    var loginBtn = $('#receive');
    var inputCode = $('#captcha');
    loginBtn.on('click', function () {
        if (!phone.val().trim()) {
            content.html('手机号不能为空~');
            tanceng.show();
            return;
        }
        if (!mobileReg.test(phone.val())) {
            content.html('请输入正确格式的手机号~');
            tanceng.show();
            return;
        }
        if (!inputCode.val().trim()) {
            content.html('验证码不能为空~');
            tanceng.show();
            return;
        }
        sendVerifyCodeAnswer(phone.val(), inputCode.val(),
            function () {
                var couponCount = parseInt($('#privilege').html());
                var jifenCount = parseInt($('#score').html());
                var giftCount = couponCount + jifenCount;
                var url = '/jiaju/?c=jiajuact&a=ajaxCarGameGetGift&cID=' + window.cID + '&jf=' + window.jf;
                $.get(url, function (data) {
                    var issuccess = data.issuccess,
                        uPhone = data.uPhone,
                        message = data.message;
                    if (issuccess && issuccess === 'T') {
                        $('#signOn').hide();
                        $('#phone').html(uPhone);
                        $('#getSuccess').show();
                    } else {
                        $('#signOn').hide();
                        $('#secondGet').show();
                    }
                });
            }, function () {
                content.html('验证码错误，请重新输入~');
                tanceng.show();
            });
    });


    $('.returnBtn').on('click', function () {
        window.location.href = window.location.origin + '/jiaju/?c=jiajuact&a=CarGame&source=jiajurmhd';
    });
    $('#close').on('click', function () {
        $('#secondSend').hide();
        sure.css('background-color', 'rgb(153, 153, 153)');
    });
    $('#changeBtn,#playEnd').on('click', function () {
        if (isZXApp) {
            window.location.href = location.protocol + '//m.store.fang.com/index.html?from=saiche';
        }else {
            window.location.href = '/jiaju/?c=jiajuact&a=app&company=0100';
        }

    });
    $('#againBtn2').on('click', function () {
        window.location.href = window.location.origin + '/jiaju/?c=jiajuact&a=CarGame&source=jiajurmhd';
    });
    $('#playAgain').on('click', function () {
        location.reload();
    });
    // 游戏规则
    $('#yxgz').on('click', function () {
        $('#yxgz').hide();
        $('#zk').show();
    });
    $('#zk').on('click', function () {
        $('#zk').hide();
        $('#yxgz').show();
    });
});
