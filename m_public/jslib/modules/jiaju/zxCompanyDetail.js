/**
 * @file 装修公司详情页
 * @author muzhaoyang 2017-05-03
 */
define('modules/jiaju/zxCompanyDetail', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'modules/map/API/BMap',
    'verifycode/1.0.0/verifycode',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var jiajuUtils = vars.jiajuUtils;
        var loadMore = require('loadMore/1.0.0/loadMore');
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        require('modules/map/API/BMap');
        var verifycode = require('verifycode/1.0.0/verifycode');
        var BMap = window.BMap;
        // 收藏按钮
        var $collect = $('#collect');
        var freeOrder = $('.yuyueBtn');
        var maskFixed = $('.sf-maskFixed');
        var maskFloat = $('.sf-maskFixed .zx-yuyue-but');
        var phoneCode = $('#phoneCode');
        var vcodeBtn = $('#sendPhoneCode');
        var vCode = $('#phoneTxt');
        var orderSubmit = $('.yuyueSub');
        var codeInput = $('.codeInput');
        var sendText = $('#sendText');
        var sendFloat = $('#sendFloat');
        var caseSection = $('#caseSection');
        var phoneNumber, codeNumber;
        var contact = $('#contact');
        var flag = {
            phoneEmpty: false,
            phoneIlleagal: false,
            vCodeSend: false,
            vCodeEmpty: false,
            vCodeIlleagal: false
        };
        var toastMes = {
            phoneEmpty: '请输入手机号',
            phoneIlleagal: '输入手机号格式错误',
            vCodeSend: '请先发送验证码',
            vCodeEmpty: '请输入验证码',
            vCodeIlleagal: '输入验证码错误'
        };
        var ajaxflag = {
            getVerifyCode: true,
            checkVerifyCode: true
        };
        // 商家活动之团购
        var actSection = $('#actSection');
        var actList = $('#actList');

        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        pageInit();
        function pageInit() {
            if (vars.phone) {
                phoneNumber = vars.phone;
            }
            // ajax展示案例
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetCompanyCaseNew&companyid=' + vars.companyid + '&city=' + vars.city, function (data) {
                if ($.trim(data)) {
                    caseSection.show();
                    caseSection.html(data);
                    $('.lazyload').lazyload();
                }
            });
            // ajax展示推荐内容
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetFirmList&page=1&pagesize=5&isDetail=1&companyid=' + vars.companyid + '&city=' + vars.city,
                function (data) {
                    if ($.trim(data)) {
                        $('#recomSection').show().html(data);
                        $('.lazyload').lazyload();
                    }
                });
            // ajax展示设计师
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXCompayDetailSjs&companyid=' + vars.companyid + '&city=' + vars.city, function (data) {
                if ($.trim(data)) {
                    $('#sjsSection').show().html(data);
                    $('.lazyload').lazyload();
                }
            });
            // ajax展示猜你喜欢
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXGuessLike&isSjs=1&isCase=1&city=' + vars.city, function (data) {
                if ($.trim(data)) {
                    $('#likeSection').show().html(data);
                }
            });
            // ajax展示团购(如果有礼，则先展示礼，礼盒团购超过2条则隐藏)
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXTuanList&city=' + vars.city + '&companyid=' + vars.companyid, function (data) {
                var actLen = 0, vipNum = actList.find('li.VIP').length;
                if (data && data.list[0].id) {
                    actLen = data.list.length;
                    var hideNum = vipNum ? 1 : 2;
                    var moreActBtnShow = ((vipNum && actLen > 1) || (!vipNum && actLen > 2)) ? 1 : 0;
                    var actStr = '';
                    for (var i = 0; i < actLen; i++) {
                        actStr += '<li class="tuangou" ';
                        if (i >= hideNum) {
                            actStr += 'style="display:none;"';
                        }
                        actStr += '><a href="' + vars.jiajuSite + '?c=jiaju&a=tuanDetail&city=' + vars.city + '&id=' + data.list[i].id + '" class="arr-rt">';
                        actStr += '<h4 class="red-f5">' + data.list[i].title + '</h4>';
                        actStr += '</a></li>';
                    }
                    actList.append(actStr);
                    actSection.append(moreActBtnShow ? '<div class="lp-hd-more"><a href="javascript:void(0);" id="moreActBtn">查看更多活动</a></div>' : '');
                }
                if (vipNum || actLen) {
                    actSection.show();
                }
            });
            eventInit();
            require.async('swipe/3.10/swiper', function (Swiper) {
                new Swiper('.swiper-container', {
                    direction: 'horizontal',
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    observer: true,
                    observeParents: true,
                    lazyLoading: true
                });
            });

            /* 统计日志*/
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXLog&city=' + vars.city + '&typeid=52&objid=' + vars.companyid + '&refer='
                + encodeURIComponent(document.referrer) + '&sorce=' + encodeURIComponent(location.href));

            // 浏览用户行为
            yhxw({
                page: 'jj_gs^xq_wap',
                companyid: vars.companyid
            });
        }

        function eventInit() {
            // 点击查看更多活动（2017.11.1）
            $('body').on('click', '#moreActBtn', function () {
                actList.find('.tuangou').show();
                $(this).hide();
            });

            freeOrder.on('click', function () {
                maskFloat.css({ bottom: -1 * maskFixed.height() });
                maskFixed.show();
                maskFloat.animate({ bottom: 0 }, 500);
                jiajuUtils.toggleTouchmove(true);
            });
            maskFixed.on('click', function (event) {
                if (!$(event.target).parents('.zx-yuyue-but').eq(0).length) {
                    maskFixed.hide();
                    jiajuUtils.toggleTouchmove(false);
                }
            });
            phoneCode.on('input', function () {
                phoneNumber = phoneCode.val().trim();
                vcodeBtn.removeClass('active');
                var able = /^1[34578][0-9]{9}$/.test(phoneNumber);
                if (able) {
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
            vCode.on('input', function () {
                codeNumber = vCode.val().trim();
                var able = /^\s*\d{4}\s*$/.test(codeNumber);
                if (able) {
                    flag.vCodeEmpty = true;
                    flag.vCodeIlleagal = true;
                } else if (!codeNumber) {
                    flag.vCodeEmpty = false;
                } else {
                    flag.vCodeEmpty = true;
                    flag.vCodeIlleagal = false;
                }
            }).on('blur', function () {
                codeNumber = vCode.val();
                if (!flag.vCodeEmpty) {
                    toastFn(toastMes.vCodeEmpty);
                } else if (!flag.vCodeIlleagal) {
                    toastFn(toastMes.vCodeIlleagal);
                }
            });
            vcodeBtn.on('click', function () {
                var hasActive = $(this).hasClass('active');
                hasActive && getVerifyCode();
            });
            orderSubmit.on('click', function () {
                if (vars.phone) {
                    ajaxflag.checkVerifyCode && orderAjaxFn();
                } else if (!flag.phoneEmpty) {
                    toastFn(toastMes.phoneEmpty);
                } else if (!flag.phoneIlleagal) {
                    toastFn(toastMes.phoneIlleagal);
                } else if (!flag.vCodeSend) {
                    toastFn(toastMes.vCodeSend);
                } else if (!flag.vCodeEmpty) {
                    toastFn(toastMes.vCodeEmpty);
                } else if (!flag.vCodeIlleagal) {
                    toastFn(toastMes.vCodeIlleagal);
                } else {
                    ajaxflag.checkVerifyCode && checkVerifyCode();
                }
            });
            // 收藏功能
            $collect.on('click', (function () {
                var canAjax = true;
                return function () {
                    if (canAjax && checkLogin()) {
                        canAjax = false;
                        $.ajax({
                            url: vars.jiajuSite + '?c=jiaju&a=ajaxCompanyCollect&companyid=' + vars.companyid + '&r=' + Math.random(),
                            success: function (data) {
                                if (!data) {
                                    var Msg = '收藏失败, 请刷新重试';
                                    if ($collect.hasClass('cur')) {
                                        Msg = '取消' + Msg;
                                    }
                                    toastFn(Msg);
                                } else if (data.IsSuccess === '0') {
                                    toastFn(data.Message);
                                } else if (data.IsSuccess === '1') {
                                    $collect.toggleClass('cur');
                                    toastFn(data.CollectStatus === '1' ? '收藏成功' : '取消收藏成功');
                                    // 收藏用户行为统计
                                    yhxw({
                                        page: 'jj_gs^xq_wap',
                                        type: data.CollectStatus === '1' ? 21 : 91,
                                        companyid: vars.companyid
                                    });
                                }
                            },
                            complete: function () {
                                canAjax = true;
                            }
                        });
                    }
                };
            })());
            contact.on('click', function () {
                // 在线咨询用户行为统计
                yhxw({
                    page: 'jj_gs^xq_wap',
                    type: 24,
                    companyid: vars.companyid
                });
                //获取服务器时间戳
                var content = '';
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetServerDate', function(info){
                    if (vars.localStorage) {
                        var lastTime = vars.localStorage.getItem('firminfo_'+vars.companyid);
                        if (info - lastTime > 1800) {
                            //需要更新状态
                            vars.localStorage.setItem('firminfo_'+vars.companyid, info);
                            content = encodeURIComponent($('title').text()+window.location.href);
                        }
                    }
                });
                // ajax获取IM信息
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZxIm&city=' + vars.city + '&companyid=' + vars.companyid, function (data) {
                    if (data.issuccess === '1') {
                        if (vars.localStorage) {
                            vars.localStorage.setItem(String('h:' + data.soufunname), encodeURIComponent(vars.storename) + ';' + data.img
                                + ';;');
                        }
                        window.location = '/chat.d?m=chat&username=h:' + data.soufunname + '&city=' + vars.city + '&type=waphome&content=' + encodeURIComponent(content);
                    } else {
                        toastFn('获取用户信息失败，请重试!');
                    }
                });
            });

            // 打电话用户行为统计
            $('.icon4').on('click', function () {
                yhxw({
                    page: 'jj_gs^xq_wap',
                    type: 31,
                    companyid: vars.companyid
                });
            });
        }

        /**
         * [checkLogin description] 收藏功能判断当前是否登录
         * @return {[type]} [description]
         */
        function checkLogin() {
            var res = true;
            if (!vars.login_visit_mode) {
                res = false;
                window.location.href = vars.loginUrl;
            }
            return res;
        };

        /**
         * [toastFn description] 页面提示信息函数
         * @param  {[type]} msg [description]
         * @return {[type]}     [description]
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
         * [getVerifyCode description] 获取验证码
         * @return {[type]} [description]
         */
        function getVerifyCode() {
            ajaxflag.getVerifyCode = false;
            codeInput.show();
            verifycode.getPhoneVerifyCode(phoneNumber, function () {
                vcodeBtn.removeClass('active');
                phoneCode.attr('disabled', 'true');
                flag.vCodeSend = true;
                timeRecorder(60);
                ajaxflag.getVerifyCode = true;
            }, function () {
                toastFn('获取验证码失败');
                ajaxflag.getVerifyCode = true;
            });
        }

        /**
         * [timeRecorder description] 验证码倒计时
         * @param  {[type]} timePara [description] 设置倒计时的时长
         * @return {[type]}          [description]
         */
        function timeRecorder(timePara) {
            var handle = setInterval(function () {
                vcodeBtn.text('发送中(' + timePara + ')');
                if (timePara === 0) {
                    clearInterval(handle);
                    vcodeBtn.text('重新发送').addClass('active');
                }
                timePara--;
            }, 1000);
        }

        /**
         * [checkVerifyCode description] 登录信息验证
         * @return {[type]} [description]
         */
        function checkVerifyCode() {
            ajaxflag.checkVerifyCode = false;
            verifycode.sendVerifyCodeAnswer(phoneNumber, codeNumber, orderAjaxFn, function () {
                toastFn(codeNumber ? '验证码错误' : '请输入验证码');
                ajaxflag.checkVerifyCode = true;
            });
        }

        /**
         * [buyAjaxFn description] 提交验证
         * @return {[type]} [description]
         */
        function orderAjaxFn() {
            var paramObj = {
                phone: vars.phone ? vars.phone : phoneNumber,
                companyId: vars.companyid,
                city: vars.city,
                t: 'company'
            };
            ajaxflag.checkVerifyCode = false;
            // 免费预约用户行为统计
            yhxw({
                page: 'jj_gs^xq_wap',
                type: 554,
                companyid: vars.companyid,
                phone: phoneCode.val().trim()
            });
            $.ajax({
                type: 'post',
                url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxZXAppointment',
                data: paramObj,
                success: function (data) {
                    if (data.issuccess === '1') {
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
                    ajaxflag.checkVerifyCode = true;
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
        // 分享功能
        var shareTitle = vars.storename + '超棒，已有' + vars.visitcountmonth + '人预约咨询';
        var shareDesc;
        if (parseInt(vars.lidaodian) || parseInt(vars.lidingdan)) {
            shareDesc = vars.lidaodian ? '到店即享' + vars.lidaodianremark : '到店即享' + vars.lidingdanremark;
        } else {
            shareDesc = location.href;
        }
        var shareImg = location.protocol + $('#swiper').find('img').eq(0).attr('data-src');
        var shareLink;
        if (location.href.indexOf('?') === -1) {
            shareLink = location.href + '?source=fx_zsgs';
        } else {
            shareLink = location.href.indexOf('source=fx_zsgs') === -1 ? location.href + '&source=fx_zsgs' : location.href;
        }
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: shareTitle,
            descContent: shareDesc,
            lineLink: shareLink,
            imgUrl: shareImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: shareTitle,
            // 分享时的图标
            image: shareImg,
            // 分享内容的详细描述
            desc: shareDesc,
            // 分享的链接地址
            url: shareLink,
            // 分享的内容来源
            from: '房天下家居' + vars.imgUrl + 'images/app_jiaju_logo.png'
        };
        var superShare = new SuperShare(config);
        // 点击分享按钮
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});
