/**
 * Created by fang on 2015/8/4.
 * modify by limengyang.bj 2016/6/1
 * 由于苹果输入法bug 更改了验证方式  by赵天亮  更改于2016/10/18
 */
define('modules/my/showModifyNick', ['jquery'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var nickName = '';

    function showModifyNickFn() {
    }

    showModifyNickFn.prototype = {
        init: function () {
            var that = this;
            // input的输入对象
            that.nick = $('#nick');
            // X号的对象
            that.clear = $('#clear');
            // 保存按钮的对象
            that.saveNickBtn = $('#saveNickBtn');
            // 是否可以保存的状态
            that.nickFlag = false;
            // 提示信息的div
            that.sendFloat = $('#sendFloat');
            // 提示信息的字样
            that.sendText = $('#sendText');
            // 输入的昵称
            nickName = that.nick.val();
            if (nickName) {
                // 检验昵称
                that.checkNickName();
            }

            that.bindEvent();
            that.clear.hide();
        },
        bindEvent: function () {
            var that = this;
            // 点击X号清除输入内容
            that.clear.on('click', function () {
                that.nick.val('');
                $(this).hide();
                that.nickFlag = false;
                // 移除可点击样式
                that.saveNickBtn.removeClass('red_ff5');
            });
            that.nick.on('click', function () {
                that.nick.focus();
            });
            that.nick.on('focus', function() {
                that.clear.show();
            });
            that.nick.on('input', function () {
                // 输入的昵称
                nickName = that.nick.val();
                // 检验昵称
                that.checkNickName();
            });
            // 保存点击
            that.saveNickBtn.on('click', function () {
                // 通过状态判断是否可以保存
                if (!that.nickFlag) {
                    return false;
                }
                if (/^[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z0-9_-]{2,10}$/.test(nickName) === false) {
                    // 移除可点击样式
                    that.sendText.css({top:'25%'});
                    that.showMes('不能含有特殊字符', '');
                    setTimeout(function () {
                        that.sendText.css({top:'50%'});
                    },1500);
                    return false;
                }
                // post往后台传值
                var url = vars.mySite + '?c=my&a=ajaxNickModify';
                var data = {
                    nickName: nickName
                };
                $.get(url, data, function (mes) {
                    if (mes === '1') {
                        that.showMes('昵称修改成功', vars.mySite + '?c=my&a=myAccount&city=' + vars.city + '&r=' + Math.random());
                    } else if (mes === '0') {
                        that.showMes('昵称修改失败，请重试', '');
                    } else {
                        window.location.href = 'https://m.fang.com/passport/login.aspx';
                    }
                });
            });
            // 修复文本框输入键盘弹起遮挡bug
            if ($(window).height() > 450) {
                $('body').css('min-height', $(window).height() + 'px');
            }
        },
        // 检验输入昵称
        checkNickName: function () {
            var that = this;
            // 判断字符长度
            if (nickName.length < 2 || nickName.length > 10) {
                // 移除可点击样式
                that.saveNickBtn.removeClass('red_ff5');
                that.nickFlag = false;
                // 长度小于2的隐藏x号,大于10个字提示信息
                if (nickName.length < 2) {
                    that.clear.hide();
                }
            } else {
                // 显示X号
                that.clear.show();
                // 判断是汉字，字母，下划线和减号
                // 添加可点击样式
                that.saveNickBtn.addClass('red_ff5');
                that.nickFlag = true;
            }
        },
        // 显示提示,mes=提示内容，url跳转地址
        showMes: function (mes, url) {
            var that = this;
            that.sendText.html(mes);
            that.sendFloat.show();
            setTimeout(function () {
                that.sendFloat.hide();
                // 有跳转地址传入就跳转
                if (url) {
                    window.location.href = url;
                }
            }, 1500);
        }
    };
    var showModifyNickObj = new showModifyNickFn();
    showModifyNickObj.init();
    module.exports = showModifyNickFn;
});