(function () {

    var now = { row: 1, col: 1 },
        last = { row: 0, col: 0 };
    const towards = { up: 1, right: 2, down: 3, left: 4 };
    var isAnimating = false;
    //var hw=518/320;
    //var os=window.innerHeight/window.innerWidth;
    //var s;
    //if(os<hw && os>1){
    //	var nw=window.innerHeight/hw;
    //	s=nw/window.innerWidth;
    //}
    //ss=259*(1-s);
    //
    //$('.pBg-b').css('width',nw);
    //$('.wrap').css('-webkit-transform','scale('+s+','+s+') translate(0px,-'+ss+'px)');

    document.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);

    $(document).swipeUp(function () {
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;

        if (last.row != 9) {
            now.row = last.row + 1;
            now.col = 1;
            pageMove(towards.up);
        }

    })
    $(document).swipeDown(function () {
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;
        if (last.row != 1) {
            now.row = last.row - 1;
            now.col = 1;
            pageMove(towards.down);
        }
    })

    function pageMove(tw) {
        var lastPage = ".page-" + last.row + "-" + last.col,
            nowPage = ".page-" + now.row + "-" + now.col;

        switch (tw) {
            case towards.up:
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case towards.down:
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
        }
        isAnimating = true;
        $(nowPage).removeClass("hide");

        $(lastPage).addClass(outClass);
        $(nowPage).addClass(inClass);

        setTimeout(function () {
            $(lastPage).removeClass('page-current');
            $(lastPage).removeClass(outClass);
            $(lastPage).addClass("hide");
            //$(lastPage).find("img").addClass("hide");

            $(nowPage).addClass('page-current');
            $(nowPage).removeClass(inClass);
            //$(nowPage).find("img").removeClass("hide");

            isAnimating = false;
        }, 800);
    }
    // 分享
    new Weixin({
        debug: false,
        shareTitle: '上海宝安大厦荣耀招租',
        descContent: '上海商业典范、世界金融中心',
        lineLink: location.href,
        imgUrl: 'http://static.soufunimg.com/common_m/m_activity/fangsh1/images/share.jpg',
        swapTitle: false
    });
})();