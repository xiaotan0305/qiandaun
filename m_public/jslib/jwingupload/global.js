define('jwingupload/global', ['jquery'], function(require, exports, module) {
    var $ = require('jquery');
    // 覆盖了全局变量$,这里没有用 直接注释掉   tankunpeng @2016/10/25
    window.jq = $;
    jQuery.extend({os: {ios: false,android: false,version: false}});
    (function() {
        var ua = navigator.userAgent;
        var browser = {}, weixin = ua.match(/MicroMessenger\/([^\s]+)/), webkit = ua.match(/WebKit\/([\d.]+)/), android = ua.match(/(Android)\s+([\d.]+)/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), ipod = ua.match(/(iPod).*OS\s([\d_]+)/), iphone = !ipod && !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), touchpad = webos && ua.match(/TouchPad/), kindle = ua.match(/Kindle\/([\d.]+)/), silk = ua.match(/Silk\/([\d._]+)/), blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/), mqqbrowser = ua.match(/MQQBrowser\/([\d.]+)/), chrome = ua.match(/CriOS\/([\d.]+)/), opera = ua.match(/Opera\/([\d.]+)/), safari = ua.match(/Safari\/([\d.]+)/);
        if (weixin) {
            jQuery.os.wx = true;
            jQuery.os.wxVersion = weixin[1];
        }
        if (android) {
            jQuery.os.android = true;
            jQuery.os.version = android[2];
        }
        if (iphone) {
            jQuery.os.ios = jQuery.os.iphone = true;
            jQuery.os.version = iphone[2].replace(/_/g, '.');
        }
        if (ipad) {
            jQuery.os.ios = jQuery.os.ipad = true;
            jQuery.os.version = ipad[2].replace(/_/g, '.');
        }
        if (ipod) {
            jQuery.os.ios = jQuery.os.ipod = true;
            jQuery.os.version = ipod[2].replace(/_/g, '.');
        }
        window.htmlEncode = function(text) {
            return text.replace(/&/g, '&amp').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        window.htmlDecode = function(text) {
            return text.replace(/&amp;/g, '&').replace(/&quot;/g, '/"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }
        window.NETTYPE = 0;
        window.NETTYPE_FAIL = -1;
        window.NETTYPE_WIFI = 1;
        window.NETTYPE_EDGE = 2;
        window.NETTYPE_3G = 3;
        window.NETTYPE_DEFAULT = 0;
    })();
});