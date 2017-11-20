/**
 * @file fangchan.js
 * @author tankunpeng(tankunpeng@fang.com)
 * @update tankunpeng 2017/2/24
 */
$(function () {
    'use strict';
    var dropUp = $('.drop-up');

    /**
     * swiper 切换效果
     */
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: true,
        onInit: function (swiper) {
            $(swiper.slides[swiper.activeIndex]).find('.aniBox').removeClass('none');
        },
        onSlideChangeEnd: function (swiper) {
            var activeIndex = swiper.activeIndex;
            var prevIndex = swiper.previousIndex;
            // if (activeIndex % 4 === 3) {
            //     dropUp.hide();
            // }else {
            //     dropUp.show();
            // }
            $(swiper.slides[activeIndex]).find('.aniBox').removeClass('none');
            $(swiper.slides[prevIndex]).find('.aniBox').addClass('none');
        }
    });

    /**
     * audio 控制
     */
    var audio = $('#media').get(0),
        audioBtn = $('#audio_btn');
    audio.addEventListener('canplaythrough', function () {
        audio.play();
    }, false);
    audioBtn.on('click', function (ev) {
        ev.stopPropagation();
        if (audioBtn.hasClass('rotate')) {
            audio.pause();
            audioBtn.removeClass('rotate');
        }else {
            audio.play();
            audioBtn.addClass('rotate');
        }
    });
    // 解决部分微信音频不能自动播放问题
    $(document).one('touchstart', function () {
        audio.play();
    });
    document.addEventListener('WeixinJSBridgeReady', function () {
        audio.play();
    }, false);
});