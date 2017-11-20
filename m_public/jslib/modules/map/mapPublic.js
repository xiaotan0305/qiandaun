/**
 * 地图公用方法，画地铁线，定位，加载更多，显示提示信息，设置房源状态，小区标点移到中心
 * by limengyang.bj@fang.com 2016-04-28
 */
define('modules/map/mapPublic', ['jquery','modules/map/API/BMap'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 提示信息的对象
    var $prompt = $('#housePrompt');

    // 地铁数据
    var subwayConfig = '';
    // 地铁画线方法
    var busline = null;
    // 定位坐标
    var locationpoint = null;
    var MapPublic = {
        // 地铁画线,type=地图类型，railwayName=地铁线名称，map=map对象
        showSubway: function (type, railwayName, map) {
            // 如果没有地铁画线方法就定义
            if (!busline) {
                // 画地铁线
                busline = new BMap.BusLineSearch(map._map, {
                    renderOptions: {},
                    onGetBusListComplete: function (result) {
                        if (result) {
                            var fstLine = result.getBusListItem(0);
                            busline.getBusLine(fstLine);
                        }
                    },
                    onGetBusLineComplete: function (result) {
                        var line = result.getPolyline();
                        line.setStrokeColor('red');
                        map._map.addOverlay(line);
                    }
                });
            }

            var line = railwayName === '机场线' ? '地铁机场线' : railwayName;
            // 画线
            busline.getBusList(line);
            // 如果没有地铁信息，通过ajax获取
            if (subwayConfig) {
                // 地铁站描点
                for (var i = 0; i < subwayConfig.length; i++) {
                    if (subwayConfig[i].name === railwayName) {
                        map.drawMarkers(subwayConfig[i].station);
                        break;
                    }
                }
            } else {
                $.ajax({
                    url: vars.mapSite + '?c=map&a=ajaxSubway&type=' + type + '&city=' + vars.city,
                    async: true,
                    success: function (data) {
                        subwayConfig = data;
                        // 地铁站描点
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].name === railwayName) {
                                map.drawMarkers(data[i].station);
                                break;
                            }
                        }
                    }
                });
            }
        },
        // 显示提示，msg=提示信息
        showPrompt: function (msg) {
            $prompt.html(msg).show();
            // 延时隐藏
            setTimeout(function () {
                $prompt.hide();
            }, 1000);
        },
        // 小区标点移到中心，h=标点Y轴的移动距离,zoom=地图等级，map=map对象
        setProjCenter: function (point, h, zoom, map) {
            var pixel = map.pointToPixel(point);
            // 标点Y轴的移动距离
            pixel.y += h;
            var center = map.pixelToPoint(pixel);
            map._map.centerAndZoom(center, zoom);
        },
        // 设置房源列表
        setHouseList: function () {
            // 已经点击过的房源设置class
            if (vars.localStorage) {
                var p = vars.localStorage.getItem('visitedHouse');
                $('#house_detail_wrap li').each(function () {
                    var $that = $(this);
                    if (p !== null && p.indexOf($that.attr('data-id') + ';') !== -1) {
                        $that.attr('class', 'kg');
                    }
                });
            }
        },
        // 隐藏房源列表
        hideHouseList: function () {
            var houseObj = $('.map-out').filter(':visible');
            if (houseObj.length) {
                houseObj.hide();
                // 修改对象为选中状态，原选中对象非选中状态
                var oldPoint = $('a[data-projcode][class*=active]');
                if (oldPoint.length > 0) {
                    oldPoint.removeClass('active').addClass('visited').css('z-index', '');
                }
                // 显示头部
                $('header').show();
                $('#tabSX').show();
            }
        },
        // 定位，type地图类型，locClick是点击定位按钮定位传1，点击门店导航传2，否则不传
        // callback为门店导航回调函数
        locationMap: function (type, locClick, callback) {
            // 判断地图类型
            if (type === 'cfj') {
                var cfj = require('modules/map/cfj');
                // 如果定位失败或还未定位，使用百度地图定位
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                        var gc = new BMap.Geocoder();
                        gc.getLocation(r.point, function (rs) {
                            var addComp = rs.addressComponents;
                            // 如果定位到当前城市
                            if (addComp.city.indexOf(vars.cityname) > -1) {
                                cfj.positionPoint = r.point;
                                //locationpoint = {coord_x: r.point.lng, coord_y: r.point.lat};
                                // cfj.map.setCenter(39.820762634277344,116.30856323242188, 17);
                                cfj.map.setCenter(r.point.lat, r.point.lng, 17);
                                var positionMap = function () {
                                    var bounds = cfj.map.gethdBounds();
                                    cfj.params.x1 = bounds.MinLng;
                                    cfj.params.y1 = bounds.MinLat;
                                    cfj.params.x2 = bounds.MaxLng;
                                    cfj.params.y2 = bounds.MaxLat;
                                    cfj.params.searchtype = 'xiaoqu';
                                    $.ajax({
                                        url:  vars.protocol + vars.mapSite + '?',
                                        type: 'GET',
                                        dataType: 'json',
                                        data: cfj.params,
                                    })
                                    .done(function(data) {
                                        if (data) {
                                            $('.mapOption').find('p').text('共为您找到 ' + data.count + ' 个小区');
                                            cfj.map.drawMarkers(data.list, false, '', cfj.markerFunc);
                                        }else {
                                            cfj.map.clearOverlays();
                                            $('.mapOption').find('p').text('共为您找到 0 个小区');
                                        }
                                        // cfj.map.drawMarker({mapx: 116.30856323242188000000, mapy: 39.82076263427734400000}, '<div class="map-wz"><span></span><i></i></div>');
                                        cfj.map.drawMarker({mapx: r.point.lng, mapy: r.point.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                    });
                                     cfj.map.map.removeEventListener('tilesloaded', positionMap);
                                };
                                cfj.map.map.addEventListener('tilesloaded', positionMap);
                            } else {
                                var cityList = vars.cityList, cityname = vars.cityname, cityLetter = '';
                                for (var key in cityList) {
                                    if (addComp.city.indexOf(cityList[key]) > -1) {
                                        cfj.cityLetter = key;
                                        $('.floatAlert').find('#cityname').text(cityList[key]);
                                    }
                                }
                                if (cfj.cityLetter) {
                                    $('.floatAlert').show();
                                    // location.href = vars.protocol + vars.mapSite + '?c=map&a=cfjMap&city=' + cityLetter;
                                }else {
                                    alert('定位失败');
                                }
                            }
                        });
                    } else if (locClick) {
                        // 点击定位按钮，定位失败
                        MapPublic.showPrompt('获取位置信息失败');
                    }
                }, {enableHighAccuracy: true});
            }else {
                var sFMap = require('modules/map/' + type + 'SFMap');
                // 定位成功后，执行的函数
                var doSuccess = function () {
                    if (locClick === 2) {
                        callback(locationpoint);
                    } else {
                        sFMap.clearOtherOption('location', locationpoint);
                        // 首次加载走搜索
                        if (sFMap.firstLoad) {
                            sFMap.searchResult();
                        }
                    }
                };
                // 如果定位成功
                // locationpoint = {coord_x: 116.382422,coord_y: 39.914271};
                if (locationpoint) {
                    doSuccess();
                    return;
                }
                // 如果定位失败或还未定位，使用百度地图定位
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                        var gc = new BMap.Geocoder();
                        gc.getLocation(r.point, function (rs) {
                            var addComp = rs.addressComponents;
                            // 如果定位到当前城市
                            if (addComp.city.indexOf(vars.cityname) > -1) {
                                locationpoint = {coord_x: r.point.lng, coord_y: r.point.lat};
                                doSuccess();
                            } else if (locClick) {
                                // 点击定位按钮，定位到其他城市
                                MapPublic.showPrompt('无法获取您的位置，请开启浏览器定位功能');
                            } else {
                                // 进入地图页，定位到其他城市，根据参数显示地图
                                sFMap.searchResult();
                            }
                        });
                    } else if (locClick) {
                        // 点击定位按钮，定位失败
                        MapPublic.showPrompt('获取位置信息失败');
                    } else {
                        // 进入地图页，定位失败，根据参数显示地图
                        sFMap.searchResult();
                    }
                }, {enableHighAccuracy: true});
            }
            
        },

        // 房源列表加载更多,type地图类型
        loadMore: function (type) {
            // 判断地图类型
            var sFMap = require('modules/map/' + type + 'SFMap');
            // 每页数量*页数大于房源总数量就不在搜索
            if (sFMap.params.pagesize * sFMap.params.page >= sFMap.housecount) {
                return false;
            }
            // 房源列表对象
            var $houseListObj = $('#house_detail_wrap');
            // 页码加一
            sFMap.params.page++;
            // 搜索数据
            sFMap.searchResult();
            // 提示信息修改
            $houseListObj.find('.p-up').text('加载中...');
        }
    };
    return MapPublic;
});
