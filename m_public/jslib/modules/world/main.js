define('modules/world/main', ['jquery', 'search/world/worldSearch'], function (require) {
    'use strict';
    var $ = require('jquery');
    // 变量集合
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    // 通用方法
    vars.worldUtils = {
        // 禁用/启用touchmove
        toggleTouchmove: (function () {
            function preventDefault(e) {
                e.preventDefault();
            }
            return function (unable) {
                document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
            };
        })()
    };
    // 预加载文件集合
    var preload = [];
    var newMsgDom = $('.sms-num');
    preload.push('newmsgnum/1.0.0/newmsgnum');
    preload.push('navflayer/navflayer_new2');
    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    if (vars.action !== '' && $.inArray(vars.action, ['worldProcess', 'askDetail']) === -1) {
        preload.push('modules/world/' + vars.action);
    } else if (vars.action === 'askDetail') {
        preload.push('modules/world/' + vars.action, 'modules/world/maiMa');
    } else {
        preload.push('modules/world/maiMa');
    }
    preload.push('backtop/1.0.0/backtop');
    require.async(preload);
    require.async('newmsgnum/1.0.0/newmsgnum', function (NewMsgNum) {
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });
    // 搜索
    var Search = require('search/world/worldSearch');
    var worldSearch = new Search();
    worldSearch.init();
    var downBtn = $('#down-btn-c');
    if (downBtn.length > 0) {
        require.async('app/1.0.0/appdownload', function () {
            downBtn.openApp();
        });
    }

    // hide bar
    window.scrollTo(0, 1);
    // backtoTop button
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    // 统计功能
    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
    // 加载各方法js
    if (vars.action !== '' && $.inArray(vars.action, ['worldProcess']) === -1) {
        require.async(['modules/world/' + vars.action], function (run) {
            if (typeof run === 'function') {
                run();
            } else {
                run && run.init && run.init();
            }
        });
    }
});