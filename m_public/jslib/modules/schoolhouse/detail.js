define('modules/schoolhouse/detail', ['jquery', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
         var vars = seajs.data.vars;
        require.async('modules/esf/yhxw', function(yhxw) {
            yhxw({type:0,pageId:'mesfpageschool',curChannel:'schoolhouse'});
        });

        //图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        $(function () {
            // 二手房对口小区
            $('#esfdk').on('click', function () {
                $('#esfdk').toggleClass('up');
                $('#lessxqinfo').toggle();
                $('#morexqinfo').toggle();
            });

            // 入学条件(其他信息)、招生简章的展开，关闭按钮
            $('#disMore1,#disMore2').on('click',function () {
                var $that = $(this);
                $that.toggleClass('up');
                var eveId = $that.attr('id');
                var $eveCon = $('#' + eveId + 'Con');
                var lineHeight = $('#' + eveId + 'Con').children('p').css('line-height');
                // 样式中设置了max-height，默认显示四行，想要全部显示，需将max-height设置为none
                $that.hasClass('up') ? $eveCon.css('max-height','none'):$eveCon.css('max-height', parseInt(lineHeight) * 4 + 'px');
            });

            // 入学条件(其他信息)、招生简章少于默认高度则隐藏展开按钮
            $('#disMore1,#disMore2').each(function() {
                var $that = $(this);
                var eveId = $that.attr('id');
                var $eveCon = $('#' + eveId + 'Con').find('p');
                if ($eveCon.height() <= parseInt($eveCon.parent().css('max-height'))) {
                    $that.css('display', 'none');
                }
            });

            // 详情页默认焦点图，宽高比为4：3
            var xqfocus = $('.xqfocus').find('img');
            xqfocus.css('height', parseInt(xqfocus.width()) * 0.75);

            /**
             * 点击头部导航按钮 by lina 20160914
             */
            $('.icon-nav').on('click', function () {
                $('#newheader').css({opacity: 1, position: 'fixed'});
                var scrollTop = $(window).scrollTop();
                var opa = parseInt(1 - scrollTop / 150);
                $('.focus-opt').find('a').css('opacity', opa);
            });
            /**
             * 向下滑动时相关效果
             * 页面滑动未超过200px时，页面向上滑动元导航慢慢消失，新导航逐渐显示，页面向下滑动，原导航逐渐显示，新导航消失。滑动页面滚动超过200px时新导航固定顶部。
             *
             */
            function scrollFun() {
                // 详情页初始导航
                this.detailNav = $('#slider').find('a.back,a.icon-nav');
                // 页面滑动显示导航
                this.headerNav = $('.header');
                // 初始导航与页面滚动时显示导航切换的滚动总距离
                this.maxLen = 480;
                // 导航开始切换距离
                this.cLen = 400;

                this.init = function () {
                    var that = this;
                    $(window).on('scroll', function () {
                        if ($('.newNav').is(':hidden')) {
                            var scrollH = $(this).scrollTop();
                            that.headerNav.addClass('esf-style').css('position', 'fixed').show();
                            // 电商房源中的经纪人下浮层显示功能

                            // 导航切换效果
                            if (scrollH <= that.maxLen) {
                                that.headerNav.css('opacity', scrollH / that.maxLen);
                                // 向下移动屏幕
                                if (scrollH <= that.cLen) {
                                    that.detailNav.css('opacity', 1 - scrollH / that.cLen);
                                } else {
                                    that.headerNav.children().filter('.left,.head-icon').css('opacity', scrollH / (that.maxLen - that.cLen));
                                }
                                // 向上移动屏幕
                            } else {
                                that.headerNav.css('opacity', 1);
                            }
                        } else {
                            that.detailNav.show();
                            that.headerNav.show().addClass('esf-style').css({position: 'relative', opacity: '1'});
                        }
                    });
                };
                return this.init();
            }

            // 页面加载立即执行
            new scrollFun();
            // 点击帖子内容图片，图片放大功能
            var entrance = $('#entrance_sw');
            entrance.on('click', function () {
                var src = $(this).attr('src');
                var slides = [];
                var Img = entrance[0];
                // 点击缩放大图浏览
                var pswpElement = $('.pswp')[0];
                slides.push({src: src, w: Img.naturalWidth, h: Img.naturalHeight});
                var options = {
                    history: false,
                    focus: false,
                    index:0,
                    escKey: true
                };
                var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, slides, options);
                gallery.init();
            });

            $('.lookbpic').on('click', function(e) {
                e.stopPropagation();
            });
        });
    };
});