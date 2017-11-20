/**
 * @file 装修馆案例详情页
 * @author bjxuying@fang.com on 16-11-11.
 */
define('modules/jiaju/zxgCaseDetail', ['jquery', 'lazyload/1.9.1/lazyload', 'photoswipe/4.0.8/photoswipe', 'photoswipe/4.0.8/photoswipe-ui-default.min', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var superShare = require('superShare/1.0.1/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        
        // 信息展示
        var $togglemore = $('.showmore,.closemore');
        $togglemore.on('click', (function () {
            var isshow = false;
            return function () {
                $togglemore.toggle();
                isshow = !isshow;
                $('.xqAnli').css('max-height', isshow ? 'none' : '120px');
            };
        })());


        // 分享
        new superShare({
            title: '房天下为您实现心里的家~',
            desc: '在房天下发现这个' + vars.stylename + '设计方案非常赞，分享给小伙伴们~',
            image: location.protocol + vars.shareImg
        });
        new wxShare({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '房天下为您实现心里的家~',
            descContent: '在房天下发现这个' + vars.stylename + '设计方案非常赞，分享给小伙伴们~',
            lineLink: location.protocol + '//m.fang.com/',
            imgUrl: location.protocol + vars.shareImg
        });

        var pswp = $('.pswp')[0];
        var $head2 = $('.head_2');
        var $imgs = $('.picList').find('img');
        var items = [];
        var length = $imgs.length;
        var $imgsPs = $('.picture').find('img');
        // photoswipe大图模式
        $imgs.each(function (index) {
            var image = new Image();
            var $this = $(this);
            var href = $this.data('original');
            $(image).on('load', function () {
                // 加载图片
                items[index] = {
                    src: href,
                    w: this.naturalWidth,
                    h: this.naturalHeight,
                    comment: $imgsPs.eq(index).data('comm')
                };
                // 图片全部加载完绑定点击事件展示大图
                if (!--length) {
                    $imgs.on('click', function () {
                        var $this = $(this);
                        var index = $this.parents('li').eq(0).index();
                        var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, items, {
                            history: false,
                            index: index
                        });

                        gallery.listen('close', function () {
                            $head2.hide();
                        });
                        gallery.init();
                        $head2.show();

                        $head2.find('.back').on('click', function () {
                            gallery.close();
                        });
                    });
                }
            });
            image.src = href;
        });
    };
});