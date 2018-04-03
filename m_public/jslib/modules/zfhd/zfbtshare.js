define('modules/zfhd/zfbtshare', ['jquery', 'lazyload/1.9.1/lazyload', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
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
                swapTitle: true
            });
        };
    });