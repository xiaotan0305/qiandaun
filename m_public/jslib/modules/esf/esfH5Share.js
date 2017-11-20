/**二手房H5业主分享
 * Created by lina on 2016/11/21.
 */
define('modules/esf/esfH5Share', ['jquery', 'swipe/3.10/swiper', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare'], function (require, exports, module) {
    module.exports = function () {
        var $ = require('jquery');
        // 第一个swiper实例，上下滑动
        var Swiper = require('swipe/3.10/swiper'),
        // 隐藏域中的信息
            vars = seajs.data.vars,
        // 第一个swiper滑动的元素
            slide = $('.swiper-slide'),
        // 第二个swiper滑动的元素
            singleLi = $('.singleLi'),
        // 窗口的宽度
            wW = $('body').width(),
        // ul下li的个数
            len = singleLi.length,
        // ul的宽度，加1000是因为有padding值跟margin值
            ulWidth = wW * len + 1000,
        // 微信分享
            weixin,
        // 普通分享
            superShare,
        // 分享按钮
            shareBtn = $('.share'),
        // 第一个分享
            shareA = shareBtn.eq(0),
        // 普通分享，调用普通分享的插件
            SuperShare = require('superShare/1.0.1/superShare'),
        // 分享跳转地址
            jumphref = location.href,
        // 分享时的图片
            imgUrl = location.protocol + shareA.attr('imgpath');

            // 点击地图，存储地图点击状态
        $('.map-box').on('click', function () {
            vars.localStorage.setItem('map', true);
        });
        var slidenumber;
        slide.show().children().hide();
        // 如果是从地图详情页进来的，显示地图页，否则显示第一页
        if (vars.localStorage.getItem('map')) {
            slide.eq(1).children().show();
            slidenumber = 1;
            vars.localStorage.removeItem('map');
        } else {
            slidenumber = 0;
            slide.eq(0).children().show();
        }
        // 第一个swiper滑动实例，每个版块之间的切换，纵向滑动
        Swiper('.pages', {
            speed: 500,
            direction: 'vertical',
            loop: true,
            noSwiping: true,
            initialSlide: slidenumber,
            // 小区配套有滑动效果，滑动这个不进行swiper滑动
            noSwipingClass: 'swiper-no-swiping',
            onTransitionEnd: function () {
                // 当前活动的slide
                var activeSlide = $('.swiper-wrapper').children('.swiper-slide-active');
                // 当前活动的slide的子元素显示，其兄弟节点的子元素隐藏，展示animation动画效果
                activeSlide.children().show();
                activeSlide.siblings().children().hide();
            }
        });

        // 设置ul的宽度
        $('.liList').css('width', ulWidth);
        var isLoop;
        if (len && len > 1) {
            isLoop = true;
        } else {
            isLoop = false;
        }
        // 设置滑动效果
        Swiper('.imgs-box', {
            wrapperClass: 'liList',
            slideClass: 'singleLi',
            width: wW * 0.9,
            loop: isLoop
        });
        // 微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: shareA.attr('newsline'),
            // 副标题
            descContent: '我在房天下发布了一套房源，点击查看详情',
            lineLink: jumphref,
            imgUrl: imgUrl,
            swapTitle: false
        });
        var config = {
            // 分享的内容title
            title: shareA.attr('newsline'),
            // 分享时的图标
            image: imgUrl || '',
            // 副标题
            desc: '我在房天下发布了一套房源，点击查看详情',
            // 分享的链接地址
            url: jumphref,
            // 分享的内容来源
            from: ' —房天下' + vars.cityname
        };
        superShare = new SuperShare(config);
    };
});
