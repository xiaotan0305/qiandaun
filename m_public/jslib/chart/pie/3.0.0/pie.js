/**
 * 专为pc端家居智能报价使用（形式详见需求文档）
 * by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('chart/pie/3.0.0/pie', ['chart/raf/1.0.0/raf'], function (require) {
            require('chart/raf/1.0.0/raf');
            return f(w);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        // 请引入raf.js
        window.Pie3 = f(w);
    }
})(window, function (w) {
    'use strict';
    // 获取jquery
    var $ = w.jQuery;

    /**
     * 每一扇弧度块类
     * @param id
     * @param r
     * @param hr
     * @param tr
     * @param c
     * @param oc
     * @param lp
     * @param d
     * @param ts
     * @param sa
     * @constructor
     */
    function Arc(id, r, hr, tr, c, oc, lp, d, ts, sa) {
        // 该扇形id
        this.id = id;
        // 该扇形半径
        this.radius = r;
        // 该扇形的镂空半径
        this.hollowR = hr;
        // 该扇形的总弧度
        this.totalRa = tr;
        // 该扇形颜色
        this.color = c;
        // 该扇形突出颜色
        this.outColor = oc;
        // 线粗
        this.linePx = lp;
        // 开始弧度
        this.start = 0;
        // 绘图api
        this.drawApi = d;
        // 总步数
        this.totalStep = ts;
        // 开始弧度
        this.start = 0;
        // 结束弧度
        this.end = 0;
        // 特殊角度，用于当图形角度偏转时使用
        this.spcialAngle = sa;
    }

    Arc.prototype = {

        /**
         * 画弧度
         * @param s 开始弧度
         * @param step 当前步数
         * @param noDraw 不绘制标识
         */
        draw: function (s, step, noDraw) {
            var that = this;
            var d = that.drawApi;
            // 赋值初始弧度
            that.start = s;
            // 赋值结束弧度
            that.end = s + step * this.totalRa / this.totalStep;
            // 当不绘制为真时，不绘制扇形
            if (noDraw) {
                return;
            }
            // 画弧度
            d.save();
            d.fillStyle = that.color;
            d.beginPath();
            d.moveTo(0, 0);
            d.arc(0, 0, that.radius, s, that.end, false);
            d.closePath();
            d.fill();
            d.restore();
            // 如果存在线宽时，使扇形彼此截断
            if (that.linePx) {
                d.save();
                d.globalCompositeOperation = 'destination-out';
                d.lineWidth = that.linePx;
                d.beginPath();
                d.moveTo(0, 0);
                d.arc(0, 0, that.radius, s, that.end, false);
                d.closePath();
                d.stroke();
                d.restore();
            }
            // 如果存在镂空半径时，是扇形镂空
            if (that.hollowR) {
                d.save();
                d.globalCompositeOperation = 'destination-out';
                d.fillStyle = '#000';
                d.beginPath();
                d.moveTo(0, 0);
                d.arc(0, 0, that.hollowR, s, that.end, false);
                d.closePath();
                d.fill();
                d.restore();
            }
        },

        /**
         * 突出显示函数（当鼠标移入扇形时操作）
         */
        showOut: function () {
            var that = this;
            var d = that.drawApi
            d.save();
            // 声明阴影属性
            d.shadowColor = 'RGBA(0,0,0,0.7)';
            d.shadowOffsetX = 0;
            d.shadowOffsetY = 0;
            d.shadowBlur = 80;
            d.fillStyle = that.outColor;
            d.beginPath();
            d.moveTo(0, 0);
            d.arc(0, 0, that.radius, that.start, that.end, false);
            d.closePath();
            d.fill();
            d.restore();
            // 存在镂空时，显示非镂空部分
            if (that.hollowR) {
                d.save();
                d.globalCompositeOperation = 'destination-out';
                d.beginPath();
                d.moveTo(0, 0);
                d.arc(0, 0, that.hollowR, 0, Math.PI * 2, false);
                d.closePath();
                d.fill();
                d.restore();
            }
        },

        /**
         * 一个点坐标是否坐落在这个扇形区域中
         * @param x
         * @param y
         * @param w
         * @param h
         */
        mouseJudge: function (x, y, w, h) {
            var that = this;
            // 坐标转换，将鼠标的坐标转换成canvas中的实际坐标
            var mx = x * 2 - w;
            var my = y * 2 - h;
            // 计算点坐标到原点半径
            var s = Math.sqrt(mx * mx + my * my);
            // 计算坐标弧度
            var angle = Math.atan2(my, mx);
            // 将弧度转换为360度的弧度
            if (angle < 0) {
                angle = Math.PI * 2 + angle;
            }
            angle -= that.spcialAngle;
            if (angle >= Math.PI * 2) {
                angle -= Math.PI * 2;
            }
            if (angle < 0) {
                angle = Math.PI * 2 + angle;
            }
            // 判断半径在扇形之内，弧度在扇形之内，则返回改扇形id
            if (s > that.hollowR && s < that.radius && angle > that.start && angle < that.end) {
                return that.id;
            }
            // 没有在区域的标识
            return 'noID';
        },

        /**
         * 获取该扇形的结束弧度
         * @returns {number|*}
         */
        getEnd: function () {
            return this.end;
        }
    };

    /**
     * 主函数
     * @constructor
     */
    function Pie(ops) {
        this.options = {
            // 图形容器id
            id: '#pie',
            // 高度
            height: 300,
            // 宽度
            width: 300,
            // 半径
            radius: 300,
            // 图形翻转的角度(这里请填写弧度)
            rotateAng: -Math.PI / 2,
            // 镂空半径
            hollowedRadius: 100,
            // 总执行步长
            totalStep: 1000,
            // 线粗，也就是每个扇形间隔的线宽
            linePx: 4,
            // 默认颜色数组，如果只有一个颜色可以直接传['#f00']
            defaultColor: ['#f00', '#0f0', '#00f'],
            // 突出后颜色
            outColor: ['#600', '#060', '#006'],
            // 在图形中触及扇形后执行的函数
            moveFunc: null,
            // 各扇面数据
            data: [{
                id: '1',
                value: '234234',
                color: '#f00'
            }]
        };
        // 覆盖默认配置
        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }
        // 存储每个扇形声明后的扇形类
        this.arcObj = {};
        // 储存每个扇形的顺序id，为防止id不连续情况
        this.arcObjID = [];
        // 步数初始化
        this.step = 0;
        // 扇形个数初始化
        this.arcL = 0;
        // 当前操作的扇形id
        this.nowID = '';
        // 是否允许用户操作介入
        this.canUse = false;
        this.init();
    }

    Pie.prototype = {

        /**
         * 初始化函数，声明兼容性样式，声明一些全局变量
         */
        init: function () {
            var that = this;
            if (!that.options.data) {
                console.log('xAxis or data no value!!!');
            }
            // 获取canvas父节点并赋值兼容性写法
            that.con = $(that.options.id);
            that.con.css({
                overflow: 'visible',
                transform: 'translateZ(0)',
                '-webkit-transform': 'translateZ(0)',
                '-o-transform': 'translateZ(0)',
                '-ms-transform': 'translateZ(0)',
                '-moz-transform': 'translateZ(0)'
            });
            // 设置canvas的宽高和样式宽高
            that.cvs = $('<canvas width="' + that.options.width * 2 + '" height="' + that.options.height * 2
                + '" style="height:' + that.options.height + 'px;width:' + that.options.width
                + 'px;">您当前浏览器不支持，请更换更高级的浏览器</canvas>');
            // 获取绘图api
            that.drawApi = that.cvs[0].getContext('2d');
            // 设置原点位置为中点
            that.drawApi.translate(that.options.width, that.options.height);
            // 将圆形做成开始角度在垂直方向
            that.drawApi.rotate(that.options.rotateAng);
            // 将canvas加入父容器
            that.con.append(that.cvs);
            // 填充数据
            that.fillData(that.options.data);
            // 判断绑定事件
            var eventName = 'ontouchstart' in w ? 'touchstart' : 'mousemove';

            /**
             * 绑定移动事件，当移入某一个扇形时，显示效果
             */
            that.cvs.on(eventName, function (e) {
                that.moveHandle(e);
            });
        },

        /**
         * 填充数据
         * @param arcData 每个扇形的数据
         */
        fillData: function (arcData) {
            var that = this;
            // 重置动效默认值
            that.step = 0;
            that.arcObj = {};
            that.arcObjID = [];
            that.nowID = '';
            that.canUse = false;
            that.arcL = arcData.length;
            // 配置索引
            var ops = that.options,
            // 扇形数据总和索引
                total = 0,
            // for循环使用的索引
                i = 0;

            /**
             * 循环遍历所有扇形的值，获取总和值
             */
            for (; i < that.arcL; i++) {
                total += Number(arcData[i].value);
            }
            // 获取扇形默认颜色数组的个数和展示颜色数组的个数
            var defaultColorL = ops.defaultColor.length;
            var outColorL = ops.outColor.length;

            /**
             * 循环遍历所有扇形的数据，赋值给arcObj对象设置每一个扇形类
             */
            for (i = 0; i < that.arcL; i++) {
                var color = arcData[i].color;
                var oc = arcData[i].outColor;
                var id = arcData[i].id;
                // 每个设置单个颜色时，循环默认颜色数组得到默认颜色
                if (!color) {
                    color = ops.defaultColor[i % defaultColorL];
                }
                // 每个设置展示颜色时，循环展示颜色数组得到颜色
                if (!oc) {
                    oc = ops.outColor[i % outColorL];
                }
                that.arcObjID.push(id);
                that.arcObj[id] = new Arc(id, ops.radius, ops.hollowedRadius,
                    Math.PI * 2 * Number(arcData[i].value) / total,
                    color, oc, ops.linePx, that.drawApi, ops.totalStep, ops.rotateAng);
            }
        },

        /**
         * 运行动效函数
         */
        run: function () {
            var that = this;
            // 使用requestAnimationFrame加速效果显示
            w.requestAnimationFrame(function () {
                that.animation();
            });
        },

        /**
         * 动效函数
         */
        animation: function () {
            var that = this;
            // 每次增加一步
            that.step++;
            that.drawAllArc();
            // 判断是否到了最后一步，也就是动效结束
            if (that.step < that.options.totalStep) {
                that.run();
            } else {
                that.canUse = true;
            }
        },

        /**
         * 绘制扇形
         */
        drawAllArc: function () {
            var that = this;
            // 清除canvas绘制内容
            that.drawApi.clearRect(-that.options.width, -that.options.height, that.options.width * 2, that.options.height * 2);

            /**
             * 循环遍历所有扇形类，画扇形
             */
            for (var i = 0; i < that.arcL; i++) {
                // 第一个扇形开始弧度为0,否则扇形的开始弧度为前一个扇形的结束弧度
                var start = i === 0 ? 0 : that.arcObj[that.arcObjID[i - 1]].getEnd();
                // that.nowID === that.arcObjID[i]的作用是当鼠标滑到了一个扇形时，使该扇形不绘制默认图形
                that.arcObj[that.arcObjID[i]].draw(start, that.step, that.nowID === that.arcObjID[i]);
            }
            // 当前id不为空绘制该索引扇形的展示形式
            if (that.nowID !== '') {
                that.arcObj[that.nowID].showOut();
            }
        },

        /**
         * 显示传入id的扇形展示形式
         * @param id
         */
        showOut: function (id) {
            var that = this;
            if (!that.canUse) {
                return;
            }
            if (that.nowID === id) {
                return;
            }
            // 不存在改id返回
            if (that.arcObjID.indexOf(id) < 0) {
                return;
            }
            that.nowID = id;
            that.drawAllArc();
        },

        /**
         * 滑入canvas操作，判断是否滑到了扇形，如果滑到则展示扇形的展示形式
         * @param e
         */
        moveHandle: function (e) {
            var that = this;
            if (!that.canUse) {
                return;
            }
            // 触及点
            var p,
            // 转换后的canvas中的坐标
                ax,
                ay;
            if (e.type === 'touchstart') {
                p = e.originalEvent.touches[0];
                ax = p.pageX - that.con.offset().left;
                ay = p.pageY - that.con.offset().top;
            } else {
                p = e.originalEvent;
                ax = p.pageX - that.con.offset().left;
                ay = p.pageY - that.con.offset().top;
            }

            /**
             * 循环遍历所有扇形类，判断是否滑入了某个扇形，如果找到了这个扇形，则展示，否则不操作
             */
            for (var i = 0; i < that.arcL; i++) {
                var arc = that.arcObj[that.arcObjID[i]];
                // 获取是否滑入了某个扇形，如果有则返回id，否则返回'noID'
                var id = arc.mouseJudge(ax, ay, that.options.width, that.options.height);
                // 判断获取了id并且不是已经触发的当前id，则执行展示效果,并且存在回调函数时执行回调
                if (id !== 'noID' && id !== that.nowID) {
                    that.nowID = id;
                    that.drawAllArc();
                    if (that.options.moveFunc) {
                        that.options.moveFunc(that.nowID);
                    }
                    break;
                }
            }
        }
    };
    return Pie;
});