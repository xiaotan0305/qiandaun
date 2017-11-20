$(function() {
                if ($(window).width() > 1180) {
    $(".desStragUl").css({ height: parseInt($(window).width() * 0.26875) + "px" });
}
; (function () {
    var jugg = null;
    var adesLi = $('.desSmallImgUl li');
    var adesLis = $('.desStragUl li');
    var adesMask = $('.desSmallImgUl .mask');
    var adesBorder = $('.desSmallImgUl .border');
    var n = 0;
    var m = 0;
    adesLis.css('opacity', 0.3);
    adesLis.eq(0).css('opacity', 1);
    adesLi.each(function (index, value) {
        (function (i) {
            adesLi.eq(i).click(function () {
                n = i;

                adesLis.hide();
                adesLis.eq(i).show();
                adesLis.eq(m).stop().animate({ 'opacity': 0.3 }, 800);
                adesLis.eq(i).stop().animate({ 'opacity': 1 }, 800);
                adesMask.show();
                adesMask.eq(i).hide();
                adesBorder.hide();
                adesBorder.eq(i).show();
                m = n;
            });
        })(index);

    });
    function tick() {
        n++;
        if (n == adesLi.length) n = 0;
        adesLis.hide();
        adesLis.eq(n).show();
        adesLis.eq(n - 1).stop().animate({ 'opacity': 0.3 }, 800);
        adesLis.eq(n).stop().animate({ 'opacity': 1 }, 800);
        adesMask.show();
        adesMask.eq(n).hide();
        adesBorder.hide();
        adesBorder.eq(n).show();
    }
    jugg = setInterval(tick, 4000);

    var oJugg = $('.desStragImg');
    oJugg.hover(function () {
        clearInterval(jugg);
    }, function () {
        jugg = setInterval(tick, 4000);
    });
})();
			});