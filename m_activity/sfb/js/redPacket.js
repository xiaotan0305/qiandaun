/**
 * Created with webstorm.
 * User: tkp19
 * Date: 2016/03/01
 * Time: 16:47
 */
$(function () {
    'use strict';
    var vars = {};

    function RedPacket() {
        // 公共信息弹层
        this.msgBox = {
            msg: $('#msg'),
            msgP: $('#msg').find('p'),
            timer: null
        };
        // 屏幕高度
        this.winH = $(window).height();
        // 两位小数正则
        this.regG = /^\d+(\.\d{0,2})?$/;
        this.reg = /\d+(\.\d{0,2})?/g;
        // 允许发送红包
        this.allow = false;

        // 初始化
        this.init();
    }

    RedPacket.prototype = {
        constructor: RedPacket,

        init: function () {
            var that = this;

            /**
             * 获取隐藏域数据
             */
            $('input[type=hidden]').each(function (index, element) {
                vars[element.id] = element.value;
            });

            //  红包余额 type:number
            var balanceEle = $('#balance'),
                radArr = balanceEle.html().match(that.reg);
            var balance = radArr ? parseFloat(radArr[0]) : 0;

            /**
             * 金额输入
             */
            var money = $('#money'),
                moneyText = $('#moneyText');
            // 按钮
            var send = $('#send');
            money.on('input', function () {
                var me = $(this),
                    text = me.val(),
                    num = parseFloat(text);
                // 过滤两位小数
                if (!that.regG.test(text)) {
                    num = text.match(that.reg) ? parseFloat(text.match(that.reg)[0]) : '';
                    me.val(num);
                }
                // 判断是否大于余额
                if (num <= balance && num > 0) {
                    me.css('color', '#000');
                    moneyText.css('color', '#000');
                    if (send.hasClass('off')) {
                        send.removeClass('off');
                    }
                    // 允许发送红包
                    that.allow = true;
                } else {
                    if (num) {
                        me.css('color', 'red');
                        moneyText.css('color', 'red');
                    }
                    // 按钮置灰
                    if (!send.hasClass('off')) {
                        send.addClass('off');
                    }
                    that.allow = false;
                }
                moneyText.html('￥ ' + (num ? num.toFixed(2) : '0.00'));
            }).blur(function () {
                var me = $(this),
                    text = me.val(),
                    num = parseFloat(text);
                if (!num) {
                    me.val('');
                    moneyText.html('￥ 0.00').css('color', '#000');
                }else {
                    me.val(num.toFixed(2));
                }
            });

            /**
             * 短信提醒开关
             */
            var msalert = $('#msalert');
            msalert.on('click', function () {
                var me = $(this);
                me.toggleClass('massagealertimgopen');
            });

            /**
             * 解决弹层覆盖问题
             */
            var message = $('#message'),
                html = $('html'),
                win = $(window),
                winH = win.height();
            message.focus(function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                if (window.navigator.userAgent.toLowerCase().indexOf('android') !== -1) {
                    html.css({
                        transform: 'translateY(-150px)',
                        transition: '.1s all linear'
                    });
                }
            }).blur(function () {
                html.css({
                    transform: '',
                    transition: '.1s all linear'
                });
            });

            $(document.body).on('touchend',function () {
                message.blur();
            });
            // 解决bug(输入法盖住输入框、弹出输入法后footer向上跑)
            win.on('resize',function () {
                if (win.height() >= winH) {
                    message.blur();
                }
            });

            /**
             * 提交
             */
            send.on('click', function () {
                var num = parseFloat(money.val()),
                    // text = $('#textHeader').html() + message.val(),
                    text = $('#textHeader').html() + message.val(),
                    SMS = null,
                    phone = $('#phone input:checked').val();
                // 是否允许发送短信提醒
                if (msalert.hasClass('massagealertimgopen')) {
                    SMS = true;
                }else {
                    SMS = false;
                }
                if (num > balance) {
                    that.showMsg('红包金额不能大于余额');
                    that.allow = false;
                }
                // 发送请求
                if (that.allow) {
                    that.allow = false;
                    that.sendRed(phone,num,text,SMS);
                }
            });
        },

        /**
         * 信息弹层
         * @param text 文本内容
         * @param time 显示时间
         * @param callback 回调函数
         */
        showMsg: function (text, time, callback) {
            var that = this;
            text = text || '信息有误！';
            time = time || 1500;
            that.msgBox.msgP.html(text);
            that.msgBox.msg.fadeIn().css({
                position: 'absolute',
                top: $(document).scrollTop() + that.winH / 2
            });
            clearTimeout(that.msgBox.timer);
            that.msgBox.timer = setTimeout(function () {
                that.msgBox.msg.fadeOut();
                callback && callback();
            }, time);
        },

        /**
         * 发送红包
         * @param phone 电话号码
         * @param money 红包金额
         * @param text 短信文本
         * @param SMS 是否发送发送短信 {boolean}
         * @returns {boolean}
         */
        sendRed: function (phone,money, text, SMS) {
            var that = this;
            text = text || '';
            var len = text.length;
            if (!money) {
                that.showMsg('请核对红包金额');
                return false;
            }
            if (len > 100) {
                that.showMsg('短信内容不能大于100字');
                return false;
            }
            if (confirm('是否确定发送')) {
                that.allow = false;
                $.ajax({
                    url: '/huodongAC.d?m=getFahongbaoResult&class=FaHongbaoHc',
                    type: 'POST',
                    data: {
                        city: encodeURIComponent(vars.city),
                        agentId: vars.agentId,
                        purposeId: vars.purposeId,
                        phone: phone,
                        money: money,
                        sendMobileMsg: encodeURIComponent(text),
                        remark: SMS
                    },
                    success: function (data) {
                        data = JSON.parse(data);
                        // 允许再次发送
                        that.allow = true;
                        if (data.result === '1') {
                            that.showMsg('发送成功',1500,function () {
                                location.reload();
                            });
                        }else {
                            that.showMsg('发送失败,请重新发送');
                        }
                    },
                    error: function () {
                        that.showMsg('网络错误');
                        // 允许再次发送
                        that.allow = true;
                    }
                });
            }else {
                // 允许再次发送
                that.allow = true;
            }
        }
    };
    return new RedPacket();
});