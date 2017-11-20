/**
 * modified by 张达亮 on 15.9.23
 */
define('modules/jiajuds/oneToThree', ['jquery', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var verifycode = require('verifycode/1.0.0/verifycode');
        // 活动规则
        $('#rules').on('click', function () {
            $('body').animate({scrollTop: $('#rulesdiv').offset().top}, 200);
        });
        // 60秒后才能重新发送验证码
        var patterntel = /^1[3,4,5,7,8]\d{9}$/;
        var tnow = 60;
        var phone = $('#phone');

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

        // 发送验证码
        var flag = true;
        $('#sendcode').on('click', function () {
            if ($(this).val() === '获取验证码' || $(this).val() === '重新发送') {
                var mobilephone = phone.val();
                if (!mobilephone) {
                    alert('请输入手机号码！');
                    return;
                }
                if (patterntel.test(mobilephone) && flag) {
                    flag = false;
                    verifycode.getPhoneVerifyCode(mobilephone, function () {
                        setnum();
                        flag = true;
                    }, function () {
                        flag = true;
                    });
                } else {
                    flag = true;
                    alert('手机号输入不正确！');
                    return false;
                }
            } else {
                flag = true;
                return false;
            }
        });
        // 提交
        function signup() {
            var a = phone.val() || '';
            var d = $('#vcode').val() || '';
            //  var cityinfo = $('#cityname  option:selected').val().split('|');
            var cityinfo = $('#cityname').find('option:selected').val().split('|');
            var c = cityinfo[1];
            var encity = cityinfo[0];
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
            if (c === '城市') {
                alert('您还未选择所在城市');
                return false;
            }
            $('#submit').val('提交中...');
            var e = {
                phone: a,
                code: d
            };
            var b = vars.jiajuSite + '?c=jiajuds&a=oneTo3checkCode&city=' + encity + '&r=' + Math.random();
            var doTH = function () {
                $.get(b, e, function (j) {
                    if (j.userlogin.return_result === '100') {
                        // 成功，提交订单信息
                        var ajaxUrl = vars.jiajuSite + '?c=jiajuds&a=ajaxCreateOrder2&city=' + encity + '&r=' + Math.random();
                        var jsondata = {
                            soufunid: j.userlogin.userid,
                            realname: j.userlogin.realname,
                            phone: a,
                            src: vars.src
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
                                    $('#return_urlv').val(obj.detail.return_url);
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
                                    $('#form').submit();
                                } else {
                                    alert(obj.errormessage);
                                    $('#submit').val('即刻领取');
                                    return false;
                                }
                            }
                        });
                    } else {
                        alert('验证码错误！');
                        $('#submit').val('即刻领取');
                        return false;
                    }
                });
            };
            if (d) {
                verifycode.sendVerifyCodeAnswer(a, d,
                    doTH, function () {
                    });
            } else {
                doTH();
            }
        }

        // 报名
        $('#submit').on('click', function () {
            signup();
        });
        // 微信分享
        wx.config({
            //  必填，公众号的唯一标识
            appId: vars.appId,
            //  必填，生成签名的时间戳
            timestamp: vars.timestamp,
            //  必填，生成签名的随机串
            nonceStr: vars.nonceStr,
            //  必填，签名，见附录1
            signature: vars.signature,
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        var shareurl = vars.jiajuSite + '?c=jiajuds&a=oneToThree&src=clientwx';
        wx.ready(function () {
            //  获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                // 分享标题
                title: '3000元礼包大放送，房天下装修，只为您精致的家！',
                link: shareurl,
                // 分享图标
                imgUrl: vars.public + 'img/app_jiaju_logo.png'
            });
            //  获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                // 分享标题
                title: '3000元礼包大放送，房天下装修，只为您精致的家！',
                // 分享描述
                desc: '我刚刚领取了3000元装修券，你也来试试吧！',
                link: shareurl,
                // 分享图标
                imgUrl: vars.public + 'img/app_jiaju_logo.png'
            });
        });
    };
});