/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/result', ['jquery', 'chart/1.0.0/pie','chart/line/2.0.0/line'],
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
            _ub.biz = 'v';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // b值 0：浏览
            var b = 0;
            _ub.collect(b, {'vmg.page': 'mcfjevaluate'});
        }
        require.async('jsub/_vb.js?c=mcfjevaluate');
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
    };
});