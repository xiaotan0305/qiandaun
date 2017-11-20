/**
 * UI改版第二期需求，详情页及小区房价走势图修改为曲线形式
 * 此形式为多条曲线，并且可能存在预测
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/line/1.0.2/line', ['chart/raf/1.0.0/raf', 'iscroll/2.0.0/iscroll-lite'], function (require) {
            require('chart/raf/1.0.0/raf');
            var iscroll = require('iscroll/2.0.0/iscroll-lite');
            return f(w, iscroll);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        // 请引入chart/raf/1.0.0/raf的js
        // 请引入iscroll/2.0.0/iscroll-lite
        window.Line102 = f(w, window.IScrollLite2);
    }
})(window, function factory(w, IScroll) {
    'use strict';
    var $ = w.jQuery;
    // 画图类
    function Line(ops) {
        this.options = {
            // 走势图容器id
            id: '#line',
            // 高度
            h: 300,
            // 宽度
            w: 640,
            // 走势线线宽
            linePx: 4,
            // 能够滑动的最小数据量
            scrollNumber: 5,
            // 循环线的颜色
            lineColor: ['#ff6666', '#ff9900', '#a6b5ee'],
            // 刻度个数
            scaleNumber: 5,
            // 刻度在左边还是在右边
            scalePosition: 'right',
            // 字体
            fontFamily: ' Arial',
            // 底部字体大小及颜色
            downFontSize: '24px',
            downTxtColor: '#ccc',
            // 刻度字体大小及颜色
            scaleFontSize: '24px',
            scaleColor: '#ccc',
            // 刻度的一侧间隔
            scaleBorder: 10,
            // 点半径
            pointRadis: 8,
            // 点颜色
            pointColor: '',
            // 背景线线宽及颜色
            bgLinePx: 1,
            bgLineColor: '#ccc',
            // 走势图的上下间隔
            chartSp: 50,
            // 下部横坐标值区域的间隔
            downSp: 30,
            // 走势图左右区域的间隔
            border: 60,
            xAxis: ['1', '2', '3', '4', '5', '6'],
            data: [{
                name: 'asdf',
                color: '#ff6666',
                forecast: true,
                yAxis: [
                    {
                        value: 40000
                    },
                    {
                        value: 30000
                    },
                    {
                        value: 18000
                    },
                    {
                        value: 21000
                    },
                    {
                        value: 10000
                    },
                    {
                        value: 55500
                    }
                ]
            }]
        };
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        this.scroll = null;
        this.init();
    }

    Line.prototype = {
        init: function () {
            var that = this;
            // 获取父容器
            that.con = $(that.options.id);
            that.con.css({
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateZ(0)',
                '-webkit-transform': 'translateZ(0)',
                '-o-transform': 'translateZ(0)'
            });
            // 判断是否为欧朋特殊版本或者为小米黄页
            that.isOprera = false;
            var UA = w.navigator.userAgent.toLowerCase();
            if (/opr/.test(UA) || /miuiyellowpage/.test(UA)) {
                var p = UA.indexOf('android');
                if (p !== -1) {
                    var s = UA.substr(p + 8, 3).split('.');
                    if (parseFloat(s[0] + s[1]) < 42) {
                        that.isOprera = true;
                    }
                }
            }
            // 计算出走势图部分高度
            that.chartTotalH = that.options.height * 2 - that.options.downSp;
            // 计算出显示走势图的高度
            that.chartH = that.chartTotalH - that.options.chartSp * 2;
            // 设置刻度canvas及绘图api
            that.scaleCvs = $('<canvas height="' + that.options.height * 2 + '" style="height:' + that.options.height + 'px"></canvas>');
            that.scaleDrawApi = that.scaleCvs[0].getContext('2d');
            // 设置走势图canvas的容器，用以滑动
            that.chartCon = $('<div style="position: relative;z-index: 0;overflow: hidden;transform: translateZ(0);'
                + '-webkit-transform: translateZ(0);-o-transform: translateZ(0);'
                + '-ms-transform: translateZ(0);-moz-transform: translateZ(0);"><canvas height="'
                + that.options.height * 2 + '" style="height:' + that.options.height + 'px">您的浏览器不支持</canvas></div>');
            // 设置走势图canvas及绘图api
            that.chartCvs = that.chartCon.find('canvas');
            that.chartDrawApi = that.chartCvs[0].getContext('2d');
            // 填充数据
            that.con.append(that.scaleCvs);
            that.con.append(that.chartCon);
            that.fillAll(that.options.xAxis, that.options.data);
        },

        /**
         * 重置数据
         * @param x 横轴数据
         * @param d 纵轴数据
         */
        fillAll: function (x, d) {
            var that = this;
            if (that.scroll) {
                that.scroll.scrollTo(0, 0, 0);
                that.scroll.destroy();
            }
            that.scaleDrawApi.clearRect(0, 0, that.scaleDrawApi.canvas.width, that.scaleDrawApi.canvas.height);
            that.chartDrawApi.clearRect(0, 0, that.chartDrawApi.canvas.width, that.chartDrawApi.canvas.height);
            that.options.xAxis = x;
            that.options.data = d;
            that.fillData();
        },

        /**
         * 填充数据，根据数据算出图形显示
         */
        fillData: function () {
            var that = this;
            // 获取横坐标个数
            that.xAxisL = that.options.xAxis.length;
            // 获取数据数组
            that.dataArr = that.options.data;
            // 获取数据数组个数
            that.dataArrL = that.dataArr.length;
            // 最大值的宽度
            var maxValWidth,
            // 循环使用
                i = 0,
                j = 0,
            // 最大值
                maxVal,
            // 最小值
                minVal;

            /**
             * 循环遍历出走势图数据
             */
            for (; i < that.dataArrL; i++) {
                var yAxis = that.dataArr[i].yAxis;
                var yAxisL = yAxis.length;

                /**
                 * 循环遍历出走势图数据中各个单点数据
                 */
                for (j = 0; j < yAxisL; j++) {
                    // 获取值
                    var val = yAxis[j];
                    // 获取该值在canvas中画出需要的宽度
                    that.scaleDrawApi.save();
                    that.scaleDrawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                    if (maxValWidth === undefined || maxValWidth < that.scaleDrawApi.measureText(val).width) {
                        maxValWidth = that.scaleDrawApi.measureText(val).width;
                    }
                    that.scaleDrawApi.restore();
                    var valS = Number(val);
                    // 获取最大值
                    if (maxVal === undefined || maxVal < valS) {
                        maxVal = valS;
                    }
                    // 获取最小值
                    if (minVal === undefined || minVal > valS) {
                        minVal = valS;
                    }
                }
            }
            // 赋值计算出的数据给全局
            that.maxVal = maxVal;
            that.minVal = minVal;
            // 设置刻度显示canvas
            // 设置刻度canvas宽度
            var scaleTextW = Math.ceil((maxValWidth + that.options.scaleBorder) / 2) * 2;
            that.scaleCvs[0].width = scaleTextW;
            var cssObj = {width: scaleTextW / 2, position: 'absolute', top: '0px', 'z-index': 1};
            cssObj[that.options.scalePosition] = '0px';
            that.scaleCvs.css(cssObj);
            // 获取刻度高度间隔及数值间隔
            var scaleSpH = that.chartH / that.options.scaleNumber;
            var valSp = (maxVal - minVal) / that.options.scaleNumber;

            // 判断是左对齐还是右对齐
            var mx = that.options.scalePosition === 'left' ? 0 : scaleTextW;

            /**
             * 循环遍历算出所有的刻度，并显示到刻度canvas上
             */
            for (i = 0; i <= that.options.scaleNumber; i++) {
                var scaleVal = String(Math.floor(maxVal - i * valSp));
                var my = that.options.chartSp + i * scaleSpH;
                // 画刻度值
                that.scaleDrawApi.save();
                that.scaleDrawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                that.scaleDrawApi.textAlign = that.options.scalePosition;
                that.scaleDrawApi.textBaseline = 'center';
                that.scaleDrawApi.fillStyle = that.options.scaleColor;
                that.scaleDrawApi.fillText(scaleVal, mx, my);
                that.scaleDrawApi.restore();
            }
            // 画刻度对着走势图的竖线
            that.scaleDrawApi.save();
            that.scaleDrawApi.strokeStyle = that.options.bgLineColor;
            that.scaleDrawApi.lineWidth = that.options.bgLinePx;
            that.scaleDrawApi.beginPath();
            that.scaleDrawApi.moveTo(scaleTextW - mx, 0);
            that.scaleDrawApi.lineTo(scaleTextW - mx, that.chartTotalH);
            that.scaleDrawApi.stroke();
            that.scaleDrawApi.restore();
            // 设置走势图容器宽度
            that.chartTotalW = that.options.width - scaleTextW / 2;
            var ccObj = {width: that.chartTotalW + 'px'};
            ccObj['margin-' + that.options.scalePosition] = scaleTextW / 2 + 'px';
            that.chartCon.css(ccObj);
            // 获取走势图除两边间距后的每一部分横坐标刻度的宽度
            that.portWidth = Math.floor((that.chartTotalW * 2 - that.options.border * 2) / that.options.scrollNumber);
            var chartW = that.portWidth * (that.xAxisL - 1) + that.options.border * 2;
            // 设置走势图canvas宽度
            that.chartCvs[0].width = chartW;
            that.chartCvs.css('width', chartW / 2);
            that.drawBg();
            that.drawLine();
            that.setScroll();
        },

        /**
         * 设置滑动
         */
        setScroll: function () {
            this.scroll = new IScroll(this.chartCon[0], {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        },

        /**
         * 滚动位置
         * @param time
         */
        run: function (time) {
            var that = this;
            if (that.scroll) {
                var t = time || 2000;
                that.scroll.scrollTo(that.chartTotalW - that.chartCvs[0].width / 2, 0, t);
            }
        },

        /**
         * 画背景,包括背景线和下面的文案
         */
        drawBg: function () {
            var that = this;
            for (var i = 0; i < that.xAxisL; i++) {
                var mx = that.options.border + i * that.portWidth;
                // 画背景线
                that.chartDrawApi.save();
                that.chartDrawApi.strokeStyle = that.options.bgLineColor;
                that.chartDrawApi.lineWidth = that.options.bgLinePx;
                that.chartDrawApi.beginPath();
                that.chartDrawApi.moveTo(mx, 0);
                that.chartDrawApi.lineTo(mx, that.chartTotalH);
                that.chartDrawApi.stroke();
                that.chartDrawApi.restore();
                // 画下部文案
                that.chartDrawApi.save();
                that.chartDrawApi.font = that.options.downFontSize + that.options.fontFamily;
                that.chartDrawApi.textAlign = 'center';
                that.chartDrawApi.textBaseline = 'middle';
                that.chartDrawApi.fillStyle = that.options.downTxtColor;
                that.chartDrawApi.fillText(that.options.xAxis[i], mx, that.chartDrawApi.canvas.height - that.options.downSp / 2, that.portWidth);
                that.chartDrawApi.restore();
            }
            // 画横线
            that.chartDrawApi.save();
            that.chartDrawApi.strokeStyle = that.options.bgLineColor;
            that.chartDrawApi.lineWidth = that.options.bgLinePx;
            that.chartDrawApi.beginPath();
            that.chartDrawApi.moveTo(0, that.chartTotalH);
            that.chartDrawApi.lineTo(that.chartDrawApi.canvas.width, that.chartTotalH);
            that.chartDrawApi.moveTo(0, 0);
            that.chartDrawApi.lineTo(that.chartDrawApi.canvas.width, 0);
            that.chartDrawApi.stroke();
            that.chartDrawApi.restore();
        },

        /**
         * 画线
         */
        drawLine: function () {
            var that = this;
            var colorIdx = 0;

            /**
             * 循环遍历获取每一组走势线的数据
             */
            for (var i = 0; i < that.dataArrL; i++) {
                var color;
                // 判断是否有颜色赋值，有就用该赋值
                if (that.dataArr[i].color) {
                    color = that.dataArr[i].color;
                } else {
                    // 没有赋值时使用lineColor数组中的各颜色以此循环使用
                    if (colorIdx > that.options.lineColor.length) {
                        colorIdx = 0;
                    }
                    color = that.options.lineColor[colorIdx];
                }
                // 根据走势线的值数据画一条曲线
                that.drawOneline(that.dataArr[i].yAxis, color, that.dataArr[i].forecast);
                colorIdx++;
            }
        },

        /**
         * 画一条线
         * @param arr 该线的数据
         * @param color 改线的颜色
         * @param forecast 是否有预测
         */
        drawOneline: function (arr, color, forecast) {
            var that = this;
            // 该走势线的点个数
            var l = arr.length;
            // 循环使用
            var i = 0,
            // 换算点索引数组
                p = [];

            /**
             * 循环遍历计算出走势点在canvas中的像素坐标，并储存到p数组中
             */
            for (; i < l; i++) {
                var mx = that.options.border + i * that.portWidth;
                var my = (1 - (Number(arr[i]) - that.minVal) / (that.maxVal - that.minVal)) * that.chartH + that.options.chartSp;
                p.push({x: mx, y: my});
            }

            // 设置曲线的样式
            that.chartDrawApi.save();
            that.chartDrawApi.strokeStyle = color;
            that.chartDrawApi.lineWidth = that.options.linePx;

            var bL = forecast ? l - 2 : l - 1;

            /**
             * 循环遍历，根据公式画出三次贝塞尔曲线的两个控制点位置，并画出走势图曲线
             */
            for (i = 0; i < bL; i++) {
                var ctrlP = that.getCtrlPoint(p, i);
                that.chartDrawApi.beginPath();
                that.chartDrawApi.moveTo(p[i].x, p[i].y);
                that.chartDrawApi.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, p[i + 1].x, p[i + 1].y);
                that.chartDrawApi.stroke();
            }
            if (forecast) {
                that.dashedLineTo(that.chartDrawApi, p[l - 2].x, p[l - 2].y, p[l - 1].x, p[l - 1].y);
            }
            that.chartDrawApi.restore();

            /**
             * 循环遍历画点
             */
            for (i = 0; i < l; i++) {
                var mxx = that.options.border + i * that.portWidth;
                var myy = (1 - (arr[i] - that.minVal) / (that.maxVal - that.minVal)) * that.chartH + that.options.chartSp;
                if (i !== l - 2 || !forecast) {
                    that.chartDrawApi.save();
                    that.chartDrawApi.globalCompositeOperation = 'destination-out';
                    that.chartDrawApi.beginPath();
                    that.chartDrawApi.arc(mxx, myy, that.options.pointRadis + 4, 0, Math.PI * 2);
                    that.chartDrawApi.fill();
                    that.chartDrawApi.restore();
                }
                that.chartDrawApi.save();
                that.chartDrawApi.fillStyle = color;
                that.chartDrawApi.beginPath();
                that.chartDrawApi.arc(mxx, myy, that.options.pointRadis, 0, Math.PI * 2);
                that.chartDrawApi.fill();
                that.chartDrawApi.restore();
                if (i === l - 2 && forecast) {
                    that.chartDrawApi.save();
                    that.chartDrawApi.strokeStyle = color;
                    that.chartDrawApi.beginPath();
                    that.chartDrawApi.arc(mxx, myy, that.options.pointRadis + 5, 0, Math.PI * 2);
                    that.chartDrawApi.stroke();
                    that.chartDrawApi.restore();
                }
                // 画刻度文案
                if (forecast && i === l - 1) {
                    that.chartDrawApi.save();
                    that.chartDrawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                    that.chartDrawApi.textAlign = 'center';
                    that.chartDrawApi.textBaseline = 'bottom';
                    that.chartDrawApi.fillStyle = that.options.scaleColor;
                    that.chartDrawApi.fillText('预测', mxx, myy - 10);
                    that.chartDrawApi.restore();
                }
            }
        },

        /**
         * 画虚线
         * @param drawApi
         * @param fromX
         * @param fromY
         * @param toX
         * @param toY
         * @param pattern 虚线间断距离
         */
        dashedLineTo: function (drawApi, fromX, fromY, toX, toY, pattern) {
            if (typeof pattern === 'undefined') {
                pattern = 5;
            }

            // 计算刻度值
            var dx = toX - fromX;
            var dy = toY - fromY;
            var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
            var dashLineInteveral = pattern <= 0 ? distance : distance / pattern;
            var deltay = dy * pattern / distance;
            var deltax = dx * pattern / distance;

            // 画虚线点
            drawApi.beginPath();
            for (var dl = 0; dl < dashLineInteveral; dl++) {
                if (dl % 2) {
                    drawApi.lineTo(fromX + dl * deltax, fromY + dl * deltay);
                } else {
                    drawApi.moveTo(fromX + dl * deltax, fromY + dl * deltay);
                }
            }
            drawApi.stroke();
        },

        /**
         * 此公式是根据
         * 根据已知点获取第i个控制点的坐标
         * param ps  已知曲线将经过的坐标点
         * param i   第i个坐标点
         * param a,b 可以自定义的正数
         */
        getCtrlPoint: function (ps, i, a, b) {
            if (!a || !b) {
                a = 0.25;
                b = 0.25;
            }
            var pAx, pAy, pBx, pBy;
            if (i < 1) {
                var idx = 0;
                pAx = ps[idx].x + (ps[idx + 1].x - ps[idx].x) * a;
                pAy = ps[idx].y + (ps[idx + 1].y - ps[idx].y) * a;
            } else {
                pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * a;
                pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * a;
            }
            // 处理两种极端情形
            if (i === ps.length - 2) {
                var last = ps.length - 1;
                pBx = ps[last].x - (ps[last].x - ps[last - 1].x) * b;
                pBy = ps[last].y - (ps[last].y - ps[last - 1].y) * b;
            } else {
                pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
                pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
            }
            return {
                pA: {x: pAx, y: pAy},
                pB: {x: pBx, y: pBy}
            };
        }
    };
    return Line;
});