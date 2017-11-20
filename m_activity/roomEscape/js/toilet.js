/**
 * Created by css on 2016/3/9.
 */
$(function () {
    'use strict';
    // 用户id
    var userIdStr = $('.user_id_js').val();

    // 提示板块集
    var $showPanel = $('.show_panel_js');
    var $layerPanel = $('.layer_panel_js');

    // 记录正确触发得分数  本剧可得星星数
    var storeVal = Number($('.store_sum_js').val());;
    var isone = true;
    var istwo = true;
    var isthree = true;

    // 初始化完
    $(window).load(function () {
        setTimeout(function () {
            $('.hint').hide();
        }, 2000);
    });

    // 是否没有乒乓球
    var isNGetBall = true;

    // 点击第一颗星
    $('.star_one_js').on('click', function () {
        $layerPanel.show();
        $('.star_one_js').hide();
        $('.hint1').show();
    });
    // 点击乒乓球 获得
    $('.ball').on('click', function () {
        if (isone) {
            $layerPanel.show();
            $(this).hide();
            $('.hint-intro').show();
            $('.star_one_js').hide();
            isNGetBall = false;
        }
    });
    // 点击地板
    $('.flr').on('click', function () {
        $layerPanel.show();
        if (isNGetBall) {
            $('.hint1').show();
        } else {
            $('.show_one_js').show();
            if (isone) {
                isone = false;
                storeVal += 1;
            }
        }
    });
    // 点击水龙头
    $('.hydrovalve').on('click', function () {
        $layerPanel.show();
        $('.show_two_js').show();
        if (istwo) {
            istwo = false;
            storeVal += 1;
        }
    });
    // 点击马桶
    $('.nightstool').on('click', function () {
        $layerPanel.show();
        $('.show_three_js').show();
        if (isthree) {
            isthree = false;
            storeVal += 1;
        }
    });
    // 点击喷头
    $('.blow').on('click', function () {
        $layerPanel.show();
        $('.hint3').show();
    });

    // ---------------------------------------------------------------
    // 点击隔层 隐去浮层
    $layerPanel.on('click', function () {
        $showPanel.hide();
        if (!isthree) {
            $('.label_three_js').show();
        }
        if (!istwo) {
            $('.label_two_js').show();
        }
        if (!isone) {
            $('.label_one_js').show();
        }
    });

    // 点击出去 进主框架
    $('.t-door').on('click', function () {
        // 修改链接 后台
        var repUrlStr = '/activityshow/roomEscape/kitchen.jsp?userIst='
            + userIdStr
            + '&storesum=' + storeVal
            + '&ve=2';
        location.replace(repUrlStr);
    });
});
