/**
 * 我要砍价
 */
define('modules/zfhd/zfH5ActivityRedPacket', ['jquery', 'util/util', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function (option) {
        // jquery库
        var $ = require('jquery');
        // 页面传入的参数
        var vars = seajs.data.vars;
        var myCookie = require('util/util');
        var islogin = myCookie.getCookie('sfut');
        if (!islogin) {
            window.location.href = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
        }

        $('.moreBtn').on('click', function(){
            $('.hide').show();
            $('.moreBtn').hide();
        });

    }
});