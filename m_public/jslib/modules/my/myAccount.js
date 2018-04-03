/*
 * modify by lixiaoru@fang.com 2016/9/28
 */
define('modules/my/myAccount', ['jquery', 'dateAndTimeSelect/1.0.0/dateAndTimeSelect'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    function myAccountFn() {
    }

    myAccountFn.prototype = {
        // 初始化
        init: function () {
            var that = this;
            // 生日对象
            that.birthday = $('#time');
            // 头像对象
            that.face = $('#face');
            // 文字遮罩
            that.sendFloat = $('#sendFloat');
            // 弹出信息文字
            that.sendText = $('#sendText');
            // 退出对象
            that.logout = $('#logout');
            // 电话对象
            that.phoneNum = $('#phoneNum');
            // 密码对象
            that.passwordChange = $('#passwordChange');
            // 昵称对象
            that.nickName = $('#nickName');
            // 签名对象
            that.userSign = $('#userSign');
            // 性别对象
            that.sex = $('#sex');
            // 性别选择框
            that.selSex = $('#selSex');
            // 取消性别选择按钮
            that.cancelSex = $('#cancelSex');
            that.floatMask = $('#floatMask');
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            if (vars.timeOut) {
                // 如果接口超时，页面显示超时信息
                return that.timeOutFn.call(this, that);
            }
            // 修改出生日期
            that.birthday.on('click', function () {
                return that.birthdayModifyFn.call(this, that);
            });
            // 修改头像
            require.async('modules/my/upload', function (upload) {
                new upload({
                    ajaxUpload: function (imgUrl) {
                        that.ajaxFaceModifyFn(imgUrl);
                    }
                });
            });
            // 弹出修改性别选框
            that.sex.on('click', function () {
                return that.sexModifyFn.call(this, that);
            });
            // 取消修改性别
            that.cancelSex.on('click', function () {
                return that.sexCancelFn.call(this, that);
            });
            // 点击修改性别li
            that.selSex.on('click', 'li', function () {
                return that.sexChooseFn.call(this, that);
            });

            // 修改手机号码
            that.phoneNum.on('click', function () {
                return that.phoneModifyFn.call(this, that);
            });
            // 修改昵称
            that.nickName.on('click', function () {
                return that.nickNameModifyFn.call(this, that);
            });
            // 修改签名
            that.userSign.on('click', function () {
                return that.userSignModifyFn.call(this, that);
            });
            // 修改密码
            that.passwordChange.on('click', function () {
                return that.passwordModifyFn.call(this, that);
            });
            // 退出登录
            that.logout.on('click', function () {
                return that.clickLogoutFn.call(this, that);
            });

            // 修复文本框输入键盘弹起遮挡bug
            if ($(window).height() > 450) {
                $('body').css('min-height', $(window).height() + 'px');
            }
        },
        timeOutFn: function () {
            var that = this;
            that.showMes('网络连接超时，请稍候重试');
        },
        // 修改出生日期
        birthdayModifyFn: function (obj) {
            var thatObj = obj;
            var DateAndTimeSelect = require('dateAndTimeSelect/1.0.0/dateAndTimeSelect');
            var currentYear = new Date().getFullYear() - 1;
            var oldBirthday = thatObj.birthday.attr('data-birth');
            var year = 0,
                month = 0,
                day = 0;
            // var selectedTimeStr = '';
            if (oldBirthday) {
                if (oldBirthday !== '1900-1-1') {
                    var oldBirthdayArr = oldBirthday.split('-');
                    if (oldBirthdayArr && oldBirthdayArr.length > 0) {
                        year = oldBirthdayArr[0];
                        month = oldBirthdayArr[1];
                        month = parseInt(month) - 1;
                        if (month.length === 1) {
                            month = '0' + month;
                        }
                        day = oldBirthdayArr[2];
                        if (day.length === 1) {
                            day = '0' + oldBirthdayArr[2];
                        }
                    }
                } else {
                    year = '1960';
                    month = '01';
                    day = '01';
                }
            }
            var date = new Date(Date.UTC(year, month, day, 12, 0, 0));
            var dtSelect;
            // 确定修改出生日期
            function showDate(date) {
                thatObj.floatMask.hide();
                var timeArr = date.split('-');
                var age = new Date().getFullYear() - Number(timeArr[0]);
                age = age > 0 ? age : '';
                thatObj.birthday.text(age);

                dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                thatObj.birthday.attr('data-birth', date);
                thatObj.ajaxBirthdayModifyFn(date);
            }

            // 取消修改出生日期
            function floatHide() {
                dtSelect.hide(dtSelect.setting.SELET_TYPE_DATE);
                thatObj.floatMask.hide();
            }

            dtSelect = new DateAndTimeSelect({
                yearRange: '1900-' + currentYear,
                defaultTime: date.getTime(),
                dateConfirmFunc: showDate,
                dateCancelFunc: floatHide
            });
            thatObj.floatMask.show();
            dtSelect.show(dtSelect.setting.SELET_TYPE_DATE);
        },
        // 修改的生日上传到服务器
        ajaxBirthdayModifyFn: function (time) {
            var that = this;
            $.get(vars.mySite + '?c=my&a=ajaxBirthdayModify&time=' + time, function (data) {
                if (Number(data) === 1) {
                    that.showMes('年龄修改成功');
                } else if (Number(data) === 0) {
                    that.showMes('年龄修改失败，请重试');
                } else {
                    window.location.href = 'https://m.fang.com/passport/login.aspx';
                }
            });
        },
        // 头像上传到服务器
        ajaxFaceModifyFn: function (imgUrl) {
            var that = this;
            $.get(vars.mySite + '?c=my&a=ajaxFaceModify&src=' + imgUrl, function (data) {
                if (Number(data) === 1) {
                    that.showMes('头像修改成功');
                } else if (Number(data) === 0) {
                    that.showMes('头像修改失败，请重试');
                } else {
                    window.location.href = 'https://m.fang.com/passport/login.aspx';
                }
            });
        },
        // 显示修改性别选框
        sexModifyFn: function (obj) {
            var thatObj = obj;
            thatObj.floatMask.show();
            thatObj.selSex.show();
        },
        // 修改性别
        sexChooseFn: function (obj) {
            var thatObj = obj;
            var index = $(this).attr('data-id');
            var name = $(this).text();
            $.get(vars.mySite + '?c=my&a=ajaxSexModify&sex=' + index, function (data) {
                if (Number(data) === 1) {
                    thatObj.sex.find('.con').html(name);
                    thatObj.showMes('性别修改成功');
                } else if (Number(data) === 0) {
                    that.showMes('性别修改失败，请重试');
                } else {
                    window.location.href = 'https://m.fang.com/passport/login.aspx';
                }
            });
            thatObj.floatMask.hide();
            thatObj.selSex.hide();
        },
        // 取消修改性别
        sexCancelFn: function (obj) {
            var thatObj = obj;
            thatObj.floatMask.hide();
            thatObj.selSex.hide();
        },
        // 退出登录
        clickLogoutFn: function () {
            $.get(vars.mySite + '?c=my&a=ajaxLogout', function (data) {
                if (Number(data) === 1) {
                    window.location.href = location.href.indexOf('&burl=') > 0 ? 'https://m.fang.com/passport/login.aspx?burl=' + location.href.substr(location.href.indexOf('&burl=') + 6) : 'https://m.fang.com/passport/login.aspx';
                }
            });
        },
        // 修改手机号码
        phoneModifyFn: function () {
            window.location.href = 'https://m.fang.com/passport/resetmobilephone.aspx?burl=' + vars.burl;
        },
        // 修改昵称
        nickNameModifyFn: function () {
            window.location.href = vars.mySite + '?c=my&a=showModifyNick&nickName=' + vars.nickName + '&city=' + vars.city + '&burl=' + vars.burl;
        },
        // 修改昵称
        userSignModifyFn: function () {
            window.location.href = vars.mySite + '?c=my&a=showModifyUserSign&city=' + vars.city + '&burl=' + vars.burl;
        },
        // 修改密码
        passwordModifyFn: function () {
            // window.location.href = 'https://m.fang.com/passport/resetpassword.aspx?burl=' + vars.burl;
            // 测试地址
            window.location.href = 'https://passport.fang.com/passport/resetpassword.aspx?burl=' + vars.burl;
        },
        showMes: function (mes) {
            var that = this;
            var num = 3;
            var errorTimer = setInterval(function () {
                num--;
                that.sendText.html(mes);
                that.sendFloat.show();
                if (num <= 0) {
                    clearInterval(errorTimer);
                    that.sendFloat.hide();
                    that.sendText.html('');
                }
            }, 1000);
        },
    };
    var myAccount = new myAccountFn();
    myAccount.init();
    module.exports = myAccountFn;
});