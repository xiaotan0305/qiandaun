// JavaScript Document
$(function () {
    'use strict';
    var oShare = $('.share');
    var oMengCheng = $('.mengceng');
    $('.fenxiang_btn').click(function () {
        oShare.removeClass('hide');
        oMengCheng.removeClass('hide').on('click', function () {
            $(this).addClass('hide');
            oShare.removeClass('hide');
        });
    });
});