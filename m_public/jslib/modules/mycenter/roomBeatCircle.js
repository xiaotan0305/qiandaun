/**
 * 我的房拍圈
 * Created by limengyang.bj@fang.com 2017-3-21
 */
define('modules/mycenter/roomBeatCircle', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    var vars = seajs.data.vars;
    var $ = require('jquery');
    // 作品id和城市
    var worksId = '';
    var worksCity = '';
    var taskId = '';
    // 放弃任务的section
    var $giveUpSec = '';
    // 流程滑动
    var iscroll = require('iscroll/2.0.0/iscroll-lite');
    new iscroll('.scroller', {scrollX: true});

    // 上传作品
    $('.b2').on('click', function () {
        $('.uploadBox').show();
    });
    // 弹框关闭
    $('.closeFpqBoxBtn').on('click', function () {
        $('.tz-box').hide();
    });
    // 规则弹框
    $('.ruleBoxBtn').on('click', function () {
        $('.ruleBox').show();
    });

    // 放弃任务按钮
    $('.b3').on('click', function () {
        var $that = $(this);
        worksId = $that.attr('data-worksId');
        worksCity = $that.attr('data-worksCity');
        taskId = $that.attr('data-taskId');
        $('.giveUpBox').show();
        $giveUpSec = $that.parent().parent().parent();
    });
    // 放弃任务弹框确定
    var canAjax = true;
    $('.fpqGiveUp').on('click', function () {
        if (canAjax) {
            canAjax = false;
            $.ajax({
                url: vars.mySite + '?c=mycenter&a=ajaxFpqGiveUpTask',
                data: {
                    id: worksId,
                    type: vars.listType,
                    cityName: worksCity,
                    taskId: taskId
                },
                success: function (data) {
                    // 删除成功
                    if (data === 'succ') {
                        $giveUpSec.remove();
                    }
                },
                complete: function () {
                    canAjax = true;
                    $('.giveUpBox').hide();
                }
            });
        }
    });
    // 只看已通过的选中
    var $radioInput = $('.a-radio input');
    $radioInput.on('click', function () {
        if ($radioInput.is(':checked')) {
            $('.Pbox').hide();
            $('.passSec').show();
        } else {
            $('.Pbox').show();
        }
    });
});