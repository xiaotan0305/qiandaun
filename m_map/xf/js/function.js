/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * �Զ��巽�θ�����
 * 
 * @param {BMap.Point} mapPoint
 * @param {string} label
 * @param {string} className
 *
 * @author https://github.com/ufologist
 * @version 2014-03-03
 * @see http://developer.baidu.com/map/jsdemo.htm#c1_11
 */
(function() {
    window.onload = window.onresize = function() {
        //�����������
        var oPrev = document.querySelector('#md_tit_house .prev');
        var oNext = document.querySelector('#md_tit_house .next');

        var oCen = document.querySelector('#md_tit_house .cen');
        var oCenUl = oCen.getElementsByTagName('ul')[0];
        var aCenLi = oCenUl.getElementsByTagName('li');

        var oHouse = document.querySelector('.md-house');
        var oHouseUl = oHouse.getElementsByTagName('ul')[0];
        var aHouseLi = oHouseUl.getElementsByTagName('li');

        var w1 = document.querySelector('#md_tit_house').offsetWidth - 60;
        var w2 = oHouse.offsetWidth;

        if (aCenLi.length != aHouseLi.length) {
            return false;
        }

        if (!oPrev || !oNext || !oCen || !oHouse)
            return false;

        oPrev.onclick = function() {
            chosenum++;
            if (chosenum >= aCenLi.length) {
                chosenum = 0;
            }
            oCenUl.style.left = '-' + (w1 * chosenum) + 'px';
            oHouseUl.style.left = '-' + (w2 * chosenum) + 'px';
            var newCode = $('#house_detail_wrap').children(':nth-child('+(chosenum+1)+')').attr('id');
            SFMap.clickMarker(newCode);
        };
        oNext.onclick = function() {
            chosenum--;
            if (chosenum < 0) {
                chosenum = aCenLi.length - 1;
            }
            oCenUl.style.left = '-' + (w1 * chosenum) + 'px';
            oHouseUl.style.left = '-' + (w2 * chosenum) + 'px';
            var newCode = $('#house_detail_wrap').children(':nth-child('+(chosenum+1)+')').attr('id');
            SFMap.clickMarker(newCode);
        };

        //�ܱ�չ������
        var oIconbox = document.querySelector('.vici .iconbox');
        var oMore = document.querySelector('.vici .more');
        if (!oMore)
            return false;
        oMore.onclick = function() {
            if (oIconbox.offsetWidth) {
                SearchOther.cleanAllMarker();
                $('.vici .iconbox').hide().css('width','0');
                $('.vici .more').css('backgroundColor','rgba(0,0,0,0.6)');
            } else {
                oIconbox.style.display = 'block';
                oIconbox.style.width = '259px';
                this.style.backgroundColor = 'rgba(71,132,212,0.6)';
            }
        };
    };

    var loadScript = function(B, D) {
        var A = document.createElement("script"), C = document.documentElement.firstChild;
        A.type = "text/javascript";
        if (A.readyState) {
            A.onreadystatechange = function() {
                if (A.readyState === "loaded" || A.readyState === "complete") {
                    A.onreadystatechange = null;
                    D();
                }
            };
        } else {
            A.onload = function() {
                D();
            };
        }
        A.src = B;
        C.insertBefore(A, C.firstChild);
    };

    //��ʼ����ͼ
        var d = window.navigator.userAgent.toLowerCase();
        if(/miuiyellowpage/i.test(d)) {
            $('#allmap').height($(window).height());
        }else {
            $('#allmap').height($(window).height() - 51);
        }
    $('#allmap').width($(window).width());
    $('#conditionwrap').height($(window).height() - 71);
    window.addEventListener("orientationchange", function() {
        // �����·������ֵ
        var d = window.navigator.userAgent.toLowerCase();
        if(/miuiyellowpage/i.test(d)) {
            $('#allmap').height($(window).height());
        }else {
            $('#allmap').height($(window).height() - 51);
        }
        $('#allmap').width($(window).width());
        $('#conditionwrap').height($(window).height() - 71);
    }, false);
    var v='20150828';
//    var v = Math.random();
    loadScript(imgPath + 'js/SFUtil.js?v=' + v,
            function() {
                loadScript(imgPath + 'js/RichMarker_min.js?v=' + v,
                        function() {
                            loadScript(imgPath + 'js/MapApi.js?v=' + v,
                                    function() {
                                        loadScript(imgPath + 'js/SFMap.js?v=' + v,
                                                function() {
                                                    loadScript(imgPath + 'js/SearchOther.js?v=' + v,
                                                            function() {
                                                                loadSFMap();
                                                                onEvent();
                                                            });
                                                });
                                    });
                        });
            });
})();
function onEvent() {
    $('#open_conditionwrap').on('click', function() {
        $('#conditionwrap').show();
        $('#head_txt').html('����¥��');
        $('#close_conditionwrap').show();
        $('#close_conditionwrap').siblings().hide();
    });
    $('#close_conditionwrap').on('click', function() {
        $('#conditionwrap').hide();
        $('#head_txt').html('��ͼ');
        $('#close_conditionwrap').hide();
        $('#close_conditionwrap').siblings().show();
    });
    //������ͼ���ż���
    $('.zoom-in').on('click', function() {
        SFMap.setZoom('+');
    });
    $('.zoom-out').on('click', function() {
        SFMap.setZoom('-');
    });
    //��λ
    $('.pos').on('click', function() {
        SFMap.locationMap();
    });
    //�ܱ�����
    $('#search_wrap').children('a').each(function() {
        var key = $(this).data('key');
        $(this).on('click', function() {
            if('-25px' == $(this).children('span:first').css('background-position-y')){
                SearchOther.cleanTypeMarker(key);
            }else{
                SearchOther.init_search_near(key);
            }
        });
    });
    //�л������ͻ���
    $('#search_config_line_change').on('click', function() {
        $('#search_config_subwayline').hide();
        $('#search_config_circle').show();
    });
    $('#search_config_subway_change').on('click', function() {
        $('#search_config_subwayline').show();
        $('#search_config_circle').hide();
    });
    //�����������¼�
    $('#search_config_district').find('a').on('click',function(){
        var key = $(this).data('key');
        var name = $(this).html();
        $('#search_config_district_view').html(name);
        $('#district').html(key);
        
        $('#search_config_circle').val('');
        $('#search_config_subwayline').val('');
        $('#circle').html('');
        $('#subwayline').html('');
    });
    $('#search_config_priceandsquare').find('a').on('click',function(){
        var key = $(this).attr('data-key');
        var name = $(this).html();
        $('#search_config_priceandsquare_view').html(name);
        $('#priceandsquare').html(key);
    });
    $('#search_config_operastion').find('a').on('click',function(){
        var key = $(this).data('key');
        var name = $(this).html();
        $('#search_config_operastion_view').html(name);
        $('#operastion').html(key);
    });
    $('#search_config_circle').on('change',function(){
        $('#circle').html($(this).val());
        $('#search_config_subwayline').val('');
        $('#search_config_district_view').html('����');
        $('#district').html('');
        $('#subwayline').html('');
    });
    $('#search_config_subwayline').on('change',function(){
        $('#subwayline').html($(this).val());
        $('#search_config_circle').val('');
        $('#search_config_district_view').html('����');
        $('#circle').html('');
        $('#district').html('');
    });
    //��ʾ���ظ�����������
    $('#show_all_search_config_district').on('click',function(){
        var obj = $('#search_config_district');
        if('45px' == obj.css('max-height')){
            obj.css('max-height','inherit');
            $(this).attr('class','icon-next-a');
        }else{
            obj.css('max-height','45px');
            $(this).attr('class','icon-next');
        }
    });
    $('#show_all_search_config_priceandsquare').on('click',function(){
        var obj = $('#search_config_priceandsquare');
        if('45px' == obj.css('max-height')){
            obj.css('max-height','inherit');
            $(this).attr('class','icon-next-a');
        }else{
            obj.css('max-height','45px');
            $(this).attr('class','icon-next');
        }
    });
    //��ʼ����
    $('.b1').on('click',function(){
        SFMap.toggleDrag(false);
        SFMap.searchHouse();
        $('#close_conditionwrap').click();
    });
    //������������
    $('.b2').on('click',function(){
        $('#search_params').children().each(function(){
            $(this).html('');
        });
        $('#conditionwrap').find('strong').each(function(){
            $(this).html('����');
        });
        $('#search_config_circle').val('');
        $('#search_config_subwayline').val('');
    });
    //ͼƬ����
    document.getElementById('house_detail_wrap').addEventListener('touchstart', function(e) {
        nStartX = e.targetTouches[0].pageX;
        touchflag = true; 
    }, false);
    document.getElementById('house_detail_wrap').addEventListener('touchmove', function(e) {
        if(touchflag){
            event.preventDefault(); 
            nChangX = e.changedTouches[0].pageX;
            if(nChangX > nStartX){
                $('.next').click();
            }else if(nChangX < nStartX){
                $('.prev').click();
            }
            touchflag = false;
        }
    }, false);
}

