define('modules/kanfangtuan/signIn', ['jquery', 'housegroup/housegroup'], function (require, exports, module) {
    'use strict';
    module.exports = function init() {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var lineID = $('#lineID').val();
        var kftUrl = vars.kanfangtuanSite;

        // 看房团
        var houseGroup = require('housegroup/housegroup');
        var options = {
            // 输入手机号
            kftphone: $('#phone'),
            // 获取验证码
            kftcode: $('#sendcode'),
            // 填写验证码
            kftcodewrite: $('#code'),
            // 提交
            signsubmit: $('#signin')
        };
        var houseGroupObj = new houseGroup(options,showfn);
        // 验证码发送
        function codefn(phone) {
            $.post(codeUrl,
                {
                    phone: phone,
                    start: startint
                },
                function (data) {
                    var json = $.parseJSON(data);
                    var message = decodeURIComponent(json.error_reason);
                    if (json.return_result !== '100') {
                        alert(message);
                    }
                }
            );
        }

        // 报名提交
        function showfn(data) {
            var username = $('#username').val();
            var peoplecount = $('#peoplecount').val();
            var phone = $('#phone').val();
            var code = $('#code').val();
            var jsondata = {
                phone: phone,
                code: code,
                LineID: lineID
            };
            var ajaxUrl = kftUrl + '?c=kanfangtuan&a=ajaxSignIn&r=' + Math.random();

            $.get(ajaxUrl, jsondata,
                function (data) {
                    var json = $.parseJSON(data);
                    var result = json.Result;
                    var key = json.key;
                    var message = decodeURIComponent(json.Message);
                    // 报名成功 已报过该看房团
                    if (result === '100') {
                        window.location.href = kftUrl + '?c=kanfangtuan&a=signIn&LineID=' + lineID + '&key=' + key;
                    } else {
                        if (result === '104' || result === '105' || result === '106' || result === '108') {
                            $('#message').text(message);
                        } else {
                            $('#message').text('签到失败，请重新获取验证码');
                        }
                        if (result == '108') {
                            $('#signin').attr({value:'请先报名该看房团'});
                        }
                        $('#signin').attr({disabled:'disabled'});
                        $('#signin').css('background','#b3b6be');
                        setTimeout(function () {
                            $('#message').text(' ');
                        }, 3000);
                    }
                }
            );
        }
    };
});
