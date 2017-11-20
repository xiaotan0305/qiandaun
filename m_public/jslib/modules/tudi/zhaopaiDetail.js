/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/tudi/zhaopaiDetail', ['jquery', 'util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var util = require('util');
        // 登陆功能
        $('#login').on('click', function () {
            util.login();
            return;
        });
        $('#show_more').on('click', function () {
            $(this).css('display', 'none');
            $('#display_more').css('display', '');
        });
        var $window = $(window);
        //  顶部滚动固定
        $window.on('scroll', (function () {
            var $xqTitle = $('.xqTitle');
            var xqTitleTop = $xqTitle.offset().top;
            var height = parseInt($xqTitle.css('height'), 10);
            var $newheader = $('#newheader');
            var fixTag = false;
            return function () {
                var scrollTop = $window.scrollTop();
                if (scrollTop > xqTitleTop && !fixTag) {
                    $xqTitle.css({
                        position: 'fixed',
                        'z-index': 10,
                        width: '100%',
                        top: 0
                    });
                    $newheader.css('margin-bottom', height);
                    fixTag = !fixTag;
                } else if (scrollTop <= xqTitleTop && fixTag) {
                    $xqTitle.css('position', '');
                    $newheader.css('margin-bottom', '');
                    fixTag = !fixTag;
                }
            };
        })());
    };
});