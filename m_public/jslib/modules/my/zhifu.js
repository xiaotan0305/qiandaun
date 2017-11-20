define('modules/my/zhifu', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var city = vars.city;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('id')] = element.value;
        });
        var c1Checked = $('#c1').prop('checked'),
            c2Checked = $('#c2').prop('checked');
        $(function () {
            var fee;
            if (c1Checked) {
                fee = vars.bonusamount;
                if (fee >= vars.dayprice) {
                    $('#zdbox').hide();
                    $('#zdtype').hide();
                } else {
                    $('#dayprice').html(Math.round((vars.dayprice - fee) * 100) / 100);
                    $('#moneyQuantity').val(Math.round((vars.dayprice - fee) * 100) / 100);
                }
            }
            if (!c1Checked) {
                fee = 0.00;
                $('#dayprice').html(Math.round((vars.dayprice - fee) * 100) / 100);
                $('#moneyQuantity').val(Math.round((vars.dayprice - fee) * 100) / 100);
            }
            $('#check').change(function () {
                if (c1Checked === true && c2Checked === false) {
                    fee = vars.bonusamount;
                    $('.pay-pw').hide();
                } else if (c1Checked === false && c2Checked === false) {
                    fee = 0.00;
                    if (vars.issetPwd === true) {
                        $('.pay-pw').hide();
                    }
                } else if (c1Checked === false && c2Checked === true) {
                    fee = vars.Balance;
                    if (vars.issetPwd === true) {
                        $('.pay-pw').show();
                    }
                } else if (c1Checked === true && c2Checked === true) {
                    fee = vars.Balance + vars.bonusamount;
                    if (vars.issetPwd === true) {
                        $('.pay-pw').show();
                    }
                } else if (c1Checked === undefined && c2Checked === true) {
                    fee = vars.Balance;
                    if (vars.issetPwd === true) {
                        $('.pay-pw').show();
                    }
                } else if (c1Checked === undefined && c2Checked === false) {
                    fee = 0.00;
                    $('.pay-pw').hide();
                } else {
                    fee = 0.00;
                }
                if (fee > vars.dayprice) {
                    $('#dayprice').html('');
                    $('#bank').attr('checked', false);
                    $('#zhifubao').attr('checked', false);
                    $('#zdbox').hide();
                    $('#zdtype').hide();
                } else {
                    $('#dayprice').html(Math.round((vars.dayprice - fee) * 100) / 100);
                    $('#moneyQuantity').val(Math.round((vars.dayprice - fee) * 100) / 100);
                    $('#zdbox').show();
                    $('#zdtype').show();
                }
            });
        });
        $('.zd-btn').click(function () {
            if ($('#zhifu').val() === '1') {
                alert('正在处理，请耐心等待');
                return;
            }
            // price 为第三方支付金额
            var price = $('#dayprice').text();
            // var type = '';
            var IsUseBonus = '';
            var pwd, type;
            if (price > 0) {
                if (c1Checked && c2Checked) {
                    pwd = $('#pwd').val();
                    if (pwd === '') {
                        alert('余额不足，请选择其他支付方式');
                        $('#zhifu').val('0');
                        return;
                    }
                    if (!$('#zhifubao').prop('checked') && !$('#bank').prop('checked')) {
                        alert('请选择支付方式');
                        $('#zhifu').val('0');
                        return;
                    }
                    $('#form').submit();
                }
                if (!c1Checked && !c2Checked) {
                    if (!$('#zhifubao').prop('checked') && !$('#bank').prop('checked')) {
                        alert('请选择支付方式');
                        $('#zhifu').val('0');
                        return;
                    }
                    if ($('#bank').prop('checked')) {
                        type = 2;
                    }
                    if ($('#zhifubao').prop('checked')) {
                        type = 1;
                    }
                    $('#form').submit();
                }
                if (!c1Checked && c2Checked) {
                    IsUseBonus = 'unusebonus';
                    pwd = $('#pwd').val();
                    if (pwd === '') {
                        alert('请输入支付密码');
                        $('#zhifu').val('0');
                        return;
                    }
                    if (!$('#zhifubao').prop('checked') && !$('#bank').prop('checked')) {
                        alert('余额不足，请选择其他支付方式');
                        $('#zhifu').val('0');
                        return;
                    }
                    $('#form').submit();
                }
                if (c1Checked && !c2Checked) {
                    IsUseBonus = 'usebonus';
                    if ($('#zhifubao').prop('checked') === false && $('#bank').prop('checked') === false) {
                        alert('余额不足，请选择其他支付方式');
                        $('#zhifu').val('0');
                        return;
                    }
                    $('#form').submit();
                }
            } else {
                if (c1Checked === true && c2Checked === false) {
                    IsUseBonus = 'usebonus';
                    $.get('?c=my&a=markSureOrder', {
                        orderid: vars.orderid,
                        IsUseBonus: IsUseBonus
                    },
                        function (data) {
                            var json = JSON.parse(data);
                            var result = json.result;
                            var message = decodeURIComponent(json.message);
                            if (result === '100') {
                                window.location.href = '?c=my&a=payInResult&payType=payZhiding&city=' + city;
                            } else {
                                alert(message);
                            }
                            $('#zhifu').val('0');
                        });
                }
                if (c1Checked === true && c2Checked === true) {
                    IsUseBonus = 'usebonus';
                    pwd = $('#pwd').val();
                    if (pwd === '') {
                        alert('请输入支付密码');
                        $('#zhifu').val('0');
                        return;
                    }
                    $.get('?c=my&a=markSureOrder', {
                        orderid: vars.orderid,
                        IsUseBonus: IsUseBonus,
                        pwd: pwd
                    },
                        function (data) {
                            var json = JSON.parse(data);
                            var result = json.result;
                            var status = json.status;
                            var message = decodeURIComponent(json.message);
                            if (Number(status) === 0) {
                                alert('支付密码错误，请重新输入');
                                $('#zhifu').val('0');
                                return false;
                            }
                            if (result === '100') {
                                window.location.href = '?c=my&a=payInResult&payType=payZhiding&city=' + city;
                            } else {
                                alert(message);
                            }
                            $('#zhifu').val('0');
                        });
                }
                if ((c1Checked === false || c1Checked === undefined) && c2Checked === true) {
                    IsUseBonus = 'unusebonus';
                    pwd = $('#pwd').val();
                    if (pwd === '') {
                        alert('请输入支付密码');
                        $('#zhifu').val('0');
                        return;
                    }
                    $.get('?c=my&a=markSureOrder', {
                        orderid: vars.orderid,
                        IsUseBonus: IsUseBonus,
                        pwd: pwd
                    },
                        function (data) {
                            var json = JSON.parse(data);
                            var result = json.result;
                            var status = json.status;
                            var message = decodeURIComponent(json.message);
                            if (Number(status) === 0) {
                                alert('支付密码错误，请重新输入');
                                $('#zhifu').val('0');
                                return false;
                            }
                            if (result === '100') {
                                window.location.href = '?c=my&a=payInResult&payType=payZhiding&city=' + city;
                            } else {
                                alert(message);
                            }
                            $('#zhifu').val('0');
                        });
                }
            }
        });
    };
});