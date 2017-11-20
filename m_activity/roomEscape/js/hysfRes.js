/**
 * Created by css on 2016/3/10.
 */
$(function () {
    'use strict';
    var $shareShow = $('.share');
    // 用户id
    var userIdStr = $('.user_id_js').val();
    function initpar() {
        var starcountstr = $('.star-count').html();
        if (starcountstr.indexOf('拾') > -1) {
            $('.y-star').css('background-size','contain');
        }
    }
    initpar();
    // 再玩一次
    $('.zwyc').on('click', function () {
        var repUrlStr = '/huodongAC.d?class=RoomEscapeHc&m=transfer&orgi=0&roomSt=1'
            + '&userIst=' + userIdStr;
        location.replace(repUrlStr);
    });
    // 炫耀一下  分享
    $('.xyyx').on('click', function () {
        $shareShow.show();
        setTimeout(function () {
            $shareShow.hide();
        }, 3000);
    });
});
