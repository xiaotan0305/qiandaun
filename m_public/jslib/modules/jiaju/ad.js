/**
 * Created by LXM_sf on 15-6-20.
 */

define('modules/jiaju/ad', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    function CookieAction() {}

    function setCookie(cName, value) {
        var expiredays = 7;
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = cName + '=' + escape(value)
            + (expiredays === null ? '' : ';expires=' + exdate.toGMTString());
    }
    function getCookie(cName) {
        if (document.cookie.length > 0) {
            var cStart = document.cookie.indexOf(cName + '=');
            if (cStart !== -1) {
                cStart = cStart + cName.length + 1;
                var cEnd = document.cookie.indexOf(';', cStart);
                if (cEnd === -1) {
                    cEnd = document.cookie.length;
                }
                return unescape(document.cookie.substring(cStart,cEnd));
            }
        }
        return '';
    }
    CookieAction.prototype.getItem = getCookie;
    CookieAction.prototype.setItem = setCookie;
    var storage = null;
    if (vars.localStorage) {
        storage = vars.localStorage;
    } else {
        storage = new CookieAction();
    }
    var ad = '';
    var adelement = '';
    var adsliderls = '';
    require.async('swipe/2.0/swipe', function (Swipe) {
        adelement = 'sliderImg';
        adsliderls = '#wapAd #position > li';
        ad = $('#wapAd');
        ad.show();
        var bullets = $(adsliderls);
        bullets.filter(':first').addClass('on');
        new Swipe(document.getElementById(adelement), {
            startSlide: 0,
            speed: 1000,
            auto: 3000,
            continuous: true,
            disableScroll: false,
            stopPropagation: false,
            callback: function (index) {
                var i = bullets.length;
                while (i--) {
                    bullets[i].className = ' ';
                }
                var num = index % bullets.length;
                bullets[num].className = 'on';
            },
            transitionEnd: function () {}
        });
    });

    $('.wap-news-ad-w-btn').click(function () {
        var deDate = new Date();
        deDate.setDate(deDate.getDate() + 7);
        deDate.setHours(0,0,0);
        if (storage !== null) {
            storage.setItem('deDate', deDate);
            storage.setItem('cityName',vars.city);
        }
        ad.remove();
    });
});
