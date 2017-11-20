/**
 * Created by zdl on 2016/8/29.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/index', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({event: 'scroll'});
        /*
        首页使用链接跳转
        // 新房二手房相关数据信息的tab切换功能
        $('#xf,#esf').on('click', function () {
            var $that = $(this);
            // 获取当前点击的是哪一个tab元素
            var eleId = $that.attr('id');
            // 元素所对应的内容id
            var eleContent = eleId + 'content';
            // tab元素的样式切换
            $that.addClass('cur').siblings('li').removeClass('cur');
            // 类容元素的显示隐藏切换
            $('#' + eleContent).show().siblings('div').hide();
            // 解决点击esf切换按钮时可视区域内的惰性加载图片没有加载问题
            if (eleId === 'esf') {
                $(window).trigger('scroll');
            }
        });
        */
    };
});