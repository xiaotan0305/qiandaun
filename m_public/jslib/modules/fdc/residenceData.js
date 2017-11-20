/**
 * 地产数据--住宅页面
 * @author icy(taoxudong@soufun.com) 2015-12-07
 */
define('modules/fdc/residenceData', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'chart/line/1.0.5/line', 'highcharts/4.1.9/highcharts'], function (require, exports,
    module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var iscrollLite = require('iscroll/2.0.0/iscroll-lite');
        require('highcharts/4.1.9/highcharts');
        var vars = seajs.data.vars;
        var Line = require('chart/line/1.0.5/line');
        var Utils = {
            // 禁用/启用touchmove
            toggleTouchmove: (function () {
                function preventDefault(e) {
                    e.preventDefault();
                }

                return function (unable) {
                    document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
                };
            })()
        };

        /**
         * 表格横向滚动条
         */
        // 获取dom中表格包裹
        var $data = $('.data');
        $data.each(function (index, val) {
            // 存在.scroll-wrapper，则在其上上绑定滑动，否则在.data上绑定滑动
            var scrollWrap = $(val).find('.scroll-wrapper')[0];
            scrollWrap || (scrollWrap = val);
            new iscrollLite(scrollWrap, {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        });

        // 筛选菜单
        var $lbTab = $('.lbTab');
        // 住房筛选菜单
        var $filter = $('#select_res');
        // 页面其他盒子，在筛选菜单显示时隐藏
        var $mBox = $('.mBox,.footer,.mt8');
        // 当前区域已选项
        var hCity = vars.h_city;
        // 当前数据类型已选项
        var hData = vars.h_data;
        // 当前物业类型已选项
        var hProperty = vars.h_property;
        // 当前统计周期已选项
        var hPeriod = vars.h_period;

        /**
         * 自调用函数，封装times用于记录调用的次数
         * @return {function} 初次执行时给已选菜单项添加active类
         */
        var init = (function () {
            var times = 0;
            return function () {
                if (!times) {
                    // 第一次执行，则给筛选菜单中的已选项添加active类
                    $('#select_district').find('dd' + (hCity ? '[data-id=' + hCity + ']' : '')).eq(0).addClass('active');
                    $('#select_dType').find('dd' + (hData ? '[data-id=' + hData + ']' : '')).eq(0).addClass('active');
                    $('#select_pType').find('dd' + (hProperty ? '[data-id=' + hProperty + ']' : '')).eq(0).addClass('active');
                    $('#select_period').find('dd' + (hPeriod ? '[data-id=' + hPeriod + ']' : '')).eq(0).addClass('active');
                    times++;
                }
            };
        })();

        /**
         * 自调用函数，封装isShow用于记录调用次数
         * @return {function} 根据isShow轮流执行菜单展开收起
         */
        var filterToggle = (function () {
            var isShow = 0;
            return function () {
                $filter.toggle();
                $mBox.toggle();
                $lbTab.parent().toggleClass('tabSX');
                isShow = !isShow;
                Utils.toggleTouchmove(isShow);
            };
        })();
        // .cur上的点击事件委托给筛选菜单.lbTab
        $lbTab.on('click', '.cur', function (e) {
            // 初始化已选择项
            init();
            // 阻止默认的a标签点击行为
            e.preventDefault();
            // 切换.cur上的active类
            $(this).toggleClass('active');
            // 展开/收起筛选菜单
            filterToggle();
        });
        // 地产数据下的三级筛选菜单(区域、数据类型、物业类型、统计周期)
        var $select = $('#select_res').find('section[id]');
        // 筛选项上的点击事件委托给.lbTab
        $lbTab.on('click', 'dd', function (e) {
            var $this = $(this);
            // 当前点击项在父节点中的序数
            var index = $(this).index();
            // 当前dd的子节点a的数据属性id的值，用于区分二级筛选项和三级筛选项，二级筛选项存在data-id三级筛选项不存在
            var id = $this.find('a').data('id');
            // id存在为二级筛选项
            if (id) {
                // 阻止a标签默认操作
                e.preventDefault();
                // 当前点击项对应的三级筛选菜单展开，其他三级筛选菜单隐藏
                $select.hide().eq(index).show();
                // 当前点击项添加active类，其他二级点击项去除active类
                $this.addClass('active').siblings().removeClass('active');
                // 对应三级菜单添加垂直方向的滚动
                new iscrollLite('#select_' + id, {
                    scrollX: false,
                    scrollY: true,
                    bindToWrapper: true
                });
            }
            // 三级筛选项直接执行a标签默认操作，链接跳转
        });

        // dom中图表的包裹
        var $charts = $('.trend_chart');

        /**
         * 绘制图表
         * @param {object} data 图表数据
         * @param {boolean} isIndex 是否为默认页
         */
        var drawCharts = function (data, isIndex) {
            var chartData, name, value, length, i, charts = [];
            if (isIndex) {
                // 初始化度量和值集
                name = [];
                value = [
                    [],
                    []
                ];
                // 从数据表中取出数据分别置入name和value中
                for (i = 0, length = data.length; i < length; i++) {
                    name.push(data[i].name);
                    value[0].push(+data[i].data[0]);
                    value[1].push(+data[i].data[1]);
                }
                // 构建highchart参数
                chartData = {
                    // x轴
                    xAxis: {
                        // x轴分类
                        categories: name
                    },
                    // 数据串
                    series: [{
                        // 图表类型：柱状图
                        type: 'column',
                        // 数据
                        data: value[0],
                        // 数据列颜色
                        color: '#57d2c3'
                    }, {
                        type: 'column',
                        data: value[1],
                        color: '#f9a95b'
                    }]
                };
                charts.push(chartData);
            } else {
                // 非默认页，一张表
                // 初始化度量和值集
                name = [];
                value = [];
                // 遍历数据表将度量和值置于相应数组
                for (i = 0, length = data.length; i < length; i++) {
                    name.push(data[i].name);
                    value.push(+data[i].data[0]);
                }
                // 构造highchart所需参数
                chartData = {
                    // x轴
                    xAxis: {
                        // x轴类别
                        categories: name
                    },
                    // 数据列
                    series: [{
                        // 数据列类型：柱状图
                        type: 'column',
                        // 数据值
                        data: value,
                        // 数据列颜色
                        color: '#87e1ed'
                    }]
                };
                charts.push(chartData);
            }
            // 根据参数信息绘制图表
            for (i = 0, length = $charts.length; i < length; i++) {
                // 图表标题
                charts[i].title = {
                    text: ''
                };
                // y轴
                charts[i].yAxis = {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function () {
                            return this.value;
                        }
                    }
                };
                // 图表选项
                charts[i].plotOptions = {
                    // 柱状图选项
                    column: {
                        // 不显示图例
                        showInLegend: false,
                        // 取消动画
                        animation: false,
                        // 取消图例点击事件
                        events: {
                            legendItemClick: function () {
                                return false;
                            }
                        }
                    }
                };
                // 图表版权信息
                charts[i].credits = {
                    enabled: false
                };
                // 工具提示
                charts[i].tooltip = {
                    enabled: false
                };
                // 如果chart属性不存在，默认chart为空对象
                charts[i].chart || (charts[i].chart = {});
                // chart对象中renderTo指向放置图表的dom结点
                charts[i].chart.renderTo = $charts[i];
                // 绘制highchart图表
                new window.Highcharts.Chart(charts[i]);
            }
        };
        var encityBak = vars.selCity;
        var $citySelect = $('#indexCity');
        var refreshCharts = (function () {
            var inAjax = false;
            return function (cityid) {
                if (!inAjax) {
                    var $city = $('.city_' + cityid);
                    var chartL = $city.find('canvas').length;
                    if (!chartL) {
                        inAjax = true;
                        // 请求对应城市的指数信息
                        var url = location.protocol + vars.fdcSite + '?c=fdc&a=ajaxGetIndex&index=Xf&encity=' + cityid;
                        // 下拉菜单快速切换终止前一个未完成ajax请求，防止ajax堆积延迟
                        // ajax请求图表数据，成功后绘制图表
                        $.ajax({
                            url: url,
                            success: function (data) {
                                if (data) {
                                    new Line({
                                        id: '.city_' + cityid,
                                        width: $('.main').width(),
                                        height: 200,
                                        data: [data[1]],
                                        lastDataImpt: true,
                                        horizontalLineCount: 5,
                                        isCurve: true
                                    });
                                    $city.show().siblings('.curveChart').hide();
                                    encityBak = cityid;
                                }
                            },
                            complete: function () {
                                inAjax = false;
                                $citySelect.val(encityBak);
                            }
                        });
                    } else {
                        $city.show().siblings('.curveChart').hide();
                        encityBak = cityid;
                    }
                }
            };
        })();
        (function () {
            var url;
            var isIndex = true;
            // 区域为qg，数据类型、物业类型、统计周期都为空则是默认页，否则不是默认页
            hCity === 'qg' || (isIndex = false);
            hData ? isIndex = false : hData = '';
            hProperty ? isIndex = false : hProperty = '';
            hPeriod ? isIndex = false : hPeriod = '';
            if (isIndex) {
                // todo
                url = location.protocol + vars.fdcSite + '?c=fdc&a=ajaxGetIndex&index=Xf&encity=' + vars.selCity;
                // ajax请求图表数据，成功后绘制图表
                $.ajax({
                    url: url,
                    success: function (data) {
                        if (data) {
                            new Line({
                                id: '.city_' + vars.selCity,
                                width: $('.main').width(),
                                height: 200,
                                data: [data[1]],
                                lastDataImpt: true,
                                horizontalLineCount: 5,
                                isCurve: true
                            });
                            $('.indexChart').show();
                        }
                    }
                });
                // 城市选择下拉菜单存在就绑定onchange事件,
                // $('')返回jquery对象，!!$('')====true,不能直接用，需通过判断jquery对象length来判断
                $citySelect.on('change', function () {
                    var encity = $citySelect.val();
                    if (encity !== encityBak) {
                        refreshCharts(encity);
                    }
                });
            } else {
                // 非默认页数据地址，需带上当前已选择的筛选项
                url = '/fdc/?a=ajaxGetResData&type=house&encity=' + hCity + '&dataType=' + hData + '&propertyType=' + hProperty + '&period=' +
                    hPeriod;
                // ajax请求图表数据，成功后绘制图表
                $.ajax({
                    url: url,
                    success: function (res) {
                        if (res) {
                            if (isIndex) {
                                for (var key in res) {
                                    if (res[key] && res.hasOwnProperty(key)) {
                                        $('#' + key).show();
                                        $charts = $('.' + key);
                                        drawCharts(res[key], isIndex);
                                    }
                                }
                            } else {
                                $('#chartShow').show();
                                drawCharts(res, isIndex);
                            }
                        }
                    }
                });
            }
        })();
    };
});
