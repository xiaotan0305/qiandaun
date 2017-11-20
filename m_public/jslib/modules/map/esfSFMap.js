/**
 * 二手房地图参数初始化，ajax搜索参数处理
 */
define('modules/map/esfSFMap', ['jquery', 'modules/map/API/esfMapApi', 'modules/map/mapPublic'], function (require) {
    'use strict';
    var $ = require('jquery');
    var MapApi = require('modules/map/API/esfMapApi');
    var MapPublic = require('modules/map/mapPublic');

    var vars = seajs.data.vars;
    var SFMap = [];
    var $load = $('#loadPrompt');
    // 房源弹框对象
    var $houseObj = $('#houseList');
    // 楼盘弹框头部对象
    var $houseHeaderObj = $('#house_count_wrap');
    // 楼盘弹框列表div的对象
    var $houseListObj = $('#house_detail_wrap');
    // 楼盘弹框列表ul的对象
    var $houseUlObj = $houseListObj.find('ul');
    // 门店弹框对象
    var $ecshopObj = $('.m-md-out');
    // 门店按钮
    var $ecshopChooseObj = $('.md-icon');
    // 搜索结果弹框对象
    var $searchObj = $('#searchResult');
    // 搜索弹框头部对象
    var $searchHeaderObj = $('.re-num');
    // 搜索弹框列表div的对象
    var $searchListObj = $('.r-listBox');
    // 搜索弹框列表ul的对象
    var $searchUlObj = $('.result-list');
    // 记录大数据容器
    var guess = [];
    var guessPosition = {};
    // 默认关键字数组
    var keywordArr = ['请输入小区、地名、开发商…', '请输入小区、地铁、开发商…'];
    // 统计行为
    require.async('jsub/_vb.js?c=mnhmap');
    require.async('jsub/_ubm.js', function () {
        _ub.city = vars.cityname;
        // 业务---WAP端
        _ub.biz = 'n';
        var ns = vars.ns === 'n' ? 0 : 1;
        _ub.location = ns;

        _ub.request('vme.position,vme.subway,vme.totalprice,vme.housetype,vme.area', function () {
            // 每一个字段，都会返回一个权重最高的值
            _ub.load(2);
            // 使用_ub['编号']的形式来获取，如： _ub['vme.position']
            console.log(decodeURIComponent(_ub['vme.position'] + _ub['vme.subway'] + _ub['vme.totalprice'] + _ub['vme.housetype'] + _ub['vme.area']));
            // 区域
            guessPosition.position = decodeURIComponent(_ub['vme.position']);
            // 地铁
            guessPosition.subway = decodeURIComponent(_ub['vme.subway']);
            // 均价
            guessPosition.totalprice = decodeURIComponent(_ub['vme.totalprice']).replace('-', '^');
            // 类型
            guessPosition.bedrooms = decodeURIComponent(_ub['vme.housetype']).substring(0, 1);
            // 热门
            guessPosition.area = decodeURIComponent(_ub['vme.area']);
            // 在下面添加推送逻辑代码
            if (guessPosition.position) {
                guess.push({position: guessPosition.position});
            }else if ( guessPosition.subway) {
                guess.push({subway: guessPosition.subway});
            }
            if (guessPosition.totalprice && guess.length < 2) {
                guess.push({strPrice: guessPosition.totalprice});
            }
            if (guessPosition.bedrooms && guess.length < 2) {
                var arrBadroom = ['1室','2室','3室','4室','5室','6室以上'];
                for (var i = 0, len = arrBadroom.length; i < len; i++) {
                    if (arrBadroom[i] === guessPosition.bedrooms) {
                        guess.push({bedrooms: i + 1});
                        break;
                    }
                }
            }
            if (guessPosition.area && guess.length < 2) {
                guess.push({area: guessPosition.area.replace('-','^').replace('平','')});
            }
        });

    });
    SFMap.fn = SFMap.prototype = {
        map: null,
        params: {
            page: 1,
            pagesize: 70,
            x1: '',
            y1: '',
            x2: '',
            y2: '',
            // 物业类型
            purpose: '',
            // 总价
            strPrice: '',
            // 区县
            strDistrict: '',
            // 区县id
            districtId: '',
            // 商圈
            strComArea: '',
            // 户型
            bedrooms: '',
            // 楼盘ID
            projcodes: '',
            // 关键字
            strKeyword: '',
            // 地铁线id
            railway: '',
            // 地铁线名称
            railwayName: '',
            // 地铁站名称
            stationName: '',
            // 地铁站
            railwayStation: '',
            // 面积
            area: '',
            // 特色
            tag: '',
            // 特色名称，用户行为统计使用
            tagName: '',
            // 房龄
            age: '',
            // 楼层
            floor: '',
            // 别墅类型
            buildclass: '',
            // 别墅装修
            equipment: '',
            // 地图级别
            zoom: '11',
            // 门店
            ecshop: '',
            // 门店id
            ecshopid: ''
        },
        // 地图上是否已经显示定位标点
        locationSign: false,
        // 是否正在进行搜索
        isSearching: false,
        // 搜索的ajax变量
        ajaxFlag: 0,
        districtZoom: 11,
        comareaZoom: 14,
        villageZoom: 16,
        ecshopzoom: 12,
        // 地图状态city/district/subwayline/subwaystation/location/zoom/drag/ecshop
        mapstatus: 'city',
        // 需要移至中心的坐标
        pointX: vars.cityx,
        pointY: vars.cityy,
        // 首次加载
        firstLoad: true,
        // 房源数量
        housecount: 0,
        // 初始化
        init: function () {
            var that = this;
            // 城市默认等级
            that.params.zoom = vars.zoom;
            that.map = new MapApi('allmap', vars.cityy, vars.cityx, that.params.zoom);
            // 初始化参数
            that.initParams();
            // 查看是否需要定位,有关键字，区域，地铁不定位
            if (that.params.strKeyword || that.params.strDistrict || that.params.railwayName) {
                that.searchResult();
            } else {
                // 定位
                MapPublic.locationMap('esf');
            }
        },
        // 初始化参数
        initParams: function () {
            var that = this;
            // 一级对象
            var obj = '';
            // 二级对象
            var cobj = '';
            // dd的对象
            var listObj = '';
            that.params.purpose = vars.purpose;
            // 有区县id
            if (vars.districtId !== '') {
                // 区县a标签的对象的父节点dd
                listObj = $('#district_section').find('a[data-id=' + vars.districtId + ']').parent();
                listObj.addClass('active');
                cobj = $('dl[id=comarea_dl_' + vars.districtId + ']');
                if (cobj.find('a').length > 0) {
                    // 有商圈id
                    if (vars.comareaId !== '') {
                        // 商圈a标签父节点dd的点击
                        cobj.find('a[data-id=' + vars.comareaId + ']').parent().trigger('click');
                    } else {
                        // 商圈a标签第一个的父节点dd点击
                        cobj.find('a').first().parent().trigger('click');
                    }
                }
            }
            // 地铁
            if (vars.railwayName) {
                listObj = $('#railway_section').find('a[data-id=' + vars.railway + ']').parent();
                listObj.addClass('active');
                cobj = $('dl[id=station_dl_' + vars.railway + ']');
                if (cobj.length > 0) {
                    // 找地铁站
                    if (vars.stationName) {
                        // 地铁站a标签父节点dd的点击
                        cobj.find('a[data-id=' + vars.railwayStation + ']').parent().trigger('click');
                    } else {
                        // 地铁站a标签第一个的父节点dd点击
                        cobj.find('a').first().parent().trigger('click');
                    }
                }
            }

            // 价格
            if (vars.strPrice) {
                var strPrice = vars.strPrice;
                var priceSection = $('#price_section');
                obj = priceSection.find('dd[data-id="' + strPrice + '"]');
                if (obj.length === 0) {
                    // 自定义价格
                    obj = priceSection.find('dd[data-id=custom]');
                    obj.text(strPrice.replace('^', '-'));
                }
                obj.trigger('touchend');
            }

            // 户型
            if (vars.bedrooms !== '') {
                obj = $('#room_section dd[data-id="' + vars.bedrooms + '"]');
                if (obj.length > 0) {
                    obj.trigger('touchend');
                }
            }
            // 面积
            if (vars.area) {
                var areaArr = vars.area.split(['_']);
                for (var i = 0,len = areaArr.length; i < len; i++) {
                    $('#search_area a[data-id="' + areaArr[i] + '"]').addClass('active');
                }
            }
            // 特色
            if (vars.tag !== '') {
                var tagArr = vars.tag.split([',']);
                for (var i = 0,len = tagArr.length; i < len; i++) {
                    $('#search_tag a[data-id="' + tagArr[i] + '"]').addClass('active');
                }
                
            }
            // 朝向
            if (vars.towards !== '') {
                var towardsArr = vars.towards.split(['_']);
                for (var i = 0,len = towardsArr.length; i < len; i++) {
                    $('#search_towards a[data-id="' + towardsArr[i] + '"]').addClass('active');
                }
            }
            // 房龄
            if (vars.age !== '') {
                var ageArr = vars.age.split(['_']);
                for (var i = 0,len = ageArr.length; i < len; i++) {
                    $('#search_age a[data-id="' + ageArr[i] + '"]').addClass('active');
                }
            }
            // 楼层
            if (vars.floor !== '') {
                var floorArr = vars.floor.split([',']);
                for (var i = 0,len = floorArr.length; i < len; i++) {
                    $('#search_floor a[data-id="' + floorArr[i] + '"]').addClass('active');
                }
            }
            // 装修
            if (vars.equipment !== '') {
                 $('#search_equipment a[data-id="' + vars.equipment + '"]').addClass('active');
            }
            // 更多的筛选条件数据获取
            $('#completeChoose').trigger('click');
            // 关键词,初始化关键字搜索要放在更多筛选点击后面
            // 判断关键字是否是默认的
            if ($.inArray(vars.strKeyword, keywordArr) === -1) {
                // 触发搜索
                that.clearOtherOption('keyword', {keyword: vars.strKeyword});
            }
        },

        // 选择条件时点击触发事件:  obj 点击对象  mtype 对象类型
        clickComplete: function (obj, mtype) {
            if (obj) {
                var id = obj.attr('data-id');
                var text = obj.text();
                var info = null;
                switch (mtype) {
                    case 'comarea':
                        // 寻找所属区县元素
                        var distId = obj.parents('dl').attr('id').substr(11);
                        var distObj = $('#district_section a[data-id=' + distId + ']');
                        if (distObj) {
                            // 选择不限
                            if ('all' === id) {
                                // 进入商圈模式
                                info = {
                                    district: distObj.text(),
                                    districtId: distId,
                                    coord_x: distObj.attr('data-coord-x'),
                                    coord_y: distObj.attr('data-coord-y')
                                };
                            } else {
                                // 进入楼盘模式
                                info = {
                                    name: text,
                                    coord_x: obj.attr('data-coord-x'),
                                    coord_y: obj.attr('data-coord-y'),
                                    district: distObj.text(),
                                    districtId: distId
                                };
                            }
                        }
                        break;
                    case 'station':
                        // 寻找所属地铁线
                        var lineId = obj.parents('dl').attr('id').substr(11);
                        var lineObj = $('#railway_section a[data-id=' + lineId + ']');
                        if (lineObj) {
                            // 选择不限
                            if ('all' === id) {
                                // 进入地铁线模式
                                info = {
                                    railwayName: lineObj.text(),
                                    railway: lineId
                                };
                            } else {
                                // 进入地铁站模式
                                info = {
                                    name: text,
                                    coord_x: obj.attr('data-coord-x'),
                                    coord_y: obj.attr('data-coord-y'),
                                    railwayName: lineObj.text(),
                                    railway: lineId,
                                    railwayStation: obj.attr('data-id')
                                };
                            }
                        }
                        break;
                    case 'price':
                        var priceParamContent = $('#price span');
                        // 总价数组
                        var priceArr = null;
                        // 选择不限
                        if ('all' === id) {
                            priceParamContent.text('总价');
                            info = {strPrice: ''};
                        } else if ('custom' === id) {
                            // 通过滑动选择
                            priceArr = text.split('-');
                            if (text === '-') {
                                priceParamContent.text('总价');
                                // 滑块都为不限，价格传空跳出
                                info = {strPrice: ''};
                                break;
                            } else if (!priceArr[1]) {
                                text = priceArr[0] + '万以上';
                            } else if (!priceArr[0]) {
                                text = priceArr[1] + '万以下';
                            } else {
                                text = priceArr[0] + '-' + priceArr[1] + '万';
                            }
                            priceParamContent.text(text);
                            info = {strPrice: priceArr[0] + '^' + priceArr[1]};
                        } else {
                            priceParamContent.text(text);
                            info = {strPrice: id};
                        }
                        break;
                    case 'room':
                        var roomParamContent = $('#room span');
                        // 选择不限
                        if ('all' === id) {
                            roomParamContent.text('户型');
                            info = {bedrooms: ''};
                        } else {
                            roomParamContent.text(text);
                            info = {bedrooms: id};
                        }
                        break;
                    default:
                        break;
                }
                this.clearOtherOption(mtype, info);
            }
        },
        // 搜索房源
        searchResult: function () {
            var that = this;
            // 如果之前的ajax存在，清除掉之前的ajax
            if (that.ajaxFlag) {
                // ajax终止
                that.ajaxFlag.abort();
                that.ajaxFlag = 0;
            }
            // 搜索提示信息显示
            $load.show();
            // 如果不是点击楼盘，清除标点
            if (!that.params.projcodes) {
                that.map.clearOverlays();
            }
            // 执行搜索变量为true
            that.isSearching = true;
            // 用户行为统计的特色名称
            if (that.params.tag) {
                var tagArr = that.params.tag.split(','), tagStr = '';
                for (var i = 0,len = tagArr.length; i < len; i++) {
                    tagStr += $('#search_tag a[data-id=' + tagArr[i] + ']').text() + ',';
                }
                that.params.tagName = tagStr.substring(0, tagStr.length - 1);
            }
            //  添加关键词用户行为统计
            require.async('modules/esf/yhxw', function (yhxw) {
                yhxw({type: 1, pageId: 'mesfmap', curChannel: 'esfmap', params: that.params,

                });
            });
            // 有楼盘id或关键字，搜索数量为20，否则为70
            if (that.params.projcodes || that.params.strKeyword) {
                that.params.pagesize = 20;
            } else {
                that.params.pagesize = 70;
            }
            if (that.mapstatus === 'location') {
                // 如果是定位，显示定位标点，要放在setCenter前面，否则走了缩放mapstatus就清空了
                that.map.drawMarkers([{coord_x: that.pointX, coord_y: that.pointY, type: 'location'}]);
                that.map.setCenter(that.pointY, that.pointX, that.params.zoom);
            } else if (that.mapstatus === 'keyword') {
                // 如果是关键字，全城搜索
                that.map.setCenter(vars.cityy, vars.cityx, that.districtZoom);
            } else if (that.mapstatus === 'ecshop') {
                // 如果是门店搜索
                that.map.setCenter(vars.cityy, vars.cityx, that.districtZoom);
                that.params.ecshop = 'shop';
            } else if (that.mapstatus === 'ecshopid') {
                // 如果是门店点击，将门店移至地图中心
                that.map.setCenter(that.pointY, that.pointX, that.params.zoom);
                MapPublic.setProjCenter(new BMap.Point(that.pointX, that.pointY), 53, that.params.zoom, that.map);
            } else if (that.mapstatus !== 'noecshop' && that.mapstatus !== 'drag'
                && that.mapstatus !== 'zoom' && !(that.mapstatus === 'loupan' && that.params.page > 1)) {
                // 是点击楼盘加载更多搜索就不重新定位
                that.map.setCenter(that.pointY, that.pointX, that.params.zoom);
            }
            // 隐藏门店列表
            if ($ecshopObj.is(':visible')) {
                $ecshopObj.hide();
            }
            if (that.params.page === 1) {
                // 有些情况需要隐藏房源列表
                if ($houseObj.is(':visible')) {
                    $houseObj.hide();
                }
                // 根据级别设置门店模式
                if (!that.params.ecshop) {
                    if (that.params.zoom > that.ecshopzoom) {
                        // >12级显示门店和房源
                        that.params.ecshop = 'shophouse';
                    } else if ($ecshopChooseObj.hasClass('active')) {
                        // 选中了门店按钮
                        that.params.ecshop = 'shop';
                    }
                }
            }

            // that.params赋值给ajax参数
            var params = $.extend({}, that.params);
            // 四角坐标
            var searchBounds = that.map.gethdBounds();
            // ajax参数
            params = $.extend(params, searchBounds);
            params.c = 'map';
            params.a = 'ajaxEsfMapSearch';
            params.city = vars.city;
            var guessSuccess = function (result) {
                // 是地铁线就不显示提示
                if (!(params.railwayName !== '' && params.stationName === '')) {
                    if ('fail' === result.res) {
                        // 提示
                        MapPublic.showPrompt('未找到满足条件的房源');
                        // 搜索弹框收起
                        $searchObj.hide();
                        // 第一次关键字搜索没搜到数据，重新定义地图等级到districtZoom
                        if (that.firstLoad && that.params.strKeyword) {
                            that.params.zoom = that.districtZoom;
                        }
                    }else if ('succ' === result.res && !guess.length && params.guess) {
                        $('header').show();
                        $('#tabSX').show();
                        // 提示
                        if (!$('#wapesfditu_B01_26').hasClass('active')) {
                            MapPublic.showPrompt('未找到满足条件的房源');
                        }
                        // 搜索弹框收起
                        $searchObj.hide();
                        // 第一次关键字搜索没搜到数据，重新定义地图等级到districtZoom
                        if (that.firstLoad && that.params.strKeyword) {
                            that.params.zoom = that.districtZoom;
                        }
                    } else if ('succ' === result.res && result.housecount) {
                        // 房源数量
                        that.housecount = result.housecount;
                        // 如果点击小区
                        if (params.projcodes || result.projinfo) {
                            // 如果是首页
                            if (params.page === 1) {
                                // 隐藏头部
                                $('header').hide();
                                $('#tabSX').hide();
                                // 成交套数
                                var countTao = result.dealcount? '&nbsp&nbsp&nbsp&nbsp&nbsp成交记录' + result.dealcount + '套': '';
                                // 房源列表头部
                                if (result.projinfo) {
                                    // 头部拼接字符串
                                    var proheadStr = '<a id="wapesfditu_B01_14" data-id="' + result.projinfo.projcode
                                        + '" href="javascript:void(0);"><div class="top-list-t"><h2>';
                                    // 有均价拼接均价，没有不拼接
                                    if (result.projinfo.price) {
                                        proheadStr += '<em class="flor">均价' + result.projinfo.price + '元/平</em>';
                                    }
                                    proheadStr += '<span>' + result.projinfo.projname
                                        + '</span></h2></div><div><p class="gray-0">' + result.housecount + '套房源' + countTao + '</p></div></a>';
                                    // 列表头部信息
                                    $houseHeaderObj. html(proheadStr);
                                } else {
                                    $houseHeaderObj. html('<a id="wapesfditu_B01_14"  href="javascript:void(0);"><p class="gray-0">'
                                        + result.housecount + '套房源' + countTao + '</p></div></a>');
                                }
                                // 加载房源列表内容
                                $houseUlObj.html(result.list);

                                // 列表一页的高度
                                var h = 291;
                                if (that.housecount < 3) {
                                    // 97是一个li标签的高度
                                    h = that.housecount * 97;
                                }
                                // 搜索弹框收起
                                $searchObj.hide();
                                // 弹框弹起
                                $houseObj.show();
                                // 设置列表高度
                                $houseListObj.height(h).scrollTop(0);
                                // 弹框弹起将小区标点移动到地图中心
                                if (result.projinfo) {
                                    // h是房源列表一页的高度，76是列表头部楼盘信息的高度，80是搜索框和筛选框的高度，移动距离是h+76-80=h-4的一半
                                    MapPublic.setProjCenter(new BMap.Point(result.projinfo.coord_x, result.projinfo.coord_y),
                                        (h - 4) / 2, that.params.zoom, that.map);
                                }
                            } else {
                                // 房源列表数据添加
                                $houseUlObj.append(result.list);
                            }
                            // 图片惰性加载
                            require.async('lazyload/1.9.1/lazyload', function () {
                                // container是显示的图片区域的对象
                                $('img[data-original]').lazyload({container: '#house_detail_wrap'});
                            });
                            // 加载中p标签提示移除
                            $('.p-up').remove();
                            // 添加加载更多标签
                            if (params.pagesize * params.page < that.housecount) {
                                // 加载中p标签提示添加
                                $houseListObj.append('<p class="p-up">上拉加载更多</p>');
                            }
                            // 处理房源页面
                            MapPublic.setHouseList();
                            if (typeof result.houseinfo !== 'undefined') {
                                // 画新标点
                                that.map.drawMarkers(result.houseinfo);
                                // h是房源列表一页的高度，76是列表头部楼盘信息的高度，80是搜索框和筛选框的高度，移动距离是h+76-80=h-4的一半
                                MapPublic.setProjCenter(new BMap.Point(result.projinfo.coord_x, result.projinfo.coord_y),
                                    (h - 4) / 2, that.params.zoom, that.map);
                                // 只有一个搜索结果时，直接选中该结果
                                $('a[data-projcode='+ result.projinfo.projcode + ']').trigger('touchstart').trigger('touchend');
                            }
                        } else {

                            if (params.strKeyword === '') {
                                // 提示
                                // 当猜你喜欢并且大数据没有返回数据时 不显示猜你喜欢描点
                                var taoNum = (!guess.length && params.guess)? '未找到满足条件的房源': '共找到' + result.housecount + '套房源';
                                MapPublic.showPrompt(taoNum);
                                // 如果是猜你喜欢
                                if (params.guess && guess.length) {
                                    // 如果是关键词搜索，将第一个楼盘作为地图中心
                                    that.pointX = result.houseinfo[0].coord_x;
                                    that.pointY = result.houseinfo[0].coord_y;
                                    that.map.setCenter(that.pointY, that.pointX, that.villageZoom);
                                    // 楼盘/小区数量
                                    var projCount = result.houseinfo.length;
                                    // 房源列表头部
                                    var defaultStr = vars.strKeyword !== '请输入小区名、地铁或地名'? vars.strKeyword: '';
                                    var listHead = params.guess? '没找到与 "' + defaultStr + '"相关房源，猜你想找：': '共找到 "' + params.strKeyword + '"相关' + projCount + '个结果';
                                    $searchHeaderObj. html(listHead);
                                    // 加载房源列表内容
                                    $searchUlObj.html(result.list);

                                    // 列表一页的高度 5行
                                    var h = 225;
                                    // 弹框弹起
                                    $searchObj.show();
                                    // 设置列表高度
                                    $searchListObj.height(h).scrollTop(0);
                                    $('.result-list li').on('click', function () {
                                        var id = $(this).attr('data-id');
                                        $('a[data-projcode='+ id + ']').trigger('touchstart').trigger('touchend');
                                    });
                                }
                            } else {
                                // 如果是关键词搜索，将第一个楼盘作为地图中心
                                that.pointX = result.houseinfo[0].coord_x;
                                that.pointY = result.houseinfo[0].coord_y;
                                that.map.setCenter(that.pointY, that.pointX, that.villageZoom);
                                // 楼盘/小区数量
                                var projCount = result.houseinfo.length;
                                // 房源列表头部
                                var defaultStr = vars.strKeyword !== '请输入小区名、地铁或地名'? vars.strKeyword: '';
                                var listHead = params.guess? '没找到与 "' + defaultStr + '"相关房源，猜你想找': '共找到 "' + params.strKeyword + '"相关' + projCount + '个结果';
                                $searchHeaderObj. html(listHead);
                                // 加载房源列表内容
                                $searchUlObj.html(result.list);

                                // 列表一页的高度 5行
                                var h = 225;
                                // 弹框弹起
                                $searchObj.show();
                                // 设置列表高度
                                $searchListObj.height(h).scrollTop(0);
                                $('.result-list li').on('click', function () {
                                    var id = $(this).attr('data-id');
                                    $('a[data-projcode='+ id + ']').trigger('touchstart').trigger('touchend');
                                });
                            }
                            // 画新标点

                            that.map.drawMarkers(result.houseinfo);
                            if (h && result.houseinfo[0].coord_x) {
                                // h是房源列表一页的高度(含头部)，80是搜索框和筛选框的高度，移动距离是h-80=的一半
                                MapPublic.setProjCenter(new BMap.Point(result.houseinfo[0].coord_x, result.houseinfo[0].coord_y),
                                    (h - 80) / 2, that.params.zoom, that.map);
                            }


                        }
                    } else {
                        if (that.params.strKeyword) {
                            // 无搜索结果时显示头部
                            $('header').show();
                            $('#tabSX').show();
                        }
                        // 提示
                        if (!$('#wapesfditu_B01_26').hasClass('active')) {
                            MapPublic.showPrompt('未找到满足条件的房源');
                        }

                    }
                    // 如果返回搜房门店
                    if ('succ' === result.res && result.shopinfo) {
                        // 画新标点
                        that.map.drawMarkers(result.shopinfo);
                        if (params.ecshopid) {
                            for (var i = 0; i < result.shopinfo.length; i++) {
                                var info = result.shopinfo[i];
                                if (info.id === params.ecshopid) {
                                    that.clickEcShop(info, true);
                                    break;
                                }
                            }
                        }
                    }
                }
            };
            var onFailure = function () {
                // 处理搜索中点击别的显示搜索字样问题
                if (!that.isSearching) {
                    MapPublic.showPrompt('未找到满足条件的房源');
                    if (that.params.projcodes && that.params.page > 1) {
                        // 加载中p标签提示移除
                        $('.p-up').remove();
                    }
                }
            };
            var onComplete = function () {
                that.isSearching = false;
                that.firstLoad = false;
                // 如果有地铁线，就划线
                if (that.params.railwayName) {
                    MapPublic.showSubway('esf', that.params.railwayName, that.map);
                }
                // 搜索提示信息隐藏
                $load.hide();
            };
            // ajax获取
            var onSuccess = function (result) {
                // 列表按钮地址
                $('.icon-list').attr('href', result.listurl);
                // 判断是不是关键字搜索
                var strKeyword = vars.strKeyword;
                // 如果返回的楼盘数为0 则猜你喜欢  不为0  直接显示
                if (strKeyword === '请输入小区、地铁、开发商…') {
                    strKeyword = '';
                }
                if (!result.housecount && strKeyword) {
                    params.guess = true;
                    params.strKeyword = '';
                    for (var i = 0,len = guess.length;i < len; i++ ) {
                        for (var key in guess[i]) {
                            if (key === 'position') {
                                params.strDistrict = guess[i][key].split('^')[0];
                                params.strComArea = guess[i][key].split('^')[1];
                            }else if (key === 'subway') {
                                params.railwayName = guess[i][key].split('^')[0];
                                params.stationName = guess[i][key].split('^')[1];
                            }else {
                                params[key] = guess[i][key];
                            }
                        }
                    }
                    $.ajax({
                        url: vars.mapSite,
                        type: 'get',
                        dataType: 'json',
                        data: params,
                        success: guessSuccess,
                        error: onFailure,
                        complete: onComplete
                    });
                }else {
                    guessSuccess(result);
                }

            };

            // 把ajax赋给一个变量
            that.ajaxFlag = $.ajax({
                url: vars.mapSite,
                type: 'get',
                dataType: 'json',
                data: params,
                success: onSuccess,
                error: onFailure,
                complete: onComplete
            });
        },
        // 门店点击事件。info标点信息;searchmode是否经过重新搜索
        clickEcShop: function (info, searchmode) {
            var that = this;
            if (!searchmode) {
                // 将门店移至地图中心
                that.map.setCenter(info.coord_y, info.coord_x, that.params.zoom);
                MapPublic.setProjCenter(new BMap.Point(info.coord_x, info.coord_y), 53, that.params.zoom, that.map);
                // 修改对象为选中状态，原选中对象非选中状态
                var oldPoint = $('.m-md-icon.cur');
                if (oldPoint.length > 0) {
                    oldPoint.removeClass('cur').css('z-index', '');
                }
                // 去掉选中楼盘
                if ($houseObj.is(':visible')) {
                    MapPublic.hideHouseList();
                }
            }
            $('.m-md-icon1[data-id=' + info.id + ']').addClass('cur').css('z-index', '100');
            $('.m-md-icon2[data-id=' + info.id + ']').addClass('cur').css('z-index', '100');
            // 显示门店弹框
            var html = '<div class="m-btns">';
            if (info.hotline) {
                html += '<a id="wapesfditu_B01_27" href="tel:' + info.hotline + '" class="md-tel-btn"><i></i></a>';
            }
            html += '<a id="wapesfditu_B01_28" href="javascript:void(0);" class="md-dh-btn"><i></i></a></div>';
            html += '<a href="' + vars.mainSite + 'shop/' + vars.city + '/' + info.id
            + '/' + info.shoptype + '/"><h3>' + info.shopname + '</h3></a>';
            if (info.housenum > 0) {
                html += '<p>' + info.housenum + '套在售房源</p>';
            }
            $ecshopObj.attr('data-id', info.id).html(html).show();
            // 门店导航按钮
            $('.md-dh-btn').on('click', function (event) {
                // 获取定位位置
                MapPublic.locationMap('esf', 2, function (locationpoint) {
                    // 跳转到百度导航
                    var url = 'http://api.map.baidu.com/direction';
                    url += '?origin=' + locationpoint.coord_y + ',' + locationpoint.coord_x;
                    url += '&destination=' + info.coord_y + ',' + info.coord_x;
                    url += '&mode=driving&region=' + vars.cityname + '&output=html&src=yourCompanyName';
                    window.location = url;
                });
                event.stopPropagation();
            });
        },
        // 分类别清空搜索条件mtype：搜索类型, info标点信息
        clearOtherOption: function (mtype, info) {
            var that = this;
            that.params.page = 1;
            that.mapstatus = mtype;
            // 清除楼盘id，重新搜索不在弹出楼盘
            that.params.projcodes = '';
            // 清除门店参数
            that.params.ecshop = that.params.ecshopid = '';
            // 如果头部被隐藏，显示
            // $('header').show();
            // $('#tabSX').show();
            // 快筛文本
            var strPosition0A = $('#position span');
            switch (mtype) {
                // 如果是关键字
                case 'keyword':
                    that.params.strDistrict = that.params.strComArea = that.params.strKeyword = '';
                    // 地铁数据清除
                    that.params.railway = that.params.railwayStation = that.params.railwayName = that.params.stationName = '';
                    that.params.zoom = that.villageZoom;
                    that.params.strKeyword = info.keyword;
                    strPosition0A.text('位置');
                    break;
                // 定位
                case 'location':
                    that.params.strDistrict = that.params.strComArea = that.params.strKeyword = '';
                    // 地铁数据清除
                    that.params.railway = that.params.railwayStation = that.params.railwayName = that.params.stationName = '';
                    that.params.zoom = that.comareaZoom;
                    that.pointX = info.coord_x;
                    that.pointY = info.coord_y;
                    strPosition0A.text('位置');
                    break;
                // 如果是移动
                case 'drag':
                    that.params.strDistrict = that.params.strComArea = that.params.strKeyword = '';
                    // 如果是地铁模式位置文字不改变
                    if (!that.params.railwayName) {
                        strPosition0A.text('位置');
                    }
                    break;
                // 如果是缩放
                case 'zoom':
                    that.params.strDistrict = that.params.strComArea = that.params.strKeyword = '';
                    // 如果是地铁模式位置文字不改变
                    if (!that.params.railwayName) {
                        strPosition0A.text('位置');
                    } else if (that.params.stationName && that.params.zoom < that.comareaZoom) {
                        // 如果是地铁站模式，缩放到商圈级别，显示地铁线
                        // 地铁站数据清除
                        that.params.stationName = that.params.railwayStation = '';
                        // 位置字样改成地铁线
                        strPosition0A.text(that.params.railwayName);
                    }
                    break;
                // 如果是区县
                case 'district':
                    if (info) {
                        // 设置区县参数
                        that.params.strDistrict = info.name;
                        that.pointX = info.coord_x;
                        that.pointY = info.coord_y;
                        that.params.zoom = that.comareaZoom;
                        strPosition0A.text(info.name);
                    } else {
                        // 选择区县中的不限
                        that.params.strDistrict = '';
                        that.pointX = vars.cityx;
                        that.pointY = vars.cityy;
                        that.params.zoom = that.districtZoom;
                        strPosition0A.text('位置');
                    }
                    // 地铁数据清除
                    that.params.railway = that.params.railwayStation = that.params.railwayName = that.params.stationName = that.params.strKeyword = '';
                    that.params.strComArea = '';
                    break;
                // 如果是商圈
                case 'comarea':
                    if (info.name) {
                        // 设置商圈参数
                        that.params.strComArea = info.name;
                        that.params.zoom = that.villageZoom;
                        strPosition0A.text(info.name);
                    } else {
                        // 选择区县-不限
                        that.params.strComArea = '';
                        that.params.zoom = that.comareaZoom;
                        strPosition0A.text(info.district);
                    }
                    // 设置区县参数
                    that.params.strDistrict = info.district;
                    that.params.districtId = info.districtId;
                    that.pointX = info.coord_x;
                    that.pointY = info.coord_y;
                    // 地铁数据清除
                    that.params.railway = that.params.railwayStation = that.params.railwayName = that.params.stationName = that.params.strKeyword = '';
                    break;
                // 如果是地铁
                case 'railway':
                    if (info) {
                        // 设置地铁参数
                        that.params.railwayName = info.name;
                        that.params.railway = info.railway;
                        that.pointX = vars.cityx;
                        that.pointY = vars.cityy;
                        that.params.zoom = that.districtZoom;
                        strPosition0A.text(info.name);
                    } else {
                        // 选择地铁中的不限
                        that.params.railwayName = '';
                        that.params.railway = '';
                        that.pointX = vars.cityx;
                        that.pointY = vars.cityy;
                        that.params.zoom = that.districtZoom;
                        strPosition0A.text('位置');
                    }
                    that.params.stationName = '';
                    that.params.railwayStation = '';
                    that.params.strDistrict = that.params.strComArea = that.params.strKeyword = '';
                    break;
                // 如果是地铁站
                case 'station':
                    if (info.name) {
                        // 设置地铁站参数
                        that.params.stationName = info.name;
                        that.params.railwayStation = info.railwayStation;
                        that.params.zoom = that.villageZoom;
                        that.pointX = info.coord_x;
                        that.pointY = info.coord_y;
                        strPosition0A.text(info.name);
                    } else {
                        // 选择地铁线-不限
                        that.params.stationName = '';
                        that.params.railwayStation = '';
                        that.params.zoom = that.districtZoom;
                        that.pointX = vars.cityx;
                        that.pointY = vars.cityy;
                        strPosition0A.text(info.railwayName);
                    }
                    // 设置区县参数
                    that.params.railwayName = info.railwayName;
                    that.params.railway = info.railway;
                    that.params.strDistrict = that.params.strComArea = that.params.strKeyword = '';
                    break;
                // 楼盘
                case 'loupan':
                    that.params.projcodes = info.projcode;
                    // 当前地图等级大于楼盘等级就不改变地图等级
                    that.params.zoom = that.params.zoom > that.villageZoom ? that.params.zoom : that.villageZoom;
                    break;
                // 价格
                case 'price':
                    that.params.strPrice = info.strPrice;
                    break;
                // 居室
                case 'room':
                    that.params.bedrooms = info.bedrooms;
                    break;
                // 更多选项中的重置
                case 'morereset':
                    that.params.area = that.params.tag = that.params.age = that.params.floor = that.params.equipment = that.params.buildclass = '';
                    break;
                // 更多选项确认
                case 'morechoose':
                    that.params.area = that.params.tagName = that.params.tag = that.params.age = that.params.floor = that.params.equipment = that.params.buildclass = that.params.towards = '';
                    // 循环获取更多里的筛选条件
                    for (var type in info) {
                        // for-in循环要用hasOwnProperty做个判断
                        if (info.hasOwnProperty(type)) {
                            that.params[type] = info[type];
                        }
                    }
                    break;
                // 门店
                case 'ecshop':
                    that.params.zoom = that.districtZoom;
                    strPosition0A.text('位置');

                    break;
                // 具体门店
                case 'ecshopid':
                    that.params.zoom = that.villageZoom;
                    that.pointX = info.coord_x;
                    that.pointY = info.coord_y;
                    that.params.ecshopid = info.id;
                    break;
                default:
                    break;
            }
            if (!that.firstLoad) {
                that.searchResult();
            }
        },

        // 缩放测试
        setZoom: function (x) {
            var that = this;
            var beforeZoom = parseInt(that.params.zoom);
            var mapzoom = '+' === x ? beforeZoom + 1 : beforeZoom - 1;
            that.map.setZoom(mapzoom);
        },

        // 隐藏门店列表
        hideEcShopList: function () {
            if ($ecshopObj.is(':visible')) {
                $ecshopObj.hide();
                // 修改原选中对象非选中状态
                var oldPoint = $('#allmap .cur');
                if (oldPoint.length > 0) {
                    oldPoint.removeClass('cur').css('z-index', '');
                }
            }
        },
    };

    SFMap.fn.init.prototype = SFMap.fn;
    return SFMap.fn;
});
