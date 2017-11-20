/**
 * @file 发红包
 * @created by 袁辉辉(yuanhuihui@fang.com) 杨传龙
 */
define('modules/my/oaSendRedBag', ['jquery', 'rsa/1.0.0/rsa'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 获取页面数据
        var vars = seajs.data.vars;
        // 用户是否开通我的钱
        var isUserCanEnter = vars.isUserCanEnter,
            isAcceptUserCanEnter = vars.isAcceptUserCanEnter,
        // 传参是否正确
            vcode_state = vars.vcode_state,
        // 绑定事件对象
            send = $('#send'),
            remark = $('#remark'),
            doSendContent = $('#doSendContent'),
            toast = $('#toast'),
            toastTxt = $('#toastTxt'),
            closeDoSend = $('#closeDoSend'),
            moneyDisplay = $('#moneyDisplay'),
            moneyResult = $('#moneyResult'),
            see = $('#see'),
            money = $('#money'),
        // 充值按钮
            depositUrl = $('#depositUrl'),
        // 确认发放按钮
            doSendBtn = $('#doSendBtn'),
            password = $('#password');
        // 非数字正则
        var noNumPattern = /[^\d|.]+/g;
        // 备注、钱输入标识
        var remarkFlag = !0;
        var moneyFlag = !1;
        var toastMsg = function (msg) {
            if (!msg) {
                return;
            }
            toastTxt.text(msg);
            toast.show();
            setTimeout(function () {
                toast.hide();
            }, 2000);
        };

        // 若为返回则清空
        if (window.performance && window.performance.navigation
            && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
            $('input[data-id=isUserCanEnter]').val('ndow.performance.navigation.TYPE_BACK_FOR');
            money.val('');
            remark.val('');
        }

        // 关闭页面清空数据
        $(window).on('unload beforeunload ', function () {
            money.val('');
            remark.val('');
        });

        if (!parseInt(vcode_state)) {
            // 参数错误
            toastTxt.text('参数错误');
            toast.show();
            return;
        }

        // 发红包
        if (!parseInt(isUserCanEnter)) {
            toastTxt.text('对不起，您未开通我的钱账户');
            toast.show();
            return;
        }

        // 收红包
        if (!parseInt(isAcceptUserCanEnter)) {
            toastTxt.text('该账户未开通我的钱账户');
            toast.show();
            return;
        }

        // 密码可见性
        see.on('click', function () {
            var passType = password.attr('type');
            if (passType !== 'text') {
                password.attr('type', 'text');
            } else {
                password.attr('type', 'password');
            }
        });
        // 充值按钮
        depositUrl.on('click', function () {
            window.location = depositUrl.attr('data-href') + '&RedirectUrl=' + encodeURIComponent(window.location.href) + '&r=' + Math.random();
        });
        // 金额限制
        // 最大最小金额限制范围，oa和房天下的是0.01-200，其余的都是2-100
        var maxMoney, minMoney;
        if (vars.origin === 'OA工作台' || vars.origin === '房天下') {
            maxMoney = 200;
            minMoney = 0.01;
        } else {
            maxMoney = 100;
            minMoney = 2;
        }
        // 金额校验
        var balance = $('#balance');
        var verify = function (isMoney) {
            var flag = '';
            if (isMoney) {
                var val = moneyDisplay.text().replace('￥', ''), balanceMon = parseFloat(balance.text());
                // 数字
                if (isNaN(val)) {
                    moneyFlag = !1;
                    return 'illegal';
                } else {
                    if (val.indexOf('.') > -1) {
                        // 两位小数
                        var afterDot = val.split('.')[1];
                        flag = afterDot.length > 2 ? 'tooAccurate' : '';
                    }
                    if (flag) {
                        return flag;
                    }
                    // 小于总额
                    if (parseFloat(val) > balanceMon) {
                        return 'notEnough';
                    }
                    // todo:正式时改为200
                    if (parseFloat(val) > maxMoney) {
                        return 'tooLarge';
                        // todo:正式时改为0.01
                    } else if (parseFloat(val) < minMoney) {
                        return 'tooLittle';
                    }
                }
            } else {
                var remarkTxt = remark.val().trim();
                flag = remarkTxt.length < 31;
                remark.val(remarkTxt.substr(0, 30));
                if (remark.val().trim().length) {
                    remarkFlag = !0;
                    if (moneyFlag) {
                        send.removeClass('cur');
                    }
                } else {
                    remarkFlag = !1;
                    send.addClass('cur');
                }
            }
            return flag;
        };
        // 关闭浮层
        closeDoSend.off('click').on('click', function () {
            doSendContent.hide();
            password.val('');
        });
        // 备注
        remark.off('input').on('input', function () {
            if (!verify()) {
                return false;
            }
        });
        // 发红包
        send.off('click').on('click', function () {
            if (send.hasClass('cur')) {
                return;
            }
            var result = verify(1);
            switch (result) {
                case 'illegal':
                case 'tooAccurate':
                    toastMsg('金额输入非法');
                    break;
                case 'notEnough':
                    toastMsg('红包金额超出余额上限，请尽快充值');
                    break;
                case 'tooLarge':
                    toastMsg('红包金额必须小于等于' + maxMoney + '元');
                    break;
                case 'tooLittle':
                    toastMsg('红包金额必须大于等于' + minMoney + '元');
                    break;
                default:
                    doSendContent.show();
            }
        });
        // 点击忘记密码
        $('#changePas').on('click', function () {
            window.location = vars.resetUrl + encodeURIComponent(window.location.href) + '&r=' + Math.random();
        });
        // 验证塞钱进红包有效性
        money.off('input').on('input', function () {
            var val = money.val();
            // 若有不符合规则的输入再替换
            if (noNumPattern.test(val)) {
                money.val(val.replace(noNumPattern, ''));
                val = money.val();
            }
            var valFloat = parseFloat(val || 0).toFixed(2);
            moneyResult.text('￥' + valFloat || 0);
            if (isNaN(val)) {
                valFloat = 0;
            }
            moneyDisplay.text('￥' + valFloat);
            if (parseFloat(balance.text()) < valFloat) {
                toastMsg('红包金额超出余额上限，请尽快充值');
            }
            var notmuch = (parseFloat(balance.text()) || 0) >= valFloat;
            if (valFloat > 0 && balance.text() && balance.text() !== '0' && notmuch) {
                moneyFlag = !0;
                if (remarkFlag) {
                    send.removeClass('cur');
                }
            } else {
                moneyFlag = !1;
                send.addClass('cur');
                if (!notmuch) {
                    toastMsg('红包金额超出余额上限，请尽快充值');
                }
            }
        });
        // 防止重复点击
        var canClick = !0;
        // 点击确认发放按钮
        doSendBtn.off('click').on('click', function () {
            if (canClick) {
                require.async('rsa/1.0.0/rsa', function (rsa) {
                    canClick = !1;
                    var passwordEncrypt = rsa(password.val());
                    var url = vars.mySite + '?c=my&a=ajaxAwardBonus';
                    var data = {
                        // 商品编号
                        bizId: vars.biz_id,
                        // 城市
                        zhcity: encodeURIComponent(vars.zhcity),
                        city: vars.city,
                        // 接收人
                        acceptPId: vars.accptid,
                        // 接收人名称
                        acceptUname: encodeURIComponent(vars.acceptUname),
                        // 说明
                        description: encodeURIComponent(remark.val() || remark.attr('placeholder')),
                        // 红包金额
                        moneyquantity: parseFloat(moneyResult.text().replace('￥', '')).toFixed(2),
                        // 来源,例如新房帮、二手房电商工作台、新房电商云
                        origin: encodeURIComponent(vars.origin),
                        // 密码
                        password: passwordEncrypt,
                        // 发红包IM用户名
                        imSendUname: encodeURIComponent(vars.imSendUname),
                        // 收红包IM用户名
                        imAcceptUname: encodeURIComponent(vars.imAcceptUname),
                        acceptphone: vars.acceptPhone,
                        group: encodeURIComponent(vars.group),
                        // 发红包人的oaid
                        sendOAId: vars.sendOAId,
                        // 收红包人的oaid
                        acceptOAId: vars.acceptOAId
                    };
                    $.ajax({
                        type: 'post',
                        url: url,
                        data: data,
                        dataType: 'json',
                        success: function (mesPara) {
                            canClick = !0;
                            if (mesPara && mesPara.code === 'T') {
                                toastMsg('发送成功!');
                                balance.text(parseFloat(balance.text() - parseFloat(data.moneyquantity)).toFixed(2));
                            } else {
                                toastMsg(mesPara && mesPara.message || '发送失败!');
                            }
                            doSendContent.hide();
                            password.val('');
                        },
                        error: function () {
                            canClick = !0;
                            toastMsg('发送失败!');
                            doSendContent.hide();
                            password.val('');
                        }
                    });
                });
            }
        });
    };
});
