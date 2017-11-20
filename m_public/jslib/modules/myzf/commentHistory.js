define('modules/myzf/commentHistory', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var vars = seajs.data.vars;
        var $zygwint = $('.zygw-int');
        // 获取经纪人的星级评分
        var agentScore = $('#agentScore').attr('data-id');
        // 初始化经纪人星级评分
        $zygwint.find('i:lt(' + agentScore + ')').attr('class', 'active');
        function initScore() {
            $('section[data-id]').each(function () {
                var $that = $(this);
                var initVal = $that.attr('data-id');
                var housScore = $that.attr('data-id').split(',')[0];
                $that.find('i:lt(' + housScore + ')').attr('class', 'active');
                var txt = '';
                $that.find('a').each(function () {
                    var $me = $(this);
                    txt = $me.text();
                    if (initVal.indexOf(txt) > -1) {
                        $me.addClass('active');
                    }
                });
            });
        }
        initScore();
        var url = vars.mySite + '?c=myzf&a=ajaxGetCommentHistory';
        // 第一次拖拽特殊处理标识
        var firstDragFlag = true;
        var totalpage = Math.ceil(vars.totalNum / 10), curp = 2, k = true, $window = $(window),
            $document = $(document), bua = navigator.userAgent.toLowerCase(),
            isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
        var drag = $('#drag'), draginner;
        if (totalpage <= 1) {
            drag.hide();
            k = false;
        }
        function loadmore() {
            if (draginner === undefined)draginner = $('.draginner');
            k = false;
            draginner.html('正在加载请稍后');
            $.get(url + '&r=' + Math.random(), {page: curp}, function (data) {
                $('#content').append(data);
                $('.lazyload').lazyload();
                initScore();
                draginner.html('查看更多房源');
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
        $window.on('scroll', function () {
            var scrollh = $document.height();
            if (firstDragFlag) {
                firstDragFlag = false;
                if (isApple) {
                    scrollh -= 140;
                } else {
                    scrollh -= 80;
                }
            }
            if (k && $document.scrollTop() + $window.height() >= scrollh) {
                loadmore();
            }
        });
    };
});