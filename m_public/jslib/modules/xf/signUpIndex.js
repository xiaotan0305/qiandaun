/**
 * 活动报名页
 * by fcWang (wangfengchao@fang.com)
 */
define('modules/xf/signUpIndex', ['jquery', 'util/util', 'yanzhengma/1.0.0/yanzhengma'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');
    var loginphone = vars.loginphone;
    var newcode = vars.newcode;
    var url = vars.mainSite;
    var city = vars.city;
    var isvalid = '';
	var name;

    // 如果已经登录并且注册了手机号
    if (sfut && loginphone) {
        isvalid = '1';
    }

    // 信息提示方法
    var hideMessage;
    var showMessage = function (message) {
        $('.red-f6').html(message).removeClass('none');
        clearTimeout(hideMessage);
        hideMessage = setTimeout(function () {
            $('.red-f6').addClass('none');
        }, 5000);
    };

    // input输入后隐藏提示框
    $('#name, #phonenum, #check').on('input', function () {
        $('.red-f6').addClass('none');
    });

    // 限制限制名字10个字符
    $('#name').on('input change', function () {
        if ($(this).val().length > 10) {
            // 取前11位
            $(this).val($(this).val().substr(0, 10));
        }
    });

    // 调用验证码模块
    var yanzhengma = require('yanzhengma/1.0.0/yanzhengma');
    new yanzhengma({
        // 如果已登录且绑定手机号，值为'1'；否则值为空
        isvalid: isvalid,
        // 如果已登录且绑定手机号，值为手机号
        loginInPhone: loginphone,
        // 手机号输入框（切图type为num）
        phoneInput: $('#phonenum'),
        // 验证码输入框（切图type为num）
        codeInput: $('#check'),
        // 发送验证码按钮
        sendCodeBtn: $('#send'),
        // 提交按钮
        submitBtn: $('#submit'),
        // 登录后修改手机号时需要显示或隐藏的元素(可多个)
        showOrHide: $('#check, #sendli'),
        // 发送验证码按钮变为可点状态的样式（需自定义，可设置css样式，也可addClass,也可不填）
        sendCodeBtnActive: function () {
            $('#send').css({color: '#ff6666'});
        },
        // 发送验证码按钮变为不可点状态的样式（需自定义，可设置css样式，也可addClass，也可不填）
        sendCodeBtnUnActive: function () {
            $('#send').css({color: '#565c67'});
        },
        // 其他自定义的检测项目(请自定义，如果没有，请return true;)
        checkOthers: function () {
            if ($('#name').val().replace(/\s+/g,'')) {
                name = encodeURIComponent(encodeURIComponent($('#name').val()));
                return true;
            }
            showMessage('请填写姓名');
            return false;
        },
        // 执行请求(请自定义)
        postJsonData: function () {
            $.get('/xf.d?m=activitySignUp&Newcode=' + newcode + '&ID=' + vars.id + '&PhoneNum=' + $('#phonenum').val() + '&Name=' + name
                + '&TaskName=' + '' + '&City=' + city, function (data) {
                if (data) {
                    if (data.root.result == '200' && data.root.code == '1') {
                        $.get('/xf.d?m=messageSignUp&Newcode=' + newcode + '&ID=' + vars.id + '&PhoneNum=' + $('#phonenum').val() + '&Name=' + name
                            + '&City=' + city, function () {
                        });
                        window.location.href = '/xf.d?m=signUpIndex&newcode=' + newcode + '&city=' + city + '&signUpSucess=1';
                    } else {
                        alert('报名失败，请刷新后再试');
                    }
                } else {
                    console.log('无返回值');
                }
            });
        },
        // 信息提示方法（可选，默认为alert 参数为提示内容）
        showMessage: function (message) {
            showMessage(message);
        },

        // 手机号为空时的提示（可选）
        noPhoneTip: '手机号不能为空，请输入手机号',
        // 手机号格式错误时的提示（可选）
        wrongPhoneTip: '手机号格式不正确，请重新输入',
        // 验证码为空时的提示（可选）
        noCodeTip: '验证码不能为空，请输入验证码',
        // 验证码格式错误时的提示（可选）
        nonstandardCodeTip: '验证码格式不正确，请重新输入',
        // 验证码与手机号不匹配时的提示（可选）
        wrongCodeTip: '验证码错误，请重新输入',
        // 倒计时样式（可为空,唯一参数值为's'）
        countdown: 's'
    });

    // 报名成功后的跳转页
    $('#iknow').on('click', function () {
        window.location.href = url + 'xf/' + city + '/' + newcode + '.htm';
    });
});
