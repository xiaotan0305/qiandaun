define('modules/my/loginByAuthCode', ['jquery', 'modules/my/util'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var util = require('modules/my/util');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    function lginByAuthCodeFn() {}

    lginByAuthCodeFn.prototype = {
        // 初始化
        init: function () {
            var that = this;
            that.sendFlag = false;
            // 发送验证码按钮状态（是否可点）
            that.verifyFlag = false;
            // 手机验证码输入状态（是否输入）
            that.imgFlag = false;
            // 图片验证码输入状态（是否正确）
            that.loginFlag = false;
            // 登陆按钮状态（是否可点）
            that.telNum = undefined;
            // 通过正则的手机号
            that.phoneNum = undefined;
            // 用户输入的手机号
            that.telVerifyNum = undefined;
            // 通过正则的验证码
            that.phoneVerifyNum = undefined;
            // 用户输入的验证码
            that.cookieArr = undefined;
            that.verifyCodeInput = undefined;
            // 用户输入的图片验证码
            that.send = $('#send');
            that.sure = $('#sure');
            that.login = $('#login');
            that.tel = $('#tel');
            that.phoneVerify = $('#phoneVerify');
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');
            that.verify = $('#verify');
            that.secondSend = $('#secondSend');
            that.verifyCode = $('#verifyCode');
            that.close = $('#close');
            that.footer = $('.footer');
            that.otherLoginMethod = $('#otherLoginMethod');
            that.floatLayer = $('.float');
            that.phoneReg = /^1[34578]{1}[0-9]{9}$/;
            that.phoneVerifyReg = /^[0-9]{4}$/;
            that.bindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            var that = this;
            // 检验手机号码
            that.tel.on('blur', function () {
                return that.checkTelFn.call(this, that);
            });
            // 检验手机号码
            that.tel.on('keyup', function () {
                return that.checkTelKeyupFn.call(this, that);
            });
            // 检验手机验证码
            that.phoneVerify.on('keyup', function () {
                return that.checkPhoneVerifyFn.call(this, that);
            });
            // 发送手机验证码按钮单击事件
            that.send.on('click', function () {
                return that.sendMessageClickFn.call(this, that);
            });
            // 关闭弹窗浮层
            that.close.on('click', function () {
                return that.closeFloatFn.call(this, that);
            });
            // 点击改变验证码
            that.verify.on('click', function () {
                return that.clickChangePicFn.call(this, that);
            });
            // 检验图片验证码输入框
            that.verifyCode.on('keyup', function () {
                return that.checkPicInputFn.call(this, that);
            });
            // 浮层确定按钮
            that.sure.on('click', function () {
                return that.clickFloatSureFn.call(this, that);
            });
            // 点击登陆
            that.login.on('click', function () {
                return that.clickLoginFn.call(this, that);
            });
            // 如果上一页是搜房，显示返回按钮；否则显示logo
            if (!(document.referrer.indexOf('.fang.com') > -1)) {
                $('.logoR').show();
                $('.back2').hide();
            }
            // 修复文本框输入键盘弹起遮挡bug
            if ($(window).height() > 450) {
                $('body').css('min-height', $(window).height() + 'px');
            }
            $('footer').show();
            $('#otherLoginMethod').show();
        },
        // 检验电话号码
        checkTelFn: function (obj) {
            // var that = this;//this 指代当前的dom元素 、obj就是外边的that
            var $this = $(this),
                thatObj = obj;
            thatObj.phoneNum = $this.val();
            thatObj.phoneNum = util.stripscript(thatObj.phoneNum);
            $this.val(thatObj.phoneNum);
            if (!thatObj.phoneNum) {
                util.displayLoseFn(3, '你还没有写手机号码喔~', '', thatObj);
                thatObj.send.css('color', '#999').css('border-color', '#999');
                thatObj.telNum = '';
            } else if (thatObj.phoneReg.test(thatObj.phoneNum)) {
                thatObj.send.css('color', '#ff6666').css('border-color', '#ff6666');
                thatObj.sendFlag = true;
                thatObj.telNum = thatObj.phoneNum;
                thatObj.loginStateFn();
            } else {
                util.displayLoseFn(3, '请输入正确的手机号~', '', thatObj);
                thatObj.send.css('color', '#999').css('border-color', '#999');
                thatObj.sendFlag = false;
                thatObj.telNum = '';
            }
        },
        // 检验电话号码keyup
        checkTelKeyupFn: function (obj) {
            // var that = this;//this 指代当前的dom元素 、obj就是外边的that
            var $this = $(this),
                thatObj = obj;
            thatObj.phoneNum = $this.val();
            thatObj.phoneNum = util.stripscript(thatObj.phoneNum);
            $this.val(thatObj.phoneNum);
            if (thatObj.phoneReg.test(thatObj.phoneNum)) {
                thatObj.send.css('color', '#ff6666').css('border-color', '#ff6666');
                thatObj.sendFlag = true;
                thatObj.telNum = thatObj.phoneNum;
                thatObj.loginStateFn();
            } else {
                thatObj.send.css('color', '#999').css('border-color', '#999');
                thatObj.sendFlag = false;
                thatObj.telNum = '';
            }
        },
        // 检验手机验证码
        checkPhoneVerifyFn: function (obj) {
            var $this = $(this),
                thatObj = obj;
            thatObj.phoneVerifyNum = $this.val();
            thatObj.phoneVerifyNum = util.stripscript(thatObj.phoneVerifyNum);
            $this.val(thatObj.phoneVerifyNum);
            if (!thatObj.phoneVerifyReg.test(thatObj.phoneVerifyNum)) {
                thatObj.verifyFlag = false;
                thatObj.telVerifyNum = '';
                thatObj.login.css('background-color', '#999');
                thatObj.loginFlag = false;
            } else {
                thatObj.verifyFlag = true;
                thatObj.telVerifyNum = thatObj.phoneVerifyNum;
                thatObj.login.css('background-color', '#df3031');
                thatObj.loginStateFn();
            }
        },
        // 发送手机验证码按钮单击事件
        sendMessageClickFn: function (obj) {
            var thatObj = obj;
            if (thatObj.sendFlag) {
                // 验证码弹窗
                thatObj.secondSend.show();
                thatObj.sure.css('background-color', '#999');
                thatObj.verifyCode.val('');
                thatObj.changeVerifyFn(Math.random());
            }
        },
        // 关闭弹窗浮层
        closeFloatFn: function (obj) {
            var thatObj = obj;
            thatObj.secondSend.hide();
        },
        // 点击改变验证码
        clickChangePicFn: function (obj) {
            var thatObj = obj;
            thatObj.changeVerifyFn(Math.random());
        },
        // 检验图片验证码输入框
        checkPicInputFn: function (obj) {
            var thatObj = obj;
            thatObj.verifyCodeInput = thatObj.verifyCode.val();
            thatObj.verifyCodeInput = util.stripscript(thatObj.verifyCodeInput);
            thatObj.verifyCode.val(thatObj.verifyCodeInput);
            if (thatObj.verifyCodeInput) {
                thatObj.sure.css('background-color', '#df3031');
            } else {
                thatObj.sure.css('background-color', '#999');
            }
        },
        // 浮层确定按钮
        clickFloatSureFn: function (obj) {
            var thatObj = obj;
            thatObj.verifyCodeInput = thatObj.verifyCode.val();
            if (thatObj.verifyCodeInput) {
                $.get(vars.mySite + '?c=my&a=checkCode&code=' + thatObj.verifyCodeInput, function (verifyCode) {
                    if (verifyCode === '2') {
                        util.displayLoseFn(3, '你还没有写验证码喔~', '', thatObj);
                    } else if (verifyCode === '1') {
                        thatObj.secondSend.hide();
                        $.get(vars.mySite + '?c=my&a=loginByAuthCodeCheck&phone=' + thatObj.telNum, function (dataPara) {
                            var data = dataPara;
                            if (!data) {
                                thatObj.sendFlag = false;
                                thatObj.imgFlag = true;
                                util.displayLoseFn(3, '验证码已发送', '', thatObj);
                                thatObj.numLoseFn(60);
                                thatObj.send.css('color', '#999').css('border-color', '#999');
                            } else {
                                data = JSON.parse(data);
                                util.displayLoseFn(3, data.error_reason, '', thatObj);
                            }
                        });
                    } else {
                        util.displayLoseFn(3, '验证码不正确', '', thatObj);
                        thatObj.changeVerifyFn(Math.random());
                    }
                });
            }
        },
        // 验证码60s倒计时
        numLoseFn: function (numPara) {
            var num = numPara;
            var that = this;
            that.verifyTimer = setInterval(function () {
                num -= 1;
                that.send.text('重新发送(' + num + ')');
                if (num <= 0) {
                    clearInterval(that.verifyTimer);
                    that.sendFlag = true;
                    that.send.text('发送验证码').css('color', '#ff6666').css('border-color', '#ff6666');
                }
            }, 1000);
        },
        // 改变验证码
        changeVerifyFn: function (num) {
            var that = this;
            that.verify.attr('src', vars.mySite + '?c=my&a=authCode&r=' + num);
        },
        // 登陆按钮状态
        loginStateFn: function () {
            var that = this;
            if (that.telNum && that.verifyFlag && that.imgFlag) {
                that.login.css('background-color', '#df3031');
                that.loginFlag = true;
            }
        },
        // 点击登陆
        clickLoginFn: function (obj) {
            var thatObj = obj;
            if (thatObj.loginFlag) {
                thatObj.floatLayer.show();
                if (!thatObj.phoneVerifyReg.test(thatObj.telVerifyNum)) {
                    util.displayLoseFn(3, '验证码不正确', '', thatObj);
                    thatObj.login.css('background-color', '#999');
                    thatObj.verifyFlag = false;
                } else {
                    $.get(vars.mySite + '?c=my&a=checkLoginbyAuthCode&phone=' + thatObj.telNum + '&verify=' + thatObj.telVerifyNum, function (data) {
                        if (data === '1') {
                            util.displayLoseFn(3, '登录成功', vars.burl, thatObj);
                        } else {
                            util.displayLoseFn(3, '系统繁忙，请重试', '', thatObj);
                            thatObj.login.css('background-color', '#999');
                            thatObj.phoneVerify.val('');
                            thatObj.telVerifyNum = '';
                        }
                    });
                }
            } else {
                util.displayLoseFn(3, '验证码不正确', '', thatObj);
                thatObj.login.css('background-color', '#999');
                thatObj.verifyFlag = false;
                thatObj.phoneVerify.val('');
            }
        }
    };
    var lginByAuthCode = new lginByAuthCodeFn();
    lginByAuthCode.init();
    module.exports = lginByAuthCodeFn;
});