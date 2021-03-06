/**
 * @author (guocheng@fang.com)
 * @file chafangjia
 */
define('modules/pinggu/xfDealList', ['modules/world/yhxw', 'footprint/1.0.0/footprint', 'swipe/3.10/swiper', 'chart/hisline/1.0.0/hisline', 'chart/raf/1.0.0/raf'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 如果链接地址含有&s=bdfj 则将区县排行展开，并滚动到顶部

        var moreLi = $('#horizontalBar li.hotDisMore');
        var hotmore = $('#hotmore');
        var qxcjList = $('.qxcj');
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var maimaParams = {
            'vmg.page': 'cfj_cfj^xfcjlb_wap'
        };
        yhxw({
            pageId: 'cfj_cfj^xfcjlb_wap',
            params: maimaParams,
            type: 1
        });
        //swipecha插件
        var Swiper = require('swipe/3.10/swiper');
        // 用于热combo的
        // 走势图
        var hisHide = 0;
        var ww = $(document).width();
        var $zssm = $('.zssm');
        $('#hisLine').css('width', ww + 'px');
        $.ajax({
            type: 'get',
            url: vars.pingguSite + '?c=pinggu&a=ajaxGetXfDealDraw&city=' + vars.city,
            success: function (data) {
                var HisLine = require('chart/hisline/1.0.0/hisline');
                if (data && data !== 'error') {
                    if (data.linedate) {
                        var lineArr = [], line = {}, linehide = 0;
                        var linelen = data.linedate.length;
                        for (var key in data.linedate) {
                            if (parseFloat(data.linedate[key].value) === 0) {
                                linehide += 1;
                            }
                        }
                        if (linehide === linelen) {
                            for (var key in data.linedate) {
                                data.linedate[key].value = -11;
                            }
                        }

                        if ('undefined' !== typeof data.linedate && data.linedate) {
                            line = {lineColor: '#ff6666', pointColor: '#ff6666', data: data.linedate};
                            lineArr.push(line);
                        }
                        if (data.hisdata) {
                            var disprice = data.hisdata;
                            var len = disprice.length;
                            for (var j = len - 1; j > -1; j--) {
                                var v = disprice[j];
                                if (v.value === '' || v.value === '0') {
                                    disprice.splice(j, 1);
                                    lineArr[0].data.splice(j, 1);
                                }
                                if (v.value === '0') {
                                    hisHide += 1;
                                }
                            }
                        }

                        if (lineArr.length > 0) {
                            var options = {
                                textColor: '#999',
                                id: '#hisLine',
                                w: $(document).width() * 0.9,
                                h: 200,
                                top: '10px',
                                showValue: false,
                                lineArr: lineArr,
                                pointBackground: '#ff6666',
                                linePx: 4,
                                hisArr: data.hisdata,
                                pointRadis: 6,
                                pointColor: '#ff6666',
                                alertDom: '#trend'
                            };
                            options.barWidthPart = (0.5 * data.hisdata.length / 6).toFixed(1);
                            var l = new HisLine(options);
                            l.run();
                            if ((window.location.href.indexOf('s=bdfj') > -1) && qxcjList.length > 0 && (window.location.href.indexOf('type=bd') == -1)) {
                                var mTop = qxcjList.offset().top;
                                setTimeout(function () {
                                    window.scrollTo(0, mTop);
                                }, 100);
                                moreLi.show();
                                hotmore.addClass('up');
                            }
                            var $scaleCvs = $('.scaleCvs');
                            var $dwBox = $('.dwBox');
                            // 柱状图没有数据的时候
                            if (hisHide === 5) {
                                $dwBox.find('span').eq(1).hide();
                                $zssm.find('span').eq(0).hide();
                                $zssm.css('left', '43%');
                            }
                            $scaleCvs.eq(1).css('left', '85%');
                            // 折线图没有数据的时候
                            if (linehide === linelen) {
                                $dwBox.find('span').eq(0).hide();
                                $zssm.find('span').eq(1).hide();
                                $zssm.css('left', '43%');
                                $scaleCvs.eq(1).hide();
                                setTimeout(function () {
                                    $('#trend').find('p').eq(1).hide();
                                }, 0)
                            }
                        }
                    }
                } else {
                    $('.qxcj').prev().hide();
                }

            }
        });

        // 热门区县的向下箭头显示更多

        hotmore.on('click', function () {
            if (moreLi.css('display') === 'none') {
                moreLi.show();
                hotmore.addClass('up');
            } else {
                moreLi.hide();
                hotmore.removeClass('up');
            }
        });

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