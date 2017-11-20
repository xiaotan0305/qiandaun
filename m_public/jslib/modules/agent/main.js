define('modules/agent/main', ['jquery'],function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars,
        bua = navigator.userAgent.toLowerCase();
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    var newMsgDom = $('.sms-num');
    var $downApp = $('#down-btn-c');
    var preload = [];
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    (function (win, vars) {
        var controlName = win.lib && win.lib.channelsConfig && win.lib.channelsConfig.currentChannel;
        if (controlName) {
            $.each(vars, function (index, element) {
                win.lib[index] = element;
            });
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
    // 图片延迟加载
    require.async('lazyload/1.9.1/lazyload', function () {
        $('img[data-original]').lazyload();
    });
    if (vars.action === 'agentShop' || vars.action === 'evaluationOfAgent' || vars.action === 'evaluationList' || vars.action === 'searchAgent') {
        preload.push('navflayer/navflayer_new2');
    }
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    if (vars.action !== '') {
        preload.push('modules/agent/' + vars.action);
    }
    // 如页面底部有app下载按钮引入appdownload
    if ($downApp.length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    require.async(preload);
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }

    // 经纪人搜索初始化
    if (vars.action && vars.action === 'searchAgent') {
        require.async('search/agent/searchAgent', function (agentSearch) {
            var agentSearch = new agentSearch();
            agentSearch.init();
        });
    }
    // 详情页
    if (vars.action !== '') {
        require.async(['modules/agent/' + vars.action], function (run) {
            run();
        });
    }

    // 下载app临时处理
    if ($downApp.length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
        });
    }
    // 稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
    // 判断是否加载显示回顶按钮
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
});