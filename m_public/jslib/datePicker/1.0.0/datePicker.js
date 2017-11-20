/**
 * 统计分析二期日期选择器
 * ！！！专为统计二期使用，不是模块，无法复用
 * by blue
 */
define('datePicker/1.0.0/datePicker', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    //jqeruy实例
    var $ = require('jquery'),
    //滑动选择器类
        Iscroll = require('iscroll/2.0.0/iscroll-lite'),
    //页面传参
        vars = seajs.data.vars;
    //设置当前的日期，用来为后面判断今天日期时使用
    vars.date = vars.date || new Date().getTime();
    /**
     * 日期选择
     * @constructor
     */
    function DatePicker() {
        //专门用来标识是开始时间还是结束时间使用的索引值
        this.setting = {
            'START_TIME': 0,
            'END_TIME': 1
        };
        //日期选择容器
        this.con = '';
        //月日选择的ul容器
        this.ulArr = [];
        //ul的个数
        this.ulArrL = 0;
        //半透明背景
        this.bg = '';
        //开始时间和结束时间span的容器
        this.dateTxt = '';
        //确认按钮
        this.confirmBtn = '';
        //定死的年份
        this.year = '2015';
        //显示日期的分割符
        this.delimiter = '-';
        //滑动选择实例数组
        this.iscrollArr = [];
        //单行li节点的高度
        this.singleLiHeight = 30;
        this.confirmFunc = '';
    }

    /**
     * 方法
     * @type {{init: Function, setPosition: Function, show: Function, hide: Function, setPositionByDate: Function}}
     */
    DatePicker.prototype = {
        /**
         * 初始化
         * @param date 要显示的日期，形如'7-12'
         */
        init: function (date) {
            var that = this;
            //获取当前时间
            that.nowTime = new Date(parseInt(vars.date));
            that.con = $('.dateBox');
            that.bg = $('.layer');
            that.dateTxt = $('.dateTxt span');
            that.confirmBtn = $('#sure');
            var showPopType = that.type === that.setting.START_TIME ? '开始' : '结束';
            that.confirmBtn.siblings().html(showPopType);
            /**
             * 背景半透明遮罩绑定点击事件，隐藏日期选择器弹窗
             */
            that.bg.on('click', function () {
                that.con.hide();
                that.bg.hide();
            });
            /**
             * 确认按钮绑定点击事件
             */
            that.confirmBtn.on('click', function () {
                var m = that.ulArr.eq(0).attr('data-val'),
                    d = that.ulArr.eq(1).attr('data-val'),
                    arr;
                //处理如果为开始时间选择时
                if (that.type === that.setting.START_TIME) {
                    arr = that.dateTxt.eq(that.setting.END_TIME).attr('data-date').split(that.delimiter);
                    //选择的月大于今天的月份或者选择月份等于今天的月份并且选择的天数大于今天的天数
                    if (parseInt(m) > parseInt(that.nowTime.getMonth()) + 1 || (parseInt(m) === parseInt(that.nowTime.getMonth()) + 1 && parseInt(d) > parseInt(that.nowTime.getDate()))) {
                        alert('不能选择大于今天的日期！');
                        return;
                    }
                    //选择时间大于结束时间
                    if (parseInt(m) > parseInt(arr[0]) || (m === arr[0] && parseInt(d) > parseInt(arr[1]))) {
                        alert('开始日期不能大于结束日期！');
                        return;
                    }
                    //选择的开始时间和结束时间间隔七天
                    if (vars.chartType === 'line' && m === arr[0] && Math.abs(parseInt(arr[1]) - parseInt(d)) < 6) {
                        alert('时间间隔不能小于7天！');
                        return;
                    }
                }
                //处理如果为结束时间选择时
                if (that.type === that.setting.END_TIME) {
                    arr = that.dateTxt.eq(that.setting.START_TIME).attr('data-date').split(that.delimiter);
                    if (parseInt(m) > parseInt(that.nowTime.getMonth()) + 1 || (parseInt(m) === parseInt(that.nowTime.getMonth()) + 1 && parseInt(d) > parseInt(that.nowTime.getDate()))) {
                        alert('不能选择大于今天的日期！');
                        return;
                    }
                    //选择时间小于结束时间
                    if (parseInt(m) < parseInt(arr[0]) || (m === arr[0] && parseInt(d) < parseInt(arr[1]))) {
                        alert('结束日期不能小于开始日期！');
                        return;
                    }
                    if (vars.chartType === 'line' && m === arr[0] && Math.abs(parseInt(d) - parseInt(arr[1])) < 6) {
                        alert('时间间隔不能小于七天！');
                        return;
                    }
                }
                //把当前选择的时间赋值给显示的span
                if (m.length === 1) {
                    m = '0' + m;
                }
                if (d.length === 1) {
                    d = '0' + d;
                }
                that.dateTxt.eq(that.type).attr('data-date', m + that.delimiter + d);
                //把当前选择的时间赋值给显示的span的显示内容
                that.dateTxt.eq(that.type).html(m + '月' + d + '日');
                //隐藏弹窗
                that.con.hide();
                that.bg.hide();
                if (that.confirmFunc) {
                    that.confirmFunc();
                }
            });
            that.con.show();
            that.bg.show();
            that.ulArr = that.con.find('.blue_dateCon');
            that.ulArrL = that.ulArr.length;
            /**
             * 获取ul并且为其初始化滑动选择器
             */
            for (var i = 0; i < that.ulArrL; i++) {
                var iscroll = new Iscroll(that.ulArr[i], {
                    'bindToWrapper': true,//滚动为该节点
                    'scrollX': false,//不可横向滚动
                    'scrollY': true,//开启纵向滚动
                    'specialEnd': true//开启特殊滑动结束事件触发机制
                });
                /**
                 * 绑定scrollEnd事件，用来确定位置及重置天数
                 */
                iscroll.on('scrollEnd', function () {
                    that.setPosition(this);
                });
                that.iscrollArr.push(iscroll);
            }
            that.setPositionByDate(date);
        },
        setConfirmFun: function (func) {
            if (typeof func === "function") {
                this.confirmFunc = func;
            }
        },
        /**
         * 确定位置及重置天数
         * @param is
         */
        setPosition: function (is) {
            var that = this, $is = $(is.wrapper);
            //获取当前滚动的纵坐标距离除li单行数，用来获取当前位置的li索引
            var st = Math.round(is.y / that.singleLiHeight);
            //设置到正确位置
            is.scrollTo(0, st * that.singleLiHeight, 200);
            //处理当前位置的li的class
            $is.find('li').removeClass();
            var $nowLi = $is.find('li').eq(Math.abs(st) + 3),
                parent = $is.closest('.blue_dateCon');
            $nowLi.addClass('on');
            //将当前滚动选择的时间复制给ul的容器，用来为点击确定按钮后获取值做准备
            var str = $nowLi.html();
            if (str.length === 1) {
                str = '0' + str;
            }
            parent.attr('data-val', str);
            //当选择的是月份时，要通过月份重新获取天数
            if (parent.index() === 0) {
                that.setPositionByDate(str + that.delimiter + '01');
            }
        },
        /**
         * 显示日期选择器
         * @param date 要显示的时间
         * @param type 选择的是开始时间还是结束时间
         */
        show: function (date, type) {
            var that = this;
            if (that.type !== type) {
                that.type = type;
            }
            if (that.con) {
                var showPopType = that.type === that.setting.START_TIME ? '开始' : '结束';
                that.confirmBtn.siblings().html(showPopType);
                that.con.show();
                that.bg.show();
                that.setPositionByDate(date);
            } else {
                that.init(date);
            }
        },
        /**
         * 通过日期重新设置月份和天数的当前位置
         * @param date
         */
        setPositionByDate: function (date) {
            var that = this,
                dateArr = date.split(that.delimiter);
            //获取传入的日期月份的天数
            var totalDayNumber = new Date(that.year, dateArr[0], 0).getDate();
            /**
             * 获取ul中的所有li，判断是否大于了本月最大天数，大于则隐藏，否则显示
             */
            that.ulArr.eq(1).find('ul').children().filter(function () {
                var $this = $(this);
                var day = $this.html();
                if (day && day > totalDayNumber) {
                    $this.hide();
                } else {
                    $this.show();
                }
            });
            /**
             * 根据传入的日期，确定ul位置并刷新滚动选择器
             */
            for (var i = 0; i < that.ulArrL; i++) {
                var ul = that.ulArr.eq(i);
                ul.find('li').removeClass();
                ul.find('li').eq(parseInt(dateArr[i]) + 2).addClass('on');
                ul.attr('data-val', dateArr[i]);
                that.iscrollArr[i].scrollTo(0, -(parseInt(dateArr[i]) - 1) * that.singleLiHeight);
                that.iscrollArr[i].refresh();
            }
        }
    };
    module.exports = DatePicker;
});

