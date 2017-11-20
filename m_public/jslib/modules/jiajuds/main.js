/**
 * modified by zdl on 15-9-16.
 */
define('modules/jiajuds/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var bua = navigator.userAgent.toLowerCase();
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    var newMsgDom = $('.sms-num');
    var preload = [];
    var win = window;
    // 通用方法
    vars.jiajuUtils = {
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

    if ($.inArray(vars.action, ['myOrderInfo']) !== -1) {
        preload.push('navflayer/navflayer_new2');
    } else if($.inArray(vars.action, ['couponShop','shopInfo','goodsInfo','dpqComment','dpqRules','buyCoupon','video','buyCouponResult']) !== -1) {
        preload.push('modules/jiaju/jiajuNavflayer');
    }else{
        preload.push('navflayer/navflayer_new');
    }
    // localstorage
    var c = win.localStorage;
    try {
        if (c) {
            c.setItem('testPrivateModel', !1);
        }
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    var thisDom;

    function dataUrlClick() {
        setTimeout(function () {
            window.location.href = thisDom.attr('data-url');
        }, 500);
    }
    $('[data-url]').each(function (i, n) {
        thisDom = $(n);
        thisDom.bind('click', function () {
            dataUrlClick();
        });
    });
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // vars.action && preload.push('modules/jiajuds/' + vars.action);
    // vars.action === 'myOrderInfo' && preload.push(vars.public + 'js/jiaju20141106.js');
    preload.push('newmsgnum/1.0.0/newmsgnum');
    var needFilters = 0;
    if ($.inArray(vars.action, ['couponShop']) !== -1) {
        needFilters = 1;
        preload.push('iscroll/1.0.0/iscroll', 'modules/jiaju/filters');
    }      
    require.async(preload);
    // 快筛
    needFilters && require.async(['modules/jiaju/filters'], function (filter) {
        filter();
    });
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 其他入口
    vars.action && require.async(['modules/jiajuds/' + vars.action], function (run) {
        if (typeof run === 'function') {
            run();
        }        
        // } else if (typeof run === 'object' && typeof run.init === 'function') {
        //     run.init();
        // }
    });

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
    function clickmfunc() {
        window.Clickstat.eventAdd(window, 'load', function () {
            window.Clickstat.batchEvent('wapjiajusy_', vars.city);
        });
    }
    if (vars.action === 'newindex') {
        if ('cd' === vars.city || 'bj' === vars.city || 'wuhan' === vars.city || 'suzhou' === vars.city || 'tj' === vars.city) {
            (function () {
                var url = '//clickm.fang.com/click/new/clickm.js';
                require.async(url, function () {
                    clickmfunc();
                });
            })();
        }
    }
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});