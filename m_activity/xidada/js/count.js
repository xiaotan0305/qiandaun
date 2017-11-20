/**
 * Created with webstorm.
 * User: tkp19
 * Date: 2016/2/2 0002
 * Time: 16:47
 */
$(function () {
    'use strict';
    // 获取隐藏域数据
    var vars = {};
    $('input[type=hidden]').each(function (index, element) {
        vars[element.id] = element.value;
    });

    // 信息弹层
    var msg = $('#msg'),
        msgP = msg.find('p'),
        timer = null;

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    function showMsg(text, time, callback) {
        text = text || '信息有误！';
        time = time || 1500;
        msgP.html(text);
        msg.fadeIn();
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.fadeOut();
            callback && callback();
        }, time);
    }

    // 登录
    var getFavorable = $('#getFavorable'),
        login = $('#login');
    getFavorable.on('click', function () {
        if (vars.logined) {
            getMony();
        }else {
            login.show();
        }
    });

    // 取消登录
    var cancel = $('#cancel');
    cancel.on('click', function () {
        login.hide();
    });

    /**
     * 数字补全
     * @param num 数字
     * @returns {string} 两位数字
     */
    function toDou(num) {
        return num < 10 ? '0' + num : num;
    }


    // 获取验证码
    var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i,
        codeReg = /^\d{4}$/;
    var getPhoneVerifyCode = window.getPhoneVerifyCode;
    var getCode = $('#getCode'),
        phone = $('#phone'),
        codeTime = $('#codeTime'),
        againCode = $('#againCode');

    // 设置获取验证码开关
    var allowGet = true;
    var timeCount = 60;

    /**
     * 更新倒计时
     */
    var timer2 = null;
    function updateTime() {
        allowGet = false;
        codeTime.val('重新发送(' + toDou(timeCount) + ')').addClass('getingCode');
        clearInterval(timer2);
        timer2 = setInterval(function () {
            timeCount--;
            codeTime.val('重新发送(' + toDou(timeCount) + ')');
            if (timeCount < 0) {
                clearInterval(timer2);
                codeTime.hide();
                getCode.hide();
                againCode.show();
                timeCount = 60;
                allowGet = true;
            }
        }, 1000);
    }

    var win = $(window),
        winH = win.height(),
        fotter = $('.fotter2');
    // 解决bug(输入法盖住输入框、弹出输入法后footer向上跑)
    win.on('resize',function () {
        if (win.height() < winH) {
            fotter.hide();
        }else {
            fotter.show();
        }
    });
    fotter.on('click',function () {
        if (vars.logined) {
            getMony();
        }else {
            login.show();
        }
    });
    $('.tz-box').css({
        position: 'absolute',
        height: winH
    });

    // 获取验证码事件
    $('#getCode,#againCode').on('click', function () {
        if (allowGet) {
            var phonestr = phone.val().trim();
            if (!phonestr) {
                showMsg('请输入手机号');
                return;
            }
            if (!phoneReg.test(phonestr)) {
                showMsg('手机号错误,请重新输入');
                return;
            }
            getCode.hide();
            againCode.hide();
            codeTime.val('60S后获取').show();
            // 调用获取验证码插件
            getPhoneVerifyCode(phonestr, function () {
                showMsg('验证码发送成功，请注意查收');
                updateTime();
            }, function (msg) {
                showMsg(msg);
                againCode.hide();
                codeTime.hide();
                getCode.show();
            });
        }
    });

    // 提交
    var submit = $('#qd'),
        code = $('#code');
    var sendVerifyCodeAnswer = window.sendVerifyCodeAnswer;

    var getSuccess = $('#getSuccess'),
        searchbtnb = getSuccess.find('.searchbtnb'),
        tzTit = getSuccess.find('.tz-tit');
    // 验证码清空
    code.focus(function () {
        $(this).val('');
    });

    /**
     * 获取优惠券
     */
    function getMony() {
        $.ajax({
            url: vars.mainSite + '/huodongAC.d',
            type: 'GET',
            data: {
                class: 'XiDaDaHc',
                m: 'adoptCoupon',
                phone: vars.logined
            },
            dataType: 'json',
            success: function (data) {
                var state = data.root.state;
                if (state === 'success') {
                    login.hide();
                    tzTit.html('恭喜您领取了99元租房优惠券！');
                    getSuccess.show();
                } else if (state === 'got') {
                    login.hide();
                    tzTit.html('您已经领取过了，快去看看吧！');
                    getSuccess.show();
                } else if (state === 'fail') {
                    showMsg('获取失败，请重试');
                }
            },
            error: function () {
                showMsg('发送请求失败');
            }
        });
    }

    submit.on('click', function (ev) {
        ev.stopPropagation();
        var phonestr = phone.val().trim();
        var codestr = code.val().trim();
        if (!phonestr) {
            showMsg('请输入手机号');
            return;
        }
        if (!phoneReg.test(phonestr)) {
            showMsg('手机号错误,请确认手机号是否输入正确!');
            return;
        }
        if (!codestr) {
            showMsg('请输入验证码');
            return;
        }
        if (!codeReg.test(codestr)) {
            showMsg('验证码错误,请确认验证码是否正确！');
            return;
        }
        vars.logined = phonestr;
        $('#logined').val(phonestr);
        sendVerifyCodeAnswer(phonestr, codestr, function () {
            getMony();
        }, function (msg) {
            showMsg(msg);
        });
    });

    searchbtnb.on('click',function () {
        getSuccess.hide();
        phone.val('');
        code.val('');
        location.href = vars.mainSite + '/my/?c=mycenter&a=index';
    });
});