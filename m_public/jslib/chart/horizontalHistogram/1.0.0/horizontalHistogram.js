/**
 * 横向柱状图（canvas实现）
 * Author by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/horizontalHistogram/1.0.0/horizontalHistogram', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        w.HorizontalHistogram1 = f(w);
    }
})(window, function (w) {
    'use strict';
    var $ = w.jQuery;
    if (!$) {
        console.log('没有引入jquery或者该js文件引入位置在jquery引入之前!');
    }
    function Block(arr, drawApi, opt) {
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

    Block.prototype = {
        init: function () {
            var i;
            var that = this;
            that.drawApi.save();
            that.drawApi.font = that.opt.leftfontSize + that.opt.fontFamily;
            var l = that.dataArr.length;
            for (i = 0; i < l; i++) {
                if (that.textWidth < that.drawApi.measureText(that.dataArr[i][that.opt.charNameObj.name]).width) {
                    that.textWidth = that.drawApi.measureText(that.dataArr[i][that.opt.charNameObj.name]).width;
                }
                if (that.maxValue < parseFloat(that.dataArr[i][that.opt.charNameObj.value])) {
                    that.maxValue = parseFloat(that.dataArr[i][that.opt.charNameObj.value]);
                }
            }
            that.textWidth += that.opt.border * 2;
            that.drawApi.restore();
            var s = that.maxValue.toString().split('.')[0];
            l = s.length;
            var head = (parseInt(s.charAt(0)) + 1).toString();
            for (i = 1; i < l; i++) {
                head += '0';
            }
            that.maxValue = parseInt(head);
        },
        add: function () {
            var that = this;
            that.addArr = [];
            that.loop++;
            var l = that.dataArr.length;
            for (var i = 0; i < l; i++) {
                var val = that.loop / that.opt.steps * (parseFloat(that.dataArr[i][that.opt.charNameObj.value]) / that.maxValue);
                that.addArr.push(val.toFixed(3));
            }
            if (that.loop >= that.opt.steps) {
                console.log('over');
                that.over = true;
            }
        }
    };
    function horizontalHistogram(opt) {
        this.options = {
            id: '#horizontalHistogram',
            width: 640,
            steps: 30,
            space: 5,
            leftfontSize: '24px',
            downfontSize: '16px',
            fontFamily: ' Arial',
            valueFontColor: '#000',
            leftFontColor: '#000',
            downFontColor: '#000',
            bgLineColor: '#aaa',
            border: 20,
            barHeight: 20,
            cityHeight: 50,
            downFontTop: 10,
            charNameObj: {name: 'name', value: 'value'},
            randomBarColorArr: ['#c3d69b', '#fac090', '#b7dee8'],
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
            that.con = $(that.options.id);
            that.con.css({overflow: 'visible', transform: 'translateZ(0)', '-webkit-transform': 'translateZ(0)'});
            that.cvs = $('<canvas></canvas>');
            that.drawApi = that.cvs[0].getContext('2d');

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
            that.cvs.css('width', that.options.width.toString() + 'px');
            that.fillData(that.options.dataArr);
            that.con.append(that.cvs);
        },
        fillData: function (dataArr) {
            var that = this;
            var l = dataArr.length;
            that.height = l * that.options.cityHeight + parseFloat(that.options.downfontSize) + that.options.downFontTop;
            that.cvs[0].height = that.height;
            that.cvs.css('height', that.height / 2 + 'px');
            that.block = new Block(dataArr, that.drawApi, that.options);
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
            that.block.add();
            that.drawBg(that.block);
            that.drawBar(that.block);
            if (that.isOprera) {
                that.cvs.detach();
                that.con.append(that.cvs);
            }
            if (!that.block.over) {
                that.run();
            }
        },
        drawBar: function (bk) {
            var that = this;
            that.drawApi.save();
            that.drawApi.font = that.options.leftfontSize + that.options.fontFamily;
            that.drawApi.textAlign = 'center';
            that.drawApi.textBaseline = 'middle';
            that.drawApi.fillStyle = that.options.leftFontColor;
            var dataArr = bk.dataArr;
            var addArr = bk.addArr;
            var l = addArr.length;
            for (var i = 0; i < l; i++) {
                that.drawApi.fillText(dataArr[i][that.options.charNameObj.name], bk.textWidth / 2, i * that.options.cityHeight + that.options.cityHeight / 2);
                that.drawApi.save();
                var barColor = dataArr[i].color ? dataArr[i].color : that.options.randomBarColorArr[i % that.options.randomBarColorArr.length];
                that.drawApi.fillStyle = barColor;
                that.drawApi.beginPath();
                var barW = addArr[i] * (that.cvs[0].width - bk.textWidth - that.options.border * 2);
                that.drawApi.fillRect(bk.textWidth, i * that.options.cityHeight + (that.options.cityHeight - that.options.barHeight) / 2,
                    barW, that.options.barHeight);
                that.drawApi.fill();
                that.drawApi.restore();
                that.drawApi.save();
                that.drawApi.font = that.options.downfontSize + that.options.fontFamily;
                var s = bk.textWidth + barW;
                if (parseFloat(that.drawApi.measureText(dataArr[i][that.options.charNameObj.name]).width) + 20 >= barW) {
                    that.drawApi.textAlign = 'left';
                    s += 10;
                } else {
                    that.drawApi.textAlign = 'right';
                    s -= 10;
                }
                that.drawApi.textBaseline = 'middle';
                that.drawApi.fillStyle = that.options.valueFontColor;
                that.drawApi.fillText(dataArr[i][that.options.charNameObj.value], s, i * that.options.cityHeight + that.options.cityHeight / 2);
                that.drawApi.restore();
            }
        },
        drawBg: function (bk) {
            var that = this;
            that.drawApi.save();
            that.drawApi.font = that.options.downfontSize + that.options.fontFamily;
            that.drawApi.textAlign = 'center';
            that.drawApi.textBaseline = 'top';
            that.drawApi.fillStyle = that.options.downFontColor;
            for (var i = 0; i <= that.options.space; i++) {
                that.drawApi.beginPath();
                that.drawApi.strokeStyle = that.options.bgLineColor;
                that.drawApi.moveTo(bk.textWidth + i * (that.cvs[0].width - bk.textWidth - that.options.border * 2) / that.options.space, 0);
                that.drawApi.lineTo(bk.textWidth + i * (that.cvs[0].width - bk.textWidth - that.options.border * 2) / that.options.space,
                    bk.dataArr.length * that.options.cityHeight);
                that.drawApi.stroke();
                that.drawApi.fillText((i * bk.maxValue / that.options.space).toString(),
                    bk.textWidth + i * (that.cvs[0].width - bk.textWidth - that.options.border * 2) / that.options.space,
                    bk.dataArr.length * that.options.cityHeight + that.options.downFontTop);
            }
            that.drawApi.restore();
        }
    };
    return horizontalHistogram;
});