/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/world/map', ['jquery', 'modules/world/yhxw', 'modules/map/API/BMap'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        var mapOptions = {
            minZoom: 10,
            maxZoom: 19
        };

        // 楼盘坐标
        var gpsPoint;

        function init(zoom) {
            // 地图容器高度 = 总高度 - 页面头部高度
            $('#container').css('height', window.innerHeight - 44);
            // 创建地图实例
            var map = new BMap.Map('container', mapOptions);
            // 坐标
            gpsPoint = new BMap.Point(vars.mapy, vars.mapx);
            // 中心点
            var marker = new BMap.Marker(gpsPoint);
            map.addOverlay(marker);
            // 初始化地图，设置中心点坐标和地图缩放级别
            map.centerAndZoom(gpsPoint, zoom);
        }

        init(15);

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwhousemappage';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
            // 判断系统类型，显示客户端下载图片
            $('#clientpic').attr('src', 'http://img2.soufun.com/wap/touch/img/ipd.png');
        }
    };
});