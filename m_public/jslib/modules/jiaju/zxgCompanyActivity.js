/**
 * @fileOverview [公司优惠活动]
 * @author [icy<taoxudong@fang.com>]2016-9-9
 */
define('modules/jiaju/zxgCompanyActivity', ['jquery', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var jiajuUtils = vars.jiajuUtils;
    var verifycode = require('verifycode/1.0.0/verifycode');
    var zxgCompanyActivity = {
        init: function () {
            var that = this;

            // 用户信息section
            that.$userInfo = $('#userInfo');
            that.$mobile = that.$userInfo.find('.mobile');
            that.$vCode = that.$userInfo.find('.vCode');
            that.$vCodeNum = that.$userInfo.find('.vCodeNum');
            that.$changeMobile = that.$getVCode = $('.changeMobile,.getVCode');
            // 确认提交
            that.$submit = $('#submit');
            // toast提示
            that.$sendFloat = $('#sendFloat');
            that.$sendText = $('#sendText');
            that.toastMsg = {
                mobileEmpty: '请输入手机号',
                mobile: '手机号错误，请重新输入',
                vCodeEmpty: '请输入验证码',
                vCode: '验证码有误，请重新输入'
            };

            // 初始化状态
            that.initStatus();
            that.canAjax = true;
            // 初始化事件
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            // 数据请求失败时, 点击刷新
            $('#timeout').on('click', function () {
                window.location.reload();
            });

            // 用户信息sectionEvent
            // 修改手机号
            that.$userInfo.on('click', '.changeMobile', $.proxy(that.changeMobileFn, that));
            // 获取验证码
            that.$userInfo.on('click', '.getVCode', $.proxy(that.getVerifyCode, that));
            that.$userInfo.on('focus input', '.required', function () {
                that.inputInputFn(this);
            }).on('blur', '.required', $.proxy(that.inputBlurFn, that));

            // 提交订单
            that.$submit.find('a').on('click', $.proxy(that.submitClickFn, that));
        },
        // 初始化状态
        initStatus: function () {
            var statusObj = {
                allLen: 0,
                activeLen: 0
            };
            var that = this;
            that.$userInfo.find('.required').each(function () {
                var $this = $(this);
                var type = $this.data('type');
                if ($this.val()) {
                    statusObj[type] = true;
                    statusObj.activeLen++;
                }
                statusObj.allLen++;
            });
            that.statusObj = statusObj;
            if (statusObj.activeLen === statusObj.allLen) {
                that.$submit.addClass('active');
            } else {
                that.$submit.removeClass('active');
            }
        },
        // 刷新状态 判断报价按钮是否可以点击
        refreshStatus: function (add, type) {
            var that = this;
            var activeType = type || that.activeType;
            var statusObj = that.statusObj;
            if (statusObj[activeType] ^ add) {
                statusObj[activeType] = add;
                statusObj.activeLen += add ? 1 : -1;
                if (statusObj.activeLen === statusObj.allLen) {
                    that.$submit.addClass('active');
                } else {
                    that.$submit.removeClass('active');
                }
            }
        },

        // userInfo
        changeMobileFn: function () {
            var that = this;
            var toggle = that.$changeMobile.hasClass('getVCode');
            that.$changeMobile.toggleClass('changeMobile getVCode').text(toggle ? '更换手机号' : '获取验证码')[toggle ? 'addClass' : 'removeClass']('active');
            that.$mobile.prop('disabled', toggle);
            toggle || that.$mobile.val('');
            that.$vCode.toggle();
            that.$vCodeNum.toggleClass('required').val('');
            that.initStatus();
        },
        mobileInputFn: function () {
            var that = this;
            var value = that.mobile;
            if (vars.mobile && value === vars.mobile) {
                that.changeMobileFn();
            } else {
                that.$changeMobile[that.state.result ? 'addClass' : 'removeClass']('active');
            }
        },
        inputInputFn: function (ele) {
            var $ele = $(ele);
            var that = this;
            var value = $ele.val();
            var type = $ele.data('type');
            var state = that.checkInputFn(value, type);
            that[type] = value;
            that.state = state;
            that.refreshStatus(state.result, type);
            type === 'mobile' && that.mobileInputFn();
        },
        inputBlurFn: function () {
            var that = this;
            that.state.result || that.toast(that.state.errType);
        },
        // 验证码
        // 获取验证码
        getVerifyCode: function () {
            var that = this;
            if (that.canAjax && that.$getVCode.hasClass('active')) {
                that.canAjax = false;
                verifycode.getPhoneVerifyCode(that.mobile, function () {
                    that.timeRecorder(60);
                    that.canAjax = true;
                }, function () {
                    that.toast('获取验证码失败');
                    that.canAjax = true;
                });
            }
        },
        // 倒计时
        timeRecorder: function (timePara) {
            var that = this;
            var time = timePara;
            that.$mobile.prop('disabled', true);
            that.$getVCode.removeClass('active');
            that.$getVCode.text('发送中(' + time + ')');
            var handle = setInterval(function () {
                time--;
                that.$getVCode.text('发送中(' + time + ')');
                if (time === 0) {
                    clearInterval(handle);
                    that.$mobile.prop('disabled', false);
                    that.$getVCode.text('重新发送');
                    that.$getVCode.addClass('active');
                }
            }, 1000);
        },

        // 确认提交
        submitClickFn: function () {
            var that = this;
            if (that.$submit.hasClass('active') && that.canAjax) {
                that.canAjax = false;
                that.statusObj.vCode ? verifycode.sendVerifyCodeAnswer(that.mobile, that.vCode, function () {
                    vars.mobile = that.mobile;
                    that.changeMobileFn();
                    that.submit();
                }, function () {
                    that.toast('验证码错误');
                    that.canAjax = true;
                }) : that.submit();
            }
        },

        // 收银台跳转
        submit: function () {
            var that = this;
            var submitData = {
                companyid: vars.companyid,
                serviceid: vars.serviceid,
                phone: vars.mobile
            };
            vars.refentry && (submitData.refentry = vars.refentry);
            $.ajax({
                type: 'get',
                url: vars.jiajuSite + '?c=jiaju&a=ajaxzxgActivityEnter',
                data: submitData,
                success: function (obj) {
                    if (obj.IsSuccess === '1') {
                        that.toast('预约成功', function () {
                            // 成功跳回公司详情 http://mm.test.fang.com/jiaju/?c=jiaju&a=newCompanyDetail&companyid=25000&city=bj&from=wap
                            history.back();
                        });
                    } else {
                        // 生成订单接口错误的处理
                        that.toast(obj.Message);
                    }
                },
                complete: function () {
                    that.canAjax = true;
                }
            });
        },

        // 输入内容校验
        checkInputFn: function (val, type) {
            var checks = {
                mobile: /^1[34578][0-9]{9}$/,
                vCode: /^\d{4}$/
            };
            var result = !!val.length;
            var errType = result ? null : type + 'Empty';
            if (checks[type] && result) {
                result = checks[type].test(val);
                errType = result ? errType : type;
            }
            return {
                result: result,
                errType: errType
            };
        },
        toast: function (msgType, cb) {
            var that = this;
            that.$sendText.text(that.toastMsg[msgType] || msgType);
            that.$sendFloat.show();
            jiajuUtils.toggleTouchmove(1);
            that.toastTime && clearTimeout(that.toastTime);
            that.toastTime = setTimeout(function () {
                that.$sendFloat.hide();
                jiajuUtils.toggleTouchmove();
                cb && cb();
            }, 2000);
        }
    };
    module.exports = zxgCompanyActivity;
});