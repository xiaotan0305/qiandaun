/*
* Author: 赵天亮
* Date:   2017-04-06 17:05:22
* Last Modified by:   赵天亮
* @Last Modified time: 2017-05-26 15:34:45
*/

$(document).ready(function () {
    'use strict';

    /* 判断是否已经登陆了 */
    var isLogin;
    var soufangID = '';
    var bindMobile = '';
    var fangyuanID = $('#houseid').val();
    // 初始化获取数据
    $.ajax({
        url: '/house/ajaxrequest/getLoginStatus.php',
        type: 'POST'
    }).done(function (data) {
        isLogin = data.code;
        soufangID = data.login.loginUid;
        bindMobile = data.login.bindMobile;
        if (soufangID) {
            telBox.val(bindMobile);
            phoneyzm.hide();
            iconRight.show();
        }
    }).fail(function (data) {
        isLogin = data.code;
        soufangID = data.login.loginUid;
        bindMobile = data.login.bindMobile;
    });

    // 提交表单方法
    function submitForm(action, params) {
        var form = $('<form></form>');
        form.attr('action', action);
        form.attr('method', 'post');
        form.attr('accept-charset', 'utf-8');
        form.attr('target', '_self');
        for(var i in params){
            var input1 = $('<input type="hidden" name="'+ i +'" />');
            input1.attr('value', params[i]);
            form.append(input1);
        }
        form.appendTo('body');
        form.css('display', 'none');
        form.submit();
    }

    // 报名ajax方法
    function baomingAjax (nameVal, telVal, sfzVal) {
        $.ajax({
            url: '/house/ajaxrequest/ajaxPaiReg.php',
            type: 'POST',
            dataType: 'json',
            data: {
                userId: soufangID,
                houseId: fangyuanID,
                userName: nameVal,
                userTel: telVal,
                idCard: sfzVal,
                paicity: paicity,
                v: Math.random()
            }
        }).done(function (data) {
            if (data.res === '100') {
                bmBox.hide();
                bmSuccess.show();
                btnBm.text('交纳保证金').attr({'data-status': '202'});
            }else if (data.res === '102') {
                alert(data.err);
            }else if (data.res === '101') {
                bmBox.hide();
                bmSuccess.find('.success').text('您已经报过名了，请支付保证金');
                bmSuccess.show();
                btnBm.text('交纳保证金').attr({'data-status': '202'});

            }else if (data.res === '103') {
                if (data.isPai === '1') {
                    btnBm.text('交纳保证金').attr({'data-status': '200'});
                    alert('您已经报过名并且缴纳了保证金，可以直接加价了');
                    bmBox.hide();
                    cjBox.show();
                }else{
                    bmBox.hide();
                    floatMask.hide();
                    btnBm.removeClass().addClass('btn-btmstyle');
                    var timeTxt = '报名成功<i>|</i>' + startTimeText + '开拍';
                    btnBm.html(timeTxt).attr({'data-status': '205'});
                    alert('活动尚未开始，请耐心等待');
                }
                
            }else if (data.res === '109') {
                alert('用户信息错误，将刷新页面');
                window.location.reload();
            }
            
        }).fail(function () {
        });
    }

    // 验证+登录ajax方法
    function yanzhengAjax (nameVal, sfzVal, telVal, codeVal) {
        $.ajax({
            url: 'https://passport.fang.com/loginverifysms.api',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                mobilephone:telVal,
                service:'newhouse-open-web',
                mobilecode:codeVal,
                v: Math.random()
            }
        }).done(function (data) {
            if (data.Message === 'Success') {
                Xml.Request('/house/esf/getusernewhouse.php', null, doHeadloginuser,null,false);
                $.ajax({
                    url: '/house/ajaxrequest/getLoginStatus.php',
                    type: 'POST'
                }).always(function (data) {
                    isLogin = data.code;
                    soufangID = data.login.loginUid;
                    bindMobile = data.login.bindMobile;
                    if (soufangID) {
                        baomingAjax(nameVal, telVal, sfzVal);
                    }
                    
                });
                
            }
        }).fail(function () {
            alert('验证码错误，请重试');
        });
    }

    // 保证金方法
    function bzjAjax (bzjFlag) {
        if (bzjFlag) {
            bzjFlag = false;
            $.ajax({
                url: '/house/ajaxrequest/handlePaipay.php',
                type: 'POST',
                data: {
                    userid: soufangID,
                    houseid: fangyuanID,
                    v: Math.random()
                },
            }).done(function (data) {
                if (data === '102') {
                    alert('支付遇到问题，请重试');
                    bzjFlag = true;
                }else if (data === '109') {
                    alert('用户信息错误，将刷新页面');
                    window.location.reload();
                }else {
                    submitForm('https://payment.fang.com/cashiernew/cashierordercreateforweb.html', data);
                    //submitForm('http://payment.test.fang.com/cashiernew/cashierordercreateforweb.html', data);
                }
            }).fail(function () {
                alert('网络拥堵，请再次点击');
                bzjFlag = true;
            });
        }
    }

    // 接口变化  需手动拼活动开始时间文本 170522
    var startTime = $('#startTime').attr('data-time');
    var startTimeHtml = '报名成功<i>|</i>' + startTime + '开拍';

    // 按钮上方轮循简略信息及按钮状态
    function simpleLunxun (data) {
        var nowPrice = data.nowPrice? data.nowPrice: '0';
        var chujiaCount = data.chujiaCount? data.chujiaCount: '0';
        var userCount = data.userCount? data.userCount: '0';
        var briefHtml = '<li class="red">'
                + '<span>当前价格</span><b>' + nowPrice + '</b>万元'
            + '</li>'
            + '<li>'
                + '<span>出价记录</span>' + chujiaCount + '次'
            + '</li>'
            + '<li>'
                + '<span>参与人数</span>' + userCount + '人'
            + '</li>';
        otherInfo.html(briefHtml);
        // 更改按钮属性和文本
        if (data.baomingCode && data.baoming) {
            if (data.baomingCode === '203') {
                btnBm.attr({'data-status': data.baomingCode}).html(startTimeHtml);
            }else {
                btnBm.attr({'data-status': data.baomingCode}).html(data.baoming);
            }
        }
        if (data.baomingCode === '203' && !btnBm.hasClass('btn-btmstyle')) {
            btnBm.removeClass().addClass('btn-btmstyle');
        }else if (data.baomingCode === '205' && !btnBm.hasClass('bg999')){
            btnBm.addClass('bg999');
        }else if (data.baomingCode !== '203' && data.baomingCode !== '205') {
            btnBm.removeClass().addClass('btn-bm');
        };
        
    }

    /* 图片区 */
    var imgUl = $('.img-ul');
    var bigPic = $('.bigPic');
    imgUl.on('click', 'li', function (event) {
        event.preventDefault();
        var that = $(this).find('img'), thatFloat = $(this).find('div');
        var url = that.attr('data-img'), href = that.attr('data-href');
        bigPic.find('img').attr({src: url}).parents('a').attr({href: href});
        if ($(this).hasClass('cur')) {

        }else {
            $(this).addClass('cur').siblings('li').removeClass('cur');
            thatFloat.hide();
            $(this).siblings('li').find('div').show();
        }
    });

    /* 按钮状态区 */
    var btnBm = $('.btn-bm, .btn-btmstyle');
    var bmBox = $('#bmBox'), cjBox = $('#cjBox');
    var bmSuccess = $('#bmSuccess'), cjSuccess = $('#cjSuccess');
    var floatMask = $('#floatMask');
    var bzjFlag = true;
    btnBm.on('click', function (event) {
        event.preventDefault();
        var that = $(this);
        var btnStatus = that.attr('data-status');
        // 205已结束
        if (btnStatus === '205') {
            return;
        // 201 报名框弹出
        }else if (btnStatus === '201') {
            if (isLogin === '100') {
                floatMask.show();
                bmBox.show();
            }else if (isLogin === '102') {
                showid('showlogindiv');
                $('#layer').css('z-index', '10002');
                $('#showlogindiv').css('z-index', '10005');
                return false;
            }
        // 202 交保证金
        }else if (btnStatus === '202') {
            bzjAjax (bzjFlag);
        // 203 活动未开始
        }else if (btnStatus === '203') {
            return;
        // 200 出价框弹出
        }else if (btnStatus === '200') {
            floatMask.show();
            cjBox.show();
        }
    });

    /* 弹框操作 */
    var btnCls = $('.btn-cls');
    btnCls.on('click', function (event) {
        event.preventDefault();
        $(this).parents('.popWin').hide();
        floatMask.hide();
    });

    /* 报名框操作 */
    var telBox = bmBox.find('.telBox');
    var iconRight = bmBox.find('.icon_right');
    var telReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i;
    var IDCardReg = /^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/;
    var bmAgree = bmBox.find('.rule-text').find('i');
    var btnGet = bmBox.find('.btn-get');
    var initTelInput = telBox.val();
    var phoneyzm = $('.phoneyzm');
    // 初始化对勾状态
    if (!telReg.test(initTelInput)) {
        iconRight.hide();
    }else {
        iconRight.show();
    }
    telBox.on('input', function (event) {
        event.preventDefault();
        var inputval = $(this).val();
        if (isLogin === '100') {
            if (inputval && telReg.test(inputval)) {
                iconRight.show();
                if (btnGet.text() === '获取验证码') {
                    btnGet.addClass('red');
                }
                if (inputval === bindMobile) {
                    phoneyzm.hide();
                }else {
                    phoneyzm.show();
                }
            }else {
                iconRight.hide();
                btnGet.removeClass('red');
                phoneyzm.show();
            }
        }else if (isLogin === '102') {
            if (inputval && telReg.test(inputval)) {
                iconRight.show();
                if (btnGet.text() === '获取验证码') {
                    btnGet.addClass('red');
                }
            }else {
                iconRight.hide();
                btnGet.removeClass('red');
            }
        }

        
    });
    // 是否已阅读协议
    bmAgree.on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('selected');
    });
    // 60秒后发送
    var countDownText = '<span>60</span>&#x79D2;&#x540E;&#x53D1;&#x9001;';
    var btnGetStatus = false;
    var tuwen = $('#pai_yanzhengma');
    var tuwenText = $('#pai_authcode'), tuwenImg = $('#pai_authimg');
    var authcode = tuwenText.val()? tuwenText.val(): '';
    btnGet.on('click', function (event) {
        event.preventDefault();
        if (btnGet.hasClass('red')) {
            if (btnGetStatus) {
                return;
            }
            var telVal = telBox.val();
            if (telVal && telReg.test(telVal)) {
                btnGetStatus = true;
                $.ajax({
                    type:'get',
                    dataType:'jsonp',
                    url:'https://passport.fang.com/loginsendmsm.api',
                    data:{mobilephone:telVal,service:'newhouse-open-web',mathcode:authcode},
                    error:function () {
                        alert('验证码发送失败，请重试');
                    },
                    success:function (msg){
                        btnGet.html(countDownText).removeClass('red');;
                        var countNum = 60;
                        var timer = setInterval(function () {
                            countNum--;
                            btnGet.find('span').html(countNum);
                            if (countNum === 0) {
                                btnGetStatus = false;
                                clearInterval(timer);
                                btnGet.html('&#x83B7;&#x53D6;&#x9A8C;&#x8BC1;&#x7801;');
                                btnGet.addClass('red');
                            }
                        },1000);
                        if(msg.Message === 'Success'){
                            alert('发送成功，请查看');
                            
                        }else{
                            if(msg.IsSent === 'true'){
                                alert(msg.Tip);
                                // $("#"+buttonId).attr("disabled", true);
                            }else{
                                if(msg.IsShowMathCode === 'true'){
                                    alert('请输入图文验证码');
                                    tuwenImg.attr({src: 'http://Captchas.fang.com/Display?type=soufangbang&r=' + Math.random()});
                                    tuwen.show();
                                }else{
                                    alert(msg.Tip);
                                }
                            }
                        }
                    }
                });
            }else {
                // 请正确输入您的手机号码
                alert('请正确输入您的手机号码');
            }
        }else {
            alert('请正确输入您的手机号码');
        }
        
    });
    
    // 点击图片刷新
    tuwenImg.on('click', function(event) {
        event.preventDefault();
        tuwenImg.attr({src: 'http://Captchas.fang.com/Display?type=soufangbang&r=' + Math.random()});
    });
    // 图文验证按钮
    var yzmConfirm = $('.yzmConfirm');
    yzmConfirm.on('click', function (event) {
        event.preventDefault();
        var telVal = telBox.val();
        var authcode = tuwenText.val();
        if (telVal && telReg.test(telVal) && authcode) {
            $.ajax({
                type:'get',
                dataType:'jsonp',
                url:'https://passport.fang.com/loginsendmsm.api',
                data:{
                    mobilephone: telVal,
                    service: 'newhouse-open-web',
                    mathcode: authcode
                },
                error:function () {
                    alert('验证码发送失败，请重试');
                },
                success:function (msg) {
                    if(msg.Message === 'Success'){
                        alert('发送成功，请查看');
                        
                    }else{
                        if(msg.IsSent === 'true'){
                            alert(msg.Tip);
                        }else{
                            if(msg.IsShowMathCode === 'true'){
                                alert('请输入图文验证码');
                                tuwen.show();
                            }else{
                                alert(msg.Tip);
                            }
                        }
                    }
                }
            });
        }
    });
    // 报名按钮
    var baoming = bmBox.find('.baoming');
    var startTime = $('#startTime'), startTimeText = startTime.attr('data-time');
    var bmName = $('.bmName'), bmSfz = $('.bmSfz'), code = $('.code');
    baoming.on('click', function (event) {
        event.preventDefault();
        var nameVal = bmName.val(), sfzVal = bmSfz.val(), telVal = telBox.val(), codeVal = code.val();
        if (isLogin === '100') {
            if (!nameVal) {
                alert('请先正确填写您的姓名再报名参加竞拍');
                return;
            }else if (!sfzVal || !IDCardReg.test(sfzVal)) {
                alert('请正确填写您的身份证号再报名参加竞拍');
                return;
            }else if (!telVal || !telReg.test(telVal)) {
                alert('请正确填写您的手机号再报名参加竞拍');
                return;
            }else if (!bmAgree.hasClass('selected')) {
                alert('请您阅读房天下拍卖协议再报名参加竞拍');
                return;
            }else if (telVal && telReg.test(telVal) && telVal !== bindMobile && !codeVal) {
                alert('请正确填写您的验证码再报名参加竞拍');
                return;
            }else if (nameVal && sfzVal && IDCardReg.test(sfzVal) && telVal && telReg.test(telVal) && telVal !== bindMobile && codeVal && bmAgree.hasClass('selected')) {
                yanzhengAjax (nameVal, sfzVal, telVal, codeVal);
            }
            else if (nameVal && sfzVal && IDCardReg.test(sfzVal) && telVal && telReg.test(telVal) && telVal === bindMobile && bmAgree.hasClass('selected')) {
                baomingAjax(nameVal, telVal, sfzVal);
            }
        }else if (isLogin === '102') {
            if (!nameVal) {
                alert('请先正确填写您的姓名再报名参加竞拍');
                return;
            }else if (!sfzVal || !IDCardReg.test(sfzVal)) {
                alert('请正确填写您的身份证号再报名参加竞拍');
                return;
            }else if (!telVal || !telReg.test(telVal)) {
                alert('请正确填写您的手机号再报名参加竞拍');
                return;
            }else if (!codeVal) {
                alert('请正确填写您的验证码再报名参加竞拍');
                return;
            }else if (!bmAgree.hasClass('selected')) {
                alert('请您阅读房天下拍卖协议再报名参加竞拍');
                return;
            }else if (nameVal && sfzVal && IDCardReg.test(sfzVal) && telVal && telReg.test(telVal) && codeVal && bmAgree.hasClass('selected')) {
                yanzhengAjax (nameVal, sfzVal, telVal, codeVal);
            }
        }
        
    });

    // 报名成功框 交保证金
    var payMoney = $('.payMoney');

    payMoney.on('click', function (event) {
        event.preventDefault();
        bzjAjax (bzjFlag);
    });
    // 出价框
    var addPrice = $('.addPrice');
    var popWinBtn = cjBox.find('.popWin-btn');
    var addSwitch = true;
    var cjAgree = cjBox.find('.rule-text').find('i');
    var addMoney = '';
    var cjSuccessTxt = cjSuccess.find('.success');
    var cjCount = cjSuccess.find('.note b');
    addPrice.on('click', 'a', function (event) {
        event.preventDefault();
        if ($(this).hasClass('selected')) {
            addPrice.find('a').removeClass('selected');
        }else {
            $(this).addClass('selected').siblings('a').removeClass('selected');
        }
        var addMoneyText = addPrice.find('.selected').text();
        addMoney = addMoneyText.substring(0, addMoneyText.length-1);
    });
    // 加价
    popWinBtn.on('click', function (event) {
        event.preventDefault();
        if (!addMoney) {
            alert('请选择一个加价项');
            return;
        }else if (!cjAgree.hasClass('selected')) {
            alert('请阅读拍卖协议规则');
            return;
        }else if (cjAgree.hasClass('selected') && addMoney) {
            if (addSwitch) {
                addSwitch = false;
                $.ajax({
                    url: '/house/ajaxrequest/ajaxAddPaiPrice.php',
                    type: 'POST',
                    data: {
                        userId: soufangID,
                        houseId: fangyuanID,
                        price: addMoney,
                        v: Math.random()
                    },
                }).done(function (data) {
                    if (data.code === '100') {
                        cjBox.hide();
                        cjSuccessTxt.text('恭喜您  成功加价' + addMoney + '元！');
                        cjCount.text(data.paiNum);
                        cjSuccess.show();
                    }else if (data.code === '109') {
                        alert('用户信息错误，将刷新页面');
                        window.location.reload();
                    }
                    else {
                        alert(data.errStr);
                    }
                    addSwitch = true;
                }).fail(function () {
                    alert('出错了，加价失败');
                    addSwitch = true;
                });
            }
        }
    });
    cjAgree.on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('selected');
    });
    
    // 加载更多
    var otherInfo = $('.otherInfo');
    var jilu = $('.jilu');
    var moreJl = $('.more-jl');
    var jiluDl = $('.jilu-dl');
    var moreSwitch = true, moreFlag = false;
    var cjTimerAll;
    var cjTimer5;
    var chujiaList = jiluDl.find('#chujiaList');
    var noChujia = jilu.find('#noChujia');
    var jiluDt = jilu.find('dt');
    moreJl.on('click', function (event) {
        event.preventDefault();
        clearInterval(cjTimer);
        clearInterval(cjTimerAll);
        clearInterval(cjTimer5);
        if (moreSwitch) {
            moreSwitch = false;
            if (moreJl.text() === '更多出价记录') {
                $.ajax({
                    url: '/house/ajaxrequest/getPaiNowInfo.php',
                    type: 'POST',
                    data: {
                        houseId: fangyuanID,
                        type: 'all',
                        userId: soufangID,
                        v: Math.random()
                    },
                }).done(function (data) {
                    chujiaList.html(data.priceRes);
                    var jiludt = jiluDl.find('dt').eq(0);
                    moreJl.text('收起出价纪录');
                    moreFlag = true;
                    moreSwitch = true;
                    if (data.isPai !== '0') {
                        cjTimerAll = setInterval(function () {
                            $.ajax({
                                url: '/house/ajaxrequest/getPaiNowInfo.php',
                                type: 'POST',
                                data: {
                                    houseId: fangyuanID,
                                    type: 'all',
                                    userId: soufangID,
                                    v: Math.random()
                                }
                            }).done(function (data) {
                                if (data) {
                                    // 简略信息轮循
                                    simpleLunxun (data);
                                    // 展示底部出价列表
                                    if (data.priceRes) {
                                        // jiluDl.find('dd .state').text('出局').removeClass('red');
                                        chujiaList.html(data.priceRes);
                                    }
                                }
                                if (data.isPai === '0') {
                                    clearInterval(cjTimer);
                                    clearInterval(cjTimerAll);
                                    clearInterval(cjTimer5);
                                }
                            });
                        }, 1000);
                    }
                }).fail(function () {
                    alert('网络有点堵，请再次点击');
                    moreSwitch = true;
                });
            }else if (moreJl.text() === '收起出价纪录') {
                $.ajax({
                    url: '/house/ajaxrequest/getPaiNowInfo.php',
                    type: 'POST',
                    data: {
                        houseId: fangyuanID,
                        userId: soufangID,
                        v: Math.random()
                    }
                }).done(function (data) {
                    chujiaList.html(data.priceRes);
                    moreJl.text('更多出价记录');
                    moreFlag = true;
                    moreSwitch = true;
                    cjTimer5 = setInterval(function () {
                        $.ajax({
                            url: '/house/ajaxrequest/getPaiNowInfo.php',
                            type: 'POST',
                            data: {
                                houseId: fangyuanID,
                                userId: soufangID,
                                v: Math.random()
                            }
                        }).done(function (data) {
                            if (data) {
                                // 简略信息轮循
                                simpleLunxun (data);
                                // 展示底部出价列表
                                if (data.priceRes) {
                                    chujiaList.html(data.priceRes);
                                    if (data.chujiaCount > 5) {
                                        moreJl.show();
                                    }else {
                                        moreJl.hide();
                                    }
                                }
                            }
                            if (data.isPai === '0') {
                                clearInterval(cjTimer);
                                clearInterval(cjTimerAll);
                                clearInterval(cjTimer5);
                            }
                        });
                    }, 1000);
                }).fail(function () {
                    alert('网络有点堵，请再次点击');
                    moreSwitch = true;
                });
            }
            
        }

    });

    /* 出价成功框 */
    var cjContinue = cjSuccess.find('.chujia');
    cjContinue.on('click', function (event) {
        event.preventDefault();
        cjSuccess.hide();
        cjBox.show();
    });

    /* 计时器实时刷新 */
    var cjTimer = setInterval(function () {
        $.ajax({
            url: '/house/ajaxrequest/getPaiNowInfo.php',
            type: 'POST',
            data: {
                houseId: fangyuanID,
                userId: soufangID,
                v: Math.random()
            }
        }).done(function (data) {
            if (data) {
                // 简略信息轮循
                simpleLunxun (data);
                // 展示底部出价列表
                if (data.priceRes) {
                    noChujia.hide();
                    jiluDt.show();
                    chujiaList.html(data.priceRes);
                    if (data.chujiaCount > 5) {
                        moreJl.show();
                    }else {
                        moreJl.hide();
                    }
                    
                }else {
                    noChujia.show();
                }
            }
            if (data.isPai === '0') {
                clearInterval(cjTimer);
            }
        });
    }, 1000);
});