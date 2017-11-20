/**
 * 日期选择类,专为统计分析v1.2版本使用，用于开始日期和结束日期的选择
 * by blue
 * 20151222 blue 增加年份选择 由于显示的年份是两位数的隐去了前面的20，所以这里为了减小程序消耗，以年份后两位计数
 * 20161226 yangfan
 *     1、iScorll 改用 2.0.1
 */
define('datePicker/1.0.2/datePicker', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    // 滑动选择器类
    var iScroll = require('iscroll/2.0.0/iscroll-lite');
    // jqeruy实例
    var $ = require('jquery'),
    // 页面传参
        vars = seajs.data.vars;
    // 通过获取后台传入的真实日期，如果没有则使用本地时间判断今日日期
    var today = vars.date || new Date().getTime();

    /**
     * 格式化数字，将十以内的数字设置为01的形式，前面加0
     * @param n
     * @returns {*}
     */
    function formatNumber(n) {
        if (n.length === 1) {
            n = '0' + n;
        }
        return n;
    }

    /**
     * 日期选择
     * @constructor
     */
    function DatePicker(opts) {

        this.dateBoxClass = opts.dateBoxClass || '.dateBox';
        this.maskClass = opts.maskClass || '.layer';
        this.dateTxtArrClass = opts.dateTxtArrClass || '.dateTxt span';
        this.yearTxtArrClass = opts.yearTxtArrClass || '.year';
        this.confirmBtnClass = opts.confirmBtnClass || '#sure';

        // 年、月、日 列表 ul 的父级 class
        this.ulParentClass = opts.ulParentClass || '.blue_dateCon';
        this.ulClass = opts.ulClass || '.blue_dateCon ul';
        this.currentClass = opts.currentClass || 'on';

        // 单行li节点的高度
        this.singleLiHeight = opts.singleLiHeight || 30;

        // 日期选择容器
        this.con = '';
        // 年月日选择的ul容器
        this.ulArr = [];
        // ul的个数
        this.ulArrL = 0;
        // 半透明背景
        this.bg = '';
        // 开始时间和结束时间span的容器
        this.dateTxtArr = '';
        // 确认按钮
        this.confirmBtn = '';
        // 定死的年份
        // this.year = '2015';
        // 显示日期的分割符
        this.delimiter = '-';
        // 滑动选择实例数组
        this.iScrollArr = [];
        // 点击确认按钮回调函数
        this.confirmFunc = null;
    }

    /**
     * 方法
     * @type {{init: Function, setPosition: Function, show: Function, hide: Function, setPositionByDate: Function}}
     */
    DatePicker.prototype = {

        /**
         * 初始化
         */
        init: function (opts) {
            var that = this;
            that.dateBox = $(that.dateBoxClass);
            that.mask = $(that.maskClass);
            that.dateTxtArr = $(that.dateTxtArrClass);
            that.yearTxtArr = $(that.yearTxtArrClass);
            that.confirmBtn = $(that.confirmBtnClass);
            that.ulParent = $(that.ulParentClass);

            var todayDate = new Date(Number(today));
            // 这里直接获取后两位
            // that.nowYear = Number(todayDate.getFullYear().toString().substr(-2));
            that.nowYear = Number(todayDate.getFullYear().toString());
            that.nowMonth = Number(todayDate.getMonth()) + 1;
            that.nowDay = Number(todayDate.getDate());

            /**
             * 背景半透明遮罩绑定点击事件，隐藏日期选择器弹窗
             */
            that.mask.on('click', function () {
                that.hide();
            });

            /**
             * 确认按钮绑定点击事件
             */
            that.confirmBtn.on('click', function () {
                // 获取当前选择的开始日期月份和天数以及结束日期的月份和天数
                var y = formatNumber(that.ulArr.eq(0).attr('data-val')),
                    m = formatNumber(that.ulArr.eq(1).attr('data-val')),
                    d = formatNumber(that.ulArr.eq(2).attr('data-val')),
                    y1 = formatNumber(that.ulArr.eq(3).attr('data-val')),
                    m1 = formatNumber(that.ulArr.eq(4).attr('data-val')),
                    d1 = formatNumber(that.ulArr.eq(5).attr('data-val')),
                // 显示开始日期的span实例
                    dateTxt = that.dateTxtArr.eq(0),
                // 显示结束日期的span实例
                    dateTxt1 = that.dateTxtArr.eq(1);
                that.yearTxtArr.eq(0).html('20' + y + '年');
                // 设置开始日期的显示及设置传入后台需要的值
                dateTxt.attr('data-date', y + that.delimiter + m + that.delimiter + d).html(m + '月' + d + '日');
                that.yearTxtArr.eq(1).html('20' + y1 + '年');
                // 设置结束日期的显示及设置传入后台需要的值
                dateTxt1.attr('data-date', y1 + that.delimiter + m1 + that.delimiter + d1).html(m1 + '月' + d1 + '日');
                // 隐藏弹窗
                that.hide();
                // 如果存在确认函数的话，执行确认函数
                if (that.confirmFunc) {
                    that.confirmFunc();
                }
            });

            // 初始化时显示日期选择弹窗和背景
            that.dateBox.show();
            that.mask.show();
            // 获取所有的选择器ul的父节点
            that.ulArr = that.dateBox.find(that.ulClass);
            // 获取选择器的个数
            that.ulArrL = that.ulArr.length;

            that.ulParentArr = that.dateBox.find(that.ulParentClass);

            /**
             * 获取ul并且为其初始化滑动选择器
             */
            for (var i = 0; i < that.ulParentArr.length; i++) {
                var is = new iScroll(that.ulParentArr[i], {
                    // 滚动为该节点
                    bindToWrapper: true,
                    // 不可横向滚动
                    scrollX: false,
                    // 开启纵向滚动
                    scrollY: true,
                    // 开启特殊滑动结束事件触发机制
                    specialEnd: true
                });

                /**
                 * 绑定scrollEnd事件，用来确定位置及重置天数
                 */
                is.on('scrollEnd', function () {
                    that.setPosition(this);
                });
                // 将选择器实例储存为数组索引
                that.iScrollArr.push(is);
            }
        },

        /**
         * 设置点击确认按钮后的确认函数
         * @param func
         */
        setConfirmFun: function (func) {
            if (typeof func === 'function') {
                this.confirmFunc = func;
            }
        },

        /**
         * 确定位置及重置天数
         * @param is
         */
        setPosition: function (is) {
            var that = this,
            // 获取当前选择器的jquery对象实例
                $is = $(is.wrapper);
            // 获取当前滚动的纵坐标距离除li单行数，用来获取当前位置的li索引
            var st = Math.round(is.y / that.singleLiHeight);
            // 设置到正确位置
            is.scrollTo(0, st * that.singleLiHeight, 200);
            // 处理当前位置的li的class
            $is.find('li').removeClass();
            var $nowLi = $is.find('li').eq(Math.abs(st) + 3),
                parent = $is.closest(that.ulParentClass);
            $nowLi.addClass(that.currentClass);
            // 将当前滚动选择的时间复制给ul的容器，用来为点击确定按钮后获取值做准备
            var str = formatNumber($nowLi.html());
            parent.attr('data-val', str);
            var y = formatNumber(that.ulArr.eq(0).attr('data-val')),
                m = formatNumber(that.ulArr.eq(1).attr('data-val')),
                d = formatNumber(that.ulArr.eq(2).attr('data-val')),
                y1 = formatNumber(that.ulArr.eq(3).attr('data-val')),
                m1 = formatNumber(that.ulArr.eq(4).attr('data-val')),
                d1 = formatNumber(that.ulArr.eq(5).attr('data-val'));
            that.setPositionByDate(y + that.delimiter + m + that.delimiter + d, y1 + that.delimiter + m1 + that.delimiter + d1);
        },

        /**
         * 显示日期选择器，并通过获取到的开始时间和结束时间重置选择器位置
         */
        show: function () {
            var that = this;
            if (that.dateBox) {
                // 存在即已经初始化完成选择器了，则直接显示弹窗
                that.dateBox.show();
                that.mask.show();
            } else {
                that.init();
            }
            // 获取初始化时的开始时间和结束时间
            var startTime = that.dateTxtArr.eq(0).attr('data-date'),
                endTime = that.dateTxtArr.eq(1).attr('data-date');
            // 通过时间重置选择器位置
            that.setPositionByDate(startTime, endTime);
        },

        /**
         * 隐藏日期选择器
         */
        hide: function () {
            var that = this;
            if (that.dateBox) {
                that.dateBox.hide();
                that.mask.hide();
            }
        },

        /**
         * 设置日期选择器
         * @param start
         * @param end
         */
        setPositionByDate: function (start, end) {
            var that = this,
                startArr = start.split(that.delimiter),
                endArr = end.split(that.delimiter),
                i = 0,
                ul = null,
                idx = -1;
            // 获取传入结束日期月份的总天数
            var startDay = Number(new Date(startArr[0], startArr[1], 0).getDate());
            var endDay = Number(new Date(endArr[0], endArr[1], 0).getDate());
            // = Number(new Date(endArr[0], endArr[1], 0).getDate());
            // 如果结束时间年份大于今日
            // 如果结束时间与今日年份相等，月份大于今日
            // 如果结束时间与今日年份相等，并且月份相等，但是天数大于今日
            // 以上判断均重置时间为今日
            // 否则重置结束的月份总天数为传入的结束时间天数
            if (Number(endArr[0]) > that.nowYear
                || Number(endArr[0]) === that.nowYear && Number(endArr[1]) > that.nowMonth
                || Number(endArr[0]) === that.nowYear && Number(endArr[1]) === that.nowMonth && Number(endArr[2]) > that.nowDay) {
                endArr[0] = that.nowYear;
                endArr[1] = that.nowMonth;
                endArr[2] = that.nowDay;
                endDay = Number(endArr[2]);
            }
            if (Number(endArr[2]) > endDay) {
                endArr[2] = String(endDay);
            }
            // 如果开始时间年份大于结束时间
            // 如果开始时间年份等于结束时间，月份大于结束时间
            // 如果开始时间年份等于结束时间，并且月份相等，但是天数大于结束时间
            // 以上判断均重置时间为结束时间
            // 否则重置开始时间的月份总天数为传入的开始时间天数
            if (Number(startArr[0]) > Number(endArr[0])
                || Number(startArr[0]) === Number(endArr[0]) && Number(startArr[1]) > Number(endArr[1])
                || Number(startArr[0]) === Number(endArr[0]) && Number(startArr[1]) === Number(endArr[1]) && Number(startArr[2]) > Number(endArr[2])) {
                startArr[0] = endArr[0];
                startArr[1] = endArr[1];
                startArr[2] = endArr[2];
                startDay = Number(startArr[2]);
            }
            if (Number(startArr[2]) > startDay) {
                startArr[2] = String(startDay);
            }
            // 开始日期选择器中的年份选择重置显示，大于结束时间年份的都隐藏
            that.ulArr.eq(0).children().each(function () {
                var $this = $(this);
                var day = parseInt($this.html());
                if (day && day > parseInt(endArr[0])) {
                    $this.hide();
                } else {
                    $this.show();
                }
            });
            // 当结束时间和开始时间年份相等时
            if (Number(startArr[0]) === Number(endArr[0])) {
                // 开始日期选择器中的月份选择重置显示，大于结束时间月份的都隐藏
                that.ulArr.eq(1).children().each(function () {
                    var $this = $(this);
                    var day = Number($this.html());
                    if (day && day > Number(endArr[1])) {
                        $this.hide();
                    } else {
                        $this.show();
                    }
                });
                // 月份相等时
                if (Number(startArr[1]) === Number(endArr[1])) {
                    // 开始日期选择器中的天数选择重置显示，大于结束时间天数的都隐藏
                    that.ulArr.eq(2).children().each(function () {
                        var $this = $(this);
                        var day = Number($this.html());
                        if (day && day > Number(endArr[2])) {
                            $this.hide();
                        } else {
                            $this.show();
                        }
                    });
                } else {
                    // 开始日期选择器中的天数选择重置显示，大于开始日期传入的年月得出的天数都隐藏
                    that.ulArr.eq(2).children().each(function () {
                        var $this = $(this);
                        var day = Number($this.html());
                        if (day && day > startDay) {
                            $this.hide();
                        } else {
                            $this.show();
                        }
                    });
                }
            } else {
                // 由于年份不等，月份全部显示
                that.ulArr.eq(1).children().show();
                // 天数只有大于本月天数隐藏即可
                that.ulArr.eq(2).children().each(function () {
                    var $this = $(this);
                    var day = Number($this.html());
                    if (day && day > startDay) {
                        $this.hide();
                    } else {
                        $this.show();
                    }
                });
            }
            // 结束时间年份选择器重置显示，大于今日的年份都隐藏
            that.ulArr.eq(3).children().each(function () {
                var $this = $(this);
                var day = Number($this.html());
                if (day && day > that.nowYear) {
                    $this.hide();
                } else {
                    $this.show();
                }
            });
            // 当结束时间等于今日的年份时
            if (Number(endArr[0]) === that.nowYear) {
                // 结束时间月份选择器重置显示，大于今日的月份都隐藏
                that.ulArr.eq(4).children().each(function () {
                    var $this = $(this);
                    var day = Number($this.html());
                    if (day && day > that.nowMonth) {
                        $this.hide();
                    } else {
                        $this.show();
                    }
                });
                if (Number(endArr[1]) === that.nowMonth) {
                    that.ulArr.eq(5).children().each(function () {
                        var $this = $(this);
                        var day = Number($this.html());
                        if (day && day > that.nowDay) {
                            $this.hide();
                        } else {
                            $this.show();
                        }
                    });
                } else {
                    that.ulArr.eq(5).children().each(function () {
                        var $this = $(this);
                        var day = Number($this.html());
                        if (day && day > endDay) {
                            $this.hide();
                        } else {
                            $this.show();
                        }
                    });
                }
            } else {
                that.ulArr.eq(4).children().show();
                that.ulArr.eq(5).children().each(function () {
                    var $this = $(this);
                    var day = Number($this.html());
                    if (day && day > endDay) {
                        $this.hide();
                    } else {
                        $this.show();
                    }
                });
            }
            var arr = startArr.concat(endArr);
            // 循环遍历开始日期选择设置初始位置及设置初值
            for (; i < that.ulArrL; i++) {
                if (i === 0 || i === 3) {
                    // 年份是15和16这种形式，减去15就变成了第一个空li的索引值，再加上3就是第一个非空li的索引值 (年前面有三个空的li)
                    idx = Number(arr[i]) - 15 + 3;
                } else {
                    // 当是月份和天数时就加上两个li就行
                    idx = Number(arr[i]) + 2;
                }
                ul = that.ulArr.eq(i);
                ul.find('li').removeClass();
                ul.find('li').eq(idx).addClass('on');
                ul.attr('data-val', arr[i]);
            }

            for (var i = 0; i < that.iScrollArr.length; i++) {
                that.iScrollArr[i].refresh();
                that.iScrollArr[i].scrollTo(0, -(idx - 3) * that.singleLiHeight);
            }
        }
    };
    module.exports = DatePicker;
});
