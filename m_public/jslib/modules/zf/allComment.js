define('modules/zf/allComment', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars,
        // 热combo需要的预加载数组
            preLoad = [];
        // 展开收起
        $('.xqIntroBox').find('a[class *="more_xq"]').on('click', function (e) {
            var aEl = e.target;
            if ($(aEl).hasClass('up')) {
                $(aEl).removeClass('up');
                $(aEl).prev('div').removeClass('all');
            } else {
                $(aEl).addClass('up');
                $(aEl).prev('div').addClass('all');
            }
        });
        $('.xqIntro').each(function () {
            if (parseInt($(this).children('p').css('height')) <= 92) {
                $(this).next('.more_xq').hide();
            }
        });
    };
});
