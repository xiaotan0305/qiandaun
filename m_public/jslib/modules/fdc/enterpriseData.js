/**
 * 地产数据--企业页面
 * @author icy(taoxudong@soufun.com) 2015-12-07
 */
define('modules/fdc/enterpriseData', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'highcharts/4.1.9/highcharts'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var iscrollLite = require('iscroll/2.0.0/iscroll-lite');
        require('highcharts/4.1.9/highcharts');
        var vars = seajs.data.vars;
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
        // 企业筛选菜单
        var $filter = $('#select_enterprise');
        // 页面其他盒子，在筛选菜单显示时隐藏
        var $mBox = $('.mBox,.footer,.mt8');
        // 当前载入企业页面
        var hType = vars.h_type;

        /**
         * 自调用函数，封装times用于记录调用的次数
         * @return {function} 初次执行时给已选菜单项添加active类
         */
        var init = (function () {
            var times = 0;
            return function () {
                // 第一次执行，则给筛选菜单中的已选项添加active类
                !times && ++times && $filter.find('dd[data-id=' + hType + ']').addClass('active');
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


        // dom中图表的包裹
        var $charts = $('.trend_chart');

        /**
         * 绘制图表
         * @param {object} data 图表数据
         */
        var drawCharts = function (data) {
            var i, length, chartData, dataSet = [];
            // 从数据表中取出数据分别置入name和value中
            for (i = 0, length = data.length; i < length; i++) {
                data[i][1] = +data[i][1];
                dataSet.push(data[i]);
            }
            chartData = {
                // 图表信息
                chart: {
                    // 图表背景色
                    plotBackgroundColor: null,
                    // 图表边框宽度
                    plotBorderWidth: null,
                    // 图表阴影
                    plotShadow: false,
                    // 绘制图表的dom结点
                    renderTo: $charts[0]
                },
                // 数据项颜色
                colors: ['#90d9f0', '#76d0b9', '#63bf91', '#8bc367', '#b1d66a', '#eb7d68', '#ef955e', '#f9ad61', '#ffc65e'],
                // 图例
                legend: {
                    // 图例项宽度
                    itemWidth: 98
                },
                // 数据串
                series: [{
                    // 图表类型：饼图
                    type: 'pie',
                    // 数据
                    data: dataSet
                }],
                // 图表选项
                plotOptions: {
                    // 饼图选项
                    pie: {
                        // 是否允许点选
                        allowPointSelect: false,
                        // 动画
                        animation: false,
                        // 数据标签
                        dataLabels: {
                            enabled: true,
                            color: '#90d9f0',
                            connectorColor: '#ffc65e',
                            formatter: function () {
                                // 标签为带两位小数的百分号形式
                                return this.percentage.toFixed(2) + '%';
                            }
                        },
                        // 图例可见
                        showInLegend: true,
                        // 饼图事件
                        events: {
                            click: function () {
                                return false;
                            }
                        },
                        // 数据点选项
                        point: {
                            events: {
                                // 图例点击事件
                                legendItemClick: function () {
                                    return false;
                                }
                            }
                        }
                    }
                },
                // 图表标题
                title: {
                    text: ''
                },
                // 图表版权信息
                credits: {
                    enabled: false
                },
                // 工具提示
                tooltip: {
                    enabled: false
                }
            };
            // 绘制highchart图表
            new window.Highcharts.Chart(chartData);
        };
        (function () {
            // finance页面绘制图表，其他页面无需绘制
            if (hType === 'finance') {
                var url = '/fdc/?a=ajaxGetEnterprisePie';
                // ajax请求图表数据，成功后绘制图表
                $.ajax({
                    url: url,
                    success: function (res) {
                        if (res) {
                            $('#pie').show();
                            drawCharts(res);
                        }
                    }
                });
            }
        })();
    };
});