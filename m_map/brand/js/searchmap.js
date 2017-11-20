//������ļ���ʵ�ֶ�����������������ʾ
var bdpoint;
var marker;
var map = new BMap.Map("container"); // ������ͼʵ��
var zoom_value;//�Ե�ͼ�������Ŵ���
function init(zoom){
           zoom_value = zoom;
           $('.wrap').css("height", window.innerHeight + 100);
            window.scrollTo(0, 1);
            $(".wrap").css("height", window.innerHeight);
            document.addEventListener('touchmove', function(e) {
                e.preventDefault();
            });
 
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());
            map.addControl(new BMap.OverviewMapControl());
            var gpsPoint = new BMap.Point(cor_x,cor_y ); // ����������
            
            setTimeout(function() {
                BMap.Convertor.translate(gpsPoint, 2, translateCallback);     //��ʵ��γ��ת�ɰٶ�����
            }, 500);
            translateCallback = function(point) {
                bdpoint = point;
                marker = new BMap.Marker(point);
                map.addOverlay(marker);
                var c = map.centerAndZoom(point, zoom); // ��ʼ����ͼ���������ĵ�����͵�ͼ����15��ʾ���Ǳ���	
            };
};
        init(15);//��ʼ����ͼ���
//�������һ����ѯ�ٶ�API�Ĺ���
var search_arr = {bus:'����', subway:'����', school:'ѧУ', hospital:'ҽԺ', bank:'����', shop:'����',house:'¥��'};
var icon_arr = {bus:'1', subway:'2', school:'3', hospital:'4', bank:'5', shop:'6',house:'7'};
var search_arr_marker = [];
var openTip = [];
 function searchnear(type, count, limit_count){

        var searchname = search_arr[type];
        cleanTypeMarker(type);
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
                        var marker = addMarker(result,type);
                        search_arr_marker[type].push(marker);
                    }
                    $('#'+type+'_icon').css('background-position-y','-25px');
                }else{
                    showPrompt('��ǰ��������'+searchname+'��Ϣ');//��ʾ�����ݵķ�����δ����
                    $('#'+type+'_icon').css('background-position-y','0');
                }
            }else{
                showPrompt('��ǰ��������'+searchname+'��Ϣ');
                $('#'+type+'_icon').css('background-position-y','0');
            }
        };
        var localSearch = new BMap.LocalSearch(map, {onSearchComplete:onLocalSearch});//������ò�ѯlocalsearch��һ���첽���̣���Ҫ����һ�λص�����
        localSearch.setPageCapacity(count); 
        localSearch.searchInBounds(searchname, map.getBounds());
    }

//����ʵ�ֶ�����search����д
 function cleanTypeMarker(type){	
        if('undefined' === typeof search_arr_marker[type]){
            search_arr_marker[type] = [];
            return;
        }
        for(var i = 0,l=search_arr_marker[type].length;i<l;i++){
            map.removeOverlay(search_arr_marker[type][i]);
        }
        search_arr_marker[type] = [];
        $('#'+type+'_icon').css('background-position-y','0');
        closeTip();
    }
function getTypeImg(type) {	
        var i = icon_arr[type];
        return {url:imgPath+'images/'+i+'.png', size:new BMap.Size(17,24), anchor:new BMap.Size(0, -24)};
    }
 function  addMarker (info, type){
        var markerInfo = getTypeImg(type);
        var myIcon = new BMap.Icon(markerInfo.url,markerInfo.size);
        var marker = new BMap.Marker(new BMap.Point(info.point.lng,info.point.lat), {icon: myIcon});
        map.addOverlay(marker);
        marker.provalue = info;
        openTip[info.uid] = opentip(marker);
        return marker;
    }
    var isclick;
function opentip(marker, type) { 
        var opentheTip = function(){
            //���������ڵ�
            var info = marker.provalue;
            if(!info) return;
            if(isclick && isclick == info.uid){
                closeTip();
                return;
            }
            isclick = info.uid;
            markerNow = marker;	
            var node = $('#maptip');	
            node.html(SFUtil.templateFetch($('#searchDetail').val(), info));
            node.show();
            var pixel = map.pointToPixel(marker.provalue.point);
            node.css('left', pixel.x+'px');
            node.css('top', pixel.y+'px');
        };
        marker.addEventListener('click', opentheTip);
        return opentheTip;
    }
function closeTip(){
        $('#maptip').hide();
    }
    //������ʾ��ʾ��Ϣ
    function showPrompt(msg){
        if (msg)
        {
            $('#show_msg').css('display','block');
        }
    $('#prompt').html(msg);
    $('#prompt').slideDown();
    var up = function(){
       // $('#prompt').slideUp();
       $('#show_msg').css('display','none');
    };
    setTimeout(up,3000);
}

    //����ʵ�ֶ��ܱ߽��е���
    function on_client(type){
      //�����еĵ�����г���
      searchnear(type, 20, 20);//ʵ�ֶ����Ͳ�ѯ�Ĺ���
      //alert(type);
    }
    function clean_on_client(type){
        cleanTypeMarker(type);
    }
    //ʵ�ֶ�ģ��ĵ����,�Ե��֮��Ч���ĸ���
