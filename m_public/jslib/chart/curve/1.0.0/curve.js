/**
 * canvas曲线变化效果图js
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/curve/1.0.0/curve', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        window.Curve = f(w);
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
        // 测量文字宽度
        measureText: function (drawApi, font, str) {
            drawApi.save();
            drawApi.font = font;
            var tw = drawApi.measureText(str).width;
            drawApi.restore();
            return tw;
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
        }
    };
    var pointClass = function (x, y) {
        this.x = x;
        this.y = y;
    };
    var drawPointClass = function (my, s0, s1, sp, v0, v1) {
        this.my = my;
        this.s0 = s0;
        this.s1 = s1;
        this.sp = sp;
        this.v0 = v0;
        this.v1 = v1;
        this.num = -1;
        this.p0 = null;
        this.p1 = null;
        this.p2 = null;
        this.p3 = null;
        this.over = false;
        this._init();
    };
    drawPointClass.prototype = {
        _init: function () {
            var midX = (this.s1.x + this.s0.x) / 2;
            this.p0 = new pointClass(this.s0.x, this.my + (this.s0.y - this.my) * this.num / this.sp);
            this.p1 = new pointClass(midX, this.my + (this.s0.y - this.my) * this.num / this.sp);
            this.p2 = new pointClass(midX, this.my + (this.s1.y - this.my) * this.num / this.sp);
            this.p3 = new pointClass(this.s1.x, this.my + (this.s1.y - this.my) * this.num / this.sp);
        },
        add: function () {
            this.num++;
            if (this.num > this.sp) {
                this.over = true;
            } else {
                this._init();
            }
        }
    };
    function getRate(data, h, per,part) {
        var l = data.length;
        var max,min;
        max = min = parseInt(data[0].value);
        for (var i = 1; i < l; i++) {
            if (max < parseInt(data[i].value)) {
                max = parseInt(data[i].value);
            }
            if (min > parseInt(data[i].value)) {
                min = parseInt(data[i].value);
            }
        }
        return {rate: h * per / (max - min), midline: (max + min) / 2, min: min};
    }

    function curve(ops) {
        this.options = {
            id: '#curve',
            h: 300,
            w: 640,
            part: 50,
            per: 0.6,
            border: 40,
            downTextH: 50,
            width: '100%',
            height: '300px',
            textColor: '#000',
            lineColor: '#f00',
            pointColor: '#f00',
            fillColor: 'rgba(0,0,125,0.5)',
            bgLineColor: '#ccc',
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
                value: 55500
            }]
        };
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        this.con = $(this.options.id);
        this.cvs = $('<canvas></canvas>');
        this.drawApi = this.cvs[0].getContext('2d');
        this.pointArr = [];
        this._init();
    }

    curve.prototype = {
        _init: function () {
            var that = this;
            that.cvs[0].width = that.options.w;
            that.cvs[0].height = that.options.h + that.options.downTextH;
            that.cvs.css('width', that.options.width);
            that.cvs.css('height', that.options.height);
            var drawData = getRate(that.options.data, that.options.h, that.options.per);
            var l = that.options.data.length;
            var space = (that.options.w - that.options.border * 2) / (l - 1);
            // util.drawOneLine(that.drawApi,0,that.options.h-drawData.midline*drawData.rate,that.cvs[0].width,that.options.h-drawData.midline*drawData.rate,1,that.options.lineColor);
            for (var i = 0; i < l; i++) {
                if (that.options.data[i + 1]) {
                    var p = new drawPointClass(that.options.h - (drawData.midline - drawData.min) * drawData.rate,
                        new pointClass(that.options.border + i * space,
                            that.options.h - (parseInt(that.options.data[i].value) - drawData.min) * drawData.rate - 50),
                        new pointClass(that.options.border + (i + 1) * space,
                            that.options.h - (parseInt(that.options.data[i + 1].value) - drawData.min) * drawData.rate - 50),
                        that.options.part, i === 0 ? parseInt(that.options.data[i].value) : '', parseInt(that.options.data[i + 1].value));
                    that.pointArr.push(p);
                }
                util.drawTxt(that.drawApi, that.options.border + i * space, that.options.h,
                    that.options.data[i].name, '24px Arial', 'center', 'top', that.options.textColor);
            }
            that.drawBg(that.pointArr);
            that.drawBlock(that.pointArr);
            that.drawCurveAndPoint(that.pointArr);
            that.drawNum(that.pointArr);
            that.con.append(that.cvs);
        },
        run: function () {
            var that = this;
            window.requestAnimationFrame(function () {
                that.animation(that);
            });
        },
        animation: function (th) {
            util.drawClear(th.drawApi, th.options.w, th.options.h);
            var l = th.pointArr.length;
            var over = false;
            for (var i = 0; i < l; i++) {
                var p = th.pointArr[i];
                p.add();
                if (!p.over) {
                    over = true;
                }
            }
            th.drawBg(th.pointArr);
            th.drawBlock(th.pointArr);
            th.drawCurveAndPoint(th.pointArr);
            th.drawNum(th.pointArr);
            if (over) {
                th.run();
            }
        },
        drawBg: function (arr) {
            util.drawOneLine(this.drawApi, 0, this.options.h, this.options.w, this.options.h, 1, this.options.bgLineColor);
            for (var i in arr) {
                if (arr.hasOwnProperty(i)) {
                    var p = arr[i];
                    if (p.v0) {
                        util.drawOneLine(this.drawApi, p.p0.x, 0, p.p0.x, this.options.h, 1, this.options.bgLineColor);
                    }
                    util.drawOneLine(this.drawApi, p.p3.x, 0, p.p3.x, this.options.h, 1, this.options.bgLineColor);
                }
            }
        },
        drawBlock: function (arr) {
            var l = arr.length;
            var i;
            this.drawApi.save();
            this.drawApi.beginPath();
            this.drawApi.fillStyle = this.options.fillColor;
            this.drawApi.strokeStyle = this.options.fillColor;
            this.drawApi.moveTo(arr[0].p0.x, this.options.h);
            this.drawApi.lineTo(arr[0].p0.x, arr[0].p0.y);
            for (i = 0; i < l; i++) {
                var p = arr[i];
                this.drawApi.bezierCurveTo(p.p1.x, p.p1.y, p.p2.x, p.p2.y, p.p3.x, p.p3.y);
            }
            this.drawApi.lineTo(arr[i - 1].p3.x, this.options.h);
            this.drawApi.lineTo(arr[0].p0.x, this.options.h);
            this.drawApi.closePath();
            this.drawApi.fill();
            this.drawApi.restore();
        },
        drawCurveAndPoint: function (arr) {
            this.drawApi.save();
            this.drawApi.strokeStyle = this.options.lineColor;
            this.drawApi.lineWidth = 1;
            for (var i in arr) {
                if (arr.hasOwnProperty(i)) {
                    var p = arr[i];
                    if (p.v0) {
                        util.drawPoint(this.drawApi, p.p0.x, p.p0.y, 5, this.options.pointColor);
                        this.drawApi.moveTo(p.p0.x, p.p0.y);
                    }
                    this.drawApi.bezierCurveTo(p.p1.x, p.p1.y, p.p2.x, p.p2.y, p.p3.x, p.p3.y);
                    this.drawApi.stroke();
                    util.drawPoint(this.drawApi, p.p3.x, p.p3.y, 5, this.options.pointColor);
                }
            }
            this.drawApi.restore();
        },
        drawNum: function (arr) {
            for (var i in arr) {
                if (arr.hasOwnProperty(i)) {
                    var p = arr[i];
                    if (p.v0) {
                        util.drawTxt(this.drawApi, p.p0.x, p.p0.y, p.v0, '24px Arial', 'center', 'bottom', this.options.textColor);
                    }
                    util.drawTxt(this.drawApi, p.p3.x, p.p3.y, p.v1, '24px Arial', 'center', 'bottom', this.options.textColor);
                }
            }
        }
    };
    return curve;
});