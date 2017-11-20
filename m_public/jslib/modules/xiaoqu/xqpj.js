/**
 * Created by lina on 2017/6/15.
 */
define('modules/xiaoqu/xqpj',['highcharts/5.0.12/highcharts','floatAlert/1.0.0/floatAlert'],function(require,exports,module){
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var floatAlert = require('floatAlert/1.0.0/floatAlert');
        var option = {
            type: '2'
        };
        var floatObj = new floatAlert(option);
        // 点击问号介绍
        var $que = $('.que');
        $que.on('click',function () {
            var $this = $(this);
            var txt = $this.prev().text();
            if(txt === '活跃度评级') {
                floatObj.showMsg('小区活跃度评级主要参考了该月份小区的搜索量、小区挂牌数和该小区所在板块（商圈）所有小区中搜索量和挂牌房源排名，综合评级。');
            }else if(txt === '物业评级') {
                floatObj.showMsg('物业评级通过小区的软件和硬件资源进行综合评级。');
            }else if(txt === '教育评级') {
                floatObj.showMsg('教育评级以对口学校信息为依托，综合学校质量、学校类别、升学方式等内容进行综合评级。');
            }else if(txt === '板块评级') {
                floatObj.showMsg('板块指该小区所属商圈，板块评级综合了生活配套、轨道交通信息，从各指数密度、等级、人均水平各指标进行综合评价。');
            }
        });
        $('.pj-btn').on('click',function () {
            floatObj.showMsg('小区评级主要通过四个方面的维度综合评估，包括小区活跃度、小区物业、小区所在板块、小区的教育资源。根据这四个维度能够比较全面的认识该小区的软硬件信息，为购房者提供相对全面合理的购房参考。');
        });
        // 点击更多按钮
        var $moreBtn = $('.arr-more');
        $moreBtn.on('click',function () {
            var $this = $(this);
            if($this.hasClass('up')) {
                $this.next().hide();
                $this.removeClass('up');
            }else{
                $this.next().show();
                $this.addClass('up');
            }
        });
        function getVal(arr,name,type) {
            var i = 0;
            var targetArr = [];
            for(;i < arr.length;i++) {
                if(type === 'number') {
                    targetArr.unshift(Number(arr[i][name]));
                }else{
                    targetArr.unshift(arr[i][name]);
                }
            }
            return targetArr;
        }
        function  getMin(array) {
            return Math.min.apply(Math, array )
        }
        if(vars.activeData) {
            var activeData = JSON.parse(vars.activeData);
            var xTit = getVal(activeData,'sMonth');
            var gpData = getVal(activeData,'fGuaPaiScore','number');
            var gpMin = getMin(gpData);
            var searchData = getVal(activeData,'fSearchScore','number');
            var searchMin = getMin(searchData);
            var min = gpMin - searchMin;
            var minVal = (min > 0 ? searchMin : gpMin) - 10;
            var minData = minVal > 0 ? minVal : 0;
        }

        var $hydCon = $('#hydCon');
        if (!activeData) {
            $hydCon.parents('.X-pj-t').hide();
        }else{
            // 活跃度评级面积图
            require.async('highcharts/5.0.12/highcharts', function (highcharts) {
                Highcharts.getOptions().colors = ['#68c9bf','#ff6666','#ff9900'];
                $hydCon.highcharts({
                    chart: {
                        type: 'areaspline',
                        height: 200,
                        marginRight: -10
                    },
                    plotOptions: {
                        areaspline: {
                            marker: {
                                lineColor: '#fff',
                                lineWidth: 2,
                                fillColor: this.color,
                                enabled: true,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            },
                            threshold: null
                        }
                    },
                    // 版权
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    pane: {
                        size: '80%'
                    },
                    xAxis: {
                        gridLineWidth: 0,
                        categories: xTit,
                        tickmarkPlacement: 'on',
                        labels: {
                            style: {
                                color: '#ccc',
                                'fontSize': '9px'
                            }
                        },
                        lineColor: '#fff',
                        // 横轴刻度值线的颜色
                        tickColor: '#fff'

                    },
                    yAxis: {
                        title: null,
                        allowDecimals: true,
                        labels:{
                            x: 20,
                            style:{
                                color: '#ccc',
                                'fontSize': '9px'
                            }
                        },
                        max: 100,
                        min:minData,
                        // 纵轴刻度线颜色
                        gridLineColor: '#fff'
                    },
                    tooltip: {
                        enabled: true,
                        shared: true
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        data: gpData,
                        name: '挂牌指数',
                        color: '#68c9bf',
                        fillColor: {
                            linearGradient: {x1:0,y1:0,x2:0,y2:1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        }
                    },{
                        data: searchData,
                        name:'搜索指数',
                        color:'#ff6666',
                        fillColor: {
                            linearGradient: {x1:0,y1:0,x2:0,y2:1},
                            stops: [
                                [0, Highcharts.getOptions().colors[1]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
                            ]
                        }
                    }]
                });
            });
        }

        if(vars.avgFee){
            var totalData = [];
            var rjData = vars.avgFee.split(',');
            // 超市
            var csData = parseFloat(rjData[0]);
            // 餐饮
            var eatData = parseFloat(rjData[1]);
            // 娱乐
            var ylData = parseFloat(rjData[2]);
            var averFeeArr = vars.avgFeeStr.split(',');
            if(csData) {
                totalData.push({color: '#ff6666', y: csData});
            }
            if(eatData) {
                totalData.push({color: '#ff9900', y: eatData});
            }
            if(ylData) {
                totalData.push({color: '#68c9bf', y: ylData});
            }
        }
        var $rjCon = $('#rjCon');
        if(!rjData) {
            $rjCon.parents('.X-pj-t').hide();
        }else{
            // 人均消费图
            require.async('highcharts/5.0.12/highcharts', function (highcharts) {
                $rjCon.highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                        text: null
                    },
                    xAxis: {
                        categories: averFeeArr,
                        title: {
                            text: null
                        },
                        labels: {
                            style: {
                                color: '#bbb'
                            }
                        },
                        lineColor: '#F8F8F8',
                        tickWidth: 6,
                        tickColor: '#fff'
                    },
                    yAxis: {
                        min: 0,
                        title: null,
                        labels: {
                            style: {
                                color: '#bbb'
                            }
                        },
                        // 刻度线颜色
                        lineColor: '#F8F8F8',
                        // 刻度线宽度
                        lineWidth: 1,
                        // 网格线颜色
                        gridLineColor: '#fff'
                    },
                    tooltip: {
                        enabled: true,
                        shared: true,
                        pointFormat: '<span style="color:{series.color}"><b>{point.y}</b><br/>'
                    },
                    plotOptions: {
                        bar: {
                            pointWidth: 15,
                            dataLabels: {
                                enabled: false,
                                allowOverlap: true

                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        data: totalData
                    }]
                });
            });
        }

        if(vars.quipmentScore) {
            var quipmentData = JSON.parse(vars.quipmentScore);
            var xzlS = Number(quipmentData.OfficeScore),
                shopS = Number(quipmentData.ShoppingCenterScore),
                foodS = Number(quipmentData.FoodScore),
                bankS = Number(quipmentData.BankScore),
                markS = Number(quipmentData.MarketScore),
                playS = Number(quipmentData.EntertainmentScore),
                subwayS = Number(quipmentData.SubwayStationScore),
                parkS = Number(quipmentData.ParkScore);
        }
        var $eqpiptCon = $('#equipCon');
        if(!quipmentData){
            $eqpiptCon.parents('.X-pj-t').hide();
        }else{
            // 配套设施图
            require.async('highcharts/5.0.12/highcharts-more', function (highcharts) {
                $eqpiptCon.highcharts({
                    chart: {
                        type: 'bubble',
                        height:220,
                        marginLeft:30,
                        marginRight:-10,
                        paddingTop:20

                    },
                    title: {
                        text: null
                    },
                    legend: {
                        enabled:false
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        bubble: {
                            maxSize:'12%',
                            minSize:'5'
                        }
                    },
                    tooltip: {
                        enabled:true,
                        pointFormat: '<span style="color:{series.color}"><b>{point.category}:{point.y}</b><br/>'
                    },
                    xAxis: {
                        categories: ['写字楼','商场','餐饮','银行','超市','娱乐场所','地铁站','公交站'],
                        title: {
                            text: null
                        },
                        labels:{
                            autoRotation:true,
                            autoRotationLimit:24,
                            style:{
                                color:'#aaa',
                                fontSize:'8px'
                            }
                        },
                        lineWidth:0,
                        tickColor:'#fff',
                        gridLineColor: '#F8F8F8'
                    },
                    yAxis: {
                        min: 0,
                        title:null,
                        labels: {
                            style:{
                                color:'#bbb',
                                fontSize:'8px'
                            }
                        },
                        gridLineColor: '#F8F8F8',
                        tickAmount: 5
                    },
                    series: [{
                        name: '商业环境',
                        color: '#FF9E00',
                        fillOpacity: 1,
                        // 每个气泡包含三个值，x，y，z；其中 x，y用于定位，z 用于计算气泡大小
                        data: [
                            [0, xzlS, xzlS],
                            [1, shopS, shopS]]
                    },{
                        name:'公共配套',
                        color:'#68C9BE',
                        fillOpacity:1,
                        // 每个气泡包含三个值，x，y，z；其中 x，y用于定位，z 用于计算气泡大小
                        data: [
                            [2,foodS, foodS],
                            [3,bankS, bankS]]

                    },{
                        name:'公共配套',
                        color:'#68C9BE',
                        fillOpacity:1,
                        // 每个气泡包含三个值，x，y，z；其中 x，y用于定位，z 用于计算气泡大小
                        data: [
                            [4,markS,markS],
                            [5,playS,playS]]
                    },{
                        name:'交通通达度',
                        color:'#F76565',
                        fillOpacity:1,
                        data: [
                            [6, subwayS, subwayS],
                            [7, parkS,parkS]]
                    }]
                });
            });
        }
    };
});
