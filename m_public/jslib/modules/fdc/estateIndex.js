/**
 * 地产数据--企业页面
 * @author icy(taoxudong@soufun.com) 2015-12-07
 */
define('modules/fdc/estateIndex', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'chart/line/1.0.5/line', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var iscrollLite = require('iscroll/2.0.0/iscroll-lite');
        var vars = seajs.data.vars;
        var Line = require('chart/line/1.0.5/line');
        var Swiper = require('swipe/3.10/swiper');
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
        var $filter = $('#select_estate');
        // 页面其他盒子，在筛选菜单显示时隐藏
        var $mBox = $('.mBox,.footer,.mt8');
        // 当前载入指数页面
        var hIndex = vars.h_index;

        /**
         * 自调用函数，封装times用于记录调用的次数
         * @return {function} 初次执行时给已选菜单项添加active类
         */
        var init = (function () {
            var times = 0;
            return function () {
                // 第一次执行，则给筛选菜单中的已选项添加active类
                !times && ++times && $filter.find('dd[data-id=' + hIndex + ']').addClass('active');
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
        // 如何计算弹层事件
        var $jisuan = $('#jisuan');
        $('.calc').on('click', function () {
            $jisuan.show();
            new iscrollLite('.fdc-how');
            Utils.toggleTouchmove(1);
        });
        $jisuan.find('.closeBtn').on('click', function () {
            $jisuan.hide();
            Utils.toggleTouchmove();
        });
        var swiper = [];
        var $indexNames = $('.indexName');
        var $chartInfo = $('.chartInfo');
        (function () {
            var url = location.protocol + vars.fdcSite + '?c=fdc&a=ajaxGetIndex&encity=' + vars.selCity + '&index=' + hIndex;
            // ajax请求图表数据，成功后绘制图表
            $.ajax({
                url: url,
                success: function (data) {
                    if (data) {
                        if (hIndex === 'Bc') {
                            new Line({
                                id: '.city_' + vars.selCity,
                                width: $('.main').width(),
                                height: 200,
                                data: [data],
                                lastDataImpt: false,
                                horizontalLineCount: 5,
                                isCurve: true
                            });
                            $('.indexChart').show();
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                new Line({
                                    id: '.city_' + vars.selCity + i,
                                    width: $('.main').width(),
                                    height: 200,
                                    data: [data[i]],
                                    lastDataImpt: true,
                                    horizontalLineCount: 5,
                                    isCurve: true
                                });
                            }
                            var $city = $('.city_' + vars.selCity);
                            $('.indexChart').show();
                            $city.find('.swiper-wrapper').css('width', parseInt($city.css('width'), 10) * data.length);
                            $indexNames.eq(0).show().siblings('.indexName').hide();
                            swiper[vars.selCity] = new Swiper($city[0], {
                                autoplay: 5000,
                                autoplayDisableOnInteraction: false,
                                onSlideChangeStart: function (swiper) {
                                    var index = swiper.activeIndex;
                                    $indexNames.eq(index).show().siblings('.indexName').hide();
                                    $chartInfo.find('span').removeClass('cur').eq(index).addClass('cur');
                                    $chartInfo.find('.point').text(index + 1);
                                }
                            });
                        }
                    }
                }
            });
        })();
        var inAjax = false;
        var encityBak = vars.selCity;
        // 城市切换下拉菜单
        var $citySelect = $('#indexCity');

        function refreshCharts(cityid) {
            var $city = $('.city_' + cityid);
            var chartL = $city.find('canvas').length;
            if (!chartL) {
                // 请求对应城市的指数信息
                var url = location.protocol + vars.fdcSite + '?c=fdc&a=ajaxGetIndex&index=' + hIndex + '&encity=' + cityid;
                // 下拉菜单快速切换终止前一个未完成ajax请求，防止ajax堆积延迟
                // ajax请求图表数据，成功后绘制图表
                $.ajax({
                    url: url,
                    success: function (data) {
                        if (data) {
                            if (hIndex === 'Bc') {
                                new Line({
                                    id: '.city_' + cityid,
                                    width: $('.main').width(),
                                    height: 200,
                                    data: [data],
                                    lastDataImpt: true,
                                    horizontalLineCount: 5,
                                    isCurve: true
                                });
                                $('.bccity').hide().filter('.' + cityid).show();
                                $city.show().siblings('.curveChart').hide();
                                encityBak = cityid;
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    new Line({
                                        id: '.city_' + cityid + i,
                                        width: $('.main').width(),
                                        height: 200,
                                        data: [data[i]],
                                        lastDataImpt: true,
                                        horizontalLineCount: 5,
                                        isCurve: true
                                    });
                                }
                                $city.show().siblings('.curveChart').hide();
                                $city.find('.swiper-wrapper').css('width', parseInt($city.css('width'), 10) * data.length);
                                $indexNames.eq(0).show().siblings('.indexName').hide();
                                swiper[encityBak] && swiper[encityBak].stopAutoplay && swiper[encityBak].stopAutoplay();
                                swiper[cityid] = new Swiper($city[0], {
                                    autoplay: 5000,
                                    autoplayDisableOnInteraction: false,
                                    onSlideChangeStart: function (swiper) {
                                        var index = swiper.activeIndex;
                                        $indexNames.eq(index).show().siblings('.indexName').hide();
                                        $chartInfo.find('span').removeClass('cur').eq(index).addClass('cur');
                                        $chartInfo.find('.point').text(index + 1);
                                    }
                                });
                                encityBak = cityid;
                            }
                        }
                    },
                    complete: function () {
                        inAjax = false;
                        $citySelect.val(encityBak);
                    }
                });
            } else {
                if (hIndex === 'Bc') {
                    $('.bccity').hide().filter('.' + cityid).show();
                    $city.show().siblings('.curveChart').hide();
                } else {
                    $indexNames.eq(0).show().siblings('.indexName').hide();
                    $chartInfo.find('span').removeClass('cur').eq(0).addClass('cur');
                    $chartInfo.find('.point').text(1);
                    $city.show().siblings('.curveChart').hide();
                    swiper[encityBak] && swiper[encityBak].stopAutoplay();
                    if (swiper[cityid]) {
                        swiper[cityid].update();
                        swiper[cityid].slideTo(0);
                        swiper[cityid].startAutoplay();
                    }
                }
                inAjax = false;
                encityBak = cityid;
            }
        }

        /**
         * 二手房指数，新房指数，城市切换重绘图表
         */

        // 城市选择下拉菜单存在就绑定onchange事件,
        // $('')返回jquery对象，!!$('')====true,不能直接用，需通过判断jquery对象length来判断
        $citySelect[0] && $citySelect.on('change',
            function () {
                if (!inAjax) {
                    inAjax = true;
                    // 当前选择城市
                    var encity = $citySelect.val();
                    if (encity !== encityBak) {
                        refreshCharts(encity);
                    } else {
                        inAjax = false;
                    }
                }
            }
        );
    };
});
