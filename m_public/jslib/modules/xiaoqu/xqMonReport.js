/** 小区月报
 * Created by lina on 2016/12/5.
 */
define('modules/xiaoqu/xqMonReport', ['swipe/3.10/swiper',
    'highcharts/5.0.6/highcharts', 'chart/line/1.0.2/line', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 控制图片宽高比
        var $imgObj = $('.imgCtrol');
        if ($imgObj.length) {
            var imgW = $(document).width();
            var imgH = imgW * 0.75;
            $imgObj.css({width: imgW + 'px', height: imgH + 'px'});
            $imgObj.show();
        }
        $('#clickMe').on('click', function () {
            $('#compareM').show();
        });
        $('#gotIt').on('click', function () {
            $('#compareM').hide();
        });
        // 图片轮播,swiper.js
        var Swiper = require('swipe/3.10/swiper');
        Swiper('.swiper-container', {
            pagination: '.b-list',
            bulletActiveClass: 'spcss',
            derection: 'horizontal',
            bulletClass: 'my-bullet',
            loop: false,
            speed: 500
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
            }
            ;
            return newArr;
        }
        var newHisData = [];
        // 搜索热度图
        function histoGram(valname, id, title, number, showtitle) {
            $(id).empty();
            if ($(id).is(':hidden')) {
                $(id).show();
            }
            var histodata = JSON.parse(valname).histogramdata;
            var histoData = addToArr(histodata, 'value');
            // 将搜索热度的数据赋给新的数组，并且进行排序，主要是给纵轴设置最大最小值用 lina 20170209
            for (var i = 0; i < histoData.length; i++) {
                newHisData.push(histoData[i]);
            }
            newHisData.sort(function (a, b) {
                return a - b;
            });
            if(number === 1){
                // 纵轴的最小值
                var minNum = newHisData[0] - 5;
                if(minNum <= 0){
                    minNum = 0;
                }
                // 数据的长度
                var arrLength = newHisData.length;
                // 纵轴的最大值
                var maxNum = newHisData[arrLength - 1];
            }
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
                        }, {
                        // Secondary yAxis
                            min: minNum,
                            max: maxNum,
                            title: {
                                text: null,
                                style: {
                                    color: Highcharts.getOptions().colors[0]
                                }
                            },
                            labels: {
                                format: '{value}',
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
                        }, {
                        // Secondary yAxis
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
                            // 禁用版权信息
                            enabled: false
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
            if (vars.searchHistogram) {
                histoGram(vars.searchHistogram, '#histogram', '搜索热度', 1, '分');
            }
            if (vars.volumeMixture0) {
                drawHisline(vars.volumeMixture0);
            } else {
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
                    changeRateBtn.css('display', 'inline-block');
                    if (vars.volumeMixture0) {
                        drawHisline(vars.volumeMixture0);
                    }
                } else {
                    changeRateBtn.css('display', 'none');
                    if (vars['volumeMixture' + thisIndex]) {
                        histoGram(vars['volumeMixture' + thisIndex], '#hisLine', '套数', 0, '套');
                    }
                }
            } else {
                $hisline.hide();
            }
        });
        // 户型统计成交房源数据,饼状图
        var dataPie = JSON.parse(vars.volumePie);
        if (dataPie) {
            require.async('highcharts/5.0.6/highcharts', function (highcharts) {
                $('#pie').highcharts({
                    chart: {
                        // 饼状图
                        type: 'pie',
                        // 饼状图高
                        height: 280
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            innerSize: 90,
                            depth: 50
                        }
                    },
                    credits: {
                        enabled: false // 禁用版权信息
                    },
                    series: [{
                        data: dataPie
                    }]
                });
            });
        } else {
            $('#pie').hide();
        }
        // 点击咨询经纪人按钮
        $('#consult').on('click', function () {
            $('#lineFloat').show();
        });
        // 点击浮层
        $('.jjropen').on('click', function (e) {
            $('#lineFloat').hide();
        });
        // 阻止默认事件
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
        // 微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.shareName,
            // 副标题
            descContent: vars.shareDes,
            lineLink: location.href,
            imgUrl: location.protocol + vars.shareImg,
            swapTitle: false
        });
    };
});