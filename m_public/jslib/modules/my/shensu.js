define('modules/my/shensu', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('id')] = element.value;
        });
        var city = vars.city;
        var name = vars.name;
        var cardnumber = vars.cardnumber;
        var imgUrl = vars.mySite;
        $(function () {
            function clickFunc() {
                $(this).attr('disabled', true);
                var wait = 60;
                $('#verifyCodeSend').val(wait + '秒后重发');
                

                function timer() {
                    if (wait > 0) {
                        setTimeout(function () {
                            wait--;
                            $('#verifyCodeSend').val(wait + '秒后重发');
                            timer();
                        }, 1000);
                    } else {
                        $('#verifyCodeSend').removeAttr('disabled');
                        $('#verifyCodeSend').val('获取验证码');
                    }
                }
                timer();
                $.ajax({
                    // 后台获取当前登录用户手机号，不用传参
                    type: 'get',
                    url: '/my/?a=ajaxVerifyCodeSend',
                    success: function (res) {
                        if (!res) {
                            alert('验证码发送失败，请稍后再试');
                        }
                    },
                    error: function () {
                        alert('验证码发送失败，请稍后再试');
                    }

                });
            }
            $('#verifyCodeSend').click(clickFunc);
            $('#verifyCode').focus(function () {
                $('.tips').hide();
            });

            $('.formbtn02').click(function () {
                $(this).css({
                    'background-color': '#ccc'
                });
                $(this).attr('disabled', 'true');
                // 点击后 不可点 防止重复提交
                var verifyCode = $('#verifyCode').val();
                var fpic = $('#fpic').children('img').attr('src');
                var bpic = $('#bpic').children('img').attr('src');
                if (fpic === imgUrl + 'img/images/pic_default.gif') {
                    alert('请上传身份证正面照片');
                    return false;
                }
                if (bpic === imgUrl + 'img/images/pic_default.gif') {
                    alert('请上传身份证反面照片');
                    return false;
                }

                if (verifyCode === '') {
                    alert('请输入验证码');
                    return false;
                }
                $.ajax({
                    type: 'get',
                    url: '?c=my&a=shenSuConfirm',
                    data: {
                        realname: name,
                        cardnumber: cardnumber,
                        verifyCode: verifyCode,
                        fpic: fpic,
                        bpic: bpic
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.result === '002') {
                            $('.tips').show();
                            return false;
                        }
                        if (data.Content === 'true' || data.Content === 'True') {
                            window.location.href = '?c=my&a=shenSuSuccess&city=' + city;
                        } else {
                            alert(data.Message);
                        }
                    }
                });
            });
            function verifyCode() {
                $('.formbtn02').css({
                    'background-color': '#df3031'
                }).removeAttr('disabled');
            }
            $('#verifyCode').focus(function () {
                verifyCode();
            });

            $('.id-pic').click(function () {
                verifyCode();
            });
        });

        document.domain = 'fang.com';

        var jwupload = jWingUpload({
            form: document.getElementsByTagName('form')[0],
            uploadPic: $('.uploadPic'),
            preview: document.getElementById('bbsAddPic'),
            iFrame: document.getElementsByTagName('iframe')[0],
            imgPath: vars.mainSite + 'my/img/'
        });
    };
});