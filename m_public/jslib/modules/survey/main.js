/**
 * Created by lixiaoru on 2016/6/28.
 */
define('modules/survey/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    var c = window.localStorage;
    // 处理localStorage，防止在隐私模式下出错
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    var preload = [];
    var controlName = window.lib && window.lib.channelsConfig && window.lib.channelsConfig.currentChannel;
    if (controlName) {
        $.each(vars, function (index, element) {
            window.lib[index] = element;
        });
        preload.push(vars.public + 'js/header_list_new.js');
        // 加载网页导航
    }
    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    preload.push('navflayer/navflayer_new2');


    preload.push('newmsgnum/1.0.0/newmsgnum', 'backtop/1.0.0/backtop');
    if (vars.action === 'index' || vars.action === 'list') {
        // 加载提示下载APP
        preload.push(vars.public + 'js/20141106.js');
    }
    if (vars.action === 'index') {
        preload.push('lazyload/1.9.1/lazyload');
    }

    if (vars.action !== '' && vars.action !== 'integrateResult') {
        preload.push('modules/survey/' + vars.action);
    }
    require.async(preload);

    // 稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
    // 判断是否加载显示回顶按钮
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop11) {
                backTop11();
            });
            $window.off('scroll.back');
        }
    });
    var my = $('.checkLogin');
    if (my.length) {
        my.on('click', function () {
            if (vars.logined) {
                location.href = vars.mainSite + 'my/?c=mycenter&a=index&city=bj';
            } else {
                location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href + '&r=' + Date.now());
            }
        });
    }

    // 统计功能
    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            Clickstat.batchEvent('wapnewsxq_', '');
        });
    });
    // 底部 app下载 按钮
    var downApp = $('#down-btn-c');
    // 参与更多活动按钮
    var downBtn = $('#appdown');
    require.async('app/1.0.0/appdownload', function () {
        downBtn.openApp();
        downApp.openApp();
    });

    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});
