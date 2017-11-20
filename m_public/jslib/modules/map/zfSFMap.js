/**
 * 租房地图参数初始化，ajax搜索参数处理
 */
define('modules/map/zfSFMap', ['jquery', 'modules/map/API/zfMapApi', 'modules/map/mapPublic'], function (require) {
    'use strict';
    var $ = require('jquery');
    var MapApi = require('modules/map/API/zfMapApi');
    var MapPublic = require('modules/map/mapPublic');
    var vars = seajs.data.vars;
    var SFMap = [];
    // 加载中提示的对象
    var $load = $('#loadPrompt');
    // 搜索框对象
    var $searchObj = $('#new_searchtext');
    // 楼盘弹框对象
    var $houseObj = $('#house_detail');
    // 楼盘弹框头部对象
    var $houseHeaderObj = $('#house_count_wrap');
    // 楼盘弹框列表div的对象
    var $houseListObj = $('#house_detail_wrap');
    // 楼盘弹框列表ul的对象
    var $houseUlObj = $houseListObj.find('ul');
    // 搜索结果弹框对象
    var $searchResultObj = $('#searchResult');
    // 搜索弹框头部对象
    var $searchHeaderObj = $('.re-num');
    // 搜索弹框列表div的对象
    var $searchListObj = $('.r-listBox');
    // 搜索弹框列表ul的对象
    var $searchUlObj = $('.result-list');
    // 默认关键字数组
    var keywordArr = ['请输入小区、地名、开发商…', '请输入小区、地铁、开发商…', '请输入小区名、地铁或地名', '楼盘名/地名/开发商等'];
    // 统计行为
    // 记录大数据容器
    var guess = [];
    var guessPosition = {};
    require.async('jsub/_vb.js?c=mnhmap');
    require.async('jsub/_ubm.js', function () {
        _ub.city = vars.cityname;
        // 业务---WAP端
        _ub.biz = 'n';
        var ns = vars.ns === 'n' ? 0 : 1;
        _ub.location = ns;

        _ub.request('vmz.position,vmz.subway,vmz.rentprice,vmz.source,vmz.housetype', function () {
            // 每一个字段，都会返回一个权重最高的值
            _ub.load(2);
            // 使用_ub['编号']的形式来获取，如： _ub['vme.position']
            console.log(decodeURIComponent(_ub['vmz.position'] + _ub['vmz.subway'] + _ub['vmz.rentprice'] + _ub['vmz.source'] + _ub['vmz.housetype']));
            // 区域
            guessPosition.position = decodeURIComponent(_ub['vmz.position']);
            // 地铁
            guessPosition.subway = decodeURIComponent(_ub['vmz.subway']);
            // 均价
            guessPosition.rentprice = decodeURIComponent(_ub['vmz.rentprice']).replace('-', '^').replace('元', '');
            // 类型
            guessPosition.source = decodeURIComponent(_ub['vmz.source']);
            // 热门
            guessPosition.housetype = decodeURIComponent(_ub['vmz.housetype']);
            // 在下面添加推送逻辑代码
            if (guessPosition.position) {
                guess.push({position: guessPosition.position});
            }else if ( guessPosition.subway) {
                guess.push({subway: guessPosition.subway});
            }
            if (guessPosition.rentprice && guess.length < 2) {
                guess.push({strPrice: guessPosition.rentprice});
            }
            if (guessPosition.source && guess.length < 2) {
                if (guessPosition.source === '个人') {
                    guess.push({housetype: 1});
                }
                if (guessPosition.source === '精选' || guessPosition.source === '房天下精选') {
                    guess.push({housetype: 2});
                }
            }
            if (guessPosition.housetype && guess.length < 2) {
                var arrBadroom = ['一居','二居','三居','四居','五居','五局以上'];
                for (var i = 0, len = arrBadroom.length; i < len; i++) {
                    if (arrBadroom[i] === guessPosition.bedrooms) {
                        guess.push({bedrooms: i + 1});
                        break;
                    }
                }
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
            // 租金
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
            // 来源
            housetype: '',
            // 地图级别
            zoom: '11',
            // 整租合租
            rtype: '',
            // 特色
            tag: '',
            // 朝向
            towards: '',
            // 楼层
            floor: '',
            // 装修
            equipment: ''
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
        // 地图状态city/district/subwayline/subwaystation/location/zoom/drag
        mapstatus: 'city',
        // 地铁数据
        subwayConfig: null,
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
                MapPublic.locationMap('zf');
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

            // 租金
            if (vars.strPrice) {
                // 价格
                var strPrice = vars.strPrice;
                obj = $('#price_section dd[data-id="' + strPrice + '"]');
                if (obj.length === 0) {
                    // 自定义价格
                    obj = $('#price_section dd[data-id=custom]');
                    obj.text(strPrice.replace('^', '-'));
                }
                obj.trigger('touchend');
            }
            // 来源
            if (vars.housetype !== '') {
                obj = $('#housetype_section dd[data-id="' + vars.housetype + '"]');
                if (obj.length > 0) {
                    obj.trigger('touchend');
                }
            }
            // 居室
            if (vars.bedrooms) {
                $('#search_bedrooms a[data-id="' + vars.bedrooms + '"]').addClass('active');
            }
            // 整租合租
            if (vars.rtype) {
                $('#search_rtype a[data-id="' + vars.rtype + '"]').addClass('active');
            }
            // 特色
            if (vars.tag !== '') {
                $('#search_tag a[data-id="' + vars.tag + '"]').addClass('active');
            }
            // 朝向
            if (vars.towards !== '') {
                $('#search_towards a[data-id="' + vars.towards + '"]').addClass('active');
            }
            // 楼层
            if (vars.floor !== '') {
                $('#search_floor a[data-id="' + vars.floor + '"]').addClass('active');
            }
            // 装修
            if (vars.equipment) {
                $('#search_equipment a[data-id="' + vars.equipment + '"]').addClass('active');
            }
            // 更多的筛选条件数据获取
            $('#completeChoose').trigger('click');
            // 关键词,初始化关键字搜索要放在更多筛选点击后面
            // 判断关键字不在默认的数组中
            if ($.inArray(vars.strKeyword, keywordArr) === -1) {
                $searchObj.html('<i></i>' + vars.strKeyword);
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
                            priceParamContent.text('租金');
                            info = {strPrice: ''};
                        } else if ('custom' === id) {
                            // 通过滑动选择
                            priceArr = text.split('-');
                            if (text === '-') {
                                priceParamContent.text('租金');
                                // 滑块都为不限，价格传空跳出
                                info = {strPrice: ''};
                                break;
                            } else if (!priceArr[1]) {
                                text = priceArr[0] + '元以上';
                            } else if (!priceArr[0]) {
                                text = priceArr[1] + '元以下';
                            } else {
                                text = priceArr[0] + '-' + priceArr[1] + '元';
                            }
                            priceParamContent.text(text);
                            info = {strPrice: priceArr[0] + '^' + priceArr[1]};
                        } else {
                            priceParamContent.text(text);
                            info = {strPrice: id};
                        }
                        break;
                    case 'housetype':
                        var houseTypeParamContent = $('#housetype span');
                        // 选择不限
                        if ('all' === id) {
                            houseTypeParamContent.text('来源');
                            info = {housetype: ''};
                            vars.housetypeTempparamName = '';
                        } else {
                            houseTypeParamContent.text(text);
                            info = {housetype: id};
                            vars.housetypeTempparamName = text;
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
            //  添加关键词用户行为统计
            require.async('modules/zf/yhxw', function (yhxw) {
                yhxw({type: 1, pageId: 'mzfmap', curChannel: 'zfmap', params: that.params});
            });
            // 有楼盘id或关键字，搜索数量为20，否则为70
            if (that.params.projcodes || that.params.strKeyword) {
                that.params.pagesize = 20;
            } else {
                that.params.pagesize = 70;
            }
            // 如果是定位，显示定位标点，要放在setCenter前面，否则走了缩放mapstatus就清空了
            if (that.mapstatus === 'location') {
                that.map.drawMarkers([{coord_x: that.pointX, coord_y: that.pointY, type: 'location'}]);
            }
            // 如果是关键字，全城搜索
            if (that.mapstatus === 'keyword') {
                that.map.setCenter(vars.cityy, vars.cityx, that.districtZoom);
            } else if (that.mapstatus !== 'drag' && that.mapstatus !== 'zoom' && !(that.mapstatus === 'loupan' && that.params.page > 1)) {
                // 是点击楼盘加载更多搜索就不重新定位
                if (parseInt(that.pointY) && parseInt(that.pointX)) {
                    that.map.setCenter(that.pointY, that.pointX, that.params.zoom);
                }else {
                    that.map.setCenter();
                }

            }
            // 有些情况需要隐藏房源列表
            if (that.params.page === 1) {
                if ($houseObj.is(':visible')) {
                    $houseObj.hide();
                }
            }

            // 关键字为空,搜索框恢复默认
            if (that.params.strKeyword === '') {
                // keywordArr数组是从0开始，所以keywordNum数字减1
                $searchObj.html('<i></i>' + keywordArr[parseInt(vars.keywordNum) - 1]);
            }
            // that.params赋值给ajax参数
            var params = $.extend({}, that.params);
            // 四角坐标
            var searchBounds = that.map.gethdBounds();
            // ajax参数
            params = $.extend(params, searchBounds);
            params.c = 'map';
            params.a = 'ajaxZfMapSearch';
            params.city = vars.city;
            // ajax获取
            var onSuccess = function (result) {
                // 列表按钮地址
                $('.icon-list').attr('href', result.listurl);
                // 判断是不是关键字搜索
                var strKeyword = vars.strKeyword;
                // 如果返回的楼盘数为0 则猜你喜欢  不为0  直接显示
                if (!result.housecount && strKeyword) {
                    if (guess.length) {
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
                        $('header').show();
                        $('#tabSX').show();
                        MapPublic.showPrompt('未找到满足条件的房源');
                    }
                }else {
                    // 是地铁线就不显示提示
                    guessSuccess(result);
                }
            };
            var guessSuccess = function (result) {
                // 是地铁线就不显示提示
                if (!(params.railwayName !== '' && params.stationName === '')) {
                    if ('succ' === result.res) {
                        // 获取成功，获取结果总数；反之，结果总数为0
                        // 房源数量
                        that.housecount = result.housecount;
                        // 如果点击小区
                        if (params.projcodes || result.projinfo) {
                            // 如果是首页
                            if (params.page === 1) {
                                // 隐藏头部
                                $('header').hide();
                                $('#tabSX').hide();
                                // 搜索弹框收起
                                $searchResultObj.hide();
                                // 房源列表头部
                                if (result.projinfo) {
                                    $houseHeaderObj. html('<h2 id="projectList" data-id="' + result.projinfo.projcode + '"><span class="flor">'
                                        + result.housecount + '套房源</span>' + result.projinfo.projname + '</h2>');
                                } else {
                                    $houseHeaderObj. html('<h2><span class="flor"></span> <span class="flor">'
                                        + result.housecount + '套房源&nbsp;</span></h2>');
                                }
                                // 加载房源列表内容
                                $houseUlObj.html(result.list);

                                // 列表一页的高度
                                var h = 291;
                                if (that.housecount < 3) {
                                    // 97是一个li标签的高度
                                    h = that.housecount * 97;
                                }
                                // 弹框弹起
                                $houseObj.show();
                                // 设置列表高度
                                $houseListObj.height(h).scrollTop(0);
                                // 将小区标点移动到地图中心
                                if (result.projinfo) {
                                    // h是房源列表一页的高度，56是列表头部楼盘信息的高度，80是搜索框和筛选框的高度，移动距离是h+56-80=h-24的一半
                                    MapPublic.setProjCenter(new BMap.Point(result.projinfo.coord_x, result.projinfo.coord_y),
                                        (h - 24) / 2, that.params.zoom, that.map);
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
                                MapPublic.showPrompt('共找到' + result.housecount + '套房源');
                                // 如果是猜你喜欢时
                                if (params.guess) {
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
                                    $searchResultObj.show();
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
                                var listHead = params.guess? '没找到与 "' + defaultStr + '"相关房源，猜你想找：': '共找到 "' + params.strKeyword + '"相关' + projCount + '个结果';
                                $searchHeaderObj. html(listHead);
                                // 加载房源列表内容
                                $searchUlObj.html(result.list);

                                // 列表一页的高度 5行
                                var h = 225;
                                // 弹框弹起
                                $searchResultObj.show();
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
                        // 提示
                        MapPublic.showPrompt('未找到满足条件的房源');
                        // 第一次关键字搜索没搜到数据，重新定义地图等级到districtZoom
                        if (that.firstLoad && that.params.strKeyword) {
                            // 无搜索结果时显示头部
                            $('header').show();
                            $('#tabSX').show();
                            // 搜索弹框收起
                            $searchResultObj.hide();
                            that.params.zoom = that.districtZoom;
                        }
                    }
                }
            };
            var onFailure = function () {
                // 处理搜索中点击别的显示搜索字样问题
                if (!that.isSearching) {
                    MapPublic.showPrompt('未找到满足条件的房源');
                    if (that.params.projcodes && that.params.page > 1) {
                        $('.p-up').remove();
                    }
                }
            };
            var onComplete = function () {
                that.isSearching = false;
                that.firstLoad = false;
                // 如果有地铁线，就划线
                if (that.params.railwayName) {
                    MapPublic.showSubway('zf', that.params.railwayName, that.map);
                }
                $load.hide();
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

        // 分类别清空搜索条件mtype：搜索类型, info标点信息
        clearOtherOption: function (mtype, info) {
            var that = this;
            that.params.page = 1;
            that.mapstatus = mtype;
            // 清除楼盘id，重新搜索不在弹出楼盘
            that.params.projcodes = '';
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
                    that.params.railway = that.params.railwayStation = that.params.railwayName = that.params.stationName = '';
                    that.params.strComArea = that.params.strKeyword = '';
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
                // 租金
                case 'price':
                    that.params.strPrice = info.strPrice;
                    break;
                // 来源
                case 'housetype':
                    that.params.housetype = info.housetype;
                    break;
                // 更多选项中的重置
                case 'morereset':
                    that.params.bedrooms = that.params.rtype = that.params.tag = that.params.towards = that.params.floor = that.params.equipment = '';
                    break;
                // 更多选项确认
                case 'morechoose':
                    that.params.bedrooms = that.params.rtype = that.params.tag = that.params.towards = that.params.floor = that.params.equipment = '';
                    // 循环获取更多里的筛选条件
                    for (var type in info) {
                        // for-in循环要用hasOwnProperty做个判断
                        if (info.hasOwnProperty(type)) {
                            that.params[type] = info[type];
                        }
                    }
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
        }
    };

    SFMap.fn.init.prototype = SFMap.fn;
    return SFMap.fn;
});