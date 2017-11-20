/**
 * Created by liyy on 15-4-21.
 */
define('commonFunction', ['jquery'], function(require, exports, module) {
    var $= require('jquery');
    var commonFunction = {
        pos:$('#pos'),
        zoomIn:$('#zoomIn'),
        zoomOut:$('#zoomOut'),
        showPrompt :function(msg){
//            var me = this,prompt=$('#prompt');
//            prompt.html(msg);
//            prompt.slideDown();
//            var up = function(){
//                prompt.slideUp();
//            };
//            setTimeout(up,3000);
            alert(msg);
        },

        init:function(){
            var me = this;
            var district=$('#district'),
                price=$('#price'),price_div=$('#price_div'),
                housetype=$('#housetype'),
                room=$('#room'),
                district_comarea=$('#district_comarea'),
                district_section=$('#district_section'),
                comarea_section=$('#comarea_section'),
                district_show=$('#district_show'),
                price_div=$('#price_div'),
                housetype_div=$('#housetype_div'),
                room_div=$('#room_div'),maptip=$('#maptip'),
                house_count_wrap = $('#house_count_wrap'),
                house_detail_wrap=$('#house_detail_wrap'),
                prev = $('#prev'),next = $('#next'),
                w2 = $(window).width(),
                w1 = w2 - 60;

            district.on('click',function(){
                if(maptip.css('display')=='block'){
                    maptip.hide();
                }
                price_div.hide();
                price.removeClass('active');
                if(district_comarea.css('display')=='none'){
                    district.addClass('active');
                    district_comarea.show();
                    room_div.hide();
                    housetype_div.hide();
                    price_div.hide();
                    room.removeClass('active');
                    housetype.removeClass('active');
                    price.removeClass('active');
                }else{
                    district.removeClass('active');
//                    comarea_section.hide();
//                    district_section.hide();
                    district_comarea.hide();
                }
            });
            district_show.on('click',function(){
                district_section.show();
            });

            price.on('click',function(){
                if(maptip.css('display')=='block'){
                    maptip.hide();
                }
                district_comarea.hide();
                district.removeClass('active');
                if(price_div.css('display')=='none'){
                    price.addClass('active');
                    price_div.show();
                    room_div.hide();
                    housetype_div.hide();
                    district_comarea.hide();
                    room.removeClass('active');
                    housetype.removeClass('active');
                    district.removeClass('active');
                }else{
                    price.removeClass('active');
                    price_div.hide();
                }
            });
            housetype.on('click',function(){
                if(maptip.css('display')=='block'){
                    maptip.hide();
                }
                if(housetype_div.css('display')=='none'){
                    housetype.addClass('active');
                    housetype_div.show();
                    room_div.hide();
                    price_div.hide();
                    district_comarea.hide();
                    room.removeClass('active');
                    price.removeClass('active');
                    district.removeClass('active');
                }else{
                    housetype.removeClass('active');
                    housetype_div.hide();
                }
            });
            room.on('click',function(){
                if(maptip.css('display')=='block'){
                    maptip.hide();
                }
                if(room_div.css('display')=='none'){
                    room.addClass('active');
                    room_div.show();
                    housetype_div.hide();
                    price_div.hide();
                    district_comarea.hide();
                    housetype.removeClass('active');
                    price.removeClass('active');
                    district.removeClass('active');
                }else{
                    room.removeClass('active');
                    room_div.hide();
                }
            });
            require.async('zfMap',function(zfMap){
                me.pos.on('click',function(){
                    zfMap.locationMap();
                });
                me.zoomIn.on('click',function(){
                    zfMap.setZoom('+');
                });
                me.zoomOut.on('click',function(){
                    zfMap.setZoom('-');
                });
                district_section.on('click',function(e){
                    var ele =  $(e.target);
                    if(ele.html()=='不限'){
                        district.removeClass('active');
                        zfMap.params.district = '';
                        zfMap.params.comarea = '';
                        comarea_section.hide();
                        district_section.hide();
                        district_comarea.hide();
                        var districtSpan = $('#district span');
                        if(districtSpan.html()=='位置'){
                            return;
                        }else{
                            districtSpan.html('位置');
                            if(!zfMap.params.price&&!zfMap.params.room&&!zfMap.params.housetype){
                                zfMap.map._map.centerAndZoom(zfMap.map.citycenter,11);
                            }
                            zfMap.zoomResult();
                        }
                    }
                    var name=ele.data("num");
                    if('undefined'!=name){
                        $("#district_section dd").removeClass('active');
                        $("#district_param_"+name).addClass('active');
                        comarea_section.show();
                        $(".comarea_dl").hide();
                        $("#"+name).show();
                    }
                });
                comarea_section.on('click','a',function(){
                    var ele = $(this),eleHtml=ele.html();
                    var id = '#district_param_'+ele.parent().parent().attr('id')+' a';
                    if(eleHtml!='不限'){
                        zfMap.params.comarea = eleHtml;
                    }else{
                        eleHtml = $(id).html();
                        zfMap.params.comarea = '';
                    }
                    zfMap.params.district = $(id).html();
                    $('#district span').html(eleHtml);
                    district_comarea.hide();
                    district.removeClass('active');
                    zfMap.moveSign = false;
                    zfMap.searchResult();
                });
                price_div.on('click','a',function(){
                    var ele = $(this),eleHtml=ele.html();
                    if(eleHtml!='不限'){
                        zfMap.params.price = ele.attr('name');
                    }else{
                        eleHtml = '租金';
                        zfMap.params.price = '';
                    }
                    $('#price span').html(eleHtml);
                    price_div.hide();
                    price.removeClass('active');
                    zfMap.moveSign = false;
                    zfMap.searchResult();
                });
                housetype_div.on('click','a',function(){
                    var ele = $(this),eleHtml=ele.html();
                    if(eleHtml!='不限'){
                        zfMap.params.housetype = ele.attr('name');
                    }else{
                        eleHtml = '来源';
                        zfMap.params.housetype = '';
                    }
                    $('#housetype span').html(eleHtml);
                    housetype_div.hide();
                    housetype.removeClass('active');
                    zfMap.moveSign = false;
                    zfMap.searchResult();
                });
                room_div.on('click','a',function(){
                    var ele = $(this),eleHtml=ele.html();
                    if(eleHtml!='不限'){
                        zfMap.params.room = ele.attr('name');
                    }else{
                        eleHtml = '户型';
                        zfMap.params.room = '';
                    }
                    $('#room span').html(eleHtml);
                    room_div.hide();
                    room.removeClass('active');
                    zfMap.moveSign = false;
                    zfMap.searchResult();
                });
                next.on('click',function() {
                    if(maptip.css('display')=='block'){
                        maptip.hide();
                    }
                    chosenum++;
                    if (chosenum >= house_detail_wrap.children().length) {
                        chosenum = 0;
                        house_count_wrap.css('transition-duration', '0.2s');
                        house_detail_wrap.css('transition-duration', '0.2s');
                        var st = setTimeout(function(){
                            house_count_wrap.css('-webkit-transition-duration', '0.8s');
                            house_detail_wrap.css('-webkit-transition-duration', '0.8s');
                            clearTimeout(st);
                        },100);
                    }
                    house_count_wrap.css('left', '-' + (w1 * chosenum) + 'px');
                    house_detail_wrap.css('left', '-' + (w2 * chosenum) + 'px');
                    var thisObj =$('#house_detail_wrap').children(':nth-child('+(chosenum+1)+')'),newCode = thisObj.attr('id');
                    if(!thisObj.children().length){
                        $('#loading').show();
                        zfMap.moveSign=false;
                        zfMap.searchResult(newCode);
                    }else{
                        var chil = thisObj.children().length,h=0;
                        if(chil<3){
                            house_detail_wrap.height(chil*92);
                            h=chil*92;
                        }else{
                            house_detail_wrap.height(276);
                            h=276;
                        }
                        thisObj.scrollTop(0);
                        zfMap.clickOverlay(newCode,h);
                    }
                });
                prev.on('click',function() {
                    if(maptip.css('display')=='block'){
                        maptip.hide();
                    }
                    chosenum--;
                    if (chosenum < 0) {
                        chosenum = house_detail_wrap.children().length - 1;
                        house_count_wrap.css('transition-duration', '0.2s');
                        house_detail_wrap.css('transition-duration', '0.2s');
                        var st = setTimeout(function(){
                            house_count_wrap.css('-webkit-transition-duration', '0.8s');
                            house_detail_wrap.css('-webkit-transition-duration', '0.8s');
                            clearTimeout(st);
                        },100);
                    }
                    house_count_wrap.css('left', '-' + (w1 * chosenum) + 'px');
                    house_detail_wrap.css('left', '-' + (w2 * chosenum) + 'px');
                    var thisObj =$('#house_detail_wrap').children(':nth-child('+(chosenum+1)+')'),newCode = thisObj.attr('id');
                    if(!thisObj.children().length){
                        $('#loading').show();
                        zfMap.moveSign=false;
                        zfMap.searchResult(newCode);
                    }else{
                        var chil = thisObj.children().length,h=0;
                        if(chil<3){
                            house_detail_wrap.height(chil*92);
                            h=chil*92;
                        }else{
                            house_detail_wrap.height(276);
                            h=276;
                        }
                        thisObj.scrollTop(0);
                        zfMap.clickOverlay(newCode,h);
                    }
                });
                var touchflag = false,nStartX= 0,nChangX=0;
                //图片滑动
                document.getElementById('house_detail_wrap').addEventListener('touchstart', function(e) {
                    nStartX = e.targetTouches[0].pageX;
                    touchflag = true;
                }, false);
                document.getElementById('house_detail_wrap').addEventListener('touchmove', function(e) {
                    if(touchflag){
                        nChangX = e.changedTouches[0].pageX;
                        var cha = nChangX - nStartX;
                        if(Math.abs(cha) >20){
                            e.preventDefault();
                            if(cha>0){
                                prev.click();
                            }else{
                                next.click();
                            }
                        }
                        touchflag = false;
                    }
                }, false);
            });
            //周边搜索
            require.async('SearchOther',function(SearchOther){
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
                //周边展开隐藏
                var oIconbox = $('.vici .iconbox'),oMore = $('.vici .more');
                if (oMore.length==0)
                    return false;
                oMore.on('click',function() {
                    if (oIconbox[0].offsetWidth) {
                        SearchOther.cleanAllMarker();
                        oIconbox.hide().css('width','0');
                        oMore.css('backgroundColor','rgba(0,0,0,0.6)');
                    } else {
                        oIconbox.show();
                        oIconbox.width(259);
                        oMore.css('backgroundColor','rgba(71,132,212,0.6)');
                    }
                });
            });
            window.showPrompt = me.showPrompt;
        }
    };
    return commonFunction;
});