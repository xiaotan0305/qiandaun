/**
 * @file 订单生成页
 * @author 汤贺翔(tanghexiang@fang.com)
 */
define('modules/jiaju/generateOrder', ['jquery', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var jiajuUtils = vars.jiajuUtils;
    var verifycode = require('verifycode/1.0.0/verifycode');
    var generateOrder = {
        init: function () {
            var that = this;
            // 订单信息section
            that.$orderInfo = $('#orderInfo');
            that.$amount = that.$orderInfo.find('.amount');
            that.$plus = that.$orderInfo.find('.plus');
            that.$minus = that.$orderInfo.find('.minus');
            that.$total = that.$orderInfo.find('.total');
            that.shipping = +vars.shipping || 0;
            that.per = +that.$orderInfo.find('.per').text() || 0;
            that.minimum = 1;
            that.maximum = +vars.leftnum || 1;
            // 用户信息section
            that.$userInfo = $('#userInfo');
            that.$mobile = that.$userInfo.find('.mobile');
            that.$vCode = that.$userInfo.find('.vCode');
            that.$vCodeNum = that.$userInfo.find('.vCodeNum');
            that.$changeMobile = that.$getVCode = $('.changeMobile,.getVCode');
            that.$user = that.$userInfo.find('.user');
            that.$address = that.$userInfo.find('.address');
            // off按钮
            that.$off = $('.off');
            // 确认购买
            that.$makeOrder = $('#makeorder');
            // toast提示
            that.$sendFloat = $('#sendFloat');
            that.$sendText = $('#sendText');
            that.toastMsg = {
                mobileEmpty: '请输入手机号',
                mobile: '手机号错误，请重新输入',
                vCodeEmpty: '请输入验证码',
                vCode: '验证码有误，请重新输入',
                userEmpty: '请填写收货人',
                addressEmpty: '请填写收货地址'
            };
            // 微信提示
            that.isWeChat = /micromessenger/i.test(navigator.userAgent);
            that.$weChatTip = $('#wxTip');
            if (that.isWeChat) {
                that.$weChatTip.show();
                jiajuUtils.toggleTouchmove(1);
            }

            // 初始化状态
            that.initStatus();
            that.changeAmount();
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


            // 订单信息sectionEvent
            that.$minus.on('click', function () {
                $(this).hasClass('active') && that.changeAmount(-1);
            });
            that.$plus.on('click', function () {
                $(this).hasClass('active') && that.changeAmount(1);
            });
            that.$amount.on('blur', function () {
                that.changeAmount();
            });


            // 用户信息sectionEvent
            // 修改手机号
            that.$userInfo.on('click', '.changeMobile', $.proxy(that.changeMobileFn, that));
            // 获取验证码
            that.$userInfo.on('click', '.getVCode', $.proxy(that.getVerifyCode, that));
            that.$userInfo.on('focus input', '.required', function () {
                that.inputInputFn(this);
            }).on('blur', '.required', $.proxy(that.inputBlurFn, that));


            // off按钮事件
            that.$off.on('click', function () {
                that.offClickFn(this);
            });
            that.$off.next().on('input', that.offToggle);

            // 提交订单
            that.$makeOrder.find('a').on('click', $.proxy(that.makeOrderClickFn, that));

            // 微信提示
            that.$weChatTip.find('.wxTipKonw').on('click', function () {
                that.$weChatTip.hide();
                jiajuUtils.toggleTouchmove();
            });
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
                that.$makeOrder.addClass('active');
            } else {
                that.$makeOrder.removeClass('active');
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
                    that.$makeOrder.addClass('active');
                } else {
                    that.$makeOrder.removeClass('active');
                }
            }
        },


        // orderInfo
        changeAmount: function (delta) {
            var that = this;
            var num = +that.$amount.val();
            var numChange = ~~((num || 0) + (delta || 0));
            if (numChange > that.maximum) {
                numChange = that.maximum;
            } else if (numChange < that.minimum) {
                numChange = that.minimum;
            }
            if (numChange !== num) {
                that.$amount.val(numChange);
            }
            that.amount = numChange;
            that.$minus[numChange > that.minimum ? 'addClass' : 'removeClass']('active');
            that.$plus[numChange < that.maximum ? 'addClass' : 'removeClass']('active');
            that.$total.text((that.per * 100 * numChange + that.shipping * 100) / 100);
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

        // off
        offClickFn: function (ele) {
            this.refreshStatus(0, $(ele).hide().next().val('').data('type'));
        },
        offToggle: function () {
            var $this = $(this);
            $this.prev()[$this.val() ? 'show' : 'hide']();
        },

        // 确认提交
        makeOrderClickFn: function () {
            var that = this;
            if (that.$makeOrder.hasClass('active') && that.canAjax) {
                if (that.isWeChat) {
                    that.$weChatTip.show();
                    jiajuUtils.toggleTouchmove(1);
                } else {
                    that.canAjax = false;
                    // 检查数量
                    that.statusObj.vCode ? verifycode.sendVerifyCodeAnswer(that.mobile, that.vCode, function () {
                        vars.mobile = that.mobile;
                        that.changeMobileFn();
                        that.makeOrder();
                    }, function () {
                        that.toast('验证码错误');
                        that.canAjax = true;
                    }) : that.makeOrder();
                }
            }
        },

        // 收银台跳转
        makeOrder: function () {
            var that = this;
            var num = that.amount = that.amount || that.$amount.val();
            var makeOrderUrl = vars.jiajuSite + '?c=jiaju&a=ajaxGenerateOrder&city=' + vars.city + '&r=' + Math.random();
            if (vars.browsermode) {
                makeOrderUrl += '&src=client';
            }
            var makeOrderData = {
                type: vars.type,
                id: vars.id,
                num: num,
                platformid: vars.platformid,
                sourceid: vars.sourceid,
                positionid: vars.positionid,
                activityid: vars.activityid,
                activitydes: vars.activitydes

            };
            // 商品页有姓名和地址信息
            if (vars.type === '0') {
                makeOrderData.name = encodeURIComponent(that.user || that.$user.val());
                makeOrderData.addr = encodeURIComponent(that.address || that.$address.val());
            }
            $.ajax({
                type: 'get',
                url: makeOrderUrl,
                data: makeOrderData,
                success: function (obj) {
                    if (obj.issuccess === '1') {
                        // 填充收银台表单, 并提交表单
                        $('#biz_id').val(obj.info.biz_id);
                        $('#call_time').val(obj.info.call_time);
                        $('#charset').val(obj.info.charset);
                        $('#extra_param').val(obj.info.extra_param);
                        $('#invoker').val(obj.info.invoker);
                        $('#notify_url').val(obj.info.notify_url);
                        $('#origin').val(obj.info.origin);
                        $('#out_trade_no').val(obj.info.out_trade_no);
                        $('#paid_amount').val(obj.info.paid_amount);
                        $('#platform').val(obj.info.platform);
                        $('#quantity').val(obj.info.quantity);
                        $('#return_url').val(obj.info.return_url);
                        $('#service').val(obj.info.service);
                        $('#sign_type').val(obj.info.sign_type);
                        $('#subject').val(obj.info.subject);
                        $('#title').val(obj.info.title);
                        $('#total').val(obj.info.price);
                        $('#trade_amount').val(obj.info.trade_amount);
                        $('#trade_type').val(obj.info.trade_type);
                        $('#user_id').val(obj.info.user_id);
                        $('#version').val(obj.info.version);
                        $('#sign').val(obj.info.sign);
                        $('#form').submit();
                    } else {
                        // 生成订单接口错误的处理
                        that.toast(obj.errormessage);
                        that.canAjax = true;
                        if (obj.LeftNum && obj.LimitNum) {
                            that.maximum = Math.min(obj.LeftNum, obj.LimitNum) || 1;
                            that.changeAmount();
                        }
                    }
                },
                error: function () {
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
        toast: function (msgType) {
            var that = this;
            that.$sendText.text(that.toastMsg[msgType] || msgType);
            that.$sendFloat.show();
            jiajuUtils.toggleTouchmove(1);
            that.toastTime && clearTimeout(that.toastTime);
            that.toastTime = setTimeout(function () {
                that.$sendFloat.hide();
                jiajuUtils.toggleTouchmove();
            }, 2000);
        }
    };
    module.exports = generateOrder;
});