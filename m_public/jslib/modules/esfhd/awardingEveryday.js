/**
 * 共建共享活动
 * modify by loupeiye@fang.com 20170913
 */
define('modules/esfhd/awardingEveryday', ['jquery', 'jquerySuperSlide/1.0.0/superSlide', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 滚动效果库
        require('jquerySuperSlide/1.0.0/superSlide');
        document.documentElement.style.fontSize = 20 * document.documentElement.clientWidth / 320 + 'px';
        $(".picMarquee-left").slide({
            mainCell: ".bd ul",
            autoPlay: true,
            effect: "leftMarquee",
            vis: 3,
            interTime: 30,
            mouseOverStop: false
        });

        //微信分享显示自定义标题+描述+图
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.shareTitle,
            // 副标题
            descContent: vars.shareDescription,
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.shareImage,
            //swapTitle: true,
        });

        /*170915 add 顶部文字左滚动*/
        function ScrollImgLeft(){
            var speed=40;
            var MyMar = null;
            var scroll_begin = document.getElementById("scroll_begin");
            var scroll_end = document.getElementById("scroll_end");
            var scroll_div = document.getElementById("scroll_div");
            scroll_end.innerHTML=scroll_begin.innerHTML;
            function Marquee(){
                if(scroll_end.offsetWidth-scroll_div.scrollLeft<=0)
                    scroll_div.scrollLeft-=scroll_begin.offsetWidth;
                else
                    scroll_div.scrollLeft++;
            }
            MyMar=setInterval(Marquee,speed);
            scroll_div.onmouseover = function(){
                clearInterval(MyMar);
            }
            scroll_div.onmouseout = function(){
                MyMar = setInterval(Marquee,speed);
            }
        }
        ScrollImgLeft();
        /*170915 end*/
    };
});