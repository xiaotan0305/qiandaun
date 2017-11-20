/**
 * fdc--土地资讯列表页
 * @author chenhuan(chenhuan.bj@soufun.com)
 * @modify icy(taoxudong@soufun.com) 2015-12-07
 */
define('modules/fdc/getNewsList', ['jquery', 'loadMore/1.0.0/loadMore', 'swipe/3.10/swiper', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var Swiper = require('swipe/3.10/swiper.js');

        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('img[data-original]').lazyload();
        // 加载更多
        if (vars.count > 20) {
            var loadMore = require('loadMore/1.0.0/loadMore');
            loadMore({
                url: vars.fdcSite + '?c=fdc&a=ajaxGetNewsList&type=' + vars.type,
                // 数据总条数
                total: vars.count,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数
                pageNumber: 20,
                // 加载更多按钮id
                moreBtnID: '.moreList',
                // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                firstDragFlag: false,
                // 加载数据过程显示提示id
                loadPromptID: '.moreList',
                // 数据加载过来的html字符串容器
                contentID: '#newslist',
                // 加载前显示内容
                loadAgoTxt: '<a>上拉加载更多</a>',
                // 加载中显示内容
                loadingTxt: '<span><i></i>努力加载中...</span>',
                // 加载完成后显示内容
                loadedTxt: '<a>上拉加载更多</a>'
            });
        }

        (function () {
            // 广告轮播图
            var $ad = $('.banShow');
            var $wrap = $ad.find('.swiper-wrapper');
            var $slides = $ad.find('.swiper-slide');
            var length = $slides.length;
            var $points = $ad.find('.swipe-point').find('li');
            if (length) {
                $wrap.css('width', parseInt($ad.css('width'), 10) * (length + (length < 2 ? 0 : 2)));
                $slides.show();
                Swiper('.banShow', {
                    // 切换速度
                    speed: 500,
                    // 自动切换间隔
                    autoplay: 2000,
                    // 交互后是否自动切换
                    autoplayDisableOnInteraction: false,
                    // 循环
                    loop: true,
                    onSlideChangeStart: function (swiper) {
                        $points.eq((swiper.activeIndex + length - 1) % length).addClass('cur').siblings().removeClass('cur');
                    }
                });
            }
        })();
    };
});