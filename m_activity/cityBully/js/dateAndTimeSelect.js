/**
 * 日期选择及时间选择插件
 * by blue
 */
(function (w, f) {
    if (typeof define === 'function') {
        // AMD
        define('dateAndTimeSelect/1.0.0/dateAndTimeSelect', ['iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
            return f(w, require);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = f(w);
    } else {
        // browser global
        window.DateAndTimeSelect = f(w);
    }
})(window, function (w, require) {
    var $ = w.jQuery;
    /**
     * 判断是否加载了jquery
     */
    if (!$) {
        console.log("no load jquery!");
    }
    /**
     * 判断是通过seajs加载方式还是页面直接引用
     * ！！！这里需要注意当使用seajs模块加载时，因为用到了iscroll插件所以要通过require方式引入
     */
    var IScrollLite = w.IScrollLite ? w.IScrollLite : (w.IScroll ? w.IScroll : require('iscroll/2.0.0/iscroll-lite'));
    /**
     * 选择器的html字符串
     * @type {string}
     */
    var dateHtml = '<div class="blue_dataSelectCon">' +
        '<ul class="blue_operateCon">' +
        '<li><a href="javascript:void(0);">取消</a></li>' +
        '<li><a href="javascript:void(0);">确定</a></li>' +
        '</ul>' +
        '<div class="blue_selectCon">' +
        '<div class="blue_select">' +
        '<div class="blue_dateBox"><ul></ul></div>' +
        '<div class="blue_dateBox"><ul></ul></div>' +
        '<div class="blue_dateBox"><ul></ul></div>' +
        '</div>' +
        '<div class="blue_selectMask"></div>' +
        '</div>' +
        '</div>';
    /**
     * 设置声明，表示选择器的类型
     * @type {{SELET_TYPE_DATE: string, SELET_TYPE_TIME: string}}
     */
    var setting = {
        SELET_TYPE_DATE: "date",//表示为日期选择器
        SELET_TYPE_TIME: "time"//表示为时间选择器
    };

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
            that.defalutTime = new Date(that.ops.defaultTime);//获取默认时间，通过传入的时间戳转化为时间对象以便于之后取得年月日等信息
            that.con = $(dateHtml);//实例选择器的html字符串转化为jquery对象
            if (that.ops.type == "birth") {
                that.con.find(".blue_operateCon").append('<li><a href="javascript:void(0);">保密</a></li>');
            }
            that.arr = that.con.find(".blue_dateBox");
            //获取所有的blue__datebox类的div，分别为年月日选择器
            that.con.find(".blue_operateCon").on("click", "a", function () {
                var $parent = $(this).parent();
                if ($parent.index() == 0) {
                    if (that.ops[that.type + "CancelFunc"]) {
                        that.ops[that.type + "CancelFunc"](that.getDate());
                    } else {
                        that.hide();//隐藏选择器
                    }
                } else {
                    if (that.ops[that.type + "ConfirmFunc"]) {
                        var date = that.getDate();
                        if ($parent.index() == 2) {
                            date = "1900-1-1";
                        }
                        that.ops[that.type + "ConfirmFunc"](date);
                    } else {
                        that.hide();//隐藏选择器
                    }
                }
            });
            $(document.body).append(that.con);//将选择器的jquery对象实例加入到body中
            that.setShow();//设置显示
        },
        setShow: function () {
            var that = this;
            that.scrollArr = [];//声明iscorll滚动类的实例数组，用来存放iscorll滚动实例
            if (that.type == setting.SELET_TYPE_TIME) {//当为时间时，需要删除一个ul来确保只有两个选择器
                that.arr.eq(2).remove();
                that.arr.splice(2, 1);
            }
            var arrL = that.arr.length;
            /**
             * 循环遍历选择器ul的父类，分别设置各个选择器显示值和默认值
             */
            for (var i = 0; i < arrL; i++) {
                var box = that.arr.eq(i),
                    obj = that.setDisplayContent(i, box, that.type, that.ops.type);
                box.find("ul").html(obj.html);
                /**
                 * 声明iscroll滚动实例
                 */
                var iscroll = new IScrollLite(box[0], {
                    "bindToWrapper": true,//滚动为该节点
                    "scaleX": false,//不可横向滚动
                    "scaleY": true,//开启纵向滚动
                    "specialEnd": true//开启特殊滑动结束事件触发机制
                });
                /**
                 * 监听滑动结束事件
                 */
                iscroll.on("scrollEnd", function () {
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
            $is.find("li").removeClass();
            var $nowLi = $is.find("li").eq(Math.abs(st) + 2), parent = $is.closest(".blue_dateBox");
            $nowLi.addClass("active");
            parent.attr("data-val", $nowLi.attr("data-val"));
            that.specailDisplayContent(parent.index());
        },
        /**
         * 特殊内容变化，即当滚动实例完全停止之后，月份或者日期应该随着选择的年月变化，如选择了2月，日选择器要只到28天，其他的隐藏掉
         * @param idx
         */
        specailDisplayContent: function (idx) {
            var that = this;
            if (idx != 2) {
                if (that.ops.type == "jiaju") {//给予家具选择日期的特殊处理，需要有一个最小日期，且不能够选择小于这个时间的值
                    that.jiajuSetPosition(idx);
                } else {
                    var dayNumber = new Date(that.arr.eq(0).attr("data-val"), that.arr.eq(1).attr("data-val"), 0).getDate();
                    that.arr.eq(2).find("ul li").map(function () {
                        var $this = $(this);
                        if ($this.attr("data-val") && $this.attr("data-val") > dayNumber) {
                            $this.hide();
                        } else {
                            $this.show();
                        }
                        $this.removeClass();
                        if ($this.attr("data-val") == "1") {
                            $this.addClass("active");
                        }
                    });
                    var box = that.arr.eq(2);
                    box.attr("data-val", "1");
                    that.scrollArr[2].refresh();
                    that.scrollArr[2].scrollTo(0, 0);//这里需要注意，要看产品需求是否有必要去重置位置到0
                }
            }
        },
        jiajuSetPosition: function (idx) {
            var that = this;
            if (idx == 0) {
                var box = that.arr.eq(1), obj;
                if (parseInt(that.arr.eq(0).attr("data-val")) == parseInt(that.defalutTime.getFullYear())) {
                    obj = that.setDisplayContent(1, box, that.type, that.ops.type);
                } else {
                    obj = that.getLiContent(1, 12, 1, "月");
                    box.attr("data-val", "1");
                }
                box.find("ul").html(obj.html);
                that.scrollArr[1].refresh();
                that.scrollArr[1].scrollTo(0, 0);
                box = that.arr.eq(2);
                if (parseInt(that.arr.eq(0).attr("data-val")) == parseInt(that.defalutTime.getFullYear())) {
                    obj = that.setDisplayContent(2, box, that.type, that.ops.type);
                } else {
                    obj = that.getLiContent(1, 31, 1, "日");
                    box.attr("data-val", "1");
                }
                box.find("ul").html(obj.html);
                that.scrollArr[2].refresh();
                that.scrollArr[2].scrollTo(0, 0);
            } else if (idx == 1) {
                box = that.arr.eq(2);
                if (parseInt(that.arr.eq(0).attr("data-val")) == parseInt(that.defalutTime.getFullYear()) && parseInt(that.arr.eq(1).attr("data-val")) == parseInt(that.defalutTime.getMonth()) + 1) {
                    obj = that.setDisplayContent(2, box, that.type, that.ops.type);
                } else {
                    obj = that.getLiContent(1, parseInt(new Date(that.arr.eq(0).attr("data-val"), that.arr.eq(1).attr("data-val"), 0).getDate()), 1, "日");
                    box.attr("data-val", "1");
                }
                box.find("ul").html(obj.html);
                that.scrollArr[2].refresh();
                that.scrollArr[2].scrollTo(0, 0);
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
        setDisplayContent: function (index, box, type, specialType) {
            var that = this, obj;
            if (type == setting.SELET_TYPE_TIME) {
                obj = that.normalTimeHandle(index);
            } else {
                if (specialType == "jiaju") {//特殊类型，家具需要特殊处理
                    obj = that.jiajuHandle(index);
                } else {
                    obj = that.normalHandle(index);
                }
            }
            box.attr("data-val", obj.now.toString());
            return that.getLiContent(obj.def, obj.l, obj.now, obj.unit);
        },
        normalHandle: function (index) {
            var def, l, now, unit, that = this;
            switch (index) {
                case 0:
                    def = that.ops.yearRange.split("-")[0];
                    l = that.ops.yearRange.split("-")[1];
                    now = parseInt(that.defalutTime.getFullYear());
                    unit = "年";
                    break;
                case 1:
                    def = 1;
                    l = 12;
                    now = parseInt(that.defalutTime.getMonth()) + 1;
                    unit = "月";
                    break;
                case 2:
                    def = 1;
                    l = parseInt(new Date(that.ops.yearRange.split("-")[0], 1, 0).getDate());
                    now = parseInt(that.defalutTime.getDate());
                    unit = "日";
                    break;
            }
            return {"def": def, "l": l, "now": now, "unit": unit};
        },
        normalTimeHandle: function (index) {
            var def, l, now, unit, that = this;
            switch (index) {
                case 0:
                    def = 0;
                    l = 23;
                    now = parseInt(that.defalutTime.getHours());
                    unit = "点";
                    break;
                case 1:
                    def = 0;
                    l = 59;
                    now = parseInt(that.defalutTime.getMinutes());
                    unit = "分";
                    break;
            }
            return {"def": def, "l": l, "now": now, "unit": unit};
        },
        jiajuHandle: function (index) {
            var def, l, now, unit, that = this;
            switch (index) {
                case 0:
                    def = now = parseInt(that.defalutTime.getFullYear());
                    l = that.ops.yearRange.split("-")[1];
                    unit = "年";
                    break;
                case 1:
                    def = now = parseInt(that.defalutTime.getMonth()) + 1;
                    l = 12;
                    unit = "月";
                    break;
                case 2:
                    def = now = parseInt(that.defalutTime.getDate());
                    l = parseInt(new Date(that.defalutTime.getFullYear(), parseInt(that.defalutTime.getMonth()) + 1, 0).getDate());
                    unit = "日";
                    break;
            }
            return {"def": def, "l": l, "now": now, "unit": unit};
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
            var str = "<li></li><li></li>", i = 0, to;
            for (var j = def; j <= l; j++) {
                str += '<li data-val="' + j.toString() + '" class="' + (j == now ? "active" : "") + '">' + j.toString() + unit + '</li>';
                if (j == now) {
                    to = i;
                }
                i--;
            }
            str += "<li></li><li></li>";
            return {"html": str, "to": to};
        },
        /**
         * 刷新指定iscroll滚动实例
         */
        refresh: function () {
            var that = this;
            var l = that.scrollArr.length;
            for (var i = 0; i < l; i++) {
                that.scrollArr[i].refresh();
            }
        },
        show: function () {
            var that = this;
            if (that.con.is(":hidden")) {//如果隐藏
                that.con.show();//显示选择器
                that.refresh();//重新刷新该选择器的所有iscroll滚动实例
            }
        },
        hide: function () {
            this.con.is(":visible") && this.con.hide();
        },
        getDate: function () {
            var that = this;
            if (that.type == setting.SELET_TYPE_DATE) {
                return that.arr.eq(0).attr("data-val") + "-" + that.arr.eq(1).attr("data-val") + "-" + that.arr.eq(2).attr("data-val");
            }
            return that.arr.eq(0).attr("data-val") + ":" + that.arr.eq(1).attr("data-val");
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
            "date": undefined,
            "time": undefined
        };
        this.options = {
            "type": "",//特殊类型，表示一些集团需要特殊的处理时间方式，jiaju是家具需求
            "yearRange": "2014-2016",//年份限制
            "singleLiHeight": 34,//单个选项的css高度，用于后面的位置计算
            "defaultTime": new Date().getTime(),//默认显示的日期，！！！请传入时间戳
            "dateCancelFunc": undefined,//取消按钮事件处理
            "dateConfirmFunc": undefined,//日期确定按钮事件处理
            "timeCancelFunc": undefined,//取消按钮事件处理
            "timeConfirmFunc": undefined//时间确定按钮事件处理
        };
        for (var o in ops) {
            this.options[o] = ops[o];
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

