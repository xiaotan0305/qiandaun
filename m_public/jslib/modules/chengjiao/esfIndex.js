/**
 * Created by loupeiye on 2016/8/17.
 */
define('modules/chengjiao/esfIndex', ['jquery','chart/line/1.0.8/line', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 选择插件
        var Line = require('chart/line/1.0.8/line');
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        var $doc = $(document);

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

        //房源成交地址
        $('.cent_tab_right').on('click', function () {
            window.location.href = vars.fangUrl;
        });

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
                        tipUrl: vars.dealInfoUrl,
                        // 能够滑动的最小数据量
                        scrollNumber: 5,
                        // 走势图左右区域的间隔
                        border: 80,
                        startIndex: 12,
                        width: $(window).width() - 20,
                        xAxis: jsDealData[type]['xAxis'],
                        series: [{
                            key: '套数',
                            color: 'rgb(119,176,249)',
                            yAxis: jsDealData[type]['yAxis']
                        }]
                    };
                }
            }
        }

        //日月周默认值
        var $time_type = $('.time_cjmx li');
        var $cardbox = $('.cardbox');
        var $turnover = $('.turnover');
        var type_show = 'month';
        var $line = $('#line');
        //如果没有数据，显示无数据提示
        var $closingList = $('.closingList');
        var $data_no = $('.data_no');
        if (!($closingList.length || $('.card_data ul[data_type=' + type_show + ']').length)) {
            $data_no.show();
        }
        if ($time_type.length > 0) {
            type_show = $time_type.filter('.on').attr('data_type');
            //点击日月周切换面板
            $time_type.on('click', function(){
                var $this = $(this);
                if ($this.hasClass('on')) {
                    return;
                }
                type_show = $this.attr('data_type');
                //修改面板状态
                $this.addClass('on').siblings('li').removeClass('on');
                // 成交名片
                var $card = $('.card_data ul[data_type='+type_show+']');
                if ($card.length) {
                    $card.show().siblings('ul[data_type]').hide();
                    $cardbox.show();
                    //成交曲线。没有名片一定没有曲线
                    if (options[type_show]) {
                        $line.html('');
                        $turnover.show();
                        var line = new Line(options[type_show]);
                        line.run();
                    } else {
                        $turnover.hide();
                    }
                } else {
                    $cardbox.hide();
                    $turnover.hide();
                }
                //无数据提示
                if (!($closingList.length || $('.card_data ul[data_type=' + type_show + ']').length)) {
                    $data_no.show();
                } else {
                    $data_no.hide();
                }
            });
        }

        //默认曲线图
        if (options[type_show]) {
            var line = new Line(options[type_show]);
            line.run();
        }
        //成交名片区域选择
        var $tabSX = $('#tabSX');
        var $float = $('.float');
        $('.screen_city').on('click', function () {
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
        // 点击区域名称、区县成交榜、成交名片
        $('.url-skip').on('click', function () {
            window.location.href = $(this).attr('data-url');
        });

        // 点击页面的警示图片
        var $jjropen = $('.jjropen');

        $('.card_first span').on('click',function (e) {
            var type = $(this).attr('data_type');
            if (type == 'num') {
                var $jjropen_num = $jjropen.filter('.data_type_num');
                $jjropen_num.find('p[data_type!=' + type_show +']').hide();
                $jjropen_num.find('p[data_type=' + type_show +']').show();
                $jjropen_num.show();
            } else {
                var $jjropen_price = $jjropen.filter('.data_type_price');
                $jjropen_price.show();
            }
            unable();
            e.preventDefault();
            e.stopPropagation();
        });

        // 点击关闭按钮
        $('.close').on('click',function () {
            $jjropen.hide();
        });
        $('.jjropen, .btn').on('click',function () {
            $jjropen.hide();
            enable();
        });

        $('.trendopen').on('click', function (e) {
            e.stopPropagation();
        });
    };
});