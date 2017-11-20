/**
 * 客户端下载页面主入口
 * by blue
 * 20150215 blue 增加注释，删除不合理的部分
 */
define('modules/download/main', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    // 引用jquery库
    var $ = require('jquery');
    // 获取页面使用vars直接传入的参数
    var vars = seajs.data.vars;
    // 滑动滚动插件类
    var iscrollLite = require('iscroll/2.0.0/iscroll-lite');
    // 应用介绍全部展示按钮实例
    var btnSq = $('#btn-sq');
    // 应用介绍简略介绍容器
    var sqDiv = $('#sqDiv');
    // 应用介绍全部内容容器
    var zkDiv = $('#zkDiv');
    // 应用介绍内容折叠按钮
    var btnZk = $('#btn-zk');
    // 应用滑动展示截图容器
    var scroller = $('#scroller');
    // 页脚登录按钮
    var sfutHref = $('.sfutHref');
    // 下载客户端入口
    var jsLotteryEntrance = $('.js_lotteryEntrance');
    // 除房天下以外的点击下载操作按钮
    var $appDownload = $('#appDownload');
    var result = $appDownload.length && $appDownload.find('.btn-down').attr('data-params').split(';');
    // 载入导航按钮操作
    require.async('navflayer/navflayer_new2');
    // 点击应用介绍展开按钮
    btnSq.on('click', function () {
        sqDiv.hide();
        zkDiv.show();
    });
    // 点击引用介绍折叠按钮
    btnZk.on('click', function () {
        zkDiv.hide();
        sqDiv.show();
    });
    // 如果存在app截图说明滑动区域
    if (scroller.length > 0) {
        scroller.width(scroller.find('li').length * scroller.find('li').eq(0).outerWidth(true));
        new iscrollLite('#huxingslider', {scrollX: true, bindToWrapper: true, eventPassthrough: true});
    }
    // 如果存在sfut则说明已经登录了，隐藏登录按钮
    if (vars.sfut) {
        sfutHref.hide();
    }
    // 普通短信打开app
    // 自动执行打开app的js
    if (vars.paramfromsms) {
        // fang天下app自动打开和下载
        require.async(vars.public + 'js/autoopenapp.js');
    } else if (vars.paramfromzxsms) {
        // 装修短信打开app
        require.async(vars.public + 'js/autoopenapp_ftxzx.js');
    }
    // 点击除了房天下的其他app下载按钮时操作
    if (window.location.href.indexOf('soufunrent') <= -1) {
        if ($appDownload.length) {
            $appDownload.on('click', function () {
                // 跳转苹果应用商店地址或者安卓的应用宝地址
                window.location.replace(result[0]);
                // 获取当前app相关数据
                // 包括app名称及苹果应用商店下载地址或者安卓的应用宝地址
                // 统计需要，
                $.get('/public/?c=public&a=ajaxOpenAppData', {
                    // 当点击下载按钮时统计为类型4
                    type: 4,
                    // 需要记录入口页面
                    rfurl: document.referrer,
                    company: result[2],
                    app: result[1]
                });
            });
        }
    }
    // 租房下载页短信自动跳AppStore,点击下载跳AppStore
    if (window.location.href.indexOf('soufunrent') > -1) {
        (function (win) {
            var doc = document, $ = win.$, result = [];
            var zf = function () {
                this.listen();
            };
            zf.prototype = {
                listen: function () {
                    var that = this;
                    var u, l, url = vars.public + '/jslib/openapp/openappzf.js';
                    if (vars.paramfromsms) {
                        (function () {
                            var callback = function (openApp) {
                                typeof win.openApp === 'function' && (openApp = win.openApp);
                                var oa = openApp({
                                    url: result[0], log: that.log,click: false
                                });
                                oa.openApp();
                            };
                            if (typeof win.seajs === 'object') {
                                win.seajs.use(url, callback);
                            } else {
                                u = doc.createElement('script');
                                l = doc.getElementsByTagName('head')[0];
                                u.async = true;
                                u.src = url;
                                u.onload = callback;
                                l.appendChild(u);
                            }
                        })();
                    }
                    $appDownload.click(function (e) {
                        var callback = function (openApp) {
                            typeof win.openApp === 'function' && (openApp = win.openApp);
                            var oa = openApp({
                                url: result[0], log: that.log,click: true
                            });
                            oa.openApp();
                        };
                        if (typeof win.seajs === 'object') {
                            win.seajs.use(url, callback);
                        } else {
                            u = doc.createElement('script');
                            l = doc.getElementsByTagName('head')[0];
                            u.async = true;
                            u.src = url;
                            u.onload = callback;
                            l.appendChild(u);
                        }
                    });
                },
                log: function () {
                    try {
                        $.get('/public/?c=public&a=ajaxOpenAppData',
                            {type: 4, rfurl: document.referrer, company: result[2], app: result[1]}
                        );
                    } catch (e) {
                        console.error(e);
                    }
                }
            };
            new zf();
        })(window);
    }
    // 实现点击app下载安装了app直接打开app的操作，这个功能只有下载房天下时才生效
    if (jsLotteryEntrance.length <= 0)return;
    (function (win) {
        var doc = document, $ = win.$, result2 = [];
        var dataParams = jsLotteryEntrance.attr('data-params');
        if (dataParams) {
            result2 = dataParams.split(';');
        } else {
            dataParams = jsLotteryEntrance.find('.btn-down').attr('data-params');
            result2 = dataParams.split(';');
        }
        var k = function () {
            this.listen();
        };
        k.prototype = {
            listen: function () {
                var that = this;
                jsLotteryEntrance.click(function (e) {
                    var u, l, url = vars.public+'/jslib/openapp/openapp.js', callback = function (openApp) {
                        typeof win.openApp === 'function' && (openApp = win.openApp);
                        var oa = openApp({
                            url: result2[0], log: that.log
                        });
                        oa.openApp();
                    };
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof win.seajs === 'object') {
                        win.seajs.use(url, callback);
                    } else {
                        u = doc.createElement('script');
                        l = doc.getElementsByTagName('head')[0];
                        u.async = true;
                        u.src = url;
                        u.onload = callback;
                        l.appendChild(u);
                    }
                    return false;
                });
            },
            log: function () {
                try {
                    $.get('/public/?c=public&a=ajaxOpenAppData',
                        {type: 4, rfurl: document.referrer, company: result2[2], app: result2[1]}
                    );
                } catch (e) {
                    console.error(e);
                }
            }
        };
        new k();
    })(window);
});