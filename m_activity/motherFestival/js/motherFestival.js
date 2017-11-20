(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
$(function () {
    //显示登录框
    $('#redBtn').on('click',function(){
        if (vars.logined) {
            $.ajax({
                url:  '/huodongAC.d?class=MotherFestivalHc&m=adoptCoupon&phone=' + vars.logined,
                type: 'GET',
                data: {},
                success: function (data) {
                    var result = data.result;
                    if(result=='0'){
                        alert('今天已经领取过优惠券了，请明天再试！');
                    }else if(result=='1'){
                        $('#tz-con').hide();
						$('#tz-box').show();
                        $('#tz-cont').show();
                    }else if(result=='2'){
                        alert('领取失败，请重试！');
                    }
                },
                error: function (data) {


                }
            });
            return;
        }
        $('#tz-box').show();
        $('#tz-con').show();
    });
    //关闭登录框
    $('#tz-box').on('click',function(){
        $(this).hide();
    });
    $('.yellBtn').on('click',function(){
        $('#tz-box').hide();
    });
    //防止下层div冒泡到上层div
    $('#tz-con').on('click',function(e){
        e.stopPropagation();
    });
    var vars = {};
    var $logined = $('#logined');
    vars.logined = $logined.val().trim();
    /**
     * 数字补全
     * @param num 数字
     * @returns {string} 两位数字
     */
    function toDou(num) {
        return num < 10 ? '0' + num : num;
    }


    // 获取验证码
    var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i,
        codeReg = /^\d{6}$/;
    var getPhoneVerifyCode = window.getPhoneVerifyCode;
    var getCode = $('#getCode'),
        phone = $('#phone');

    // 设置获取验证码开关
    var allowGet = true;
    var timeCount = 60;

    /**
     * 更新倒计时
     */
    var timer2 = null;

    function updateTime() {
        allowGet = false;
        getCode.text('(' + toDou(timeCount) + 's)');
        clearInterval(timer2);
        timer2 = setInterval(function () {
            timeCount--;
            getCode.text('(' + toDou(timeCount) + 's)');
            if (timeCount < 0) {
                clearInterval(timer2);
                getCode.text('重新发送');
                timeCount = 60;
                allowGet = true;
            }
        }, 1000);
    }

    // 获取验证码事件
    getCode.on('click', function () {
        if (allowGet) {
            var phonestr = phone.val().trim();
            if (!phonestr) {
                alert('请输入手机号');
                return false;
            }
            if (!phoneReg.test(phonestr)) {
                alert('请输入正确的手机号');
                return false;
            }
            // 调用获取验证码插件
            getPhoneVerifyCode(phonestr, function () {
                alert('验证码发送成功，请注意查收');
                updateTime();
            }, function (msg) {
                alert(msg);
                getCode.text('获取验证码');
            });
        }
    });

    // 登录提交
    var getMoney = $('#getMoney'),
        code = $('#code');
    var sendVerifyCodeAnswer = window.sendVerifyCodeAnswer;
    // 验证码清空
    code.focus(function () {
        $(this).val('');
    });

    getMoney.on('click', function (ev) {

        ev.stopPropagation();
        var phonestr = phone.val().trim();
        var codestr = code.val().trim();
        if (!phonestr) {
            alert('请输入手机号');
            return;
        }
        if (!phoneReg.test(phonestr)) {
            alert('请输入正确的手机号');
            return;
        }
        if (!codestr) {
            alert('请输入验证码');
            return;
        }
        if (!codeReg.test(codestr)) {
            alert('验证码错误');
            return;
        }
        vars.logined = phonestr;
        $logined.val(phonestr);
        sendVerifyCodeAnswer(phonestr, codestr, function () {
            $.ajax({
                url:  '/huodongAC.d?class=MotherFestivalHc&m=adoptCoupon',
                type: 'GET',
                data: {},
                success: function (data) {
                    var result = data.result;
                    if(result=='0'){
                        $('#tz-box').hide();
                        alert('今天已经领取过优惠券了，请明天再试！');
                    }else if(result=='1'){
                        $('#tz-con').hide();
                        $('#tz-cont').show();
                    }else if(result=='2'){
                        alert('领取失败，请重试！');
                    }
                },
                error: function (data) {


                }
            });
        }, function (msg) {
            alert(msg);
        });
    });

    $('#noFloatt').on('click',function(){
        $('#tz-cont').hide();
        $('#tz-box').hide();
    });



})
