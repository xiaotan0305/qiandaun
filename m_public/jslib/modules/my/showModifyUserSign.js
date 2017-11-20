/**
 * Created by fang on 2015/8/4.
 * modify by limengyang.bj 2016/6/1
 * 更改了提示浮层文本的位置  by赵天亮  更改于2016/10/18
 */
define('modules/my/showModifyUserSign', ['jquery'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    var userSign = '';
    var oldUserSign = '';

    function showModifyUserSignFn() {
    }

    showModifyUserSignFn.prototype = {
        init: function () {
            var that = this;
            // input的输入对象
            that.sign = $('#userSign');
            // 保存按钮的对象
            that.saveSignBtn = $('#save');
            // 是否可以保存的状态
            that.signFlag = false;
            // 输入的签名
            oldUserSign = that.sign.text().trim();
            if (oldUserSign === '请输入个人签名，20字之内') {
                that.sign.css({color: '#b3b6be'});
            }else {
                that.sign.css({color: '#000'});
            }
            // 提示信息的div
            that.sendFloat = $('#sendFloat');
            // 提示信息的字样
            that.sendText = $('#sendText');

            that.bindEvent();
            userSign = '';
        },
        bindEvent: function () {
            var that = this;
            that.sign.on('click', function () {
                that.sign.focus();
            });
            that.sign.on('focus', function () {
                var userSigntest = that.sign.text().trim();
                if (userSigntest === '请输入个人签名，20字之内') {
                    that.sign.text('');
                    that.sign.css({color: '#000'});
                }
            });
            that.sign.on('blur', function () {
                userSign = that.sign.text().trim();
                if (userSign === '') {
                    that.sign.css({color: '#b3b6be'});
                    that.sign.text('请输入个人签名，20字之内');

                }
            });
            /*
             that.sign.on('input', function () {
             // 输入的签名
             userSign = that.sign.text().trim();
             // 检验签名
             that.checkUserSign();
             });
             */
            // 保存点击
            that.saveSignBtn.on('click', function () {
                $('#userSign').blur();
                userSign = that.sign.text().trim();
                if (userSign.length > 20) {
                    that.sendText.css({top: '25%'});
                    that.showMes('个人签名最多20字，请删减');
                    setTimeout(function () {
                        that.sendText.css({top: '50%'});
                    }, 1500);
                    return false;
                }
                if (userSign === oldUserSign) {
                    that.showMes('您本次并未做任何修改');
                    return false;
                }
                // post往后台传值
                var url = vars.mySite + '?c=my&a=ajaxModifyUserSign';
                var data = {
                    userSign: userSign
                };
                $.get(url, data, function (mes) {
                    if (mes === '1') {
                        that.showMes('修改成功', vars.mySite + '?c=my&a=myAccount&city=' + vars.city + '&r=' + Math.random());
                    } else if (mes === '0') {
                        that.showMes('修改失败，请重试', '');
                        return false;
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
        // 检验输入签名
        checkUserSign: function () {
            var that = this;
            // 判断字符长度
            if (userSign.length > 20) {
                // 移除可点击样式
                that.saveSignBtn.removeClass('red-f6');
                that.signFlag = false;
            } else {
                that.saveSignBtn.addClass('red-f6');
                that.signFlag = true;
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
            }, 1000);
        }

    };
    var showModifyUserSignObj = new showModifyUserSignFn();
    showModifyUserSignObj.init();
    module.exports = showModifyUserSignFn;
});