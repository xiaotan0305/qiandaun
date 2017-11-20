/**
 * 柱状图(可单面)显示及效果js
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/histogram/1.0.2/histogram', [], function () {
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        window.Histogram = f(w);
    }
})(window, function factory(w) {
    'use strict';
    var $ = window.jQuery;
    function getRate(data, h, s, th) {
        var l = data.length;
        var max = Math.abs(parseFloat(data[0].value));
        for (var i = 1; i < l; i++) {
            if (max < Math.abs(parseFloat(data[i].value))) {
                max = Math.abs(parseFloat(data[i].value));
            }
        }
        if (max === 0)max = 1;
        return s ? (h - th) / max : h / 2 / max;
    }

    function histogramSort(a, b) {
        var aVal = parseFloat(a.value);
        var bVal = parseFloat(b.value);
        if (aVal >= 0 && bVal >= 0) {
            return aVal < bVal ? -1 : 1;
        }
        if (aVal < 0 && bVal < 0) {
            return aVal < bVal ? -1 : 1;
        }
        return aVal > bVal ? -1 : 1;
    }

    function histogramDecreaseSort(a, b) {
        var aVal = parseFloat(a.value);
        var bVal = parseFloat(b.value);
        return aVal > bVal ? -1 : 1;
    }

    function histogram(ops) {
        this.options = {
            id: '#histogram',
            h: 200,
            w: '100%',
            per: 0.6,
            sort: '',
            textH: 50,
            side: false,
            upColor: '#f00',
            downColor: '#00f',
            spanColor:'#666',
            data: [
                {name: '三个字', value: -1.6, href: '//m.fang.com', color: '#f00'},
                {name: 'b', value: 2.0, href: '//m.fang.com', color: '#100'},
                {name: 'c', value: 2.5, href: '//m.fang.com', color: '#f50'},
                {name: 'd', value: -2.5, href: '//m.fang.com', color: '#f01'},
                {name: 'e', value: 7.0, href: '//m.fang.com', color: '#050'},
                {name: 'f', value: 3.7, href: '//m.fang.com', color: '#012'},
                {name: 'f', value: 3.2, href: '//m.fang.com', color: '#123'},
                {name: 'f', value: 3.4, href: '//m.fang.com', color: '#321'},
                {name: 'f', value: 3.7, href: '//m.fang.com', color: '#456'},
                {name: 'f', value: -3.7, href: '//m.fang.com', color: '#111'}
            ]
        };
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        this.histogram = $(this.options.id);
        this._init();
    }

    histogram.prototype = {
        _init: function () {
            // 重置宽高
            if (typeof this.options.w !== 'string') {
                this.histogram.width(this.options.w);
            } else {
                this.histogram.css('width', this.options.w);
            }
            if (typeof this.options.h !== 'string') {
                this.histogram.height(this.options.h);
            } else {
                this.histogram.css('height', this.options.h);
            }
            this.histogram.css('position', 'relative');
            // 显示数据实现
            if (this.options.sort === 'none') {
                this.options.data.sort(histogramSort);
            } else if (this.options.sort === 'decrease') {
                this.options.data.sort(histogramDecreaseSort);
            }
            var rate = getRate(this.options.data, this.options.h * this.options.per, this.options.side, this.options.textH);
            var orY,bg,data, l,wPer, i,sh,smh = 0,c = '';
            if (this.options.side) {
                orY = this.options.h - this.options.textH;
                bg = '<ul class="histogramBg" style="position:relative;z-index:1;height:'
                    + this.options.h + 'px;transform-origin: 50% '
                    + orY + 'px;-ms-transform-origin: 50% ' + orY + 'px;-webkit-transform-origin: 50% '
                    + orY + 'px;-moz-transform-origin: 50% ' + orY + 'px;-o-transform-origin: 50% ' + orY + 'px;">';
                data = '<ul class="histogramData" style="position:absolute;z-index:2;left:0;top:0;height:100%;width:100%;word-break: break-all;text-align: center;font-size: 10px;">';
                l = this.options.data.length;
                wPer = Math.floor(100 / l);
                for (i = 0; i < l; i++) {
                    sh = Math.floor(rate * (Math.abs(parseFloat(this.options.data[i].value)) * 100) / 100);
                    smh = Math.floor(this.options.h - this.options.textH) - sh;
                    c = 'background:' + (this.options.data[i].hasOwnProperty('color') ? this.options.data[i].color : this.options.upColor);
                    bg += '<li style="width:' + wPer + '%;float:left"><a href="'
                        + this.options.data[i].href + '" style="height:' + sh + 'px;margin-top:'
                        + smh + 'px;' + c + '">' + this.options.data[i].name + '</a></li>';
                    data += '<li style="width:' + wPer + '%;position: absolute;left:' + wPer * i
                        + '%;top:0;"><p style="height:' + smh + 'px;position:relative;width:100%;"><span style="color:'+ (this.options.data[i].hasOwnProperty('color') ? this.options.data[i].color : this.options.spanColor) + ';position:absolute;left:0;bottom:0;width:100%;">'
                        + parseFloat(this.options.data[i].value) + '</span></p><p style="margin-top:' + sh + 'px;">'
                        + this.options.data[i].name + '</p></li>';
                }
                bg += '</ul>';
                data += '</ul>';
                bg += data;
                this.histogram.html(bg);
            } else {
                bg = '<ul class="histogramBg" style="height:' + this.options.h + 'px;position:relative;z-index:1;">';
                data = '<ul class="histogramData" style="word-break: break-all;text-align: center;font-size: 10px;position:absolute;z-index:2;left:0;top:0;height:100%;width:100%;">';
                l = this.options.data.length;
                wPer = Math.floor(100 / l);
                for (i = 0; i < l; i++) {
                    sh = Math.floor(rate * (Math.abs(parseFloat(this.options.data[i].value)) * 100) / 100);
                    if (parseFloat(this.options.data[i].value) >= 0) {
                        smh = Math.floor(this.options.h / 2) - sh;
                        c = 'background:' + (this.options.data[i].hasOwnProperty('color') ? this.options.data[i].color : this.options.upColor);
                        data += '<li style="width:' + wPer + '%;position: absolute;left:' + wPer * i + '%;top:0;"><p style="height:'
                            + smh + 'px;position:relative;width:100%;"><span style="color:'+ (this.options.data[i].hasOwnProperty('color') ? this.options.data[i].color : this.options.spanColor) + ';position:absolute;left:0;bottom:0;width:100%;">'
                            + parseFloat(this.options.data[i].value) + '</span></p><p style="margin-top:' + sh + 'px;">'
                            + this.options.data[i].name + '</p></li>';
                    } else {
                        smh = Math.floor(this.options.h / 2);
                        c = 'background:' + (this.options.data[i].hasOwnProperty('color') ? this.options.data[i].color : this.options.downColor);
                        data += '<li style="width:' + wPer + '%;position: absolute;left:' + wPer * i + '%;top:0;"><p style="height:' + (smh + 1)
                            + 'px;position:relative;width:100%;"><span style="color:'+ (this.options.data[i].hasOwnProperty('color') ? this.options.data[i].color : this.options.spanColor) + ';position:absolute;left:0;bottom:0;width:100%;">'
                            + this.options.data[i].name + '</span></p><p style="margin-top:' + sh + 'px">' + parseFloat(this.options.data[i].value) + '</p></li>';
                    }
                    bg += '<li style="width:' + wPer + '%;float:left"><a href="' + this.options.data[i].href + '" style="height:' + sh
                        + 'px;margin-top:' + smh + 'px;' + c + '">' + this.options.data[i].name + '</a></li>';
                }
                bg += '</ul>';
                data += '</ul>';
                bg += data;
                var htmlobj = '<div id="scroller" style="position:relative">' + bg + '</div>';
                this.histogram.html(htmlobj);
            }
        },
        run: function () {
            var bg = this.histogram.find('.histogramBg');
            if (bg.hasClass('histogramRun')) {
                bg.removeClass('histogramRun');
            }
            bg.addClass('histogramRun');
        }
    };
    return histogram;
});
