/**
 * @file 优惠券购买页
 * created by muzhaoyang 2017 - 04 - 18
 */
define('modules/jiajuds/buyCoupon', ['jquery', 'verifycode/1.0.0/verifycode'], function(require, exports, module) {
    'use strict';
    module.exports = function() {
        var $ = require('jquery');
        var verifycode = require('verifycode/1.0.0/verifycode');
        var vars = seajs.data.vars;
        var jiajuUtils = vars.jiajuUtils;
        var couponMoneyInput = $('#couponMoney');
        var realMoneyInput = $('#realMoney');
        var submitButton = $('.jj-submitBtn');
        var sendFloat = $('#sendFloat');
        var sendText = $('#sendText');
        var vcodeBtn = $('#vcode');
        var vcodeInput = $('#vcodeInput');
        var telPhone = $('#telPhone');
        var couponMoney = vars.couponprice;
        var realMoney = vars.realmoney;
        var buyFlag = true;
        var phoneNum = '';
        var paramObj = {};
        var toastMes = {
            couponMoneyIlleagal: '请输入数值在100-40000之间的金额',
            phoneEmpty: '请输入手机号',
            phoneIlleagal: '输入手机号格式错误',
            vCodeSend: '请先发送验证码'
        };
        var flag = {
            couponMoneyIlleagal: false,
            phoneEmpty: false,
            phoneIlleagal: false,
            vCodeSend: false
        };
        var ajaxflag = {
            getVerifyCode: true,
            checkVerifyCode: true
        };
        initPage();
        /**
         * [initPage description] 页面初始化
         * @return {[type]} [description]
         */
        function initPage() {
            if(vars.realmoney && vars.couponprice) {
                paramObj.price = vars.couponprice;
                flag.couponMoneyIlleagal = true;
            }
            paramObj.sid = vars.sid;
            paramObj.cid = vars.cid;
            if (vars.phone) {
                flag.phoneEmpty = true;
                flag.phoneIlleagal = true;
                flag.vCodeSend = true;
            }
            eventInit();
        }

        /**
         * [eventInit description] 事件绑定函数
         * @return {[type]} [description]
         */
        function eventInit() {
            // 数据请求失败时, 点击刷新
            $('.default-content').on('click', function() {
                window.location.reload();
            });
            // 抵用金额事件，input判定状态，blur给出提示
            couponMoneyInput.on('input', function() {
                var able,temp;
                couponMoney = couponMoneyInput.val().trim();
                able = /^\d{0,5}(\.\d{0,2})?$/.test(couponMoney) && couponMoney.length <= 8;
                if(able) {
                    if(couponMoney === '' || couponMoney === '.' || +couponMoney < 100 || +couponMoney > 40000) {
                        flag.couponMoneyIlleagal = false;
                        realMoneyInput.val('');
                    } else {
                        flag.couponMoneyIlleagal = true;
                        realMoney = Math.round(+couponMoney * vars.realmoney / vars.couponprice * 100) / 100;
                        realMoneyInput.val(toDecimal2(realMoney));
                        
                    }
                } else {
                    couponMoney = couponMoney.substr(0,couponMoney.length - 1);
                    couponMoneyInput.val(couponMoney);
                }
            }).on('blur', function() {
                if(!flag.couponMoneyIlleagal) {
                    toastFn(toastMes.couponMoneyIlleagal);
                    if(vars.realmoney && vars.couponprice) {
                        flag.couponMoneyIlleagal = true;
                        couponMoneyInput.val(toDecimal2(vars.couponprice));
                        realMoneyInput.val(toDecimal2(vars.realmoney));
                        paramObj.price = vars.couponprice;
                    } else {
                        flag.couponMoneyIlleagal = false;
                        couponMoneyInput.val('');
                        realMoneyInput.val('');
                    }
                } else {
                    couponMoneyInput.val(toDecimal2(couponMoney));
                    paramObj.price = toDecimal2(couponMoney);
                }
                
            });
            // 确认购买按钮
            submitButton.on('click', function() {
                if (!flag.couponMoneyIlleagal) {
                    toastFn(toastMes.couponMoneyIlleagal);
                } else if(vars.phone === telPhone.val()) {
                    ajaxflag.checkVerifyCode && buyAjaxFn();
                } else if(!flag.phoneEmpty) {
                    toastFn(toastMes.phoneEmpty);
                } else if(!flag.phoneIlleagal) {
                    toastFn(toastMes.phoneIlleagal);
                } else if(!flag.vCodeSend) {
                    toastFn(toastMes.vCodeSend);
                } else {
                    ajaxflag.checkVerifyCode && checkVerifyCode();
                }
            });
            // 获取验证码或者更改手机号方法
            vcodeBtn.on('click', function() {
                var self = $(this);
                if (self.hasClass('changeMobile')) {
                    flag.phoneEmpty = false;
                    flag.phoneIlleagal = false;
                    flag.vCodeSend = false;
                    self.removeClass('changeMobile').addClass('sendVCode noClick').text('获取验证码');
                    telPhone.removeAttr('disabled').val('').focus();
                }
                if (self.hasClass('sendVCode') && !self.hasClass('noClick')) {
                    ajaxflag.getVerifyCode && getVerifyCode();
                }
            });
            // 输入手机号
            telPhone.on('input', function() {
                var phoneNumber = telPhone.val().trim();
                vcodeBtn.addClass('noClick');
                var able = /^1[34578][0-9]{9}$/.test(phoneNumber);
                if (able) {
                    flag.phoneEmpty = true;
                    flag.phoneIlleagal = true;
                    flag.phonevCodeSend = false;
                    if (vars.phone === phoneNumber) {
                        flag.vCodeSend = true;
                        vcodeBtn.removeClass('sendVcode noClick').addClass('changeMobile').text('更换手机号');
                        telPhone.attr('disabled',true);
                    } else {
                        vcodeBtn.removeClass('noClick');
                    } 
                } else if(!phoneNumber){
                    flag.phoneEmpty = false;
                } else {
                    flag.phoneEmpty = true;
                    flag.phoneIlleagal = false;
                }
            }).on('blur', function() {
                var phoneNumber = telPhone.val().trim();
                if (!flag.phoneEmpty) {
                    toastFn(toastMes.phoneEmpty);
                } else if (!flag.phoneIlleagal) {
                    toastFn(toastMes.phoneIlleagal);
                } else {
                    vcodeBtn.removeClass('noClick');
                    phoneNum = phoneNumber;
                }
            });
        }

        /**
         * [toDecimal2 description]辅助函数，将金额处理为两位小数
         * @param  {[type]} x [description] 金额数值
         * @return {[type]}   [description]
         */
        function toDecimal2(x) {
            var f_x = parseFloat(x);
            if (isNaN(f_x)) {
                alert('function:changeTwoDecimal->parameter error');
                return false;
            }
            f_x = Math.round(f_x*100)/100;
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            return s_x;
        }

        /**
         * [toastFn description] 页面提示信息函数
         * @param  {[type]} msg [description]
         * @return {[type]}     [description]
         */
        function toastFn(msg) {
            sendText.text(msg);
            sendFloat.show();
            jiajuUtils.toggleTouchmove(true);
            setTimeout(function () {
                sendFloat.hide();
                jiajuUtils.toggleTouchmove(false);
            },2000);
        }
        
        /**
         * [getVerifyCode description] 获取验证码
         * @return {[type]} [description]
         */
        function getVerifyCode() {
            vcodeInput.parents('li').eq(0).show();
            ajaxflag.getVerifyCode = false;
            verifycode.getPhoneVerifyCode(phoneNum, function() {
                vcodeBtn.addClass('noClick');
                telPhone.attr('disabled', 'true');
                flag.vCodeSend = true;
                timeRecorder(60);
                ajaxflag.getVerifyCode = true;
            }, function() {
                toastFn('获取验证码失败');
                ajaxflag.getVerifyCode = true;
            });
        }
        
        /**
         * [timeRecorder description] 验证码倒计时
         * @param  {[type]} timePara [description] 设置倒计时的时长
         * @return {[type]}          [description]
         */
        function timeRecorder(timePara) {
            var handle = setInterval(function() {
                vcodeBtn.text('发送中(' + timePara + ')');
                if (timePara === 0) {
                    clearInterval(handle);
                    vcodeBtn.text('重新发送').removeClass('noClick');
                }
                timePara--;
            }, 1000);
        }
        
        /**
         * [checkVerifyCode description] 登录信息验证
         * @return {[type]} [description]
         */
        function checkVerifyCode() {
            ajaxflag.checkVerifyCode = false;
            verifycode.sendVerifyCodeAnswer(phoneNum, vcodeInput.val(), buyAjaxFn, function() {
                toastFn(vcodeInput.val() ? '验证码错误' : '请输入验证码');
                ajaxflag.checkVerifyCode = true;
            });
        }

        /**
         * [buyAjaxFn description] 提交验证
         * @return {[type]} [description]
         */
        function buyAjaxFn() {
            ajaxflag.checkVerifyCode = false;
            $.ajax({
                type: 'post',
                url: location.protocol + vars.ajaxUrl,
                data: paramObj,
                success: function(obj) {
                    if (obj.success === '1') {
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
                        // todo toast提示 obj.message
                        // todo ajaxFlag = true
                        toastFn(obj.message);
                    }
                },
                complete: function() {
                    ajaxflag.checkVerifyCode = true;
                }
            });
        }
    };
});