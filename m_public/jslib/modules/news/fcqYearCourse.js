/**
 * 房产圈年度历程页面
 * Created by limengyang.bj@fang.com 2017-12-12
 */
define('modules/news/fcqYearCourse', ['jquery', 'swipe/3.3.1/swiper', 'weixin/2.0.1/weixinshare', 'superShare/2.0.0/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var shareTittle = vars.readNum && vars.userName ? '2017年，' + vars.userName + '在房产圈影响了' + vars.readNum + '人' : '2017年我的房产圈，快来围观！';
        var shareDesc = vars.articleCount && vars.appellation ? '我在房产圈发表了' + vars.articleCount + '篇文章，获得' + vars.appellation + '称号' : '陪伴是最长情的告白，房产圈一路相随，幸甚有你';

        var shareImg = window.location.protocol + vars.public + '201511/images/fcqYearCourse/share1.jpg';
        var shareUrl = window.location.protocol + vars.newsSite + '?a=fcqYearShare&userId=' + vars.userId + '&passportId=' + vars.passportId;
        // 引入swiper插件
        var Swiper = require('swipe/3.3.1/swiper');
        // 第一个swiper滑动的元素
        var slide = $('.swiper-slide');
        slide.show().children().hide();
        slide.eq(0).children().show();
        Swiper('.swiper-container', {
            direction: 'vertical',
            initialSlide: 0,
            onTransitionEnd: function () {
                // 当前活动的slide
                var activeSlide = $('.swiper-wrapper').children('.swiper-slide-active');
                // 当前活动的slide的子元素显示，其兄弟节点的子元素隐藏，展示animation动画效果
                activeSlide.children().show();
                activeSlide.siblings().children().hide();
            }
        });
        // 微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            debug: false,
            shareTitle: shareTittle,
            // 副标题
            descContent: shareDesc,
            lineLink: shareUrl,
            imgUrl: shareImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var $share = $('.share');
        if ($share.length) {
            var SuperShare = require('superShare/2.0.0/superShare');
            var config = {
                // 分享内容的title
                title: shareTittle,
                // 分享时的图标
                image: shareImg,
                // 分享内容的详细描述
                desc: shareDesc,
                // 分享的链接地址
                url: shareUrl,
                // 分享的内容来源
                form: '房天下'
            };
            var superShare = new SuperShare(config);
            // 2.0版本不再在插件中绑定.share类了，需要外部自行调用
            // 2.0版本只提供share方法，供外部调用
            $share.on('click',function () {
                superShare.share();
            });
        }
    };
});