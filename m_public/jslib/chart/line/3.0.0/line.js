/**
 * canvas直线变化效果图js
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    if (typeof define === "function") {
        define("chart/line/3.0.0/line", [], function () {
            return f(w);
        });
    } else if (typeof exports === "object") {
        module.exports = f(w);
    } else {
        window.Line = f(w);
    }
})(window, function (w) {
    var $ = w.jQuery;

    function PointClass(x, y) {
        this.x = x;
        this.y = y;
    }

    function DrawLineClass(dataArr, opt, drawApi) {
        this.dataArr = dataArr;
        this.drawApi = drawApi;
        this.pArr = [];
        this.opt = opt;
        this.drawArr = [];
        this.index = 0;
        this.loop = 0;
        this.maxValue = 1;
        this.over = false;
        this.start = null;
        this.end = null;
        this.init();
    }

    DrawLineClass.prototype = {
        init: function () {
            var that = this;
            if (that.dataArr.length == 1) {
                this.drawArr.push(new PointClass());
                return;
            }
            var l = that.dataArr.length;
            for (var i = 0; i < l; i++) {
                if (that.maxValue < parseFloat(that.dataArr[i][that.opt.charNameObj.value])) {
                    that.maxValue = parseFloat(that.dataArr[i][that.opt.charNameObj.value]);
                }
            }
            var s = that.maxValue.toString().split(".")[0];
            l = s.length;
            var head = (parseInt(s.charAt(0)) + 1).toString();
            for (i = 1; i < l; i++) {
                head += "0";
            }
            that.maxValue = parseInt(head);
            that.drawApi.save();
            that.drawApi.font = that.opt.leftfontSize + that.opt.fontFamily;
            that.textWidth = that.drawApi.measureText(head).width;
            that.textWidth += that.opt.border * 2;
            that.drawApi.restore();
            l = that.dataArr.length;
            var w = Math.floor((that.opt.width * 2 - that.textWidth - that.opt.lineBorder * 2) / (l-1));
            for (i = 0; i < l; i++) {
                that.pArr.push(new PointClass(that.textWidth + that.opt.lineBorder + i * w, (that.opt.portHeight * that.opt.space) * (1 - (parseFloat(that.dataArr[i][that.opt.charNameObj.value]) / that.maxValue)) + that.opt.portHeight / 2));
            }
            that.setTo();
        },
        setTo: function () {
            var that = this;
            that.start = that.pArr[that.index];
            that.end = that.pArr[that.index + 1];
            that.drawArr.splice(that.drawArr.length - 1, 0, that.start);
        },
        add: function () {
            var that = this;
            that.loop++;
            var stepX = that.start.x + (that.end.x - that.start.x) * (that.loop / that.opt.steps);
            var stepY = that.start.y + (that.end.y - that.start.y) * (that.loop / that.opt.steps);
            if (that.drawArr.length == 1) {
                that.drawArr.push(new PointClass(stepX, stepY));
            } else {
                that.drawArr[that.drawArr.length - 1] = new PointClass(stepX, stepY);
            }
            if (that.loop % that.opt.steps == 0) {
                that.loop = 0;
                that.index++;
                if (that.index == that.pArr.length - 1) {
                    that.over = true;
                    return;
                }
                that.setTo();
            }
        }
    };
    function line(opt) {
        this.options = {
            id: "#line",
            height: 300,
            width: 640,
            steps: 10,
            linePx: 4,
            space: 5,
            border: 10,
            leftfontSize: "24px",
            fontFamily: " Arial",
            leftFontColor: "#000",
            lineColor: "#4f81bd",
            lineBorder: 10,
            bgLineColor: "#333",
            showTitle: "深圳",
            charNameObj:{"name":"name","value":"value"},
            dataArr: [
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
                    value: 55500
                },{
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
                    value: 55500
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
            that.con.css({"overflow": "visible", "transform": "translateZ(0)", "-webkit-transform": "translateZ(0)"});
            that.cvs = $("<canvas></canvas>");
            that.drawApi = this.cvs[0].getContext("2d");
            that.drawLineClass = null;
            that.pointArr = [];
            that.isOprera = false;
            var UA = w.navigator.userAgent.toLowerCase();
            if (/opr/.test(UA) || /miuiyellowpage/.test(UA)) {
                var p = UA.indexOf('android');
                if (p != -1) {
                    var s = UA.substr(p + 8, 3).split(".");
                    if (parseFloat(s[0] + s[1]) < 42) {
                        that.isOprera = true;
                    }
                }
            }
            that.cvs[0].width = that.options.width * 2;
            that.cvs[0].height = that.options.height * 2;
            that.options.portHeight = Math.floor(that.cvs[0].height / (that.options.space + 2));//一共有6条线，并且要给最下面的说明留下一个空位
            that.cvs.css("width", that.options.width + "px");
            that.cvs.css("height", that.options.height + "px");
            that.fillData(that.options.dataArr);
            that.con.append(that.cvs);
        },
        fillData: function (arr) {
            this.drawLineClass = new DrawLineClass(arr, this.options, this.drawApi);
        },
        run: function () {
            var th = this;
            w.requestAnimationFrame(function () {
                th.animation();
            });
        },
        animation: function () {
            var that = this;
            that.drawApi.clearRect(0, 0, that.cvs[0].width, that.cvs[0].height);
            that.drawLineClass.add();
            that.drawBg(that.drawLineClass);
            that.drawLine(that.drawLineClass.drawArr);
            if (that.isOprera) {
                that.cvs.detach();
                that.con.append(that.cvs);
            }
            if (!that.drawLineClass.over) {
                that.run();
            }
        },
        drawBg: function (dlc) {
            var that = this;
            that.drawApi.save();
            that.drawApi.font = that.options.leftfontSize + that.options.fontFamily;
            that.drawApi.textAlign = "right";
            that.drawApi.textBaseline = "middle";
            that.drawApi.fillStyle = that.options.leftFontColor;
            for (var i = 0; i <= that.options.space; i++) {
                var y = that.options.portHeight * (that.options.space - i) + that.options.portHeight / 2;
                that.drawApi.fillText((Math.floor(i * dlc.maxValue / that.options.space)).toString(), dlc.textWidth - that.options.border, y);
                that.drawApi.save();
                that.drawApi.strokeStyle = that.options.bgLineColor;
                that.drawApi.beginPath();
                that.drawApi.moveTo(dlc.textWidth, y);
                that.drawApi.lineTo(that.options.width * 2, y);
                that.drawApi.stroke();
                that.drawApi.restore();
            }
            that.drawApi.save();
            that.drawApi.textAlign = "left";
            that.drawApi.textBaseline = "middle";
            that.drawApi.fillText(that.options.showTitle, that.options.width, that.options.portHeight * (that.options.space + 1) + that.options.portHeight / 2);
            that.drawApi.restore();
            that.drawApi.save();
            that.drawApi.strokeStyle = that.options.lineColor;
            that.drawApi.lineWidth = that.options.linePx;
            that.drawApi.beginPath();
            that.drawApi.moveTo(that.options.width, that.options.portHeight * (that.options.space + 1) + that.options.portHeight / 2);
            that.drawApi.lineTo(that.options.width - 40, that.options.portHeight * (that.options.space + 1) + that.options.portHeight / 2);
            that.drawApi.stroke();
            that.drawApi.restore();
            that.drawApi.restore();
        },
        drawLine: function (arr) {
            var that = this;
            that.drawApi.save();
            that.drawApi.strokeStyle = that.options.lineColor;
            that.drawApi.lineWidth = that.options.linePx;
            var l = arr.length;
            for (var i = 0; i < l - 1; i++) {
                that.drawApi.beginPath();
                that.drawApi.moveTo(arr[i].x, arr[i].y);
                that.drawApi.lineTo(arr[i + 1].x, arr[i + 1].y);
                that.drawApi.stroke();
            }
            that.drawApi.restore();
        }
    };
    return line;
});