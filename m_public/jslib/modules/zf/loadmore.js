define('modules/zf/loadmore', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function (options) {
        var $ = require('jquery'), vars = seajs.data.vars;
        var totalpage = Math.ceil(vars.total / vars.pagesize), curp = 2, k = true, w = $(window), bua = navigator.userAgent.toLowerCase();
        if (totalpage <= 1) {
            $('#drag').hide();
            k = false;
        }
        $('#drag').click(function () {
            load();
        });
        $(window).bind('scroll', function () {
            var scrollh = $(document).height();
            if (bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1) {
                scrollh -= 140;
            } else {
                scrollh -= 80;
            }
            var c = document.documentElement.clientHeight || document.body.clientHeight, t = $(document).scrollTop();
            if (k !== false && $(document).scrollTop() + w.height() >= scrollh) {
                load();
            }
        });
        function load() {
            var draginner = $('.draginner')[0];
            k = false;
            $('.draginner').css('padding-left', '10px');
            draginner.style.background = 'url(//img2.soufun.com/wap/touch/img/load.gif) 0 50% no-repeat';
            draginner.innerHTML = '正在加载请稍候';
            var nowUrl = options.url;
            $.get(nowUrl + '&r=' + Math.random(), {page: curp}, function (data) {
                $(data).appendTo('#content').find('.pic img').lazyload();
                $('.draginner').css('padding-left', '0px');
                draginner.style.background = '';
                draginner.innerHTML = '查看更多房源';
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage)) {
                    $('#drag').hide();
                    k = false;
                }
            });
        }
    };
});