//this.span.css('backgroundPositionY','-25px');
    var show_bus =0;
    $('#js_searchBus').on('click',function(){
    if (show_bus ==0)
    {
        on_client('bus');
        $(this).children('span').css('background-position-y','-25px');
        show_bus = 1;
    }else {
        show_bus =0;
        clean_on_client('bus');
        $(this).children('span').css('background-position-y','0px');
    }
    });
    var show_subway =0;
    $('#js_searchSubway').on('click',function(){
    if (show_subway ==0)
    {
        on_client('subway');
        $(this).children('span').css('background-position-y','-25px');
        show_subway = 1;
    }else {
        show_subway =0;
        clean_on_client('subway');
        $(this).children('span').css('background-position-y','0px');
    }
    });
    var show_school =0;
    $('#js_searchSchool').on('click',function(){
    if (show_school ==0)
    {
        on_client('school');
        $(this).children('span').css('background-position-y','-25px');
        show_school = 1;
    }else {
        show_school =0;
        clean_on_client('school');
        $(this).children('span').css('background-position-y','0px');
    }
    });
    var show_hospital =0;
    $('#js_searchHospital').on('click',function(){
    if (show_hospital ==0)
    {
        on_client('hospital');
        $(this).children('span').css('background-position-y','-25px');
        show_hospital = 1;
    }else {
        show_hospital =0;
        clean_on_client('hospital');
        $(this).children('span').css('background-position-y','0px');
    }
    });
    var show_bank =0;
    $('#js_searchBank').on('click',function(){
    if (show_bank ==0)
    {
        on_client('bank');
        $(this).children('span').css('background-position-y','-25px');
        show_bank = 1;
    }else {
        show_bank =0;
        clean_on_client('bank');
        $(this).children('span').css('background-position-y','0px');
    }
    });
    var show_shop =0;
    $('#js_searchShop').on('click',function(){
    if (show_shop ==0)
    {
        on_client('shop');
        $(this).children('span').css('background-position-y','-25px');
        show_shop = 1;
    }else {
        show_shop =0;
        clean_on_client('shop');
        $(this).children('span').css('background-position-y','0px');
    }
    });
    var show_house =0;
    $('#js_searchHouse').on('click',function(){
    if (show_house ==0)
    {
        on_client('house');
        $(this).children('span').css('background-position-y','-25px');
        show_house = 1;
    }else {
        show_house =0;
        clean_on_client('house');
        $(this).children('span').css('background-position-y','0px');
    }
    });	

    //����������
$('#daohang').on('click',function(){
//�Ե�������ʼ��λ
var start=new BMap.Point(pointx,pointy);//��������аٶ�ת��
if (!pointx)
{
    alert('��Ǹ����λʧ�ܣ�');
}
var end=new BMap.Point(cor_x,cor_y);
var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];//�Ե������ж���
search(start,end,routePolicy[0]); 
        function search(start,end,route){ 
            var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: route});//����ʵ�ֶԵ����ĵ�ͼ��ʼ��
            driving.search(start,end);//ʵ�ֵ���
        }
});

//�Ե�ͼ�������Ŵ���
$('#zoom_max').on('click',function(){
zoom_value++;
init(zoom_value);
});
$('#zoom_min').on('click',function(){
    zoom_value--;
init(zoom_value);
});
//��ɸѡ����п���
var hide_vici=0;
$('#hide_vici').on('click',function(){
if (hide_vici==0)
{
$('#search_wrap').css('display','none');
$('.vici').css('width','36');
hide_vici++;
}else{
hide_vici =0;
$('#search_wrap').css('display','block');
$('.vici').css('width','297');
}
});
;(function(m,d,s,u,l) {
    u = d.createElement("script");
    u.async = true;
    u.src = 'http://js.ub.fang.com/_ubm.js?v=201407181100';
    l = d.getElementsByTagName("head")[0];
    l.appendChild(u);
})(window, document);
//�·������е�ͼ��Ӳ���2015.01.22
$("#search_wrap").on("click", "span", function(){
    _ub.city = cityname;
    _ub.biz = 'n';
    var ns = cityns == 'n' ? 0 : 1;
    _ub.location = ns;
    var b = 0;
    var mnh =encodeURIComponent($(this).html());
    var p_temp = {
        'mnh': mnh
    };
    var p = {};
    for (var temp in p_temp) {
        if (p_temp[temp] != null && "" != p_temp[temp] && undefined != p_temp[temp] && "undefined" != p_temp[temp]) {
            p[temp] = p_temp[temp];
        }
    }
    _ub.collect(b, p); // 收集方法
})



