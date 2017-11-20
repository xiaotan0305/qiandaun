define('zfMap', ['jquery'], function(require, exports, module) {
	var $ = require('jquery'),vars = seajs.data.vars;
	var zfMap = {
		params: {
			page:1,
			pagesize:20,
			x1:'116.430739',
			y1:'39.935943',
			x2:'116.454454',
			y2:'39.960419',
			purpose:'\u4f4f\u5b85',
			price:'',
			district:'',
			comarea:'',
			housetype:'',
            room:'',
            zoom:0
		},
        //定位
        locationMap: function() {
            var geolocation = new BMap.Geolocation(),me= this;
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var gc = new BMap.Geocoder();
                    gc.getLocation(r.point, function(rs) {
                        var addComp = rs.addressComponents;
                        if ((addComp.city).indexOf(vars.cityname) > -1) {
                            me.map.clearOverlays();
                            var mk = new BMap.Marker(r.point);
                            mk.disableMassClear();
                            me.map.addMarker(mk);
                            if(me.params.zoom==14||me.params.zoom==15){
                                me.moveSign = false;
                                me.map._map.centerAndZoom(r.point,15);
                                me.zoomResult('pos');
                            }else{
                                me.moveSign = false;
                                me.map._map.centerAndZoom(r.point,15);
                            }

                        } else {
                            showPrompt('定位与当前城市不一致，请切换城市');
                            return ;
                        }
                    });
                } else {
                    me.map.centerAndZoom(me.map.citycenter,11);
                    me.searchResult();
                    showPrompt('获取位置信息失败');
                    return ;
                }
            }, {enableHighAccuracy: true});
        },
        openHouseDetail: function(newcode) {
            var me = this,maptip=$('#maptip');
            if(maptip.css('display')=='block'){
                maptip.hide();
            }
            $('#search').hide();
            $('#house_detail').show();
            var newcodeObj = $('#' + newcode),num = +newcodeObj.data('num'),width = +newcodeObj.width(),
                widthTitle = width - 60,left = -num * width,leftTitle = -num * widthTitle,
                house_count_wrap = $('#house_count_wrap'),house_detail_wrap=$('#house_detail_wrap');
            chosenum = num;
            house_count_wrap.css('transition-duration', '0s');
            house_detail_wrap.css('transition-duration', '0s');
            house_count_wrap.css('left', leftTitle + 'px');
            house_detail_wrap.css('left', left+'px');
            var st = setTimeout(function(){
                house_count_wrap.css('-webkit-transition-duration', '0.8s');
                house_detail_wrap.css('-webkit-transition-duration', '0.8s');
                clearTimeout(st);
            },100);
            me.moveSign=false;
            if(!newcodeObj.children().length){
                $('#loading').show();
                me.searchResult(newcode);
            }else{
                var chil = newcodeObj.children().length,h=0;
                if(chil<3){
                    house_detail_wrap.height(chil*92);
                    h=chil*92;
                }else{
                    house_detail_wrap.height(276);
                    h=276;
                }
                zfMap.clickOverlay(newcode,h);
            }
        },
        setMarkerCenter: function(point,h) {
            var me = this,pixel = me.map.pointToPixel(point),differ=0;
            differ = (h+37)/2;
            pixel.y = pixel.y + differ;
            var center = this.map.pixelToPoint(pixel);
            me.map._map.panTo(center);
        },
		/**
		 *  初始化页面参数
		 */
		initParams:function(){
			var me = this,params = me.params;
			if(vars){
				for(var key in params){
					if(vars[key]){
						params[key] = vars[key];
					}
				}
			}
            //显示控制
            var district = vars.comarea||vars.district;
            if(district){
                $('#district span').html(district);
            }
            if(vars.housetype){
                $('#housetype_div').find('a').each(function(){
                    var ele = $(this);
                    if(ele.attr('name')==vars.housetype){
                        $('#housetype span').html(ele.html());
                    }
                });
            }
            if(vars.price){
                $('#price_div').find('a').each(function(){
                    var ele = $(this);
                    if(ele.attr('name')==vars.price){
                        $('#price span').html(ele.html());
                    }
                });
            }
            if(vars.room){
                $('#room_div').find('a').each(function(){
                    var ele = $(this);
                    if(ele.attr('name')==vars.room){
                        $('#room span').html(ele.html());
                    }
                });
            }
		},
        setZoom:function(x){
            var me=this,nowzoom = parseInt(me.map.getZoom());
            var tozoom = x;
            if ('+' === x) {
                    tozoom = nowzoom + 1;

            } else if ('-' === x) {
                    tozoom = nowzoom - 1;
            }
            if(tozoom>19){
                showPrompt('已放至最大');
                return ;
            }else if(tozoom< 3){
                showPrompt('已缩至最小');
                return ;
            }
            me.map.setZoom(tozoom);
        },
        zoomResult:function(sign){
            var me = this,thisZoom = me.map.getZoom(),maptip=$('#maptip');
            if(maptip.css('display')=='block'){
                maptip.hide();
            }
            /* 拷贝目前搜索条件 */
            var params = $.extend({}, me.params);
            params.zoom = thisZoom;
            me.params.zoom = thisZoom;
            var searchBounds = me.map.gethdBounds();
            for(var key in searchBounds){
                if (typeof (searchBounds[key]) != "function" && searchBounds[key]) {
                    params[key] = searchBounds[key];
                }
            }
            if(sign!='pos'){
                me.map.clearOverlays();
            }
            params.a = 'ajaxZfMapSearch';
            params.city = vars.city;
            var onComplete = function(result){
                if(result&&result.list&&result.list.length){
                    me.map.drawMarkers(result.list,result.rnum);
                }else{
                    alert('地图可视范围内无房源，请滑动地图');
                    setTimeout(function(){
                        me.moveSign = true;
                    },100)
                }
            };
            var onFailure = function(e){
                me.moveSign = true;
            };
            var options = {
                url:vars.ajaxUrl,
                type:'get',
                dataType:"json",
                data:params,
                success:onComplete,
                error:onFailure
            };
            $.ajax(options);
        },
		searchResult:function(projcode,page,comFunc){
			var me = this,thisZoom = me.map.getZoom(),maptip=$('#maptip');
            if(maptip.css('display')=='block'){
                maptip.hide();
            }
			/* 拷贝目前搜索条件 */
			var params = $.extend({}, me.params);
            if(params.comarea||params.housetype||params.room||params.price){
                params.zoom = 16;
                me.params.zoom = 16;
                if(params.comarea){
                    $('#comarea_section').find('a').each(function(){
                        var ele = $(this);
                        if(ele.html()==params.comarea){
                            var eleName = ele.attr('name'),mapArr=eleName.split(',');
                            if(!projcode){
                                me.map.setCenter(mapArr[1],mapArr[0],16);
                            }
                        }
                    });
                }
                if(params.district&&!params.comarea){
                    $('#district_section').find('a').each(function(){
                        var ele = $(this);
                        if(ele.html()==params.district){
                            var eleName = ele.attr('name'),mapArr=eleName.split(',');
                            if(!projcode){
                                me.map.setCenter(mapArr[1],mapArr[0],16);
                            }
                        }
                    });
                }
            }else if(params.district&&!params.comarea){
                params.zoom = 14;
                me.params.zoom = 14;
                $('#district_section').find('a').each(function(){
                    var ele = $(this);
                    if(ele.html()==params.district){
                        var eleName = ele.attr('name'),mapArr=eleName.split(',');
                        if(!projcode){
                            me.map.setCenter(mapArr[1],mapArr[0],14);
                        }
                    }
                });
            }else{
                params.zoom = thisZoom;
                me.params.zoom = thisZoom;
            }
            var searchBounds = me.map.gethdBounds();
            for(var key in searchBounds){
                if (typeof (searchBounds[key]) != "function" && searchBounds[key]) {
                    params[key] = searchBounds[key];
                }
            }
            if(projcode&&projcode!='drag'){
                params.projcodes = projcode;
            }else{
                me.map.clearOverlays();
            }
            if(page){
                params.page=page;
            }
            me.zoom = params.zoom;
            params.a = 'ajaxZfMapSearch';
            params.city = vars.city;
			var onComplete = function(result){
				if(result&&result.list&&result.list.length){
					me.map.drawMarkers(result.list,result.rnum);
				}else{
                    alert('地图可视范围内无房源，请滑动地图');
                    setTimeout(function(){
                        me.moveSign = true;
                    },100)
                }
			};
            if(comFunc){
                onComplete=comFunc;
            }
            var onFailure = function(e){
                me.moveSign = true;
            };
			var options = {
              url:vars.ajaxUrl,
              type:'get',
              dataType:"json",
              data:params,
              success:onComplete,
              error:onFailure
            };
         	$.ajax(options);
		},
        clickOverlay: function(newCode,h) {
            var me = this;
            var info = me.map.markerList[newCode];
            var markerDiv = $('#tip' + info.projcode);
            if (!markerDiv)
                return;
            var marker = markerDiv.parent();
            $('.t-name.active').removeClass('active').addClass('visited');
            markerDiv.removeClass('visited').addClass('active');
            marker.attr('data-zindex',+marker.css('z-index'));
            marker.css('z-index',1);
            $('.t-name.visited').each(function(){
                var thismarker = $(this).parent();
                thismarker.css('z-index',thismarker.data('zindex'));
            });
            markerDiv.addClass('active');
            me.setMarkerCenter(new BMap.Point(info.mapx, info.mapy),h);
        },
        zoom:0,
        moveSign:false,
        moveStartSign:false,
        clickSign:false,
		init: function() {
			var me=this,zoom=11,zfMap=$('#zfMap'),doc = $(document);
            zfMap.height(doc.height() - 51);
            zfMap.width(doc.width());
			me.initParams();
			require.async('MapApi',function(MapApi){
				/* 初始化地图 */ 
				me.map = new MapApi('zfMap', vars.cityy, vars.cityx, zoom);
				/* 初始化结果显示*/
            	me.searchResult();
                var centerstart = null;
                me.map.addEvent(me.map, 'movestart', function(){
                    centerstart = me.map.pointToPixel(me.map.getCityCenter());
                    me.moveStartSign=true;
                });
                /*超过屏幕10%进行搜索*/
                me.map.addEvent(me.map, 'moveend', function(){
                    var maptip=$('#maptip');
                    if(maptip.css('display')=='block'){
                        maptip.hide();
                    }
                    if(me.moveStartSign&&me.moveSign&&me.params.zoom==16){
                        me.moveStartSign=false;
                        $('#maptip').hide();
                        try{
                            var centerend = me.map.pointToPixel(me.map.getCityCenter());
                            var dx = Math.abs(centerend.x - centerstart.x);
                            var dy = Math.abs(centerend.y - centerstart.y);
                            var distance = Math.sqrt(dx * dx + dy * dy) * 10;
                            if(distance > $(window).width() || 0 == distance){
                                me.moveSign = false;
                                me.searchResult('drag');
                            }
                        }catch(e){

                        }
                    }
                });
                /*改变地图模式重新搜索*/
                me.map.addEvent(me.map, 'zoomend', function(){
                    var mapzoom = me.map.getZoom(),samezoom = false,beforeZoom=me.params.zoom,maptip=$('#maptip');
                    if(maptip.css('display')=='block'){
                        maptip.hide();
                    }
                    if(mapzoom>=19){
                        alert('已放至最大');
                        return;
                    }
                    if(mapzoom<=3){
                        alert('已缩至最小');
                        return;
                    }
                    if(beforeZoom){
                        if((beforeZoom<=13&&mapzoom<=13)||(beforeZoom>=14&&beforeZoom<=15&&mapzoom>=14&&mapzoom<=15)||(beforeZoom>=16&&mapzoom>=16)){
                            samezoom = true;
                        }
                    }
                    if(!samezoom||mapzoom==11||mapzoom==12||mapzoom==13){
                        if(mapzoom==11||mapzoom==12||mapzoom==13){
                            me.params.comarea = '';
                        }
                        me.moveSign = false;
                        me.zoomResult();
                    }
                });
                me.map.addEvent(me.map, 'click', function(e){
                    if(me.clickSign){
                        me.clickSign = false;
                        return;
                    }
                    var  house_detail = $('#house_detail'),search=$('#search');
                    if(house_detail.css('display')=='block'){
                        house_detail.hide();
                        me.moveSign = true;
                        search.show();
                    }
                });
			});       
		}
	};
	return zfMap;
});