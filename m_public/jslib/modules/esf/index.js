/**
 * 二手房列表页主类
 * 20151223 liuxinlu 删除部分废旧无用代码，优化筛选所有操作，添加删选新样式。
 */
define('modules/esf/index', ['jquery', 'modules/esf/yhxw', 'slideFilterBox/1.0.0/slideFilterBox',
    'iscroll/2.0.0/iscroll-lite', 'hslider/1.0.0/hslider', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            // jquery对象
            var $ = require('jquery');
            // seajs 数据对象
            var vars = seajs.data.vars;
            // 区县id
            var disId;
            // 用户行为对象
            var yhxw = require('modules/esf/yhxw');
            // 筛选插件
            var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
            var iscrollNew = require('iscroll/2.0.0/iscroll-lite');
            // 选择插件
            var hslider = require('hslider/1.0.0/hslider');
            // 筛选栏位置/区域
            var position = $('#position');
            // 筛选栏
            var tabBox = $('#tabSX');
            // 区县列表
            var districtList = $('#district_section');
            // 地铁线列表
            var railwaySec = $('#railway_section');
            // 商圈列表
            var comareaSec = $('#comarea_section');
            // 地铁站列表
            var stationSec = $('#station_section');
            // 第一级列表
            var firstSec = $('#searchnew');
            // 更多筛选内容
            var secAll = $('#sec_all');
            // 筛选背景浮层
            var floatBox = $('#tabFloat');
            // 更多选项中内容选择项
            var choseItem = $('.chose-item');
            //用户选择商圈，地铁位置信息
            var positionInfo;
            // 记录用户浏览动作
            if (vars.purpose === '住宅') {
                var pageId = 'esf_fy^lb_wap';
            } else if (vars.purpose === '别墅') {
                var pageId = 'esf_fy^bslb_wap';
            } else if (vars.purpose === '写字楼') {
                var pageId = 'esf_fy^xzllb_wap';
            } else if (vars.purpose === '商铺') {
                var pageId = 'esf_fy^splb_wap';
            }
            yhxw({pageId: pageId, type: 1});
            // swipe插件
            var Swiper = require('swipe/3.10/swiper');
            // 解决遮挡问题
            $('.moreChoo').css('padding-bottom', '20px');
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


            // 添加广告置顶统计 lipengkun
            function adhouseinfotj(city, housetype, houseid, newcode, type, housefrom, channel, agentid) {
                $.ajax({
                    url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                    + '&newcode=' + newcode + '&type=' + type + '&housefrom=' + housefrom + '&channel=' + channel + '&agentid=' + agentid,
                    async: true
                });
            }

            var $indexAd = $('#index_adhouse');
            if ($indexAd.length) {
                var data = $indexAd.attr('data-adshowtj');
                var dataArr = data.split(',');
                adhouseinfotj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
            }
            $indexAd.on('click', function () {
                var data = $(this).attr('data-adclicktj');
                var dataArr = data.split(',');
                adhouseinfotj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
            });
            var railwayIndex = railwaySec.find('dd.active').index();
            var districtIndex = districtList.find('dd.active').index();
            // 点击位置重新定位地铁和区域的第二列，保持跟当前页面的位置一致 lina
            position.on('click', function () {
                if ($('#contFlexbox').is(':hidden')) {
                    railwaySec.find('dd').eq(railwayIndex).addClass('active').siblings().removeClass('active');
                    districtList.find('dd').eq(districtIndex).addClass('active').siblings().removeClass('active');
                }
            });

            // 更多选项中选择了大于第一行的元素时则全部展开此选项内容。
            choseItem.each(function (index, el) {
                var elem = $(el);
                var actIndex = elem.find('a').index(elem.find('a.active'));
                if (actIndex > 3) {
                    elem.find('.flexbox').show().end().prev().find('a').removeClass('arr-down').addClass('arr-up');
                }
            });
            //wap黄金眼图片控制宽高4:3
            if (vars.utm_source == 'apphjy' || vars.utm_source == 'waphjy') {
                var $imgs = $('.img').find('.lazy');
                    if ($imgs.length) {
                        var imgWidth = $(document).width();
                        imgWidth = imgWidth > 640 ? 640 : imgWidth;
                        $imgs.css('height', imgWidth * 0.75);
                }
            }
            // 图片延迟加载
            require.async('lazyload/1.9.1/lazyload', function () {
                $('img.lazyload').lazyload({
                    event: 'scroll touchmove mousemove'
                });
                $('img.lazy').lazyload();
            });
            // json转化为数组
            var towards = vars.towards;
            // 条件数组
            var results = {
                // 区县
                districtId: vars.district || '',
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
                areaId: vars.area.replace('^', ',') || '',
                buildclassId: vars.buildclass || '',
                // 装修
                equipmentId: vars.equipment || '',
                // 类型
                propertysubtypeId: vars.propertysubtype || '',
                // 楼层
                floorId: vars.floor || '',
                // 地铁站
                subwayId: vars.subway_id || '',
                // 地铁线
                stationId: vars.station_id || '',
                // 物业类型
                purposeId: vars.purpose || '',
                towardsId: towards || '',
                keyword: vars.keyword || '',
                projcodes: vars.projcodes || ''
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
                //点击位置空白跳转
                if ($('#contFlexbox').is(':visible')) {
                    getPosition();
                    var url;
                    var thisType = vars.purpose;
                    if (thisType === '商铺') {
                        url = vars.mainSite + 'esf_sp/' + vars.city;
                    } else if (thisType === '别墅') {
                        url = vars.mainSite + 'esf_bs/' + vars.city;
                    } else if (vars.purpose === '写字楼') {
                        url = vars.mainSite + 'esf_xzl/' + vars.city;
                    } else {
                        url = vars.esfSite + vars.city;
                    }
                    // 如果有区县
                    if (positionInfo['districtId']) {
                        url = url + '_' + positionInfo['districtId'];
                    }
                    // 如果有商圈
                    if (positionInfo['comareaId']) {
                        url = url + '_b' + positionInfo['comareaId'];
                    }
                    if (thisType !== '别墅' && positionInfo['railwayId']) {
                        url = url + '_j' + positionInfo['railwayId'];
                    }
                    if (thisType !== '别墅' && positionInfo['stationId']) {
                        url = url + '_k' + positionInfo['stationId'];
                    }
                    url = url + '/';
                    // 用以判断链接后是否加/
                    var flaggang = false;
                    if (vars.price) {
                        url = url + 'm' + vars.price.replace('^', ',');
                        flaggang = true;
                    }
                    if (vars.room) {
                        url = url + 'h' + vars.room;
                        flaggang = true;
                    }
                    if (vars.area) {
                        url = url + 'a' + vars.area.replace('^', ',');
                        flaggang = true;
                    }
                    if (vars.tags) {
                        url = url + 'c' + vars.tags;
                        flaggang = true;
                    }
                    if (vars.floor) {
                        url = url + 's' + vars.floor;
                        flaggang = true;
                    }
                    if (vars.equipment) {
                        url = url + 'd' + vars.equipment;
                        flaggang = true;
                    }
                    if (vars.orderby) {
                        url = url + 'x' + vars.orderby;
                        flaggang = true;
                    }
                    if (vars.age) {
                        url = url + 'f' + vars.age;
                        flaggang = true;
                    }
                    if (vars.towards) {
                        url = url + 't' + vars.towards;
                        flaggang = true;
                    }
                    if (flaggang) {
                        url = url + '/';
                    }
                    // 判断是否为电商类型
                    if (vars.hasOwnProperty('zttype') && vars.zttype.length) {
                        url = url + '&zttype=' + vars.zttype;
                    }
                    if (vars.hasOwnProperty('jituanid') && vars.jituanid.length) {
                        url = url + '&jituanid=' + vars.jituanid;
                    }
                    if (vars.hasOwnProperty('cstype') && vars.cstype === 'ds') {
                        url += '&cstype=ds';
                    }
                    if (vars.hasOwnProperty('type') && vars.type === 'esfzy') {
                        url += '&type=esfzy';
                    }
                    if (vars.hasOwnProperty('hf') && vars.hf === 'tab') {
                        url += '&hf=tab';
                    }
                    if (vars.hasOwnProperty('isspecialprice') && vars.isspecialprice === '1') {
                        url += '&tjftype=esf';
                    }
                    if (vars.hasOwnProperty('jhList') && vars.jhList === '1') {
                        url += '&jhtype=esf';
                    }
                    if (vars.hasOwnProperty('utm_source') && vars.utm_source.length) {
                        url = url + '&utm_source=' + vars.utm_source;
                    }
                    if (vars.hasOwnProperty('schooltype') && vars.schooltype.length) {
                        url = url + '&schooltype=' + vars.schooltype;
                    }
                    if (vars.hasOwnProperty('utm_term') && vars.utm_term.length) {
                        url = url + '&utm_term=' + vars.utm_term;
                    }
                    if (vars.hasOwnProperty('hjzy') && vars.hjzy.length) {
                        url = url + '&hjzy=esf';
                    }
                    // 小区详情页跳二手房列表页（xm页/esf/bj_xm）关键参数（src、projcodes）lipengkun 20160712
                    if (vars.src === 'xiaoqu') {
                        url = url + '&src=' + vars.src + '&purpose=' + vars.purpose;
                    }
                    if (vars.projcodes) {
                        url = url + '&projcodes=' + vars.projcodes;
                    }
                    if (thisType === '别墅' && vars.buildclass) {
                        url = url + '&buildclass=' + vars.buildclass;
                    }
                    if ((thisType === '商铺' || thisType === '写字楼') && vars.propertysubtype) {
                        url = url + '&propertysubtype=' + vars.propertysubtype;
                        flaggang = true;
                    }
                    url = url.replace('/&', '/?');
                    window.location = url;
                    return false;
                }
                // 如果用户只选择到了二级列表在此处也做跳转 只在位置区域显示的情况下点击才跳转
                // modified by zdl(20160427)
                // 获取第三列可见的dom元素
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
            $('#all').on('click', function () {
                addStyle();
            });
            // 点击筛选栏中各个筛选项(位置除外)
            tabBox.find('.lbTab > ul > li').not('#position').on('click', function () {
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
                var activeIndex = obj.find('dd.active').eq(0).prevAll().length;
                // 如含有地铁线或者地铁站，则将选中元素滚动至可视区域 43为地铁线列表中每个元素的高度
                if (iscrollCtrl && activeIndex > 0) {
                    iscrollCtrl.to('#' + secObj.attr('id'), -activeIndex * 43);
                }
            }

            // 点击位置，展示地铁站，区县、以及学区第一级列表，有地铁参数选中地铁项，否则默认选中区县展示区县第二级列表

            position.on('click', function () {
                var thisEl = $(this);
                var contFlexbox = $('#contFlexbox');
                // 添加位置/区域选中样式
                thisEl.toggleClass('active').siblings().removeClass('active');
                contFlexbox.children().hide().end().siblings().not('ul').hide();
                tabSXStyle($(this));
                contFlexbox.toggle();
                contFlexbox.parent().siblings('div').hide();
                if (contFlexbox.css('display') !== 'none') {
                    contFlexbox.parent().show();
                }
                if (contFlexbox.is(':visible')) {
                    $('#confirmBtn').show();
                    // 展示一级列表
                    firstSec.toggle();
                    if (firstSec.is(':visible')) {
                        iscrollCtrl.refresh('#searchnew');
                    }
                    // 初始化时含有地铁参数选中地铁选项
                    if (vars.subway_id && vars.subway_id.length > 0) {
                        // 二级地铁线路列表
                        $('#railway').addClass('active').siblings().removeClass('active');
                        railwaySec.show();
                        iscrollCtrl.refresh('#railway_section');
                        // 如含有地铁线，则将选中地铁线路图滚动至可视区域 43为地铁线列表中每个元素的高度
                        scrollShowIndex(railwaySec);
                        // 初始化时含有地铁站参数++++++++++++++++++++++++++++++++++++++
                        // (!vars.station_id && vars.subway_id)表示点击了打铁下的三级列表但是三级列表点击的是全部
                        if ((vars.station_id && vars.station_id.length > 0) || (!vars.station_id && vars.subway_id)) {
                            stationSec.show().find('dl').hide();
                            var stationDl = $('#station_dl_' + vars.subway_id);
                            stationDl.show();
                            iscrollCtrl.refresh('#station_section');
                            // 如含有地铁线，则将选中地铁线路图滚动至可视区域 43为地铁线列表中每个元素的高度
                            scrollShowIndex(stationDl);
                        }
                        // 未选中地铁相关数据，默认展示第二级区县列表
                    } else {
                        var districtChannel = $('#district');
                        // 二级区县列表
                        districtChannel.addClass('active').siblings().removeClass('active');
                        // 默认显示第二级区县列表
                        districtList.nextAll().hide().end().show();
                        iscrollCtrl.refresh('#district_section');
                        // 初始化时含有商圈参数显示第三级列表商圈列表
                        // (!vars.comarea && vars.district_name)表示点击了区域下的三级列表但是三级列表点击的是全部
                        if ((vars.comarea && vars.comarea !== '') || (!vars.comarea && vars.district_name)) {
                            comareaSec.show().find('dl').hide();
                            $('#comarea_dl_' + vars.dis_id).show();
                            iscrollCtrl.refresh('#comarea_section');
                        }
                    }
                }
            });
            // 点击区域或者地铁,显示区县/地铁线列表
            firstSec.find('dd').not('#school').on('click', function () {
                var el = $(this);
                // 下级列表id
                var secondList = '#' + el.attr('id') + '_section';
                el.addClass('active').siblings().removeClass('active');
                $(secondList).show().siblings().not('#searchnew').hide();
                iscrollCtrl.refresh(secondList);
                scrollShowIndex($(secondList));
            });
            // 点击区县列表中元素，显示区县下商圈列表
            districtList.on('click', 'dd', function () {
                var tg = $(this);
                disId = tg.find('a').attr('data-id');
                tg.addClass('active').siblings().removeClass('active');
                // 区域列表中选择不限，直接跳转,选择其他显示下级目录
                if (disId !== '') {
                    comareaSec.show().find('dl').hide();
                    $('#comarea_dl_' + disId).show();
                    iscrollCtrl.refresh('#comarea_section');
                }
            });
            // 点击地铁线列表元素显示地铁站
            railwaySec.on('click', 'dd', function () {
                var tg = $(this);
                var dataId = tg.find('a').attr('data-id');
                tg.addClass('active').siblings().removeClass('active');
                // 地铁站列表中选择不限，直接跳转,选择其他显示下级目录
                if (dataId !== '') {
                    stationSec.show().find('dl').hide();
                    var stationDl = $('#station_dl_' + dataId);
                    stationDl.show();
                    iscrollCtrl.refresh('#station_section');
                    scrollShowIndex(stationDl);
                }
            });
            // 选择函数，主要用来区分多选和单选
            /**
             *
             * @param el
             * @param elId
             * @param tgName
             * @param type
             */
            function selectEle(el, elId, tgName, type) {
                var $eleParent, $a, $aLen, arr, i;
                if (el.hasClass('active')) {
                    el.removeClass('active');
                    if (type === '多选') {
                        $eleParent = el.parents('.chose-item');
                        $a = $eleParent.find('a');
                        $aLen = $a.length;
                        arr = [];
                        i = 0;
                        for (; i < $aLen; i++) {
                            if ($a.eq(i).hasClass('active')) {
                                arr.push($a.eq(i).attr('data-id'));
                            }
                        }
                        results[tgName + 'Id'] = arr;
                    } else {
                        results[tgName + 'Id'] = '';
                    }
                } else {
                    if (type === '单选') {
                        // 清除所有的active
                        $('#' + elId).find('a').removeClass('active');
                        el.addClass('active');
                        // 存储单选选项
                        results[tgName + 'Id'] = el.attr('data-id');
                    } else {
                        $eleParent = el.parents('.chose-item');
                        $a = $eleParent.find('a');
                        $aLen = $a.length;
                        arr = [];
                        el.addClass('active');
                        var j = 0;
                        for (; j < $aLen; j++) {
                            if ($a.eq(j).hasClass('active')) {
                                arr.push($a.eq(j).attr('data-id'));
                            }
                        }
                        results[tgName + 'Id'] = arr;
                    }
                }
            }

            // 更多样式筛选 筛选后选项标红，将目标元素的data-id 值写入result数组中，如筛选选项为类型，则记录用户行为
            var $allCont = $('#all_contFlexbox');
            var content = $allCont.html();
            // 存储请求的别墅的更多数据
            var bsContent = '';
            // 存储请求的住宅的更多数据
            var zzContent = '';
            // 点击更多里的选项
            $allCont.on('click', '.chose-item a', function () {
                var el = $(this);
                var elId = el.parent().parent().attr('id');
                var tgIndex = elId.lastIndexOf('_');
                var tgName = elId.slice(tgIndex + 1);
                var thisText = $(this).html();
                if (thisText === '住宅' || thisText === '别墅') {
                    el.addClass('active').siblings().removeClass('active');
                    var url = vars.esfSite + '?c=esf&a=ajaxgetVmore';
                    var tag;
                    // 点击后之前存在的不进行ajax请求
                    if (vars.purpose === '住宅') {
                        // 住宅页面，已经请求过ajax
                        if (bsContent !== '') {
                            if (thisText === '住宅') {
                                $allCont.html(content);
                                addStyle();
                                $('#search_category').find('a').eq(0).addClass('active').siblings().removeClass('active');
                            } else {
                                results.tagsId = '';
                                results.orderbyId = '';
                                results.buildclassId = '';
                                results.equipmentId = '';
                                results.propertysubtypeId = '';
                                results.floorId = '';
                                results.ageId = '';
                                results.towardsId = '';
                                if ($('#searchArea').length === 0) {
                                    results.areaId = '';
                                }
                                if ($('#searchPrice').length === 0) {
                                    results.priceId = '';
                                }
                                $allCont.html(bsContent);
                                $('#search_category').find('a').eq(1).addClass('active').siblings().removeClass('active');
                            }
                            $('.moreChoo').css('padding-bottom', '20px');
                            new iscrollNew('#sec_all', {scrollY: true});
                            return false;
                        } else {
                            // 住宅页面，没有请求过ajax
                            tag = 'V';
                        }
                    } else {
                        if (zzContent !== '') {
                            if (thisText === '别墅') {
                                $allCont.html(content);
                                addStyle();
                                $('#search_category').find('a').eq(1).addClass('active').siblings().removeClass('active');
                            } else {
                                results.tagsId = '';
                                results.orderbyId = '';
                                results.buildclassId = '';
                                results.equipmentId = '';
                                results.propertysubtypeId = '';
                                results.floorId = '';
                                results.ageId = '';
                                results.towardsId = '';
                                if ($('#searchArea').length === 0) {
                                    results.areaId = '';
                                }
                                if ($('#searchPrice').length === 0) {
                                    results.priceId = '';
                                }
                                $allCont.html(zzContent);
                                $('#search_category').find('a').eq(0).addClass('active').siblings().removeClass('active');
                            }
                            $('.moreChoo').css('padding-bottom', '20px');
                            new iscrollNew('#sec_all', {scrollY: true});
                            return false;
                        } else {
                            tag = 'R';
                        }
                    }
                    var param = {
                        purpose_: thisText,
                        purpose_operastion: tag,
                        jhflag: vars.jhflag,
                        jhList: vars.jhList,
                    };
                    // 点击住宅和别墅的时候初次点击时请求数据
                    if ((bsContent === '' && vars.purpose === '住宅') || (zzContent === '' && vars.purpose === '别墅')) {
                        results.tagsId = '';
                        results.orderbyId = '';
                        results.buildclassId = '';
                        results.equipmentId = '';
                        results.propertysubtypeId = '';
                        results.floorId = '';
                        results.ageId = '';
                        results.towardsId = '';
                        if ($('#searchArea').length === 0) {
                            results.areaId = '';
                        }
                        if ($('#searchPrice').length === 0) {
                            results.priceId = '';
                        }
                        $.ajax({
                            url: url,
                            data: param,
                            success: function (data) {
                                if (vars.purpose === '住宅') {
                                    bsContent = data;
                                } else {
                                    zzContent = data;
                                }
                                $allCont.html(data);
                                $('.moreChoo').css('padding-bottom', '20px');
                                if (thisText === '住宅') {
                                    $('#search_category').find('a').eq(0).addClass('active');
                                } else {
                                    $('#search_category').find('a').eq(1).addClass('active');
                                }
                                new iscrollNew('#sec_all', {scrollY: true});
                            }
                        });
                    }
                    return false;
                }
                // 住宅，别墅，商铺，写字楼的单选和多选条件不一样
                if (vars.purpose === '住宅') {
                    // 住宅下的排序和装修为单选，其余的多选
                    if (elId === 'search_orderby' || elId === 'search_equipment') {
                        selectEle(el, elId, tgName, '单选');
                    } else {
                        selectEle(el, elId, tgName, '多选');
                    }
                } else if (vars.purpose === '别墅') {
                    // 别墅下的排序，类别，建筑类别，装修单选，其余的多选
                    if (elId === 'search_orderby' || elId === 'search_buildclass' || elId === 'search_equipment') {
                        selectEle(el, elId, tgName, '单选');
                    } else {
                        selectEle(el, elId, tgName, '多选');
                    }
                } else if (vars.purpose === '写字楼' || vars.purpose === '商铺') {
                    // 写字楼和商铺下的单选和多选
                    if (elId === 'search_tags') {
                        selectEle(el, elId, tgName, '多选');
                    } else {
                        selectEle(el, elId, tgName, '单选');
                    }
                }
            });
            // 分页样式
            var dragBox = $('#drag');
            if (dragBox.length > 0) {
                require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                    loadMore({
                        url: vars.esfSite + vars.nowUrl + 'c=esf&a=ajaxGetList&city=' + vars.city,
                        total: vars.total,
                        pagesize: vars.pagesize,
                        pageNumber: '10',
                        contentID: '#content',
                        moreBtnID: '#drag',
                        loadPromptID: '#loading',
                        callback: function (data) {
                            // 前30条房源曝光率统计
                            if ($('.top30' + data.pageMarloadFlag).val()) {
                                $.ajax({
                                    type: 'post',
                                    url: window.location.protocol + '//esfbg.3g.fang.com/top30.htm',
                                    data: $('.top30' + data.pageMarloadFlag).val(),
                                });
                            }

                            // 前100条房源曝光率统计
                            if ($('.top100' + data.pageMarloadFlag).val()) {
                                $.ajax({
                                    type: 'post',
                                    url: window.location.protocol + '//esfbg.3g.fang.com/top100.htm',
                                    data: $('.top100' + data.pageMarloadFlag).val(),
                                });
                            }
                        }
                    });
                });
            }

            // 特价房横切样式和滑动
            var tjfUl = $('.tjf-list');
            if (tjfUl.length) {
                var $lis = tjfUl.find('li'),
                    tjfLiLen = $lis.length;
                // css li margin值为15px
                tjfUl.find('ul').width($lis.eq(0).width() * tjfLiLen + tjfLiLen * 15);
                new iscrollNew('.tjf-list', {scrollX: true});
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
                urlvalue = vars.esfSite + '?c=esf&a=index&city=' + vars.city + '&subway_id=' + results.subwayId + '&station_id=' + results.stationId + '&district=' + results.districtId + '&comarea=' + results.comareaId;
                urlvalue += '&orderby=' + results.orderbyId + '&room=' + results.roomId + '&purpose=' + results.purposeId + '&equipment=' + results.equipmentId;
                urlvalue += '&buildclass=' + results.buildclassId + '&tags=' + results.tagsId + '&age=' + results.ageId + '&propertysubtype=';
                urlvalue += results.propertysubtypeId + '&keyword=' + vars.keyword;
                if (aId === 'price') {
                    urlvalue += '&price=' + minData + ',' + maxData + '&area=' + results.areaId;
                } else if (aId === 'area') {
                    urlvalue += '&price=' + results.priceId + '&area=' + minData + ',' + maxData;
                }
                if (vars.cstype === 'ds') {
                    urlvalue += '&cstype=ds';
                }
                if (vars.type === 'esfzy') {
                    urlvalue += '&type=esfzy';
                }
                if (vars.hf === 'tab') {
                    urlvalue += '&hf=tab';
                }
                if (vars.isspecialprice) {
                    urlvalue += '&tjftype=esf';
                }
                if (vars.jhList) {
                    urlvalue += '&jhtype=esf';
                }
                if (vars.communityid) {
                    urlvalue += '&communityid=' + vars.communityid;
                }
                if (vars.src === 'xiaoqu') {
                    urlvalue += '&src=' + vars.src + '&projcodes=' + vars.projcodes;
                }
                if (vars.hjzy) {
                    urlvalue += '&hjzy=esf';
                }
                window.location = urlvalue;
                return true;
            }

            // 点击价格或者建筑面积筛选确认按钮
            $('#priceFormatUrl,#areaFormatUrl').on('click', function (e) {
                var thiz = $(this);
                assemblyUrl(thiz.attr('id').replace('FormatUrl', ''));
                e.stopPropagation();
            });
            // 进入页面的时候存储更多里已经选择的信息
            var hisSearch = {};
            var $choseItem = $allCont.find('.chose-item');
            var i = 0;
            for (; i < $choseItem.length; i++) {
                var $ele = $choseItem.eq(i);
                var tgName = $ele.attr('id');
                var $eleEle = $ele.find('a');
                var arr = [];
                for (var j = 0; j < $eleEle.length; j++) {
                    if ($eleEle.eq(j).hasClass('active')) {
                        arr.push('true');
                    } else {
                        arr.push('false');
                    }
                }
                hisSearch[tgName] = arr;
            }
            function addStyle() {
                if ($('#search_category').find('a.active').html() === vars.purpose) {
                    results = {
                        // 区县
                        districtId: vars.district || '',
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
                        areaId: vars.area.replace('^', ',') || '',
                        buildclassId: vars.buildclass || '',
                        // 装修
                        equipmentId: vars.equipment || '',
                        // 类型
                        propertysubtypeId: vars.propertysubtype || '',
                        // 楼层
                        floorId: vars.floor || '',
                        // 地铁站
                        subwayId: vars.subway_id || '',
                        // 地铁线
                        stationId: vars.station_id || '',
                        // 物业类型
                        purposeId: vars.purpose || '',
                        towardsId: towards || '',
                        keyword: vars.keyword || '',
                        projcodes: vars.projcodes || ''
                    };
                    for (var i = 0; i < $choseItem.length; i++) {
                        var $ele = $choseItem.eq(i);
                        var tgName = $ele.attr('id');
                        var $eleEle = $ele.find('a');
                        for (var j = 0; j < $eleEle.length; j++) {
                            if (hisSearch[tgName][j] === 'true') {
                                $eleEle.eq(j).addClass('active');
                            } else {
                                $eleEle.eq(j).removeClass('active');
                            }
                        }
                    }
                }
            }

            // 点击更多种的确认按钮后进行筛选
            $allCont.on('click', '.sx', function () {
                var selAllUrl;
                var thisType = $allCont.find('#search_category').find('a.active').html();
                if (thisType === '商铺') {
                    selAllUrl = vars.mainSite + 'esf_sp/' + vars.city;
                } else if (thisType === '别墅') {
                    selAllUrl = vars.mainSite + 'esf_bs/' + vars.city;
                } else if (vars.purpose === '写字楼') {
                    selAllUrl = vars.mainSite + 'esf_xzl/' + vars.city;
                } else {
                    selAllUrl = vars.esfSite + vars.city;
                }
                // 别墅列表页——更多——类型 选择“住宅”则要转换到住宅列表页的地址(不知道为什么要重新写地址不使用utm_term等参数)
                if ($allCont.find('#search_category').find('a.active').html() === '别墅') {
                    // 如果有区县
                    if (results.districtId.length > 0) {
                        selAllUrl = selAllUrl + '_' + results.districtId;
                    }
                    // 如果有商圈
                    if (results.comareaId.length > 0) {
                        selAllUrl = selAllUrl + '_b' + results.comareaId;
                    }
                    results.purposeId = '别墅';
                    selAllUrl += '/?c=esf&a=index';
                    for (var i in results) {
                        if (results.hasOwnProperty(i) && results[i].length > 0) {
                            var key;
                            switch (i) {
                                case 'subwayId':
                                    key = 'subway_id';
                                    break;
                                case 'stationId':
                                    key = 'station_id';
                                    break;
                                default:
                                    key = i.replace('Id', '');
                            }
                            if (key !== 'comarea' || key !== 'district') {
                                if (typeof results[i] === 'object') {
                                    selAllUrl += '&' + key + '=' + results[i].join('_');
                                } else {
                                    selAllUrl += '&' + key + '=' + results[i];
                                }
                            }

                        }
                    }
                    if (vars.type === 'esfzy') {
                        selAllUrl += '&type=esfzy';
                        if (vars.hf === 'tab') {
                            selAllUrl += '&hf=tab';
                        }
                    }
                } else {
                    if (results.purposeId === '别墅') {
                        results.purposeId = '住宅';
                    }
                    if (results.districtId.length > 0) {
                        selAllUrl = selAllUrl + '_' + results.districtId;
                    }
                    // 如果有商圈
                    if (results.comareaId.length > 0) {
                        selAllUrl = selAllUrl + '_b' + results.comareaId;
                    }
                    selAllUrl += '/?c=esf&a=index';
                    for (var i in results) {
                        if (results.hasOwnProperty(i) && results[i].length > 0) {
                            var key;
                            switch (i) {
                                case 'subwayId':
                                    key = 'subway_id';
                                    break;
                                case 'stationId':
                                    key = 'station_id';
                                    break;
                                default:
                                    key = i.replace('Id', '');
                            }
                            if (key !== 'comarea' || key !== 'district') {
                                if (typeof results[i] === 'object') {
                                    selAllUrl += '&' + key + '=' + results[i].join('_');
                                } else {
                                    selAllUrl += '&' + key + '=' + results[i];
                                }
                            }
                        }
                    }
                    if (vars.hasOwnProperty('zttype') && vars.zttype.length) {
                        selAllUrl = selAllUrl + '&zttype=' + vars.zttype;
                    }
                    if (vars.hasOwnProperty('jituanid') && vars.jituanid.length) {
                        selAllUrl = selAllUrl + '&jituanid=' + vars.jituanid;
                    }
                }
                // 判断是否为电商类型
                if (vars.hasOwnProperty('cstype') && vars.cstype === 'ds') {
                    selAllUrl += '&cstype=ds';
                }
                if (vars.hasOwnProperty('type') && vars.type === 'esfzy') {
                    selAllUrl += '&type=esfzy';
                }
                if (vars.hasOwnProperty('hf') && vars.hf === 'tab') {
                    selAllUrl += '&hf=tab';
                }
                if (vars.hasOwnProperty('isspecialprice') && vars.isspecialprice === '1') {
                    selAllUrl += '&tjftype=esf';
                }
                if (vars.hasOwnProperty('jhList') && vars.jhList === '1') {
                    selAllUrl += '&jhtype=esf';
                }
                if (vars.communityid) {
                    selAllUrl += '&communityid=' + vars.communityid;
                }
                if (vars.hasOwnProperty('utm_source') && vars.utm_source.length) {
                    selAllUrl = selAllUrl + '&utm_source=' + vars.utm_source;
                }
                if (vars.hasOwnProperty('schooltype') && vars.schooltype.length) {
                    selAllUrl = selAllUrl + '&schooltype=' + vars.schooltype;
                }
                if (vars.hasOwnProperty('utm_term') && vars.utm_term.length) {
                    selAllUrl = selAllUrl + '&utm_term=' + vars.utm_term;
                }
                // 小区详情页跳二手房列表页（xm页/esf/bj_xm）关键参数（src、projcodes）lipengkun 20160712
                if (vars.src === 'xiaoqu') {
                    selAllUrl = selAllUrl + '&src=' + vars.src + '&projcodes=' + vars.projcodes;
                }
                if (vars.hasOwnProperty('hjzy') && vars.hjzy.length) {
                    selAllUrl = selAllUrl + '&hjzy=esf';
                }
                window.location = selAllUrl;
            });
            // 清空时保留某些选项
            function saveSth(id, index) {
                $(id).find('.flexbox').eq(0).find('a').eq(index).addClass('active');
            }


            // 清空更多中的筛选条件
            $allCont.on('click', '.cz', function () {
                results.tagsId = '';
                results.orderbyId = '';
                results.buildclassId = '';
                results.equipmentId = '';
                results.propertysubtypeId = '';
                results.floorId = '';
                results.ageId = '';
                results.towardsId = '';
                if ($('#searchArea').length === 0) {
                    results.areaId = '';
                }
                if ($('#searchPrice').length === 0) {
                    results.priceId = '';
                }
                var arr = ['#sortFir'];
                choseItem = $allCont.find('.chose-item');
                saveSth(arr);
                $allCont.find('#all_category').find('span').html('住宅');
                choseItem.find('a').removeClass('active');
                // 清空条件时保留的默认排序
                saveSth('#search_orderby', 0);
                // 住宅保留选项为住宅
                if (vars.purpose === '住宅') {
                    saveSth('#search_category', 0);
                } else if (vars.purpose === '别墅') {
                    saveSth('#search_category', 1);
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
            // 搜索结果页推荐经纪人拨打电话或在线聊天
            function chat(zhcity, city, housetype, houseid, newcode, type, phone, channel, uname, aname, agentid, photourl) {
                if (vars.localStorage) {
                    window.localStorage.setItem(String(uname), encodeURIComponent(aname) + ';'
                        + photourl + ';' + encodeURIComponent(vars.district + '的'));
                }
                $.ajax({
                    url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode='
                    + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                    async: false
                });
                setTimeout(function () {
                    var chatUrl = vars.mainSite + 'chat.d?m=chat&username=' + uname + '&city=' + city;
                    window.location = chatUrl;
                }, 500);
            }

            function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid) {
                $.ajax({
                    url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                    + '&newcode=' + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid,
                    async: true
                });
                $.ajax({
                    url: vars.mainSite + 'data.d?m=tel&city=' + city + '&housetype=' + housetype + '&id=' + houseid + '&phone='
                    + phone, async: true
                });
            }

            $('.call').on('click', function () {
                var data = $(this).attr('data-teltj');
                var dataArr = data.split(',');
                teltj(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7]);
            });
            $('.mes').on('click', function () {
                var data = $(this).attr('data-chat');
                var dataArr = data.split(',');
                chat(dataArr[0], dataArr[1], dataArr[2], dataArr[3], dataArr[4], dataArr[5], dataArr[6], dataArr[7], dataArr[8], dataArr[9], dataArr[10], dataArr[12]);
            });

            // 20170310 特价房我要出现在这里弹窗
            var $tjfmore = $('.more-list-other');
            $tjfmore.on('click', function(){
                $('.floatAlert').show();
            });
            $('.floatAlert').on('click', function(){
                $('.floatAlert').hide();
            });
            var clickFlag = true;
            var jumpHref = '';
            var liList = $('#content');
            liList.on('click','a',function(){
                if(!clickFlag){
                    window.location.href = jumpHref;
                    return false;
                }
            });
            var $floatJh = $('.sf-maskFixed');
            $('.paixu').click(function(){
                $floatJh.show();
                unable();
                if ($floatJh.is(':visible')) {
                    // 排序按钮
                    iscrollCtrl.refresh('#orderNew');
                }
            });
            $('#orderNew').on('click','li',function(e){
                e.stopPropagation();
                $('.houseList').find('a').addClass('noClick');
                clickFlag = false;
                jumpHref = $(this).find('a').attr('href');
                window.location.href = jumpHref;
                setTimeout(function(){
                    clickFlag = true;
                },300);
            });
            $floatJh.on('click',function(){
                $(this).hide();
                enable();
                return false;
            });

               //聚合房源提示房源
                setTimeout(function () {
                    $('.ts-box').fadeOut();
                }, 3000); 

            //提示聚合房源蒙层显示
            if (vars.localStorage) {
                var mengceng = vars.localStorage.getItem('mengceng');
                if (vars.jhflag && !vars.jhList && !mengceng) {
                    //提示高度修改
                    var top = $('.list-Tab').offset().top;
                    top = parseInt(top) - 22;
                    $('.ts-w').css({'top':top});
                    $('.jh-tsBox').show();
                    var mengceng = vars.localStorage.setItem('mengceng', '1');
                }
            }
            $('.ts-btn').on('click', function () {
                $('.jh-tsBox').hide();
            });
            //商圈地铁区域商圈快筛改版
            $('.stationClick, .comareaClick, .xiaoquClick').on('click', function () {
                var $this = $(this).parent();
                //全部，与其它节点互斥
                if ($this.children().attr('data-id') === 'all') {
                    $this.siblings().removeClass('active');
                } else {
                    $this.siblings().eq(0).removeClass('active');
                }
                if ($this.hasClass('active')) {
                    $this.removeClass('active');
                } else {
                    $this.addClass('active');
                }
                $this.parent().siblings().children().removeClass('active');
            });
            //清空条件
            $('#qktj').on('click', function () {
                railwaySec.find('dd').removeClass('active');
                stationSec.find('dd').removeClass('active');
                districtList.find('dd').removeClass('active');
                comareaSec.find('dd').removeClass('active');
            });
            //快筛点击确认
            $('#qrtj').on('click', function () {
                getPosition();
                var url;
                var thisType = vars.purpose;
                if (thisType === '商铺') {
                    url = vars.mainSite + 'esf_sp/' + vars.city;
                } else if (thisType === '别墅') {
                    url = vars.mainSite + 'esf_bs/' + vars.city;
                } else if (vars.purpose === '写字楼') {
                    url = vars.mainSite + 'esf_xzl/' + vars.city;
                } else {
                    url = vars.esfSite + vars.city;
                }
                // 如果有区县
                if (positionInfo['districtId']) {
                    url = url + '_' + positionInfo['districtId'];
                }
                // 如果有商圈
                if (positionInfo['comareaId']) {
                    url = url + '_b' + positionInfo['comareaId'];
                }
                if (thisType !== '别墅' && positionInfo['railwayId']) {
                    url = url + '_j' + positionInfo['railwayId'];
                }
                if (thisType !== '别墅' && positionInfo['stationId']) {
                    url = url + '_k' + positionInfo['stationId'];
                }
                url = url + '/';
                // 用以判断链接后是否加/
                var flaggang = false;
                if (vars.price) {
                    url = url + 'm' + vars.price.replace('^', ',');
                    flaggang = true;
                }
                if (vars.room) {
                    url = url + 'h' + vars.room;
                    flaggang = true;
                }
                if (vars.area) {
                    url = url + 'a' + vars.area.replace('^', ',');
                    flaggang = true;
                }
                if (vars.tags) {
                    url = url + 'c' + vars.tags;
                    flaggang = true;
                }
                if (vars.floor) {
                    url = url + 's' + vars.floor;
                    flaggang = true;
                }
                if (vars.equipment) {
                    url = url + 'd' + vars.equipment;
                    flaggang = true;
                }
                if (vars.orderby) {
                    url = url + 'x' + vars.orderby;
                    flaggang = true;
                }
                if (vars.age) {
                    url = url + 'f' + vars.age;
                    flaggang = true;
                }
                if (vars.towards) {
                    url = url + 't' + vars.towards;
                    flaggang = true;
                }
                if (flaggang) {
                    url = url + '/';
                }
                // 判断是否为电商类型
                if (vars.hasOwnProperty('zttype') && vars.zttype.length) {
                    url = url + '&zttype=' + vars.zttype;
                }
                if (vars.hasOwnProperty('jituanid') && vars.jituanid.length) {
                    url = url + '&jituanid=' + vars.jituanid;
                }
                if (vars.hasOwnProperty('cstype') && vars.cstype === 'ds') {
                    url += '&cstype=ds';
                }
                if (vars.hasOwnProperty('type') && vars.type === 'esfzy') {
                    url += '&type=esfzy';
                }
                if (vars.hasOwnProperty('hf') && vars.hf === 'tab') {
                    url += '&hf=tab';
                }
                if (vars.hasOwnProperty('isspecialprice') && vars.isspecialprice === '1') {
                    url += '&tjftype=esf';
                }
                if (vars.hasOwnProperty('jhList') && vars.jhList === '1') {
                    url += '&jhtype=esf';
                }
                if (vars.hasOwnProperty('utm_source') && vars.utm_source.length) {
                    url = url + '&utm_source=' + vars.utm_source;
                }
                if (vars.hasOwnProperty('schooltype') && vars.schooltype.length) {
                    url = url + '&schooltype=' + vars.schooltype;
                }
                if (vars.hasOwnProperty('utm_term') && vars.utm_term.length) {
                    url = url + '&utm_term=' + vars.utm_term;
                }
                // 小区详情页跳二手房列表页（xm页/esf/bj_xm）关键参数（src、projcodes）lipengkun 20160712
                if (vars.src === 'xiaoqu') {
                    url = url + '&src=' + vars.src + '&purpose=' + vars.purpose;
                }
                if (vars.projcodes) {
                    url = url + '&projcodes=' + vars.projcodes;
                }
                if (thisType === '别墅' && vars.buildclass) {
                    url = url + '&buildclass=' + vars.buildclass;
                }
                if ((thisType === '商铺' || thisType === '写字楼') && vars.propertysubtype) {
                    url = url + '&propertysubtype=' + vars.propertysubtype;
                    flaggang = true;
                }
                if (vars.hasOwnProperty('hjzy') && vars.hjzy) {
                    url += '&hjzy=esf';
                }
                url = url.replace('/&', '/?');
                window.location = url;
            });
            //位置多选确认跳转函数
            function getPosition() {
                var district = $("#district");
                var railway = $("#railway");
                positionInfo = [];
                if (district.hasClass('active')) {
                    $('#district_section').find('dd').each(function () {
                        var $ddThat = $(this);
                        if ($ddThat.hasClass('active')) {
                            var districtId = $ddThat.children().attr('data-id');
                            if (districtId) {
                                positionInfo['districtId'] = districtId;
                                var commeaId = '';
                                var comareaDL = $('#comarea_dl_' + districtId);
                                if (comareaDL) {
                                    comareaDL.find('dd').each(function(){
                                        var $dlThat = $(this);
                                        if ($dlThat.hasClass('active')) {
                                            if($dlThat.children().attr('data-id') === 'all'){
                                                commeaId = '';
                                                return false;
                                            } else {
                                                commeaId += commeaId ? ',' + $dlThat.children().attr('data-id') : $dlThat.children().attr('data-id');
                                            }
                                        }
                                    });
                                }

                            }
                            positionInfo['comareaId'] = commeaId;
                            return false;
                        }
                    });
                } else if (railway.hasClass('active')) {
                    $('#railway_section').find('dd').each(function () {
                        var $ddThat = $(this);
                        if ($ddThat.hasClass('active')) {
                            var railwayId = $ddThat.children().attr('data-id');
                            if (railwayId) {
                                positionInfo['railwayId'] = railwayId;
                                var stationId = '';
                                var stationDL = $('#station_dl_' + railwayId);
                                if (stationDL) {
                                    stationDL.find('dd').each(function(){
                                        var $dlThat = $(this);
                                        if ($dlThat.hasClass('active')) {
                                            if ($dlThat.children().attr('data-id') === 'all') {
                                                stationId = '';
                                                return false;
                                            } else {
                                                stationId += stationId ? ',' + $dlThat.children().attr('data-id') : $dlThat.children().attr('data-id');
                                            }
                                        }
                                    });
                                }
                            }
                            positionInfo['stationId'] = stationId;
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            }
            //小区分期分区快筛点击确认
            $('#xiaoquFormatUrl').on('click', function () {
                var url;
                var thisType = vars.purpose;
                if (thisType === '别墅') {
                    url = vars.mainSite + 'esf_bs/' + vars.city;
                } else {
                    url = vars.esfSite + vars.city;
                }
                url = url + '/';
                // 用以判断链接后是否加/
                var flaggang = false;
                if (vars.price) {
                    url = url + 'm' + vars.price.replace('^', ',');
                    flaggang = true;
                }
                if (vars.room) {
                    url = url + 'h' + vars.room;
                    flaggang = true;
                }
                if (vars.area) {
                    url = url + 'a' + vars.area.replace('^', ',');
                    flaggang = true;
                }
                if (vars.tags) {
                    url = url + 'c' + vars.tags;
                    flaggang = true;
                }
                if (vars.floor) {
                    url = url + 's' + vars.floor;
                    flaggang = true;
                }
                if (vars.equipment) {
                    url = url + 'd' + vars.equipment;
                    flaggang = true;
                }
                if (vars.orderby) {
                    url = url + 'x' + vars.orderby;
                    flaggang = true;
                }
                if (vars.age) {
                    url = url + 'f' + vars.age;
                    flaggang = true;
                }
                if (vars.towards) {
                    url = url + 't' + vars.towards;
                    flaggang = true;
                }
                if (flaggang) {
                    url = url + '/';
                }
                // 判断是否为电商类型
                if (vars.hasOwnProperty('zttype') && vars.zttype.length) {
                    url = url + '&zttype=' + vars.zttype;
                }
                if (vars.hasOwnProperty('jituanid') && vars.jituanid.length) {
                    url = url + '&jituanid=' + vars.jituanid;
                }
                if (vars.hasOwnProperty('cstype') && vars.cstype === 'ds') {
                    url += '&cstype=ds';
                }
                if (vars.hasOwnProperty('type') && vars.type === 'esfzy') {
                    url += '&type=esfzy';
                }
                if (vars.hasOwnProperty('hf') && vars.hf === 'tab') {
                    url += '&hf=tab';
                }
                if (vars.hasOwnProperty('isspecialprice') && vars.isspecialprice === '1') {
                    url += '&tjftype=esf';
                }
                if (vars.hasOwnProperty('jhList') && vars.jhList === '1') {
                    url += '&jhtype=esf';
                }
                if (vars.hasOwnProperty('utm_source') && vars.utm_source.length) {
                    url = url + '&utm_source=' + vars.utm_source;
                }
                if (vars.hasOwnProperty('schooltype') && vars.schooltype.length) {
                    url = url + '&schooltype=' + vars.schooltype;
                }
                if (vars.hasOwnProperty('utm_term') && vars.utm_term.length) {
                    url = url + '&utm_term=' + vars.utm_term;
                }
                // 小区详情页跳二手房列表页（xm页/esf/bj_xm）关键参数（src、projcodes）lipengkun 20160712
                if (vars.src === 'xiaoqu') {
                    url = url + '&src=' + vars.src + '&purpose=' + vars.purpose;
                }
                if (vars.communityid) {
                    url = url + '&communityid=' + vars.communityid;
                }
                if (vars.keyword) {
                    url = url + '&keyword=' + vars.keyword;
                }
                //获取点击的小区id
                var xiaoquId = '';
                var xiaoquDL = $('#searchXiaoqu');
                if (xiaoquDL) {
                    xiaoquDL.find('dd').each(function(){
                        var $dlThat = $(this);
                        if ($dlThat.hasClass('active')) {
                            if ($dlThat.children().attr('data-id') === 'all') {
                                xiaoquId = '';
                                return false;
                            } else {
                                xiaoquId += xiaoquId ? ',' + $dlThat.children().attr('data-id') : $dlThat.children().attr('data-id');
                            }
                        }
                    });
                }
                if (xiaoquId) {
                    url = url + '&projcodes=' + xiaoquId;
                }
                if (thisType === '别墅' && vars.buildclass) {
                    url = url + '&buildclass=' + vars.buildclass;
                }
                if (vars.hjzy) {
                    url = url + '&hjzy=esf';
                }
                url = url.replace('/&', '/?');
                window.location = url;
            });
            //如果最后进的是优选详情下次进入直接进优选列表,tab切换标识
            $('.qbfy, .jmfy').on('click', function () {
                document.cookie = 'indexalltojh=0; path=/;'
            });
            $('.yxfy').on('click', function () {
                document.cookie = 'indexalltojh=1; path=/;';
            });
            // 搜房帮加点击统计
            $('.listtype').on('click', function(){
                var that = $(this);
                var listtype = that.attr('data-listtype');
                var listsub = that.attr('data-listsub');
                var combine = that.attr('href').indexOf('?') > -1 ? '&' : '?';
                window.location = that.attr('href') + combine + 'listtype=' + listtype + '&listsub=' + listsub;
                return false;
            });

            // 前30条房源曝光率统计
            if (vars.top30) {
                $.ajax({
                    type: 'post',
                    url: window.location.protocol + '//esfbg.3g.fang.com/top30.htm',
                    data: vars.top30
                });
            }

            // 前100条房源曝光率统计
            if (vars.top100) {
                $.ajax({
                    type: 'post',
                    url: window.location.protocol + '//esfbg.3g.fang.com/top100.htm',
                    data: vars.top100
                });
            }

            // 回家置业分享
            if (vars.hjzy) {
                var SuperShare = require('superShare/1.0.1/superShare');
                var config = {
                    // 分享内容的title
                    title: vars.shareTitle,
                    // 分享时的图标
                    image: window.location.protocol + vars.shareImage,
                    // 分享内容的详细描述
                    desc: vars.shareDescription,
                    // 分享的链接地址
                    url: location.href,
                    // 分享的内容来源
                    from: ' 房天下' + vars.cityname + '二手房'
                };
                new SuperShare(config);

                // 微信分享
                var Weixin = require('weixin/2.0.0/weixinshare');
                var wx = new Weixin({
                    debug: false,
                    shareTitle: vars.shareTitle,
                    // 副标题
                    descContent: vars.shareDescription,
                    lineLink: location.href,
                    imgUrl: window.location.protocol + vars.shareImage,
                    swapTitle: false
                });
            }
        };
    });