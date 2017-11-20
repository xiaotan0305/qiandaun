/*
 * @file 家居打开app
 * @author thx
 *
 *  opts = {
 *      tencentUrl: 微信qq跳转到腾讯应用宝,默认：'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.decoration.app'
 *      openQueue:app打开顺序,['zxapp','fapp','url']，默认空
 *      delay:打开延迟，默认750
 *      ioszxapp: ios打开装修app地址,默认：'newzhuangxiu://data/{"address":"myinfo"}'
 *      androidzxapp: android打开装修app地址,默认：'fangtxzx://data/{"address":"myinfo"}'
 *      iosfapp: ios打开房app地址,默认：'soufun://'
 *      androidfapp: android打开房app地址,默认：'soufun://waptoapp/{"destination":"mysoufun"}'
 *      iosurl: ios跳转苹果应用商店地址,默认：'https://itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8'
 *      androidurl: android跳转苹果应用商店地址，默认：location.protocol + vars.mainSite + 'client.jsp?produce=ftxzx'
 *      openappEl:app打开绑定元素,默认：'.openApp'
 *  },
 *  var openapp = require('modules/jiaju/openapp');
 *  openapp.init(opts);
 */
define('modules/jiaju/openapp', ['jquery', 'UA/1.0.0/UA'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var UA = require('UA/1.0.0/UA');
    var vars = seajs.data.vars;
    // 默认参数
    var defaultOpts = {
        tencentUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.decoration.app',
        ios: {
            zxapp: 'newzhuangxiu://data/{"address":"myinfo"}',
            fapp: 'soufun://',
            url: 'https://itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8'
        },
        android: {
            zxapp: 'fangtxzx://data/{"address":"myinfo"}',
            fapp: 'soufun://waptoapp/{"destination":"mysoufun"}',
            url: location.protocol + vars.mainSite + 'client.jsp?produce=ftxzx'
        },
        openappEl: '.openApp',
        delay: 750
    };
    var openapp = {
        init: function (opts) {
            var that = this;
            that.opts = opts || {};
            that.delay = that.opts.dalay || defaultOpts.delay;
            that.queue = that.opts.openQueue || [];
            that.$openApp = $(that.opts.openappEl || defaultOpts.openappEl);
            that.bindEvent();
            that.href = location.href;
        },
        bindEvent: function () {
            var that = this;
            that.$openApp.on('click', $.proxy(that.openApp, that));
            $(document).on('visibilitychange webkitvisibilitychange', function () {
                if (document.hidden || document.webkitHidden) {
                    that.clearTimer();
                }
            });
            $(window).on('pagehide', $.proxy(that.clearTimer(), that));
        },
        openApp: function () {
            /微信客户端|QQ客户端/i.test(UA.name) ? this.tencent() : /ios|android/i.test(UA.os) && this.mobile();
        },
        tencent: function () {
            // 跳转腾讯应用宝
            location.href = this.opts.tencentUrl || defaultOpts.tencentUrl;
        },
        mobile: function () {
            var that = this;
            var opts = that.opts;
            var os = UA.os;
            var queue = that.queue;

            // 打开app
            $.each(queue, function (index, type) {
                that['timer' + type] = setTimeout(function () {
                    if (os === 'ios' || type === 'url') {
                        location.href = opts[os + type] || defaultOpts[os][type];
                    } else {
                        var body = document.body;
                        var iframe = document.createElement('iframe');
                        iframe.src = opts[os + type] || defaultOpts[os][type];
                        iframe.style.cssText = 'display:none;width=0;height=0';
                        body.appendChild(iframe);
                    }
                }, index * that.delay);
            });
        },
        clearTimer: function () {
            var that = this;
            $.each(function (index, type) {
                clearTimeout(that['timer' + type]);
            });
        }
    };
    module.exports = openapp;
});