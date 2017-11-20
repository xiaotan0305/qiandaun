/**
 * 周边地图页
 * 20160427 xiejingchao修改
 */
define('modules/map/searchmap', ['jquery', 'modules/map/API/BMap', 'modules/map/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery'),
            vars = seajs.data.vars,
        // 不同筛选的类名与中文对应关系
            searchArr = {bus: '公交', subway: '地铁', school: '学校', hospital: '医院', bank: '银行', shop: '购物', house: '楼盘', xianwu:'嫌恶'},
        // 不同icon对应图片编号
            iconArr = {bus: '1', subway: '2', school: '3', hospital: '4', bank: '5', shop: '6', house: '7', xianwu: '8'},
        // 汇集一个类型的icon标点
            searchArrMarker = [],
            openedTip = [],
        // 记录周边筛选状态
            showAround = [];
        showAround.bus = 0;
        var mapOptions = {
            minZoom: 10,
            maxZoom: 19
        };
        var searchNow = vars.searchNow,
        // 页面头部高度 单位px
            top = 44,
        // 创建地图实例
            map = new BMap.Map('container', mapOptions);
        // 楼盘坐标
        var gpsPoint,
        // 详细信息框
            maptip;
        // 嫌恶设施 20170704by zhaotianliang
        var xianwuBuild = [];
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/map/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mnhpagearoundmap';
        // 埋码变量数组
        var ubParams = {
            'vmg.page': pageId,
            'vmn.projectid': vars.projectid,
            'vmn.aroundfacility': ''
        };
        // 位置浮层标点
        var locationtip = null;
        // 添加用户行为分析-埋码
        yhxw({type: 0, pageId: pageId, params: ubParams});

        function init(zoom) {
            // 地图容器高度 = 总高度 - 页面头部高度
            $('#container').css('height', window.innerHeight - top);
            map = new BMap.Map('container', {enableMapClick: false,minZoom: 10, maxZoom: 19});
            if (vars.corX && vars.corY) {
                // 创建点坐标
                gpsPoint = new BMap.Point(vars.corX, vars.corY);
                var mainIcon = new BMap.Icon(vars.public + '201511/images/map_picon.png', new BMap.Size(52, 68), {
                    imageSize: new BMap.Size(26, 34),
                    anchor: new BMap.Size(20, 34)
                });
                var marker = new BMap.Marker(gpsPoint, {icon: mainIcon});
                map.addOverlay(marker);

                // 这里添加位置浮层
                if (vars.projname && vars.address) {
                    var location = [];
                    location.projname = vars.projname;
                    location.address = vars.address;
                    locationtip = new customOverlay(gpsPoint, 0, templateFetch($('#location').val(), location), 'location');
                    map.addOverlay(locationtip);
                    // 处理点透问题
                    $(locationtip._div.parentElement).css('z-index', 9999);

                    /*locationtip.addEventListener('click', function () {
                        console.log(1);
                    });*/
                    $(locationtip.text).find('#navigation').on('click', function(event) {
                        event.preventDefault();
                        console.log(1);
                    });

                    // 点击空白处所有悬浮消失
                    /*map.addEventListener('click', function (e) {
                        if (e.srcElement) {

                        }
                        if (!e.overlay) {
                            closeTip();
                            locationtip.hide();
                        } else if ((e.overlay.getIcon()).imageUrl.indexOf('map_picon.png') > -1) {
                            closeTip();
                        } else {
                            locationtip.hide();
                        }
                    });*/
                    $('#container').on('touchend', function (e) {
                        var detailUrl = '';
                        if (e.target.parentElement.id === 'navigation') {
                            if (vars.userLat && vars.userLng) {
                                // 点击去这里
                                detailUrl = 'http://api.map.baidu.com/direction'
                                    + '?origin=' + vars.userLat + ',' + vars.userLng
                                    + '&destination=' + vars.corY + ',' + vars.corX
                                    + '&mode=driving&region=' + vars.cityname + '&output=html&src=yourCompanyName';
                                window.location.href = detailUrl;
                            } else {
                                var geo = new BMap.Geolocation();
                                geo.getCurrentPosition(function (r) {
                                    if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                                        // 点击去这里
                                        detailUrl = 'http://api.map.baidu.com/direction'
                                            + '?origin=' + r.point.lat + ',' + r.point.lng
                                            + '&destination=' + vars.corY + ',' + vars.corX
                                            + '&mode=driving&region=' + vars.cityname + '&output=html&src=yourCompanyName';
                                        window.location.href = detailUrl;
                                        /*window.open(detailUrl);*/
                                    }
                                }, {enableHighAccuracy: true});
                            }
                        }else if (e.target.className === 'BMap_Marker BMap_noprint') {
                            return;
                        }else {
                            closeTip();
                            locationtip.hide();
                        }
                        
                    });
                    locationtip.addEventListener('touchend', function () {
                        console.log(1);
                    });
                    marker.addEventListener('click', function () {
                        locationtip.show();
                        closeTip();
                    });
                }
            } else {
                // 没有返回坐标则默认使用城市中心点
                gpsPoint = new BMap.Point(vars.cityx, vars.cityy);
            }
            // 初始化地图，设置中心点坐标和地图缩放级别
            map.centerAndZoom(gpsPoint, zoom);
            // 如果是周边配套则页面初始化需要定义公交
            function showXianwu () {
                if (vars.disgust) {
                    $('#wapxfzb_B01_11').trigger('click');
                } else if (searchNow) {
                    onClient('bus');
                    showAround.bus = 1;
                }
                map.removeEventListener('tilesloaded', showXianwu);
            }
            map.addEventListener('tilesloaded', showXianwu);
        }

        // 自定义覆盖物 对象
        function customOverlay(info, index, text, type) {
            this.point = new BMap.Point(info.lng, info.lat);
            this.index = index;
            this.text = text;
            this.type = type;
        }

        // 自定义覆盖物 html结构
        customOverlay.prototype = new BMap.Overlay();
        customOverlay.prototype.initialize = function (map) {
            this._map = map;
            this._div = document.createElement('div');
            var div = $(this._div),
                id = this.type ? 'locationtip' : 'maptip';

            // 矩形楼盘简介框
            div.css('position', 'absolute').attr({
                id: id,
                class: 'newqipao'
            }).attr('data-id', this.index).append(this.text);

            map.getPanes().labelPane.appendChild(this._div);
            return this._div;
        };
        // 绘制自定义覆盖物 页面样式
        customOverlay.prototype.draw = function () {
            var pixel = this._map.pointToOverlayPixel(this.point);
            var defaultLeft = pixel.x + 8 + 'px', defaultTop = pixel.y + 'px';
            if (this.type === 'location') {
                defaultLeft = (pixel.x - 20) + 'px';
                defaultTop = (pixel.y - 33) + 'px';
            }
            this._div.style.left = defaultLeft;
            this._div.style.top = defaultTop;
        };

        // 初始化地图完成
        init(15);

        // 这里调用一个查询百度API的过程 type类型 count容量
        function searchNear(type, count) {
            var searchName = searchArr[type];
            cleanTypeMarker(type);
            var onLocalSearch = function (resData) {
                var button = $('a[data-id="' + type + '"]');
                // 判断状态是否正确
                if (localSearch.getStatus() === BMAP_STATUS_SUCCESS) {
                    var result;
                    var resultArr = [];
                    // 处理百度返回信息
                    for (var i = 0; i < resData.getCurrentNumPois(); i++) {
                        var info = resData.getPoi(i);
                        // 过滤地铁中的地铁口
                        info.address = info.address ? info.address : '';
                        if ('subway' === type && info.address.indexOf('线') < 0) {
                            continue;
                        }
                        // 计算距离
                        resultArr.push(info);
                    }
                    resData._pois = resultArr;
                    var l = resData._pois.length;
                    if (l > 0) {
                        for (var j = 0; j < l && j < count; j++) {
                            result = resData.getPoi(j);
                            var marker = addMarker(result, type);
                            searchArrMarker[type].push(marker);
                        }
                        button.addClass('active');
                        showAround[type] = 1;
                        // 新房详情中地图添加布码2016.05.11
                        ubParams['vmn.aroundfacility'] = encodeURIComponent(searchArr[type]);
                        yhxw({type: 124, pageId: pageId, params: ubParams});
                    } else {
                        showPrompt('当前区域暂无' + searchName + '信息');
                        button.removeClass('active');
                    }
                } else {
                    showPrompt('当前区域暂无' + searchName + '信息');
                    button.removeClass('active');
                }
            };
            if (type === 'xianwu') {
                $.ajax({
                    url: vars.protocol + vars.mapSite + '?c=map&a=getDisgust',
                    type: 'GET',
                    data: {
                        city: vars.city,
                        xqid: vars.projectid
                    },
                }).done(function(resData) {
                    var button = $('a[data-id="' + type + '"]');
                    if (resData && resData.category.length) {
                        for (var i = 0, len = resData.category.length; i < len; i++) {
                            var info = resData.category[i];
                            for (var j = 0, infoLen = info.item.length; j < infoLen; j++) {
                                xianwuBuild.push(info.item[j]);
                            }
                        }
                        var result;
                        var resultArr = [];
                        // 处理百度返回信息
                        for (var i = 0; i < xianwuBuild.length; i++) {
                            var info = xianwuBuild[i];
                            // 过滤地铁中的地铁口
                            info.address = info.address ? info.address : '';
                            if ('subway' === type && info.address.indexOf('线') < 0) {
                                continue;
                            }
                            // 计算距离
                            resultArr.push(info);
                        }
                        resData._pois = resultArr;
                        var l = resData._pois.length;
                        if (l > 0) {
                            for (var j = 0; j < l && j < count; j++) {
                                result = resData._pois[j];
                                var marker = addMarker(result, type);
                                searchArrMarker[type].push(marker);
                            }
                            button.addClass('active');
                            showAround[type] = 1;
                            // 新房详情中地图添加布码2016.05.11
                            ubParams['vmn.aroundfacility'] = encodeURIComponent(searchArr[type]);
                            yhxw({type: 124, pageId: pageId, params: ubParams});
                        }
                    }else {
                        showPrompt('当前区域暂无' + searchName + '信息');
                        button.removeClass('active');
                    }
                    
                });
            }else {
                // 这里调用查询localsearch是一个异步过程，需要调用一次回调函数
                // http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalSearch
                var localSearch = new BMap.LocalSearch(map, {pageCapacity: count, onSearchComplete: onLocalSearch});
                // 根据检索词和范围发起范围检索
                localSearch.searchInBounds(searchName, map.getBounds());
            }
                
        }

        // 这里实现对整个search的重写
        function cleanTypeMarker(type) {
            if (undefined === searchArrMarker[type]) {
                searchArrMarker[type] = [];
                return;
            }
            for (var i = 0, l = searchArrMarker[type].length; i < l; i++) {
                map.removeOverlay(searchArrMarker[type][i]);
            }
            searchArrMarker[type] = [];
            $('a[data-id="' + type + '"]').removeClass('active');
            closeTip();
            showAround[type] = 0;
        }

        // 标点icon的图片
        function getTypeImg(type) {
            var i = iconArr[type];
            return {
                url: vars.imgUrl + 'xf/images/' + i + '.png',
                size: new BMap.Size(24, 36),
                imageSize: new BMap.Size(24, 36),
                anchor: new BMap.Size(8, 12)
            };
        }

        // 添加标点 info百度api返回结果
        function addMarker(info, type) {
            var markerInfo = getTypeImg(type);
            var myIcon = new BMap.Icon(markerInfo.url, markerInfo.size, {
                imageSize: markerInfo.imageSize,
                anchor: markerInfo.anchor
            });
            if (type === 'xianwu') {
                var marker = new BMap.Marker(new BMap.Point(info.coord_x, info.coord_y), {icon: myIcon});
            }else {
                var marker = new BMap.Marker(new BMap.Point(info.point.lng, info.point.lat), {icon: myIcon});
            }
            map.addOverlay(marker);
            marker.provalue = info;
            openedTip[info.uid] = openTip(marker);
            return marker;
        }

        var isClick;
        // 替换模板中{}包含的内容
        function templateFetch(str, obj) {
            if (obj.coord_x && obj.coord_y) {
                var address = obj.address? obj.address: '';
                var retval = '<div class="bor"><h5><strong>' + obj.name + '</strong></h5><p>' + address + '</p><p>距该小区直线距离' + obj.distance + obj.distanceUnit + '</p></div>';
            } else{
                var retval = str;
                for (var i in obj) {
                    if (obj[i] === 'null') {
                        obj[i] = ' ';
                    }
                    // for-in循环需要 hasOwnProperty判断
                    if (obj.hasOwnProperty(i)) {
                        var re = new RegExp('\\{' + i + '\\}', 'g');
                        retval = retval.replace(re, obj[i]);
                    }
                }
            }
            return retval;
        }

        // 显示信息框
        function openTip(marker) {
            var opentheTip = function () {
                locationtip.hide();
                // 这里加详情节点
                var info = marker.provalue;
                if (info.distanceR) {
                    info.distance = info.distanceR;
                }else {
                    info.distanceR = info.distance;
                }
                if (info.coord_x && info.coord_y) {
                    info.uid = info.coord_x + '&' + info.coord_y;
                }
                if (!info) {
                    return;
                }
                closeTip();
                if (isClick && isClick === info.uid) {
                    isClick = '';
                    return;
                }
                isClick = info.uid;
                // 获取直线距离
                if (info.distance) {

                }else {
                    if (info.point) {
                        info.distance = (map.getDistance(gpsPoint, info.point)).toFixed(1);
                        info.distanceR = info.distance;
                    } else if (info.coord_x && info.coord_y) {
                        info.distance = (map.getDistance(gpsPoint, {lat: info.coord_y, lng: info.coord_x})).toFixed(1);
                    }
                }
                
                
                // 距离单位
                info.distanceUnit = '米';
                if (info.distance > 1000) {
                    info.distanceUnit = '公里';
                    info.distance = (info.distance / 1000).toFixed(1);
                }
                maptip = new customOverlay(info.point?info.point:{lat: info.coord_y, lng: info.coord_x}, isClick, templateFetch($('#searchDetail').val(), info));
                map.addOverlay(maptip);
            };
            marker.addEventListener('click', opentheTip);
            return opentheTip;
        }


        // 隐藏信息框
        function closeTip() {
            map.removeOverlay(maptip);
        }

        // 用来显示提示信息
        function showPrompt(msg) {
            var showMsg = $('#show_msg');
            showMsg.show();
            $('#prompt').html(msg).slideDown();
            setTimeout(function () {
                showMsg.hide();
            }, 3000);
        }

        // 这里实现对周边进行调用
        function onClient(type) {
            // 实现对type的查询 容量为20
            searchNear(type, 20, 20);
        }

        // 清除type类型的标点
        function cleanOnClient(type) {
            cleanTypeMarker(type);
        }

        // 周边筛选的点击事件
        $('#search_wrap').on('click', 'a', function () {
            var type = $(this).attr('data-id');
            if (showAround[type] === undefined || showAround[type] === 0) {
                onClient(type);
            } else {
                cleanOnClient(type);
            }
        });
        // 导航 (起点, 终点, 导航策略)
        function navi(start, end, route) {
            // 这里实现对导航的地图初始化
            var driving = new BMap.DrivingRoute(map, {renderOptions: {map: map, autoViewport: true}, policy: route});
            // 实现导航
            driving.search(start, end);
        }

        // 定位
        $('.map-nav').on('click', function () {
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                    var gc = new BMap.Geocoder();
                    gc.getLocation(r.point, function (rs) {
                        var addComp = rs.addressComponents;
                        //  addComp.city = '北京';
                        if (addComp.city.indexOf(vars.cityname) > -1) {
                            // 对导航的起始定位
                            var start = r.point;
                            var end = new BMap.Point(vars.corX, vars.corY);
                            // 对导航进行定义
                            var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME, BMAP_DRIVING_POLICY_LEAST_DISTANCE, BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
                            navi(start, end, routePolicy[0]);
                        } else {
                            alert('定位与当前城市不一致');
                        }
                    });
                } else {
                    alert('抱歉，定位失败！');
                }
            }, {enableHighAccuracy: true});
        });
    };
});


