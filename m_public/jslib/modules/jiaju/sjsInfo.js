/**
 * Created by LXM on 15-3-16.
 * 单量更改于2015-9-9
 */
 define('modules/jiaju/sjsInfo', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'verifycode/1.0.0/verifycode',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw'
    ], function(require, exports, module) {
        'use strict';
        module.exports = function() {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var jiajuUtils = vars.jiajuUtils;
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var verifycode = require('verifycode/1.0.0/verifycode');
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
        var bottomFloat = $('#bottomFloat');
        var phoneNumber, codeNumber;
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
        var more = $('.more');
        var introduce = $('.intro');

        // 收藏按钮
        var iconFav = $('.icon-fav');
        // 是否收藏
        var hasCollect;
        // hasCollect初始化
        iconFav[vars.collectInfo === '1' ? 'addClass' : 'removeClass']('cur');
        hasCollect = vars.collectInfo === '1' ? true : false;
        // 收藏成功的浮层
        var floatAlert = $('.floatAlert');
        var lookFavList = $('#lookFavList');
        var continueBigImg = $('#continueBigImg');

        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'jj_sjs^xq_wap',
            designerid: vars.id
        });

        // ajax展示案例
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxSjsInfoCases&id=' + vars.id + '&companyid=' + vars.companyid + '&city=' + vars.city, function(data) {
            if ($.trim(data)) {
                $('#caseSection').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        // 为你推荐，ajax展示设计师
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetSjsList&page=1&pageSize=4&id=' + vars.id + '&city=' + vars.city, function(data) {
            if ($.trim(data)) {
                $('#sjsSection').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        // ajax展示猜你喜欢
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXGuessLike&isCompay=1&isCase=1&city=' + vars.city, function(data) {
            if ($.trim(data)) {
                $('#likeSection').show().html(data);
            }
        });
        // 证书
        require.async('swipe/3.10/swiper', function(Swiper) {
            new Swiper('#certificateList', {
                direction: 'horizontal',
                slidesPerView: 'auto',
                spaceBetween: 0,
                freeMode: true,
                lazyLoading: true,
                watchSlidesProgress: true,
                watchSlidesVisibility: true
            });
        });
        // 日志统计
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXLog&city=' + vars.city + '&typeid=51&objid=' + vars.id + '&refer=' + encodeURIComponent(document.referrer) + '&sorce=' + encodeURIComponent(location.href));

        eventInit();

        function eventInit() {
            freeOrder.on('click', function() {
                maskFloat.css({
                    bottom: -1 * maskFixed.height()
                });
                maskFixed.show();
                maskFloat.animate({
                    bottom: 0
                }, 500);
                jiajuUtils.toggleTouchmove(true);
            });
            maskFixed.on('click', function(event) {
                if (!$(event.target).parents('.zx-yuyue-but').eq(0).length) {
                    maskFixed.hide();
                    jiajuUtils.toggleTouchmove(false);
                }
            });
            phoneCode.on('input', function() {
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
            }).on('blur', function() {
                phoneNumber = phoneCode.val().trim();
                if (!flag.phoneEmpty) {
                    toastFn(toastMes.phoneEmpty);
                } else if (!flag.phoneIlleagal) {
                    toastFn(toastMes.phoneIlleagal);
                } else {
                    vcodeBtn.addClass('active');
                }
            });
            vCode.on('input', function() {
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
            }).on('blur', function() {
                codeNumber = vCode.val();
                if (!flag.vCodeEmpty) {
                    toastFn(toastMes.vCodeEmpty);
                } else if (!flag.vCodeIlleagal) {
                    toastFn(toastMes.vCodeIlleagal);
                }
            });
            vcodeBtn.on('click', function() {
                var hasActive = $(this).hasClass('active');
                hasActive && getVerifyCode();
            });
            orderSubmit.on('click', function() {
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
            $('.swiper-slide img').on('click', function() {
                var $self = $(this);
                var src = $self.data('img');
                $self.addClass('scale');
                var bool = $self.hasClass('scale');
                showImageFn(bool, src);
                $('#bigWrap').on('click', function(event) {
                    event.target.nodeName.toLowerCase() === 'img' || showImageFn(false, src);
                    event.target.nodeName.toLowerCase() === 'img' || $(this).off('click');
                    event.target.nodeName.toLowerCase() === 'img' || $self.removeClass('scale');
                });
            });

            // 打电话用户行为统计
            $('.icon4').on('click', function() {
                yhxw({
                    page: 'jj_sjs^xq_wap',
                    type: 31,
                    designerid: vars.id,
                    companyid: vars.companyid
                });
            });
            $('#contact').on('click', function() {
                // 在线咨询用户行为统计
                yhxw({
                    page: 'jj_sjs^xq_wap',
                    type: 24,
                    designerid: vars.id,
                    companyid: vars.companyid
                });
                //获取服务器时间戳
                var content = '';
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetServerDate', function (info){
                    if (vars.localStorage) {
                        var lastTime = vars.localStorage.getItem('sjsinfo_'+vars.id);
                        if (info - lastTime > 1800) {
                            //需要更新状态
                            vars.localStorage.setItem('sjsinfo_'+vars.id, info);
                            content = encodeURIComponent($('title').text()+window.location.href);
                        }
                    }
                });
                // ajax获取IM信息
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZxIm&city=' + vars.city + '&designerid=' + vars.id, function (data) {
                    if (data.issuccess === '1') {
                        if (vars.localStorage) {
                            vars.localStorage.setItem(String('h:' + data.soufunname), encodeURIComponent(vars.truename) + ';' + vars.sjsLogo
                                + ';;');
                        }
                        window.location = '/chat.d?m=chat&username=h:' + data.soufunname + '&city=' + vars.city + '&type=waphome&content=' + encodeURIComponent(content) + '&projinfo=jiaju&shopid=zs' + vars.id;
                    } else {
                        toastFn('获取用户信息失败，请重试!');
                    }
                });
            });

            // 收藏
            iconFav.on('click', function () {
                // 用户行为
                !hasCollect && yhxw({
                    page: 'jj_sjs^xq_wap',
                    type: 21,
                    designerid: vars.id,
                    companyid: vars.companyid
                });
                var canAjax = true;
                if (canAjax && checkLogin()) {
                    var $that = $(this);
                    canAjax = false;
                    $.ajax({
                        url: vars.jiajuSite + '?c=jiaju&a=ajaxPicCollect',
                        data: {
                            // choice:2取消收藏,3收藏
                            choice: hasCollect ? 2 : 3,
                            // infoType:2单图，1案例, 3.设计师
                            infoType: 3,
                            InfoId: vars.id,
                            picUrl: location.protocol + vars.sjsLogo,
                            linkurl: location.href,
                            title: vars.truename
                        },
                        success: function (response) {
                            if (response.Message.Code === '1') {
                                $that.toggleClass('cur');
                                !hasCollect ? setTimeout(function () {
                                    floatAlert.show();
                                }, 1000) : toastFn('已取消收藏');
                                jiajuUtils.toggleTouchmove(true);
                                hasCollect = !hasCollect;
                            }
                        },
                        complete: function () {
                            canAjax = true;
                        }
                    });
                }
            });
            // 点击收藏成功浮层-继续看图
            continueBigImg.on('click', function () {
                floatAlert.hide();
                jiajuUtils.toggleTouchmove(false);
            });
            // 点击收藏成功浮层-查看收藏
            lookFavList.on('click', function () {
                location.href = vars.mySite + '?c=mycenter&a=myFavList&city=' + vars.city;
                jiajuUtils.toggleTouchmove(false);
            });

        }

        function showImageFn(bool, src) {
            var html = '<div id="bigWrap" style="display:flex;width:width: 100%;height:100%;align-items:center;justify-content:center;">' + '<img style="width:100%;" src="' + src + '"/>' + '</div>';
            $('.floatBtns2')[bool ? 'hide' : 'show']();
            $('.float')[bool ? 'show' : 'hide']().html(bool ? html : '');
            jiajuUtils.toggleTouchmove(bool);
        }
        /**
         * [toastFn description] 页面提示信息函数
         * @param  {[type]} msg [description]
         * @return {[type]}     [description]
         */
         function toastFn(msg) {
            sendText.text(msg);
            sendFloat.show();
            jiajuUtils.toggleTouchmove(true);
            setTimeout(function() {
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
            }, function() {
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
            var handle = setInterval(function() {
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
            verifycode.sendVerifyCodeAnswer(phoneNumber, codeNumber, orderAjaxFn, function() {
                toastFn(codeNumber ? '验证码错误' : '请输入验证码');
                ajaxflag.checkVerifyCode = true;
            });
        }

        /**
         * [buyAjaxFn description] 提交验证
         * @return {[type]} [description]
         */
         function orderAjaxFn() {
            ajaxflag.checkVerifyCode = false;
            // 用户行为统计
            yhxw({
                page: 'jj_sjs^xq_wap',
                type: 554,
                designerid: vars.id,
                companyid: vars.companyid,
                phone: phoneCode.val().trim()
            });
            $.ajax({
                type: 'get',
                url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxSjsAppointment&city=' + vars.city + '&companyId=' + vars.companyid + '&userId=' + vars.userId,
                success: function(data) {
                    if (data.issuccess === '1') {
                        maskFixed.hide();
                        toastFn('恭喜您预约成功啦~');
                        codeInput.hide();
                    } else {
                        toastFn(data.message);
                    }
                    setTimeout(function() {
                        dealUrlFn();
                        // location.href = location.href + '&r=' + Math.random();
                    }, 2000);
                },
                complete: function() {
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
        
        /**
         * 判断当前用户是否登录
         */
        function checkLogin() {
            var res = true;
            if (!vars.login_visit_mode) {
                res = false;
                window.location.href = vars.loginUrl;
            }
            return res;
        }
        // 分享功能
        var shareTitle = '设计师' + vars.truename;
        shareTitle += vars.workyears ? '从业' + vars.workyears + '年' : '';
        shareTitle += vars.workprice ? '，收费标准' + vars.workprice : '';
        shareTitle += '等你来撩！';
        var shareDesc = '这个设计师有颜值更有实力！';
        shareDesc += vars.casecount ? '在房天下一共有' + vars.casecount + '套案例' : '';
        shareDesc += vars.goodatstyledisplay ? '，擅长' + vars.goodatstyledisplay.split(',')[0] : '';
        var shareImg = vars.sjsLogo ? location.protocol + vars.sjsLogo : vars.imgUrl + 'images/app_jiaju_logo.png';
        var shareLink;
        if (location.href.indexOf('?') === -1) {
            shareLink = location.href + '?source=fx_sjs';
        } else {
            shareLink = location.href.indexOf('source=fx_sjs') === -1 ? location.href + '&source=fx_sjs' : location.href;
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
            // 用户行为
            yhxw({
                page: 'jj_sjs^xq_wap',
                type: 22,
                designerid: vars.id,
                companyid: vars.companyid
            });
            superShare.share();
        });
        // 设计师履历
        more.on('click',function (){
            introduce.css('max-height', '');
            $(this).hide();
        })
    };
});