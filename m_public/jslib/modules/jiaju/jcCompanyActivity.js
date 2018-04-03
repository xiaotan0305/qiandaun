/**
 * Created on 2017/7/31.
 */
define('modules/jiaju/jcCompanyActivity', ['jquery', 'verifycode/1.0.0/verifycode','weixin/2.0.2/weixinshare',
    'superShare/2.0.1/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        /**
         * 轮播图
         */
        var jcCompanyActivity = $('#jcCompanyActivity');
        require.async('swipe/3.10/swiper', function (Swiper) {
            if (jcCompanyActivity) {
                new Swiper('#jcCompanyActivity', {
                    direction: 'horizontal',
                    lazyLoading: true
                });
            }
        });
        /**
         * 报名
         */
        var verifycode = require('verifycode/1.0.0/verifycode');
        var jiajuUtils = vars.jiajuUtils;
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
         * 验证码倒计时
         * @param time 倒计时时间s
         */
        function timeRecorder(time) {
            var handler = setInterval(function () {
                vcodeBtn.text('发送中(' + time + ')');
                if (time === 0) {
                    clearInterval(handler);
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
                phoneCode.attr('disable', 'true');
                flag.phoneTxtSend = true;
                timeRecorder(60);
                ajaxFlag.getVerifyCode = true;
            }, function () {
                toastFn('获取验证码失败');
                ajaxFlag.getVerifyCode = true;
            });
        }

        /**
         * 校验验证码
         */
        function checkVerifyCode() {
            ajaxFlag.checkVerifyCode = false;
            verifycode.sendVerifyCodeAnswer(phoneNumber, codeNumber, orderAjaxFn, function () {
                toastFn(codeNumber ? '验证码错误' : '请输入验证码');
                ajaxFlag.checkVerifyCode = true;
            });
        }
        var paramsObj;
        function orderAjaxFn() {
            paramsObj = {
                companyId: vars.companyid,
                companyName: encodeURIComponent(vars.companyName),
                sourceType: 5,
                objectId: vars.objectId,
                objectName: encodeURIComponent(vars.objectName),
                category: encodeURIComponent(vars.category)
            };
            ajaxFlag.checkVerifyCode = false;
            $.post(vars.jiajuSite + '?c=jiaju&a=ajaxJCAppointment&city=' + vars.city, paramsObj, function (t) {
                ajaxFlag.checkVerifyCode = true;
                if (t.isSuccess === '1') {
                    if (t.message == '\u6d3b\u52a8\u62a5\u540d\u6210\u529f\uff01') {
                        window.location.href = vars.jiajuSite+'?c=jiaju&a=jcOrderResult&cid='+vars.companyid+'&aid='+vars.objectId+'&cname='+vars.category+'&type=1';
                    } else {
                        window.location.href = vars.jiajuSite+'?c=jiaju&a=jcOrderResult&cid='+vars.companyid+'&aid='+vars.objectId+'&cname='+vars.category+'&type=2';
                    }
                } else {
                    window.location.href = vars.jiajuSite+'?c=jiaju&a=jcOrderResult&cid='+vars.companyid+'&aid='+vars.objectId+'&cname='+vars.category+'&type=3';
                }
            });
        }
        //手机号输入校验
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
        //验证码输入校验
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
        //点击【发送验证码】按钮
        vcodeBtn.off('click').on('click', function () {
            var hasActive = $(this).hasClass('active');
            hasActive && getVerifyCode();
        });
        //点击【立即报名】按钮
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

        /**
         * 更多简介
         */
        var activCon = $('.activCon');
        var pheight = activCon.find('.content').height();
        var moreXq = $('.more_xq');
        //如果小于93px则隐藏更多按钮
        if (pheight < 93) {
            moreXq.hide();
        }
        moreXq.on('click', function () {
            var that = $(this);
            if (that.css('-webkit-transform') == 'none') {
                activCon.css('max-height', '');
                that.css('-webkit-transform', 'rotateX(180deg)');
            } else {
                activCon.css('max-height', '93px');
                that.css('-webkit-transform', 'none');
            }
        });
        /* 分享*/
        var detailOptions = {
            // 分享给朋友
            onMenuShareAppMessage: {
                shareTitle: vars.typename + vars.title,
                descContent: vars.companyName + '正在促销中，赶快进店看看！'
            },
            // 分享到朋友圈
            onMenuShareTimeline: {
                shareTitle: vars.companyName + vars.title,
                descContent: ''
            }
        };
        var Weixin = require('weixin/2.0.2/weixinshare');
        new Weixin({
            debug: false,
            detailOptions: detailOptions,
            lineLink: location.href,
            imgUrl: vars.shareImage,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.1/superShare');
        var superShare = new SuperShare({
            image: vars.shareImage,
            url: location.href,
            from: '房天下家居'
        }, detailOptions);
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});
