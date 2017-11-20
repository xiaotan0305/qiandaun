define('modules/xf/purchaseGuideList', ['jquery', 'util/util'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var applicationScopeftppath = vars.applicationScopeftppath;
    var requestScopeloupanId = vars.requestScopeloupanId;
    var total = $('#totalpage').html();
    var k = true;
    var w = $(window);
    var curp = 2;
    $('body').scrollTop(1);
    if (total <= 1) {
        $('#drag').hide();
        k = false;
    }

    // 滚动到页面底部时，自动加载更多
    var scrollFlag = false;
    window.addEventListener('scroll', function scrollHandler() {
        var scrollh = $(document).height();
        var bua = navigator.userAgent.toLowerCase();
        if (scrollFlag) {
            if (bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1) {
                scrollh = scrollh - 140;
            } else {
                scrollh = scrollh - 80;
            }
        }
        var c = document.documentElement.clientHeight || document.body.clientHeight, t = $(document).scrollTop();
        if (k != false && ($(document).scrollTop() + w.height()) >= scrollh) {
            load();
        }
    }, 100);
    $('#drag').on('click', function () {
        load();
    });
    function load() {
        var draginner = $('.draginner')[0];
        var total = $('#totalpage').html();
        k = false;
        $('.draginner').css('padding-left', '10px');
        draginner.style.background = 'url(' + applicationScopeftppath + 'touch/img/load.gif) 20px 50% no-repeat';
        draginner.innerHTML = '正在加载...';
        var city = vars.curcity;
        $.post('/xf.d?m=purchaseGuideList&city=' + city + '&loupanId=' + requestScopeloupanId + '&p=' + curp,
            function (data) {
                $('#pgList').append(data);
                $('.draginner').css('padding-left', '0px');
                draginner.style.background = '';
                draginner.innerHTML = '查看更多';
                curp = curp + 1;
                k = true;
                if (curp > parseInt(total)) {
                    $('#drag').hide();
                    k = false;
                }
            }
        );
    }
});