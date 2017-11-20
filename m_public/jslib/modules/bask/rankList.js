/**
 * 排行榜主类
 * by yangchuanlong
 * 2016830
 */
define('modules/bask/rankList', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 获取页面数据
        var vars = seajs.data.vars;
        // 绑定事件对象
        var answersCount = $('.answersCount'),
            jpAnswersCount = $('.jpAnswersCount'),
            putong = $('#putong'),
            jingpin = $('#jingpin');
        // 状态
        var flag = false;

        /**
         * 绑定点击事件
         */

        $('.answerscount').on('click', 'li', function () {
            var $that = $(this);
            // 标签添加和去除active
            $that.find('a').addClass('active');
            $that.siblings('li').find('a').removeClass('active');
            if ($that.hasClass('answersCount')) {
                // 点击回答数隐藏精品回答数显示普通回答数
                putong.show();
                jingpin.hide();
            } else {
                // 判断是否成功请求过ajax
                if (flag) {
                    // 点击精品回答数隐藏回答数显示精品回答数
                    jingpin.show();
                    putong.hide();
                } else {
                    jingpin.html('');
                    putong.hide();
                    $.get(vars.askSite + '?c=bask&a=rankList&grouptype=' + vars.grouptype + '&sort=2&zhcity=' + vars.zhcity, function (data) {
                        jingpin.append(data.message);
                        $('.lazyload').lazyload();
                        if (data.code === '100') {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    });
                }
            }
        });
    };
});