/** 业主月报
 * Created by lina on 2017/2/13.
 */
define('modules/myesf/yzMonReport', ['highcharts/5.0.6/highcharts', 'chart/line/1.0.2/line'], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var $compareM = $('#compareM');
            var $lineFloat = $('#lineFloat');
            var $showInfo = $compareM.find('p');
            // 点击换手率
            $('.hslBtn').on('click', function () {
                $compareM.show();
                $showInfo.html('本月成交户数与小区总户数的比值');
            });
            $('#xuanfang_suc').on('click', function () {
                $compareM.hide();
            });
            // 点击曝光率
            $('.yzyb_q').on('click',function(){
                $compareM.show();
                $showInfo.html('曝光度为该房源所在小区在全市所有小区中本月搜索排名');
            });
            // 点击查看更多房源
            var $moreTrendDiv = $('.moreTrendDiv');
            $('.moreTrendBtn').on('click',function(){
                var $ele = $(this);
                if($moreTrendDiv.is(':visible')){
                    $moreTrendDiv.hide();
                    $ele.html('查看更多房源动态');
                }else{
                    $moreTrendDiv.show();
                    $ele.html('收起');
                }

            });
            // 参考均价，走势图，3条，小区均价，商圈均价
            // 二手房详情页
            var dataZ = JSON.parse(vars.referPrice);
            if (dataZ) {
                require.async(['chart/line/1.0.2/line'], function (Line) {
                    if (dataZ && dataZ.projdata && dataZ.disdata && dataZ.citydata) {
                        var xqcodeChart, disChart, cityChart, cdataArr = [];
                        // 针对某些城市数据不全的情况做兼容如果某类数据不存在，则不显示
                        if (dataZ.projdata && dataZ.projdata.price) {
                            xqcodeChart = {
                                yAxis: dataZ.projdata.price,
                                forecast: false
                            };
                            cdataArr.push(xqcodeChart);
                        }
                        if (dataZ.disdata && dataZ.disdata.price) {
                            disChart = {
                                yAxis: dataZ.disdata.price,
                                forecast: false
                            };
                            cdataArr.push(disChart);
                        }
                        if (dataZ.citydata && dataZ.citydata.price) {
                            cityChart = {
                                yAxis: dataZ.citydata.price,
                                forecast: false
                            };
                            cdataArr.push(cityChart);
                        }
                        // 画走势图
                        var l = new Line({
                            id: '#chartCon',
                            height: 200,
                            border: 50,
                            width: $(document).width() - 50,
                            lineColor: ['#ff7070', '#ffae71', '#68c9bf'],
                            xAxis: dataZ.monthnum,
                            data: cdataArr
                        });
                        l.run();
                    }
                });
            } else {
                $('.scalepic').hide();
            }
            // 成交走势
            var $hisline = $('#hisLine');
            function addToArr(arr, type) {
                var newArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (type === 'name') {
                        var arrVal = arr[i].name;
                    } else {
                        if (typeof arr[i].value === 'string') {
                            var arrVal = parseInt(arr[i].value);
                        } else {
                            var arrVal = arr[i].value;
                        }
                    }
                    newArr.push(arrVal);
                };
                return newArr;
            }

            // 搜索热度图
            function histoGram(valname, id, title, number, showtitle) {
                $(id).empty();
                if ($(id).is(':hidden')) {
                    $(id).show();
                }
                var histodata = JSON.parse(valname).histogramdata;
                var histoData = addToArr(histodata, 'value');
                if (histoData) {
                    require.async('highcharts/5.0.6/highcharts', function (highcharts) {
                        $(id).highcharts({
                            chart: {
                                zoomType: 'xy',
                                height: 240
                            },
                            title: {
                                text: null
                            },
                            subtitle: {
                                text: null
                            },
                            xAxis: [{
                                categories: addToArr(histodata, 'name'),
                                labels: {
                                    rotation: 0,
                                    color: '#ccc'
                                },
                                crosshair: true
                            }],
                            yAxis: [{ // Primary yAxis
                                allowDecimals: false,
                                labels: {
                                    format: '{value}套',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                title: {
                                    text: null,
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                }
                            }],
                            tooltip: {
                                shared: true
                            },
                            legend: {
                                enabled: false,
                                layout: 'vertical',
                                align: 'left',
                                x: 120,
                                verticalAlign: 'top',
                                y: 100,
                                floating: true,
                                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                            },
                            credits: {
                                enabled: false // 禁用版权信息
                            },
                            series: [{
                                name: title,
                                type: 'column',
                                yAxis: number,
                                color: '#69C9BE',
                                data: histoData,
                                tooltip: {
                                    valueSuffix: showtitle
                                }
                            }]
                        });
                    });
                }
            }

            // 成交走势图
            function drawHisline(valname) {
                $('#hisLine').empty();
                var hisdata = JSON.parse(valname).histogramdata;
                var linedata = JSON.parse(valname).linedata;
                var lineData = addToArr(linedata, 'value');
                var hisData = addToArr(hisdata, 'value');
                if (hisdata) {
                    require.async('highcharts/5.0.6/highcharts', function (highcharts) {
                        $('#hisLine').highcharts({
                            chart: {
                                zoomType: 'xy',
                                height: 240,
                                marginTop: 30,

                            },
                            title: {
                                text: null
                            },
                            subtitle: {
                                text: null
                            },
                            xAxis: [{
                                categories: addToArr(hisdata, 'name'),
                                labels: {
                                    rotation: 0,
                                    color: '#ccc'
                                },
                                crosshair: true
                            }],
                            yAxis: [{ // Primary yAxis
                                allowDecimals: false,
                                labels: {
                                    format: '{value}套',
                                    style: {
                                        color: Highcharts.getOptions().colors[1]
                                    }
                                },
                                title: {
                                    align: 'high',
                                    offset: 0,
                                    text: '成交量(套)',
                                    rotation: 0,
                                    y: -20,
                                    style: {
                                        color: '#999',
                                        fontSize: 11,
                                        fontFamily: '微软雅黑'
                                    }
                                }
                            }, { // Secondary yAxis
                                title: {
                                    align: 'high',
                                    offset: 0,
                                    text: '换手率(%)',
                                    rotation: 0,
                                    y: -20,
                                    style: {
                                        color: '#999',
                                        fontSize: 11,
                                        fontFamily: '微软雅黑'

                                    }
                                },
                                labels: {
                                    format: '{value}%',
                                    style: {
                                        color: Highcharts.getOptions().colors[0]
                                    }
                                },
                                opposite: true
                            }],
                            tooltip: {
                                shared: true,
                            },
                            legend: {
                                enabled: false,
                                layout: 'vertical',
                                align: 'left',
                                x: 120,
                                verticalAlign: 'center',
                                y: 50,
                                floating: true,
                                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                            },
                            credits: {
                                enabled: false // 禁用版权信息
                            },
                            series: [{
                                name: '成交套数',
                                type: 'column',
                                yAxis: 0,
                                color: '#69C9BE',
                                data: hisData,
                                tooltip: {
                                    valueSuffix: '套'
                                }
                            }, {
                                name: '换手率',
                                type: 'spline',
                                yAxis: 1,
                                color: '#ff6666',
                                data: lineData,
                                tooltip: {
                                    valueSuffix: '%'
                                }
                            }]
                        });
                    });
                }
            }
            window.onload = function () {
                if(vars.volumeMixture0){
                    drawHisline(vars.volumeMixture0);
                }else{
                    $hisline.hide();
                }
            };
            // 点击居室切换，重新绘制成交走势图
            // 换手率及其说明按钮的位置
            var changeRateBtn = $('.ybzstName.mt14').children().not(':first');
            $('.jsTab').find('a').on('click', function () {
                var $ele = $(this);
                var thisIndex = $ele.index();
                $ele.addClass('cur').siblings().removeClass('cur');
                if (vars['volumeMixture' + thisIndex]) {
                    if (thisIndex === 0) {
                        changeRateBtn.show();
                        drawHisline(vars.volumeMixture0);
                    } else {
                        changeRateBtn.hide();
                        histoGram(vars['volumeMixture' + thisIndex], '#hisLine', '套数', 0, '套');
                    }
                } else {
                    $hisline.hide();
                }
            });
            // 点击咨询经纪人按钮
            $('#consult').on('click', function () {
                $lineFloat.show();
            });
            // 点击浮层
            $('.jjropen').on('click', function (e) {
                $('#lineFloat').hide();
            });
            // 阻止事件冒泡
            $('.conbox').on('click', function (e) {
                e.stopPropagation();
            });
            // 点击在线聊天
            // 在线咨询函数
            function chatWeituo(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, order, photourl, housefrom) {
                if (vars.localStorage) {
                    window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                        + photourl + ';' + encodeURIComponent(vars.district + '的'));
                }
                $.ajax({
                    url: '/data.d?m=houseinfotj&zhcity=' + zhcity + '&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                    + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid='
                    + agentid + '&order=' + order + '&housefrom=' + housefrom,
                    async: false
                });
                setTimeout(function () {
                    window.location = '/chat.d?m=chat&username=' + uname + '&city=' + city;
                }, 500);
            }

            // 点击在线咨询跳转到咨询界面
            $('.mes,.mesa').on('click', function () {
                var data = $(this).attr('data-chat');
                var dataArr = data.split(',');
                chatWeituo.apply('this', dataArr);
            });
        };
    });