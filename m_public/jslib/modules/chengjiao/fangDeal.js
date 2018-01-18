/**
 * Created by loupeiye on 2016/8/17.
 */
define('modules/chengjiao/fangDeal', ['jquery','slideFilterBox/1.0.0/slideFilterBox','hslider/1.0.0/hslider','dateAndTimeSelect/1.1.0/dateAndTimeSelect_chengjiao'], function (require, exports, module) {
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
            var screenParam = ['district', 'comarea', 'price', 'room', 'area', 'keyword', 'date'];
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
            if (vars.tabIndex) {
                urlvalue += '/?tabindex=' + vars.tabIndex;
            }
            if (vars.keyword) {
                urlvalue += '&keyword=' + vars.keyword;
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

        // 增加日期选择功能，lina 20161109
        var DateAndTimeSelect = require('dateAndTimeSelect/1.1.0/dateAndTimeSelect_chengjiao');
        var year = 2015;
        var lastYear = new Date().getFullYear();
        var options = {
            // 特殊类型
            type: 'jiaju',
            // 年份限制
            yearRange: year + '-' + lastYear,
            // 默认显示的日期
            defaultYear: vars.date ? parseInt(vars.date.substr(0, 4)) : new Date().getFullYear(),
            defaultMonth: vars.date ? parseInt(vars.date.substr(4, 2)) : new Date().getMonth() + 1,
            dateConfirmFunc: function (date) {
                window.location.href = vars.monthUrl + 'date=' +date;
            }
        };
        var dtSelect = new DateAndTimeSelect(options);
        $('.time_cj').on('click', function () {
            dtSelect.show(dtSelect.setting.SELET_TYPE_DATE);
        });

        //成交数据地址
        $('.cent_tab_left').on('click', function () {
            window.location.href = vars.dealUrl;
        });
    };
});