/**
 * Created by user on 2015/12/16.
 */
$(function () {
    'use strict';
    // 背景元素
    var $backGround = $('.shade');
// 结束提示元素
    var $stopTitle = $('.js_stop');
// 获奖弹框元素
    var $getPrzie = $('.js_getPrize');
// 获奖弹框元素
   // var $noGetPrzie = $('.js_noGetPrize');
// 获奖提示语
    var $getPrzieDiscription = $('.js_getPrizeDiscription');
// 奖品跳转地址
    var $prizeUrl = $('.js_prizeUrl');
// 不能摇奖的理由描叙元素
    var $noWinReason = $('.js_noWinReason');
// 不能摇奖弹层的确定按钮元素
    var $noWinAction = $('.js_noWinAction');
// 不能摇奖弹层取消按钮元素
    var $noWinCancel = $('.js_noWinCancel');
// 没中奖弹出浮层元素
    var $noWinTitle = $('.js_noWinTitle');
// 所以浮层元素
    var $tkBox = $('.tkBox');
// 叉叉按钮元素
    var $closeButton = $('.closeBtn');
// 抽奖剩余次数
    var $playNumber = $('.js_playNumber');
// 我的中奖纪录
    var $myPrizeList = $('.js_myPrizeList');
// n积分多要一次按钮元素
    var $addPlayNumber = $('.js_addPlayNumber');
// 使用n积分多摇一次浮层元素
    var $addplayNumberTitle = $('.js_addplayNumberTitle');
// 消耗积分兑换摇奖次数确定元素
    var $shopPointAddplayNumber = $('.js_shopPointAddPlayNumber');
// 再摇一次元素
    var $playAgain = $('.js_playAgain');
// 新年签弹出层元素
    var $newYear = $('.newyear');
    var $closeNewYear = $('.closeBtn2');
// 新年签图片路径
    var $newYearImg = $('.js_newYearImg');
// 发送验证码按钮
    var $getCode = $('.js_getCode');
// 活动是否已经结束
    var $isStop = $('.js_isStop').val();
// 是否登陆
    var $isLogin = $('.js_isLogin').val();
// 活动id
    var $lotteryId = $('.js_lotteryId').val();
// 是否消耗积分增加次数
    var $isShopPoint = $('.js_isShopPoint').val();

    var isLogin = null;
    // 验证手机格式    手机错误警告
    var $phoneWarn = $('.js_phoneWarn');
    var $phone = $('.js_phone');
    // 验证码   验证码错误警告
    var $codeWarn = $('.js_codeWarn');
    var $code = $('.js_code');
    // 60秒读秒是否应该结束
    var readSecond = true;
    // 60秒是否正在读
    var isSending = false;
    //正在运行ajax
    var ajaxing = false;
    // 是否是跨年活动字段
    var iscrossYearstr = $('.cross_year_js').val();
    // 摇奖音乐控件

    var shakeMusicAudio = $('#shake_music_audio')[0];
    var targetMusicAudio = $('#target_music_audio')[0];

    var yyyShakeEvent = new Shake({
        // 可设置的摇动的强度
        threshold: 8,
        // 事件发生频率，可设置
        timeout: 400
    });
    yyyShakeEvent.start();

    function prepGame() {
       
        // 如果不消耗积分增加摇奖次数
        if ($isShopPoint === 'isShopPoint') {
            $addPlayNumber.show();
        }
        getCanPlayCount();
        // 活动未开始或已结束
        if ($isStop === 'notStart') {
            $backGround.show();
            $('.js_startOrNot').html("活动未开始");
            $stopTitle.show();
            return false; 
        }else if ($isStop === 'stopped') {
            $backGround.show();
            $stopTitle.show();
            return false;
        }
        window.addEventListener('shake', shakeEventDidOccur, false);

    }

    prepGame();

    // 获取用户可玩次数

    function getCanPlayCount() {
        var randomNumber = getRandom(100);
        $.ajax({
            url: '/huodongAC.d?m=getCanPlayCount&class=YaoyiyaoHc&lotteryId=' + $lotteryId + '&randomNumber=' + randomNumber,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var playCount = data.root.otherPlayNumber;
                if (playCount < 0) {
                    playCount = 0;
                }
                if (playCount >= 0 && playCount < 100) {
                    $playNumber.css({
                        'font-size': '1.5rem',
                        'margin-left': '8.0rem'
                    });
                }else if (playCount >= 100 && playCount <1000) {
                    $playNumber.css({
                        'font-size': '1.0rem',
                        'margin-left': '8.0rem'
                    });    
                }else {
                    $playNumber.css({
                        'font-size': '0.7rem',
                        'margin-left': '8.0rem'
                    });
                }
                $playNumber.html(playCount);
            }
        });
    }


    function shakeEventDidOccur() {
        if ($backGround.is(':hidden') && !ajaxing) {
            ajaxing = true;
            yaoyiyao();
        }
    }

// CSS ADD 2015/12/23

// 点击我的中奖纪录
    $myPrizeList.on('click', function () {
        var getsfut = getcookie('sfut');
        if (getsfut === null || getsfut === '' || getsfut == undefined) {
            login();
        } else {
            window.location.href = '/huodongAC.d?m=getWinList&class=YaoyiyaoHc&lotteryId=' + $lotteryId;
        }
    });
// 使用n积分多摇一次浮层
    $addPlayNumber.on('click', function () {
        $tkBox.hide();
        $backGround.hide();
        $backGround.show();
        $addplayNumberTitle.show();
    });
// 消耗积分兑换摇奖次数
    $shopPointAddplayNumber.on('click', function () {
        if (!ajaxing) {
            ajaxing = true;
            shopPointAddPalyNumber();
        }
    });
    // 是否有抽奖资格
    var canWin = null;
    // 不能抽奖的理由
    var noWinReason = null;
    var isGetPrize = null;
    var prizeName = null;
    var prizeType = null;
    var prizeUrl = null;
    // 剩余抽奖次数
    var otherPlayNumber = 0;
    // 对获得奖品的描叙
    var getPrizeTitle = null;
    // 产生的随机数，用于显示新年签
    var randomNumber = 1;
    // 新年图片
    var newYearImgUrl = null;
    var prizeparm = {};
    prizeparm.class = 'YaoyiyaoHc';
    prizeparm.m = 'choujiang';
    prizeparm.lotteryId = $lotteryId;
	prizeparm.single = $('#single').val() || '';
// 摇一摇主方法,用户是否中奖
    function yaoyiyao() {
        shakeMusicAudio.play();
        $.ajax({
            url: '/huodongAC.d',
            type: 'POST',
            data: prizeparm,
            dataType: 'json',
            success: function (data) {
                // var $lotteryUrl = '/huodongAC.d?m=choujiang&class=YaoyiyaoHc';
                // $.getJSON($lotteryUrl,{lotteryId:$lotteryId}, function(data) {
                canWin = data.root.canWin;
                noWinReason = data.root.noWinReason;
                isGetPrize = data.root.isGetPrize;
                prizeName = data.root.prizeName;
                prizeType = data.root.prizeType;
                prizeUrl = data.root.prizeUrl;
                otherPlayNumber = data.root.otherPlayNumber;
                if (otherPlayNumber < 0) {
                    otherPlayNumber = 0;
                }
                if (otherPlayNumber >= 0 && otherPlayNumber < 100) {
                    $playNumber.css({
                        'font-size': '1.5rem',
                        'margin-left': '8.0rem'
                    });
                }else if (otherPlayNumber >= 100 && otherPlayNumber <1000) {
                    $playNumber.css({
                        'font-size': '1.0rem',
                        'margin-left': '8.0rem'
                    });    
                }else {
                    $playNumber.css({
                        'font-size': '0.7rem',
                        'margin-left': '8.0rem'
                    });
                }
                isLogin = data.root.isLogin;
                $playNumber.html(otherPlayNumber);
                ajaxing = false;
                if (canWin) {
                    // 获得了奖品
                    if (isGetPrize) {
                        if (isLogin) {
                            if (prizeType == 'other' || prizeType == 'money' || prizeType == 'youhuiquan') {
                                getPrizeTitle = '恭喜您摇中' + prizeName;
                            }
                            if (prizeType == 'point') {
                                getPrizeTitle = '<p>恭喜您摇中' + prizeName + '</p><p>快来积分商城兑豪礼</p>';
                            }
                            $prizeUrl.attr('href', prizeUrl);
                            $getPrzieDiscription.html(getPrizeTitle);
                            $backGround.show();
                            $getPrzie.show();
                            targetMusicAudio.play();
                        } else {
                            // 没有登陆
                            $('.js_prizeName').html(prizeName);
                            readSecond = true;
                            $backGround.show();
                            $('.js_updatePhoneTitle').show();
                        }
                    } else {
                        // 没有获得奖品
                        if (iscrossYearstr === 'newYearActivity') {
                            $backGround.show();
                            $('.a_js_noGetPrize').html('返回首页');
                            $('.js_noGetPrize').show();
                        } else {
                            $('.a_js_noGetPrize').html('再摇一次');
                            newYearImgUrl = location.protocol+'//static.test.soufunimg.com/common_m/m_activity/yaoyiyao/images/';
                            randomNumber = getRandom(25);
                            newYearImgUrl = newYearImgUrl + randomNumber + '.jpg';
                            $newYearImg.attr('src',newYearImgUrl);
                            $backGround.show();
                            // $noGetPrzie.show();
                            $newYear.show();
                        }
                    }
                } else {
                    // 没有抽奖资格
                    if (noWinReason === 'stop') {
                        $backGround.show();
                        $stopTitle.show();
                        return false;
                    }

                    if (noWinReason === 'noStart') {
                        $backGround.show();
                        $('.js_startOrNot').html("活动未开始");
                        $stopTitle.show();
                        return false;
                    }
                    if (noWinReason === 'noFromAPP') {
                        $noWinReason.html('请先下载APP');
                        $noWinAction.on('click',function () {
                            window.location.href = 'http://m.fang.com/d/';
                            $noWinAction.off('click');
                        });
                        $backGround.show();
                        $noWinTitle.show();
                        return false;
                    }
                    if (noWinReason === 'noLogin') {
                        login();
                        return false;
                    }
                    if (noWinReason === 'noPlayCount') {
                        $noWinReason.html('您的抽奖机会已用完');
                        $backGround.show();
                        $noWinTitle.show();
                        $noWinAction.unbind();
                        if (iscrossYearstr === 'newYearActivity') {
                            $noWinAction.one('click', function () {
                                var backurlstr = location.protocol+'//' + window.location.host + '/huodongAC.d?class=NewYearOf2016Hc&m=newYearAcitvity';
                                location.replace(backurlstr);
                            });
                        } else {
                            $noWinAction.one('click', function () {
                                $backGround.hide();
                                $noWinTitle.hide();
                            });
                        }
                        return false;
                    }
                    if (noWinReason === 'hasGetPrize') {
                        $noWinReason.html('您已经中过奖了');
                        $backGround.show();
                        $noWinTitle.show();
                        $noWinAction.unbind();
                        if (iscrossYearstr === 'newYearActivity') {
                            $noWinAction.one('click', function () {
                                var backurlstr = location.protocol+'//' + window.location.host + '/huodongAC.d?class=NewYearOf2016Hc&m=newYearAcitvity';
                                location.replace(backurlstr);
                            });
                        } else {
                            $noWinAction.one('click', function () {
                                $backGround.hide();
                                $noWinTitle.hide();
                            });
                        }
                        return false;
                    }
                }
            }
        });
    }

    var pointparm = {};
    pointparm.class = 'YaoyiyaoHc';
    pointparm.m = 'shopPointAddPlayCount';
    pointparm.lotteryId = $lotteryId;

    // 消耗积分是否成功
    var shopPoint = null;

// 多少积分兑换一次摇奖机会
    function shopPointAddPalyNumber() {
        $.ajax({
            url: '/huodongAC.d',
            type: 'POST',
            data: pointparm,
            dataType: 'json',
            success: function (data) {
                // var $url = '/huodongAC.d?m=shopPointAddPlayCount&class=YaoyiyaoHc';
                // $.getJSON($url,{lotteryId:$lotteryId},function(data) {
                // 用户是否登陆
                isLogin = data.root.isLogin;
                // 消耗积分是否成功
                shopPoint = data.root.shopPoint;
                // 剩余抽奖次数
                otherPlayNumber = data.root.otherPlayNumber;
                $tkBox.hide();
                $backGround.hide();
                ajaxing = false;
                if (!isLogin) {
                    login();
                    return false;
                }
                if (shopPoint === 'notEnoughPoint') {
                    $noWinReason.html('您的积分已经不够了');
                    $noWinTitle.show();
                    $backGround.show();
                    $noWinAction.unbind();
                    $noWinAction.one('click', function () {
                        $backGround.hide();
                        $noWinTitle.hide();
                    });
                    return false;
                }
                if (shopPoint === 'noPointChargeId') {
                    $noWinReason.html('该活动还没有充值id');
                    $noWinTitle.show();
                    $backGround.show();
                    $noWinAction.unbind();
                    $noWinAction.one('click', function () {
                        $backGround.hide();
                        $noWinTitle.hide();
                    });
                    return false;
                }
                if (otherPlayNumber < 0) {
                    otherPlayNumber = 0;
                }
                if (otherPlayNumber >= 0 && otherPlayNumber < 100) {
                    $playNumber.css({
                        'font-size': '1.5rem',
                        'margin-left': '8.0rem'
                    });
                }else if (otherPlayNumber >= 100 && otherPlayNumber <1000) {
                    $playNumber.css({
                        'font-size': '1.0rem',
                        'margin-left': '8.0rem'
                    });    
                }else {
                    $playNumber.css({
                        'font-size': '0.7rem',
                        'margin-left': '8.0rem'
                    });
                }
                $playNumber.html(otherPlayNumber);
            }
        });
    }

// 跳登陆页面方法
    function login() {
        $tkBox.hide();
        $backGround.hide();
        $noWinReason.html('请先登录');
        $noWinTitle.show();
        var url = window.location.href;
        var loginurl = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(url);
        $noWinAction.unbind();
        $noWinAction.on('click', function () {
            window.location.href = loginurl;
        });
        $backGround.show();
        $noWinTitle.show();
    }

    // 更新中奖手机号
    var updatephoneparm = {};
    updatephoneparm.class = 'YaoyiyaoHc';
    updatephoneparm.m = 'updateWinPhone';
    updatephoneparm.lotteryId = $lotteryId;
    var checkVcode = null;
    var updatePhone = null;
    var key = null;
    function updateWinPhone() {
        updatephoneparm.code = $('.js_code').val();
        updatephoneparm.phone = $('.js_phone').val();
        $.ajax({
            url: '/huodongAC.d',
            type: 'POST',
            data: updatephoneparm,
            dataType: 'json',
            success: function (data) {
                checkVcode = data.root.checkVcode;
                canWin = data.root.canWin;
                updatePhone = data.root.updatePhone;
                key = data.root.key;
                if (checkVcode === 'success') {
                    if (canWin) {
                        if (updatePhone === 'success') {
                            $phone.val('');
                            $code.val('');
                            isSending = false;
                            readSecond = true;
                            window.location.href = '/huodongAC.d?m=getWinList&class=YaoyiyaoHc&key=' + key + '&lotteryId=' + $lotteryId;
                        } else {
                            alert('领奖失败');
                        }
                    } else {
                        alert('不符合领奖条件');
                    }
                } else {
                    alert('验证码输入错误');
                }
            }
        });
    }

    function validatemobile(mobile) {
        if (mobile.length === 0) {
            $phoneWarn.html('手机号不能为空');
            $phoneWarn.show();
            $phone.focus();
            return false;
        }
        if (mobile.length !== 11) {
            $('.js_phoneWarn').html('请输入有效的手机号码！');
            $phoneWarn.show();
            $phone.focus();
            return false;
        }

        var myreg = /^(((13)|14|15|18|17)+\d{9})$/;
        if (!myreg.test(mobile)) {
            $phoneWarn.html('请输入有效的手机号码！');
            $phoneWarn.show();
            $phone.focus();
            return false;
        } else {
            $phoneWarn.hide();
            return true;
        }
    }
    // 获取手机号验证码
    function getPhoneCode() {
        var phonestr = $phone.val();
        // 手机号是否符合格式
        var isPhone = validatemobile(phonestr);
        if (!isPhone) {
            return false;
        }

        getPhoneVerifyCode(phonestr,
            function () {
                updateTimeCode();
            }, function () {
                $codeWarn.html('获取验证码失败');
                $codeWarn.show();
            });
    }
    // 更改获取验证码时间
    var timeCount = 60;
    function updateTimeCode(){
        isSending = true;
        timeCount--;
        if (timeCount > 0 && readSecond) {
            $getCode.html('重新获取(' + timeCount + ')');
            setTimeout(function () {
                updateTimeCode();
            },1000);
        } else {
            $getCode.html('重新获取');
            timeCount = 60;
            isSending = false;
        }
    }


    function getcookie(objname){//获取指定名称的cookie的值
    var arrstr = document.cookie.split("; ");
    for(var i = 0;i < arrstr.length;i ++){
       var temp = arrstr[i].split("=");
       if(temp[0] == objname) return unescape(temp[1]);
    }
   }

    // 验证验证码
    function vierifyCode() {
        var phonestr = $phone.val();
        var codestr = $code.val();
        if (!phonestr) {
            $phoneWarn.html('手机号不能为空');
            $phoneWarn.show();
            $phone.focus();
            return false;
        } else {
            $phoneWarn.hide();
        }
        if (!codestr) {
            $codeWarn.html('验证码不能为空');
            $codeWarn.show();
            $code.focus();
            return false;
        } else {
            $codeWarn.hide();
        }
        sendVerifyCodeAnswer(phonestr, codestr,
            function () {
                // 验证码验证成功
                $backGround.hide();
                $('.js_updatePhoneTitle').hide();
                updateWinPhone();
            }, function () {
                $codeWarn.html('验证码验证错误');
                $codeWarn.show();
            });
    }
    // 产生随机数
    function getRandom(n) {
        return Math.floor(Math.random() * n + 1);
    }

//    -------------------------------
    // 按取消按钮，掩藏浮层
    $noWinCancel.on('click', function () {
        $backGround.hide();
        $tkBox.hide();
    });
// 按叉叉按钮，掩藏浮层
    $closeButton.on('click', function () {
        $backGround.hide();
        $tkBox.hide();
        $('.js_activityRule').hide();
        $phone.val('');
        $code.val('');
        readSecond = false;
        isSending = false;
    });
// 再摇一次按钮，掩藏浮层
    $playAgain.on('click', function () {
        $backGround.hide();
        $tkBox.hide();
    });
// 点击摇奖，开始抽奖
    $('.js_yaojiang').click(function () {
        yaoyiyao();
    });
// 点击领奖
    $('.js_updatePhone').click(function () {
        vierifyCode();
    });
// 获取手机号验证码
    $getCode.click(function () {
        if (!isSending) {
            getPhoneCode();
        }
    });
// 点击新年签，关闭新年签
    $closeNewYear.on('click', function () {
        $backGround.hide();
        $newYear.hide();
    });

//    返回跨年活动首页触发
    $('.js_playAgain').on('click', function () {
        if (iscrossYearstr === 'newYearActivity') {
            var backurlstr =  location.protocol+'//' + window.location.host + '/huodongAC.d?class=NewYearOf2016Hc&m=newYearAcitvity';
            location.replace(backurlstr);
        } else{
            $backGround.hide();
            $('.js_noGetPrize').hide();
        }

    });

});


