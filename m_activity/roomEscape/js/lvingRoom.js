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
    var storeVal = 0;
    var isone = true;
    var istwo = true;

    // 是否没有获得/使用锤子
    var isNGetHammer = true;

    var isInDirecton = false;

    // 是否显示hint 只是左右
    var isShowRL = false;

    // 点击第一颗星
    $('.star_one_js').on('click', function () {
        $('.star_one_js').hide();
        isInDirecton = true;
        $('.hint5').show();
    });
    // 点击电视
    $('.tv').on('click', function () {
        if (isone) {
            isInDirecton = true;
            $('.star_one_js').hide();
            $('.hint5').show();
            $layerPanel.show();
        }
    });
    // 点击锤子 获得
    $('.cz').on('click', function () {
        $(this).hide();
        $('.hint-intro').show();
        $layerPanel.show();
        isNGetHammer = false;
    });
    // 点击裂开墙体块
    $('.wall').on('click', function () {
        $layerPanel.show();
        if (isNGetHammer) {
            $('.hint3').show();
            isShowRL = true;
        } else {
            $('.show_one_js').show();
            if (isone) {
                $('.star_two_js').show();
                isone = false;
                storeVal += 1;
            }
        }
    });
    // 点击吸顶灯
    $('.light').on('click', function () {
        $('.hint1').show();
        $layerPanel.show();
    });
    // 点击第一颗星
    $('.star_two_js').on('click', function () {
        if (istwo) {
            $('.star_two_js').hide();
            $('.hint4').show();
            $layerPanel.show();
        }
    });
    // 点击沙发
    $('.sofa').on('click', function () {
        if (!isone && istwo) {
            $('.star_two_js').hide();
            $('.hint4').show();
            $layerPanel.show();
        }
    });
    // 点击窗户
    $('.window').on('click', function () {
        if (!isone && istwo) {
            $('.show_two_js').show();
            $layerPanel.show();$('.star_two_js').hide();

            storeVal += 1;
            istwo = false;
        }
    });
    // -----------------------------------------------
    // 点击隔层 隐去浮层
    $layerPanel.on('click', function () {
        if (isInDirecton) {
            $showPanel.hide();
            if (isShowRL) {
                $('.hint').show();
                isShowRL = false;
                setTimeout(function () {
                    $('.hint').hide();
                }, 2000);
            }
            if (!istwo) {
                $('.label_two_js').show();
            }
            if(!isone) {
                $('.label_one_js').show();
            }
        } else {
            $('.star_one_js').hide();
            isInDirecton = true;
            $('.hint5').show();
        }

    });
    // 点击出去 进主框架
    $('.l-door').on('click', function () {
        // 修改链接 后台
        var repUrlStr = '/activityshow/roomEscape/bedroom.jsp?userIst='
            + userIdStr
            + '&storesum=' + storeVal
            + '&ve=6';
        location.replace(repUrlStr);
    });
});
