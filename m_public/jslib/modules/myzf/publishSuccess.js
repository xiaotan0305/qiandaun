/**
 * 租房发布成功后的类
 * by tangcheng
 * 20160130
 */
define('modules/myzf/publishSuccess', ['jquery','superShare/1.0.1/superShare','weixin/2.0.0/weixinshare','modules/zf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 微信分享，调用微信分享的插件
        var shareBox = $('.share');
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: shareBox.attr('newsline'),
            // 副标题
            descContent: '优质房源尽在房天下fang.com',
            lineLink: location.href,
            imgUrl: window.location.protocol + shareBox.attr('imgpath'),
            swapTitle: false
        });
        var SuperShare = require('superShare/1.0.1/superShare');
        var config = {
            // 分享内容的title
            title: shareBox.attr('newsline'),
            // 分享时的图标
            image: window.location.protocol + shareBox.attr('imgpath'),
            // 分享内容的详细描述
            desc: '优质房源尽在房天下fang.com',
            // 分享的链接地址
            url: location.href,
            // 分享的内容来源
            from: ' 房天下'
        };
        new SuperShare(config);
        $('#immediatelyEntrust').on('click', function () {
            $('#alertWindow').show();
        });
        $('#IKnow').on('click', function () {
            $('#alertWindow').hide();
        });
        function preventDefault(e) {
            e.preventDefault();
        }

        /**
         * 手指滑动时阻止浏览器默认事件(阻止页面滚动）
         */
        function unable() {
            document.addEventListener('touchmove', preventDefault);
        }

        /**
         * 手指滑动恢复浏览器默认事件（恢复滚动
         */
        function enable() {
            document.removeEventListener('touchmove', preventDefault);
        }
        // 红包发放成功,并且是从发布页面跳过来的，这里避免刷新时一直弹发放红包窗口
        if (vars.getHongbao === '1' && vars.localStorage.getItem('hongbaoPub')) {
            $('.HbfloatAlert').show();
            unable();
            // 当发放红包窗口弹出成功后要销毁储存值，以免刷新时一直弹发放红包窗口
            vars.localStorage.removeItem('hongbaoPub');
        }
        // 点击关闭按钮
        $('.close').on('click', function () {
            $('.HbfloatAlert').hide();
            enable();
        });
    };
});