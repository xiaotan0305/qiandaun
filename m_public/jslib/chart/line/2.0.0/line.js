/**
 * canvas直线变化效果图js
 * by blue
 * @param {Object} w
 * @param {Object} f
 * modify by icy 2016.5.11
 * 轨迹线添加曲线功能，通过options.isCurve控制，true:曲线，false:直线，默认false
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/line/2.0.0/line', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        window.Line = f(w);
    }
})(window, function factory(w) {
    'use strict';
    var $ = window.jQuery;
    // 画图类
    var util = {
        drawClear: function (drawApi, w, h) {
            drawApi.clearRect(0, 0, w, h);
        },
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
        // 画一条贝塞尔曲线
        drawBezierCurve: function (drawApi, ax, ay, cpax, cpay, cpbx, cpby, tx, ty, lineWidth, color) {
            drawApi.save();
            drawApi.beginPath();
            drawApi.strokeStyle = color;
            drawApi.lineWidth = lineWidth;
            drawApi.moveTo(ax, ay);
            drawApi.bezierCurveTo(cpax, cpay, cpbx, cpby, tx, ty);
            drawApi.stroke();
            drawApi.restore();
        }
    };
    var PointClass = function (x, y, value, isIcon, sign) {
        this.x = x;
        this.y = y;
        this.isIcon = isIcon;
        this.value = value;
        this.sign = sign;
    };
    var DrawLineClass = function (pArr, part, pointColor, lineColor) {
        this.pArr = pArr;
        this.part = part;
        this.drawArr = [];
        this.index = 0;
        this.step = 0;
        this.over = false;
        this.start = null;
        this.end = null;
        this._init();
        this.pointColor = pointColor;
        this.lineColor = lineColor;
    };
    DrawLineClass.prototype = {
        _init: function () {
            this.start = this.pArr[this.index];
            this.end = this.pArr[this.index + 1];
            this.drawArr.splice(this.drawArr.length - 1, 0, this.start);
        },
        add: function () {
            this.step++;
            var stepX = this.start.x + (this.end.x - this.start.x) * (this.step / this.part);
            var stepY = this.start.y + (this.end.y - this.start.y) * (this.step / this.part);
            if (this.drawArr.length === 1) {
                this.drawArr.push(new PointClass(stepX, stepY));
            } else {
                this.drawArr[this.drawArr.length - 1] = new PointClass(stepX, stepY);
            }
            if (this.step % this.part === 0) {
                this.step = 0;
                this.index++;
                if (this.index === this.pArr.length - 1) {
                    this.over = true;
                    return;
                }
                this._init();
            }
        }
    };

    function getRate(data, h, per, part) {
        var l = data.length;
        var max, min;
        max = min = parseInt(data[0].value);
        for (var i = 1; i < l; i++) {
            if (max < parseInt(data[i].value)) {
                max = parseInt(data[i].value);
            }
            if (min > parseInt(data[i].value)) {
                min = parseInt(data[i].value);
            }
        }
        var r = max - min;
        if (r <= 0) r = 1;
        return {
            rate: h * per / r,
            min: min
        };
    }

    function line(ops) {
        this.options = {
            id: '#line',
            h: 300,
            w: 640,
            part: 10,
            per: 0.7,
            border: 40,
            linePx: 4,
            pointRadis: 8,
            downTextH: 50,
            textUpSp: 10,
            width: '100%',
            height: '200px',
            textColor: '#000',
            bgLineColor: '#ccc',
            unit: '',
            icon: {
                url: '#icon',
                w: 25,
                h: 25
            },
            lineArr: [{
                lineColor: '#f00',
                pointColor: '#f00',
                data: [{
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
            }],
            // 轨迹是否为曲线，默认false，直线
            isCurve: false
        };
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        this.con = $(this.options.id);
        this.cvs = $('<canvas></canvas>');
        this.drawApi = this.cvs[0].getContext('2d');
        this.drawLineClass = [];
        this.pointArr = [];
        this._init();
    }

    line.prototype = {
        _init: function () {
            var that = this;
            var j;
            that.cvs[0].width = that.options.w;
            that.cvs[0].height = that.options.h + that.options.downTextH;
            that.cvs.css('width', that.options.width);
            that.cvs.css('height', that.options.height);
            that.con.css({
                overflow: 'visible',
                '-webkit-transform': 'translateZ(0)',
                '-o-transform': 'translateZ(0)',
                '-ms-transform': 'translateZ(0)',
                transform: 'translateZ(0)'
            });
            var lineArr = that.options.lineArr,
                datal = lineArr.length,
                lineData = [];
            for (j = 0; j < datal; j++) {
                lineData = lineData.concat(lineArr[j].data);
            }
            var drawData = getRate(lineData, that.options.h, that.options.per);
            lineArr = that.txtPosition(lineArr, drawData);
            var maxl = 0;
            for (j = 0; j < datal; j++) {
                var perLine = lineArr[j];
                var l = perLine.data.length,
                    space = (that.options.w - that.options.border * 2) / (l - 1),
                    pointArr = [];
                if (l > maxl) {
                    maxl = l;
                }
                for (var i = 0; i < l; i++) {
                    var p = new PointClass(that.options.border + i * space,
                        that.options.h - parseInt(perLine.data[i].value - drawData.min) * drawData.rate - that.options.h * 0.1, perLine.data[i].value,
                        perLine.data[i].icon, perLine.data[i].sign);
                    pointArr.push(p);
                    util.drawTxt(that.drawApi, that.options.border + i * space, that.options.h + that.options.textUpSp,
                        lineArr[0].data[i].name, '24px Arial', 'center', 'top', '#ccc');
                }
                that.pointArr.push(pointArr);
                that.drawLineClass.push(new DrawLineClass(pointArr, that.options.part, perLine.pointColor, perLine.lineColor));
                this.con.append(that.cvs);
            }
            if (that.options.unit) {
                util.drawTxt(that.drawApi, that.cvs[0].width, that.options.h + that.options.textUpSp,
                    that.options.unit, '24px Arial', 'right', 'top', that.options.textColor);
            }
            that.drawBg(that.pointArr[0]);
        },
        run: function (scroll) {
            var that = this;
            if (scroll) {
                that.scroll = scroll;
            }
            window.requestAnimationFrame(function () {
                that.animation();
            });
        },
        animation: function () {
            var that = this,
                linel = that.drawLineClass.length,
                sign = true,
                i;
            for (i = 0; i < linel; i++) {
                if (!that.drawLineClass[i].over) {
                    sign = false;
                }
            }
            if (!sign) {
                util.drawClear(that.drawApi, that.options.w, that.options.h);
            }
            var over = '';
            for (i = 0; i < linel; i++) {
                if (that.drawLineClass[i].over) {
                    over += '1,';
                } else {
                    over += '0,';
                }
                var drawLineClass = that.drawLineClass[i];
                if (!drawLineClass.over) {
                    if (i === 0) {
                        that.drawBg(that.pointArr[0]);
                    }
                    drawLineClass.add();
                    that.drawLine(drawLineClass.drawArr, that.pointArr[i], drawLineClass.lineColor, scroll);
                    that.drawNum(drawLineClass.index, that.pointArr[i], drawLineClass.pointColor);
                }
            }
            var overArr = over.split(','),
                overArrl = overArr.length,
                overSign = true;
            for (i = 0; i < overArrl - 1; i++) {
                if ('0' === overArr[i]) {
                    overSign = false;
                }
            }
            if (!overSign) {
                that.run();
            }
        },
        txtPosition: function (arrs, drawData) {
            var arrl = arrs.length;
            if (arrl === 2 && arrs[0].data.length === arrs[1].data.length) {
                var obj0 = arrs[0].data,
                    obj1 = arrs[1].data,
                    l = arrs[0].data.length;
                for (var i = 0; i < l; i++) {
                    var o0 = obj0[i],
                        o1 = obj1[i];
                    //                     if(o0.name==o1.name){
                    if (o0.value > o1.value) {
                        o0.sign = 1;
                        if ((o0.value - o1.value) * drawData.rate > 24 + this.options.pointRadis * 2) {
                            o1.sign = 1;
                        } else {
                            o1.sign = -1;
                        }
                    } else if (o0.value < o1.value) {
                        o1.sign = 1;
                        if ((o1.value - o0.value) * drawData.rate > 24 + this.options.pointRadis * 2) {
                            o0.sign = 1;
                        } else {
                            o0.sign = -1;
                        }
                    } else {
                        o0.sign = 1;
                        o1.sign = -1;
                    }
                    //                     }
                }
            }
            return arrs;
        },
        scrollSign: false,
        drawBg: function (arr) {
            util.drawOneLine(this.drawApi, 0, this.options.h, this.options.w, this.options.h, 1, this.options.bgLineColor);
            for (var i in arr) {
                if (arr.hasOwnProperty(i)) {
                    var p = arr[i];
                    util.drawOneLine(this.drawApi, p.x, 0, p.x, this.options.h, 1, this.options.bgLineColor);
                }
            }
        },
        drawLine: function (arr, ps, lineColor, scroll) {
            var l = arr.length,
                that = this,
                w = this.con.width();
            for (var i = 0; i < l - 1; i++) {
                if (that.options.isCurve) {
                    var ctrlP = that.getCtrlPoint(ps, i);
                    util.drawBezierCurve(this.drawApi, arr[i].x, arr[i].y, ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x, ctrlP.pB.y, arr[i + 1].x, arr[i + 1].y, that.options.linePx, lineColor);
                } else {
                    util.drawOneLine(this.drawApi, arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, that.options.linePx, lineColor);
                }
                if (that.scroll && !that.scrollSign) {
                    if (arr[i + 1].x > w) {
                        that.scroll(w * 0.5);
                        that.scrollSign = true;
                    }
                }
            }
        },
        scroll: '',
        drawNum: function (idx, arr, pointColor) {
            var l = arr.length;
            for (var i = 0; i <= idx; i++) {
                var p = arr[i];
                if (p.isIcon) {
                    this.drawApi.drawImage($(this.options.icon.url)[0], p.x - this.options.icon.w / 2, p.y - this.options.icon.h / 2,
                        this.options.icon.w, this.options.icon.h);
                } else {
                    util.drawPoint(this.drawApi, p.x, p.y, this.options.pointRadis, pointColor);
                }
                if (i === l - 1) {
                    p.x -= 6;
                }
                if (p.sign) {
                    if (p.sign == 1) {
                        util.drawTxt(this.drawApi, p.x, p.y - this.options.pointRadis, p.value, '24px Arial', 'center', 'bottom', this.options.textColor);
                    } else {
                        util.drawTxt(this.drawApi, p.x, p.y + 4 * this.options.pointRadis, p.value, '24px Arial', 'center', 'bottom', this.options.textColor);
                    }
                } else {
                    util.drawTxt(this.drawApi, p.x, p.y - this.options.pointRadis, p.value, '24px Arial', 'center', 'bottom', this.options.textColor);
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
    return line;
});