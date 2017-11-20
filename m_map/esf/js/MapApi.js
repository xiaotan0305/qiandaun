/**
 * 封装 Baidu 地图 API
 */
var MapApi = function() {
    var arg = arguments;
    var lng = 116.404, lat = 39.915, cont = 'allmap', zoom = 12;
    for (var i = 0; i < arg.length; i++) {
        if (0 === i)
            cont = arg[0];
        else if (1 === i)
            lat = arg[1];
        else if (2 === i)
            lng = arg[2];
        else if (3 === i)
            zoom = arg[3];
    }

    this.isClick = 0;
    this.viewAuto = false;
    this.citycenter = new BMap.Point(lng, lat);
    this.zoomPartition = 12;
    this.zoomAdapt = 15;
    this.maxDistance = 26200;
    this.container = document.getElementById(cont);
    var mapOptions = {'minZoom': 3, 'maxZoom': 18};
    var map = new BMap.Map(cont);
    map.centerAndZoom(this.citycenter, zoom);
    this._map = map;
    this._markerManager = new MarkerManager(this._map);
};
MapApi.prototype.addEvent = function(obj, eve, motion) {
    if (obj == this) {
        return this._map.addEventListener(eve, motion);
    } else {
        return obj.addEventListener(eve, motion);
    }
};
MapApi.prototype.removeEvent = function(obj, eve, motion) {
    if (obj == this) {
        return this._map.removeEventListener(eve, motion);
    } else {
        return obj.removeEventListener(eve, motion);
    }
};
MapApi.prototype.gethdBounds = function() {
    var map = this._map;
    var bounds = map.getBounds();
    var sw0 = bounds.getSouthWest();
    var ne0 = bounds.getNorthEast();
    var pointSw = map.pointToPixel(sw0);
    var sw = map.pixelToPoint(new BMap.Pixel(pointSw.x + 8, pointSw.y - 8));
    var pointNe = map.pointToPixel(ne0);
    var ne = map.pixelToPoint(new BMap.Pixel(pointNe.x - 8, pointNe.y + 8));
    return {'x1': sw.lng, 'x2': ne.lng, 'y1': sw.lat, 'y2': ne.lat};
};
MapApi.prototype.pointToPixel = function(point) {
    var map = this._map;
    return map.pointToPixel(point);
};
MapApi.prototype.pixelToPoint = function(pixel) {
    var map = this._map;
    return map.pixelToPoint(pixel);
};
MapApi.prototype.gethdRectBounds = function() {
    var me = this, map = this._map;
    if ('undefined' != typeof me._rectTool) {
        var bounds = me._rectTool.getBounds();
        if (bounds) {
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            return {'hdx1': sw.lng, 'hdx2': ne.lng, 'hdy1': sw.lat, 'hdy2': ne.lat};
        }
    }
    return false;
};
MapApi.prototype.setTipId = function(newCode) {
    this.isClick = newCode;
};
MapApi.prototype.drawMarkers = function(metaMarkers,type) {
    var me = this;
    var h = '';
    var c = '';
    for (var i = 0, l = metaMarkers.length; i < l; i++) {
        var info = metaMarkers[i];
        if (info.y && info.x) {
            var marker = me.createMarker(info);
            var markerwidth = (info.esfnum).length*7 + 24;
            marker.setHeight(23);
            marker.setWidth(markerwidth);
            
            var w = $('.md-house').width();
            var w1 = w - 60;
            h += '<li id="' + info.projcode + '" data-num="' + i + '" style="width:' + w + 'px">';
            h += '<div class="pd10 h75"><a href="' + info.firsthouse.url + '"><div class="img"><img src="' + info.firsthouse.titleimage + '"></div>';
            h += '<div class="info"><div class="tit">' + info.firsthouse.title_s + '</div>';
            h += '<p class="fgra1"><span class="flor fblu">' + info.firsthouse.price + '万元</span>' + info.firsthouse.rh + '&nbsp;&nbsp;' + info.firsthouse.buildarea + '㎡</p><p>';
            for (var j in info.firsthouse.tags) {
                if('' != info.firsthouse.tags[j]){
                    h += '<span class="tip">' + info.firsthouse.tags[j] + '</span>';
                }
            }
            h += '</p></div></a></div>';
            h += '<div class="md-else"><a class="open_houselist" data-projcode="' + info.projcode + '" href="javascript:SFMap.openHouselist(' + info.projcode + ');">查看小区其他' + info.esfnum + '条房源</a></div>';
            h += '</li>';
            c += '<li style="width:' + w1 + 'px">' + info.projname_s + '<span class="fgra1">（均价' + info.price + '元/平）</span></li>';
            
            $('#house_count_wrap').html(c);
            $('#house_detail_wrap').html(h);
        }
    }
};
MapApi.prototype.addMarker = function(marker) {
    var me = this;
    var map = me._map;
    map.addOverlay(marker);
};
MapApi.prototype.setMapType = function(mType) {
    this._map.setMapType(mType);
};
MapApi.prototype.clearMarkers = function() {
    this._markerManager.clearMarkers();
};
MapApi.prototype.clearOverlays = function() {
    this._map.clearOverlays();
};
//注意对地图进行移动操作时，如果不想重新搜索，应该先把SFMap中的isDragend置成false
//重新设置地图中心点
MapApi.prototype.setCenter = function(y, x, zoom) {
    if (!y || !x)
        return;
    var zoom = zoom || this._map.getZoom();
    this._map.centerAndZoom(new BMap.Point(x, y), zoom);
};
MapApi.prototype.getCenter = function() {
    return this._map.getCenter();
};
MapApi.prototype.getCityCenter = function() {
    return this.citycenter;
};
MapApi.prototype.getZoom = function() {
    return this._map.getZoom();
};
MapApi.prototype.panBy = function(posX, posY) {
    this._map.panBy(posX, posY);
};
MapApi.prototype.panTo = function(x, y) {
    if (!y || !x)
        return;
    this._map.panTo(new BMap.Point(x, y));
};
MapApi.prototype.createMarker = function(info, type) {
    var me = this;
    var map = me._map;
    var latLng = new BMap.Point(info.x, info.y);
    if (me.getZoom() > 15) {
        var ltext = '<p>' + info.esfnum + '套|' + parseInt(info.price) + '元/平</p>';
    } else {
        var ltext = '<p>' + info.esfnum + '套</p>';
    }
    
    var titlelength = (info.esfnum).length;
    var offsetwidth = -6 - parseInt(titlelength*3.5);
    var offset_new = new BMap.Size(offsetwidth,-27);
    var mdiv = document.createElement("div");
    mdiv.setAttribute("class","t-name");
    mdiv.setAttribute("id","tip"+info.projcode);
    mdiv.innerHTML = ltext;
    var marker = new BMapLib.RichMarker(mdiv, latLng, {'anchor': offset_new});
    marker.provalue = info;
    me.addMarker(marker);
    marker.addEventListener('onclick',function(){me.clickMarker(marker);});
    return marker;
};
//隐藏标点的 DIV 元素
MapApi.prototype.clickMarker = function(marker) {
    if ('undefined' == typeof (marker.provalue.projcode))
        return;
    SFMap.toggleDrag(true);
    $('#open_houselist').html('查看小区其他'+marker.provalue.esfnum+'条房源');
    $('#proj_tip').html(marker.provalue.projname_s+'<span class="f12 fgra1">（均价'+marker.provalue.price+'元/平）</span>');
    SFMap.clickOverlay(marker.provalue.projcode);
    SFMap.openHouseDetail(marker.provalue.projcode);
};
MapApi.prototype.panMap = function(markerBounds, hiddenMarker) {
    var me = this;
    var map = me._map;
    var hiddenMarker = hiddenMarker || false;
    var viewPort = map.getViewport([markerBounds.getSouthWest(), markerBounds.getNorthEast()]);
    if (hiddenMarker)
        viewPort.zoom = viewPort.zoom > me.zoomPartition + 1 ? viewPort.zoom : me.zoomPartition + 1;
    if (me.viewAuto) {
        map.centerAndZoom(viewPort.center, viewPort.zoom);
        me.viewAuto = false;
    } else {
        var mapBounds = map.getBounds();
        if (mapBounds.containsBounds(markerBounds)) {
            return;
        }
        map.centerAndZoom(viewPort.center, viewPort.zoom);
    }
};
MapApi.prototype.setViewAuto = function(flg) {
    this.viewAuto = flg;
};
MapApi.prototype.setZoom = function(zoom) {
    var zoom = parseInt(zoom);
    this._map.setZoom(zoom);
};
MapApi.prototype.addOverlay = function(o) {
    this._map.addOverlay(o);
};
MapApi.prototype.removeOverlay = function(o) {
    this._map.removeOverlay(o);
};

