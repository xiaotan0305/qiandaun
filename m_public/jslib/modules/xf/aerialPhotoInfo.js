define('modules/xf/aerialPhotoInfo', ['jquery', 'weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
    var iframe = $('iframe');
    var vars = seajs.data.vars;
    var Weixin = require('weixin/2.0.0/weixinshare');

    // @update tankunpeng 增加微信分享
    new Weixin({
        debug: false,
        shareTitle: vars.shareTitle,
        descContent: vars.descContent,
        lineLink: vars.lineLink,
        imgUrl: vars.imgUrl,
        swapTitle: false
    });
    iframe.eq(0).css({
        height: $(window).height(),
        border: 'none'
    });
});
