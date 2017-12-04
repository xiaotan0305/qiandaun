/**
 * 共建共享活动
 * modify by loupeiye@fang.com 20170913
 */
define('modules/esfhd/awardingEveryday', ['jquery', 'flexible/flexible.debug.js', 'flexible/flexible_css.debug.js', 'weixin/2.0.0/weixinshare', 'floatAlert/1.0.0/floatAlert'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        var floatAlert = require('floatAlert/1.0.0/floatAlert');
        var floatObj = new floatAlert(option);
        //提现操作
        $('.btn').on('click', function () {
            if ($(this).hasClass('disabled') || $(this).hasClass('btn-ed') ) {
                return false;
            }
            $.ajax({
                url: vars.esfSite + '?c=esfhd&a=ajaxAddAwardExtOrder&city=' + vars.city + '&isAgent=1',
                success: function (data) {
                    floatObj.showMsg(data.errmsg, 2000);
                },
                error: function () {
                    floatObj.showMsg('提交失败，请稍后重试', 2000);
                }
            });
        });

        require('flexible/flexible.debug.js');
        require('flexible/flexible_css.debug.js');

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
    };
});