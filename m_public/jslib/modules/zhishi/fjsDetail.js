/**
 * Created by hanxiao on 2018/1/8.
 */
define('modules/zhishi/fjsDetail', ['jquery', 'lazyload/1.9.1/lazyload', 'superShare/1.0.1/superShare', 'weixin/2.0.1/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');

        // 从页面获取的参数
        var vars = seajs.data.vars;

        require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
       $('img').lazyload({event: 'scroll click'});

        //视频按钮
        var videobox = $('.videobox');
        //缩略图按钮
        var imageone = $('.imageone');
        //播放按钮图标
        var videocon = $('.vedio-icon');
        //点击缩略图播放视频
        videocon.on('click', function () {
            imageone.hide();
            videocon.hide();
            videobox.show();
            videobox[0].play();
        })

        var widthText = $(".txt  h2").width();
        $('.zsTagS').width(widthText);

        $(function () {
            /* 分享代码*/
            var SuperShare = require('superShare/1.0.1/superShare');
            //分享按钮
            var config = {
                // 分享的内容title
                title: vars.shareTitle,
                // 分享时的图标
                image: window.location.protocol + vars.public + '201511/images/videoshare.jpg',
                // 分享内容的详细描述
                desc: vars.shareSummary,
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: ' —房天下视频'
            };
            var superShare = new SuperShare(config);
        });

        // 微信分享
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: vars.shareTitle,
            descContent: vars.shareSummary,
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.public + '201511/images/videoshare.jpg',
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });

        // 下载弹层
        require.async('app/1.0.0/appdownload', function () {
            // 顶部弹层
            $('#indexDownload').openApp('');
        });
    };
});
