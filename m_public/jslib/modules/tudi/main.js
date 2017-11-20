/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/tudi/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var newMsgDom = $('.sms-num');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var preload = [];
    var controlName = window.lib && window.lib.channelsConfig && window.lib.channelsConfig.currentChannel;
    if (controlName) {
        $.each(vars, function (index, element) {
            window.lib[index] = element;
        });
        preload.push(vars.public + 'js/header_list_new.js');
    }
    preload.push('navflayer/navflayer_new2');
    if (vars.action !== '') {
        require.async('modules/tudi/' + vars.action, function (run) {
            run();
        });
    }
    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    require.async(preload);
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

    //部署click点击统计
    require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            Clickstat.batchEvent('waptudi_', '');
        });
    });

    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
});