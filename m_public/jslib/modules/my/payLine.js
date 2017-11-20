/**
 * 支付额度说明页面
 * by chenhongyan
 * date 20160408
 */
define('modules/my/payLine', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 支付选项列表容器div
        var paychoice = $('.paychoice');
        // 当前选择的支付方式显示div
        var arrow = $('#payType span');
        // 点击当前选择的支付方式div 实现支付选项列表容器的显示隐藏
        $('#payType').click(function () {
            // 支付选项列表容器div的显示隐藏切换
            paychoice.toggle();
            // 当前选择的支付方式显示div top样式的切换
            arrow.toggleClass('top');
        });
        // 储蓄卡选项按钮
        var cxk = $('#cxk');
        // 信用卡选项按钮
        var xyk = $('#xyk');
        // 给支付选项列表容器div中的支付宝按钮添加点击事件
        paychoice.find('div').on('click', function () {
            var $that = $(this);
            if ($that.find('i').hasClass('no')) {
                var type = $that.attr('class').split(' ')[1];
                $that.find('i').removeClass('no');
                $that.siblings().find('i').addClass('no');
                paychoice.hide();
                cxk.addClass('active');
                xyk.removeClass('active');
                arrow.text($that.find('a').text());
                // 显示大额认证的储蓄卡
                $('ul').hide();
                $('.' + type + 'cxk').show();
                xyk.show();
                if (type === 'dezf') {
                    $('#xyk').hide();
                }
                arrow.addClass('top');
            }
        });

        // 当点击储蓄卡和信用卡切换按钮时,判断当前是支付宝还是微信快捷支付方式或者大额度认证支付
        $('#cxk,#xyk').click(function () {
            var $that = $(this);
            var id = $that.attr('id');
            if (!$that.hasClass('active')) {
                $that.attr('class', 'active');
                $that.siblings().removeClass('active');
                if (arrow.text() === '支付宝快捷支付') {
                    $('ul').hide();
                    $('.zfb' + id).show();
                } else if (arrow.text() === '微信快捷支付') {
                    $('ul').hide();
                    $('.wx' + id).show();
                } else {
                    $('ul').hide();
                    $('.dezf' + id).show();
                }
            }
        });
    };
});