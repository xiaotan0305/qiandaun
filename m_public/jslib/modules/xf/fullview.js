define('modules/xf/fullview', ['jquery', 'weixin/2.0.0/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
    $('#newheader, .nav-top-box').hide();
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
});