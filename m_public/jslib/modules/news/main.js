/**
 * 资讯模块js
 * Created by LXM on 14-12-11.
 * modified by zdl 15-12-9
 * modify by limengyang.bj@fang.com<2016-6-23>
 * 增加处理localStorage by WeiRF
 */
define('modules/news/main', ['jquery', 'search/news/newsSearch'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var c = window.localStorage;
    // 处理localStorage，防止在隐私模式下出错
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    var preload = [];
    var newMsgDom = $('.sms-num');
    var controlName = window.lib && window.lib.channelsConfig && window.lib.channelsConfig.currentChannel;
    if (controlName) {
        $.each(vars, function (index, element) {
            window.lib[index] = element;
        });
        preload.push(vars.public + 'js/header_list_new.js');
        // 加载网页导航
    }
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    preload.push('modules/news/common.js');
    if (vars.newsNavflayer) {
        preload.push('modules/news/newsNavflayer');
    } else {
        preload.push('navflayer/navflayer_new2');
    }
    preload.push('newmsgnum/1.0.0/newmsgnum', 'backtop/1.0.0/backtop');
    if (vars.action === 'index' || vars.action === 'list') {
        // 加载提示下载APP
        preload.push(vars.public + 'js/20141106.js');
    }
    if (vars.action === 'index' || vars.action === 'dsIndex') {
        preload.push('lazyload/1.9.1/lazyload');
    }
    // 如页面底部有app下载按钮引入appdownload
    if ($('#down-btn-c').length > 0 || vars.action === 'detail') {
        preload.push('app/1.0.0/appdownload');
    }
    // 执行搜索初始化
    if (vars.action === 'index' || vars.action === 'search' || vars.action === 'dsIndex' || vars.action === 'esfMarketList') {
        require.async('search/news/newsSearch', function (ZxSearch) {
            var newsSearch = new ZxSearch();
            if (vars.action === 'index' || vars.action === 'dsIndex' || vars.action === 'esfMarketList') {
                // 当不是列表页时，设置搜索按钮
                newsSearch.setShowPopBtn('.icon-sea');
            }
            newsSearch.init();
        });
    }
    var modules;
    //noJsAct命名为不需要加载js的action
    if (vars.action !== '' && vars.action !== 'esfShare' && vars.action !== 'noJsAct') {
        modules = vars.action === 'dsIndex' ? 'modules/news/index' : 'modules/news/' + vars.action;
        preload.push(modules);
    }
    require.async(preload);
    // 获取和显示新消息数
    require.async('newmsgnum/1.0.0/newmsgnum', function (NewMsgNum) {
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });
    // 下载app临时处理
    if ($('#down-btn-c').length > 0 || $('.appdownBtn').length > 0 || $('.newsLookBtn').length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
            $('.appdownBtn').openApp();
            // 头条大家都在看下载app
            $('.newsLookBtn').openApp({position: 'newsLookBtn'});
        });
    }
    if (vars.action !== 'dsIndex') {
        // 稍作页面滚动，隐藏地址栏
        window.scrollTo(0, 1);
    }
    // 判断是否加载显示回顶按钮
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop11) {
                backTop11();
            });
            $window.off('scroll.back');
        }
    });

    // 首页,noJsAct命名为不需要加载js的action
    if (vars.action !== '' && vars.action !== 'esfShare' && vars.action !== 'noJsAct') {
        require.async([modules], function (run) {
            run();
        });
    }
    // 统计功能
    require.async('//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            // 有vars.channelid是详情页
            if (vars.channelid) {
                // 0是头条，12188是导购，13202是二手房，03是房产圈详情
                switch (vars.channelid) {
                    case '0':
                        Clickstat.batchEvent('wapnewsxq_', '');
                        break;
                    case '12188':
                        Clickstat.batchEvent('wapdgnews_', '');
                        break;
                    case '13202':
                        Clickstat.batchEvent('wapesfnews_', '');
                        break;
                    case '03':
                        Clickstat.batchEvent('wapxfopen_', '');
                        break;
                    default:
                        break;
                }
            } else if (vars.channel === 'top') {
                // 头条列表页面
                Clickstat.batchEvent('wapnewssy_', '');
            } else if (vars.channel === 'daogou') {
                // 导购列表页面
                Clickstat.batchEvent('wapdgsy_', '');
            } else {
                // 其他页面
                Clickstat.batchEvent('wapnewsxq_', '');
            }
        });
    });
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});
