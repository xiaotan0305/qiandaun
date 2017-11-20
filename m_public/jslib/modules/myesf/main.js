/**
 * 我的二手房入口主类
 * by blue
 * 20151009 blue 整理代码、优化代码、删除没用代码，增加注释，修复导航不能点击的bug
 */
define('modules/myesf/main', ['jquery'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // window的jquery对象实例
    var $window = $(window),
    // 页面传入的参数
        vars = seajs.data.vars,
    // 浏览器useragent
        UA = navigator.userAgent.toLowerCase(),
    // 预加载数组，用于热combo
        preload = [],
    // 判断是否为详情页，！！！这里从字面上理解是这样的，但是实际上这个的标识是为了判断是否含有vars是否含有action属性
        isDetail = false,
    // 索引localStorage
        c = window.localStorage,
    // 新消息节点实例
        newMsgDom = $('.sms-num');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 判断是否可用localStorage并判断是否为隐私模式
    try {
        if (c) {
            c.setItem('testPrivateModel', !1);
        }
    } catch (d) {
        c = null;
    }
    // 经判断是否可用localStorage,以供之后的js使用
    vars.localStorage = c;
    // 判断小米黄页，如果是则将小米黄页处理js插入预加载数组
    if (UA.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 导航新消息提醒，如果有则将新消息处理js插入预加载数组
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    // 判断页面是否有导航按钮，如果有则插入导航js至预加载数组
    if ($.inArray(vars.action, ['yyOrderList', 'myEsfQgDetail', 'myEsfFbqg', 'myEsfFbgl',
            'myFbchushouDetail', 'myDaiKanRecord', 'delegateResale', 'saleBySelf',
            'fangJiaZouShi', 'successfabu', 'gouFang', 'housePurchase', 'houseDetail', 'sellCommission']) !== -1) {
        preload.push('navflayer/navflayer_new2');
    }
    if (vars.action === 'autoAppeal' || vars.action === 'saleStaup' || vars.action === 'delegateAndResale' || vars.action === 'editDelegate' || vars.action === 'houseDetail' ||
    vars.action === 'publishAppend') {
        preload.push('navflayer/navflayer_new2');
    }
    // 下载app临时处理
    if ($('#down-btn-c').length > 0) {
        require.async('app/1.0.0/appdownload.js', function ($) {
            $('#down-btn-c').openApp();
        });
    }
    // 在数组内的vars.action，调用详情页js
    if ($.inArray(vars.action, ['autoAppeal', 'yyOrderList', 'myEsfFbqg', 'myEsfFbgl', 'tradeDetail', 'gouFang',
            'houseDetail', 'weituoAgentListDS',
            'delegateResale', 'saleBySelf', 'fangJiaZouShi', 'index', 'similarHouses',
            'commentList', 'yzDianPing', 'weituoAgentListDS', 'pageOfOwnerComment', 'myDaiKanRecord', 'getHousePrceRecord','traDetailComment', 'yiKanEvaluation', 'sellCommission']) !== -1) {
        preload.push('modules/myesf/' + vars.action);
        isDetail = true;
    }
    if(vars.action === 'delegateAndResale') {
        require.async('modules/myesf/mvc/publishview',function(run) {
            run();
        });
    }
    if(vars.action === 'editDelegate') {
        require.async('modules/myesf/mvc/publishviewEdit',function(run) {
            run();
        });
    }
    // 信息完善
    if(vars.action === 'publishAppend') {
        require.async('modules/myesf/mvc/pubAppend',function(run) {
            run();
        });
    }
    // 图片完善
    if(vars.action === 'editImg') {
        require.async('modules/myesf/mvc/editImg',function(run) {
            run();
        });
    }
    // 业主月报
    if(vars.action === 'yzMonReport') {
        require.async('modules/myesf/yzMonReport',function(run) {
            run();
        });
    }
    // 在数组内的vars.action，下载app
    if ($.inArray(vars.action, ['myEsfFbqg', 'myEsfFbgl', 'myEsfQgDetail',
            'houseDetail', 'myDaiKanRecord']) !== -1) {
        preload.push(vars.public + 'js/20141106.js');
    }
    preload.push('modules/myesf/saleStaup');
    preload.push('backtop/1.0.0/backtop');
    // 预加载所需js
    require.async(preload);
    // 如果有新消息，初始化新消息处理js
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 在数组内的vars.action，调用详情页js
    if (isDetail) {
        require.async(['modules/myesf/' + vars.action], function (run) {
            run();
        });
    }
    // 稍作页面滚动，隐藏地址栏
    $window.scrollTop(1);
    // 判断是否加载显示回顶按钮
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    // 加载统计分析js
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
    //加载统计功能代码(短信通知委托业主详情页面统计用)
    if (vars.action === 'houseDetail') {
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapmyesf_', '');
            });
        });
    }
});