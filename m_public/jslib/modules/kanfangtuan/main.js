define('modules/kanfangtuan/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
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
            if (c) {
                c.setItem('testPrivateModel', !1);
            }
        } catch (d) {
            c = null;
        }
        vars.localStorage = c;
    })(window, vars);
    // 事件委托
    $('body').delegate('click', '[data-url]', function (index, elem) {
        var self = $(elem);
        setTimeout(function () {
            window.location.href = self.attr('data-url');
        }, 500);
    });
    // 获取隐藏域数据
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });

    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 插入导航操作js
    preload.push('navflayer/navflayer_new2');
   
    var newMsgDom = $('.sms-num');
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    preload.push('footprint/1.0.0/footprint');
    if (vars.action !== '') {
        if (vars.action === 'index') {
            preload.push('loadMore/1.0.0/loadMore', 'iscroll/2.0.0/iscroll-lite', 'swipe/3.10/swiper.js');
        }
        if (vars.action === 'kanDetail') {
            preload.push('iscroll/2.0.0/iscroll-lite');
        }
        preload.push('modules/kanfangtuan/' + vars.action);
        if (vars.action === 'map' || vars.action === 'kanDetail' || vars.action === 'index') {
            preload.push('modules/kanfangtuan/baomingNew');
        }
    }
    preload.push('backtop/1.0.0/backtop');

    require.async(preload);

    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }

    window.scrollTo(0, 1);

    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    // 流程，声明页面不需要加载方法js
    if (vars.action !== '' && vars.action !== 'liucheng' && vars.action !== 'shengming') {
        require.async(['modules/kanfangtuan/' + vars.action], function (run) {
            run();
        });
    }
    if (vars.action === 'map' || vars.action === 'kanDetail' || vars.action === 'index') {
        require.async(['modules/kanfangtuan/baomingNew'], function (run) {
            run();
        });
    }

    if (vars.action === 'index') {
        // 加载提示下载APP
        // require.async(vars.public + 'js/20141106.js');
        // 统计功能
        if ('cd' === vars.city || 'bj' === vars.city || 'wuhan' === vars.city || 'suzhou' === vars.city || 'tj' === vars.city) {
            require.async('//clickm.fang.com/click/new/clickm.js', function () {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapesfsy_', vars.city);
                });
            });
        }
    }
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});