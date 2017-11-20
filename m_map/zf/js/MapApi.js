define('MapApi', ['jquery', 'BMap'], function(require, exports, module) {
	var $ = require('jquery'),vars = seajs.data.vars;
	var MapApi = function() {
		var arg = arguments;
		var lng = 116.404,
			lat = 39.915,
			cont = 'mapObj',
			zoom = 11;
		for (var i = 0; i < arg.length; i++) {
			if (0 == i)
				cont = arg[0];
			else if (1 == i)
				lat = arg[1];
			else if (2 == i)
				lng = arg[2];
			else if (3 == i)
				zoom = arg[3];
		}

		this.citycenter = new BMap.Point(lng, lat);
		this.zoomPartition = 11;
		this.zoomAdapt = 15;
        this.zoom = zoom;
		this.container = $('#' + cont);
		var mapOptions = {
			'minZoom': 3,
			'maxZoom': 19
		};
		var map = new BMap.Map(cont, mapOptions);
		map.centerAndZoom(this.citycenter, zoom);
		this._map = map;
        this._markerManager = new MarkerManager(this._map);
        //用来存储当前页面上所有点的信息
        this.markerList = {};
	};
    function MarkerManager(map) {
        this._markers = [];
        this._map = map;
    }
    MarkerManager.prototype={
        addMarker:function(marker) {
            this._markers.push(marker);
            this._map.addOverlay(marker);
        },
        clearMarkers:function(marker) {
            while (this._markers.length > 0)
                this._map.removeOverlay(this._markers.shift());
        }
    }

	MapApi.prototype ={
		addEvent:function(obj, eve, motion) {
		    if (obj == this) {
		        return this._map.addEventListener(eve, motion);
		    } else {
		        return obj.addEventListener(eve, motion);
		    }
		},
        clearMarkers : function() {
            this._markerManager.clearMarkers();
        },
		removeEvent :function(obj, eve, motion) {
		    if (obj == this) {
		        return this._map.removeEventListener(eve, motion);
		    } else {
		        return obj.removeEventListener(eve, motion);
		    }
		},
		setCenter:function(y, x, zoom){
            if (!y || !x)
                return;
            var zoom = zoom || this._map.getZoom();
            this._map.centerAndZoom(new BMap.Point(x, y), parseInt(zoom));
        },
        clearOverlays:function(){
            this._map.clearOverlays();
        },
		gethdBounds : function() {
		    var map = this._map;
		    var bounds = map.getBounds();
		    var sw0 = bounds.getSouthWest();
		    var ne0 = bounds.getNorthEast();
		    var pointSw = map.pointToPixel(sw0);
		    var sw = map.pixelToPoint(new BMap.Pixel(pointSw.x + 8, pointSw.y - 8));
		    var pointNe = map.pointToPixel(ne0);
		    var ne = map.pixelToPoint(new BMap.Pixel(pointNe.x - 8, pointNe.y + 8));
		    return {'x1': sw.lng, 'x2': ne.lng, 'y1': sw.lat, 'y2': ne.lat};
		},
		clickMarker:function(info){
			require.async('zfMap',function(zfMap){
                zfMap.clickSign =true;
				if(info.district){
					zfMap.params.district = info.district;
                    $('#district span').html(info.district);
				}
                if(info.comarea){
                    zfMap.params.comarea = info.comarea;
                    $('#district span').html(info.comarea);
                }
                if('0'!=info.projcode){
                    zfMap.openHouseDetail(info.projcode);
                }else{
                    zfMap.moveSign = false;
                    zfMap.searchResult();
                }
            });
		},
        pixelToPoint : function(pixel) {
            var map = this._map;
            return map.pixelToPoint(pixel);
        },
        getCityCenter : function() {
            return this.citycenter;
        },
        pointToPixel : function(point) {
            var map = this._map;
            return map.pointToPixel(point);
        },
		setZoom:function(zoom){
            var zoom = parseInt(zoom);
            this._map.setZoom(zoom);
        },
        getZoom:function(){
            return this._map.getZoom();
        },
		createMarker:function(info) {
		    var me = this;
            if('0'!=info.projcode){
                var ltext = '<p>'+info.housecount+'套</p>';
            }else if (info.comarea){
                ltext = '<p>' + info.comarea +'<br>'+info.housecount+'套</p>';
            }else{
		        ltext = '<p>' + info.district +'<br>'+info.housecount+'套</p>';
		    }
            var marker = new ComplexCustomOverlay(info, ltext);
		    me.addMarker(marker);
		    return marker;
		},
		panMap:function(markerBounds, markers){
            var me = this;
            var map = me._map;
            var viewPort = map.getViewport(markers), center = markerBounds.getCenter(),zoom =viewPort.zoom;
            require.async('zfMap',function(zfMap){
                if(zfMap.params.district&&!zfMap.params.comarea){
                    zoom = 14;
                }else if(!zfMap.params.district&&!zfMap.params.comarea){
                    zoom = 11;
                }
                map.setZoom(zoom);
            });
        },
		addMarker:function(marker){
            var me = this;
            var map = me._map;
            map.addOverlay(marker);
        },
        touchSign:false,
        isLoad:false,
        onePageListNumber:20,
        load:function($li){
            var me = this;
            var nowListNumber=$li.attr("data-listNumber")||0;
            if(nowListNumber<me.onePageListNumber)return;
            if(nowListNumber=="total")return;
            me.isLoad=true;
            var page=$li.attr("data-page")||1;
            page++;
            require.async("zfMap",function(zfmap){
               zfmap.searchResult($li.attr('id'),page,function(data){
                   if(data&&data.list&&data.list.length){
                       me.drawHouseDetail(data.list);
                       $li.attr("data-page",page);
                       var nowTotalListNumber=parseInt($li.attr("data-listNumber"))+parseInt(data.rnum);
                       if(nowTotalListNumber>=data.total){
                           nowTotalListNumber="total";
                       }
                       $li.attr("data-listNumber",nowTotalListNumber);
                       me.isLoad=false;
                   }
               });
            });
        },
        drawHouses:function(houses){
            var me = this,l = houses.length,h=[],c=[];
            var w = $(window).width();
            var w1 = w - 60;
            for(var i=0;i<l;i++){
                var info = houses[i];
                h.push('<li id="' + info.projcode + '" data-num="' + i + '" style="width:' + w + 'px"></li>')
                if(info.projname&&info.projname.length>8){
                    info.projname = info.projname.substring(0,7)+'...';
                }
                c.push('<li id="projname_' + info.projcode + '" style="width:' + w1 + 'px">' + info.projname+ '</li>');
            }
            $('#house_count_wrap').html(c.join(''));
            $('#house_detail_wrap').html(h.join(''));
            $('#houselist li').on("scroll",function(e){
                e.preventDefault();
                var ele = $(this);
                var scrollh = ele.height();
                var totalHeight=$(ele.children()[0]).height()*ele.children().length;
                if(!me.isLoad &&ele.scrollTop() >= totalHeight-scrollh){
                    me.load(ele);
                }
            });
            require.async('zfMap',function(zfMap){
                zfMap.moveSign =true;
            });
        },
        drawHouseDetail:function(markers,rnum){
            var me = this,newcode ='', projcodeLi,h=[],l=markers.length;
            for(var i = 0;i<l;i++){
                if(i==0){
                    newcode = markers[0].projcode;
                    projcodeLi=$('#'+newcode)
                }
                var info = markers[i],roomhall='',tags=[];
                h.push('<div class="zu-item"><a href="' + vars.mainSite+'zf/'+vars.city+'/'+info.housetype+'_'+info.houseid+'.html"><div class="img"><img src="'+info.titleimage+'" alt=""></div>');
                if(parseInt(info.room)){
                    roomhall+=info.room+'室';
                }
                if(parseInt(info.hall)){
                    roomhall+=info.hall+'厅';
                }
                if(info.title.length>15){
                    info.title = info.title.substring(0,14)+'...';
                }
                if(info.projname.length>8){
                    info.projname = info.projname.substring(0,7)+'...';
                }
                h.push('<div class="txt"><h3>'+info.title+'</h3><p><span class="new">'+Math.round(info.price)+info.pricetype+'</span>'+roomhall+'</p>');
                h.push('<p>'+info.district+' - '+info.projname+'</p>');
                h.push('<div class="stag">');
                tags = info.tags.split(' ');
                var tagsl=tags.length;
                if(tagsl>0){
                    for(var j=0;j<tagsl;j++){
                        if(tags[j]){
                            h.push('<span class="t5">'+tags[j]+'</span>');
                        }
                    }
                }
                h.push('</div></div></a></div>');
            }
            projcodeLi.append(h.join(''));
            var chil = projcodeLi.children().length,h=0;
            if(chil<3){
                $('#house_detail_wrap').height(chil*92);
                h=chil*92;
            }else{
                $('#house_detail_wrap').height(276);
                h=276;
            }
            require.async('zfMap',function(zfMap){
                zfMap.clickOverlay(newcode,h);
            });
            rnum&&projcodeLi.attr("data-listNumber",rnum);
            $('#loading').hide();
        },
		drawMarkers :function(markers,rnum) {
			var me = this,l = markers.length,bounds = new BMap.Bounds(),point,arr_Markers=[];
			for(var i=0;i<l;i++){
				var info = markers[i];
                if('undefined'== typeof markers[0].title){
                    if(parseInt(info.mapx)&&parseInt(info.mapy)){
                        point = new BMap.Point(info.mapx, info.mapy);
                        arr_Markers.push(point);
                        bounds.extend(point);
                        me.createMarker(info);
                        if('0'!=info.projcode&&'undefined'== typeof markers[0].title){
                            me.markerList[info.projcode] = info;
                        }
                    }
                }
			}
            if(markers&&markers.length&&'0'!=markers[0].projcode){
                if('undefined'!= typeof markers[0].title){
                    me.drawHouseDetail(markers,rnum);
                }else{
                    me.drawHouses(markers);
                }
            }
		}
	};
    // 复杂的自定义覆盖物
    function ComplexCustomOverlay(info, text){
        this._point = new BMap.Point(info.mapx, info.mapy);
        this._text = text;
        this._info = info;
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize =function(map){
        this._map = map;
        var div = this._div = $('<div></div>');
        div.attr('class','t-name');
        div.css('zIndex',BMap.Overlay.getZIndex(this._point.lat));
        div.append(this._text);
        if('0'!=this._info.projcode){
            div.attr("id","tip"+this._info.projcode);
        }
        div.attr('data-district',this._info.district);
        div.attr('data-comarea',this._info.comarea);
        div.attr('data-projcode',this._info.projcode);
        div.on('touchend',function(){
            var obj = $(this),info={};
            info.district = obj.attr('data-district');
            info.comarea = obj.attr('data-comarea');
            info.projcode = obj.attr('data-projcode');
            MapApi.prototype.clickMarker(info);
        });
        this._map.getPanes().labelPane.appendChild(div[0]);
        return div[0];
    };
    ComplexCustomOverlay.prototype.draw =function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.css('left' ,pixel.x  + "px");
        this._div.css('top', pixel.y - 30 + "px");
    };
	return MapApi;
});