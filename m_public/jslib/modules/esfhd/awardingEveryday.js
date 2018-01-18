/**
 * 共建共享活动
 * modify by loupeiye@fang.com 20170913
 */
define('modules/esfhd/awardingEveryday', ['jquery', 'weixin/2.0.0/weixinshare', 'iscroll/1.0.0/iscroll', 'modules/jiaju/filters'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;

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
    };
});