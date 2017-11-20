define('modules/kanfangtuan/map', ['jquery', 'modules/map/API/BMap', 'modules/kanfangtuan/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // x坐标
        var pointx = mapinfo.CoordX;
        // y坐标
        var pointy = mapinfo.CoordY;
        // 楼盘id
        var newcode = mapinfo.Newcode;
        // 楼盘名
        var houseName = mapinfo.HouseName;
        // 楼盘图片
        var Logopic = mapinfo.Logopic;
        // 价格
        var price = mapinfo.Price;
        // 价格单位
        var pricetype = mapinfo.PriceType;
        // 结合点文字
        var description = mapinfo.Description;
        // 集合点经纬度
        var gatherLng = mapinfo.GatherLng;
        var gatherLat = mapinfo.GatherLat;
        //适应页面高度
        $('.main').css('min-height', window.innerHeight - 44);
        $('#container').css('height', window.innerHeight - 44);
        window.scrollTo(0, 1);

        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/kanfangtuan/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mnhkftmap';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId,
            // 看房团路线名称
            'vmn.seehouseline': encodeURIComponent(vars.seeHouseLine)
        };
        // 添加用户行为分析
        yhxw({type: 0, pageId: pageId, params: maiMaParams});

        var map = new BMap.Map('container', {enableMapClick: !1, minZoom:10, maxZoom:15});
        //显示的标签根据缩放比例变化
        map.addEventListener('zoomend', function () {
            var zoomLevel = map.getZoom();
            if (zoomLevel > 12) {
                $('.map-lp').show();
            } else if (zoomLevel < 12) {
                $('.map-lp').hide();
            }
        });

        //自定义覆盖物 对象
        function ComplexCustomOverlay(info, text, index, type) {
            this._point = new BMap.Point(info.lng, info.lat);
            this._text = text;
            this._index = index;
            this._type = type;
        }
        //自定义覆盖物 html结构
        ComplexCustomOverlay.prototype = new BMap.Overlay();
        ComplexCustomOverlay.prototype.initialize = function (map) {
            this._map = map;
            var that = this;
            var a, div, content;
            div = this._div = document.createElement('div');
            div.style.position = 'absolute';
            // 定义四种覆盖物 type:1红色楼盘标记点， 2矩形楼盘简介框， 3蓝色集合点， 4矩形集合点文字框
            if (this._type === 1) {
                // 红色楼盘标记点
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                content = '<a class=\'map-tag\'>' + this._text + '</a>';
                $(div).append(content);
                $(div).on('touchstart', function (event) {
                    that._startmove = new Date().getTime();
                    event.preventDefault();
                });
                $(div).on('touchend', function () {
                    var time_diff = new Date().getTime() - that._startmove;
                    if (time_diff > 200) return;
                    map.centerAndZoom(that._point, 13);
                });
            } else if (this._type === 2) {
                // 矩形楼盘简介框
                div.style.zIndex = 0;
                this._div.style.display = 'none';
                $(div).attr('class', 'map-lp');
                //$(div).attr('id', 'map-lp' + (parseInt(this._index) + 1));
                content = '<a href=\'' + vars.mainSite + 'xf/' + vars.city + '/' + newcode[this._index] + '.htm' + '\' class=\'arr-rt\'>'
                content += '<div class=\'img\'><img src=\'' + Logopic[this._index] + '\'></div>';
                content += '<div class=\'txt\'><h2 class=\'lp\'>' + houseName[this._index] + '</h2><p class=\'red-df\'>'
                    + price[this._index] + pricetype[this._index] + '</p></div>';
                content += '</a>';
                $(div).append(content);
                $(div).on('touchstart', function (event) {
                    that._startmove = new Date().getTime();
                    event.preventDefault();
                });
                $(div).on('touchend', function () {
                    var time_diff = new Date().getTime() - that._startmove;
                    if (time_diff > 200) return;
                    window.location.href = $(div).children().attr('href');
                });
            } else if (this._type === 3) {
                // 蓝色集合点
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                $(div).attr('class', 'map-wz');
                $(div).append('<span></span><i></i>');
                $(div).on('touchstart', function (event) {
                    that._startmove = new Date().getTime();
                    event.preventDefault();
                });
                $(div).on('touchend', function () {
                    var time_diff = new Date().getTime() - that._startmove;
                    if (time_diff > 200) return;
                    map.centerAndZoom(that._point, 13);               
                });
            } else if (this._type === 4) {
                // 矩形集合点文字框
                div.style.zIndex = 0;
                this._div.style.display = 'none';
                $(div).attr('class', 'map-lp');
                content = '<div class=\'img\'><img src=\'' + vars.imgUrl + 'images/kft_jhd.jpg\'></div>';
                content += '<div class=\'txt\'><h2 class=\'lp\'>' + description + '</h2></div>';
                $(div).append(content);
            }
            map.getPanes().labelPane.appendChild(div);
            return div;
        };
        //绘制自定义覆盖物 页面样式
        ComplexCustomOverlay.prototype.draw = function () {
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            if (this._type === 1 || this._type === 3) {
                this._div.style.left = pixel.x + 'px';
                this._div.style.top = pixel.y + 'px';
            } else if (this._type === 2 || this._type === 4) {
                this._div.style.left = parseInt(pixel.x) - 57 + 'px';
                this._div.style.top = parseInt(pixel.y) - 60 + 'px';
            }
        };
        // 添加自定义覆盖物 type:1，2
        for (var i = pointx.length - 1; i >= 0; i--) {
            var point = new BMap.Point(pointx[i], pointy[i]);
            var marker = new ComplexCustomOverlay(point, i + 1, i, 1);
            map.addOverlay(marker);
            var tip = new ComplexCustomOverlay(point, i + 1, i, 2);
            map.addOverlay(tip);
            // 初始化地图，设置中心点坐标和地图级别
            map.centerAndZoom(point, 11);
        }
        // 有集合点就添加集合点 type:3，4
        if (gatherLng && gatherLat) {
            var gatherPoint = new BMap.Point(gatherLng, gatherLat);
            var gatherPlace = new ComplexCustomOverlay(gatherPoint, '', 0, 3);
            map.addOverlay(gatherPlace);
            var gatherInfo = new ComplexCustomOverlay(gatherPoint, '', 0, 4);
            map.addOverlay(gatherInfo);
        }

    };
});