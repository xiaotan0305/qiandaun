/*
 * @file: 家居 CRM wap 首页，切换条件逻辑
 * @author: yangfan
 * @Create Time: 2016-12-27 18:58:02
 */
define('modules/tongji/bench', [
    'jquery',
    'datePicker/1.0.2/datePicker'
], function(require, exports, module) {
    'use strict';
    module.exports = function() {
        var $ = require('jquery');
        // 日期选择器类，用于选择开始日期到结束日期
        var DatePicker = require('datePicker/1.0.2/datePicker');

        var vars = seajs.data.vars;

        // 消除魔术字符串，统一 openClass
        var openClass = 'js_open';

        /**
         * content: 内容区域
         * cityButton: 城市选择开关
         * timeButton: 时间段选择开关
         * celenderButton: 时间选择开关
         * collapseButton: 展开收起开关
         * list: 数据列表
         * timeMask: 时间段容器
         * maskCloseButton: 关闭按钮
         * cityMenu: 城市列表容器
         * citySelector: 确定城市选择
         * timeSelector: 确定时间段选择
         */

        var content = $('#content'),
            cityButton = $('.bar2'),
            timeButton = $('.bar1'),
            celenderButton = $('.cycle'),
            collapseButton = $('.countTitle'),
            maskCloseButton = $('.return, .cancel'),
            count_list = $('.count-list'),
            timeMask = $('.floatbg'),
            cityMenu = $('.c-switch');

        var citySelector = cityMenu.find('a'),
            timeSelector = timeMask.find('li'),
            list = count_list.find('.cate-num'),
            hrefs = count_list.find('a');

        /**
         * 重置页面方法：显示内容区域，隐藏其他容器
         */
        var pageRestore = function() {
            content.show();
            cityMenu.hide();
            timeMask.hide();
            cityButton.removeClass(openClass);
        }

        /**
         * 日期选择插件配置：日期文字选择器，年文字选择器，确定日期选择按钮，关闭日期选择按钮
         */
        var datePickerConfig = {
            dateTxtArrSelector: '.date',
            yearTxtArrSelector: '.year',
            confirmBtnSelector: '.right',
            closeBtnSelector: '.return'
        };

        /**
         * 请求数据参数列表
         */
        var param = {
            userid: $('#userid').val(),
            encrypystr: $('#encrypystr').val(),
            query: 1,
            cityname: encodeURIComponent(cityButton.text()),
            starttime: $(datePickerConfig.dateTxtArrSelector).eq(0).attr('data-date'),
            endtime: $(datePickerConfig.dateTxtArrSelector).eq(1).attr('data-date')
        }

        /**
         * 更新数据 jq对象 列表：签约数、实收款
         */
        var contractamount  = {
            adverse: list.eq(0),
            channel: list.eq(1),
            port: list.eq(2)
        }, collectionamount = {
            adverse: list.eq(3),
            channel: list.eq(4),
            port: list.eq(5)
        };

        /**
         * Ajax 更新首页数据
         */
        var request = function() {
            var url = vars.tongjiSite + '?c=tongji&a=bench';
            $.get(url, param, function(data) {
                contractamount.adverse.text(data.contractamount.adverse);
                contractamount.channel.text(data.contractamount.channel);
                contractamount.port.text(data.contractamount.port);
                collectionamount.adverse.text(data.collectionamount.adverse);
                collectionamount.channel.text(data.collectionamount.channel);
                collectionamount.port.text(data.collectionamount.port);
            })
        }

        /**
         * 创建日期插件
         * 设置确定按钮回调方法
         */
        var datePicker = new DatePicker(datePickerConfig);

        datePicker.setConfirmFun(function(start, end) {
            param.starttime = start;
            param.endtime = end;

            request();
        });

        /**
         * 城市切换，更新请求城市参数
         * 替换链接跳转地址
         */
        citySelector.on('click', function() {
            // console.log(this.dataset.cityid, '请求');
            var city = $(this).text();
            param.cityname = encodeURIComponent(city);
            request();

            cityButton.text(city);
            timeMask.trigger('click');

            hrefs.each(function(i, x){
                var url = replaceUrlQuery(x.href, 'cityname', param.cityname);
                this.href = url;
                // console.log(this.href);
            })
        });


        /**
         * 时间段切换，更新请求时间参数
         */
        timeSelector.on('click', function() {
            var time = setTime(this.dataset.type);
            param.starttime = time.start;
            param.endtime = time.end;

            request();

            timeButton.text($(this).text());
            timeMask.trigger('click');
        });


        /**
         * 打开时间插件
         */
        celenderButton.on('click', function() {
            datePicker.show();
        })

        /**
         * 打开城市列表
         */
        cityButton.on('click', function() {
            var jqThis = $(this);
            if (jqThis.hasClass(openClass)) {
                pageRestore();
            } else {
                jqThis.addClass(openClass)
                content.hide();
                cityMenu.show();
            }
        });

        /**
         * 首页数据手风琴效果，模拟 bootstrap
         */
        collapseButton.on('click', function() {
            var jqThis = $(this);
            if (jqThis.hasClass(openClass)) {
                return false;
            }
            jqThis.addClass(openClass);
            var c = jqThis.next(),
                a = jqThis.find('a');
            //展开
            if (a.hasClass('cur')) {
                a.removeClass('cur');

                c.removeClass('collapse').addClass('collapsing').height(0);

                c.height(c[0].scrollHeight).one('transitionend webkitTransitionEnd', function() {
                    c.removeClass('collapsing').addClass('collapse in').height('');
                    jqThis.removeClass(openClass);
                });
            } else {
                a.addClass('cur');

                c.height(c.height());

                c.addClass('collapsing').removeClass('collapse in');

                c.height(0).one('transitionend webkitTransitionEnd ', function() {
                    c.removeClass('collapsing').addClass('collapse');
                    jqThis.removeClass(openClass);
                });
            }
        });

        /**
         * 打开时间段选择容器
         */
        timeButton.on('click', function() {
            pageRestore();
            timeMask.show();
        });

        /**
         * 关闭时间段选择容器
         */
        timeMask.on('click', function() {
            pageRestore();
            $(this).hide();
        });

        /**
         * 为 window.Date 绑定 format 方法。
         */
        var MyDate = window.Date;

        /**
         * //使用方法
            new Date().format("yyyy-MM-dd hh:mm:ss");
            new Date().format("YYYY年MM月dd日hh小时mm分ss秒");
            new Date().Format("yyyy年MM月dd日");
            new Date().Format("MM/dd/yyyy");
            new Date().Format("yyyyMMdd");
            new Date().Format("yyyy-MM-dd hh:mm:ss");
         * @param  {[type]} format [description]
         * @return {[type]}        [description]
         */
        MyDate.prototype.format = function(format) {
            var o = {
                'M+': this.getMonth() + 1, //month
                'd+': this.getDate(), //day
                'h+': this.getHours(), //hour
                'm+': this.getMinutes(), //minute
                's+': this.getSeconds(), //second
                'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
                'S': this.getMilliseconds() //millisecond
            }

            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                }
            }
            return format;
        }


        /**
         * 根据本周本月按钮切换选项设置时间段
         * @param type 切换的类型,,1为今天,2为本周，3为本月,4为本年
         */
        function setTime(type) {
            var now = new MyDate(),
                dateFormatStr = 'yyyy-MM-dd';
            var year = now.getFullYear(),
                month = now.getMonth(),
                day = now.getDate(),
                week = now.getDay(); // 0 为周日
            var start = now.format(dateFormatStr),
                end = now.format(dateFormatStr);

            switch (+type) {
                case 0:
                    day = day - 1;
                    start = new MyDate(year, month, day).format(dateFormatStr);
                    end = new MyDate(year, month, day).format(dateFormatStr);
                    break;
                case 1:
                    break;
                case 2:
                    // 判断周末时置为6，则周一到周日依次减去0-6，算出当天所在本周的星期一时间
                    // 本周不能大于今天
                    if (!week) {
                        start = new MyDate(year, month, day - 6).format(dateFormatStr);
                    } else {
                        day = day - (week - 1);
                        start = new MyDate(year, month, day).format(dateFormatStr);
                        // end = new MyDate(year, month, day + 6).format(dateFormatStr);
                    }
                    break;
                case 3:
                    start = new MyDate(year, month, 1).format(dateFormatStr);
                    // end = new MyDate(year, month + 1, 0).format(dateFormatStr);
                    break;
                case 4:
                    start = new MyDate(year, 0, 1).format(dateFormatStr);
                    // end = new MyDate(year, 11, 31).format(dateFormatStr);
                    break;
            }

            var dateTxt = $(datePickerConfig.dateTxtArrSelector),
                yearTxt = $(datePickerConfig.yearTxtArrSelector),
                startSplit = start.split('-'),
                endSplit = end.split('-');

            yearTxt.eq(0).text(startSplit[0] + '年');
            yearTxt.eq(1).text(endSplit[0] + '年');

            dateTxt.eq(0).text(startSplit[1] + '月' + startSplit[2] + '日').attr('data-date', start);
            dateTxt.eq(1).text(endSplit[1] + '月' + endSplit[2] + '日').attr('data-date', end);

            return {
                start: start,
                end: end
            }
        }

        // URL参数取得
        function replaceUrlQuery(url, query, value) {
            // var reg = new RegExp('(^|&)'+ query +'=([^&]*)(&|$)');
            var reg = new RegExp('(\\?|^|&|\#)'+ query +'=([^&|^#]*)(&|$|#)', 'i');
            var r = window.location.search.substr(1).match(reg);
            // console.log(RegExp.$1, RegExp.$2, RegExp.$3, r);
            if (r != null) {
                var u = url.replace(reg, '$1'+ query + '=' + value + '$3' );
                return u;
                // return unescape(r[2]);
            }
            return false;
        }

        //点击箭头 列表消失或者隐藏 by liuying
        // var c  = $('.countTitle');
        // c.on('click', function(){
        //     if ($(this).children('a').hasClass('cur')) {
        //         $(this).children('a').removeClass('cur');
        //         $(this).next().show();
        //     } else {
        //         $(this).children('a').addClass('cur');
        //         $(this).next().hide();
        //     }
        // })
    }
});
