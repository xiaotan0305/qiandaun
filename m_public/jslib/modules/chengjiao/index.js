/**
 * Created by loupeiye on 2016/8/17.
 */
define('modules/chengjiao/index', ['jquery','slideFilterBox/1.0.0/slideFilterBox','hslider/1.0.0/hslider'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 选择插件
        var hslider = require('hslider/1.0.0/hslider');
        var $filterBox = $('#filterBox');
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

        // 条件数组
        var results = {
            // 区县
            districtId: vars.district || '',
            // 商圈
            comareaId: vars.comarea || '',
            // 价格
            priceId: vars.price || '',
            // 户型
            roomId: vars.room || '',
            // 建筑面积
            areaId: vars.area || ''
        };


        // 图片增加惰性加载功能
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });

        var $jjropen = $('.jjropen');

        // 点击页面的警示图片
        $('.mingp').on('click',function (e) {
            var thisIndex = $(this).parents('li').index();
            $jjropen.eq(thisIndex).show();
            unable();
            e.preventDefault();
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

        // 价格下的横向滑动条
        $('#price').on('click',function () {
            var sliderObj = null;
            var hsliderBox = $('#priceHslider');
            // 判断是否需要使用自定义选择插件
            if (!sliderObj && hsliderBox.length > 0) {
                sliderObj = new hslider({
                    max: hsliderBox.attr('max'),
                    min: hsliderBox.attr('min'),
                    step: 20,
                    oParent: hsliderBox,
                    leftSign: hsliderBox.find('div.active').eq(0),
                    rightSign: hsliderBox.find('div.active').eq(1),
                    range: hsliderBox.find('span')
                });
                // 有自定义价格或者面积时滑动筛选滚动条相关显示效果
                var customBox = $('.in-qj');
                if (customBox.length > 0) {
                    customBox.find('div').on('touchstart', function () {
                        $(this).addClass('hover');
                        $(this).siblings().not('span').removeClass('hover');
                    }).on('touchend', function () {
                        $(this).removeClass('hover');
                    });
                }
            }
            if (sliderObj && hsliderBox.length > 0) {
                var hsliderId = hsliderBox.attr('id');
                var rangArr = [];
                if (vars.price && vars.price.length && hsliderId.indexOf('price') > -1) {
                    rangArr = vars.price.split(',');
                }
                // 如果携带建筑面积参数/价格参数初始化时展示选中参数
                if (rangArr.length > 1) {
                    sliderObj._initPos(parseInt(rangArr[0]), parseInt(rangArr[1]));
                }
            }
        });

        // 加载更多
        if ($('#drag').length > 0) {
            // loadmore所请求的地址
            var loadMoreUrl = vars.mainSite + 'chengjiao/?c=chengjiao&a=ajaxGetCJList' + '&city=' + vars.city;
            // 需要传的ajax参数
            var screenParam = ['district', 'comarea', 'price', 'room', 'area', 'keyword'];
            for (var i = 0; i < screenParam.length; i++) {
                if (vars[screenParam[i]]) {
                    loadMoreUrl += '&' + screenParam[i] + '=' + vars[screenParam[i]];
                }
            }
            require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                loadMore({
                    url: loadMoreUrl,
                    total: vars.allCount,
                    pagesize: vars.firstPgNum,
                    pageNumber: vars.stepByNum,
                    contentID: '.housecjList',
                    moreBtnID: '#drag',
                    loadPromptID: '#loading',
                    lazyCon: '.lazyload',
                    firstDragFlag: false
                });
            });
        }

        /**
         * 自定义价格与面积
         * @param aId 类型id
         * @returns {boolean}
         */
        function assemblyUrl(aId) {
            var minData = $('#' + aId + 'min').find('i').text();
            var maxData = $('#' + aId + 'max').find('i').text();
            var urlvalue;
            minData = minData === '不限' ? '0' : minData;
            maxData = maxData === '不限' ? '0' : maxData;
            // 匹配大于0的正整数
            var pattern = /^\d+$/;
            if (pattern.test(minData) === false || pattern.test(maxData) === false) {
                alert('请填写有效的整数！');
                return false;
            }
            urlvalue = vars.mainSite + 'chengjiao/' + vars.city;
            results['priceId'] = minData + ',' + maxData;
            console.log(results);
            // 需要拼接的参数
            var keyArr = {
                district: 'di',
                comarea: 'b',
                price: 'm',
                room: 'h',
                area: 'a'
            };
            for (var key in keyArr) {
                // result对象中值不为空的拼接到地址中
                if (results[key + 'Id']) {
                    urlvalue += '_' + keyArr[key] + results[key + 'Id'];
                }
            }
            urlvalue += '/';
            if (vars.keyword) {
                urlvalue += '?keyword=' + vars.keyword;
            }
            window.location = urlvalue;
        }

        // 点击价格筛选确认按钮
        $('#priceFormatUrl').on('click', function (e) {
            var thiz = $(this);
            assemblyUrl(thiz.attr('id').replace('FormatUrl', ''));
            e.stopPropagation();
        });

        // 页面向上滚动筛选栏固顶向下滚动加筛选栏隐藏
        var initTop = 114;
        $(window).on('scroll', function () {
            if ($('#nav').css('display') === 'none' && $filterBox.hasClass('tabSx') === false) {
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollTop > initTop || scrollTop < 114) {
                    $filterBox.removeClass('tabFixed');
                } else {
                    $filterBox.addClass('tabFixed');
                }
                initTop = scrollTop;
            }
        });

        // 点击查看更多区县排行榜
        var moreLi = $('.trend-table a.showDistrict');
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