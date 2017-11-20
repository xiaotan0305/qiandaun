/**
 * Created by fang on 2015/8/3.
 */
define('modules/my/showFindPwd', ['jquery', 'modules/my/util'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var util = require('modules/my/util');

    function showFindPwdFn() {

    }
    showFindPwdFn.prototype = {
        init: function () {
            var that = this;
            that.tel = $('#tel');
            // 电话号码input
            that.prompt = $('#prompt');
            // 提示行
            that.sendIdentifyingCode = $('#sendIdentifyingCode');
            that.picVerify = $('#picVerify');
            that.picVerifyCode = $('#picVerifyCode');
            that.submitVerifyCode = $('#submitVerifyCode');
            that.verifyCode = $('#verifyCode');
            // 图片验证码input
            that.submitPicVerifyCode = $('#submitPicVerifyCode');
            // 图片验证码提交按钮
            that.picPrompt = $('#picPrompt');
            // 图片验证码提示域
            that.identifyingCode = $('#identifyingCode');
            // 手机验证码input
            that.clearInput = $('.clearInput');
            that.phoneFlag = false;
            that.phoneCodeFlag = false;
            that.picCodeFlag = false;
            that.sendIdentifyingCode.css('color', '#999').css('border', '1px solid #999');
            that.submitPicVerifyCode.css('background-color', '#999');
            that.close = $('.close');
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');
            that.floatLayer = $('.float');
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            that.clearInput.on('click', function () {
                that.tel.val('');
            });
            that.tel.on('keyup', function () {
                return that.checkPhoneNumber.call(that);
            });
            that.sendIdentifyingCode.on('click', function () {
                return that.sendIdentifyingCodeClick.call(that);
            });
            that.picVerifyCode.on('click', function () {
                $(this).attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
            });
            // 关闭图片验证码输入框
            that.close.on('click', function () {
                that.verifyCode.val('');
                that.picVerify.hide();
            });
            // 图片验证码按钮颜色切换
            that.verifyCode.on('keyup', function () {
                var code = $(this).val();
                if (code) {
                    that.picCodeFlag = true;
                    that.submitPicVerifyCode.css('background-color', '#DF3031');
                } else {
                    that.picCodeFlag = false;
                    that.submitPicVerifyCode.css('background-color', '#999');
                }
            });
            // 图片验证码提交
            that.submitPicVerifyCode.on('click', function () {
                return that.sendVerify.call(that);
            });
            // 检测验证码
            that.identifyingCode.on('input', function () {
                return that.checkPhoneCode.call(that);
            });
            // 点击验证手机号码按钮
            that.submitVerifyCode.on('click', function () {
                if (!that.phoneCodeFlag) {
                    return false;
                }
                that.floatLayer.show();
                var telNumber = that.tel.val();
                var identifyingCode = that.identifyingCode.val();
                identifyingCode = util.stripscript(identifyingCode);
                that.identifyingCode.val(identifyingCode);
                var url = vars.mySite + '?c=my&a=checkFindPwdPhoneNum';
                var data = {
                    telNumber: telNumber,
                    identifyingCode: identifyingCode
                };
                $.get(url, data, function (mes) {
                    switch (mes) {
                        case '0':
                            util.displayLoseFn(3, '你还没有写手机号码喔~', '', that);
                            that.submitVerifyCode.css('background-color', '#999').css('border', '1px solid #999');
                            break;
                        case '1':
                            util.displayLoseFn(3, '验证成功,即将跳转', vars.mySite + '?c=my&a=modifyPwd&rediFrom=showFindPwd&city=' + vars.city, that);
                            break;
                        case '2':
                            util.displayLoseFn(3, '请输入正确的手机号~', '', that);
                            that.submitVerifyCode.css('background-color', '#999').css('border', '1px solid #999');
                            break;
                        case '3':
                            util.displayLoseFn(3, '手机验证码错误', '', that);
                            that.submitVerifyCode.css('background-color', '#999').css('border', '1px solid #999');
                            break;
                        default:
                            util.displayLoseFn(3, '服务器开小差了，请稍后重试', '', that);
                            that.submitVerifyCode.css('background-color', '#999').css('border', '1px solid #999');
                            break;
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
        // 检测手机号码是否正确
        checkPhoneNumber: function () {
            var that = this;
            var phoneNumber = that.tel.val();
            if (!phoneNumber) {
                that.prompt.html('你还没有写手机号码喔~');
                that.sendIdentifyingCode.css('color', '#999').css('border', '1px solid #999');
                that.prompt.show();
                that.phoneFlag = false;
                that.switchAble(that);
                that.clearInput.hide();
                return false;
            }
            if (phoneNumber.length === 11) {
                that.clearInput.show();
                if (!that.verifyTelphone(that)) {
                    that.prompt.html('请输入正确的手机号~');
                    that.sendIdentifyingCode.css('color', '#999').css('border', '1px solid #999');
                    that.prompt.show();
                    that.phoneFlag = false;
                    that.switchAble(that);
                    return false;
                }
                if (!that.phoneFlag) {
                    that.phoneFlag = true;
                    that.prompt.hide();
                    that.prompt.html('');
                    that.sendIdentifyingCode.css('color', '#ff6666').css('border', '1px solid #ff6666');
                    that.switchAble(that);
                }
            }
        },
        // 点击发送验证码按钮
        sendIdentifyingCodeClick: function () {
            var that = this;
            var color = that.sendIdentifyingCode.css('color');
            var text = that.sendIdentifyingCode.html();
            var regColor = new RegExp('153');
            // 153是灰色，如果是灰色则匹配成功，不给发送验证码
            var regText = new RegExp('[0-9]{1,2}');
            // 只有倒数计时的时候有数字，所以匹配0-9
            var boolColor = regColor.test(color);
            var boolText = regText.test(text);
            if (boolText) {
            // 在倒数计时的时候不让他点这个按钮
                return false;
            }
            if (!boolColor && that.tel.val()) {
                that.verifyCode.val('');
                that.picVerifyCode.trigger('click');
                that.picVerify.show();
                that.verifyCode.focus();
            }
        },

        /*
        //点击提交图片验证码按钮
        sendIdPicCodeChange : function(){
            var that = this;
            var code = that.verifyCode.val();
            code=util.stripscript(code);
            that.verifyCode.val(code);
            if(!code){
                return false;
            }else{
                var url = vars.mySite+'?c=my&a=checkCode';
                var data = {'code' : code};
                $.get(url, data, function(mes){
                    //加载内容的动画
                    switch(mes){
                        case '0' :
                            util.displayLoseFn(3, '验证码不正确~', '', that);
                            $('#picVerifyCode').attr('src', vars.mySite+'?c=my&a=authCode&r=' + Math.random());
                            break;
                        case '1' :
                            that.picVerify.hide();
                            that.verifyCode.val('');
                            that.sendVerify(that);
                            break;
                        case '2' :
                            util.displayLoseFn(3, '你还没有写验证码喔~', '', that);
                            break;
                        default :
                            util.displayLoseFn(3, '服务器开小差了，请稍后重试~', '', that);
                            break;
                    }
                });
            }
        },
        */
        // 发送手机验证码
        sendVerify: function () {
            var that = this;
            if (!that.picCodeFlag) {
                return false;
            }
            // 发送验证码动画sendText sendText
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
                        that.picVerify.hide();
                        util.displayLoseFn(3, data.error_reason, '', that);
                        break;
                    case 2:
                    case 3:
                        util.displayLoseFn(3, data.error_reason, '', that);
                        $('#picVerifyCode').attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
                        break;
                    default:
                        util.displayLoseFn(3, data.error_reason, '', that);
                        break;
                }
                util.displayLoseFn(3, data.error_reason, '', that);
                that.sendIdentifyingCode.css('color', '#999');
                that.sendIdentifyingCode.css('border', '1px solid #999');
                that.timeRecorder(60);
            });
        },
        // 检测手机验证码是否正确
        checkPhoneCode: function () {
            var that = this;
            var phoneCode = that.identifyingCode.val();
            phoneCode = util.stripscript(phoneCode);
            that.identifyingCode.val(phoneCode);
            // that.telNumber = that.tel.val();
            var reg = new RegExp('^[0-9]{4}$');
            if (!reg.test(phoneCode)) {
                that.prompt.html('请输入格式正确的手机验证码哟~~~');
                that.prompt.show();
                that.phoneCodeFlag = false;
                that.switchAble(that);
                return false;
            }
            that.prompt.html('');
            that.prompt.hide();
            that.phoneCodeFlag = true;
            that.switchAble(that);
        },
        // 检测验证验证码按钮是否可点
        switchAble: function () {
            var that = this;
            if (that.phoneCodeFlag && that.phoneFlag) {
                that.submitVerifyCode.css('background-color', '#DF3031');
            } else {
                that.submitVerifyCode.css('background-color', '#999');
            }
        },
        verifyTelphone: function () {
            // 记得问这个问题
            var that = this;
            return /^1[34578]{1}[0-9]{9}$/.test(that.tel.val());
        },
        timeRecorder: function (timePara) {
            var time = timePara;
            var that = this;
            var handle = setInterval(function () {
                that.sendIdentifyingCode.html('重新发送(' + time + ')');
                if (Number(time) === 0) {
                    clearInterval(handle);
                    that.sendIdentifyingCode.html('发送验证码');
                    that.sendIdentifyingCode.css('color', '#ff6666');
                    that.sendIdentifyingCode.css('border', '1px solid #ff6666');
                }
                time--;
            }, 1000);
        }
    };
    var showFindPwdObj = new showFindPwdFn();
    showFindPwdObj.init();
    module.exports = showFindPwdFn;
});