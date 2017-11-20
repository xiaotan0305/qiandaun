/**
 * @file 提现
 * @created by 袁辉辉(yuanhuihui@fang.com) 杨传龙
 */
define('modules/my/salaryDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 获取页面数据
        var vars = seajs.data.vars;
        // 点击提现按钮
        var con = $('.con:eq(0)');
        // 提现浮层
        var xzopenstart = $('#xzopen1');
        var xzopenover = $('#xzopen2');
        // 取消提现按钮
        var cancelCash = $('.cancelCash');
        // 提交提现按钮
        var goCash = $('.goCash');
        // 提现的框
        var cashAmount = $('.cashAmount');
        // 非数字正则
        var noNumPattern = /[^\d|.]+/g;
        // 浮层提示内容
        var cont = $('#cont');
        // 浮层提示
        var float = $('#float');
        // 余额
        var balance = $('#balance');
        // 完成按钮
        var over = $('#over');
        // 弹出浮层
        con.on('click', function () {
            xzopenstart.show();
            cashAmount.focus();
        });
        // 取消浮层
        cancelCash.on('click', function () {
            xzopenstart.hide();
        });
        over.on('click', function () {
            xzopenover.hide();
        });
        // 点击全部提现,使得提现框内变为余额
        $('.allCash').off('click').on('click', function () {
            cashAmount.val(parseFloat(balance.text().replace('￥', '')));
        });
        // 验证有效性
        cashAmount.off('input').on('input', function () {
            cashAmount.val(cashAmount.val().replace(noNumPattern, ''));
        });
        // 提示浮层
        var toastMsg = function (msg) {
            xzopenstart.hide();
            float.show();
            cont.html(msg);
            setTimeout(function () {
                float.hide();
                xzopenstart.show();
            }, 2000);
        };
        // 防止重复点击
        var canClick = !0;
        // 点击确认发放按钮
        goCash.off('click').on('click', function () {
            var cashmoney = cashAmount.val();
            var val = cashAmount.val(), balanceMon = parseFloat(balance.text().replace('￥', ''));
            if (val === '') {
                toastMsg('请输入金额');
                return;
            }
            // 数字
            if (isNaN(val)) {
                toastMsg('金额输入非法');
                return;
            }
            if (val.indexOf('.') > -1) {
                // 两位小数
                var afterDot = val.split('.')[1];
                var flag = afterDot.length > 2 ? 'tooAccurate' : '';
                if (flag === 'tooAccurate') {
                    toastMsg('金额输入非法');
                    return;
                }
            }
            // 小于总额
            if (parseFloat(val) > balanceMon) {
                toastMsg('余额不足');
                return;
            }
            if (parseFloat(val) <= 0) {
                toastMsg('提现金额必须大于0元');
                return;
            }
            if (canClick) {
                canClick = !1;
                var url = vars.mySite + '?c=my&a=ajaxGoCash&city=' + vars.city;
                var data = {
                    userid: vars.userid,
                    money: balanceMon,
                    cashAmount: cashmoney
                };
                $.ajax({
                    type: 'post',
                    url: url,
                    data: data,
                    dataType: 'json',
                    success: function (data) {
                        canClick = !0;
                        if (data.code === '100') {
                            xzopenstart.hide();
                            xzopenover.show();
                            $('#money').val('');
                            var newBlance = balanceMon - cashmoney;
                            $('#nowmoney').html('工资余额￥' + newBlance);
                            $('#showmoney').html('￥' + cashmoney);
                            balance.html('￥' + newBlance);
                        } else {
                            toastMsg('提现失败');
                        }
                    },
                    error: function () {
                        canClick = !0;
                        toastMsg('提现失败');
                    }
                });
            }
        });
        // 点击历史弹提示
        $('.no3').on('click', function () {
            float.show();
            cont.html('您的历史薪资明细稍后同步导入，请您耐心等待：）');
            setTimeout(function () {
                float.hide();
            }, 4000);
        });
    };
});