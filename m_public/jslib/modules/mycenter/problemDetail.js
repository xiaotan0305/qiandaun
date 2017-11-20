/**
 * @file 问题反馈app嵌入页
 * @author xiejingchao@fang.com
 */
define('modules/mycenter/problemDetail', ['jquery', 'lazyload/1.9.1/lazyload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var btn = $('.stateBox a');
    // 图片惰性加载
    var lazyLoad = require('lazyload/1.9.1/lazyload');
    lazyLoad('img[data-original]').lazyload();
    // 已解决/未解决
    btn.on('click', (function () {
        // ajax状态
        var inAjax = false;
        return function () {
            if (!inAjax) {
                inAjax = true;
                var $this = $(this);
                // 是否解决标识，1=已解决，0=未解决
                var isResolve = $this.attr('data-flag');
                if (vars.id && isResolve) {
                    var url = vars.mySite + '?c=mycenter&a=ajaxUpdateResolved&id=' + vars.id + '&isResolve=' + isResolve + '&r=' + Math.random();
                    $.get(url, function (data) {
                        if (data) {
                            $this.addClass('cur');
                            btn.off('click');
                        }
                    }).complete(function () {
                        inAjax = false;
                    });
                }
            }
        };
    })());
});