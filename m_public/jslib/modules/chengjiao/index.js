/**
 * Created by loupeiye on 2016/8/17.
 */
define('modules/chengjiao/index', ['modules/world/yhxw', 'jquery', 'chart/line/1.0.8/line', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 选择插件
        var Line = require('chart/line/1.0.8/line');
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        // 页面传入的参数
        var vars = seajs.data.vars;
        var $doc = $(document);
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var pageId = 'cj_cj^lb_wap';
        var maimaParams = {
            'vmg.page': pageId
        };
        yhxw({
            pageId: pageId,
            params: maimaParams
        });
        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }

        // 图片增加惰性加载功能
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });

        var $trend = $('.trend-time li');
        var typeNow = 'month'; //当前类型
        var $disList = $('#disList');
        var $screenCity = $('.screen-city');
        var $hasCont = $('.hasCont');
        var $dataNo = $('.data_no');
        var $line = $('#line'), $trendZs = $('.trend-zs');

        //日周月切换和初始显示
        function initChange() {
            //区域是否显示箭头
            if ($disList.find('dl[data_type=' + typeNow + ']').length) {
                $screenCity.removeClass('off');
            } else {
                $screenCity.addClass('off');
            }

            //是否有内容
            var $contType = $('.hasCont' + typeNow);
            if (!($hasCont.length || $contType.length)) {
                $dataNo.show();
            } else {
                $dataNo.hide();
                if ($contType.length) {
                    //成交名片
                    $contType.show().siblings().hide();
                    //成交曲线。没有名片一定没有曲线
                    if (options[typeNow]) {
                        $line.html('');
                        $trendZs.show();
                        var line = new Line(options[typeNow]);
                        line.run();
                        $line.append('<p style="font-size:12px; color:rgb(119,176,249); text-align:center">套数</p>');
                    } else {
                        $trendZs.hide();
                    }
                }
            }
        }

        // 曲线图
        var options = {};
        if (vars.jsDealData) {
            var jsDealData = $.parseJSON(vars.jsDealData);
            for (var type in jsDealData) {
                if (jsDealData.hasOwnProperty(type)) {
                    options[type] = {
                        type: type,
                        lineStyle: '',
                        // 走势图容器id
                        id: '#line',
                        // 点击跳转
                        tipUrl: '',
                        // 能够滑动的最小数据量
                        scrollNumber: 5,
                        xfMode: true,
                        // 走势图左右区域的间隔
                        border: 80,
                        startIndex: 12,
                        width: $(window).width() - 20,
                        xAxis: jsDealData[type]['xAxis'],
                        series: [{
                            key: '成交',
                            color: 'rgb(119,176,249)',
                            yAxis: jsDealData[type]['yAxis']
                        }]
                    };
                }
            }
        }

        //日月周的切换
        if ($trend.length) {
            typeNow = $trend.filter('.on').attr('data_type');
            $trend.on('click', function () {
                var $that=$(this);
                if ($that.hasClass('on')) {
                    return;
                }
                $that.addClass('on').siblings().removeClass('on');
                typeNow = $that.attr('data_type');
                initChange();
            });
        }

        //初始化
        initChange();

        //区域下拉点击
        var $tabSX = $('#tabSX');
        var $float = $('.float');
        $screenCity.on('click', function () {
            if ($(this).hasClass('off')) {
                return;
            }
            $tabSX.find('dl[data_type=' + typeNow + ']').show().siblings().hide();
            //弹出区域选择框
            $tabSX.addClass('tabSX');
            iscrollCtrl.refresh('#disList');
            $float.show();
            unable();
        });
        $float.on('click', function () {
            $float.hide();
            $tabSX.removeClass('tabSX');
        });

        // 点击区域名称、成交名片
        $('.url-skip').on('click', function () {
            window.location.href = $(this).attr('data-url');
        });

        // 点击页面的警示图片
        var $jjropen = $('.jjropen');
        $('.cardbox span').on('click', function (e) {
            var type = $(this).parents('div').first().attr('data_type');
            var $p = $jjropen.find('p[data_type=' + type + ']');
            if ($p.length) {
                $p.show();
            }
            $jjropen.show();
            unable();
            e.preventDefault();
            e.stopPropagation();
        });
        // 点击关闭按钮
        $('.close').on('click',function () {
            $jjropen.find('p.mt5').hide();
            $jjropen.hide();
        });
        $('.jjropen, .btns').on('click',function () {
            $jjropen.find('p.mt5').hide();
            $jjropen.hide();
            enable();
        });

        // 点击查看更多区县排行榜
        var moreLi = $('.trend-table2 li.showDistrict');
        var hotmore = $('.trend-more');
        // 新房查成交app下载
        var xfCcjAppDown = $('.trend-btn');
        if (moreLi.length) {
            hotmore.on('click', function () {
                if (moreLi.css('display') === 'none') {
                    moreLi.show();
                    xfCcjAppDown.hide();
                    hotmore.addClass('up');
                } else {
                    moreLi.hide();
                    xfCcjAppDown.show();
                    hotmore.removeClass('up');
                }
            });
        }
    };
});