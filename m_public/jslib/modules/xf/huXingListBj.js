define('modules/xf/huXingListBj', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var IScrolllist = require('iscroll/2.0.0/iscroll-lite');

    // 统计行为 --------------start
    require.async('jsub/_vb.js?c=mnhpagetype');
    require.async('jsub/_ubm.js?_2017102307fdsfsdfdsd', function () {
        _ub.city = vars.ubcity;
        // 业务---WAP端
        _ub.biz = 'n';
        // 方位（南北方) ，北方为0，南方为1
        _ub.location = vars.ublocation;
        // 用户动作（浏览0、搜索1、打电话31、即时通讯24、预约25）
        var b = 0;
        var pTemp = {
            // 楼盘id
            'vmn.projectid': vars.ubnewcode,
            // 所属页面
            'vmg.page': 'mnhpagetype',
            'vmg.sourceapp':vars.is_sfApp_visit + '^xf'
        };
        // 用户行为(格式：'字段编号':'值')
        var p = {};
        // 若pTemp中属性为空或者无效，则不传入p中
        for (var temp in pTemp) {
            if (pTemp[temp] && pTemp[temp].length > 0) {
                p[temp] = pTemp[temp];
            }
        }
        // 收集方法
        _ub.collect(b, p);
    });
    // 查看户型
    function yhxw(str) {
        // 收集方法
        _ub.collect(1, {
            'vmn.seehousetype': encodeURIComponent(str)
        });
    }

    var room = window.location.href.split('&room=')[1];
    if (room && room.length) {
        $('#choose a[data-id=' + room + ']').click();
    }
	
    // 顶部滑动
    var overboxInWid = 12;
    $('.overboxIn a').each(function () {
        var $this = $(this);
        overboxInWid = overboxInWid + $this.width() + 24;
    });
    $('.overboxIn').width(overboxInWid);
    new IScrolllist('.overbox', {scrollX: true, scrollY: false, bindToWrapper: true, eventPassthrough: true});

    // 已选中的部分滑动到屏幕中
    var activeObj = $('.overboxIn a.active');
    var left = activeObj.offset().left + activeObj.outerWidth() + 12;
    var winW = $(window).width();
    if (left > winW) {
        $('.overbox').scrollLeft(left - winW);
    }

    // 类型初始化
    $('.hx-LList ul').each(function () {
        var $this = $(this);
        $this.find('li').eq(0).addClass('active');
    });

    // 计算类型的数量
    $('.ixent .hx-RList').each(function () {
        var $this = $(this);
        var num = $this.find('li').length;
        $this.find('h3').html($this.find('h3').html() + ' ' + num);
    });

   

    // 内容可滑动
	if(vars.src != 'client'){
		$('.ixent').height($(window).height() - 32 - 36 - 44).css('overflow', 'scroll');
	}else{
		$('.ixent').height($(window).height() - 32 - 36 ).css('overflow', 'scroll');
	}

   

    // 点击左侧类型
    $('.hx-LList li').on('click', function () {
        var $this = $(this);
        if (!$this.hasClass('active')) {
            var className = $this.parent()[0].className;
            var index = $this.index();
            $this.siblings().removeClass('active');
            $this.addClass('active');
            var thisArticle = $('.ixent.' + className).find('article');
            var a = thisArticle.eq(index).position().top - thisArticle.eq(0).position().top;
            $('.' + className).animate({scrollTop: a + 'px'}, 500);
        }
    });

    var room = location.href.split('room=')[1];
    if (room) {
        $('.overboxIn .r' + room).click();
    }

    $('.relative .ixent').append('<div class="div"></div>');
    var setDivHei = function () {
        $('.relative .ixent').each(function () {
            var $this = $(this);
            if ($this.find('.hx-RList').length < 2 ) {
                return;
            }
            var height = $('.hxnr').height() - $this.find('.hx-RList').eq(-1).height() - 66;
            $this.find('.div').height(height);
        })
    };
    setDivHei();
});
