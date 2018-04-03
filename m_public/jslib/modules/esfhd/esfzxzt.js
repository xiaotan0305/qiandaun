/**
 * 二手房甄选房源专题
 * modify by loupeiye@fang.com 20180117
 */
define('modules/esfhd/esfzxzt', ['jquery', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        function scrolling(){
            $(window).scroll(function(){
                if($(this).scrollTop()>$('.list').offset().top - $(window).height() + 200)
                {
                    $('.btn').show();
                }
                else
                {
                    $('.btn').hide();
                }
            });
        };
        $(document).ready(scrolling);
        $(document).ready(function($){
            $('.tag1').animate({opacity:'1'},600);
            setTimeout("$('.tag2').animate({opacity:'1'},600)",600);
            setTimeout("$('.tag3').animate({opacity:'1'},600)",1200);
            setTimeout("$('.tag4').animate({opacity:'1'},600)",1800);
            setTimeout("$('.text img').animate({width:'100%'},1200)",2400);
        });

        //微信分享显示自定义标题+描述+图
        var Weixin = require('weixin/2.0.0/weixinshare');
        new Weixin({
            debug: false,
            shareTitle: vars.shareTitle,
            // 副标题
            descContent: vars.shareDescription,
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.shareImage,
            //swapTitle: true,
        });
    };
});