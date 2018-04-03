/**
 * 海外特惠活动页面
 * Created by limengyang.bj@fang.com 2018-1-19
 */
define('modules/world/service', ['jquery','lazyload/1.9.1/lazyload', 'loadMore/1.0.2/loadMore', 'weixin/2.0.1/weixinshare', 'superShare/2.0.0/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var lazyLoad = require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
        lazyLoad('img[data-original]').lazyload();
        // ajax加载更多
        if (vars.totalCount > 20) {
            var loadMore = require('loadMore/1.0.2/loadMore');
            loadMore({
                url: vars.newsSite + '?c=world&a=ajaxPreferentialAct',
                // 数据总条数
                total: vars.totalCount,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数
                pageNumber: 10,
                // 加载更多按钮id
                moreBtnID: '#drag',
                // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                firstDragFlag: false,
                // 加载数据过程显示提示id
                loadPromptID: '#draginner',
                // 数据加载过来的html字符串容器
                contentID: '.yhList ul',
                // 加载前显示内容
                loadAgoTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                // 加载中显示内容
                loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                // 加载完成后显示内容
                loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>'
            });
        }
        var shareTittle = '房天下海外房产特惠活动';
        var shareDesc = '房天下海外房产特惠活动';
        var shareImg = window.location.protocol + vars.public + '201511/images/app_fang_share.png';
        var shareUrl =location.href;
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