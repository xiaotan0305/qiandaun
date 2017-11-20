/**
 * 柱状图可双面可单面（canvas实现）
 * by blue
 * @param {Object} w
 * @param {Object} f
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/histogram/1.0.1/histogram', ['chart/raf/1.0.0/raf'], function (require) {
            require('chart/raf/1.0.0/raf');
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        // 请引入chart/raf/1.0.0/raf的js
        window.Histogram101 = f(w);
    }
})(window, function factory(w) {
    'use strict';
    // 获取jquery库
    var $ = w.jQuery;

    /**
     * 获取字符串的真实长度（字节长度）
     * @param str
     * @returns {number}
     */
    function getTrueLength(str) {
        var len = str.length, truelen = 0, x = 0;
        for (; x < len; x++) {
            if (str.charCodeAt(x) > 128) {
                truelen += 2;
            } else {
                truelen += 1;
            }
        }
        return truelen;
    }

    /**
     * 按字节长度截取字符串，返回substr截取位置
     * @param str
     * @param leng
     * @returns {*}
     */
    function cutString(str, leng) {
        var len = str.length, tlen = len, nlen = 0;
        for (var x = 0; x < len; x++) {
            if (str.charCodeAt(x) > 128) {
                if (nlen + 2 < leng) {
                    nlen += 2;
                } else {
                    tlen = x;
                    break;
                }
            } else {
                if (nlen + 1 < leng) {
                    nlen += 1;
                } else {
                    tlen = x;
                    break;
                }
            }
        }
        return tlen;
    }

    /**
     * 排序函数
     * @param a 前一个值
     * @param b 后一个值
     * @returns {number}
     */
    function histogramSort(a, b) {
        var aVal = parseFloat(a.value);
        var bVal = parseFloat(b.value);
        // 都为正则判断谁小谁在前
        if (aVal >= 0 && bVal >= 0) {
            return aVal < bVal ? -1 : 1;
        }
        // 都为负值则谁小谁在前
        if (aVal < 0 && bVal < 0) {
            return aVal < bVal ? -1 : 1;
        }
        // 一正一副则正值在前
        return aVal > bVal ? -1 : 1;
    }

    /**
     * 柱类
     * @param x 横坐标
     * @param y 纵坐标
     * @param width 柱宽度
     * @param height 柱高度
     * @param value 柱展示的值内容
     * @param name 柱展示的名称内容
     * @param href 点击柱后跳转的地址
     * @param color 柱的颜色
     * @param fontColor 文字的颜色
     * @param fontFamily 字体
     * @param fontSize 字体大小
     * @param textHeight 字体展示高度
     * @param drawApi 绘图api
     * @constructor
     */
    function Bar(x, y, width, height, value, name, href, color, fontColor, fontFamily, fontSize, textHeight, drawApi) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.value = value;
        this.name = name;
        // 该柱是上行还是下行
        this.des = parseFloat(value) >= 0;
        this.href = href;
        this.c = color;
        this.fc = fontColor;
        this.ff = fontFamily;
        this.fz = fontSize;
        this.th = textHeight;
        this.drawApi = drawApi;
    }

    Bar.prototype = {

        /**
         * 判断是否点击了该柱
         * @param x 鼠标点击canvas的横坐标
         * @param y 鼠标点击canvas的纵坐标
         * @returns {boolean}
         */
        judgeHref: function (x, y) {
            var that = this;
            // 不存在超链接时不执行操作
            if (!that.href) {
                return false;
            }
            // 判断点击横坐标是否在柱横向区域
            if (x > that.x - that.w / 2 && x < that.x + that.w / 2) {
                // 判断是否在纵向区域中并跳转地址,上行柱
                if (that.des && y >= that.y - that.h && y <= that.y) {
                    w.location.href = that.href;
                    return true;
                }
                // 判断是否在纵向区域中并跳转地址,下行柱
                if (!that.des && y >= that.y && y <= that.y + that.h) {
                    w.location.href = that.href;
                    return true;
                }
            }
            return false;
        },

        /**
         * 绘制柱显示
         * @param part 动效使用的百分比展示
         */
        draw: function (part) {
            var that = this;
            // 获取绘制柱的起始位置
            var x = that.x - that.w / 2;
            var y = that.y;
            // 根据动画百分比计算出当前柱的高度
            var h = part * that.h;
            var valY = 0;
            // 绘制柱
            that.drawApi.save();
            that.drawApi.fillStyle = that.c;
            that.drawApi.beginPath();
            // 上行柱重新赋值纵坐标
            if (that.des) {
                y = that.y - h;
            }
            that.drawApi.fillRect(x, y, that.w, h);
            that.drawApi.closePath();
            that.drawApi.fill();
            that.drawApi.restore();
            // 绘制柱的名称和展示的值
            that.drawApi.save();
            that.drawApi.font = that.fz + that.ff;
            that.drawApi.textAlign = 'center';
            that.drawApi.textBaseline = 'middle';
            that.drawApi.fillStyle = that.fc;
            // 如果为上行柱则名称在默认纵坐标的下部
            if (that.des) {
                // 值坐标为中线分割位置减去
                valY = that.y - h - that.th / 2;
                y = that.y + that.th / 2;
            } else {
                valY = that.y + h + that.th / 2;
                y = that.y - that.th / 2;
            }
            var str = that.name.length > 3 ? that.name.substr(0, 3) + '...' : that.name;
            that.drawApi.fillText(str, that.x, y);
            that.drawApi.fillText(that.value, that.x, valY);
            that.drawApi.restore();
        },

        /**
         *
         * @param lh
         * @param rw
         * @param text
         * @param x
         * @param des
         */
        writeTextOnCanvas: function (lh, rw, text, x, y, des) {
            var that = this, i = 0;
            var totalL = getTrueLength(text);
            var l = Math.ceil(totalL / rw);
            for (; i < l; i++) {
                var tl = cutString(text, rw);
                var ay = (des ? y + i * lh : y - i * lh);
                that.drawApi.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ''), x, ay);
                text = text.substr(tl);
            }
        }
    };

    /**
     * 绘制双面或单面柱状图主类
     * @param ops
     * @constructor
     */
    function Histogram(ops) {
        this.options = {
            id: '#histogram',
            // 高度
            h: 200,
            // 宽度
            w: 300,
            // 文字所占高度
            textH: 50,
            // 字体
            fontFamily: ' Arial',
            // 字体大小
            fontSize: '22px',
            // 动画执行时间
            runTime: 1000,
            // 除去间距柱子的宽度比
            barWidthPart: 0.5,
            // 字体颜色
            fontColor: '#999',
            // 上行柱颜色
            upColor: '#ffc488',
            // 下行柱颜色
            downColor: '#92be69',
            // 传入的数据
            data: [
                {name: '三个字', value: -1.6, href: '#1', color: '#f00'},
                {name: 'b', value: 2.0, href: '#1', color: '#100'},
                {name: 'c', value: 2.5, href: '#1', color: '#f50'},
                {name: 'd', value: -2.5, href: '#1', color: '#f01'},
                {name: 'e', value: 7.0, href: '#1', color: '#050'},
                {name: 'f', value: 3.7, href: '#1', color: '#012'},
                {name: 'f', value: 3.2, href: '#1', color: '#123'},
                {name: 'f', value: 3.4, href: '#1', color: '#321'},
                {name: 'f', value: 3.7, href: '#1', color: '#456'},
                {name: 'f', value: -3.7, href: '#1', color: '#111'}
            ]
        };
        // 循环遍历覆盖所有传入的数据到默认参数中
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        this.init();
    }

    Histogram.prototype = {

        /**
         * 初始化函数
         */
        init: function () {
            var that = this;
            // 获取柱状图canvas的容器
            that.con = $(that.options.id);
            // 设置硬件加速必须的样式给canvas的容器
            that.con.css({
                overflow: 'visible',
                transform: 'translateZ(0)',
                '-webkit-transform': 'translateZ(0)',
                '-o-transform': 'translateZ(0)',
                '-ms-transform': 'translateZ(0)'
            });
            // 声明一个canvas
            that.cvs = $('<canvas></canvas>');
            // 获取绘图api
            that.drawApi = that.cvs[0].getContext('2d');
            // 一些老旧浏览器和欧朋的特殊浏览器判断强制刷新
            that.isOld = false;
            var UA = w.navigator.userAgent.toLowerCase();
            if (/opr/.test(UA) || /miuiyellowpage/.test(UA)) {
                var p = UA.indexOf('android');
                if (p !== -1) {
                    var s = UA.substr(p + 8, 3).split('.');
                    if (parseFloat(s[0] + s[1]) < 42) {
                        that.isOld = true;
                    }
                }
            }
            if (/sogou/.test(UA) && /sm-g7106/.test(UA) || /mx4/.test(UA) && !/sogou/.test(UA)) {
                that.isOld = true;
            }
            // 设置canvas的宽高和样式宽高,之所以2比1是为了保持所有绘制都是高清图
            that.cvs[0].width = that.options.width * 2;
            that.cvs[0].height = that.options.height * 2;
            that.cvs.css('width', that.options.width + 'px');
            that.cvs.css('height', that.options.height + 'px');
            // 填充数据
            that.fillData(that.options.data);
            // 插入改canvas到容器中显示
            that.con.append(that.cvs);
            // 绑定点击事件处理用户行为
            that.cvs.on('click', function (e) {
                that.click(e);
            });
        },

        /**
         * 填充数据
         * @param arr
         */
        fillData: function (arr) {
            var that = this,
                i = 0,
                valArr = [],
                duplex = false,
                maxVal,
                orginY = that.drawApi.canvas.height - that.options.textH;
            // 通过筛选函数执行数组排序
            arr.sort(histogramSort);
            // 重置初值
            that.over = false;
            that.barArr = [];
            that.dataL = arr.length;
            // 计算出柱状图所占横向单位宽度，此宽度包括柱形间的间隔
            var partW = that.drawApi.canvas.width / that.dataL;
            // 循环遍历所有传入的值，找到最大值，并且为了方便计算将转换为数值的值存到一个数组索引中，并且判断是否为双面柱状图
            for (; i < that.dataL; i++) {
                var val = parseFloat(arr[i].value);
                var value = Math.abs(val);
                if (maxVal === undefined || maxVal < value) {
                    maxVal = value;
                }
                // 有负值则为双面柱状图
                if (val < 0) {
                    duplex = true;
                }
                valArr.push(val);
            }
            // 双面柱状图的纵轴参考值变更
            if (duplex) {
                orginY = that.drawApi.canvas.height / 2;
            }
            // 计算出柱状图形在canvas中最大的高度
            that.maxH = orginY - that.options.textH;
            // 计算出柱状图形去除间隔后的真实宽度
            var w = partW * that.options.barWidthPart;
            // 循环遍历初始化柱类并存入到一个全局索引数组中
            for (i = 0; i < that.dataL; i++) {
                // 算出每个柱子的横坐标
                var x = partW * (i + 0.5);
                // 与最大值作对比算出每个柱子的高度
                var h = Math.abs(valArr[i] * that.maxH / maxVal);
                // 判断颜色，如果传入了颜色则用传入颜色，否则用默认的颜色
                var color = arr[i].color || (valArr[i] < 0 ? that.options.downColor : that.options.upColor);
                // 初始化柱类并存入索引数组
                that.barArr.push(new Bar(x, orginY, w, h, arr[i].value, arr[i].name, arr[i].href,
                    color, that.options.fontColor, that.options.fontFamily, that.options.fontSize, that.options.textH, that.drawApi));
            }
        },

        /**
         * 外部接口，执行图形动画
         */
        run: function () {
            // 获取开始动画初试时间
            this.start = new Date().getTime();
            this.an();
        },

        /**
         * 动画执行方法
         */
        an: function () {
            var that = this;
            w.requestAnimationFrame(function () {
                that.animation();
            });
        },

        /**
         * 循环动画执行方法
         */
        animation: function () {
            var that = this;
            that.draw();
            // 欧朋浏览器及老旧浏览器不兼容刷新处理
            if (that.isOld) {
                that.cvs.detach();
                that.con.append(that.cvs);
            }
            // 判断是否结束动画否则继续绘制
            if (!that.over) {
                that.an();
            }
        },

        /**
         * 绘图方法
         */
        draw: function () {
            var that = this,
                i = 0,
            // 获取当前时间
                now = new Date().getTime();
            // 清空canvas绘图内容以供重绘
            that.drawApi.clearRect(0, 0, that.drawApi.canvas.width, that.drawApi.canvas.height);
            // 判断动画时间是否为0，0则直接显示最终柱形
            var change = that.options.runTime === 0 ? 1 : (now - that.start) / that.options.runTime;
            // 这是动画结束标示
            if (change >= 1) {
                that.over = true;
            }
            // 循环遍历所有柱绘制各柱显示图形
            for (; i < that.dataL; i++) {
                that.barArr[i].draw(change);
            }
            // 绘制柱形与名称之间的分割线
            that.drawApi.save();
            that.drawApi.strokeStyle = '#ccc';
            that.drawApi.lineWidth = 1;
            that.drawApi.moveTo(0, that.barArr[i - 1].y);
            that.drawApi.lineTo(that.drawApi.canvas.width, that.barArr[i - 1].y);
            that.drawApi.stroke();
            that.drawApi.restore();
        },

        /**
         * 用户点击柱子操作
         * @param e
         */
        click: function (e) {
            var that = this,
            // 获取点击事件实例
                p = e.originalEvent,
                i = 0;
            var mx = (p.pageX - that.cvs.offset().left) * 2;
            var my = (p.pageY - that.cvs.offset().top) * 2;
            for (; i < that.dataL; i++) {
                // 传入当前用户点击横纵坐标分别判断是否点击了柱子，返回true说明点击并跳出循环
                if (that.barArr[i].judgeHref(mx, my)) {
                    break;
                }
            }
        }
    };
    return Histogram;
});
