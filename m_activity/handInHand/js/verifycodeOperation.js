/**
 * Created by user on 2016/3/7.
 */
$(function () {
    'use strict';
    var $codeBtn = $('#getVerifyCode');
    var $telNo = $('#getTelNo');
    var $msgBox = $('.remind');
    var $codeCon = $('#codeCon');
    var param = {};
    // 倒计时秒数
    var timeCount = 60;
    // 验证手机号码
    var patternTel = /^1[34578]\d{9}$/;
    // 验证验证码
    var patternCode = /^\d{6}$/;
    // 获取页面所有传入值
    $('input[type=hidden]').each(function (index, element) {
        param[$(this).attr('data-id')] = element.value;
    });
    // 如果用户已经登陆 则隐藏验证码相关div
    if (param.loginphone) {
        $telNo.val(param.loginphone);
        $('#VerifyCodeCon').hide();
    }
    // 控制验证码发送成功后要60秒后才可以从新发送
    function countDown() {
        var timer = setInterval(function () {
            timeCount--;
            $codeBtn.val('重新发送(' + timeCount + ')');
            if (timeCount === -1) {
                clearInterval(timer);
                $codeBtn.attr('disabled',false).val('重新获取');
                timeCount = 60;
            }
        }, 1000);
    }

    // 后台因为用的是之前二手房详情页的接口需要传递type 2表示代办过户请求
    var type = 2;
    // 获取并验证验证码
    $codeBtn.click(function () {
        $msgBox.text('');
        var phone = $.trim($telNo.val());
        // 如果电话号码不符合要求，则提示电话号码错误
        if (patternTel.test(phone) === false) {
            $msgBox.text('请输入正确的电话号码');
            return false;
        }
        $codeBtn.attr('disabled',true);

        // 请求获取验证码
        verifycode.getPhoneVerifyCode(phone, countDown, function () {
            // 获取验证码失败 回掉此函 把获取验证码按钮置为可用
            $codeBtn.attr('disabled',false);
        });
    });
    // 点击预约质询成功后的回掉函数
    var $showZyyzMax = $('#showZyyzMax');

    function submit() {
        $msgBox.text('');
        // 提交url
        var linkUrl = param.esfSite + '?c=esf&a=ajaxGetZYYZ&city' + param.city + '&type=' + type;
        $.ajax({
            url: linkUrl,
            success: function (data) {
                // data = JSON.parse(data);
                // 判断是否是中介0表示不是中介
                if (data.checkAgent.result === '0') {
                    // 申请代办过户请求接口失败时
                    if (data.transferOwnership.timeout === '-2') {
                        $showZyyzMax.find('p').text(data.transferOwnership.message);
                        $showZyyzMax.show();
                    } else if (data.transferOwnership.result === '1') {
                        // 申请代办过户请求成功时
                        $('#tjBtn').attr('disabled',true);
                        $('#pop').show();
                    } else {
                        // 申请代办过户失败data.transferOwnership为空（不知道为什么会有这个情况）
                        $showZyyzMax.find('p').text('代办过户失败!');
                        $showZyyzMax.show();
                    }
                } else if (data.checkAgent.timeout === '-2') {
                    // 判断是否是中介时接口超时
                    $showZyyzMax.find('p').text(data.checkAgent.message);
                    $showZyyzMax.show();
                } else if (data.checkAgent.result === '1') {
                    // 是中介时执行的操作
                    $showZyyzMax.find('p').text('经纪人无法联系业主!');
                    $showZyyzMax.show();
                } else {
                    $showZyyzMax.find('p').text('请求失败！');
                    $showZyyzMax.show();
                }
            }
        });
    }

    $('#submit').click(function () {
        $('#pop').hide();
    });
    $('#closeBtn').click(function () {
        $showZyyzMax.hide();
    });
    // 在登录状态下，若输入的手机号与账户绑定的手机号不同，则将输入的手机号新注册一个账户.
    $telNo.on('input',function () {
        $msgBox.text('');
        if ($(this).val() !== param.loginphone) {
            $('#tjBtn').attr('disabled',false);
            $('#VerifyCodeCon').show();
        }else {
            $('#VerifyCodeCon').hide();
        }
    });
    // 点击预约咨询
    $('#tjBtn').click(function () {

        if (patternTel.test($telNo.val()) === false) {
            $msgBox.text('请输入正确的电话号码');
            return false;
        }
        if (param.loginphone === $telNo.val().trim()) {
            submit();
        }
        // 在没有登录的情况下 验证码不符合规则则提示验证码错误信息
        if (patternCode.test($codeCon.val()) === false && !param.loginphone) {
            $msgBox.text('验证码输入错误');
            return false;
        }
        // 校验输入的验证码是否正确
        if (!param.loginphone || param.loginphone !== $telNo.val().trim()) {
            verifycode.sendVerifyCodeAnswer($telNo.val(), $codeCon.val(), submit, function () {
                $msgBox.text('验证码输入错误');
                return false;
            });
        }
    });

    // 点击换一换按钮
    $('#exchange').click(function () {
        var mydl = $('.house').find('dl');
        if ($(mydl.get(0)).css('display') === 'block') {
            $('.house dl:lt(4)').hide();
            $('.house dl:lt(8):gt(3)').show();
        } else if ($(mydl.get(4)).css('display') === 'block') {
            $('.house dl:lt(8):gt(3)').hide();
            $('.house dl:lt(12):gt(7)').show();
        } else if ($(mydl.get(8)).css('display') === 'block') {
            $('.house dl:lt(12):gt(7)').hide();
            $('.house dl:lt(16):gt(11)').show();
        } else {
            $('.house dl:lt(16):gt(11)').hide();
            $('.house dl:lt(4)').show();
        }
    });
    $('.online').click(function () {
        window.localStorage.setItem(param.uname,encodeURIComponent('在线客服') + ';' + param.photourl + ';;');
        window.location = '/chat.d?m=chat&username=' + 'sf13071135619' + '&city=' + param.city + '&type=wapesf';
    });
});