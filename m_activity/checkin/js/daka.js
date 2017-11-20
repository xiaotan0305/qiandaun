/*
 * @File: daka
 * @Author: yangfan
 * @Create Time: 2016-05-05 16:26:26
 * @description: 全民打卡活动
 * @Last modified by:   yangfan
 * @Last Modified Time: 2016-05-16 17:56:43
 */

$(function () {
    'use strict';

    /**
     * 打卡成功显示信息配置表
     * @type {Array}
     */
    var successMessage = [{
        prize: '5积分',
        prompt: '打卡成功！您已打卡1天<br>大礼在后面哦!',
        link: 'http://m.store.fang.com/'
    }, {
        prize: '15积分',
        prompt: '打卡成功！您已打卡2天<br>大礼在后面哦!',
        link: 'http://m.store.fang.com/'
    }, {
        prize: '20积分',
        prompt: '打卡成功！您已打卡3天<br>胜利就在前方!',
        link: 'http://m.store.fang.com/'
    }, {
        prize: '1200元装修礼包',
        prompt: '打卡成功！您已打卡4天<br>大奖即将属于你!',
        link: 'http://coupon.fang.com/m/MyCoupon.html'
    }, {
        prize: '100积分',
        prompt: '恭喜您完成5天打卡<br>100积分归你啦!',
        link: 'http://m.store.fang.com/'
    }];

    /**
     * num 后台变量：已经打卡天数
     * status 后台变量：on 已登录 off 未登录
     * timeStatus 后台变量：old 今天已打卡 new 今天未打卡
     * @type {[type]}
     */
    var num = $('#num'),
        timeStatus = $('#timestatus'),
        status = $('#status');
    // 蒙层变量
    var cover = $('.js_cover'),
        // $window = $(window),
        freezePage = false;
    // var initWinHeight = $window.height();

    /**
     * 页面初始化
     * 1、已打卡天数 hasReceivePrize
     * 2、今天已打卡，打卡屏蔽
     * 3、今天未打卡，打卡开启，绑定打卡事件标识 js_success_btn
     * 4、屏蔽未来的打卡
     */
    function init() {
        var day = num.val();
        var isOld = timeStatus.val();
        hasReceivePrize('li:lt(' + day + ')');

        if (isOld === 'old') {
            // $('li:eq(' + (day - 1) + ') > a').addClass('js_success_btn');
            $('li:eq(' + day + ')').addClass('weilai');
        } else {
            $('li:eq(' + day + ') > a').addClass('js_success_btn').
            find('img').attr('src', replaceIMGSrc);
        }

        $('li:gt(' + day + ')').addClass('weilai');
    }
    init();

    /**
     * 绑定打卡事件
     * 1、未登录，显示登录框
     * 2、已经打开，直接显示打卡成功信息（目前该功能无效，没有此需求，已注释）
     * 3、已登录，未打卡，进行打卡请求
     */
    $('.js_success_btn').on('click', function () {
        var isOld = timeStatus.val(),
            notLogin = status.val();

        if (notLogin === 'off') {
            showLoginBox();
            return false;
        }

        if (isOld === 'old') {
            // showSuccessBox(day - 1);
            return false;
        }

        getNumPrize();
        return false;
    });

    /**
     * 请求打卡，
     * 0 打卡成功，更新当前打卡为已打卡状态，无法再次点击。
     * 1 已经打过卡，正常情况，已经打卡成功，status.val() === 'old' 不会再进入该方法。
     * 特例：sansum note 3 app 中跳转到商城返回后状态还是可打卡状态，所以再点击打卡时，再更新一次状态。
     */
    function getNumPrize() {
        var day = num.val();
        var nextDay = day - 0 + 1;
        var url = 'http://' + window.location.hostname + '/huodongAC.d?m=getNumPrize&class=CheckInHc&num=' + nextDay;
        $.get(url, function (data) {
            var dataRoot = JSON.parse(data).root;
            if (dataRoot.code === '0') {
                updatePageStatus(day, nextDay);
                showSuccessBox(day);
            } else {
                updatePageStatus(day, nextDay);
                showMsg(dataRoot.msg);
            }
        });
    }

    /**
     * 更新打卡状态
     * @param  {int} day     已经打卡天数
     * @param  {int} nextDay 明天进入页面时，已经打卡天数
     */
    function updatePageStatus(day, nextDay) {
        hasReceivePrize('li:eq(' + day + ')');
        // 更新页面状态
        num.val(nextDay);
        timeStatus.val('old');
    }

    /**
     * 当前打卡条目更新样式为 yiling
     * @param  {$}  pSelector 当前打卡条目 jq 对象
     */
    function hasReceivePrize(pSelector) {
        var $selector = $(pSelector);
        $selector.removeClass().addClass('yiling');
        $selector.find('span:first').removeClass().addClass('yiling');
        $selector.find('span:last').text('已领取');
        $selector.find('img').attr('src', replaceIMGSrc);
    }

    /**
     * 更新图片，已打卡和未打卡是不同图片
     * @param  {int} index
     * @param  {string} value 图片 src 字符串
     */
    function replaceIMGSrc(index, value) {
        var name = value.replace(/.*\/([^\/]+)\..+/, '$1').replace(/\d/g, '');
        var rex = /^(.*\/)?[^\/]+\.(png|gif|jpe?g)$/i;
        var exp = '$1' + name + '.$2';
        return value.replace(rex, exp);
    }

    /**
     * 弹出规则对话框，冻结页面不可滑动
     */
    $('.js_ruler_btn').on('click', function () {
        coverShow($('.js_ruler'));
        freezePage = true;
    });

    /**
     * 关闭按钮关闭对话框
     */
    $('.js_close').on('click', function () {
        closeBox();
    });

    /**
     * 显示登录框
     */
    function showLoginBox() {
        coverShow($('.js_prize'));
        freezePage = true;
    }

    /**
     * 显示打卡成功对话框
     */
    function showSuccessBox(index) {
        var box = $('.js_success');
        coverShow(box);
        box.find('p').html(successMessage[index].prompt).
        next('a').attr('href', successMessage[index].link);
        freezePage = true;
    }

    /**
     * 显示浮层
     */
    function coverShow(box) {
        var htmlHeight = $(document).height();
        cover.css('position', 'absolute').height(htmlHeight).show();
        box.css('top', $(window).scrollTop() + htmlHeight / 4).show();
    }

    /**
     * 关闭对话框
     */
    function closeBox() {
        cover.hide().find('>div').hide();
        freezePage = false;
    }

    /**
     * 根据冻结页面标识，判断页面是否可以滑动
     */
    $(document).on('touchmove', function (e) {
        if (freezePage) {
            e.preventDefault();
        }
    });


    // 解决bug(输入法盖住输入框、弹出输入法)
    // $(window).on('resize', function () {
    //     if (thisHeight < initWinHeight) {
    //     } else {
    //     }
    // });

    // 点击浮层关闭对话框，效率较低。
    // $('.js_cover').on('click', function (e) {
    //     var $target = $('.js_prize, .js_success, .js_ruler');
    //     if (!$target.is(e.target) && $target.has(e.target).length === 0) {
    //         closeBox();
    //     }
    // });

    /**
     *  发送验证码部分
        phoneRegEx 电话号码正则,
        allowGet 可以请求短信验证码标识,
        smsLogin 短信验证码 js 对象,
        smsTimer 请求 timer ,
        smsDelay 请求间隔,
        smsPhone 电话号码输入框 jq 对象,
        smsBtn 发送验证码 jq 对象,
        smsPhoneValue 电话号码值,
        smsCode 验证码输入框 jq 对象,
        smsCodeValue 验证码值,
        loginBtn 登录按钮 jq 对象;
     */
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
        loginBtn = $('.js_login');

    /**
     * 更新验证码倒计时时间
     * 1、更改是否可以请求验证码标识
     * 2、更改倒计时时间
     * 3、重置时间、状态等
     */
    function updateSmsDelay() {
        allowGet = false;
        smsBtn.html(getDelayText(smsDelay));
        clearInterval(smsTimer);
        smsTimer = setInterval(function () {
            smsDelay--;
            smsBtn.html(getDelayText(smsDelay));
            if (smsDelay < 0) {
                clearInterval(smsTimer);
                smsBtn.html('发送验证码');
                smsDelay = 60;
                allowGet = true;
            }
        }, 1000);

        function getDelayText(second) {
            return '重新发送(' + (100 + second + '').substr(1) + ')';
        }
    }

    /**
     * 点击请求验证码按钮，根据状态给予相应提示
     * 最后发送验证码，成功，防止恶意请求，延迟一分钟倒计时。失败，提示。
     */
    smsBtn.on('click', function () {
        if (!allowGet) {
            showMsg('请一分钟以后再试');
            return false;
        }
        smsPhoneValue = smsPhone.val().trim();

        if (!smsPhoneValue) {
            showMsg('手机号不能为空');
            return false;
        }

        if (!phoneRegEx.test(smsPhoneValue)) {
            showMsg('手机号格式不正确');
            return false;
        }

        smsLogin.send(smsPhoneValue, function () {
            showMsg('验证码已发送,请注意查收');
            updateSmsDelay();
        }, function (err) {
            showMsg(err);
        });
        return false;
    });

    /**
     * 点击登录按钮，根据状态给予提示
     * 最后检查验证码，登录成功，跳转，或提示错误信息。
     */
    loginBtn.on('click', function () {
        smsPhoneValue = smsPhone.val().trim();
        if (!smsPhoneValue || !phoneRegEx.test(smsPhoneValue)) {
            showMsg('手机号为空或格式不正确');
            return false;
        }
        smsCodeValue = smsCode.val().trim();
        if (!smsCodeValue || smsCodeValue.length < 4) {
            showMsg('验证码为空或格式不正确');
            return false;
        }
        smsLogin.check(smsPhoneValue, smsCodeValue, function () {
            showMsg('登录成功', urlReload());
        }, function (err) {
            showMsg(err);
        });
        return false;
    });

    /**
     * 进行跳转，避免读取缓存。
     */
    function urlReload() {
        window.location.href = window.location.href + '&r=' + Math.random();
    }

    /**
     * 信息弹层
     * @param text 文本内容
     * @param time 显示时间
     * @param callback 回调函数
     */
    var msgBox = $('.msg'),
        msgBoxTimer = null;

    function showMsg(pText, pTime, callback) {
        var text = pText || '信息有误！',
            time = pTime || 1500;
        msgBox.show().css({
            position: 'absolute',
            top: $(document).scrollTop() + $(document).height() / 4
        }).find('p').html(text);
        clearTimeout(msgBoxTimer);
        msgBoxTimer = setTimeout(function () {
            msgBox.hide();
            callback && callback();
        }, time);
    }
});
