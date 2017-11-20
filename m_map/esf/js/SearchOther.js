/*
* �ܱ߲�ѯ
* ����
*/
var SearchOther = {
    map:null,
    search_arr: {bus:'����', subway:'����', school:'ѧУ', hospital:'ҽԺ', bank:'����', shop:'����',house:'¥��'},
    icon_arr: {bus:'1', subway:'2', school:'3', hospital:'4', bank:'5', shop:'6',house:'7'},
    search_arr_marker: [],
    openTip : [],
    searchnear : function(type, count, limit_count){
        var me = this;
        var searchname = me.search_arr[type];
        me.cleanTypeMarker(type);
        var onLocalSearch = function(resData){
             // �ж�״̬�Ƿ���ȷ
            if (localSearch.getStatus() == BMAP_STATUS_SUCCESS){ 
                var result;
                var resultArr = [];
                //����ٶȷ�����Ϣ
                for (var i = 0; i < resData.getCurrentNumPois(); i ++){
                    var info = resData.getPoi(i);
                    //���˵����еĵ�����
                    info['address'] = info['address']?info['address']:'';
                    if("subway" == type && info['address'].indexOf("��") < 0) continue;
                    //�������
                    resultArr.push(info);
                }	
                resData._pois = resultArr;	
                var l = resData._pois.length;
                if(l > 0){
                    for (var i = 0; i < l && i < limit_count; i ++){
                        result = resData.getPoi(i);
                        var marker = me.addMarker(result,type);
                        me.search_arr_marker[type].push(marker);
                    }
                    $('#'+type+'_icon').css('background-position-y','-25px');
                }else{
                    showPrompt('��ǰ��������'+searchname+'��Ϣ');
                    $('#'+type+'_icon').css('background-position-y','0');
                }
            }else{
                showPrompt('��ǰ��������'+searchname+'��Ϣ');
                $('#'+type+'_icon').css('background-position-y','0');
            }
        };
        var localSearch = new BMap.LocalSearch(me.map, {onSearchComplete:onLocalSearch});
        localSearch.setPageCapacity(count); 
        localSearch.searchInBounds(searchname, me.map.getBounds());
    },
    searchnear_hs : function(type, count, limit_count){
        var me = this;
        var searchname = me.search_arr[type];
        me.cleanTypeMarker(type);
        var onLocalSearch = function(resData){
             // �ж�״̬�Ƿ���ȷ
            if (localSearch.getStatus() == BMAP_STATUS_SUCCESS){ 
                var result;
                var resultArr = [];
                //����ٶȷ�����Ϣ
                for (var i = 0; i < resData.getCurrentNumPois(); i ++){
                    var info = resData.getPoi(i);
                    //���˵����еĵ�����
                    info['address'] = info['address']?info['address']:'';
                    if("subway" == type && info['address'].indexOf("��") < 0) continue;
                    //�������
                    resultArr.push(info);
                }	
                resData._pois = resultArr;	
                var l = resData._pois.length;
                if(l > 0){
                    for (var i = 0; i < l && i < limit_count; i ++){
                        result = resData.getPoi(i);
                        var marker = me.addMarker(result,type);
                        me.search_arr_marker[type].push(marker);
                    }
                    $('#'+type+'_icon').css('background-position-y','-25px');
                }else{
                    showPrompt('��ǰ��������'+searchname+'��Ϣ');
                    $('#'+type+'_icon').css('background-position-y','0');
                }
            }else{
                showPrompt('��ǰ��������'+searchname+'��Ϣ');
                $('#'+type+'_icon').css('background-position-y','0');
            }
        };
        var localSearch = new BMap.LocalSearch(me.map, {onSearchComplete:onLocalSearch});
        localSearch.setPageCapacity(count); 
        localSearch.searchInBounds(searchname, me.map.getBounds());
    },
    cleanTypeMarker: function(type){	
        var me = this;
        if('undefined' === typeof me.search_arr_marker[type]){
            me.search_arr_marker[type] = [];
            return;
        }
        for(var i = 0,l=me.search_arr_marker[type].length;i<l;i++){
            me.map.removeOverlay(me.search_arr_marker[type][i]);
        }
        me.search_arr_marker[type] = [];
        $('#'+type+'_icon').css('background-position-y','0');
        me.closeTip();
    },
    cleanAllMarker: function(){	
        var me = this;
        for(var key in me.search_arr_marker){
            for(var i = 0,l=me.search_arr_marker[key].length;i<l;i++){
                me.map.removeOverlay(me.search_arr_marker[key][i]);
            }
            me.search_arr_marker[key] = [];
            $('#'+key+'_icon').css('background-position-y','0');
        }
        me.closeTip();
    },
    getTypeImg:function(type) {	
        var me = this;	
        var i = me.icon_arr[type];
        return {url:imgPath+'images/'+i+'.png', size:new BMap.Size(17,24), anchor:new BMap.Size(0, -24)};
    },
    addMarker : function(info, type){
        var me = this;
        var markerInfo = me.getTypeImg(type);
        var myIcon = new BMap.Icon(markerInfo.url,markerInfo.size);
        var marker = new BMap.Marker(new BMap.Point(info.point.lng,info.point.lat), {icon: myIcon});
        me.map.addOverlay(marker);
        marker.provalue = info;
        me.openTip[info.uid] = me.opentip(marker);
        return marker;
    },
    opentip: function(marker, type) {
        var me = this;  
        var opentheTip = function(){
            var info = marker.provalue;
            if(!info) return;
            if(me.isclick && me.isclick == info.uid){
                me.closeTip();
                return;
            }
            me.isclick = info.uid;
            me.markerNow = marker;	
            var node = $('#maptip');	
            if('hs' == info.maptype){
//                $('#maptip').innerHTML = SFUtil.templateFetch($('#tipDetail').value, info);
            }else{
                node.html(SFUtil.templateFetch($('#searchDetail').val(), info));
            }
            node.show();
            var pixel = me.map.pointToPixel(marker.provalue.point);
            node.css('left', pixel.x+'px');
            node.css('top', pixel.y+'px');
        };
        marker.addEventListener('click', opentheTip);
        return opentheTip;
    },
    closeTip: function(){
        $('#maptip').hide();
    },
    init_search_near : function(type){
        var me = this;
        me.map = SFMap.map._map;
        //Ĭ����ʾ��¼��
        me.all_count = 3;
        //����ȡ��¼��
        me.maxMarker_count = 20;
        me.limit = 5000;
        me.searchnear(type, me.maxMarker_count,me.maxMarker_count);
    }
};

