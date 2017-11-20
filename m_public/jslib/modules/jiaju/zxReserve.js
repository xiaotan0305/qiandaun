/**
 * 单量更改于2015-9-9
 */
define('modules/jiaju/zxReserve',['jquery', 'verifycode/1.0.0/verifycode', 'footprint/1.0.0/footprint'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var verifycode = require('verifycode/1.0.0/verifycode');
        // 20150303
        var Footprint = require('footprint/1.0.0/footprint.js') ;

        var patternname = /^[a-zA-Z0-9]{1,20}$|^[\u4e00-\u9fa5]{1,10}$/;
        var patterntel = /^1[3,4,5,7,8]\d{9}$/;
        var patterncode = /^\d{4}$/;
        var areaname = /^[a-zA-Z]{2,}|[\u4e00-\u9fa5]{2,20}$/;
        var intNUM = /^\d{1,}$/;
        var tnow = 30;

        var autoLi = $('#auto_li');
        var changeNum = $('#changeNum');
        var yan = $('#yan');
        var phone = $('#phone');
        var uname = $('#uname');
        var ename = $('#ename');
        var zxReserve = $('#addMore');
        var addMoreA = zxReserve.find('a');
        var more = $('#More');
        var nameText = $('#nametext');
        var eText = $('#etext');
        var autoDiv = $('#auto_div');
        var vCode = $('#vcode');
        var codeText = $('#codetext');
        var phoneText = $('#phonetext');
        var content = $('#Content');
        var area = $('#area');
        var areaText = $('#areatext');
        var price = $('#price');
        var priceText = $('#pricetext');
        var email = $('#email');
        var emailText = $('#emailtext');
        var sendCode = $('#sendcode');
        var cityNameSel = $('#cityname').find('option:selected');

        Footprint.push('我要装修', vars.siteUrl + vars.city + '/wyzx.html', vars.city);
        autoLi.css('top', '0px');
        changeNum.on('click', function () {
            yan.show();
            phone.val('');
        });
        $('.hLeft').on('click', function () {
            var c = uname.val() || '';
            var b = phone.val() || '';
            var a = ename.val() || '';
            if (c !== '' || b !== '' || a !== '') {
                if (confirm('是否放弃发布？')) {
                    window.history.go(-1);
                }
            } else {
                window.history.go(-1);
            }
        }).find('a').attr('href', null);
        var status = 0;
        more.hide();
        zxReserve.on('click', function () {
            if (status === 0) {
                more.show();
                addMoreA.text('收起更多条件！');
                status = 1;
            } else {
                more.hide();
                addMoreA.text('填写更多信息，可以为您提供更加匹配的案例！');
                status = 0;
            }
        });
        uname.on('focus', function () {
            nameText.removeClass('tips fc00').text('');
            $(this).attr('style', ' ');
        });
        uname.on('blur', function () {
            if (patternname.test(uname.val()) === false) {
                nameText.addClass('tips fc00').text('输入正确的姓名');
                $(this).attr('style', ' ');
            }
        });
        ename.on('focus', function () {
            eText.removeClass('tips fc00').text('');
            $(this).attr('style', ' ');
        });
        ename.on('blur', function () {
            if (areaname.test(ename.val()) === false) {
                autoDiv.css('top', '20px');
                eText.addClass('tips fc00').text('请正确填写小区名称！');
                $(this).attr('style', ' ');
                if (ename.val() === false) {
                    autoDiv.hide();
                }
            } else {
                autoDiv.hide();
            }
        });
        vCode.on('focus', function () {
            codeText.removeClass('tips fc00').text('');
            $(this).attr('style', ' ');
        });
        vCode.on('blur', function () {
            if (patterncode.test(vCode.val()) === false) {
                codeText.addClass('tips fc00').text('验证码输入错误，请重新输入');
                $(this).attr('style', ' ');
            }
        });
        phone.on('focus', function () {
            phoneText.removeClass('tips fc00').text('');
            $(this).attr('style', ' ');
            changeNum.css('visibility', 'visible');
        });
        phone.on('blur', function () {
            if (patterntel.test(phone.val()) === false) {
                phoneText.addClass('tips fc00').text('您输入的手机号码不正确');
                $(this).attr('style', ' ');
            } else if (phone.val() === vars.loginphone) {
                yan.hide();
            }
        }).change(function () {
            yan.show();
        });
        content.on('blur', function () {
            var a = content.text().length;
            if (a > 150) {
                alert('字数已超出150个！');
            }
        });
        area.on('focus', function () {
            areaText.removeClass('tips fc00').text('');
        });
        area.on('blur', function () {
            if (intNUM.test(area.val()) === false) {
                areaText.addClass('tips fc00').text('请输入数字');
            }
        });
        price.on('focus', function () {
            priceText.removeClass('tips fc00').text('');
        });
        price.on('blur', function () {
            if (intNUM.test(price.val()) === false) {
                priceText.addClass('tips fc00').text('请输入数字');
            }
        });
        email.on('focus', function () {
            emailText.removeClass('tips fc00').text('');
            $(this).attr('style', ' ');
        });
        email.on('blur', function () {
            if (/^[0-9a-zA-Z_]{1,20}@[0-9a-zA-Z]{1,9}(\.[a-zA-Z]{1,9})+$/.test(email.val()) === false) {
                emailText.addClass('tips fc00').text('请输入正确的邮箱地址');
                $(this).attr('style', ' ');
            }
        });
        function setnum() {
            if (tnow > 0) {
                sendCode.val('发送中(' + tnow + ')');
                tnow--;
                setTimeout(setnum, 1000);
            } else {
                sendCode.val('重新发送');
                tnow = 30;
            }
        }

        sendCode.on('click', function () {
            var mobilephone = phone.val();
            if (mobilephone === '') {
                alert('请输入手机号码！');
                return;
            }
            if (patterntel.test(mobilephone)) {
                verifycode.getPhoneVerifyCode(mobilephone,
                    function () {
                        setnum();
                    }, function () {
                        // 获取验证码失败 回掉此函数/自己的
                        alert('获取验证码失败');
                    });
            } else {
                alert('手机号码输入不正确！');
            }
        });

        $('#submit').on('click', function () {
            var a = yan.css('display');
            if (uname.val() !== '') {
                var m = phone.val() || '';
                var e = vCode.val() || '';
                var j = cityNameSel.text() || '';
                var c = ename.val() || '';
                var h = $('#rooms').find('option:selected').val() || '';
                var b = $('#style').find('option:selected').text() || '';
                var f = area.val() || '';
                var l = price.val() || '';
                var n = email.val() || '';
                var g = content.text() || '';
                var d = content.text().length;
                if (!patterntel.test(m)) {
                    alert('请填手机号');
                    return false;
                }
                if (d > 150) {
                    alert('具体要求的字数已超出150个！');
                    return false;
                }
                if (a === 'block' && e === '') {
                    alert('请填写验证码');
                    return false;
                }
                if (c === '') {
                    alert('请填写小区名');
                    return false;
                }
                if (h === '') {
                    alert('请填写装修户型');
                    return false;
                }
                var i = {
                    uname: encodeURIComponent(uname.val()),
                    phone: m,
                    vcode: e,
                    cityname: encodeURIComponent(j),
                    ename: encodeURIComponent(c),
                    rooms: encodeURIComponent(h),
                    style: encodeURIComponent(b),
                    area: encodeURIComponent(f),
                    price: encodeURIComponent(l),
                    email: encodeURIComponent(n),
                    Content: encodeURIComponent(g),
                    soufunid: vars.userid,
                    soufunname: vars.username
                };
                verifycode.sendVerifyCodeAnswer(m, e,
                    function () {
                        var k = vars.Url + '?c=jiaju&a=zxSubmit&r=' + Math.random();
                        $.post(k, i, function (q) {
                            var o = encodeURIComponent(uname.val());
                            var p = encodeURIComponent(c);
                            if (q.Result === '-1') {
                                alert('每个手机号每天只能发布一条装修信息！');
                            } else if (q.Result === '-2') {
                                alert('登录验证失败！');
                            } else if (q.Result === '-3') {
                                alert('验证码错误！');
                            } else {
                                window.location.href = vars.Url + '?c=jiaju&a=zxOver&uname=' + o + '&phone=' + m
                                    + '&cityname=' + j + '&ename=' + p + '&r=' + Math.random();
                            }
                        });
                    }, function () {
                        alert('验证码错误');
                    });

            } else {
                nameText.addClass('tips fc00').text('请填写我的姓名');
            }
        });

        var timeoutId;

        function init() {
            autoDiv.hide();
            var c = ename.position();
            var a = c.top + ename.height() + 7;
            var b = c.left;
            autoDiv.offset({
                top: a,
                left: b
            }).width(ename.width());
        }
        function processAjaxResponse(b) {
            autoDiv.css('top', '0px').show();
            autoLi.html('');
            for (var a = 0; a < b.length; a++) {
                var c = '<li class="pajax">' + b[a] + '</li>';
                autoLi.append(c);
            }
        }
        $('.pajax').on('click', function () {
            var a = $(this).text();
            ename.val(a);
            autoDiv.hide();
            eText.removeClass('tips fc00').text('');
        });
        function processAjaxRequest() {
            var a = cityNameSel.val();
            $.ajax({
                type: 'get',
                url: '/xf.d?m=getMapByKeyWordNew&city=' + a + '&q=' + ename.val(),
                data: '',
                dataType: 'json',
                success: processAjaxResponse
            });
        }
        function processKeyup(b) {
            var a = b || window.event;
            var c = a.keyCode;
            if (c >= 65 && c <= 90 || c === 8) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(processAjaxRequest, 500);
            }
        }
        $().ready(function () {
            init();
            ename.bind('keyup', processKeyup);
            if (patterntel.test(vars.loginphone) === false) {
                yan.show();
                changeNum.css('visibility', 'hidden');
            } else {
                phone.val(vars.loginphone);
                yan.hide();
            }
        });
    };
});