/**
 * description: 基于 blue 1.0.2 和 hisline 进行修改。支持拖动滑动并，点击出现浮层。
 * date: 2017.09.12
 * author: yangfan
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/line/1.0.6/line', ['chart/raf/1.0.0/raf', 'iscroll/2.0.0/iscroll-lite'], function (require) {
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

    // function getEventPosition(ev) {
    //     var x, y;
    //     if (ev.layerX || ev.layerX === 0) {
    //         x = ev.layerX;
    //         y = ev.layerY;
    //         // Opera
    //     } else if (ev.offsetX || ev.offsetX === 0) {
    //         x = ev.offsetX;
    //         y = ev.offsetY;
    //     }
    //     return {
    //         x: x,
    //         y: y
    //     };
    // }
    var hasSetScroll = false;
    // 画图类
    function Line(ops) {
        this.options = {
            lineStyle: 'solid',
            toolTip: {
                id: 'chart_tip',
                class: 'chart_tip'
            },
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
            lineColorLoop: ['#ff6666', '#66b9ff', '#cc0000', '#339999', '#ff9966', '#9566ff', '#99cc00', '#666699', '#cc9900', '#45cbe3', '#336633', '#cc66cc'],
            // 刻度个数
            scaleNumber: 5,
            // 刻度在左边还是在右边
            scalePosition: 'left',
            // 字体
            fontFamily: ' Arial',
            // 底部字体大小及颜色
            downFontSize: '24px',
            downTxtColor: '#83868f',
            // 刻度字体大小及颜色
            scaleFontSize: '24px',
            scaleColor: '#83868f',
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
            series: [{
                key: 'asdf',
                color: '#ff6666',
                yAxis: [{
                    value: 40000,
                    // 业务字段：是否为预测价格
                    forecast: false,
                    // 业务字段：是否下架
                    unShelve: false
                }, {
                    value: 30000,
                    forecast: false,
                    unShelve: false
                }, {
                    value: 18000,
                    forecast: false,
                    unShelve: true
                }, {
                    value: 21000,
                    forecast: false,
                    unShelve: false
                }, {
                    value: 10000,
                    forecast: false,
                    unShelve: false
                }, {
                    value: 55500,
                    forecast: true,
                    unShelve: false
                }]
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
            var opts = this.options;

            // 获取横坐标个数
            this.xAxisLength = opts.xAxis.length;
            // 获取数据数组
            this.series = opts.series;

            // 获取父容器
            this.wrapper = $(opts.id);
            this.wrapper.css({
                position: 'relative',
                overflow: 'hidden',
                transform: 'translateZ(0)',
                '-webkit-transform': 'translateZ(0)',
                '-o-transform': 'translateZ(0)'
            });

            // 加入蒙层元素
            this.toolTip = $('<div>').addClass(opts.toolTip.class).attr('id', opts.toolTip.id).css({
                position: 'absolute',
                left: '0',
                top: '0',
                overflow: 'auto'
            }).hide();
            this.wrapper.append(this.toolTip);

            // new IScroll(this.toolTip[0], {
            //     scrollX: false,
            //     scrollY: true
            //     // bindToWrapper: true,
            //     // eventPassthrough: true,
            //     // click: true
            // });

            // 计算出走势图部分高度
            this.chartTotalHeight = opts.height * 2 - opts.downSp;
            // 计算出显示走势图的高度
            this.chartHeight = this.chartTotalHeight - opts.chartSp * 2;

            // 设置左侧刻度canvas及绘图api
            this.yAxisCanvas = $('<canvas height="' + opts.height * 2 + '" style="height:' + opts.height + 'px"></canvas>');
            this.yAxisCanvasApi = this.yAxisCanvas[0].getContext('2d');

            // 设置走势图canvas的容器，用以滑动
            this.seriesContainer = $('<div style="position: relative;z-index: 0;overflow: hidden;transform: translateZ(0);' +
                '-webkit-transform: translateZ(0);-o-transform: translateZ(0);' +
                '-ms-transform: translateZ(0);-moz-transform: translateZ(0);"><canvas height="' +
                opts.height * 2 + '" style="height:' + opts.height + 'px">您的浏览器不支持</canvas></div>');
            // 设置走势图canvas及绘图api
            this.seriesCanvas = this.seriesContainer.find('canvas');
            // 设置canvas的宽高和样式宽高,之所以2比1是为了保持所有绘制都是高清图
            this.seriesCanvasApi = this.seriesCanvas[0].getContext('2d');

            // yangfan 设置离线 canvas 用于判断点击是否在某个点上
            this.offCanvas = $('<canvas height="' + opts.height * 2 + '" style="height:' + opts.height + 'px">您的浏览器不支持</canvas>');
            this.offCanvasApi = this.offCanvas[0].getContext('2d');

            // 填充数据
            this.wrapper.append(this.yAxisCanvas);
            this.wrapper.append(this.seriesContainer);

            // this.wrapper.append(this.offCanvas);

            // 绑定点击事件处理用户行为
            // if (this.options.series.length === 1) {
            //     this.drawOneData();
            // } else {
            var that = this;
            this.seriesCanvas.on('click', function (e) {
                that.offCanvasApi.clearRect(0, 0, that.offCanvasApi.canvas.width, that.offCanvasApi.canvas.height);
                that.clicked(e.originalEvent);
            });

            this.restore(opts.xAxis, opts.series);
            // }
        },

        clicked: function (ev) {
            var series = this.series;
            var mx = (ev.pageX - this.seriesCanvas.offset().left) * 2;
            var my = (ev.pageY - this.seriesCanvas.offset().top) * 2;
            var inPath = false;
            // console.log(getEventPosition(ev));

            for (var i = 0; i < series.length; i++) {
                var seriesi = series[i];
                for (var j = 0; j < seriesi.yAxis.length; j++) {
                    var seriesj = seriesi.yAxis[j].value;
                    var mxx = this.options.border + j * this.portWidth;
                    var myy = this.chartTotalHeight / 2;
                    if (this.maxValue !== this.minValue) {
                        myy = (1 - (seriesj - this.minValue) / (this.maxValue - this.minValue)) * this.chartHeight + this.options.chartSp;
                    }
                    this.offCanvasApi.beginPath();
                    this.offCanvasApi.fillStyle = 'red';
                    this.offCanvasApi.arc(mxx, myy, this.options.pointRadis + 4, 0, Math.PI * 2);
                    this.offCanvasApi.fill();
                    inPath = this.offCanvasApi.isPointInPath(mx, my);
                    if (inPath) {
                        this.toolTip.empty().hide();
                        this.restore(this.options.xAxis, this.options.series);
                        this.openTip(j, ev.pageX - this.yAxisCanvas.width() + this.options.pointRadis + 4, myy);
                        this.drawVerticalLine(mxx);
                        break;
                    }
                }
                if (inPath) {
                    break;
                }
            }
            if (!inPath) {
                this.restore(this.options.xAxis, this.options.series);
                this.toolTip.empty().hide();
            }
        },

        /**
         * 画背景线
         * @param x 点击x坐标
         */
        drawVerticalLine: function (x) {
            this.seriesCanvasApi.save();
            this.seriesCanvasApi.strokeStyle = '#f4f4f4';
            this.seriesCanvasApi.lineWidth = 2;
            this.seriesCanvasApi.beginPath();
            this.seriesCanvasApi.moveTo(x, 0);
            this.seriesCanvasApi.lineTo(x, this.chartTotalHeight);
            this.seriesCanvasApi.stroke();
            this.seriesCanvasApi.restore();
        },

        openTip: function (index, x, y) {
            var opts = this.options;
            var title = '<h5>' + opts.xAxis[index].substr(-5) + '</h5>';
            var content = [];
            opts.series.forEach(function (v) {
                // 获取值
                var value = v.yAxis[index].value.replace(/-/g, '');
                if (value) {
                    content.push('<p>' + v.key + ': ' + value + '万</p>');
                }
            });

            this.toolTip.append($(title)).append($(content.join(''))).show();

            this.toolTip.css({
                left: x + this.toolTip.outerWidth() > this.seriesContainer.width() ? x - this.toolTip.outerWidth() - (this.options.pointRadis + 4) : x,
                top: y / 2 + this.toolTip.outerHeight() > this.chartTotalHeight / 2 ? this.chartTotalHeight / 2 - this.toolTip.outerHeight() : y / 2
            }).scrollTop(0);

            // console.log(series, index);
        },

        /**
         * 重置数据
         * @param xAxis 横轴数据
         * @param series 纵轴数据
         */
        restore: function (xAxis, series) {
            // if (this.scroll) {
            //     this.scroll.scrollTo(0, 0, 0);
            //     this.scroll.destroy();
            // }
            this.yAxisCanvasApi.clearRect(0, 0, this.yAxisCanvasApi.canvas.width, this.yAxisCanvasApi.canvas.height);
            this.seriesCanvasApi.clearRect(0, 0, this.seriesCanvasApi.canvas.width, this.seriesCanvasApi.canvas.height);
            this.options.xAxis = xAxis;
            this.options.series = series;
            this.drawStart();
            if (!this.hasFirstDraw) {
                this.hasFirstDraw = true;
            }
        },

        /**
         * 填充数据，根据数据算出图形显示
         */
        drawStart: function () {
            // 最大值的宽度
            var maxValueWidth,
                // 循环使用
                i = 0,
                j = 0,
                // 最大值
                maxValue,
                // 最小值
                minValue;

            /**
             * 循环遍历出走势图数据
             */
            for (; i < this.series.length; i++) {
                var yAxis = this.series[i].yAxis;
                /**
                 * 循环遍历出走势图数据中各个单点数据
                 */
                for (j = 0; j < yAxis.length; j++) {

                    // 获取值
                    var v = yAxis[j].value.replace(/-/g, '');
                    if (!v) {
                        continue;
                    }

                    // 计算最大值宽度
                    this.yAxisCanvasApi.save();
                    this.yAxisCanvasApi.font = this.options.scaleFontSize + this.options.fontFamily;
                    if (maxValueWidth === undefined || maxValueWidth < this.yAxisCanvasApi.measureText(v).width) {
                        maxValueWidth = this.yAxisCanvasApi.measureText(v).width;
                    }
                    this.yAxisCanvasApi.restore();

                    var num = Number(v);
                    // 获取最大值
                    if (maxValue === undefined || maxValue < num) {
                        maxValue = num;
                    }
                    // 获取最小值
                    if (minValue === undefined || minValue > num) {
                        minValue = num;
                    }
                }
            }

            // 赋值计算出的数据给全局
            this.maxValue = maxValue;
            this.minValue = minValue;

            if (maxValue - minValue < this.options.scaleNumber) {
                this.options.scaleNumber = maxValue - minValue;
            }

            // 设置刻度显示canvas
            // 设置刻度canvas宽度
            var scaleTextWidth = Math.ceil((maxValueWidth + this.options.scaleBorder) / 2) * 2;
            this.yAxisCanvas[0].width = scaleTextWidth;
            var cssObject = {
                width: scaleTextWidth / 2,
                position: 'absolute',
                top: '0px',
                'z-index': 1
            };
            cssObject[this.options.scalePosition] = '0px';
            this.yAxisCanvas.css(cssObject);

            // 获取刻度高度间隔及数值间隔
            var scaleSpH = this.chartHeight / this.options.scaleNumber;
            var valSp = (maxValue - minValue) / this.options.scaleNumber;

            // 判断是左对齐还是右对齐
            var mx = this.options.scalePosition === 'left' ? 0 : scaleTextWidth;
            // 横虚线点
            this.yAxisPoints = [];

            var scaleValue = String(Math.floor(maxValue));
            var my = this.chartTotalHeight / 2;
            // yangfan: 最大值和最小值相等
            if (maxValue === minValue) {
                // 画刻度值
                this.yAxisCanvasApi.save();
                this.yAxisCanvasApi.font = this.options.scaleFontSize + this.options.fontFamily;
                // this.yAxisCanvasApi.textAlign = this.options.scalePosition;
                // this.yAxisCanvasApi.textBaseline = 'center';
                this.yAxisCanvasApi.fillStyle = this.options.scaleColor;
                this.yAxisCanvasApi.fillText(scaleValue, mx, my);
                this.yAxisCanvasApi.restore();

                this.yAxisPoints.push({
                    x: mx,
                    y: my
                });
            } else {
                /**
                 * 循环遍历算出所有的刻度，并显示到刻度canvas上
                 */
                for (i = 0; i <= this.options.scaleNumber; i++) {
                    scaleValue = String(Math.floor(maxValue - i * valSp));
                    my = this.options.chartSp + i * scaleSpH;
                    // 画刻度值
                    this.yAxisCanvasApi.save();
                    this.yAxisCanvasApi.font = this.options.scaleFontSize + this.options.fontFamily;
                    // this.yAxisCanvasApi.textAlign = this.options.scalePosition;
                    // this.yAxisCanvasApi.textBaseline = 'center';
                    this.yAxisCanvasApi.fillStyle = this.options.scaleColor;
                    this.yAxisCanvasApi.fillText(scaleValue, mx, my);
                    this.yAxisCanvasApi.restore();

                    this.yAxisPoints.push({
                        x: mx,
                        y: my
                    });
                }
            }

            // 画刻度对着走势图的竖线
            this.yAxisCanvasApi.save();
            this.yAxisCanvasApi.strokeStyle = this.options.bgLineColor;
            this.yAxisCanvasApi.lineWidth = this.options.bgLinePx;
            this.yAxisCanvasApi.beginPath();
            this.yAxisCanvasApi.moveTo(scaleTextWidth - mx, 0);
            this.yAxisCanvasApi.lineTo(scaleTextWidth - mx, this.chartTotalHeight);
            this.yAxisCanvasApi.stroke();
            this.yAxisCanvasApi.restore();

            // 设置走势图容器宽度
            this.chartTotalWidth = this.options.width - scaleTextWidth / 2;
            cssObject = {
                width: this.chartTotalWidth + 'px'
            };
            cssObject['margin-' + this.options.scalePosition] = scaleTextWidth / 2 + 'px';
            this.seriesContainer.css(cssObject);

            // 获取走势图除两边间距后的每一部分横坐标刻度的宽度
            this.portWidth = Math.floor((this.chartTotalWidth * 2 - this.options.border * 2) / this.options.scrollNumber);

            if (this.xAxisLength === 1) {
                if (!this.hasFirstDraw) {
                    this.options.border = this.options.border * this.options.scrollNumber;
                }
                this.portWidth = Math.floor(this.chartTotalWidth * 2 - this.options.border * 2);
            } else if (this.xAxisLength < this.options.scrollNumber + 1) {
                if (!this.hasFirstDraw) {
                    this.options.border = this.options.border * (this.options.scrollNumber - this.xAxisLength + 1);
                }
                this.portWidth = Math.floor((this.chartTotalWidth * 2 - this.options.border * 2) / (this.xAxisLength - 1));
            }

            var chartWidth = this.portWidth * (this.xAxisLength - 1) + this.options.border * 2;

            // if (chartWidth < this.chartTotalWidth) {
            //     this.portWidth = Math.floor(this.chartTotalWidth - this.options.border);
            //     chartWidth = this.portWidth * (this.xAxisLength - 1) + this.options.border * 2
            // }

            // 设置走势图canvas宽度
            this.seriesCanvas[0].width = chartWidth;
            this.seriesCanvas.css('width', chartWidth / 2);
            // 设置离线 canvas 宽度
            this.offCanvas[0].width = chartWidth;
            this.offCanvas.css('width', chartWidth / 2);

            this.drawBg();
            this.drawLine();
            if (!hasSetScroll) {
                hasSetScroll = true;
                this.setScroll();
            }
        },

        /**
         * 设置滑动
         */
        setScroll: function () {
            this.scroll = new IScroll(this.seriesContainer[0], {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                // eventPassthrough: true,
                click: true
            });
        },

        /**
         * 滚动位置
         * @param time
         */
        run: function (time) {
            if (this    .scroll && this.xAxisLength > this.options.scrollNumber + 1) {
                var t = time || 2000;
                this.scroll.scrollTo(this.chartTotalWidth - this.seriesCanvas[0].width / 2, 0, t);
            }
        },

        /**
         * 画背景,包括背景线和下面的文案
         */
        drawBg: function () {
            for (var i = 0; i < this.xAxisLength; i++) {
                var mx = this.options.border + i * this.portWidth;
                // 画背景线
                // this.seriesCanvasApi.save();
                // this.seriesCanvasApi.strokeStyle = this.options.bgLineColor;
                // this.seriesCanvasApi.lineWidth = this.options.bgLinePx;
                // this.seriesCanvasApi.beginPath();
                // this.seriesCanvasApi.moveTo(mx, 0);
                // this.seriesCanvasApi.lineTo(mx, this.chartTotalHeight);
                // this.seriesCanvasApi.stroke();
                // this.seriesCanvasApi.restore();
                // 画下部文案
                this.seriesCanvasApi.save();
                this.seriesCanvasApi.font = this.options.downFontSize + this.options.fontFamily;
                this.seriesCanvasApi.textAlign = 'center';
                this.seriesCanvasApi.textBaseline = 'middle';
                this.seriesCanvasApi.fillStyle = this.options.downTxtColor;
                this.seriesCanvasApi.fillText(this.options.xAxis[i], mx, this.seriesCanvasApi.canvas.height - this.options.downSp / 2, this.portWidth);
                this.seriesCanvasApi.restore();
            }
            // 画横线
            this.seriesCanvasApi.save();
            this.seriesCanvasApi.strokeStyle = this.options.bgLineColor;
            this.seriesCanvasApi.lineWidth = this.options.bgLinePx;
            this.seriesCanvasApi.beginPath();
            this.seriesCanvasApi.moveTo(0, this.chartTotalHeight);
            this.seriesCanvasApi.lineTo(this.seriesCanvasApi.canvas.width, this.chartTotalHeight);
            this.seriesCanvasApi.moveTo(0, 0);
            this.seriesCanvasApi.lineTo(this.seriesCanvasApi.canvas.width, 0);
            this.seriesCanvasApi.stroke();
            this.seriesCanvasApi.restore();


            // 画横着的虚线
            for (var j = 0; j < this.yAxisPoints.length; j++) {
                var point = this.yAxisPoints[j];
                this.seriesCanvasApi.save();
                this.seriesCanvasApi.strokeStyle = '#f4f4f4';
                this.seriesCanvasApi.lineWidth = 2;
                this.dashedLineTo(this.seriesCanvasApi, point.x, point.y, point.x + this.seriesCanvasApi.canvas.width, point.y, 10);
                this.seriesCanvasApi.restore();
            }
        },

        /**
         * 画线
         */
        drawLine: function () {
            var colorIdx = 0;

            /**
             * 循环遍历获取每一组走势线的数据
             * yangfan: 优先使用 series array 中的 color 属性，然后 使用 lineColorFixed 中的颜色，最后使用 lineColorLoop 循环颜色
             */
            for (var i = 0; i < this.series.length; i++) {
                var color = this.series[i].color;

                // 判断是否有颜色赋值，有就用该赋值
                if (!color) {
                    // 没有赋值时使用lineColor数组中的各颜色以此循环使用
                    if (colorIdx > this.options.lineColorLoop.length) {
                        colorIdx = 0;
                    }
                    color = this.options.lineColorLoop[colorIdx];
                }

                // 根据走势线的值数据画一条曲线
                this.drawOneline(this.series[i].yAxis, color);
                colorIdx++;
            }
        },

        /**
         * 画一条线
         * @param series 该线的数据
         * @param color 改线的颜色
         */
        drawOneline: function (series, color) {
            // 该走势线的点个数
            var l = series.length;
            // 循环使用
            var i = 0,
                // 换算点索引数组
                p = [];

            /**
             * 循环遍历计算出走势点在canvas中的像素坐标，并储存到p数组中
             */
            for (; i < series.length; i++) {
                var mx = this.options.border + i * this.portWidth;
                var my = this.chartTotalHeight / 2;
                // yangfan: 最大值和最小值相等
                if (this.maxValue !== this.minValue) {
                    my = (1 - (Number(series[i].value) - this.minValue) / (this.maxValue - this.minValue)) * this.chartHeight + this.options.chartSp;
                }
                p.push({
                    x: mx,
                    y: my
                });
            }

            this.points = p;

            // 设置曲线的样式
            this.seriesCanvasApi.save();
            this.seriesCanvasApi.strokeStyle = color;
            this.seriesCanvasApi.lineWidth = this.options.linePx;

            // var bl = forecast ? l - 2 : l - 1;

            /**
             * 循环遍历，根据公式画出三次贝塞尔曲线的两个控制点位置，并画出走势图曲线
             */
            for (i = 0; i < l - 1; i++) {
                this.seriesCanvasApi.beginPath();
                 if (series[i] && series[i].unShelve) {
                     // this.seriesCanvasApi.moveTo(p[i + 1].x, p[i + 1].y);
                     continue;
                 }
                this.seriesCanvasApi.moveTo(p[i].x, p[i].y);
                if (this.options.lineStyle === 'solid') {
                    this.seriesCanvasApi.lineTo(p[i + 1].x, p[i + 1].y);
                } else {
                    var ctrlPoint = this.getCtrlPoint(p, i);
                    this.seriesCanvasApi.bezierCurveTo(ctrlPoint.pA.x, ctrlPoint.pA.y, ctrlPoint.pB.x, ctrlPoint.pB.y, p[i + 1].x, p[i + 1].y);
                }
                this.seriesCanvasApi.stroke();
            }

            // if (forecast) {
            //     this.dashedLineTo(this.seriesCanvasApi, p[l - 2].x, p[l - 2].y, p[l - 1].x, p[l - 1].y);
            // }

            this.seriesCanvasApi.restore();

            /**
             * 循环遍历画点
             */
            for (i = 0; i < l; i++) {
                if (series[i] && series[i].unShelve) {
                    continue;
                }
                var mxx = this.options.border + i * this.portWidth;
                var myy = this.chartTotalHeight / 2;

                // yangfan: 最大值和最小值相等
                if (this.maxValue !== this.minValue) {
                    myy = (1 - (series[i].value - this.minValue) / (this.maxValue - this.minValue)) * this.chartHeight + this.options.chartSp;
                }

                // if (i !== l - 2 || !forecast) {
                this.seriesCanvasApi.save();
                this.seriesCanvasApi.globalCompositeOperation = 'destination-out';
                this.seriesCanvasApi.beginPath();
                this.seriesCanvasApi.arc(mxx, myy, this.options.pointRadis + 4, 0, Math.PI * 2);
                this.seriesCanvasApi.fill();
                this.seriesCanvasApi.restore();
                // }
                this.seriesCanvasApi.save();
                this.seriesCanvasApi.fillStyle = color;
                this.seriesCanvasApi.beginPath();
                this.seriesCanvasApi.arc(mxx, myy, this.options.pointRadis, 0, Math.PI * 2);
                this.seriesCanvasApi.fill();
                this.seriesCanvasApi.restore();
                // if (i === l - 2 && forecast) {
                //     this.seriesCanvasApi.save();
                //     this.seriesCanvasApi.strokeStyle = color;
                //     this.seriesCanvasApi.beginPath();
                //     this.seriesCanvasApi.arc(mxx, myy, this.options.pointRadis + 5, 0, Math.PI * 2);
                //     this.seriesCanvasApi.stroke();
                //     this.seriesCanvasApi.restore();
                // }
                // 画刻度文案
                // if (forecast && i === l - 1) {
                //     this.seriesCanvasApi.save();
                //     this.seriesCanvasApi.font = this.options.scaleFontSize + this.options.fontFamily;
                //     this.seriesCanvasApi.textAlign = 'center';
                //     this.seriesCanvasApi.textBaseline = 'bottom';
                //     this.seriesCanvasApi.fillStyle = this.options.scaleColor;
                //     this.seriesCanvasApi.fillText('预测', mxx, myy - 10);
                //     this.seriesCanvasApi.restore();
                // }
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