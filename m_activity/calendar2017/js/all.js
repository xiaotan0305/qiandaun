var touchAble = true;
var idArr = ['page0','page1','page2','page3','page4','page5','page19','page20','page30','page37','page45','page99','pageEnd'];
var effects = $('.effects');

function getIndex(str) {
    for (var i = 0,len = idArr.length; i < len; i++) {
        if (idArr[i] === str) {
            return i;
        }
    }
}

$(document).ready(function () {
    var succ = document.querySelector('#succ');
    var rip = document.querySelector('#rip');

    var slide = $('.effect');
    var effectsRili = effects.find('.rili');
    var pos = {
        startY: 0,
        endY: 0
    };

    slide.on('touchstart', function (event) {
        var ev = event.originalEvent.changedTouches[0];
        pos.startY = ev.clientY;
    }).on('touchmove', function (event) {
        var ev = event.originalEvent.changedTouches[0];
        pos.endY = ev.clientY;
    }).on('touchend', function () {
        // console.log(pos.endY - pos.startY);
        if (pos.endY === 0) {
            pos.endY = pos.startY;
        }
        if (!touchAble) {
            return;
        }
        var thisId = this.id;
        if (pos.endY - pos.startY > 50) {
            touchAble = false;
            if (thisId !== 'pageEnd') {
                rip.play();
            }
            if (thisId === 'page99') {
                setTimeout(function () {
                    succ.play();
                },1500);
            }
            
            if (thisId !== 'pageEnd') {
                $(this).addClass('animated ripAni');
                window.currentId = thisId;
                window.localStorage.setItem('currentId',idArr[getIndex(thisId) + 1]);
                setTimeout(function () {
                    $('#' + window.currentId).hide();
                    effects.hide().removeClass('animated ripAni1');
                    touchAble = true;
                },2000);
            }

            if (thisId === 'page0') {
                $('.liewen').fadeIn();
            }

            var day = 0;
            if (thisId === 'page5') {
                day = 5;
                effectsRili.each(function (index, el) {
                    var ele = $(el);
                    ele.find('img').eq(0).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/2017word_03.png');
                    ele.find('img').eq(1).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/zb_05.png');
                    ele.find('.rili-cent').css('color', '#10954c');
                });
                effects.css('z-index', '14');
                effects.show().removeClass('col3 col4 col5').addClass('animated ripAni1');
            }
            if (thisId === 'page20') {
                day = 20;
                effectsRili.each(function (index, el) {
                    var ele = $(el);
                    ele.find('img').eq(0).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/2017word_04.png');
                    ele.find('img').eq(1).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/zb_20.png');
                    ele.find('.rili-cent').css('color', '#e8b52d');
                    ele.find('span').html(++day);
                });
                effects.css('z-index', '11').show().removeClass('col3 col4 col5').addClass('animated ripAni1 col4');
            }
            if (thisId === 'page30') {
                day = 30;
                effectsRili.each(function (index, el) {
                    var ele = $(el);
                    ele.find('img').eq(0).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/2017word_04.png');
                    ele.find('img').eq(1).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/zb_30.png');
                    ele.find('.rili-cent').css('color', '#e8b52d');
                    ele.find('span').html(++day);
                });
                effects.css('z-index', '9').show().removeClass('col3 col4 col5').addClass('animated ripAni1 col4');
            }
            if (thisId === 'page37') {
                day = 37;
                effectsRili.each(function (index, el) {
                    var ele = $(el);
                    ele.find('img').eq(0).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/2017word_04.png');
                    $(el).find('img').eq(1).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/zb_37.png');
                    ele.find('.rili-cent').css('color', '#e8b52d');
                    ele.find('span').html(++day);
                });
                effects.css('z-index', '7').show().removeClass('col3 col4 col5').addClass('animated ripAni1 col4');
            }
            if (thisId === 'page45') {
                day = 45;
                effectsRili.each(function (index, el) {
                    var ele = $(el);
                    ele.find('img').eq(0).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/2017word_05.png');
                    ele.find('img').eq(1).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/zb_45.png');
                    ele.find('.rili-cent').css('color', '#ee761e');
                    ele.find('span').html(++day);
                });
                effects.css('z-index', '5').show().removeClass('col3 col4 col5').addClass('animated ripAni1 col5');
            }
            if (thisId === 'page99') {
                effectsRili.each(function (index, el) {
                    var ele = $(el);
                    ele.find('img').eq(0).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/2017word_05.png');
                    $(el).find('img').eq(1).attr('src', '//static.test.soufunimg.com/common_m/m_activity/calendar2017/images/zb_99.png');
                });
                $('.gongxi').addClass('animated zoomIn');
                $('.slider').hide();
            }
        }else if (pos.endY - pos.startY < -50) {
            touchAble = false;
            
            if (thisId !== 'pageEnd') {
                $('#' + idArr[getIndex(thisId) - 1]).show().removeClass('animated ripAni ripIn').addClass('ripIn');
                window.currentId = thisId;
                window.localStorage.setItem('currentId',idArr[getIndex(thisId) - 1]);
                setTimeout(function () {
                    touchAble = true;
                },1000);
            }
            if (thisId === 'page1') {
                $('.liewen').hide();
                $('.float').hide();
            }
        }
        pos.endY = 0;
    });

    $(document).on('touchmove', function (ev) {
        ev.preventDefault();
    });

    window.storedId = window.localStorage.getItem('currentId');
    if (storedId) {
        for (var i = 0,len = idArr.length; i < len; i++) {
            if (idArr[i] !== storedId) {
                $('#' + idArr[i]).hide().addClass('animated ripAni');
                if (storedId !== 'page0') {
                    $('.liewen').show();
                }
            }else {
                return;
            }
        }
    }
});
// js play
function playAudio(ele) {
    ele.play();
}
// weixin play
function audioAutoPlay(id) {
    var audio = document.getElementById(id);
    audio.play();
    document.addEventListener('WeixinJSBridgeReady', function () {
        audio.play();
    }, false);
}
window.onload = function () {
    $('.float').on('touchend', function (event) {
        $(this).hide();
    });

    setTimeout(function () {
        document.querySelector('.loading').style.display = 'none';
        $('#main').addClass('aniShow');
        if (storedId !== 'pageEnd') {
            $('.slider').show();
        }
    },2000);

    var bgm = document.querySelector('#bgm');
    playAudio(bgm);

    audioAutoPlay('bgm');

    $('#refresh').attr('href', location.href + '?timestamp=' + new Date().getTime()).on('click', function () {
        window.localStorage.removeItem('currentId');
    });

    $('.top').on('click', function () {
        window.localStorage.removeItem('currentId');
    });

    // 微信、QQ分享
    var weixin = new Weixin({
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        shareTitle: '新年计划——我的2017买房日历',
        descContent: '把购房大计拆成日，总共分几步？',
        swapTitle: false,
        lineLink: location.href,
        imgUrl: location.protocol + '//static.soufunimg.com/common_m/m_activity/calendar2017/images/share.jpg'
    });

    // APP分享
    var dataForWeixin = {
        title: '新年计划——我的2017买房日历',
        desc: '把购房大计拆成日，总共分几步？',
        url: location.href,
        TLImg: location.protocol + '//static.soufunimg.com/common_m/m_activity/calendar2017/images/share.jpg'
    };
    $('#soufunclient').html('1$' + dataForWeixin.desc + '$' + dataForWeixin.url + '$' + dataForWeixin.TLImg);
};