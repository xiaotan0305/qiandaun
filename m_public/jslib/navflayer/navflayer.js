/**
 * Created by Sunny on 14-7-30.
 */
(function (window, factory) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
        define('navflayer/navflayer', [], function () {
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
    var $ = window.$, bodyHeight,
        header = $('header'),
        hIcon = header.children('div.hIcon'),
       // hCenter = header.children('div.hCenter'),
        icoNav = hIcon.find('a.ico-nav'), userName,
        nav = $('#nav').css({position: 'fixed', width: '100%', top: '51px', 'z-index': '9999'}), headerPosition,
        navShadow = $('div#navShadow').css({
            position: 'fixed',
            'z-index': '9998'
        }), smsNum, smsNumContainer, callback = window.navFlayer || (window.navFlayer = {});
    // 在这里定义函数
    var showNav = function () {
        nav.show();
        navShadow.show();
        if (!bodyHeight) {
            bodyHeight = document.body.scrollHeight;
            navShadow.css({height: bodyHeight + 'px'});
        }
        icoNav.addClass('active');
        if (!smsNum) {
            smsNum = $('.sms-num').first();
            smsNumContainer = smsNum.parent();
            smsNum.detach();
        }
        headerPosition = header.css('position');
        headerPosition !== 'fixed' && header.css({
            position: 'fixed',
            width: '100%',
            top: '0px',
            'z-index': '9999'
        });
        if (undefined === userName) {
            $.get('/public/?c=public&a=ajaxUserInfo', function (o) {
                userName = '';
                if (o && o.username) {
                    $('div#nav div.mt10 div.nav-tit a').text(userName = o.username);
                }
            });
        }
        $.isFunction(callback.show) && callback.show();
    };
    var hideNav = function () {
        nav.hide();
        navShadow.hide();
        icoNav.removeClass('active');
        headerPosition !== 'fixed' && header.css({position: headerPosition});
        !!smsNumContainer && smsNumContainer.append(smsNum);
        $.isFunction(callback.hide) && callback.hide();
    };
    icoNav.on('click', function () {
        if (nav.is(':hidden')) {
            showNav();
        } else {
            hideNav();
        }
    });
    navShadow.on('click', function () {
        hideNav();
    });
    callback.hideNav = hideNav;
    return callback;
});