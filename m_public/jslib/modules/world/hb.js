/**
 * @file merge js files,ESLint
 * @author lvyan(lvyan.bj@fang.com)
 */
define('modules/world/hb', ['jquery', 'modules/world/yhxw', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var verifycode = require('verifycode/1.0.0/verifycode');
        var phonestr, codestr;

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwredpacketspage';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 红包页-姓名
            'vmw.name': '',
            // 红包页-手机号
            'vmw.phone': ''
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        // 红包规则
        $(window).on('load', function () {
            $.get(vars.worldSite + '?c=world&a=hbRule&zhcity=' + vars.zhcity, function (data) {
                $('#rulebox .close').after(data);
            });
        });
        // 用户输入状态
        var namestatus = false, phonestatus = false, codestatus = false;
        var username = '', mobilephone = '', code = '';
        // 验证码倒计时
        var timeCount = 60;
        // 验证用户名
        $('#username').focus(function () {
            window.scrollTo(0, 300);
            $('#nametext').css('display', 'none');
        }).blur(function () {
            window.scrollTo(0, 1);
            username = $.trim($(this).val());
            if (username === '') {
                namestatus = false;
                $('#nametext').css('display', 'block');
            } else {
                namestatus = true;
            }
        });
        // 验证手机号
        $('#phoneNum').focus(function () {
            window.scrollTo(0, 350);
            $('#phonetext').css('display', 'none');
        }).blur(function () {
            window.scrollTo(0, 1);
            var $this = $(this);
            mobilephone = $.trim($this.val());
            var patterntel = /^1[34578]\d{9}$/;
            if (patterntel.test(mobilephone) === false) {
                phonestatus = false;
                $('#phonetext').css('display', 'block');
            } else {
                phonestatus = true;
            }
        });
        // 验证验证码
        $('#code').focus(function () {
            window.scrollTo(0, 400);
        }).blur(function () {
            window.scrollTo(0, 1);
            code = $.trim($(this).val());
            var patterncode = /^\d{4}$/;
            if (patterncode.test(code) === false) {
                codestatus = false;
                alert('请输入正确的验证码');
            } else {
                codestatus = true;
            }
        });
        // 发送验证码
        var $sendcode = $('#sendcode');
        var sendstatus = true;
        function getphonecode() {
            phonestr = $('#phoneNum').val();
            verifycode.getPhoneVerifyCode(phonestr,
                function () {
                    $sendcode.text('重新发送(' + timeCount + ')');
                    setTimeout(updateTime, 1000);
                }, function () {
                    alert('发送失败，请重新发送');
                });
        }

        function updateTime() {
            timeCount--;
            if (timeCount > 0) {
                $sendcode.text('重新发送(' + timeCount + ')');
                setTimeout(updateTime, 1000);
            } else {
                $sendcode.text('重新获取');
                sendstatus = true;
                timeCount = 60;
            }
        }

        $sendcode.on('click', function () {
            // 请求获取验证码
            if (namestatus && phonestatus) {
                if (sendstatus) {
                    sendstatus = false;
                    getphonecode();
                }
            } else {
                alert('请完善注册信息');
            }
        });
        // 提交注册
        $('#subRegist').on('click', function () {
            if (codestatus && phonestatus && namestatus) {
                phonestr = $('#phoneNum').val();
                codestr = $('#code').val();
                verifycode.sendVerifyCodeAnswer(phonestr, codestr,
                    function () {
                        // 提交这个表单内的内容。提交完之后页面重新刷新
                        var ajaxUrl = vars.worldSite + '?c=world&a=hbSub&random=' + Math.random();
                        var zhcity = vars.zhcity == '\u7ebd\u7ea6' ? '\u7ebd\u7ea6' : '\u6fb3\u5927\u5229\u4e9a';
                        $.get(ajaxUrl, {phone: mobilephone, code: code, zhcity: zhcity}, function (data) {
                            var result = $.parseJSON(data);
                            if (result.result) {
                                $('#vipbox span').text('"' + result.value + '"');
                                $('#vipbox').css('display', 'block');
                                // 海外红包埋码
                                // 姓名
                                maiMaParams['vmw.name'] = encodeURIComponent(username);
                                // 手机号
                                maiMaParams['vmw.phone'] = mobilephone;
                                // 添加用户行为分析-埋码
                                yhxw({type: 10, pageId: pageId, params: maiMaParams});
                            } else {
                                alert(result.value);
                            }
                        });
                    },
                    function () {
                        alert('验证码错误，请重新输入');
                    }
                );
            } else {
                alert('请完善注册信息');
            }
        });
        $('#vipbox .but02').on('click', function () {
            $('#vipbox').css('display', 'none');
            location.reload();
        });
        // 显示、关闭规则
        $('#rules').on('click', function () {
            $('#rulebox').css('display', 'block');
        });
        $('#rulebox .close').on('click', function () {
            $('#rulebox').css('display', 'none');
        });
    };
});