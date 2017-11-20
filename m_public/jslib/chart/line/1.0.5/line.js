/**
 * fdc走势图（曲线形式）
 * by blue
 * modify by icy
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/line/1.0.5/line', ['chart/raf/1.0.0/raf'], function (require) {
            require('chart/raf/1.0.0/raf');
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        // 请引入chart/raf/1.0.0/raf的js
        window.Line11 = f(w);
    }
})(window, function factory(w) {
    'use strict';
    var $ = w.jQuery;

    function DrawApi(context) {
        this.context = context;
    }
    DrawApi.prototype = {

        /**
         * 画一条实线
         * @param {Object} opts 线的数据
         * opts{sx, sy, dx, dy, lineWidth, lineColor}
         */
        drawRealLine: function (opts) {
            var context = this.context;
            context.save();
            context.strokeStyle = opts.lineColor;
            context.lineWidth = opts.lineWidth;
            context.beginPath();
            context.moveTo(opts.sx, opts.sy);
            context.lineTo(opts.dx, opts.dy);
            context.stroke();
            context.restore();
        },

        /**
         * 画一条虚线
         * @param {Object} opts 线的数据
         * opts{sx, sy, dx, dy, lineWidth, lineColor}
         */
        drawDashLine: function (opts) {
            var that = this;
            var xLength = opts.dx - opts.sx;
            var yLength = opts.dy - opts.sy;
            var length = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
            var deltaXL = opts.dashLineLen / length * xLength;
            var deltaXW = opts.dashWhiteLen / length * xLength;
            var deltaYL = opts.dashLineLen / length * yLength;
            var deltaYW = opts.dashWhiteLen / length * yLength;
            var sx = opts.sx,
                sy = opts.sy,
                dx, dy;
            while (sx < opts.dx) {
                dx = sx + deltaXL < opts.dx ? sx + deltaXL : opts.dx;
                dy = sy + deltaYL < opts.dy ? sy + deltaYL : opts.dy;
                that.drawRealLine({
                    sx: sx,
                    sy: sy,
                    dx: dx,
                    dy: dy,
                    lineWidth: opts.lineWidth,
                    lineColor: opts.lineColor
                });
                sx = dx + deltaXW;
                sy = dy + deltaYW;
            }
        },

        /**
         * 画一条贝塞尔曲线
         * @param {Object} opts 线的数据
         * opts{sx, sy, cpax, cpay, cpbx, cpby, dx, dy, lineWidth, lineColor}
         */
        drawBezierCurve: function (opts) {
            var context = this.context;
            context.save();
            context.strokeStyle = opts.lineColor;
            context.lineWidth = opts.lineWidth;
            context.beginPath();
            context.moveTo(opts.sx, opts.sy);
            context.bezierCurveTo(opts.cpax, opts.cpay, opts.cpbx, opts.cpby, opts.dx, opts.dy);
            context.stroke();
            context.restore();
        },

        /**
         * 填充文本
         * @param {Object} opts 文本数据
         * opts{ax, ay, str, maxWidth, font, textAlign, textBaseline, color}
         */
        drawTxt: function (opts) {
            var context = this.context;
            context.save();
            context.font = opts.font;
            context.textAlign = opts.textAlign || 'center';
            context.textBaseline = opts.textBaseline || 'middle';
            context.fillStyle = opts.color;
            if (opts.maxWidth) {
                context.fillText(opts.str, opts.ax, opts.ay, opts.maxWidth);
            } else {
                context.fillText(opts.str, opts.ax, opts.ay);
            }
            context.restore();
        },

        /**
         * 画圆
         * @param {Object} opts 文本数据
         * opts{x, y, radius, color,isFill}
         */
        drawCircle: function (opts) {
            var context = this.context;
            context.save();
            context[opts.isFill ? 'fillStyle' : 'strokeStyle'] = opts.color;
            context.beginPath();
            context.arc(opts.x, opts.y, opts.radius, 0, Math.PI * 2);
            context[opts.isFill ? 'fill' : 'stroke']();
            context.restore();
        }
    };
    // 画图类
    function Line(ops) {
        this.options = {
            id: '#line',
            h: 300,
            w: 640,
            linePx: 4,
            lineColor: ['#f66'],
            scaleNumber: 5,
            fontFamily: ' Arial',
            // 底部字体大小
            downFontSize: '24px',
            downTxtColor: '#ccc',
            // 底部字体大小
            scaleFontSize: '24px',
            scaleColor: '#f66',
            pointRadis: 8,
            pointColor: '',
            bgLinePx: 1,
            bgLineColor: '#ccc',
            chartSp: 100,
            downSp: 30,
            border: 40,
            data: [
                [{
                    name: 'a',
                    value: 40000
                }, {
                    name: 'b',
                    value: 30000
                }, {
                    name: 'c',
                    value: 18000
                }, {
                    name: 'd',
                    value: 21000
                }, {
                    name: 'e',
                    value: 10000
                }, {
                    name: 'f',
                    value: 55500,
                    icon: true
                }]
            ],
            // 最后一个数据是否需要强调，默认true
            lastDataImpt: true,
            // 横向网格数量
            horizontalLineCount: 1,
            // 虚线实线块宽度
            dashLineLen: 10,
            // 图是否为曲线
            isCurve: true
        };
        for (var i in ops) {
            this.options[i] = ops[i];
        }
        // 虚线空白块长度 默认和实线一样长
        this.options.dashWhiteLen = this.options.dashWhiteLen || this.options.dashLineLen;
        this._init();
    }

    Line.prototype = {
        _init: function () {
            var that = this;
            that.more = false;
            that.con = $(that.options.id);
            that.con.css({
                overflow: 'visible',
                transform: 'translateX(0)',
                '-webkit-transform': 'translateX(0)'
            });
            that.cvs = $('<canvas></canvas>');
            that.context = this.cvs[0].getContext('2d');
            that.drawApi = new DrawApi(that.context);
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
            that.cvs[0].width = that.options.width * 2;
            that.cvs[0].height = that.options.height * 2;
            that.chartTotalH = that.options.height * 2 - that.options.downSp;
            that.chartH = that.chartTotalH - that.options.chartSp * 2;
            // 一共有6条线，并且要给最下面的说明留下一个空位
            // that.options.portHeight = that.chartH / (that.options.scaleNumber * 2);
            that.cvs.css('width', that.options.width + 'px');
            that.cvs.css('height', that.options.height + 'px');
            that.fillData(that.options.data);
            that.con.append(that.cvs);
        },
        fillData: function (arr) {
            var that = this;
            that.dataArr = arr;
            var arrL = arr.length;
            var maxL, i = 0,
                j = 0,
                maxVal, minVal;
            if (arrL > 1) {
                that.more = true;
                for (; i < arrL; i++) {
                    var dataArrL = that.dataArr[i].length;
                    dataArrL < maxL || (maxL = dataArrL);
                    for (; j < dataArrL; j++) {
                        var val = Number(that.dataArr[i][j].value);
                        val < maxVal || (maxVal = val);
                        val > minVal || (minVal = val);
                    }
                }
            } else {
                maxL = arr[0].length;
                for (i = 0; i < maxL; i++) {
                    var value = Number(that.dataArr[0][i].value);
                    value < maxVal || (maxVal = value);
                    value > minVal || (minVal = value);
                }
            }
            that.dataArrL = maxL;
            that.maxVal = maxVal;
            that.minVal = minVal;
            if (that.maxVal === that.minVal) {
                that.maxVal = that.minVal + 1;
            }
            var num = that.dataArrL - 1;
            that.specailWidth = 0;
            if (that.dataArrL === 1) {
                num = 2;
                that.specailWidth = (that.context.canvas.width - that.options.border * 2) / 2;
            }
            that.portWidth = (that.context.canvas.width - that.options.border * 2) / num;
            that.drawBg();
            that.drawLine();
        },

        /**
         * 画背景,包括背景线和下面的文案
         */
        drawBg: function () {
            var that = this;
            for (var i = 0; i < that.dataArrL; i++) {
                var mx = that.options.border + i * that.portWidth + that.specailWidth;
                that[i ? 'xRight' : 'xLeft'] = mx;
                // 画背景线
                that.drawApi.drawRealLine({
                    sx: mx,
                    sy: 0,
                    dx: mx,
                    dy: that.chartTotalH,
                    lineWidth: that.options.bgLinePx,
                    lineColor: that.options.bgLineColor
                });
                // 画下部文案
                that.drawApi.drawTxt({
                    ax: mx,
                    ay: that.context.canvas.height - that.options.downSp / 2,
                    str: that.dataArr[0][i].name,
                    maxWidth: that.portWidth,
                    font: that.options.downFontSize + that.options.fontFamily,
                    color: that.options.downTxtColor
                });
            }
            // 画背景水平网格线
            that.horizontalBgLine();
        },
        horizontalBgLine: function () {
            var that = this;
            var totalH = that.chartTotalH;
            var count = that.options.horizontalLineCount;
            var perH = count - 1 && totalH / (count - 1);
            for (var i = 0; i < count; i++) {
                // 画横线
                var needDashLine = i > 0 && i < count - 1;
                var opts = {
                    sx: needDashLine ? this.xLeft : 0,
                    dx: needDashLine ? this.xRight : that.context.canvas.width,
                    lineWidth: that.options.bgLinePx,
                    lineColor: that.options.bgLineColor,
                    dashLineLen: that.options.dashLineLen,
                    dashWhiteLen: that.options.dashWhiteLen
                };
                opts.sy = opts.dy = totalH - i * perH;

                that.drawApi[needDashLine ? 'drawDashLine' : 'drawRealLine'](opts);
            }
        },

        /**
         * 画线
         */
        drawLine: function () {
            var that = this;
            if (that.more) {
                var l = that.dataArr.length;
                var colorIdx = 0;
                for (var i = 0; i < l; i++) {
                    if (colorIdx > that.options.lineColor.length) {
                        colorIdx = 0;
                    }
                    var color = that.options.lineColor[colorIdx];
                    that.drawOneline(that.dataArr[i], color);
                    colorIdx++;
                }
            } else {
                that.drawOneline(that.dataArr[0], that.options.lineColor[0]);
            }
        },

        /**
         * 画一条线
         * @param arr 该线的数据
         * @param color 改线的颜色
         */
        drawOneline: function (arr, color) {
            var that = this;
            var l = arr.length,
                i = 0,
                p = [];
            for (; i < l; i++) {
                var mx = that.options.border + i * that.portWidth + that.specailWidth;
                var my = (1 - (Number(arr[i].value) - that.minVal) / (that.maxVal - that.minVal)) * that.chartH + that.options.chartSp;
                p.push({
                    x: mx,
                    y: my
                });
            }
            for (i = 0; i < l; i++) {
                // 画点
                var radius = that.options.pointRadis;
                var pointOpts = {
                    x: p[i].x,
                    y: p[i].y,
                    color: '#fff',
                    radius: radius + 4,
                    isFill: true
                };
                if (i !== l - 1 || !that.options.lastDataImpt) {
                    that.drawApi.drawCircle(pointOpts);
                }
                pointOpts.color = color;
                pointOpts.radius = radius;
                that.drawApi.drawCircle(pointOpts);
                if (i === l - 1 && that.options.lastDataImpt) {
                    pointOpts.radius = radius + 5;
                    pointOpts.isFill = false;
                    that.drawApi.drawCircle(pointOpts);
                }
                // 画刻度文案
                that.drawApi.drawTxt({
                    ax: p[i].x,
                    ay: p[i].y - 20,
                    str: arr[i].value,
                    textBaseline: 'bottom',
                    font: that.options.scaleFontSize + that.options.fontFamily,
                    color: that.options.scaleColor
                });
                // 连线
                if (i < l - 1) {
                    var lineOpts = {
                        sx: p[i].x,
                        sy: p[i].y,
                        dx: p[i + 1].x,
                        dy: p[i + 1].y,
                        lineColor: color,
                        lineWidth: that.options.linePx
                    };
                    if (that.options.isCurve) {
                        var ctrlP = that.getCtrlPoint(p, i);
                        lineOpts.cpax = ctrlP.pA.x;
                        lineOpts.cpay = ctrlP.pA.y;
                        lineOpts.cpbx = ctrlP.pB.x;
                        lineOpts.cpby = ctrlP.pB.y;
                    }
                    that.drawApi[that.options.isCurve ? 'drawBezierCurve' : 'drawRealLine'](lineOpts);
                }
            }
        },

        /**
         * 此公式是根据
         * 根据已知点获取第i个控制点的坐标
         * param ps  已知曲线将经过的坐标点
         * param i   第i个坐标点
         * param a,b 可以自定义的正数
         */
        getCtrlPoint: function (ps, i, a, b) {
            var α = a || 0.25;
            var β = b || 0.25;
            var pAx, pAy, pBx, pBy;
            if (i < 1) {
                var idx = 0;
                pAx = ps[idx].x + (ps[idx + 1].x - ps[idx].x) * α;
                pAy = ps[idx].y + (ps[idx + 1].y - ps[idx].y) * α;
            } else {
                pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * α;
                pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * α;
            }
            // 处理两种极端情形
            if (i === ps.length - 2) {
                var last = ps.length - 1;
                pBx = ps[last].x - (ps[last].x - ps[last - 1].x) * β;
                pBy = ps[last].y - (ps[last].y - ps[last - 1].y) * β;
            } else {
                pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * β;
                pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * β;
            }
            return {
                pA: {
                    x: pAx,
                    y: pAy
                },
                pB: {
                    x: pBx,
                    y: pBy
                }
            };
        }
    };
    return Line;
});