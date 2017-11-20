    (function (window, factory) {
        'use strict';
        if (typeof module === 'object' && typeof module.exports === 'object') {
            // CommonJS
            module.exports = factory(window);
        } else {
            // browser global
            factory(window);
        }
    })(window, function (window) {
        'use strict';
        var document = window.document;
        function pie(id) {
            this.canvas = document.querySelector(id);
            this.context = this.canvas.getContext('2d');
            this.radius = this.canvas.height / 2 - 2;
            // 半径
            this.ox = this.radius + 2;
            this.oy = this.radius + 2;
        }
        pie.prototype.draw = function (data) {
            var startAngle = 0;
            // 起始弧度
            var endAngle = 0;
            // 结束弧度
            var config = data || {data: [], color: []};
            var dataArr = config.data;
            var colorArr = config.color;
            var ctx = this.context;
            var i, maxId = 0, max = dataArr[0];
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (i = 1; i < dataArr.length; i++) {
                if (dataArr[i] > max) {
                    maxId = i;
                }
            }
            for (i = 0; i < dataArr.length; i++) {
                if (dataArr[i] < 0.005) {
                    dataArr[maxId] = dataArr[maxId] + dataArr[i] - 0.005;
                    dataArr[i] = 0.005;
                }
            }
            ctx.lineWidth = 1.0;
            // 设置线宽
            ctx.strokeStyle = '#fff';
            // 设置线的颜色
            for (i = 0; i < dataArr.length; i++) {
                // 绘制饼图
                endAngle += dataArr[i] * Math.PI * 2;
                // 结束弧度
                ctx.fillStyle = colorArr[i];
                ctx.beginPath();
                ctx.moveTo(this.ox, this.oy);
                // 移动到到圆心
                ctx.arc(this.ox, this.oy, this.radius, startAngle, endAngle, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                startAngle = endAngle;
                // 设置起始弧度
            }
        };
        if (typeof define === 'function') {
            define('chart/1.0.0/pie', [], function () {
                return pie;
            });
        } else {
            var chart = window.chart || (window.chart = {});
            chart.pie = pie;
        }
        return pie;
    });