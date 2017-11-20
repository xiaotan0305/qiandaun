/**
 * Created by fang on 2015/8/4.
 */
define('modules/my/showModifyPhone', ['jquery', 'modules/my/util'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var util = require('modules/my/util');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    function showModifyPhoneFn() {}
    showModifyPhoneFn.prototype = {
        init: function () {
            var that = this;
            that.sendPhoneCode = $('#sendPhoneCode');
            // 发送手机验证码按钮
            that.submitVerifyCode = $('#submitVerifyCode');
            // 提交图片验证码按钮
            that.picVerify = $('#picVerify');
            // 图片验证码区域
            that.telNumber = $('#tel');
            // 手机号input
            that.phoneCode = $('#phoneCode');
            // 手机验证码input
            that.clear = $('#clear');
            // 清楚手机验证码那个xx
            that.nextStep = $('#nextStep');
            // 下一步
            that.verifyCode = $('#verifyCode');
            // 图片验证码input
            that.sendFloat = $('#sendFloat');
            // 提示框
            that.sendText = $('#sendText');
            // 提示框中的内容
            that.picVerifyCode = $('#picVerifyCode');
            // 图片验证码
            that.picPrompt = $('#picPrompt');
            // 图片验证码提示区
            that.submitVerifyCode.css('background-color', '#999');
            that.close = $('.close');
            // 关闭图片验证码
            that.prompt = $('#prompt');
            // 提示
            that.phoneFlag = false;
            that.phoneCodeFlag = false;
            that.sendPhoneCodeFlag = false;
            // 是否发送了手机验证码
            that.floatLayer = $('.float');
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            that.clear.on('click', function () {
                that.telNumber.val('');
                that.clear.hide();
            });
            that.telNumber.on('keyup', function () {
                return that.listenTelNumber();
            }).on('keydown', that.keyDownFn);
            that.sendPhoneCode.on('click', function () {
                return that.listenSendPhoneCode();
            });
            that.picVerifyCode.on('click', function () {
                $(this).attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
            });
            // 关闭图片验证码
            that.close.on('click', function () {
                that.picVerify.hide();
                that.verifyCode.val('');
                that.submitVerifyCode.css('background-color', '#999');
            });
            // 图片验证码提交按钮颜色更换
            that.verifyCode.on('keyup', function () {
                var code = $(this).val();
                if (code) {
                    that.submitVerifyCode.css('background-color', '#DF3031');
                } else {
                    that.submitVerifyCode.css('background-color', '#999');
                }
            }).on('keydown', that.keyDownFn);
            // 提交图片验证码
            that.submitVerifyCode.on('click', function () {
                that.submitPicCode();
            });
            // 监听手机验证码输入
            that.phoneCode.on('keyup', function () {
                that.monitorPhoneCode();
            }).on('keydown', that.keyDownFn).on('blur', function () {
                var phoneCodeNum = that.phoneCode.val();
                phoneCodeNum = util.stripscript(phoneCodeNum);
                that.phoneCode.val(phoneCodeNum);
                if (!phoneCodeNum) {
                    that.prompt.html('你还没有写验证码喔~');
                    that.prompt.show();
                    that.nextStep.css('background-color', '#999');
                    that.phoneCodeFlag = false;
                    that.switchAble();
                    return false;
                }
            });
            // 保存事件
            that.nextStep.on('click', function () {
                if (!that.phoneFlag && !that.phoneCodeFlag) {
                    return false;
                }
                var url = vars.mySite + '?c=my&a=verifyMobileBindValidCode';
                var phoneCodeNum = that.phoneCode.val();
                that.floatLayer.show();
                var data = {
                    phoneCode: phoneCodeNum,
                    telNumber: that.telNumber.val()
                };
                $.get(url, data, function (mes) {
                    var jsonData = JSON.parse(mes);
                    if (jsonData.error_code !== '100') {
                        util.displayLoseFn(3, jsonData.error_reason, '', that);
                        // that.nextStep.addClass('disable');
                        that.nextStep.css('background-color', '#999');
                    } else {
                        var phone = that.telNumber.val();
                        phone = util.stripscript(phone);
                        that.telNumber.val(phone);
                        var url = vars.mySite + '?c=my&a=ajaxPhoneModify';
                        var data = {
                            phone: phone
                        };
                        $.get(url, data, function (mes) {
                            switch (mes) {
                                case '1':
                                    var alertMes = '';
                                    if (vars.oldPhone) {
                                        alertMes = '手机号修改成功';
                                    } else {
                                        alertMes = '手机号绑定成功';
                                    }
                                    util.displayLoseFn(3, alertMes, vars.burl, that);
                                    break;
                                case '2':
                                    var loginurl = "https://m.fang.com/passport/login.aspx";
                                    util.displayLoseFn(3, '未登录', loginurl, that);
                                    break;
                                case '0':
                                    var myAccounturl = vars.mySite + '?c=my&a=myAccount&city=' + vars.city;
                                    util.displayLoseFn(3, '服务器开小差，请稍后再试!', myAccounturl, that);
                                    break;
                            }
                            
                            /*
                            if (mes === '1') {
                                var alertMes = '';
                                if(vars.oldPhone){
                                    alertMes = '手机号修改成功';
                                }else{
                                    alertMes = '手机号绑定成功';
                                }
                                util.displayLoseFn(3, alertMes, vars.burl, that);
                            } else if (mes === '0') {
                                util.displayLoseFn(3, '手机号修改失败，请重试', '', that);
                            } else {
                                util.displayLoseFn(3, '服务器开小差了，请稍后重试~~~', '', that);
                                window.location.href = vars.mySite+'?c=my&a=loginByPassword&city=' + vars.city;
                            }
                            */
                        });
                    }
                });
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
        },
        keyDownFn: function (ev) {
            // var that = this;
            var e = ev || window.event;
            var code = e.keyCode;
            if (!util.validateNum(code)) {
                ev.preventDefault();
                return false;
            }
        },
        // 监控手机号输入
        listenTelNumber: function () {
            var that = this;
            var newTelNum = that.telNumber.val();
            newTelNum = util.stripscript(newTelNum);
            that.telNumber.val(newTelNum);
            if (that.telNumber.val() !== '') {
                that.clear.show();
            }
            if (!that.verifyTelphone(that)) {
                that.sendPhoneCode.css('color', '#999').css('border', '1px solid #999');
                that.phoneFlag = false;
                that.switchAble.call(that);
                if (that.telNumber.val().length === 11) {
                    that.prompt.html('非法的手机号~~');
                    that.prompt.show();
                }
                return false;
            }
            var url = vars.mySite + '?c=my&a=ajaxGetUserMesByTel';
            var data;
            if (vars.oldPhone) {
                // tel是新手机号，lodPHone是旧手机号
                data = {
                    tel: that.telNumber.val(),
                    oldPhone: 'showModifyPhone'
                };
            } else {
                data = {
                    tel: that.telNumber.val()
                };
            }
            // 耗时
            $.get(url, data, function (mes) {
                switch (mes) {
                    case '0':
                        that.prompt.html('你还没有写手机号码喔~~');
                        that.sendPhoneCode.css('color', '#999');
                        that.sendPhoneCode.css('border', '1px solid #999');
                        that.prompt.show();
                        that.phoneFlag = false;
                        break;
                    case '1':
                        that.sendPhoneCode.css('color', '#ff6666');
                        that.sendPhoneCode.css('border', '1px solid #ff6666');
                        that.phoneFlag = true;
                        that.prompt.hide();
                        break;
                    case '2':
                        that.prompt.html('请输入正确的手机号~');
                        that.sendPhoneCode.css('color', '#999');
                        that.sendPhoneCode.css('border', '1px solid #999');
                        that.prompt.show();
                        that.phoneFlag = false;
                        break;
                    case '3':
                        that.prompt.html('这个手机号码已绑定了别的账号，无法与之绑定');
                        that.sendPhoneCode.css('color', '#999');
                        that.sendPhoneCode.css('border', '1px solid #999');
                        that.prompt.show();
                        that.phoneFlag = false;
                        break;
                    case '4':
                        that.prompt.html('不要输入当前手机号哟');
                        that.sendPhoneCode.css('color', '#999');
                        that.sendPhoneCode.css('border', '1px solid #999');
                        that.prompt.show();
                        that.phoneFlag = false;
                        break;
                    default:
                        that.prompt.html('貌似服务器开小差了，稍后再试吧^_^');
                        that.sendPhoneCode.css('color', '#999');
                        that.sendPhoneCode.css('border', '1px solid #999');
                        that.prompt.show();
                        that.phoneFlag = false;
                }
                that.switchAble(that);
            });
        },
        // 监控验证码输入框
        monitorPhoneCode: function () {
            var that = this;
            var phoneCodeNum = that.phoneCode.val();
            phoneCodeNum = util.stripscript(phoneCodeNum);
            that.phoneCode.val(phoneCodeNum);
            var reg = new RegExp('^[0-9]{4}$');
            if (phoneCodeNum.length >= 3) {
                if (!reg.test(phoneCodeNum)) {
                    that.prompt.html('请输入格式正确的手机验证码哟~~~');
                    that.prompt.show();
                    that.nextStep.css('background-color', '#999');
                    that.phoneCodeFlag = false;
                    that.switchAble();
                    return false;
                }
                that.prompt.html('');
                that.prompt.hide();
                that.phoneCodeFlag = true;
                that.switchAble();
                that.nextStep.css('background-color', '#df3031');
            }
        },
        // 监听发送手机验证码click事件
        listenSendPhoneCode: function () {
            var that = this;
            var text = that.sendPhoneCode.html();
            var regText = new RegExp('[0-9]{1,2}');
            // 只有倒数计时的时候有数字，所以匹配0-9
            var boolText = regText.test(text);
            if (boolText) {
            // 在倒数计时的时候不让他点这个按钮
                return false;
            }
            if (!that.sendPhoneCodeFlag && that.telNumber.val().length === 11 && that.phoneFlag) {
                that.picVerifyCode.trigger('click');
                that.picVerify.show();
                that.verifyCode.focus();
            }
            if (!that.telNumber.val()) {
                return false;
            }
        },
        // 提交图片验证码操作
        submitPicCode: function () {
            var that = this;
            var color = that.submitVerifyCode.css('background-color');
            var regColor = new RegExp('153');
            // 153是灰色
            var boolColor = regColor.test(color);
            // 匹配成功说明是灰色
            if (boolColor) {
                return false;
            }
            var code = that.verifyCode.val();
            code = util.stripscript(code);
            that.verifyCode.val(code);
            if (!code) {
                util.displayLoseFn(3, '你还没有写验证码喔~', '', that);
                return false;
            }
            var url = vars.mySite + '?c=my&a=checkCode';
            var data = {
                code: code
            };
            $.get(url, data, function (mes) {
                // 加载内容的动画
                switch (mes) {
                    case '0':
                        util.displayLoseFn(3, '验证码不正确~', '', that);
                        that.picVerifyCode.attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
                        break;
                    case '1':
                        that.close.trigger('click');
                        that.sendVerify();
                        break;
                    case '2':
                        util.displayLoseFn(3, '你还没有写验证码喔~', '', that);
                        break;
                    default:
                        util.displayLoseFn(3, '服务器开小差了，请稍后重试', '', that);
                        break;
                }
            });
        },
        // 更换保存按钮的颜色
        switchAble: function () {
            var that = this;
            if (that.phoneCodeFlag && that.phoneFlag) {
                that.nextStep.css('color-background', '#DF3031');
            } else {
                that.nextStep.css('background-color', '#999');
            }
        },
        verifyTelphone: function () {
            var that = this;
            return /^1[34578]{1}[0-9]{9}$/.test(that.telNumber.val());
        },
        sendVerify: function () {
            var that = this;
            // 发送验证码动画
            that.sendFloat.css('display', 'block');
            that.sendText.html('验证码发送中');
            var url = vars.mySite + '?c=my&a=senMobileValid';
            var tel = that.telNumber.val();
            tel = util.stripscript(tel);
            that.telNumber.val(tel);
            $.get(url, {
                tel: tel
            }, function (dataPara) {
                var data = JSON.parse(dataPara);
                util.displayLoseFn(3, data.error_reason, '', that);
                // prompt.html(data.error_reason);
                // prompt.show();
                if (data.return_result === '1') {
                    that.sendPhoneCode.css('color', '#999');
                    that.sendPhoneCode.css('border', '1px solid #999');
                    that.sendPhoneCodeFlag = true;
                    // 发送了验证码flag为true
                    that.timeRecorder(60);
                }
            });
        },
        timeRecorder: function (timePara) {
            var that = this;
            var time = timePara;
            var handle = setInterval(function () {
                that.sendPhoneCode.html('重新发送(' + time + ')');
                if (Number(time) === 0) {
                    clearInterval(handle);
                    that.sendPhoneCode.html('发送验证码');
                    that.sendPhoneCodeFlag = false;
                    that.sendPhoneCode.css('color', '#ff6666');
                    that.sendPhoneCode.css('border', '1px solid #ff6666');
                }
                time--;
            }, 1000);
        }
    };
    var showModifyPhoneObj = new showModifyPhoneFn();
    showModifyPhoneObj.init();
    module.exports = showModifyPhoneFn;
});