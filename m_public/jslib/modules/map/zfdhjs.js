/**
 * 租房地图各种点击事件js-2016-8-31
 */
define('modules/map/zfdhjs', ['jquery', 'modules/map/zfSFMap', 'modules/map/mapPublic',
        'search/map/mapSearch', 'slideFilterBox/1.0.0/slideFilterBox', 'hslider/1.0.0/hslider'
    ],
    function (require) {
        'use strict';
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var zfSFMap = require('modules/map/zfSFMap');
        var MapPublic = require('modules/map/mapPublic');
        //  地图搜索主类
        var MapSearch = require('search/map/mapSearch');
        // 租金滑动条
        var priceHslider = null;
        var priceHsliderDom = $('#priceHslider');
        // 筛选插件
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        // 选择插件
        var hslider = require('hslider/1.0.0/hslider');
        // 筛选项
        var tabBox = $('#tabSX');
        var floatBox = $('#tabFloat');
        // 筛选框的Ul标签
        var searchBoxUl = $('#searchBoxUl');
        // 位置
        var position = $('#position');
        // 第一级列表
        var firstSec = $('#searchnew');
        // 控制位置选项列表中  第三级的显隐标志
        var showFlag = {
            railway: false,
            district: false
        };
        // 区县列表
        var districtList = $('#district_section');
        // 地铁线列表
        var railwaySec = $('#railway_section');
        // 商圈列表
        var comareaSec = $('#comarea_section');
        // 地铁站列表
        var stationSec = $('#station_section');
        // 更多筛选内容
        var secAll = $('#more_section');
        // 时间戳
        var timeBuxian;
        // 筛选更多底部遮挡问题 lina 20170216
        $('.moreChoo').css('padding-bottom', '35px');
        // 定位
        $('.dw-icon').on('click', function () {
            comareaSec.find('dd').removeClass('active');
            stationSec.find('dd').removeClass('active');
            MapPublic.locationMap('zf', 1);
        });
        // 缩放，线上不显示这个功能
        $('#zoomIn').on('click', function () {
            zfSFMap.setZoom('+');
        });
        $('#zoomOut').on('click', function () {
            zfSFMap.setZoom('-');
        });
        // 搜索功能初始化
        var mapSearch = new MapSearch();
        var searchClick = $('.icon-sea');
        mapSearch.showPopBtn = searchClick;
        searchClick.on('click', function () {
            // 第一次加载或者正在搜索点击没效果
            if (zfSFMap.firstLoad || zfSFMap.isSearched) {
                return;
            }
            // 隐藏文档流
            mapSearch.hideBody();
            // 显示弹窗
            mapSearch.showPop();
        });
        // 滚动加载
        $('#house_detail_wrap').on('scroll', function (e) {
            e.preventDefault();
            var ele = $(this);
            // 一页显示的高度
            var scrollh = ele.height();
            // 列表的高度
            var totalHeight = ele.find('ul').height();
            // 到达底部，加载更多,isSearching判断是否正在搜索，30是提示框的高度-6，如果刚好等于手机上滑动不会加载，要减去6小一点
            if (ele.scrollTop() > totalHeight - scrollh + 30 && !zfSFMap.isSearching) {
                MapPublic.loadMore('zf');
            }
        }).on('click', 'li', function () {
            // 已点击房源要变色
            var p = vars.localStorage.getItem('visitedHouse');
            var houseid = $(this).attr('data-id');
            if (p === null) {
                vars.localStorage.setItem('visitedHouse', houseid + ';');
            } else if (p.indexOf(houseid + ';') === -1) {
                vars.localStorage.setItem('visitedHouse', p + houseid + ';');
            }
        }).on('swipe', function (e) {
            e.preventDefault();
        });
        // 房源列表上方的楼盘要加链接
        $('.map-out').on('click', '#projectList', function () {
            window.location.href = vars.mainSite + 'xiaoqu/' + vars.city + '/' + $(this).attr('data-id') + '.html';
        });

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

        /**
         * 点击筛选框背景浮层,收起筛选
         */
        floatBox.on('click', function () {
            // 获取第三列可见的dom元素
            var positionList3 = $('.positionList3:visible');
            // 获取第三列选中的元素
            var list3Act = positionList3.find('.active');
            // 三级菜单显示 并且三级菜单没有选中的元素 则点击浮层时跳转
            if (positionList3.length && !list3Act.length && railwaySec.find('dd').hasClass('active')) {
                positionList3.find('dd').eq(0).trigger('click');
            } else {
                tabBox.removeClass('tabSX');
                tabBox.find('.lbTab > div').hide();
                tabBox.find('.lbTab > ul > li').removeClass('active');
                $(this).hide();
                enable();
            }
        });

        /**
         * 将选中地铁站或者地铁线滚动到可视区域内
         * @param obj  jquery对象 选中元素的父级
         */
        function scrollShowIndex(obj) {
            // 地铁站或者地铁线dl列表父级section对象
            var secObj = obj;
            if (obj.is('dl')) {
                secObj = obj.parent();
            }
            var temObj = obj.find('dd.active');
            // 有滚动插件
            if (iscrollCtrl) {
                // 有选中项
                if (temObj.length) {
                    var activeIndex = temObj.prevAll().length;
                    var nextElLen = (temObj.nextAll().length + 1) * 44;
                    var height = secObj.height();
                    // 如果列表中被选中项之下的所有元素高度大于容器的高度，则可以将其置顶显示
                    if (nextElLen > height) {
                        // 如含有地铁线或者地铁站，则将选中元素滚动至可视区域 44为地铁线列表中每个元素的高度
                        iscrollCtrl.to('#' + secObj.attr('id'), -activeIndex * 44);
                    }
                } else {
                    // 没有选中项到顶部
                    iscrollCtrl.to('#' + secObj.attr('id'), 0);
                }
            }
        }

        // 点击筛选栏中各个筛选项(位置除外)
        searchBoxUl.on('click', 'li', function () {
            var timeLi = Date.parse(new Date());
            if (timeBuxian && timeLi - timeBuxian < 200) {
                console.log(timeLi - timeBuxian);
                return;
            }
            var thisEl = $(this);
            var idVal = thisEl.attr('id');
            // 第一次加载,正在搜索,点击的是未知点击没效果
            if (zfSFMap.firstLoad || zfSFMap.isSearching || idVal === 'position') {
                return;
            }

            $('.cont').not('#' + idVal + '_contFlexbox').hide();
            var contFlexbox = $('#' + idVal + '_contFlexbox');
            thisEl.toggleClass('active').siblings().removeClass('active');
            contFlexbox.toggle().siblings().not('ul').hide();
            tabSXStyle(thisEl);
            if (contFlexbox.is(':visible')) {
                var idText = contFlexbox.children().first().attr('id');
                iscrollCtrl.refresh('#' + idText);
            }
            // 租金使用自定义选择插件
            if (idVal === 'price') {
                if (!priceHslider) {
                    priceHslider = new hslider({
                        max: priceHsliderDom.attr('max'),
                        min: priceHsliderDom.attr('min'),
                        step: 100,
                        oParent: priceHsliderDom,
                        leftSign: priceHsliderDom.find('div.active').eq(0),
                        rightSign: priceHsliderDom.find('div.active').eq(1),
                        range: priceHsliderDom.find('span')
                    });
                    // 有自定义价格或者面积时滑动筛选滚动条相关显示效果
                    var customBox = $('.in-qj');
                    if (customBox.length > 0) {
                        customBox.find('div').on('touchstart', function () {
                            var $that = $(this);
                            $that.addClass('hover');
                            $that.siblings().not('span').removeClass('hover');
                        }).on('touchend', function () {
                            $(this).removeClass('hover');
                        });
                    }
                }
                // 初始化判断滑块位置变量数组
                var rangArr = [];
                if (zfSFMap.params.strPrice) {
                    // 价格滑块的区间
                    rangArr = zfSFMap.params.strPrice.split('^');
                }
                // 如果携带价格参数初始化时展示选中参数，否则滑块定位不限
                if (rangArr.length > 1) {
                    priceHslider._initPos(parseInt(rangArr[0]), parseInt(rangArr[1]));
                } else {
                    priceHslider._initPos();
                }
            }
        });

        // 点击位置，展示地铁站，区县
        position.on('click', function () {
            
            // 如果是初始化实现
            if (zfSFMap.firstLoad || zfSFMap.isSearching) {
                return;
            }
            var timeLi = Date.parse(new Date());
            if (timeBuxian && timeLi - timeBuxian < 200) {
                console.log(timeLi - timeBuxian);
                return;
            }
            var thisEl = $(this);
            var contFlexbox = $('#contFlexbox');
            // 添加位置/区域选中样式
            thisEl.toggleClass('active').siblings().removeClass('active');
            $('.cont').not('#contFlexbox').hide();
            contFlexbox.children().hide().end().siblings().not('ul').hide();
            tabSXStyle(thisEl);
            contFlexbox.toggle();
            if (contFlexbox.is(':visible')) {
                // 展示一级列表
                firstSec.toggle();
                if (firstSec.is(':visible')) {
                    iscrollCtrl.refresh('#searchnew');
                }
                // 初始化时含有地铁参数选中地铁选项
                if (zfSFMap.params.railwayName) {
                    // 二级地铁线路列表
                    $('#railway').addClass('active').siblings().removeClass('active');
                    // 地铁线列表显示
                    // 选中地铁线，这么初始化是防止在选择了地铁线和地铁站后，修改地铁线，再次打开地铁站和地铁线不匹配的问题
                    railwaySec.find('a[data-id=' + zfSFMap.params.railway + ']').parent().addClass('active').siblings().removeClass('active');
                    railwaySec.show();
                    iscrollCtrl.refresh('#railway_section');
                    // 如含有地铁线，则将选中地铁线路图滚动至可视区域 43为地铁线列表中每个元素的高度
                    scrollShowIndex(railwaySec);

                    var subwayId = railwaySec.find('.active a').attr('data-id');
                    var stationDl = $('#station_dl_' + subwayId);
                    // 有选中地铁站
                    if (stationDl.length) {
                        // 初始化时含有地铁站参数
                        stationSec.show().find('dl').hide();
                        stationDl.show();
                        iscrollCtrl.refresh('#station_section');
                        // 有线路没有地铁站名称，默认全部,解决缩放改变位置到地铁线，地铁站列表问题
                        if (!zfSFMap.params.stationName) {
                            var stationDlDd = stationDl.find('dd');
                            stationDlDd.removeClass('active');
                            stationDlDd.eq(0).addClass('active');
                        }
                        // 如含有地铁线，则将选中地铁线路图滚动至可视区域 43为地铁线列表中每个元素的高度
                        scrollShowIndex(stationDl);
                    }
                    // 未选中地铁相关数据，默认展示第二级区县列表
                } else {
                    var districtChannel = $('#district');
                    // 二级区县列表
                    districtChannel.addClass('active').siblings().removeClass('active');
                    // 默认显示第二级区县列表
                    // 如果区县为空，去除选中
                    if (zfSFMap.params.strDistrict === '') {
                        // 区县选中移除
                        districtList.find('dd').removeClass('active');
                    } else {
                        districtList.find('a[data-id=' + zfSFMap.params.districtId + ']').parent().addClass('active').siblings().removeClass('active');
                        districtList.show();
                    }
                    districtList.nextAll().hide().end().show();
                    iscrollCtrl.refresh('#district_section');
                    // 滚到可视区县
                    scrollShowIndex(districtList);

                    var disId = districtList.find('.active a').attr('data-id');
                    var comareaDl = $('#comarea_dl_' + disId);
                    // 有选中商圈
                    if (comareaDl.length) {
                        // 初始化时含有商圈参数显示第三级列表商圈列表
                        comareaSec.show().find('dl').hide();
                        comareaDl.show();
                        iscrollCtrl.refresh('#comarea_section');
                        // 滚到可视区域
                        scrollShowIndex(comareaSec);
                    }
                }
            }
        });
        // 点击区域或者地铁,显示区县/地铁线列表
        firstSec.on('click', 'dd', function () {
            var el = $(this);
            // 下级列表id
            var secondList = '#' + el.attr('id') + '_section';
            var $secondList = $(secondList);
            el.addClass('active').siblings().removeClass('active');
            $secondList.show().siblings().not('#searchnew').hide();
            iscrollCtrl.refresh(secondList);
            scrollShowIndex($secondList);
            // 判断是否选中默认不限
            if (el.attr('id') === 'railway') {
                if (zfSFMap.params.railway === '') {
                    $secondList.find('dd.active').removeClass('active');
                }
                if (showFlag.railway) {
                    if (stationSec.find('.active').length) {
                        stationSec.show();
                    }
                    comareaSec.hide();
                }
            } else {
                if (zfSFMap.params.strDistrict === '') {
                    $secondList.find('dd.active').removeClass('active');
                }
                if (showFlag.district) {
                    if (comareaSec.find('.active').length) {
                        comareaSec.show();
                    }
                    stationSec.hide();
                }
            }
        });
        // 点击区县列表中元素，显示区县下商圈列表
        districtList.on('click', 'dd', function () {
            var tg = $(this);
            var ag = tg.find('a');
            var disId = ag.attr('data-id');
            // 选择不限
            if (disId === 'all') {
                comareaSec.hide().find('dd').removeClass('active');
                position.trigger('click');
                zfSFMap.clickComplete(ag, 'district');
            } else {
                tg.addClass('active').siblings().removeClass('active');
                // 显示下级目录
                comareaSec.show().find('dl').hide();
                var cg = $('#comarea_dl_' + disId);
                if (zfSFMap.params.strComArea === '') {
                    cg.find('dd.active').removeClass('active');
                }
                cg.show();
                iscrollCtrl.refresh('#comarea_section');
            }
        });
        // 点击商圈列表
        comareaSec.on('click', 'dd', function () {
            var $that = $(this);
            position.trigger('click');
            // 所有商圈有选中样式的全部取消
            if (!$that.hasClass('active')) {
                comareaSec.find('dd.active').removeClass('active');
                var tg = $(this).addClass('active').siblings().removeClass('active').end();
                var ag = tg.find('a');
                zfSFMap.clickComplete(ag, 'comarea');
                showFlag.railway = false;
                showFlag.district = true;
            }
        });
        // 点击地铁线列表元素显示地铁站
        railwaySec.on('click', 'dd', function () {
            var tg = $(this);
            var ag = tg.find('a');
            var lineId = ag.attr('data-id');
            // 选择不限
            if (lineId === 'all') {
                stationSec.hide().find('dd').removeClass('active');
                position.trigger('click');
                zfSFMap.clickComplete(ag, 'railway');
            } else {
                tg.addClass('active').siblings().removeClass('active');
                // 显示下级目录
                stationSec.show().find('dl').hide();
                var stationDl = $('#station_dl_' + lineId);
                if (zfSFMap.params.stationName === '') {
                    stationDl.find('dd.active').removeClass('active');
                }
                stationDl.show();
                iscrollCtrl.refresh('#station_section');
                scrollShowIndex(stationDl);
            }
        });
        // 点击地铁站列表
        stationSec.on('click', 'dd', function () {
            var $that = $(this);
            position.trigger('click');
            // 所有地铁站有选中样式的全部取消
            if (!$that.hasClass('active')) {
                stationSec.find('dd.active').removeClass('active');
                var tg = $(this).addClass('active').siblings().removeClass('active').end();
                var ag = tg.find('a');
                zfSFMap.clickComplete(ag, 'station');
                showFlag.railway = true;
                showFlag.district = false;
            }

        });
        // 更多样式筛选 筛选后选项标红
        secAll.find('.chose-item').on('click', 'a', function () {
            var el = $(this);
            var elId = el.parent().parent().attr('id');
            if (el.attr('class') === 'active') {
                el.removeClass('active');
            } else {
                $('#' + elId).find('a').removeClass('active');
                el.addClass('active');
            }
        });
        // 点击租金筛选确认按钮
        $('#priceChoose').on('touchend', function () {
            var left = priceHslider.leftVal === '不限' ? '' : priceHslider.leftVal;
            var right = priceHslider.rightVal === '不限' ? '' : priceHslider.rightVal;
            var obj = $('#price_contFlexbox dd[data-id=custom]');
            obj.text(left + '-' + right);
            obj.trigger('touchend');
        });
        // 租金快筛项点击
        $('#price_contFlexbox').on('touchend', 'dd', function () {
            var $that = $(this);
            $('#price').trigger('click');
            if (!$that.hasClass('active') || $that.attr('data-id') === 'custom') {
                $that.addClass('active').siblings().removeClass('active');
                zfSFMap.clickComplete($that, 'price');
            }
            timeBuxian = Date.parse(new Date());

        });

        // 来源快筛项点击
        $('#housetype_contFlexbox').on('touchend', 'dd', function () {
            var $that = $(this);
            $('#housetype').trigger('click');
            if (!$that.hasClass('active')) {
                $that.addClass('active').siblings().removeClass('active');
                zfSFMap.clickComplete($that, 'housetype');
            }
            timeBuxian = Date.parse(new Date());
        });

        // 点击更多种的确认按钮后进行筛选
        var infoStr = '';
        $('#completeChoose').on('click', function () {
            var info = {};
            vars.mapTemplateMore = {};
            $('.chose-item').each(function () {
                var $that = $(this);
                // 类型,7是更多条件id如search_area的search_，从这里截取
                var type = $that.attr('id').substr(7);
                var obj = $that.find('a.active');
                if (obj.length > 0) {
                    info[type] = obj.attr('data-id');
                    vars.mapTemplateMore[type] = obj.text();
                }
            });
            $('#more').trigger('click');
            if (info && (JSON.stringify(info) !== infoStr)) {
                zfSFMap.clearOtherOption('morechoose', info);
                infoStr = JSON.stringify(info);
            } else if (!info) {
                zfSFMap.clearOtherOption('morereset');
            }
        });
        // 清空更多中的筛选条件
        $('#resetParam').on('click', function () {
            secAll.find('.active').removeClass('active');
        });
    });