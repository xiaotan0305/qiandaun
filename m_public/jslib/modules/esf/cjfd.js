/** 租房和二手房春节送福袋公共js
 * Created by lina on 2017/1/4.
 */
define('modules/esf/cjfd', ['verifycode/1.0.0/verifycode', 'util/util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 福袋弹框入口
        var $fdBtn = $('.esf-fd-icon');
        // 福袋上的关闭按钮
        var $fdClose = $('.esf-fd-close');
        // 福袋弹框
        var $fdFloat = $('.esf-fd-out');
        // 福袋弹框上的关闭按钮
        var $close = $fdFloat.find('.close');
        // 没有登录的弹框
        var $nolog = $('#nologin');
        // 登录的弹框
        var $logged = $('#logged');
        // 当前没有优惠券的弹框
        var $received = $('#received');
        // 手机号输入框
        var $phone = $('#mobilecode');
        // 发送验证码插件
        var verifycode = require('verifycode/1.0.0/verifycode');
        // 引入getcookie函数
        var myCookie = require('util/util');

        // 事件阻止
        function preventDefault(e) {
            e.preventDefault();
        }

        // 手指滑动时阻止浏览器默认事件(阻止页面滚动）
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        // 手指滑动恢复浏览器默认事件（恢复滚动)
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }

        // 将年月1位数转换为两位数
        function addo(str) {
            if (str.length === 1) {
                return '0' + str;
            } else {
                return str;
            }
        }

        // 获取当前时间形如"20170205"的字符串
        var thistime = (function () {
            var mydate = new Date();
            // 获取年/月/日
            var thisYear = mydate.getFullYear().toString();
            var thisMon = addo((mydate.getMonth() + 1).toString());
            var thisday = addo(mydate.getDate().toString());
            // 生成字符串
            return parseInt(thisYear + thisMon + thisday);
        })();
        var isshow = vars.isshow;
        // 设置执行时间
        if (thistime < 20170120) {
            var testUrl = window.location.href.match('activity=cjfd');
            if (!(testUrl && isshow === '1')) {
                return;
            }
        } else if (thistime >= 20170120 && thistime <= 20170205) {
            if (isshow === '0') {
                return;
            }
        } else {
            return;
        }

        // 获取cookie当天过期剩余生存周期
        var leftTime = (function () {
            var curDate = new Date();
            // 当前时间戳
            var curTamp = curDate.getTime();
            // 当日凌晨的时间戳,减去毫秒是为了防止后续得到的时间不会达到00:00:00的状态
            var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
            // 当日已经过去的时间（毫秒）
            var passedTamp = (curTamp - curWeeHours);
            // 当日剩余时间
            var leftTamp = (24 * 60 * 60 * 1000 - passedTamp);
            // 将剩余时间转换为时间戳
            var leftTime = new Date();
            leftTime.setTime(leftTamp + curTamp);
            return leftTime.toGMTString();
        })();
        // 设置cookie函数
        var setCookie = function (name, value, days) {
            document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + days;
        };
        var islogin = myCookie.getCookie('sfut');
        var userid = '',cookFlagesf,cookFlagzf,cookesf,cookzf;
        if (islogin) {
            $.ajax({
                url: vars.esfSite + '?a=ajaxGetLoginfo&city=' + vars.city,
                success: function (data) {
                    console.log(data.userid);
                    userid = data.userid;
                    common(userid);
                }
            });
        } else {
            common(userid);
        }

        // 公共函数
        function common(userid) {
            // 登录/非登录 cookie名称不一样
            cookFlagesf = userid ? userid + 'esfviewcount' : 'esfviewcount';
            cookFlagzf = userid ? userid + 'zfviewcount' : 'zfviewcount';
            // 获取cookie值
            cookesf = myCookie.getCookie(cookFlagesf);
            cookzf = myCookie.getCookie(cookFlagzf);
            // 根据频道设置浏览次数
            if (vars.currentChannel === 'esf') {
                esfOrZf(cookesf, cookFlagesf, userid);
            } else if (vars.currentChannel === 'zf') {
                esfOrZf(cookzf, cookFlagzf, userid);
            }
        }


        // 点击关闭时cookie控制函数
        function toSetCookie() {
            // 一个频道关闭后需要同时设置两个频道都关闭
            setCookie(cookFlagesf, 'close', leftTime);
            setCookie(cookFlagzf, 'close', leftTime);
        }


        // 处理判断不同频道的计数cookie
        function esfOrZf(cookie, cookiename, islogin) {
            // 如果cookie值为关闭时不设置
            if (cookie === 'close') {
                return false;
            }
            // 浏览次数加1
            var number = cookie ? parseInt(cookie) + 1 : 1;
            // 设置当日有有效的cookie
            setCookie(cookiename, number, leftTime);
            // 登录时第四次调取ajax后显示福袋入口/未登录时第四次显示福袋入口
            if (parseInt(number) >= 4 && islogin) {
                $.ajax({
                    url: vars.esfSite + '?a=ajaxCheckLuckybag&city=' + vars.city,
                    success: function (data) {
                        if (data.errcode === '0') {
                            // 福袋入口显示
                            $fdBtn.show();
                            $fdClose.show();
                        }
                    },
                    error: function () {
                        displayLose(2000, '网络错误');
                    }
                });
            } else if (parseInt(number) >= 4) {
                // 福袋入口显示
                $fdBtn.show();
                $fdClose.show();
            }
        }
        // 点击福袋入口显示福袋弹框
        $fdBtn.on('click', function () {
            $fdFloat.show();
            unable();
            // 没有登录的时候验证是否领过福袋
            if (!userid) {
                // 显示用户登录弹框
                $nolog.show();
            } else {
                // 验证是否可以正常领取福袋
                verifysuccess();
            }
            toSetCookie();
        });
        // 点击福袋入口的关闭按钮
        $fdClose.on('click', function () {
            $fdClose.hide();
            $fdBtn.hide();
            toSetCookie();
            enable();
        });
        // 点击福袋弹框的关闭按钮
        $close.on('click', function () {
            $fdClose.hide();
            $fdBtn.hide();
            $fdFloat.hide();
            enable();
        });


        // 控制验证码发送成功后要60秒后才可以从新发送
        // 倒计时秒数
        var timeCount = 60;
        // 发送验证码按钮
        var $sendVerifyCode = $('.btn-style');
        var timer1;
        // 点击发送验证码成功时的回调函数
        function countDown() {
            // 发送验证码按钮置为灰色
            $sendVerifyCode.addClass('noClick');
            // 60s倒计时
            timer1 = setInterval(function () {
                timeCount--;
                $sendVerifyCode.text('重新发送(' + timeCount + ')');
                $phone.attr('disabled', true);
                if (timeCount === -1) {
                    // 清除定时器
                    clearInterval(timer1);
                    // 倒计时结束的时候把发送验证码的文本修改为重新获取
                    $sendVerifyCode.text('重新获取');
                    $phone.attr('disabled', false);
                    // 将发送验证码按钮设置为红色可点击状态
                    $sendVerifyCode.removeClass('noClick');
                    timeCount = 60;
                }
            }, 1000);
        }

        // 浮层提示控制
        var $sendFloat = $('#sendFloat');

        function displayLose(time, keywords, url) {
            $('#sendText').text(keywords);
            $sendFloat.show();
            setTimeout(function () {
                $sendFloat.hide();
                if (url) {
                    window.location.href = url;
                }
            }, time);
        }

        // 点击获取验证码
        var $isHas = $('.lq-intro');
        // 防止用户多次点击
        var verifyFlag = true;
        $sendVerifyCode.on('click', function () {
            if ($(this).hasClass('noClick')) {
                return false;
            } else if ($phone.val() === '') {
                displayLose(2000, '请输入手机号');
                return false;
            } else if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test($phone.val())) {
                displayLose(2000, '手机号码格式不正确');
                return false;
            }
            // 断网条件下提示
            var param = {
                city: vars.city,
                mobilecode: $phone.val()
            };
            if (!verifyFlag) {
                return false;
            }
            verifyFlag = false;
            $.ajax({
                url: vars.esfSite + '?a=ajaxCheckLuckybag',
                data: param,
                success: function (data) {
                    $isHas.hide();
                    // 已经领取过显示领取过的提示框
                    if (data.errcode === '1') {
                        $isHas.show();
                    } else if (data.errcode === '0') {
                        verifycode.getPhoneVerifyCode($phone.val(), countDown, function () {
                            return false;
                        });
                    } else if (data.errmsg) {
                        displayLose('2000', data.errmsg);
                    }
                },
                error: function () {
                    displayLose(2000, '网络错误');
                }
            }).always(function () {
                verifyFlag = true;
            });
        });
        // 防止用户多次点击
        var submitFlag = true;
        // 验证成功的回调函数
        var verifysuccess = function () {
            // 登录状态下验证用户是否已经领过
            var param = {
                city: vars.city
            };
            // 二手房优惠券，租房优惠券，积分券
            var esfPrefer = $('.fd-esf-yhq2');
            var esfyh = esfPrefer.find('span');
            var zfPrefer = $('.fd-esf-yhq1');
            var zfyh = zfPrefer.find('span');
            var jfPrefer = $('.fd-esf-jfq');
            var jf = jfPrefer.find('span');
            if (submitFlag) {
                submitFlag = false;
                $.ajax({
                    url: vars.esfSite + '?a=ajaxSendLuckybag&city=' + vars.city,
                    data: param,
                    success: function (data) {
                        $nolog.hide();
                        if (data.content) {
                            var i = 0;
                            var thisType;
                            var $thisData = data.content;
                            var len = $thisData.length;
                            for (; i < len; i++) {
                                thisType = decodeURIComponent($thisData[i].type);
                                if (thisType === '二手房') {
                                    esfyh.html($thisData[i].money);
                                    esfPrefer.show();
                                } else if (thisType === '租房') {
                                    zfyh.html($thisData[i].money);
                                    zfPrefer.show();
                                } else if (thisType === '积分') {
                                    jf.html($thisData[i].money);
                                    jfPrefer.show();
                                }
                            }
                            $logged.show();
                        } else if (data.errcode === '0') {
                            $received.show();
                        } else {
                            displayLose(2000, data.errmsg);
                        }
                    },
                    error: function () {
                        displayLose(2000, '网络错误');
                    }
                }).always(function () {
                    submitFlag = true;
                });
            }
        };
        // 验证码发送失败时的回调函数
        var verifyError = function () {
            displayLose(2000, '短信验证码验证失败,请尝试重新发送！');
            return false;
        };
        // 点击领取
        var $submit = $('.esf-btn');
        var $verifycode = $('#verifycode');
        $submit.on('click', function () {
            // 如果手机号或者验证码为空，给出相应的提示
            if ($phone.val() === '') {
                displayLose(2000, '请输入手机号');
                return false;
            } else if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test($phone.val())) {
                displayLose(2000, '手机号码格式不正确');
                return false;
            } else if ($verifycode.val() === '') {
                displayLose(2000, '请输入验证码');
                return false;
            } else if (!/^\d{4}$/i.test($verifycode.val())) {
                displayLose(2000, '手机验证码格式不正确');
                return false;
            }
            // 如果有已经领取过的提示框，不让用户点击
            if ($isHas.is(':visible')) {
                return false;
            }
            verifycode.sendVerifyCodeAnswer($phone.val(), $verifycode.val(), function () {
                verifysuccess();
            }, verifyError);
        });
    };
});

