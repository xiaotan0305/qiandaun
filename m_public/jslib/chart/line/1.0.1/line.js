/**
 * 大首页走势图（曲线形式）
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/line/1.0.1/line', ['chart/raf/1.0.0/raf'], function (require) {
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
            data: [[
                {
                    name: 'a',
                    value: 40000
                },
                {
                    name: 'b',
                    value: 30000
                },
                {
                    name: 'c',
                    value: 18000
                },
                {
                    name: 'd',
                    value: 21000
                },
                {
                    name: 'e',
                    value: 10000
                },
                {
                    name: 'f',
                    value: 55500,
                    icon: true
                }
            ]]
        };
        for (var i in ops) {
            this.options[i] = ops[i];
        }
        this._init();
    }

    Line.prototype = {
        _init: function () {
            var that = this;
            that.more = false;
            that.con = $(that.options.id);
            that.con.css({overflow: 'visible', transform: 'translateX(0)', '-webkit-transform': 'translateX(0)'});
            that.cvs = $('<canvas></canvas>');
            that.drawApi = this.cvs[0].getContext('2d');
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
            var maxL, i = 0, j = 0, maxVal, minVal;
            if (arrL > 1) {
                that.more = true;
                for (; i < arrL; i++) {
                    if (maxL === undefined || maxL < that.dataArr[i].length) {
                        maxL = that.dataArr[i].length;
                    }
                    for (; j < that.dataArr[i].length; j++) {
                        var val = Number(that.dataArr[i][j].value);
                        if (maxVal === undefined || maxVal < val) {
                            maxVal = val;
                        }
                        if (minVal === undefined || minVal > val) {
                            minVal = val;
                        }
                    }
                }
            } else {
                maxL = arr[0].length;
                for (i = 0; i < maxL; i++) {
                    var value = Number(that.dataArr[0][i].value);
                    if (maxVal === undefined || maxVal < value) {
                        maxVal = value;
                    }
                    if (minVal === undefined || minVal > value) {
                        minVal = value;
                    }
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
                that.specailWidth = (that.drawApi.canvas.width - that.options.border * 2) / 2;
            }
            that.portWidth = (that.drawApi.canvas.width - that.options.border * 2) / num;
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
                // 画背景线
                that.drawApi.save();
                that.drawApi.strokeStyle = that.options.bgLineColor;
                that.drawApi.lineWidth = that.options.bgLinePx;
                that.drawApi.beginPath();
                that.drawApi.moveTo(mx, 0);
                that.drawApi.lineTo(mx, that.chartTotalH);
                that.drawApi.stroke();
                that.drawApi.restore();
                // 画下部文案
                that.drawApi.save();
                that.drawApi.font = that.options.downFontSize + that.options.fontFamily;
                that.drawApi.textAlign = 'center';
                that.drawApi.textBaseline = 'middle';
                that.drawApi.fillStyle = that.options.downTxtColor;
                that.drawApi.fillText(that.dataArr[0][i].name, mx, that.drawApi.canvas.height - that.options.downSp / 2, that.portWidth);
                that.drawApi.restore();
            }
            // 画横线
            that.drawApi.save();
            that.drawApi.strokeStyle = that.options.bgLineColor;
            that.drawApi.lineWidth = that.options.bgLinePx;
            that.drawApi.beginPath();
            that.drawApi.moveTo(0, that.chartTotalH);
            that.drawApi.lineTo(that.drawApi.canvas.width, that.chartTotalH);
            that.drawApi.stroke();
            that.drawApi.restore();
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
            var l = arr.length, i = 0, p = [];
            for (; i < l; i++) {
                var mx = that.options.border + i * that.portWidth + that.specailWidth;
                var my = (1 - (Number(arr[i].value) - that.minVal) / (that.maxVal - that.minVal)) * that.chartH + that.options.chartSp;
                p.push({x: mx, y: my});
            }
            that.drawApi.save();
            that.drawApi.strokeStyle = color;
            that.drawApi.lineWidth = that.options.linePx;
            for (i = 0; i < l - 1; i++) {
                var ctrlP = that.getCtrlPoint(p, i);
                that.drawApi.beginPath();
                that.drawApi.moveTo(p[i].x, p[i].y);
                that.drawApi.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, p[i + 1].x, p[i + 1].y);
                that.drawApi.stroke();
            }
            that.drawApi.restore();
            for (i = 0; i < l; i++) {
                var mxx = that.options.border + i * that.portWidth + that.specailWidth;
                var myy = (1 - (arr[i].value - that.minVal) / (that.maxVal - that.minVal)) * that.chartH + that.options.chartSp;
                if (i !== l - 1) {
                    that.drawApi.save();
                    that.drawApi.fillStyle = '#fff';
                    that.drawApi.beginPath();
                    that.drawApi.arc(mxx, myy, that.options.pointRadis + 4, 0, Math.PI * 2);
                    that.drawApi.fill();
                    that.drawApi.restore();
                }
                that.drawApi.save();
                that.drawApi.fillStyle = color;
                that.drawApi.beginPath();
                that.drawApi.arc(mxx, myy, that.options.pointRadis, 0, Math.PI * 2);
                that.drawApi.fill();
                that.drawApi.restore();
                if (i === l - 1) {
                    that.drawApi.save();
                    that.drawApi.strokeStyle = color;
                    that.drawApi.beginPath();
                    that.drawApi.arc(mxx, myy, that.options.pointRadis + 5, 0, Math.PI * 2);
                    that.drawApi.stroke();
                    that.drawApi.restore();
                }
                // 画刻度文案
                that.drawApi.save();
                that.drawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                that.drawApi.textAlign = 'center';
                that.drawApi.textBaseline = 'bottom';
                that.drawApi.fillStyle = that.options.scaleColor;
                that.drawApi.fillText(arr[i].value, mxx, myy - 20);
                that.drawApi.restore();
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