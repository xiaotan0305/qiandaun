/**
 * 专题入口主类
 * by chenhongyan
 * 2017.9.12
 */
define('modules/zhuanti/main', ['jquery', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 窗口jquery对象实例
    var $window = $(window);
    // 页面传入的参数对象
    var vars = seajs.data.vars;
    var UA = navigator.userAgent.toLowerCase();
    // 下载app
    var downBtn = $('#down-btn');
    // 热combo使用的加载数组
    var preload = [];
    // 如页面底部有app下载按钮引入appdownload
    if (downBtn.length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    // 统一将页面中后台使用input的hidden类型传入的参数置入vars中，！！！这个方法明显应该放在入口文件中
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    
    // 当action不为空时，加载栏目主类
    if (vars.action !== '') {
        preload.push('modules/zhuanti/' + vars.action);
    }
    if (vars.action == 'personalstyle') {
        preload.push('navflayer/navflayer_new2')
    }
    // 加载置顶操作js
    preload.push('backtop/1.0.1/backtop');
    // 将需要加载的js异步加载
    require.async(preload);
    if (downBtn.length > 0) {
        require.async('app/1.0.0/appdownload', function () {
            downBtn.openApp({position: vars.position});
        });
    }
    if (vars.action !== '') {
        // 执行栏目主类
        require.async(['modules/zhuanti/' + vars.action], function (run) {
            run();
        });
    }

    var shareBox = $('.shareBox a');
    var shareOne = $('#shareOne');
    var shareTwo = $('#shareTwo');
    shareBox.on('click', function(){
        var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
        if (ua.match(/micromessenger/i) == "micromessenger" || ua.indexOf('qq/') !== -1 || ua.indexOf('weibo') !== -1 || ua.indexOf('qzone/') !== -1 || vars.isoa) {
            //在微信中打开
            shareOne.show();
        } else {
            shareTwo.show();
        }
    });
    var shareClose = $('.share-btn');
    shareClose.on('click', function(){
        shareOne.hide();
        shareTwo.hide();
    });

    if (vars.superShare) {
        $(function () {
            /* 分享代码*/
            var SuperShare = require('superShare/1.0.1/superShare');
            //分享按钮
            var config = {
                // 分享的内容title
                title: vars.title + '...',
                // 分享时的图标
                image: window.location.protocol + vars.imgUrl,
                // 分享内容的详细描述
                desc: vars.description + '...',
                // 分享的链接地址
                url: location.href,
                // 分享的内容来源
                from: vars.cityname + ' —房天下'
            };
            var superShare = new SuperShare(config);
        });
    }

    if (vars.action !== 'xfLastDataReport') {
        //微信分享
        var Weixin = require('weixin/2.0.0/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: vars.title,
            descContent: vars.description,
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.imgUrl,
        });
    }
    // 稍作页面滚动，隐藏地址栏
    $window.scrollTop(1);
    // 判断是否加载显示回顶按钮，.back的用处是给scroll加一个命名空间，防止将backtop中绑定的scroll事件一起解绑
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.1/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    // 统计功能
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});