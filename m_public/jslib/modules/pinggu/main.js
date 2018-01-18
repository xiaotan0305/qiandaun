/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/main', ['jquery', 'superShare/1.0.1/superShare', 'weixin/2.0.1/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var newMsgDom = $('.sms-num');
    var nav = $('.icon-nav');
    var preload = [];
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var c = window.localStorage;
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    if (nav.length > 0) {
        preload.push('navflayer/navflayer_new2');
    }
    // 插入查房价重构后新搜索
    if (vars.action === 'index' || vars.action === 'list' || vars.action === 'districtDetail' || vars.action === 'xfDealList' || vars.action === 'esfDealList') {
        preload.push('search/search','search/cfj/cfjSearch');
    }
    // 评估结果页,小区房价页和海外房价页合并js
    if (vars.action === 'result' || vars.action === 'detail' || vars.action === 'worldFangjia') {
        preload.push('chart/raf/1.0.0/raf','chart/line/2.0.0/line');
    }
    // 评估页加载搜素js
    if (vars.action === 'accurate') {
        preload.push('search/search','search/cfj/xiaoquSearch','iscroll/2.0.0/iscroll-lite');
    }
    // 评估结果页合并加载相应js
    if (vars.action === 'result') {
        preload.push('chart/1.0.0/pie');
    }
    // 购房能力评估结果页,首页和列表页加载相应js
    if (vars.action === 'buyerAssessResult' || vars.action === 'index' || vars.action === 'list') {
        preload.push('lazyload/1.9.1/lazyload');
    }
    // 区县页和商圈页加载相应js
    if (vars.action === 'districtDetail' || vars.action === 'comareaDetail') {
        preload.push('chart/raf/1.0.0/raf','chart/line/1.0.3/line');
    }
    // 邻居房价页加载相应js
    if (vars.action === 'linJuPricePage') {
        preload.push('lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore');
    }
    // 小区房价页加载相应js
    if (vars.action === 'detail') {
        preload.push('share/share');
    }
    // 海外查房价页加载相应js
    if (vars.action === 'worldFangjia') {
        preload.push('iscroll/2.0.0/iscroll-lite');
    }

    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 下载app临时处理
    if ($('#down-btn-c').length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    preload.push('modules/pinggu/' + vars.action);
    // 获取和显示新消息数
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    //增加分享
    if (vars.action === 'index' || vars.action === 'xiaoquFj' || vars.action === 'xfDealList' || vars.action === 'xfdistrictDetail' || vars.action === 'esfDealList' || vars.action === 'comareaDetail' || vars.action === 'buyerAssess') {
        if (location.href.indexOf('?') === -1) {
            var shareLink = location.href + '?isshare=share';
        } else {
            var shareLink = location.href + '&isshare=share';
        }
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: vars.shareTitle,
            descContent: vars.shareDescription,
            lineLink: shareLink,
            imgUrl: window.location.protocol + vars.shareImage,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/1.0.1/superShare');
        var config = {
            // 分享的内容title
            title: vars.shareTitle,
            // 分享时的图标
            image: window.location.protocol + vars.shareImage,
            // 分享内容的详细描述
            desc: vars.shareDescription,
            // 分享的链接地址
            url: shareLink,
        };
        var superShare = new SuperShare(config);
    }
    require.async(preload);
    // 下载app临时处理
    if ($('#down-btn-c').length > 0) {
        require.async('app/1.0.0/appdownload.js', function ($) {
            if (vars.action === 'accurate') {
                var appUrl = 'waptoapp/{"destination":"jingzhunpinggu","city":"' + vars.cityname + '"}';
                $('#down-btn-c').openApp({appUrl: appUrl});
            } else {
                $('#down-btn-c').openApp();
            }
        });
    }
    // 搜索初始化
    if (vars.action === 'list' || vars.action === 'districtDetail' || vars.action === 'xfDealList' || vars.action === 'esfDealList') {
        require.async('search/cfj/cfjSearch', function (CfjSearch) {
            var cfjSearch = new CfjSearch();
            cfjSearch.init();
        });
    }
    //首页搜索改版，进入本频道新页面-小区房价页
    if (vars.action === 'index' || vars.action === 'indexList') {
        require.async('search/cfj/cfjIndexSearch', function (CfjSearch) {
            var cfjSearch = new CfjSearch();
            cfjSearch.init();
        });
    }
    if (newMsgDom.length > 0) {
        require.async('newmsgnum/1.0.0/newmsgnum', function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
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
                $('#wapesfsy_D04_01').css('bottom','75px');
            });
            $window.off('scroll.back');
        }
    });

    // 详情页
    if (vars.action !== '') {
        require.async(['modules/pinggu/' + vars.action], function (run) {
            run();
        });
    }
    var clickVal = 'wappinggusy_';
    if (vars.action == 'districtDetail') {
        clickVal = 'wappingguqylist_';
    } else if (vars.action == 'result') {
        clickVal = 'wappingguxq_';
    } else if (vars.action == 'iBargin' && vars.share !== 'share') {
        clickVal = 'wapcfjkj_';
    } else if (vars.action == 'iBargin' && vars.share === 'share') {
        clickVal = 'wapkjjgshare_';
    }
    require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
        var Clickstat = window.Clickstat;
        Clickstat.eventAdd(window, 'load', function() {
            Clickstat.batchEvent(clickVal, '');
        });
    });
    // 统计功能
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});