function MarkerManager(map) {
    this._markers = [];
    this._map = map;
}
MarkerManager.prototype.addMarker = function(marker) {
    this._markers.push(marker);
    this._map.addOverlay(marker);
};
MarkerManager.prototype.clearMarkers = function(marker) {
    while (this._markers.length > 0)
        this._map.removeOverlay(this._markers.shift());
};

//自定义覆盖物
function RectangleOverlay(mapPoint, html, className, id) {
    this._mapPoint = mapPoint;
    this._html = html;
    this._className = className;
    this._id = id;
}
RectangleOverlay.prototype = new BMap.Overlay(); // 继承Overlay
RectangleOverlay.prototype.initialize = function(map) {
    this._map = map;
    
    var div = document.createElement("div");
    div.className = this._className;
    if(this._id){
        div.id = 'tip' + this._id;
    }
    div.style.zIndex = BMap.Overlay.getZIndex(this._mapPoint.lat);
    div.innerHTML = this._html;
        
    map.getPanes().labelPane.appendChild(div);
    this._div = div;
    return div;
};
RectangleOverlay.prototype.draw = function() {
    var pixel = this._map.pointToOverlayPixel(this._mapPoint);
    // 计算矩形偏移
    var style = window.getComputedStyle(this._div);
    var overlayHeight = parseInt(style.height, 10);
    var overlayWidth = parseInt(style.width, 10);
    this._div.style.left = (pixel.x - overlayWidth/2 -6) + 'px';
    this._div.style.top = (pixel.y - overlayHeight-12) + 'px';
};
RectangleOverlay.prototype.addEventListener = function (event, fun) {
    this._div[event] = fun;
};