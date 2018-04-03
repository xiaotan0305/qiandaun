/**
 * 租房发布成功后的类
 * by tangcheng
 * 20160130
 */
define('modules/myzf/publishSuccess', ['jquery','superShare/2.0.0/superShare','weixin/2.0.0/weixinshare','modules/zf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 微信分享，调用微信分享的插件
        var shareBox = $('.share');
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: vars.H5title,
            descContent: vars.description,
            lineLink: vars.H5jumpath,
            imgUrl: vars.imgpath,
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: vars.H5title,
            // 副标题
            desc: vars.description,
            // 分享时的图标
            image: vars.imgpath,
            // 分享的链接地址
            url: vars.H5jumpath,
            // 分享的内容来源
            from: ' —房天下',
        };
        var superShare = new SuperShare(config);
        //点击分享
        shareBox.on('click', function () {
            superShare.share();
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
            $('.hbfloat').show();
            unable();
            // 当发放红包窗口弹出成功后要销毁储存值，以免刷新时一直弹发放红包窗口
            vars.localStorage.removeItem('hongbaoPub');
        }
        // 点击关闭按钮
        $('.close').on('click', function () {
            $('.hbfloat').hide();
            enable();
        });

        //点击图片
        $('.con').not('.noclick').on('click', function () {
            $('.hbfloat').hide();
            enable();
            superShare.share();
        });

    };
});