/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/pinggu/comareaDetail', ['modules/world/yhxw', 'jquery', 'chart/line/1.0.3/line', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var Line = require('chart/line/1.0.3/line');
        var Swiper = require('swipe/3.10/swiper');
        var curveW = $(window).width();
        var line = $('#line');
        $('#wrapper').width(curveW);
        line.width(curveW);
        var district = vars.district;
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
        // select选项跳转链接
        $('.cfj-sele').on('change', function () {
            location.href = this.value;
        });

        // 获取区县的近一年的房价走势
        $.ajax({
            type: 'get',
            url: vars.pingguSite + '?c=pinggu&a=comareaDetailDraw&city=' + vars.city + '&district=' + district + '&comarea=' + vars.comarea,
            success: function (priceData) {
                // select的值保持跟页面同步
                $('#trendChart select').val($('#trendChart select option[selected]').val());
                if (priceData && priceData !== 'error') {
                   // priceData.esfArr表示城市二手房 priceData.xfArr是商圈二手房
                    var lineArr = [],line1,line2;
                    priceData.esfArr && (line1 = {lineColor: '#ff6666', pointColor: '#ff6666', data: priceData.esfArr});
                    priceData.xfArr && (line2 = {lineColor: '#FF9900', pointColor: '#FF9900', data: priceData.xfArr});
                    line1 && lineArr.push(line1);
                    line2 && lineArr.push(line2);
                    var l = new Line({textColor: '#999', w: curveW, h: 175, lineArr: lineArr});
                    l.run();
                } else {
                    var $line = $('#line');
                    $line.css({'text-align': 'center', width: 'auto', color: '#999', 'padding-bottom': '10px'});
                    $line.html('暂无走势数据');
                }
            }
        });
        // 页面初始加载时房价涨幅信息
        var wappingguqylistD0204 = $('#wappingguqylist_D02_04');
        var tabdz = $('.tab-dz');
        var classname = 'zhang';
        // 切换涨跌榜中的涨跌开关
        tabdz.click(function () {
            var $that = $(this);
            if ($that.hasClass(classname)) {
                // 要显示涨的信息
                $that.removeClass(classname);
                $.ajax({
                    type: 'get',
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetDistrictList&city=' + vars.city
                    + '&district=' + district + '&comarea=' + vars.comarea + '&orderby=17',
                    success: function (XqUpData) {
                        if (XqUpData !== 'error') {
                            wappingguqylistD0204.empty().append(XqUpData);
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
                    url: vars.pingguSite + '?c=pinggu&a=ajaxGetDistrictList&city=' + vars.city
                    + '&district=' + district + '&comarea=' + vars.comarea + '&orderby=18',
                    success: function (XqdownData) {
                        if (XqdownData !== 'error') {
                            wappingguqylistD0204.empty().append(XqdownData);
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