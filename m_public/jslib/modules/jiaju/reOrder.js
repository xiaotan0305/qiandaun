/**
 * @file 为App的重新付款功能提供的wap中转页
 * @author 汤贺翔(tanghexiang@fang.com)
 */
define('modules/jiaju/reOrder', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    if (vars.issuccess === '1') {
        // 成功跳转收银台
        $('#form').submit();
    } else {
        // 失败提示错误信息并后退
        var $sendFloat = $('#sendFloat');
        var $sendText = $('#sendText');
        $sendText.text(vars.errormessage);
        $sendFloat.show();
        setTimeout(function () {
            window.history.back();
        }, 3000);
    }
});