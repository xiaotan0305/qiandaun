/**
 * juhe入口主类
 * by blue
 * 20150922 blue
 */
define('modules/juhe/main', ['jquery'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 窗口jquery对象实例
    var $window = $(window);
    // 页面传入的参数对象
    var vars = seajs.data.vars;
    var UA = navigator.userAgent.toLowerCase();
    // 下载app
    var downBtn = $('#down-btn-c');
    // 热combo使用的加载数组
    var preload = [];
    // 统一将页面中后台使用input的hidden类型传入的参数置入vars中，！！！这个方法明显应该放在入口文件中
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    // 如页面底部有app下载按钮引入appdownload
    if (downBtn.length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    // 引用搜索类
    if (vars.action === 'search') {
        preload.push('search/juhe/juheSearch');
    }
    // 加载导航操作js
    preload.push('navflayer/navflayer_new2');
    // 判断是否为小米黄页，加载小米黄页操作js
    if (UA.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 当action不为空时，加载栏目主类
    if (vars.action !== '') {
        preload.push('modules/juhe/' + vars.action);
    }
    // 加载置顶操作js
    preload.push('backtop/1.0.0/backtop');
    // 将需要加载的js异步加载
    require.async(preload);
    if (downBtn.length > 0) {
        require.async('app/1.0.0/appdownload', function () {
            downBtn.openApp();
        });
    }
    if (vars.action !== '') {
        // 执行栏目主类
        require.async(['modules/juhe/' + vars.action], function (run) {
            run();
        });
    }
    // 搜索初始化
    if (vars.action === 'detail') {
        require.async('search/juhe/juheSearch', function (Search) {
            var zhishiSearch = new Search();
            if (vars.action === 'detail') {
                // 当不是列表页时，设置搜索按钮
                zhishiSearch.setShowPopBtn('.icon-sea');
                $('.icon-sea').attr('id', 'wapjuhexq_B01_01');
            }
            zhishiSearch.init();
        });
    }
    if (vars.action === 'search') {
        require.async('search/juhe/juheSearch', function (Search) {
            var juheSearch = new Search();
            juheSearch.init();
        });
    }

    // 稍作页面滚动，隐藏地址栏
    $window.scrollTop(1);
    // 判断是否加载显示回顶按钮，.back的用处是给scroll加一个命名空间，防止将backtop中绑定的scroll事件一起解绑
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });

    // click
    if (vars.action === 'detail' || vars.action === 'ajaxCaiNiXiHuan' || vars.action === 'ajaxGetRelatedTags') {
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function (e) {
                Clickstat.batchEvent('wapjuhexq_', '');
            });
        });
    }
    // 统计功能
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});