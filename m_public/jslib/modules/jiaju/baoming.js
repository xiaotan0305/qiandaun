/**
 * Created by Young on 15-10-20.
 */
define('modules/jiaju/baoming',['jquery'],
    function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // var util = require('util');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        var timeCount = 30;
        var sendcode = $('#sendcode');
        var $code = $('#code');
        function updateTime() {
            sendcode.val('重新发送(' + timeCount + ')');
            timeCount--;
            if (timeCount >= -1) {
                setTimeout(updateTime, 1000);
            } else {
                sendcode.val('重新获取');
                sendcode.addClass('wap-btn01');
                sendcode.attr('disabled',false);
                timeCount = 30;
            }
        }
        $code.focus(function () {
            $code.attr('style',' ');
            $('#codetxt').text('');
        });
        $code.blur(function () {
            var code = $code.val();
            if (code.length !== 6) {
                $code.attr('style','color:red;');
                $('#codetxt').text('请输入正确的验证码');
                return false;
            }
        });

        function getphonecode() {
            var startint = vars.startint;
            var partten = /^1[3,4,5,7,8]\d{9}$/;
            var mobilephone = vars.phone;
            if (mobilephone === '' || partten.test(mobilephone) === false) {
                $('#phonetxt').text('手机号错误');
                return;
            }
            var codeUrl = vars.jiajuSite + '?c=jiaju&a=getbaomingCode&random=' + Math.random();
            $.get(codeUrl,
                {
                    phone: mobilephone,
                    start: startint
                },
                function (data) {
                    var json = JSON.parse(data);
                    var message = decodeURIComponent(json.error_reason);
                    if (json.return_result !== '100') {
                        alert(message);
                        return false;
                    }
                    sendcode.val('重新发送(30)');
                    sendcode.attr('disabled',true);
                    timeCount--;
                    setTimeout(updateTime, 1000);
                });
        }

        function signup() {
            var phone = vars.phone;
            var code = $code.val();

            var ajaxUrl = vars.jiajuSite + '?c=jiaju&a=ajaxbaoming&r=' + Math.random();
            $.get(ajaxUrl,{
                phone: phone,
                code: code
            },
            function (data) {
                var resultData = JSON.parse(data);
                if (resultData === true) {
                    window.location.href = vars.jiajuSite + '?c=jiaju&a=baomingSuc&city=' + vars.city;
                } else {
                    $('#codetxt').text('验证码不正确');
                }
            });
        }
        sendcode.on('click',function () {
            getphonecode();
        });
        $('#submit').on('click',function () {
            signup();
        });
    };
});