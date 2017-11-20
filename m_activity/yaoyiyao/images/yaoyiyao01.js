/**
 * Created by user on 2015/12/16.
 */
$(function () {
    'use strict';
    // ����Ԫ��
    var $backGround = $('.shade');
// ������ʾԪ��
    var $stopTitle = $('.js_stop');
// �񽱵���Ԫ��
    var $getPrzie = $('.js_getPrize');
// �񽱵���Ԫ��
   // var $noGetPrzie = $('.js_noGetPrize');
// ����ʾ��
    var $getPrzieDiscription = $('.js_getPrizeDiscription');
// ��Ʒ��ת��ַ
    var $prizeUrl = $('.js_prizeUrl');
// ����ҡ������������Ԫ��
    var $noWinReason = $('.js_noWinReason');
// ����ҡ�������ȷ����ťԪ��
    var $noWinAction = $('.js_noWinAction');
// ����ҡ������ȡ����ťԪ��
    var $noWinCancel = $('.js_noWinCancel');
// û�н���������Ԫ��
    var $noWinTitle = $('.js_noWinTitle');
// ���Ը���Ԫ��
    var $tkBox = $('.tkBox');
// ��水ťԪ��
    var $closeButton = $('.closeBtn');
// �齱ʣ�����
    var $playNumber = $('.js_playNumber');
// �ҵ��н���¼
    var $myPrizeList = $('.js_myPrizeList');
// n���ֶ�Ҫһ�ΰ�ťԪ��
    var $addPlayNumber = $('.js_addPlayNumber');
// ʹ��n���ֶ�ҡһ�θ���Ԫ��
    var $addplayNumberTitle = $('.js_addplayNumberTitle');
// ���Ļ��ֶһ�ҡ������ȷ��Ԫ��
    var $shopPointAddplayNumber = $('.js_shopPointAddPlayNumber');
// ��ҡһ��Ԫ��
    var $playAgain = $('.js_playAgain');
// ����ǩ������Ԫ��
    var $newYear = $('.newyear');
    var $closeNewYear = $('.closeBtn2');
// ����ǩͼƬ·��
    var $newYearImg = $('.js_newYearImg');
// ������֤�밴ť
    var $getCode = $('.js_getCode');
// ��Ƿ��Ѿ�����
    var $isStop = $('.js_isStop').val();
// �Ƿ��½
    var $isLogin = $('.js_isLogin').val();
// �id
    var $lotteryId = $('.js_lotteryId').val();
// �Ƿ����Ļ������Ӵ���
    var $isShopPoint = $('.js_isShopPoint').val();

    var isLogin = null;
    // ��֤�ֻ���ʽ    �ֻ����󾯸�
    var $phoneWarn = $('.js_phoneWarn');
    var $phone = $('.js_phone');
    // ��֤��   ��֤����󾯸�
    var $codeWarn = $('.js_codeWarn');
    var $code = $('.js_code');
    // 60������Ƿ�Ӧ�ý���
    var readSecond = true;
    // 60���Ƿ����ڶ�
    var isSending = false;
    //��������ajax
    var ajaxing = false;
    // ҡ�����ֿؼ�
    var shakeMusicAudio = null;
    var targetMusicAudio = null;

    var yyyShakeEvent = new Shake({
        // �����õ�ҡ����ǿ��
        threshold: 8,
        // �¼�����Ƶ�ʣ�������
        timeout: 400
    });
    yyyShakeEvent.start();

    function prepGame() {
       
        // ��������Ļ�������ҡ������
        if ($isShopPoint === 'noShopPoint') {
            $addPlayNumber.hide();
        }
        getCanPlayCount();
        // �δ��ʼ���ѽ���
        if ($isStop === 'true') {
            $backGround.show();
            $stopTitle.show();
            return false;
        }
        window.addEventListener('shake', shakeEventDidOccur, false);

        $(window).load(function () {
            loadMusic();
        });
    }
    function loadMusic() {
        if ($('.audio').length > 0) {
            var audio = document.querySelector('.audio');
            shakeMusicAudio = audio.querySelector('#shake_music_audio');
            targetMusicAudio = audio.querySelector('#target_music_audio');
        }
    }
    prepGame();

    // ��ȡ�û��������

    function getCanPlayCount() {
        var randomNumber = getRandom(100);
        $.ajax({
            url: '/huodongAC.d?m=getCanPlayCount&class=YaoyiyaoHc&lotteryId=' + $lotteryId + '&randomNumber=' + randomNumber,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var playCount = data.root.otherPlayNumber;
                $playNumber.html(playCount);
            }
        });
    }


    function shakeEventDidOccur() {
        if ($backGround.is(':hidden')&&!ajaxing) {
        	ajaxing = true;
            shakeMusicAudio.play();
            yaoyiyao();
        }
    }

// CSS ADD 2015/12/23

// ����ҵ��н���¼
    $myPrizeList.on('click', function () {
        if ($isLogin === 'false') {
            login();
        } else {
            window.location.href = '/huodongAC.d?m=getWinList&class=YaoyiyaoHc&lotteryId=' + $lotteryId;
        }
    });
// ʹ��n���ֶ�ҡһ�θ���
    $addPlayNumber.on('click', function () {
        $tkBox.hide();
        $backGround.hide();
        $backGround.show();
        $addplayNumberTitle.show();
    });
// ���Ļ��ֶһ�ҡ������
    $shopPointAddplayNumber.on('click', function () {
    	if(!ajaxing){
    		ajaxing = true;
    		 shopPointAddPalyNumber();
    	}
       
    });
    // �Ƿ��г齱�ʸ�
    var canWin = null;
    // ���ܳ齱������
    var noWinReason = null;
    var isGetPrize = null;
    var prizeName = null;
    var prizeType = null;
    var prizeUrl = null;
    // ʣ��齱����
    var otherPlayNumber = null;
    // �Ի�ý�Ʒ������
    var getPrizeTitle = null;
    // �������������������ʾ����ǩ
    var randomNumber = 1;
    // ����ͼƬ
    var newYearImgUrl = null;
    var prizeparm = {};
    prizeparm.class = 'YaoyiyaoHc';
    prizeparm.m = 'choujiang';
    prizeparm.lotteryId = $lotteryId;
// ҡһҡ������,�û��Ƿ��н�
    function yaoyiyao() {
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
                isLogin = data.root.isLogin;
                $playNumber.html(otherPlayNumber);
                ajaxing = false;
                if (canWin) {
                    // ����˽�Ʒ
                    if (isGetPrize) {
                        if (isLogin) {
                            if (prizeType == 'other' || prizeType == 'money' || prizeType == 'youhuiquan') {
                                getPrizeTitle = '��ϲ��ҡ��' + prizeName;
                            }
                            if (prizeType == 'point') {
                                getPrizeTitle = '<p>��ϲ��ҡ��' + prizeName + '</p><p>���������̳ǶҺ���</p>';
                            }
                            $prizeUrl.attr('href', prizeUrl);
                            $getPrzieDiscription.html(getPrizeTitle);
                            $backGround.show();
                            $getPrzie.show();
                            targetMusicAudio.play();
                        } else {
                            // û�е�½
                            $('.js_prizeName').html(prizeName);
                            readSecond = true;
                            $backGround.show();
                            $('.js_updatePhoneTitle').show();
                        }
                    } else {
                        // û�л�ý�Ʒ
                        newYearImgUrl = 'http://js.soufunimg.com/wireless_m/touch/activity/yaoyiyao/images/';
                        randomNumber = getRandom(29);
                        newYearImgUrl = newYearImgUrl + randomNumber + '.jpg';
                        $newYearImg.attr('src',newYearImgUrl);
                        $backGround.show();
                        // $noGetPrzie.show();
                        $newYear.show();
                    }
                } else {
                    // û�г齱�ʸ�
                    if (noWinReason === 'noStart' || noWinReason === 'stop') {
                        $backGround.show();
                        $stopTitle.show();
                        return false;
                    }
                    if (noWinReason === 'noFromAPP') {
                        $noWinReason.html('��������APP');
                        $backGround.show();
                        $noWinTitle.show();
                        return false;
                    }
                    if (noWinReason === 'noLogin') {
                        login();
                        return false;
                    }
                    if (noWinReason === 'noPlayCount') {
                        $noWinReason.html('���ĳ齱����������');
                        $backGround.show();
                        $noWinTitle.show();
                        $noWinAction.unbind();
                        $noWinAction.one('click', function () {
                            $backGround.hide();
                            $noWinTitle.hide();
                        });
                        return false;
                    }
                    if (noWinReason === 'hasGetPrize') {
                        $noWinReason.html('���Ѿ��й�����');
                        $backGround.show();
                        $noWinTitle.show();
                        $noWinAction.unbind();
                        $noWinAction.one('click', function () {
                            $backGround.hide();
                            $noWinTitle.hide();
                        });
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

    // ���Ļ����Ƿ�ɹ�
    var shopPoint = null;

// ���ٻ��ֶһ�һ��ҡ������
    function shopPointAddPalyNumber() {
        $.ajax({
            url: '/huodongAC.d',
            type: 'POST',
            data: pointparm,
            dataType: 'json',
            success: function (data) {
                // var $url = '/huodongAC.d?m=shopPointAddPlayCount&class=YaoyiyaoHc';
                // $.getJSON($url,{lotteryId:$lotteryId},function(data) {
                // �û��Ƿ��½
                isLogin = data.root.isLogin;
                // ���Ļ����Ƿ�ɹ�
                shopPoint = data.root.shopPoint;
                // ʣ��齱����
                otherPlayNumber = data.root.otherPlayNumber;
                $tkBox.hide();
                $backGround.hide();
                ajaxing = false;
                if (!isLogin) {
                    login();
                    return false;
                }
                if (shopPoint === 'notEnoughPoint') {
                    $noWinReason.html('���Ļ����Ѿ�������');
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
                    $noWinReason.html('�û��û�г�ֵid');
                    $noWinTitle.show();
                    $backGround.show();
                    $noWinAction.unbind();
                    $noWinAction.one('click', function () {
                        $backGround.hide();
                        $noWinTitle.hide();
                    });
                    return false;
                }
                $playNumber.html(otherPlayNumber);
            }
        });
    }

// ����½ҳ�淽��
    function login() {
        $tkBox.hide();
        $backGround.hide();
        $noWinReason.html('���ȵ�¼');
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

    // �����н��ֻ���
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
                            alert('�콱ʧ��');
                        }
                    } else {
                        alert('�������콱����');
                    }
                } else {
                    alert('��֤���������');
                }
            }
        });
    }

    function validatemobile(mobile) {
        if (mobile.length === 0) {
            $phoneWarn.html('�ֻ��Ų���Ϊ��');
            $phoneWarn.show();
            $phone.focus();
            return false;
        }
        if (mobile.length !== 11) {
            $('.js_phoneWarn').html('��������Ч���ֻ����룡');
            $phoneWarn.show();
            $phone.focus();
            return false;
        }

        var myreg = /^(((13)|14|15|18|17)+\d{9})$/;
        if (!myreg.test(mobile)) {
            $phoneWarn.html('��������Ч���ֻ����룡');
            $phoneWarn.show();
            $phone.focus();
            return false;
        } else {
            $phoneWarn.hide();
            return true;
        }
    }
    // ��ȡ�ֻ�����֤��
    function getPhoneCode() {
        var phonestr = $phone.val();
        // �ֻ����Ƿ���ϸ�ʽ
        var isPhone = validatemobile(phonestr);
        if (!isPhone) {
            return false;
        }

        getPhoneVerifyCode(phonestr,
            function () {
                updateTimeCode();
            }, function () {
                $codeWarn.html('��ȡ��֤��ʧ��');
                $codeWarn.show();
            });
    }
    // ���Ļ�ȡ��֤��ʱ��
    var timeCount = 60;
    function updateTimeCode(){
        isSending = true;
        timeCount--;
        if (timeCount > 0 && readSecond) {
            $getCode.html('���»�ȡ(' + timeCount + ')');
            setTimeout(function () {
                updateTimeCode();
            },1000);
        } else {
            $getCode.html('���»�ȡ');
            timeCount = 60;
            isSending = false;
        }
    }
    // ��֤��֤��
    function vierifyCode() {
        var phonestr = $phone.val();
        var codestr = $code.val();
        if (!phonestr) {
            $phoneWarn.html('�ֻ��Ų���Ϊ��');
            $phoneWarn.show();
            $phone.focus();
            return false;
        } else {
            $phoneWarn.hide();
        }
        if (!codestr) {
            $codeWarn.html('��֤�벻��Ϊ��');
            $codeWarn.show();
            $code.focus();
            return false;
        } else {
            $codeWarn.hide();
        }
        sendVerifyCodeAnswer(phonestr, codestr,
            function () {
                // ��֤����֤�ɹ�
                updateWinPhone();
            }, function () {
                $codeWarn.html('��֤����֤����');
                $codeWarn.show();
            });
    }
    // ���������
    function getRandom(n) {
        return Math.floor(Math.random() * n + 1);
    }

//    -------------------------------
    // ��ȡ����ť���ڲظ���
    $noWinCancel.on('click', function () {
        $backGround.hide();
        $tkBox.hide();
    });
// ����水ť���ڲظ���
    $closeButton.on('click', function () {
        $backGround.hide();
        $tkBox.hide();
        $phone.val('');
        $code.val('');
        readSecond = false;
        isSending = false;
    });
// ��ҡһ�ΰ�ť���ڲظ���
    $playAgain.on('click', function () {
        $backGround.hide();
        $tkBox.hide();
    });
// ���ҡ������ʼ�齱
    $('.js_yaojiang').click(function () {
        yaoyiyao();
    });
// ����콱
    $('.js_updatePhone').click(function () {
        vierifyCode();
    });
// ��ȡ�ֻ�����֤��
    $getCode.click(function () {
        if (!isSending) {
            getPhoneCode();
        }
    });
// �������ǩ���ر�����ǩ
    $closeNewYear.on('click', function () {
        $backGround.hide();
        $newYear.hide();
    });
});


