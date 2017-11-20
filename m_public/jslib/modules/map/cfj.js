/**
 * 小区详情页插入地图
 * 赵天亮
 * 201706013
 */
define('modules/map/cfj', ['jquery', 'mapAPI/1.0.1/mapAPI', 'hslider/1.0.0/hslider', 'search/map/mapSearch', 'modules/map/mapPublic'], function(require, exports, module) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 地图插件
    var mapAPI = require('mapAPI/1.0.1/mapAPI');
    // 价格筛选框引入hslider插件
    var hslider = require('hslider/1.0.0/hslider');
    //  地图搜索主类
    var MapSearch = require('search/map/mapSearch');
    // 定位
    var MapPublic = require('modules/map/mapPublic');
    // 页面传入参数
    var vars = seajs.data.vars;
    // 显示套数dom
    var mapOption = $('.mapOption');
    
    var cfj = {
        init: function() {
            var that = this;
            that.firstload = true;
            that.startTime = 0;
            that.endTime = 0;
            that.params = {
                c: vars.currentChannel,
                a: 'ajaxCfjSearch',
                city: vars.city,
                searchtype: 'district',
                keyword: '',
                x1: '',
                y1: '',
                x2: '',
                y2: '',
                price: ''
            };
            that.recordZoom = function () {
                that.oldZoom = that.map.getZoom();
                that.map.map.removeEventListener('tilesloaded', that.recordZoom);
            }
            that.bindEvent();
            // 自定义描点函数
            var buildMarkerDomFunc = function(info) {
                // 自定义覆盖物
                var getZoom = that.map.getZoom(),
                    html;
                if (getZoom < 17) {
                    if (info.price && info.price != '0') {
                        html = '<div class="cfjmap-bd" style="top:-28px; left:-25px;" data-mapx="' + info.mapx + '" data-mapy="' + info.mapy + '"><span class="wz">' + info.name + '</span><span>' + parseInt(info.price) + '</span><span>元/平米</span></div>';
                    } else {
                        html = '<div class="cfjmap-bd" style="top:-28px; left:-25px;" data-mapx="' + info.mapx + '" data-mapy="' + info.mapy + '"><span class="wz">' + info.name + '</span><span>&nbsp;</span><span>暂无均价</span></div>';
                    }

                } else {
                    if (info.price !== '0.00') {
                        html = '<div class="cfjmap-bd2" style="top:-28px; left:-25px;" data-mapx="' + info.mapx + '" data-mapy="' + info.mapy + '" data-url="' + info.url + '"><span class="wz">' + info.name + '</span><span>' + parseInt(info.price) + '元/平米</span></div>';
                    }else {
                        html = '<div class="cfjmap-bd2" style="top:-28px; left:-25px;" data-mapx="' + info.mapx + '" data-mapy="' + info.mapy + '" data-url="' + info.url + '"><span class="wz">' + info.name + '</span><span>暂无均价</span></div>';
                    }
                    
                }

                return html;
            };
            // 描点事件
            that.markerFunc = function(map) {
                // 获取描点
                // var markers = map.getOverlays();
                var markers = that.map.markerManager.markers;
                // 描点容器 (移动端描点不能加事件 要提取出来做成jq对象)
                var markersArr = [];
               
                for (var i = 0; i < markers.length; i++) {
                    markersArr.push(markers[i]._container);
                }
                $(markersArr).on('touchstart', function() {
                    that.startTime = new Date().getTime();
                    console.log(that.startTime);
                });
                $(markersArr).on('touchend', function() {
                    that.endTime = new Date().getTime();
                    console.log(that.endTime);
                    if (that.endTime - that.startTime > 80) {
                        console.log(that.endTime - that.startTime);
                        return;
                    }
                    var $that = $(this);
                    var zoom = map.getZoom();
                    if (zoom <= 14) {
                        that.params.searchtype = 'comarea';
                        var distX = $that.find('.cfjmap-bd').attr('data-mapx'),
                            distY = $that.find('.cfjmap-bd').attr('data-mapy');
                        var distCenter = new BMap.Point(distX, distY);
                        map.centerAndZoom(distCenter, 15);
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = bounds.MinLng;
                        that.params.y1 = bounds.MinLat;
                        that.params.x2 = bounds.MaxLng;
                        that.params.y2 = bounds.MaxLat;
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个商圈');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                    if (that.positionStatus && that.positionPoint) {
                                        that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                    }
                                } else {
                                    that.map.clearOverlays();
                                    mapOption.find('p').text('共为您找到 0 个商圈');
                                }
                            });

                    } else if (zoom === 15 || zoom === 16) {
                        that.params.searchtype = 'xiaoqu';
                        var distX = $that.find('.cfjmap-bd').attr('data-mapx'),
                            distY = $that.find('.cfjmap-bd').attr('data-mapy');
                        var distCenter = new BMap.Point(distX, distY);
                        map.centerAndZoom(distCenter, 17);
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = bounds.MinLng;
                        that.params.y1 = bounds.MinLat;
                        that.params.x2 = bounds.MaxLng;
                        that.params.y2 = bounds.MaxLat;
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个小区');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                    if (that.positionStatus && that.positionPoint) {
                                        that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                    }
                                } else {
                                    that.map.clearOverlays();
                                    mapOption.find('p').text('共为您找到 0 个小区');
                                }
                            });
                    } else if (zoom >= 17) {
                        var url = $that.find('.cfjmap-bd2').attr('data-url');
                        location.href = 'http://' + url;
                    }

                });

            };
            // 缩放事件
            var zoomFunc = function() {
                var zoom = that.map.getZoom();
                if (that.oldZoom <= 14) {
                    if (zoom === 15 || zoom === 16) {
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = bounds.MinLng;
                        that.params.y1 = bounds.MinLat;
                        that.params.x2 = bounds.MaxLng;
                        that.params.y2 = bounds.MaxLat;
                        that.params.searchtype = 'comarea';
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个商圈');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                    if (that.positionStatus && that.positionPoint) {
                                        that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                    }
                                } else {
                                    that.map.clearOverlays();
                                    mapOption.find('p').text('共为您找到 0 个商圈');
                                }

                            });
                    }else if (zoom >= 17) {
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = bounds.MinLng;
                        that.params.y1 = bounds.MinLat;
                        that.params.x2 = bounds.MaxLng;
                        that.params.y2 = bounds.MaxLat;
                        that.params.searchtype = 'xiaoqu';
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个小区');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                } else {
                                    that.map.clearOverlays();
                                    mapOption.find('p').text('共为您找到 0 个小区');
                                }
                                if (that.positionStatus && that.positionPoint) {
                                    that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                }
                            });
                    }
                } else if (that.oldZoom === 16 || that.oldZoom === 15) {
                    if (zoom <= 14) {
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = that.params.y1 = that.params.x2 = that.params.y2 = '';
                        that.params.searchtype = 'district';
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个区县');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                }
                                if (that.positionStatus && that.positionPoint) {
                                    that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                }
                            });
                    }else if (zoom >= 17) {
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = bounds.MinLng;
                        that.params.y1 = bounds.MinLat;
                        that.params.x2 = bounds.MaxLng;
                        that.params.y2 = bounds.MaxLat;
                        that.params.searchtype = 'xiaoqu';
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个小区');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                } else {
                                    that.map.clearOverlays();
                                    mapOption.find('p').text('共为您找到 0 个小区');
                                }
                                if (that.positionStatus && that.positionPoint) {
                                    that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                }
                            });
                    }
                } else if (that.oldZoom >= 17) {
                    if (zoom === 16 || zoom === 15) {
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = bounds.MinLng;
                        that.params.y1 = bounds.MinLat;
                        that.params.x2 = bounds.MaxLng;
                        that.params.y2 = bounds.MaxLat;
                        that.params.searchtype = 'comarea';
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个商圈');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                    
                                } else {
                                    that.map.clearOverlays();
                                    mapOption.find('p').text('共为您找到 0 个商圈');
                                }
                                if (that.positionStatus && that.positionPoint) {
                                    that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                }
                            });
                    }else if (zoom <= 14) {
                        var bounds = that.map.gethdBounds();
                        that.params.x1 = that.params.y1 = that.params.x2 = that.params.y2 = '';
                        that.params.searchtype = 'district';
                        $.ajax({
                                url: mainSite,
                                type: 'GET',
                                dataType: 'json',
                                data: that.params,
                            })
                            .done(function(data) {
                                if (data) {
                                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个区县');
                                    that.map.drawMarkers(data.list, false, '', that.markerFunc);
                                }
                                if (that.positionStatus && that.positionPoint) {
                                    that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                }
                            });
                    }
                }

                that.map.map.addEventListener('tilesloaded', that.recordZoom);
                
            };

            // 拖拽事件
            var dragFunc = function() {
                var zoom = that.map.getZoom();
                if (zoom <= 14) {
                    console.log(zoom);
                    return;
                } else if (zoom === 15 || zoom === 16) {
                    var bounds = that.map.gethdBounds();
                    that.params.x1 = bounds.MinLng;
                    that.params.y1 = bounds.MinLat;
                    that.params.x2 = bounds.MaxLng;
                    that.params.y2 = bounds.MaxLat;
                    that.params.searchtype = 'comarea';
                    $.ajax({
                            url: mainSite,
                            type: 'GET',
                            dataType: 'json',
                            data: that.params,
                        })
                        .done(function(data) {
                            if (data) {
                                mapOption.find('p').text('共为您找到 ' + data.count + ' 个商圈');
                                that.map.drawMarkers(data.list, false, '', that.markerFunc);
                            } else {
                                that.map.clearOverlays();
                                mapOption.find('p').text('共为您找到 0 个商圈');
                            }
                            if (that.positionStatus && that.positionPoint) {
                                that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                            }
                        });
                } else if (zoom >= 17) {
                    var bounds = that.map.gethdBounds();
                    that.params.x1 = bounds.MinLng;
                    that.params.y1 = bounds.MinLat;
                    that.params.x2 = bounds.MaxLng;
                    that.params.y2 = bounds.MaxLat;
                    that.params.searchtype = 'xiaoqu';
                    $.ajax({
                            url: mainSite,
                            type: 'GET',
                            dataType: 'json',
                            data: that.params,
                        })
                        .done(function(data) {
                            if (data) {
                                mapOption.find('p').text('共为您找到 ' + data.count + ' 个小区');
                                that.map.drawMarkers(data.list, false, '', that.markerFunc);
                            } else {
                                that.map.clearOverlays();
                                mapOption.find('p').text('共为您找到 0 个小区');
                            }
                            if (that.positionStatus && that.positionPoint) {
                                that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                            }
                        });
                }
            };

            // 回调
            var otherOperation = function(data) {
                if (data) {
                    mapOption.find('p').text('共为您找到 ' + data.count + ' 个区县');
                } else {
                    mapOption.find('p').text('共为您找到 0 个区县');
                }
            };
            // ajax地址
            var mainSite = vars.protocol + vars.mapSite + '?';
            // 初始化地图配置
            var options = {
                // 地图容器id
                container: 'allmap',
                // 设置地图类型
                mapType: !1,
                // 是否需要设置地图大小, 默认不设置
                isSetSize: !0,
                // 地图中心点纬度  默认天安门纬度
                lat: vars.cityy,
                // 地图中心点经度  默认天安门经度
                lng: vars.cityx,
                // 初始化时地图的缩放等级  默认11  范围3-19
                zoom: 11,
                // 是否绑定拖拽和缩放事件
                isBindEvent: true,
                // 最大最小级别
                minZoom: 10,
                maxZoom: 18,
                // 对描点和地图的操作  默认为null
                markerFunc: that.markerFunc,
                // 描点是不是自适应显示在可视区内 默认为true
                autoSize: false,
                markerData: {
                    // 地址
                    url: mainSite,
                    // 传输类型, 默认'GET'
                    type: 'GET',
                    dataType: 'json',
                    // 参数, 默认为空{}
                    data: {
                        c: vars.currentChannel,
                        a: 'ajaxCfjSearch',
                        city: vars.city,
                        searchtype: 'district'
                    }
                },
                prop: {
                    // 数据中存放经度的变量名  默认Lng
                    lngProp: 'mapx',
                    // 数据中存放纬度的变量名  默认Lat
                    latProp: 'mapy',
                    // 数据中存放纬度的变量名, 不传代表直接返回描点数组
                    ajaxDataArrayProp: 'list',
                    // 数据中存放dom格式的变量名默认cusDom, 也可以传函数
                    cusDom: buildMarkerDomFunc
                },
                // ajax回调对地图以外页面操作
                otherOperation: otherOperation,
                zoomFunc: zoomFunc,
                dragFunc: dragFunc
            };
            that.map = new mapAPI(options);
            if (vars.location === 'true') {
                that.positionStatus = true;
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    that.positionPoint = r.point;
                    if (this.getStatus() === BMAP_STATUS_SUCCESS) {
                        that.map.drawMarker({mapx: r.point.lng, mapy: r.point.lat}, '<div class="map-wz"><span></span><i></i></div>');
                    } 
                }, {enableHighAccuracy: true});
            }
        },
        // 绑定事件
        bindEvent: function() {
            var that = this;
            // 搜索功能初始化
            var mapSearch = new MapSearch();
            var searchClick = $('.topSearch, .input');
            mapSearch.showPopBtn = searchClick;
            searchClick.on('click', function() {
                // 隐藏文档流
                mapSearch.hideBody();
                // 显示弹窗
                mapSearch.showPop();
            });
            // 定位按钮
            var locationBtn = $('#wapesfditu_B01_20');
            var floatAlert = $('.floatAlert');
            var cityBox = floatAlert.find('i');
            locationBtn.on('touchend', function() {
                that.positionStatus = true;
                MapPublic.locationMap('cfj');
            });
            var cancel = floatAlert.find('a').eq(0);
            var ensure = floatAlert.find('a').eq(1);
            cancel.on('touchend', function() {
                floatAlert.hide();
            });
            ensure.on('touchend', function() {
                location.href = vars.protocol + vars.mapSite + '?c=map&a=cfjMap&city=' + that.cityLetter + '&location=true';
            });

            // var priceHsliderDj;
            function priceChioceFunDj() {
                var $priceHslider = $('.qjBox'),
                    $pricemin = $('.in-qj div').eq(0),
                    $pricemax = $('.in-qj div').eq(1);
                // 获取最大值和最小值一定要在插件的创建对象之前去获取，因为插件初始化时会把值设为不限
                var min = $pricemin.find('i').html() || '不限';
                var max = $pricemax.find('i').html() || '不限';
                that.priceHsliderDj = new hslider({
                    max: 99500,
                    min: 500,
                    step: 500,
                    oParent: $priceHslider,
                    leftSign: $pricemin,
                    rightSign: $pricemax,
                    range: $('.in-qj span'),
                    danwei: '元'
                });
                // 初始化传递最小值和最大值
                that.priceHsliderDj._initPos(min, max);
                // 总价左边滚动条
               
                    $pricemin.on('touchstart', function() {
                        $pricemin.addClass('hover');
                        $pricemax.removeClass('hover');
                    }).on('touchend', function() {
                        $pricemin.removeClass('hover');
                       // $('#pricemindj i').html($('#pricemindj i').html() == 0 ? '不限' : $('#pricemindj i').html());
                       console.log();
                    });
                    // 总价右边滚动条
                    $pricemax.on('touchstart', function() {
                        $pricemin.removeClass('hover');
                        $pricemax.addClass('hover');
                        //$('#pricemaxdj i').html($('#pricemaxdj i').html() == 0 ? 100 : $('#pricemaxdj i').html());
                    }).on('touchend', function() {
                        $pricemax.removeClass('hover');
                       // $('#pricemaxdj i').html($('#pricemaxdj i').html() == 0 ? 100 : $('#pricemaxdj i').html());
                    });
            
               
                if (min == '0') {
                    //$('#pricemindj i').html('不限');
                }
            }
            // 点击筛选出现价格框
            mapOption.on('click', 'a', function() {
                $('#tabFloat').show();
                $('.checkBoxPri').show();
                priceChioceFunDj();
            });
            // 点X关闭
            var close = $('.btn_close');
            close.on('click', function() {
                $('#tabFloat').hide();
                $('.checkBoxPri').hide();
            });

            // 点击价格确认按钮
            var submitBtn = $('.submitBtn');
            submitBtn.on('touchend', function() {
                var priceminStr = $('.in-qj div').eq(0).find('i').text(), pricemaxStr = $('.in-qj div').eq(1).find('i').text();
                if (priceminStr === '不限' && pricemaxStr ==='不限' && that.firstload) {
                    $('#tabFloat').hide();
                    $('.checkBoxPri').hide();
                    return;
                } else {
                    priceminStr = priceminStr === '不限'? '': priceminStr;
                    pricemaxStr = pricemaxStr === '不限'? '': pricemaxStr;
                    var point = that.map.map.getCenter();
                    that.map.map.centerAndZoom(point, 17);
                    var bounds = that.map.gethdBounds();
                    that.params.x1 = bounds.MinLng;
                    that.params.y1 = bounds.MinLat;
                    that.params.x2 = bounds.MaxLng;
                    that.params.y2 = bounds.MaxLat;
                    that.params.searchtype = 'xiaoqu';
                    that.params.price = priceminStr + ',' + pricemaxStr;
                    that.params.associate = '';
                    $.ajax({
                        url:  vars.protocol + vars.mapSite + '?',
                        type: 'GET',
                        dataType: 'json',
                        data: that.params,
                    })
                    .done(function(data) {
                        that.firstload = false;
                        if (data) {
                            $('.mapOption').find('p').text('共为您找到 ' + data.count + ' 个小区');
                            that.map.drawMarkers(data.list, false, '', that.markerFunc);
                        }else {
                            that.map.clearOverlays();
                            $('.mapOption').find('p').text('共为您找到 0 个小区');
                        }
                        if (that.positionStatus && that.positionPoint) {
                            that.map.drawMarker({mapx: that.positionPoint.lng, mapy: that.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                        }
                        $('#tabFloat').hide();
                        $('.checkBoxPri').hide();

                    });
                }
            });
            
            // 价格重置按钮
            var checkBoxPri = $('.checkBoxPri .reset');
            checkBoxPri.on('touchend', function() {
                that.priceHsliderDj._initPos('不限', '不限');
            });

        }
    }
    module.exports = cfj;
});