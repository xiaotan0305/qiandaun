/**
 * Created by Sunny on 14-7-30.
 */
(function(window, factory) {
    if ( typeof define === 'function') {
        // AMD
        define(function() {
            return factory(window);
        });
    } else if ( typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        window.navFlayer = factory(window);
    }
})(window,function(window){
    "use strict";
    var $ = window.$,
        header = $("header"),
        hIcon = header.children("div.hIcon"),
        hCenter = header.children("div.hCenter"),
        icoNav = hIcon.find("a.ico-nav"),userName,
        nav = $("#nav").css({position:"fixed", width:"100%", top:"51px"}),
        navShadow = $("div#navShadow"),newMsgNumWrap;
    //在这里定义函数
    var showNav = function(){
        nav.show();
        navShadow.show();
        icoNav.addClass('active');
        newMsgNumWrap == undefined && (newMsgNumWrap = $(".newMsgNumWrap")),newMsgNumWrap.is(":visible") && newMsgNumWrap.hide();
        header.css({"position":"fixed","width":"100%","top":"0px","z-index":"1000"});
        undefined===userName&&$.get("/public/?c=public&a=ajaxUserInfo",function(o){userName="",o!= !1 && undefined!=o.username && $("div#nav div.mt10 div.nav-tit a").text(userName=o.username)});
    };
    var hideNav = function(){
        nav.hide();
        navShadow.hide();
        icoNav.removeClass('active');
        header.css({"position":"relative"});
        parseInt($("#newMsgNum").text()) > 0 && (newMsgNumWrap.show());
    };
    icoNav.on("click",function(){
        if (nav.is(":hidden")) {
            showNav();
        }else {
            hideNav();
        }
    });
    navShadow.on("click",function(){
        hideNav();
    });
});