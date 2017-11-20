/**
 * Created by user on 2016/9/19.
 */
$(function ($) {
    'use strict';
    // 月份选择输入框
    var monthOption = $('.option');
    // 下拉框的显示与隐藏
    $('.optionWrap').click(function () {
        monthOption.toggleClass('current');
    });
    var mainSite = location.origin;

    /**
     * 根据名称获取url中的参数
     * @param name 名称
     * @returns {*}
     * @constructor
     */
    function GetQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r !== null)return decodeURI(r[2]);
        return null;
    }

    // 用户选择的月份（通过url获取），初次进入默认为空
    var month = GetQueryString('month') || '';
    if (month && month.indexOf('-') !== -1) {
        month = month.replace('-', '/') + '/01';
    }
    var liVal = GetQueryString('liVal') || '';
    var city = GetQueryString('city') || 'bj';

    function getArrayStr(data) {
        var arrayStr = '';
        if (data.indexOf('-') !== -1) {
            arrayStr = '↓';
        } else if (data === '0%') {
            arrayStr = '';
        } else {
            arrayStr = '↑';
        }
        return arrayStr;
    }
    // 点击当月成交名片进行跳转
    $('#cjmp').on('click', function () {
        location.href = mainSite + '/chengjiao/' + city + '/';
    });

    var myChart = echarts.init(document.getElementById('chart'));
    // 房价走势图数据
    var chartDataArr = [];

    /**
     * 当月成交名片数据渲染
     */
    function renderAmountPrice() {
        $('.dealDate').text((new Date(month).getMonth() + 1) + '月成交');
        $.each(chartDataArr, function () {
            var that = this;
            if (new Date(month).toDateString() == new Date(that.DateTime).toDateString()) {
                $('#dealAmount').html(that.MonthDealAmount + '<span>套</span>');
                var AmountMonthAdd = that.AmountMonthAdd;
                $('#amountCompare').html('环比 ' + AmountMonthAdd + ' ' + getArrayStr(AmountMonthAdd));
                $('#dealSquare').html(that.Price + '<span>元/㎡</span>');
                var PriceMonthAdd = that.PriceMonthAdd;
                $('#squareCompare').html('环比 ' + PriceMonthAdd + ' ' + getArrayStr(PriceMonthAdd));
                return false;
            }
        });
    }

    // 点击某一区县进入该区县查房价的页面
    $('.tip-info').on('click', function () {
        // 链接的索引
        var linkIndex  = $(this).attr('aria-link');
        location.href = mainSite + '/fangjia/bj_list_' + linkIndex + '/';
    })

    /**
     * 渲染房价走势图
     * @param chartData 房价走势图数据
     */
    function renderChart(chartData) {
        // 如果获取到用户选择的月份，则渲染当月成交名片数据
        month && renderAmountPrice();
        var monthArr = [], priceArr = [], priceMonthAdd = [];
        $.each(chartData, function () {
            var that = this;
            // 横坐标月份
            monthArr.push(new Date(that.DateTime).getMonth() + 1);
            // 均价
            priceArr.push(that.Price);
            // 均价环比
            priceMonthAdd.push(that.PriceMonthAdd.replace('%', ''));
        });
        // 最大月份，用于生成月份选择列表，从一月到最大月份
        var maxMonth = Math.max.apply(null, monthArr);
        // 第一次进入页面时 用户选择要查看的日期默认为当前月份
        var selectedDate = (new Date(chartData[0].DateTime)).getFullYear() + '-' + maxMonth;
        // 生成用户选择列表
        createMonthList(month || selectedDate, maxMonth);
        // 标识是否是第三版页面
        var page3Flag = false;
        if ($('html').css('background-color') === 'rgb(54, 64, 76)') {
            page3Flag = true;
        }
        // 字体默认颜色
        var lenDataColor = '#333';
        var xColor = '#333';
        var seriesColor = '#333';
        if (page3Flag) {
            // 如果是第三版页面，重新设置字体颜色
            lenDataColor = '#fff';
            xColor = '#fff';
            seriesColor = '#fff';
        }
        var option = {
            color: ['#496c82'],
            legend: {
                data: [{
                    name: '均价环比',
                    textStyle: {
                        color: lenDataColor
                    }
                }],
                right: 10,
                selectedMode: false,
                textStyle: {
                    color: '#fff'
                }
            },
            grid: {
                left: '3%',
                right: '3%',
                top: 30,
                bottom: 30
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: xColor,
                            fontSize: 12
                        }
                    },
                    data: monthArr
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                {
                    type: 'value',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    name: '均价',
                    type: 'bar',
                    barWidth: '60%',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#cdff81', '#9defa0', '#87dbf2', '#55cfff', '#cdff81', '#9defa0', '#87dbf2', '#55cfff', '#ffba00', '#ff8400'
                                ];
                                return colorList[params.dataIndex];
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: seriesColor,
                                fontSize: 12,
                                fontWeight: 'bold'
                            }
                        }
                    },

                    data: priceArr
                },
                {
                    name: '均价环比',
                    type: 'line',
                    symbol: 'diamond',
                    symbolSize: 6,
                    yAxisIndex: 1,
                    lineStyle: {
                        normal: {
                            color: '#496c82',
                            width: 1,
                            type: 'dashed'

                        }
                    },
                    data: priceMonthAdd
                }
            ]
        };
        // 生成图表
        myChart.setOption(option);
    }

    // 加载地图数据
    loadData();

    /**
     * 获取对应区域的数据
     * @param mapData 地图全部数据
     * @param area 对应要获取的区域
     * @returns {{}}
     */
    function getData(mapData, area) {
        var showData = {};
        $.each(mapData, function () {
            var that = this;
            if (that.district == area) {
                showData = that;
                return false;
            }
        });
        return showData;
    }

    /**
     * 生成月份选择列表
     * @param selectedDate 用户选择的日期
     * @param month 列表的截止最大月份
     */
    function createMonthList(selectedDate, month) {
        if(selectedDate.indexOf('-') !== -1) {
            selectedDate = selectedDate.replace('-', '/') + '/01';
        }
        // 用户选择日期的年份和月份
        var year = (new Date(selectedDate)).getFullYear();
        var selectedMonth = (new Date(selectedDate)).getMonth() + 1;
        $('#monthContainer').text(year + '年' + selectedMonth + '月房价');
        // 徐没换成成列表
        for (var i = 1; i <= month; i++) {
            if (i == selectedMonth) {
                // 如果用户选择的月份和遍历的月份相同，则不在选择列表中
                continue;
            }
            // 拼接月份字符串
            var monthTag = '';
            if (i < 10) {
                monthTag = year + '-' + '0' + i;
            } else {
                monthTag = year + '-' + i;
            }
            var li = '<li class="monthSelect" aria-month="' + monthTag + '">' + year + '年' + i + '月房价</li>'
            monthOption.append($(li));
        }
        // 月份选择点击事件
        $('.option li').on('click', function () {
            var $this = $(this);
            month = $this.attr('aria-month').replace('-', '/') + '/01';
            liVal = $this.html();
            $('.optionWrap span').html(liVal);
            // 跳转到对应月份的链接地址 在url中追加月份
            location.href = location.href.replace(location.search, '?city=' + city + '&month=' + month + '&liVal=' + encodeURI(liVal));
        });
    }

    /**
     * 渲染地图数据
     * @param mapData 地图数据
     */
    function renderMap(mapData) {
        // 用户选择的月份
        month = month || mapData[0].datetime.replace('-', '/') + '/01';
        var monthNum = (new Date(month)).getMonth() + 1;
        $('#fjhb').html('<i></i>' + monthNum + '月北京市各区县房价及环比');
        $('#title').text(monthNum + '月房天下北京二手房房价地图');
        $('#formTitle').text(monthNum + '月挂牌均价');
        // 存在趋势图表数据的话，渲染当月成交名片数据
        if (chartDataArr.length > 1) {
            renderAmountPrice();
        }

        var priceArr = [], maxValue = 0, secondValue = 0, thirdValue = 0;
        $.each(mapData, function () {
            var that = this;
            priceArr.push(that.averageprice);
        });
        priceArr.sort();
        maxValue = priceArr.pop();
        secondValue = priceArr.pop();
        thirdValue = priceArr.pop();
        var $firstLi = '';
        var $secondLi = '';
        var $thirdLi = '';
        var priceList = $('#priceList');
        $('.mapArea').each(function (index) {
            var $this = $(this),
                area = $this.text().trim(),
                parentBox = $this.parent('.tip-info');
            var showData = getData(mapData, area);
            var averagePrice = showData.averageprice;
            parentBox.find('.price').text(averagePrice);
            if (averagePrice == maxValue) {
                parentBox.addClass('tip-red white');

            } else if (averagePrice == secondValue) {
                parentBox.addClass('tip-orange white');
            } else if (averagePrice == thirdValue) {
                parentBox.addClass('tip-yellow white');
            }
            var li = '<ul><li class="area">' + showData.district + '</li> <li class="price">' + averagePrice + '元/㎡'
                + '</li></ul>';
            var growthBox = $('<li class="growth"></li>');
            var monthadd = showData.monthadd;
            var percentBox = parentBox.find('.percent');
            percentBox.text(monthadd);
            var arrowBox = parentBox.find('.arrow');
            if (monthadd.indexOf('-') !== -1) {
                percentBox.addClass('green');
                arrowBox.addClass('green');
                arrowBox.html('↓');
                growthBox = growthBox.addClass('down');
                growthBox = growthBox.html(monthadd + ' ↓');
            } else if (monthadd === '0%') {
                growthBox = growthBox.html(monthadd);
            } else {
                percentBox.addClass('red');
                arrowBox.addClass('red');
                arrowBox.html('↑');
                growthBox = growthBox.addClass('up');
                growthBox = growthBox.html(monthadd + ' ↑');
            }
            var $li = $(li);
            $li = $li.append(growthBox);
            if (averagePrice == maxValue) {
                $li.find('.price').addClass('top1');
                $firstLi = $li;
            } else if (averagePrice == secondValue) {
                $li.find('.price').addClass('top2');
                $secondLi = $li;
            } else if (averagePrice == thirdValue) {
                $li.find('.price').addClass('top3');
                $thirdLi = $li;
            } else {
                $(priceList.find('.priceItem')[index]).append($li);
            }
        });
        $(priceList.find('.priceItem')[0]).prepend($thirdLi).prepend($secondLi).prepend($firstLi);
    }

    /**
     * 加载区域数据
     */
    function loadData() {
        $.ajax({
            type: 'get',
            url: mainSite + '/huodongAC.d?class=CityHousePriceMapHc&m=getDistrictHousePriceTotal',
            data: {city: city, time: month},
            dataType: 'json',
            success: function (response) {
                console.log(response);
                renderMap(response);
            },
            error: function () {
                alert('获取数据失败');
            }
        });
    }

    loadChartData();

    /**
     * 加载图表数据
     */
    function loadChartData() {
        $.ajax({
            type: 'get',
            url: mainSite + '/huodongAC.d?class=CityHousePriceMapHc&m=getEsfCityDealInfoTotal',
            data: {city: city},
            dataType: 'json',
            success: function (response) {
                console.log(response);
                chartDataArr = response;
                renderChart(response);
            },
            error: function () {
                alert('获取数据失败');
            }
        });
    }
});