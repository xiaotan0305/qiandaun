define('modules/jiaju/loadnewmore', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function (options) {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var totalpage = Math.ceil(vars.total / vars.pagesize);
        var curp = 2;
        var k = true;
        var $window = $(window);
        var $document = $(document);
        var $documentBody = $(document.body);
        var bua = navigator.userAgent.toLowerCase();
        var isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
        var drag = $('#clickmore'), draginner;
        if (totalpage <= 1) {
            drag.hide();
            k = false;
        }
        function loadmore() {
            if (draginner === undefined) {
                draginner = $('.clickmore');
            }
            k = false;
            if (draginner.length) {
                draginner.css({
                    'padding-left': '10px',
                    background: ''
                }).html('<a href="javascrip:void(0)" class="loading">正在加载请稍后</a>');
            }
            $.get(options.url + '&r=' + Math.random(), {page: curp}, function (data) {
                if (options.no_lazyload == '1') {
                    $('#content').append(data);
                } else {
                    $('#content').append(data).find('img[data-original]').lazyload();
                }
                if (draginner.length) {
                    draginner.css({
                        'padding-left': '0px',
                        background: ''
                    }).html('<a href="javascrip:void(0)" >上拉自动加载更多</a>');
                }
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage)) {
                    drag.hide();
                    k = false;
                }
            });
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
            // 兼容Zepto
            var scrollTop = $document.scrollTop() || $documentBody.scrollTop();
            if (k !== false && scrollTop + $window.height() >= scrollh) {
                loadmore();
            }
        });
    };
});
