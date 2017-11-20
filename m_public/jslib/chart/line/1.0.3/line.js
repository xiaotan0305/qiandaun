/**
 * UI改版第二期需求，查房价首页走势图(只有两条线)
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/line/1.0.3/line', ['chart/raf/1.0.0/raf'], function (require) {
            require('chart/raf/1.0.0/raf');
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        // 请引入chart/raf/1.0.0/raf的js
        window.Line103 = f(w);
    }
})(window, function factory(w) {
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
            // 循环线的颜色
            lineColor: ['#ff6666', '#ff9900', '#a6b5ee'],
            // 刻度个数
            scaleNumber: 5,
            // 字体
            fontFamily: ' Arial',
            // 底部字体大小及颜色
            downFontSize: '24px',
            downTxtColor: '#999',
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
            // 动画时长
            runTime: 1000,
            lineArr: [{
                lineColor: '#ff6666',
                pointColor: '#ff6666',
                data: [
                    {
                        name: '15-06',
                        value: '32719'
                    }
                ]
            }]
        };
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
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
            that.isOld = false;
            var UA = w.navigator.userAgent.toLowerCase();
            if (/opr/.test(UA) || /miuiyellowpage/.test(UA)) {
                var p = UA.indexOf('android');
                if (p !== -1) {
                    var s = UA.substr(p + 8, 3).split('.');
                    if (parseFloat(s[0] + s[1]) < 42) {
                        that.isOld = true;
                    }
                }
            }
            // 计算出走势图部分高度
            that.chartTotalH = that.options.h * 2 - that.options.downSp;
            // 计算出显示走势图的高度
            that.chartH = that.chartTotalH - that.options.chartSp * 2;
            // 设置走势图canvas及绘图api
            that.cvs = $('<canvas>你的浏览器不支持</canvas>');
            // 设置canvas的宽高和样式宽高,之所以2比1是为了保持所有绘制都是高清图
            that.cvs[0].width = that.options.w * 2;
            that.cvs[0].height = that.options.h * 2;
            that.cvs.css('width', that.options.w + 'px');
            that.cvs.css('height', that.options.h + 'px');
            that.drawApi = that.cvs[0].getContext('2d');
            // 填充数据
            that.con.append(that.cvs);
            that.fillData();
        },

        /**
         * 重置数据
         * @param d 纵轴数据
         */
        fillAll: function (d) {
            var that = this;
            that.drawApi.clearRect(0, 0, that.drawApi.canvas.width, that.drawApi.canvas.height);
            that.options.lineArr = d;
            that.fillData();
        },

        /**
         * 填充数据，根据数据算出图形显示
         */
        fillData: function () {
            var that = this;
            // 获取数据数组
            that.dataArr = that.options.lineArr;
            // 最大值的宽度
            that.dataArrL = that.options.lineArr.length;
            that.xAxisL = that.dataArr[0].data.length;
            // 循环使用
            var i = 0,
                j = 0,
            // 最大值
                maxVal,
            // 最小值
                minVal;
            if (that.dataArrL !== 2) {
                // 循环遍历出走势图数据
                for (; i < that.dataArrL; i++) {
                    var yAxis = that.dataArr[i].data;
                    var yAxisL = yAxis.length;

                    /**
                     * 循环遍历出走势图数据中各个单点数据
                     */
                    for (j = 0; j < yAxisL; j++) {
                        // 获取值
                        var val = yAxis[j].value;
                        var valS = Number(val);
                        yAxis[j].txt = true;
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
            } else {
                // 修改循环，设置为判断文字高下位置
                // 修改曲线交叉，文字重叠bug
                var yAxis0 = that.dataArr[0].data;
                var yAxis1 = that.dataArr[1].data;
                var valMax, valMin;
                for (; i < that.xAxisL; i++) {
                    // 获取值
                    var val0 = yAxis0[i].value;
                    var val1 = yAxis1[i].value;
                    var valS0 = Number(val0);
                    var valS1 = Number(val1);
                    if (valS0 >= valS1) {
                        valMax = valS0;
                        valMin = valS1;
                        yAxis0[i].txt = true;
                        yAxis1[i].txt = false;
                    } else {
                        valMax = valS1;
                        valMin = valS0;
                        yAxis0[i].txt = false;
                        yAxis1[i].txt = true;
                    }
                    // 获取最大值
                    if (maxVal === undefined || maxVal < valMax) {
                        maxVal = valMax;
                    }
                    // 获取最小值
                    if (minVal === undefined || minVal > valMin) {
                        minVal = valMin;
                    }
                }
            }
            // 赋值计算出的数据给全局
            that.maxVal = maxVal;
            that.minVal = minVal;
            if (that.maxVal === that.minVal) {
                that.maxVal = that.minVal * 5;
            }
            // 获取走势图除两边间距后的每一部分横坐标刻度的宽度
            that.portWidth = Math.floor((that.drawApi.canvas.width - that.options.border * 2) / (that.xAxisL - 1));
        },

        /**
         * 外部接口，执行图形动画
         */
        run: function () {
            // 获取开始动画初试时间
            this.start = new Date().getTime();
            this.an();
        },

        /**
         * 动画执行方法
         */
        an: function () {
            var that = this;
            w.requestAnimationFrame(function () {
                that.animation();
            });
        },

        /**
         * 循环动画执行方法
         */
        animation: function () {
            var that = this;
            that.drawApi.clearRect(0, 0, that.drawApi.canvas.width, that.drawApi.canvas.height);
            that.drawBg();
            that.drawLine();
            // 欧朋浏览器及老旧浏览器不兼容刷新处理
            if (that.isOld) {
                that.cvs.detach();
                that.con.append(that.cvs);
            }
            // 判断是否结束动画否则继续绘制
            if (!that.over) {
                that.an();
            }
        },

        /**
         * 画背景,包括背景线和下面的文案
         */
        drawBg: function () {
            var that = this;
            var arr = that.dataArr[0].data;
            for (var i = 0; i < that.xAxisL; i++) {
                var mx = that.options.border + i * that.portWidth;
                // 画背景线
                that.drawApi.save();
                that.drawApi.strokeStyle = that.options.bgLineColor;
                that.drawApi.lineWidth = that.options.bgLinePx;
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
                that.drawApi.fillText(arr[i].name, mx, that.drawApi.canvas.height - that.options.downSp / 2, that.portWidth);
                that.drawApi.restore();
            }
            // 画横线
            that.drawApi.save();
            that.drawApi.strokeStyle = that.options.bgLineColor;
            that.drawApi.lineWidth = that.options.bgLinePx;
            that.drawApi.moveTo(0, that.chartTotalH);
            that.drawApi.lineTo(that.drawApi.canvas.width, that.chartTotalH);
            that.drawApi.moveTo(0, 0);
            that.drawApi.lineTo(that.drawApi.canvas.width, 0);
            that.drawApi.stroke();
            that.drawApi.restore();
        },

        /**
         * 画线
         */
        drawLine: function () {
            var that = this;
            var colorIdx = 0;
            var now = new Date().getTime();
            var change = that.options.runTime === 0 ? 1 : (now - that.start) / that.options.runTime;
            // 这是动画结束标示
            if (change >= 1) {
                that.over = true;
            }
            if (change * that.drawApi.canvas.width < that.options.border)return;
            that.drawApi.save();
            that.drawApi.rect(0, 0, change * that.drawApi.canvas.width, that.drawApi.canvas.height);
            that.drawApi.clip();
            // 循环遍历获取每一组走势线的数据
            for (var i = 0; i < that.dataArrL; i++) {
                var color;
                // 判断是否有颜色赋值，有就用该赋值
                if (that.dataArr[i].lineColor) {
                    color = that.dataArr[i].lineColor;
                } else {
                    // 没有赋值时使用lineColor数组中的各颜色以此循环使用
                    if (colorIdx > that.options.lineColor.length) {
                        colorIdx = 0;
                    }
                    color = that.options.lineColor[colorIdx];
                }
                // 根据走势线的值数据画一条曲线
                that.drawOneline(that.dataArr[i].data, color, change);
                colorIdx++;
            }
            that.drawApi.restore();
        },

        /**
         * 画一条线
         * @param arr 该线的数据
         * @param color 改线的颜色
         * @param c 变量
         */
        drawOneline: function (arr, color, c) {
            var that = this;
            // 该走势线的点个数
            var l = arr.length;
            // 循环使用
            var i = 0,
            // 换算点索引数组
                p = [];
            // 循环遍历计算出走势点在canvas中的像素坐标，并储存到p数组中
            for (; i < l; i++) {
                var mx = that.options.border + i * that.portWidth;
                var my = (1 - (Number(arr[i].value) - that.minVal) / (that.maxVal - that.minVal)) * that.chartH + that.options.chartSp;
                p.push({x: mx, y: my});
            }
            // 设置曲线的样式
            var bL = l - 1;
            // 循环遍历，根据公式画出三次贝塞尔曲线的两个控制点位置，并画出走势图曲线
            for (i = 0; i < bL; i++) {
                // 获取贝塞尔曲线两个控制点坐标
                var ctrlP = that.getCtrlPoint(p, i);
                that.drawApi.save();
                that.drawApi.strokeStyle = color;
                that.drawApi.lineWidth = that.options.linePx;
                that.drawApi.beginPath();
                // 设置其实位置
                that.drawApi.moveTo(p[i].x, p[i].y);
                // 调用canvas贝塞尔曲线公式，两个控制点坐标和终点的坐标
                that.drawApi.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, p[i + 1].x, p[i + 1].y);
                that.drawApi.stroke();
                that.drawApi.restore();
            }
            // 循环遍历画点
            var txtPos, baseLine;
            for (i = 0; i < l; i++) {
                var mxx = that.options.border + i * that.portWidth;
                if (mxx > c * that.drawApi.canvas.width) {
                    continue;
                }
                var myy = (1 - (Number(arr[i].value) - that.minVal) / (that.maxVal - that.minVal)) * that.chartH + that.options.chartSp;
                that.drawApi.save();
                that.drawApi.globalCompositeOperation = 'destination-out';
                that.drawApi.beginPath();
                that.drawApi.arc(mxx, myy, that.options.pointRadis + 4, 0, Math.PI * 2);
                that.drawApi.fill();
                that.drawApi.restore();
                that.drawApi.save();
                that.drawApi.fillStyle = color;
                that.drawApi.beginPath();
                that.drawApi.arc(mxx, myy, that.options.pointRadis, 0, Math.PI * 2);
                that.drawApi.fill();
                that.drawApi.restore();
                // 画值文本
                if (arr[i].txt) {
                    baseLine = 'bottom';
                    txtPos = myy - 10;
                } else {
                    baseLine = 'top';
                    txtPos = myy + 10;
                }
                that.drawApi.save();
                that.drawApi.font = that.options.downFontSize + that.options.fontFamily;
                that.drawApi.textAlign = 'center';
                that.drawApi.textBaseline = baseLine;
                that.drawApi.fillStyle = that.options.downTxtColor;
                that.drawApi.fillText(arr[i].value, mxx, txtPos);
                that.drawApi.restore();
            }
        },

        /**
         * 此公式是根据
         * 根据已知点获取第i个控制点的坐标
         * param ps  已知曲线将经过的坐标点
         * param i   第i个坐标点
         * param a,b 可以自定义的正数,弯曲程度,0-1越小越大
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