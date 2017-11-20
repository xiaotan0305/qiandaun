/**
 * canvas直线变化效果图js
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    if (typeof define === "function") {
        define("chart/line/1.0.0/line", [], function () {
            return f(w);
        });
    } else if (typeof exports === "object") {
        module.exports = f(w);
    } else {
        window.Line = f(w);
    }
})(window, function factory(w) {
    var $ = window.jQuery;
    //画图类
    var util = {
        drawClear: function (drawApi, w, h) {
            drawApi.clearRect(0, 0, w, h);
        },
        //画文字
        drawTxt: function (drawApi, ax, ay, str, font, textAlign, textBaseline, color) {
            drawApi.save();
            drawApi.font = font;
            drawApi.textAlign = textAlign;
            drawApi.textBaseline = textBaseline;
            drawApi.fillStyle = color;
            drawApi.fillText(str, ax, ay);
            drawApi.restore();
        },
        //画点
        drawPoint: function (drawApi, tx, ty, radius, color) {
            drawApi.save();
            drawApi.beginPath();
            drawApi.fillStyle = color;
            drawApi.arc(tx, ty, radius, 0, Math.PI * 2, true);
            drawApi.closePath();
            drawApi.fill();
            drawApi.restore();
        },
        //画一条直线
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
    var PointClass = function (x, y, value, isIcon) {
        this.x = x;
        this.y = y;
        this.isIcon = isIcon;
        this.value = value;
    }
    var DrawLineClass = function (pArr, part) {
        this.pArr = pArr;
        this.part = part;
        this.drawArr = [];
        this.index = 0;
        this.step = 0;
        this.over = false;
        this.start = null;
        this.end = null;
        this._init();
    }
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
            if (this.drawArr.length == 1) {
                this.drawArr.push(new PointClass(stepX, stepY));
            } else {
                this.drawArr[this.drawArr.length - 1] = new PointClass(stepX, stepY);
            }
            if (this.step % this.part == 0) {
                this.step = 0;
                this.index++;
                if (this.index == this.pArr.length - 1) {
                    this.over = true;
                    return;
                }
                this._init();
            }
        },
        complete: function () {
            this.drawArr = this.pArr;
            this.index = this.pArr.length - 1;
            this.over = true;
        }
    }
    function getRate(data, h, per, part) {
        var l = data.length;
        var max = min = parseInt(data[0]["value"]);
        for (var i = 1; i < l; i++) {
            if (max < parseInt(data[i]["value"])) {
                max = parseInt(data[i]["value"]);
            }
            if (min > parseInt(data[i]["value"])) {
                min = parseInt(data[i]["value"]);
            }
        }
        var r=max-min;
        if(r<=0){
            r=1;
        }
        return {rate: (h * per) / r, min: min};
    }

    function line(ops) {
        this.options = {
            id: "#line",
            h: 300,
            w: 640,
            part: 10,
            per: 0.6,
            border: 40,
            linePx: 4,
            pointRadis: 8,
            downTextH: 50,
            textUpSp: 10,
            width: "100%",
            height: "200px",
            textColor: "#000",
            lineColor: "#f00",
            pointColor: "#f00",
            bgLineColor: "#ccc",
            icon: {
                url: "#icon",
                w: 25,
                h: 25
            },
            data: [
                {
                    name: "a",
                    value: 40000
                },
                {
                    name: "b",
                    value: 30000
                },
                {
                    name: "c",
                    value: 18000
                },
                {
                    name: "d",
                    value: 21000
                },
                {
                    name: "e",
                    value: 10000
                },
                {
                    name: "f",
                    value: 55500,
                    icon: true
                }
            ]
        }
        for (var i in ops) {
            this.options[i] = ops[i];
        }
        this.con = $(this.options.id);
        this.cvs = $("<canvas></canvas>");
        this.drawApi = this.cvs[0].getContext("2d");
        this.drawLineClass = null;
        this.pointArr = [];
        this.isOprera=false;
        this._init();
    }

    line.prototype = {
        _init: function () {
            var UA = window.navigator.userAgent.toLowerCase();
            if (/opr/.test(UA)||/miuiyellowpage/.test(UA)){
                p=UA.indexOf('android');
                if(p!=-1){
                    var s = UA.substr(p + 8, 3).split(".");
                    if(parseFloat(s[0] + s[1]) < 42){
                        this.isOprera=true;
                    }
                }
            }
            this.cvs[0].width = this.options.w;
            this.cvs[0].height = this.options.h + this.options.downTextH;
            this.cvs.css("width", this.options.width);
            this.cvs.css("height", this.options.height);
            var drawData = getRate(this.options.data, this.options.h, this.options.per);
            var l = this.options.data.length;
            var space = (this.options.w - this.options.border * 2) / (l - 1);
            for (var i = 0; i < l; i++) {
                var p = new PointClass(this.options.border + i * space, this.options.h - parseInt(this.options.data[i]["value"] - drawData.min) * drawData.rate - this.options.h * 0.1, this.options.data[i]["value"], this.options.data[i]["icon"]);
                this.pointArr.push(p);
                util.drawTxt(this.drawApi, this.options.border + i * space, this.options.h + this.options.textUpSp, this.options.data[i]["name"], "24px Arial", "center", "top", this.options.textColor);
            }
            this.drawLineClass = new DrawLineClass(this.pointArr, this.options.part);
            this.drawBg(this.pointArr);
            this.con.append(this.cvs);
        },
        run: function () {
            var th = this;
            window.requestAnimationFrame(function () {
                th.animation();
            });
        },
        complete: function () {
            this.drawLineClass.complete();
            this.drawBg(this.pointArr);
            this.drawLine(this.drawLineClass.drawArr);
            this.drawNum(this.drawLineClass.index, this.pointArr);
        },
        animation: function () {
            util.drawClear(this.drawApi, this.options.w, this.options.h);
            this.drawLineClass.add();
            this.drawBg(this.pointArr);
            this.drawLine(this.drawLineClass.drawArr);
            this.drawNum(this.drawLineClass.index, this.pointArr);
            if(this.isOprera){
                this.cvs.detach();
                this.con.append(this.cvs);
            }
            if (!this.drawLineClass.over) {
                this.run();
            }
        },
        drawBg: function (arr) {
            util.drawOneLine(this.drawApi, 0, this.options.h, this.options.w, this.options.h, 1, this.options.bgLineColor);
            for (var i in arr) {
                var p = arr[i];
                util.drawOneLine(this.drawApi, p.x, 0, p.x, this.options.h, 1, this.options.bgLineColor);
            }
        },
        drawLine: function (arr) {
            var l = arr.length;
            for (var i = 0; i < l - 1; i++) {
                util.drawOneLine(this.drawApi, arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, this.options.linePx, this.options.lineColor);
            }
        },
        drawNum: function (idx, arr) {
            var l = arr.length;
            for (var i = 0; i <= idx; i++) {
                var p = arr[i];
                if (p.isIcon) {
                    this.drawApi.drawImage($(this.options.icon.url)[0], p.x - this.options.icon.w / 2, p.y - this.options.icon.h / 2, this.options.icon.w, this.options.icon.h);
                } else {
                    util.drawPoint(this.drawApi, p.x, p.y, this.options.pointRadis, this.options.pointColor);
                }
                util.drawTxt(this.drawApi, p.x, p.y - this.options.pointRadis, p.value, "24px Arial", "center", "bottom", this.options.textColor);
            }
        }
    }
    return line;
});