/**
 * Created by Sunny on 14-7-30.
 */
(function (window, factory) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
        define('navflayer/navflayer_new', [], function () {
            return factory(window);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        factory(window);
    }
})(window, function (window) {
    'use strict';
    var $ = window.$, bodyHeight, updateTimer,
        header = $('header'),
        hIcon = header.children('div.head-icon'),
        // hCenter = header.children('div.cent'),
        icoNav = hIcon.find('a.icon-nav'), userName,
        nav = $('#nav').css({position: 'absolute', width: '100%', top: '44px', 'z-index': '9999'}), headerPosition,
        navShadow = $('div#navShadow').css({
            position: 'absolute',
            'z-index': '9998'
        }), smsNum, smsNumContainer, callback = window.navFlayer || (window.navFlayer = {});
    // 在这里定义函数
    var showNav = function () {
        nav.show();
        navShadow.show();
        bodyHeight = document.body.scrollHeight - 60;
        navShadow.css({height: bodyHeight + 'px'});
        updateTimer = setInterval(function () {
            var height = document.body.scrollHeight - 60;
            if (bodyHeight !== height) {
                bodyHeight = height;
                navShadow.css({height: bodyHeight + 'px'});
            }
        }, 3000);
        icoNav.addClass('active');
        if (!smsNum) {
            smsNum = $('.sms-num').first();
            smsNumContainer = smsNum.parent();
            smsNum.detach();
        }
        headerPosition = header.css('position');
        headerPosition !== 'absolute' && header.css({
            position: 'absolute',
            width: '100%',
            top: '0px',
            'z-index': '9999'
        });
        // undefined===userName&&$.get('/public/?c=public&a=ajaxUserInfo',function(o){userName='',o!= !1 && undefined!=o.username && $('div#nav div.mt10 div.nav-tit a').text(userName=o.username)});
        if (undefined === userName) {
            $.get('/public/?c=public&a=ajaxUserInfo', function (o) {
                if (o.nickname) {
                    userName = o.nickname;
                } else if (o.username) {
                    userName = o.username;
                } else {
                    userName = '我的房天下';
                }
                $('div#nav div.mt10 div.nav-tit a').text(userName);
            });
        }
        $.isFunction(callback.show) && callback.show();
    };
    var hideNav = function () {
        nav.hide();
        navShadow.hide();
        clearInterval(updateTimer);
        icoNav.removeClass('active');
        headerPosition !== 'absolute' && header.css({position: headerPosition});
        !!smsNumContainer && smsNumContainer.append(smsNum);
        $.isFunction(callback.hide) && callback.hide();
    };
    icoNav.on('click', function () {
        if (nav.is(':hidden')) {
            showNav();
            $('#headSear').hide();
        } else {
            hideNav();
        }
    });
    navShadow.on('click', function () {
        hideNav();
        $('#headSear').hide();
    });
    callback.hideNav = hideNav;
    return callback;
});
