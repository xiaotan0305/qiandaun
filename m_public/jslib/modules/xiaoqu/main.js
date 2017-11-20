/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/xiaoqu/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var newMsgDom = $('.sms-num');
    var downloadApp = $('#down-btn-c');
    var preload = [];
    // 将页面中通过input为hidden类型传入的后台数据存入vars中
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    preload.push('navflayer/navflayer_new2');
    // preload.push('modules/xiaoqu/' + vars.action);
    preload.push('newmsgnum/1.0.0/newmsgnum');
    preload.push('modules/xiaoqu/im');
    // 判断是否需要加载appdownload.js
    if (downloadApp.length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    if ($('.app-down-detail').length >0 || downloadApp.length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
            $('.app-down-detail').openApp({position: $('.app-down-detail').find('a').attr('data-position')});
        });
    }
    // 小区详情页合并加载js
    if (vars.action === 'xqDetail') {
        preload.push('chart/raf/1.0.0/raf', 'iscroll/2.0.0/iscroll-lite', 'chart/line/1.0.2/line','swipe/3.10/swiper');
    }
    // 合并每个页面对应js
   
    if (vars.action !== '' && vars.action !== 'xqSearchSpecial' && vars.action !== 'jump404') {
        preload.push('modules/xiaoqu/' + vars.action);
        require.async(preload);
        require.async('modules/xiaoqu/' + vars.action, function (run) {
            run();
        });
    }
    
    if (vars.action === 'xqSearchSpecial') {
        preload.push('search/search');
        require.async('search/xiaoqu/xqdpSearch', function (xqdpSearch) {
            var xqdpSearch = new xqdpSearch();
            xqdpSearch.init();
        });
    }
    if (vars.action === 'askPrice') {
        preload.push('search/search','search/xiaoqu/xiaoquSearch');
        require.async('search/xiaoqu/xiaoquSearch', function (XiaoquSearch) {
            var XiaoquSearch = new XiaoquSearch();
            //console.log(XiaoquSearch);
            XiaoquSearch.init();
        });
    }
    if (vars.action === 'jump404') {
        require.async(preload);
    }
    // 显示消息提示
    require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });

    if (vars.action === 'index') {
        // 加载提示下载APP
        require.async(vars.public + 'js/20141106.js');
    }
    // 判断localStorage是否可用，同时判断是否为隐私模式
    var c = window.localStorage;
    try {
        if (c) {
            c.setItem('testPrivateModel', !1);
        }
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    if (vars.action === 'xqDetail') {
        // 判断登录状态 登录去掉 登录和注册
        $.get(vars.xiaoquSite + '?c=xiaoqu&a=checkLoginMode', function (data) {
            if (data === '1') {
                $('#loginMode').hide();
                $('#registerMode').hide();
            } else {
                $('#loginMode').show();
                $('#registerMode').show();
            }
        });
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
    // click统计
    var cityArr = ['bj', 'sh', 'tj', 'wuhan', 'zz', 'sjz', 'cd', 'nanjing', 'sh', 'gz', 'sz'];
    if (vars.action === 'xqDetail') {
        if (cityArr.indexOf(vars.city) > -1) {
            require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
                var Clickstat = window.Clickstat;
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapxqxqy_', vars.city);
                });
            });
        }
    }

    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');

});