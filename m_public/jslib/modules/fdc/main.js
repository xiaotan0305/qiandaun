/**
 * fdc入口js
 * @author chenhuan(chenhuan.bj@soufun.com)
 * @modify icy(taoxudong@soufun.com) 2015-12-07
 */
define('modules/fdc/main', ['jquery', 'search/fdc/fdcSearch'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var newMsgDom = $('.sms-num');
    var preload = [];
    // 浏览器信息
    var bua = navigator.userAgent.toLowerCase();
    // 获取隐藏域数据，置于vars中,其他js通过获取vars中的相应变量获取隐藏域数据
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    // 浏览器为小米黄页则添加小米黄页相应适配代码
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    var needSearch = false;
    switch (vars.action) {
        // 首页
        case 'index':
            preload.push('swipe/3.10/swiper', 'lazyload/1.9.1/lazyload', 'chart/line/1.0.5/line');
            break;
            // 地产数据页
        case 'residenceData':
            preload.push('highcharts/4.1.9/highcharts', 'iscroll/2.0.0/iscroll-lite', 'swipe/3.10/swiper','chart/line/1.0.5/line');
            break;
        case 'landData':
        case 'enterpriseData':
            preload.push('highcharts/4.1.9/highcharts', 'iscroll/2.0.0/iscroll-lite', 'swipe/3.10/swiper');
            break;
        case 'estateIndex':
            preload.push('chart/line/1.0.5/line', 'iscroll/2.0.0/iscroll-lite', 'swipe/3.10/swiper');
            break;
            // 地产资讯列表
        case 'getNewsList':
            needSearch = true;
            preload.push('search/fdc/fdcSearch','swipe/3.10/swiper', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore');
            break;
            // 文库、报告列表页，搜索结果页
        case 'getReportInfo':
        case 'getWenkuInfo':
        case 'searchResult':
            needSearch = true;
            preload.push('search/fdc/fdcSearch', 'loadMore/1.0.0/loadMore');
            break;
        case 'reportDetail':
            preload.push('swipe/3.10/swiper', 'iscroll/2.0.0/iscroll-lite', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min');
            break;
        case 'hotTopicsList':
            preload.push('loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload');
            break;
        case 'tdNightPaper':
            preload.push('iscroll/2.0.0/iscroll-lite');
            break;
        case 'industryIndex':
            preload.push('lazyload/1.9.1/lazyload');
            break;
        case 'indusrtyDetail':
            preload.push('chart/line/1.0.5/line');
            break;
    }
    $.inArray(vars.action, ['index','residenceData','landData','enterprise','estateIndex','topResearch'] !== -1) && preload.push('modules/fdc/switchInfo','swipe/3.10/swiper','lazyload/1.9.1/lazyload');
    // 当前action对应的js模块
    var loadAction = 'modules/fdc/' + vars.action;
    preload.push(loadAction);

    // 加载导航头部
    preload.push('navflayer/navflayer_new2');
    // 加载消息模块
    preload.push('newmsgnum/1.0.0/newmsgnum');
    // 合并加载
    require.async(preload);
    // 消息模块加载成功后获取和显示新消息数
    require.async('newmsgnum/1.0.0/newmsgnum', function (NewMsgNum) {
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });

    // 下载app临时处理
    if ($('#down-btn-c').length > 0) {
        require.async('app/1.0.0/appdownload.js', function ($) {
            $('#down-btn-c').openApp();
        });
    }
    // 稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
    // 判断是否加载显示回顶按钮
    var $window = $(window);
    // 绑定滚动条事件，触发后解绑，只执行一次
    // 指定命名空间，解绑时可以不解绑backtop/1.0.0/backtop里绑定的scroll事件
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            // 解绑.back命名空间下的scroll事件
            $window.off('scroll.back');
        }
    });
    // 页面模块载入完成后执行对应js代码
    require.async(loadAction, function (run) {
        run();
    });
    // 中指报告搜索模块
    if (needSearch) {
        require.async('search/fdc/fdcSearch', function (Search) {
            var fdcSearch = new Search();
            fdcSearch.init();
        });
    }
    //部署click点击统计
    require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
        Clickstat.eventAdd(window, 'load', function () {
            Clickstat.batchEvent('wapfdc_', '');
        });
    });

    // 统计功能
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});
