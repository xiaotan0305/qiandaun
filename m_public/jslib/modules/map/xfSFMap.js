/**
 * 新房地图搜索主类
 * 20160427 lixiaoru修改
 */
define('modules/map/xfSFMap', ['jquery', 'modules/map/API/xfMapApi', 'modules/map/mapPublic'], function (require) {
    'use strict';
    var $ = require('jquery');
    var MapApi = require('modules/map/API/xfMapApi');
    var MapPublic = require('modules/map/mapPublic');
    var vars = seajs.data.vars;
    var mapzoom = 11;
    // 楼盘详情弹出菜单
    var houseDetail = $('#house_detail');
    var isloading = $('#isloading');
    var $mapBox = $('.mapBox');
    // 搜索结果弹框对象
    var $searchResultObj = $('#searchResult');
    // 搜索弹框头部对象
    var $searchHeaderObj = $('.re-num');
    // 搜索弹框列表div的对象
    var $searchListObj = $('.r-listBox');
    // 搜索弹框列表ul的对象
    var $searchUlObj = $('.result-list');
    // 默认关键字数组
    var keywordArr = ['请输入小区、地名、开发商…', '请输入小区、地铁、开发商…'];
    var SFMap = [];
    // 记录大数据容器
    var guess = [];
    var guessPosition = {};
    // 统计行为
    require.async('jsub/_vb.js?c=mnhmap');
    require.async('jsub/_ubm.js', function () {
        _ub.city = vars.cityname;
        // 业务---WAP端
        _ub.biz = 'n';
        var ns = vars.ns === 'n' ? 0 : 1;
        _ub.location = ns;

        _ub.request('vmn.position,vmn.subway,vmn.avgprice,vmn.belongschool,vmn.totalprice,vmn.unitprice,vmn.feature,vmn.genre', function () {
            // 每一个字段，都会返回一个权重最高的值
            _ub.load(2);
            // 使用_ub['编号']的形式来获取，如： _ub['vmn.position']
            console.log(decodeURIComponent(_ub['vmn.position'] + _ub['vmn.avgprice'] + _ub['vmn.subway'] + _ub['vmn.belongschool'] + _ub['vmn.unitprice'] + _ub['vmn.feature'] + _ub['vmn.genre']));
            // 区域
            guessPosition.position = decodeURIComponent(_ub['vmn.position']).split('^')[0];
            // 地铁
            guessPosition.subway = decodeURIComponent(_ub['vmn.subway']);
            // 学校
            guessPosition.school = decodeURIComponent(_ub['vmn.belongschool']);
            // 均价
            if (decodeURIComponent(_ub['vmn.avgprice']).split('-')[1] === 99999) {
                guessPosition.unitprice = decodeURIComponent(_ub['vmn.avgprice']).split('-')[0] + ',';
            } else {
                guessPosition.unitprice = decodeURIComponent(_ub['vmn.avgprice']).replace('-', ',');
            }
            // 类型
            switch (decodeURIComponent(_ub['vmn.genre'])) {
                case '住宅':
                    guessPosition.genre = 0;
                    break;
                case '写字楼':
                    guessPosition.genre = 1;
                    break;
                case '商铺':
                    guessPosition.genre = 2;
                    break;
                case '经济适用房':
                    guessPosition.genre = 3;
                    break;
                case '别墅':
                    guessPosition.genre = 4;
                    break;
            }
            // 热门
            switch (decodeURIComponent(_ub['vmn.feature'])) {
                case 'dazheyouhui':
                    guessPosition.character = 0;
                    break;
                case '小户型':
                    guessPosition.character = 3;
                    break;
                case '教育地产':
                    guessPosition.character = 5;
                    break;
                case '公园地产':
                    guessPosition.character = 6;
                    break;
                case '综合体':
                    guessPosition.character = 8;
                    break;

            }
            // 在下面添加推送逻辑代码
            if (guessPosition.position) {
                guess.push({ strDistrict: guessPosition.position });
            } else if (guessPosition.subway) {
                guess.push({ subway: guessPosition.subway });
            } else if (guessPosition.school) {
                guess.push({ school: guessPosition.school });
            }
            if (guessPosition.unitprice && guess.length < 2) {
                guess.push({ strPrice: guessPosition.unitprice });
            }
            if (guessPosition.genre && guess.length < 2) {
                guess.push({ strPurpose: guessPosition.genre });
            }
            if (guessPosition.character && guess.length < 2) {
                guess.push({ character: guessPosition.character });
            }

        });

    });
    SFMap.fn = SFMap.prototype = {
        map: null,
        params: {
            page: 1,
            pagesize: 20,
            // 区县
            strDistrict: '',
            // 关键字
            strKeyword: '',
            // 楼盘id
            newcode: '',
            // 学校id
            schoolid: '',
            // 学校类型
            schoolType: '',
            // 地铁线id
            subwayLine: '',
            // 地铁线名称
            railwayName: '',
            // 地铁站id
            subwayStation: '',
            // 地铁站名称
            stationName: '',
            // 价格
            strPrice: '',
            // 开盘
            saleDate: '',
            // 类型
            strPurpose: '',
            // 环线
            strRoundStation: '',
            // 装修
            fitment: '',
            // 地图级别
            zoom: 11,
            // 标记是否为学校模式
            schoolFlag: '',
            // 优惠参数
            red: '',
            zytype: ''
        },
        maima: {},
        // 地图状态city/district/subwayline/subwaystation/location/zoom/drag
        mapstatus: 'city',
        // 是否正在进行搜索
        isSearching: false,
        // 搜索的ajax变量
        ajaxFlag: 0,
        // 区县级别
        districtZoom: 11,
        // 楼盘级别
        villageZoom: 14,
        // 地铁线级别
        subwayZoom: 12,
        // 地图缩放级别界限
        flagZoom: 13,
        // 楼盘显示圆点或详细信息标记
        markerFlag: false,
        firstLoad: true,
        housecount: 0,
        // 存储二级筛选框状态,学区或者地铁线
        tempState: '',
        // 存储学区或者地铁线id
        tempId: '',
        // 需要移至中心的坐标
        pointX: vars.cityx,
        pointY: vars.cityy,
        // 保存初始关键字
        keywordStr: vars.strKeyword,
        // 初始化，在页面加载后根据列表或搜索页所传参数进行一次搜索，并且绑定地图事件
        init: function () {
            var that = this;
            // 城市默认地图等级
            that.params.zoom = vars.zoom;
            that.map = new MapApi('allmap', vars.cityy, vars.cityx, that.params.zoom);
            // 初始化参数
            that.initParams();
            that.searchResult();
        },
        // 初始化参数
        initParams: function () {
            var that = this;
            // 一级对象
            var obj = '';
            // 二级对象
            var cobj = '';
            // 下边的操作会改变that.mapstatus,记录真实值
            var mapstatus = 'city';
            // 优惠直销

            if (vars.red) {
                // 优惠按钮点击
                $('.yh-icon').trigger('click');
            }
            // 区县
            if (vars.districtId) {
                obj = $('#district_section a[data-id=' + vars.districtId + ']').parent();
                //obj.addClass('active');
                obj.trigger('click');
                mapstatus = 'district';
            }
            // 地铁
            if (vars.railwayId) {
                obj = $('#railway_section a[data-id=' + vars.railwayId + ']').parent();
                obj.addClass('active');
                cobj = $('dl[id=station_dl_' + vars.railwayId + ']');
                if (cobj.length) {
                    // 找地铁站
                    if (vars.railway_station) {
                        cobj.find('a[data-id=' + vars.stationId + ']').parent().trigger('click');
                    } else {
                        // 选择不限
                        cobj.find('a').first().parent().trigger('click');
                    }
                }
            }
            // 学区
            if (vars.schoolid) {
                cobj = $('#school_section a[data-id=' + vars.schoolid + ']');
                var type = cobj.attr('data-type');
                var a = $('#schoolType_section a[data-id=' + type + ']');
                a.parent().addClass('active');
                console.log(a.attr('data-id'));
                cobj.parent().trigger('click');
            }
            // 价格
            if (vars.pricemin || vars.pricemax) {
                var strPrice = (vars.pricemin || '0') + ',' + (vars.pricemax || '');
                obj = $('#price_contFlexbox dd[data-id="' + strPrice + '"]');
                if (obj.length === 0) {
                    // 自定义价格
                    obj = $('#price_contFlexbox dd[data-id=custom]');
                    obj.text(strPrice.replace(',', '-'));
                }
                obj.trigger('touchend');
            }
            // 户型
            if (vars.room) {
                var roomArr = vars.room.split(',');
                for (var i = 0, len = roomArr.length; i < len; i++) {
                    $('#searchRoom dd[data-id="' + roomArr[i] + '"]').trigger('touchend');
                }
            }
            // 热门
            if (vars.characterId) {
                obj = $('#character a[data-id=' + vars.characterId + ']');
                if (obj.length) {
                    obj.trigger('click');
                }
            }
            // 类型
            if (vars.purposeId) {
                obj = $('#strPurpose a[data-id="' + vars.purposeId + '"]');
                if (obj.length) {
                    obj.trigger('click');
                }
            }
            // 开盘
            if (vars.saleDateId) {
                obj = $('#saleDate a[data-id="' + vars.saleDateId + '"]');
                if (obj.length) {
                    obj.trigger('click');
                }
            }
            // 环线
            if (vars.roundStationId) {
                obj = $('#strRoundStation a[data-id="' + vars.roundStationId + '"]');
                if (obj.length) {
                    obj.trigger('click');
                }
            }
            // 装修
            if (vars.fitmentId) {
                obj = $('#fitment a[data-id="' + vars.fitmentId + '"]');
                if (obj.length) {
                    obj.trigger('click');
                }
            }
            // 销售状态
            if (vars.status) {
                var objarr = [];
                objarr = vars.status.split(',');
                if (objarr.length) {
                    for (var i = 0, len = objarr.length; i < len; i++) {
                        $('#status a[data-id="' + objarr[i] + '"]').trigger('click');
                    }
                }
            }
            // 面积
            if (vars.area) {
                var objarr = [];
                objarr = vars.area.split('-');
                if (objarr.length) {
                    for (var i = 0, len = objarr.length; i < len; i++) {
                        $('#area a[data-id="' + objarr[i] + '"]').trigger('click');
                    }
                }
            }
            // 户型
            if (vars.room) {
                var objarr = [];
                objarr = vars.room.split(',');
                if (objarr.length) {
                    for (var i = 0, len = objarr.length; i < len; i++) {
                        $('#room_contFlexbox dd[data-id="' + objarr[i] + '"]').trigger('click');
                    }
                }
            }

            // 更多的筛选条件数据获取
            $('#more_ensure').trigger('click');
            $('#room_ensure').trigger('click');
            // 判断关键字是否是默认的
            if ($.inArray(vars.strKeyword, keywordArr) === -1) {
                // 触发搜索
                that.clearOtherOption('keyword', { keyword: vars.strKeyword });
            }
            that.mapstatus = mapstatus;
        },
        // 选择条件时点击触发事件:  obj 点击对象  mtype 对象类型
        clickComplete: function (obj, mtype) {
            if (obj) {
                var id = obj.attr('data-id');
                var text = obj.text();
                var info = null;
                var maima = {};
                var strDistrict0A = null;
                switch (mtype) {
                    case 'district':
                        // 下拉框
                        strDistrict0A = $('#position span');
                        // 选择不限
                        // 选择不限
                        if ('all' === id) {
                            // 点击不限
                            strDistrict0A.text('位置');
                        } else {
                            // 进入区县
                            info = {
                                district: text
                            };
                            strDistrict0A.text(text);
                            maima['vmn.position'] = encodeURIComponent(text);
                        }
                        break;
                    case 'station':
                        // 下拉框
                        strDistrict0A = $('#position span');
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
                                strDistrict0A.text(lineObj.text());
                            } else {
                                // 进入地铁站模式
                                info = {
                                    name: text,
                                    coord_x: obj.attr('data-coord_x'),
                                    coord_y: obj.attr('data-coord_y'),
                                    railwayName: lineObj.text(),
                                    railway: lineId,
                                    railwayStation: obj.attr('data-id')
                                };
                                strDistrict0A.text(text);
                            }
                        }
                        break;
                    case 'school':
                        // 下拉框
                        strDistrict0A = $('#position span');
                        // 寻找所属地铁线
                        var type = obj.attr('data-type');
                        var typeObj = $('#schoolType_section a[data-id=' + type + ']');
                        if (typeObj) {
                            // 选择不限
                            if ('all' === id) {
                                // 进入学区类型模式
                                info = {
                                    schoolname: typeObj.text(),
                                    schoolType: type
                                };
                                strDistrict0A.text(typeObj.text());
                            } else {
                                // 进入学区模式
                                info = {
                                    address: obj.attr('data-address'),
                                    id: obj.attr('data-id'),
                                    coord_x: obj.attr('data-coord_x'),
                                    coord_y: obj.attr('data-coord_y'),
                                    nature: obj.attr('data-nature'),
                                    rank: obj.attr('data-rank'),
                                    schoolname: obj.attr('data-name'),
                                    schoolType: type,
                                    clickType: 0
                                };
                                strDistrict0A.text(text);
                            }
                        }
                        break;
                    case 'price':
                        var priceParamContent = $('#price span');
                        // 总价数组
                        var priceArr = null;
                        // 选择不限
                        if ('all' === id) {
                            priceParamContent.text('价格');
                            info = { strPrice: '' };
                            maima['vmn.avgprice'] = '';
                        } else if ('custom' === id) {
                            // 通过滑动选择
                            priceArr = text.split('-');
                            if (text === '-') {
                                text = '价格';
                            } else if (!priceArr[1]) {
                                text = priceArr[0] + '元以上';
                            } else if (!priceArr[0]) {
                                text = priceArr[1] + '元以下';
                            } else {
                                text = priceArr[0] + '-' + priceArr[1] + '元';
                            }
                            priceParamContent.text(text);
                            if (priceArr[0] || priceArr[1]) {
                                info = { strPrice: priceArr[0] + ',' + priceArr[1] };
                                if (priceArr[0] && priceArr[1]) {
                                    maima['vmn.avgprice'] = priceArr[0] + '-' + priceArr[1]
                                } else if (!priceArr[1]) {
                                    maima['vmn.avgprice'] = priceArr[0] + '-99999';
                                } else if (!priceArr[0]) {
                                    maima['vmn.avgprice'] = '0-' + priceArr[1];
                                }
                                
                            } else {
                                info = {strPrice: ''};
                                maima['vmn.avgprice'] = '';
                            }
                        } else {
                            priceParamContent.text(text);
                            info = {strPrice: id};
                            maima['vmn.avgprice'] = id.substring(id.length - 1) !== ',' ? id.replace(',', '-') : id.substring(0, id.length - 1) + '-99999';
                        }
                        break;
                    case 'room':
                        var characterOA = $('#huxing span');
                        // 选择不限
                        if ('all' === id) {
                            characterOA.text('户型');
                            info = { room: '' };
                            maima['vmn.housetype'] = '';
                        } else {
                            characterOA.text(text);
                            info = {room: id};
                            maima['vmn.housetype'] = encodeURIComponent(text);
                        }
                        break;
                    default:
                        break;
                }
                this.clearOtherOption(mtype, info, maima);
            }
        },
        // 分类别清空搜索条件mtype：搜索类型, info标点信息
        clearOtherOption: function (mtype, info, maima) {
            var that = this;
            that.params.page = 1;
            that.mapstatus = mtype;
            that.params.newcode = '';
            // 如果头部被隐藏，显示
            /*if (!houseDetail.is(':visible')) {
                $('header').show();
                $('#tabSX').show();
            }*/
            // 快筛文本
            var strPosition0A = $('#position span');
            // 区域显示字样
            var Ptext;
            switch (mtype) {
                // 如果是关键字
                case 'keyword':
                    that.params.strDistrict = that.params.strComArea = that.maima['vmn.position'] = '';
                    that.maima['vmn.subway'] = '';
                    // 地铁数据清除
                    that.params.subwayLine = that.params.subwayStation = that.params.railwayName = that.params.stationName = '';
                    that.params.zoom = that.villageZoom;
                    that.params.strKeyword = info.keyword;
                    that.params.schoolFlag = '';
                    strPosition0A.text('位置');
                    that.maima['vmn.key'] = encodeURIComponent(info.keyword);
                    break;
                // 定位
                case 'location':
                    that.params.strDistrict = that.maima['vmn.position'] = '';
                    that.params.strKeyword = that.maima['vmn.key'] = '';
                    that.maima['vmn.subway'] = '';
                    // 地铁数据清除
                    that.params.subwayLine = that.params.subwayStation = that.params.railwayName = that.params.stationName = '';
                    that.params.zoom = that.villageZoom;
                    that.pointX = info.coord_x;
                    that.pointY = info.coord_y;
                    that.params.schoolFlag = '';
                    strPosition0A.text('位置');
                    break;
                // 如果是移动
                case 'drag':
                    that.params.schoolid = '';
                    that.params.strDistrict = that.maima['vmn.position'] = '';
                    that.params.strKeyword = that.maima['vmn.key'] = '';
                    if (that.params.schoolType) {
                        Ptext = $('#schoolType_section').find('a data-id=[' + that.params.schoolType + ']').text();
                        strPosition0A.text(Ptext);
                    } else if (!that.params.subwayLine) {
                        strPosition0A.text('位置');
                    }
                    break;
                // 如果是缩放
                case 'zoom':
                    that.params.strDistrict = that.maima['vmn.position'] = '';
                    that.params.schoolid = '';
                    if (that.params.schoolType) {
                        Ptext = $('#schoolType_section').find('a data-id=[' + that.params.schoolType + ']').text();
                        strPosition0A.text(Ptext);
                    } else if (that.params.stationName && that.params.zoom < that.villageZoom) {
                        // 如果是地铁站模式，缩放到商圈级别，显示地铁线
                        // 地铁站数据清除
                        that.params.stationName = that.params.subwayStation = '';
                        // 位置字样改成地铁线
                        strPosition0A.text(that.params.railwayName);
                        that.maima['vmn.subway'] = encodeURIComponent(that.params.railwayName);
                    } else {
                        strPosition0A.text('位置');
                        that.maima['vmn.subway'] = '';
                    }
                    break;
                // 如果是区县
                case 'district':
                    if (info) {
                        // 设置区县参数
                        that.params.strDistrict = info.district;
                        that.params.zoom = that.villageZoom;
                        strPosition0A.text(info.name);
                        that.maima['vmn.position'] = maima['vmn.position'];
                    } else {
                        // 选择区县中的不限
                        that.params.strDistrict = '';
                        that.params.zoom = that.districtZoom;
                        that.pointX = vars.cityx;
                        that.pointY = vars.cityy;
                        that.mapstatus = 'city';
                        strPosition0A.text('位置');
                        that.maima['vmn.position'] = '';
                    }
                    // 清空关键字
                    that.params.strKeyword = that.maima['vmn.key'] = '';
                    // 地铁数据清除
                    that.params.subwayLine = that.params.subwayStation = that.params.railwayName = that.params.stationName = '';
                    that.maima['vmn.subway'] = '';
                    // 学校数据清除
                    that.params.schoolid = that.params.schoolType = '';
                    that.params.schoolFlag = '';
                    break;
                // 如果是地铁站
                case 'station':
                    that.maima['vmn.subway'] = encodeURIComponent(info.railwayName);
                    if (info.name) {
                        // 设置地铁站参数
                        that.params.stationName = info.name;
                        that.params.subwayStation = info.railwayStation;
                        that.params.zoom = that.villageZoom;
                        that.pointX = info.coord_x;
                        that.pointY = info.coord_y;
                        strPosition0A.text(info.name);
                        that.maima['vmn.subway'] += '^' + encodeURIComponent(info.name);
                    } else {
                        // 选择地铁线-不限
                        that.params.stationName = '';
                        that.params.subwayStation = '';
                        that.params.zoom = that.subwayZoom;
                        that.pointX = vars.cityx;
                        that.pointY = vars.cityy;
                        strPosition0A.text(info.railwayName);
                    }
                    // 清空关键字
                    that.params.strKeyword = that.maima['vmn.key'] = '';
                    // 设置区县参数
                    that.params.railwayName = info.railwayName;
                    that.params.subwayLine = info.railway;
                    that.params.strDistrict = that.params.strComArea = '';
                    that.params.schoolid = that.params.schoolType = '';
                    that.params.schoolFlag = '';
                    that.maima['vmn.position'] = '';
                    break;
                // 学区类型
                case 'schoolType':
                    that.pointX = vars.cityx;
                    that.pointY = vars.cityy;
                    that.params.zoom = that.districtZoom;
                    // 清空关键字
                    that.params.strKeyword = '';
                    // 设置区县参数
                    that.params.strDistrict = that.params.schoolid = that.params.schoolType = that.params.red = '';
                    that.params.schoolFlag = 1;
                    that.params.railwayName = that.params.subwayLine = that.params.subwayStation = that.params.stationName = '';
                    strPosition0A.text('位置');
                    break;
                // 学校
                case 'school':
                    if (info.id) {
                        // 设置学校参数
                        that.params.schoolid = info.id;
                        that.params.schoolClick = info.clickType;
                        that.schoolDetail = info;
                        that.pointX = info.coord_x;
                        that.pointY = info.coord_y;
                        strPosition0A.text(info.schoolname);
                    } else {
                        that.params.schoolid = '';
                        strPosition0A.text(info.school_type);
                    }
                    // 清空关键字
                    that.params.strKeyword = '';
                    // 当前地图等级大于楼盘等级就不改变地图等级
                    that.params.zoom = that.params.zoom > that.villageZoom ? that.params.zoom : that.villageZoom;
                    that.params.schoolType = info.schoolType;
                    that.params.schoolFlag = 1;
                    that.params.strDistrict = '';
                    that.params.railwayName = that.params.subwayLine = that.params.subwayStation = that.params.stationName = '';
                    break;
                // 楼盘
                case 'loupan':
                    that.params.newcode = info.newCode;
                    // 当前地图等级大于楼盘等级就不改变地图等级
                    that.params.zoom = that.params.zoom > that.villageZoom ? that.params.zoom : that.villageZoom;
                    break;
                // 价格
                case 'price':
                    that.params.strPrice = info.strPrice;
                    that.maima['vmn.avgprice'] = maima['vmn.avgprice'];
                    break;
                // 户型
                case 'room':
                    that.params.room = info.room;
                    that.maima['vmn.housetype'] = maima['vmn.housetype'];
                    break;
                // 户型重置
                case 'roomreset':
                    that.params.room = '';
                    break;
                // 更多选项中的重置
                case 'morereset':
                    that.params.strPurpose = that.params.saleDate = that.params.strRoundStation = that.params.fitment = that.params.character = that.params.area = that.params.status = '';
                    that.maima['vmn.genre'] = that.maima['vmn.opentime'] = that.maima['vmn.loopline'] = that.maima['vmn.fixstatus'] = that.maima['vmn.feature'] =
                    that.maima['vmn.area'] = that.maima['vmn.salestatus'] = '';
                    break;
                // 更多选项确认
                case 'morechoose':
                    that.params.strPurpose = that.params.saleDate = that.params.strRoundStation = that.params.fitment = that.params.character = that.params.area = that.params.status = '';
                    that.maima['vmn.genre'] = that.maima['vmn.opentime'] = that.maima['vmn.loopline'] = that.maima['vmn.fixstatus'] = that.maima['vmn.feature'] =
                    that.maima['vmn.area'] = that.maima['vmn.salestatus'] = '';
                    for (var type in info) {
                        // for-in循环要用hasOwnProperty做个判断
                        if (info.hasOwnProperty(type)) {
                            that.params[type] = info[type];
                        }
                    }
                    for (var maimaType in maima) {
                        // for-in循环要用hasOwnProperty做个判断
                        if (maima.hasOwnProperty(maimaType)) {
                            that.maima[maimaType] = maima[maimaType];
                        }
                    }
                    break;
                // 优惠
                case 'red':
                    // 搜索参数赋值
                    that.params.red = info;
                    that.params.zytype = info ? 'zyMap' : '';
                    break;
                default:
                    break;
            }
            if (!that.firstLoad) {
                that.searchResult();
            }
        },
        // 隐藏房源列表或学区信息
        hideHouseList: function () {
            var houseList = $('.map-out').filter(':visible');
            if (houseList.length) {
                var that = this;
                // 底部楼盘或学校信息隐藏
                houseList.hide();
                // 楼盘模式下
                if (that.params.newcode) {
                    // 修改对象为选中状态，原选中对象非选中状态
                    var oldPoint = $('div[data-newcode][class*=active]');
                    if (oldPoint.length) {
                        oldPoint.removeClass('active').addClass('visited').css('z-index', '');
                    }
                    // 显示头部
                    $('header').show();
                    $('#tabSX').show();
                    that.params.newcode = '';
                }
                // 学区模式下
                if (that.params.schoolid) {
                    $mapBox.find('div.map-school').removeClass('active');
                    $mapBox.find('div[data-newcode]').remove();
                }
                // 有关键词
                if (that.params.strKeyword) {
                    // 显示头部
                    $('header').show();
                    $('#tabSX').show();
                }
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
            isloading.show();
            // 如果不是点击楼盘，清除标点
            if (that.mapstatus !== 'loupan' && !that.params.schoolClick) {
                that.map.clearOverlays();
            }
            that.isSearching = true;
            if (that.mapstatus === 'location') {
                that.map.drawMarkers([{ coord_x: that.pointX, coord_y: that.pointY, type: 'location' }]);
            }
            if (that.mapstatus === 'city' || that.mapstatus === 'schoolType' || that.mapstatus === 'school'
                || that.mapstatus === 'station' || that.mapstatus === 'loupan' || that.mapstatus === 'location') {
                that.map.setCenter(that.pointY, that.pointX, that.params.zoom);
            }
            // ajax参数
            var params = $.extend({}, that.params);
            params.c = 'map';
            params.a = 'ajaxXfMapSearch';
            params.city = vars.city;
            var searchBounds = that.map.gethdBounds();
            // 区县模式或者有关键字时不传四角坐标;学区模式下学校选择不限时不传
            if (that.mapstatus !== 'district' && params.strKeyword === '') {
                if (!(that.mapstatus === 'school' && params.schoolType && params.schoolid === '')) {
                    params = $.extend(params, searchBounds);
                }
            }
            // ajax获取
            var onSuccess = function (result) {
                // 列表按钮地址
                $('.icon-list').attr('href', result.listUrl);
                // 判断是不是关键字搜索
                var strKeyword = vars.strKeyword;
                // 如果返回的楼盘数为0 则猜你喜欢  不为0  直接显示
                if (strKeyword === '请输入小区、地铁、开发商…') {
                    strKeyword = '';
                }
                if (result.loupanNum === '0' && strKeyword) {
                    if (guess.length) {
                        params.guess = true;
                        params.strKeyword = '';
                        for (var i = 0, len = guess.length; i < len; i++) {
                            for (var key in guess[i]) {
                                if (key === 'subway') {
                                    params.railwayName = guess[i][key].split('^')[0];
                                    params.stationName = guess[i][key].split('^')[1];
                                } else {
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
                    } else {
                        that.map.setCenter(that.pointY, that.pointX, 12);
                        MapPublic.showPrompt('未找到满足条件的房源');
                    }
                } else {
                    guessSuccess(result);
                }

            };
            var guessSuccess = function (result) {
                // 是地铁线就不显示提示
                if (!(params.railwayName !== '' && params.stationName === '')) {
                    that.housecount = result.total;
                    // 把对数据的处理放到这里来
                    if ((params.newcode && that.mapstatus === 'loupan') || result.list) {
                        // 点击楼盘
                        // 隐藏头部
                        $('header').hide();
                        $('#tabSX').hide();
                        // 搜索弹框收起
                        $searchResultObj.hide();
                        // 列表一页的高度
                        var h = 291;
                        if (that.housecount < 3) {
                            // 90是一个li标签的高度
                            h = that.housecount * 97;
                        }
                        // h是房源列表一页的高度，76是列表头部楼盘信息的高度，80是搜索框和筛选框的高度，移动距离是h+76-80=h-4的一半
                        var long = (h - 4) / 2;
                        houseDetail.html(result.list).show();
                        // 设置列表高度
                        $('#house_detail_wrap').height(h).scrollTop(0);
                        // 如果不绘制标点 择根据列表高度重新定义地图中心点
                        if (!result.houseInfo) {
                            // h是房源列表一页的高度，76是列表头部楼盘信息的高度，80是搜索框和筛选框的高度，移动距离是h+76-80=h-4的一半
                            MapPublic.setProjCenter(new BMap.Point(that.loupanInfo.coord_x, that.loupanInfo.coord_y),
                                long, that.params.zoom, that.map);
                        }
                        that.addListEvent();
                        // 图片惰性加载
                        require.async('lazyload/1.9.1/lazyload', function () {
                            // container是显示的图片区域的对象
                            $('img[data-original]').lazyload({ container: '#house_detail_wrap' });
                        });
                        if (typeof result.houseInfo === 'undefined') {
                            $('header').hide();
                            $('#tabSX').hide();
                            return;
                        }
                    }
                    if (params.schoolid && that.mapstatus === 'school') {
                        // 底部显示选中学校详细信息
                        var str = '<div class="top-list"><a href="//m.fang.com/xf.d?m=xflist&city=' + vars.city
                            + '&xq=' + that.schoolDetail.id + '"><div class="top-list-t"><div class="map-stag flor">';
                        if (that.schoolDetail.rank && that.schoolDetail.nature) {
                            str += '<span>' + that.schoolDetail.rank + '</span><span>' + that.schoolDetail.nature + '</span>';
                        }
                        str += '</div><h2>' + that.schoolDetail.schoolname + '</h2></div><p>' + that.schoolDetail.address + '</p></a></div></div>';
                        houseDetail.empty().append(str).show();
                    }
                    if (result.loupanNum > 0 || result.schoolNum > 0) {
                        var metaMarkers = [];
                        var info;
                        for (var value in result.houseInfo) {
                            if (result.houseInfo.hasOwnProperty(value)) {
                                info = result.houseInfo[value];
                                metaMarkers.push(info);
                            }
                        }
                        // 点击区县，或者有关键字时定位到第一个楼盘;学区模式下学校选择不限定位到第一个学校
                        if (params.strKeyword !== '' || that.mapstatus === 'district'
                            || (that.mapstatus === 'school' && params.schoolType && params.schoolid === '')) {
                            if (metaMarkers.length) {
                                that.map.setCenter(metaMarkers[0].coord_y, metaMarkers[0].coord_x, params.zoom);
                            }
                        }
                        if (that.params.schoolid) {
                            $mapBox.find('div[data-newcode]').remove();
                        }
                        // 判断楼盘标点为圆点或详细信息，当地图级别大于界限值时或搜索学校楼盘时显示详细信息
                        if (that.params.zoom > that.flagZoom || that.params.schoolid) {
                            that.markerFlag = true;
                        }
                        var keywordflag = vars.strKeyword ? vars.strKeyword : params.strKeyword;
                        if (keywordflag === '请输入小区、地铁、开发商…') {
                            keywordflag = '';
                        }
                        if (keywordflag !== '' && result.searchList) {
                            // 如果是关键词搜索，将第一个楼盘作为地图中心
                            that.pointX = result.houseInfo[0].coord_x;
                            that.pointY = result.houseInfo[0].coord_y;
                            that.map.setCenter(that.pointY, that.pointX, that.villageZoom);
                            // 楼盘/小区数量
                            var projCount = result.houseInfo.length;
                            // 房源列表头部
                            var defaultStr = vars.strKeyword !== '请输入小区名、地铁或地名' ? vars.strKeyword : '';
                            var listHead = params.guess ? '没找到与 "' + defaultStr + '"相关房源，猜你想找：' : '共找到 "' + params.strKeyword + '"相关' + projCount + '个结果';
                            $searchHeaderObj.html(listHead);
                            // 加载房源列表内容
                            $searchUlObj.html(result.searchList);

                            // 列表一页的高度 5行
                            var h = 225;
                            // h是房源列表一页的高度，80是搜索框和筛选框的高度，移动距离是h-80的一半
                            var long = (h - 80) / 2;
                            // 弹框弹起
                            $searchResultObj.show();
                            // 隐藏头部
                            $('header').hide();
                            $('#tabSX').hide();
                            // 设置列表高度
                            $searchListObj.height(h).scrollTop(0);
                            $('.result-list li').on('click', function () {
                                var id = $(this).attr('data-id');
                                $('div[data-newcode=' + id + ']').trigger('touchstart').trigger('touchend');
                            });
                        }
                        that.map.drawMarkers(metaMarkers, that.markerFlag);
                        if (long) {
                            // 绘制地图后的操作
                            that.loupanInfo = result.houseInfo[0];
                            MapPublic.setProjCenter(new BMap.Point(that.loupanInfo.coord_x, that.loupanInfo.coord_y),
                                long, that.params.zoom, that.map);
                            // 只有一个搜索结果时，直接选中该结果
                            if (typeof result.houseInfo[0] !== 'undefined' && typeof result.houseInfo[1] === 'undefined') {
                                $('div[data-newcode=' + result.houseInfo[0].newCode + ']').trigger('touchstart').trigger('touchend');
                            }
                            //next.info = result.houseInfo[0];
                            //next.obj = $('div[data-newcode='+ result.houseInfo[0].newCode + ']');
                            // MapApi.prototype.clickMarker(result.houseInfo[0], obj);
                        }
                        if (params.schoolFlag && !params.schoolid) {
                            if (result.schoolNum > 0) {
                                that.showPrompt('共为您找到' + result.schoolNum + '个学校');
                            } else {
                                that.showPrompt('未找到满足条件的学校');
                            }
                        } else if (result.loupanNum > 0) {
                            that.showPrompt('共为您找到' + result.loupanNum + '个楼盘');
                        } else {
                            that.showPrompt('未找到满足条件的楼盘');
                        }
                    } else if (that.mapstatus === 'drag' && params.schoolFlag) {
                        // 学校模式，移动地图没有数据
                        that.showPrompt('未找到满足条件的学校');
                    } else {
                        that.showPrompt('未找到满足条件的楼盘');
                    }
                }
            };
            var onFailure = function () {
                // 处理搜索中点击别的显示搜索字样问题
                if (!that.isSearching) {
                    that.showPrompt('未找到满足条件的楼盘');
                    if (that.params.zoom >= that.villageZoom) {
                        houseDetail.hide();
                        if (that.params.page > 1) {
                            $('#house_detail_wrap').find('p.p-up').remove();
                        }
                    }
                }
            };
            var onComplete = function () {
                /*if ($searchResultObj.is(':hidden') && that.params.strKeyword) {
                    // 无搜索结果时显示头部
                    $('header').show();
                    $('#tabSX').show();
                }*/
                that.firstLoad = false;
                that.isSearching = false;
                that.markerFlag = false;
                that.params.schoolClick = 0;
                // 有地铁站
                if (that.params.subwayStation || that.params.subwayLine) {
                    MapPublic.showSubway('xf', that.params.railwayName, that.map);
                }
                that.tempState = that.tempId = '';
                isloading.hide();
                // 用户行为统计
                yhxw(that.maima);
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
        // 缩放
        setZoom: function (x) {
            var that = this, beforeZoom = parseInt(that.params.zoom);
            mapzoom = '+' === x ? beforeZoom + 1 : beforeZoom - 1;
            that.map.setZoom(mapzoom);
        },
        // 显示提示
        showPrompt: function (msg) {
            isloading.hide();
            MapPublic.showPrompt(msg);
        },
        addListEvent: function () {
            // 房源列表下拉加载，上拉刷新，选中
            $('#house_detail_wrap').on('scroll', function (e) {
                e.preventDefault();
                var ele = $(this);
                var scrollh = ele.height();
                var totalHeight = ele.find('ul').height();
                if (ele.scrollTop() >= totalHeight - scrollh) {
                    MapPublic.loadMore('xf');
                }
            });
        }
    };

    function yhxw(maima) {
        // 用户行为(格式：'字段编号':'值')
        var p = {
            'vmg.page': 'mnhmap'
        };
        // 若pTemp中属性为空或者无效，则不传入p中
        for (var temp in maima) {
            if (maima.hasOwnProperty(temp)) {
                if (maima[temp].length > 0) {
                    p[temp] = maima[temp];
                }
            }
        }
        // 收集方法
        _ub.collect(1, p);
    }

    SFMap.fn.init.prototype = SFMap.fn;
    return SFMap.fn;
});
