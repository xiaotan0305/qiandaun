define("modules/myzf/loadnewmore", ["jquery", "lazyload/1.9.1/lazyload"], function (require, exports, module) {
    "use strict";
    module.exports = function (options) {
        var $ = require("jquery"), vars = seajs.data.vars;
        //第一次拖拽特殊处理标识
        var firstDragFlag=true;
        var totalpage = Math.ceil(vars.total / vars.pagesize), curp =  2, k = true, $window=$(window), $document=$(document), bua = navigator.userAgent.toLowerCase(), isApple = bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1;
        var drag = $('#drag'), draginner;
        if (totalpage <= 1) {
            drag.hide();
            k = false;
        }
        drag.click(function () {
            loadmore();
        });
        $window.bind("scroll", function () {
            var scrollh = $document.height();
            if(firstDragFlag){
                firstDragFlag=false;
                if (isApple) {
                    scrollh = scrollh - 140;
                } else {
                    scrollh = scrollh - 80;
                }
            }
            if(k != false && ($document.scrollTop() + $window.height()) >= scrollh){
                loadmore();
            }
        })
        function loadmore() {
            if (draginner === undefined)draginner = $('.draginner');
            k = false;
            draginner.html("正在加载请稍后");
            $.get(options.url + "&r=" + Math.random(), {'page': curp}, function (data) {
                $("#content").append(data).find(".img img").lazyload();
                draginner.html("查看更多房源");
                curp = parseInt(curp) + 1;
                k = true;
                if (curp > parseInt(totalpage)) {
                    drag.hide();
                    k = false;
                }
            });
        }
    };
});

