define('modules/esfhd/videoPosterPlayer', ['jquery', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare'],
    function (require, exports, module) {
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            //视频播发完毕，或错误，跳转页面
            $('.videotag').bind('error ended', function(){
                window.location = vars.esfSite  + '?c=esfhd&a=videoPoster';
            })
            //微信分享显示自定义标题+描述+图
            var Weixin = require('weixin/2.0.0/weixinshare');
            new Weixin({
                debug: false,
                shareTitle: vars.shareTitle,
                // 副标题
                descContent: vars.shareDescription,
                lineLink: vars.shareUrl,
                imgUrl: vars.shareImage,
                swapTitle: false,
            });
            // 分享功能(新)
            var SuperShare = require('superShare/1.0.1/superShare');
            var config = {
                // 分享内容的title
                title: vars.shareTitle,
                // 分享时的图标
                image: vars.shareImage,
                // 分享内容的详细描述
                desc: vars.shareDescription,
                // 分享的链接地址
                url: vars.shareUrl,
            };
            var superShare = new SuperShare(config);
        };
    });