/**
 * Created by LXM on 14-12-10.
 */
define("modules/news/ad",['jquery'],function(require,exports,module){
    "use strict";
    var vars = seajs.data.vars;
    function cookieAction(){};
    cookieAction.prototype.getItem = getCookie;
    cookieAction.prototype.setItem = setCookie;
    var storage = null;
    if(vars.localStorage)
    {
        storage = vars.localStorage;
    }
    else
    {
        storage = new cookieAction();
    }
    require.async("swipe/2.0/swipe",function(Swipe){
        var ad="",adelement="",adsliderls="";
        var bua = navigator.userAgent.toLowerCase();
        if( window.location.href.indexOf('client') != -1 ){
            if(bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1){
                adelement='sliderImgIos';
                adsliderls='#iphoneAd #position > li';
                ad=$('#iphoneAd');
            }else{
                adelement='sliderImgAnd';
                adsliderls='#andriodAd #position > li';
                ad=$('#andriodAd');
            }
        }
        else{
            adelement = 'sliderImg';
            adsliderls='#wapAd #position > li';
            ad=$('#wapAd');
        }
        ad.show();
        var bullets = $(adsliderls);
        bullets.filter(":first").addClass("on");
        var adSwipe = new Swipe(document.getElementById(adelement), {
            startSlide: 0,
            speed: 1000,
            auto: 3000,
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
            callback:  function(index) {
                var i = bullets.length;
                while (i--) {
                    bullets[i].className = ' ';
                }
                index = index % bullets.length;
                bullets[index].className = 'on';
            },
            transitionEnd: function(index, element) {}
        });
        var thisDay =Date.parse(new Date());
        if(storage.getItem("deDate") != null && storage.getItem('cityName') != null)
        {
            var deDay = Date.parse(storage.getItem('deDate'));
            var cityName = storage.getItem('cityName');
        }
        if(thisDay < deDay && cityName == city)
        {
            ad.remove();
        }

    });
    function setCookie(c_name,value)
    {
        var expiredays = 7;
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie=c_name+ "=" +escape(value)+
            ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    };
    function getCookie(c_name)
    {
        if (document.cookie.length>0)
        {
            var c_start=document.cookie.indexOf(c_name + "=")
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1
                var c_end=document.cookie.indexOf(";",c_start)
                if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            }
        }
        return ""
    };

    $(".wap-news-ad-w-btn").click(function(){
        var deDate = new Date();
        deDate.setDate(deDate.getDate()+7);
        deDate.setHours(0,0,0);
        if(storage != null){
            storage.setItem("deDate",deDate);
            storage.setItem('cityName',city);
        }
        ad.remove();
    });

});


