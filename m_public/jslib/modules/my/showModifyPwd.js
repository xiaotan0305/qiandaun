/**
 * Created by fang on 2015/8/2.
 */
define("modules/my/showModifyPwd", ['jquery',"modules/my/util"], function(require, exports, module) {
    "use strict";
    //用户手机号通过什么传服务器？get?
    var vars = seajs.data.vars,$ = require('jquery');
    var util=require("modules/my/util");
    $("input[type=hidden]").each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    function showModifyPwdFn(){
    }
    showModifyPwdFn.prototype = {
        init : function(){
            var that = this;
            that.sendPhoneCode = $('#sendPhoneCode');       //发送手机验证码按钮
            that.submitVerifyCode = $('#submitVerifyCode'); //提交图片验证码按钮
            that.picVerify = $('#picVerify');               //图片验证码区域
            that.verifyCode = $('#verifyCode');             //图片验证码input
            that.phoneCode = $('#phoneCode');             //手机验证码input
            that.clearPhoneCode = $('#clearPhoneCode');             //清除手机验证码那个xx
            that.nextStep = $('#nextStep');             //下一步
            that.sendFloat = $('#sendFloat');           //提示框
            that.sendText = $('#sendText') ;            //提示框中的内容
            that.picVerifyCode = $('#picVerifyCode');   //图片验证码
            that.picPrompt = $('#picPrompt');           //图片验证码提示区
            that.submitVerifyCode.css('background-color', '#999');
            that.close = $('.close');
            that.prompt = $('#prompt');                 //提示
            that.sendPhoneCodeFlag = false;		//是否发送了验证码标记
            that.phoneCodeFlag = false;         //手机验证码是否正确
	        //是否输入了验证码
            that.picCodeFlag = false;
            that.floatLayer=$(".float");
            that.bindEvent();
        },
        bindEvent : function(){
            var that = this;
            //发送手机验证码
            that.sendPhoneCode.on('click', function(){that.checkCookie.call(that)});
            //更换图片验证码
            that.picVerifyCode.on('click', function(){
                $(this).attr('src', vars.mySite+'?c=my&a=authCode&r=' + Math.random());
            });
            //图片验证码提交按钮颜色更换
            that.verifyCode.on('input', function(){
                var code = $(this).val();
                if(code){
                    that.submitVerifyCode.css('background-color', '#DF3031');
                    that.picCodeFlag = true;
                } else {
                    that.submitVerifyCode.css('background-color', '#999');
                    that.picCodeFlag = false;
                }
            });
            // 提交图片验证码
            that.submitVerifyCode.on('click', function () {
                that.sendVerify();
            });
            // 关闭图片验证码
            that.close.on('click', function () {
                that.picVerify.hide();
                that.submitVerifyCode.css('background-color', '#999');
            });
            //清除验证码
            that.clearPhoneCode.on('click', function(){
                that.phoneCode.val('');
                that.clearPhoneCode.hide();
            });
            //监控验证码输入
            that.phoneCode.on('input',function(){return that.monitorPhoneCode.call(that);} ).on('blur', function(){
	            var phoneCodeNum = that.phoneCode.val();
	            phoneCodeNum=util.stripscript(phoneCodeNum);
	            that.phoneCode.val(phoneCodeNum);
                if(!phoneCodeNum){
                    that.prompt.html('你还没有写验证码喔~').show();
                    that.nextStep.css('background-color', '#999');
                    that.clearPhoneCode.hide();
                    return false;
                }
            });
            that.phoneCode.on('keydown', that.keyDownFn);

            //点击下一步
            that.nextStep.on('click',function(){that.clickNextStep()});
            /*如果上一页是搜房，显示返回按钮；否则显示logo*/
            if(!(document.referrer.indexOf(".fang.com")>-1)){
                $(".logoR").show();
                $(".back2").hide();
            };
            /*修复文本框输入键盘弹起遮挡bug*/
            if ($(window).height()>450) {
                $("body").css("min-height", $(window).height()+"px");
            }
            $("footer").show();
        },
        keyDownFn:function(ev){
            var that=this;
            var e=ev||window.event;
            var code=e.keyCode;
            if(!util.validateNum(code)){
                ev.preventDefault();
                return false;
            }
        },
        timeRecorder : function(time){
            var that = this;
            var handle=setInterval(function(){
                that.sendPhoneCode.html('重新发送(' + time + ')');
                if(time == 0){
                    clearInterval(handle);
                    that.sendPhoneCode.html('发送验证码');
                    that.sendPhoneCode.css({'color' : '#ff6666', 'border' : '1px solid #ff6666'});
                    that.sendPhoneCodeFlag = false;	//倒是60s结束，设置发送手机验证码标记为false
                }
                time--;
            },1000);
        },
        //验证用户cookie
        checkCookie : function(){
            var that = this;
            that.prompt.html('').hide();
            if(!that.sendPhoneCodeFlag){
                that.picVerifyCode.trigger('click');
                that.picVerify.show();
            }
        },
        // 监控验证码输入框
        monitorPhoneCode: function () {
            var that = this;
            var phoneCodeNum = that.phoneCode.val();
            phoneCodeNum=util.stripscript(phoneCodeNum);
            that.phoneCode.val(phoneCodeNum);
            that.clearPhoneCode.show();
            var reg = new RegExp('^[0-9]{4}$');
            if(phoneCodeNum.length >= 3){
                if(!reg.test(phoneCodeNum)){
                    that.prompt.html('请输入格式正确的手机验证码哟~~~').show();
                    that.nextStep.css('background-color', '#999');
                    return false;
                }
                that.prompt.html('').hide();
                that.phoneCodeFlag = true;
                that.nextStep.css('background-color', '#df3031');
            }
        },
        //点击下一步
        clickNextStep : function(){
            var that = this;
            if(!that.phoneCodeFlag){
                return false;
            }
            var phoneCodeNum = that.phoneCode.val();
            phoneCodeNum=util.stripscript(phoneCodeNum);
            that.phoneCode.val(phoneCodeNum);
            if(that.phoneCodeFlag) {
            	that.floatLayer.show();
                var url = vars.mySite+'?c=my&a=ajaxCheckPhoneCode';
                var data = {'phoneCode' : phoneCodeNum, 'telNumber' : vars.realPhoneNumber};
                $.get(url, data, function(mes){
                    if(mes == '0'){
                        util.displayLoseFn(3, '验证码不正确', '', that);
                        that.phoneCodeFlag = false;
                        that.nextStep.css('background-color', '#999');
                    }else{
                        window.location.href=vars.mySite+'?c=my&a=modifyPwd&city=' + vars.city;
                    }
                });
            } else {
                return false;
            }
        },

        sendVerify: function () {
            var that = this;
            if (!that.picCodeFlag) {
                return false;
            }
            // 发送验证码动画
            that.sendFloat.show();
            that.sendText.html('验证码发送中');
            var url = vars.mySite + '?c=my&a=ajaxSendVerifyCode';
            $.get(url, {
                tel: vars.realPhoneNumber,
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
                        that.picVerifyCode.attr('src', vars.mySite + '?c=my&a=authCode&r=' + Math.random());
                        break;
                    default:
                        that.verifyCode.val('');
                        util.displayLoseFn(3, data.error_reason, '', that);
                        break;
                }
                util.displayLoseFn(3, data.error_reason, '', that);
                that.sendPhoneCode.css({'color' : '#999', 'border' : '1px solid #999'});
                that.sendPhoneCodeFlag = true;
                // 发送了验证码flag为true
                that.timeRecorder(60);
            });
        }
    };
    var modifyPwdObj = new showModifyPwdFn;
    modifyPwdObj.init();
    module.exports = showModifyPwdFn;
});
