/**
 * Created by zdl on 2016/8/25.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars,
        c = window.localStorage,
        bua = navigator.userAgent.toLowerCase();
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 通用方法
    vars.jiajuUtils = {
        // 禁用/启用touchmove
        toggleTouchmove: (function () {
            function preventDefault(e) {
                e.preventDefault();
            }

            return function (unable) {
                document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
            };
        })()
    };
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    var newMsgDom = $('.sms-num');
    var $downApp = $('#down-btn-c');
    var preload = [];
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 判断是否可用localStorage并判断是否为隐私模式
    try {
        if (c) {
            c.setItem('testPrivateModel', !1);
        }
    } catch (d) {
        c = null;
    }
    // 经判断是否可用localStorage,以供之后的js使用
    vars.localStorage = c;

    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    // 下载app临时处理
    if ($downApp.length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    if (vars.action !== '' && vars.action !== 'about' && vars.action !== 'esfQxCjList') {
        preload.push('modules/top/' + vars.action);
    }
    var needFilters = 0;
    if ($.inArray(vars.action, ['esfCjDetail', 'xfGzDetail', 'esfTriDetail', 'xfRsDetail', 'xfCjDetail']) !== -1) {
        needFilters = 1;
        preload.push('iscroll/1.0.0/iscroll', 'modules/jiaju/filters');
    }
    require.async(preload);
    // 快筛
    if (needFilters) {
        require.async(['modules/jiaju/filters'], function (filter) {
            filter();
        });
    }
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 下载app临时处理
    if ($downApp.length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
        });
    }
    // 详情页
    if (vars.action !== '' && vars.action !== 'about' && vars.action !== 'esfQxCjList' && vars.action !== 'xfDisCjList') {
        require.async(['modules/top/' + vars.action], function (run) {
            run();
        });
    }

    // 稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
    // 判断是否加载显示回顶按钮
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    // 微信端分享
    require.async(['weixin/2.0.0/weixinshare'], function (wx) {
        new wx({
            debug: false,
            shareTitle: $('title').html(),
            descContent: $('meta[name="description"]')[0].content,
            lineLink: window.location.href,
            imgUrl: window.location.protocol + vars.public + '201511/images/soufun.jpg'
        });
    });
    // 首页和详情页分享
    var $share = $('.share');
    if ($share.length) {
        (function () {
            require.async(['superShare/1.0.1/superShare'], function (superShare) {
                var share = new superShare({
                    title: $('title').html(),
                    desc: $('meta[name="description"]')[0].content,
                    image: window.location.protocol + vars.public + '201511/images/soufun.jpg'
                });
                $share.on('click', function () {
                    var ua = share.ua;
                    // 判断浏览器类型;
                    if (ua.name === '微信客户端' || ua.name === '微博客户端' || ua.name === 'QQ客户端' || ua.name === 'QQZone客户端') {
                        share.weixinFloat.show();
                    } else if (ua.name === 'UC浏览器') {
                        share.shareByUC();
                    } else if (ua.name === 'QQ浏览器') {
                        share.shareByQQ();
                    } else {
                        share.floatMask.addClass('mask-visible');
                        share.shareFloat.show();
                    }
                });
            });
        })();
    }

    require.async(['count/loadforwapandm.min.js']);
    require.async(['count/loadonlyga.min.js']);
});