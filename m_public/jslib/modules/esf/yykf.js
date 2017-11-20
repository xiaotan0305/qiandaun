define('modules/esf/yykf', ['jquery', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var patternname = /^[a-zA-Z\u4e00-\u9fa5]{2,}$/;
        // 验证姓名
        var patterntel = /^1[34578]\d{9}$/;
        // 验证手机号码
        var patterncode = /^\d{4}$/;
        // 验证验证码
        var timeCount = 60;
        var usernameIdObj = $('#username');
        var phoneIdObj = $('#phone');
        // 是否已经发送了短信验证码
        var sendFlag = false;
        $('input[type=hidden]').each(function (index, element) {
            vars[element.id] = element.value;
        });

        // 判断房源是否已经预约
        var jsondataS = {
            houseid: vars.HouseID,
            city: vars.city,
            r: Math.random()
        };
        $.get(vars.esfSite + 'index.php?c=esf&a=getOrderStatus', jsondataS, function (data) {
            if (data === '1') {
                // 已经预约,设置按钮为灰色
                $('#signup').css({'background-color': 'white',border: '1px solid #e3e7ed'}).val('已预约');
                $('#sendcode').css({'background-color': 'white',border: '1px solid #e3e7ed'}).val('已验证');
            }
        });

        usernameIdObj.focus(function () {
            $('#nametext').removeClass('tip fc00').text('');
            $(this).attr('style', ' ');
        }).blur(function () {
            if (patternname.test(usernameIdObj.val()) === false) {
                // 如果姓名格式不正确
                $('#nametext').addClass('tip fc00').text('姓名输入错误，请重新输入');
                $(this).attr('style', 'color:red;');
            }
        });
        // 手机号码
        phoneIdObj.focus(function () {
            $('#phonetext').removeClass('tip fc00').text('');
            $(this).attr('style', ' ');
        });

        function phoneCheck() {
            // var phoneIdObj = $('#phone');
            if (patterntel.test(phoneIdObj.val()) === false) {
                // 如果手机号不正确
                $('#phonetext').addClass('tip fc00').text('手机号输入错误，请重新输入');
                // phoneIdObj.attr('style', 'color:red;');
            } else {
                $('#phonetext').removeClass('tip fc00').text('');
                // phoneIdObj.attr('style', ' ');
            }
        }
        phoneIdObj.on('blur', phoneCheck);

        // 验证码验证
        $('#code').focus(function () {
            $('#codetext').removeClass('tip fc00').text('');
        }).blur(function () {
            if (patterncode.test($('#code').val()) === false) {
                // 如果验证码格式不正确
                $('#codetext').addClass('tip fc00').text('验证码输入错误，请重新输入');
            }
        });

        // 修改手机号码
        function changephone() {
            $('#changetel').html('<input type="text"  value="" class="ipt-text"  name="phone" id="phone" placeholder="请输入手机号" maxlength="11">'
                + '<p class="tip fc00" id="phonetext"></p>');
            $('#showsendcode').show();
            $('#showimgcode').show();
            $('#phone').bind('blur', phoneCheck);
        }
        $('#changephone').on('click', changephone);

        function updateTime() {
            $('#sendcode').val('重新发送(' + timeCount + ')');
            timeCount--;
            if (timeCount >= 0) {
                setTimeout(function () {
                    updateTime();
                }, 1000);
            } else {
                $('#sendcode').val('重新获取').attr('disabled', false);
                sendFlag = false;
                timeCount = 60;
            }
        }

        var sendSuccess = function () {
            sendFlag = true;
            updateTime();
        };

        // 发送验证码
        function getphonecode() {
            if (sendFlag) {
                return false;
            }
            var mobilephone = $('#phone').val() || $('#teltext').text();
            phoneCheck();
            if (patterntel.test(mobilephone)) {
                // 判断是否已预约过
                if ($.trim($('#signup').val()) === '已预约') {
                    return false;
                }
                if (vars.userid) {
                    // 登录用户实现绑定 发送 验证码 20160810
                    var mesgStr = 'https://passport.fang.com/sendsms.api?service=soufun-wap-wap&mobilephone=' + $('#phone').val();
                    $.ajax({
                        type: 'get',
                        async: false,
                        url: mesgStr,
                        dataType: 'jsonp',
                        jsonp: 'callback',
                        success: function (json) {
                            // 发送验证码成功，进入倒计时
                            if (json.Message === 'Success') {
                                sendSuccess();
                            } else if (json.IsSent === 'true') {
                                alert('手机上已有两条未验证验证码，不再发送验证码！');
                                return false;
                            } else {
                                alert(json.Tip);
                                return false;
                            }
                        },
                        error: function () {
                            alert('发送失败');
                            return false;
                        }
                    });
                } else {
                    var verifycode = require('verifycode/1.0.0/verifycode');
                    verifycode.getPhoneVerifyCode(mobilephone, sendSuccess, function () {
                        return false;
                    });
                }
            }
        }
        $('#sendcode').on('click', getphonecode);

        var submit = function () {
            var LinkPhone = $('#phone').val() || $('#teltext').text();
            var LinkMan = usernameIdObj.val() || '';
            // 布码
            require.async('jsub/_ubm.js', function () {
                _ub.city = vars.cityname;
                _ub.biz = 'e';
                // 业务---WAP端
                var ns = vars.ns === 'n' ? 0 : 1;
                _ub.location = ns;
                // 方位（南北方) ，北方为0，南方为1
                var b = 8;
                // 预约看房
                var pTemp = {
                    me18: vars.HouseID,
                    me1: vars.plotid,
                    met: vars.agentid,
                    mpe: encodeURIComponent(LinkMan),
                    mp9: LinkPhone,
                    mpj: '1'
                };
                var p = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp in pTemp) {
                    if (pTemp.hasOwnProperty(temp)) {
                        if (pTemp[temp] !== null && '' !== pTemp[temp] && undefined !== pTemp[temp] && 'undefined' !== pTemp[temp]) {
                            p[temp] = pTemp[temp];
                        }
                    }
                }
                // 用户行为(格式：'字段编号':'值')
                _ub.collect(b, p);
                // 收集方法
            });
            // 分享预约传参
            var isshare = '';
            var shareAgentId = '';
            if (vars.isshare === 'share' || vars.isshare === 'agent') {
                isshare = vars.isshare;
                shareAgentId = vars.shareAgentId;
            }
            var jsondata = {
                LinkMan: encodeURIComponent(LinkMan),
                delegateid: vars.delegateid,
                HouseID: vars.HouseID,
                KFUserID: vars.KFUserID,
                KfUsername: vars.KfUsername,
                SalerID: vars.SalerID,
                SalerName: vars.SalerName,
                LookType: vars.LookType,
                LinkPhone: LinkPhone,
                city: vars.city,
                utmTerm: vars.utm_term,
                utmSource: vars.utm_source,
                r: Math.random(),
                isshare: isshare,
                ShareAgentID: shareAgentId
            };
            var ajaxUrl = vars.esfSite + '?c=esf&a=ajaxGetYyMsg';
            $.post(ajaxUrl, jsondata,
                function (data) {
                    if (data.result === '1') {
                        $('#yydSuc').show();
                    } else if (data.result === 'v5') {
                        $('#codetext').addClass('tip fc00').text('短信验证码输入错误，请重新输入');
                    } else {
                        alert('预约失败，请再次尝试');
                    }
                });
        };

        var verifyError = function () {
            alert('请输入正确的短信验证码');
            return false;
        };


        // 报名
        function signup() {
            // 判断是否已预约过
            if ($.trim($('#signup').val()) === '已预约') {
                return false;
            }
            var LinkPhone = $('#phone').val() || $('#teltext').text();
            var LinkMan = usernameIdObj.val() || '';
            if (!patternname.test(LinkMan) || !patterntel.test(LinkPhone)) {
                alert('请输入名字和手机号码');
                return false;
            }
            if (vars.userid) {
                // 登录用户实现绑定 20160810
                var mesgStr = 'https://passport.fang.com/verifysmstobindorchangebind.api?service=soufun-wap-wap&mobilephone=' + $('#phone').val() + '&vcode=' + $('#code').val();
                $.ajax({
                    type: 'get',
                    async: false,
                    url: mesgStr,
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    success: function (json) {
                        // 绑定成功则提交预约
                        if (json.Message === 'Success') {
                            submit();
                        } else {
                            alert('手机绑定失败，请重新输入');
                        }
                    },
                    error: function () {
                        alert('发送失败');
                    }
                });
            } else {
                // 验证手机验证码
                if (!patterncode.test($('#code').val())) {
                    alert('请输入正确的短信验证码');
                    return false;
                }
                var verifycode = require('verifycode/1.0.0/verifycode');
                verifycode.sendVerifyCodeAnswer($('#phone').val(), $('#code').val(), submit
                    , verifyError);
            }
        }
        $('#signup').on('click', signup);
    };
});