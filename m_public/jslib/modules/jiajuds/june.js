define('modules/jiajuds/june', ['jquery',, 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var verifycode = require("verifycode/1.0.0/verifycode");
        var patterntel = /^1[3,4,5,7,8]\d{9}$/;
        var tnow = 60;
        // 30秒后才能重新发送验证码
        function setnum() {
            if (tnow > 0) {
                $('#sendcode').val('发送中(' + tnow + ')');
                tnow--;
                setTimeout(setnum, 1000);
            } else {
                $('#sendcode').val('重新发送');
                tnow = 60;
            }
        }
        var phone = $('#phone');
        $('#sendcode').on('click', function () {
            if ($(this).val() === '获取验证码' || $(this).val() === '重新发送') {
                var mobilephone = phone.val();
                if (mobilephone === '') {
                    alert('请输入手机号码！');
                    return;
                }
                if (patterntel.test(mobilephone)) {
                    verifycode.getPhoneVerifyCode(phone.val(),
                        function () {
                            setnum();
                        }, function () {
                    });
                } else {
                    alert('手机号输入不正确！');
                }
            }
        });

        // 提交
        function signup() {
            var a = phone.val() || '';
            var d = $('#vcode').val() || '';
            var c = $('#city').find('option:selected').val();
            if (a === '') {
                alert('请输入手机号');
                return false;
            }
            if (!patterntel.test(a)) {
                alert('手机号输入不正确');
                return false;
            }
            if (d === '') {
                alert('请填写验证码');
                return false;
            }
            $('#submit').attr('src', '//js.soufunimg.com/common_m/m_jiaju/other_images/btn4.png');
            var e = {
                phone: a,
                code: d
            };
            var b = vars.jiajuSite + '?c=jiajuds&a=junecheckCode&r=' + Math.random();
            var doTH = function () {
                $.get(b, e, function (j) {
                    if (j.userlogin.return_result === '100') {
                        // 成功，提交订单信息
                        var ajaxUrl = vars.jiajuSite + '?c=jiajuds&a=ajaxCreateOrder&r=' + Math.random();
                        var jsondata = {
                            soufunid: j.userlogin.userid,
                            realname: j.userlogin.realname,
                            phone: a,
                            code: d,
                            refereeSoufunID: vars.shareid,
                            cityname: c.split('|')[0],
                            src: vars.src,
                            encity: c.split('|')[1]
                        };
                        $.ajax({
                            type: 'get',
                            url: ajaxUrl,
                            data: jsondata,
                            success: function (obj) {
                                if (obj.issuccess === '1') {
                                    $('#biz_id').val(obj.detail.biz_id);
                                    $('#call_time').val(obj.detail.call_time);
                                    $('#charset').val(obj.detail.charset);
                                    $('#extra_param').val(obj.detail.extra_param);
                                    $('#invoker').val(obj.detail.invoker);
                                    $('#notify_url').val(obj.detail.notify_url);
                                    $('#out_trade_no').val(obj.detail.out_trade_no);
                                    $('#paid_amount').val(obj.detail.paid_amount);
                                    $('#platform').val(obj.detail.platform);
                                    $('#total').val(obj.detail.price);
                                    $('#quantity').val(obj.detail.quantity);
                                    $('#return_url').val(obj.detail.return_url);
                                    $('#service').val(obj.detail.service);
                                    $('#sign_type').val(obj.detail.sign_type);
                                    $('#title').val(obj.detail.title);
                                    $('#trade_amount').val(obj.detail.trade_amount);
                                    $('#trade_type').val(obj.detail.trade_type);
                                    $('#user_id').val(obj.detail.user_id);
                                    $('#version').val(obj.detail.version);
                                    $('#sign').val(obj.detail.sign);
                                    $('#origin').val(obj.detail.origin);
                                    $('#subject').val(obj.detail.subject);
                                    $('#vcode').val('');
                                    $('#form').submit();
                                } else {
                                    alert(obj.errormessage);
                                    $('#submit').attr('src', '//js.soufunimg.com/common_m/m_jiaju/other_images/btn1.png');
                                    return false;
                                }
                            }
                        });
                    } else {
                        alert('验证码错误！');
                        $('#submit').attr('src', '//js.soufunimg.com/common_m/m_jiaju/other_images/btn1.png');
                        return false;
                    }
                });
            }
            if ($('#vcode').val() !== '') {
                verifycode.sendVerifyCodeAnswer(phone.val(), $('#vcode').val(),
                    doTH, function () {
                        alert('验证码错误！');
                        $('#submit').attr('src', '//js.soufunimg.com/common_m/m_jiaju/other_images/btn1.png');
                        return false;
                    });
            } else {
                doTH();
            }

        }
        // 报名
        $('#submit').on('click', function () {
            if ($(this).attr('src').indexOf('btn1') > 0) {
                signup();
            } else {
                return false;
            }
        });

        // 微信分享
        window.wx.config({
            // 必填，公众号的唯一标识
            appId: vars.appId,
            // 必填，生成签名的时间戳
            timestamp: vars.timestamp,
            // 必填，生成签名的随机串
            nonceStr: vars.nonceStr,
            // 必填，签名，见附录1
            signature: vars.signature,
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2*/
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        var shareurl = vars.jiajuSite + '?c=jiajuds&a=jjhdlist&src=clientwx';
        if (vars.shareid !== '') {
            shareurl += '&shareid=' + vars.shareid;
        }

        /* 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口*/
        window.wx.ready(function () {
            window.wx.onMenuShareTimeline({
                // 分享标题
                title: '房天下请你装修啦!500元装修券限量发送！',
                link: shareurl,
                // 分享图标
                imgUrl: '//js.soufunimg.com/common_m/m_public/img/app_jiaju_logo.png',
                success: function () {
                    // 用户确认分享后执行的回调函数
                    var okurl = vars.jiajuSite + '?c=jiajuds&a=ajaxshareCount&r=' + Math.random();
                    $.ajax(okurl);
                }
            });

            /* 获取“分享给朋友”按钮点击状态及自定义分享内容接口*/
            window.wx.onMenuShareAppMessage({
                // 分享标题
                title: '房天下请你装修啦!500元装修券限量发送！',
                // desc: '我刚刚领取了500元装修券，你也来试试吧！', /* 分享描述*/
                link: shareurl,
                // 分享图标
                imgUrl: '//js.soufunimg.com/common_m/m_public/img/app_jiaju_logo.png',
                success: function () {
                    // 用户确认分享后执行的回调函数
                    var okurl = vars.jiajuSite + '?c=jiajuds&a=ajaxshareCount&r=' + Math.random();
                    $.ajax(okurl);
                }
            });
        });
    };
});