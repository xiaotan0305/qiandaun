/**
 *
 * @authors Your Name (you@example.org)
 * @date    2016-01-15 15:10:27
 * @version $Id$
 */

$(function () {
    'use strict';
    var winH = $(window).height();
    var myShare = window.myShare;
    var requestFrom = $('#requestOrigin').val();
    if (winH <= 425) {
        $('.tiaoma em a').css('width', '2rem');
        $('.tiaoma em a').css('height', '2rem');
        $('.tishi').css('height', '10rem');
        $('.game_indc_cont').css('padding-top', '0');
        $('.game_sahre_cont').css('padding-top', '0.33333rem');
        $('.time_top').css('padding-top', '3.1rem');
        $('.game_indao_bot').css('bottom', '0.3rem');
        $('.game_indao_top').css('top', '0.7rem');
        $('.city_cont em img').css('height', '2rem');
        $('.butst').css('padding-top', '0');
        $('.fu_L').css('padding-top', '0.4rem');
        $('.fu_tiao_L img').css('height', '2.5rem');
        $('.fu_tiao_R img').css('height', '2.5rem');
    }

    $('.but_share').on('click', function () {
        if (requestFrom && (requestFrom === 'weixin' || requestFrom.toLowerCase().indexOf('app') !== -1)) {
            $('.tanceng').show();
            $('.want_share').show();
            setTimeout(function () {
                $('.tanceng').hide();
                $('.want_share').hide();
                $('.game_indc').hide();
            },2000);
        } else {
            myShare(this, {
                backUrl: $('#mainSite').val() + '/activityshow/monkeyBrick/yindao.jsp',
                title: '看谁抢的多 躁起来！',
                summary: '猴年比财运！我搬了' + $('#brickNum').val() + '块金砖盖房，你呢？',
                PicUrl: $('#imgSite').val() + 'monkeyBrick/images/begin_mo.png',
                titlesina: '看谁抢的多 躁起来！',
                type: 'activity'
            });
        }
    });

    $('.sub_begin').on('click', function () {
        $('.tanceng').show();
        $('.game_indc').show();
    });
    $('.tanceng').on('click', function () {
        $('.tanceng').hide();
        $('.want_share').hide();
        $('.game_indc').hide();
    });
});