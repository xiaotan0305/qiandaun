/**
 * 虚假房源举报类
 * modify by liuxinlu@fang.com 20160118 ui改版
 */
define('modules/esf/report', ['jquery', 'verifycode/1.0.0/verifycode'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        var flag = true;
        // jquery 对象
        var $ = require('jquery'),
        // 所有数据数组
            vars = seajs.data.vars,
        // 验证手机号码
            patternTel = /^1[34578]\d{9}$/,
        // 验证验证码
            patternCode = /^\d{4}$/,
        // 倒计时秒数
            timeCount = 60,
        // 举报框对象
            $detailObj = $('#reasonsText'),
        // 举报框所在dl
            $detailDl = $('#reasonsTextDl'),
        // 电话输入框
            telObj = $('#phone'),
        // 输入框内叉号
            delTel = $('.prompt'),
        // 修改手机号按钮/ 发送验证码按钮
            modBtn = $('#modBtn'),
        // 验证码输入框
            codeObj = $('#code'),
        // 手机号输入错误提示框
            telMsg = $('#phoneMsg'),
        // 验证码输入框所在dl
            codeDl = $('#codeDl'),
        // 验证码输入错误提示框
            codeMsg = $('#codeMsg'),
        // 详细理由错误提示框
            reasonMsg = $('#reasonsTextMsg'),
        // 验证码对象（发送验证码以及验证码校验)
            codeVerifyObj = require('verifycode/1.0.0/verifycode');
        // 所有提示框获取焦点，清空错误信息
        $('#inputBoxes').on('focus', 'input,textarea', function () {
            $(this).parents('dl').find('p').text('');
        });
        // 详情页里点击举报理由为其它时显示详细理由框，否则详细理由框为非必填选项
        if (vars.action === 'detail') {
            $('#radioBox').on('click', 'input', function () {
                if ($(this).attr('id') === 'r5') {
                    $detailDl.show();
                } else {
                    $detailDl.hide();
                }
            });
        }

        /**
         * 倒计时函数
         */
        // countdownFlag标志位:待倒计时结束时才能发送请求
        var countdownFlag = true;
        function countDown() {
            countdownFlag = false;
            var timer = setInterval(function () {
                timeCount--;
                modBtn.text('重新发送(' + timeCount + ')');
                if (timeCount === -1) {
                    countdownFlag = true;
                    clearInterval(timer);
                    modBtn.text('重新获取');
                    timeCount = 60;
                }
            }, 1000);
        }
        // 点击修改手机号/发送验证码操作
        modBtn.click(function () {
            var el = $(this);
            // 如果用户已经登录未显示验证码输入框
            if (vars.loginphone && codeDl.is(':visible') === false) {
                delTel.show();
                // 用户已登陆点击修改手机号显示验证码输入框
                codeDl.show();
                el.text('发送验证码').removeClass('btn-ok').addClass('btn-oka');
                telObj.focus();
                // 发送验证码按钮
            } else {
                // 电话号码
                var telVal = $.trim(telObj.val());
                // 验证手机号码是否输入正确
                if (patternTel.test(telVal) === false) {
                    telMsg.text('手机号码输入错误，请重新输入');
                    telObj.focus();
                    return false;
                }
                // 使用公用验证码对象发送验证码
                countdownFlag && codeVerifyObj.getPhoneVerifyCode(telVal, countDown, function () {
                    return false;
                });
            }
        });

        // 点击叉号，清空电话号码
        delTel.click(function () {
            telObj.val('');
        });

        /**
         * 显示电话号码错误提示
         */
        function showTelMsg() {
            // 验证是否为手机号码
            var telCon = '', res = true;
            if (patternTel.test(telObj.val()) === false) {
                telCon = '手机号码输入错误,请重新输入';
                res = false;
            }
            telMsg.text(telCon);
            return res;
        }

        // 电话号码框输入以及失去焦点操作
        telObj.on('input keyup', function () {
            var phoneCon = telObj.val();
            // 验证输入的是否都为数字，如果不为数字则去掉最后一位
            if (/^\+?[1-9][0-9]*$/.test(phoneCon) === false) {
                telObj.val(phoneCon.slice(0, -1));
            }
        }).blur(showTelMsg);
        // 验证码输入框失去焦点操作
        codeObj.blur(function () {
            var textCon = '';
            if (patternCode.test(codeObj.val()) === false) {
                textCon = '验证码输入错误，请重新输入';
            }
            codeMsg.text(textCon);
        });

        /**
         * 验证码校验失败
         */
        function codeFail() {
            codeMsg.text('验证码输入错误，请重新输入');
            return false;
        }
        // 增加显示剩余多少个字
        var canWrite = $('#canWrite');
        var showCon;
        $detailObj.on('input keyup', function () {
            // 剩余可以输入的字
            $detailObj.attr('maxlength','100');
            if($detailObj.val().length < 100) {
                var canWlen = parseInt(100 - $detailObj.val().length);
                showCon = '您还可以输入' + canWlen + '字';
            } else {
                showCon = '您最多只能输入100个字';
            }
            canWrite.html(showCon);
        });
        // 点击提交按钮
        $('#subReport').on('click', function () {
            // 电话号码值
            var linkPhone = $.trim(telObj.val());
            // 验证码值
            var code = $.trim(codeObj.val()) || '';
            if ($detailDl.is(':visible')) {
                // 举报详细理由
                var detail = $.trim($detailObj.val());
                if (vars.housetype === 'DS') {
                    if (detail.length < 5) {
                        reasonMsg.text('举报内容为5到100个字，您所填写的内容少于5个字。');
                        return false;
                    } else if (detail.length > 100) {
                        reasonMsg.text('举报内容为5到100个字，您所填写的内容多于100个字。');
                        return false;
                    }
                } else {
                    // 没有填写详细举报理由
                    if (detail.length === 0) {
                        reasonMsg.text('请填写您举报的详细理由');
                        return false;
                    }
                }
            }
            // 手机号或者验证码格式不符合要求则不予提交
            if (showTelMsg() === false) {
                return false;
            }
            // 验证码输入框显示则进行验证码相关判断
            if (codeDl.is(':visible') && telObj.val() !== vars.loginphone) {
                if (patternCode.test(code) === false) {
                    codeMsg.text('验证码输入错误，请重新输入');
                    return false;
                }
                // 校验输入的验证码是否正确
                codeVerifyObj.sendVerifyCodeAnswer(linkPhone, code, subreport, codeFail);
            } else {
                subreport();
            }
        });


        /**
         * 提交举报虚假房源
         */
        function subreport() {
            // 如果为当前页登录，则进行如下处理
            if (codeDl.is(':visible') && telObj.val() !== vars.loginphone) {
                $.ajax({
                    url: vars.esfSite + '?c=esf&a=ajaxJudgeUserIdentity&city=' + vars.city,
                    async: false,
                    success: function (data) {
                        if (data) {
                            reasonMsg.text(data);
                            return false;
                        }
                    }
                });
            }
            // 当类型为电商时，为多选，值用逗号分隔
            var reportReason = '';
            if (vars.housetype === 'DS') {
                $('input[name="reason"]:checked').each(function () {
                    reportReason += $(this).val() + ',';
                });
            }

            var jsondata = {
                // 修改了vars变量的名字,跟房源详情弹窗保持一致,该页面其他地方用到的都修改了 20151208 zcf
                houseid: vars.houseid,
                type: vars.housetype,
                // 房源类型
                agentid: vars.agentid,
                housetype: vars.cstype,
                // 租售类型
                purpose: vars.purpose,
                phone: $.trim(telObj.val()),
                reportReason: vars.housetype === 'DS' ? reportReason : $('input:radio:checked').val(),
                detail: $.trim($detailObj.val()),
                // 区分房源详情页还是虚假举报页 20151208 zcf
                source: vars.source
            };
            var ajaxUrl;
            if (vars.housetype === 'DS') {
                ajaxUrl = vars.esfSite + '?c=esf&a=ajaxDSSubReport&city=' + vars.city + '&random=' + Math.random();
            } else {
                ajaxUrl = vars.esfSite + '?c=esf&a=subReport&city=' + vars.city + '&random=' + Math.random();
            }

            if (flag) {
                $.ajax({
                    url: ajaxUrl,
                    async: false,
                    data: jsondata,
                    type: 'POST',
                    success: function (data) {
                        var json = data;
                        var result = json.result.result;
                        var message = decodeURIComponent(json.result.message);
                        // 返回用户登陆情况
                        var loginres = json.login;
                        // 检测房源信息是否可以举报（当为1时表示可以举报)
                        if (json.limitInfo.Code === '1') {
                            // 用户已登陆，并且举报成功，跳转至举报成功页面
                            if (loginres !== false && result === '1') {
                                flag = false;
                                window.location.href = vars.esfSite + '?c=esf&a=reportSuc&houseid=' + vars.houseid + '&housetype=' + vars.housetype + '&city='
                                    + vars.city + '&source=' + vars.source;
                            } else if (loginres !== false && result !== '1') {
                                alert(message);
                            } else {
                                codeMsg.text('验证码输入错误，请重新输入');
                            }
                        } else {
                            alert(decodeURIComponent(json.limitInfo.Message));
                        }
                    }
                });
            }
        }
    };
});