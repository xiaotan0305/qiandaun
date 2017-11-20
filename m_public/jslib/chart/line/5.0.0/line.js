/**
 * canvas直线变化效果图js
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    if (typeof define === "function") {
        define("chart/line/5.0.0/line", [], function () {
            return f(w);
        });
    } else if (typeof exports === "object") {
        module.exports = f(w);
    } else {
        window.Line5 = f(w);
    }
})(window, function (w) {
    var $ = w.jQuery;
    if (!$) {
        console.log("没有引入jquery或者该js文件引入位置在jquery引入之前!");
    }
    var now = new Date();

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
        //外部数据数组
        this.dataArr = dataArr;
        //画图api
        this.drawApi = drawApi;
        //点坐标数组
        this.pArr = [];
        //外部参数
        this.opt = opt;
        //图表区域的宽度
        this.unitWidth = 0;
        //剪裁的宽度，用来绘制动画
        this.clipWidth = 0;
        //步数
        this.loop = 0;
        //最大刻度
        this.fullScale = 1;
        //数据最大值
        this.max = 0;
        //数据最小值
        this.min = 0;
        //动画停止标识
        this.over = false;
        this.init();
    };
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
            that.max = that.min = parseFloat(that.dataArr[0][that.opt.charNameObj.value]);
            that.maxAndMinPositionArr = [0, 0];
            for (; i < l; i++) {
                var name = that.dataArr[i][that.opt.charNameObj.name];
                var dateArr = name.split('.');
                //判断数据时间大于今日时间则不做比较
                if (parseInt(dateArr[0]) === parseInt(now.getMonth()) + 1 && parseInt(dateArr[1]) >= parseInt(now.getDate())) {
                    break;
                }
                var value = parseFloat(that.dataArr[i][that.opt.charNameObj.value]);
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
            var s = that.max.toString().split('.')[0];
            l = s.length;
            var head = (parseInt(s.charAt(0)) + 1).toString();
            for (i = 1; i < l; i++) {
                head += '0';
            }
            that.fullScale = parseInt(head);
            for (i = 0; i <= that.opt.scaleNumber; i++) {
                var val = String(i * that.fullScale / that.opt.scaleNumber).replace(/0000$/, '万');
                that.drawApi.save();
                that.drawApi.font = that.opt.leftFontSize + that.opt.fontFamily;
                if (that.textWidth === undefined || that.textWidth < that.drawApi.measureText(val).width) {
                    that.textWidth = that.drawApi.measureText(val).width;
                }
                that.drawApi.restore();
            }
            that.textWidth += that.opt.border * 2;
            //计算出最大刻度画在canvas上时的宽度
            //that.drawApi.save();
            //that.drawApi.font = that.opt.leftFontSize + that.opt.fontFamily;
            //that.textWidth = that.drawApi.measureText(head).width;
            //that.textWidth += that.opt.border * 2;
            //that.drawApi.restore();
            l = that.dataArr.length;
            // 算出图表区域的单位宽度
            that.unitWidth = (that.opt.width * 2 - that.textWidth - that.opt.rightBorder) / (l - 1);
            // that.unitWidth = (that.opt.width * 2 - that.textWidth - that.opt.rightBorder) / (l - 1);

            /**
             * 循环算出数据对应的点坐标
             */
            for (i = 0; i < l; i++) {
                that.pArr.push(new PointClass(that.textWidth + i * that.unitWidth,
                    that.opt.portHeight * that.opt.scaleNumber * (1 - parseFloat(that.dataArr[i][that.opt.charNameObj.value]) / that.fullScale) + that.opt.portHeight / 2));
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
    function line(opt) {
        this.options = {
            //绘制走势图的canvas容器ID
            id: "#line",
            //走势图的高度
            height: 240,
            //走势图的宽度
            width: 640,
            //执行的步数，这个数据表示动画执行多少次
            steps: 60,
            //走势图线的宽度
            linePx: 2,
            //需要多少刻度
            scaleNumber: 5,
            //左部字体间距
            border: 10,
            //字体库
            fontFamily: " Arial",
            //左侧字体大小
            leftFontSize: "24px",
            //左部字体颜色
            leftFontColor: "#ccc",
            //底部字体大小
            downFontSize: "24px",
            //底部字体颜色
            downFontColor: "#ccc",
            //最大值字体颜色
            maxFontColor: "#ff3d3d",
            //最小值字体颜色
            minFontColor: "#56b229",
            //线颜色
            lineColor: "#4477d5",
            //右侧空白间距
            rightBorder: 30,
            //点的半径
            pointRadius: 5,
            //下部字体左移多少距离
            downFontLeftMoveX: 25,
            //背景线颜色
            bgLineColor: "#ccc",
            //对象名称转换，这里的作用是，省去了后台数据键值不对应还要循环赋键值的问题
            charNameObj: {"name": "name", "value": "value", "show": 'isShow'},
            dataArr: [
                {
                    name: "7.24",
                    value: 40000
                },
                {
                    name: "7.25",
                    value: 30000
                },
                {
                    name: "7.26",
                    value: 18000
                },
                {
                    name: "7.27",
                    value: 21000
                },
                {
                    name: "7.28",
                    value: 10000
                },
                {
                    name: "8.21",
                    value: 55500
                }, {
                    name: "8.22",
                    value: 40000
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
            that.options.portHeight = Math.floor(that.cvs[0].height / (that.options.scaleNumber + 1));//一共有6条线，并且要给最下面的说明留下一个空位
            that.cvs.css("width", that.options.width + "px");
            that.cvs.css("height", that.options.height + "px");
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
            that.drawApi.textAlign = "right";
            that.drawApi.textBaseline = "top";
            that.drawApi.fillStyle = that.options.leftFontColor;
            //测试增加版本号
            //that.drawApi.save();
            //that.drawApi.font = that.options.leftFontSize + that.options.fontFamily;
            //that.drawApi.textAlign = "left";
            //that.drawApi.textBaseline = "top";
            //that.drawApi.fillStyle = that.options.leftFontColor;
            //that.drawApi.fillText('5.0.1', 0, 0);
            //that.drawApi.restore();
            for (var i = 0; i <= that.options.scaleNumber; i++) {
                var y = that.options.portHeight * (that.options.scaleNumber - i) + that.options.portHeight / 2;
                if (i !== 0) {
                    var value = (i * dlc.fullScale / that.options.scaleNumber).toString();
                    var str = value.replace(/0000$/, '万');
                    that.drawApi.fillText(str, dlc.textWidth - that.options.border, y);
                }
                that.drawApi.save();
                that.drawApi.strokeStyle = that.options.bgLineColor;
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
            var canDraw = true;
            for (var i = 0; i < l; i++) {
                var name = dlc.dataArr[i][that.options.charNameObj.name];
                var isShow = dlc.dataArr[i][that.options.charNameObj.show];
                if (isShow === '1') {
                    that.drawApi.save();
                    that.drawApi.strokeStyle = that.options.bgLineColor;
                    that.drawApi.beginPath();
                    that.drawApi.moveTo(dlc.textWidth + dlc.unitWidth * i, that.options.portHeight / 2);
                    that.drawApi.lineTo(dlc.textWidth + dlc.unitWidth * i, that.options.portHeight * that.options.scaleNumber + that.options.portHeight / 2);
                    that.drawApi.stroke();
                    that.drawApi.restore();
                    that.drawApi.save();
                    that.drawApi.font = that.options.downFontSize + that.options.fontFamily;
                    that.drawApi.textAlign = "left";
                    that.drawApi.textBaseline = "bottom";
                    that.drawApi.fillStyle = that.options.downFontColor;
                    that.drawApi.fillText(name, dlc.textWidth + dlc.unitWidth * i - that.options.downFontLeftMoveX, that.options.portHeight * (that.options.scaleNumber + 1));
                    that.drawApi.restore();
                }
                that.drawApi.save();
                that.drawApi.rect(0, 0, dlc.clipWidth, that.drawApi.canvas.height);
                that.drawApi.clip();
                if (i < l - 1) {
                    var nextName = dlc.dataArr[i + 1][that.options.charNameObj.name];
                    var dateArr = nextName.split('.');
                    if ((parseInt(dateArr[0]) < parseInt(now.getMonth()) + 1 || parseInt(dateArr[0]) === parseInt(now.getMonth()) + 1 && parseInt(dateArr[1]) < parseInt(now.getDate())) && canDraw) {
                        that.drawApi.strokeStyle = that.options.lineColor;
                        that.drawApi.lineWidth = that.options.linePx;
                        that.drawApi.beginPath();
                        that.drawApi.moveTo(dlc.pArr[i].x, dlc.pArr[i].y);
                        that.drawApi.lineTo(dlc.pArr[i + 1].x, dlc.pArr[i + 1].y);
                        that.drawApi.stroke();
                    }
                }
                dateArr = name.split('.');
                if (dateArr[0] === '12' && dateArr[1] === '30') {
                    canDraw = false;
                }
                var draw = false,
                    color = 0,
                    value = dlc.dataArr[i][that.options.charNameObj.value];
                if ((parseInt(dateArr[0]) < parseInt(now.getMonth()) + 1 || parseInt(dateArr[0]) === parseInt(now.getMonth()) + 1 && parseInt(dateArr[1]) < parseInt(now.getDate())) && canDraw) {
                    if (i === dlc.maxAndMinPositionArr[0] && Number(value) > 0) {
                        draw = true;
                        color = that.options.maxFontColor;
                    }
                    else if (i === dlc.maxAndMinPositionArr[1] && Number(value) > 0) {
                        draw = true;
                        color = that.options.minFontColor;
                    }
                    if (draw) {
                        that.drawApi.save();
                        that.drawApi.fillStyle = that.options.lineColor;
                        that.drawApi.beginPath();
                        that.drawApi.arc(dlc.pArr[i].x, dlc.pArr[i].y, that.options.pointRadius, 0, Math.PI * 2, true);
                        that.drawApi.closePath();
                        that.drawApi.fill();
                        that.drawApi.restore();
                        that.drawApi.save();
                        that.drawApi.font = "bold" + "26px" + that.options.fontFamily;
                        var textAlign = '';
                        if (dlc.pArr[i].x < (that.drawApi.canvas.width - dlc.textWidth - that.options.rightBorder) / 2) {
                            textAlign = 'left';
                        } else {
                            textAlign = 'right';
                        }
                        that.drawApi.textAlign = textAlign;
                        that.drawApi.textBaseline = "bottom";
                        that.drawApi.fillStyle = color;
                        that.drawApi.fillText(value, dlc.pArr[i].x, dlc.pArr[i].y - 5);
                        that.drawApi.restore();
                    }
                }
                that.drawApi.restore();
            }
        }
    };
    return line;
});