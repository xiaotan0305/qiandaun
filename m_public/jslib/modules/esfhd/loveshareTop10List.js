/**
 * 爱分享活动
 */
define('modules/esfhd/loveshareTop10List', ['jquery', 'weixin/2.0.0/weixinshare', 'iscroll/1.0.0/iscroll', 'modules/jiaju/filters'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        var UA = navigator.userAgent.toLowerCase();
        vars.jiajuUtils = {
            // 禁用/启用touchmove
            toggleTouchmove: (function () {
                function preventDefault(e) {
                    e.preventDefault();
                }

                return function (unable) {
                    document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
                };
            })()
        };
        var filters = require('modules/jiaju/filters');
        filters();
        //分享内容
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
    }
});