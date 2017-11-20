/**
 * @Author: chenshaoshan
 * @Date:   2016/01/26
 * @description: 2016，我想和你在一起！
 * @Last Modified by:   chenshaoshan
 * @Last Modified time:
 */
$(function () {
    'use strict';
    var wyMusicAudio = null;

    var vowIdStr = $('.share_id_js').val();
    var sharecontenStr = $('.share_content_js').val();
    var isWXAPPstr = $('.is_WX_APP_js').val();
// ------------function------------------------------------------------------------

    function loadMusic() {
        if ( $('.audio').length > 0 ) {
            var audio = document.querySelector('.audio');
            wyMusicAudio = audio.querySelector('#music_audio');
        }
    }

    function initPros() {
        setTimeout(function () {
            $('.show_f_panel_js').hide();
            $('.show_s_panel_js').addClass('swiper-slide-active');
        }, 3000);
        loadMusic();
    }
    initPros();
// ------------listen------------------------------------------------------------

    $('.but_styles').on('click', function () {
        $('.show_s_panel_js').hide();
    });
    // 生成愿望
    $('.gene_desire_js').on('click', function () {
        var activeTemp = swiper.activeIndex;
        if (activeTemp === 0) {
            activeTemp = 31;
        } else if (activeTemp === 32) {
            activeTemp = 1;
        }
        var desireAstr = '.desire_stra_js' + activeTemp;
        var desireBstr = '.desire_strb_js' + activeTemp;
        var desireCstr = '.desire_strc_js' + activeTemp;
        var desireBstrtor = $(desireBstr);
        var desireType = desireBstrtor.attr('type');
        var desireFillstr = desireBstrtor.val();
        if (activeTemp === 31 && !desireFillstr) {
            desireFillstr = desireBstrtor.eq(0).val() || desireBstrtor.eq(1).val();
        }
        if (activeTemp === 31 && desireFillstr.length > 40) {
            alert('限40个字，请确认。');
            return;
        }
        if (desireType === 'text' && !desireFillstr) {
            desireFillstr = desireBstrtor.attr('placeholder');
        }
        var destr = $(desireAstr).html() + desireFillstr + $(desireCstr).html();
        destr = encodeURIComponent(encodeURIComponent(destr));
        var browserstr = $('.browserstr_js').val();
        var countNumstr = $('.countNum_js').val();
        // $('.desire_content_js').val(destr);
        // $('#desireform').submit();
        window.location.href = 'http://'
            + window.location.host
            + '/huodongAC.d?class=Vow2016Hc&m=vowContent&countNum='
            + countNumstr
            + '&browserstr='
            + browserstr
            + '&contentAll='
            + destr;

    });

    // 分享
    $('.share').on('touchend',function () {
        if (isWXAPPstr === 'true') {
            $('.tanceng').show();
            setTimeout(function () {
                $('.tanceng').hide();
            }, 3000);
        } else {
            myShare(this, {
                backUrl: 'http://'+window.location.host+'/huodongAC.d?class=Vow2016Hc&m=vowIndex&vowId=' + vowIdStr,
                title: '2016，我想和你在一起',
                summary: sharecontenStr,
                PicUrl: $('.output_fileurl_js').val() + 'img03.jpg',
                titlesina: '2016，我想和你在一起',
                type: 'activity'
            });
        }

    });
    // 一起按钮的  跳转  http://m.fang.com/zhishi/xf/
    $('.fl').on('click', function () {
        window.location.href = 'http://m.fang.com/zhishi/xf/';
    });
    //  音乐
    var isplayAudio = true;
    $('.muic_span span').on('click', function () {
        $(this).find('img').toggleClass('anmaine');
        if (isplayAudio) {
            wyMusicAudio.pause();
            isplayAudio = false;
        } else {
            wyMusicAudio.play();
            isplayAudio = true;
        }
    });

    // 显示 私人定制 按钮
    $('.desire_slide_js').on('touchmove', function () {
        $('.posinal').show();
    });
    $('.swiper-button-next').on('click', function () {
        $('.posinal').show();
    });
    $('.swiper-button-prev').on('click', function () {
        $('.posinal').show();
    });

});