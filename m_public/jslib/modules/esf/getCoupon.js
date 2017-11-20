define('modules/esf/getCoupon', ['jquery'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    function couponFn() {
    }
    couponFn.prototype = {
        init: function () {
            var that = this;
            that.check = $('#check');
            // 获取验证码按钮
            that.submit = $('#submit');
            // 领取奖券按钮
            that.viewBtn = $('#viewBtn');
            // 查看如何领用奖券按钮,是一张图片
            that.closeBtn = $('.closeBtn');
            // 关闭按钮,有3个
            that.pop1 = $('#pop1');
            // 领用后的弹窗
            that.pop2 = $('#pop2');
            // 如何使用优惠券提示
            that.pop3 = $('#pop3');
            // 提示弹窗
            that.telPhone = $('#telPhone');
            // 手机号input
            that.checkCode = $('#checkCode');
            // 验证码input
            that.sendPhoneCodeFlag = false;
            // 是否发送了手机验证码的标记
            that.floatLayer = $('.float');
            // 浮层
            that.picVerifyDiv = $('#picVerifyDiv');
            // 图片验证码区域
            that.picVerifyCodeImg = $('#picVerifyCodeImg');
            // 图片验证码
            that.verifyCode = $('#verifyCode');
            // 图片验证码input
            that.picPrompt = $('#picPrompt');
            // 图片验证码区域提示行
            that.submitVerifyCodeBtn = $('#submitVerifyCodeBtn');
            // 提交图片验证码按钮
            that.close = $('.close');
            that.picCodeFlag = false;
            // 图片验证码的flag
            if (vars.source) {
                that.source = vars.source;
            }else {
                that.source = 'wap-sf';
            }
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            // 发送验证码
            that.check.on('click', function () {
                that.listenSendCheckCode.call(that);
            });
            // 点击发放优惠券
            that.submit.on('click', function () {
                that.listenGetCoupon.call(that);
            });
            function handle() {
                that.hidePop(this);
            }
            for (var i = 0;i < that.closeBtn.length;i++) {
                $(that.closeBtn[i]).on('click',handle);
            }
            that.viewBtn.on('click', function () {
                that.floatLayer.show();
                that.pop2.show();
            });
            // 更换图片验证码
            that.picVerifyCodeImg.on('click', function () {
                $(this).attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
            });
            // 关闭图片验证码输入框
            that.close.on('click', function () {
                that.picVerifyDiv.hide();
                that.verifyCode.val('');
            });
            // 图片验证码按钮颜色切换
            that.verifyCode.on('input', function () {
                var code = $(this).val();
                if (code) {
                    that.submitVerifyCodeBtn.css('background-color', '#DF3031');
                    that.picCodeFlag = true;
                } else {
                    that.submitVerifyCodeBtn.css('background-color', '#999');
                    that.picCodeFlag = false;
                }
            });
            // 图片验证码提交
            that.submitVerifyCodeBtn.on('click', function () {
                return that.sendVerify.call(that);
            });
        },
        // 监听发送验证码事件
        listenSendCheckCode: function () {
            var that = this;
            // 发送过验证码在倒数60s内都不允许点
            if (that.sendPhoneCodeFlag) {
                return false;
            }
            if (!that.telPhone.val()) {
                that.showPrompt('手机号不能为空');
                return false;
            }
            if (!that.verifyTelphone()) {
                that.showPrompt('手机号格式不正确');
                return false;
            }
            if (!that.sendPhoneCodeFlag && that.telPhone.val()) {
                that.picVerifyCodeImg.trigger('click');
                that.picVerifyDiv.show();
            }
        },
        // 监听点击领取按钮
        listenGetCoupon: function () {
            var that = this;
            var reg = new RegExp('^[0-9]{4}$');
            if (!that.verifyTelphone()) {
                that.showPrompt('请输入正确的手机号');
                return false;
            }
            if (!reg.test(that.checkCode.val())) {
                that.showPrompt('请输入正确的验证码');
                return false;
            }
            that.floatLayer.show();
            var url = vars.esfSite + '?c=esf&a=ajaxSendCoupon';
            var data = {telPhone: that.telPhone.val(), checkCode: that.checkCode.val(), source: that.source};
            $.get(url, data, function (mes) {
                var jsonData = JSON.parse(mes);
                switch (jsonData.errorCode) {
                    // 1,2都是显示Pop1
                    case '1' :
                    case '2' :
                        that.floatLayer.show();
                        that.pop1.show();
                        break;
                    default :
                        that.showPrompt(jsonData.errorMessage);
                }
            });
        },
        sendVerify: function () {
            var that = this;
            if (!that.picCodeFlag) {
                return false;
            }
            // 发送验证码动画
            that.showPrompt('验证码发送中');
            var url = vars.mySite + '?c=my&a=ajaxSendVerifyCode';
            $.get(url, {
                tel: that.telPhone.val(),
                code: that.verifyCode.val()
            }, function (dataPara) {
                var data = JSON.parse(dataPara);
                switch (parseInt(data.return_result)) {
                    case 1:
                        that.verifyCode.val('');
                        that.picVerifyDiv.hide();
                        that.showPrompt(data.error_reason);
                        break;
                    case 2:
                    case 3:
                        that.verifyCode.val('');
                        that.showPrompt(data.error_reason);
                        $('#picVerifyCodeImg').attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
                        break;
                    default:
                        that.verifyCode.val('');
                        that.showPrompt(data.error_reason);
                        break;
                }
                that.sendPhoneCodeFlag = true;
                that.timeRecorder(60);
            });
        },
        // 关闭弹窗
        hidePop: function (pop) {
            var that = this;
            that.floatLayer.hide();
            $(pop).parent().hide();
        },
        // 检测手机号
        verifyTelphone: function () {
            var that = this;
            return /^1[34578]{1}[0-9]{9}$/.test(that.telPhone.val());
        },
        // 显示提示框
        showPrompt: function (keyWords) {
            var that = this;
            that.pop3.find('div').html(keyWords);
            that.floatLayer.show();
            that.pop3.show();
        },
        timeRecorder: function (time) {
            var that = this;
            var handle = setInterval(function () {
                that.check.val('重新发送(' + time + ')');
                if (time === 0) {
                    clearInterval(handle);
                    that.check.val('发送验证码');
                    that.sendPhoneCodeFlag = false;
                }
                time--;
            },1000);
        }
    };
    var couponObj = new couponFn();
    couponObj.init();
    module.exports = couponFn;
});
