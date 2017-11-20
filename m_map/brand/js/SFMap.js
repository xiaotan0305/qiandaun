/**
 * ʵ����MapApi����������Ȳ���
 */
var SFMap = {
    map: null,
    metaMarkers: null,
    isDragend: false,
    mapDragTimeOut: null,
    //�����洢��ǰҳ�������е����Ϣ
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
    //������ͼ
    toggleDrag: function(flag) {
        if (flag) {
            this.isDragend = true;
        } else {
            this.isDragend = false;
        }
    },
    //�޸����ż���
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
    //��λ
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
                        showPrompt('��λ�뵱ǰ���в�һ�£����л�����');
                    }
                });
            }else {
                showPrompt('��ȡλ����Ϣʧ��');
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
        //�·���ͼ������Ӳ���2015.01.16
        ;(function(m,d,s,u,l) {
            u = d.createElement("script");
            u.async = true;
            u.src = 'http://js.ub.fang.com/_ubm.js?v=201407181100';
            u.onload=s;
            l = d.getElementsByTagName("head")[0];
            l.appendChild(u);
        })(window, document, function () {
            _ub.city = cityname;
            _ub.biz = 'n'; // ҵ��---WAP��
            var ns = cityns == 'n' ? 0 : 1;
            _ub.location = ns; // ��λ���ϱ���) ������Ϊ0���Ϸ�Ϊ1
            var b = 1; //�û����������0������1����绰31����ʱͨѶ24��ԤԼ25��
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
                    mnp = '0-10000' + '^' + encodeURIComponent('Ԫ/ƽ����');
                    mna += '^^'+ '0-10000';
                } else if (params.priceandsquare == '[40000,]') {
                    mnp = '40000-0' + '^' + encodeURIComponent('Ԫ/ƽ����');
                    mna += '^^' + '40000-0';
                } else {
                    var mnptmp = params.priceandsquare.substring(1, Number(params.priceandsquare.length)-1);
                    mnp = mnptmp.replace(/,/, '-') + '^' + encodeURIComponent('Ԫ/ƽ����');
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
                'mp3': 'n', //��ע��ҵ��
                'mnd': mnd, //����
                'mn5': mn5, //��ҵ����
                'mnp': mnp, //����	mnp	��ʽ��10000-15000^Ԫ/ƽ����
                'mn2': mn2, //����
                'mnf': mnf,//������
                'mna': mna //��̨^^0-10000������ûֵ���ţ����ûֵ�����ǡ��˴��ļ۸��޵�λ
            };
            var p = {};
            //��p_temp������Ϊ�ջ�����Ч���򲻴���p��
            for (var temp in p_temp) {
                if (p_temp[temp] != null && "" != p_temp[temp] && undefined != p_temp[temp] && "undefined" != p_temp[temp]) {
                    p[temp] = p_temp[temp];
                }
            }
            _ub.collect(b, p); // �ռ�����
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
                alert('ϵͳ���������ԣ�');
                me.isDragend = false;
                return;
            }
            if (0 == status) {
                var allnum = 0;
                result.rnum = 0;
            } else {
                var allnum = result.rnum;
            }
            //�Ѷ����ݵĴ���ŵ�������
            var zoom = SFMap.map.getZoom();
            var zoomtag = '';
            if(18 == zoom){
                zoomtag = '���ѷ������';
            }else if(3 == zoom){
                zoomtag = '����������С';
            }
            if (allnum > 0) {
                var list = result.list;
                me.map.clearOverlays();
                if (result.juhe) {
                    me.showDistrictResult(list);
                } else {
                    me.showResult(list);
                    showPrompt('���ҵ�' + allnum + '��¥��' + zoomtag);
                }
            } else {
                showPrompt('��ǰ��������¥����Ϣ' + zoomtag);
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
                info.price_unit = '����';
                info.price_d = '';
            }
            info.title_s = info.title;
            if ('' == info.title) {
                info.title = '����';
                info.title_s = '����';
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
                info.address = '����';
                info.address_s = '����';
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
        if (!district || district.indexOf('�ܱ�') > 0)
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




