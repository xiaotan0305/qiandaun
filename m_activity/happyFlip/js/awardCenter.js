/*
 * @file: awardCenter
 * @author: yangfan
 * @Create Time: 2016-05-30 15:08:47
 */
$(function () {
    'use strict';

    /**
        phoneRegEx 电话号码正则,
        allowGet 可以请求短信验证码标识,
        smsLogin 短信验证码 js 对象,
        smsTimer 请求 timer ,
        smsDelay 请求间隔,
        smsPhone 电话号码输入框 jq 对象,
        smsBtn 发送验证码 jq 对象,
        smsPhoneValue 电话号码值,
        smsCode 验证码输入框 jq 对象,
        smsCodeValue 验证码值,
        loginBtn 登录按钮 jq 对象;
     */
    var phoneRegEx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i,
        allowGet = true,
        smsLogin = window.smsLogin,
        smsTimer = null,
        smsDelay = 60,
        smsPhone = $('.js_sms_phone'),
        smsBtn = $('.btn-ok'),
        smsPhoneValue = '',
        smsCode = $('.js_sms_code'),
        smsCodeValue = '',
        loginBtn = $('.btn-pay');

    var formData = {};

    var realPhone = smsPhone.val();
    smsPhone.val(realPhone.substr(0, 3) + '****' + realPhone.substr(7));

    function formCheck() {
        var username = $('input[name="username"]').val();
        if (!username) {
            showMsg('请输入领奖人姓名！');
            return false;
        }

        var handphone = $('input[name="handphone"]').val();
        if (!phoneRegEx.test(handphone)) {
            showMsg('请输入正确的领奖人手机号！');
            return false;
        }

        var address = $('textarea[name="address"]').val();
        if (!address) {
            showMsg('请输入领奖人详细地址！');
            return false;
        }
        formData = {
            username: encodeURIComponent(encodeURIComponent(username)),
            handphone: handphone,
            address: encodeURIComponent(encodeURIComponent(address))
        };
        return true;
    }

    // 获取url中的参数
    function getUrlParam(name) {
        // 构造一个含有目标参数的正则表达式对象
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        // 匹配目标参数
        var r = window.location.search.substr(1).match(reg);
        // 返回参数值
        if (r !== null) {
            return unescape(r[2]);
        }
        return null;
    }

    function requestAjax() {
        var url = 'http://' + window.location.hostname + '/huodongAC.d?class=FanfanleHc&m=updateWinPhone&lotteryId=' + getUrlParam('lotteryId') + '&winId=' + getUrlParam('winId');
        formData.phone = $('input[name="phone"]').val();
        formData.checkcode = $('input[name="checkcode"]').val();
        $.get(url, formData, function (data) {
            var dataRoot = JSON.parse(data).root;
            if (dataRoot.status === 'fail') {
                showMsg(dataRoot.message);
            } else if (dataRoot.status === 'success') {
                showMsg(dataRoot.message);
                urlReload('http://' + window.location.hostname + '/huodongAC.d?class=FanfanleHc&m=getWinList&lotteryId=' + getUrlParam('lotteryId'));
            } else {
                showMsg(dataRoot.message);
            }
        });
    }

    /**
     * 进行跳转，避免读取缓存。
     */
    function urlReload(url) {
        window.location.href = url || window.location.href + '&r=' + Math.random();
    }

    /**
     * 更新验证码倒计时时间
     * 1、更改是否可以请求验证码标识
     * 2、更改倒计时时间
     * 3、重置时间、状态等
     */
    function updateSmsDelay() {
        allowGet = false;
        smsBtn.html(getDelayText(smsDelay));
        clearInterval(smsTimer);
        smsTimer = setInterval(function () {
            smsDelay--;
            smsBtn.html(getDelayText(smsDelay));
            if (smsDelay < 0) {
                clearInterval(smsTimer);
                smsBtn.html('发送验证码');
                smsDelay = 60;
                allowGet = true;
            }
        }, 1000);

        function getDelayText(second) {
            return '重新发送(' + (100 + second + '').substr(1) + ')';
        }
    }

    /**
     * 点击请求验证码按钮，根据状态给予相应提示
     * 最后发送验证码，成功，防止恶意请求，延迟一分钟倒计时。失败，提示。
     */
    smsBtn.on('click', function () {
        if (!allowGet) {
            showMsg('请一分钟以后再试');
            return false;
        }
        smsPhoneValue = realPhone.trim();

        if (!smsPhoneValue) {
            showMsg('手机号不能为空');
            return false;
        }

        if (!phoneRegEx.test(smsPhoneValue)) {
            showMsg('手机号格式不正确');
            return false;
        }

        smsLogin.send(smsPhoneValue, function () {
            showMsg('验证码已发送,请注意查收');
            updateSmsDelay();
        }, function (err) {
            showMsg(err);
        });
        return false;
    });

    /**
     * 点击登录按钮，根据状态给予提示
     * 最后检查验证码，登录成功，跳转，或提示错误信息。
     */
    loginBtn.on('click', function () {
        if (!formCheck()) {
            return false;
        }

        smsPhoneValue = realPhone.trim();
        if (!smsPhoneValue || !phoneRegEx.test(smsPhoneValue)) {
            showMsg('手机号为空或格式不正确');
            return false;
        }
        smsCodeValue = smsCode.val().trim();
        if (!smsCodeValue || smsCodeValue.length < 4) {
            showMsg('验证码为空或格式不正确');
            return false;
        }

        smsLogin.check(smsPhoneValue, smsCodeValue, function () {
            requestAjax();
        }, function (err) {
            showMsg(err);
        });
        return false;
    });

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    var msgBox = $('.msg'),
        msgBoxTimer = null;

    function showMsg(pText, pTime, callback) {
        var text = pText || '信息有误！',
            time = pTime || 1500;
        msgBox.show().css({
            position: 'absolute',
            top: $(document).scrollTop() + $(document).height() / 4
        }).find('p').html(text);
        clearTimeout(msgBoxTimer);
        msgBoxTimer = setTimeout(function () {
            msgBox.hide();
            callback && callback();
        }, time);
    }
});
