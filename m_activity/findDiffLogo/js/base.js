/**
 * @Author: fenglinzeng
 * @Date: 2016/07/11
 * @description: **findDiffLogo**
 * @Last Modified by: **null**
 * @Last Modified time: **null**
 */

$(document).ready(function ($) {
    'use strict';

    // 结果浮层
    var rewardBox = document.getElementById('rewardBox');
    var resultBad = document.getElementById('resultBad');
    var resultGood = document.getElementById('resultGood');
    var resultBadBox = document.getElementById('resultBadBox');
    var resultGoodBox = document.getElementById('resultGoodBox');

    // 登录浮层
    var loginBox = document.getElementById('loginBox');
    var hiddenVars = {};
    $('input[type=hidden]').each(function (index, elem) {
        hiddenVars[elem.id] = elem.value;
    });

    // 关闭登录浮层
    $('.login-colse').on('touchstart', function () {
        loginBox.style.display = 'none';
    });

    // 禁止滑动
    var noScroll = true;
    function Scroll(ev) {
        if (noScroll) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
    document.addEventListener('touchmove', Scroll, false);

    // 立即领取
    var getBtn = document.getElementById('getBtn');

    // 给个开关避免多次点击发送多次积分获取。后台没有对并发请求进行处理。
    var sendAble = true;

    /**
     * [getReward 领取奖品]
     * @param  {[number]} score [传积分参数]
     */
    function getReward(score) {
        if (sendAble) {
            sendAble = false;
            $.ajax({
                url: '//m.fang.com/huodongAC.d?m=getPoints&class=FindRoomHc',
                type: 'POST',
                dataType: 'json',
                data: {score: score},
                success: function (data) {
                    sendAble = true;
                    if (data.root.code === '0') {
                        resultGoodBox.style.display = 'none';
                        rewardBox.style.display = 'block';
                        showMsg(data.root.msg);
                    }else if(data.root.code === '1') {
                        showMsg(data.root.msg);
                    }else{
                        showMsg(data.root.msg);
                    }
                },
                error: function () {
                    sendAble = false;
                }
            });
        }
    }

    // 如果数字小于10，补0凑成双位数
    function toDou(num) {
        return num < 10 ? '0' + num : num;
    }

    /**
     * 游戏部分
     */
    var gameArea = document.getElementById('gameArea'),
        gameTime = document.getElementById('gameTime'),
        playerScore = document.getElementById('playerScore'),
        fangContent = document.getElementById('fangContent'),
        startMask = document.getElementById('startMask'),
        startBtn = document.getElementById('startBtn'),
        note = document.getElementById('note'),
        gun = document.getElementById('gun'),
        countDown = document.getElementById('countDown'),
        gameTimer = null,
        countTimer = null,
        sameImg = '//static.soufunimg.com/common_m/m_activity/findDiffLogo/images/zfz-flower.png',
        diffImg = '//static.soufunimg.com/common_m/m_activity/findDiffLogo/images/zfz-fang.png',
        stage = 2,
        score = 0;

    // 点击开始游戏按钮后进行倒计时
    // 倒计时结束后，startGame()开始游戏
    startBtn.ontouchstart = function () {
        startBtn.style.display = 'none';
        countDown.style.display = 'block';
        countDown.innerHTML = 3;
        var countDownNum = 3;
        countTimer = setInterval(function () {
            countDownNum--;
            console.log(countDownNum);
            if (countDownNum > 0) {
                countDown.innerHTML = countDownNum;
            } else {
                startMask.style.display = 'none';
                clearInterval(countTimer);
                startGame();
            }
        }, 1000);
    };

    // 游戏开始
    function startGame() {
        // 定时器，游戏限定30秒
        var time = 10;
        gameTimer = setInterval(function () {
            time--;
            gameTime.innerHTML = toDou(time);
            if (time === 0) {
                noScroll = false;
                clearInterval(gameTimer);
                gameArea.style.display = 'none';
                score = stage - 3;
                if (score > 2) {
                    // 如果得分大于5关
                    resultGood.innerHTML = score;
                    resultGoodBox.style.display = 'block';
                    getBtn.ontouchstart = function () {
                        if (hiddenVars.isLogin === 'off') {
                            loginBox.style.display = 'block';
                        }else{
                            getReward(score);
                        }
                    };
                } else {
                    // 如果得分小于5关
                    resultBad.innerHTML = score;
                    resultBadBox.style.display = 'block';
                }
            }
        }, 1000);

        // 绑定点击事件，
        // 如果点击目标的id为firstPic，则开始游戏
        // 否则点击目标的id为diffImg，则认为没找到那张不同的图片，播放错误声音
        fangContent.addEventListener('touchstart', function (e) {
            if (e.target && e.target.id === 'firstPic') {
                scoreImage();
            }
            if (e.target && e.target.id !== 'diffImg') {
                playSfx(gun);
            }
        }, false);

        // 播放音频，先暂停，后播放
        function playSfx(audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }

        // 准备图片
        function scoreImage() {
            // 先隐藏图片容器，准备好后再显示，以实现CSS3动画的重复渲染
            fangContent.style.display = 'none';

            // 因为第1关3格，第2关4格，所以关卡减2为得分
            playerScore.innerHTML = stage - 2;
            // 关卡+1
            stage++;
            // 计算关卡的二次幂
            var count = Math.pow(stage, 2);
            // 清空要贫家的字符串
            var imgDOMStr = '';
            // 计算图片的百分数宽度
            var imgWidth = (100 / stage) + '%';
            // 循环拼接图片HTML
            for (var j = 0; j < count; j++) {
                imgDOMStr += '<img src="' + sameImg + '" style="width:' + imgWidth + '">';
            }
            // 往图片容器插入图片
            fangContent.innerHTML = imgDOMStr;

            // 随机的某个图片改成diffImg
            var ranNum = Math.floor(Math.random() * count);
            var imgTem = fangContent.children[ranNum];
            imgTem.src = diffImg;
            imgTem.id = 'diffImg';
            // 给这个diffImg绑定点击事件
            imgTem.ontouchstart = function () {
                scoreImage();
                playSfx(note);
            };
            // 伪异步显示容器以重新渲染CSS3动画
            setTimeout(function () {
                fangContent.style.display = 'block';
            }, 0);
        }
        // 游戏开始时，初始化3*3图片，因为初始stage=2
        scoreImage();
    }

    /**
     * 登录
     */
    /**
     * 数字补全
     * @param num 数字
     * @returns {string} 两位数字
     */
    
    // 手机号和验证码的验证正则
    var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i,
        codeReg = /^\d{4}$/;
    // 获取验证码
    var getPhoneVerifyCode = window.getPhoneVerifyCode;
    var getCode = $('#getCode'),
        phone = $('#phone');

    // 设置获取验证码开关
    var allowGet = true;
    var timeCount = 60;
    var loginTimer = null;

    /**
     * 倒计时
     */
    function updateTime() {
        allowGet = false;
        getCode.val('重新发送(' + toDou(timeCount) + ')');
        clearInterval(loginTimer);
        loginTimer = setInterval(function () {
            timeCount--;
            getCode.val('重新发送(' + toDou(timeCount) + ')');
            if (timeCount < 0) {
                clearInterval(loginTimer);
                getCode.val('获取验证码');
                timeCount = 60;
                allowGet = true;
            }
        }, 1000);
    }

    // 获取验证码
    getCode.on('touchstart', function () {
        if (allowGet) {
            var phonestr = phone.val().trim();
            if (!phonestr) {
                showMsg('请输入手机号');
            }else if (!phoneReg.test(phonestr)) {
                showMsg('请输入正确的手机号');
            }else{
                getCode.html('60S后获取');
                // 调用获取验证码插件
                getPhoneVerifyCode(phonestr, function () {
                    showMsg('验证码发送成功，请注意查收');
                    updateTime();
                }, function (msg) {
                    showMsg(msg);
                });
            }
        }
    });

    // 登录提交
    var sign = $('#loginBtn'),
        code = $('#code');
    var sendVerifyCodeAnswer = window.sendVerifyCodeAnswer;

    // 验证码清空
    code.focus(function () {
        $(this).val('');
    });

    // 登录
    sign.on('touchstart', function (ev) {
        ev.stopPropagation();
        var phonestr = phone.val().trim();
        var codestr = code.val().trim();
        if (!phonestr) {
            showMsg('请输入手机号');
        }else if (!phoneReg.test(phonestr)) {
            showMsg('请输入正确的手机号');
        }else if (!codestr) {
            showMsg('请输入验证码');
        }else if (!codeReg.test(codestr)) {
            showMsg('验证码错误');
        }else{
            hiddenVars.isLogin = phonestr;
            $('#isLogin').val(phonestr);
            sendVerifyCodeAnswer(phonestr, codestr, function () {
                loginBox.style.display = 'none';
                showMsg('登录成功');
            }, function (msg) {
                showMsg(msg);
            });
        }
    });

    $('.z-login').find('input').on('focus', function () {
        var $this = $(this);
        setTimeout(function () {
            $('html,body').scrollTop($this.offset().top - 100);
        },1000);
    });

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    var msg = $('#msg'),
        msgP = msg.find('p'),
        timer = null,
        winH = $(window).height();

    function showMsg(text, time, callback) {
        text = text || '信息有误！';
        time = time || 1500;
        msgP.html(text);
        msg.fadeIn().css({
            position: 'absolute',
            top: $(document).scrollTop() + winH / 2
        });
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.fadeOut();
            callback && callback();
        }, time);
    }
});