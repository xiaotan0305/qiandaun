/**
 * Created by fang on 2015/8/3.
 */
define('modules/my/modifyPwd', ['jquery', 'modules/my/util'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var util = require('modules/my/util');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    function modifyPwdFn() {}
    modifyPwdFn.prototype = {
        init: function () {
            var that = this;
            that.password = $('#password');
            that.switchPwd = $('#switchPwd');
            that.saveBtn = $('#saveBtn');
            that.prompt = $('#prompt');
            that.sendFloat = $('#sendFloat');
            that.sendText = $('#sendText');
            that.pwdFlag = false;
            // 密码格式正确为true
            that.floatLayer = $('.float');
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            // 切换密码明文开关
            that.switchPwd.on('click', function () {
                if ($(this).is('.hide')) {
                    $(this).removeClass('hide');
                    that.password.attr('type', 'text');
                } else {
                    $(this).addClass('hide');
                    that.password.attr('type', 'password');
                }
            });
            that.password.on('keyup', function () {
                that.testPwd();
            });
            that.saveBtn.on('click', function () {
                // 兼容不支持keyup事件的浏览器
                that.testPwd();
                if (!that.pwdFlag) {
                    return false;
                }
                that.floatLayer.show();
                require.async('rsa/1.0.0/rsa', function (rsa) {
                    var pwd = that.password.val();
                    var url = vars.mySite + '?c=my&a=ajaxPwdModify';
                    pwd = rsa(pwd);
                    var data = {
                        password: pwd,
                        rediFrom: vars.rediFrom
                    };
                    $.post(url, data, function (mesPara) {
                        var mes = JSON.parse(mesPara);
                        switch (mes) {
                            case 0:
                                util.displayLoseFn(3, '密码修改失败，请重试', '', that);
                                break;
                            case 1:
                                util.displayLoseFn(3, '密码修改成功', vars.mySite + '?c=my&a=myAccount&city=' + vars.city, that);
                                break;
                            case 2:
                                util.displayLoseFn(3, '密码不能为空', '', that);
                                break;
                            case 3:
                                util.displayLoseFn(3, '密码修改成功，请重新登录', "https://m.fang.com/passport/login.aspx", that);
                                break;
                            case 4:
                                util.displayLoseFn(3, '密码修改成功，请重新登录', "https://m.fang.com/passport/login.aspx", that);
                                break;
                            default:
                                util.displayLoseFn(3, '服务器开小差咯，请稍后再试', '', that);
                        }
                    });
                });
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
        },
        // 检测密码的格式
        testPwd: function () {
            var that = this;
            var pwd = that.password.val();
            pwd = util.stripscript(pwd);
            that.password.val(pwd);
            // 匹配必须是英文和数字的组合
            var reg = new RegExp('^(?![^a-zA-Z]+$)(?![^0-9]+$).{6,16}$');
            if (!pwd) {
                that.prompt.html('密码不能为空');
                that.prompt.show();
                // that.saveBtn.addClass('disable');
                that.saveBtn.css('background-color', '#999');
                that.pwdFlag = false;
                return false;
            }
            if (!reg.test(pwd)) {
                that.prompt.html('密码请设置为6~16位，至少包含数字和字母');
                that.prompt.show();
                that.saveBtn.css('background-color', '#999');
                that.pwdFlag = false;
                return false;
            }
            that.prompt.html('');
            that.prompt.hide();
            that.pwdFlag = true;
            that.saveBtn.css('background-color', '#DF3031');
        }
    };

    var modifyPwdObj = new modifyPwdFn();
    modifyPwdObj.init();
    module.exports = modifyPwdFn;
});