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
    //store_sum_js
    var storeVal = Number($('.store_sum_js').val());
    var isone = true;
    var istwo = true;


    // 初始化完
    $(window).load(function () {
        setTimeout(function () {
            $('.hint').hide();
        }, 2000);
    });

    // 是否没有获得/使用电笔
    var isNGetPen = true;

    // 点击第一颗星
    $('.star_one_js').on('click', function () {
        $('.star_one_js').hide();
        $('.hint3').show();
        $layerPanel.show();
    });
    // 点击床上小熊
    $('.bed').on('click', function () {
        if (isone) {
            $('.star_one_js').hide();
            $('.hint3').show();
            $layerPanel.show();
        }
    });


    // 点击电笔 获得
    $('.lsd').on('click', function () {
        $(this).hide();
        $('.hint-intro').show();
        $layerPanel.show();
        isNGetPen = false;
    });
    // 点击插头
    $('.chazuo').on('click', function () {
        $layerPanel.show();
        if (isNGetPen) {
            $('.hint1').show();
        } else {
            $('.show_one_js').show();
            if (isone) {
                $('.star_one_js').hide();
                isone = false;
                storeVal += 1;
                if (istwo) {
                    $('.star_two_js').show();
                }
            }
        }
    });

    // 点击第二颗星
    $('.star_two_js').on('click', function () {
        $('.star_two_js').hide();
        $('.hint4').show();
        $layerPanel.show();
    });
    // 点击镜子
    $('.dresser').on('click', function () {
        if (istwo) {
            $('.star_two_js').hide();
            $('.hint4').show();
            $layerPanel.show();
        }
    });

    // 点击凳子
    $('.chair').on('click', function () {
        $('.hint5').show();
        $layerPanel.show();
    });

    // 点击地板
    $('.floor').on('click', function () {
        $layerPanel.show();
        $('.show_two_js').show();
        if (istwo) {
            istwo = false;
            storeVal += 1;
        }
    });

    // -----------------------------------------
    // 点击隔层 隐去浮层
    $layerPanel.on('click', function () {
        $showPanel.hide();
        if (!istwo) {
            $('.label_two_js').show();
        }
        if (!isone) {
            $('.label_one_js').show();
        }
    });

    // 点击出去 进主框架
    $('.b-door').on('click', function () {
        // 修改链接  后台
        var repUrlStr = '/activityshow/roomEscape/toilet.jsp?userIst='
            + userIdStr
            + '&storesum=' + storeVal
            + '&ve=3';
        location.replace(repUrlStr);
    });
});


