/**
 * 足迹组件
 */
(function (window, factory) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
        define('footprint/1.0.0/footprint', [], function () {
            return factory(window);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        window.Footprint = factory(window);
    }
})(window, function (window) {
    'use strict';
    if (!window.localStorage) {
        alert('This browser does NOT support localStorage');
        return;
    }
    function Footprint() {
        this.storage = window.localStorage;
        this.arr = [];
        this.footprint = 'footprint';
    }

    Footprint.prototype.init = function (city) {
        var data = this.storage.getItem(this.footprint);
        if (data) {
            this.arr = data.split('|');
        } else {
            var defaultData = '\u770b\u623f\u56e2-//m.fang.com/kanfangtuan/' + city + '.htm|\u623f\u4ea7\u8d44\u8baf-//m.fang.com/news/' + city + '.html';
            this.arr = defaultData.split('|');
            this.storage.setItem(this.footprint, defaultData);
        }
    };
    Footprint.prototype.push = function (name, url, city) {
        try {
            this.init(city);
            var idx = this.hasData(name);
            if (idx != -1) {
                this.arr.splice(idx, 1);
            }
            if (this.arr.length >= 3) {
                this.arr.pop();
            }
            var n = name + '-' + url;
            this.arr.unshift(n);
            if (this.arr.length > 0) {
                n = '|' + n;
            }
            var str = this.arr.join('|');
            this.storage.setItem(this.footprint, str);
        } catch (e) {
            console.log('no support');
        }
    };
    Footprint.prototype.getInfo = function (city) {
        this.init(city);
        var footEl = document.getElementById('footmark');
        if (footEl) {
            var l = this.arr.length;
            var str = '<i></i>\u8db3\u8ff9:';
            for (var i = 0; i < l; i++) {
                var arra = this.arr[i].split('-');
                if (i > 0) {
                    str += '|';
                }
                str += '<a href="' + arra[1] + '">' + arra[0] + '</a>';
            }
            footEl.innerHTML = str;
        }
    };
    Footprint.prototype.hasData = function (name) {
        for (var i = 0; i < this.arr.length; i++) {
            var arra = this.arr[i].split('-');
            if (arra[0] == name) {
                return i;
            }
        }
        return -1;
    };
    return new Footprint;
});