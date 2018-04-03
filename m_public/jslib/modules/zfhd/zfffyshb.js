/**
 * 我要砍价
 */
define('modules/zfhd/zfffyshb', ['jquery', 'util/util', 'swipe/3.10/swiper', 'weixin/2.0.0/weixinshare', 'jquerySuperSlide/1.0.0/superSlide'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        $('.jzhb').on('click', function(){
            $('.floatDiv').show();
        });

        $('.closeBtn').on('click', function(){
            $('.floatDiv').hide();
        });

        $(".picMarquee-top").slide({
            mainCell: ".bd",
            autoPlay: true,
            effect: "topMarquee",
            vis: 5,
            scroll: 2,
            interTime: 30,
        });

        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.title,
            descContent: vars.description,
            lineLink: vars.jumpath,
            imgUrl: vars.imgpath,
            swapTitle: false
        });
    }
});