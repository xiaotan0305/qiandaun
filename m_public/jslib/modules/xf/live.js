/**
 * 直播
 */
define('modules/xf/live', ['jquery', 'hammer/2.0.4/hammer'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var Util = require('util/util');
    var sfut = Util.getCookie('sfut');


    $('.xflive>iframe').after('<div class="xflivediv" style="height: 150px;position: absolute;width: 100px;height: 150px;top: 0px;right: 0px;"></div>');

    // 阻止页面滑动
    function unable() {
        document.addEventListener('touchmove', preventDefault);
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    // 取消阻止页面滑动
    function enable() {
        document.removeEventListener('touchmove', preventDefault);
    }

	var $xflive = $('.xflive');
    var nowRight = parseInt($xflive.css('right'));
    var nowTop = parseInt($xflive.css('top'));
    var deltaX, deltaY;
    // hammerIcon
    var hammerIcon = new Hammer($xflive[0]);
    // 允许识别垂直pan和swipe事件
    hammerIcon.get('pan').set({direction: Hammer.DIRECTION_ALL});
    hammerIcon.on('panstart', function (e) {
        unable();
    });
    hammerIcon.on('pan', function (e) {
        unable();
        deltaX = e.deltaX;
        deltaY = e.deltaY;
        $xflive.css({right: nowRight - deltaX, top: nowTop + deltaY});
    });
    hammerIcon.on('panend', function (e) {
        enable();
        nowRight -= deltaX;
        nowTop += deltaY;
        endPosition(nowRight, nowTop);
    });

    var windowWid = $(window).width();
    var windowHei = $(window).height();
    var liveWid = $xflive.width();
    var liveHei = 150; //$xflive.height();
    var endPosition = function (x, y) {
        if (x < 0) {
            nowRight = 0;
        } else if (x > windowWid - liveWid) {
            nowRight = windowWid - liveWid;
        }
        if (y < 0) {
            nowTop = 0;
        } else if (y > windowHei - liveHei) {
            nowTop = windowHei - liveHei;
        }

        var left = windowWid - nowRight - $xflive.width(),
            right = nowRight,
            middle = (windowWid - liveWid) / 2;
        if (left < middle) {
            nowRight = windowWid - $xflive.width()
        } else if (right < middle) {
            nowRight = 0;
        }
        $xflive.css({right: nowRight, top: nowTop});
        enable();
    };
    endPosition(nowRight, nowTop);

    $xflive.on('touchstart', function () {
        unable();
    });
    $xflive.on('touchend', function () {
        enable();
    });


    $xflive.css({width: '100px', height: '150px', color: 'red'});

    $('.xflive .close').on('click', function () {
        $xflive.hide();
    });

    var dangzhe = true;
    $xflive.on('click', function () {
        if (dangzhe) {
            $('.xflivediv').css('z-index', '-1000');
            dangzhe = false;
            $xflive.click();
            console.log('bofang');
        } else {
            $('.xflivediv').css('z-index', '1000');
            dangzhe = true;
        }

    })
});
