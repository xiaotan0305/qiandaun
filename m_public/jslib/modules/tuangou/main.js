/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/tuangou/main',['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var newMsgDom = $('.sms-num');
    var controlName = window.lib && window.lib.channelsConfig && window.lib.channelsConfig.currentChannel;
    var preload = [];
    preload.push('navflayer/navflayer_new');
    if (controlName) {
        $.each(vars, function (index,element) {
            window.lib[index] = element;
        });
        preload.push(vars.public + 'js/header_list_new.js');
    }
    if (vars.action !== '') {
        preload.push('modules/tuangou/' + vars.action);
    }
    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push(['miuiYellowPage/miuiYellowPage']);
    }
    preload.push('newmsgnum/1.0.0/newmsgnum');
    preload.push('backtop/1.0.0/backtop');
    require.async(preload);

    if (vars.action !== '') {
        require.async('modules/tuangou/' + vars.action, function (run) {
            run();
        });
    }
    // 显示消息提示
    require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });

    if (vars.action === 'index') {
        // 加载提示下载APP
        require.async(vars.public + 'js/20141106.js');
    }

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