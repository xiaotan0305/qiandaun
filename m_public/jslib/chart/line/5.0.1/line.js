/**
 * canvas直线变化效果图js
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (f) {
    'use strict';
    // amd和cmd以及普通引用方式兼容
    if (typeof define === 'function') {
        define('chart/line/5.0.1/line', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require) {
            var $ = require('jquery');
            var Iscroll = require('iscroll/2.0.0/iscroll-lite');
            return f($, Iscroll);
        });
    } else if (typeof exports === 'object') {
        module.exports = f();
    } else {
        var IScroll = null;
        if (window.hasOwnProperty('IScrollLite')) {
            IScroll = window.IScrollLite;
        }
        window.Line51 = f(window.jQuery, IScroll);
    }
})(function ($, Iscroll) {
    'use strict';

    /**
     * 走势图主类
     * @param opt 参数对象
     */
    function line(opt) {
        this.options = {
            // 绘制走势图的canvas容器ID
            id: '#line',
            // 走势图的高度
            height: 240,
            // 走势图的宽度
            width: $(window).width() - 20,
            border: 10,
            // 顶部空出得高度，为了防止最大数据的文字高出canvas能绘制的距离
            paddingTop: 40,
            // 底部空出的高度，为了给底部文字显示用
            paddingBottom: 30,
            // 能够滑动的临界个数，即只要数据个数超过了12就要开始滑动才能显示所有的数据内容
            canSlideNum: 12,
            // 需要几个刻度间隔，也就是说左边的刻度显示5个，分成六份
            scaleNum: 5,
            // 字体库
            fontFamily: ' Arial',
            // 左侧字体大小
            leftFontSize: '20px',
            // 左部字体颜色
            leftFontColor: '#ccc',
            // 底部字体大小
            downFontSize: '20px',
            // 底部字体颜色
            downFontColor: '#ccc',
            // 最大值字体颜色
            maxFontColor: '#ff3d3d',
            // 最小值字体颜色
            minFontColor: '#56b229',
            // 走势图线的宽度
            linePx: 2,
            // 线颜色
            lineColor: '#4477d5',
            // 点的半径
            pointRadius: 5,
            // 背景线颜色
            bgLineColor: '#ccc',
            // 对象名称转换，这里的作用是，省去了后台数据键值不对应还要循环赋键值的问题
            charNameObj: {name: 'name', value: 'value'},
            dataArr: [
                {
                    name: '7.24',
                    value: 40000
                },
                {
                    name: '7.25',
                    value: 30000
                },
                {
                    name: '7.26',
                    value: 18000
                },
                {
                    name: '7.27',
                    value: 21000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '8.21',
                    value: 55500
                },
                {
                    name: '8.22',
                    value: 40000
                },
                {
                    name: '7.26',
                    value: 18000
                },
                {
                    name: '7.27',
                    value: 21000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '7.27',
                    value: 21000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '7.27',
                    value: 21000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '7.26',
                    value: 18000
                },
                {
                    name: '7.27',
                    value: 21000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '8.21',
                    value: 55500
                },
                {
                    name: '8.22',
                    value: 40000
                },
                {
                    name: '7.26',
                    value: 18000
                },
                {
                    name: '7.27',
                    value: 21000
                }, {
                    name: '7.26',
                    value: 18000
                },
                {
                    name: '7.27',
                    value: 21000
                },
                {
                    name: '7.28',
                    value: 10000
                },
                {
                    name: '8.21',
                    value: 55500
                },
                {
                    name: '8.22',
                    value: 40000
                },
                {
                    name: '7.26',
                    value: 18000
                },
                {
                    name: '7.27',
                    value: 21000
                }
            ]
        };
        for (var idx in opt) {
            this.options[idx] = opt[idx];
        }
        this.init();
    }

    line.prototype = {
        init: function () {
            var that = this;
            that.con = $(that.options.id);
            that.con.css('position', 'relative');
            that.iscorll = 0;
            that.isOprera = false;
            var UA = window.navigator.userAgent.toLowerCase();
            if (/opr/.test(UA) || /miuiyellowpage/.test(UA)) {
                var p = UA.indexOf('android');
                if (p !== -1) {
                    var s = UA.substr(p + 8, 3).split('.');
                    if (parseFloat(s[0] + s[1]) < 42) {
                        that.isOprera = true;
                    }
                }
            }
            that.fillData(that.options.dataArr);
        },

        /**
         * 填充数据
         * @param arr
         */
        fillData: function (arr) {
            var that = this;
            if (that.iscroll) {
                that.iscroll.destroy();
            }
            if (that.con.children().length > 0) {
                that.con.empty();
            }
            that.dataArr = arr;
            that.dataArrL = arr.length;
            that.setScrollCanvas();
            // that.setScaleCanvas(arr);
        },

        /**
         * 设置滑动canvas
         */
        setScrollCanvas: function () {
            var that = this;
            // 是否需要滑动，数据大于12才会滑动
            var need = false;
            // 滑动、不滑动宽度变化不是有规律的，所有声明一个宽度变量以储存需要的宽度
            var w = 0;
            // 滑动的图表
            that.scrollCvs = $('<canvas></canvas>');
            // 刻度的图表
            that.scaleCvs = $('<canvas style="position: absolute;left: ' + that.options.border + 'px;top:0;z-index: 1;"></canvas>');
            // 滑动图表需要的外部容器
            that.scrollCon = $('<div style="overflow:hidden;transform:translateZ(0);-webkit-transform:translateZ(0);'
                + '-o-transform:translateZ(0);position: relative;z-index:0;margin:0 ' + that.options.border + 'px"></div>');
            // 数据量大于12时
            if (that.dataArrL > that.options.canSlideNum) {
                need = true;
                w = Math.round(that.options.width * 2 * (that.dataArrL + 1) / (that.options.canSlideNum + 1));
            } else {
                w = that.options.width * 2;
            }
            // 设置滑动canvas的宽高
            that.scrollCvs[0].width = w;
            that.scrollCvs[0].height = that.options.height * 2;
            that.scaleCvs[0].height = that.options.height * 2;
            // 获取滑动canvas绘图api
            var scrollCvsDrawApi = that.scrollCvs[0].getContext('2d');
            // 获取刻度canvas绘图api
            var scaleCvsDrawApi = that.scaleCvs[0].getContext('2d');
            // 设置canvas展示真实宽高
            that.scrollCvs.css({
                width: w / 2 + 'px',
                height: that.options.height + 'px'
            });
            // 绘制滑动canvas
            that.drawScrollCanvas(scrollCvsDrawApi, scaleCvsDrawApi);
            // 将需要滑动的canvas放入其容器
            that.scrollCon.append(that.scrollCvs);
            // 将滑动canvas容器放到总容器中
            that.con.append(that.scrollCon);
            // 将刻度canvas放到总容器中
            that.con.append(that.scaleCvs);
            // 当需要滑动时，初始化滑动插件
            if (need) {
                that.iscroll = new Iscroll(that.scrollCon[0], {
                    // 开启横向滑动
                    scrollX: true,
                    // 禁止纵向滑动
                    scrollY: false,
                    // 滑动为其本身，这里的作用是防止禁用掉整个文档流的默认事件导致的bug
                    bindToWrapper: true,
                    // 可以纵向滑动，默认能够穿过
                    eventPassthrough: true
                });
            }
        },

        /**
         * 画出滑动部分的走势图
         * @param drawApi 滑动部分canvas的绘图api
         * @param sDrawApi 刻度部分canvas的绘图api
         */
        drawScrollCanvas: function (drawApi, sDrawApi) {
            var that = this;
            var i = 0;
            var l = 0;
            var s = 0;
            var max = 0;
            var min = 0;
            var textWidth = 0;
            var maxAndMinPositionArr = [0, 0];
            that.unitWidth = drawApi.canvas.width / (that.dataArrL + 1);

            /**
             * 循环计算出最大值和最小值
             */
            max = min = Number(that.dataArr[0][that.options.charNameObj.value]);
            for (i = 1; i < that.dataArrL; i++) {
                var value = Number(that.dataArr[i][that.options.charNameObj.value]);
                if (max <= value) {
                    max = value;
                    maxAndMinPositionArr[0] = i;
                }
                if (min >= value) {
                    min = value;
                    maxAndMinPositionArr[1] = i;
                }
            }

            /**
             * 循环计算出最大刻度
             */
            s = max.toString().split('.')[0];
            l = s.length;
            var head = (Number(s.charAt(0)) + 1).toString();
            for (i = 1; i < l; i++) {
                head += '0';
            }
            that.scale = Number(head);
            that.lineZoneHeight = drawApi.canvas.height - that.options.paddingTop - that.options.paddingBottom;
            var unitScaleHeight = that.lineZoneHeight / that.options.scaleNum;

            /**
             * 循环遍历画出背景横线
             * 总循环+1的原因是因为刻度有六个
             */
            for (i = 0; i < that.options.scaleNum + 1; i++) {
                var h = that.options.paddingTop + i * unitScaleHeight;
                that.drawBgLine(drawApi, 0, h, drawApi.canvas.width, h);
                var name = String(that.scale * (that.options.scaleNum - i) / that.options.scaleNum).replace(/0000$/, '万');
                drawApi.save();
                drawApi.font = that.options.leftFontSize + that.options.fontFamily;
                if (textWidth === 0 || textWidth < drawApi.measureText(name).width) {
                    textWidth = drawApi.measureText(name).width;
                }
                drawApi.restore();
            }
            // 设置刻度canvas的宽高
            that.scaleCvs[0].width = textWidth;
            // 设置canvas展示真实宽高
            that.scaleCvs.css({
                width: textWidth / 2 + 'px',
                height: that.options.height + 'px'
            });

            /**
             * 循环画出左部位置刻度
             */
            for (i = 0; i < that.options.scaleNum + 1; i++) {
                var h1 = that.options.paddingTop + i * unitScaleHeight;
                var name1 = String(that.scale * (that.options.scaleNum - i) / that.options.scaleNum).replace(/0000$/, '万');
                if (name1 !== '0') {
                    that.fillLeftWord(sDrawApi, name1, 0, h1);
                }
            }
            that.drawLeftLine(sDrawApi, 0, that.options.paddingTop, 0, drawApi.canvas.height - that.options.paddingBottom);
            // 如果只有一个值的时候不划线只画点
            if (that.dataArrL === 1) {
                that.drawBgLine(drawApi, that.unitWidth, that.options.paddingTop, that.unitWidth, drawApi.canvas.height - that.options.paddingBottom);
                that.fillDownWord(drawApi, that.dataArr[0][that.options.charNameObj.name], that.unitWidth,
                    drawApi.canvas.height - that.options.paddingBottom / 2);
                that.drawPoint(drawApi, 0, that.options.maxFontColor);
            } else {
                //
                /**
                 * 循环算出数据对应的点坐标
                 */
                for (i = 0; i < that.dataArrL; i++) {
                    var stepWidth = (i + 1) * that.unitWidth;
                    // 画对应点的背景纵线
                    that.drawBgLine(drawApi, stepWidth, that.options.paddingTop, stepWidth, drawApi.canvas.height - that.options.paddingBottom);
                    // 之所以判断不能是最后一个点，是因为两点一线，最后只是一个点，无法成线
                    if (i < that.dataArrL - 1) {
                        var y0 = that.options.paddingTop + (1 - Number(that.dataArr[i][that.options.charNameObj.value]) / that.scale) * that.lineZoneHeight;
                        var y1 = that.options.paddingTop + (1 - Number(that.dataArr[i + 1][that.options.charNameObj.value]) / that.scale) * that.lineZoneHeight;
                        that.drawLine(drawApi, stepWidth, y0, stepWidth + that.unitWidth, y1);
                    }
                    // 画底部文字
                    that.fillDownWord(drawApi, that.dataArr[i][that.options.charNameObj.name],
                        stepWidth - 10, drawApi.canvas.height - that.options.paddingBottom / 2);
                }
                // 画最高点和最低点
                that.drawPoint(drawApi, maxAndMinPositionArr[0], that.options.maxFontColor, true);
                that.drawPoint(drawApi, maxAndMinPositionArr[1], that.options.minFontColor, true);
            }
        },

        /**
         * 画点
         * @param drawApi
         * @param idx
         * @param color
         * @param best 是最值,这里由于数据量大可能出现问题，所以使用极端判断方法
         */
        drawPoint: function (drawApi, idx, color, best) {
            var that = this;
            if (that.dataArr[idx][that.options.charNameObj.value] === '0') {
                return;
            }
            var w = that.unitWidth * (idx + 1);
            var y = that.options.paddingTop + (1 - Number(that.dataArr[idx][that.options.charNameObj.value]) / that.scale) * that.lineZoneHeight;
            drawApi.save();
            drawApi.fillStyle = that.options.lineColor;
            drawApi.beginPath();
            drawApi.arc(w, y, that.options.pointRadius, 0, Math.PI * 2, true);
            drawApi.closePath();
            drawApi.fill();
            drawApi.restore();
            drawApi.save();
            drawApi.font = that.options.downFontSize + that.options.fontFamily;
            drawApi.textAlign = 'center';
            if (best) {
                var textAlign = '';
                if (idx < that.dataArrL / 2) {
                    textAlign = 'left';
                } else {
                    textAlign = 'right';
                }
                drawApi.textAlign = textAlign;
            }
            drawApi.textBaseline = 'bottom';
            drawApi.fillStyle = color;
            drawApi.fillText(that.dataArr[idx][that.options.charNameObj.value], w, y - 10);
            drawApi.restore();
        },

        /**
         * 画走势图线
         * @param drawApi
         * @param x0
         * @param y0
         * @param x1
         * @param y1
         */
        drawLine: function (drawApi, x0, y0, x1, y1) {
            var that = this;
            drawApi.save();
            drawApi.strokeStyle = that.options.lineColor;
            drawApi.strokeWidth = that.options.lineBorder;
            drawApi.beginPath();
            drawApi.moveTo(x0, y0);
            drawApi.lineTo(x1, y1);
            drawApi.stroke();
            drawApi.restore();
        },

        /**
         * 画左部背景线
         * @param drawApi
         * @param x0
         * @param y0
         * @param x1
         * @param y1
         */
        drawLeftLine: function (drawApi, x0, y0, x1, y1) {
            var that = this;
            drawApi.save();
            drawApi.strokeStyle = that.options.leftFontColor;
            drawApi.strokeWidth = 2;
            drawApi.beginPath();
            drawApi.moveTo(x0, y0);
            drawApi.lineTo(x1, y1);
            drawApi.stroke();
            drawApi.restore();
        },

        /**
         * 画背景线
         * @param drawApi
         * @param x0
         * @param y0
         * @param x1
         * @param y1
         */
        drawBgLine: function (drawApi, x0, y0, x1, y1) {
            var that = this;
            drawApi.save();
            drawApi.strokeStyle = that.options.bgLineColor;
            drawApi.beginPath();
            drawApi.moveTo(x0, y0);
            drawApi.lineTo(x1, y1);
            drawApi.stroke();
            drawApi.restore();
        },

        /**
         * 画左边文字
         * @param drawApi
         * @param txt
         * @param x
         * @param y
         */
        fillLeftWord: function (drawApi, txt, x, y) {
            var that = this;
            drawApi.save();
            drawApi.fillStyle = '#fff';
            drawApi.fillRect(x, y - 1, drawApi.canvas.width, 3);
            drawApi.restore();
            drawApi.save();
            drawApi.font = that.options.leftFontSize + that.options.fontFamily;
            drawApi.textAlign = 'left';
            drawApi.textBaseline = 'middle';
            drawApi.fillStyle = that.options.leftFontColor;
            drawApi.fillText(txt, x, y);
            drawApi.restore();
        },

        /**
         * 画底部文字
         * @param drawApi
         * @param txt
         * @param x
         * @param y
         */
        fillDownWord: function (drawApi, txt, x, y) {
            var that = this;
            drawApi.save();
            drawApi.font = that.options.downFontSize + that.options.fontFamily;
            drawApi.textAlign = 'center';
            drawApi.textBaseline = 'middle';
            drawApi.fillStyle = that.options.downFontColor;
            drawApi.fillText(txt, x, y);
            drawApi.restore();
        },

        /**
         * 执行动画效果
         */
        run: function () {
            var that = this;
            if (that.iscroll) {
                that.iscroll.scrollTo((that.options.canSlideNum - that.dataArrL) * that.unitWidth / 2, 0, 500);
            }
        }
    };
    return line;
});