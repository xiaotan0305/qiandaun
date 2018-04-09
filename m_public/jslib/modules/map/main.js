/**
 * 地图入口主类
 * by blue
 * 20151105 blue 整理代码，删除冗长代码，增加注释，修改搜素为最新重构版本
 */
define('modules/map/main', ['jquery'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 页面传入参数
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 设置localStorage，方便之后的所有类中使用localStorage，直接判断是否存在即可，不存在就说明无法使用（为隐私模式或者不能用）
    var c = window.localStorage;
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    // 百度地图容器
    var $mapCon = $('#allmap');
    // 地图对应栏目前缀对象
    var mapObj = {
        esfMap: 'esf',
        zfMap: 'zf',
        xfMap: 'xf',
        index: 'xf'
    };
    var preload = [];
    // 房源详情页周边配套地图
    if (vars.action === 'xfMapbyId') {
        require.async('modules/map/searchmap', function (run) {
            run();
        });
        // 点击统计
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapxfzb_', '');
            });
        });
    } else if (vars.action === 'xfMapAround') {
        // 房源详情页周边配套详情信息
        require.async('modules/map/aroundDetail', function (run) {
            run();
        });
    } else if (vars.action === 'loudongMap') {
        require.async('modules/map/loudongMap', function (run) {
            run();
        });
    } else if (vars.action === 'cfjMap') {
        require.async('modules/map/cfj', function (run) {
            run.init();
        });
    } else {
        preload.push('modules/map/API/BMap');
        preload.push('modules/map/API/esfMapApi');
        preload.push('modules/map/API/zfMapApi');
        preload.push('modules/map/API/xfMapApi');
        preload.push('modules/map/mapPublic');
        preload.push('app/1.0.0/appdownload');
        require.async(preload);
        // 屏幕的大小，不带地址栏
        var $win = $(window), $header = $('header'), lbTab = $('.lbTab');
        // 初始化地图大小, 减去header的高度和筛选框高度
        var hHeader = $header.outerHeight() || 0, hTab = lbTab.outerHeight() || 0;
        $mapCon.height($win.height() - hHeader - hTab);
        $mapCon.width($win.width());

        // 横竖屏更换
        $win.on('resize', function () {
            $mapCon.css({
                height: $win.height() - ($header.outerHeight() || 0) - (lbTab.outerHeight() || 0) + 'px',
                width: $win.width()
            });
        });
        // 加载页面数据及地图
        var current = mapObj[vars.action];
        require.async('modules/map/' + current + 'SFMap', function (SFMap) {
            require.async('modules/map/' + current + 'dhjs', function () {
                SFMap.init();
            });
        });
        // 点击统计
        require.async('//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wap' + current + 'ditu_', '');
            });
        });
        // 统计功能
        require.async('count/loadforwapandm.min.js');
        require.async('count/loadonlyga.min.js');
    }
});