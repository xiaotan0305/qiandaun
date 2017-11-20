/**
 * Create by 2017.7.21
 */
define('modules/jiaju/tuanDetail', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'verifycode/1.0.0/verifycode',
    'modules/jiaju/yhxw',
    'weixin/2.0.2/weixinshare',
    'superShare/2.0.1/superShare'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        var pageId = vars.actName === 'tuanImageText' ? 'mjjtuanimagetext' : 'mjjtuandetail';
        yhxw({
            page: pageId,
            companyid: vars.companyid
        });

        // 团购详情头部的滑动图
        var stage = $('.but-stage');
        require.async('swipe/3.10/swiper', function (Swiper) {
            new Swiper('.swiper-container', {
                direction: 'horizontal',
                lazyLoading: true,
                onInit: function (swiper) {
                    stage.find('span').text('1/' + swiper.slides.length);
                },
                onSlideChangeEnd: function (swiper) {
                    stage.find('span').text(swiper.activeIndex + 1 + '/' + swiper.slides.length);
                }
            });
        });
        // 页面底部的聊天
        $('#onlineChat').on('click', function () {
            // 在线咨询用户行为统计
            yhxw({
                page: pageId,
                type: 24,
                companyid: vars.companyid
            });
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXIM&companyid=' + vars.companyid + '&city=' + vars.city, function (data) {
                if (data && data.issuccess === '1') {
                    if (vars.localStorage) {
                        vars.localStorage.setItem(String('h:' + data.soufunname), encodeURIComponent(data.soufunname) + ';' + data.img + ';;');
                    }
                    window.location = '/chat.d?m=chat&username=h:' + data.soufunname + '&city=' + vars.city + '&type=waphome';
                } else {
                    toastFn('获取用户信息失败，请重试!');
                }
            });
        });
        // 打电话用户行为统计
        $('.icon4').on('click', function () {
            yhxw({
                page: pageId,
                type: 31,
                companyid: vars.companyid
            });
        });

        var verifycode = require('verifycode/1.0.0/verifycode');
        var jiajuUtils = vars.jiajuUtils;
        var freeOrder = $('.yuyueBtn');
        var maskFixed = $('.sf-maskFixed');
        var maskFloat = $('.sf-maskFixed .zx-yuyue-but');
        var phoneCode = $('#phoneCode');
        var vcodeBtn = $('#sendPhoneCode');
        var phoneTxt = $('#phoneTxt');
        var orderSubmit = $('.yuyueSub');
        var codeInput = $('.codeInput');
        var sendText = $('#sendText');
        var sendFloat = $('#sendFloat');
        var phoneNumber, codeNumber;
        var flag = {
            phoneEmpty: false,
            phoneIlleagal: false,
            phoneTxtSend: false,
            phoneTxtEmpty: false,
            phoneTxtIlleagal: false
        };
        var toastMes = {
            phoneEmpty: '请输入手机号',
            phoneIlleagal: '输入手机号格式错误',
            phoneTxtSend: '请先发送验证码',
            phoneTxtEmpty: '请输入验证码',
            phoneTxtIlleagal: '输入验证码错误'
        };
        var ajaxFlag = {
            getVerifyCode: true,
            checkVerifyCode: true
        };
        eventInit();
        function eventInit() {
            if (vars.phone) {
                phoneNumber = vars.phone;
            }
            /**
             * 错误提示浮层
             * @param msg
             */
            function toastFn(msg) {
                sendText.text(msg);
                sendFloat.show();
                jiajuUtils.toggleTouchmove(true);
                setTimeout(function () {
                    sendFloat.hide();
                    jiajuUtils.toggleTouchmove(false);
                }, 2000);
            }

            /**
             * 验证码输入倒计时
             * @param time 设置倒计时的时长
             */
            function timeRecorder(time) {
                var handle = setInterval(function () {
                    vcodeBtn.text('发送中(' + time + ')');
                    if (time === 0) {
                        clearInterval(handle);
                        vcodeBtn.text('重新发送').addClass('active');
                    }
                    time--;
                }, 1000);
            }
            /**
             * 获取验证码
             */
            function getVerifyCode() {
                ajaxFlag.getVerifyCode = false;
                codeInput.show();
                verifycode.getPhoneVerifyCode(phoneNumber, function () {
                    vcodeBtn.removeClass('active');
                    phoneCode.attr('disabled', 'true');
                    flag.phoneTxtSend = true;
                    timeRecorder(60);
                    ajaxFlag.getVerifyCode = true;
                }, function () {
                    toastFn('获取验证码失败');
                    ajaxFlag.getVerifyCode = true;
                });
            }
            function checkVerifyCode() {
                ajaxFlag.checkVerifyCode = false;
                verifycode.sendVerifyCodeAnswer(phoneNumber, codeNumber, orderAjaxFn, function () {
                    toastFn(codeNumber ? '验证码错误' : '请输入验证码');
                    ajaxFlag.checkVerifyCode = true;
                });
            }
            function orderAjaxFn() {
                var paramsObj = {
                    phone: vars.phone ? vars.phone : phoneNumber,
                    companyid: vars.companyid,
                    groupid: vars.groupid
                };
                ajaxFlag.checkVerifyCode = false;
                // 用户行为
                yhxw({
                    page: pageId,
                    type: 554,
                    companyid: vars.companyid,
                    phone: phoneCode.val().trim()
                });
                $.ajax({
                    type: 'post',
                    url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxTuanCallOrder',
                    data: paramsObj,
                    success: function (data) {
                        if (data.isSuccess === '1') {
                            maskFixed.hide();
                            toastFn('恭喜您预约成功啦~');
                            codeInput.hide();
                        } else {
                            toastFn(data.message);
                        }
                        setTimeout(function () {
                            dealUrlFn();
                        }, 2000);
                    },
                    complete: function () {
                        ajaxFlag.checkVerifyCode = true;
                    }
                });
            }
            function dealUrlFn() {
                var pattern = /([\?|&]random=)\w\.[0-9]+/;
                var bool = pattern.test(location.href);
                if (bool) {
                    location.href = location.href.replace(pattern, '$1' + Math.random());
                } else {
                    var pinStr = location.href.indexOf('?') === -1 ? '?' : '&';
                    location.href = location.href + pinStr + 'random=' + Math.random();
                }
            }

            freeOrder.off('click').on('click', function () {
                maskFloat.css({bottom: -1 * maskFixed.height()});
                maskFixed.css({'z-index': 1000}).show();
                maskFloat.animate({bottom: 0}, 500);
                jiajuUtils.toggleTouchmove(true);
            });
            maskFixed.off('click').on('click', function (e) {
                if (!$(e.target).parents('.zx-yuyue-but').eq(0).length) {
                    maskFixed.hide();
                    jiajuUtils.toggleTouchmove(false);
                }
            });
            phoneCode.on('input', function () {
                phoneNumber = phoneCode.val().trim();
                vcodeBtn.removeClass('active');
                var phonePat = /^1[34578][0-9]{9}$/.test(phoneNumber);
                if (phonePat) {
                    flag.phoneEmpty = true;
                    flag.phoneIlleagal = true;
                    flag.phonevCodeSend = false;
                    vcodeBtn.addClass('active');
                } else if (!phoneNumber) {
                    flag.phoneEmpty = false;
                } else {
                    flag.phoneEmpty = true;
                    flag.phoneIlleagal = false;
                }
            }).on('blur', function () {
                phoneNumber = phoneCode.val().trim();
                if (!flag.phoneEmpty) {
                    toastFn(toastMes.phoneEmpty);
                } else if (!flag.phoneIlleagal) {
                    toastFn(toastMes.phoneIlleagal);
                } else {
                    vcodeBtn.addClass('active');
                }
            });
            phoneTxt.on('input', function () {
                codeNumber = phoneTxt.val().trim();
                var phonePat = /^\s*\d{4}\s*$/.test(codeNumber);
                if (phonePat) {
                    flag.phoneTxtEmpty = true;
                    flag.phoneTxtIlleagal = true;
                } else if (!codeNumber) {
                    flag.phoneTxtEmpty = false;
                } else {
                    flag.phoneTxtEmpty = true;
                    flag.phoneTxtIlleagal = false;
                }
            }).on('blur', function () {
                codeNumber = phoneTxt.val();
                if (!flag.phoneTxtEmpty) {
                    toastFn(toastMes.phoneTxtEmpty);
                } else if (!flag.phoneTxtIlleagal) {
                    toastFn(toastMes.phoneTxtIlleagal);
                }
            });
            vcodeBtn.off('click').on('click', function () {
                var hasActive = $(this).hasClass('active');
                hasActive && getVerifyCode();
            });
            orderSubmit.off('click').on('click', function () {
                if (vars.phone) {
                    ajaxFlag.checkVerifyCode && orderAjaxFn();
                } else if (!flag.phoneEmpty) {
                    toastFn(toastMes.phoneEmpty);
                } else if (!flag.phoneIlleagal) {
                    toastFn(toastMes.phoneIlleagal);
                } else if (!flag.phoneTxtSend) {
                    toastFn(toastMes.phoneTxtSend);
                } else if (!flag.phoneTxtEmpty) {
                    toastFn(toastMes.phoneTxtEmpty);
                } else if (!flag.phoneTxtIlleagal) {
                    toastFn(toastMes.phoneTxtIlleagal);
                } else {
                    ajaxFlag.checkVerifyCode && checkVerifyCode();
                }
            });

        }

        /* 分享*/
        var detailOptions = {
            // 分享给朋友
            onMenuShareAppMessage: {
                shareTitle: vars.title,
                descContent: '仅售' + vars.buyprice + '元！' + vars.productNames
            },
            // 分享到朋友圈
            onMenuShareTimeline: {
                shareTitle: vars.storename + ' ' + vars.buyprice + '元 ' + vars.productNames,
                descContent: ''
            }
        };
        var Weixin = require('weixin/2.0.2/weixinshare');
        new Weixin({
            debug: false,
            detailOptions: detailOptions,
            lineLink: location.href,
            imgUrl: location.protocol + vars.tuanImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.1/superShare');
        var superShare = new SuperShare({
            image: location.protocol + vars.tuanImg,
            url: location.href,
            from: '房天下家居'
        }, detailOptions);
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});