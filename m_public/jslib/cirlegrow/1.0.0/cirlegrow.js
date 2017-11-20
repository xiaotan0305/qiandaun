(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('cirlegrow/1.0.0/cirlegrow', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        w.CirleGrow = f(w);
    }
})(window, function () {
    'use strict';
    var $ = window.jQuery;

    function cirlegrow(ops) {
        this.options = {
            id: '#circle1',
            per: 0,
            part: 20,
            w: 200,
            h: 200,
            radius: 100,
            space: 6,
            cssW: '100%',
            cssH: 'auto',
            circleClr: '#f00'
        };
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        this.con = $(this.options.id);
        this.cvs = $('<canvas></canvas>');
        this.drawApi = this.cvs[0].getContext('2d');
        this.init();
    }

    cirlegrow.prototype = {
        init: function () {
            var ops = this.options;
            this.con.css({overflow: 'visible', '-webkit-transform': 'translateZ(0)'});
            this.cvs[0].height = ops.h;
            this.cvs[0].width = ops.w;
            this.cvs.css({height: ops.cssH, width: ops.cssW});
            this.drawArc(ops.per);
            this.con.append(this.cvs);
        },
        drawArc: function () {
            var ops = this.options;
            this.drawApi.clearRect(0, 0, ops.w, ops.h);
            this.drawApi.save();
            this.drawApi.translate(ops.w / 2, ops.h / 2);
            this.drawApi.rotate(-Math.PI / 2);
            this.drawApi.strokeStyle = ops.circleClr;
            this.drawApi.fillStyle = ops.circleClr;
            this.drawApi.beginPath();
            this.drawApi.moveTo(0, 0);
            this.drawApi.arc(0, 0, ops.radius - ops.space, 0, -Math.PI * 2 * ops.per, true);
            this.drawApi.lineTo(0, 0);
            this.drawApi.closePath();
            this.drawApi.fill();
            this.drawApi.stroke();
            this.drawApi.globalCompositeOperation = 'source-out';
            this.drawApi.beginPath();
            this.drawApi.arc(0, 0, ops.radius, 0, -Math.PI * 2 * ops.per, true);
            this.drawApi.lineTo(0, 0);
            this.drawApi.closePath();
            this.drawApi.fill();
            this.drawApi.restore();
        },
        run: function (num) {
            var that = this;
            if (that.options.per === num) {
                return;
            }
            if (Math.round(that.options.per * 100) === 100) {
                that.options.per = num;
                that.drawArc(that.options.per);
                return;
            }
            window.requestAnimationFrame(function () {
                that.options.per += (num - that.options.per) / that.options.part;
                that.drawArc(that.options.per.toFixed(1));

                that.run(num);
            });
        }
    };
    return cirlegrow;
});
