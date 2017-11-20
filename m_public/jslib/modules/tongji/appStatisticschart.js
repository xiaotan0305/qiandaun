/**
 * 统计分析二期走势图和条形图页面js主类
 * by blue
 * 20150825 blue 整理了js代码，将大部分重复性的js取消用数组或者对象索引代替，修改了一些增加内存消耗的jquery指令，增加了点击任何选择弹窗隐藏掉其他弹窗的操作，删除了一些无用的代码
 * 20150914 blue 增加统一功能，点击弹窗外隐藏弹窗，将日期选择器替换为1.0.1版本
 */
define('modules/tongji/appStatisticschart',
    ['chart/line/5.0.0/line', 'chart/line/5.0.1/line',
        'chart/horizontalHistogram/2.0.0/horizontalHistogram', 'datePicker/1.0.1/datePicker'],
    function (require, exports, module) {
        'use strict';
        // jquery库
        var $ = require('jquery');
        // 实现画折线图的类库
        var Line = require('chart/line/5.0.0/line');
        // 统计分析v1.3新增的按周按月走势图
        var newLine = require('chart/line/5.0.1/line');
        // 实现画水平柱状图的类库
        var horizontalHistogram = require('chart/horizontalHistogram/2.0.0/horizontalHistogram');
        // 日期选择器类,用于选择开始日期到结束日期
        var DatePicker = require('datePicker/1.0.1/datePicker');
        // 从页面传入的一些必要的数据
        var vars = seajs.data.vars;

        /**
         * 类函数
         */
        module.exports = function () {
            // 获取页面传过来的数据赋值给vars以供之后的操作使用
            $('input[type=hidden]').each(function () {
                var $this = $(this);
                vars[$this.attr('data-id')] = $this.val();
            });
            // 拓展Date方法,实现时间的格式话
            function formatDate(date) {
                var year = date.getFullYear().toString().substr(-2);
                var month = Number(date.getMonth()) + 1;
                var day = date.getDate();
                if (String(month).length === 1) {
                    month = '0' + String(month);
                }
                if (String(day).length === 1) {
                    day = '0' + day;
                }
                return {
                    year: year,
                    month: month,
                    day: day
                };
            }

            // jquery对象获取并声明变量索引以供
            // 本月和本周切换按钮容器节点
            var $date = $('.type'),
            // 由高到低排序
                $sort = $('#sort'),
            // 城市列表
                $cityList = $('#cityList'),
            // 排序列表
                $select2 = $('.selectList2'),
            // 开始时间和结束时间容器节点
                $dateSpan = $('.dateTxt span'),
            // 两个年份容器节点
                $yearTxtArr = $('.year'),
            // 选择类型显示节点
                $selectType = $('#selectType'),
            // 折线图和柱状图绘制容器节点
                $chart = $('#chart'),
            // 没有数据显示节点
                $noDataShow = $('#noDataShow'),
            // 本周本月等选择列表
                $dateList = $('#dateList'),
            // 图形实例索引
                chart;
            // 条形图排序切换div
            var $rightSort = $('#rightSort');
            // 条形or走势切换按钮
            var $tabBtn1 = $('#tabBtn1');
            // 走势图按天按周按月切换
            var $tabBtn2 = $('#tabBtn2');
            // 正在加载数据的提示
            var $loading = $('#loading');
            // 点击刷新
            var $refreshing = $('#refreshing');
            // 城市下级列表
            var $section = $('#section');
            // 城市名称
            var $city = $('#city');
            // 房源参数弹层
            var $hidfy = $('#hidfy');
            // 总额
            var $hgNum = $('.hgNum');
            // 开始时间和结束事件显示span的容器
            var $dateTxt = $('.dateTxt');
            // 引入requestanimationframe兼容性js
            require.async(vars.public + 'js/requestanimationframe.js', function () {
                // 日期选择器实例，初始化操作
                var datePicker = new DatePicker();
                // 设置日期选择器点击确认按钮后的函数操作
                datePicker.setConfirmFun(function () {
                    getTotal();
                    getInfoAndDraw();
                });

                // 绑定点击事件
                $dateTxt.on('click', function () {
                    datePicker.show();
                });
                // !!!!!页面初始化时调用ajax已获取第一次的数据!!!!!
                // 声明要显示的类型名称
                var selectTypeStrArr = ['成交单量', '实收业绩', '应收业绩', '房源新增', '实勘', '独家', '钥匙', '客源新增', '带看'];
                // 声明为了便于后台取值，后台显示各个类型名称对应的字符串
                var selectTypeArr = ['chengJiao', 'shishou', 'money', 'fangYuan', 'shiKan', 'duJia', 'key', 'keYuan', 'daiKan'];

                var idx = 0;
                selectTypeArr.forEach(function (ele, index) {
                    if (ele === vars.flag) {
                        idx = index;
                    }
                });

                // 获取当前所有显示类型名称的li的jquery数组
                var paramsLiArr = $('#params li');

                // 页面初始化时的数据
                $selectType.attr('data-type', vars.flag);
                $selectType.html(selectTypeStrArr[idx]);
                $selectType.attr('data-type', vars.flag);
                paramsLiArr.eq(idx).addClass('on').siblings().removeClass('on');

                getTotal();
                getInfoAndDraw();

                // 显示本周本月本年
                $date.click(function () {
                    if ($date.hasClass('selectBtnUp')) {
                        $date.removeClass('selectBtnUp');
                        $dateList.hide();
                    } else {
                        closeAllPop();
                        $date.addClass('selectBtnUp');
                        $dateList.show();
                    }
                });
                // 本周本月按钮切换事件绑定
                $dateList.on('click', 'li', function () {
                    var $this = $(this);
                    if ($this.hasClass('on')) {
                        if ($date.hasClass('selectBtnUp')) {
                            $date.removeClass('selectBtnUp');
                        }
                        $dateList.hide();
                        return;
                    }
                    $this.addClass('on').siblings().removeClass('on');
                    $date.text($this.html());
                    setTime($this.attr('data-type'));
                    if ($date.hasClass('selectBtnUp')) {
                        $date.removeClass('selectBtnUp');
                    }
                    datePicker.hide();
                    $dateList.hide();
                    getTotal();
                    getInfoAndDraw();
                });
                // 由高到低排序
                $sort.click(function () {
                    if ($sort.hasClass('selectBtnUp')) {
                        $sort.removeClass('selectBtnUp');
                        $select2.hide();
                    } else {
                        closeAllPop();
                        $sort.addClass('selectBtnUp');
                        $select2.show();
                    }
                });
                // 排序的列表点击事件
                $select2.on('click', 'li', function () {
                    var $this = $(this);
                    if ($this.hasClass('on')) {
                        if ($sort.hasClass('selectBtnUp')) {
                            $sort.removeClass('selectBtnUp');
                        }
                        $select2.hide();
                        return;
                    }
                    $this.addClass('on').siblings().removeClass('on');
                    $sort.text($this.html());
                    $sort.attr('data-flag', $this.attr('data-flag'));
                    if ($sort.hasClass('selectBtnUp')) {
                        $sort.removeClass('selectBtnUp');
                    }
                    $select2.hide();
                    getInfoAndDraw();
                });
                // 城市列表的点击事件
                // ！！！这里写的明显有问题，但是我不知道后台的逻辑所以放弃了
                if (vars.bigAreaName === '全国级') {
                    // 显示城市列表
                    $city.click(function () {
                        if ($city.hasClass('selectBtnUp')) {
                            $city.removeClass('selectBtnUp');
                            $cityList.hide();
                        } else {
                            closeAllPop();
                            $city.addClass('selectBtnUp');
                            $cityList.show();
                        }
                    });
                    $cityList.on('click', 'li', function () {
                        var $that = $(this);
                        if ($that.hasClass('on')) {
                            if ($city.hasClass('selectBtnUp')) {
                                $city.removeClass('selectBtnUp');
                            }
                            $cityList.hide();
                            return;
                        }
                        $('#cityBox li').removeClass('on');
                        $that.addClass('on');
                        $city.text($that.html());
                        if ($city.hasClass('selectBtnUp')) {
                            $city.removeClass('selectBtnUp');
                        }
                        $cityList.hide();
                        getTotal();
                        getInfoAndDraw();
                    });
                } else if (vars.bigAreaName !== '团队级') {
                    $city.on('click', function () {
                        if ($city.hasClass('selectBtnUp')) {
                            $city.removeClass('selectBtnUp');
                            $cityList.hide();
                            $section.hide();
                        } else {
                            closeAllPop();
                            $city.addClass('selectBtnUp');
                            $cityList.show();
                            $section.show();
                        }
                    });
                    // 城市下级列表的点击事件
                    $section.on('click', 'td', function () {
                        var $that = $(this);
                        if ($that.hasClass('on')) {
                            if ($city.hasClass('selectBtnUp')) {
                                $city.removeClass('selectBtnUp');
                            }
                            $cityList.hide();
                            return;
                        }
                        $('#section td').removeClass('on');
                        $that.addClass('on');
                        $city.text($that.html());
                        $section.attr('data-baId', $that.attr('data-baId'));
                        if ($city.hasClass('selectBtnUp')) {
                            $city.removeClass('selectBtnUp');
                        }
                        $cityList.hide();
                        getInfoAndDraw();
                        getTotal();
                    });
                }

                // 指数参数列表显示
                $selectType.click(function () {
                    if ($selectType.hasClass('selectBtnUp')) {
                        $selectType.removeClass('selectBtnUp');
                        $hidfy.hide();
                    } else {
                        closeAllPop();
                        $selectType.addClass('selectBtnUp');
                        $hidfy.show();
                    }
                });
                // 指数参数选择
                $hidfy.on('click', 'li', function () {
                    var $this = $(this);
                    if ($this.hasClass('on')) {
                        if ($selectType.hasClass('selectBtnUp')) {
                            $selectType.removeClass('selectBtnUp');
                        }
                        $hidfy.hide();
                        return;
                    }
                    $this.addClass('on').siblings().removeClass('on');
                    $selectType.text($this.html());
                    $selectType.attr('data-type', $this.attr('data-type'));
                    if ($selectType.hasClass('selectBtnUp')) {
                        $selectType.removeClass('selectBtnUp');
                    }
                    $hidfy.hide();
                    getTotal();
                    getInfoAndDraw();
                });

                // 绑定鼠标按下事件，用来监听所有弹出层点击其他位置后隐藏的操作
                $(document).on('touchstart', function (e) {
                    var $target = $(e.target);
                    if ($target.closest('.selectList2').length <= 0
                        && $target.closest('.selectList').length <= 0
                        && $target.closest('.col3').length <= 0
                        && $target.closest('.selectListB').length <= 0
                        && $target.attr('id') !== 'city'
                        && !$target.hasClass('type')
                        && $target.attr('id') !== 'selectType'
                        && $target.attr('id') !== 'sort') {
                        closeAllPop();
                    }
                });

                // 关闭所有浮层
                function closeAllPop() {
                    // 选择本周本月本年等得操作浮层
                    if ($dateList.is(':visible')) {
                        if ($date.hasClass('selectBtnUp')) {
                            $date.removeClass('selectBtnUp');
                        }
                        $dateList.hide();
                    }
                    // 选择成交单量等操作浮层
                    if ($hidfy.is(':visible')) {
                        if ($selectType.hasClass('selectBtnUp')) {
                            $selectType.removeClass('selectBtnUp');
                        }
                        $hidfy.hide();
                    }
                    // 选择排序操作浮层
                    if ($select2.is(':visible')) {
                        if ($sort.hasClass('selectBtnUp')) {
                            $sort.removeClass('selectBtnUp');
                        }
                        $select2.hide();
                    }
                    // 选择城市或大区操作浮层
                    if ($cityList.is(':visible')) {
                        if ($city.hasClass('selectBtnUp')) {
                            $city.removeClass('selectBtnUp');
                        }
                        $cityList.hide();
                    }
                    if ($section.is(':visible')) {
                        $section.hide();
                    }
                }

                /**
                 * 资源加载显示提示函数
                 */
                function loadingShow() {
                    $chart.hide();
                    $loading.show();
                }

                /**
                 * 资源加载隐藏提示函数
                 */
                function loadingHide() {
                    $chart.show();
                    $loading.hide();
                }

                /**
                 * 根据年月获取该年该月的总天数
                 * @param y 年份
                 * @param m 月份
                 * @returns {number} 该年该月的总天数
                 */
                function getDate(y, m) {
                    return new Date(y, m.toString(), 0).getDate();
                }

                /**
                 * 根据本周本月按钮切换选项设置时间段
                 * @param type 切换的类型,yesterday为昨天,today为今天,week为本周，month为本月
                 */
                function setTime(type) {
                    var now = new Date(), startJudge, endJudge;
                    if (type === 'year') {
                        startJudge = formatDate(new Date(now.getFullYear(), 0, 1));
                        endJudge = formatDate(new Date(now.getFullYear(), 11, 31));
                        $dateSpan.eq(0).attr('data-date', startJudge.year + '-' + startJudge.month
                            + '-' + startJudge.day).html(startJudge.month + '月' + startJudge.day + '日');
                        $yearTxtArr.eq(0).html('20' + startJudge.year + '年');
                        $dateSpan.eq(1).attr('data-date', endJudge.year + '-' + endJudge.month
                            + '-' + endJudge.day).html(endJudge.month + '月' + endJudge.day + '日');
                        $yearTxtArr.eq(1).html('20' + endJudge.year + '年');
                        return;
                    }
                    switch (type) {
                        case 'yesterday':
                            startJudge = endJudge = now.getDate() - 1;
                            break;
                        case 'today':
                            startJudge = endJudge = now.getDate();
                            break;
                        case 'week':
                            var today = now.getDay() - 1;
                            // 判断周末时置为6，则周一到周日依次减去0-6，算出当天所在本周的星期一时间
                            if (today < 0) {
                                today = 6;
                            }
                            startJudge = now.getDate() - today;
                            endJudge = startJudge + 6;
                            break;
                        case 'month':
                            startJudge = 1;
                            endJudge = getDate(now.getFullYear(), now.getMonth() + 1);
                    }
                    // 计算开始时间和结束时间
                    var start = formatDate(new Date(now.getFullYear(), now.getMonth(), startJudge));
                    var end = formatDate(new Date(now.getFullYear(), now.getMonth(), endJudge));
                    $dateSpan.eq(0).attr('data-date', start.year + '-' + start.month
                        + '-' + start.day).html(start.month + '月' + start.day + '日');
                    $yearTxtArr.eq(0).html('20' + start.year + '年');
                    $dateSpan.eq(1).attr('data-date', end.year + '-' + end.month
                        + '-' + end.day).html(end.month + '月' + end.day + '日');
                    $yearTxtArr.eq(1).html('20' + end.year + '年');
                }

                /**
                 * ajax获取首页各项总额
                 */
                function getTotal() {
                    $hgNum.html('');
                    var url = vars.tongjiSite + '?c=tongji&a=ajaxGetIndexData';
                    var ajaxData = {
                        // app传入的识别码
                        verifyCode: vars.verifyCode,
                        // app版本
                        version: vars.version,
                        // 集团id
                        agentid: vars.agentid,
                        // 开始时间
                        begintime: '20' + $dateSpan.eq(0).attr('data-date'),
                        // 结束时间
                        endtime: '20' + $dateSpan.eq(1).attr('data-date'),
                        // 当前城市
                        city: vars.city
                    };
                    setCityInfo(ajaxData);
                    ajaxData.SearchCity = encodeURIComponent(ajaxData.SearchCity);

                    $.ajax({
                        url: url,
                        data: ajaxData,
                        success: function (data) {
                            if (data && data[0].Count) {
                                for (var i = 0; i < data.length; i++) {
                                    if ($selectType.attr('data-type') === 'chengJiao' && data[i].Name === '成交单量') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'shishou' && data[i].Name === '实收佣金') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'money' && data[i].Name === '应收佣金') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'shiKan' && data[i].Name === '实勘') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'key' && data[i].Name === '钥匙') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'duJia' && data[i].Name === '独家') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'daiKan' && data[i].Name === '带看') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'keYuan' && data[i].Name === '客源新增') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    } else if ($selectType.attr('data-type') === 'fangYuan' && data[i].Name === '房源新增') {
                                        $hgNum.html(parseInt(data[i].Count));
                                    }
                                }
                            }
                        }
                    });
                }

                /**
                 * ajax调用获取折线图或者柱状图
                 */
                function getInfoAndDraw() {
                    $noDataShow.hide();
                    loadingShow();
                    var url = vars.tongjiSite + '?c=tongji&a=ajaxAppStatistics';
                    var ajaxData = {
                        // 图标类型，line为折线图，histogram为柱状图
                        chartType: $tabBtn1.attr('data-flag'),
                        verifyCode: vars.verifyCode,
                        version: vars.version,
                        // 集团id
                        agentid: vars.agentid,
                        // 开始时间
                        begintime: '20' + $dateSpan.eq(0).attr('data-date'),
                        // 结束时间
                        endtime: '20' + $dateSpan.eq(1).attr('data-date'),
                        // 当前城市
                        city: vars.city,
                        // 选择的指标类型
                        type: $selectType.attr('data-type'),
                        sort: $sort.attr('data-flag')
                    };
                    if ($tabBtn1.attr('data-flag') === 'line') {
                        // 按天按周按月
                        ajaxData.TimeType = $tabBtn2.attr('data-flag');
                    }
                    setCityInfo(ajaxData);
                    $.ajax({
                        url: url,
                        data: ajaxData,
                        success: function (data) {
                            console.log(data);
                            if (data && data !== '0') {
                                $noDataShow.hide();
                                data = JSON.parse(data);
                                var flag = false;
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].value !== '0') {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag) {
                                    if ($tabBtn1.attr('data-before') !== '') {
                                        chart = null;
                                        $chart.empty();
                                    }
                                    if (!chart) {
                                        var winW = $('.wrap').width();
                                        loadingHide();
                                        if (vars.chartType === 'line') {
                                            if ($tabBtn2.attr('data-flag') === '1') {
                                                chart = new Line({id: '#chart', width: winW, dataArr: data});
                                            } else {
                                                chart = new newLine({id: '#chart', width: winW, dataArr: data});
                                            }
                                        } else {
                                            chart = new horizontalHistogram({
                                                id: '#chart',
                                                width: winW,
                                                dataArr: data
                                            });
                                        }
                                    } else {
                                        loadingHide();
                                        chart.fillData(data);
                                    }
                                    chart.run();
                                } else {
                                    loadingHide();
                                    noDataShow();
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
                 *
                 */
                function setCityInfo(ajaxData) {
                    if (vars.bigAreaName === '全国级') {
                        ajaxData.SearchCity = $city.html();
                    } else if (vars.bigAreaName === '城市级') {
                        ajaxData.SearchCity = vars.SearchCity;
                        if ($section.attr('data-baId')) {
                            ajaxData.BigAreaID = $section.attr('data-baId');
                        }
                    } else if (vars.bigAreaName === '大区级') {
                        ajaxData.SearchCity = vars.SearchCity;
                        ajaxData.BigAreaID = $city.attr('data-bigAreaId');
                        if ($section.attr('data-baId')) {
                            ajaxData.AreaID = $section.attr('data-baId');
                        }
                        // 新增区域级权限
                    } else if (vars.bigAreaName === '区域级') {
                        ajaxData.SearchCity = vars.SearchCity;
                        ajaxData.AreaID = $city.attr('data-areaId');
                        if ($section.attr('data-baId')) {
                            ajaxData.DeptID = $section.attr('data-baId');
                        }
                        // 新增团队级权限
                    } else if (vars.bigAreaName === '团队级') {
                        ajaxData.SearchCity = vars.SearchCity;
                        ajaxData.DeptID = $city.attr('data-StoreID');
                    }
                }

                /**
                 * 没有返回数据或者数据异常显示暂无数据
                 */
                function noDataShow() {
                    if ($noDataShow.is(':hidden')) {
                        chart = undefined;
                        $chart.find('canvas').remove();
                        $noDataShow.show();
                    }
                }

                // 点击刷新，重新加载ajax
                $refreshing.on('click', function () {
                    $noDataShow.hide();
                    getTotal();
                    getInfoAndDraw();
                });

                // 初始化显示条形图排序or走势图按天/按周/按月
                function initRightShow() {
                    if ($tabBtn1.attr('data-flag') === 'histogram') {
                        $tabBtn2.hide();
                        $rightSort.show();
                    } else {
                        $tabBtn2.show();
                        $rightSort.hide();
                    }
                }

                initRightShow();

                /**
                 * 点击切换条形or走势图操作
                 */
                $tabBtn1.on('click', 'li', function () {
                    var $this = $(this);
                    if ($this.hasClass('on')) {
                        return;
                    }
                    $tabBtn1.attr('data-before', $tabBtn1.attr('data-flag'));
                    $this.addClass('on').siblings().removeClass('on');
                    if ($this.html() === '条形') {
                        $tabBtn1.attr('data-flag', 'histogram');
                        vars.chartType = 'histogram';
                        $sort.html('默认排序');
                        $sort.attr('data-flag', '0');
                        $('#st').find('li').removeClass('on').eq(0).addClass('on');
                    } else {
                        $sort.attr('data-flag', '0');
                        $tabBtn1.attr('data-flag', 'line');
                        vars.chartType = 'line';
                    }
                    initRightShow();
                    getTotal();
                    getInfoAndDraw();
                });

                /**
                 * 走势图按天/按周/按月切换事件
                 */
                $tabBtn2.on('click', 'li', function () {
                    var $this = $(this);
                    if ($this.hasClass('on')) {
                        return;
                    }
                    chart = undefined;
                    $chart.find('canvas').remove();
                    $this.addClass('on').siblings().removeClass('on');
                    $tabBtn2.attr('data-flag', $this.attr('data-type'));
                    getInfoAndDraw();
                });
            });
        };
    });