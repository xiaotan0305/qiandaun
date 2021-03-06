/**
 * Created by LXM on 15-3-17.
 * 单量修改于2015-9-9
 */
 define('modules/jiaju/zxCaseDetail', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'verifycode/1.0.0/verifycode',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw'
    ], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            require('lazyload/1.9.1/lazyload');
            var verifycode = require('verifycode/1.0.0/verifycode');
            $('.lazyload').lazyload();
            var stage = $('.swiperIndex');
            var jiajuUtils = vars.jiajuUtils;
            var freeOrder = $('.yuyueBtn');
            var maskFixed = $('.sf-maskFixed');
            var maskFloat = $('.sf-maskFixed .zx-yuyue-but');
            var phoneCode = $('#phoneCode');
            var vcodeBtn = $('#sendPhoneCode');
            var vCode = $('#phoneTxt');
            var orderSubmit = $('.yuyueSub');
            var codeInput = $('.codeInput')
            var sendText = $('#sendText');
            var sendFloat = $('#sendFloat');
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
        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'jj_mt^alxq_wap',
            companyid: vars.companyid,
            caseid: vars.caseId,
            area: vars.area,
            style: vars.casestylename,
            housetype: vars.caseRoomName,
            totalprice: vars.Wprice + '万'
        });
        // 收藏按钮
        var iconFav = $('.icon-fav');
        // 是否收藏
        var hasCollect;
        // 收藏成功的浮层
        var floatAlert = $('.floatAlert');
        var lookFavList = $('#lookFavList');
        var continueBigImg = $('#continueBigImg');

        pageInit();
        function pageInit() {
            // hasCollect初始化
            iconFav[vars.collectInfo === '1' ? 'addClass' : 'removeClass']('cur');
            hasCollect = vars.collectInfo === '1' ? true : false;
            // 登录状态将手机号放报名框
            if (vars.phone) {
                phoneNumber = vars.phone;
            }
            // ajax展示团购
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXTuanList&city=' + vars.city + '&companyid=' + vars.companyid, function (data) {
                if (data && data.list[0].id) {
                    var actStr = '<div class="lp-hd-box"><ul>';
                    actStr += '<li class="tuangou">';
                    actStr += '<a href="' + vars.jiajuSite + '?c=jiaju&a=tuanDetail&city=' + vars.city + '&id=' + data.list[0].id + '" class="arr-rt">';
                    actStr += '<h4 class="red-f5">' + data.list[0].title + '</h4>';
                    actStr += '</a></li></ul></div>';
                    $('#tuanSection').show().html(actStr);
                }
            });
            eventInit();
            require.async('swipe/3.10/swiper', function (Swiper) {
                new Swiper('.swiper-container', {
                    direction: 'horizontal',
                    pagination: '.swiper-pagination',
                    lazyLoading: true,
                    onInit: function (swiper) {
                        stage.find('span').text('1/' + swiper.slides.length);
                    },
                    onSlideChangeEnd: function (swiper) {
                        stage.find('span').text(swiper.activeIndex + 1 + '/' + swiper.slides.length);
                    }
                });
            });
            /**
             * 日志统计
             */
             $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXLog&city=' + vars.city + '&typeid=5&objid=' + vars.caseId + '&refer=' + encodeURIComponent(document.referrer) + '&sorce=' + encodeURIComponent(location.href));
        }

         function eventInit() {

            /** 点赞*/
            var zan = $('#zan');
            zan.on('click', function () {
                // 用户行为
                yhxw({
                    page: 'jj_mt^alxq_wap',
                    type: 55,
                    companyid: vars.companyid,
                    caseid: vars.caseId,
                    area: vars.area,
                    style: vars.casestylename,
                    housetype: vars.caseRoomName,
                    totalprice: vars.Wprice + '万'
                });
                if (checkLogin()) {
                    $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZanCaseDetail&city=' + vars.city + '&caseid=' + vars.caseId, function (data) {
                        if (data && data.Message) {
                            toastFn(data.Message.Code === '0' ? '您已点赞了哦' : '您已点赞成功');
                            zan.addClass(data.Message.Code === '0' ? '' : 'cur');
                            // 点赞数+1
                            var num = parseInt(zan.html() ? zan.html() : 0);
                            zan.html(data.Message.Code === '0' ? num : (num + 1) + '<i class="on">+1</i>');
                        }
                    });
                }
            });
            
            // 收藏
            iconFav.on('click', function () {
                
                // 只统计收藏用户行为
                !hasCollect && yhxw({
                    page: 'jj_mt^alxq_wap',
                    type: 21,
                    companyid: vars.companyid,
                    caseid: vars.caseId,
                    area: vars.area,
                    style: vars.casestylename,
                    housetype: vars.caseRoomName,
                    totalprice: vars.Wprice + '万'
                });
                var canAjax = true;
                if (canAjax && checkLogin()) {
                    var $that = $(this);
                    canAjax = false;
                    // 收藏ajax请求
                    $.ajax({
                        url: vars.jiajuSite + '?c=jiaju&a=ajaxPicCollect',
                        data: {
                            // choice:2取消收藏,3收藏
                            choice: hasCollect ? 2 : 3,
                            // infoType:2单图，1案例
                            infoType: 1,
                            InfoId: vars.caseId,
                            linkurl: location.href,
                            picUrl: $('#swiper').find('img').eq(0).attr('src'),
                            title: vars.casestylename + vars.caseRoomName
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

            /** 点击更多，查看更多案例说明*/
            var more = $('.more'), intro = $('.intro');
            var moreHeight = intro.find('div').height();
            if (moreHeight <= 63) {
                more.hide();
                intro.css('overflow', 'visible');
                intro.css('max-height', 'none');
            }
            more.on('click', function () {
                if (intro.css('overflow') === 'hidden') {
                    intro.css('max-height','none');
                    intro.css('overflow', 'visible');
                    more.addClass('s2');
                } else {
                    intro.css('max-height','63px');
                    intro.css('overflow', 'hidden');
                    more.removeClass('s2');
                }
            });
            freeOrder.on('click', function () {
                maskFloat.css({bottom: -1 * maskFixed.height()});
                maskFixed.css({'z-index': 1000}).show();
                maskFloat.animate({bottom: 0}, 500);
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
                codeNumber = vCode.val();
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
            contact.on('click', function () {
                // 在线沟通用户行为统计
                yhxw({
                    page: 'jj_mt^alxq_wap',
                    type: 24,
                    companyid: vars.companyid,
                    caseid: vars.caseId,
                    area: vars.area,
                    style: vars.casestylename,
                    housetype: vars.caseRoomName,
                    totalprice: vars.Wprice + '万'
                });
                //获取服务器时间戳
                var content = '';
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetServerDate', function(info){
                    if (vars.localStorage) {
                        var lastTime = vars.localStorage.getItem('caseinfo_'+vars.caseId);
                        if (info - lastTime > 1800) {
                            //需要更新状态
                            vars.localStorage.setItem('caseinfo_'+vars.caseId, info);
                            content = encodeURIComponent($('title').text()+window.location.href);
                        }
                    }
                });
                // ajax获取IM信息
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZxIm&city=' + vars.city + '&companyid=' + vars.companyid, function (data) {
                    if (data.issuccess == '1') {
                        if (vars.localStorage) {
                            vars.localStorage.setItem(String('h:' + data.soufunname), encodeURIComponent(vars.imName ? vars.imName : data.soufunname) + ';' + data.img
                                + ';;');
                        }
                        window.location = '/chat.d?m=chat&username=h:' + data.soufunname + '&city=' + vars.city + '&type=waphome&content=' + encodeURIComponent(content) + '&projinfo=jiaju&shopid=za' + vars.caseId;
                    } else {
                        toastFn('获取用户信息失败，请重试!');
                    }
                });
            });
            $('.icon4').on('click', function () {
                // 打电话用户行为统计
                yhxw({
                    page: 'jj_mt^alxq_wap',
                    type: 31,
                    companyid: vars.companyid,
                    caseid: vars.caseId,
                    area: vars.area,
                    style: vars.casestylename,
                    housetype: vars.caseRoomName,
                    totalprice: vars.Wprice + '万'
                });
            });
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
                t: 'case'
            };
            ajaxflag.checkVerifyCode = false;
            // 用户行为统计
            yhxw({
                page: 'jj_mt^alxq_wap',
                type: 554,
                companyid: vars.companyid,
                caseid: vars.caseId,
                phone: phoneCode.val().trim(),
                area: vars.area,
                style: vars.casestylename,
                housetype: vars.caseRoomName,
                totalprice: vars.Wprice + '万'
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

        /**
         * 判断是否登录
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
        var shareTitle = vars.realestate + '装修案例';
        var shareDesc = '这套' + vars.casestylename + '的' + vars.caseRoomName + '超棒';
        shareDesc += vars.Wprice ? '，只花了' + vars.Wprice + '万' : '';
        shareDesc += '，速来围观！';
        var shareImg = location.protocol + $('#swiper').find('img').eq(0).attr('data-src');
        var shareLink;
        if (location.href.indexOf('?') === -1) {
            shareLink = location.href + '?source=fx_zxal';
        } else {
            shareLink = location.href.indexOf('source=fx_zxal') === -1 ? location.href + '&source=fx_zxal' : location.href;
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
            // 分享用户行为
            yhxw({
                page: 'jj_mt^alxq_wap',
                type: 22,
                companyid: vars.companyid,
                caseid: vars.caseId,
                area: vars.area,
                style: vars.casestylename,
                housetype: vars.caseRoomName,
                totalprice: vars.Wprice + '万'
            });
            superShare.share();
        });
    };
});