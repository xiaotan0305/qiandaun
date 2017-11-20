define('modules/schoolhouse/main',['jquery'],function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars,
        bua = navigator.userAgent.toLowerCase();
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    var newMsgDom = $('.sms-num');

    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var preload = [];
    (function (win, vars) {
        var controlName = win.lib && win.lib.channelsConfig && win.lib.channelsConfig.currentChannel;
        if (controlName) {
            $.each(vars, function (index, element) {
                win.lib[index] = element;
            });
            // preload.push(vars.public + 'js/header_list_new.js');
        }
        var c = win.localStorage;
        try {
            if (c) c.setItem('testPrivateModel', !1);
        } catch (d) {
            c = null;
        }
        vars.localStorage = c;
        var iTime;
        function clickFunc() {
            if (iTime) clearTimeout(iTime);
            var thisNode = $(this);
            iTime = setTimeout(function () {
                window.location.href = thisNode.attr('data-url');
            }, 500);
        }
        $('[data-url]').on('click',clickFunc);
    })(window, vars);

    if (vars.action === 'new_schoolhouse_index') {
        preload.push('search/search','search/esf/schoolSearch');
    }
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    if (newMsgDom&&newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    if (vars.action !== '') {
        preload.push('modules/schoolhouse/' + vars.action);
    }
    preload.push('navflayer/navflayer_new2');
    require.async(preload);
    if (newMsgDom&&newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            if (NewMsgNum) {
                new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
            }
        });
    }
    // 详情页
    if (vars.action !== '') {
        require.async(['modules/schoolhouse/' + vars.action], function (run) {
            if (run) {
                run();
            }
        });
    }

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

    if (vars.action === 'new_schoolhouse_index' || vars.action === 'detail') {
        var clickVal;
        if (vars.action === 'new_schoolhouse_index') {
            // 加载提示下载APP
            require.async(vars.public + 'js/20141106.js');
            // 统计参数
            clickVal = 'wapschoolhousesy_';
        } else {
            clickVal = 'wapschoolhousexq_';
        }
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            var Clickstat = window.Clickstat;
            Clickstat.eventAdd(window, 'load', function() {
                Clickstat.batchEvent(clickVal, '');
            });
        });        
    }
    
    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
    // require.async(['loadinfo/loadinfo.js']);
});