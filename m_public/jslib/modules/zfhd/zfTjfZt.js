/**
 * 爱分享活动
 */
define('modules/zfhd/zfTjfZt', ['jquery', 'weixin/2.0.0/weixinshare', 'superShare/2.0.0/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        //微信分享，调用微信分享的插件
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.title,
            // 副标题
            descContent: vars.description,
            lineLink: vars.jumpath,
            imgUrl: vars.imgpath,
            swapTitle: false
        });
        // 普通分享
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: vars.title,
            // 副标题
            desc: vars.description,
            // 分享时的图标
            image: vars.imgpath,
            // 分享的链接地址
            url: vars.jumpath,
            // 分享的内容来源
            from: ' —房天下'
        };
        var superShare = new SuperShare(config);
        //点击查看更多
        $(".more01").on("click", function() {
            $(this).hide();
            $('.showMore').show();
        })
        //点击切换城市
        $("#changeCity").on("click", function() {
            $('.cityopen').show();
        })
        //参数为downParam时，点击房源下载app
        if (vars.downParam && vars.downParam === 'downParam') {
            require.async('app/1.0.0/appdownload', function ($) {
                $('.tjfFgfZt').openApp({position: 'tjfFgfZt'});
            });
        }
    }
});