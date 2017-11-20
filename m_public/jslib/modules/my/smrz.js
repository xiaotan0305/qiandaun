define('modules/my/smrz', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var namestatus = false;
        var idnumberstatus = false;
        var idnumber2status = false;
        var verifyname = /^[a-zA-Z]{2,}|[\u4e00-\u9fa5]{2,}$/;
        // 验证姓名
        var verifyidnumber = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
        // 验证身份证号

        $('.hIcon').click(function () {
            $('.mm-more').toggle();
        });
        // 姓名
        $('#realname').focus(function () {
            $('#myform').css({
                'background-color': ''
            });
            $('#realnametext').removeClass('tip fc00').text('');
            $(this).attr('style', ' ');
        }).blur(function () {
            if (verifyname.test($('#realname').val()) === false) {
                // 如果姓名格式不正确
                $('#realnametext').addClass('tip fc00').text('姓名输入错误，请重新输入');
                $(this).attr('style', 'color:red;');
            }
        }).keyup(function () {
            if (verifyname.test($('#realname').val()) === false) {
                namestatus = false;
            } else {
                namestatus = true;
            }
        });
        // 验证身份证
        $('#idnumber').focus(function () {
            $('#myform').css({
                'background-color': ''
            });
            $('#idnumbertext').removeClass('tip fc00').text('');
            $(this).attr('style', ' ');
        }).blur(function () {
            if (verifyidnumber.test($('#idnumber').val()) === false || $('#idnumber').val().length !== 18) {
                $('#idnumbertext').addClass('tip fc00').text('身份证输入不合法，请重新输入');
                $(this).attr('style', 'color:red;');
            }
        }).keyup(function () {
            if (verifyidnumber.test($('#idnumber').val()) === false) {
                idnumberstatus = false;
            } else {
                idnumberstatus = true;
            }
        });
        // 验证两次输入是否一致
        $('#idnumber2').focus(function () {
            $('#myform').css({
                'background-color': ''
            });
            $('#idnumber2text').removeClass('tip fc00').text('');
            $(this).attr('style', ' ');
        }).blur(function () {
            if ($('#idnumber').val() !== $('#idnumber2').val()) {
                $('#idnumber2text').addClass('tip fc00').text('身份证号输入不一致');
                $(this).attr('style', 'color:red;');
            }
        }).keyup(function () {
            if (verifyidnumber.test($('#idnumber2').val()) === false) {
                idnumber2status = false;
            } else {
                idnumber2status = true;
            }
        });
        // 提交到后台进行实名验证
        function verifyIdCardInfo() {
            if ($('#realname').val() === '') {
                alert('姓名不能为空');
                return false;
            }
            if ($('#idnumber').val() === '' || $('#idnumber2').val() === '') {
                alert('身份证号不能为空');
                return false;
            }
            $('#myform').css({
                'background-color': '#ccc'
            });
            $('#myform').attr('disabled', 'true');
            // 点击后 不可点 防止重复提交
            var jsondata = {
                RealName: $('#realname').val(),
                IdCardNumber: $('#idnumber').val()
            };
            var ajaxUrl = '?c=my&a=verifyIdCardInfo&r=' + Math.random();
            $.get(ajaxUrl, jsondata,
                function (data) {
                    if (data !== '1') {
                        var json = JSON.parse(data);
                        var result = json.Content.Item.VerifyFlag;
                        var count = json.Content.Item.Counter;
                        // var message = decodeURIComponent(json.Message);
                        if (result === 'true') {
                            window.location.href = '?c=my&a=smrzSuc';
                        } else if (count >= 3) {
                            window.location.href = '?c=my&a=smrzFail&RealName=' + $('#realname').val() + '&IdCardNumber=' + $('#idnumber').val();
                        } else {
                            window.location.href = '?c=my&a=smrzFail1&RealName=' + $('#realname').val() + '&IdCardNumber=' + $('#idnumber').val() + '&count=' + count;
                        }
                    } else {
                        $('#myform').css({
                            'background-color': ''
                        });
                        alert('身份证输入不合法，请重新输入');
                    }
                });
        }
        $('#myform').on('click', function () {
            verifyIdCardInfo();
        });
    };
});