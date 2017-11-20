/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/xiaoqu/picDetailShow',['jquery','lazyload/1.9.1/lazyload','iscroll/2.0.0/iscroll-lite'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 调用滑动插件，底部滑动用   lina 20161031
        var IScrolllist = require('iscroll/2.0.0/iscroll-lite');
        // 底部导航滑动
        var scrollerWidth = 14;
        // 为滚动区添加id，设置底部导航长度
        var scroller = $('#scroller');
        if(scroller.length){
            scroller.find('a').each(function () {
                $(this).attr('id', 'item_' + $(this).index());
                scrollerWidth += $(this).width() + 30 + 4;
            });
            scroller.css('width', scrollerWidth);
            new IScrolllist('.pic-btns', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: false
            });
        }

        var lazyload = require('lazyload/1.9.1/lazyload');
        $('img.lazy').lazyload({
            container: $('.allPics')
        });
        window.scrollTo(0, 1);

    };
});