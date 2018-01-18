/**
 * 共建共享活动
 * modify by loupeiye@fang.com 20170913
 */
define('modules/esfhd/shareReport4agt', ['jquery', 'chart/raf/1.0.0/raf', 'iscroll/2.0.0/iscroll-lite', 'chart/hisline/1.0.1/hisline'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        // 图片延迟加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });

        var ww = $('body').width();
        var fontSize = $('body').css('font-size');
        var scale = Math.floor(parseInt(fontSize) / 12);
        $('#hisLine').css('width', ww * 0.75 + 'px');
        function isAndroid(test){
            var u = navigator.userAgent, app = navigator.appVersion;
            if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
                if(window.location.href.indexOf("?mobile")<0){
                    try{
                        if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent)){
                            return '0';
                        }else{
                            return '1';
                        }
                    }catch(e){}
                }
            }else if( u.indexOf('iPad') > -1){
                return '0';
            }else{
                return '1';
            }
        };
        var downSp = isAndroid(true) === '1' ? 50 : 100;
        $.ajax({
            type: 'get',
            url: vars.esfSite + '?c=esfhd&a=ajaxGetAgt30Uv&agentid=' + vars.agentid + '&city=' + vars.city,
            success: function (data) {
                // 没有数据，隐藏走势图，显示暂无数据
                if (!data.linedata && !data.hisdata) {
                    $('.share-num').css('display', 'none');
                    $('.zst').css('display', 'block');
                    return false;
                }
                var HisLine = require('chart/hisline/1.0.1/hisline');
                var options = {
                    // 走势图容器id
                    id: '#hisLine',
                    // 高度
                    h: $('#hisLine').height() * 0.75,
                    // 宽度
                    w: $(document).width() * 0.52,
                    // 走势线线宽
                    linePx: 4,
                    // 循环线的颜色
                    lineColor: ['#ff6666', '#ff9900', '#a6b5ee'],
                    // 刻度个数
                    scaleNumber: 5,
                    // 刻度字体大小及颜色
                    scaleFontSize: parseInt(fontSize) * 2 + 'px',
                    scaleColor: '#D1837F',
                    // 刻度的一侧间隔
                    scaleBorder: 10,
                    // 字体
                    fontFamily: ' Arial',
                    // 底部字体大小及颜色
                    downFontSize: parseInt(fontSize) * 2 + 'px',
                    downTxtColor: '#D1837F',
                    // 点半径
                    pointRadis: 8,
                    // 点颜色
                    pointColor: '#F9FBF6',
                    pointBackground: '#F8904A',
                    // 背景线线宽及颜色
                    bgLinePx: 0.5,
                    bgLineColor: '#b6b6b6',
                    // 走势图的上下间隔
                    chartSp: 50,
                    // 下部横坐标值区域的间隔
                    downSp: downSp,
                    // 走势图左右区域的间隔
                    border: 0,
                    // 动画时长
                    runTime: 3000,
                    // 显示值:
                    showValue: true,
                    // 折线图
                    lineArr: [{
                        lineColor: '#F8904A',
                        pointColor: '#ff6666',
                        data: data.linedata
                    }],
                    // 缩进比例
                    lineIndent: 1,
                    // 柱状图

                    // 除去间距柱子的宽度比
                    barWidthPart: 0.5,
                    // 上行柱颜色
                    upColor: '#ffc488',
                    // 下行柱颜色
                    downColor: '#92be69',
                    // 柱状图传入的数据
                    hisArr: data.hisdata,
                    // 柱状图单位
                    hisBit: '',
                    // 折线图单位
                    lineBit: '',
                    isScroll: true
                };
                var l = new HisLine(options);
                l.run();
            },
        });

        var $more = $('.more'), $prizeList = $('.award-con');
        $more.on('click', function () {
            if (!$more.hasClass('up')) {
                $prizeList.find('li').css('display', 'block');
                $more.addClass('up');
                $more.find('h3').text('收起');
            } else {
                $prizeList.find('li:gt(2)').css('display', 'none');
                $more.removeClass('up');
                $more.find('h3').text('查看更多');
            }

        });

        var $shareBtn = $('.share'), $shareTab = $('.share-s2'), $shareClo = $('.share-btn');
        $shareBtn.on('click', function(){
            $shareTab.removeClass('none');
            $.ajax({
                type: 'get',
                url: vars.esfSite + '?c=esfhd&a=setLoveshareMsg&city=' + vars.city,
                success: function(data) {
                    console.log(data.errmsg);
                },
            });
        });
        $shareClo.on('click', function(){
            $shareTab.addClass('none');
        });
    }
});