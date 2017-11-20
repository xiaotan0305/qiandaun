define('modules/esfsubwaylist/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars,
        bua = navigator.userAgent.toLowerCase();
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    var newMsgDom = $('.sms-num');
    var preload = [];
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
        function dataURLClickFunc() {
            var $this = $(this);
            if (iTime) clearTimeout(iTime);
            iTime = setTimeout(function () {
                window.location.href = $this.attr('data-url');
            }, 500);
        }
        $('[data-url]').on('click', dataURLClickFunc);
    })(window, vars);
    preload.push('navflayer/navflayer_new');
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    if (vars.action !== '') {
        preload.push('modules/esfsubwaylist/' + vars.action);
    }
    require.async(preload);
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 详情页
    if (vars.action !== '') {
        require.async(['modules/esfsubwaylist/' + vars.action], function (run) {
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

    if (vars.action === 'index') {
        // 加载提示下载APP
        require.async(vars.public + 'js/20141106.js');
        // 统计功能
        if ('cd' === vars.city || 'bj' === vars.city || 'wuhan' === vars.city || 'suzhou' === vars.city) {
            (function () {
                var url = '//clickm.fang.com/click/new/clickm.js';
                if ('cd' === vars.city) {
                    url = '//click.fang.com/stats/click2011.js';
                }
                function urlLoadFunc() {
                    Clickstat.batchEvent('wapesfsy_', vars.city);
                }
                require.async(url, function () {
                    Clickstat.eventAdd(window, 'load', urlLoadFunc);
                });
            })();
        }
    }
    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
});