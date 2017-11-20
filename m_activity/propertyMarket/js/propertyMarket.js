$(function () {
    var Swiper = window.Swiper;
    var compateAnimation = '';
    var timeOutId = '';
    if (Swiper) {
        new Swiper('.swiper-container-v', {
            direction: 'vertical',
            spaceBetween: 0,
            onSlideChangeEnd: function (swiper) {
                var ele = swiper.slides[swiper.activeIndex];
                var $ele = $(ele).find('.swiper-slide-active .answer');
                var currentNum = $ele.parent().parent().index() + 1;
                $ele.removeClass('scale' + currentNum);
                setTimeout(function () {
                    $ele.addClass('scale' + currentNum);
                }, 0);
            },
            onTouchEnd: function (swiper) {
                timeOutId && clearTimeout(timeOutId);
                if (swiper.isEnd) {
                    timeOutId = setTimeout(function () {
                        window.location.href = 'https://m.fang.com/ask/bj.html?src=client';
                    }, 300);
                }
            }
        });
        new Swiper('.swiper-container-h', {
            direction: 'horizontal',
            grabCursor: true,
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: -5,
            onSlideChangeEnd: function (swiper) {
                var ele = swiper.slides[swiper.activeIndex];
                var currentNum = swiper.activeIndex + 1;
                var $ele = $(ele).find('.answer');
                $ele.removeClass('scale' + currentNum);
                setTimeout(function () {
                    $ele.addClass('scale' + currentNum);
                }, 0);
            }
        });
    }
});