$(document).ready(function () {
    // 后台参数 获奖类型
    var type = $('#coupon').val(); // 车问网 青年菜君 皮肤检测 搜房红包
    // 后台参数 已获奖类型
    var myType = $('#mytype').val(); // 1表示用户已经中奖 2表示没有输入正确的手机号
    // 所使用app的名字
    var appName = $('#appName').val(); // Android_UnMap为搜房app
    var src = $('#src').val(); // Android_UnMap为搜房app

    var mengceng = $('.mengceng');
    var btn1 = $('.btn1');
    var btn2 = $('.btn2');
    var btn3 = $('.btn3');
    var btn4 = $('.btn4');
    var chongfu = $('#chongfu');
    var ruleBtn = $('#ruleBtn');
    var rule = $('#rule');
    var awardbtn = $('#awardbtn');
    var check = $('#check');
    var btnimg = $('.btnimg');
    var uncheck = $('#uncheck');
    var download = $('.download');
    var chewenwang = $('#chewenwang');
    var lijilingqu = $('.lijilingqu');
    var share = $('.share');
    var sharePage = $('.sharePage');
    var wrong = $('.wrong');
    var back = $('.back');
    var qingniancaijun = $('#qingniancaijun');
    var pifujiance = $('#pifujiance');
    var hongbao = $('#hongbao');

    btn2.val(''); // 验证码置空
    checkBtn4();

    // 验证是否想再次领红包，1为已领取，2为手机号错误
    if (myType == '1') {
        chongfu.css('display', 'inline');
        mengceng.css('display', 'block');
        // 防止调试模式删掉此蒙版继续抽奖
        $(window).on('click', function () {
            window.location.href = '/huodongAC.d?class=HappyFridayHc&m=index&src=' + src;
        });
    } else if (myType == '2') {
        alert('请输入正确的手机号');
    }

    // 验证的结果正确时
    if (type == '皮肤检测' || type == '车问网' || type == '青年菜君' || type == '搜房红包') {
        // 赋予抽奖按钮可用功能
        getGift();
        // 抽奖结果
    }

    // 点击[活动规则]弹出活动规则
    ruleBtn.on('click', function () {
        rule.css('display', 'block');
        mengceng.css('display', 'block');
        // 关闭活动规则
        mengceng.one('click', function () {
            rule.css('display', 'none');
            mengceng.css('display', 'none');
        });
    });

    // 关闭活动规则
    awardbtn.on('click', function () {
        rule.css('display', 'none');
        mengceng.css('display', 'none');
    });

    // 手机号输入时，文字消失
    btn1.focus(function () {
        // btn1.setCursorPosition({index: 0})
        btn1.css('color', '#000');
    });

    // 判断手机号码格式状态
    function checkPhone() {
        var re = new RegExp(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
        var number = btn1.val();
        // 手机号格式状态为正确
        if (re.test(number)) {
            console.log('手机号对');
            return true;
            // 手机号格式状态为错误
        } else {
            console.log('手机号不对');
            return false;
        }
    }

    // 判断验证码格式状态
    function checkPwd() {
        var pwdReg = new RegExp(/^[0-9]{6}$/);
        var pwd = btn2.val();
        // 验证码格式状态为正确
        if (pwdReg.test(pwd)) {
            console.log('验证码对');
            return true;
            // 验证码格式状态为错误
        } else {
            console.log('验证码不对');
            return false;
        }
    }

    // 判断“获取验证码”按钮是否可点
    function checkBtn3() {
        // 如果手机号格式正确，则可点击
        if (checkPhone()) {
            console.log('验证码按钮可点');
            return true;
            // 如果手机号格式不正确，弹框提醒
        } else {
            // alert('请输入正确的手机号');
            console.log('验证码按钮不可点');
            return false;
        }
    }

    // 判断“抽奖”按钮是否可点
    function checkBtn4() {
        // 如果手机号格式正确 且 验证码格式正确
        // 且 “获取验证码”按钮已点击 且 小对勾已勾选
        if (checkPhone() && checkPwd() && checkCheck() && btn3State) {
            btn4.css('background-color', '#fdcc40');
            btn4.bind('click', checkCode);
            console.log('抽奖按钮可点');
            return true;
        } else {
            btn4.css('background-color', '#cdcdcd');
            btn4.unbind('click', checkCode);
            console.log('抽奖按钮不可点');
            return false;
        }
    }

    // 判断小对勾状态
    function checkCheck() {
        if (check.css('display') == 'none') {
            console.log('小对勾未勾选');
            return false;
        } else { // 如果对勾显示，则不显示
            console.log('小对勾已勾选');
            return true;
        }
    }

    // 倒计时60秒
    var wait = 60;

    function time(o) {
        if (wait == 0) {
            o.value = '获取验证码';
            wait = 60;
        } else {
            o.value = '重新发送(' + wait + ')';
            wait--;
            setTimeout(function () {
                    time(o)
                },
                1000)
        }
    }

    // 点击“获取验证码”按钮
    var btn3State = false; // 按钮状态默认为未点
    var myNumber;
    btn3.on('click', function () {
        if (checkBtn3() && wait == 60) {
            // 开始60秒倒计时
            time(this);
            // 记录下填入表单中的手机号
            myNumber = btn1.val();
            // 向手机发送验证码,
            var phone = $('#phone');
            $.getJSON('/user.d?m=regetvcode_lottery&phone=' + phone.val() + '&times=first', function (data) {
                var status = data.root.status;
                var message = data.root.message;
                alert(message);
                btn3State = true; // 按钮状态变成已点
                // 如果发送验证码不成功，按钮文字恢复成“获取验证码”，倒计时结束
                if (status !== '100') {
                    btn3.value = '获取验证码';
                    wait = 0;
                    btn3State = false; // 按钮状态变成未点
                }
            });
        } else if (!checkBtn3()) {
            alert('请输入正确的手机号');
            btn3State = false; // 按钮状态变成未点
        }
        checkBtn4();
    });

    // 点击对勾时判断对勾小图片是否显示
    btnimg.on('click', function () {
        if (check.css('display') == 'none') {
            check.css('display', 'inline');
            uncheck.css('display', 'none');
            checkBtn4();
            console.log('小对勾已勾选');
        } else { // 如果对勾显示，则不显示
            uncheck.css('display', 'inline');
            check.css('display', 'none');
            checkBtn4();
            console.log('小对勾未勾选');
        }
    });

    // 修改手机号时要再次检验
    btn1.on('click input propertychange', function () {
        checkBtn4();
    });

    // 修改验证码时要再次检验；没有点击“获取验证码”就输入验证码，提示输入验证码
    btn2.on('click input propertychange', function () {
        checkBtn4();
        if (!btn3State) {
            alert('请点击获取验证码');
        }
    });

    // 把手机号验证码传到后台判断
    function checkCode() {
        // 抽奖时修改了手机号
        if (myNumber !== btn1.val()) {
            alert('手机号已修改，请重新获取验证码');
        } else { // 把两个表单的数据都传给后台去判断
            var inputCode = $('#inputCode');
            var phone = $('#phone');
            var inputCodeVal = inputCode.val();
            var phoneVal = phone.val();
            $.getJSON('/activity.d?m=checkVCode', {checkCode: inputCodeVal, phone: phoneVal}, function (data) {
                var checkStatus = data.root.status;
                if (checkStatus === '100') {
                    window.location.href = '/huodongAC.d?class=HappyFridayHc&m=adoptCouponAndShow&phone=' + phoneVal + '&appName=' + appName + '&src=' + src;
                } else {
                    alert('验证码错误，请重新输入~');
                }
            });
        }
    }

    // 领奖页面
    function getGift() {
        switch (type) {
            case '车问网':
                // 车问网 10
                if (appName == 'Android_UnMap') {
                    download.css('display', 'none');
                    chewenwang.css('display', 'block');
                    mengceng.css('display', 'block');
                } else {
                    chewenwang.css('display', 'block');
                    mengceng.css('display', 'block');
                }
                break;
            case '青年菜君':
                // 青年菜君 20
                if (appName == 'Android_UnMap') {
                    download.css('display', 'none');
                    qingniancaijun.css('display', 'block');
                    mengceng.css('display', 'block');
                } else {
                    qingniancaijun.css('display', 'block');
                    mengceng.css('display', 'block');
                }
                break;
            case '皮肤检测':
                // 皮肤检测 20
                if (appName == 'Android_UnMap') {
                    download.css('display', 'none');
                    pifujiance.css('display', 'block');
                    mengceng.css('display', 'block');
                } else {
                    pifujiance.css('display', 'block');
                    mengceng.css('display', 'block');
                }
                break;
            case '搜房红包':
                // 红包 50
                hongbao.css('display', 'block');
                mengceng.css('display', 'block');
                break;
        }

        // 点击叉号返还到抢券页
        back.on('click', function () {
            window.location.href = '/huodongAC.d?class=HappyFridayHc&m=index&src=' + src;
            // self.location = '/activityshow/happyFriday/index.jsp';
        });
        wrong.on('click', function () {
            window.location.href = '/huodongAC.d?class=HappyFridayHc&m=index&src=' + src;
            // self.location = '/activityshow/happyFriday/index.jsp';
        });

        // 下载
        download.on('click', function () {
            self.location = 'http://m.fang.com/clientindex.jsp?city=bj&company=1115';
        });

        // 分享
        share.on('click', function () {
            sharePage.css('display', 'inline');
            mengceng.css('z-index', '100');
            setTimeout(function () {
                sharePage.css('display', 'none');
                mengceng.css('z-index', '1');
            }, 3000);
        });

        // 立即领取红包
        lijilingqu.on('click', function () {
            self.location = 'http://m.fang.com/xf/bj/dianshang/?red=hb';
        });
    }
});