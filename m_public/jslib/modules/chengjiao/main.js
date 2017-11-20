define('modules/chengjiao/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars,
        bua = navigator.userAgent.toLowerCase();
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    var newMsgDom = $('.sms-num');
    var preload = [];
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 设置localStorage，方便之后的所有类中使用localStorage，直接判断是否存在即可，不存在就说明无法使用（为隐私模式或者不能用）
    var c = window.localStorage;
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;

    preload.push('navflayer/navflayer_new2');
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    if (vars.action !== '') {
        preload.push('modules/chengjiao/' + vars.action);
    }
    var needFilters = 0;
    if ($.inArray(vars.action, ['index']) !== -1) {
        needFilters = 1;
        preload.push('iscroll/1.0.0/iscroll', 'modules/chengjiao/filters','search/chengjiao/cjSearch');
    }

    require.async(preload);
    // 快筛
    needFilters && require.async(['modules/chengjiao/filters'], function (filter) {
        filter();
    });

    // 执行搜索初始化
    if (vars.action === 'index') {
        require.async('search/chengjiao/cjSearch', function (cjSearch) {
            var ChengJiaoSearch = new cjSearch();
            ChengJiaoSearch.init();
        });
    }

    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 详情页
    if (vars.action !== '') {
        require.async(['modules/chengjiao/' + vars.action], function (run) {
            run();
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

    // app下载
    if ($('#down-btn-c').length > 0 || $('.xfCcjIndex').length > 0 || $('.ccjIndex').length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
            // 新房查成交app下载
            $('.xfCcjIndex').openApp({position: 'xfCcjIndex'});
            // 二手房查成交app下载
            $('.ccjIndex').openApp({position: 'ccjIndex'});
        });
    }
    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
});