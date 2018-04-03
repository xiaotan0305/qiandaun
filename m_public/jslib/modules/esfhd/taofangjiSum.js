/**
 * 淘房季专题
 */
define('modules/esfhd/taofangjiSum', ['jquery','lazyload/1.9.1/lazyload', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        //****分享内容****
        var shareA = $('.share');
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

        var live=true;
        $('#arrbtn').on('click', function(){
            if(live==true){
	            $("#citybox").css('height', 'auto');
	            $("#arrbtn").addClass('up');
	            live=false;
	        }else{
                $("#citybox").css('height', '5.5rem');
	            $("#arrbtn").removeClass('up');
	            live=true;
	        }
        });
    }
});