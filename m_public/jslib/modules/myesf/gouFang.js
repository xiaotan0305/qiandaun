/**
 * 购房意向类(购房意向页面)
 */
define('modules/myesf/gouFang', ['jquery','verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var verifycode = require('verifycode/1.0.0/verifycode');
        var sendCode = $('#sendcode');
        var district = $('#district');
        var comarea = $('#comarea');
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // ajax获得商圈
        function ajaxGetComarea(district) {
            $.ajax({
                url: '?c=myesf&a=ajaxGetComarea&district=' + district + '&city=' + vars.city + '&r=' + Math.random(),
                success: function (moredata) {
                    if (moredata !== '') {
                        var obj = $.parseJSON(moredata);
                        var l = obj.length;
                        comarea.empty();
                        for (var i = 0; i < l; i++) {
                            var opEl = $('<option value=' + obj[i].name + '>' + obj[i].name + '</option>');
                            comarea.append(opEl);
                        }
                        if (vars.comarea.length > 0) {
                            comarea.find('option[value=' + vars.comarea + ']').attr('selected', 'selected');
                        }
                    }
                }
            });
        }
        if (vars.hasOwnProperty('flag') && vars.flag) {
            if (vars.district.length > 0) {
                district.find('option[value=' + vars.district + ']').attr('selected', 'selected');
            }

            if (vars.room.length > 0) {
                $('#room').find('option[value=' + vars.room + ']').attr('selected', 'selected');
            }
            if (vars.area.length > 0) {
                $('#area').find('option[value=' + vars.area + ']').attr('selected', 'selected');
            }
            if (vars.price.length > 0) {
                $('#price').find('option[value=' + vars.price + ']').attr('selected', 'selected');
            }
            if (vars.hasOwnProperty('district') && vars.district.length > 0) {
                ajaxGetComarea(vars.district);
            }
        }
        district.on('change', function () {
            comarea.show();
            var district = $(this).find('option:selected').val();
            if (district === '\u4e0d\u9650' || district === '\u8bf7\u9009\u62e9\u533a\u57df') {
                comarea.hide();
            }
            ajaxGetComarea(district);
        });
        // 更换手机号 发送验证码
        var phone = '';
        var timeCount = 60;
        var partten = /^1[3,4,5,7,8]\d{9}$/;
        var patterncode = /^\d{6}$/;
        // 增加标志位.待计时器结束时才能继续发送获取验证码的ajax(zhangcongfeng@fang.com)
        var countdownFlag = true;
        function updateTime() {
            sendCode.val('\u91cd\u65b0\u53d1\u9001' + '(' + timeCount + ')');
            timeCount--;
            if (timeCount >= -1) {
                countdownFlag = false;
                setTimeout(function () {
                    updateTime();
                }, 1000);
            } else {
                countdownFlag = true;
                sendCode.val('\u91cd\u65b0\u83b7\u53d6').attr('disabled', false);
                timeCount = 60;
            }
        }

        // 提交我的购房意向
        $('#submit').on('click', function () {
            var district = $('#district').val();
            var comarea = $('#comarea').val();
            var room = $('#room').val();
            var area = $('#area').val();
            var price = $('#price').val();
            // @update chengli 二手房线下活动，备注活动参数
            var utmSource = $('#utm_source').val();
            // @update chengli 二手房推广活动，备注活动参数
            var utmTerm = $('#utm_term').val();
            if (district === '\u8bf7\u9009\u62e9\u533a\u57df') {
                alert('\u8bf7\u9009\u62e9\u533a\u57df');
                return;
            }
            if (room === '\u8bf7\u9009\u62e9\u6237\u578b') {
                alert('\u8bf7\u9009\u62e9\u6237\u578b');
                return;
            }
            if (area === '\u8bf7\u9009\u62e9\u9762\u79ef\u6bb5') {
                alert('\u8bf7\u9009\u62e9\u9762\u79ef\u6bb5');
                return;
            }
            if (price === '\u8bf7\u9009\u62e9\u4ef7\u683c\u6bb5') {
                alert('\u8bf7\u9009\u62e9\u4ef7\u683c\u6bb5');
                return;
            }
            if (!vars.userid.length) {
                phone = $('#phone').val();
                if (phone === '') {
                    alert('\u8bf7\u8f93\u5165\u624b\u673a\u53f7\u7801\uff01');
                    return;
                }
                if (!partten.test(phone)) {
                    alert('\u624b\u673a\u53f7\u7801\u683c\u5f0f\u9519\u8bef\uff01');
                    return;
                }
            }
            var lurl = '?c=myesf&a=delegateHouseRecommend&district=' + district + '&comarea=' + comarea + '&room='
                + room + '&area=' + area + '&price=' + price + '&city=' + vars.city;
            if (utmSource) {
                lurl += '&utm_source=' + utmSource;
            }
            if (utmTerm) {
                lurl += '&utm_term=' + utmTerm;
            }
            if (phone !== '') {
                var code = $('#code').val();
                if (phone === '') {
                    alert('\u8bf7\u586b\u5199\u9a8c\u8bc1\u7801');
                    return;
                } else if (!patterncode.test(code)) {
                    alert('\u9a8c\u8bc1\u7801\u586b\u5199\u9519\u8bef');
                    return;
                }
                // 验证验证码的正确性
                verifycode.sendVerifyCodeAnswer(phone, code,
                    function () {
                        // console.log('验证码正确');
                        window.location.href = lurl;
                    },
                    function () {
                        // console.log('验证码错误');
                        alert('验证码错误，请重新输入');
                    });
            } else {
                window.location.href = lurl;
            }
        });

        sendCode.on('click', function () {
            phone = $('#phone').val();
            if (phone === '') {
                alert('\u8bf7\u8f93\u5165\u624b\u673a\u53f7\u7801\uff01');
                return;
            }
            countdownFlag && verifycode.getPhoneVerifyCode(phone,
                function () {
                    // console.log('发送成功');
                    updateTime();
                }, function () {
                    // console.log('发送失败');
            });
        });
    };
});