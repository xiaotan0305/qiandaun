// 微信分享
window.wx.config({
    appId: appId,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
});
var shareurl = window.location.href;

/* 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口*/
window.wx.ready(function () {
    window.wx.onMenuShareTimeline({
        title: '大数据解密装修百态',
        link: shareurl,
        imgUrl: jiajuImgUrl+'other_images/zxwp.jpg',
        success: function () {
            // 用户确认分享后执行的回调函数
            var okurl = jiajuSite + '?c=jiajuact&a=ajaxHdShareCount&ActivityID=2&r=' + Math.random();
            $.ajax(okurl);

        }
    });

    /* 获取“分享给朋友”按钮点击状态及自定义分享内容接口*/
    window.wx.onMenuShareAppMessage({
        title: '大数据解密装修百态',
        desc: '2015互联网装修白皮书',
        link: shareurl,
        imgUrl: jiajuImgUrl+'other_images/zxwp.jpg',
        success: function () {
            // 用户确认分享后执行的回调函数
            var okurl = jiajuSite + '?c=jiajuact&a=ajaxHdShareCount&ActivityID=2&r=' + Math.random();
            $.ajax(okurl);
        }
    });
});

var $imgs = $('[data-src]');
var length = $imgs.length;
var loadNum = 0;

$imgs.each(function (index, el) {
    var $this = $(el);
    var src = $this.data('src');
    if (el.tagName.toLowerCase() === 'audio') {
        $this.attr('src', src);
        loadNum++;
    } else {
        var isImg = el.tagName.toLowerCase() === 'img';
        if (isImg) {
            $this.attr('src', src);
        } else {
            $this.css('background-image', 'url(' + src + ')');
        }
        var img = new Image();
        img.src = src;
        $(img).load(loaded);
    }
});
var $loading = $('#loading');
var $num = $loading.find('.num');
var audio = $('#audio')[0];
var $pageList = $('#page_list');
var $pages = $pageList.find('.page');

function loaded() {
    loadNum++;
    $num.text((loadNum / length * 100).toFixed(0) + '%');
    if (loadNum === length) {
        $loading.hide();
        $pages.eq(0).show().addClass('show');
    }
}
var $musicOn = $('.on');
var $musicOff = $('.off');
var $arrowUp = $('.arrow-up');
$('.painting').click(function () {
    var $this = $(this);
    $('.before').addClass('hide');
    $('.after').addClass('show');
    $('.furniture').find('img').addClass('show');
    $this.hide();
    $musicOn.show();
    audio.play();
    setTimeout(function () {
        $arrowUp.show();
        init();
    }, 3550);
});
var isMusicOn = 1;
$('.music').on('touchstart', function () {
    $(this).hide().siblings('.music').show();
    if ($musicOn.is(':hidden')) {
        audio.pause();
        isMusicOn = 0;
    } else {
        audio.play();
        isMusicOn = 1;
    }

})

var slideLocation = {};
var winHeight = parseInt($('#wrap').css('height'), 10);
var winHeightHalf = winHeight / 2;
var pageNow = 1;

function init() {
    $(window).on('touchstart', function (e) {
        e.preventDefault();
        slideLocation.top = parseInt($pageList.css('top'), 10);
        slideLocation.oriX = event.touches[0].pageX;
        slideLocation.oriY = event.touches[0].pageY;
        slideLocation.direction = 0;
        slideLocation.length = 0;
        slideLocation.X = 'nomove';
    }).on('touchmove', function (e) {
        e.preventDefault();
        slideLocation.X = event.touches[0].pageX;
        slideLocation.Y = event.touches[0].pageY;
        if (!slideLocation.direction) {
            var angle = Math.abs(Math.atan((slideLocation.Y - slideLocation.oriY) / (slideLocation.X - slideLocation.oriX))) * 180 / Math.PI;
            if (angle > 45 && angle < 135) {
                slideLocation.direction = slideLocation.Y > slideLocation.oriY ? 'up' : 'down';
            } else {
                slideLocation.direction = 'other';
            }
        } else if ((slideLocation.direction === 'up' && pageNow !== 1) || (slideLocation.direction === 'down' && pageNow !== 11)) {
            slideLocation.length = slideLocation.Y - slideLocation.oriY;

        }
    }).on('touchend', function (e) {
        e.preventDefault();
        if (Math.abs(slideLocation.length) > 30) {
            if (slideLocation.direction === 'up') {
                pageNow = pageNow - 1;
                slide();
            } else if (slideLocation.direction === 'down') {
                pageNow = pageNow + 1;
                slide();
            }
        }
    });
    function slide() {
        var index = pageNow - 1;
        $pages.removeClass('active show').eq(index).addClass('show');
        pageNow > 1 && $pages.eq(index).addClass('active');
        if (pageNow === 11) {
            $arrowUp.hide();
            if (isMusicOn) {
                $musicOn.hide();
            } else {
                $musicOff.hide();
            }
        } else {
            $arrowUp.show();
            if (isMusicOn) {
                $musicOn.show();
            } else {
                $musicOff.show();
            }
        }
    }
    // app下载
    (function (win) {
        var doc = document;
        var $ = win.$;
        var k = function () {
            this.listen();
        };
        k.prototype = {
            listen: function () {
                var that = this;
                $('.download').bind('touchend', function (e) {
                    if (slideLocation.X !== 'nomove') {
                        return false;
                    }
                    var u;
                    var l;
                    var url = '//js.soufunimg.com/common_m/m_public/jslib/app/1.0.1/appopen.js';
                    var callback = function (openApp) {
                        if (typeof win.openApp === 'function') {
                            openApp = win.openApp;
                        }
                        var oa = openApp({
                            url: '//m.fang.com/client.jsp?produce=ftxzx',
                            log: that.log,
                            appurl: 'data/{"address":"home"}',
                            href: 'fangtxzx://',
                            appstoreUrl: 'https://itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8'
                        });
                        oa.openApp();
                    };
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof win.seajs === 'object') {
                        win.seajs.use(url, callback);
                    } else {
                        u = doc.createElement('script');
                        l = doc.getElementsByTagName('head')[0];
                        u.async = true;
                        u.src = url;
                        u.onload = callback;
                        l.appendChild(u);
                    }
                    return false;
                });
            },
            log: function (type) {
                try {
                    $.get('/public/?c=public&a=ajaxOpenAppData', {
                        type: type,
                        rfurl: doc.referrer
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        };
        new k();
    })(window);




}