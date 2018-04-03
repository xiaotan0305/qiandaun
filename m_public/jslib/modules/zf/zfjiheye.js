/**
 * 租房活动集合页
 */
define('modules/zf/zfjiheye', ['jquery', 'weixin/2.0.0/weixinshare', 'superShare/2.0.0/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        //参数为downParam时，点击房源下载app
        if (vars.downParam && vars.downParam === 'downParam') {
            require.async('app/1.0.0/appdownload', function ($) {
                $('.tjfFgfZt').openApp({position: 'tjfFgfZt'});
            });
        }
    }
});