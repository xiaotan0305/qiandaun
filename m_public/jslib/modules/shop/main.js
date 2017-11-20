define('modules/shop/main', ['jquery'], function (require) {
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
        preload.push('modules/shop/' + vars.action);
    }
    require.async(preload);
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 详情页
    if (vars.action !== '') {
        require.async(['modules/shop/' + vars.action], function (run) {
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
    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
});