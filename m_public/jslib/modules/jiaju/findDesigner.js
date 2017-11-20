/**
 * @file 服务页-找设计
 * @author bjzhangxiaowei@fang.com
 */
define('modules/jiaju/findDesigner', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 取消UC浏览器的图片可点击的效果
        $('.imgClick').click(function () {
            return false;
        });
        // 微信分享  08-27
        // 1.引入Js文件
        var wchatJsUrl = vars.imgUrl + 'other_js/jweixin-1.0.0.js';
        var shareurl = vars.jiajuSite + '?c=jiaju&a=findDesigner&city=' + vars.city;
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
                    title: '设计大咖云集在此，订制专属你的个性化设计！',
                    link: shareurl,
                    imgUrl: imageUrl
                });
                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: '设计大咖云集在此，订制专属你的个性化设计！',
                    link: shareurl,
                    imgUrl: imageUrl
                });
            });
        });
    };
});