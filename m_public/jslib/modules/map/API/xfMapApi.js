/**
 * 新房地图移动，缩放，画地铁线，画点
 * 20160427 lixiaoru修改
 */
define('modules/map/API/xfMapApi', ['jquery', 'modules/map/API/BMap'], function (require) {
    'use strict';
    var $ = require('jquery');
    var zoomFlag = 0;
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
        this.container = $('#' + cont);
        var mapOptions = {
            minZoom: 10,
            maxZoom: 19
        };
        var map = new BMap.Map(cont, mapOptions);
        map.centerAndZoom(this.citycenter, zoom);
        var centerstart = null;
        // 拖拽缩放结束标记
        this.dragend = !0;
        this.zoomEnd = !0;
        // 拖拽开始
        map.addEventListener('dragstart', function () {
            that.dragend = !0;
            var SFMap = require('modules/map/xfSFMap');
            // 如果没有关键词，且不是地铁模式，拖拽搜索
            if (!(SFMap.params.railway !== '' && SFMap.params.railwayStation === '')) {
                centerstart = that.pointToPixel(that.getCityCenter());
            }
        });
        // 拖拽结束
        map.addEventListener('dragend', function () {
            try {
                if (!that.dragend) {
                    return;
                }
                // 拖拽超过屏幕10%，重新搜索
                var centerend = that.pointToPixel(that.getCityCenter());
                var dx = Math.abs(centerend.x - centerstart.x);
                var dy = Math.abs(centerend.y - centerstart.y);
                var distance = Math.sqrt(dx * dx + dy * dy) * 10;
                var SFMap = require('modules/map/xfSFMap');
                if (distance > $(window).width() || 0 === distance) {
                    that.dragend = !1;
                    // 清空条件
                    SFMap.params.zoom = that._map.getZoom();
                    SFMap.clearOtherOption('drag');
                }
            } catch (e) {
            }
        });
        // 点击
        map.addEventListener('touchstart', function () {
            var SFMap = require('modules/map/xfSFMap');
            SFMap.hideHouseList();
        });
        // 缩放开始
        /*map.addEventListener('zoomstart', function () {
            that.zoomEnd = false;
        });*/
        // 缩放结束
        map.addEventListener('zoomend', function () {
            try {
                if (zoomFlag) {
                    zoomFlag = 0;
                    return;
                }
                // 搜索
                var SFMap = require('modules/map/xfSFMap');
                SFMap.params.zoom = that._map.getZoom();
                SFMap.clearOtherOption('zoom');
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
            if (obj == this) {
                return this._map.addEventListener(eve, motion);
            } else {
                return obj.addEventListener(eve, motion);
            }
        },
        clearMarkers: function () {
            this._markerManager.clearMarkers();
        },
        removeEvent: function (obj, eve, motion) {
            if (obj == this) {
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
            zoomFlag = 1;
            this._map.centerAndZoom(new BMap.Point(x, y), parseInt(mapZoom));
        },
        clearOverlays: function () {
            this._map.clearOverlays();
        },
        gethdBounds: function () {
            var map = this._map;
            var bounds = map.getBounds();
            var sw0 = bounds.getSouthWest();
            var ne0 = bounds.getNorthEast();
            var pointSw = map.pointToPixel(sw0);
            var sw = map.pixelToPoint(new BMap.Pixel(pointSw.x + 8, pointSw.y - 8));
            var pointNe = map.pointToPixel(ne0);
            var ne = map.pixelToPoint(new BMap.Pixel(pointNe.x - 8, pointNe.y + 8));
            return {x1: sw.lng, x2: ne.lng, y1: sw.lat, y2: ne.lat};
        },
        clickMarker: function (info, obj) {
            var listObj = null;
            var SFMap = require('modules/map/xfSFMap');
            if (info.type === 'loupan') {
                // 修改中心坐标
                SFMap.pointX = info.coord_x;
                SFMap.pointY = info.coord_y;
                // 如果对象已处于选中状态
                if (obj.hasClass('m-point')) {
                    var $louPan = $('.mapBox').find('.m-point');
                    $louPan.removeClass('m-point').addClass('m-bd');
                    $louPan.children().show();
                }

                // 修改对象为选中状态，原选中对象非选中状态
                var oldPoint = $('div[data-newcode][class*=active]');
                if (oldPoint.length > 0) {
                    oldPoint.removeClass('active').css('z-index', '');
                    if (!oldPoint.hasClass('visited')) {
                        oldPoint.addClass('visited');
                    }
                }
                // 存储楼盘信息，在该楼盘没有房源或户型时展示楼盘信息
                SFMap.loupanInfo = info;
                obj.addClass('active').removeClass('visited').css('z-index', '100');
            } else if (info.type === 'station') {
                // 选中的站点添加active,其他站点取出active
                $('#station_dl_' + info.railway).find('a[data-id=' + info.id + ']').parent().addClass('active').siblings().removeClass('active');
                // 对应的地铁线添加active
                $('#railway_section a[data-id=' + info.railway + ']').parent().addClass('active');
            } else if (info.type === 'school') {
                // 选中的学校添加active,其他学校删除active
                $('.mapBox').find('div.map-school').removeClass('active');
                obj.children().addClass('active');
                // 快筛联动
                listObj = $('#school_dl_' + info.schoolType);
                listObj.show();
                listObj.find('a[data-id=' + info.id + ']').parent().addClass('active').siblings().removeClass('active');
                // 对应的学校类型添加active
                $('#schoolType_section a[data-id=' + info.schoolType + ']').parent().addClass('active').siblings().removeClass('active');
                info.clickType = 1;
            }

            // 按条件清除参数
            SFMap.clearOtherOption(info.type, info);
            return false;
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
        createMarker: function (info, markerFlag) {
            // 对自定义的marker,对info的结构进行判断
            var ltext = '', overlayMode = '';
            // 学校的样式
            var SFMap = require('modules/map/xfSFMap');
            if (info.type === 'loupan') {
                if (markerFlag) {
                    ltext += '<p>' + info.title + '</p>';
                    ltext += '<p>' + info.price + '</p>';
                } else {
                    ltext += '<p style="display:none;">' + info.title + '</p>';
                    ltext += '<p style="display:none">' + info.price + '</p>';
                }
                overlayMode = 'loupan';
            } else if (info.type === 'school') {
                if (SFMap.params.schoolid === info.id) {
                    ltext = '<div class="map-school active" style="width:82px;z-index:100">' + info.schoolname + '</div>';
                } else {
                    ltext = '<div class="map-school" style="width:82px;z-index:0">' + info.schoolname + '</div>';
                }
                overlayMode = 'school';
            } else if (info.type === 'station') {
                ltext = info.name + '<i></i>';
                // 被选中地铁站
                if (SFMap.params.stationName && info.name === SFMap.params.stationName) {
                    overlayMode = 'subwaystation';
                } else {
                    overlayMode = 'subwayline';
                }
            } else if (info.type === 'location') {
                ltext = '<span></span><i></i></div>';
                overlayMode = 'location';
            }
            var marker = new ComplexCustomOverlay(info, ltext, overlayMode || info.type, markerFlag);
            this.addMarker(marker);
            return marker;
        },
        addMarker: function (marker) {
            this._map.addOverlay(marker);
        },
        drawMarkers: function (markers, markerFlag) {
            // 添加标点
            var that = this, l = markers.length, point, arrMarkers = [];
            for (var i = 0; i < l; i++) {
                if (markers[i]) {
                    var info = markers[i];
                    // 这里进行楼盘的描点
                    if (parseInt(info.coord_x) && parseInt(info.coord_y)) {
                        point = new BMap.Point(info.coord_x, info.coord_y);
                        arrMarkers.push(point);
                        var marker = that.createMarker(info, markerFlag);
                        that.addMarker(marker);
                    }
                }
            }
        }
    };
    // 复杂的自定义覆盖物
    function ComplexCustomOverlay(info, text, type, markerFlag) {
        // 标点
        this._point = new BMap.Point(info.coord_x, info.coord_y);
        // 标点文本
        this._text = text;
        // 标点对象
        this._info = info;
        // 标点类型
        this._type = type;
        // 楼盘标点区分
        this._markerFlag = markerFlag;
        this._startmove = '';
    }

    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;
        var that = this;
        var div = this._div = $('<div></div>');
        div.append(this._text);
        // 然后对相应的marker进行事件监听【以及样式控制】
        // 这三者的监听事件也可以进行优化
        if (this._type === 'subwayline') {
            // 未被选中地铁站
            div.attr('id', 'wapesfditu_B01_19').attr('data-id', this._info.id);
            div.attr('class', 'map-subway');
        } else if (this._type === 'subwaystation') {
            // 被选中地铁站
            div.attr('id', 'wapesfditu_B01_19').attr('data-id', this._info.id);
            div.attr('class', 'map-subway2');
        } else if (this._type === 'school') {
            div.attr('class', 'map-bd red-bg');
        } else if (this._type === 'location') {
            div.attr('class', 'map-wz');
        } else if (this._type === 'loupan') {
            var local = that.getlocalStorag();

            if (this._markerFlag) {
                div.attr('class', 'm-bd');
            } else {
                div.attr('class', 'm-point');
            }
            if (local && local.indexOf(this._info.newCode) !== -1) {
                // 已查看
                div.addClass('visited');
            }
            if (typeof this._info.newCode !== 'undefined' && '0' !== this._info.newCode) {
                div.attr('data-newCode', this._info.newCode);
            }
        }
        // 定位按钮和被选中地铁站，没有点击事件
        if (this._type !== 'subwaystation' && this._type !== 'location') {
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
                if (that._type === 'loupan') {
                    that.setlocalStorage(that._info.newCode);
                }
                MapApi.prototype.clickMarker(that._info, obj);
            });
        }
        this._map.getPanes().labelPane.appendChild(div[0]);
        return div[0];
    };
    ComplexCustomOverlay.prototype.draw = function () {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        var titlelength = '';
        if (this._type === 'subwayline') {
            titlelength = (this._info.name).length * 7.5;
            this._div.css('left', (pixel.x - titlelength) + 'px');
            this._div.css('top', pixel.y - 38 + 'px');
        } else if (this._type === 'subwaystation') {
            titlelength = (this._info.name).length * 7.5;
            this._div.css('left', (pixel.x - titlelength) + 'px');
            this._div.css('top', pixel.y - 30 + 'px');
        } else {
            this._div.css('left', pixel.x + 'px');
            this._div.css('top', pixel.y + 'px');
        }
    };
    // 使用localstorage
    ComplexCustomOverlay.prototype.setlocalStorage = function (l) {
        var local = this.getlocalStorag();
        if (l && localStorage) {
            if (local) {
                if (local.indexOf(l) == -1) {
                    local += l + ';';
                    return localStorage.setItem('soufun_xf_map', local);
                } else {
                    return local;
                }
            } else {
                return localStorage.setItem('soufun_xf_map', l + ';');
            }
        }
    };
    ComplexCustomOverlay.prototype.getlocalStorag = function () {
        if (localStorage && localStorage.soufun_xf_map) {
            return localStorage.soufun_xf_map;
        }
    };
    return MapApi;
});