/**
 * 年中租房生活报告活动
 * by sunwenxiu 2016/7/7
 */
$(function () {
	var bgMusic = $('#musicBg').get(0);
    // 播放背景音乐
    bgMusic.play();
	$(document).one('touchstart',function () {
        bgMusic.play();
    });
    // 初始化Swiper插件
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical',
        onSlideChangeEnd: function(swiper) {
            var index = swiper.activeIndex + 1;
            var preIndex = swiper.previousIndex + 1;
            $('#pt'+preIndex+'Box').hide();
            $('#pt'+index+'Box').show();
        }
    });
    // 放心房按钮链接
    $('#btn1').on('click', function () {
        location.href = 'http://m.fang.com/zt/wap/201603/fangtianxiziying.html?city=bj&m=zf';
    });
    // 看世界按钮链接
    $('#btn2').on('click', function () {
        location.href = 'http://m.youtx.com/zhuanti/summer.html?utm_source=rental ';
    });

});