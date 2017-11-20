/**
 *文档载入信息
 *by icy
 *LoadInfo
 *  |--name:文档名
 *  |--timing:文档加载所有时间点obj
 *  |--type:文档加载类型 0:TYPE_NAVIGATE,1:TYPE_RELOAD,2:TYPE_BACK_FORWARD
 *  |--sourceList:文档资源加载信息array
 *  |   |--name:资源名(url)
 *  |   |--initiatorType:资源类型 script:js,link:css,img:img
 *  |   |--所有时间点
 *  |
 *  |--battery:电池情况
 *  |   |--charging:是否连接电源 true/false
 *  |   |--level:电量(0~1)
 *
 * 时间点详见文档加载时序图
 */

(function (f) {
    if (typeof define === 'function') {
        define('loadinfo/loadinfo', ['jquery'], function (require) {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            f($, vars);
        });
    } else if (typeof exports === 'object') {
        module.exports = f();
    } else {
        f();
    }
})(function ($, vars) {
    var LoadInfo = function () {
        var ajaxLoadInfo = function (data) {
            $.ajax({
                url: '/xf.d?m=collectdata',
                type: 'post',
                data: 'data=' + encodeURIComponent(JSON.stringify(data))
            });
            // console.log(data);
        };
        var loadInfo = {};
        var performance = window.performance || window.webkitPerformance || window.msPerformance;
        // 文档加载类型 0:TYPE_NAVIGATE,1:TYPE_RELOAD,2:TYPE_BACK_FORWARD
        loadInfo.type = performance.navigation.type;
        // if (loadInfo.type !== 0) return;
        // 文档名
        loadInfo.name = vars ? vars.entrance.replace(/main$/, '') + vars.action : location.href;
        loadInfo.city = vars && vars.city;
        loadInfo.cityname = vars && vars.cityname || vars.ubcity || undefined;
        // 文档加载时间
        loadInfo.timing = performance.timing;

        // 资源加载情况
        var entriesList = performance.getEntriesByType('resource');
        entriesList && (loadInfo.sourceList = entriesList);
        // 电池情况
        // chrome
        if (navigator.getBattery) {
            navigator.getBattery().then(function (battery) {
                loadInfo.battery = {
                    charging: battery.charging,
                    level: battery.level
                };
                ajaxLoadInfo(loadInfo);
            });
        } else {
            // firefox
            if (navigator.battery) {
                loadInfo.battery = {
                    charging: navigator.battery.charging,
                    level: navigator.battery.level
                };
            }
            ajaxLoadInfo(loadInfo);
        }
    };

    $(window).load(function () {
        setTimeout(LoadInfo, 100);
    });
});