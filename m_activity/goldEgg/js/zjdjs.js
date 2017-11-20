$(function(){
    var phoneRegEx = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i,
        allowGet = true,
        smsLogin = window.smsLogin,
        smsTimer = null,
        smsDelay = 60,
        smsPhone = $('.js_sms_phone'),
        smsBtn = $('.js_sms_btn'),
        smsPhoneValue = '',
        smsCode = $('.js_sms_code'),
        smsCodeValue = '',
        loginBtn = $('.js_login'),
        loginBox = $('.loginBox');
    var jqFloat = $('.float'),
        isLogin = $('.isLogin').val() ,
        lotteryId = $('#lotteryId').val(),
        lotteryStatus = $('.lotteryStatus').val(),
        mainSite = $('#mainSite').val(),
        requiredLogin = $('.requiredLogin').val(),
        isApp = $('.isApp').val();
    var IScroll = window.IScrollLite;
    var Config = {
        page: {
            login: jqFloat.eq(0),
            ruler: jqFloat.eq(1),
            isOther: jqFloat.eq(2),
            notOther: jqFloat.eq(3),
            suprise: jqFloat.eq(4),
            disappoint: jqFloat.eq(5),
            activityEnd: jqFloat.eq(6),
            loadToast: jqFloat.eq(7),
            tancengLQ:jqFloat.eq(8),
            mengcengLQ:jqFloat.eq(9)


        },
        ele: {
            span:jqFloat.eq(2).find('span')
        },
        class: {
            EggCracked: 'lie',
            EggBroken: 'sui'
        },
        button: {
            close: $('.close'),
            verificationCode: $('.btnYzm'),
            login: $('.btnLogin'),
            myPriz: $('.myPri'),
            see: $('.see'),
            ruler: $('.gameRule'),
            replay: $('.again'),
            receive: $('.get')
        },
        hammerTopList: [-1.5, -1.5 + 4.5 + 0.3, -1.5 + 4.5 * 2 + 0.3 * 2], // width + margin
        hammerLeftList: [3.5, 3.5 + 4.25 + 0.54 * 2, (4.25 + 0.54 * 2) * 3 - 3.5 - 3.1], // 2
        hammer: $('.hammer'),
        eggs: $('.main li'),
        playing: false
    };
    var getPrize = {
        isGetPrize: '',
        pName: '',
        param: {},
        hitText: '',
        hitgImageUrl:''
    },Flag = {
        receivePrize: true,
        getPrize:true
    },currentBtn = '';
    var toggleTouchmove = (function () {
        function preventDefault(e) {
            e.preventDefault();
        }
        return function (unable) {
            document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
        };
    })();
    pageInit();
    function pageInit() {
         // 判断当前活动是否已经结束
        if(isApp === 'true') {
            Config.page.activityEnd.find('.f14').text('请前往房天下APP参与');
            Config.page.activityEnd.find('.f14').prev().text('该活动只能在APP上玩哦');
            Config.page.activityEnd.show();
            toggleTouchmove(true);
            return;
        }
        if(lotteryStatus === 'doing') {
            eventInit();
        } else if(lotteryStatus === 'start') {
            Config.page.activityEnd.find('.f14').text('活动还没开始哦~');
            Config.page.activityEnd.find('.f14').prev().text('您来早了');
            Config.page.activityEnd.show();
            toggleTouchmove(true);
        } else if(lotteryStatus === 'end') {
            Config.page.activityEnd.find('.f14').text('活动已经结束了哦~');
            Config.page.activityEnd.find('.f14').prev().text('您来晚了');
            Config.page.activityEnd.show();
            toggleTouchmove(true);
        }
    }
    function eventInit() {
        // 砸金蛋全过程
        Config.eggs.on('click', function (e){
            var $ele = $(this);
            if(isLogin === 'false' && requiredLogin === 'true' && document.cookie.indexOf('sfut') <= -1) {
                currentBtn = 'requiredLogin';
                smsPhone.val('');
                smsCode.val('');
                Config.page.login.show();
                toggleTouchmove(true);

            } else {
                lotteryStatus === 'doing' && !Config.playing && Flag.getPrize && $.when(brokenGoldEgg(e,$ele),getPrizeAjax()).done(function () {
                    if(getPrize.isGetPrize === 'true') {
                        currentBtn = 'receivePrize';
                        // 修改提示文案和背景图片
                        if(getPrize.hitgImageUrl) {
                            var fragment = '<div class="floatTop2"></div>';
                            // $(fragment).css('background-image',getPrize.hitgImageUrl);
                            Config.page.suprise.find('.bgImg').html($(fragment));
                            Config.page.suprise.find('.bgImg .floatTop2').css( {
                                background: 'url(' + getPrize.hitgImageUrl + ') no-repeat',
                                'background-size': '100%'
                            });
                        }
                        getPrize.hitText && Config.page.suprise.find('.getBox2 p').eq(0).text(getPrize.hitText);
                        Config.page.suprise.find('.getBox2 span').text(getPrize.pName);
                        Config.page.suprise.show();
                    } else {
                        Config.page.disappoint.show();
                    }
                    toggleTouchmove(true);
                    Config.hammer.removeClass('swinging_left swinging_right').fadeOut(100);
                }).fail(function () {
                    alert('网络不稳定，稍后再试');
                });
            }
        });

        // 敲打动画结束
        Config.hammer.on('webkitAnimationEnd', function () {
            $(this).removeClass('swinging_left swinging_right').fadeOut(100);
        });
        // 点击关闭按钮登录浮层，活动规则浮层，领取成功浮层，领取成功带按钮浮层
        Config.button['close'].on('click', function (e) {
            e.stopPropagation();
            var par = $(this).parents('.float');
            var index = par.index('.float');
            jqFloat.hide();
            if(index === 2 || index === 3) {
                window.location.href = location.href + '&ran=' + parseInt(Math.random());
            }
            Config.eggs.removeClass(Config.class.EggBroken);
            toggleTouchmove(false);
        });

        // 活动规则浮层打开
        Config.button['ruler'].on('click', function(e) {
            e.stopPropagation();
            if (Config.playing) {
                return false;
            }
            Config.page['ruler'].show();
            IScroll && new IScroll('#eggRule');
            toggleTouchmove(true);
        });

        // 再玩一次
        $('.again , .again2').on('click',function () {
            //window.location.href = location.href + '&ran=' + parseInt(Math.random());
            window.location.reload();
            toggleTouchmove(false);
        });
        //领取奖励按钮
        Config.button.receive.on('click',function () {
            if(isLogin === 'true' ||document.cookie.indexOf('sfut') > -1) {
                receivePrizeAjax();
            } else {
                Config.page.suprise.hide();
                smsPhone.val('');
                smsCode.val('');
                Config.page.login.show();
                toggleTouchmove(true);
            }
        });

        //点击我的奖品
        Config.button.myPriz.on('click',function () {
            if(isLogin === 'true' || document.cookie.indexOf('sfut') > -1) {
                location.href = location.protocol + mainSite  + '/huodongAC.d?m=getWinListSelf&class=HitGoldenEggsHc&lotteryId=' + lotteryId;
            } else {
                currentBtn = 'myPrize';
                smsPhone.val('');
                smsCode.val('');
                Config.page.login.show();
                toggleTouchmove(true);

            }
        });

        // 点击请求验证码按钮，根据状态给予相应提示
        // 最后发送验证码，成功，防止恶意请求，延迟一分钟倒计时。失败，提示。
        smsBtn.on('click', function () {
            if (!allowGet) {
                alert('请一分钟以后再试');
                return false;
            }
            smsPhoneValue = smsPhone.val().trim();

            if (!smsPhoneValue) {
                alert('手机号不能为空');
                return false;
            }

            if (!phoneRegEx.test(smsPhoneValue)) {
                alert('手机号格式不正确');
                return false;
            }
            smsLogin.send(smsPhoneValue, function () {
                //Config.page.loadToast.find('p').text('验证码发送成功~');
                //Config.page.loadToast.show();
                //setTimeout(function () {
                //    Config.page.loadToast.hide();
                //},2000);
                updateSmsDelay();
            }, function (err) {
                alert(err);
            });
            return false;
        });

        // 点击请求验证码按钮，根据状态给予相应提示
        // 最后发送验证码，成功，防止恶意请求，延迟一分钟倒计时。失败，提示。
        loginBtn.on('click', function () {
            smsPhoneValue = smsPhone.val().trim();
            if (!smsPhoneValue || !phoneRegEx.test(smsPhoneValue)) {
                alert('手机号为空或格式不正确');
                return false;
            }
            smsCodeValue = smsCode.val().trim();
            if (!smsCodeValue || smsCodeValue.length < 4) {
                alert('验证码为空或格式不正确');
                return false;
            }
            // 登录成功以后请求数据
            smsLogin.check(smsPhoneValue, smsCodeValue, function () {
                 Config.page.loadToast.find('p').text('登录成功~');
                Config.page.loadToast.show();
                setTimeout(function () {
                    loginBox.parent('.float').hide();
                    Config.page.loadToast.hide();
                    $('.isLogin').val('true');
                    if(currentBtn === 'receivePrize') {
                        receivePrizeAjax();
                    }
                    if(currentBtn === 'myPrize') {
                        location.href = location.protocol + mainSite  + '/huodongAC.d?m=getWinListSelf&class=HitGoldenEggsHc&lotteryId=' + lotteryId;
                        toggleTouchmove(false);
                    }
                    if(currentBtn === 'requiredLogin') {
                        location.href = location.href + '&ran=' + Math.random();
                    }
                },2000);

            }, function (err) {
                alert(err);
            });
            return false;
        });
    }

    /**
     * 砸金蛋的动画队列
     * @param e 事件对象
     * @param ele 点击对象
     * @returns {*} deferred延迟对象
     */
    function brokenGoldEgg(e,ele) {
        var dtd = $.Deferred();
        e.stopPropagation();
        Config.playing = true;
        var index = ele.index();
        var css = {},
            cls = 'swinging_left';
        if (index < 3) {
            css.top = Config.hammerTopList[0] + 'rem';
            css.left = Config.hammerLeftList[index] + 'rem';
        } else if(index < 6){
            css.top = Config.hammerTopList[1] + 'rem';
            css.left = Config.hammerLeftList[index - 3] + 'rem';
        } else if(index < 9){
            css.top = Config.hammerTopList[2] + 'rem';
            css.left = Config.hammerLeftList[index - 6] + 'rem';
        }

        if (index === 2 || index === 5 || index === 8) {
            cls = 'swinging_right'
            css.transform = 'rotateY(180deg)';
        } else {
            css.transform = 'initial';
        }
        // 锤子淡入动画结束后回调  敲打animation
        Config.hammer.css(css).fadeIn(100, function (){
            $(this).addClass(cls);
        });
        var jqThis = ele;
        var timer = setTimeout(function (){
            jqThis.addClass('lie').find('> div').addClass('crack').on('webkitAnimationEnd', function() {
                var jqThat = $(this);
                jqThat.removeClass('crack');
                jqThis.fadeOut(10, function (){
                    $(this).removeClass('lie').addClass('sui').fadeIn(10,function () {
                        setTimeout(function () {
                            Config.playing = false;
                            dtd.resolve();
                        },500);
                    });
                });
            });
        }, 1200);
        return dtd;
    }

    /**
     * 砸金蛋获取后台借口奖品
     */
    function getPrizeAjax() {

        var url = location.protocol + mainSite + '/huodongAC.d?m=hitEggsInfo&class=HitGoldenEggsHc&lotteryId=' + lotteryId;
        if(Flag.getPrize) {
            Flag.getPrize = false;
            return $.get(url,function (data) {
                Flag.getPrize = true;
                var root = JSON.parse(data).root;
                var pro;
                for(pro in root) {
                    getPrize[pro] = root[pro];
                }
            });
        }

    }

    /**
     * 领取奖励ajax
     */
    function receivePrizeAjax() {
        var url = location.protocol + mainSite + '/huodongAC.d?m=putEggsBase&class=HitGoldenEggsHc&lotteryId=' + lotteryId;
        if(Flag.receivePrize) {
            Flag.receivePrize = false;
            $.get(url,{param: getPrize.param},function (data) {
                var root = JSON.parse(data).root;
                Flag.receivePrize = true;
                Config.page.suprise.hide();
                if(root.isPutPrize && !root.errorDataBase) {
                    if(root.prizeType === 'other') {
                        Config.ele.span.text(root.pName);
                        Config.ele.span.parent().next().show();
                        Config.page.isOther.show();
                    } else {
                        Config.page.notOther.find('span').text(root.pName);
                        Config.button.see.attr('href',root.prizeUrl);
                        Config.page.notOther.show();

                    }
                } else {
                    if(root.mengcen) {
                        Config.page.mengcengLQ.find('p').text(root.message);
                        Config.page.mengcengLQ.show();
                        setTimeout(function() {
                            Config.page.mengcengLQ.hide();
                            location.href = location.href + '&ran=' + Math.random();
                        },2000);
                    } else {
                        Config.page.tancengLQ.find('p').text(root.message);
                        Config.page.tancengLQ.show();
                    }
                }
            });
        }
    }

    /**
     * 点击我的奖品获取后台请求借口
     */
    function myPrizeAjax() {

    }

    /**
     * 更新验证码倒计时时间
     * 1、更改是否可以请求验证码标识
     * 2、更改倒计时时间
     * 3、重置时间、状态等
     */
    function updateSmsDelay() {
        allowGet = false;

        smsBtn.text(getDelayText(smsDelay)).addClass('noClick');
        clearInterval(smsTimer);
        smsTimer = setInterval(function () {
            smsDelay--;
            smsBtn.text(getDelayText(smsDelay));
            if (smsDelay < 0) {
                clearInterval(smsTimer);
                smsBtn.text('获取验证码').removeClass('noClick');
                smsDelay = 60;
                allowGet = true;
            }
        }, 1000);

        function getDelayText(second) {
            return '(' + (100 + second + '').substr(1) + ')';
        }
    }

});