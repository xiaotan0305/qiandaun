/**
 * @file js合并，ESLint
 * @author fcwang(wangfengchao@soufun.com)
 */
define('modules/xiaoqu/picDetailShow',['jquery','lazyload/1.9.1/lazyload','iscroll/2.0.0/iscroll-lite'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户行为布码
        function buMa() {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 新房的页面值为 'n'、二手房为 'e'、租房为 'z'、注意房贷计算器页此处值为g
            // 新房“n”，二手房e，租房n，查房价v,家居h，资讯i,知识k
            _ub.biz = 'V';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // b值 0：浏览
            var b = 0;
            _ub.collect(b, {'vmg.page': 'esf_xq^xcqb_wap'});
        }
        require.async('jsub/_vb.js?c=esf_xq^xcqb_wap');
        require.async('jsub/_ubm.js?v=201407181100', function () {
            buMa();
        });
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