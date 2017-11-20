/**
 * Created by css on 2016/3/9.
 */

$(function () {
    'use strict';

    // 用户id
    var userIdStr = $('.user_id_js').val();

    // 进度条
    var $loadProg = $('.load');
    var progressTemp = 0;

    $(window).load(function () {
        $('.loading').show();
        exeprogress();
    });

    // 进度条
    function exeprogress() {
        progressTemp += 5;
        $loadProg.css('width', progressTemp + '%');
        if (progressTemp < 100) {
            setTimeout(function () {
                exeprogress();
            }, 50);
        } else {
            $('.loading').hide();
            $('.pop-zhsf').show();
        }
    }

    // 点击鉴定
    $('.start').on('click', function () {
        // TODO 至lvingroom
        // var repUrlStr = '/huodongAC.d?class=RoomEscapeHc&m=resultPage&userIst=' + userIdStr;
        var repUrlStr = '/activityshow/roomEscape/lvingroom.jsp?userIst='
            + userIdStr + '&ve=5';
        window.location.href = repUrlStr;
    });

});

