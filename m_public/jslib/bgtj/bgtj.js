(function (window, factory) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
        define('bgtj/bgtj', ['iscroll/2.0.0/iscroll-lite'], function () {
            return factory(window);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        window.bgTj = factory(window);
    }
})(window, function (window) {
    'use strict';

    function bgTj(options) {
        // 是否绑定scroll事件以实现上拉加载功能
        var isScroll = options.hasOwnProperty('isScroll') ? options.isScroll : true;

        // 加载标识，用于限制ajax调用过程中不允许重复调用
        var loadFlag = true;
        // window实例
        var $window = $(window);
        // document实例
        var $document = $(document);
        // 获取浏览器UA
        var UA = navigator.userAgent.toLowerCase();
        // 判断是否为iPhone系统
        var isApple = UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1;
        var $content = $('#'+ options.contentId);
         // 滚动内容是在页面中的部分模块标识默认为false
        var partScroll = options.partScroll || false;
        var a = 'down';
        var beforeDirection = 'down';
        /**
         * 加载更多函数
         */
        function bjTj() {
            $.post(options.url, options.sendData);
            loadFlag = false;
        }
        function scroll( fn ) {
            var beforeScrollTop = document.documentElement.scrollTop,
                fn = fn || function() {};
                $window.on("scroll", function() {
                var afterScrollTop = document.documentElement.scrollTop,
                    delta = afterScrollTop - beforeScrollTop;
                if( delta === 0 ) return false;
                fn( delta > 0 ? "down" : "up" );
                beforeScrollTop = afterScrollTop;
            });
        }
        scroll(function(direction) {
            a =  direction;
        });
        if (isScroll) {
            // ！！！浏览器高度兼容性处理
            var browserHeader = 0;
            if (isApple) {
                // 是iPhone的话浏览器多高出了68像素
                browserHeader = 68;
            } else if (/ucbrowser/i.test(UA)) {
                // 不是苹果手机并且是uc浏览器的话，浏览器多高出了50像素
                browserHeader = 50;
            }

            /**
             * 绑定滚动事件，监听是否到达底部，执行加载更多操作
             */
            $window.on('scroll', function () {
                var scrollHoll = $content.offset().top +  $content.height();
                var scrollHead = $content.offset().top - $content.height() -browserHeader;
                // console.log(a);
                // 向下滑动时
                if (a == 'down') {
                    if (beforeDirection == 'up') {
                        beforeDirection = 'down';
                        loadFlag = true;
                    }
                    if (loadFlag && document.documentElement.scrollTop > scrollHead) {
                        // alert('abc');
                        bjTj();
                    }
                } else {
                    if (beforeDirection == 'down') {
                        beforeDirection = 'up';
                        // alert('def');
                        loadFlag = true;
                    }
                    if (loadFlag && document.documentElement.scrollTop  < scrollHoll) {
                        bjTj();
                    }
                }
            });
        }
    }

    return bgTj;
});