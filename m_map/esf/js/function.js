/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * 自定义方形覆盖物
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
        //点击滑动文字
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
            SFMap.clickOverlay(newCode);
        };
        oNext.onclick = function() {
            chosenum--;
            if (chosenum < 0) {
                chosenum = aCenLi.length - 1;
            }
            oCenUl.style.left = '-' + (w1 * chosenum) + 'px';
            oHouseUl.style.left = '-' + (w2 * chosenum) + 'px';
            var newCode = $('#house_detail_wrap').children(':nth-child('+(chosenum+1)+')').attr('id');
            SFMap.clickOverlay(newCode);
        };

        //周边展开隐藏
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

    //初始化地图
    $('#allmap').height($(document).height() - 51);
    $('#allmap').width($(document).width());
    $('#houselist').height($(document).height() - 51);
    $('#conditionwrap').height($(document).height() - 71);
    window.addEventListener("orientationchange", function() {
        // 宣布新方向的数值
        $('#allmap').height($(document).height() - 51);
        $('#allmap').width($(document).width());
        $('#houselist').height($(document).height() - 51);
        $('#conditionwrap').height($(document).height() - 71);
    }, false);
    var v='20140804';
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
        $('#head_txt').html('查找楼盘');
        $('#close_conditionwrap').show();
        $('#close_conditionwrap').siblings().hide();
        $('#houselist').hide();
    });
    $('#close_conditionwrap').on('click', function() {
        $('#conditionwrap').hide();
        $('#head_txt').html('地图');
        $('#close_conditionwrap').hide();
        $('#close_conditionwrap').siblings().show();
    });
    $('.open_houselist').on('click', function() {
        console.log($(this).data('projcode'));
//        $('#houselist').show();
    });
    $('#close_houselist').on('click', function() {
        $('#houselist').hide();
    });
    //调整地图缩放级别
    $('.zoom-in').on('click', function() {
        SFMap.setZoom('+');
    });
    $('.zoom-out').on('click', function() {
        SFMap.setZoom('-');
    });
    //定位
    $('.pos').on('click', function() {
        SFMap.locationMap();
    });
    //周边搜索
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
    //绑定搜索条件事件
    $('#search_config_district').find('a').on('click',function(){
        var key = $(this).data('key');
        var name = $(this).html();
        $('#search_config_district_view').html(name);
        $('#district').html(key);
    });
    $('#search_config_room').find('a').on('click',function(){
        var key = $(this).attr('data-key');
        var name = $(this).html();
        $('#search_config_room_view').html(name);
        $('#room').html(key);
    });
    $('#search_config_price').on('change',function(){
        $('#price').html($(this).val());
    });
    $('#search_config_square').on('change',function(){
        $('#square').html($(this).val());
    });
    //显示隐藏更多搜索条件
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
    //开始搜索
    $('.b1').on('click',function(){
        SFMap.toggleDrag(false);
        SFMap.searchHouse();
        $('#close_conditionwrap').click();
    });
    //重置搜索条件
    $('.b2').on('click',function(){
        $('#search_params').children().each(function(){
            $(this).html('');
        });
        $('#conditionwrap').find('strong').each(function(){
            $(this).html('不限');
        });
        $('#search_config_price').val('');
        $('#search_config_square').val('');
    });
    //加载更多小区房源信息
    $('#houselist').bind("scroll", function() {
        var fold = $('#houselist').height() + $('#houselist').scrollTop();
        var top = $('#house_list_wrap').height();
        if (fold > top) {
            SFMap.ajaxSearchXiaoquHouse();
        }
    });
    //图片滑动
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
    SFMap.init();
    var map = SFMap.map;
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