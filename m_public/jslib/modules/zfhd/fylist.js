/**
 * cms租房列表专题
 * by zhuqinglin 20170818
 */
define('modules/zfhd/fylist', ['jquery', 'lazyload/1.9.1/lazyload', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 详情航拍图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        //微信分享显示自定义标题+描述+图
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.shareTitle,
            // 副标题
            descContent: vars.shareDescription,
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.shareImage,
            // swapTitle: true,
        });

        // 普通分享
        var SuperShare = require('superShare/1.0.1/superShare');
        var config = {
            // 分享内容的title
            title: vars.shareTitle,
            // 分享时的图标
            image: window.location.protocol + vars.shareImage,
            // 分享内容的详细描述
            desc: vars.shareDescription,
            // 分享的链接地址
            url: location.href,
            // 分享的内容来源
            from: ' 房天下' + vars.cityname + '二手房'
        };
        new SuperShare(config);
    };
});