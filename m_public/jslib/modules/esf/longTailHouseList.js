/**
 * 二手房列表页主类
 * 20151223 liuxinlu 删除部分废旧无用代码，优化筛选所有操作，添加删选新样式。
 */
define('modules/esf/longTailHouseList', ['jquery', 'modules/esf/yhxw', 'slideFilterBox/1.0.0/slideFilterBox',
    'iscroll/2.0.0/iscroll-lite', 'hslider/1.0.0/hslider', 'swipe/3.10/swiper'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // jquery对象
            var $ = require('jquery');
            // seajs 数据对象
            var vars = seajs.data.vars;
            // 用户行为对象
            var yhxw = require('modules/esf/yhxw');
            // 筛选插件
            var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
            // 选择插件
            var hslider = require('hslider/1.0.0/hslider');
            // 筛选栏
            var tabBox = $('#tabSX');
            // 筛选背景浮层
            var floatBox = $('#tabFloat');
            // swipe插件
            var Swiper = require('swipe/3.10/swiper');
            /**
             *阻止浏览器默认事件
             * @param e 浏览器默认事件
             */
            function preventDefault(e) {
                e.preventDefault();
            }

            /**
             * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
             */
            function unable() {
                window.addEventListener('touchmove', preventDefault, { passive: false });
            }

            /**
             * 手指滑动恢复浏览器默认事件（恢复滚动
             */
            function enable() {
                window.removeEventListener('touchmove', preventDefault, { passive: false });
            }
            // 图片延迟加载
            require.async('lazyload/1.9.1/lazyload', function () {
                $('img.lazyload').lazyload({
                    event: 'scroll touchmove mousemove'
                });
                $('img.lazy').lazyload();
            });
            /**
             * 给筛选类别添加或删除选中样式
             * @param obj 筛选类别 jquery对象
             */
            function tabSXStyle(obj) {
                if (obj.hasClass('active')) {
                    tabBox.addClass('tabSX');
                    floatBox.show();
                    unable();
                } else {
                    tabBox.removeClass('tabSX');
                    floatBox.hide();
                    enable();
                }
            }
            // 点击筛选框背景浮层,收起筛选+++++++++++++++++++++++++++++++++++++
            floatBox.click(function () {
                var col3VisElement = $('.column3:visible');
                // 获取第三列选中的元素
                var col3ActElement = col3VisElement.find('.active');
                // 三级菜单显示 并且三级菜单没有选中的元素 则点击浮层时跳转
                if (col3VisElement.length && !col3ActElement.length) {
                    // 当三级列表可见并且没有选中的元素时表示默认选择了三级列表的不限 因此获取三级列表的不限对应的连接地址进行跳转
                    var a = col3VisElement.find('a:first')[0];
                    window.location.href = a.href;
                }
                tabBox.removeClass('tabSX');
                tabBox.find('.lbTab > div').hide();
                tabBox.find('.lbTab > ul > li').removeClass('active');
                $(this).hide();
                enable();
            });
            // 点击筛选栏中各个筛选项(位置除外)
            tabBox.find('.lbTab > ul > li').on('click', function () {
                $('#contFlexbox').hide();
                var sliderObj = null;
                var thisEl = $(this);
                var idVal = thisEl.attr('id');
                var contFlexbox = $('#' + idVal + '_contFlexbox');
                thisEl.toggleClass('active').siblings().removeClass('active');
                contFlexbox.toggle().siblings().not('ul').hide();
                tabSXStyle($(this));
                if (contFlexbox.css('display') !== 'none') {
                    var idText = contFlexbox.children().first().attr('id');
                    iscrollCtrl.refresh('#' + idText);
                }
                var hsliderBox = $('#' + idVal + 'Hslider');
                // 判断是否需要使用自定义选择插件
                if (!sliderObj && contFlexbox.find(hsliderBox).length > 0) {
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
                        }).on('click', function () {
                            $(this).removeClass('hover');
                        });
                    }
                }
                if (sliderObj && contFlexbox.find(hsliderBox).length > 0) {
                    var hsliderId = hsliderBox.attr('id');
                    var rangArr = [];
                    if (vars.area && vars.area.length && hsliderId.indexOf('area') > -1) {
                        rangArr = vars.area.split('^');
                    } else if (vars.price && vars.price.length && hsliderId.indexOf('price') > -1) {
                        rangArr = vars.price.split('^');
                    }
                    // 如果携带建筑面积参数/价格参数初始化时展示选中参数
                    if (rangArr.length > 1) {
                        sliderObj._initPos(parseInt(rangArr[0]), parseInt(rangArr[1]));
                    }
                }
            });
            // 分页样式
            var dragBox = $('#drag');
            if (dragBox.length > 0) {
                require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                    loadMore({
                        url: vars.esfSite + vars.nowUrl + 'c=esf&a=ajaxLongTailHouseList&city=' + vars.city,
                        total: vars.total,
                        pagesize: 30,
                        pageNumber: '10',
                        contentID: '#content',
                        moreBtnID: '#drag',
                        loadPromptID: '#loading',
                        callback: function (data) {
                        }
                    });
                });
            }
            /**
             * 自定义价格
             * @param aId 类型id
             * @returns {boolean}
             */
            $('#priceFormatUrl').on('click', function (e) {
                var minData = $('#pricemin').find('i').text();
                var maxData = $('#pricemax').find('i').text();
                var urlvalue;
                minData = minData === '不限' ? '0' : minData;
                maxData = maxData === '不限' ? '0' : maxData;
                // 匹配大于0的正整数
                var pattern = /^\d+$/;
                if (pattern.test(minData) === false || pattern.test(maxData) === false) {
                    alert('请填写有效的整数！');
                    return false;
                }
                urlvalue = vars.mainSite + 'esf_' + vars.ltid + '_' + vars.city + '/';
                if (vars.price) {
                    urlvalue += 'm' + vars.price;
                }
                if (vars.room) {
                    urlvalue += 'h' + vars.room;
                }
                if (vars.area) {
                    urlvalue += 'a' + vars.area;
                }
                if (vars.price || vars.room || vars.area) {
                    urlvalue += '/';
                }
                window.location = urlvalue;
                return false;
            });

            // 页面向上滚动筛选栏固顶向下滚动加筛选栏隐藏
            var initTop = 114;
            $(window).on('scroll', function (e) {
                if ($('#nav').css('display') === 'none' && tabBox.hasClass('tabSx') === false) {
                    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                    if (scrollTop > initTop || scrollTop < 114) {
                        tabBox.removeClass('tabFixed');
                    } else {
                        tabBox.addClass('tabFixed');
                    }
                    initTop = scrollTop;
                }
                e.stopPropagation();
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