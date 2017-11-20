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
    projcode: null,
    zoomtag: false,
    page: 2,
    ajaxhousetag: false,
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
        geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var gc = new BMap.Geocoder();
                gc.getLocation(r.point, function(rs) {
                    var addComp = rs.addressComponents;
                    if ((addComp.city).indexOf(cityname) > -1) {
                        var mk = new BMap.Marker(r.point);
                        mk.disableMassClear();
                        SFMap.map.addMarker(mk);
                        SFMap.map._map.centerAndZoom(r.point,14);
                    } else {
                        showPrompt('��λ�뵱ǰ���в�һ�£����л�����');
                    }
                });
            } else {
                showPrompt('��ȡλ����Ϣʧ��');
            }
        }, {enableHighAccuracy: true});
    },
    searchHouse: function() {
        var me = this;
        if (me.isDragend) {
            return;
        }
        var zoom = this.map.getZoom();
        var params = {'c': 'map', 'a': 'ajaxEsfMapSearch', 'city': encity, 'output': 'json', 'zoom': zoom};
        var searchBounds = this.map.gethdBounds();
        $('#search_params').children('div').each(function() {
            var value = $(this).html();
            if (value) {
                params[$(this).attr('id')] = value;
            }
        });
        //���ַ���ͼ��Ӳ���2015.01.06
        ;(function(m,d,s,u,l) {
            u = d.createElement("script");
            u.async = true;
            u.src = 'http://js.ub.fang.com/_ubm.js?v=201407181100';
            u.onload=s;
            l = d.getElementsByTagName("head")[0];
            l.appendChild(u);
        })(window, document, function () {
            _ub.city = cityname;
            _ub.biz = 'e'; // ҵ��---WAP��
            var ns = ns == 'n' ? 0 : 1;
            _ub.location = ns; // ��λ���ϱ���) ������Ϊ0���Ϸ�Ϊ1
            var b = 1; //�û����������0������1����绰31����ʱͨѶ24��ԤԼ25��
            var me0 ='', me2 = '', me4 = '', me3 ='';
            //��ȡ���ص����ݲ���ʽ��
            if (params.hasOwnProperty("district") && params["district"].length > 0) {
                me0 = encodeURIComponent(params.district) + "^^1";
            }
            //��ȡ�ܼ۵����ݲ���ʽ��
            if (params.hasOwnProperty("price") && params["price"].length > 0) {
                switch (params.price) {
                    case '[,100]' :
                        me2 = "0-100" + "^" + encodeURIComponent("��");
                        break;
                    case '[100,150]' :
                        me2 = "100-150" + "^" + encodeURIComponent("��");
                        break;
                    case '[150,200]' :
                        me2 = "150-200" + "^" + encodeURIComponent("��");
                        break;
                    case '[200,250]' :
                        me2 = "200-250" + "^" + encodeURIComponent("��");
                        break;
                    case '[250,300]' :
                        me2 = "250-300" + "^" + encodeURIComponent("��");
                        break;
                    case '[300,500]' :
                        me2 = "300-500" + "^" + encodeURIComponent("��");
                        break;
                    case '[500,800]' :
                        me2 = "500-800" + "^" + encodeURIComponent("��");
                        break;
                    case '[800,1000]' :
                        me2 = "800-1000" + "^" + encodeURIComponent("��");
                        break;
                    case '[1000]' :
                        me2 = "1000-0" + "^" + encodeURIComponent("��");
                        break;
                    default :
                        me2 = "";
                        break;
                }
            }
            //��ȡ���͵�����
            if (params.hasOwnProperty("room") && params["room"].length > 0) {
                me4 = params.room + encodeURIComponent("��");
            }
            //��ȡ��������ݲ���ʽ��
            if (params.hasOwnProperty("square") && params["square"].length > 0) {
                if (params['square'] == '[,50]') {//50�����µ����
                    me3 = "0^50";
                } else if (params['square'] == '[300]') {//300�����ϵ����
                    me3 = "300^0";
                } else {
                    var me3_tmp = params['square'].split(",");
                    me3 = me3_tmp[0].substring(1) + "^" + me3_tmp[1].substr(0, Number(me3_tmp[1].length)-1);
                }
            }
            var p_temp = {
                'me0': me0,//����^��Ȧ^1
                'me2': me2,//�۸� ��С�۸�-���۸�^��λ����1000-2000^��/��
                'me4': me4,//���� 1��
                'me3': me3//��� ��С���^����������50^60
            };
            var p = {};
            //��p_temp������Ϊ�ջ�����Ч���򲻴���p��
            for (var temp in p_temp) {
                if (p_temp[temp] != null && "" != p_temp[temp] && undefined != p_temp[temp] && "undefined" != p_temp[temp]) {
                    p[temp] = p_temp[temp];
                }
            }
            _ub.collect(b, p); // �ռ�����
        });
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
            if (18 == zoom) {
                zoomtag = '���ѷ������';
            } else if (3 == zoom) {
                zoomtag = '����������С';
            }
            if (allnum > 0) {
                var list = result.list;
                me.map.clearOverlays();
                me.showResult(list);
                showPrompt('���ҵ�' + allnum + '��С��' + zoomtag);
            } else {
                showPrompt('��ǰ��������С����Ϣ' + zoomtag);
            }
        };
        var onFailure = function() {
            me.isDragend = false;
        };
        var xhr = new SFXHR(url, method, params, onComplete, onFailure, me.onLoading);
    },
    searchXiaoquHouse: function(projcode) {
        var me = this;
        if ('' == projcode) {
            return;
        }
        me.projcode = projcode;
        var params = {'c': 'map', 'a': 'ajaxEsfMapSearch', 'city': encity, 'output': 'json', 'projcodes': projcode};
        var method = 'get';
        var url = '/map/';
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
            if (allnum > 0) {
                var list = result.list;
                me.showXiaoquResult(list);
            } else {
                showPrompt('��ǰС��������Ϣ');
            }
        };
        var onFailure = function() {
            me.isDragend = false;
        };
        var xhr = new SFXHR(url, method, params, onComplete, onFailure, me.onLoading);
    },
    ajaxSearchXiaoquHouse: function() {
        var me = this;
        if (me.ajaxhousetag) {
            return;
        }
        me.ajaxhousetag = true;
        var params = {'c': 'map', 'a': 'ajaxEsfMapSearch', 'city': encity, 'output': 'json', 'projcodes': me.projcode, 'page': me.page};
        var method = 'get';
        var url = '/map/';
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
            if (allnum > 0) {
                var list = result.list;
                me.page += 1;
                me.ajaxhousetag = false;
                me.showXiaoquResult(list);
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
            info.x = info.coordx;
            info.y = info.coordy;
            info.projname_s = info.projname;
            if ('' == info.projname) {
                info.projname = '����';
                info.projname_s = '����';
            } else {
                var strlen = SFUtil.getStrlen(info.projname);
                if (strlen > 20)
                    info.projname_s = SFUtil.subStrcn(info.title, 8) + '...';
            }
            info.projname_s = info.projname;
            if ('' == info.projname) {
                info.projname = '����';
                info.projname_s = '����';
            } else {
                var strlen = SFUtil.getStrlen(info.projname);
                if (strlen > 20)
                    info.projname_s = SFUtil.subStrcn(info.title, 8) + '...';
            }
            if('' != info.firsthouse && 'undefined' != typeof info.firsthouse){
                info.firsthouse.rh = '';
                if ('' != info.firsthouse.room) {
                    info.firsthouse.rh += info.firsthouse.room + '��';
                }
                if ('' != info.firsthouse.hall) {
                    info.firsthouse.rh += info.firsthouse.hall + '��';
                }
                if ('' == info.firsthouse.title) {
                    info.firsthouse.title = '����';
                    info.firsthouse.title_s = '����';
                } else {
                    var strlen = SFUtil.getStrlen(info.firsthouse.title);
                    if (strlen > 48) {
                        info.firsthouse.title_s = SFUtil.subStrcn(info.firsthouse.title, 48) + '...';
                    } else {
                        info.firsthouse.title_s = info.firsthouse.title;
                    }
                }
                info.firsthouse.url = '/esf/'+encity +'/'+info.firsthouse.housetype+'_'+info.firsthouse.houseid+'.html';
            }else{
                info.firsthouse = {};
                info.firsthouse.titleimage = 'http://js.soufunimg.com/common_m/m_esf/images/housenopic.png';
                info.firsthouse.title_s = '����';
                info.firsthouse.rh = '';
                info.firsthouse.tags = [];
                info.firsthouse.url = 'javascript:void(0)';
                info.firsthouse.price = '--';
                info.firsthouse.buildarea = '--';
            }
            me.markerList[info.projcode] = info;
            metaMarkers.push(info);
        }
        me.map.drawMarkers(metaMarkers);
    },
    showXiaoquResult: function(hits) {
        if (!hits)
            return;
        var h = '';
        var w = $('.md-house').width();
        for (var i = 0; i < hits.length; i++) {
            var info = hits[i];
            info.imgPath = imgPath;
            info.x = info.coordx;
            info.y = info.coordy;
            info.projname_s = info.projname;
            if ('' == info.projname) {
                info.projname = '����';
                info.projname_s = '����';
            } else {
                var strlen = SFUtil.getStrlen(info.projname);
                if (strlen > 20) {
                    info.projname_s = SFUtil.subStrcn(info.title, 20) + '...';
                } else {
                    info.projname_s = info.projname;
                }
            }
            info.rh = '';
            if ('' != info.room) {
                info.rh += info.room + '��';
            }
            if ('' != info.hall) {
                info.rh += info.hall + '��';
            }
            if ('' == info.title) {
                info.title = '����';
                info.title_s = '����';
            } else {
                var strlen = SFUtil.getStrlen(info.title);
                if (strlen > 48) {
                    info.title_s = SFUtil.subStrcn(info.title, 48) + '...';
                } else {
                    info.title_s = info.title;
                }
            }

            h += '<li id="' + info.houseid + '" data-num="' + i + '" style="width:' + w + 'px" class="pd10">';
            h += '<a href="' + info.url + '"><div class="img"><img src="' + info.titleimage + '"></div>';
            h += '<div class="info"><div class="tit">' + info.title_s + '</div>';
            h += '<p class="fgra1"><span class="flor fblu">' + info.price + '��Ԫ</span>' + info.rh + '&nbsp;&nbsp;' + info.buildarea + '�O</p><p>';
            for (var j in info.tags) {
                h += '<span class="tip">' + info.tags[j] + '</span>';
            }
            h += '</p></div></a></li>';
        }
        $('#house_list_wrap').append(h);
    },
    clickOverlay: function(newCode) {
        var me = this;
        var info = me.markerList[newCode];
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
        me.setMarkerCenter(new BMap.Point(info.x, info.y));
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
    setMarkerCenter: function(point) {
        var pixel = this.map.pointToPixel(point);
        var differ = +$('#house_detail').height() / 2;
        pixel.y = pixel.y + differ;
        var center = this.map.pixelToPoint(pixel);
        this.map._map.panTo(center);
    },
    closeOther: function() {
        var me = this;
        $('#house_detail').css('visibility', "hidden");
        me.toggleDrag(false);
    },
    openHouselist: function(projcode){
        var me = this;
        $('#houselist').show();
        me.searchXiaoquHouse(projcode);
    }
};