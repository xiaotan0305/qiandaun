/**
 * 二手房优惠券活动
 * by loupeiye
 * 20151203 loupeiye
 */
define('modules/esfhd/esfhdindex', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    // 弹出框关闭按钮
    var cBtn = $('.close');
    // 底部透明背景
    var layer = $('#layer');

    // 为每个领取按钮绑定click事件
    $('input[class=getBtn]').click(function () {
        var $that = $(this);

        var clickFunc = function (data) {
            var pop;
            // 成功显示弹窗一，重复领取显示弹窗二，失败显示弹窗三
            if (data === 'T') {
                pop = $('.popBox').eq(0);
                pop.css('display', 'block');
                layer.css('display', 'block');
                $that.parents('.coupon').attr('class', 'coupon cpn_gray');
                $that.attr('value', '已领取');
                $that.unbind('click');
            } else if (data === 'FRepeat') {
                pop = $('.popBox').eq(1);
                pop.css('display', 'block');
                layer.css('display', 'block');
            } else if (data === 'F') {
                pop = $('.popBox').eq(2);
                pop.css('display', 'block');
                layer.css('display', 'block');
            } else {
                alert(data);
            }
            // 关闭弹窗
            cBtn.click(function () {
                pop.css('display', 'none');
                layer.css('display', 'none');
            });
        };

        // ajax的post传值
        $.post('?c=esfhd&a=AjaxGetCoupons', {
            couponsValue: $(this).attr('data-value')
        }, clickFunc);
    });
});