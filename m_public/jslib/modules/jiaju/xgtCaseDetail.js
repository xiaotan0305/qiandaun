define('modules/jiaju/xgtCaseDetail', [
    'jquery',
    'photoswipe/4.0.8/photoswipe',
    'photoswipe/4.0.8/photoswipe-ui-default.min',
    'superShare/1.0.1/superShare',
    'weixin/2.0.0/weixinshare',
    'verifycode/1.0.0/verifycode'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var superShare = require('superShare/1.0.1/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');
        var currentSpan = $('#currentItem');
        var dataNotFound = $('#notfound');
        var $iconFav = $('.icon-fav');
        var $shareSuc = $('.shareSuc');
        var toastTime;
        var $sendFloat = $('.favorite');
        var $sendText = $sendFloat;
        var vars = seajs.data.vars;
        var hasLoadPicIds = [];
        var comData = null;
        var share;
        var shareWx;
        var hasCollect;

        // 报名
        var verifycode = require('verifycode/1.0.0/verifycode');
        var jiajuUtils = vars.jiajuUtils;
        var freeOrder = $('.yuyueBtn');
        var maskFixed = $('.sf-maskFixed');
        var maskFloat = $('.sf-maskFixed .zx-yuyue-but');
        var phoneCode = $('#phoneCode');
        var vcodeBtn = $('#sendPhoneCode');
        var vCode = $('#phoneTxt');
        var orderSubmit = $('.yuyueSub');
        var codeInput = $('.codeInput');
        var sendText = $('#sendText');
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
        pageInit();

        /**
         * [pageInit description] page初始化
         * @return {[type]} [description]
         */
        function pageInit() {
            if (vars.phone) {
                phoneNumber = vars.phone;
            }
            // 头部样式
            $('header').addClass('head_2');
            // photoSwiper初始化
            photoSwiperInit();
            // 页面事件初始化
            eventInit();
            // hasCollect初始化
            $iconFav[vars.collectInfo === '1' ? 'addClass' : 'removeClass']('cur');
            hasCollect = vars.collectInfo === '1' ? true : false;
        }

        /**
         * [eventInit description] 事件初始化
         * @return {[type]} [description]
         */
        function eventInit() {
            // 数据请求失败时, 点击刷新
            dataNotFound.on('click', function () {
                window.location.reload();
            });
            // 微信分享成功弹层关闭按钮事件
            $shareSuc.find('.close').on('click', function () {
                $shareSuc.hide();
            });

            /** 点赞*/
            var zan = $('#zan'), zanOn = $('.jj-zan'), numBox = zan.find('p');
            zan.on('click', function () {
                if (!vars.phone) {
                    window.location.href = vars.loginUrl + '?burl=' + encodeURIComponent(location.href);
                    return;
                }
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZanCaseDetail&city=' + vars.city + '&caseid=' + vars.caseId, function (data) {
                    if (data && data.Message) {
                        toast(data.Message.Code === '0' ? '您已点赞了哦' : '您已点赞成功');
                        // 点赞数+1
                        var num = parseInt(numBox.html() ? numBox.html() : 0);
                        zanOn.addClass(data.Message.Code === '0' ? '' : 'cur');
                        zanOn.html(data.Message.Code === '0' ? '' : '<i class="on">+1</i>');
                        numBox.html(data.Message.Code === '0' ? num : num + 1);
                    }
                });
            });

            // 收藏
            $iconFav.on('click', (function () {
                var canAjax = true;
                return function () {
                    if (canAjax && comData) {
                        // 判断是否登录，无登录跳登录页
                        if (vars.isLogin) {
                            var $this = $(this);
                            canAjax = false;
                            // var isCollected = $this.hasClass('cur');
                            // 收藏ajax请求
                            $.ajax({
                                url: vars.jiajuSite + '?c=jiaju&a=ajaxPicCollect',
                                data: {
                                    // choice:2取消收藏,3收藏
                                    choice: hasCollect ? 2 : 3,
                                    // infoType:2单图，1案例
                                    infoType: 1,
                                    InfoId: vars.caseId,
                                    picUrl: comData.picurl,
                                    title: vars.title,
                                    infoSoufunId: comData.soufunID
                                },
                                success: function (response) {
                                    if (+response.Message.Code === 1) {
                                        $this.toggleClass('cur');
                                        toast(hasCollect ? '取消收藏成功' : '收藏成功');
                                        hasCollect = !hasCollect;
                                        // comData.isCollect = !isCollected;
                                    }
                                },
                                complete: function () {
                                    canAjax = true;
                                }
                            });
                        } else {
                            location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href.replace(/\d{8}/, comData.picid));
                        }
                    }
                };
            })());

            freeOrder.on('click', function () {
                maskFloat.css({bottom: -1 * maskFixed.height()});
                maskFixed.css({'z-index': 10000}).show();
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
                    toast(toastMes.phoneEmpty);
                } else if (!flag.phoneIlleagal) {
                    toast(toastMes.phoneIlleagal);
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
                    toast(toastMes.vCodeEmpty);
                } else if (!flag.vCodeIlleagal) {
                    toast(toastMes.vCodeIlleagal);
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
                    toast(toastMes.phoneEmpty);
                } else if (!flag.phoneIlleagal) {
                    toast(toastMes.phoneIlleagal);
                } else if (!flag.vCodeSend) {
                    toast(toastMes.vCodeSend);
                } else if (!flag.vCodeEmpty) {
                    toast(toastMes.vCodeEmpty);
                } else if (!flag.vCodeIlleagal) {
                    toast(toastMes.vCodeIlleagal);
                } else {
                    ajaxflag.checkVerifyCode && checkVerifyCode();
                }
            });
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
                toast('获取验证码失败');
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
                toast(codeNumber ? '验证码错误' : '请输入验证码');
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
                t: 'caseBigImg'
            };
            ajaxflag.checkVerifyCode = false;
            $.ajax({
                type: 'post',
                url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxZXAppointment',
                data: paramObj,
                success: function (data) {
                    if (data.issuccess === '1') {
                        maskFixed.hide();
                        toast('恭喜您预约成功啦~');
                        codeInput.hide();
                    } else {
                        toast(data.message);
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
         * [shareFn description] 页面分享初始化
         * @param  {[type]} config   [description] superShare options
         * @param  {[type]} wxConfig [description] 微信分享options
         * @return {[type]}          [description]
         */
        function shareFn(config, wxConfig) {
            if (share) {
                // 更新分享信息
                share.updateConfig(config);
                shareWx.updateOps(wxConfig);
            } else {
                // 初始化分享
                share = new superShare(config);
                shareWx = new wxShare(wxConfig, function () {
                    // 微信成功回调
                    $shareSuc.show();
                });
                // 此处分享按钮不在main里，分享插件不支持，故重新绑定事件
                $('.icon-share').on('click', function () {
                    var ua = share.ua;
                    // 判断浏览器类型;
                    if (ua.name === '微信客户端' || ua.name === '微博客户端' || ua.name === 'QQ客户端' || ua.name === 'QQZone客户端') {
                        share.weixinFloat.show();
                    } else if (ua.name === 'UC浏览器') {
                        share.shareByUC();
                    } else if (ua.name === 'QQ浏览器') {
                        share.shareByQQ();
                    } else {
                        share.floatMask.addClass('mask-visible');
                        share.shareFloat.show();
                    }
                });
            }
        };

        /**
         * [photoSwiperInit description] photoSwiper插件初始化
         * @return {[type]} [description]
         */
        function photoSwiperInit() {
            var items = [],
            $pics = $('.picture').find('a'),
            total = $pics.length,
            lightBox;
            $pics.each(function (index, pic) {
                hasLoadPicIds.push($(this).data('picid'));
                var image = new Image(),
                    $pic = $(pic);
                var $href = $pic.attr('href'),
                    $comment = $pic.data('comment'),
                    $imgThis = $pic.find('img');
                image.src = $imgThis.attr('src');
                $(image).on('load error', function () {
                    total--;
                    items[index] = {
                        src: $href,
                        w: this.naturalWidth,
                        h: this.naturalHeight,
                        comment: $comment
                    };
                    if (!total) {
                        var $pswp = $('.pswp')[0];
                        var options = {
                            index: parseInt(vars.index),
                            closeEl: false,
                            captionEl: false,
                            fullscreenEl: false,
                            zoomEl: false,
                            shareEl: false,
                            counterEl: false,
                            arrowEl: false,
                            showHideOpacity: true,
                            loop: false,
                            closeOnScroll: false,
                            closeOnVerticalDrag: false,
                            pinchToClose: false,
                            specialHistoryUrl: true,
                            history: false
                        };
                        //  Initialize PhotoSwipe
                        lightBox = new window.PhotoSwipe($pswp, window.PhotoSwipeUI_Default, items, options);

                        // 判断方向
                        lightBox.listen('beforeChange', function (to) {
                            comData = lightBox.currItem.comment;
                            // 初始化当前图片是否已经被收藏
                            // $iconFav[+comData.isCollect ? 'addClass' : 'removeClass']('cur');
                            // 初始化当前图片分享链接
                            shareFn({
                                    url: location.href.replace(/picid=\d+$/,'picid=' + comData.picid),
                                    title: comData.NewTitle,
                                    desc: comData.NewTitle,
                                    image: comData.picurl
                                    }, {
                                    lineLink: location.href.replace(/picid=\d+$/,'picid=' + comData.picid),
                                    shareTitle: comData.NewTitle,
                                    descContent: comData.NewTitle,
                                    imgUrl: comData.picurl
                                    });
                            //初始化当前元素的描述,初始化当前元素的索引
                            var partHtml = '<h3>' + '&nbsp;<span><i>' + (+lightBox.getCurrentIndex() + 1) + '</i>/' + lightBox.items.length + '</span></h3>' 
                                            + '<p class="f13 ellips_three" style="max-height:none;">' + (comData.Description ? comData.Description : '&nbsp;') + '</p>'

                            currentSpan.html(partHtml);
                        });
                        lightBox.init();
                    }
                });
            });
        }

        /**
         * [toast description] 收藏功能tip
         * @param  {[type]} msgType [description] 提示信息
         * @return {[type]}         [description]
         */
        function toast(msgType) {
            $sendText.text(msgType);
            $sendFloat.css({'z-index': 100000}).show();
            toastTime && clearTimeout(toastTime);
            toastTime = setTimeout(function () {
                $sendFloat.hide();
            }, 2000);
        }; 
    };
});