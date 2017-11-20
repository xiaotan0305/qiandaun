/**
 * @file 返回到顶部小功能组件
 * @author chenhongyan(chenhongyan@fang.com)
 *
 * @return {null} 无返回值
 * @update 2017-8-9 优化了可以在调用插件的时候传入width height right bottom等样式的值
 */
define('backtop/1.0.2/backtop', ['jquery'], function (require) {
    'use strict';
    return function (opts) {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var right = typeof(opts) != 'undefined' && typeof(opts.right) != 'undefined' ? opts.right : '8px';
        var bottom = typeof(opts) != 'undefined' && typeof(opts.bottom) != 'undefined' ? opts.bottom : '85px';

        var htmlStr = '<a id="wapesfsy_D04_01" style="position:fixed; height:37px; width:37px;background: url(';
        htmlStr += vars.public +'images/backtop.png';
        htmlStr += ') no-repeat center; background-size:37px 37px;right:' + right + ';bottom:' + bottom + ';z-index: 99;">&nbsp;</a>';
        var dom = $(htmlStr).appendTo(document.body);
        var $window = $(window);
        var height = $window.height();
        dom.on('click', function () {
            $('body').animate({scrollTop: 0}, 200);
        });
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