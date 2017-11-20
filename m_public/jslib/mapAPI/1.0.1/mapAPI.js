/**
 *
 * @author 赵天亮(zhaotianliang@fang.com)
 * @modifed by  袁辉辉(yuanhuihui@fang.com) 2016年10月25日10:10:35
 * 地图基本功能插件  描点操作 拖拽操作  缩放操作
 */
define('mapAPI/1.0.1/mapAPI', ['jquery', 'modules/map/API/1.0.1/BMap'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    /*
     * MapAPI 初始化地图容器
     * 参数地图基本信息
     * lng 地图中心点经度
     * lat 地图中心点纬度
     * container 存放地图容器的ID,默认allmap
     * isSetSize 是否设置地图大小,默认不设置
     * minZoom缩放级别最小值,默认3
     * maxZoom缩放级别最大值,默认19
     * zoom 地图缩放等级,默认12
     * isBindEvent 布尔值 拖拽缩放开关,默认false
     * markerData 描点信息,支持数据数组和ajax请求参数两种格式
     * autoSize 是否自适应显示,默认自适应
     * isBindEvent 是否绑定拖拽\缩放事件,默认不绑定
     * markerFunc  对覆盖物的操作, 此函数参数为BMap实例,可在回调中使用BMap的相关函数
     * dragFunc   拖拽地图时的操作, 此函数参数为mapApi实例,可在回调中使用相关函数
     * zoomFunc   缩放地图时的操作, 此函数参数为mapApi实例,可在回调中使用相关函数
     * prop.latProp 存放维纬度的变量名 默认Lat
     * prop.lngProp 存放经度的变量名 默认Lng
     * prop.ajaxataArrayProp ajax完成后返回结果中存放描点信息数组的的变量名, 若不传入,则表示直接返回了描点信息数组
     * prop.cusDom 存放自定义描点dom的变量,也可以是返回dom字符串的一个函数
     * otherOperation  ajax回调对地图以外页面操作
     */
    var MapApi = function (options) {
        var that = this;
        if (options.lng && options.lat) {
            that.lng = options.lng;
            that.lat = options.lat;
        } else {
            // 默认天安门
            that.lng = 116.404;
            that.lat = 39.915;
        }
        that.lngProp = options.prop.lngProp || 'Lng';
        that.latProp = options.prop.latProp || 'Lat';
        that.ajaxDataArrayProp = options.prop.ajaxDataArrayProp;
        that.cusDom = options.prop.cusDom || 'cusDom';
        that.container = options.container || 'allmap';
        that.isSetSize = options.isSetSize || !1;
        that.zoom = options.zoom || 12;
        that.citycenter = new BMap.Point(that.lng, that.lat);
        // 缩放级别的最大最小值
        var mapOptions = {
            minZoom: options.minZoom || 3,
            maxZoom: options.maxZoom || 19
        };
        // 设置地图的高
        that.isSetSize && that.setHeight();
        var map = new BMap.Map(that.container, mapOptions);
        map.centerAndZoom(that.citycenter, that.zoom);
        // 增加缩放控件:调试使用
        that.getQueryString('debug') && map.addControl(new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
        }));
        // 是否添加地图类型控件
        if (options.mapType) {
            map.addControl(new BMap.MapTypeControl());
        }

        that.map = map;
        // map.disableDragging();
        that.markerManager = new MarkerManager(that.map);
        that.isBindEvent = options.isBindEvent || false;
        that.autoSize = options.autoSize? true: false;
        that.markerData = options.markerData || '';
        that.markerFunc = options.markerFunc || null;
        that.dragFunc = options.dragFunc || null;
        that.zoomFunc = options.zoomFunc || null;
        that.otherOperation = options.otherOperation || null;
        if (typeof that.markerData === 'object' && !$.isArray(that.markerData)) {
            that.buildMarkers(that.markerData.data, that.autoSize);
        } else if ($.isArray(that.markerData)) {
            that.drawMarkers(that.markerData, that.autoSize, '', that.markerFunc);
        }
        // 默认不拖拽搜索
        if (that.isBindEvent) {
            // 拖拽结束标识
            that.isDragEnd = !1;
            // 缩放结束标识
            that.isZoomEnd = !1;
            map.addEventListener('dragstart', function () {
                that.isDragEnd = !0;
            });
            map.addEventListener('dragend', function () {
                // 拖拽结束开始搜索
                if (that.isDragEnd && that.dragFunc) {
                    that.isDragEnd = !1;
                    that.dragFunc(that);
                }
            });
            // 缩放开始
            map.addEventListener('zoomstart', function () {
                that.isZoomEnd = !0;
                that.startZoom = that.getZoom();
            });
            // 缩放结束
            map.addEventListener('zoomend', function () {
                if (/*that.isZoomEnd && */that.zoomFunc) {
                    /*that.isZoomEnd = !1;*/
                    that.zoomFunc(that);
                }
            });
        }
    };

    // 能地图上marker可操控
    function MarkerManager(map) {
        this.markers = [];
        this.map = map;
    }

    MapApi.prototype = {
        // 用来存放point(经纬度)
        markers: [],
        /**
         * ajax获取点数据及描点
         * @param newData ajax时候更新的新的参数
         * @param isAutoView 是否自适应
         */
        buildMarkers: function (newData, isAutoView) {
            var that = this;
            if (that.ajax) {
                // ajax终止
                that.ajax.abort();
            }
            this.ajax = $.ajax({
                url: that.markerData.url,
                type: that.markerData.type || 'GET',
                dataType: 'json',
                data: newData || {}
            }).done(function (data) {
                that.ajaxData = data;
                if (that.otherOperation) {
                    that.otherOperation(data);
                }
                var List = that.ajaxDataArrayProp ? data[that.ajaxDataArrayProp] : data;
                that.drawMarkers(List, isAutoView, '', that.markerFunc);
            });
        },
        // 设置地图中心点
        setCenter: function (y, x, zoom) {
            if (!y || !x) {
                return;
            }
            var mapZoom = zoom || this.map.getZoom();
            this.map.centerAndZoom(new BMap.Point(x, y), parseInt(mapZoom));
        },
        // 自适应显示地图
        setViewport: function () {
            if (this.markers.length) {
                this.map.setViewport(this.markers);
            }
        },
        // 获取地图缩放等级
        getZoom: function () {
            return this.map.getZoom();
        },
        // 将覆盖物添加到百度地图
        addMarker: function (marker) {
            var that = this;
            that.markerManager.markers.push(marker);
            this.map.addOverlay(marker);
        },
        // 生成地图覆盖物
        createMarker: function (info, ltext) {
            var that = this;
            // var marker = new ComplexCustomOverlay(info, ltext, this);
            var offset_new = new BMap.Size(0, 0);
            var latLng = new BMap.Point(info[that.lngProp], info[that.latProp])
            var marker = new BMapLib.RichMarker(ltext, latLng, {
                anchor: offset_new
            });
            marker.provalue = info;
            this.addMarker(marker);
            return marker;
        },
        // 动态设置地图大小
        setHeight: function () {
            var that = this, $header = $('header');
            // 减去header的高度
            var hHeader = $header.length ? $header.height() : 0;
            var $window = $(window),
                height = $window.height() - hHeader,
                width = $window.width();
            var mapContainer = $('#' + that.container);
            mapContainer.css({
                width: width,
                height: height
            });
        },
        drawMarker: function (lnglat, domText) {
            var that = this;
            if (!lnglat) {
                return;
            }
            return that.createMarker(lnglat, domText);
        },
        // 通过参数markers得到每个point的经纬度 并在point处生成自定义覆盖物;isAutoSize表示是否自适应
        /**
         * 描点到地图
         * @param markers 点的元数据,为数组
         * @param isAutoView 是否自适应
         */
        drawMarkers: function (markers, isAutoView, newdom, markerFunc) {
            var that = this;
            that.clearOverlays();
            if (!markers || !markers.length) {
                return;
            }
            var bounds = new BMap.Bounds();
            var point;
            for (var i = 0, l = markers.length; i < l; i++) {
                var info = markers[i];
                if (!parseInt(info[that.lngProp]) || !parseInt(info[that.latProp])) {
                    continue;
                }
                point = new BMap.Point(info[that.lngProp], info[that.latProp]);
                that.markers.push(point);
                bounds.extend(point);
                // 自定义覆盖物
                var ltextDefault = ''
                    + '<div class="item_circum" style="position:absolute;">'
                    + '<a class="circum" style="position:relative;display:block;width:19px;height:30px;'
                    + 'background:url(' + vars.public + '201511/images/map_icon_mark.png) no-repeat;color:#fff;text-align:center;line-height:22px;" '
                    + '></a>'
                    + '</div>';
                var htmlMarker = typeof that.cusDom === 'string' && info[that.cusDom] ? info[that.cusDom] : '';
                // 如果有定义好的自定义描点dom则优先使用,否则找回调函数拼,两者如果都没有则用默认
                htmlMarker = !htmlMarker && that.cusDom && typeof that.cusDom === 'function' ? that.cusDom(info) : ltextDefault;
                if (newdom) {
                    htmlMarker = newdom;
                }
                that.createMarker(info, htmlMarker);
            }

            // 自动适应显示
            if (isAutoView) {
                that.setViewport();
            }
            // 描点完成后执行描点点击事件
            if (markerFunc) {
                markerFunc.apply(null, [that.map]);
            }

        },
        //  清除单个标点
        removeOverlay: function (overlay) {
            var that = this;
            that.markerManager.markers.forEach(function (el) {
                if (overlay === el) {
                    that.map.removeOverlay(overlay);
                    that.markerManager.markers.splice($.inArray(el, that.markerManager.markers), 1);
                }
            });
        },
        // 清除地图上数据
        clearOverlays: function () {
            this.markerManager.markers = [];
            this.map.clearOverlays();
        },
        // 获取四角坐标
        gethdBounds: function () {
            var map = this.map, bounds = map.getBounds(), result = {};
            var sw0 = bounds.getSouthWest(), ne0 = bounds.getNorthEast(), pointSw = map.pointToPixel(sw0),
                sw = map.pixelToPoint(new BMap.Pixel(pointSw.x, pointSw.y)), pointNe = map.pointToPixel(ne0),
                ne = map.pixelToPoint(new BMap.Pixel(pointNe.x, pointNe.y));
            if (sw.lng > ne.lng) {
                result.MinLng = ne.lng;
                result.MaxLng = sw.lng;
            } else {
                result.MinLng = sw.lng;
                result.MaxLng = ne.lng;
            }
            if (sw.lat > ne.lat) {
                result.MinLat = ne.lat;
                result.MaxLat = sw.lat;
            } else {
                result.MinLat = sw.lat;
                result.MaxLat = ne.lat;
            }
            return result;
        },
        //  获取参数
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);
            if (r) {
                return decodeURIComponent(r[2]);
            } else {
                return '';
            }
        }
    };
    module.exports = MapApi;
});
