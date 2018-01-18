/**
 * 个人中心设置页面
 * Created by limengyang.bj@fang.com 2017-12-22
 */
define('modules/mycenter/mySetUp', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var language = require('language/1.0.0/language.js');
    var $jftBtn = $('.jftBtn');
    var $jftSpan = $jftBtn.find('span');
    // 有繁体cookie
    if (vars.city=== 'macau' && getCookie('fang_wap_ft') === '1') {
        $jftSpan.html('繁體中文');
    }

    // 简繁体切换
    $jftBtn.on('click', function () {
        if (getCookie('fang_wap_ft') === '1') {
            setCookie('fang_wap_ft', 0);
            $jftSpan.html('简体中文');
        } else {
            setCookie('fang_wap_ft', 1);
            $jftSpan.html('繁體中文');
        }
        StranBody();
    });
});
