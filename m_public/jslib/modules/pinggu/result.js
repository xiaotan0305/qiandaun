/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/result', ['jquery', 'chart/1.0.0/pie','chart/line/2.0.0/line', 'highcharts/5.0.12/highcharts', 'superShare/2.0.0/superShare', 'weixin/2.0.1/weixinshare',],
    function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var ChartPie = require('chart/1.0.0/pie');
        var pie = new ChartPie('#canvas_pie');
        var Line = require('chart/line/2.0.0/line');
        var curveW = $(window).width();
        $('#wrapper').width(curveW);
        // 用户行为布码
        function buMa() {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
            // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
            _ub.biz = 'w';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // b值 0：浏览
            var b = 0;
            _ub.collect(b, {'vmg.page': 'cfj_cfj^pgjg_wap'});
        }
        require.async('jsub/_vb.js?c=cfj_cfj^pgjg_wap');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            buMa();
        });
        // ajax 获取画图数据的方法
        // 获取小区的近一年的房价走势
        $.ajax({
            type: 'get',
            url: '?c=pinggu&a=ajaxGetXqPriceData&city=' + vars.city + '&newcode=' + vars.newcode,
            success: function (priceData) {
                if (priceData && priceData !== ' ' && priceData !== 'error') {
                    var w = $('#line').width();
                    var line = [{lineColor: '#80C587',pointColor: '#80C587',data: priceData}];
                    var l = new Line({
                        textColor: '#999',lineColor: '#FF9900',pointColor: '#FF9900',width: w,height: '150px',w: w * 2,h: 300,id: '#line',lineArr: line
                    });
                    l.run();
                }else {
                    $('#trendchart').remove('.mBox');
                }
            }
        });
        // 画饼状图的方法
        // 画饼图 a:首付金额  b：贷款总额 c:利息
        var a = parseInt($('#sf').html());
        var b = parseInt($('#dk').html());
        var c = parseInt($('#lx').html());
        var calesfTaxs = function (a, b, c) {
            var aSfje = a;
            var bDkze = b;
            var cInterestall = c;
            var total = Number(aSfje) + Number(bDkze) + Number(cInterestall);
            var dataArr = [], colorArr = [], colors = ['#ffb400', '#01ac00', '#378de5'];
            $.each([aSfje, bDkze, cInterestall], function (i, value) {
                if (value > 0) {
                    dataArr.push(value / total);
                    colorArr.push(colors[i]);
                }
            });
            pie.draw({data: dataArr, color: colorArr});
        };
        calesfTaxs(a,b,c);
        if(vars.jsfangAnalysis) {
            var pjData = vars.jsfangAnalysis.split(',');
            var i = 0;
            for (; i < pjData.length; i++) {
                pjData[i] = Number(pjData[i]);
            }
            var imgWidth = $(document).width();
            // 添加小区评级蜘蛛图
            require.async('highcharts/5.0.12/highcharts-more', function (highcharts) {
                $('#container').highcharts({
                    chart: {
                        polar: true,
                        type: 'area',
                        height: 200,
                        width: imgWidth,
                        top: 20
                    },
                    plotOptions: {
                        area: {
                            marker: {
                                fillColor: '#57A8F7',
                                enabled: true,
                                symbol: 'circle',
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true
                                    }
                                }
                            }
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
                        size: '85%'
                    },
                    tooltip: {
                        enabled: false,
                    },
                    xAxis: {
                        gridLineColor: '#57A8F7',
                        categories: ['小区热度', '楼层', '户型', '朝向'],
                        tickmarkPlacement: 'on',
                        lineWidth: 0,
                        labels: {
                            style: {
                                color: '#000000'
                            }
                        },
                    },
                    yAxis: {
                        allowDecimals: true,
                        labels: {
                            enabled: false
                        },
                        gridLineInterpolation: 'polygon',
                        gridLineColor: '#57A8F7',
                        lineColor: '#57A8F7',
                        min: 0,
                        max: 5,
                        tickAmount: 6,//刻度数量
                    },
                    legend: {
                        enabled: false,
                    },
                    series: [{
                        data: pjData,
                        color: '#0566C9',
                        lineWidth: 0,
                        fillOpacity: 0.5,
                        pointPlacement: 'on',
                        marker: {
                            enabled: false,//数据点实心
                        },
                    }]
                });
            });
        }
        //点击展开以及收起
        var fypj_tdn = $('#fypj_tdn');
        var hide_con = $('#hide_con');
        fypj_tdn.on('click', function () {
            if (fypj_tdn.hasClass('fypj_show')) {
                fypj_tdn.removeClass('fypj_show');
                fypj_tdn.addClass('fypj_hide');
                hide_con.removeClass('hide_con');
                fypj_tdn.text('收起');
            } else {
                fypj_tdn.addClass('fypj_show');
                fypj_tdn.removeClass('fypj_hide');
                hide_con.addClass('hide_con');
                fypj_tdn.text('展开');
            }
        });
        //点击继续评估种localstorage，带入信息
        $('.jzpg').on('click', function () {
            if (vars.localStorage) {
                //如果填了信息，记下localstorage，带到精准评估页
                var forward = vars.forward;
                var area = vars.area;
                var floor = vars.ceng;
                var zfloor = vars.totalfloor;
                var danyuan = vars.danyuan1;
                var room = vars.room;
                var hall = vars.hall;
                var louhao = vars.louhao;
                if ((forward && forward !== '南') || area || floor || zfloor || (danyuan && danyuan !== '1单元' && danyuan !== '0单元') || (room && room !== '2' && room !== '0') || (hall && hall !== '1' && hall !== '0') || louhao) {
                    // 评估数据
                    var data = {
                        Forward: forward,
                        Area: area,
                        zfloor: zfloor,
                        Floor: floor,
                        Danyuan: danyuan.replace('0', '1'),
                        Room: room,
                        Hall: hall,
                        Louhao: louhao.replace('号楼', ''),
                    };
                    var jsonStr = JSON.stringify(data);
                    vars.localStorage.setItem('jzpgInfo', jsonStr);
                }
            }
            window.location = vars.pingguSite + vars.city + '/' + vars.newcode + '/accurate.html';
            return false;
        });
        // 分享功能
        var shareTitle = '我在房天下评估了一套房源，评估价为' + vars.totalPrice +'万';
        if (vars.room && vars.hall && (vars.room !== '0' && vars.hall !== '0')) {
            var shareDesc = '房天下为您提供' + vars.projName + '小区' + vars.room + '室' + vars.hall + '厅二手房评估价格与房源分析';
        } else {
            var shareDesc = '房天下为您提供' + vars.projName + '小区二手房评估价格与房源分析';
        }
        var shareImg = '';
        var shareLink = location.href + '&city=' + vars.city + '&isshare=share';
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: shareTitle,
            descContent: shareDesc,
            lineLink: shareLink,
            imgUrl: shareImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: shareTitle,
            // 分享时的图标
            image: shareImg,
            // 分享内容的详细描述
            desc: shareDesc,
            // 分享的链接地址
            url: shareLink,
        };
        var superShare = new SuperShare(config);
        // 点击分享按钮
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});