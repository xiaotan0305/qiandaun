/**
 * 统计分析需求新增柱状图与曲线图混合显示
 * by tankunpeng
 * @param {Object} w
 * @param {Object} f
 * @author liuxinlu@fang.com 去掉背景线
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/hisline/1.0.1/hisline', ['chart/raf/1.0.0/raf', 'iscroll/2.0.0/iscroll-lite'], function (require) {
            require('chart/raf/1.0.0/raf');
            var iscroll = require('iscroll/2.0.0/iscroll-lite');
            return f(w, iscroll);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        // 请引入chart/raf/1.0.0/raf的js
        window.HisLine = f(w,window.IScrollLite);
    }
})(window, function factory(w,Iscroll) {
    'use strict';
    var $ = w.jQuery;
    var vars = window.seajs ? seajs && seajs.data.vars : '';
    function HisLine(ops) {
        this.options = {
            // 走势图容器id
            id: '#hisLine',
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
            // 刻度字体大小及颜色
            scaleFontSize: '24px',
            scaleColor: '#ccc',
            // 刻度的一侧间隔
            scaleBorder: 6,
            // 字体
            fontFamily: ' Arial',
            // 底部字体大小及颜色
            downFontSize: '24px',
            downTxtColor: '#999',
            // 点半径
            pointRadis: 8,
            // 点颜色
            pointColor: '#7ac081',
            pointBackground: '#fff',
            // 背景线线宽及颜色
            bgLinePx: 0.5,
            bgLineColor: '#ccc',
            // 走势图的上下间隔
            chartSp: 50,
            // 下部横坐标值区域的间隔
            downSp: 50,
            // 走势图左右区域的间隔
            border: 0,
            // 动画时长
            runTime: 1000,
            // 显示值:
            showValue: true,
            // 折线图
            lineArr: [{
                lineColor: '#ff6666',
                pointColor: '#ff6666',
                data: [
                    {
                        name: '15-06',
                        value: '32719'
                    }
                ]
            }],
            // 缩进比例
            lineIndent: 1,
            // 柱状图

            // 除去间距柱子的宽度比
            barWidthPart: 0.5,
            // 上行柱颜色
            upColor: '#ffc488',
            // 下行柱颜色
            downColor: '#92be69',
            // 柱状图传入的数据
            hisArr: [
                {name: '三个字', value: -1.6, color: '#f00'},
                {name: 'b', value: 2.0, color: '#100'}
            ],
            // 柱状图单位
            hisBit: '',
            // 折线图单位
            lineBit: '',
            isScroll:false
        };
        $.extend(this.options, ops);
        if(this.options.isScroll){
            if(this.options.hisArr && this.options.hisArr.length){
                this.options.w = this.options.w * (this.options.hisArr.length / 5);
            }
        }
        this.init();
    }


    HisLine.prototype = {
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
            // 计算出显示走势图的背景宽度
            that.chartTotalW = that.options.w * 2 - that.options.scaleBorder * 2;
            // 设置刻度左侧canvas及绘图api
            that.scaleCvsL = $('<canvas class="scaleCvs" height="' + that.options.h * 2 + '" style="height:' + that.options.h + 'px"></canvas>');
            that.scaleLDrawApi = that.scaleCvsL[0].getContext('2d');
            // 设置走势图canvas的容器，用以滑动
            that.chartCon = $('<div id="scrollObj" style="overflow:hidden;position: relative;z-index: 0;transform: translateZ(0);'
                + '-webkit-transform: translateZ(0);-o-transform: translateZ(0);'
                + '-ms-transform: translateZ(0);-moz-transform: translateZ(0);"><canvas height="'
                + that.options.height * 2 + '" style="height:' + that.options.height + 'px;">您的浏览器不支持</canvas></div>');
            // 设置刻度右侧canvas及绘图api
            that.scaleCvsR = $('<canvas class="scaleCvs" height="' + that.options.h * 2 + '" style="height:' + that.options.h + 'px"></canvas>');
            that.scaleRDrawApi = that.scaleCvsR[0].getContext('2d');

            // 设置走势图canvas及绘图api
            that.cvs = that.chartCon.find('canvas');
            // 设置canvas的宽高和样式宽高,之所以2比1是为了保持所有绘制都是高清图
            that.cvs[0].width = that.options.w * 2;
            that.cvs[0].height = that.options.h * 2;
            that.cvs.css('width', that.options.w + 'px');
            that.cvs.css('height', that.options.h + 'px');
            that.drawApi = that.cvs[0].getContext('2d');

            that.con.append(that.scaleCvsL);
            that.con.append(that.scaleCvsR);
            that.con.append(that.chartCon);

            that.dataLineArr = that.options.lineArr;
            that.dataHisArr = that.options.hisArr;
            that.dataLinePos = [];
            // 填充数据
            that.fillHisData(that.options.hisArr);
            that.fillLineData(that.options.lineArr);

            // 背景线数组
            that.bgLineArr = [];
            // 弹层元素
            if (that.options.alertDom) {
                that.alertDom = $(that.options.alertDom);
                that.alertDomH = that.alertDom.outerHeight();
                that.alertDomW = that.alertDom.outerWidth();
                that.ps = that.alertDom.children();
                that.ps.each(function (index, ele) {
                    that['pspan' + (index + 1)] = $(ele);
                });
            }

            // 绑定点击事件处理用户行为
            that.cvs.on('click', function (e) {
                that.click(e);
            });
        },

        /**
         * 数组去重
         * @param arr 数组
         * @returns 去重后数组
         */
        unique: function (arr) {
            var res = [];
            var json = {};
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!json[arr[i]] && ~~arr[i]) {
                    res.push(arr[i]);
                    json[arr[i]] = 1;
                }
            }
            return res;
        },

        /**
         * 填充曲线图数据
         * @param arr 数据
         */
        fillLineData: function (arr) {
            var that = this;
            // 最大值的宽度
            that.dataLineArrL = arr.length;
            that.xAxisL = arr[0].data.length;
            // 循环使用
            var i = 0,
                j = 0,
                // 最大值
                maxVal,
                // 最小值
                minVal;
            // 最大值的宽度
            var maxValWidth;
            // 循环遍历出走势图数据
            for (; i < that.dataLineArrL; i++) {
                var yAxis = arr[i].data;
                var yAxisL = yAxis.length;

                /**
                 * 循环遍历出走势图数据中各个单点数据
                 */
                for (j = 0; j < yAxisL; j++) {
                    // 获取值
                    var val = yAxis[j].value;
                    var valS = Number(val);
                    yAxis[j].txt = true;
                    if(valS === 0){
                        valS = 0.0001;
                    }
                    // 获取该值在canvas中画出需要的宽度
                    that.scaleRDrawApi.save();
                    that.scaleRDrawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                    if (maxValWidth === undefined || maxValWidth < that.scaleRDrawApi.measureText(val + that.options.lineBit).width) {
                        maxValWidth = that.scaleRDrawApi.measureText(val + that.options.lineBit).width;
                    }
                    that.scaleRDrawApi.restore();
                    // 获取最大值
                    if (maxVal === undefined || maxVal < valS) {
                        maxVal = valS;
                    }
                    // 获取最小值
                    if ((minVal === undefined || minVal > valS) && valS > 0) {
                        minVal = valS;
                    }
                }
            }
            // 赋值计算出的数据给全局
            that.maxValR = maxVal;
            that.minValR = minVal;
            if (that.maxValR === that.minValR) {
                that.maxValR = that.minValR * 5;
            }
            // 设置刻度显示canvas
            // 设置刻度canvas宽度
            that.scaleRTextW = Math.ceil((maxValWidth + that.options.scaleBorder) / 2) * 2;
            that.scaleCvsR[0].width = that.scaleRTextW;
            var cssObj = {
                width: that.scaleRTextW / 2,
                position: 'absolute',
                top: '0px',
                right: '0px',
                'z-index': 1
            };
            that.scaleCvsR.css(cssObj);
            var scrollObj = document.getElementById('scrollObj');
            scrollObj.style.marginRight = that.scaleRTextW / 2 + 'px';
            scrollObj.style.marginLeft = that.scaleRTextW / 2 + 'px';
            // 获取刻度高度间隔及数值间隔
            that.valSpR = (maxVal - minVal) / that.options.scaleNumber;


            /**
             * 循环遍历算出所有的刻度，并显示到刻度canvas上
             */
            var scaleArr = [];
            for (i = 0; i <= that.options.scaleNumber; i++) {
                var dValue = i * that.valSpR;
                if(vars.action === 'esfDealList'|| vars.action === 'xfdistrictDetail'|| vars.action === 'xfDealList'){
                    var scaleVal = (maxVal - dValue).toFixed(2);
                }else{
                    var scaleVal = that.options.lineBit ? (maxVal - dValue).toFixed() : String(Math.floor(maxVal - dValue));
                }
                if($.inArray(scaleVal,scaleArr) === -1){
                    scaleArr.push(scaleVal);
                }
            }
            if(scaleArr.length < that.options.scaleNumber){
                var  len = (that.options.scaleNumber - scaleArr.length) + 1;
                scaleArr.sort(function(a,b){
                    return b - a ;
                });
                for(var i = 1;i<= len;i++){
                    scaleArr.push((parseFloat(scaleArr[(scaleArr.length - 1)]) - i* that.valSpR).toFixed(2));
                }
                that.minValR = scaleArr[scaleArr.length - 1];
            };

            that.drawScale(scaleArr);
            // 设置走势图容器宽度;
            that.setCvsWidth();

            // 获取走势图除两边间距后的每一部分横坐标刻度的宽度
            that.portWidth = that.drawApi.canvas.width / that.xAxisL;
        },
        drawScale:function(arr){
            for(var j = 0;j<arr.length;j++){
                var that = this;
                var my = that.options.chartSp + j * that.scaleSpH ;
                // 画刻度值
                that.scaleRDrawApi.save();
                that.scaleRDrawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                that.scaleRDrawApi.textAlign = that.options.scalePosition;
                that.scaleRDrawApi.textBaseline = 'center';
                that.scaleRDrawApi.fillStyle = that.options.scaleColor;
                that.scaleRDrawApi.fillText(arr[j] + that.options.lineBit, 0, my);
                that.scaleRDrawApi.restore();
            }

        },

        /**
         * 设置走势图容器宽度
         */
        setCvsWidth: function () {
            var that = this;
            var initWith = that.cvs.width();
            that.chartW = that.options.w - (that.scaleRTextW / 2 + that.scaleLTextW / 2);
            var ccObj = {width: that.chartW + 'px'};
            ccObj['margin-left'] = that.scaleLTextW / 2 + 'px' + 10;
            that.cvs.css(ccObj);
            // 设置样式前后比例 click点击 判断区域的时候用
            that.cvsW = that.cvs.width();
            that.cvsH = that.cvs.height();
            that.scale = initWith / that.cvsW;
        },

        /**
         * 填充柱状图数据
         * @param arr 数据
         */
        fillHisData: function (arr) {
            var that = this,
                i = 0,
                valArr = [],
                duplex = false,
                maxVal,
                minVal,
                orginY = that.drawApi.canvas.height - that.options.downSp;
            // 最大值的宽度
            var maxValWidth;
            // 重置初值
            that.over = false;

            that.barArr = [];
            that.dataHisL = arr.length;
            // 计算出柱状图所占横向单位宽度，此宽度包括柱形间的间隔
            var partW = that.drawApi.canvas.width / that.dataHisL;
            // 循环遍历所有传入的值，找到最大值，并且为了方便计算将转换为数值的值存到一个数组索引中，并且判断是否为双面柱状图
            for (; i < that.dataHisL; i++) {
                var val = parseFloat(arr[i].value);
                var value = Math.abs(val);

                // 获取该值在canvas中画出需要的宽度
                that.scaleLDrawApi.save();
                that.scaleLDrawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                if (maxValWidth === undefined || maxValWidth < that.scaleLDrawApi.measureText(val + that.options.hisBit).width) {
                    maxValWidth = that.scaleLDrawApi.measureText(val + that.options.hisBit).width;
                }
                that.scaleLDrawApi.restore();
                if (maxVal === undefined || maxVal < value) {
                    maxVal = value;
                }
                // 获取最小值
                if ((minVal === undefined || minVal > value) && value > 0) {
                    minVal = value;
                }
                that.maxValL = maxVal;
                that.minValL = minVal;
                // 设置刻度显示canvas
                // 设置刻度canvas宽度
                that.scaleLTextW = Math.ceil((maxValWidth + that.options.scaleBorder) / 2) * 2;
                that.scaleCvsL[0].width = that.scaleLTextW;
                var cssObj = {
                    width: that.scaleLTextW / 2,
                    position: 'absolute',
                    // borderTop: that.options.bgLinePx + 'px solid ' + that.options.bgLineColor,
                    // borderBottom: that.options.bgLinePx + 'px solid ' + that.options.bgLineColor,
                    // borderLeft: that.options.bgLinePx + 'px solid ' + that.options.bgLineColor,
                    top: '0px',
                    left: '0px',
                    'z-index': 1
                };
                if (that.maxValL === 0) {
                    cssObj.display = 'none';
                } else {
                    cssObj.display = 'block';
                }
                that.scaleCvsL.css(cssObj);
                // 获取刻数值间隔
                that.valSpL = (maxVal - minVal) / that.options.scaleNumber;
                // 有负值则为双面柱状图
                if (val < 0) {
                    duplex = true;
                }
                valArr.push(val);
            }
            // 数组去重去0
            // valArr = that.unique(valArr);
            // 双面柱状图的纵轴参考值变更
            if (duplex) {
                orginY = that.drawApi.canvas.height / 2;
            }

            /**
             * 循环遍历算出所有的刻度，并显示到刻度canvas上
             */

            if (maxVal === minVal) {
                that.options.scaleNumber = 1;
                that.valSpL = maxVal;
            } else {
                that.valSpL = (maxVal - minVal) / that.options.scaleNumber;
            }
            var maxBit = maxVal.toString().length;
            that.scaleSpH = that.chartH / (that.options.scaleNumber);
            // 纵坐标刻度线
            for (i = 0; i <= that.options.scaleNumber; i++) {
                var scaleVal = String(Math.floor(maxVal - i * that.valSpL));
                scaleVal = that.numFormat(scaleVal, maxBit);
                var my = that.options.chartSp + i * that.scaleSpH;
                // 画刻度值
                that.scaleLDrawApi.save();
                that.scaleLDrawApi.font = that.options.scaleFontSize + that.options.fontFamily;
                that.scaleRDrawApi.textAlign = that.options.scalePosition;
                that.scaleLDrawApi.textBaseline = 'center';
                that.scaleLDrawApi.fillStyle = that.options.scaleColor;
                that.scaleLDrawApi.fillText(scaleVal + that.options.hisBit, 0, my);
                that.scaleLDrawApi.restore();
            }
            // 计算出柱状图形去除间隔后的真实宽度
            var w = partW * that.options.barWidthPart;
            // 循环遍历初始化柱类并存入到一个全局索引数组中
            for (i = 0; i < that.dataHisL; i++) {
                // 算出每个柱子的横坐标
                var x = partW * (i + 0.5);
                // 与最大值作对比算出每个柱子的高度
                var h;
                if (that.maxValL === that.minValL) {
                    h = that.chartH + that.options.downSp;
                } else {
                    h = (valArr[i] - that.minValL) / (that.maxValL - that.minValL) * that.chartH + that.options.downSp;
                }
                // 判断颜色，如果传入了颜色则用传入颜色，否则用默认的颜色
                var color = arr[i].color || (valArr[i] < 0 ? that.options.downColor : that.options.upColor);
                // 初始化柱类并存入索引数组
                that.barArr.push(new Bar(x,
                    orginY,
                    w,
                    h,
                    arr[i].value,
                    arr[i].name,
                    color,
                    that.options.downTxtColor,
                    that.options.fontFamily,
                    that.options.downFontSize,
                    that.options.downSp,
                    that.drawApi,
                    that.options.showValue
                ));
            }
        },

        /**
         * 外部接口，执行图形动画
         */
        run: function (time) {
            var that = this;
            // 获取开始动画初试时间
            this.start = new Date().getTime();
            this.an();
            this.addScroll();
            if (that.scroll) {
                var t = time || 2000;
                var width = $('#scrollObj').width();
                that.scroll.scrollTo(width - that.cvsW - that.scaleLTextW / 2, 0, 2000);
            }
        },
        addScroll:function(){
            this.scroll = new Iscroll('#scrollObj',{
                scrollX:true,
                scrollY:false,
                click:true
            });
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
            that.drawBg(that.options.lineArr);
            that.drawHis();
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
         *
         * 画背景,包括背景线和下面的文案
         */
        drawBg: function (arr) {
            var that = this;
            if (arr.length) {
                for (var i = 0; i <= that.dataHisL; i++) {
                    var mx = that.portWidth * (i + 0.5);
                    //背景线个数与刻度个数一致
                    if (i<= that.options.scaleNumber) {
                        var my = that.options.chartSp + i * that.scaleSpH;
                        if (that.bgLineArr.length < that.xAxisL) {
                            that.bgLineArr.push({
                                vertical: mx,
                                horizontal: my
                            });
                        }
                        // 画横向背景线
                        that.drawApi.save();
                        that.drawApi.strokeStyle = that.options.bgLineColor;
                        that.drawApi.lineWidth = that.options.bgLinePx;
                        that.drawApi.beginPath();
                        that.drawApi.moveTo(0, my);
                        that.drawApi.lineTo(that.chartTotalW, my);
                        that.drawApi.stroke();
                        that.drawApi.restore();
                    }
                    // 画下部文案
                    if (arr[0].data[i]) {
                        that.drawApi.save();
                        that.drawApi.font = that.options.downFontSize + that.options.fontFamily;
                        that.drawApi.textAlign = 'center';
                        that.drawApi.textBaseline = 'middle';
                        that.drawApi.fillStyle = that.options.downTxtColor;
                        that.drawApi.fillText(arr[0].data[i].name, mx, that.drawApi.canvas.height - that.options.downSp / 2, that.portWidth);
                        that.drawApi.restore();
                    }

                }
            }
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
            for (var i = 0; i < that.dataLineArrL; i++) {
                var color;
                // 判断是否有颜色赋值，有就用该赋值
                if (that.dataLineArr[i].lineColor) {
                    color = that.dataLineArr[i].lineColor;
                } else {
                    // 没有赋值时使用lineColor数组中的各颜色以此循环使用
                    if (colorIdx > that.options.lineColor.length) {
                        colorIdx = 0;
                    }
                    color = that.options.lineColor[colorIdx];
                }
                // 根据走势线的值数据画一条曲线
                that.drawOneline(that.dataLineArr[i].data, color, change);
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
            var vl = 0;
            // 循环使用
            var i = 0,
                // 换算点索引数组
                p = [];
            // 循环遍历计算出走势点在canvas中的像素坐标，并储存到p数组中
            for (; i < l; i++) {
                var mx = that.portWidth * (i + 0.5);
                var my = (1 - (Number(arr[i].value) - that.minValR) / (that.maxValR - that.minValR)) * that.chartH + that.options.chartSp;
                // 不处理左右两端为0的数据

                if ((i===0 || i ===l-1) && arr[i].value && arr[i].value !== '0' || (i> 0 && i< l-1) && typeof arr[i].value != 'undefined') {
                    p.push({x: mx, y: my});
                    vl++;
                }
            }

            // 设置曲线的样式
            var bL = vl - 1;
            // 循环遍历，根据公式画出三次贝塞尔曲线的两个控制点位置，并画出走势图曲线
            for (i = 0; i < bL; i++) {
                // 获取贝塞尔曲线两个控制点坐标
                var ctrlP = that.getCtrlPoint(p, i);
                that.drawApi.save();
                that.drawApi.beginPath();
                that.drawApi.strokeStyle = color;
                that.drawApi.lineWidth = that.options.linePx;
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
                var mxx = that.portWidth * (i + 0.5);
                if (mxx > c * that.drawApi.canvas.width) {
                    continue;
                }
                // 点纵坐标为0时做特殊处理
                if (Number(arr[i].value) === 0 && (that.maxValR - that.minValR) > 1) {
                    var myy = (1 - (Number(arr[i].value) - that.minValR*2) / (that.maxValR - that.minValR)) * that.chartH + that.options.chartSp;
                } else {
                    var myy = (1 - (Number(arr[i].value) - that.minValR) / (that.maxValR - that.minValR)) * that.chartH + that.options.chartSp;

                }
                if (that.over && that.dataLinePos.length < l) {
                    that.dataLinePos.push({
                        x: mxx,
                        y: myy,
                        value: Number(arr[i].value)
                    });
                }
                that.drawApi.save();
                // that.drawApi.globalCompositeOperation = 'destination-out';
                that.drawApi.fillStyle = that.options.pointColor;
                that.drawApi.beginPath();
                that.drawApi.arc(mxx, myy, that.options.pointRadis + 4, 0, Math.PI * 2);
                that.drawApi.fill();
                that.drawApi.restore();
                that.drawApi.save();
                that.drawApi.fillStyle = that.options.pointBackground;
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
                if (that.options.showValue) {
                    that.drawApi.fillText(arr[i].value, mxx, txtPos);
                }
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
        },

        /**
         * 绘图方法
         */
        drawHis: function () {
            var that = this,
                i = 0,
                // 获取当前时间
                now = new Date().getTime();
            // 清空canvas绘图内容以供重绘
            // that.drawApi.clearRect(0, 0, that.drawApi.canvas.width, that.drawApi.canvas.height);
            // 判断动画时间是否为0，0则直接显示最终柱形
            var change = that.options.runTime === 0 ? 1 : (now - that.start) / that.options.runTime;
            // 这是动画结束标示
            if (change >= 1) {
                that.over = true;
            }
            // 循环遍历所有柱绘制各柱显示图形
            for (; i < that.dataHisL; i++) {
                if (that.barArr[i].value && that.barArr[i].value !== '0') {
                    if (that.over) {
                        that.barArr[i].draw(1);
                    } else {
                        that.barArr[i].draw(change);
                    }
                }
            }
            // 绘制柱形与名称之间的分割线
            that.drawApi.save();
            that.drawApi.strokeStyle = '#ccc';
            that.drawApi.lineWidth = 1;
            that.drawApi.moveTo(0, that.barArr[i - 1].y);
            that.drawApi.lineTo(that.drawApi.canvas.width, that.barArr[i - 1].y);
            that.drawApi.stroke();
            that.drawApi.restore();
        },

        /**
         * 画弹层竖线
         * @param x 点击x坐标
         */
        drawVerticalLine: function (x) {
            var that = this,
                mx = 99999,
                index = 0;
            for (var i = 0, len = that.barArr.length; i < len; i++) {
                var tmpMin = Math.abs(x-that.barArr[i].x);
                if (mx > tmpMin) {
                    mx = tmpMin;
                    index = i;
                } else {
                    break;
                }
            }
            that.drawApi.clearRect(0, 0, that.drawApi.canvas.width, that.drawApi.canvas.height);
            that.drawBg(that.options.lineArr);
            that.drawHis();
            that.drawDottedLine(that.barArr[index].x, 0,that.barArr[index].x, that.chartTotalH, 10);
            that.drawLine();
        },
        drawDottedLine: function (x1, y1, x2, y2, interval) {
            var that = this;
            if (!interval) {
                interval = 5;
            }
            var isHorizontal = true;
            if (x1 === x2) {
                isHorizontal = false;
            }
            var len = isHorizontal ? x2 - x1 : y2 - y1;
            that.drawApi.moveTo(x1, y1);
            var progress = 0;
            while (len > progress) {
                progress += interval;
                if (progress > len) {
                    progress = len;
                }
                that.drawApi.save();
                that.drawApi.fillStyle = 'red';
                if (isHorizontal) {
                    that.drawApi.moveTo(x1 + progress, y1);
                    that.drawApi.arc(x1 + progress, y1, 2, 0, 2 * Math.PI, true);
                    that.drawApi.fill();
                } else {
                    that.drawApi.moveTo(x1, y1 + progress);
                    that.drawApi.arc(x1, y1 + progress, 2, 0, 2 * Math.PI, true);
                    that.drawApi.fill();
                }
                that.drawApi.restore();
            }
        },

        /**
         * 补全位数
         * @param num 需要补全的数字
         * @param maxBit 最大位数
         * @returns {string} 返回字符串
         */
        numFormat: function (num, maxBit) {
            var numStr = num.toString(),
                len = numStr.length,
                dvalue = maxBit - len,
                tmpStr = '';
            for (var i = 0; i < dvalue; i++) {
                tmpStr += '  ';
            }
            tmpStr += num;
            return tmpStr;
        },

        /**
         * 获取线性走势图单位
         * @param num 数字
         * @returns {string} 返回单位
         */
        getIndentBit: function (num) {
            var len = num.toString().length,
                bit = '';
            var bitObj = {
                1: '',
                2: '',
                3: '',
                4: '千',
                5: '万',
                6: '十万',
                7: '百万',
                8: '千万'
            };
            bitObj[len] ? bit = bitObj[len] : bit = '';
            return bit;
        },

        /**
         * 用户点击柱子操作
         * @param e
         */
        click: function (e) {
            var that = this,
                // 获取点击事件实例
                p = e.originalEvent,
                i = 0;
            var mx = (p.pageX - that.cvs.offset().left) * 2;
            var my = (p.pageY - that.cvs.offset().top) * 2;
            that.alertDom && that.alertDom.hide();
            that.drawApi.clearRect(0, 0, that.drawApi.canvas.width, that.drawApi.canvas.height);
            that.drawBg(that.options.lineArr);
            that.drawHis();
            that.drawLine();
            // 判断点击区域
            for (; i < that.dataHisL; i++) {
                // 传入当前用户点击横纵坐标分别判断是否点击了柱子，返回true说明点击并跳出循环
                var data = that.barArr[i];
                if (mx > (data.x - data.w / 2) / that.scale && mx < (data.x + data.w / 2) / that.scale) {
                    // 判断是否在纵向区域中并跳转地址,上行柱
                    // if (data.des && my >= data.y - data.h && my <= data.y) {
                    if (data.href) {
                        w.location.href = data.href;
                    } else if (that.alertDom && that.over) {
                        var span1 = that.pspan1.find('span'),
                            p1 = span1.parent();
                        var span2 = that.pspan2.find('span'),
                            p2 = span2.parent();
                        var hisVal = parseInt(data.value),
                            lineVal = (that.dataLinePos[i].value <1) ? parseFloat(that.dataLinePos[i].value):parseInt(that.dataLinePos[i].value);
                        // 兼容没有值的情况
                        if (hisVal || lineVal) {
                            span1.text(data.value);
                            span2.text(that.dataLinePos[i].value);
                            hisVal ? p1.show() : p1.hide();
                            lineVal ? p2.show() : p2.hide();
                            if(lineVal === -11){
                                p2.hide();
                            }
                            that.alertDom.css({
                                left: mx / 2 + that.alertDomW > that.cvsW ? that.cvsW - that.alertDomW : mx / 2,
                                top: my / 2 + that.alertDomH > that.cvsH ? that.cvsH - that.alertDomH : my / 2
                            }).show();
                            that.drawVerticalLine(mx * that.scale, my);
                        }
                    }
                    break;
                    // }
                }
            }
        }
    };

    /**
     * 获取字符串的真实长度（字节长度）
     * @param str
     * @returns {number}
     */
    function getTrueLength(str) {
        var len = str.length, truelen = 0, x = 0;
        for (; x < len; x++) {
            if (str.charCodeAt(x) > 128) {
                truelen += 2;
            } else {
                truelen += 1;
            }
        }
        return truelen;
    }

    /**
     * 按字节长度截取字符串，返回substr截取位置
     * @param str
     * @param leng
     * @returns {*}
     */
    function cutString(str, leng) {
        var len = str.length, tlen = len, nlen = 0;
        for (var x = 0; x < len; x++) {
            if (str.charCodeAt(x) > 128) {
                if (nlen + 2 < leng) {
                    nlen += 2;
                } else {
                    tlen = x;
                    break;
                }
            } else {
                if (nlen + 1 < leng) {
                    nlen += 1;
                } else {
                    tlen = x;
                    break;
                }
            }
        }
        return tlen;
    }

    /**
     * 柱类
     * @param x 横坐标
     * @param y 纵坐标
     * @param width 柱宽度
     * @param height 柱高度
     * @param value 柱展示的值内容
     * @param name 柱展示的名称内容
     * @param color 柱的颜色
     * @param fontColor 文字的颜色
     * @param fontFamily 字体
     * @param fontSize 字体大小
     * @param textHeight 字体展示高度
     * @param drawApi 绘图api
     * @param showValue 显示value值
     * @constructor
     */
    function Bar(x, y, width, height, value, name, color, fontColor, fontFamily, fontSize, textHeight, drawApi, showValue) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.value = value;
        this.name = name;
        // 该柱是上行还是下行
        this.des = parseFloat(value) >= 0;
        this.c = color;
        this.fc = fontColor;
        this.ff = fontFamily;
        this.fz = fontSize;
        this.th = textHeight;
        this.drawApi = drawApi;
        this.showValue = showValue;
    }

    Bar.prototype = {

        /**
         * 判断是否点击了该柱
         * @param x 鼠标点击canvas的横坐标
         * @param y 鼠标点击canvas的纵坐标
         * @returns {boolean}
         */
        judge: function (x, y) {
            var that = this;
            // 判断点击横坐标是否在柱横向区域
            if (x > that.x - that.w / 2 && x < that.x + that.w / 2) {
                // 判断是否在纵向区域中并跳转地址,上行柱
                if (that.des && y >= that.y - that.h && y <= that.y) {
                    if (that.href) {
                        w.location.href = that.href;
                    }
                    return true;
                }
                // 判断是否在纵向区域中并跳转地址,下行柱
                if (!that.des && y >= that.y && y <= that.y + that.h) {
                    if (that.href) {
                        w.location.href = that.href;
                    }
                    return true;
                }
            }
            return false;
        },

        /**
         * 绘制柱显示
         * @param part 动效使用的百分比展示
         */
        draw: function (part) {
            var that = this;
            // 获取绘制柱的起始位置
            var x = that.x - that.w / 2;
            var y = that.y;
            // 根据动画百分比计算出当前柱的高度
            var h = part * that.h;
            var valY = 0;
            // 绘制柱
            that.drawApi.save();
            that.drawApi.fillStyle = that.c;
            that.drawApi.beginPath();
            // 上行柱重新赋值纵坐标
            if (that.des) {
                y = that.y - h;
            }
            that.drawApi.fillRect(x, y, that.w, h);
            that.drawApi.closePath();
            that.drawApi.fill();
            that.drawApi.restore();
            // 绘制柱的名称和展示的值
            that.drawApi.save();
            that.drawApi.font = that.fz + that.ff;
            that.drawApi.textAlign = 'center';
            that.drawApi.textBaseline = 'middle';
            that.drawApi.fillStyle = that.fc;
            // 如果为上行柱则名称在默认纵坐标的下部
            if (that.des) {
                // 值坐标为中线分割位置减去
                valY = that.y - h - that.th / 2;
                y = that.y + that.th / 2;
            } else {
                valY = that.y + h + that.th / 2;
                y = that.y - that.th / 2;
            }
            if (that.showValue) {
                that.drawApi.fillText(that.value, that.x, valY);
            }
            that.drawApi.restore();
        },

        /**
         *
         * @param lh
         * @param rw
         * @param text
         * @param x
         * @param des
         */
        writeTextOnCanvas: function (lh, rw, text, x, y, des) {
            var that = this, i = 0;
            var totalL = getTrueLength(text);
            var l = Math.ceil(totalL / rw);
            for (; i < l; i++) {
                var tl = cutString(text, rw);
                var ay = (des ? y + i * lh : y - i * lh);
                that.drawApi.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ''), x, ay);
                text = text.substr(tl);
            }
        }
    };

    return HisLine;
});