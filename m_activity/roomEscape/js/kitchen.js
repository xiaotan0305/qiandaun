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
    var storeVal = Number($('.store_sum_js').val());
    var isone = true;
    var istwo = true;
    var isthree = true;

    // 初始化完
    $(window).load(function () {
        setTimeout(function () {
            $('.hint').hide();
        }, 2000);
    });

    // 是否没有获得/使用打火器
    var isNGetGate = true;

    // 点击第一颗星
    $('.star_one_js').on('click', function () {
        $layerPanel.show();
        $('.star_one_js').hide();
        $('.hint4').show();
    });
    // 点击打火器 获得
    $('.dhq').on('click', function () {
        $layerPanel.show();
        $(this).hide();
        $('.star_one_js').hide();
        $('.hint-intro').show();
        isNGetGate = false;
    });
    // 点击燃气阀
    $('.valve').on('click', function () {
        $layerPanel.show();
        if (isNGetGate) {
            $('.star_one_js').hide();
            $('.hint4').show();
        } else {
            $('.show_one_js').show();
            if (isone) {
                // $('.star_two_js').show();
                isone = false;
                storeVal += 1;
            }
        }
    });

    // 点击菜刀
    $('.guo').on('click', function () {
        $layerPanel.show();
        $('.hint3').show();
    });
    // 点击燃气表
    $('.ammeter').on('click', function () {
        $layerPanel.show();
        $('.show_two_js').show();
        if (istwo) {
            $('.star_two_js').show();
            istwo = false;
            storeVal += 1;
        }
    });

    // 点击第二颗星
    $('.star_two_js').on('click', function () {
        $layerPanel.show();
        $('.star_two_js').hide();
        if (isthree) {
            $('.show_three_js').show();
            isthree = false;
            storeVal += 1;
        }
    });

    // 点击第二颗星
    $('.cupboard').on('click', function () {
        $layerPanel.show();
        $('.star_two_js').hide();
        if (isthree) {
            $('.show_three_js').show();
            isthree = false;
            storeVal += 1;
        }
    });

    // ---------------------------------------------------------
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
    $('.k-door').on('click', function () {
        // 修改链接 后台
        window.location.href = '/huodongAC.d?class=RoomEscapeHc&m=resultPage&userIst='
            + userIdStr
            +'&sumVal=' + storeVal * 10
            + '&ve=5';
    });

});
