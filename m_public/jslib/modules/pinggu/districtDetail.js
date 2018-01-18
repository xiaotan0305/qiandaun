/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 *         circle(yuanhuihui@fang.com) 2016年12月14日
 */
define('modules/pinggu/districtDetail', ['modules/world/yhxw', 'jquery', 'chart/line/1.0.3/line', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var Line = require('chart/line/1.0.3/line');
        //swipecha插件
        var Swiper = require('swipe/3.10/swiper');
        var curveW = $(window).width() - 2;
        var line = $('#line');
        $('#wrapper').width(curveW);
        line.width(curveW);
        var district = vars.district;
        var priceList = $('#zhangdie ul');
        var hotButton = $('#hotmore');
        // 区域选择
        var citySelect = $('#trendChart select');
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var maimaParams = {
            'vmg.page': 'cfj_cfj^esfcjlb_wap'
        };
        yhxw({
            pageId: 'cfj_cfj^esfcjlb_wap',
            params: maimaParams,
            type: 1
        });
        // 获取更多热门商圈
        var downClick = function () {
            var hotAreaMore = $('#horizontalBar li.hotDisMore');
            if (hotAreaMore) {
                if (hotAreaMore.is(':hidden')) {
                    hotAreaMore.show();
                    hotButton.addClass('up');
                } else {
                    hotButton.removeClass('up');
                    hotAreaMore.hide();
                }
            }
        };
        // 点击获取更多热门商圈
        hotButton.on('click', function () {
            downClick();
        });

        // 获取区县的近一年的房价走势
        $.ajax({
            type: 'get',
            url: vars.pingguSite + '?c=pinggu&a=ajaxGetDistrictPriceData&city=' + vars.city + '&district=' + district,
            success: function (priceData) {
                // select的值保持跟页面同步
                citySelect.val($('#trendChart select option[selected]').val());
                if (priceData && priceData !== 'error') {
                    var line1 = [{lineColor: '#FF9900', pointColor: '#FF9900', data: priceData}];
                    var l = new Line({
                        textColor: '#999',
                        w: curveW,
                        h: 175,
                        lineArr: line1
                    });
                    l.run();
                    $('.red-df').text(priceData[priceData.length - 1].value + '元/㎡');
                } else {
                    var $line = $('#line');
                    $line.css({'text-align': 'center', width: 'auto', color: '#999', 'padding-bottom': '10px'});
                    $line.html('暂无走势数据');
                }
            }
        });

        var newValue, oldValue = citySelect.val();
        // 走势图区域选择
        citySelect.on('change', function () {
            newValue = this.value;
            // fixbug:回退时Select值不正确
            citySelect.val(oldValue);
            setTimeout(function () {
                // ios下UC浏览器特殊处理
                citySelect.val(oldValue);
                location.href = newValue;
            }, 0);
        });

        // 切换商圈房价涨跌开关
        var tabdz = $('.tab-dz');
        var classname = 'zhang';
        tabdz.click(function () {
            var $that = $(this);
            if ($that.hasClass(classname)) {
                // 要显示涨的信息
                $that.removeClass(classname);
                $.ajax({
                    type: 'get',
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetDistrictList&city=' + vars.city + '&district=' + district + '&orderby=17',
                    success: function (XqUpData) {
                        if (XqUpData !== 'error') {
                            priceList.empty().append(XqUpData);
                        } else {
                            alert('无涨价小区排行');
                            tabdz.addClass(classname);
                        }
                    }
                });
            } else {
                // 要显示跌的信息
                $that.addClass(classname);
                $.ajax({
                    type: 'get',
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetDistrictList&city=' + vars.city + '&district=' + district + '&orderby=18',
                    success: function (XqdownData) {
                        if (XqdownData !== 'error') {
                            priceList.empty().append(XqdownData);
                        } else {
                            alert('无降价小区排行');
                            tabdz.removeClass(classname);
                        }
                    }
                });
            }
        });
        // 图片加载用lazyload
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 最下面的导航-------------------------------------------------satrt
        // 添加底部SEO
        var seoTab = $('.tabNav');
        if (seoTab.find('a').length > 0) {
            // 底部第一个id
            var firstId = $('#bottonDiv a').eq(0).attr('id');
            var $bottonDiv = $('#bottonDiv');
            var $typeList = $('.typeListB');
            // 默认展示第一个
            $('.' + firstId).show();
            $bottonDiv.find('a').eq(0).addClass('active');
            $bottonDiv.on('click', 'a', function () {
                var $this = $(this);
                $bottonDiv.find('a').removeClass('active');
                $this.addClass('active');
                $typeList.hide();
                $('.' + $this.attr('id')).show();
                if (!$this.attr('canSwiper')) {
                    $this.attr('canSwiper', true);
                    addSwiper($this);
                }
            });
            var addSwiper = function (a) {
                new Swiper('.' + a.attr('id'), {
                    speed: 500,
                    loop: false,
                    onSlideChangeStart: function (swiper) {
                        var $span = $('.' + a.attr('id')).find('.pointBox span');
                        $span.removeClass('cur').eq(swiper.activeIndex).addClass('cur');
                    }
                });
            };
            addSwiper($('#' + firstId));
        }
        // 最下面的导航-------------------------------------------------end
    };
});