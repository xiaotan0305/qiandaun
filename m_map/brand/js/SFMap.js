/**
 * 实例化MapApi，添加搜索等操作
 */
var SFMap = {
    map: null,
    metaMarkers: null,
    isDragend: false,
    mapDragTimeOut: null,
    //用来存储当前页面上所有点的信息
    markerList: {},
    keyPointInfo: null,
    autoView: false,
    zoomPartition: 12,
    zoomAdapt: 12,
    rectOpen: -1,
    districtFirst: false,
    zoomtag: false,
    subwayFirst: false,
    roundFirst: false,
    showhistory: false,
    init: function() {
        this.map = new MapApi('allmap', cityy, cityx, mapzoom);
    },
    //锁定地图
    toggleDrag: function(flag) {
        if (flag) {
            this.isDragend = true;
        } else {
            this.isDragend = false;
        }
    },
    //修改缩放级别
    setZoom: function(x) {
        if(this.zoomtag){
            return;
        }
        this.zoomtag = true;
        var nowzoom = parseInt(this.map.getZoom());
        var tozoom = x;
        if ('+' === x) {
            tozoom = nowzoom + 1;
        } else if ('-' === x) {
            tozoom = nowzoom - 1;
        }
        this.map.setZoom(tozoom);
    },
    //定位
    locationMap: function() {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var gc = new BMap.Geocoder();
                gc.getLocation(r.point, function(rs) {
                    var addComp = rs.addressComponents;
                    if ((addComp.city).indexOf(cityname) > -1) {
                        var icon = new BMap.Icon(imgPath+'images/icon.png',new BMap.Size(17,24),{anchor:new BMap.Size(9, 24)});
                        var mk = new BMap.Marker(r.point, {icon: icon});
                        mk.disableMassClear();
                        SFMap.map.addMarker(mk);
                        SFMap.map._map.centerAndZoom(r.point,14);
                    } else {
                        showPrompt('定位与当前城市不一致，请切换城市');
                    }
                });
            }else {
                showPrompt('获取位置信息失败');
            }
        },{enableHighAccuracy: true});
    },
    searchHouse: function() {
        var me = this;
        if (me.isDragend){
            return;
        }
        var zoom = this.map.getZoom();
        var searchBounds = this.map.gethdBounds();
        var params = {'c': 'map', 'a': 'ajaxXfPingpaiMapSearch', 'city': encity, 'output': 'json', 'zoom': zoom};
        $('#search_params').children('div').each(function() {
            var value = $(this).html();
            if (value) {
                params[$(this).attr('id')] = value;
            }
        });
        //新房地图搜索添加布码2015.01.16
        ;(function(m,d,s,u,l) {
            u = d.createElement("script");
            u.async = true;
            u.src = 'http://js.ub.fang.com/_ubm.js?v=201407181100';
            u.onload=s;
            l = d.getElementsByTagName("head")[0];
            l.appendChild(u);
        })(window, document, function () {
            _ub.city = cityname;
            _ub.biz = 'n'; // 业务---WAP端
            var ns = cityns == 'n' ? 0 : 1;
            _ub.location = ns; // 方位（南北方) ，北方为0，南方为1
            var b = 1; //用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
            var mnp='', mnd='', mn5='', mnf='', mn2='', mna='';
            if (params.hasOwnProperty('district') && params.district.length) {
                mnd = encodeURIComponent(params.district);
                if (params.hasOwnProperty('priceandsquare') && params.priceandsquare.length) {
                    mna = encodeURIComponent(params.district);
                } else {
                    mna = encodeURIComponent(params.district) + '^^';
                }
            }
            if (params.hasOwnProperty('operastion') && params.operastion.length) {
                mn5 = encodeURIComponent(params.operastion);
            }
            if (params.hasOwnProperty('priceandsquare') && params.priceandsquare.length) {
                if (params.priceandsquare == '[,10000]') {
                    mnp = '0-10000' + '^' + encodeURIComponent('元/平方米');
                    mna += '^^'+ '0-10000';
                } else if (params.priceandsquare == '[40000,]') {
                    mnp = '40000-0' + '^' + encodeURIComponent('元/平方米');
                    mna += '^^' + '40000-0';
                } else {
                    var mnptmp = params.priceandsquare.substring(1, Number(params.priceandsquare.length)-1);
                    mnp = mnptmp.replace(/,/, '-') + '^' + encodeURIComponent('元/平方米');
                    mna += '^^' + mnptmp.replace(/,/, '-');
                }
            }
            if (params.hasOwnProperty('subwayline') && params.subwayline.length) {
                mnf = encodeURIComponent(params.subwayline);
            }
            if (params.hasOwnProperty('circle') && params.circle.length) {
                mn2 = encodeURIComponent(params.circle);
            }
            var p_temp = {
                'mp3': 'n', //关注的业务
                'mnd': mnd, //区县
                'mn5': mn5, //物业类型
                'mnp': mnp, //单价	mnp	格式：10000-15000^元/平方米
                'mn2': mn2, //环线
                'mnf': mnf,//地铁线
                'mna': mna //丰台^^0-10000。哪项没值空着，三项都没值，不记。此处的价格无单位
            };
            var p = {};
            //若p_temp中属性为空或者无效，则不传入p中
            for (var temp in p_temp) {
                if (p_temp[temp] != null && "" != p_temp[temp] && undefined != p_temp[temp] && "undefined" != p_temp[temp]) {
                    p[temp] = p_temp[temp];
                }
            }
            _ub.collect(b, p); // 收集方法
        })
        var method = 'get';
        var url = '/map/';
        params = SFUtil.objMerge(searchBounds, params);
        this.map.setViewAuto(false);
        SearchOther.cleanAllMarker();
        var onComplete = function(origRequest) {
            try {
                var json = origRequest.responseText;
                var result = eval('(' + json + ')');
                var status = result.status;
            } catch (e) {
                alert('系统错误，请重试！');
                me.isDragend = false;
                return;
            }
            if (0 == status) {
                var allnum = 0;
                result.rnum = 0;
            } else {
                var allnum = result.rnum;
            }
            //把对数据的处理放到这里来
            var zoom = SFMap.map.getZoom();
            var zoomtag = '';
            if(18 == zoom){
                zoomtag = '，已放至最大';
            }else if(3 == zoom){
                zoomtag = '，已缩至最小';
            }
            if (allnum > 0) {
                var list = result.list;
                me.map.clearOverlays();
                if (result.juhe) {
                    me.showDistrictResult(list);
                } else {
                    me.showResult(list);
                    showPrompt('共找到' + allnum + '个楼盘' + zoomtag);
                }
            } else {
                showPrompt('当前区域暂无楼盘信息' + zoomtag);
            }
        };
        var onFailure = function() {
            me.isDragend = false;
        };
        var xhr = new SFXHR(url, method, params, onComplete, onFailure, me.onLoading);
    },
    showResult: function(hits) {
        var me = this;
        var metaMarkers = [];
        if (!hits)
            return;
        for (var i = 0; i < hits.length; i++) {
            var info = hits[i];
            info.imgPath = imgPath;
            info.m_houseurl = 'http://m.soufun.com/xf/' + encity + '/' + info.newCode + '.htm';
            info.x = info.baidu_coord_x;
            info.y = info.baidu_coord_y;
            if ('' == info.price_num || '' == info.price_unit) {
                info.price_num = '';
                info.price_unit = '暂无';
                info.price_d = '';
            }
            info.title_s = info.title;
            if ('' == info.title) {
                info.title = '暂无';
                info.title_s = '暂无';
            } else {
                var strlen = SFUtil.getStrlen(info.title);
                if (strlen > 20){
                    info.title_s = SFUtil.subStrcn(info.title, 20) + '...';
                }else{
                    info.title_s = info.title;
                }
            }
            info.address_s = info.address;
            if ('' == info.address) {
                info.address = '暂无';
                info.address_s = '暂无';
            } else {
                var strlen = SFUtil.getStrlen(info.address);
                if (strlen > 48){
                    info.address_s = SFUtil.subStrcn(info.address, 48) + '...';
                }else{
                    info.address_s = info.address;
                }
            }
            me.markerList[info.newCode] = info;
            metaMarkers.push(info);
        }
        me.map.drawMarkers(metaMarkers);
    },
    showDistrictResult: function(hits) {
        var me = this;
        var metaMarkers = [];
        if (!hits)
            return;
        for (var value in hits) {
            var info = hits[value];
            info.x = hits[value].coord_x;
            info.y = hits[value].coord_y;
            metaMarkers.push(info);
        }
        me.map.drawMarkers(metaMarkers, 1);
    },
    gotoDistrict: function(district, x, y) {
        var me = this;
        if (!district || district.indexOf('周边') > 0)
            return;
        $('#search_config_district_view').html(district);
        $('#district').html(district);
        me.isDragend = true;
        me.map.setCenter(y, x, me.zoomAdapt);
        me.isDragend = false;
        me.searchHouse();
    },
    clickMarker: function(newCode) {
        var me = this;
        var info = me.markerList[newCode];
        var markerDiv = $('#tip' + info.newCode);
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
        me.setMarkerCenter(new BMap.Point(info.x, info.y));
    },
    setMarkerCenter: function(point) {
        var pixel = this.map.pointToPixel(point);
        var differ = +$('#house_detail').height() / 2;
        pixel.y = pixel.y + differ;
        var center = this.map.pixelToPoint(pixel);
        this.map._map.panTo(center);
    },
    openHouseDetail: function(newcode) {
        $('#house_detail').css('visibility', "visible");
        var num = +$('#' + newcode).data('num');
        chosenum = num;
        var width = +$('#' + newcode).width();
        var widthTitle = width - 60;
        var left = -num * width;
        var leftTitle = -num * widthTitle;
        $('#house_count_wrap').css('transition-duration', '0s');
        $('#house_detail_wrap').css('transition-duration', '0s');
        $('#house_count_wrap').css('left', leftTitle + 'px');
        $('#house_detail_wrap').css('left', left + 'px');
        var st = setTimeout(function(){
            $('#house_count_wrap').css('-webkit-transition-duration', '0.8s');
            $('#house_detail_wrap').css('-webkit-transition-duration', '0.8s');
            clearTimeout(st);
        },100);
    },
    closeOther: function() {
        var me = this;
        $('#house_detail').css('visibility', "hidden");
        me.toggleDrag(false);
    }
};




