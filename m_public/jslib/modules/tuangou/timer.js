/**
 * @file merge js files,ESLint
 * @author zcf(zhangcongfeng@fang.com)
 */
define('modules/tuangou/timer', [],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        function updateEndTime() {
            var date = new Date();
            var time = date.getTime();
            // 当前时间距1970年1月1日之间的毫秒数
            var tuantime = document.getElementsByName('tuantime');
            for (var i = 0;i < tuantime.length;i++) {
                var endDate = tuantime[i].getAttribute('endTime');
                // 结束时间字符串
                var dataTemp = Date.parse(endDate);
                // 这里进行更改
                // 转换为时间日期类型
                var endDate1 = new Date(dataTemp);
                var endTime = endDate1.getTime();
                // 结束时间毫秒数
                var lag = (endTime - time) / 1000;
                // 当前时间和结束时间之间的秒数
                if (lag > 0) {
                    var second = Math.floor(lag % 60);
                    var minite = Math.floor(lag / 60 % 60);
                    var hour = Math.floor(lag / 3600 % 24);
                    var day = Math.floor(lag / 3600 / 24);
                    if (day > 0) {
                        tuantime[i].innerHTML = day + '天' + hour + '小时' + minite + '分' + second + '秒';
                    }else {
                        tuantime[i].innerHTML = hour + '小时' + minite + '分' + second + '秒';
                    }
                }else {
                    tuantime[i].innerHTML = '团购已经结束啦！';
                }
            }
        }
        updateEndTime();
        setInterval(updateEndTime, 1000);
    };
});