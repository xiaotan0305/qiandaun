/*
 * author bjwanghongwei@fang.com
 * 租房自动化第四版，主要实现导航标签的定位  20161123
 * */
define('modules/zf/automation', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 导航
        $('.mid_in').find('li').on('click', function () {
            var el = $(this);
            var eleId = $(this).find('a').attr('id');
            var scroolId = 'go' + eleId;
            var scrollH;
            // 导航锚点
            if ($('.mid_item').css('position') === 'fixed') {
                scrollH = $('#' + scroolId).offset().top - 45;
            } else {
                scrollH = $('#' + scroolId).offset().top - 90;
            }
            $('body,html').animate({scrollTop: scrollH}, 100);

            //按钮颜色控制
            el.siblings().find('a').css({'background-color': '#000000', 'color':'#fff'});
            el.find('a').css({'background-color':'#fff',color:'#056f55'});

        });
        $(document).on('scroll', function () {
            if ($(document).scrollTop() > 0) {
                $('.mid_item').css({position: 'fixed', 'z-index': '1000', top: '0px'});
            } else {
                $('.mid_item').css('position', 'static');
            }
        });
    };
});