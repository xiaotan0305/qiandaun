define('modules/my/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var bua = navigator.userAgent.toLowerCase();
    var preload = [];
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    (function (win, vars) {
        var controlName = win.lib && win.lib.channelsConfig && win.lib.channelsConfig.currentChannel;
        if (controlName) {
            $.each(vars, function (index, element) {
                win.lib[index] = element;
            });
            preload.push(vars.public + 'js/header_list_new.js');
        }
        var c = win.localStorage;
        try {
            if (c) c.setItem('testPrivateModel', !1);
        } catch (d) {
            c = null;
        }
        vars.localStorage = c;
        var iTime;
        var tempFunc = function () {
            var $this = $(this);
            if (iTime) clearTimeout(iTime);
            iTime = setTimeout(function () {
                window.location.href = $this.attr('data-url');
            }, 500);
        };
        $('[data-url]').on('click', tempFunc);
    })(window, vars);
    var rmid = '';
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    if (vars.action === 'getIncomeList' || vars.action === 'getOutcomeList') {
        rmid = 'modules/my/' + 'getIncomeList';
        preload.push();
    } else if (vars.action === 'transfer' || vars.action === 'payOut' || vars.action === 'payout') {
        rmid = 'modules/my/' + 'transfer';
        preload.push();
    } else if (vars.action !== '') {
        rmid = 'modules/my/' + vars.action;
        preload.push();
    }
    if (vars.action == 'publishExamine') {
        preload.push('navflayer/navflayer_new2');
    } else if (vars.action !== '' || vars.action !== 'zhiDingSuc') {
        preload.push('navflayer/navflayer_new');
    }
    require.async(preload);
    if (rmid) {
        require.async([rmid], function (run) {
            run();
        });
    }
    
    // 显示下载浮层
    if (vars.action === 'myAccount') {
        require.async(vars.public + 'js/20141106.js');
    }

    if (!(vars.action !== '' || vars.action !== 'zhiDingSuc')) {
        $ = window.$;
        var header = $('header'),
            hIcon = header.children('div.head-icon'),
            // hCenter = header.children('div.cent'),
            icoNav = hIcon.find('a.icon-nav'),
            userName,
            nav = $('#nav').css({
                position: 'absolute',
                width: '100%',
                top: '44px',
                'z-index': '9999'
            }),
            headerPosition,
            navShadow = $('div#navShadow').css({
                position: 'absolute',
                'z-index': '9998'
            }),
            smsNum, smsNumContainer, callback = window.navFlayer || (window.navFlayer = {});
        // 在这里定义函数
        var showNav = function () {
            nav.show();
            navShadow.show();
            icoNav.addClass('active');
            if (smsNum === undefined) {
                smsNum = $('.sms-num').first();
                smsNumContainer = smsNum.parent();
            }
            smsNum.detach();
            headerPosition = header.css('position');
            if (headerPosition !== 'absolute') {
                header.css({
                    position: 'absolute',
                    width: '100%',
                    top: '0px',
                    'z-index': '9999'
                });
            }
            if (undefined === userName) {
                $.get('/public/?c=public&a=ajaxUserInfo', function (o) {
                    userName = '';
                    if (o !== !1 && undefined !== o.username) {
                        $('div#nav div.mt10 div.nav-tit a').text(userName = o.username);
                    }
                });
            }
            if ($.isFunction(callback.show)) callback.show();
        };
        var hideNav = function () {
            nav.hide();
            navShadow.hide();
            icoNav.removeClass('active');
            if (headerPosition !== 'absolute') {
                header.css({
                    position: headerPosition
                });
            }
            if (Boolean(smsNumContainer)) smsNumContainer.append(smsNum);
            if ($.isFunction(callback.hide)) callback.hide();
        };
        icoNav.on('click', function () {
            if (nav.is(':hidden')) {
                showNav();
                $('#headSear').hide();
            } else {
                hideNav();
            }
        });
        navShadow.on('click', function () {
            hideNav();
            $('#headSear').hide();
        });
        callback.hideNav = hideNav;
        return callback;
    }

    // 我的钱 底部 app下载 按钮
    require.async('app/1.0.0/appdownload', function () {
        $('#down-btn-c').openApp();
    });
    
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});