define('modules/xf/allimg', ['jquery', 'lazyload/1.9.1/lazyload', 'modules/xf/head', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
    $ = require('lazyload/1.9.1/lazyload');
    require('modules/xf/head');
    $('img.lazy').lazyload({
        container: $('#container')
    });

    // 顶部导航滑动
    var scrollerTopWid = 14;
    $('#scrollerTop a').each(function () {
        scrollerTopWid = scrollerTopWid + $(this).width() + 24 ;
    });
    $('#scrollerTop').width(scrollerTopWid);
    new IScrolllist('#wrapperTop', {scrollX: true, bindToWrapper: true, eventPassthrough: true});

    // 底部导航滑动
    var scrollerWid = 14;
    $('#scroller a').each(function () {
        scrollerWid = scrollerWid + $(this).width() + 30 + 4;
    });
    $('#scroller').width(scrollerWid);
    new IScrolllist('#wrapper', {scrollX: true, bindToWrapper: true, eventPassthrough: true});

    // 顶部点击跳转
    $('#scrollerTop a').on('click', function () {
        $('#scrollerTop a').removeClass('active');
        $(this).addClass('active');
    });

    window.scrollTo(0, 1);

    // 页面滑动与底部联动start
    var h3Top = new Array();
    $('.picbox h3').each(function () {
        var $this = $(this);
        h3Top.push($this.offset().top - 80);
    });

    var halfContainerHei = $('#container').height() / 2;

    var setScrollerActive = function (index) {
        $('#scroller a').removeClass('active');
        var $this = $('#scroller a').eq(index);
        $this.addClass('active');
        //if ($this.position().left + $this.width() > $(window).width()) {
        //    $('#scroller').css('transform', 'translate(-' + ($this.position().left + $this.width() - $(window).width()) + 'px)');
        //}
    };

    var getActiveNum = function (scrollTop) {
        var x;
        for (x in h3Top) {
            if (scrollTop == 0) {
                setScrollerActive(0);
                return;
            }
            if (scrollTop + halfContainerHei <= h3Top[x]) {
                setScrollerActive(x - 1);
                return;
            }
        }
    };

    var i = 0;
    $('#container').on('scroll', function () {
        var scrollTop = $('#container')[0].scrollTop;
        i++;
        if (i > 20 || scrollTop == 0) {
            i = 0;
            getActiveNum(scrollTop);
        }
    });
    $('#container .picbox').on('touchend', function () {
        setTimeout(function () {
            getActiveNum($('#container')[0].scrollTop);
        }, 500);
    });
    // 页面滑动与底部联动end

    // 统计行为start (2016年5月16日)
    function yhxw() {
        // 所在城市（中文）
        _ub.city = vars.ubcity;
        // 新房“n”
        _ub.biz = 'n';
        // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
        _ub.location = vars.ublocation;
        // 浏览收集方法
        _ub.collect(0, {
            // 所属页面
            'vmg.page': 'mnhpagephoto',
            // 楼盘id
            'vmn.projectid': vars.newcode,
            'vmg.sourceapp':vars.is_sfApp_visit + '^xf'
        });
    }

    require.async('//jsub.fang.com/_vb.js?c=mnhpagephoto');
    require.async('//jsub.fang.com/_ubm.js?_2017102307fdsfsdfdsd', function () {
        yhxw();
    });
});