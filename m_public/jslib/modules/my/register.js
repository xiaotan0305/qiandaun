/**
 * Created by fang on 2015/7/28.
 */
define('modules/my/register', ['jquery', 'modules/my/util'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery'),
        util = require('modules/my/util');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    function registerFn() {}

    registerFn.prototype = {
        init: function () {
            var that = this;
            that.registerPageEl = $('#registerPage');
            // 注册页面
            that.header = $('#header');
            // 头
            // 在footer中
            that.otherLoginMethod = $('#otherLoginMethod');
            // 其他登录方式qq微博
            that.footer = $('.footer');
            that.protocol = $('#protocol');
            // 协议页
            that.tel = $('#tel');
            // 电话input
            that.prompt = $('#prompt');
            // 提示行
            that.sendIdentifyingCode = $('#sendIdentifyingCode');
            // 发送验证码按钮
            that.picVerify = $('#picVerify');
            // 图片验证码区域
            that.submitVerifyCode = $('#submitVerifyCode');
            // 提交图片验证码按钮
            that.verifyCode = $('#verifyCode');
            // 图片验证码input
            that.identifyingCode = $('#identifyingCode');
            // 手机验证码
            that.password = $('#password');
            that.registerBtn = $('#registerBtn');
            // 注册按钮
            that.pwdFlag = false;
            // 各个字段通标识
            that.phoneCodeFlag = false;
            that.phoneFlag = false;
            that.sendPhoneCodeFlag = false;
            // 是否发送了手机验证码
            that.protocolStatusFlag = true;
            that.picCodeFlag = false;
            // 是否输入了图片验证码中的验证码
            that.telNumber = '';
            that.sendIdentifyingCode.css('color', '#999').css('border', '1px solid #999');
            that.submitVerifyCode.css('background-color', '#999');
            that.back = $('.back');
            // 协议页返回按钮
            that.picVerifyCode = $('#picVerifyCode');
            // 图片验证码区域
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');
            that.close = $('.close');
            that.picPrompt = $('#picPrompt');
            that.seeProtocol = $('#seeProtocol');
            that.back = $('#back');
            that.switchPwd = $('#switchPwd');
            that.protocolStatus = $('#protocolStatus');
            that.floatLayer = $('.float');
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            that.tel.on('keydown', that.keydownFn).on('keyup', function () {
                return that.telBlurFn.call(that, this);
            });
            // 发送验证码
            that.sendIdentifyingCode.on('click', function () {
                return that.sendIdentifyingCodeChange.call(that);
            });
            // 更换图片验证码
            that.picVerifyCode.on('click', function () {
                $(this).attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
            });
            // 关闭图片验证码输入框
            that.close.on('click', function () {
                that.picVerify.hide();
                that.verifyCode.val('');
            });
            // 图片验证码按钮颜色切换
            that.verifyCode.on('keyup', function () {
                var code = $(this).val();
                if (code) {
                    that.submitVerifyCode.css('background-color', '#DF3031');
                    that.picCodeFlag = true;
                } else {
                    that.submitVerifyCode.css('background-color', '#999');
                    that.picCodeFlag = false;
                }
            });
            // 图片验证码提交
            that.submitVerifyCode.on('click', function () {
                return that.sendVerify.call(that);
            });
            // 查看协议
            that.seeProtocol.on('click', function () {
                that.registerPageEl.hide();
                that.header.hide();
                that.otherLoginMethod.hide();
                that.footer.hide();
                that.protocol.show();
            });
            that.back.on('click', function () {
                that.protocol.hide();
                that.registerPageEl.show();
                that.header.show();
                that.otherLoginMethod.show();
                that.footer.show();
            });
            // 切换密码明文开关
            that.switchPwd.on('click', function () {
                if ($(this).is('.hide')) {
                    $(this).removeClass('hide');
                    that.password.attr('type', 'text');
                } else {
                    $(this).addClass('hide');
                    that.password.attr('type', 'password');
                }
            });
            // 同意注册条例
            that.protocolStatus.on('click', function () {
                if ($(this).is('.active')) {
                    $(this).removeClass('active');
                    that.protocolStatusFlag = false;
                } else {
                    $(this).addClass('active');
                    that.protocolStatusFlag = true;
                }
                that.switchAble(that);
            });
            // 用户注册
            that.registerBtn.on('click', function () {
                return that.userRegister.call(that);
            });
            that.identifyingCode.on('blur', function () {
                return that.checkPhoneCode.call(that);
            }).on('keydown', that.keydownFn);
            that.password.on('keyup', function () {
                var pwd = $(this).val();
                pwd = util.stripscript(pwd);
                $(this).val(pwd);
                // 匹配必须是英文和数字的组合
                // 这个正则不能保证至少匹配一个数字和字母
                // var reg = new RegExp('^[a-zA-Z](?=.*[0-9].*)[a-zA-Z0-9]{6,16}$');
                var reg = new RegExp('^[a-zA-Z0-9]{6,16}$');
                var reg2 = new RegExp('^[a-zA-Z]+$');
                var reg3 = new RegExp('^[0-9]+$');
                if (!pwd) {
                    that.prompt.html('密码不能为空~');
                    that.prompt.show();
                    that.pwdFlag = false;
                }
                if (pwd.length >= 3) {
                    if (pwd.length < 6 || pwd.length > 16) {
                        that.prompt.html('密码请设置为6~16位，至少包含数字和字母~');
                        that.prompt.show();
                        that.pwdFlag = false;
                        that.switchAble(that);
                        return false;
                    }
                    if (reg2.test(pwd)) {
                        that.prompt.html('密码请设置为6~16位，至少包含数字和字母~');
                        that.prompt.show();
                        that.pwdFlag = false;
                        return false;
                    }
                    if (reg3.test(pwd)) {
                        that.prompt.html('密码请设置为6~16位，至少包含数字和字母~');
                        that.prompt.show();
                        that.pwdFlag = false;
                        return false;
                    }
                    if (!reg.test(pwd)) {
                        that.prompt.html('密码请设置为6~16位，至少包含数字和字母~');
                        that.prompt.show();
                        that.pwdFlag = false;
                        that.switchAble(that);
                        return false;
                    }
                    if (pwd && reg.test(pwd)) {
                        that.prompt.html('');
                        that.prompt.hide();
                        that.pwdFlag = true;
                        that.switchAble(that);
                    }
                }
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
        keydownFn: function (evPara) {
            var ev = evPara || window.event;
            var code = ev.keyCode;
            if (!util.validateNum(code)) {
                ev.preventDefault();
                return false;
            }
        },
        telBlurFn: function ($this) {
            var that = this;
            if (!that.verifyTelphone(that.tel.val())) {
                that.sendIdentifyingCode.css('color', '#999').css('border', '1px solid #999');
                that.phoneFlag = false;
                that.switchAble.call(that);
                return false;
            }
            // that.prompt.html('');
            // that.prompt.hide();
            that.sendIdentifyingCode.css('color', '#ff6666').css('border', '1px solid #ff6666');
            that.phoneFlag = true;
            that.switchAble.call(that);
            // return true;
            if (that.tel.val().length === 11) {
                var url = vars.mySite + '?c=my&a=ajaxGetUserMesByTel';
                var data = {
                    tel: that.tel.val()
                };
                // 耗时
                $.get(url, data, function (mes) {
                    that.prompt.html('');
                    that.prompt.hide();
                    switch (mes) {
                        case '0':
                            util.displayLoseFn(3, '你还没有写手机号码喔~', '', that);
                            that.sendIdentifyingCode.css('color', '#999');
                            that.sendIdentifyingCode.css('border', '1px solid #999');
                            that.phoneFlag = false;
                            break;
                        case '1':
                            if (!that.sendPhoneCodeFlag) {
                                that.sendIdentifyingCode.css('color', '#ff6666');
                                that.sendIdentifyingCode.css('border', '1px solid #ff6666');
                            }
                            that.phoneFlag = true;
                            break;
                        case '2':
                            util.displayLoseFn(3, '请输入正确的手机号~', '', that);
                            that.sendIdentifyingCode.css('color', '#999');
                            that.sendIdentifyingCode.css('border', '1px solid #999');
                            that.phoneFlag = false;
                            break;
                        case '3':
                            util.displayLoseFn(3, '这个手机号已注册，直接登录去吧~', '', that);
                            that.sendIdentifyingCode.css('color', '#999');
                            that.sendIdentifyingCode.css('border', '1px solid #999');
                            that.phoneFlag = false;
                            break;
                        default:
                            util.displayLoseFn(3, '貌似服务器开小差了，稍后再试吧^_^', '', that);
                            that.sendIdentifyingCode.css('color', '#999');
                            that.sendIdentifyingCode.css('border', '1px solid #999');
                            that.phoneFlag = false;
                    }
                    that.switchAble(that);
                });
            }
        },
        // 用户注册
        userRegister: function () {
            var that = this;
            var phoneCode = that.identifyingCode.val();
            var pwd = that.password.val();
            that.telNumber = that.tel.val();
            if (!that.pwdFlag || !that.phoneFlag || !that.protocolStatusFlag || !that.phoneCodeFlag) {
                return false;
            }
            // 拿到的应该是字符串
            if (isNaN(that.telNumber)) {
                util.displayLoseFn(3, '请输入正确的手机号', '', that);
                return false;
            }
            if (isNaN(phoneCode)) {
                util.displayLoseFn(3, '请输入正确的验证码', '', that);
                return false;
            }
            var reg = new RegExp('^(?![^a-zA-Z]+$)(?![^0-9]+$).{6,16}$');
            if (!reg.test(pwd)) {
                util.displayLoseFn(3, '密码格式错误', '', that);
                return false;
            }
            require.async('rsa/1.0.0/rsa', function (rsa) {
                var passwordEncrypt = rsa(pwd);
                var url = vars.mySite + '?c=my&a=doRegister';
                var data = {
                    phoneCode: phoneCode,
                    telNumber: that.telNumber,
                    password: passwordEncrypt
                };
                $.post(url, data, function (mesPara) {
                    var mes = JSON.parse(mesPara);
                    switch (mes.errCode) {
                        case '1':
                            util.displayLoseFn(3, mes.errReason, vars.burl, that);
                            break;
                        case '2':
                            util.displayLoseFn(3, mes.errReason, '', that);
                            break;
                        case '3':
                            util.displayLoseFn(3, mes.errReason, vars.mySite + '?c=my&a=loginByPassword&city=' + vars.city, that);
                            break;
                        case '4':
                            util.displayLoseFn(3, mes.errReason, '', that);
                            break;
                        case '5':
                            util.displayLoseFn(3, mes.errReason, '', that);
                            break;
                    }
                });
            });
        },
        // 发送验证码的时候使用
        sendIdentifyingCodeChange: function () {
            var that = this;
            // 兼容不支持keyup和input事件的浏览器
            // that.telBlurFn();
            var text = that.sendIdentifyingCode.html();
            var regText = new RegExp('[0-9]{1,2}');
            // 只有倒数计时的时候有数字，所以匹配0-9
            var boolText = regText.test(text);
            if (boolText) {
            // 在倒数计时的时候不让他点这个按钮
                return false;
            }
            if (!that.sendPhoneCodeFlag && that.tel.val() && that.phoneFlag) {
                that.picVerifyCode.trigger('click');
                that.picVerify.show();
            }
            if (!that.tel.val()) {
                return false;
            }
        },
        checkPhoneCode: function () {
            var that = this;
            var phoneCode = that.identifyingCode.val();
            phoneCode = util.stripscript(phoneCode);
            that.identifyingCode.val(phoneCode);
            if (phoneCode.length === 4) {
                var reg = new RegExp('^[0-9]{4}$');
                if (!reg.test(phoneCode)) {
                    util.displayLoseFn(3, '请输入格式正确的手机验证码哟~~~', '', that);
                    that.phoneCodeFlag = false;
                    that.registerBtn.css('background-color', '#999');
                    return false;
                }
                that.phoneCodeFlag = true;
                that.switchAble(that);
            }
        },
        switchAble: function () {
            var that = this;
            if (that.pwdFlag && that.phoneFlag && that.protocolStatusFlag) {
                that.registerBtn.css('background-color', '#DF3031');
            } else {
                that.registerBtn.css('background-color', '#999');
            }
        },
        verifyTelphone: function () {
            var that = this;
            return /^1[34578]{1}[0-9]{9}$/.test(that.tel.val());
        },
        timeRecorder: function (timePara) {
            var time = timePara;
            var that = this;
            var handle = setInterval(function () {
                that.sendIdentifyingCode.html('重新发送(' + time + ')');
                if (time === 0) {
                    clearInterval(handle);
                    that.sendIdentifyingCode.html('发送验证码');
                    that.sendPhoneCodeFlag = false;
                    that.sendIdentifyingCode.css('color', '#ff6666');
                    that.sendIdentifyingCode.css('border', '1px solid #ff6666');
                }
                time--;
            }, 1000);
        },
        sendVerify: function () {
            var that = this;
            if (!that.picCodeFlag) {
                return false;
            }
            // 发送验证码动画
            that.sendFloat.css('display', 'block');
            that.sendText.html('验证码发送中');
            var url = vars.mySite + '?c=my&a=ajaxSendVerifyCode';
            $.get(url, {
                tel: that.tel.val(),
                code: that.verifyCode.val()
            }, function (dataPara) {
                var data = JSON.parse(dataPara);
                switch (parseInt(data.return_result)) {
                    case 1:
                        that.verifyCode.val('');
                        that.picVerify.hide();
                        util.displayLoseFn(3, data.error_reason, '', that);
                        break;
                    case 2:
                    case 3:
                        that.verifyCode.val('');
                        util.displayLoseFn(3, data.error_reason, '', that);
                        $('#picVerifyCode').attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
                        break;
                    default:
                        that.verifyCode.val('');
                        util.displayLoseFn(3, data.error_reason, '', that);
                        break;
                }
                util.displayLoseFn(3, data.error_reason, '', that);
                // prompt.html(data.error_reason);
                // prompt.show();
                that.sendIdentifyingCode.css('color', '#999');
                that.sendIdentifyingCode.css('border', '1px solid #999');
                that.sendPhoneCodeFlag = true;
                // 发送了验证码flag为true
                that.timeRecorder(60);
            });
        }
    };
    var registerObj = new registerFn();
    registerObj.init();
    module.exports = registerFn;
});