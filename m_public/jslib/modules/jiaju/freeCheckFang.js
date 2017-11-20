/**
 * @file 服务页-免费验房
 * @author bjzhangxiaowei@fang.com
 */
define('modules/jiaju/freeCheckFang', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        // 取消UC浏览器的图片可点击的效果
        $('.imgClick').click(function () {
            return false;
        });
        // 微信分享  08-27
        // 1.引入Js文件
        var wchatJsUrl = vars.imgUrl + 'other_js/jweixin-1.0.0.js';
        var shareurl = vars.jiajuSite + '?c=jiaju&a=freeCheckFang&city=' + vars.city;
        var imageUrl = vars.public + 'img/app_jiaju_logo.png';
        imageUrl = imageUrl.replace(/^(https?)?(?=\/\/)/, location.protocol);
        // 2.通过config接口注入权限验证配置
        require.async(wchatJsUrl, function (wx) {
            wx.config({
                appId: $('#appId').val(),
                timestamp: $('#timestamp').val(),
                nonceStr: $('#nonceStr').val(),
                signature: $('#signature').val(),
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
            });
            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: '验房真的免费喔！~权威验房报告等你来拿！',
                    link: shareurl,
                    imgUrl: imageUrl
                });
                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: '验房真的免费喔！~权威验房报告等你来拿！',
                    link: shareurl,
                    imgUrl: imageUrl
                });
            });
        });
    };
});