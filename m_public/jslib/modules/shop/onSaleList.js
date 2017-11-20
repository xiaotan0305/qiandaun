/**
 * 店铺在售房源列表页
 * by lipengkun
 * 20160602 lipengkun@fang.com
 */
define('modules/shop/onSaleList', ['jquery','slideFilterBox/1.0.0/slideFilterBox','hslider/1.0.0/hslider'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 区县id
        var disId;
        // 筛选插件
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        // 选择插件
        var hslider = require('hslider/1.0.0/hslider');
        // 筛选栏位置/区域
        var position = $('#position');
         
        // 筛选栏
        var tabBox = $('#tabSX');
        // 商圈列表
        var comareaSec = $('#comarea_section');
    
        // 更多筛选内容
        var secAll = $('#sec_all');
        // 筛选背景浮层
        var floatBox = $('#tabFloat');
        // 更多选项中内容选择项
        var choseItem = $('.chose-item');

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
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 手指滑动恢复浏览器默认事件（恢复滚动
         */
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }

        // 更多选项中选择了大于第一行的元素时则全部展开此选项内容。
        choseItem.each(function (index, el) {
            var elem = $(el);
            var actIndex = elem.find('a').index(elem.find('a.active'));
            if (actIndex > 3) {
                elem.find('.flexbox').show().end().prev().find('a').removeClass('arr-down').addClass('arr-up');
            }
        });
        // 二手房详情页图片增加惰性加载功能
        require.async('lazyload/1.9.1/lazyload', function () {
            $('.lazyload').lazyload();
        });
        if ($('#drag').length > 0) {
            //loadmore所请求的地址
            var loadMoreUrl = vars.mainSite + 'shop/?c=shop&a=ajaxonSaleList' + '&city=' + vars.cityname + '&ecshopids='
                + vars.ecshopids + '&x=' + vars.coordx + '&y=' + vars.coordy + '&pagesize=' + vars.stepByNum;
            //需要传的ajax参数,price下面单独处理
            var screenParam = ['comarea', 'room', 'area', 'tags', 'floor', 'orderby', 'age', 'buildclass', 'equipment', 'purpose', 'keyword', 'priorprojcode'];
            for (var i = 0; i < screenParam.length; i++) {
                if (vars[screenParam[i]]) {
                    loadMoreUrl += '&' + screenParam[i] + '=' + vars[screenParam[i]];
                }
            }
            //由于price分隔符需要做转换，故单独处理
            if (vars.price) {
                loadMoreUrl += '&price=' + vars.price.replace('^', ',');
            }
            require.async('loadMore/1.0.0/loadMore', function(loadMore){
                loadMore({
                    url: loadMoreUrl,
                    total: vars.allCount,
                    pagesize: vars.firstPgNum,
                    pageNumber: vars.stepByNum,
                    contentID: '.houseList',
                    moreBtnID: '#drag',
                    loadPromptID: '#loading',
                    firstDragFlag: false
                });
            });
        }

        // 执行搜索初始化
        if (vars.action === 'onSaleList') {
            require.async('search/shop/shopSearch', function (ShopSearch) {
                var shopSearch = new ShopSearch();
                // @20160121 blue 新增需求，搜索存储所有筛选字段
                if (vars.filter) {
                    shopSearch.setFilterHistory(vars.filter, window.location.href);
                }
                shopSearch.init();
            });
        }

        // 条件数组
        var results = {
            // 商圈
            comareaId: vars.comarea || '',
            // 价格
            priceId: vars.price.replace('^', ',') || '',
            // 户型
            roomId: vars.room || '',
            // 特色
            tagsId: vars.tags || '',
            // 排序
            orderbyId: vars.orderby || '',
            // 房龄
            ageId: vars.age || '',
            // 建筑面积
            areaId: vars.area || '',
            buildclassId: vars.buildclass || '',
            // 装修
            equipmentId: vars.equipment || '',
            // 楼层
            floorId: vars.floor || '',
            // 物业类型
            purposeId: vars.purpose || ''
        };

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
            tabBox.removeClass('tabSX');
            tabBox.find('.lbTab > div').hide();
            tabBox.find('.lbTab > ul > li').removeClass('active');
            $(this).hide();
            enable();
        });

        // 点击位置，展示位置区域

        position.on('click', function () {
            var thisEl = $(this);
            var contFlexbox = $('#contFlexbox');
            // 添加位置/区域选中样式
            thisEl.toggleClass('active').siblings().removeClass('active');
            
            contFlexbox.show();
            $("#comarea").show;
            contFlexbox.siblings().not('ul').hide();
            tabSXStyle($(this));
            iscrollCtrl.refresh('#comarea_section');
            
        });

        $("#comarea_dl_").on('click','dd', function () {
           $('#position').find('span').html($(this).find('a').html());
             
        });
        

        // 点击筛选栏中各个筛选项(位置除外)
        tabBox.find('.lbTab > ul > li').not('#position').on('click', function () {
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

            // hslider插件应用
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
                    }).on('touchend', function () {
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

       

       
        // 更多样式筛选 筛选后选项标红，将目标元素的data-id 值写入result数组中，如筛选选项为类型，则记录用户行为
        secAll.find('.chose-item').on('click', 'a', function () {
            var el = $(this);
            var elId = el.parent().parent().attr('id');
            
            var tgIndex = elId.lastIndexOf('_');
            var tgName = elId.slice(tgIndex + 1);

            if (el.attr('class') === 'active') {
                el.removeClass('active');
                results[tgName + 'Id'] = '';
            } else {
                $('#' + elId).find('a').removeClass('active');
                el.addClass('active');
                if (elId === 'search_category') {
                } else {
                    results[tgName + 'Id'] = el.attr('data-id');
                }
            }
        });

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
            if (vars.purpose_oper === 'R') {
                urlvalue = vars.mainSite + 'shop/' + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_h_a_c_s_x_f/';
            } else{
                urlvalue = vars.mainSite + 'shop_bs/' + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_a_c_x_p_d/';
            }
            if (aId === 'price') {
                var price;
                price = vars.price.replace('^',',');
                if (urlvalue.indexOf('_m') > -1) {
                    urlvalue = urlvalue.replace('_m', '_m' + minData + ',' + maxData);
                }
            }
            //需要拼接的参数
            var keyArr = {
                comarea: 'b',
                room: 'h',
                area: 'a',
                tags: 'c',
                age: 'f',
                floor: 's',
                orderby: 'x',
                buildclass: 'p',
                equipment: 'd'
            };
            for (var key in keyArr) {
                if (urlvalue.indexOf('_' + keyArr[key]) > -1 && results[key + 'Id']) {
                    // 由于shop_bs中也含有_b，故单独处理
                    if (key === 'comarea') {
                        urlvalue = urlvalue.replace('_b_', '_b' + results['comareaId'] + '_');
                    } else {
                        urlvalue = urlvalue.replace('_' + keyArr[key], '_' + keyArr[key] + results[key + 'Id']);
                    }
                }
            }
            if (vars.keyword) {
                urlvalue += '?keyword=' +vars.keyword;
            }
            window.location = urlvalue;
        }

        // 点击价格或者建筑面积筛选确认按钮
        $('#priceFormatUrl,#areaFormatUrl').on('click', function (e) {
            var thiz = $(this);
            assemblyUrl(thiz.attr('id').replace('FormatUrl', ''));
            e.stopPropagation();
        });

        // 清空更多中的筛选条件
        $('.cz').click(function () {
            results.tagsId = '';
            results.orderbyId = '';
            results.buildclassId = '';
            results.equipmentId = '';
            results.propertysubtypeId = '';
            results.floorId = '';
            results.ageId = '';
            if ($('#searchArea').length === 0) {
                results.areaId = '';
            }
            if ($('#searchPrice').length === 0) {
                results.priceId = '';
            }
            $('#all_category').find('span').html('住宅');
            choseItem.find('a').removeClass('active');
        });

        // 点击更多种的确认按钮后进行筛选
        $('.sx').click(function () {
            var selAllUrl;
            if (vars.purpose_oper == 'R') {
                selAllUrl = vars.mainSite + 'shop/' + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_h_a_c_s_x_f/';
            } else {
                selAllUrl = vars.mainSite + 'shop_bs/' + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_a_c_x_p_d/';
            }
            // 别墅列表页——更多——类型 选择“住宅”则要转换到住宅列表页的地址(不知道为什么要重新写地址不使用utm_term等参数)
            if ($('#search_buildclass').find('a.active').html() === '住宅') {
                selAllUrl = vars.mainSite + 'shop/' + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_h_a_c_s_x_f/';
                if (results.comareaId.length > 0) {
                    selAllUrl = selAllUrl.replace('_b_', '_b' + results.comareaId + '_');
                }
                if (results.orderbyId !== 'null' && results.orderbyId.length > 0) {
                    selAllUrl = selAllUrl.replace('_x', '_x' + results.orderbyId);
                }
            }
            // 住宅列表中筛选类型为别墅时(选择别墅时除区县、商圈、以及排序外其它条件无效)
            if ($('#search_category').find('a.active').html() === '别墅') {
                selAllUrl = vars.mainSite + 'shop_bs/' + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_a_c_x_p_d/';
                if (results.comareaId.length > 0) {
                    selAllUrl = selAllUrl.replace('_b_', '_b' + results.comareaId + '_');
                }
                if (results.orderbyId !== 'null' && results.orderbyId.length > 0) {
                    selAllUrl = selAllUrl.replace('_x', '_x' + results.orderbyId);
                }
            } else {
                //需要拼接的参数
                var keyArr = {
                    comarea: 'b',
                    price: 'm',
                    room: 'h',
                    area: 'a',
                    tags: 'c',
                    age: 'f',
                    floor: 's',
                    orderby: 'x',
                    buildclass: 'p',
                    equipment: 'd'
                };
                for (var key in keyArr) {
                    if (selAllUrl.indexOf('_' + keyArr[key]) > -1 && results[key + 'Id']) {
                        // 由于shop_bs中也含有_b，故单独处理; orderby由于上一个if会先处理一遍，导致重复，故也单独处理
                        if (key === 'comarea' || key === 'orderby') {
                            selAllUrl = selAllUrl.replace('_' + keyArr[key] + '_', '_' + keyArr[key] + results[key + 'Id'] + '_');
                        } else {
                            selAllUrl = selAllUrl.replace('_' + keyArr[key], '_' + keyArr[key] + results[key + 'Id']);
                        }
                    }
                }
            }
            if (vars.keyword) {
                selAllUrl += '?keyword=' +vars.keyword;
            }
            window.location = selAllUrl;
        });

        // 页面向上滚动筛选栏固顶向下滚动加筛选栏隐藏
        var initTop = 114;
        $(window).on('scroll', function () {
            if ($('#nav').css('display') === 'none' && tabBox.hasClass('tabSx') === false) {
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollTop > initTop || scrollTop < 114) {
                    tabBox.removeClass('tabFixed');
                } else {
                    tabBox.addClass('tabFixed');
                }
                initTop = scrollTop;
            }
        });

    };
})
;