/**
 * @Author: chenshaoshan
 * @Date:   2016/01/12
 * @description: 跨年福气大比拼活动
 * @Last Modified by:   chenshaoshan
 * @Last Modified time:
 */
$(function () {
    'use strict';

    var isLoginStr = $('.islogin_str_js').val().trim();
    var pointStr = $('.point_str_js').val();
    var mainHostStr = 'http://' + window.location.host;
    var showTimeInt = 3;
    // ---------function--------------------------------------------------
    function prepgame() {
        if (isLoginStr === 'yes') {
            $('.jf-num').html(pointStr);
        }
    };
    prepgame();
    // 未登录 进入登录页面
    function updateShow() {
        $('.cf82').html(showTimeInt);
        if (showTimeInt === 0) {
            // 进入登录页
            var gameHomeUrlstr = mainHostStr
                + '/huodongAC.d?class=NewYearOf2016Hc&m=newYearAcitvity';
            gameHomeUrlstr = encodeURIComponent(gameHomeUrlstr);
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl='
                + gameHomeUrlstr;
        } else {
            showTimeInt--;
            setTimeout(function () {
                updateShow();
            }, 1000);
        }
    }

    function goPlayGame(gameUrlstr) {
        if (isLoginStr === 'yes') {
            setTimeout(function () {
                window.location.href = gameUrlstr;
            }, 1000);
        } else {
            $('.shade').show();
            $('.downBox').show();
            updateShow();
        }
    }

    // ----------on---------------------------------------------------------
    // 好运吼不住 wangbiao
    $('.play_game1_js').on('click', function () {
        var gameurlstr = mainHostStr + '/huodongAC.d?m=getLotteryInfo&class=YaoyiyaoHc&lotteryId=100025&city=bj&channel=others&cytype=newYearActivity';
        goPlayGame(gameurlstr);
    });
    // 新春猜不停 zhouhengrui
    $('.play_game2_js').on('click', function () {
        var gameurlstr = mainHostStr + '/huodongAC.d?class=GuessPriceGetMoenyHc&m=guessPricePage';
        goPlayGame(gameurlstr);
    });
    // 礼包任你拿  haofuwei
    $('.play_game3_js').on('click', function () {
        var gameurlstr = mainHostStr + '/huodongAC.d?m=activityIndex&class=CarHc&wheelLotteryId=100125';
        goPlayGame(gameurlstr);
    });
    // 我要当学霸 zhuqingxiang
    $('.play_game4_js').on('click', function () {
        var gameurlstr = mainHostStr + '/huodongAC.d?class=YiZhanDaoDiHc&m=index&lotteryId=100074&s=newYearActivity';
        goPlayGame(gameurlstr);
    });

    // 赚钱攻略
    $('.btn-gl').on('click', function () {
        $('body').css('position','fixed');
        $('.shade').show();
        $('.ruleBox').show();
    });
    $('.rule_colse_js').on('click', function () {
        $('body').css('position','static');
        $('.shade').hide();
        $('.ruleBox').hide();
    });
    // 下载app
    $('.downBtn').on('click', function () {
        window.location.href = 'http://m.fang.com/client.jsp?city=bj&produce=soufun&from=kuanian&os=';
    });
    // 兑换  跳积分商城
    $('.btn-dh').on('click', function () {
        window.location.href = 'http://m.store.fang.com/index.html?from=kuanian';
    });
    // 记录
    $('.btn-jl').on('click', function () {
        $('body').css('position','fixed');
        if (isLoginStr === 'yes') {
            $('.shade').show();
            $('.recordBox').show();
        } else {
            $('.shade').show();
            $('.downBox').show();
            updateShow();
        }
    });
    // 关闭记录
    $('.record_colse_js').on('click', function () {
        $('body').css('position','static');
        $('.shade').hide();
        $('.recordBox').hide();
    });
    // 关闭下载登录页
    $('.down_close_js').on('click', function () {
        $('body').css('position','static');
        $('.shade').hide();
        $('.downBox').hide();
    });
});