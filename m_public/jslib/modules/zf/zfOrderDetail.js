define('modules/zf/zfOrderDetail', ['jquery', 'verification/1.0.0/verification'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 点击选择优惠券，出现选择框
    var choose = $('#choose'),
        cancel = $('.cancel'),
        selectDiv = $('#selectDiv');
    if (choose.length) {
        choose.on('click', function () {
            selectDiv.show();
        });
    }
    // 点击取消按钮
    if(cancel.length){
        cancel.on('click', function () {
            selectDiv.hide();
        });
    }
    // 解决5c上姓名和电话输入框不能正常显示的问题
    var wW = $(document).width();
    var dlList = $('.ddList').find('dl');
    if (wW === 320) {
        dlList.css('line-height', '20px');
    }
    function zfOrderDetailFn() {
    }
    zfOrderDetailFn.prototype = {
        init: function () {
            var that = this;
            /*
            * 付佣金页面
            * */
            that.userName = $('#userName');
            that.userPhone = $('#userPhone');
            // 提交按钮
            that.submitBtn = $('#submitBtn');
            // 选择优惠券的框
            that.couponSelect = $('#choosed');
            // 选择优惠券的框的被选中的option
            that.couponSelectOption = $('#coupon').find('li.choosed');
            that.verification = require('verification/1.0.0/verification');
            // orderDetail下的本次支付dd标签
            that.allMoneyDd = $('#allMoney');
            // orderDetail是否使用优惠券
            that.isCoupon = 0;
            // 客户手机号
            that.customerPhone = $('#customerPhone');
            // 短信验证码
            that.messageCode = $('#messageCode');
            // 半透明模板
            that.front = $('#front');
            // 提示框
            that.prompt = $('#prompt');
            /*
            * form表单内容
            **/
            that.biz_id = $('#biz_id');
            that.charset = $('#charset');
            that.extra_param = $('#extra_param');
            that.notify_url = $('#notify_url');
            that.origin = $('#origin');
            that.out_trade_no = $('#out_trade_no');
            that.paid_amount = $('#paid_amount');
            that.platform = $('#platform');
            that.return_url = $('#return_url');
            that.service = $('#service');
            that.sign_type = $('#sign_type');
            that.subject = $('#subject');
            that.title = $('#title');
            that.trade_type = $('#trade_type');
            that.trade_amount = $('#trade_amount');
            that.user_id = $('#user_id');
            that.version = $('#version');
            that.sign = $('#sign');
            that.quantity = $('#quantity');
            that.invoker = $('#invoker');
            that.price = $('#price');
            that.call_time = $('#call_time');
            that.pay_mode = $('#pay_mode');
            that.form = $('#form');
            /*
            * form表单内容
            **/
            that.bindEvent();
            $('#coupon').find('li').on('click', function () {
                var ele = $(this);
                ele.addClass('choosed').siblings().removeClass('choosed');
                choose.html(ele.html());
                $('#selectDiv').hide();
                that.listenCouponChange();
            });
        },
        bindEvent: function () {
            var that = this;
            that.submitBtn.on('click', function () {
                that.listenSubmit.call(that);
            });
        },

        // 监听奖券表单提交事件
        listenCouponChange: function () {
            var that = this;
            var couponId = $('#coupon').find('li.choosed').attr('data-value');
            var uid = $('#coupon').find('li.choosed').attr('data-uid');
            if (couponId != '0') {
                if (couponId.length != 32) {
                    that.displayLoseFn(3, '优惠券id错误，请稍后再试', 'reload');
                    return;
                }
                var url = vars.zfSite + '?c=zf&a=ajaxGetCouponInfo';
                that.showPrompt('查询中，请稍后');
                $.get(url, {'couponId': couponId}, function (mes) {
                    that.hidePrompt();
                    if (mes.UID) {
                        if (parseFloat(mes.AmountRule) < parseFloat(vars.orderPayment) && parseFloat(mes.Amount) <= parseFloat(vars.orderPayment)) {
                            var newMoney = parseFloat(vars.orderPayment) - parseFloat(mes.Amount);
                            if (parseFloat(newMoney) < 0) {
                                that.displayLoseFn(3, '优惠券金额要小于等于订单金额');
                                return;
                            }
                            newMoney = newMoney.toFixed(1);
                            if (newMoney == 0) {
                                newMoney = 0.01;
                            }
                            that.allMoneyDd.html(newMoney + '元');
                            vars.couponId = uid;
                            vars.couponCityName = mes.CityName;
                            vars.couponType = mes.Type;
                            vars.disCountAmount = mes.Amount;
                            that.isCoupon = 1;
                        } else {
                            // 测试！！！！！！！！！
                            that.allMoneyDd.html(vars.orderPayment + '元');
                            that.displayLoseFn(3, '使用条件不满足，使用其他优惠券试试哟');
                            choose.html('请选择');
                            that.isCoupon = 0;
                        }
                    } else {
                        that.allMoneyDd.html(vars.orderPayment + '元');
                        that.displayLoseFn(3, '查询超时，请稍后再试');
                        that.isCoupon = 0;
                    }
                });
            } else {
                that.allMoneyDd.html(vars.orderPayment + '元');
                that.isCoupon = 0;
            }
        },
        // 监听提交事件
        listenSubmit: function () {
            var that = this;
            var url = vars.zfSite + '?c=zf&a=ajaxCreatePayOrder';
            var data;
            if (vars.type == 'zffuyongjin') {
                if (!$.trim(that.userName.val())) {
                    that.displayLoseFn(3, '请输入姓名');
                    return false;
                }
                if ($.trim(that.userName.val()).length > 12) {
                    that.displayLoseFn(3, '姓名长度超过限制长度');
                    return false;
                }
                if (!that.userPhone.val()) {
                    that.displayLoseFn(3, '请输入手机号');
                    return false;
                }
                if (!that.verification.isMobilePhoneNumber(that.userPhone.val())) {
                    that.displayLoseFn(3, '手机号码格式错误');
                    return false;
                }
                data = {
                    'type': 'zffuyongjin',
                    'tradeRentInfoId': vars.tradeRentInfoId,
                    'leaseOrderId': vars.leaseOrderId,
                    'orderType': vars.orderType,
                    'customerName': that.userName.val(),
                    'customerMobile': that.userPhone.val()
                };
            } else if (vars.type == 'zffufangzu') {
                data = {'type': 'zffufangzu', 'orderId': vars.orderId};
            } else if (vars.type == 'zffangdong') {
                data = {'type': 'zffangdong', 'orderId': vars.orderId};
            } else if (vars.type == 'zffangtianxia') {
                if (that.isCoupon == 1) {
                    switch (vars.couponType) {
                        case '线上' :
                            vars.couponType = '0';
                            break;
                        case '线下' :
                            vars.couponType = '1';
                            break;
                        case '无限制' :
                            vars.couponType = '2';
                            break;
                        default :
                            vars.couponType = '0';
                    }
                    data = {
                        'type': 'zffangtianxia',
                        'allMoney': vars.orderPayment,
                        'couponId': vars.couponId,
                        'cityName': vars.couponCityName,
                        'couponType': vars.couponType,
                        'disCountAmount': vars.disCountAmount,
                        'contractCode': vars.contractCode,
                        'customerName': vars.customerName,
                        'payNo': vars.payNo,
                        'tradeID': vars.tradeID,
                        'deserveId': vars.deserveId,
                        'customerMobile': vars.customerMobile,
                        'checkCode': that.messageCode.val()
                    };
                } else {
                    data = {
                        'type': 'zffangtianxia',
                        'allMoney': vars.orderPayment,
                        'contractCode': vars.contractCode,
                        'customerName': vars.customerName,
                        'payNo': vars.payNo,
                        'tradeID': vars.tradeID,
                        'deserveId': vars.deserveId,
                        'customerMobile': vars.customerMobile,
                        'checkCode': that.messageCode.val()
                    };
                }
            }
            $.post(url, data, function (data) {
                if (data.errcode == '1') {
                    that.biz_id.val(data.biz_id);
                    that.call_time.val(data.call_time);
                    that.charset.val(data.charset);
                    that.extra_param.val(data.extra_param);
                    that.invoker.val(data.invoker);
                    that.notify_url.val(data.notify_url);
                    that.out_trade_no.val(data.out_trade_no);
                    that.paid_amount.val(data.paid_amount);
                    that.platform.val(data.platform);
                    that.price.val(data.price);
                    that.quantity.val(data.quantity);
                    that.return_url.val(data.return_url);
                    that.service.val(data.service);
                    that.sign_type.val(data.sign_type);
                    that.title.val(data.title);
                    that.trade_amount.val(data.trade_amount);
                    that.trade_type.val(data.trade_type);
                    that.user_id.val(data.user_id);
                    that.version.val(data.version);
                    that.sign.val(data.sign);
                    that.origin.val(data.origin);
                    that.subject.val(data.subject);
                    that.pay_mode.val(data.pay_mode);
                    that.form.submit();
                } else {
                    that.displayLoseFn(3, data.errMes, 'reload');
                }
            });
        },
        // 显示文字提示
        showPrompt: function (keywords) {
            var that = this;
            that.front.show();
            that.prompt.html(keywords).show();
        },
        // 隐藏文字提示
        hidePrompt: function () {
            var that = this;
            that.front.hide();
            that.prompt.html('').hide();
        },
        // 弹层
        displayLoseFn: function (numPara, keywords, url) {
            var that = this;
            var num = numPara;
            var errorTimer = setInterval(function () {
                num--;
                that.prompt.html(keywords).show();
                that.front.show();
                if (num <= 0) {
                    clearInterval(errorTimer);
                    that.prompt.html('').hide();
                    that.front.hide();
                    if (url == 'reload') {
                        window.location.reload();
                    } else if (url) {
                        window.location.href = url;
                    }
                }
            }, 1000);
        }
    };
    var zfOrderDetailObj = new zfOrderDetailFn;
    zfOrderDetailObj.init();
    module.exports = zfOrderDetailFn;
});

