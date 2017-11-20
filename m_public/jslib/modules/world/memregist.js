/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/world/memregist', ['jquery', 'modules/world/yhxw', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var verifycode = require('verifycode/1.0.0/verifycode');
        var patternname = /^[a-zA-Z]{2,}|[\u4e00-\u9fa5]{2,}$/;
        // 验证姓名
        var patterntel = /^1[34578]\d{9}$/;
        // 验证手机号码
        var patterncode = /^\d{4}$/;
        // 验证验证码
        var timeCount = 60;

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwenrollment';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 活动报名页-姓名
            'vmw.name': '',
            // 活动报名页-手机号
            'vmw.phone': ''
        };
        // 添加用户行为分析
        yhxw({
            type: 0,
            pageId: pageId,
            params: maiMaParams
        });
        var $popTip = $('#popTip');
        var $popTipText = $popTip.find('div');

        function popTips(msg) {
            $popTipText.text(msg);
            $popTip.show();
            setTimeout(function () {
                $popTip.hide();
            }, 2000);
        }
        $('input[type=hidden]').each(function (index, element) {
            vars[element.id] = element.value;
        });
        var $userName = $('#username');
        var $iphone = $('#phone');
        var $vcodeLi = $('#vcodeLi');
        var $sendcode = $('#sendcode');
        var $IdIsCode = $('#code');
        $userName.blur(function () {
            // 如果姓名格式不正确
            patternname.test($userName.val()) || popTips('姓名输入错误，请重新输入');
        });
        $iphone.on('input', function () {
            if (patterntel.test($iphone.val())) {
                $sendcode.hasClass('current') || $sendcode.addClass('active');
            } else {
                $sendcode.removeClass('active');
            }
        }).on('blur', function () {
            // 如果手机号不正确
            patterntel.test($iphone.val()) || popTips('手机号输入错误，请重新输入');
        });
        var $classIsChangetel = $('#changetel');
        var needCode = $classIsChangetel.filter(':hidden').length;
        $classIsChangetel.on('click', function () {
            $classIsChangetel.hide();
            needCode++;
            $iphone.val('').prop('disabled', false);
            $vcodeLi.show();
        });

        // 验证码验证
        $IdIsCode.blur(function () {
            // patterncode.test($IdIsCode.val()))
        });

        function updateTime() {
            $sendcode.text(timeCount + 's');
            timeCount--;
            if (timeCount >= -1) {
                setTimeout(updateTime, 1000);
            } else {
                $sendcode.text('重新获取');
                $sendcode.removeClass('current');
                patterntel.test($iphone.val()) && $sendcode.addClass('active');
                timeCount = 60;
            }
        }

        // 发送验证码
        function getphonecode() {
            if ($sendcode.hasClass('active')) {
                var mobilephone = $iphone.val();
                verifycode.getPhoneVerifyCode(mobilephone,
                    function () {
                        // 验证码成功
                        $sendcode.val('60s').removeClass('active').addClass('current');
                        timeCount--;
                        setTimeout(updateTime, 1000);
                    },
                    function (msg) {
                        // 验证码错误
                        popTips(msg);
                    }
                );
            }
        }

        // 会员报名提交
        function subRegist() {
            var LinkMan = $userName.val();
            var LinkPhone = $iphone.val();
            var code = $IdIsCode.val() || '';
            if (patternname.test(LinkMan) === false) {
                // 如果姓名格式不正确
                popTips('姓名输入错误，请重新输入');
                return;
            }
            if (patterntel.test(LinkPhone) === false) {
                // 如果手机号不正确
                popTips('手机号输入错误，请重新输入');
                return;
            }

            function postInfo() {
                var jsondata = {
                    linkMan: LinkMan,
                    phone: LinkPhone,
                    code: code,
                    houseid: vars.houseid,
                    body: vars.body,
                    tomail: vars.tomail,
                    agentname: vars.agentid,
                    projName: vars.ProjName
                };
                var ajaxUrl = vars.worldSite + '?c=world&a=subRegist&random=' + Math.random();
                $.get(ajaxUrl, jsondata,
                    function (data) {
                        var json = $.parseJSON(data);
                        var loginres = json.login;
                        var result = json.result;
                        if (loginres !== false && result === '1') {
                            popTips('报名成功');
                            setTimeout(function () {
                                history.go(-2);
                            }, 2000);
                            // 购房意愿埋码
                            // 姓名
                            maiMaParams['vmw.name'] = encodeURIComponent(LinkMan);
                            // 手机号
                            maiMaParams['vmw.phone'] = LinkPhone;
                            // 添加用户行为分析-埋码
                            yhxw({
                                type: 52,
                                pageId: pageId,
                                params: maiMaParams
                            });
                        } else if (loginres !== false && result !== '1') {
                            var message = decodeURIComponent(json.error_reason);
                            popTips(message);
                        } else {
                            popTips('验证码输入错误，请重新输入');
                        }
                    }
                );
            }
            if (needCode) {
                if (!patterncode.test(code)) {
                    // 如果验证码格式不正确
                    popTips('验证码输入错误，请重新输入');
                    return;
                }
                verifycode.sendVerifyCodeAnswer(LinkPhone, code, function () {
                    postInfo();
                }, function () {
                    // 验证码错误
                    popTips('验证码错误！');
                });
            } else {
                postInfo();
            }
        }

        $sendcode.on('click', getphonecode);
        $('#subRegist').on('click', subRegist);
    };
});