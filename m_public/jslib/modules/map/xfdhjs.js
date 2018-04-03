/**
 * 新房地图快筛事件绑定处理
 * 20160427 lixiaoru修改
 */
define('modules/map/xfdhjs', ['jquery', 'modules/map/xfSFMap', 'modules/map/mapPublic',
    'search/map/mapSearch', 'slideFilterBox/1.0.0/slideFilterBox', 'hslider/1.0.0/hslider'],
    function (require) {
        'use strict';
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var xfSFMap = require('modules/map/xfSFMap');
        var MapPublic = require('modules/map/mapPublic');
        //  地图搜索主类
        var MapSearch = require('search/map/mapSearch');
        // 筛选插件
        var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
        // 选择插件
        var hslider = require('hslider/1.0.0/hslider');
        // 筛选栏
        var tabBox = $('#tabSX');
        // 筛选背景浮层
        var floatBox = $('#tabFloat');
        // 筛选栏位置
        var position = $('#position');
        // 第一级列表
        var firstSec = $('#searchnew');
        // 区县列表
        var districtSec = $('#district_section');
        // 地铁线列表
        var railwaySec = $('#railway_section');
        // 地铁站列表
        var stationSec = $('#station_section');
        // 学校类别列表
        var schoolTypeSec = $('#schoolType_section');
        // 学校列表
        var schoolSec = $('#school_section');
        // 更多筛选内容
        var secAll = $('#sec_all');
        // 筛选栏总价
        var price = $('#price');
        // 筛选栏户型
        var room = $('#room');
        // 户型全部
        var roomContFlexbox = $('#room_contFlexbox');
        // 筛选栏热门
        var $yhRedBtn = $('.yh-icon');
        // 筛选对象
        var sliderObj;
        // 控制位置选项列表中  第三级的显隐标志
        var showFlag = {
            railway: false,
            schoolType: false
        };
        // 更多选项中内容选择项
        var choseItem = $('.chose-item');

        // 搜索功能初始化
        var mapSearch = new MapSearch();
        var searchClick = $('.icon-sea, .input');
        mapSearch.showPopBtn = searchClick;
        searchClick.on('click', function () {
            // 第一次加载或者正在搜索点击没效果
            if (xfSFMap.firstLoad || xfSFMap.isSearching) {
                return;
            }
            // 隐藏文档流
            mapSearch.hideBody();
            // 显示弹窗
            mapSearch.showPop();
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
         * 将选中地铁站或者地铁线滚动到可视区域内
         * @param obj  jquery对象 选中元素的父级
         */
        function scrollShowIndex(obj) {
            // 地铁线，学校等列表父级section对象
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
        $('#topTab').on('click', 'li', function () {
            var thisEl = $(this);
            var idVal = thisEl.attr('id');
            // 第一次加载或者正在搜索点击没效果
            if (xfSFMap.firstLoad || xfSFMap.isSearching || idVal === 'position') {
                return;
            }

            var contFlexbox = $('#' + idVal + '_contFlexbox');
            $('.map-out').hide();
            thisEl.toggleClass('active').siblings().removeClass('active');
            contFlexbox.toggle().siblings().not('ul').hide();
            tabSXStyle($(this));
            if (contFlexbox.is(':visible')) {
                var idText = contFlexbox.children().first().attr('id');
                iscrollCtrl.refresh('#' + idText);
            }
            var hsliderBox = $('.qjBox');
            // 判断是否需要使用自定义选择插件
            if (idVal === 'price') {
                if (!sliderObj) {
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
            }
            if (contFlexbox.find(hsliderBox).length > 0) {
                // 由列表页传来的参数确定价格初始化滑动插件
                var hsliderId = hsliderBox.attr('id');
                if (hsliderId.indexOf('price') > -1) {
                    if (xfSFMap.params.strPrice) {
                        var rangArr = xfSFMap.params.strPrice.split(',');
                        if (rangArr.length > 1) {
                            if (rangArr[0] > 0 && rangArr[1] > 0) {
                                sliderObj._initPos(rangArr[0], rangArr[1]);
                            } else if (rangArr[0] > 0) {
                                sliderObj._initPos(rangArr[0]);
                            } else if (rangArr[1] > 0) {
                                sliderObj._initPos(null, rangArr[1]);
                            } else {
                                sliderObj._initPos();
                            }
                        } else {
                            sliderObj._initPos();
                        }
                    } else {
                        sliderObj._initPos();
                    }
                }
            }
        });

        // 点击位置，展示地铁站，区县、以及学区第一级列表，有地铁参数选中地铁项，否则默认选中区县展示区县第二级列表
        position.on('click', function () {
            if (xfSFMap.firstLoad) {
                return;
            }
            var thisEl = $(this);
            var contFlexbox = $('#contFlexbox');
            // 添加位置/区域选中样式
            thisEl.toggleClass('active').siblings().removeClass('active');
            contFlexbox.children().hide().end().siblings().not('ul').hide();
            tabSXStyle($(this));
            contFlexbox.toggle();
            $('.map-out').hide();
            if (contFlexbox.is(':visible')) {
                // 展示一级列表
                firstSec.toggle();
                if (firstSec.is(':visible')) {
                    iscrollCtrl.refresh('#searchnew');
                }
                // 初始化时含有地铁参数选中地铁选项
                if (xfSFMap.params.subwayLine) {
                    // 二级地铁线路列表
                    $('#railway').addClass('active').siblings().removeClass('active');
                    // 选中地铁线，这么初始化是防止在选择了地铁线和地铁站后，修改地铁线，再次打开地铁站和地铁线不匹配的问题
                    railwaySec.find('a[data-id=' + xfSFMap.params.subwayLine + ']').parent().addClass('active').siblings().removeClass('active');
                    railwaySec.show();
                    iscrollCtrl.refresh('#railway_section');
                    // 如含有地铁线，则将选中地铁线路图滚动至可视区域 43为地铁线列表中每个元素的高度
                    scrollShowIndex(railwaySec);
                    // 初始化地铁站
                    stationSec.show().find('dl').hide();
                    var stationDl = $('#station_dl_' + xfSFMap.params.subwayLine);
                    stationDl.show();
                    iscrollCtrl.refresh('#station_section');
                    // 有线路没有地铁站名称，默认全部,解决缩放改变位置到地铁线，地铁站列表问题
                    if (!xfSFMap.params.stationName) {
                        var stationDlDd = stationDl.find('dd');
                        stationDlDd.removeClass('active');
                        stationDlDd.eq(0).addClass('active');
                    }
                    // 如含有地铁线，则将选中地铁线路图滚动至可视区域
                    scrollShowIndex(stationDl);
                    // 未选中地铁相关数据，默认展示第二级区县列表
                } else if (xfSFMap.params.schoolType || xfSFMap.params.schoolFlag) {
                    // 学校类型列表
                    $('#schoolType').addClass('active').siblings().removeClass('active');
                    // 选中学校类型，这么初始化是防止在选择了学校类型和学校后，修改地铁线，再次打开学校和学校类型不匹配的问题
                    if (xfSFMap.params.schoolType) {
                        schoolTypeSec.find('a[data-id=' + xfSFMap.params.schoolType + ']').parent().addClass('active').siblings().removeClass('active');
                    } else {
                        schoolTypeSec.find('dl').children().first().addClass('active').siblings().removeClass('active');
                    }

                    schoolTypeSec.show();
                    iscrollCtrl.refresh('#schoolType_section');
                    // 初始化学校
                    if (xfSFMap.params.schoolType) {
                        schoolSec.show().find('dl').hide();
                        var schoolDl = $('#school_dl_' + xfSFMap.params.schoolType);
                        schoolDl.show();
                        iscrollCtrl.refresh('#school_section');
                        // 如含有学校
                        scrollShowIndex(schoolDl);
                    }
                } else {
                    var districtChannel = $('#district');
                    // 二级区县列表
                    districtChannel.addClass('active').siblings().removeClass('active');
                    // 默认显示第二级区县列表
                    if (xfSFMap.params.strDistrict === '') {
                        districtSec.find('dd').removeClass('active');
                    }
                    districtSec.nextAll().hide().end().show();
                    iscrollCtrl.refresh('#district_section');
                    scrollShowIndex(districtSec);
                }
            }
        });
        // 点击区域、地铁、学区,显示相应一级列表
        firstSec.find('dd').on('click', function () {
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
                if (xfSFMap.params.subwayLine === '') {
                    $secondList.find('dd.active').removeClass('active');
                }
                // 判断是不是第一次点击
                if (showFlag.railway) {
                    if (stationSec.find('.active').length) {
                        stationSec.show();
                    }
                    comareaSec.hide();
                }
            } else if (el.attr('id') === 'schoolType') {
                if (xfSFMap.params.schoolType === '') {
                    $secondList.find('dd.active').removeClass('active');
                }
                if (showFlag.schoolType) {
                    if (schoolSec.find('.active').length) {
                        schoolSec.show();
                    }
                    stationSec.hide();
                }
            } else if (xfSFMap.params.strDistrict === '') {
                $secondList.find('dd.active').removeClass('active');
            }
        });

        // 点击地铁线列表元素显示地铁站
        railwaySec.on('click', 'dd', function () {
            var tg = $(this);
            var ag = tg.find('a');
            var lineId = ag.attr('data-id');
            tg.addClass('active').siblings().removeClass('active');
            // 地铁站列表中选择不限，直接跳转,选择其他显示下级目录
            if (lineId === 'all') {
                stationSec.hide().find('dd').removeClass('active');
                position.trigger('click');
                // 选择地铁线不限，回到初始状态
                xfSFMap.clickComplete(ag, 'district');
            } else {
                tg.addClass('active').siblings().removeClass('active');
                // 显示下级目录
                stationSec.show().find('dl').hide();
                var stationDl = $('#station_dl_' + lineId);
                if (xfSFMap.params.subwayStation === '') {
                    // 地铁站为空移除所有的选中状态
                    stationDl.find('dd.active').removeClass('active');
                }
                stationDl.show();
                iscrollCtrl.refresh('#station_section');
                scrollShowIndex(stationDl);
                // 当前所在快筛位置
                xfSFMap.tempState = 'railway';
                xfSFMap.tempId = lineId;
            }
        });
        // 点击学校类型列表中元素，显示相应学校列表
        schoolTypeSec.on('click', 'dd', function () {
            var tg = $(this);
            var ag = tg.find('a');
            var schooltype = ag.attr('data-id');
            tg.addClass('active').siblings().removeClass('active');
            if (schooltype === 'all') {
                schoolSec.hide().find('dd').removeClass('active');
                tg.removeClass('active');
                // 优惠按钮变灰
                $yhRedBtn.removeClass('active');
                // 学校类型列表中选择不限，搜索全部学校
                position.trigger('click');
                xfSFMap.clickComplete(ag, 'schoolType');
            } else {
                var schoolDl = $('#school_dl_' + schooltype);
                if (schoolDl.length > 0) {
                    if (xfSFMap.params.schoolid === '') {
                        schoolDl.find('dd.active').removeClass('active');
                    }
                    schoolSec.show().find('dl').hide();
                    schoolDl.show();
                    iscrollCtrl.refresh('#school_section');
                } else {
                    schoolSec.hide();
                }
                // 当前所在快筛位置
                xfSFMap.tempState = 'school';
                xfSFMap.tempId = schooltype;
            }
        });

        // 区县搜索
        districtSec.on('click', 'dd', function () {
            var tg = $(this);
            var ag = tg.find('a');
            position.trigger('click');
            if (!tg.hasClass('active')) {
                tg.addClass('active').siblings().removeClass('active');
                xfSFMap.clickComplete(ag, 'district');
                showFlag.railway = false;
                showFlag.schoolType = false;
            }
        });

        // 点击地铁站搜索
        stationSec.on('click', 'dd', function () {
            // 所有地铁站有选中样式的全部取消
            var tg = $(this);
            var ag = tg.find('a');
            position.trigger('click');
            if (!tg.hasClass('active')) {
                stationSec.find('dd.active').removeClass('active');
                tg.addClass('active').siblings().removeClass('active');
                xfSFMap.clickComplete(ag, 'station');
                showFlag.railway = true;
                showFlag.schoolType = false;
            }
        });

        // 点击学校搜索
        schoolSec.on('click', 'dd', function () {
            var tg = $(this);
            var ag = tg.find('a');
            position.trigger('click');
            if (!tg.hasClass('active')) {
                // 优惠按钮变灰
                $yhRedBtn.removeClass('active');
                // 所有学校有选中样式的全部取消
                schoolSec.find('dd.active').removeClass('active');
                tg.addClass('active').siblings().removeClass('active');
                xfSFMap.clickComplete(ag, 'school');
                showFlag.schoolType = true;
                showFlag.railway = false;
            }
        });

        // 更多样式筛选 筛选后选项标红
        secAll.find('#character, #strPurpose, #saleDate, #fitment, #strRoundStation').on('click', 'a', function () {
            var el = $(this);
            var elId = el.parent().parent().attr('id');
            if (el.attr('class') === 'active') {
                el.removeClass('active');
            } else {
                $('#' + elId).find('a').removeClass('active');
                el.addClass('active');
            }
        });
        secAll.find('#area, #status').on('click', 'a', function () {
            var el = $(this);
            var elId = el.parent().parent().attr('id');
            if (el.attr('class') === 'active') {
                el.removeClass('active');
            } else {
                el.addClass('active');
            }
        });

        var roomEnsure = $('#room_ensure');

        // 点击更多种的确认按钮后进行筛选
        var infoStr = '';
        $('#more_ensure').on('click', function () {
            var info = {};
            var maima = {};
            $('.chose-item').each(function () {
                var $that = $(this);
                // 类型
                var type = $that.attr('id');
                var obj = $that.find('a.active');
                if (obj.length > 0) {
                    if (type === 'area') {
                        var area = '';
                        maima['vmn.area'] = '';
                        for (var i = 0, len = obj.length; i < len; i++) {
                            area += obj.eq(i).attr('data-id') + '-';
                            maima['vmn.area'] += encodeURIComponent($.trim(obj.eq(i).text())) + ',';
                        }
                        maima['vmn.area'] = maima['vmn.area'].substring(0, maima['vmn.area'].length - 1);
                        info[type] = area.substring(0, area.length - 1);
                    } else if (type === 'status') {
                        var status = '';
                        maima['vmn.salestatus'] = '';
                        for (var i = 0, len = obj.length; i < len; i++) {
                            status += obj.eq(i).attr('data-id') + ',';
                            maima['vmn.salestatus'] += encodeURIComponent($.trim(obj.eq(i).text())) + ',';
                        }
                        maima['vmn.salestatus'] = maima['vmn.salestatus'].substring(0, maima['vmn.salestatus'].length - 1);
                        info[type] = status.substring(0, status.length - 1);
                    } else {
                        info[type] = obj.attr('data-id');
                        var maimaType = '';
                        switch (type) {
                            // 特色
                            case 'character':
                                maimaType = 'vmn.feature';
                                break;
                            // 装修
                            case 'fitment':
                                maimaType = 'vmn.fixstatus';
                                break;
                            // 开盘时间
                            case 'saleDate':
                                maimaType = 'vmn.opentime';
                                break;
                            // 物业类型
                            case 'strPurpose':
                                maimaType = 'vmn.genre';
                                break;
                            // 环线
                            case 'strRoundStation':
                                maimaType = 'vmn.loopline';
                                break;
                            default:
                                break;
                        }
                        maima[maimaType] = encodeURIComponent(obj.text());
                    }
                }
            });
            $('#all').trigger('click');
            if (info && (JSON.stringify(info) !== infoStr)) {
                xfSFMap.clearOtherOption('morechoose', info, maima);
                infoStr = JSON.stringify(info);
            } else if (!info) {
                // 没有选中，相当于重置
                xfSFMap.clearOtherOption('morereset');
            }
            var activeLen = $('.chose-item').find('a.active').length;
            if (activeLen) {
                $('#all').find('span').text('更多(' + activeLen + ')');
            } else {
                $('#all').find('span').text('更多');
            }
        });
        // 点击户型的确认按钮后进行筛选
        var infoStrRoom = '';
        roomEnsure.on('click', function () {
            var info = {}, roomValue = '', maima = {};
            var roomEmpty = roomContFlexbox.find('.empty.active');
            var roomOption = roomContFlexbox.find('.option.active');
            if (roomEmpty.length || (!roomEmpty.length && !roomOption.length)) {
                info.room = '';
                maima['vmn.housetype'] = '';
                room.find('span').text('户型');
            } else if (!roomEmpty.length && roomOption.length && roomOption.length < 7) {
                maima['vmn.housetype'] = '';
                for (var i = 0, len = roomOption.length; i < len; i++) {
                    roomValue += roomOption.eq(i).attr('data-id') + ',';
                    maima['vmn.housetype'] += encodeURIComponent($.trim(roomOption.eq(i).text())) + ',';
                }
                maima['vmn.housetype'] = maima['vmn.housetype'].substring(0, maima['vmn.housetype'].length - 1);
                info.room = roomValue.substring(0, roomValue.length - 1);
                if (roomOption.length === 1) {
                    room.find('span').text(roomOption.text());
                } else {
                    room.find('span').text('户型(' + roomOption.length + ')');
                }
            } else {
                console.log('error');
            }
            room.trigger('click');
            if (info && (JSON.stringify(info) !== infoStrRoom)) {
                xfSFMap.clearOtherOption('room', info, maima);
                infoStrRoom = JSON.stringify(info);
            } else if (!info) {
                // 没有选中，相当于重置
                xfSFMap.clearOtherOption('roomreset');
            }
        });
        // 户型按钮
        roomContFlexbox.find('.empty').on('click', function (event) {
            event.preventDefault();
            roomContFlexbox.find('.option').removeClass('active');
            $(this).toggleClass('active');
        });
        roomContFlexbox.find('.option').on('click', function (event) {
            event.preventDefault();
            $(this).toggleClass('active');
            if (roomContFlexbox.find('.option').hasClass('active')) {
                roomContFlexbox.find('.empty').removeClass('active');
            }
        });
        // 点击价格列表搜索
        $('#searchPrice').on('touchend', 'dd', function () {
            var $that = $(this);
            $('#price').trigger('click');
            if (!$that.hasClass('active') || $that.attr('data-id') === 'custom') {
                $that.addClass('active').siblings().removeClass('active');
                xfSFMap.clickComplete($that, 'price');
            }
            return false;
        });

        // 点击价格筛选确认按钮搜索
        $('#price_ensure').on('click', function () {
            var left = sliderObj.leftVal === '不限' ? '' : sliderObj.leftVal;
            var right = sliderObj.rightVal === '不限' ? '' : sliderObj.rightVal;
            var obj = $('#price_contFlexbox dd[data-id=custom]');
            obj.text(left + '-' + right);
            obj.trigger('touchend');
        });

        // 点击热门列表项搜索
        $('#huxing_contFlexbox').on('click', 'dd', function () {
            var $that = $(this);
            huxing.trigger('click');
            if (!$that.hasClass('active')) {
                $that.addClass('active').siblings().removeClass('active');
                xfSFMap.clickComplete($that, 'room');
            }
        });

        // 清空更多中的筛选条件
        $('.cz').on('click', function () {
            choseItem.find('a').removeClass('active');
        });
        // 点击筛选框背景浮层,收起筛选
        floatBox.on('click', function () {
            if (xfSFMap.tempState === 'railway' && xfSFMap.tempId !== xfSFMap.params.subwayLine) {
                var stationDl = $('#station_dl_' + xfSFMap.tempId);
                stationDl.children().first().trigger('click');
            } else if (xfSFMap.tempState === 'school' && xfSFMap.tempId !== xfSFMap.params.schoolType) {
                var schoolDl = $('#school_dl_' + xfSFMap.tempId);
                schoolDl.children().first().trigger('click');
            }
            tabBox.removeClass('tabSX');
            tabBox.find('.lbTab > div').hide();
            tabBox.find('.lbTab > ul > li').removeClass('active');
            $(this).hide();
            enable();
        });
        // 定位
        $('.dw-icon').on('click', function () {
            schoolSec.find('dd').removeClass('active');
            stationSec.find('dd').removeClass('active');
            $('div.search-out').hide();
            MapPublic.locationMap('xf', 1);
            //window.location.reload();
        });

        // 新房，上海，第一次进入地图页全部和直销提示显示
        if (vars.city === 'sh' || vars.zytype === 'zyMap') {
            // 处理上海优惠直销和全部新房第一次进入地图页方法,obj是提示语对象,localName是localStorage保存的名称
            var dealRed = function (obj, storageName) {
                // 优惠按钮z-index上移，因为遮罩的z-index是10，提示要在上边,
                $yhRedBtn.css('z-index', 11);
                // 写入优惠全部的localStorage变量
                vars.localStorage.setItem(storageName, 'y');
                // 遮罩和优惠直销的提示显示
                floatBox.show();
                obj.show();
                // 延时2秒隐藏
                setTimeout(function () {
                    // 遮罩和提示的隐藏
                    floatBox.hide();
                    obj.hide();
                    // 优惠按钮z-index恢复
                    $yhRedBtn.css('z-index', 9);
                }, 3000);
            };

            // 优惠按钮点击
            $yhRedBtn.on('click', function () {
                // 搜索参数有学区模式，关键字，楼盘id，不能点击优惠
                if (!xfSFMap.params.schoolFlag && !xfSFMap.params.strKeyword && !xfSFMap.params.newcode) {
                    // 动态添加样式
                    $yhRedBtn.toggleClass('active');
                    // 判断是否有active，是否传参
                    if ($yhRedBtn.hasClass('active')) {
                        xfSFMap.clearOtherOption('red', 'hb');
                    } else {
                        xfSFMap.clearOtherOption('red', '');
                    }
                }
            });
            // 存在localStorage
            if (vars.localStorage) {
                // 有red是优惠直销
                if (vars.red) {
                    // 优惠直销的localStorage变量
                    var yhZhiXiao = vars.localStorage.getItem('yhZhiXiao');
                    // 不存在显示提示
                    if (!yhZhiXiao) {
                        dealRed($('.qpTs2'), 'yhZhiXiao');
                    }
                } else {
                    // 优惠全部的localStorage变量
                    var yhQuanBu = vars.localStorage.getItem('yhQuanBu');
                    // 不存在显示提示
                    if (!yhQuanBu) {
                        dealRed($('.qpTs1'), 'yhQuanBu');
                    }
                }
            }
        }
    });
