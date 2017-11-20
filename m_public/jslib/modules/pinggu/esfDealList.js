/**
 * @file chafangjia
 *  lina.bj 20170228
 */
define('modules/pinggu/esfDealList', ['lazyload/1.9.1/lazyload', 'footprint/1.0.0/footprint', 'chart/raf/1.0.0/raf',
        'chart/hisline/1.0.0/hisline', 'swipe/3.10/swiper'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            require('lazyload/1.9.1/lazyload');
            //swipecha插件
            var Swiper = require('swipe/3.10/swiper');
            $('.lazyload').lazyload();
            var $dwBox = $('.dwBox');
            var moreLi = $('#hotDistrict li.hotDisMore');

            var getmore = $('#getmore');
            // 如果链接地址含有&s=bdfj 则将区县排行展开，并滚动到顶部
            var qxcjList = $('.qxcj');
            // 走势图
            var hisHide = 0;
            var ww = $(document).width();
            var $zssm = $('.zssm');
            $('#hisLine').css('width', ww + 'px');
            $.ajax({
                type: 'get',
                url: vars.pingguSite + '?c=pinggu&a=ajaxGetesfDealDraw&city=' + vars.city,
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
                                // 数组去重
                                line = {lineColor: '#ff6666', pointColor: '#ff6666', data: data.linedate};
                                lineArr.push(line);
                            }
                            if (data.hisdata) {
                                var disprice = data.hisdata;
                                var len = disprice.length;
                                for (var j = len - 1; j > -1; j--) {
                                    var v = disprice[j];
                                    if (v.value === '') {
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
                                    // 隐藏走势图
                                    var mTop = qxcjList.offset().top;
                                    setTimeout(function () {

                                        window.scrollTo(0, mTop);
                                    }, 100);
                                    // document.body.scrollTop = mTop + 40;
                                    moreLi.show();
                                    getmore.addClass('up');
                                }
                                 var $scaleCvs = $('.scaleCvs');
                                // 柱状图没有数据的时候
                                if (hisHide === 5) {
                                    $('.dwBox').find('span').eq(1).hide();
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
                                    }, 0);
                                }
                            }
                        }
                    } else  {
                        $('.qxcj').prev().hide();
                    }
                }
            });

            // zhangcongfeng@fang.com end
            // 热门区县的向下箭头显示更多
            getmore.on('click', function () {
                if (moreLi.css('display') === 'none') {
                    moreLi.show();
                    getmore.addClass('up');
                } else {
                    moreLi.hide();
                    getmore.removeClass('up');
                }
            });

            // 展现小区涨幅和跌幅
            $('.flexbox .chan').on('click', function () {
                $('.flexbox .chan').removeClass('active');
                $(this).addClass('active');
                if ($(this).attr('id') === 'change1') {
                    $('.xqDealListUp').show();
                    $('.xqDealListDown').hide();
                } else {
                    $('.xqDealListUp').hide();
                    $('.xqDealListDown').show();
                }
            });
            // 点击底部切换
            var $cfjNav2 = $('.cfjNav2'),
                hCountText = $('.bt');
            $cfjNav2.find('a').on('click', function () {
                var $ele = $(this);
                $ele.addClass('active').siblings().removeClass('active');
                if ($ele.index() === 0) {
                    $('.housecjList').show().next().hide();
                    hCountText.attr('href', vars.chengjiaoSite + vars.city + '/?jhtype=esf');
                    hCountText.text('查看更多（共' + vars.cjNum + '套）');
                } else {
                    $('.houseList').show().prev().hide();
                    hCountText.attr('href', vars.esfSite + vars.city + '/?jhtype=esf');
                    hCountText.text('查看更多（共' + vars.esfNum + '套）');
                }
            });
            // 图片加载用lazyload
            // require('lazyload/1.9.1/lazyload');
            // $('.lazyload').lazyload();
            // var arealist = $('#arealist');

            // 布码
            require.async(['jsub/_ubm.js'], function () {
                // 页面标志默认为二手房列表页
                var pageId = 'mcfjhomepageesf';
                // 引入另一个js文件
                require.async('jsub/_vb.js?c=' + pageId);
                // 所在城市（中文）
                _ub.city = vars.cityname;
                // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
                // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
                _ub.biz = 'v';
                // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
                _ub.location = vars.cityns === 'n' ? 0 : 1;
                // b值 1：搜索
                var b = 1;
                var pTemp = {
                    'vmg.page': pageId
                    // 所属页面
                };
                _ub.collect(b, pTemp);
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