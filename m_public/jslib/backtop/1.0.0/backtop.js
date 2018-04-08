/**
 * @file 返回到顶部小功能组件
 * @author yueyanlei(yueyanlei@fang.com)
 *
 * @return {null} 无返回值
 * @update 2015-10-9 优化了向上划动时图标闪烁现象
 */
define('backtop/1.0.0/backtop', ['jquery'], function (require) {
    'use strict';
    return function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        if (vars.jhList) {
            var htmlStr = '<a id="wapesfyx_D04_01" style="position:fixed; height:37px; width:37px;background: url(';
            htmlStr += vars.public +'images/backtop.png';
            htmlStr += ') no-repeat center; background-size:37px 37px;right:8px;bottom:65px;z-index: 99;">&nbsp;</a>';
        } else {
            var htmlStr = '<a id="wapesfsy_D04_01" style="position:fixed; height:37px; width:37px;background: url(';
            htmlStr += vars.public +'images/backtop.png';
            htmlStr += ') no-repeat center; background-size:37px 37px;right:8px;bottom:65px;z-index: 99;">&nbsp;</a>';
        }
        var dom = $(htmlStr).appendTo(document.body);
        var $window = $(window);
        var height = $window.height();
        // dom.on('click', function () {
        //     $('body').animate({scrollTop: 0}, 200);
        // });
        dom.on("click", function(event) {
            var timer = setInterval(function() {
                window.scrollBy(0, -100);
                if ($(window).scrollTop() <= 1) {
                    window.clearInterval(timer)
                }
            }, 2)
        })
        $window.on('resize', function () {
            height = $window.height();
        }).on('scroll', function () {
            if ($window.scrollTop() <= height * 2 - 60) {
                if (!dom.is(':hidden')) {
                    dom.hide();
                }
            } else if (dom.is(':hidden')) {
                dom.show();
            }
        });
    };
});