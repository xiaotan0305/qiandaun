(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/pie/1.0.0/pie', ['chart/raf/1.0.0/raf'], function (require) {
            require('chart/raf/1.0.0/raf');
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        window.Pie = f(w);
    }
})(window, function factory(w) {
    'use strict';
    function arcClass(startAngle, endAngle, color) {
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.color = color;
    }

    function loopClass(totalStep, arr) {
        this.step = 0;
        this.totalStep = totalStep;
        this.dataArr = arr;
        this.over = false;
        this.stepArr = [];
        this._init();
    }

    loopClass.prototype = {
        _init: function () {
            var that = this;
            that.total = 0;
            var l = that.dataArr.length;
            for (var i = 0; i < l; i++) {
                that.total += +that.dataArr[i].value;
                that.stepArr.push(new arcClass(0, 0, that.dataArr[i].color));
            }
        },
        add: function () {
            var that = this;
            that.step++;
            if (that.step > this.totalStep) {
                that.over = true;
                return;
            }
            var l = that.stepArr.length;
            for (var i = 0; i < l; i++) {
                var endAngle = +that.dataArr[i].value / that.total * (that.step / that.totalStep) * Math.PI * 2;
                if (i === 0) {
                    that.stepArr[i].startAngle = 0;
                    that.stepArr[i].endAngle = endAngle;
                } else {
                    that.stepArr[i].startAngle = that.stepArr[i - 1].endAngle;
                    that.stepArr[i].endAngle = that.stepArr[i].startAngle + endAngle;
                }
            }
        }
    };
    function pie(ops) {
        this.options = {
            id: '#pieCon',
            animateType: 'increaseTogether',
            height: 100,
            width: 100,
            radius: 100,
            part: 100,
            space: 4,
            hollowedRadius: 70,
            dataArr: [
                {value: 10, color: '#f00'},
                {value: 20, color: '#0f0'},
                {value: 30, color: '#00f'}
            ]
        };
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        this.isOpera = false;
        this.con = $(this.options.id);
        this.angleClass = undefined;
        this._init();
    }

    pie.prototype = {
        _init: function () {
            var that = this;
            that.con.css({overflow: 'visible', transform: 'translateZ(0)', '-webkit-transform': 'translateZ(0)'});
            var canvas = $('<canvas></canvas>');
            that.cvs = canvas;
            if (typeof that.options.width === 'number' && typeof that.options.height === 'number') {
                canvas[0].width = that.options.width * 2;
                canvas[0].height = that.options.height * 2;
                canvas.css({
                    height: that.options.width.toString() + 'px',
                    width: that.options.height.toString() + 'px'
                });
                that.drawApi = canvas[0].getContext('2d');
                that.drawApi.translate(that.options.width, that.options.height);
                that.drawApi.rotate(-Math.PI / 2);
                that.con.append(canvas);
                that.angleClass = new loopClass(that.options.part, that.options.dataArr);
            } else {
                console.log('width or height is not number');
                return;
            }
            var UA = window.navigator.userAgent.toLowerCase();
            if (/opr/.test(UA) || /miuiyellowpage/.test(UA)) {
                var p = UA.indexOf('android');
                if (p !== -1) {
                    var s = UA.substr(p + 8, 3).split('.');
                    if (parseFloat(s[0] + s[1]) < 42) {
                        this.isOprera = true;
                    }
                }
            }
        },
        run: function () {
            var that = this;
            window.requestAnimationFrame(function () {
                that.animation();
            });
        },
        animation: function () {
            var that = this;
            that.angleClass.add();
            that.drawApi.clearRect(0, 0, that.options.width * 2, that.options.height * 2);
            var l = that.angleClass.stepArr.length;
            for (var i = 0; i < l; i++) {
                var angle = this.angleClass.stepArr[i];
                that.drawApi.save();
                that.drawApi.strokeStyle = '#fff';
                that.drawApi.lineWidth = that.options.space;
                that.drawApi.fillStyle = angle.color;
                that.drawApi.beginPath();
                that.drawApi.moveTo(0, 0);
                that.drawApi.arc(0, 0, that.options.radius, angle.startAngle, angle.endAngle, false);
                that.drawApi.closePath();
                that.drawApi.fill();
                that.drawApi.stroke();
                that.drawApi.restore();
            }
            if (that.options.hollowedRadius !== 0) {
                that.drawApi.save();
                that.drawApi.fillStyle = '#fff';
                that.drawApi.beginPath();
                that.drawApi.moveTo(0, 0);
                that.drawApi.arc(0, 0, that.options.hollowedRadius, 0, Math.PI * 2, false);
                that.drawApi.closePath();
                that.drawApi.fill();
                that.drawApi.restore();
            }
            if (this.isOpera) {
                that.cvs.detach();
                that.con.append(that.cvs);
            }
            if (!that.angleClass.over) {
                that.run();
            }
        }
    };
    return pie;
});