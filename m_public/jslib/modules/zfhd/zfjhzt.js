define('modules/zfhd/zfjhzt', ['jquery', 'weixin/2.0.0/weixinshare'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
           //微信分享显示自定义标题+描述+图
            var Weixin = require('weixin/2.0.0/weixinshare');
            new Weixin({
                debug: false,
                shareTitle: vars.shareTitle,
                // 副标题
                descContent: vars.shareDescription,
                lineLink: location.href,
                imgUrl: window.location.protocol + vars.shareImage,
                swapTitle: true,
            });
        };
    });