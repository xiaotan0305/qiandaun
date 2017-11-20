/**
 *问答UI改版 加载更多
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/loadmore', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function (options) {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 第一次拖拽特殊处理标识
        var firstDragFlag = true;
        var totalpage = vars.totalpage || vars.total / vars.pagesize,
            curp = 2,
            k = true,
            $window = $(window),
            $document = $(document),
            bua = navigator.userAgent.toLowerCase(),
            isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
        var $drag = $('#drag'),
            draginner;

        function loadmore() {
            if (draginner === undefined) draginner = $('.draginner');
            k = false;
            draginner.html('正在加载请稍后');
            $.get(options.url + '&r=' + Math.random(), {
                page: curp
            }, function (data) {
                if (data) {
                    $drag.before(data);
                    draginner.html('查看更多');
                    curp = parseInt(curp) + 1;
                    k = true;
                    if (curp > parseInt(totalpage)) {
                        $drag.hide();
                        k = false;
                    }
                }
            });
        }
        if (totalpage <= 1) {
            $drag.hide();
            k = false;
        }
        $drag.on('click',function () {
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