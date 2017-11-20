/**
 * Created by sf on 14-9-17.
 */
(function (window, factory) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
        define('chart/2.0.0/linechart', [], function () {
            return factory(window);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        window.LineChart = factory(window);
    }
})(window, function (window) {
    'use strict';
    // 画图类
    var util = {
        // 画文字
        drawTxt: function (drawApi, ax, ay, str, font, textAlign, textBaseline, color) {
            drawApi.save();
            drawApi.font = font;
            drawApi.textAlign = textAlign;
            drawApi.textBaseline = textBaseline;
            drawApi.fillStyle = color;
            drawApi.fillText(str, ax, ay);
            drawApi.restore();
        },
        // 测量文字宽度
        measureText: function (drawApi, str) {
            return drawApi.measureText(str).width;
        },
        // 画点
        drawPoint: function (drawApi, tx, ty, radius, color) {
            drawApi.save();
            drawApi.beginPath();
            drawApi.fillStyle = color;
            drawApi.arc(tx, ty, radius, 0, Math.PI * 2, true);
            drawApi.closePath();
            drawApi.fill();
            drawApi.restore();
        },
        // 画一条直线
        drawOneLine: function (drawApi, ax, ay, tx, ty, lineWidth, color) {
            drawApi.save();
            drawApi.beginPath();
            drawApi.strokeStyle = color;
            drawApi.lineWidth = lineWidth;
            drawApi.moveTo(ax, ay);
            drawApi.lineTo(tx, ty);
            drawApi.closePath();
            drawApi.stroke();
            drawApi.restore();
        },
        // 获取transform数值
        transfromToNumber: function (o) {
            var reg2 = /\-?[0-9]+\.?[0-9]*/g;
            var arr = o.style.webkitTransform.match(reg2);
            return arr;
        },
        // 获取伸缩比例
        getScaleInterval: function (range, unitScale, flag) {
            var num = (range[1] - range[0]) / unitScale;
            var idx = 1;
            var a = flag;
            while (num > a) {
                idx++;
                a = flag * idx;
            }
            return idx * unitScale;
        },
        getMaxAndMinAndLength: function (data) {
            var min = 0, max = 0, length = 0;
            max = min = parseFloat(data[0][0]);
            for (var idx in data) {
                if (data.hasOwnProperty(idx)) {
                    var arr = data[idx];
                    var n = 0;
                    for (var i in arr) {
                        if (arr.hasOwnProperty(i)) {
                            n++;
                            var num = Math.round(arr[i] / 1000) * 1000;
                            if (max < num) {
                                max = num;
                            }
                            if (min > num) {
                                min = num;
                            }
                        }
                    }
                    if (n > length)length = n;
                }
            }
            return [min, max, length];
        },
        getMaxAndMin: function (arr) {
            var max = 0, min = 0;
            max = min = arr[0];
            for (var i in arr) {
                if (max < arr[i]) {
                    max = arr[i];
                }
                if (min > arr[i]) {
                    min = arr[i];
                }
            }
            return [min, max];
        },
        getMinScale: function (range, interval) {
            var a = range[0];
            var idx = 0;
            var bs = 3;
            while (range[1] > a) {
                idx += 2;
                bs++;
                a = range[0] + interval * idx;
            }
            return range[0] + (idx - bs) * interval;
        },
        getPoint: function (ay, height, interval) {
            return height - (ay * height / 6) / interval - height / 12;
        }
    };
    // 单线类
    var LineCon = function (drawApi, height, interval, xSpace, data, color, minScale, main, estimate) {
        this.drawApi = drawApi;
        this.main = main;
        this.height = height;
        this.interval = interval;
        this.xSpace = xSpace;
        this.data = data;
        this.minScale = minScale;
        this.color = color;
        this.nowData = [];
        this.dotData = [];
        this.txtData = [];
        this.range = util.getMaxAndMin(this.data);
        this.moveX = 0;
        this.stmt = estimate;
    };
    LineCon.prototype = {
        draw: function () {
            var obj = null;
            var idx;
            for (idx in this.nowData) {
                if (this.nowData.hasOwnProperty(idx)) {
                    obj = this.nowData[idx];
                    util.drawOneLine(this.drawApi, obj.ax, obj.ay, obj.tx, obj.ty, 1, this.color);
                }
            }
            if (this.main) {
                for (idx in this.dotData) {
                    if (this.dotData.hasOwnProperty(idx)) {
                        obj = this.dotData[idx];
                        util.drawPoint(this.drawApi, obj.ax, obj.ay, 3, this.color);
                    }
//                for(idx in this.txtData){
//                    obj=this.txtData[idx];
//                    util.drawTxt(this.drawApi,obj.ax,obj.ay,obj.txt,"10px Arial","left","bottom",this.color);
//                }
                }
            }
        },
        init: function () {
            var l = this.data.length;
            for (var i = 0; i < l; i++) {
                // 当数据大于22个月之后,要用虚线显示预测
                if (i === l - 2 && this.stmt) {
                    var mx = this.moveX;
                    var spaceNum = 16;
                    var DRAW_SPEED = this.xSpace / spaceNum;
                    var baseDot = this.data[i] - this.minScale;
                    // 一段数据曲线的基准数据，即线左端点处数据值
                    var minSpace = Math.floor((this.data[i + 1] - this.data[i]) / this.xSpace);
                    // 运动间隔单位刻度，即一段数据曲线的刻度/像素
                    for (var j = 0; j < spaceNum; j++) {
                        if (j % 2 === 0) {
                            var ay = baseDot + minSpace * j * DRAW_SPEED;
                            // 前一点位置
                            var ty = baseDot + minSpace * (j + 1) * DRAW_SPEED;
                            // 后一点位置
                            this.nowData.push({
                                ax: mx,
                                ay: util.getPoint(ay, this.height, this.interval),
                                tx: mx + DRAW_SPEED,
                                ty: util.getPoint(ty, this.height, this.interval)
                            });
                        }
                        mx += DRAW_SPEED;
                    }
                } else {
                    this.nowData.push({
                        ax: this.moveX,
                        ay: util.getPoint(this.data[i] - this.minScale, this.height, this.interval),
                        tx: this.moveX + this.xSpace,
                        ty: util.getPoint(this.data[i + 1] - this.minScale, this.height, this.interval)
                    });
                }
                this.moveX += this.xSpace;
                // this.txtData.push({"ax":this.xSpace*i,"ay":util.getPoint(this.data[i]-this.minScale,this.height,this.interval),"txt":this.data[i]});
                // this.dotData.push({"ax":this.moveX-this.xSpace,"ay":util.getPoint(this.data[i]-this.minScale,this.height,this.interval)});
                if (this.main) {
                    // this.txtData.push({"ax":this.xSpace*i,"ay":util.getPoint(this.data[i]-this.minScale,this.height,this.interval),"txt":this.data[i]});
                    this.dotData.push({
                        ax: this.moveX - this.xSpace,
                        ay: util.getPoint(this.data[i] - this.minScale, this.height, this.interval)
                    });
                }
            }
        }
    };
    function Chart(id, scale, scrollNum, obj, month) {
        var move = 0,
            firstDotX = 0,
            firstDot = 0,
            flag = 5,
            SCALE_NUM = 6,
            canTouch = false,
            MONTH_HEIGHT = 30,
            // CANVAS_RIGHT_SPACE = 20,
            CANVAS_LEFT_SPACE = 20,
            upSpace = 20,
            downSpace = 30,
            // rightSpace = 50,
            // rightTxtSpace = 45,
            rightL = 0,
            showWidth = 0;
        var showL = -CANVAS_LEFT_SPACE;
        var scroll = scrollNum;
        var monthData = month;
        var unitScale = scale;
        var data = [];
        for (var str in obj) {
            if (obj.hasOwnProperty(str)) {
                data.push(obj[str].arr);
            }
        }
        var range = util.getMaxAndMinAndLength(data);
        var monthNum = monthData.length;
        var interval = util.getScaleInterval(range, unitScale, flag);
        var minScale = util.getMinScale(range, interval);
        var con = document.getElementById(id);
        var conWidth = con.offsetWidth;
        var xSpace = Math.floor(conWidth / 7);
        var w = xSpace * monthNum;
        var onCanvas = create('canvas', {width: conWidth, height: con.offsetHeight});
        var canvas = create('canvas', {
            styles: {webkitTransform: 'translateX(0px)'},
            width: w,
            height: con.offsetHeight - downSpace
        });
        var height = canvas.height - MONTH_HEIGHT - upSpace;
        var width = xSpace * (monthNum - 1);
        window.removeEventListener('scroll', scrollRun);
        window.removeEventListener('orientationchange', orientationchangeBack);
        canvas.removeEventListener('touchstart', touchStart);
        canvas.removeEventListener('touchmove', touchMove);
        canvas.removeEventListener('touchend', touchEnd);
        canvas.addEventListener('scroll', scrollRun);
        canvas.addEventListener('touchstart', touchStart);
        canvas.addEventListener('touchmove', touchMove);
        canvas.addEventListener('touchend', touchEnd);
        window.addEventListener('orientationchange', orientationchangeBack);
        var drawApi = canvas.getContext('2d');
        var lineArr = [];
        for (var idx in obj) {
            if (obj.hasOwnProperty(idx)) {
                var lc = new LineCon(drawApi, height, interval, xSpace, obj[idx].arr, obj[idx].color, minScale, obj[idx].showPoint, obj[idx].estimate);
                lc.init();
                lineArr.push(lc);
            }
        }
        init();
        function orientationchangeBack() {
            setTimeout(function () {
                con.innerHTML = '';
                Chart(id, scale, scroll, obj, month);
            }, 300);
        }

        function init() {
            var i;
            var drawA = onCanvas.getContext('2d');
            for (i = 0; i < SCALE_NUM; i++) {
                var ss = util.measureText(drawA, String(minScale + (SCALE_NUM - i - 1) * interval)) + 5;
                if (ss > rightL) {
                    rightL = ss;
                }
            }
            showWidth = conWidth - rightL;
            var chartCvsCon = create('div', {
                styles: {
                    width: showWidth + 'px',
                    overflow: 'hidden',
                    webkitTransform: 'translateX(0px)',
                    position: 'absolute',
                    left: 0,
                    top: 0
                }
            });
            chartCvsCon.appendChild(canvas);
            con.appendChild(chartCvsCon);
            con.appendChild(onCanvas);
//            util.drawTxt(drawA, onCanvas.width-rightL,0,"","10px Arial","left","top");
            for (i = 0; i < SCALE_NUM; i++) {
                util.drawOneLine(drawA, onCanvas.width - (rightL + 5),
                    upSpace + height / 12 + i * height / 6, onCanvas.width - rightL,
                    upSpace + height / 12 + i * height / 6, 1, '#d2d2d2');
                util.drawTxt(drawA, onCanvas.width - rightL,
                    upSpace + height / 12 + i * height / 6,
                    minScale + (SCALE_NUM - i - 1) * interval, '10px Arial', 'left', 'middle', '#999');
            }
            var l = data.length;
            var arr = [];
            var str = '';
            for (i = 0; i < l; i++) {
                var ob = [];
                var s = '■' + obj[i].name + '              ';
                ob.push(s);
                str += s;
                ob.push(util.measureText(drawA, str));
                arr.push(ob);
            }
            var w = arr[l - 1][1];
            var startPointX = (onCanvas.width - w) / 2;
            for (i = 0; i < l; i++) {
                util.drawTxt(drawA, startPointX + (i > 0 ? arr[i - 1][1] : 0),
                    onCanvas.height - downSpace, arr[i][0], '12px Arial', 'left', 'top', obj[i].color);
            }
            // util.drawTxt(drawA,onCanvas.width/2,onCanvas.height-downSpace/2,'更新时间2014年7月 fang.com','10px Arial','center','top','#cba');
            util.drawOneLine(drawA, 0, height + upSpace, onCanvas.width - rightL, height + upSpace, 2, '#d2d2d2');
            util.drawOneLine(drawA, onCanvas.width - rightL, upSpace, onCanvas.width - rightL, height + upSpace, 2, '#d2d2d2');
            scrollRun();
        }

        function scrollRun() {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            if (top >= scroll) {
                window.removeEventListener('scroll', scrollRun);
                loopDraw();
            }
        }

        function drawGridAndShow() {
            util.drawOneLine(drawApi, width, 0, width, height, 1, '#d2d2d2');
            for (var i = 0; i < xSpace * monthNum; i += xSpace) {
                util.drawOneLine(drawApi, i, 0, i, height, 1, '#d2d2d2');
                util.drawTxt(drawApi, i, height + 10, monthData[i / xSpace], '10px Arial', 'center', 'top', '#999');
            }
        }

        var jump = true;
        var stFlag;

        function touchStart(e) {
            jump = true;
            stFlag = setTimeout(function () {
                jump = false;
            }, 200);
            if (canTouch) {
                var leftMove = util.transfromToNumber(canvas);
                firstDot = e.touches[0].pageX;
                firstDotX = firstDot - leftMove[0];
            }
            e.preventDefault();
            e.stopPropagation();
        }

        function touchMove(e) {
            if (canTouch) {
                var ax = e.touches[0].pageX;
                var num = ax - firstDotX;
                if (num >= 0) {
                    num = 0;
                } else if (num <= showWidth - canvas.width) {
                    num = showWidth - canvas.width;
                }
                canvas.style.webkitTransform = 'translateX(' + num + 'px)';
            }
            e.preventDefault();
            e.stopPropagation();
        }

        function touchEnd(e) {
            if (jump) {
                if (stFlag)clearTimeout(stFlag);
                if (con.parentNode && con.parentNode.parentNode && con.parentNode.parentNode.href) {
                    window.location.href = con.parentNode.parentNode.href;
                }
            }
            e.preventDefault();
            e.stopPropagation();
        }

        function loopDraw() {
            showL += 10;
            if (showL <= showWidth) {
                drawApi.save();
                drawApi.clearRect(0, 0, canvas.width, canvas.height);
                drawApi.translate(CANVAS_LEFT_SPACE, upSpace);
                drawGridAndShow();
                for (var i = lineArr.length - 1; i >= 0; i--) {
                    lineArr[i].draw();
                }
                var l = showWidth - (showL + 10);
                if (l <= 0) {
                    l = 0;
                } else {
                    drawApi.clearRect(showL, -upSpace, l, canvas.height);
                }
                drawApi.restore();
            } else if (showWidth - canvas.width >= 0) {
                canvas.style.webkitTransform = 'translateX(' + 0 + 'px)';
                canTouch = true;
                return;
            } else if (move <= showWidth - canvas.width) {
                canvas.style.webkitTransform = 'translateX(' + showWidth - canvas.width + 'px)';
                canTouch = true;
                return;
            } else {
                var ease = Math.abs(showWidth - canvas.width - move) * 0.05;
                // 缓动公式，缓动系数为0.05
                if (ease < 0.05)ease = 0.05;
                move -= ease;
                canvas.style.webkitTransform = 'translateX(' + Math.round(move) + 'px)';
            }
            setTimeout(loopDraw, 10);
        }
    }

    // 工具:创建新元素
    function create(tagName, attr) {
        var element = null;
        if (typeof tagName === 'string') {
            element = document.createElement(tagName);
            if (typeof attr === 'object') {
                var keyAttr, keyStyle;
                for (keyAttr in attr) {
                    if (keyAttr === 'styles' && typeof attr[keyAttr] === 'object') {
                        // 样式们
                        for (keyStyle in attr[keyAttr]) {
                            if (attr[keyAttr].hasOwnProperty(keyStyle)) {
                                element.style[keyStyle] = attr[keyAttr][keyStyle];
                                if (keyStyle === 'opacity' && window.innerWidth + '' === 'undefined') {
                                    element.style.filter = 'alpha(opacity=' + attr[keyAttr][keyStyle] * 100 + ')';
                                }
                            }
                        }
                    } else {
                        if (keyAttr === 'class') {
                            keyAttr = 'className';
                        }
                        element[keyAttr] = attr[keyAttr];
                    }
                }
            }
        }
        return element;
    }

    return Chart;
});