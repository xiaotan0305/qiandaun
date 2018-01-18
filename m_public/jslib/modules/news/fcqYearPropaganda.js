/**
 * 房产圈年度历程宣传页面
 * Created by limengyang.bj@fang.com 2018-01-05
 */
define('modules/news/fcqYearPropaganda', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var $favoritemsg=$('#favoritemsg');
        // 显示提示信息
        var showPrompt = function (msg) {
            $favoritemsg.html(msg).show();
            // 延时隐藏
            setTimeout(function () {
                $favoritemsg.hide();
            }, 1000);
        };
        // 我的房产圈按钮
        $('.btn101').on('click', function () {
            // 没有有登录用户id，跳登录页面
            if (!vars.logUserId) {
                location.href = 'https://m.fang.com/passport/login.aspx?burl=' + vars.newsSite + '?a=fcqYearPropaganda';
            } else if (vars.fcqUserId) {
                // 开通了房产圈，进入我的房产圈页面
                location.href = vars.newsSite + '?c=news&a=fcqYearCourse';
            }else {
                showPrompt('很遗憾，您还不是房产圈用户，暂时无法开启历程');
            }
        });
    };
});