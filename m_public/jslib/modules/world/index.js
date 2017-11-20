define('modules/world/index', ['jquery', 'modules/world/yhxw', 'iscroll/1.0.0/iscroll', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        var $lazy = $('.lazy');
        $lazy.lazyload();
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mwhomepage';
        // 埋码变量数组
        var maiMaParams = {
            // 页面标识
            'vmg.page': pageId
        };
        // 添加用户行为分析
        yhxw({
            type: 0,
            pageId: pageId,
            params: maiMaParams
        });
        var index = 0;
        if (vars.privateShow) {
            window.scrollTo(0, $('.houseList').offset().top);
            index = 1;
        }

        // 资讯轮播
        var Swiper = require('swipe/3.10/swiper');
        new Swiper('.newsSlide', {
            // 切换速度
            speed: 500,
            // 自动切换间隔
            autoplay: 3000,
            // 循环
            loop: true,
            direction: 'vertical'
        });
        // nav切换
        var $tabContent = $('.tabContent');
        $('.tabNav').on('click', 'a', function () {
            var $this = $(this);
            index = $this.index();
            $this.addClass('active').siblings().removeClass('active');
            $tabContent.hide().eq(index).show();
            $lazy.trigger('appear');
        });
        $('.getmore').on('click', function () {
            window.location = $(this).data('href' + index);
        });
    };
});