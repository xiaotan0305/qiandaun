/**
 * Created by sunwenxiu on 2017/7/5.
 */
$(function () {
    'use strict';
    var encity = $('#encity').val();
    var cityName = '';
    // 城市选择box
    var $Tcitynr = $('.Tcitynr');
    // 选中城市
    var $seleCity = $('#seleCity');
    // 渲染城市
    function renderCity() {
        // $seleCity.text(cityName + '>');
        $Tcitynr.find('a').removeClass('cur');
        $Tcitynr.find('a[data_en="' + encity + '"]').addClass('cur');
    }
    renderCity();
    // 切换选择城市
    $('.Tcity').on('click', function () {
        $Tcitynr.toggle();
    });
    $Tcitynr.find('a').on('click', function () {
        var $this = $(this);
        cityName = $this.text();
        encity = $this.attr('data_en');
        $Tcitynr.hide();
        renderCity();
    });
    // 底部选择栏
    var $floatTel = $('.floatTel');
    // 标识点击导航滚动页面
    var clickSelect = false;
    var $banner = $('.banner');
    var $nav = $floatTel.find('a');
    // 导航条的视窗宽度
    var floatTelW = $floatTel.width();
    // 一个导航元素的实际宽度
    var itemW = $('.zyf').outerWidth() + 1;
    // console.log(itemW)
    // 导航栏的实际宽度
    var banW = itemW * $nav.length;
    // 视窗范围内实际显示的导航元素的个数
    var showLength = floatTelW / itemW;
    // 标识是否可以滚动导航条
    var isScroll = false;
    if (floatTelW < banW) {
        isScroll = true;
        // 重新设置导航栏的宽度百分比
        $floatTel.find('.nr').css('width', banW);
    }
    var iscroll = new IScrollLite('.floatTel', {
        // 滚动为该节点
        bindToWrapper: true,
        // 开启横向滚动
        scrollX: true,
        // 禁止纵向滚动
        scrollY: false,
        tap: true
    });
    $floatTel.on('tap', 'a', function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        clickSelect = true;
        $('html, body').animate({
            scrollTop: $('#' + $(this).attr('data-name')).offset().top
        }, 500, 'swing', function () {
            clickSelect = false;
        });
        return false;
    });
    window.onscroll = function () {
        if (clickSelect) {
            // 点击导航滚动页面的时候取消滚动条的监听事件 否则会冲突
            return;
        }
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        for (var i = 0, len = $banner.length; i < len; i++) {
            var banTop = $banner[i].offsetTop;
            if (scrollTop >= banTop && scrollTop <= banTop + $($banner[i]).height()) {
                var $navi = $($nav[i]);
                $navi.addClass('cur').siblings('a').removeClass('cur');
                if (isScroll && i > showLength - 1) {
                    iscroll.scrollToElement('.' + $navi.attr('data-name'));
                } else {
                    // 切换到导航条第一个元素
                    iscroll.scrollToElement('.zyf');
                }
            }
        }
    };

    // 微信分享
    var weixin = new Weixin({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        shareTitle: '毕业没住处 快来找月付',
        descContent: '月付房，真实房源，真实优惠，品牌保障，安心签约',
        lineLink: location.href,
        imgUrl: location.protocol + $('#srcSite').val() + '/common_m/m_activity/specialTopicPage2/images/share.jpg',
        swapTitle: true
    });
    var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 30,
        autoplay: 3000,
        direction: 'horizontal',
        loop: true
    });
    window.onload = function () {
        // 处理浏览器刷新不跳转到页面顶部的行为
        setTimeout(function () {
            window.scrollTo(0, 0);
            $($nav[0]).addClass('cur').siblings('a').removeClass('cur');
        }, 0);
    };
    // 没有广告的情况处理
    if (!$('.swiper-wrapper').html().trim()) {
        $('.swiper-container').hide();
        $('.titlehz').hide();
    }
});