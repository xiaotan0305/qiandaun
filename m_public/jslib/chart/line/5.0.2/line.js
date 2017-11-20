/**
 * canvas直线变化效果图js
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/line/5.0.2/line', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        window.Line52 = f(w);
    }
})(window, function (w) {
    'use strict';
    var $ = w.jQuery;

    /**
     * 点基类
     * @param x 横坐标
     * @param y 纵坐标
     * @constructor
     */
    function PointClass(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * 画线基类
     * 储存画线所需要的数据和动画所需要的数据
     * @param dataArr
     * @param opt
     * @param drawApi
     * @constructor
     */
    function DrawLineClass(dataArr, opt, drawApi) {
        // 外部数据数组
        this.dataArr = dataArr;
        // 画图api
        this.drawApi = drawApi;
        // 点坐标数组
        this.pArr = [];
        // 外部参数
        this.opt = opt;
        // 图表区域的宽度
        this.unitWidth = 0;
        // 剪裁的宽度，用来绘制动画
        this.clipWidth = 0;
        // 步数
        this.loop = 0;
        // 最大刻度
        this.fullScale = 1;
        // 数据最大值
        this.max = 0;
        // 数据最小值
        this.min = 0;
        // 动画停止标识
        this.over = false;
        this.init();
    }

    DrawLineClass.prototype = {
        init: function () {
            var that = this;
            if (that.dataArr.length === 1) {
                this.pArr.push(new PointClass(0, 0));
                console.log('one data,error');
                return;
            }

            /**
             * 循环计算出最大值和最小值
             */
            var l = that.dataArr.length;
            var i = 1;
            that.max = that.min = parseInt(that.dataArr[0][that.opt.charNameObj.value]);
            that.maxAndMinPositionArr = [0, 0];
            for (; i < l; i++) {
                // 判断数据时间大于今日时间则不做比较
                var value = parseInt(that.dataArr[i][that.opt.charNameObj.value]);
                if (that.max <= value) {
                    that.max = value;
                    that.maxAndMinPositionArr[0] = i;
                }
                if (that.min >= value) {
                    that.min = value;
                    that.maxAndMinPositionArr[1] = i;
                }
            }

            /**
             * 循环计算出最大刻度
             */
                //var s = that.max.toString().split('.')[0];
                //l = s.length;
                //var head = (parseInt(s.charAt(0)) + 1).toString();
                //for (i = 1; i < l; i++) {
                //    head += '0';
                //}
            that.fullScale = that.max;

            /**
             * 循环计算出最大刻度
             */
            var s = that.min.toString().split('.')[0];
            l = s.length;
            var head = (parseInt(s.charAt(0))).toString();
            for (i = 1; i < l; i++) {
                head += '0';
            }
            that.minScale = parseInt(head);

            /**
             * 循环算出纵坐标最宽距离
             */
            for (i = 0; i <= that.opt.scaleNumber; i++) {
                var val = String(i * (that.fullScale - that.minScale) / that.opt.scaleNumber + that.minScale);
                that.drawApi.save();
                that.drawApi.font = that.opt.leftFontSize + that.opt.fontFamily;
                if (that.textWidth === undefined || that.textWidth < that.drawApi.measureText(val).width) {
                    that.textWidth = that.drawApi.measureText(val).width;
                }
                that.drawApi.restore();
            }
            //that.drawApi.save();
            //that.drawApi.font = that.opt.leftFontSize + that.opt.fontFamily;
            //that.textWidth = that.drawApi.measureText(that.max.toString()).width;
            //that.drawApi.restore();
            that.textWidth += that.opt.border * 2;
            l = that.dataArr.length;
            //  算出图表区域的单位宽度
            that.unitWidth = (that.opt.width * 2 - that.textWidth - that.opt.rightBorder) / (l - 1);

            /**
             * 循环算出数据对应的点坐标
             */
            for (i = 0; i < l; i++) {
                that.pArr.push(new PointClass(that.textWidth + i * that.unitWidth,
                    that.opt.portHeight * that.opt.scaleNumber * (1
                    - (parseFloat(that.dataArr[i][that.opt.charNameObj.value]) - that.minScale) / (that.fullScale - that.minScale)) + that.opt.portHeight / 2));
            }
        },

        /**
         * 每次动画执行后的数据
         */
        add: function () {
            var that = this;
            that.loop++;
            that.clipWidth = Math.floor(that.opt.width * 2) * (that.loop / that.opt.steps);
            if (that.loop >= that.opt.steps) {
                that.over = true;
            }
        }
    };
    function Line(opt) {
        this.options = {
            // 绘制走势图的canvas容器ID
            id: '#line',
            // 走势图的高度
            height: 240,
            // 走势图的宽度
            width: 640,
            // 执行的步数，这个数据表示动画执行多少次
            steps: 60,
            // 走势图线的宽度
            linePx: 2,
            // 需要多少刻度
            scaleNumber: 5,
            // 左部字体间距
            border: 10,
            // 字体库
            fontFamily: ' Arial',
            // 左侧字体大小
            leftFontSize: '24px',
            // 左部字体颜色
            leftFontColor: '#ccc',
            // 底部字体大小
            downFontSize: '24px',
            // 底部字体颜色
            downFontColor: '#ccc',
            // 最大值字体颜色
            maxFontColor: '#ff3d3d',
            // 最小值字体颜色
            minFontColor: '#56b229',
            // 线颜色
            lineColor: '#4477d5',
            // 右侧空白间距
            rightBorder: 30,
            // 点的半径
            pointRadius: 5,
            // 下部字体左移多少距离
            downFontLeftMoveX: 25,
            // 背景线颜色
            bgLineColor: '#ccc',
            bgLinePx: 2,
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
                }, {
                    name: '8.22',
                    value: 40000
                }
            ]
        };
        for (var idx in opt) {
            this.options[idx] = opt[idx];
        }
        this.init();
    }

    Line.prototype = {
        init: function () {
            var that = this;
            that.con = $(that.options.id);
            that.con.css({overflow: 'visible', transform: 'translateZ(0)', '-webkit-transform': 'translateZ(0)'});
            that.cvs = $('<canvas></canvas>');
            that.drawApi = this.cvs[0].getContext('2d');
            that.drawLineClass = null;
            that.pointArr = [];
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
            // 一共有6条线，并且要给最下面的说明留下一个空位
            that.options.portHeight = Math.floor(that.cvs[0].height / (that.options.scaleNumber + 1));
            that.cvs.css('width', that.options.width + 'px');
            that.cvs.css('height', that.options.height + 'px');
            that.fillData(that.options.dataArr);
            that.con.append(that.cvs);
        },

        /**
         * 填充数据
         * @param arr
         */
        fillData: function (arr) {
            this.drawLineClass = new DrawLineClass(arr, this.options, this.drawApi);
        },
        run: function () {
            var that = this;
            w.requestAnimationFrame(function () {
                that.animation();
            });
        },
        animation: function () {
            var that = this;
            that.drawApi.clearRect(0, 0, that.cvs[0].width, that.cvs[0].height);
            that.drawLineClass.add();
            that.drawBg(that.drawLineClass);
            that.drawLine(that.drawLineClass);
            if (that.isOprera) {
                that.cvs.detach();
                that.con.append(that.cvs);
            }
            if (!that.drawLineClass.over) {
                that.run();
            }
        },

        /**
         * 画背景
         * @param dlc
         */
        drawBg: function (dlc) {
            var that = this;
            that.drawApi.save();
            that.drawApi.font = that.options.leftFontSize + that.options.fontFamily;
            that.drawApi.textAlign = 'right';
            that.drawApi.textBaseline = 'top';
            that.drawApi.fillStyle = that.options.leftFontColor;
            for (var i = 1; i <= that.options.scaleNumber; i++) {
                var y = that.options.portHeight * (that.options.scaleNumber - i) + that.options.portHeight / 2;
                var value = String(i * (dlc.fullScale - dlc.minScale) / that.options.scaleNumber + dlc.minScale);
                var str = value;
                that.drawApi.fillText(str, dlc.textWidth - that.options.border, y);
                that.drawApi.save();
                that.drawApi.strokeStyle = that.options.bgLineColor;
                that.drawApi.lineWidth = that.options.bgLinePx;
                that.drawApi.beginPath();
                that.drawApi.moveTo(dlc.textWidth, y);
                that.drawApi.lineTo(dlc.textWidth + dlc.unitWidth * (dlc.pArr.length - 1), y);
                that.drawApi.stroke();
                that.drawApi.restore();
            }
        },

        /**
         * 画线
         * @param dlc
         */
        drawLine: function (dlc) {
            var that = this;
            var l = dlc.pArr.length;
            for (var i = 0; i < l; i++) {
                var name = dlc.dataArr[i][that.options.charNameObj.name];
                that.drawApi.save();
                that.drawApi.font = that.options.downFontSize + that.options.fontFamily;
                that.drawApi.textAlign = 'left';
                that.drawApi.textBaseline = 'bottom';
                that.drawApi.fillStyle = that.options.downFontColor;
                that.drawApi.fillText(name, dlc.textWidth + dlc.unitWidth * i
                    - that.options.downFontLeftMoveX, that.options.portHeight * (that.options.scaleNumber + 1));
                that.drawApi.restore();

                that.drawApi.save();
                that.drawApi.rect(0, 0, dlc.clipWidth, that.drawApi.canvas.height);
                that.drawApi.clip();
                if (i < l - 1) {
                    that.drawApi.strokeStyle = that.options.lineColor;
                    that.drawApi.lineWidth = that.options.linePx;
                    that.drawApi.beginPath();
                    that.drawApi.moveTo(dlc.pArr[i].x, dlc.pArr[i].y);
                    that.drawApi.lineTo(dlc.pArr[i + 1].x, dlc.pArr[i + 1].y);
                    that.drawApi.stroke();
                }
                that.drawApi.restore();
                that.drawApi.save();
                that.drawApi.fillStyle = that.options.lineColor;
                that.drawApi.beginPath();
                that.drawApi.arc(dlc.pArr[i].x, dlc.pArr[i].y, that.options.pointRadius, 0, Math.PI * 2, true);
                that.drawApi.closePath();
                that.drawApi.fill();
                that.drawApi.restore();
            }
        }
    };
    return Line;
});