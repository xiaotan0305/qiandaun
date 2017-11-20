/**
 * 看房团
 * by WeiRF
 * 20151207
 * 20160113 by WeiRF 增加签到信息
 * 20160114  by WeiRF 更改checkSubmit里面的判断顺序，为的是调整showMessage的优先级为：姓名 > 人数 > 手机号 > 验证码
 * 20160114  by WeiRF 增加验证码发送成功后的提示信息
 * 20160128  by WeiRF 扩展验证码获取和提交
 * 20160226  by WeiRF 针对看房团改版更改
 */
define('housegroup/1.0.1/housegroup',
    ['jquery','verifycode/1.0.0/verifycode'],
    function (require, exports, module) {
        'use strict';
        var $ = require('jquery');
        var verifycode = require('verifycode/1.0.0/verifycode');
        function kft(options,codefn,showfn) {
            // 如果传的是三个参数
            if (arguments.length === 3) {
                this.codefn = codefn || '';
                this.showfn = showfn || '';
            } else {
                // 如果传的是两个参数
                this.codefn = '';
                this.showfn = codefn || '';
            }

            if (options) {
                // 姓名
                this.kftname = options.kftname || '';
                // 报名人数
                this.kftnum = options.kftnum || '';
                // 输入手机号
                this.kftphone = options.phone || options.kftphone;
                // 获取验证码
                this.kftcode = options.code || options.kftcode;
                // 填写验证码
                this.kftcodewrite = options.codewrite || options.kftcodewrite;
                // 取消
                this.kftcancel = options.kftcancel;
                // 提交
                this.kftsubmit = options.kftsubmit || '';
                // 增加签到信息
                this.signsubmit = options.submit || options.signsubmit || '';
                // 显示框信息
                if (options.favoritemsg) {
                    this.favoritemsg = options.favoritemsg;
                }
                this.init();
            }
        }
        kft.prototype = {
            showfn: '',
            // 提交的ajax
            codefn: '',
            // 显示信息
            favoritemsg: $('#favoritemsg'),
            // 看房团弹框
            kftframe: $('#kftframe'),
            // 发送验证码时间
            timeCount: 60,
            // 绑定setInterval
            checkSetInterval: '',
            // 点击发送验证码判断
            checkCodeFlag: true,
            // 根据手机号判断是否显示
            showCodeAndWrite: function () {
                var that = this;
                var phone = phone || '';
                var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
                // 如果修改手机号且验证码隐藏
                if (that.kftcodewrite.is(':hidden') && !phoneReg.test(phone)) {
                    that.kftcodewrite.show();
                    that.kftcodewrite.parents('li').show();
                    that.kftcode.show();
                }
            },
            // 检测手机号
            checkPhone: function (phone) {
                var that = this;
                phone = phone || '';
                var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i;
                if (!phone) {
                    that.showMessage('手机号不能为空');
                    return false;
                } else if (!phoneReg.test(phone)) {
                    that.showMessage('请输入正确的手机号');
                    return false;
                } else {
                    return true;
                }
            },
            //  检测验证码格式
            checkCode: function (code) {
                var that = this;
                var partten = /^\d{6}$/;
                if (!code) {
                    that.showMessage('验证码不能为空');
                    return false;
                } else if (!partten.test(code)) {
                    that.showMessage('验证码格式不正确');
                    return false;
                } else {
                    return true;
                }
            },
            //  检测报名人数
            checkNum: function (num) {
                var that = this;
                var partten = /^\d+$/;
                if (!num) {
                    that.showMessage('报名人数不能为空');
                    return false;
                } else if (!partten.test(num)) {
                    that.showMessage('报名人数格式不正确');
                    return false;
                } else {
                    return true;
                }
            },
            // 去除非数字的部分
            delNoNumb: function (value) {
                return value.replace(/[^\d]/g, '');
            },
            // 显示信息
            showMessage: function (msg) {
                var that = this;
                var width = ($(window).width() - that.favoritemsg.width()) / 2 + 65;
                // favoritemsg为显示的ID
                that.favoritemsg.html(msg).css({left: width + 'px'}).show();
                setTimeout(function () {
                    that.favoritemsg.hide(500);
                }, 1500);
            },
            // 更新显示验证码发送时间
            updateTime: function () {
                var that = this;
                that.timeCount--;
                if (that.timeCount >= 0) {
                    that.kftcode.val('重新发送(' + that.timeCount + ')').css({'background-color': '#b3b6be',color: '#ffffff',border: '1px solid #b3b6be'});
                } else {
                    that.checkCodeFlag = true;
                    that.timeCount = 60;
                    clearInterval(that.checkSetInterval);
                    that.kftcode.val('发送验证码').css({'background-color': '#ffffff',color: '#ff6666',border: '1px solid #ff6666'});
                    // 绑定获取验证码click事件
                    that.clickCode();
                }
            },
            // 绑定获取验证码的click事件
            clickCode: function () {
                var that = this;
                that.kftcode.on('click',function () {
                    if (that.checkCodeFlag) {
                        that.checkCodeFlag = false;
                        var phone = that.kftphone.val().trim();
                        var checkPhone = that.checkPhone(phone);
                        if (checkPhone) {
                            that.kftcode.off('click');
                            that.checkSetInterval = setInterval(function () {
                                that.updateTime();
                            },1000);
                            // that.codefn(phone);
                            verifycode.getPhoneVerifyCode(phone,
                                function () {
                                    // 验证码成功
                                    that.showMessage('发送成功');
                                }, function () {
                                    // 验证码错误
                                    that.showMessage(' 请重新获取验证码');
                                    // 倒计时设为0，使获取验证码的按钮恢复正常
                                    that.timeCount = 0;
                                });
                        } else {
                            that.checkCodeFlag = true;
                        }
                    }
                });
            },
            // 提交按钮检测
            checkSubmit: function (kftflag) {
                var that = this;
                var checkNum,checkCode;
                // 验证验证码格式
                if (that.kftcodewrite.is(':visible')) {
                    checkCode = that.checkCode(that.kftcodewrite.val().trim());
                }
                // 验证手机号
                var checkPhone = that.checkPhone(that.kftphone.val().trim());
                // 如果是看房团
                if (kftflag) {
                    // 检测报名人数
                    checkNum = that.checkNum(that.kftnum.val().trim());
                    // 检测姓名
                    if (!that.kftname.val().trim()) {
                        that.showMessage('请输入姓名');
                        return false;
                    }
                } else {
                    // 如果是签到
                    checkNum = true;
                }


                if (checkPhone && checkNum && (checkCode || that.kftcodewrite.is(':hidden'))) {
                    return true;
                } else {
                    return false;
                }
            },
            submit: function (that,self,kftflag) {
                var checkSubmit = that.checkSubmit(kftflag);
                if (checkSubmit && that.showfn) {
                    // ajax回调函数
                    var ajaxOptions = {
                        kftphone: that.kftphone.val().trim(),
                        kftcodewrite: that.kftcodewrite.val().trim(),
                        phone: that.kftphone.val().trim(),
                        codewrite: that.kftcodewrite.val().trim()
                    };
                    if (kftflag) {
                        ajaxOptions.kftname = that.kftname.val().trim();
                        ajaxOptions.kftnum = that.kftnum.val().trim();
                    }
                    var datas = $(self).data();
                    if (datas) {
                        for (var data in datas) {
                            ajaxOptions[data] = datas[data];
                        }
                    }
                    // 如果存在验证码，则验证，否则直接进入ajax回调
                    if (that.kftcodewrite.is(':visible')) {
                        verifycode.sendVerifyCodeAnswer(that.kftphone.val().trim(), that.kftcodewrite.val().trim(),
                            function () {
                                // 验证码成功
                                that.showfn(ajaxOptions);
                            }, function () {
                                // 验证码错误
                                that.showMessage(' 验证码错误！');
                            });
                    } else {
                        that.showfn(ajaxOptions);
                    }
                }
            },
            init: function () {
                var that = this;
                // 绑定获取验证码click事件
                that.clickCode();
                // 输入报名人数
                if (that.kftnum) {
                    that.kftnum.on('input',function () {
                        this.value = that.delNoNumb(this.value);
                    });
                }
                // 输入手机号
                that.kftphone.on('input',function () {
                    this.value = that.delNoNumb(this.value);
                    if (this.value.length > 11) {
                        this.value = this.value.substr(0,11);
                    }
                    that.showCodeAndWrite(this.value);
                });
                // 输入验证码
                that.kftcodewrite.on('input',function () {
                    this.value = that.delNoNumb(this.value);
                });
                // 看房团提交按钮
                if (that.kftsubmit) {
                    that.kftsubmit.on('click',function () {
                        that.submit(that,this,true);
                    });
                }
                // 签到提交按钮
                if (that.signsubmit) {
                    that.signsubmit.on('click',function () {
                        that.submit(that,this,false);
                    });
                }
                // 取消按钮绑定
                if (that.kftcancel) {
                    that.kftcancel.on('click',function () {
                        $('#kftframe').hide();
                    });
                }
            }
        };
        module.exports = kft;
    });