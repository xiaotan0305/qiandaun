/**
 * 二手房地图移动，缩放，画地铁线，画点
 */
define('modules/map/API/esfMapApi', ['jquery', 'modules/map/API/BMap'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var MapApi = function () {
        var arg = arguments;
        var that = this;
        var lng = 116.404,
            lat = 39.915,
            cont = 'mapObj',
            zoom = 11;
        for (var i = 0; i < arg.length; i++) {
            if (0 === i) {
                cont = arg[0];
            } else if (1 === i) {
                lat = arg[1];
            } else if (2 === i) {
                lng = arg[2];
            } else if (3 === i) {
                zoom = arg[3];
            }
        }
        this.citycenter = new BMap.Point(lng, lat);
        this.zoom = zoom;
        // 地图容器
        this.container = $('#' + cont);
        // 缩放级别的最大最小值
        var mapOptions = {
            minZoom: 10,
            maxZoom: 19
        };
        // 拖拽缩放结束标记
        this.dragend = !1;
        this.zoomEnd = !1;
        var map = new BMap.Map(cont, mapOptions);
        map.centerAndZoom(this.citycenter, zoom);
        var centerStart = null;
        map.addEventListener('dragstart', function () {
            that.dragend = !0;
            var SFMap = require('modules/map/esfSFMap');
            // 如果地铁模式，拖拽搜索
            if (!(SFMap.params.railway !== '' && SFMap.params.railwayStation === '')) {
                centerStart = that.pointToPixel(that.getCityCenter());
            }
        });
        // 拖拽结束
        map.addEventListener('dragend', function () {
            try {
                if (!that.dragend) {
                    return;
                }
                // 拖拽超过屏幕10%，重新搜索
                var centerEnd = that.pointToPixel(that.getCityCenter());
                var dx = Math.abs(centerEnd.x - centerStart.x);
                var dy = Math.abs(centerEnd.y - centerStart.y);
                var distance = Math.sqrt(dx * dx + dy * dy) * 10;
                var SFMap = require('modules/map/esfSFMap');
                if (distance > $(window).width() || 0 === distance) {
                    that.dragend = !1;
                    // 清空条件
                    SFMap.clearOtherOption('drag');
                }
            } catch (e) {
            }
        });
        // 点击空白，房源弹框隐藏
        map.addEventListener('touchstart', function () {
            var MapPublic = require('modules/map/mapPublic');
            MapPublic.hideHouseList();
            // 隐藏门店弹框
            var SFMap = require('modules/map/esfSFMap');
            SFMap.params.strKeyword = '';
            SFMap.hideEcShopList();
        });
        /*// 缩放开始
        map.addEventListener('zoomstart', function () {
            that.zoomEnd = !0;
        });*/
        // 缩放结束
        map.addEventListener('zoomend', function () {
            try {
                // zoomEnd为!1 false不搜索
                /*if (!that.zoomEnd) {
                    return;
                }*/
                var SFMap = require('modules/map/esfSFMap');
                // 搜索
                SFMap.params.zoom = that._map.getZoom();
                SFMap.clearOtherOption('zoom');
                //that.zoomEnd = !1;
            } catch (e) {
            }
        });
        this._map = map;
        this._markerManager = new MarkerManager(this._map);
    };

    function MarkerManager(map) {
        this._markers = [];
        this._map = map;
    }

    MarkerManager.prototype = {
        addMarker: function (marker) {
            this._markers.push(marker);
            this._map.addOverlay(marker);
        },
        clearMarkers: function () {
            while (this._markers.length > 0) {
                this._map.removeOverlay(this._markers.shift());
            }
        }
    };

    MapApi.prototype = {
        addEvent: function (obj, eve, motion) {
            if (obj === this) {
                return this._map.addEventListener(eve, motion);
            } else {
                return obj.addEventListener(eve, motion);
            }
        },
        clearMarkers: function () {
            this._markerManager.clearMarkers();
        },
        removeEvent: function (obj, eve, motion) {
            if (obj === this) {
                return this._map.removeEventListener(eve, motion);
            } else {
                return obj.removeEventListener(eve, motion);
            }
        },
        setCenter: function (y, x, zoom) {
            if (!y || !x) {
                return;
            }
            var mapZoom = zoom || this._map.getZoom();
            this._map.centerAndZoom(new BMap.Point(x, y), parseInt(mapZoom));
        },
        // 清除地图上数据
        clearOverlays: function () {
            this._map.clearOverlays();
        },
        // 获取四角坐标
        gethdBounds: function () {
            var map = this._map;
            var bounds = map.getBounds();
            var sw0 = bounds.getSouthWest();
            var ne0 = bounds.getNorthEast();
            var pointSw = map.pointToPixel(sw0);
            var sw = map.pixelToPoint(new BMap.Pixel(pointSw.x + 8, pointSw.y - 8));
            var pointNe = map.pointToPixel(ne0);
            var ne = map.pixelToPoint(new BMap.Pixel(pointNe.x - 8, pointNe.y + 8));
            var SFMap = require('modules/map/esfSFMap');
            // 修改中心坐标
            SFMap.pointX = (sw.lng + ne.lng) / 2;
            SFMap.pointY = (sw.lat + ne.lat) / 2;
            return {x1: sw.lng, x2: ne.lng, y1: sw.lat, y2: ne.lat};
        },
        pixelToPoint: function (pixel) {
            var map = this._map;
            return map.pixelToPoint(pixel);
        },
        getCityCenter: function () {
            return this.citycenter;
        },
        pointToPixel: function (point) {
            var map = this._map;
            return map.pointToPixel(point);
        },
        setZoom: function (zoom) {
            var mapZoom = parseInt(zoom);
            this._map.setZoom(mapZoom);
        },
        getZoom: function () {
            return this._map.getZoom();
        },
        getOverlays: function () {
            return this._map.getOverlays();
        },
        addMarker: function (marker) {
            this._map.addOverlay(marker);
        },
        // 点击地图标点。info：地图标点信息；obj：标点对象
        clickMarker: function (info, obj) {
            var listObj = null;
            var SFMap = require('modules/map/esfSFMap');
            // 楼盘标点要修改选中状态
            if (info.type === 'loupan') {
                // 修改中心坐标
                SFMap.pointX = info.coord_x;
                SFMap.pointY = info.coord_y;

                // 地图等级大于等于16，楼盘样式改变
                // 楼盘标点对象
                var $louPan = $('.mapBox').find('.loupan');
                // 移除小标点样式，添加大标点样式
                $louPan.removeClass('m-point').addClass('m-bd');
                // 大标点字样显示
                $louPan.find('p').show();

                // 如果对象已处于选中状态
                if (obj.hasClass('active')) {
                    return false;
                }
                // 去掉门店选中状态
                SFMap.hideEcShopList();
                // 修改对象为选中状态，原选中对象非选中状态
                var oldPoint = $('a[data-projcode][class*=active]');
                if (oldPoint.length > 0) {
                    oldPoint.removeClass('active').css('z-index', '');
                    if (!oldPoint.hasClass('visited')) {
                        oldPoint.addClass('visited');
                    }
                }
                obj.addClass('active').removeClass('visited').css('z-index', '100');
                // 点击过的标点，写到localstorage
                if (vars.localStorage) {
                    var p = vars.localStorage.getItem('visitedesfProj');
                    if (!p) {
                        vars.localStorage.setItem('visitedesfProj', info.projcode + ';');
                    } else if (p.indexOf(info.projcode + ';') === -1) {
                        vars.localStorage.setItem('visitedesfProj', p + info.projcode + ';');
                    }
                }
                // 按条件清除参数
                SFMap.clearOtherOption(info.type, info);
            } else if (info.type === 'station') {
                // 站点的其他选中样式取消
                $('#station_dl_' + info.railway).find('dd').removeClass('active');
                // 选中的站点添加active
                listObj = $('#station_dl_' + info.railway).find('a[data-id=' + info.id + ']').parent();
                listObj.addClass('active');
                listObj = $('#railway_section a[data-id=' + info.railway + ']').parent();
                listObj.addClass('active');
                // 按条件清除参数
                SFMap.clearOtherOption(info.type, info);
            } else if (info.type === 'ecshop') {
                // 门店点击事件。如果级别本身为小区级别，不用重新搜索
                if (SFMap.params.zoom >= SFMap.villageZoom) {
                    SFMap.clickEcShop(info, false);
                } else {
                    SFMap.clearOtherOption('ecshopid', info);
                }
            }
            return false;
        },
        // 生成地图标点。info标点
        createMarker: function (info) {
            // overlayMode为覆盖物类型
            var ltext = '', overlayMode;
            var SFMap = require('modules/map/esfSFMap');
            // 地铁
            if (info.type === 'station') {
                ltext = info.name + '<i></i>';
                // 被选中地铁站
                if (SFMap.params.stationName && info.name === SFMap.params.stationName) {
                    overlayMode = 'subwaystation';
                } else {
                    overlayMode = 'subwayline';
                }
                // 定位
            } else if (info.type === 'location') {
                ltext = '<span></span><i></i></div>';
                overlayMode = 'location';
            } else if (info.type === 'ecshop') {
                // 搜房门店
            } else if (parseInt(SFMap.params.zoom) >= 16) {
                // 大红点样式套数显示
                ltext = '<p>' + info.projname + '</p>';
                ltext += '<p>' + info.price + info.count + '</p>';
            } else {
                // 小红点样式套数隐藏
                ltext = '<p style="display:none;">' + info.projname + '</p>';
                ltext += '<p style="display:none;">' + info.price + '&nbsp;' + info.count + '</p>';
            }
            var marker = new ComplexCustomOverlay(info, ltext, overlayMode || info.type);
            this.addMarker(marker);
            return marker;
        },
        // 添加标点数组。matkers标点
        drawMarkers: function (markers) {
            var l = markers.length;
            var bounds = new BMap.Bounds();
            var point;
            for (var i = 0; i < l; i++) {
                var info = markers[i];
                if (!parseInt(info.coord_x) || !parseInt(info.coord_y)) {
                    continue;
                }
                point = new BMap.Point(info.coord_x, info.coord_y);
                bounds.extend(point);
                var marker = this.createMarker(info);
                this.addMarker(marker);
            }
        }
    };
    // 复杂的自定义覆盖物
    function ComplexCustomOverlay(info, text, overlayMode) {
        // 标点
        this._point = new BMap.Point(info.coord_x, info.coord_y);
        // 标点文本
        this._text = text;
        // 标点对象
        this._info = info;
        // 标点类型
        this._overlayMode = overlayMode;
    }

    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;
        var that = this;
        var div = this._div = $('<a href="javascript:void(0);" ></a>');
        // 楼盘
        if (this._overlayMode === 'loupan') {
            var SFMap = require('modules/map/esfSFMap');
            // 楼盘样式
            if (parseInt(SFMap.params.zoom) >= 16) {
                // 大红点样式
                div.addClass('m-bd');
            } else {
                // 小红点样式
                div.addClass('m-point');
            }
            div.attr('id', 'wapesfditu_B01_12').attr('data-projcode', this._info.projcode);

            // 和地铁点击区分加一个class
            div.addClass('loupan');
            // 点击过的标点，变为粉色
            var p = vars.localStorage ? vars.localStorage.getItem('visitedesfProj') : null;
            if (p && p.indexOf(this._info.projcode + ';') !== -1) {
                div.addClass('visited');
            }
        } else if (this._overlayMode === 'subwayline') {
            // 地铁
            div.attr('id', 'wapesfditu_B01_19').attr('data-id', this._info.id);
            div.attr('class', 'map-subway');
        } else if (this._overlayMode === 'subwaystation') {
            // 被选中地铁站
            div.attr('id', 'wapesfditu_B01_19').attr('data-id', this._info.id);
            div.attr('class', 'map-subway2');
        } else if (this._overlayMode === 'location') {
            // 定位
            div.attr('class', 'map-wz');
        } else if (this._overlayMode === 'ecshop') {
            // 门店
            if (this._info.status === '4') {
                div.attr('class', 'm-md-icon1');
            }else if (this._info.status === '5') {
                div.attr('class', 'm-md-icon2');
            }
            div.attr('id', 'wapesfditu_B01_25').attr('data-id', this._info.id);
        }
        div.css('zIndex', BMap.Overlay.getZIndex(this._point.lat));
        div.append(this._text);
        // 定位按钮和被选中地铁站，没有点击事件
        if (this._overlayMode !== 'subwaystation' && this._overlayMode !== 'location') {
            div.on('touchstart', function (event) {
                that._startmove = new Date().getTime();
                event.preventDefault();
                event.stopPropagation();
            });
            div.on('touchend', function () {
                // 判断是点击还是滑动地图
                var timeDiff = new Date().getTime() - that._startmove;
                if (timeDiff > 200) return;
                var obj = $(this);
                MapApi.prototype.clickMarker(that._info, obj);
            });
        }
        this._map.getPanes().labelPane.appendChild(div[0]);
        return div[0];
    };
    ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        var titleLength = '';
        if (this._overlayMode === 'subwayline') {
            titleLength = this._info.name.length * 7.5;
            this._div.css('left', pixel.x - titleLength + 'px');
            this._div.css('top', pixel.y - 38 + 'px');
        } else if (this._overlayMode === 'subwaystation') {
            titleLength = this._info.name.length * 7.5;
            this._div.css('left', pixel.x - titleLength + 'px');
            this._div.css('top', pixel.y - 30 + 'px');
        } else {
            this._div.css('left', pixel.x + 'px');
            this._div.css('top', pixel.y + 'px');
        }
    };
    ComplexCustomOverlay.prototype.getOverlayMode = function () {
        return this._overlayMode;
    };
    ComplexCustomOverlay.prototype.getDiv = function () {
        return this._div;
    };
    return MapApi;
});