define('modules/tongji/benchDetail', ['jquery','chart/line/5.0.0/line', 'chart/line/5.0.1/line',
        'chart/horizontalHistogram/2.0.0/horizontalHistogram', 'datePicker/1.0.2/datePicker'],
    function (require, exports, module) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 实现画折线图的类库
        // var Line = require('chart/line/5.0.0/line');
        // 统计分析v1.3新增的按周按月走势图
        var newLine = require('chart/line/5.0.1/line');
        // 日期选择器类,用于选择开始日期到结束日期
        var DatePicker = require('datePicker/1.0.2/datePicker');
        // 实现画水平柱状图的类库
        var horizontalHistogram = require('chart/horizontalHistogram/2.0.0/horizontalHistogram');
        module.exports = function () {
            // 获取页面传过来的数据赋值给vars以供之后的操作使用
            $('input[type=hidden]').each(function () {
                var $this = $(this);
                vars[$this.attr('data-id')] = $this.val();
            });

            // jquery对象获取并声明变量索引以供
            // 由高到低排序
            var $sort = $('#sort'),
            // 排序列表
                $sortList = $('#sortList'),
            // 图表按钮切换
                $frSlider = $('.fr-slider'),
            // 图形实例索引
                chart,
                cityChart,
            // 统计图
                $chart = $('#chart'),
            // 城市数据统计图
                $cityChart = $('#cityChart'),
            // 统计表
                $graphTable = $('.graph-table'),
            // 日线、周线、月线
                $tabBtn2 = $('.graph-title');
             // 城市没有数据显示节点
            var $cityNoDataShow = $('.noDataCity'),
            // 城市正在加载数据的提示
                $cityLoading = $('.loadingCity');
            // 没有数据显示节点
            var $noDataShow = $('#noDataShow'),
            // 正在加载数据的提示
                $loading = $('#loading');

            // 引入requestanimationframe兼容性js
            require.async(vars.public + 'js/requestanimationframe.js', function () {
                var openClass = 'js_open';

                var content = $('#content'),
                    cityButton = $('.bar2'),
                    timeButton = $('#date'),
                    celenderButton = $('.cycle'),
                    timeMask = $('#dateList'),
                    cityMenu = $('.c-switch');

                var citySelector = cityMenu.find('a'),
                    timeSelector = timeMask.find('li');

                var pageRestore = function() {
                    content.show();
                    cityMenu.hide();
                    timeMask.hide();
                    cityButton.removeClass(openClass);
                };
                var datePickerConfig = {
                    dateTxtArrSelector: '.date',
                    yearTxtArrSelector: '.year',
                    confirmBtnSelector: '.right',
                    closeBtnSelector: '.return'
                };

                var param = {
                    starttime: $(datePickerConfig.dateTxtArrSelector).eq(0).attr('data-date'),
                    endtime: $(datePickerConfig.dateTxtArrSelector).eq(1).attr('data-date'),
                    timeType: '1',
                    sort: '1',
                    chartType: '1',
                    cityname: $('#city').text()
                    //cityname: '全国'
                };

                var datePicker = new DatePicker(datePickerConfig);
                var dayTab = $('.day');
                var weekTab = $('.week');
                var monthTab = $('#month');

                /**
                 * 检查当前选择的时间维度是否可以查看图表
                 */
                function checkDateChart() {
                    var $day = $('#day');
                    var $week = $('#week');
                    var days = GetDateDiff(param.starttime, param.endtime);
                    dayTab.show();
                    weekTab.show();
                    if(param.chartType === '1') {
                        $chart.empty();
                        if(days < 30){
                            $day.addClass('on').siblings('a').removeClass('on');
                            param.timeType = '1';
                        }
                        if(days >= 30) {
                            $week.addClass('on').siblings('a').removeClass('on');
                            dayTab.hide();
                            param.timeType = '2';
                        }
                        if(days >= 90) {
                            monthTab.addClass('on').siblings('a').removeClass('on');
                            weekTab.hide();
                            param.timeType = '3';
                        }
                    }
                    $tabBtn2.attr('data-flag', param.timeType);
                }

                // 时间选择，请求
                datePicker.setConfirmFun(function(start, end) {
                    param.starttime = start;
                    param.endtime = end;
                    checkDateChart();
                    getInfoAndDraw();
                    getCityInfo();
                });


                // 城市选择，请求
                citySelector.on('click', function() {
                    // console.log(this.dataset.cityid, '请求');
                    var city = $(this).text();
                    param.cityname = encodeURIComponent(city);
                    getInfoAndDraw();
                    getCityInfo();

                    cityButton.text(city);
                    timeMask.trigger('click');
                    window.scrollTo(0, 0);
                });

                /**
                 * 日期之间的时间间隔
                 * @param startDate 开始日期
                 * @param endDate 结束日期
                 * @returns {number} 时间间隔天数
                 * @constructor
                 */
                function GetDateDiff(startDate,endDate)
                {
                    var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
                    var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
                    return Math.abs((startTime - endTime))/(1000 * 60 * 60 * 24);
                }

                // 时间段选择，请求
                timeSelector.on('click', function() {
                    //dayTab.show();
                    //weekTab.show();
                    //if($(this).text() === '本年') {
                    //    dayTab.hide();
                    //    weekTab.hide();
                    //    param.timeType = '3';
                    //    $tabBtn2.attr('data-flag', param.timeType);
                    //}
                    checkDateChart();
                    var time = setTime(this.dataset.type);
                    param.starttime = time.start;
                    param.endtime = time.end;
                    getInfoAndDraw();
                    getCityInfo();

                    timeButton.text($(this).text());
                    timeMask.trigger('click');
                });

                celenderButton.on('click', function() {
                    datePicker.show();
                });

                cityButton.on('click', function() {
                    var jqThis = $(this);
                    if (jqThis.hasClass(openClass)) {
                        pageRestore();
                    } else {
                        jqThis.addClass(openClass);
                        content.hide();
                        cityMenu.show();
                    }
                });


                timeButton.on('click', function() {
                    pageRestore();
                    timeMask.show();
                });


                timeMask.on('click', function() {
                    pageRestore();
                    $(this).hide();
                });

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
                    };

                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
                    }

                    for (var k in o) {
                        if (new RegExp('(' + k + ')').test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                        }
                    }
                    return format;
                };


                /**
                 * 根据本周本月按钮切换选项设置时间段
                 * @param type 切换的类型,,1为今天,2为本周，3为本月,4为本年
                 */
                function setTime(type) {
                    var dateFormatStr = 'yyyy-MM-dd';
                    var now = new MyDate();
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
                            start = start;
                            end = end;
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
                            end = end;
                            break;
                        case 3:
                            start = new MyDate(year, month, 1).format(dateFormatStr);
                            end = new MyDate(year, month + 1, 0).format(dateFormatStr);
                            break;
                        case 4:
                            start = new MyDate(year, 0, 1).format(dateFormatStr);
                            end = new MyDate(year, 11, 31).format(dateFormatStr);
                            break;
                    }

                    var dateTxt = $(datePickerConfig.dateTxtArrSelector),
                        yearTxt = $(datePickerConfig.yearTxtArrSelector),
                        startSplit = start.split('-');
                    var end = now.format(dateFormatStr),
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

                // 隐藏排序列表
                $('.sortCancel').on('click', function () {
                    $sortList.hide();
                });
                // 城市数据表部分
                var citySection = $('.count-lists');
                var graphBox = $('.graph-type');
                // 图表的ajax请求 防止快速切换
                var ajaxObj;
                // 切换图、表
                $frSlider.on('click', 'span', function () {
                    var $this = $(this);
                    if($this.hasClass('on')) {
                        return;
                    }
                    //ajaxObj.abort();
                    $chart.find('canvas').remove();
                    $this.toggleClass('on').siblings('span').removeClass('on');
                    param.chartType = $this.attr('data-type');
                    graphBox.toggle();
                    citySection.toggle();
                    // 表格的时候不显示城市图
                    $graphTable.toggle();
                    $chart.toggle();
                    if($this.text() === '表') {
                        param.timeType = '1';
                    } else {
                        checkDateChart();
                        param.timeType = $tabBtn2.attr('data-flag');
                    }
                    getInfoAndDraw();
                });

                /**
                 * 走势图按天/按周/按月切换事件
                 */
                $tabBtn2.on('click', 'a', function () {
                    if (param.chartType === '2') {
                        return;
                    }
                    var $this = $(this);
                    chart = undefined;
                    $chart.find('canvas').remove();
                    $this.addClass('on').siblings().removeClass('on');
                    var timeType = $this.attr('data-timeType');
                    param.timeType = timeType;
                    $tabBtn2.attr('data-flag', timeType);
                    getInfoAndDraw();
                });
                // 由高到低排序
                $sort.click(function () {
                    $sortList.toggle();
                });

                // 排序的列表点击事件
                $sortList.on('click', 'li', function () {
                    var $this = $(this);
                    param.sort = $this.attr('data-sort');
                    getCityInfo(function () {
                        //window.scrollTo(0,$sort.offset().top);
                    });
                    $sortList.hide();
                    $sort.text($this.text());
                });


                // 加载更多按钮
                var $dataMore = $('#dataMore');
                // 表格数据展开
                $dataMore.on('click', function () {
                    var tr = $graphTable.find('tr:hidden');
                    for (var i= 0;i<7;i++) {
                        tr.eq(i) && tr.eq(i).show();
                    }
                    if($graphTable.find('tr:hidden').length === 0) {
                        $dataMore.hide();
                    }
                });

                /**
                 * 获取月份数据
                 * @param data
                 * @returns {Array}
                 */
                function getMonthData(data) {
                    var selData = [];
                    for(var i = 0; i < data.length; i++) {
                        var obj = {};
                        obj.name = data[i]['name'].split('.')[0];
                        obj.value = data[i]['value'];
                        obj.isShow = '1';
                        selData.push(obj);
                    }
                    return selData;
                }

                var winW = $('.main').width() - 5;
                var $sumamount = $('#sumamount'),
                    // 环比
                    $hunbi = $('#hunbi'),
                    // 同比
                    $tongbi = $('#tongbi');
                    // 表格数据表
                var $dataTable = $('#dataTable');

                /**
                 * 资源加载显示提示函数
                 * @param type 1 代表城市图表 默认是
                 */
                function loadingShow(type) {
                    if(type === '1') {
                        $cityChart.css('visibility', 'hidden');
                        $cityLoading.show();
                    } else {
                        $dataTable.hide();
                        $chart.hide();
                        $loading.show();
                    }
                }

                /**
                 * 资源加载隐藏提示函数
                 * @param type 1 代表城市图表
                 */
                function loadingHide(type) {
                    if(type === '1') {
                        //$cityChart.show();
                        $cityChart.css('visibility', 'visible');
                        $cityLoading.hide();
                    } else {
                        $chart.show();
                        $loading.hide();
                    }
                }

                /**
                 * 没有返回数据或者数据异常显示暂无数据
                 * @param type 1 代表城市图表
                 */
                function noDataShow(type) {
                    var chartCanv = $chart.find('canvas');
                    var tableTr = $dataTable.find('tr');
                    if(chartCanv.length > 0 || tableTr.length > 1) {
                        return;
                    }
                    if(type === '1') {
                        if ($cityNoDataShow.is(':hidden')) {
                            cityChart = undefined;
                            $cityChart.find('canvas').remove();
                            $cityNoDataShow.show();
                        }
                    } else {
                        if ($noDataShow.is(':hidden')) {
                            chart = undefined;
                            chartCanv.remove();
                            tableTr.remove();
                            $dataMore.hide();
                            $noDataShow.show();
                        }
                    }
                }

                /**
                 * ajax调用获取折线图或者柱状图
                 */
                function getInfoAndDraw() {
                    $noDataShow.hide();
                    loadingShow();
                    var url = vars['tongjiSite'] + '?c=tongji&a=ajaxGetCTData&query=1';
                    var ajaxData = {
                        type : vars.type,
                        fr: vars.fr,
                        userid : vars.userid,
                        encrypystr: vars.encrypystr,
                        starttime: param.starttime,
                        endtime: param.endtime,
                        char:  param.chartType,
                        timeType: param.timeType,
                        // 当前城市
                        cityname: param.cityname
                    };
                    ajaxObj = $.ajax({
                        url: url,
                        data: ajaxData,
                        success: function (response) {
                            if (response && response !== '0') {
                                $sumamount.text(response['sumamount'] || '——');
                                $hunbi.text(response['chaingrowth'] || '——');
                                $tongbi.text(response['yearonyeargrowth'] || '——');
                                var data = response['amountlist'] || [];
                                var l = data.length;
                                if(l === 0) {
                                    loadingHide();
                                    noDataShow();
                                    return;
                                }
                                // 展示内容类型 图为1，表为2
                                var char = response['char'];
                                loadingHide();
                                if(char === '2' && param.chartType === '2') {
                                    $dataTable.find('tr').remove();
                                    $dataTable.show();
                                    $dataMore.show();
                                    if(l <= 7) {
                                        $dataMore.hide();
                                    }
                                    $dataTable.append($('<tr id="title"><th>日期</th><th>成交表单</th></tr>'));
                                    for(var i = 0; i < l; i++) {
                                        var $tr = $('<tr><td>' + data[i]['name'] + '</td><td>' + data[i]['value'] + '</td></tr>');
                                        if(i >= 7){
                                            $tr.hide();
                                        }
                                        $dataTable.append($tr);
                                    }
                                } else if(char === '1' && param.chartType === '1'){
                                    if (param.timeType === '1') {
                                        chart = new newLine({id: '#chart', width: winW, dataArr: data});
                                    } else if(param.timeType === '2'){
                                        chart = new newLine({id: '#chart', width: winW, dataArr: data});
                                    } else {
                                        chart = new newLine({id: '#chart', width: winW, dataArr:  getMonthData(data)});
                                    }
                                    $chart.find('div').css('width', '100%');
                                    $chart.find('div').css('height', '100%');
                                    chart.iscroll && chart.iscroll.refresh();
                                    chart.run();
                                }
                            } else {
                                loadingHide();
                                noDataShow();
                            }
                        },
                        error: function () {
                            noDataShow();
                        }
                    });
                }

                /**
                 * ajax调用获取城市图表
                 * @param callback
                 */
                function getCityInfo(callback) {
                    $cityNoDataShow.hide();
                    loadingShow('1');
                    var url = vars['tongjiSite'] + '?c=tongji&a=ajaxGetBankData&query=1';
                    var ajaxData = {
                        type : vars.type,
                        sort : param.sort,
                        fr: vars.fr,
                        userid : vars.userid,
                        encrypystr: vars.encrypystr,
                        starttime: param.starttime,
                        endtime: param.endtime,
                        // 当前城市
                        cityname: param.cityname
                    };
                    $.ajax({
                        url: url,
                        data: ajaxData,
                        success: function (response) {
                            $cityChart.empty();
                            if (response && response !== '0') {
                                var data = response['amountlist'] || [];
                                var l = data.length;
                                if(l === 0) {
                                    loadingHide('1');
                                    noDataShow('1');
                                    return;
                                }
                                loadingHide('1');
                                cityChart = new horizontalHistogram({
                                    id: '#cityChart',
                                    width: winW,
                                    dataArr: data
                                });
                                cityChart.run();
                                callback && callback();
                            } else {
                                loadingHide('1');
                                noDataShow('1');
                            }
                        },
                        error: function () {
                            noDataShow('1');
                        }
                    });
                }
                // 无数据时刷新
                $('.refreshing').on('click', function () {
                    var $this = $(this);
                    if($this.attr('aria-flag') === '1') {
                        // 刷新城市数据
                        getCityInfo();
                    } else {
                        // 刷新图表数据
                        getInfoAndDraw();
                    }
                    
                });
                //  !!!!!页面初始化时调用ajax已获取第一次的数据!!!!!
                getInfoAndDraw();
                getCityInfo();
            });
        }
    });