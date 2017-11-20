/**
 * 外部知识详情页
 * by zhangjinyu
 */
define('modules/zhishi/outDetail', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');

        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var content = $('.content');
        // 切换字体大小
        $('.font').on('click', function () {
            var $that = $(this);
            var text = $that.text();
            if (text.trim() === '小字') {
                content.css('font-size', '20px');
                $that.text('大字');
            } else {
                content.css('font-size', '17px');
                $that.text('小字');
            }
        });
    };
});