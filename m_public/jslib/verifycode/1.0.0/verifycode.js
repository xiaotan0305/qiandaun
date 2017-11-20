/**
 * @Author: chenshaoshan
 * @Date:   2015/12/22
 * @description: 手机动态登录或注册发送验证码 公用
 * @Last Modified by:   chenshaoshan
 * @Last Modified time:
 */
(function (f, win) {
    'use strict';
    // 用于amd、cmd和普通方式调用js判断
    if (typeof define === 'function') {
        define('verifycode/1.0.0/verifycode', ['jquery'], function (require) {
            return f(require('jquery'));
        });
    } else if (typeof exports === 'object') {
        module.exports = f(win.jQuery);
    } else {
        win.verifycode = f(win.jQuery);
    }
})(function ($) {
    'use strict';

    function PhoneLoginOrRegisteredCodeUtil(phone, cbfn) {
        this.phonestr = phone;
        this.servicestr = 'soufun-wap-wap';
        this.callbackfn = cbfn;
        this.initPhoneCode(this);
    }
    // 初始化验证码
    PhoneLoginOrRegisteredCodeUtil.prototype.initPhoneCode = function (obj) {
        var phonecodeurlstr = 'https://passport.fang.com/loginsendmsm.api?service=' + obj.servicestr + '&mobilephone=' + obj.phonestr;
        obj.sendCodeReq(obj, phonecodeurlstr);
    };
    PhoneLoginOrRegisteredCodeUtil.prototype.sendCodeReq = function (obj, mesgStr) {
        $.ajax({
            type: 'get',
            async: false,
            url: encodeURI(mesgStr),
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'flightHandler',
            success: function (json) {
                console.log('Message==' + json.Message + 'IsSent===' + json.IsSent + 'IsShowMathCode==' + json.IsShowMathCode + 'Tip==' + json.Tip);
                if (json.Message === 'Success') {
                    obj.callbackfn(true);
                } else if (json.IsSent === 'true') {
                    alert('手机上已有两条未验证验证码，不再发送验证码！');
                    obj.callbackfn(false);
                } else if (json.IsShowMathCode === 'true') {
                    // 需要图文验证码
                    obj.initCodeWinDom(obj);
                } else {
                    alert(json.Tip);
                    obj.callbackfn(false);
                }
            },
            error: function () {
                alert('发送失败');
                obj.callbackfn();
            }
        });
    };
    // --------------------------------------------------------------
    // 初始化验证码
    PhoneLoginOrRegisteredCodeUtil.prototype.initCodeWinDom = function (obj) {
        if ($('#phoneDivImgVerify1').length < 1) {
            var codeWinStr = '<div id="phoneDivImgVerify1" style="position: fixed;width: 100%;height: 100%;left: 0;top: 0;background: rgba(0,0,0,0.3);z-index: 11000;">' + '<div id="phoneDivImgVerify2" style="position: relative;padding: 20px 15px;width: 250px;background-color: #ffffff;margin: -67px auto 0;top: 25%;">' + '<div id="phoneDivImgVerify3" style="border: 1px solid #dedede;padding: 10px 5px 10px 5px;border-radius: 4px;">' + '<img id="phoneGetImgVerifyCode" style="display:block;margin:0 auto;width:166px;height:85px">' + '<input id="phoneImgVerifyCodeId" type="text" placeholder="请回答上面的问题" style="text-align:center;display: block;width:130px;border:none;border-bottom:1px solid #ddd;margin:5px auto 0;font-size: 15px;line-height: 24px;">' + '</div>' + '<div id="phoneDivImgVerify4" style="margin-top: 15px;">' + '<a id="phoneImgVerifyCodeSubmit" style="background-color: #f00;line-height: 40px;width: 220px;margin: 0 auto;color: #ffffff;display: block;border-radius: 4px;text-align: center;">确 定</a>' + '</div></div></div>';

            $('body').append(codeWinStr);

            $('#phoneGetImgVerifyCode').on('click', function () {
                obj.refreshVerifyCode(obj);
            });
            $('#phoneImgVerifyCodeSubmit').on('click', function () {
                var MathCodestr = obj.submitCodeAnswer(obj);
                if (MathCodestr !== '-0') {
                    var phonecodeurlstr = 'https://passport.fang.com/loginsendmsm.api?service=' + obj.servicestr + '&mobilephone=' + obj.phonestr + '&mathcode=' + MathCodestr;
                    obj.sendCodeReq(obj, phonecodeurlstr);
                }
            });
        } else {
            $('#phoneImgVerifyCodeId').val('');
            $('#phoneDivImgVerify1').show();
        }
        obj.refreshVerifyCode(obj);
    };

    PhoneLoginOrRegisteredCodeUtil.prototype.refreshVerifyCode = function () {
        var num = Math.random() * 1000;
        var verifyRandomOnly = parseInt(num, 10);
        var imgVerifyCodeUrlStr = verifyRandomOnly;

        if (verifyRandomOnly % 2 === 0) {
            imgVerifyCodeUrlStr = '//captcha.fang.com/Display?r=' + imgVerifyCodeUrlStr;
            $('#phoneGetImgVerifyCode').attr('src', imgVerifyCodeUrlStr);
        } else {
            imgVerifyCodeUrlStr = '//captcha.fang.com/Display?type=soufangbang&width=100&height=32&r=1354173503' + imgVerifyCodeUrlStr;
            $('#phoneGetImgVerifyCode').attr('src', imgVerifyCodeUrlStr);
        }
    };

    PhoneLoginOrRegisteredCodeUtil.prototype.submitCodeAnswer = function () {
        var verifyCodeStr = $('#phoneImgVerifyCodeId').val().trim();
        if (!verifyCodeStr) {
            alert('验证码为空，请输入验证码！');
            verifyCodeStr = '-0';
        } else {
            $('#phoneDivImgVerify1').hide();
        }
        return verifyCodeStr;
    };
    // ---------------------------------------------------------------------
    function sendPhoneLoginOrRegisteredCode(phonestr, codestr, callback, noCookie) {
        // @update zhangdaliang@fang.com 20161116
        // noCookie参数用于控制是否种cookie
        // outlogin参数传0或不传：表示种cookie，参数sfut返回空；传1或非0：表示不种cookie，参数sfut值为sfutcookie
        var codeUrlStr = 'https://passport.fang.com/loginverifysms.api?service=soufun-wap-wap&mobilephone=' + phonestr + '&mobilecode=' + codestr;
        codeUrlStr = noCookie ? codeUrlStr + '&outlogin=1' : codeUrlStr;
        $.ajax({
            type: 'get',
            async: false,
            url: codeUrlStr,
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'flightHandler',
            success: function (json) {
                console.log('Message==' + json.Message + 'Tip===' + json.Tip + 'sfut==' + json.Sfut);
                if (json.Message === 'Success') {
                    callback(true,json.Sfut);
                } else {
                    callback(false);
                }
            },
            error: function () {
                callback(false);
            }
        });
    }


    function getPhoneVerifyCode(phonestr, callbackSucess, callbackFail) {
        new PhoneLoginOrRegisteredCodeUtil(phonestr, function (iscode) {
            if (iscode) {
                if (callbackSucess) {
                    callbackSucess();
                }
            } else if (callbackFail) {
                callbackFail();
            }
        });
    }

    function sendVerifyCodeAnswer(phonestr, codestr, callbackSucess, callbackFail, noCookie) {
        sendPhoneLoginOrRegisteredCode(phonestr, codestr, function (iscode,sfut) {
            if (iscode) {
                if (callbackSucess) {
                    callbackSucess(sfut);
                }
            } else if (callbackFail) {
                callbackFail();
            }
        }, noCookie);
    }

    return {
        getPhoneVerifyCode: getPhoneVerifyCode,
        sendVerifyCodeAnswer: sendVerifyCodeAnswer
    };

    // -------------------------------------------------------------------------------
}, window);