/**
 * @Author: chenshaoshan
 * @Date:   2015/12/18
 * @description: 手机动态登录或注册发送验证码 公用
 * @Last Modified by:   chenshaoshan
 * @Last Modified time:
 */
function PhoneLoginOrRegisteredUtil(phone, cbfn) {
    this.phonestr = phone;
    this.servicestr = 'soufun-lottery-wap';
    this.callbackfn = cbfn;
    this.initPhoneCode(this);
}
// 初始化验证码
PhoneLoginOrRegisteredUtil.prototype.initPhoneCode = function (obj) {
    var phonecodeurlstr = 'https://passport.fang.com/loginsendmsm.api?service=' + obj.servicestr
        + '&mobilephone=' + obj.phonestr;
    obj.sendCodeReq(obj, phonecodeurlstr);
};
PhoneLoginOrRegisteredUtil.prototype.sendCodeReq = function (obj, mesgStr) {
    $.ajax({
        type: 'get',
        async: false,
        url: mesgStr,
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'flightHandler',
        success: function (json) {
            if (json.Message === 'Success') {
                obj.callbackfn(true,'验证码发送成功');
            } else if (json.IsSent === 'true') {
                obj.callbackfn(false,'手机上已有两条未验证验证码，不再发送验证码！');
            } else if (json.IsShowMathCode === 'true') {
                // 需要图文验证码
                obj.initCodeWinDom(obj);
            } else {
                obj.callbackfn(false,json.Tip);
            }
        },
        error: function () {
            obj.callbackfn(false,'请求发送失败');
        }
    });
};
// --------------------------------------------------------------
// 初始化验证码
PhoneLoginOrRegisteredUtil.prototype.initCodeWinDom = function (obj) {
    if ($('#phoneDivImgVerify1').length < 1) {
        var codeWinStr = '<div id="phoneDivImgVerify1" style="position: fixed;width: 100%;height: 100%;left: 0;top: 0;background: rgba(0,0,0,0.3);z-index: 998;">'
            + '<div id="phoneDivImgVerify2" style="position: relative;padding: 20px 15px;width: 250px;background-color: #ffffff;margin: -67px auto 0;top: 50%;">'
            + '<div id="phoneDivImgVerify3" style="border: 1px solid #dedede;padding: 10px 5px 10px 5px;border-radius: 4px;">'
            + '<img id="phoneGetImgVerifyCode">'
            + '<input id="phoneImgVerifyCodeId" type="text" placeholder="验证码" style="position: relative;display: flex;top: -33px;left: 150px;width: 80px;padding-left: 5px;font-size: 15px;line-height: 24px;">'
            + '</div>'
            + '<div id="phoneDivImgVerify4" style="margin-top: 15px;">'
            + '<a id="phoneImgVerifyCodeSubmit" style="background-color: #f00;line-height: 40px;width: 220px;margin: 0 auto;color: #ffffff;display: block;border-radius: 4px;text-align: center;">确 定</a>'
            + '</div></div></div>';

        $('body').append(codeWinStr);

        $('#phoneGetImgVerifyCode').on('click', function () {
            obj.refreshVerifyCode(obj);
        });
        $('#phoneImgVerifyCodeSubmit').on('click', function () {
            var MathCodestr = obj.submitCodeAnswer(obj);
            if (MathCodestr !== '-0') {
                var phonecodeurlstr = 'https://passport.fang.com/loginsendmsm.api?service=' + obj.servicestr
                    + '&mobilephone=' + obj.phonestr + '&mathcode=' + MathCodestr;
                obj.sendCodeReq(obj, phonecodeurlstr);
            }
        });
    } else {
            $('#phoneDivImgVerify1').show();
    }
    obj.refreshVerifyCode(obj);
};

PhoneLoginOrRegisteredUtil.prototype.refreshVerifyCode = function (obj) {
    var num = Math.random() * 1000;
    var verifyRandomOnly = parseInt(num, 10);
    var imgVerifyCodeUrlStr = verifyRandomOnly;

    if (verifyRandomOnly % 2 === 0) {
        $('#phoneDivImgVerify3').css('height', '80px');
        imgVerifyCodeUrlStr = 'http://captcha.fang.com/Display?r=' + imgVerifyCodeUrlStr;
        $('#phoneGetImgVerifyCode').attr('src', imgVerifyCodeUrlStr);
    } else {
        $('#phoneDivImgVerify3').css('height', '30px');
        imgVerifyCodeUrlStr = 'http://captcha.fang.com/Display?type=soufangbang&width=100&height=32&r=1354173503' + imgVerifyCodeUrlStr;
        $('#phoneGetImgVerifyCode').attr('src', imgVerifyCodeUrlStr);
    }
};

PhoneLoginOrRegisteredUtil.prototype.submitCodeAnswer = function (obj) {
    var verifyCodeStr = $('#phoneImgVerifyCodeId').val().trim();
    if (verifyCodeStr === null || verifyCodeStr === '' || typeof(verifyCodeStr) == 'undefined') {
        alert('验证码为空，请输入验证码！');
        return '-0';
    } else {
        $('#phoneDivImgVerify1').hide();
        return verifyCodeStr;
    }
}
// ---------------------------------------------------------------------
function sendPhoneLoginOrRegisteredCode(phonestr, codestr, callback) {
    var codeUrlStr = 'https://passport.fang.com/loginverifysms.api?service=soufun-lottery-wap&mobilephone=' + phonestr
        + '&mobilecode=' + codestr;
    $.ajax({
        type: 'get',
        async: false,
        url: codeUrlStr,
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'flightHandler',
        success: function (json) {
            if (json.Message === 'Success') {
                callback(true,'验证码验证通过');
            } else {
                callback(false,json.Tip);
            }
        },
        error: function () {
            callback(false,'请求发送失败');
        }
    });
}


function getPhoneVerifyCode(phonestr, callbackSucess, callbackFail) {
    var verifycode = new PhoneLoginOrRegisteredUtil(phonestr, function (iscode,msg){
        if (iscode) {
            if (callbackSucess !== null && callbackSucess !== '') {
                callbackSucess(msg);
            }
        } else {
            if (callbackFail !== null && callbackFail !== '' ) {
                callbackFail(msg);
            }
        }
    });
}
function sendVerifyCodeAnswer(phonestr, codestr, callbackSucess, callbackFail) {
    sendPhoneLoginOrRegisteredCode(phonestr, codestr, function (iscode,msg){
        if (iscode) {
            if (callbackSucess !== null && callbackSucess !== '') {
                callbackSucess(msg);
            }
        } else {
            if (callbackFail !== null && callbackFail !== '' ) {
                callbackFail(msg);
            }
        }
    });
}
// -------------------------------------------------------------------------------
