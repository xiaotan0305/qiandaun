/**
 * 日期选择及时间选择插件
 * by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        //  AMD
        define('dateAndTimeSelect/1.1.0/dateAndTimeSelect_chengjiao', ['iscroll/2.0.0/iscroll-lite'], function (require) {
            return f(w, require);
        });
    } else if (typeof exports === 'object') {
        //  CommonJS
        module.exports = f(w);
    } else {
        //  browser global
        window.DateAndTimeSelect = f(w);
    }
})(window, function (w, require) {
    'use strict';
    var $ = w.jQuery;

    /**
     * 判断是否加载了jquery
     */
    if (!$) {
        console.log('no load jquery!');
    }

    /**
     * 判断是通过seajs加载方式还是页面直接引用
     * ！！！这里需要注意当使用seajs模块加载时，因为用到了iscroll插件所以要通过require方式引入
     */
    w.IScroll = w.IScrollLite ? w.IScrollLite : require('iscroll/2.0.0/iscroll-lite');
    var IScrollLite = w.IScroll ? w.IScroll : w.IScrollLite;

    /**
     * 选择器的html字符串
     * @type {string}
     */
    var dateHtml = '<div id="floatSelect"><div class="blue_dataSelectCon">'
        + '<ul class="blue_operateCon">'
        + '<li><a href="javascript:void(0);">取消</a></li>'
        + '<li><a href="javascript:void(0);">确定</a></li>'
        + '</ul>'
        + '<div class="blue_selectCon">'
        + '<div class="blue_select">'
        + '<div class="blue_dateBox"><ul></ul></div>'
        + '<div class="blue_dateBox"><ul></ul></div>'
        + '</div>'
        + '<div class="blue_selectMask"></div>'
        + '</div>'
        + '</div></div>';
    var vars = seajs.data.vars;
    /**
     * 设置声明，表示选择器的类型
     * @type {{SELET_TYPE_DATE: string, SELET_TYPE_TIME: string}}
     */
    var setting = {
        SELET_TYPE_DATE: 'date',
        // 表示为日期选择器
    };

    /**
     * 当前日期
     */
    var oDate = new Date(),
        yearNow = oDate.getFullYear(),
        monthNow = oDate.getMonth() + 1;

    /**
     * 选择器类
     * @param type 类型，date为日期，time为时间
     * @param ops 传入参数
     * @constructor
     */
    function SelectorClass(type, ops) {
        this.type = type;
        this.ops = ops;
        this.init();
    }

    SelectorClass.prototype = {

        /**
         * 初始化函数
         */
        init: function () {
            var that = this;
            that.con = $(dateHtml);
            that.arr = that.con.find('.blue_dateBox');
            // 获取所有的blue__datebox类的div，分别为年月日选择器
            that.con.find('.blue_operateCon').on('click', 'a', function () {
                var $parent = $(this).parent();
                if ($parent.index() === 0) { //取消
                    if (that.ops[that.type + 'CancelFunc']) {
                        that.ops[that.type + 'CancelFunc'](that.getDate());
                    } else {
                        that.hide();
                    }
                } else if (that.ops[that.type + 'ConfirmFunc']) { //确定
                    var date = that.getDate();
                    that.ops[that.type + 'ConfirmFunc'](date);
                }
            });
            $(document.body).append(that.con);
            // 将选择器的jquery对象实例加入到body中
            that.setShow();
            // 设置显示
            $('#floatSelect').addClass('floatSelect');
        },

        setShow: function () {
            var that = this;
            that.scrollArr = [];
            var arrL = that.arr.length;

            /**
             * 循环遍历选择器ul的父类，分别设置各个选择器显示值和默认值
             */
            for (var i = 0; i < arrL; i++) {
                var box = that.arr.eq(i),
                    obj = that.setDisplayContent(i, box);
                box.find('ul').html(obj.html);

                /**
                 * 声明iscroll滚动实例
                 */
                var iscroll = new IScrollLite(box[0], {
                    bindToWrapper: true,
                    // 滚动为该节点
                    scaleX: false,
                    // 不可横向滚动
                    scaleY: true,
                    // 开启纵向滚动
                    specialEnd: true
                    // 开启特殊滑动结束事件触发机制
                });

                /**
                 * 监听滑动结束事件
                 */
                iscroll.on('scrollEnd', function () {
                    that.setPosition(this, that.type);
                });
                obj.to && iscroll.scrollTo(0, obj.to * that.ops.singleLiHeight);
                that.scrollArr.push(iscroll);
            }
        },

        /**
         * 设置位置，用来在滚动操作结束后滚动到指定的位置，使年月日显示的位置正好垂直居中
         * @param is 当前滚动实例
         */
        setPosition: function (is) {
            var that = this, $is = $(is.wrapper);
            var st = Math.round(is.y / that.ops.singleLiHeight);
            is.scrollTo(0, st * that.ops.singleLiHeight, 200);
            $is.find('li').removeClass();
            var $nowLi = $is.find('li').eq(Math.abs(st) + 2), parent = $is.closest('.blue_dateBox');
            $nowLi.addClass('active');
            parent.attr('data-val', $nowLi.attr('data-val'));
            that.specailDisplayContent(parent.index());
        },

        /**
         * 特殊内容变化，即当滚动实例完全停止之后，月份或者日期应该随着选择的年月变化，如选择了2月，日选择器要只到28天，其他的隐藏掉
         */
        specailDisplayContent: function (idx) {
            var that = this;
            var box, obj;
            // 如果是年
            if (idx === 0) {
                // 获取月份容器
                box = that.arr.eq(1);
                // 当前年是不是等于默认的年份
                if (parseInt(that.arr.eq(0).attr('data-val')) === parseInt(yearNow)) {
                    obj = that.getLiContent(monthNow, 1, monthNow, '月');
		            box.attr('data-val', monthNow);
                } else {
                    obj = that.getLiContent(12, 1, 12, '月');
                    box.attr('data-val', '12');
                }
                box.find('ul').html(obj.html);
                that.scrollArr[1].refresh();
                that.scrollArr[1].scrollTo(0, 0);
            }
        },

        /**
         * 设置显示内容
         * @param index 显示内容的索引，0表示年，1表示月，2表示日
         * @param box 当前年月日选择器中的一个的父节点
         * @param type
         * @param specialType
         * @returns {*|{html, to}|{html: string, to: *}}
         */
        setDisplayContent: function (index, box) {
            var that = this;
            var obj = that.normalHandle(index);
            box.attr('data-val', obj.now.toString());
            return that.getLiContent(obj.def, obj.l, obj.now, obj.unit);
        },

        /**
         * 获取年月日的当前值以及结束值和单位
         * @param index
         * @returns {{def: *, l: *, now: *, unit: *}}
         */
        normalHandle: function (index) {
            var def, l, now, unit, that = this;
            switch (index) {
                case 0:
                    def = yearNow;
                    l = that.ops.yearRange.split('-')[0];
                    now = that.ops.defaultYear;
                    unit = '年';
                    break;
                case 1:
                    def = that.ops.defaultYear == yearNow ? monthNow : 12;
                    l = 1;
                    now = that.ops.defaultMonth;
                    unit = '月';
                    break;
            }
            return {def: def, l: l, now: now, unit: unit};
        },

        /**
         * 设置年月日选择器中的li显示内容
         * @param def 默认开始值
         * @param l 最后的值
         * @param now 当前要显示的值
         * @param unit 单位
         * @returns {{html: string, to: *}} 返回值，html为li的字符串集合，to为到达当前要显示的值需要的单位距离
         */
        getLiContent: function (def, l, now, unit) {
            var str = '<li></li><li></li>', i = 0, to;
            for (var j = def; j >= l; j--) {
                var dataVal = j < 10 ? '0' + j.toString() : j.toString();
                str += '<li data-val="' + dataVal + '" class="' + (j === now ? 'active' : '') + '">' + dataVal + unit + '</li>';
                if (j === now) {
                    to = i;
                }
                i--;
            }
            str += '<li></li><li></li>';
            return {html: str, to: to};
        },

        /**
         * 刷新iscroll滚动实例
         */
        refresh: function () {
            var that = this;
            var l = that.scrollArr.length;
            for (var i = 0; i < l; i++) {
                that.scrollArr[i].refresh();
            }
        },

        /**
         * 显示处理
         */
        show: function () {
            var that = this;
            if (that.con.is(':hidden')) {
                // 如果隐藏
                that.con.show();
                // 显示选择器
                that.refresh();
                // 重新刷新该选择器的所有iscroll滚动实例
            }
        },

        /**
         * 隐藏处理
         */
        hide: function () {
            this.con.is(':visible') && this.con.hide();
        },

        /**
         * 获取当前选择的日期或者时间
         * @returns {string}
         */
        getDate: function () {
            var that = this;
            return that.arr.eq(0).attr('data-val') + that.arr.eq(1).attr('data-val');
        }
    };

    /**
     * 日期与时间选择主类
     * @param ops
     * @constructor
     */
    function DateAndTimeSelect(ops) {
        this.setting = setting;

        /**
         * 选择器的类型
         * @type {{SELET_TYPE_DATE: string, SELET_TYPE_TIME: string}} date表示该选择器为日期选择器，time表示该选择器为日期选择器
         */
        this.dateOrTimeObj = {
            date: undefined,
            time: undefined
        };
        this.options = {
            type: '',
            // 特殊类型，表示一些集团需要特殊的处理时间方式，jiaju是家具需求
            yearRange: '2014-2016',
            // 年份限制
            singleLiHeight: 34,
            // 单个选项的css高度，用于后面的位置计算
            maxLimit: false,
            // 是否开启最大值为当前日期开关
            defaultYear: new Date().getFullYear(),
            defaultMonth: new Date().getMonth() + 1,
            // 默认显示的日期，！！！请传入时间戳
            dateCancelFunc: undefined,
            // 取消按钮事件处理
            dateConfirmFunc: undefined,
            // 日期确定按钮事件处理
        };
        for (var o in ops) {
            if (ops.hasOwnProperty(o)) {
                this.options[o] = ops[o];
            }
        }
    }

    DateAndTimeSelect.prototype = {

        /**
         *  显示选择器
         * @param type 选择器类型
         */
        show: function (type) {
            var that = this;
            if (that.dateOrTimeObj[type]) {
                that.dateOrTimeObj[type].show();
            } else {
                that.dateOrTimeObj[type] = new SelectorClass(type, that.options);
            }
        },

        /**
         * 隐藏指定选择器
         * @param type 指定类型，日期或者时间选择器
         */
        hide: function (type) {
            var that = this;
            if (that.dateOrTimeObj[type]) {
                that.dateOrTimeObj[type].hide();
            } else {
                that.dateOrTimeObj[type] = new SelectorClass(type, that.options);
            }
        }
    };
    return DateAndTimeSelect;
})
;

