/**
 * 列表js
 * Created by sunwenxiu on 17-4-20.
 */
define('modules/news/dailyDetail', ['jquery', 'weixin/2.0.1/weixinshare', 'superShare/2.0.0/superShare', 'lazyload/1.9.1/lazyload'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var title = document.title;
            var content = $('meta[name="description"]')[0].content || title;
            // 图片惰性加载
            var lazyLoad = require('lazyload/1.9.1/lazyload');
            lazyLoad('img[data-original]').lazyload();

            var Weixin = require('weixin/2.0.1/weixinshare');
            // 微信分享
            var weixin = new Weixin({
                // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                debug: false,
                shareTitle: title,
                descContent: content,
                lineLink: location.href,
                imgUrl: window.location.protocol + vars.public + '201511/images/newsShare.jpg',
                swapTitle: true
            });
            var $ckyw = $('.moreNews');
            $ckyw.on('click', function () {
                $('.ptxtList').toggle();
                var ckSpan = $ckyw.find('span');
                if(!ckSpan.hasClass('up')) {
                    ckSpan.addClass('up');
                } else {
                    ckSpan.removeClass('up');
                }
            });

            var $share = $('.share');
            if ($share.length) {
                var SuperShare = require('superShare/2.0.0/superShare');
                var config = {
                    // 分享的内容title
                    title: title,
                    // 分享时的图标
                    image: window.location.protocol + vars.public + '201511/images/newsShare.jpg',
                    // 分享内容的详细描述
                    desc: content,
                    // 分享的链接地址
                    url: location.href,
                    // 分享的内容来源
                    form: '房天下'
                };
                var superShare = new SuperShare(config);
                // 2.0版本不再在插件中绑定.share类了，需要外部自行调用
                // 2.0版本只提供share方法，供外部调用
                $share.on('click',function () {
                    superShare.share();
                });
            }
        };
    });
