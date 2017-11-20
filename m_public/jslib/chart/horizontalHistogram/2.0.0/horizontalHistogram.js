/**
 * 横向柱状图（canvas实现）
 * Author by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/horizontalHistogram/2.0.0/horizontalHistogram', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        w.HorizontalHistogram2 = f(w);
    }
})(window, function (w) {
    'use strict';
    var $ = w.jQuery;
    if (!$) {
        console.log('没有引入jquery或者该js文件引入位置在jquery引入之前!');
    }

    /**
     * 画图数据块基类
     * @param arr 数据数组
     * @param drawApi 画图api实例
     * @param opt 外部传参
     * @constructor
     */
    function drawDataBase(arr, drawApi, opt) {
        this.dataArr = arr;
        this.opt = opt;
        this.drawApi = drawApi;
        this.loop = 0;
        this.over = false;
        this.addArr = [];
        this.maxValue = 1;
        this.textWidth = 0;
        this.init();
    }

    drawDataBase.prototype = {

        /**
         * 初始化函数
         */
        init: function () {
            var that = this;
            that.drawApi.save();
            that.drawApi.font = that.opt.leftfontSize + that.opt.fontFamily;
            var l = that.dataArr.length,i;
            
            /**
             * 循环判断出数据的最大值和左部显示名称在canvas上面绘制时的最大宽度
             */
            for (i = 0; i < l; i++) {
                if (that.textWidth < that.drawApi.measureText(that.dataArr[i][that.opt.charNameObj.name]).width) {
                    that.textWidth = that.drawApi.measureText(that.dataArr[i][that.opt.charNameObj.name]).width;
                }
                if (that.maxValue < parseFloat(that.dataArr[i][that.opt.charNameObj.value])) {
                    that.maxValue = parseFloat(that.dataArr[i][that.opt.charNameObj.value]);
                }
            }
            // 左部显示名称宽度左右留空白
            that.textWidth += that.opt.border * 2;
            that.drawApi.restore();
            // 计算最大刻度
            var s = that.maxValue.toString().split('.')[0];
            l = s.length;
            var head = (parseInt(s.charAt(0)) + 1).toString();
            for (i = 1; i < l; i++) {
                head += '0';
            }
            // 获取最大刻度
            that.maxValue = parseInt(head);
        },

        /**
         * 增量数据函数
         * 通过不断增量，获取动画效果每一步增加了多少距离
         */
        add: function () {
            var that = this;
            that.addArr = [];
            that.loop++;
            var l = that.dataArr.length;
            for (var i = 0; i < l; i++) {
                var val = that.loop / that.opt.steps * (parseFloat(that.dataArr[i][that.opt.charNameObj.value]) / that.maxValue);
                that.addArr.push(val.toFixed(3));
            }
            // 大于外部传参最大步数时，动画结束
            if (that.loop >= that.opt.steps) {
                that.over = true;
            }
        }
    };

    /**
     * 横向柱状图主类
     * @param opt
     */
    function horizontalHistogram(opt) {
        this.options = {
            // 绘制横向柱状图canvas的容器
            id: '#horizontalHistogram',
            // canvas的宽度
            width: 640,
            // 需要多少步动画结束
            steps: 30,
            // 间隔最大值，即纵坐标有几个刻度
            space: 5,
            // 左部显示名称的字体大小
            leftfontSize: '24px',
            // 下部显示刻度的字体大小
            downfontSize: '16px',
            // 字体库
            fontFamily: ' Arial',
            // 横向的数据字体显示颜色
            valueFontColor: '#000',
            // 左部字体颜色
            leftFontColor: '#000',
            // 下部字体显示颜色
            downFontColor: '#000',
            // 背景线颜色
            bgLineColor: '#aaa',
            // 右部空白
            rightBorder: 40,
            // 左部字体两边的间隔
            border: 20,
            // 柱的高度
            barHeight: 20,
            // 单条数据显示高度
            singleDataShowHeight: 50,
            // 下部字体距离刻度线间隔
            downFontTop: 10,
            // 对象名称转换，这里的作用是，省去了后台数据键值不对应还要循环赋键值的问题
            charNameObj: {name: 'name', value: 'value'},
            // 随机的柱颜色排布
            randomBarColorArr: ['#c3d69b', '#fac090', '#b7dee8'],
            // 初始化传入的数据
            dataArr: [{
                name: '北京',
                value: '19'
            }, {
                name: '乌鲁木齐',
                value: '999'
            }, {
                name: '北京',
                value: '200'
            }, {
                name: '呼和浩特',
                value: '999'
            }]
        };

        /**
         * 将外部数据覆盖默认配置
         */
        for (var i in opt) {
            if (opt.hasOwnProperty(i)) {
                this.options[i] = opt[i];
            }
        }
        this.init();
    }

    horizontalHistogram.prototype = {
        init: function () {
            var that = this;
            // 获取canvas的容器
            that.con = $(that.options.id);
            // 设置容器的样式，已达到最大的兼容性
            that.con.css({overflow: 'visible', transform: 'translateZ(0)', '-webkit-transform': 'translateZ(0)'});
            // 创建canvas
            that.cvs = $('<canvas></canvas>');
            // 获取画图api
            that.drawApi = that.cvs[0].getContext('2d');

            /**
             * 判断是否为欧鹏浏览器，低版本安卓欧鹏浏览器兼容性处理，强制刷新方法绘制动画
             * @type {boolean}
             */
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
            // 声明canvas的宽度
            that.cvs[0].width = that.options.width * 2;
            // 设置canvas的css样式宽度
            that.cvs.css('width', that.options.width.toString() + 'px');
            that.fillData(that.options.dataArr);
            that.con.append(that.cvs);
        },

        /**
         * 填充数据函数
         * @param dataArr 数据数组
         */
        fillData: function (dataArr) {
            var that = this;
            var l = dataArr.length;
            // 根据数据长度计算显示图表的高度
            that.chartHeight = l * that.options.singleDataShowHeight;
            that.topScaleHeight = parseFloat(that.options.downfontSize) + that.options.downFontTop;
            // 计算加上下部刻度及刻度显示文字后的canvas总高度
            that.height = that.chartHeight + 2 * that.topScaleHeight;
            // 设置canvas的高度
            that.cvs[0].height = that.height;
            // 设置canvas的css样式宽度
            that.cvs.css('height', that.height / 2 + 'px');
            // 画图数据块基类
            that.block = new drawDataBase(dataArr, that.drawApi, that.options);
        },

        /**
         * 运行动画
         */
        run: function () {
            var that = this;
            w.requestAnimationFrame(function () {
                that.animation();
            });
        },

        /**
         * 画图动画
         */
        animation: function () {
            var that = this;
            that.drawApi.clearRect(0, 0, that.cvs[0].width, that.cvs[0].height);
            that.block.add();
            that.drawBg(that.block);
            that.drawChart(that.block);
            if (that.isOprera) {
                that.cvs.detach();
                that.con.append(that.cvs);
            }
            if (!that.block.over) {
                that.run();
            }
        },

        /**
         * 画图表
         * @param cls
         */
        drawChart: function (cls) {
            var that = this;
            that.drawApi.save();
            // 设置左部显示文字属性
            that.drawApi.font = that.options.leftfontSize + that.options.fontFamily;
            that.drawApi.textAlign = 'center';
            that.drawApi.textBaseline = 'middle';
            that.drawApi.fillStyle = that.options.leftFontColor;
            var dataArr = cls.dataArr;
            var addArr = cls.addArr;
            var l = addArr.length;
            for (var i = 0; i < l; i++) {
                var leftFontY = i * that.options.singleDataShowHeight + that.options.singleDataShowHeight / 2 + that.topScaleHeight;
                that.drawApi.fillText(dataArr[i][that.options.charNameObj.name], cls.textWidth / 2, leftFontY);
                that.drawApi.save();
                that.drawApi.fillStyle = dataArr[i].color ? dataArr[i].color : that.options.randomBarColorArr[i % that.options.randomBarColorArr.length];
                that.drawApi.beginPath();
                var barW = addArr[i] * (that.cvs[0].width - cls.textWidth - that.options.rightBorder);
                var barMiddleY = i * that.options.singleDataShowHeight + (that.options.singleDataShowHeight - that.options.barHeight) / 2 + that.topScaleHeight;
                that.drawApi.fillRect(cls.textWidth, barMiddleY, barW, that.options.barHeight);
                that.drawApi.fill();
                that.drawApi.restore();
                that.drawApi.save();
                that.drawApi.font = that.options.downfontSize + that.options.fontFamily;
                var s = cls.textWidth + barW;
                if (that.drawApi.measureText(dataArr[i][that.options.charNameObj.value]).width + 10 >= barW) {
                    that.drawApi.textAlign = 'left';
                    s += 10;
                } else {
                    that.drawApi.textAlign = 'right';
                    s -= 10;
                }
                that.drawApi.textBaseline = 'middle';
                that.drawApi.fillStyle = that.options.valueFontColor;
                that.drawApi.fillText(dataArr[i][that.options.charNameObj.value], s, leftFontY);
                that.drawApi.restore();
            }
            that.drawApi.restore();
        },

        /**
         * 绘制图表背景
         * @param cls
         */
        drawBg: function (cls) {
            var that = this;
            that.drawApi.save();
            that.drawApi.strokeStyle = that.options.bgLineColor;
            // 上灰线
            that.drawApi.beginPath();
            that.drawApi.moveTo(cls.textWidth, that.topScaleHeight);
            that.drawApi.lineTo(that.cvs[0].width - that.options.rightBorder, that.topScaleHeight);
            // 左灰线
            that.drawApi.moveTo(cls.textWidth, that.topScaleHeight);
            that.drawApi.lineTo(cls.textWidth, that.chartHeight + that.topScaleHeight);
            // 下灰线
            that.drawApi.moveTo(cls.textWidth, that.chartHeight + that.topScaleHeight);
            that.drawApi.lineTo(that.cvs[0].width - that.options.rightBorder, that.chartHeight + that.topScaleHeight);
            that.drawApi.stroke();
            that.drawApi.restore();
            for (var i = 0; i <= that.options.space; i++) {
                that.drawApi.save();
                that.drawApi.font = that.options.downfontSize + that.options.fontFamily;
                that.drawApi.textAlign = 'center';
                that.drawApi.textBaseline = 'top';
                that.drawApi.fillStyle = that.options.downFontColor;
                that.drawApi.fillText((i * cls.maxValue / that.options.space).toString().replace(/0000$/, '万'),
                    cls.textWidth + i * (that.cvs[0].width - cls.textWidth - that.options.rightBorder) / that.options.space,
                    that.chartHeight + that.options.downFontTop + that.topScaleHeight);
                that.drawApi.textBaseline = 'bottom';
                that.drawApi.fillText((i * cls.maxValue / that.options.space).toString().replace(/0000$/, '万'),
                    cls.textWidth + i * (that.cvs[0].width - cls.textWidth - that.options.rightBorder) / that.options.space,
                    that.topScaleHeight);
                that.drawApi.restore();
            }
        }
    };
    return horizontalHistogram;
});