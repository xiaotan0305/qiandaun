/**
 * @file OA系统IM发送红包-群发红包
 * @author 袁辉辉(yuanhuihui@fang.com) gaoyinxu
 */
define('modules/my/sendQunRedBag', ['jquery', 'rsa/1.0.0/rsa'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 获取页面数据
        var vars = seajs.data.vars;
        // 用户是否开通我的钱
        var isUserCanEnter = vars.isUserCanEnter,
        // 传参是否正确
            vcode_state = vars.vcode_state,
        // 绑定事件对象
            send = $('#send'),
            remark = $('#remark'),
            doSendMask = $('#doSendMask'),
            doSendContent = $('#doSendContent'),
            toast = $('#toast'),
            toastTxt = $('#toastTxt'),
            closeDoSend = $('#closeDoSend'),
            moneyDisplay = $('#moneyDisplay'),
            moneyResult = $('#moneyResult'),
            see = $('#see'),
            money = $('#money'),
            count = $('#count'),
        // 手气红包按钮
            typesq = $('#typesq'),
        // 普通红包按钮
            typept = $('#typept'),
        // 红包类型转换，金额总金额和单个金额
            mtype = $('#mtype'),
        // 充值按钮
            depositUrl = $('#depositUrl'),
        // 确认发放按钮
            doSendBtn = $('#doSendBtn'),
            password = $('#password');
        // 红包金额正则正则
        var noNumPattern = /[^\d|.]+/g;
        // 红包金额正则正则
        var noCountPattern = /[^\d]+/g;
        // 钱、红包个数输入标识
        var countFlag = !1;
        var moneyFlag = !1;
        // 红包类型 手气:3;普通:2;
        var type = 3;
        // 塞钱进红包不可点击样式
        var unableCls = 'cur';
        // 金额校验
        var balance = $('#balance');
        // 金额限制
        // 最大最小金额限制范围，oa的是0.01-200
        var maxMoney = 200;
        var minMoney = 0.01;
        /**
         * 吐司信息
         * @param msg 展示文字
         */
        var toastMsg = function (msg, flagRb) {
            if (!msg) {
                return;
            }
            toastTxt.text(msg);
            toast.show();
            doSendMask.show();
            if (!flagRb) {
                setTimeout(function () {
                    toast.hide();
                    doSendMask.hide();
                }, 2000);
            }

        };

        /**
         * 执行验证
         * @param isShowMsg 是否提示信息
         * @param type 校验类型
         */
        function doVerify(isShowMsg, type) {
            var result = verify(type);
            // 校验成功则可点
            if (!moneyFlag || !countFlag) {
                send.addClass(unableCls);
            } else {
                send.removeClass(unableCls);
            }
            if (isShowMsg) {
                switch (result) {
                    case 'illegal':
                    case 'tooAccurate':
                        toastMsg('金额输入非法');
                        break;
                    case 'notEnough':
                        toastMsg('红包金额超出余额上限，请尽快充值');
                        break;
                    case 'tooLarge':
                        toastMsg('单个红包金额必须小于等于' + maxMoney + '元');
                        break;
                    case 'tooLittle':
                        toastMsg('单个红包金额必须大于等于' + minMoney + '元');
                        break;
                    case 'tooMany':
                        toastMsg('一次最多发100个红包');
                        break;
                    case 'tooFew':
                        toastMsg('红包个数要大于0！');
                        break;
                }
            }
            return result;
        }

        // 红包类型切换
        typesq.on('click', function () {
            typesq.hide();
            typept.show();
            type = 2;
            mtype.text('单个金额');
            if (money.val() && parseFloat(money.val()) > 0 && count.val() && parseFloat(count.val()) > 0) {
                // 平均红包额度
                var pjmoney = parseFloat(money.val() / count.val() || 0).toFixed(2);
                money.val(pjmoney);
                // 修改为普通红包后根据平均值重新计算总额
                var totalMoney = parseFloat((pjmoney * count.val()) || 0).toFixed(2);
                moneyDisplay.text('￥' + totalMoney);
                moneyResult.text(moneyDisplay.text());
            }
            // doVerify();
        });
        typept.on('click', function () {
            typesq.show();
            typept.hide();
            type = 3;
            mtype.text('总金额');
            if (money.val() && parseFloat(money.val()) > 0 && count.val() && parseFloat(count.val()) > 0) {
                // 转换成总金额
                var totalmoney = parseFloat(money.val() * count.val() || 0).toFixed(2);
                money.val(totalmoney);
                moneyDisplay.text('￥' + totalmoney);
                moneyResult.text('￥' + totalmoney);
            }
            // doVerify();
        });

        function clear() {
            money.val('');
            count.val('');
            remark.val('');
        }

        // 关闭页面清空数据
        $(window).on('unload beforeunload', function () {
            clear();
        });
        
        // 若为返回则清空
        if (window.performance && window.performance.navigation
            && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
            clear();
        }

        if (!parseInt(vcode_state)) {
            // 参数错误
            toastMsg('参数错误', 1);
            return;
        }

        // 发红包
        if (!parseInt(isUserCanEnter)) {
            toastMsg('对不起，您未开通我的钱账户');
            return;
        }

        // 密码可见性
        depositUrl.on('click', function () {
            window.location = depositUrl.attr('data-href') + '&r=' + Math.random();
        });

        // 密码可见性
        see.on('click', function () {
            var passType = password.attr('type');
            if (passType !== 'text') {
                password.attr('type', 'text');
                this.className = '';
            } else {
                password.attr('type', 'password');
                this.className = unableCls;
            }
        });


        /**
         * 校验
         * @param isMoney 是否校验金额
         * @returns {*}
         */
        function verify(verifyType) {
            var flag = '';
            if (verifyType === 'money' || verifyType === 'all') {
                var val = parseFloat(moneyDisplay.text().replace('￥', '')), balanceMon = parseFloat(balance.text());
                // 数字
                if (isNaN(val)) {
                    moneyFlag = !1;
                    return 'illegal';
                } else {
                    if ((val + '').indexOf('.') > -1) {
                        // 两位小数
                        var afterDot = (val + '').split('.')[1];
                        flag = afterDot.length > 2 ? 'tooAccurate' : '';
                    }
                    if (flag) {
                        moneyFlag = !1;
                        return flag;
                    }
                    // 小于总额
                    if (val > balanceMon) {
                        moneyFlag = !1;
                        return 'notEnough';
                    }
                    // 普通红包: 单个红包需要相除,若红包个数为0则
                    if (type === 3) {
                        if (parseFloat(count.val()) > 0 && parseFloat(money.val() / count.val() || 0) > maxMoney) {
                            moneyFlag = !1;
                            return 'tooLarge';
                        } else if (parseFloat(count.val()) > 0 && parseFloat(money.val() / count.val() || 0) < minMoney) {
                            moneyFlag = !1;
                            return 'tooLittle';
                        }
                    } else if (type === 2) {
                        // 手气红包: 输入即为总额
                        if (parseFloat(money.val() || 0) > maxMoney) {
                            return 'tooLarge';
                        } else if (parseFloat(money.val() || 0) < minMoney) {
                            return 'tooLittle';
                        }
                    }
                    moneyFlag = !0;
                }
            }
            if (verifyType === 'count' || verifyType === 'all') {
                if (count.val() && parseFloat(count.val()) > 100) {
                    countFlag = !1;
                    return 'tooMany';
                } else if (parseFloat(count.val()) <= 0) {
                    countFlag = !1;
                    return 'tooFew';
                }
                countFlag = !0;
            } else {
                var remarkTxt = remark.val().trim();
                flag = remarkTxt.length < 31;
                remark.val(remarkTxt.substr(0, 30));
            }
            return flag;
        }

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
            if (send.hasClass(unableCls)) {
                return;
            }
            // 校验
            if (!doVerify(!0, 'all')) {
                doSendMask.show();
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
            if (isNaN(val)) {
                valFloat = 0;
            }
            // 手气红包输入为总额
            if (type === 3) {
                moneyResult.text('￥' + parseFloat(valFloat || 0).toFixed(2));
                moneyDisplay.text(moneyResult.text());
                doVerify(!1, 'money');
            } else if (type === 2) {
                // 普通红包
                if (count.val() && parseFloat(count.val()) > 0) {
                    moneyResult.text('￥' + parseFloat((valFloat * parseFloat(count.val())) || 0).toFixed(2));
                    moneyDisplay.text(moneyResult.text());
                    doVerify(!1, 'money');
                }
            }
        });
        // 验证红包数量有效性
        count.off('input').on('input', function () {
            // 若有不符合规则的输入再替换
            var couVal = count.val();
            if (noCountPattern.test(couVal)) {
                count.val(couVal.replace(noCountPattern, ''));
            }
            // 校验数量
            doVerify(!1, 'count');
            var valFloat = parseFloat(money.val() || 0).toFixed(2);
            if (isNaN(money.val())) {
                valFloat = 0;
            }
            if (valFloat && valFloat > 0) {
                // 手气红包输入为总额
                if (type === 3) {
                    moneyResult.text('￥' + parseFloat(valFloat || 0).toFixed(2));
                } else if (type === 2) {
                    // 普通红包需要计算总额
                    moneyResult.text('￥' + parseFloat((valFloat * count.val()) || 0).toFixed(2));
                }
                moneyDisplay.text(moneyResult.text());
                // 校验总额
                doVerify(!1, 'money');
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
                    var url = vars.mySite + '?c=my&a=ajaxQunAwardBonus';
                    var data = {
                        // 商品编号
                        bizId: vars.biz_id,
                        // 城市
                        zhcity: encodeURIComponent(vars.zhcity),
                        city: vars.city,
                        // 说明
                        description: encodeURIComponent(remark.val() || remark.attr('placeholder')),
                        // 红包金额
                        moneyquantity: parseFloat(moneyResult.text().replace('￥', '')),
                        // 红包数量
                        count: count.val(),
                        // 红包类型
                        type: type,
                        // 来源,例如新房帮、二手房电商工作台、新房电商云
                        origin: encodeURIComponent(vars.origin),
                        // 密码
                        password: passwordEncrypt,
                        // 发红包IM用户名
                        imSendUname: encodeURIComponent(vars.imSendUname),
                        group: encodeURIComponent(vars.group),
                        // 发红包人的oaid
                        sendOAId: vars.sendOAId,
                        // 发红包所在群id
                        groupid: vars.groupid,
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
