/**
 * @file 为点评券的订单列表页重新付款功能提供的wap中转页
 * @author 汤贺翔(tanghexiang@fang.com)
 */
define('modules/jiajuds/rePayCouponOrder', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    if (vars.success === '1') {
        // 成功跳转收银台
        $('#form').submit();
    } else {
        // 失败定时后退
        setTimeout(function () {
            window.history.back();
        }, 3000);
    }
});