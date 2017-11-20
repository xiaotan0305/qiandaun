/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/tudi/tudiDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var preload = [];
        var id = vars.id;
        var objtype = vars.objtype;
        var stateObject = {
            id: id
        };
        var url = window.location;
        var newUrl;
        preload.push('swipe/2.0/swipe');
        require.async(preload);
        if (objtype === '1') {
            newUrl = '/tudi/tdzrdetail/' + id + '.html';
        } else {
            newUrl = '/tudi/xmzrdetail/' + id + '.html';
        }

        history.replaceState(stateObject, url, newUrl);
        // 滑动效果
        require.async('swipe/2.0/swipe', function () {
            var $slider = $('#slider');
            var $slidepoint = $('.swipe-btm').find('li');
            var length = $slidepoint.length;
            $slider.Swipe({
                speed: 500,
                callback: function (index) {
                    $slidepoint.removeClass('cur').eq(index % length).addClass('cur');
                }
            });
            $slider.find('li').show();
        });
        var $window = $(window);

        // 详情展开收起
        var $detailless = $('#detailless');
        if ($detailless.height() < $detailless.find('p').height()) {
            $('#contless').show().on('click', (function () {
                var describeTop = null;
                var showMore = false;
                return function () {
                    describeTop = describeTop || $('.describe').offset().top - parseInt($('.xqTitle').css('height'), 10);
                    showMore = !showMore;
                    $(this).find('a').toggleClass('up');
                    $detailless.css('max-height', showMore ? 'none' : '208px');
                    !showMore && $window.scrollTop() > describeTop && $window.scrollTop(describeTop);
                };
            })());
        }
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