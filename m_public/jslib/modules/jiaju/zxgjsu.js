/**
 * Created by LXM on 2015/9/16.
 * 装修计算器-申请免费报价
 */
define('modules/jiaju/zxgjsu', ['jquery', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var cityname = $('#cityname');
        var patternname = /^[a-zA-Z0-9]{1,20}$|^[\u4e00-\u9fa5]{1,10}$/;
        var patterntel = /^1[3,4,5,7,8]\d{9}$/;
        var phone = $('#phone');
        var vcode = $('#vcode');
        var uname = $('#uname');
        var patterncode = /^\d{4}$/;
        var verifycode = require("verifycode/1.0.0/verifycode");
        var page = 'mjjfitmentagent';

        function signup() {
            var j = window.location.search,
                src = '';
            if (j.indexOf('?') !== -1) {
                if (j.indexOf('src=client') !== -1) {
                    src = '&src=client';
                }
            }
            /* --------------------实现2(返回 $_GET 对象, 仿PHP模式)----------------------*/
            var $_GET = (function () {
                var url = window.document.location.href.toString();
                var u = url.split('?');
                if (typeof u[1] === 'string') {
                    u = u[1].split('&');
                    var get = {};
                    for (var i in u) {
                        if (u.hasOwnProperty(i)) {
                            var j = u[i].split('=');
                            get[j[0]] = j[1];
                        }
                    }
                    return get;
                }
                return {};
            })();

            if ($_GET.isjump === 1 && $_GET.jumpurl) {
                j = j.replace('&jumpurl=' + $_GET.jumpurl, '');
                j = j.replace('&isjump=1', '');
            }
            var k = phone.val() || '';
            var d = cityname.find('option:selected').text() || '';
            var e = cityname.find('option:selected').val() || '';
            var b = vcode.val() || '';
            if (e === '') {
                $('#citytext').addClass('tips fc00').text('请选择城市！');
                return false;
            }

            if (patternname.test(uname.val()) === false) {
                $('#unametext').addClass('tips fc00').text('请填写您的称呼！');
                return false;
            }
            if (patterntel.test(phone.val()) === false) {
                if (k === '') {
                    $('#phonetext').addClass('tips fc00').text('手机号码不能为空！');
                } else {
                    $('#phonetext').addClass('tips fc00').text('请填写正确的手机号码！');
                }
                return false;
            }
            if (k !== vars.loginphone) {
                $('#yan').show();
                if (patterncode.test(vcode.val()) === false) {
                    $('#codetext').addClass('tips fc00').text('验证码输入错误，请重新输入');
                    return false;
                }
            }
            var l = '';
            for (var f = 0; f < j.split('&').length; f++) {
                var g = j.split('&')[f];
                if (g.toLowerCase().indexOf('sem') !== -1) {
                    l = g;
                }
            }
            var purl = '';
            if (window.parent.location.href) {
                purl = window.parent.location.href;
            } else {
                purl = vars.Url + j;
            }
            var c = {
                realName: encodeURIComponent(uname.val()),
                mobile: k,
                cityname: encodeURIComponent(d),
                code: b,
                sourcepage: encodeURIComponent(purl)
            };
            var doTH = function () {
                j = j.replace('c=jiaju&a=zxgjsu', 'c=jiaju&a=zxgjzc');
                var h = vars.Url + j + '&r=' + Math.random();
                $.get(h, c, function (i) {
                    var b = 78;
                    var p = {
                        'vmg.page': page,
                        'vmh.name': encodeURIComponent(uname.val()),
                        'vmh.city': encodeURIComponent(d),
                        'vmh.phone': k
                    };
                    _ub.collect(b, p);
                    if (i.info.ApplyCustomerRecordID === '0') {
                        alert(i.info.error);
                        console.log(i);
                    } else if (i.info.ApplyCustomerRecordID > 0) {
                        if ($_GET.isjump === 1 && $_GET.jumpurl) {
                            window.location.href = decodeURIComponent($_GET.jumpurl);
                        } else {
                            window.location.href = vars.Url + '?c=jiaju&a=zxgjsuc&' + l + src + '&sok=' + i.info.ApplyCustomerRecordID + '&r=' + Math.random();
                        }
                    } else {
                        alert(i.info.error);
                    }
                });
            };
            //验证验证码并且登录
            if (vcode.val() !== '') {
                verifycode.sendVerifyCodeAnswer(phone.val(), vcode.val(),
                    doTH,
                    function () {
                        alert('验证码错误,请重新登录');
                    });
            } else {
                doTH();
            }
        }

        var tnow = 30;

        // 获取验证码
        function setnum() {
            if (tnow > 0) {
                $('#sendcode').val('发送中(' + tnow + ')');
                tnow--;
                setTimeout(setnum, 1000);
            } else {
                $('#sendcode').val('重新发送');
                tnow = 30;
            }
        }

        // 获取验证码
        $('#sendcode').on('click', function () {
            if (phone.val() === '') {
                alert('请输入手机号码');
            }
            if (patterntel.test(phone.val())) {
                verifycode.getPhoneVerifyCode(phone.val(),
                    function () {
                        setnum();
                    },
                    function () {});
            } else {
                alert('手机号码输入不正确！');
            }
        });

        $('#signup').on('click', function () {
            signup();
        });
        var strurl = window.location.search;
        $(document).ready(function () {
            if (strurl.indexOf('?') !== -1) {
                if (strurl.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                    $('.formbtn02').css('background-color', '#D71013');
                }
            }
            if (patterntel.test(vars.loginphone) === false) {
                $('#yan').show();
                $('#changeNum').css('visibility', 'hidden');
            } else {
                phone.val(vars.loginphone);
                $('#yan').hide();
            }
        });
        $('#changeNum').click(function () {
            $('#yan').show();
            phone.val('');
        });
        uname.focus(function () {
            $('#unametext').removeClass('tips fc00').text('');
        }).blur(function () {
            if (patternname.test(uname.val()) === false) {
                $('#unametext').addClass('tips fc00').text('请填写您的称呼！');
            }
        });
        phone.focus(function () {
            $('#phonetext').removeClass('tips fc00').text('');
            $('#changeNum').css('visibility', 'visible');
        }).blur(function () {
            if (patterntel.test(phone.val()) === false) {
                $('#phonetext').addClass('tips fc00').text('您输入的手机号码不正确');
                $(this).attr('style', ' ');
            } else if (phone.val() === vars.loginphone) {
                $('#yan').hide();
            }
        }).change(function () {
            $('#yan').show();
        });
        vcode.focus(function () {
            $('#codetext').removeClass('tips fc00').text('');
            $(this).attr('style', ' ');
        }).blur(function () {
            if (patterncode.test(vcode.val()) === false) {
                $('#codetext').addClass('tips fc00').text('验证码输入错误，请重新输入');
                $(this).attr('style', ' ');
            }
        });
        cityname.focus(function () {
            $('#citytext').removeClass('tips fc00').text('');
        }).blur(function () {
            if (cityname.find('option:selected').val() === '') {
                $('#citytext').addClass('tips fc00').text('请选择城市！');
            }
        });

        /* -----------------实现1--------------------
         function getPar(par) {
         var localUrl = document.location.href;
         var get = localUrl.indexOf(par + '=');
         if (get === -1) {
         return false;
         }
         var getPar = localUrl.slice(par.length + get + 1);
         var nextPar = getPar.indexOf('&');
         if (nextPar !== -1) {
         getPar = getPar.slice(0, nextPar);
         }
         return getPar;
         };*/
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            _ub.biz = 'i';
            // 业务---资讯
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 方位（南北方) ，北方为0，南方为1
            var b = 1;
            var p = {
                'vmg.page': page
            };
            _ub.collect(b, p);
        });

    };
});