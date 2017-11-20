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
    var map = new BMap.Map(cont, mapOptions);
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
        if ('undefined' != typeof info.newCode) {
            if (info.y && info.x) {
                var marker = me.createMarker(info);
                me.addMarker(marker);
                var markerwidth = (info.title_s).length*12 + 12;
                marker.setHeight(23);
                marker.setWidth(markerwidth);
            }
            var w = $('.md-house').width();
            var w1 = w - 60;
            h += '<li id="' + info.newCode + '" data-num="' + i + '" style="width:'+w+'px">';
            h += '<div class="imgbox"><a href="'+info.m_houseurl+'"><img src="' + info.picAddress + '"></a>';
            h += '<div class="intro"><div class="tit"><span class="flor">￥' + info.price + '</span>' + info.title_s + '</div>';
            h += '<p class="pos">' + info.address_s + '</p></div>';
            h += '</div></li>';
            c += '<li style="width:'+w1+'px">第' + (i + 1) + '个  共' + l + '个楼盘</li>';
            $('#house_count_wrap').html(c);
            $('#house_detail_wrap').html(h);
        } else if(1 == type){
            if (info.y && info.x) {
                var marker = me.createMarker(info,type);
                me.addMarker(marker);
                var markerwidth = (info.num).length*7 + 48;
                marker.setHeight(40);
                marker.setWidth(markerwidth);
            }
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
    if (1 == type) {
        var ltext = '<p>' + info.name + '<br>' + info.num + '个楼盘</p>';
        var mdiv = document.createElement("div");
        mdiv.setAttribute("class",'t-name');
        mdiv.innerHTML = ltext;
        var titlelength = (info.num).length;
        var offsetwidth = -18 - parseInt(titlelength*3.5);
        var offset_new = new BMap.Size(offsetwidth,-44);
    } else {
        var ltext = '<p>' + info.title_s + '</p>';
        var titlelength = (info.title_s).length;
        var offsetwidth = - titlelength*6;
        var offset_new = new BMap.Size(offsetwidth,-27);
        var mdiv = document.createElement("div");
        mdiv.setAttribute("class","t-name");
        mdiv.setAttribute("id","tip"+info.newCode);
        mdiv.innerHTML = ltext;
    }
    var marker = new BMapLib.RichMarker(mdiv, latLng, {'anchor': offset_new});
    marker.provalue = info;
    if('undefined' != typeof info.newCode) {
        marker.addEventListener('click',function(){me.clickMarker(marker);});
    } else{
        marker.addEventListener('click',function(){SFMap.gotoDistrict(info.name,info.x,info.y);});
    }
    return marker;
};
//隐藏标点的 DIV 元素
//newCode 楼盘 ID
MapApi.prototype.hideMarker = function(newCode) {
    var nodeId = 'tip' + newCode;
    var mNode = $id(nodeId);
    if (mNode) {
        var domMark = mNode.parentNode;
        domMark.style.display = 'none';
    }
};
MapApi.prototype.clickMarker = function(marker) {
    if ('undefined' == typeof (marker.provalue.newCode))
        return;
    SFMap.toggleDrag(true);
    SFMap.clickMarker(marker.provalue.newCode);
    SFMap.openHouseDetail(marker.provalue.newCode);
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