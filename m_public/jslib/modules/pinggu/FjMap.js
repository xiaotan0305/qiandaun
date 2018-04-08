/** 房价地图
 * Created by lina on 2017/1/4.
 */
define('modules/pinggu/FjMap', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'chart/line/1.0.2/line', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        //　用来获取隐藏域中的数据
        var vars = seajs.data.vars;
        var $drop = $('#wrapper');
        var $tit = $('.tit1');
        var $lilist = $('#liList');
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        // 点击月份标题，出现弹框
        var myScroll;
        // 弹框的滑动实例
        myScroll = new IScroll('#wrapper', {
            scrollY: true,
            scrollX: false,
            preventDefault: true
        });
        $tit.on('click', function () {
            $drop.toggle();
            myScroll.refresh('#liList');
        });
        // 点击除弹框的任何地方隐藏弹框
        $('.content').children().not('.selectbox').on('click', function () {
            $drop.hide();
        });
        // 点击查看更多
        $('.cityList').find('.more').on('click', function () {
            var $ele = $(this);
            var $a = $ele.find('a');
            if ($a.hasClass('zk')) {
                $ele.siblings('ul').css('max-height', '');
                $a.find('span').text('收起');
                $a.removeClass('zk');
            } else {
                $ele.siblings('ul').css('max-height', '21.5rem');
                $a.addClass('zk');
                $a.find('span').text('查看更多');
            }
        });
        // 地图的字符串
        var htmlObjMap;
        // 列表的字符串
        var htmlObjList;
        // 拼接显示的字符串
        function getHtmlObj(len, city, jiage1, jiage2, jiage3, bgclass, top, left, fontclass, citylist, hrefs) {
            htmlObjMap = '';
            htmlObjList = '';
            for (var i = 0; i < len; i++) {
                htmlObjMap += '<a href="' + hrefs[i] + '" class="qp ' + bgclass[i] + '" style="top:'
                    + top[i] + ';left:' + left[i] + ';">';
                if (city[i] === '北京' || city[i] === '上海' || city[i] === '广州' || city[i] === '深圳') {
                    htmlObjMap += '<i class="bg pulse"></i>';
                }
                htmlObjMap += '<span class="' + citylist[i] + '">' + city[i] + '<em>' + jiage1[i] + '<i>元/㎡</i></em></span></a>';
                htmlObjList += '<li><a href="' + hrefs[i] + '">' + city[i] + '</a><span class="' + fontclass[i] + '">' + jiage1[i]
                    + '<i>元/㎡</i></span><span>' + jiage2[i] + '<i>元/㎡</i></span><span>' + jiage3[i] + '<i>元/㎡</i></span></li>';
            }
        }

        var arr;
       // 获取指定数据数组
        function getEle(name, data) {
            arr = [];
            var i;
            for (i = 0; i < data.length; i++) {
                arr.push(data[i][name]);
            }
            return arr;
        }

        var thisVal;
        // 点击下拉选择框里的选项
        $lilist.find('li').on('click', function () {
            var $ele = $(this);
            var city, priceNow, priceLastMon, priceLastYear, len, bgclass, toplist, leftlist, fontclass, citylist, hrefs;
            var $span = $('.tit2').find('span');
            thisVal = $ele.html();
            $tit.html(thisVal + '全国各城市房价');
            $.ajax({
                url: vars.pingguSite + '?a=ajaxgetFjMap&time=' + $ele.attr('date-val'),
                type: 'get',
                success: function (data) {
                    len = data.length;
                    // 获得的城市列表
                    city = getEle('City', data);
                    // 当前月的数据
                    priceNow = getEle('PriceNow', data);
                    // 上个月的数据
                    priceLastMon = getEle('PriceLastMonth', data);
                    // 上一年的数据
                    priceLastYear = getEle('PriceLastYear', data);
                    // 地图上小雨点的背景色
                    bgclass = getEle('bgClass', data);
                    // 地图上的小雨点的上偏移
                    toplist = getEle('maptop', data);
                    // 地图上的小雨点的左偏移
                    leftlist = getEle('mapleft', data);
                    // 字体颜色
                    fontclass = getEle('fontClass', data);
                    // 城市列表
                    citylist = getEle('mapprice', data);
                    // 各个链接的挑转地址
                    hrefs = getEle('fjurl', data);
                    getHtmlObj(len, city, priceNow, priceLastMon, priceLastYear, bgclass, toplist, leftlist, fontclass, citylist, hrefs);
                    $('.map').html(htmlObjMap);
                    $('.cityList').find('ul').html(htmlObjList);
                    // 设置不同颜色小雨点的z-index
                    $('.meiH').css('z-index', '100');
                    $('.fenH').css('z-index', '90');
                    $('.huang').css('z-index', '80');
                    $('.lan').css('z-index', '70');
                    $('.tLan').css('z-index', '60');
                    $('.lv').css('z-index', '50');
                    // 第二个标题设置
                    $span.eq(1).html($ele.html());
                    var lastYear = parseInt($ele.html().substring(0,4)) - 1;
                    var thisMon = parseInt($ele.html().substring(5,8));
                    if($ele.next().length){
                        $span.eq(2).html($ele.next().html());
                    }else{
                        if(thisMon === 1){
                            $span.eq(2).html(lastYear + '年12月');
                        }else{
                            $span.eq(2).html(lastYear + 1 + '年 ' + thisMon + '月');
                        }
                    }
                    $span.eq(3).html(lastYear + '年' + thisMon + '月');
                }
            });
            $drop.hide();
        });
        $drop.css('z-index','1000');

        // 画走势图
        var Line = require('chart/line/1.0.2/line'), l;
        // 获取数据并绘制走势图
        // 判断走势图数据如果为空说明没有获取过数据，则执行初始化，否则以存储过的数据画图
        $.ajax({
            url: vars.pingguSite + '?a=ajaxgetFjchart',
            success: function (data) {
                if (data !== 'error' && data.value && data.value.hasOwnProperty('0')) {
                    var xqcodeChart, cdataArr = [];
                    // 针对某些城市数据不全的情况做兼容如果某类数据不存在，则不显示
                    if (data.value && data.value) {
                        xqcodeChart = {
                            yAxis: data.value,
                            forecast: false
                            // 是否显示预测，不传是false
                        };
                        cdataArr.push(xqcodeChart);
                    }
                    // 画走势图
                    l = new Line({
                        id: '#container',
                        height: 200,
                        width: $(window).width(),
                        lineColor: ['#E1BD2A'],
                        scalePosition: 'left',
                        downTxtColor: '#759AC1',
                        scaleColor: '#6F8FB7',
                        scaleBorder: 0,
                        bgLinePx: 5,
                        bgLineColor: '#344F83',
                        border: 60,
                        xAxis: data.name,
                        data: cdataArr
                    });
                    l.run();
                    // 使走势图滚动到最后一个月位置
                } else {
                    // 没有数据则隐藏房价走势板块
                    $('#container, .tit3').hide();
                }
            }
        });

        var keyword = '';
        $('.icon_search').on('click', function() {
            keyword = $('.search').find('input').val();
            $.get(vars.pingguSite + '?a=ajaxGetCityList&keyword=' + keyword, function(data) {
                if (data) {
                    if (data.indexOf('<li') <= -1) {
                        window.location.href = vars.pingguSite + data + '/';
                    } else {
                        $('.shade').css('display', 'block');
                        setTimeout(function(){
                            $('.shade').css('display', 'none');
                        },3000);
                    }
                } else {
                    $('.shade').css('display', 'block');
                    setTimeout(function(){
                        $('.shade').css('display', 'none');
                    },3000);
                }
            });
        });

        // 微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.shareTitle,
            // 副标题
            descContent: vars.shareDescription,
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.shareImage,
            swapTitle: false
        });
    };
});
