define('modules/my/loginByPassword', ['jquery', 'modules/my/util'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var util = require('modules/my/util');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    function loginByPasswordFn() {}

    loginByPasswordFn.prototype = {
        // 初始化
        init: function () {
            var that = this;
            that.usernameFlag = false;
            that.passwordFlag = false;
            that.username = $('#username');
            that.password = $('#password');
            that.usernameVal = undefined;
            that.passwordVal = undefined;
            that.finalUsernameVal = undefined;
            that.finalPasswordVal = undefined;
            that.login = $('#login');
            that.switchPwd = $('#switchPwd');
            that.passwordEncrypt = undefined;
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');
            that.floatLayer = $('.float');
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            // 检验用户名，blur事件
            that.username.on('blur', function () {
                return that.checkUsernameOnBlurFn.call(this, that);
            });
            // 检验用户名，keyup事件
            that.username.on('keyup', function () {
                return that.checkUsernameOnKeyupFn.call(this, that);
            });
            // 检验密码，input事件
            that.password.on('input', function () {
                return that.checkPasswordOnKeyupFn.call(this, that);
            });
            // 检验密码，focus事件
            that.password.on('focus', function () {
                return that.checkPasswordOnFocusFn.call(this, that);
            });
            // 切换密码明文开关
            that.switchPwd.on('click', function () {
                return that.switchPwdFn.call(this, that);
            });
            // 点击登陆
            that.login.on('click', function () {
                return that.loginClickFn.call(this, that);
            });
            // 如果上一页是搜房，显示返回按钮；否则显示logo
            if (!(document.referrer.indexOf('.fang.com') > -1)) {
                $('.logoR').show();
                $('.back2').hide();
            }
            // 修复文本框输入键盘弹起遮挡bug
            if ($(window).height() > 450) {
                $('body').css('min-height', $(window).height() + 'px');
            }
            $('footer').show();
            $('#otherLoginMethod').show();
        },
        // 检验用户名，blur事件
        checkUsernameOnBlurFn: function (obj) {
            var $this = $(this),
                thatObj = obj;
            thatObj.usernameVal = $this.val();
            thatObj.usernameVal = util.stripscript(thatObj.usernameVal);
            $this.val(thatObj.usernameVal);
            if (!thatObj.usernameVal) {
                util.displayLoseFn(3, '还没有输入用户名呢', '', thatObj);
                thatObj.login.css('background-color', '#999');
                thatObj.finalUsernameVal = '';
                thatObj.usernameFlag = false;
            } else {
                thatObj.finalUsernameVal = thatObj.usernameVal;
                thatObj.checkUsernameIsExistOrNoFn(thatObj.finalUsernameVal);
            }
        },
        // 检验用户名，keyup事件
        checkUsernameOnKeyupFn: function (obj) {
            // var $this = $(this),
            var thatObj = obj;
            if (!thatObj.usernameVal) {
                thatObj.login.css('background-color', '#999');
                thatObj.finalUsernameVal = '';
                thatObj.usernameFlag = false;
            }
        },
        // 检验用户名是否注册
        checkUsernameIsExistOrNoFn: function (username) {
            var that = this;
            $.get(vars.mySite + '?c=my&a=ajaxCheckUsernameExist&username=' + username, function (data) {
                if (data !== '100') {
                    util.displayLoseFn(3, '该账户还没有注册，请先注册吧', '', that);
                    that.login.css('background-color', '#999');
                    that.finalUsernameVal = '';
                    that.usernameFlag = false;
                } else {
                    that.usernameFlag = true;
                    if (that.passwordFlag) {
                        that.finalPasswordVal = that.passwordVal;
                        that.login.css('background-color', '#df3031');
                    }
                }
            });
        },
        // 检验密码，input事件
        checkPasswordOnKeyupFn: function (obj) {
            var $this = $(this),
                thatObj = obj;
            thatObj.passwordVal = $this.val();
            if (util.validateXss(thatObj.passwordVal)) {
                thatObj.password.val('');
                return false;
            }
            if (thatObj.strlenFn(thatObj.passwordVal) >= 6) {
                thatObj.passwordFlag = true;
                if (thatObj.usernameFlag) {
                    thatObj.finalPasswordVal = thatObj.passwordVal;
                    thatObj.login.css('background-color', '#df3031');
                }
            } else {
                thatObj.login.css('background-color', '#999');
                thatObj.finalPasswordVal = '';
                thatObj.passwordFlag = false;
            }
        },
        // 密码长度检测
        strlenFn: function (str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                // 单字节加1
                if (c >= 0x0001 && c <= 0x007e || 0xff60 <= c && c <= 0xff9f) {
                    len++;
                } else {
                    len += 2;
                }
            }
            return len;
        },
        // 检验密码，focus事件
        checkPasswordOnFocusFn: function (obj) {
            var thatObj = obj;
            if (thatObj.username.val() === '') {
                util.displayLoseFn(3, '还没有输入用户名呢', '', thatObj);
                thatObj.login.css('background-color', '#999');
                thatObj.finalUsernameVal = '';
                thatObj.usernameFlag = false;
            }
        },
        // 切换密码明文开关
        switchPwdFn: function (obj) {
            var $this = $(this),
                thatObj = obj;
            if ($this.is('.hide')) {
                $this.removeClass('hide');
                thatObj.password.attr('type', 'text');
            } else {
                $this.addClass('hide');
                thatObj.password.attr('type', 'password');
            }
        },
        // 点击登陆
        loginClickFn: function (obj) {
            var thatObj = obj;
            // var $this = $(this);
            thatObj.usernameVal = thatObj.username.val();
            if (util.validateXss(thatObj.usernameVal)) {
                util.displayLoseFn(3, '不能含有特殊字符~', '', thatObj);
                return;
            }
            if (thatObj.usernameFlag && thatObj.passwordFlag) {
                thatObj.floatLayer.show();
                require.async('rsa/1.0.0/rsa', function (rsa) {
                    thatObj.passwordEncrypt = rsa(thatObj.finalPasswordVal);
                    $.get(vars.mySite + '?c=my&a=checkLoginByPassword&username=' + thatObj.finalUsernameVal
                        + '&password=' + thatObj.passwordEncrypt + '&burl=' + encodeURIComponent(vars.burl), function (data) {
                        if (data !== '4') {
                            if (data === '1') {
                                thatObj.bindPhonedisplayLoseFn(3, '登录成功');
                            } else if (data === '2') {
                                util.displayLoseFn(3, '登录成功', vars.mySite + '?c=mycenter&a=index&city=' + vars.city, thatObj);
                            } else if (data === '3') {
                                util.displayLoseFn(3, '账户和密码不匹配', '', thatObj);
                                thatObj.passwordVal = '';
                                thatObj.finalPasswordVal = '';
                                thatObj.passwordFlag = false;
                                thatObj.password.val('');
                                thatObj.login.css('background-color', '#999');
                            }
                        } else {
                            util.displayLoseFn(3, '服务器开小差了，请重试', '', thatObj);
                        }
                    });
                });
            }
        },
        // 绑定手机号3秒倒计时浮层
        bindPhonedisplayLoseFn: function (numPara, keywords) {
            var num = numPara;
            var that = this;
            that.errorTimer = setInterval(function () {
                num -= 1;
                that.sendFloat.show();
                that.sendText.html(keywords);
                if (num <= 0) {
                    clearInterval(that.errorTimer);
                    that.sendFloat.hide();
                    that.sendText.html('');
                    $.get(vars.mySite + '?c=my&a=checkBindPhone&username=' + encodeURIComponent(that.finalUsernameVal), function (bindPhoneData) {
                        if (bindPhoneData === '1') {
                            that.floatLayer.hide();
                            window.location.href = vars.burl;
                        } else {
                            that.floatLayer.hide();
                            window.location.href = vars.mySite + '?c=my&a=showModifyPhone&city=' + vars.city + '&burl=' + encodeURIComponent(vars.burl);
                        }
                    });
                }
            }, 1000);
        }
    };

    var loginByPassword = new loginByPasswordFn();
    loginByPassword.init();
    module.exports = loginByPasswordFn;
});