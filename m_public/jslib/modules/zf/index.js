define('modules/zf/index', ['jquery', 'modules/zf/yhxw', 'slideFilterBox/1.0.0/slideFilterBox', 'hslider/1.0.0/hslider', 'lazyload/1.9.1/lazyload'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            // 引入用户行为分析对象
            var yhxw = require('modules/zf/yhxw');
            // 自定义价格与面积插件
            var hslider = require('hslider/1.0.0/hslider');
            // 筛选对象
            var sliderObj;
            // 初始化滚动插件
            var iscrollCtrl = require('slideFilterBox/1.0.0/slideFilterBox');
            // 筛选栏
            var tabBox = $('#tabSX');
            // 筛选背景浮层
            var floatBox = $('#tabFloat');
            // 底部SEO切换标签
            var seoTab = $('.tabNav');
            // 区县商圈
            var distrcitComarea = $('#district_comarea');
            // 区县列表
            var districtList = $('#district_section');
            // 商圈列表
            var comareaSection = $('#comarea_section');
            // 位置
            var position = $('#district');
            //用户选择商圈，地铁位置信息
            var positionInfo;
            // 位置下第一级列表
            var firstSec = $('#district_show');
            // 地铁线列表
            var railwaySec = $('#railway_section');
            // 地铁站列表
            var stationSec = $('#station_section');
            // 更多选项中内容选择项
            var choseItem = $('.chose-item');
            //swipe滑动事件
            var Swiper = require('swipe/3.10/swiper');
            // 参数数组
            var paramArr = {
                // 价格
                price: vars.priceTempparam || '',
                // 面积
                area: vars.areaTempparam || '',
                // 特色
                tags: vars.tags || '',
                buildclass: vars.buildclass || '',
                // 居室
                room: vars.room || '',
                rtype: vars.rtype || '',
                // 朝向
                towards: vars.towards || '',
                // 楼层
                floor: vars.floor || '',
                bstype: vars.bstype || '',
                // 装修
                equipment: vars.equipment || '',
                // 排序
                orderby: vars.orderby || '',
                // 房源类型
                housetype: vars.housetype || '',
                propertysubtype: vars.propertysubtype || ''
            };
            // 解决遮挡问题
            $('.moreChoo').css('padding-bottom', '20px');
            // 图片延迟加载
            require.async('lazyload/1.9.1/lazyload', function () {
                $('img[data-original]').lazyload();
            });
            // 添加用户行为分析
            if (vars.purpose === '住宅') {
                var pageId = 'zf_fy^lb_wap';
            } else if (vars.purpose === '别墅') {
                var pageId = 'zf_fy^bslb_wap';
            } else if (vars.purpose === '写字楼') {
                var pageId = 'zf_fy^xzllb_wap';
            } else if (vars.purpose === '商铺') {
                var pageId = 'zf_fy^splb_wap';
            }
            yhxw({pageId: pageId});
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
            // 点击筛选框背景浮层,收起筛选+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            // modified by zdl(20160427)
            floatBox.click(function () {
                //位置时跳转
                if (distrcitComarea.is(':visible')) {
                    getPosition();
                    var url;
                    var thisType = vars.purpose;
                    if (thisType === '商铺') {
                        url = vars.mainSite + 'zf_sp/' + vars.city;
                    } else if (thisType === '别墅') {
                        url = vars.mainSite + 'zf_bs/' + vars.city;
                    } else if (vars.purpose === '写字楼') {
                        url = vars.mainSite + 'zf_xzl/' + vars.city;
                    } else {
                        url = vars.zfSite + vars.city;
                    }
                    if (!vars.projcodes) {
                        // 如果有区县
                        if (positionInfo['districtId']) {
                            url = url + '_' + positionInfo['districtId'];
                        }
                        // 如果有商圈
                        if (positionInfo['comareaId']) {
                            url = url + '_' + positionInfo['comareaId'];
                        }
                    }
                    url = url + '/';
                    // 用以判断链接后是否加/
                    var flaggang = false;
                    if (vars.price) {
                        url = url + 'p' + vars.priceTempparam;
                        flaggang = true;
                    }
                    if (vars.area && (vars.purpose === '写字楼' || vars.purpose === '商铺')) {
                        url = url + 'a' + vars.area;
                        flaggang = true;
                    }
                    if (vars.room && (vars.purpose === '住宅')) {
                        url = url + 'h' + vars.room;
                        flaggang = true;
                    }
                    if (vars.buildclass && vars.purpose === '别墅') {
                        url = url + 't' + vars.buildclass;
                        flaggang = true;
                    }
                    if (vars.propertysubtype && (vars.purpose === '写字楼' || vars.purpose === '商铺')) {
                        url = url + 't' + vars.propertysubtype;
                        flaggang = true;
                    }
                    if (vars.rtype && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                        url = url + 'm' + vars.rtype;
                        flaggang = true;
                    }
                    if (vars.tags && (vars.purpose === '写字楼' || vars.purpose === '住宅')) {
                        url = url + 'c' + vars.tags;
                        flaggang = true;
                    }
                    if (vars.housetype && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                        url = url + 's' + vars.housetype;
                        flaggang = true;
                    }
                    if (vars.room && (vars.purpose === '别墅')) {
                        url = url + 'h' + vars.room;
                        flaggang = true;
                    }
                    if (positionInfo['railwayId'] && vars.purpose !== '别墅') {
                        url = url + 'r' + positionInfo['railwayId'];
                        flaggang = true;
                    }
                    if (positionInfo['stationId'] && vars.purpose !== '别墅') {
                        url = url + 'b' + positionInfo['stationId'];
                        flaggang = true;
                    }
                    if (vars.towards && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                        url = url + 'o' + vars.towards;
                        flaggang = true;
                    }
                    if (vars.floor && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                        url = url + 'f' + vars.floor;
                        flaggang = true;
                    }
                    if (vars.equipment && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                        url = url + 'd' + vars.equipment;
                        flaggang = true;
                    }
                    if (vars.orderby && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                        url = url + 'px' + vars.orderby;
                        flaggang = true;
                    }
                    if (vars.projcode && (vars.purpose === '住宅')) {
                        url = url + 'j' + vars.projcode;
                        flaggang = true;
                    }
                    if (flaggang) {
                        url = url + '/';
                    }
                    if (vars.keyword_tempparam !== '') {
                        url += '&keyword=' + vars.keyword_tempparam;
                    }
                    if (vars.sf_source !== '' && vars.sf_source === '360zsclient') {
                        url += '&sf_source=' + vars.sf_source;
                    }
                    if (vars.isspecialprice === 'zf') {
                        url += '&tjftype=' + vars.isspecialprice;
                    }
                    if (vars.jhtype === 'zf') {
                        url += '&jhtype=' + vars.jhtype;
                    }
                    url = url.replace('/&', '/?');
                    window.location = url;
                    return false;
                }
                // 获取第三列可见的dl元素
                var col3VisElement = $('.column3:visible');
                // 获取第三列选中的dd元素
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

            // 加载更多功能
            var dragBox = $('#drag');
            if (dragBox.length > 0) {
                require.async('loadMore/1.0.0/loadMore', function (loadMore) {
                    var ajaxActionName;
                    if (vars.ltlist) {
                        ajaxActionName = 'ajaxGetLongTailHouseList';
                    } else {
                        ajaxActionName = vars.sf_source && vars.sf_source === '360zsclient' ? 'ajaxGetQhList' : 'ajaxGetList'; 
                    }

                    loadMore({
                        url: vars.zfSite + vars.nowUrl + 'c=zf&a=' + ajaxActionName + '&city=' + vars.city,
                        total: vars.total,
                        pagesize: 32,
                        pageNumber: 16,
                        contentID: '#content',
                        moreBtnID: '#drag',
                        loadPromptID: '#loading',
                        firstDragFlag: false,
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

            /**
             * 给筛选类别添加或者删除选中样式
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

            // 点击筛选栏中各个筛选项(位置/区域除外)
            tabBox.find('.lbTab > ul > li').not('#district').on('click', function () {
                var thisEl = $(this);
                var idVal = thisEl.attr('id');
                if (vars.ltlist && idVal === 'ltk') {
                    return false;
                }
                if (((vars.isspecialprice && idVal !== 'housetype') || !vars.isspecialprice) && !(vars.jhtype && idVal === 'housetype')) {
                    var contBox = $('#' + idVal + '_div');
                    thisEl.toggleClass('active').siblings().removeClass('active');
                    contBox.toggle().siblings().not('ul').hide();
                    tabSXStyle($(this));
                    if (contBox.is(':visible')) {
                        var idText = contBox.children().first().attr('id');
                        iscrollCtrl.refresh('#' + idText);
                    }
                    var hsliderBox = $('.qjBox'); 
                    // 判断是否需要使用自定义选择插件
                    if (!sliderObj && contBox.find(hsliderBox).length > 0) {
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
                                $(this).addClass('hover').siblings('div').removeClass('hover');
                            }).on('touchend', function () {
                                $(this).removeClass('hover');
                            });
                        }
                    }
                    if (sliderObj && contBox.find(hsliderBox).length > 0) {
                        var rangArr = [];
                        var hsliderId = hsliderBox.attr('id');
                        if (vars.area && vars.area.length && hsliderId.indexOf('area') > -1) {
                            rangArr = vars.area.split('-');
                        } else if (vars.price && vars.price.length && hsliderId.indexOf('price') > -1) {
                            rangArr = vars.price.split('-');
                        }
                        // 如果携带建筑面积参数/价格参数初始化时展示选中参数
                        if (rangArr.length > 1) {
                            sliderObj._initPos(parseInt(rangArr[0]), parseInt(rangArr[1]));
                        }
                    }
                }
            });

            // 点击筛选栏中各个筛选项(位置除外)
            tabBox.find('.lbTab > ul > li').not('#district').on('click', function () {
                $('#district_comarea').hide();
            });
            // 点击位置，展示地铁站，区县、以及学区第一级列表，有地铁参数选中地铁项，否则默认选中区县展示区县第二级列表
            position.on('click', function () {
                var thisEl = $(this);
                // 添加位置/区域选中样式
                thisEl.toggleClass('active').siblings().removeClass('active');
                distrcitComarea.children().hide().end().siblings().not('ul').hide();
                tabSXStyle($(this));
                distrcitComarea.toggle();
                distrcitComarea.parent().siblings('div').hide();
                if (distrcitComarea.css('display') !== 'none') {
                    distrcitComarea.parent().show();
                }
                if (distrcitComarea.is(':visible')) {
                    $('#confirmBtn').show();
                    // 展示一级列表
                    firstSec.toggle();
                    if (firstSec.is(':visible')) {
                        iscrollCtrl.refresh('#district_show');
                    }
                    // 初始化时含有地铁参数选中地铁选项
                    if (vars.railway !== '' && vars.railwayflag === 'yes') {
                        // 二级地铁线路列表
                        $('#railway').addClass('active').siblings().removeClass('active');
                        railwaySec.show();
                        iscrollCtrl.refresh('#railway_section');
                        // 如含有地铁线，则将选中地铁线路图滚动至可视区域 43为地铁线列表中每个元素的高度
                        scrollShowIndex(railwaySec);
                        // 初始化时含有地铁站参数
                        // (vars.railway && !vars.station)表示点击了地铁下的三级列表但是三级列表点击的是全部
                        if ((vars.station !== '' && vars.railwayflag === 'yes') || (vars.railway && !vars.station)) {
                            stationSec.show().find('dl').hide();
                            var stationDl = $('#station_dl_' + vars.railway);
                            stationDl.show();
                            iscrollCtrl.refresh('#station_section');
                            // 如含有地铁线，则将选中地铁线路图滚动至可视区域 43为地铁线列表中每个元素的高度
                            scrollShowIndex(stationDl);
                        }
                        // 未选中地铁相关数据，默认展示第二级区县列表
                    } else {
                        var districtChannel = $('#district_dd');
                        // 二级区县列表
                        districtChannel.addClass('active').siblings().removeClass('active');
                        // 默认显示第二级区县列表
                        districtList.nextAll().hide().end().show();
                        iscrollCtrl.refresh('#district_section');
                        // 初始化时含有商圈参数显示第三级列表商圈列表
                        // (!vars.comarea && vars.districtTempparamName)表示点击了区域下的三级列表但是三级列表点击的是全部
                        if ((vars.comarea && vars.comarea !== '') || (!vars.comarea && vars.districtTempparamName)) {
                            comareaSection.show().find('dl').hide();
                            $('#comarea_dl_' + vars.district).show();
                            iscrollCtrl.refresh('#comarea_section');
                        }
                    }
                }
            });
            // 点击区域/地铁,显示区县列表/地铁线列表
            firstSec.on('click', 'dd', function () {
                var elem = $(this);
                var elId = elem.attr('id');
                var nameIndex = elId.indexOf('_');
                // 下级列表id
                var nextCon = '#' + elId + '_section';
                if (nameIndex > -1) {
                    nextCon = '#' + elId.slice(0, nameIndex) + '_section';
                }
                elem.addClass('active').siblings().removeClass('active');
                $(nextCon).show().siblings().not(firstSec).hide();
                iscrollCtrl.refresh(nextCon);
            });
            // 地铁站
            railwaySec.on('click', 'a', function () {
                var aEl = $(this);
                var dataId = aEl.attr('data');
                $('#railway_section').find('dd').removeClass('active');
                $('#railway_param_' + dataId).addClass('active');
                $('#station_section').show();
                $('.station_dl').hide();
                var stationDl = $('#station_dl_' + dataId);
                stationDl.show();
                iscrollCtrl.refresh('#station_section');
                var activeIndex = stationDl.find('dd.active').prevAll().length;
                iscrollCtrl.to('#station_section', -activeIndex * 43);
            });
            // 二级城市
            districtList.on('click', 'a', function (e) {
                var aEl = e.target;
                var dataId = $(aEl).data('comarea');
                if (dataId) {
                    var arr = dataId.split(',');
                    districtList.find('dd').removeClass('active');
                    $('#district_param_' + arr[0]).addClass('active');
                    comareaSection.show();
                    $('.comarea_dl').hide();
                    $('#comarea_dl_' + arr[0]).show();
                    iscrollCtrl.refresh('#comarea_section');
                }
            });
            // 点击来源下出售进行跳转，只携带区县以及商圈参数
            $('#hot_div').on('click', 'a', function () {
                var type = $(this).data('jump');
                var esfUrl;
                type = type.trim();
                if (type) {
                    // 商铺出售
                    esfUrl = vars.mainSite + type + '/' + vars.city + (vars.district !== '' ? '_' + vars.district : '')
                        + (vars.comarea !== '' ? '_' + vars.comarea : '') + '/';
                    window.location = esfUrl;
                } else {
                    window.location = vars.mainSite + 'esf/' + vars.city + (vars.district !== '' ? '_' + vars.district : '')
                        + (vars.comarea !== '' ? '_' + vars.comarea : '') + '/';
                }
            });
            var allSec = $('#all_section');
            // 选择更多下级类目时操作
            allSec.find('.chose-item').on('click', 'a', function () {
                var el = $(this);
                var elId = el.parent().parent().attr('id');
                var data = el.attr('data-param').split(',');
                // var tgIndex = elId.lastIndexOf('_');
                // var tgName = elId.slice(0,tgIndex);
                // $('#param_' + tgName).html(el.html());
                var k = data[0], val = data[2];
                if (el.attr('class') === 'active') {
                    el.removeClass('active');
                    paramArr[k] = '';
                } else {
                    $('#' + elId).find('a').removeClass('active');
                    el.addClass('active');
                    if (val !== 'all' && k !== 'bstype') {
                        paramArr[k] = val;
                    } else if (val !== 'all' && k === 'bstype') {
                        if (val === 'bs' && vars.purpose === '住宅') {
                            paramArr.bstype = 'bs';
                        } else if (val === 'zz' && vars.purpose === '别墅' || vars.purpose === '住宅') {
                            paramArr.bstype = 'zz';
                        }
                    } else {
                        paramArr[k] = '';
                    }
                }
            });

            // 点击更多列表下各个选项的向上向下箭头效果
            /* 取消下角标点击显示全部功能
             allSec.find('.moretitle').on('click', 'a', function () {
             var tg = $(this);
             if (tg.hasClass('arr-down')) {
             tg.parent().next().children().show();
             tg.removeClass('arr-down').addClass('arr-up');
             iscrollCtrl.refresh('#all_section');
             } else if (tg.hasClass('arr-up')) {
             tg.parent().next().children('div:gt(0)').hide();
             tg.removeClass('arr-up').addClass('arr-down');
             }
             });
             */
            /**
             * 自定义价格，面积处理函数
             * @param aId
             */
            function customPrice(aId) {
                var minData = $('#' + aId + 'min').find('i').text();
                var maxData = $('#' + aId + 'max').find('i').text();
                minData = minData === '不限' ? '0' : minData;
                maxData = maxData === '不限' ? '0' : maxData;
                var pattern = /^\d+$/;
                if (pattern.test(minData) === false || pattern.test(maxData) === false) {
                    alert('请填写有效的整数！');
                    return false;
                }
                var wUrl = $('.' + aId + 'Url').attr('href');
                if (aId === 'price') {
                    wUrl = wUrl.replace(/p0/i, 'p' + encodeURIComponent(minData + ',' + maxData));
                } else if (aId === 'area') {
                    wUrl = wUrl.replace(/a0/i, 'a' + encodeURIComponent(minData + ',' + maxData));
                }
                window.location = wUrl;
            }

            // 自定义价格,面积
            $('#priceFormatUrl, #areaFormatUrl').on('click', function () {
                var sliderType = $(this).attr('id').replace('FormatUrl', '');
                customPrice(sliderType);
            });
            // 更多栏目下点击重置效果
            $('#resetParam').on('click', function () {
                // 参数数组
                paramArr.tags = '';
                paramArr.buildclass = '';
                paramArr.room = '';
                paramArr.rtype = '';
                paramArr.towards = '';
                paramArr.floor = '';
                paramArr.bstype = '';
                paramArr.equipment = '';
                paramArr.orderby = '';
                paramArr.propertysubtype = '';
                if ($('#housetype').length === 0) {
                    paramArr.housetype = '';
                }
                if ($('#price').length === 0) {
                    paramArr.price = '';
                }
                if ($('#area_sec').length === 0) {
                    paramArr.area = '';
                }
                $('.moretitle').find('span').not('#param_bstype').html('不限');
                $('#param_bstype').html('住宅');
                choseItem.find('a').removeClass('active');
                // choseItem.find('a:first').addClass('active');
            });
            // 点击更多栏目下确定按钮操作
            var completeUrl;
            $('#completeChoose').on('click', function () {
                var thispupose = vars.purpose;
                // url地址后缀，zf/,zf_xzl/,zf_sp/,zf_bs/等。
                var urlSuffix = ($(this).attr('type') || '').trim();
                if (urlSuffix === '' && paramArr.bstype === 'bs' && vars.purpose === '住宅') {
                    urlSuffix = paramArr.bstype;
                } else if (paramArr.bstype === 'zz' && vars.purpose === '别墅') {
                    //别墅类型下，选择了住宅的话
                    urlSuffix = '';
                    thispupose = '住宅';
                }
                // 页面在app中打开地址添加app标识
                var appSuffix = vars.app_type && vars.app_type === 'app' ? '_app' : '';
                vars.zfSite = vars.mainSite + 'zf' + appSuffix + (urlSuffix !== '' ? '_' + urlSuffix : '') + '/';
                // 如含有区县和商圈
                if (vars.src === 'xiaoqu' && vars.projcodes) {
                    completeUrl = vars.zfSite + vars.city + '_xm' + vars.projcodes + (vars.district !== '' ? '_' + vars.district : '')
                        + (vars.comarea !== '' ? '_' + vars.comarea : '') + '/'
                            // 价格（别墅，写字楼，商铺，写字楼)
                        + (paramArr.price !== '' ? 'p' + paramArr.price : '');
                } else {
                    completeUrl = vars.zfSite + vars.city + (vars.district !== '' ? '_' + vars.district : '')
                        + (vars.comarea !== '' ? '_' + vars.comarea : '') + '/'
                            // 价格（别墅，写字楼，商铺，写字楼)
                        + (paramArr.price !== '' ? 'p' + paramArr.price : '');
                }
                if (urlSuffix !== 'xzl' && urlSuffix !== 'sp') {
                    if (paramArr.bstype !== 'bs' && thispupose === '住宅') {
                        // 户型
                        completeUrl += (paramArr.room !== '' ? 'h' + paramArr.room : '')
                                // 整租/合租
                            + (paramArr.rtype !== '' ? 'm' + paramArr.rtype : '')
                                // 特色
                            + (paramArr.tags !== '' ? 'c' + paramArr.tags : '')
                                // 来源
                            + (paramArr.housetype !== '' ? 's' + paramArr.housetype : '')
                                //地铁
                            + (vars.railway !== '' ? 'r' + vars.railway : '')
                            + (vars.station !== '' ? 'b' + vars.station : '')
                                // 朝向
                            + (paramArr.towards !== '' ? 'o' + paramArr.towards : '')
                                // 楼层
                            + (paramArr.floor !== '' ? 'f' + paramArr.floor : '')
                                // 装修
                            + (paramArr.equipment !== '' ? 'd' + paramArr.equipment : '')
                                // 排序
                            + (paramArr.orderby !== '' ? 'px' + paramArr.orderby : '');
                    } else if (thispupose === '别墅') {
                        // 别墅类型
                        completeUrl += (paramArr.buildclass !== '' ? 't' + paramArr.buildclass : '')
                                // 整租/合租
                            + (paramArr.rtype !== '' ? 'm' + paramArr.rtype : '')
                                // 来源
                            + (paramArr.housetype !== '' ? 's' + paramArr.housetype : '')
                                // 卧室数量
                            + (paramArr.room !== '' ? 'h' + paramArr.room : '')
                                // 朝向
                            + (paramArr.towards !== '' ? 'o' + paramArr.towards : '')
                                // 楼层
                            + (paramArr.floor !== '' ? 'f' + paramArr.floor : '')
                                // 装修
                            + (paramArr.equipment !== '' ? 'd' + paramArr.equipment : '')
                                // 排序
                            + (paramArr.orderby !== '' ? 'px' + paramArr.orderby : '');
                    }
                } else {
                    // 面积
                    completeUrl += (paramArr.area !== '' ? 'a' + paramArr.area : '')
                            // 类型
                        + (paramArr.propertysubtype !== '' ? 't' + paramArr.propertysubtype : '')
                            // 特色
                        + (paramArr.tags !== '' ? 'c' + paramArr.tags : '');
                }
                // 房源类型为非别墅类型判断地铁参数
                if (urlSuffix === 'xzl' || urlSuffix === 'sp') {
                    completeUrl += (vars.railway !== '' ? 'r' + vars.railway : '') + (vars.station !== '' ? 'b' + vars.station : '');
                }
                completeUrl += '/';
                if (vars.keyword_tempparam !== '') {
                    completeUrl += '?keyword=' + vars.keyword_tempparam;
                }
                if (vars.sf_source !== '' && vars.sf_source === '360zsclient') {
                    completeUrl += '?sf_source=' + vars.sf_source;
                }
                if (vars.isspecialprice === 'zf') {
                    if (completeUrl.indexOf('?') > 0) {
                        completeUrl += '&tjftype=' + vars.isspecialprice;
                    } else {
                        completeUrl += '?tjftype=' + vars.isspecialprice;
                    }
                }
                if (vars.jhtype === 'zf') {
                    if (completeUrl.indexOf('?') > 0) {
                        completeUrl += '&jhtype=' + vars.jhtype;
                    } else {
                        completeUrl += '?jhtype=' + vars.jhtype;
                    }
                }
                if (vars.communityid) {
                    if (completeUrl.indexOf('?') > 0) {
                        completeUrl += '&communityid=' + vars.communityid;
                    } else {
                        completeUrl += '?communityid=' + vars.communityid;
                    }
                }
                window.location = completeUrl;
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

            // 最下面的导航-------------------------------------------------satrt
            var seoTab = $('.tabNav');
            if (seoTab.find('a').length > 0) {
                // 添加底部SEO  
                var setScroll = $('.typeListB:first');
                var $bottonDiv = $('#bottonDiv');
                var $typeList = $('.typeListB');
                //初始化展示第一个 
                setScroll.show();
                $bottonDiv.find('a').eq(0).addClass('active');
                
                //标签点击事件
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
                addSwiper($("#" + $('#bottonDiv a').eq(0).attr('id')));
            }
            // 最下面的导航-------------------------------------------------end

            /**
             * 电商房源点击统计 2015.3.2
             * 列表页需求：
             * 1.默认列表中的电商房源的点击量（城市、除了来源搜索条件、房源id）
             * 2.来源快筛中 免中介费、个人、经纪人的点击量（分城市）
             * 3.电商列表UV/pv，城市配置（电商城市）
             * 4.默认列表中（没有来源筛选条件），和各条件筛选中除置顶房源的前10条房源点击量
             *
             */
            $('.ds_click_tongji').on('click', function () {
                // id包含两个参数信息 dsorder1_256334 分成两部分dsorder1代表电商列表页第一个电商房源  256334代表房源id
                var pos = this.id;
                var dsorder = pos.substr(0, pos.indexOf('_'));
                var houseid = pos.substr(pos.indexOf('_') + 1);
                // dsClickTongJi(dsorder, houseid);
            });

            $('#housetype_div').find('dd').on('click', function () {
                var housesource = $(this).children('a').html();
                $.ajax({
                    type: 'get',
                    url: '/zf/?c=zf&a=dsClickTongJi&city=' + vars.city,
                    data: 'housesource=' + housesource
                });
            });
            // 添加广告置顶统计 lipengkun
            function adhouseinfotj(city, housetype, houseid, newcode, type, housefrom, channel, agentid) {
                $.ajax({url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid
                + '&newcode=' + newcode + '&type=' + type + '&housefrom=' + housefrom + '&channel=' + channel + '&agentid=' + agentid, async: true});
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
            // 对租房微信服务号过来的用户重定位
            if (vars.weixin) {
                require.async('modules/index/locate');
            }
            if(vars.jhtype){
                //聚合房源提示房源
                setTimeout(function () {
                    $('.ts-box').fadeOut();
                }, 3000);
            }
            //提示聚合房源蒙层显示
            if (vars.localStorage) {
                var mengceng = vars.localStorage.getItem('zfmengceng');
                if (vars.jhflag && !vars.jhtype && !mengceng) {
                    //提示高度修改
                    var top = $('.list-TAB').offset().top;
                    top = parseInt(top) - 22;
                    $('.ts-w').css({'top':top});
                    $('.ts-w').css('left', '60%');
                    $('.jh-tsBox').show();
                    unable();
                    var mengceng = vars.localStorage.setItem('zfmengceng', '1');
                }
            }
            $('.ts-btn').on('click', function () {
                $('.jh-tsBox').hide();
                enable();
            });
            //地铁区域商圈快筛改版
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
                comareaSection.find('dd').removeClass('active');
            });
            //快筛点击确认
            $('#qrtj').on('click', function () {
                getPosition();
                var url;
                var thisType = vars.purpose;
                if (thisType === '商铺') {
                    url = vars.mainSite + 'zf_sp/' + vars.city;
                } else if (thisType === '别墅') {
                    url = vars.mainSite + 'zf_bs/' + vars.city;
                } else if (vars.purpose === '写字楼') {
                    url = vars.mainSite + 'zf_xzl/' + vars.city;
                } else {
                    url = vars.zfSite + vars.city;
                }
                if (!vars.projcodes) {
                    // 如果有区县
                    if (positionInfo['districtId']) {
                        url = url + '_' + positionInfo['districtId'];
                    }
                    // 如果有商圈
                    if (positionInfo['comareaId']) {
                        url = url + '_' + positionInfo['comareaId'];
                    }
                }
                url = url + '/';
                // 用以判断链接后是否加/
                var flaggang = false;
                if (vars.price) {
                    url = url + 'p' + vars.priceTempparam;
                    flaggang = true;
                }
                if (vars.area && (vars.purpose === '写字楼' || vars.purpose === '商铺')) {
                    url = url + 'a' + vars.area;
                    flaggang = true;
                }
                if (vars.room && (vars.purpose === '住宅')) {
                    url = url + 'h' + vars.room;
                    flaggang = true;
                }
                if (vars.buildclass && vars.purpose === '别墅') {
                    url = url + 't' + vars.buildclass;
                    flaggang = true;
                }
                if (vars.propertysubtype && (vars.purpose === '写字楼' || vars.purpose === '商铺')) {
                    url = url + 't' + vars.propertysubtype;
                    flaggang = true;
                }
                if (vars.rtype && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'm' + vars.rtype;
                    flaggang = true;
                }
                if (vars.tags && (vars.purpose === '写字楼' || vars.purpose === '住宅')) {
                    url = url + 'c' + vars.tags;
                    flaggang = true;
                }
                if (vars.housetype && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 's' + vars.housetype;
                    flaggang = true;
                }
                if (vars.room && (vars.purpose === '别墅')) {
                    url = url + 'h' + vars.room;
                    flaggang = true;
                }
                if (positionInfo['railwayId'] && vars.purpose !== '别墅') {
                    url = url + 'r' + positionInfo['railwayId'];
                    flaggang = true;
                }
                if (positionInfo['stationId'] && vars.purpose !== '别墅') {
                    url = url + 'b' + positionInfo['stationId'];
                    flaggang = true;
                }
                if (vars.towards && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'o' + vars.towards;
                    flaggang = true;
                }
                if (vars.floor && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'f' + vars.floor;
                    flaggang = true;
                }
                if (vars.equipment && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'd' + vars.equipment;
                    flaggang = true;
                }
                if (vars.orderby && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'px' + vars.orderby;
                    flaggang = true;
                }
                if (vars.projcode && (vars.purpose === '住宅')) {
                    url = url + 'j' + vars.projcode;
                    flaggang = true;
                }
                if (flaggang) {
                    url = url + '/';
                }
                if (vars.keyword_tempparam !== '') {
                    url += '&keyword=' + vars.keyword_tempparam;
                }
                if (vars.sf_source !== '' && vars.sf_source === '360zsclient') {
                    url += '&sf_source=' + vars.sf_source;
                }
                if (vars.isspecialprice === 'zf') {
                    url += '&tjftype=' + vars.isspecialprice;
                }
                if (vars.jhtype === 'zf') {
                    url += '&jhtype=' + vars.jhtype;
                }
                url = url.replace('/&', '/?');
                window.location = url;
            });
            //跳转传参
            function getPosition() {
                var district = $("#district_dd");
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
            //小区快筛点击确认
            $('#xiaoquFormatUrl').on('click', function () {
                var url;
                var thisType = vars.purpose;
                if (thisType === '别墅') {
                    url = vars.mainSite + 'zf_bs/' + vars.city;
                } else {
                    url = vars.zfSite + vars.city;
                }
                url = url + '/';
                // 用以判断链接后是否加/
                var flaggang = false;
                if (vars.price) {
                    url = url + 'p' + vars.priceTempparam;
                    flaggang = true;
                }
                if (vars.room && (vars.purpose === '住宅')) {
                    url = url + 'h' + vars.room;
                    flaggang = true;
                }
                if (vars.buildclass && vars.purpose === '别墅') {
                    url = url + 't' + vars.buildclass;
                    flaggang = true;
                }
                if (vars.rtype && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'm' + vars.rtype;
                    flaggang = true;
                }
                if (vars.tags && vars.purpose === '住宅') {
                    url = url + 'c' + vars.tags;
                    flaggang = true;
                }
                if (vars.housetype && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 's' + vars.housetype;
                    flaggang = true;
                }
                if (vars.room && (vars.purpose === '别墅')) {
                    url = url + 'h' + vars.room;
                    flaggang = true;
                }
                if (vars.towards && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'o' + vars.towards;
                    flaggang = true;
                }
                if (vars.floor && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'f' + vars.floor;
                    flaggang = true;
                }
                if (vars.equipment && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'd' + vars.equipment;
                    flaggang = true;
                }
                if (vars.orderby && (vars.purpose === '别墅' || vars.purpose === '住宅')) {
                    url = url + 'px' + vars.orderby;
                    flaggang = true;
                }
                if (vars.projcode && (vars.purpose === '住宅')) {
                    url = url + 'j' + vars.projcode;
                    flaggang = true;
                }
                if (flaggang) {
                    url = url + '/';
                }
                if (vars.keyword_tempparam !== '') {
                    url += '&keyword=' + vars.keyword_tempparam;
                }
                if (vars.sf_source !== '' && vars.sf_source === '360zsclient') {
                    url += '&sf_source=' + vars.sf_source;
                }
                if (vars.isspecialprice === 'zf') {
                    url += '&tjftype=' + vars.isspecialprice;
                }
                if (vars.jhtype === 'zf') {
                    url += '&jhtype=' + vars.jhtype;
                }
                if (vars.communityid) {
                    url += '&communityid=' + vars.communityid;
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
                url = url.replace('/&', '/?');
                window.location = url;
            });

            $('.tongjihref').on('click', function(){
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
        };
    });