function showPrompt(msg){
    $('#prompt').html(msg);
    $('#prompt').slideDown();
    var up = function(){
        $('#prompt').slideUp();
    };
    setTimeout(up,3000);
}

var loadSFMap = function() {
    //��index_header.html��ķŵ�������
//	SFMap.condInit();
    SFMap.init();
    var map = SFMap.map;
    //����� GET ������district��keyword������������ JS �����ڱ�ִ��������������������ͳһִ��
//    if ((!searchcondition.district) && (!searchcondition.keyword)) {
//        SFMap.searchResult();
//    }

    SFMap.searchHouse();
    var searchHouse = function() {
        if (SFMap.isDragend)
            return;
        if(null !== SFMap.mapDragTimeOut) {
            clearTimeout(SFMap.mapDragTimeOut);
        }
        SFMap.mapDragTimeOut = setTimeout(function() {
            SFMap.searchHouse();
        }, 800);
    };
    var centerstart = null;
    map.addEvent(map, 'movestart', function(){
        centerstart = map.pointToPixel(map.getCityCenter());
    });
    map.addEvent(map, 'moveend', function(){
        SearchOther.closeTip();
        try{
            var centerend = map.pointToPixel(map.getCityCenter());
            var dx = Math.abs(centerend.x - centerstart.x);
            var dy = Math.abs(centerend.y - centerstart.y);
            var distance = Math.sqrt(dx * dx + dy * dy) * 10;
            if(distance > $(window).width() || 0 == distance){
                searchHouse();
            }
        }catch(e){
            searchHouse();
        }
    });
    map.addEvent(map, 'zoomend', function(){
        searchHouse();
        SFMap.zoomtag = false;
    });
    map.addEvent(map, 'click', function() {
        SFMap.closeOther();
        SFMap.toggleDrag(false);
    });
};