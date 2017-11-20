/**
 * Created by user on 2017/6/14.
 */

define('modules/jiaju/sjsAppointment', ['jquery', 'verifycode/1.0.0/verifycode', 'modules/jiaju/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var verifycode = require('verifycode/1.0.0/verifycode');
        var currentLength = 0;
        var quantityLength = $('.content input').length;
        var nameInput = $('#uname');
        var currentNState = nameInput.val() ? 'true' : 'empty';
        var nameState = {empty: '请输入称呼'};
        var currentPState = vars.phone ? 'true' : 'empty';
        var phoneState = {
            empty: '请输入手机号',
            ileagal: '手机号格式不正确'
        };
        var currentCState = vars.phone ? 'true' : 'empty';
        var codeState = {
            empty: '请输入验证码',
            ileagal: '验证码格式不正确'
        };
        var phonInput = $('#phone');
        var phoneBtn = $('#phoneBtn');
        var vcodeLi = $('#vcodeLi');
        var codeInput = $('#vcode');
        var submitBtn = $('#submit');
        var ajaxFlag = true;
        var getCodeFlag = true;
        var state = {
            NState: 'false',
            PState: 'false',
            CState: 'false'
        };
        var firstTime = 'true';

        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'mjjsjsappointment',
            companyid: vars.companyId,
            designerid: vars.userId
        });

        orderStateFn();
        // 您的称呼Input
        nameInput.on('input', function () {
            var self = $(this);
            var val = self.val();
            currentNState = val ? 'true' : 'empty';
            orderStateFn();
        }).on('blur', function () {
            if (currentNState !== 'true') {
                toastFn(nameState[currentNState]);
            }
        });
        // 手机号Input
        phonInput.on('input', function () {
            var self = $(this);
            var val = self.val();
            var bool = /^1[34578][0-9]{9}$/.test(val);
            phoneBtn.removeClass('active');
            if (val) {
                if (bool) {
                    currentPState = 'true';
                    if (vars.phone === self.val()) {
                        self.attr('disabled', 'true');
                        phoneBtn.text('更换手机号').addClass('hasSend changeMobile').removeClass('getCode');
                        currentCState = 'true';
                    } else {
                        phoneBtn.text('获取验证码');
                        currentCState = 'empty';
                    }
                    phoneBtn.addClass('active');

                } else {
                    currentPState = 'ileagal';
                }
            } else {
                currentPState = 'empty';
            }
            orderStateFn();
        }).on('blur', function () {
            if (currentPState !== 'true') {
                toastFn(phoneState[currentPState]);
            }
        });
        // 获取验证码或者更换手机号
        phoneBtn.on('click', function () {
            phoneBtn.hasClass('active') && getCodeFlag && doubleUseFn();
        });
        // 验证码Input
        codeInput.on('input', function () {
            var self = $(this);
            var val = self.val();
            var bool = /^[0-9]{4}$/.test(val);
            if (val) {
                if (bool) {
                    currentCState = 'true';
                } else {
                    currentCState = 'ileagal';
                }
            } else {
                currentCState = 'empty';
            }
            orderStateFn();
        }).on('blur', function () {
            if (currentCState !== 'true') {
                toastFn(codeState[currentCState]);
            }
        });
        // 提交
        submitBtn.on('click', function () {
            $('.jj-submitBtn').hasClass('active') && ajaxFlag && submitFn();
        });
        function doubleUseFn() {
            getCodeFlag = false;
            var bool = phoneBtn.hasClass('changeMobile');
            phoneBtn.removeClass('changeMobile').addClass('getCode');
            // 更换手机号
            if (bool) {
                phonInput.val('').removeAttr('disabled');
                phoneBtn.removeClass('hasSend');
                currentPState = 'empty';
                currentCState = 'empty';
                getCodeFlag = true;
            } else {
                // 获取验证码
                getCode();
            }
            orderStateFn();
            phoneBtn.removeClass('active');
        }
        function getCode() {
            vcodeLi.show();
            var phone = phonInput.val();
            verifycode.getPhoneVerifyCode(phone, function () {
                phonInput.prop('disabled', 'true');
                phoneBtn.addClass('hasSend');
                toastFn('发送成功！');
                djs(60);
                getCodeFlag = true;
            }, function () {
                toastFn('获取验证码失败！');
                phoneBtn.addClass('active');
                getCodeFlag = true;
            });
        }
        function djs(time) {
            phoneBtn.removeClass('active');
            var timeId = setInterval(function () {
                time--;
                phoneBtn.text('发送中(' + time + ')');
                if (time === 0) {
                    clearInterval(timeId);
                    phoneBtn.text('重新发送').addClass('active');
                }
            }, 1000);
        }
        function orderStateFn() {
            if (firstTime) {
                firstTime = false;
                if (currentNState === 'true') {
                    state.NState = 'true';
                    currentLength++;
                }
                if (currentPState === 'true') {
                    state.PState = 'true';
                    currentLength++;
                }
                if (currentCState === 'true') {
                    state.CState = 'true';
                    currentLength++;
                }
            }
            if ((currentNState === 'true' ? 'true' : 'false') !== state['NState']) {
                if (currentNState === 'true') {
                    currentLength++;
                    state['NState'] = 'true';
                } else {
                    currentLength--;
                    state['NState'] = 'false';
                }
            }
            if ((currentPState === 'true' ? 'true' : 'false') !== state['PState']) {
                if (currentPState === 'true') {
                    currentLength++;
                    state['PState'] = 'true';
                } else {
                    currentLength--;
                    state['PState'] = 'false';
                }
            }
            if ((currentCState === 'true' ? 'true' : 'false') !== state['CState']) {
                if (currentCState === 'true') {
                    phoneBtn.hasClass('hasSend') && currentLength++;
                    state['CState'] = 'true';
                } else {
                    currentLength--;
                    state['CState'] = 'false';
                }
            }
            if (currentLength === quantityLength) {
                $('.jj-submitBtn').addClass('active');
            } else {
                $('.jj-submitBtn').removeClass('active');
            }
        }
        function submitFn() {
            var phoneNumber = phonInput.val();
            var vCode = codeInput.val();
            // 没有更换手机号
            if (phoneNumber === vars.phone) {
                ajaxFn();
            } else {
                verifycode.sendVerifyCodeAnswer(phoneNumber, vCode, ajaxFn, function () {
                    toastFn('验证码错误');
                    ajaxFlag = true;
                });
            }
        }
        function ajaxFn() {
            // 预约用户行为统计
            yhxw({
                page: 'mjjsjsappointment',
                type: 62,
                companyid: vars.companyId,
                designerid: vars.userId,
                name: nameInput.val().trim(),
                phone: phonInput.val().trim()
            });
            $.ajax({
                type: 'get',
                url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxSjsAppointment&city=' + vars.city
                + '&companyId=' + vars.companyId + '&userId=' + vars.userId + '&username=' + nameInput.val().trim(),
                success: function (data) {
                    if (data.issuccess === 1) {
                        toastFn('恭喜您预约成功啦');
                    } else {
                        toastFn(data.message);
                    }
                },
                complete: function () {
                    ajaxFlag = true;
                }
            });
        }
        function toastFn(message) {
            $('#sendText').text(message);
            $('#sendFloat').show();
            setTimeout(function () {
                $('#sendFloat').hide();
            }, 2000);
        };
    };
});

