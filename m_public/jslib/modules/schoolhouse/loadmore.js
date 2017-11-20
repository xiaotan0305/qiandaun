define('modules/schoolhouse/loadmore', ['jquery','lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function (options) {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var totalpage = Math.ceil(vars.total / vars.pagesize),
            curp = 2,
            k = true,
            // w = $(window),
            bua = navigator.userAgent.toLowerCase(),
            isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
        var $window = $(window),
            $document = $(document),
            showorno, content, drag = $('#drag'),
            draginner, isAgentNoShow = !1;
        
        function loadmore() {
            if (draginner === undefined) draginner = $('.draginner');
            k = false;
            draginner.css({
                'padding-left': '10px',
                background: 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat'
            }).html('<a href=\'javascrip:void(0)\' >正在加载请稍后</a>');
            $.get(options.url + '&r=' + Math.random(), {
                page: curp
            }, function (data) {
                $(data).appendTo(content).find('.pic img').lazyload();
                draginner.css({
                    'padding-left': '0px',
                    background: ''
                }).html('<a href=\'javascrip:void(0)\' >上拉自动加载更多</a>');
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage)) {
                    drag.hide();
                    k = false;
                }
            });
        }
        if (totalpage <= 1) {
            drag.hide();
            k = false;
        }
        drag.click(function () {
            loadmore();
        });
        $window.bind('scroll', function () {
            var scrollh = $document.height();
            if (isApple) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
            if (content === undefined) content = $('#content');
            if (showorno === undefined) showorno = $('#showorno');
            if (k !== false && $document.scrollTop() + $window.height() >= scrollh) {
                loadmore();
            }
            if (showorno.length > 0) {
                if ($window.scrollTop() > content.offset().top) {
                    if (isAgentNoShow === !1) {
                        isAgentNoShow = !0;
                        showorno.show();
                    }
                } else if (isAgentNoShow === !0) {
                    isAgentNoShow = !1;
                    showorno.hide();
                }
            }
        });
    };
});