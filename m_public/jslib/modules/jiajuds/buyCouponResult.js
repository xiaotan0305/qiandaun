/**
 * @file 优惠券购买成功页面
 * created by muzhaoyang 2017 - 04 - 21
 */
define('modules/jiajuds/buyCouponResult', ['jquery'], function(require, exports, module) {
    'use strict';
    module.exports = function() {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        if(vars.jumpUrl) {
            setTimeout(function () {
                location.href = vars.jumpUrl;
            },3000);
        }
        
    }
});