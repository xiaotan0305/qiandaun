$(document).ready(function () {
    var isTest = '';
    if (location.host.indexOf('.test.') > -1) {
        isTest = 'test.';
    }

    $(document).on('touchmove', function (event) {
        event.preventDefault();
    });

    function playMusic() {
        // js play
        var bgm = document.querySelector('#bgm');
        bgm.play();

        // weixin play
        function audioAutoPlay(id) {
            document.addEventListener('WeixinJSBridgeReady', function () {
                id.play();
            }, false);
        }
        audioAutoPlay(bgm);

        var aMusic = $('.a-music');
        aMusic.on('click', function () {
            if (aMusic.hasClass('ring')) {
                aMusic.toggleClass('ring');
                bgm.pause();
            } else {
                aMusic.toggleClass('ring');
                bgm.play();
            }
        });
    }
    playMusic();

    /**
     * [transitionEnd 监听动画结束]
     * @param  {Function} callback [回调函数]
     * @return {[obj]}            [返回调用对象]
     */
    $.fn.transitionEnd = function (callback) {
        var events = ['webkitTransitionEnd', 'transitionend'],
            i, dom = this;

        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };

    var data = {};

    function getAnswer() {
        showMsg('加载中...');
        if (isLogin === 'on') {
            $.ajax({
                // url: '//m.' + isTest + 'fang.com/huodongAC.d?m=getInfo&class=LookBack2016Hc',
                url: '//' + location.host + '/huodongAC.d?m=getInfo&class=LookBack2016Hc',
                type: 'post',
                dataType: 'json'
            })
            .done(function (res) {
                data = res;
                bindStart();
            })
            .fail(function (res) {
                console.log('error', res);
                showMsg('网络错误，请刷新重试。');
            });
        }
    }

    var isLogin = $('#isLogin').val();
    var login = $('#login');
    function checkLogin() {
        $('#start').on('click', function () {
            if (isLogin === 'off') {
                login.css('display', 'block');
                $('.phone').focus();
                $.getScript('//static.' + isTest + 'soufunimg.com/common_m/m_activity/public/jslib/phoneCheckout/phoneCheckout.js');
                bindLogin();
            }else {
                getAnswer();
                bindSlide();
            }
        });
    }
    checkLogin();
    function bindStart() {
        if (data.answercount !== '0') {
            $('.page1').hide();
            $('.page2').show();
            $('#firstQ').find('span').html(data.firstanswer.asktitle.length > 20 ? data.firstanswer.asktitle.substr(0, 20) + '...' : data.firstanswer.asktitle);
            $('#firstA').find('span').html(data.firstanswer.answer.length > 60 ? data.firstanswer.answer.substr(0, 60) + '...' : data.firstanswer.answer);
            $('.user').find('i').html(data.nickname);
            $('.user').find('img').attr('src', data.photourl.replace(/\\/g, '/'));
            var timeArr = data.firstanswer.answerdate.split('/');
            $('#firstATime').html(timeArr[0] + '年' + timeArr[1] + '月' + timeArr[2] + '日');
            $('#totalA').html(data.answercount);
            $('#helpCount').html(data.browseCount);
            $('#goodACount').html(data.goodanswercount);
            $('#firstGoodQ').find('span').html(data.firstgoodanswer.asktitle.length > 20 ? data.firstgoodanswer.asktitle.substr(0, 20) + '...' : data.firstgoodanswer.asktitle);
            $('#firstGoodA').find('span').html(data.firstgoodanswer.answer.length > 60 ? data.firstgoodanswer.answer.substr(0, 60) + '...' : data.firstgoodanswer.answer);
            if (data.goodanswercount === '0') {
                $('#noAnswer3').html('<p class="title">很可惜，您还没有回答被推荐。别气馁，2017我们期待您的精彩回答。</p>');
            }
            setId();
        } else {
            $('.page1').hide();
            $('.page2').show();
            $('#noAnswer1').html('<p class="title">很遗憾，2016你没有回答过问题，但你一定在问答中收获不少房产知识。别观望啦，3000万问答星人正在等你的帮助。</p>');
            $('#noAnswer2').html('<p class="title">2016年，在这里有500万用户积极参与问答，帮助了6504487名问答星人，获得了55648897积分。助人为乐还有积分赚！你也快点加入吧</p>');
            $('#noAnswer3').html('<p class="title">2016年，房天下问答曾为你准备了6个活动，共有20290名问答星人参与其中，共发放了1244960的积分奖励。2016年，我们没有等到你，2017，期待你的参与。</p>');
            $('.page5').remove();
            $('.page6').remove();
            setId();
        }
    }

    function setId() {
        $('.page').each(function (index, ele) {
            $(ele).attr('id', ++index);
        });
    }

    // about Login
    // 登录相关
    function bindLogin() {
        // DOM of Login
        var getCode = $('#getCode'),
            phone = $('#phone'),
            code = $('#code');

        // allowGetcode、Login timeCounter & timer
        var allowGet = true,
            timeCount = 60,
            verifyTimer = null;

        // Reg of Phone & vCode
        var phoneNumReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/,
            codeReg = /^\d{4}$/;

        // update timeCounter
        function updateTime() {
            allowGet = false;
            clearInterval(verifyTimer);
            verifyTimer = setInterval(function () {
                timeCount--;
                getCode.val('(' + timeCount + ')');
                if (timeCount < 0) {
                    clearInterval(verifyTimer);
                    getCode.val('获取验证码');
                    timeCount = 60;
                    allowGet = true;
                }
            }, 1000);
        }

        // getCode Click Event
        getCode.on('click', function (ev) {
            ev.stopPropagation();
            if (allowGet) {
                var phoneNum = phone.val().trim();
                if (!phoneNum) {
                    showMsg('手机号不能为空');
                    return false;
                }
                if (!phoneNumReg.test(phoneNum)) {
                    showMsg('请正确输入手机号');
                    return false;
                }
                getCode.val('准备发送').show();

                // use public login util
                getPhoneVerifyCode(phoneNum, function () {
                    showMsg('验证码发送成功，请注意查收');
                    updateTime();
                }, function (msg) {
                    showMsg(msg);
                    getCode.val('获取验证码');
                });
            }
        });

        // loginSubmit Click Event
        $('#loginBtn').on('click', function (ev) {
            ev.stopPropagation();
            var phoneNum = phone.val().trim();
            var codeNum = code.val().trim();
            if (!phoneNum) {
                showMsg('手机号不能为空');
                return false;
            }
            if (!phoneNumReg.test(phoneNum)) {
                showMsg('请正确输入手机号');
                return false;
            }
            if (!codeNum) {
                showMsg('请输入验证码');
                return false;
            }
            if (!codeReg.test(codeNum)) {
                showMsg('验证码输入错误');
                return false;
            }

            // Login Successful or not
            sendVerifyCodeAnswer(phoneNum, codeNum, function () {
                showMsg('登录成功');
                login.fadeOut();
                $('#isLogin').val('on');
                isLogin = 'on';
            }, function (msg) {
                showMsg(msg);
            });
            return true;
        });

        $('#close').on('click', function () {
            login.hide();
        });
    }

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
        msg.show().css({
            position: 'absolute',
            top: $(document).scrollTop() + winH / 2
        });
        clearTimeout(timer);
        timer = setTimeout(function () {
            msg.hide();
            callback && callback();
        }, time);
    }

    function toggles() {
        $('#firstMore').on('click', function () {
            $(this).toggleClass('reverse');
            $('#firstQ').toggleClass('max2');
            $('#firstA').toggle();
        });

        $('#firstGoodM').on('click', function () {
            $(this).toggleClass('reverse');
            $('#firstGoodQ').toggleClass('max2');
            $('#firstGoodA').toggle();
        });

        $('#wholeM').on('click', function () {
            $(this).toggleClass('reverse');
            $('#wholeD').toggleClass('max4');
        });
    }
    toggles();

    function bindSlide() {
        var slide = $('.page:not(".page1")');
        var pos = {
            startY: 0,
            endY: 0
        };
        var touchAble = true;
        slide.on('touchstart', function (event) {
            var ev = event.originalEvent.changedTouches[0];
            pos.startY = ev.clientY;
        }).on('touchmove', function (event) {
            var ev = event.originalEvent.changedTouches[0];
            pos.endY = ev.clientY;
        }).on('touchend', function () {
            console.log(pos.endY - pos.startY);
            if (pos.endY === 0) {
                pos.endY = pos.startY;
            }
            if (!touchAble) {
                return;
            }
            if (pos.endY - pos.startY < -50) {
                if ($(this).hasClass('page7')) {
                    return;
                }
                touchAble = false;
                $(this).removeClass('zoomInUp').addClass('zoomOutUp').transitionEnd(function () {
                    $(this).hide();
                    touchAble = true;
                    // alert('done.');
                });

                $('#' + (this.id * 1 + 1)).show();
            } else if (pos.endY - pos.startY > 50) {
                if (this.id === '2') {
                    return;
                }
                touchAble = false;
                $('#' + (this.id * 1 - 1)).show(100, function () {
                    $(this).removeClass('zoomOutUp').addClass('zoomInUp').transitionEnd(function () {
                        $('#' + (this.id * 1 + 1)).hide();
                        touchAble = true;
                        // alert('done.');
                    });
                });

                $('#' + (this.id * 1 - 1)).css('display', 'block').removeClass('zoomOutUp').addClass('zoomInUp').transitionEnd(function () {
                    $('#' + (this.id * 1 + 1)).hide();
                    touchAble = true;
                    // alert('done.');
                });
            }
            pos.endY = 0;
        });
    }

    // 微信、QQ分享
    var weixin = new Weixin({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        shareTitle: '2016我的问答回忆录',
        descContent: '回顾2016，看看你在问答里获得了哪些成就？',
        swapTitle: true,
        lineLink: location.href,
        imgUrl: location.protocol + '//static.' + isTest + 'soufunimg.com/common_m/m_activity/QAMemory/images/share.png'
    });

    // APP分享
    var dataForWeixin = {
        title: '2016我的问答回忆录',
        desc: '回顾2016，看看你在问答里获得了哪些成就？',
        url: location.href,
        TLImg: location.protocol + '//static.' + isTest + 'soufunimg.com/common_m/m_activity/QAMemory/images/share.png'
    };
    $('#soufunclient').html('1$' + dataForWeixin.desc + '$' + dataForWeixin.url + '$' + dataForWeixin.TLImg);
});
