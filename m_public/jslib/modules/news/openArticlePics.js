/**
 * 房产圈（开放平台）文章详情页图片轮播js
 * Created by fenglinzeng on 17-03-22.
 */
define('modules/news/openArticlePics', ['jquery', 'swipe/3.10/swiper', 'superShare/2.0.0/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 引入jQuery
        var $ = require('jquery');
        // slider容器
        var $slider = $('#slider');
        // 图片数量
        var length = $('.swiper-slide').length;
        // 显示总数量
        $('#allIndex').text(length);
        // 引入swiper
        var Swiper = require('swipe/3.10/swiper');
        // 设置宽度
        $('.swiper-wrapper').css('width', (length && length + 2) * parseInt($slider.css('width'), 10));
        // 文字区域
        var $phototext = $('.photo-text');
        $phototext.on('click', (function () {
            var $wrap = $phototext.children();
            return function () {
                var height = parseInt($wrap.css('height'), 10);
                if (height > 100) {
                    $phototext.toggleClass('open').css({
                        maxHeight: 'none',
                        height: $phototext.hasClass('open') ? height : '100px'
                    });
                }
            };
        })());

        // 轮播
        new Swiper('#slider', {
            direction: 'horizontal',
            // 切换速度
            speed: 500,
            // 循环
            loop: true,
            onTransitionEnd: (function () {
                var $index = $phototext.find('#currentIndex');
                var $texts = $phototext.find('p');
                var $wrap = $phototext.children();
                return function (swiper) {
                    var index = swiper.activeIndex % length || length;
                    $index.text(index);
                    $texts.eq(index - 1).show().siblings('p').hide();
                    var height = parseInt($wrap.css('height'), 10);
                    $phototext.css({
                        height: height > 150 ? '100px' : 'auto'
                    }).show();
                    setTimeout(function () {
                        $phototext.removeClass('open');
                    }, 500);
                };
            })(),
            onClick: function () {
                $phototext.toggle();
            }
        });

        // 获取评论数量
        $.ajax({
            url: _vars.newsSite,
            type: 'get',
            data: {
                c: 'news',
                a: 'ajaxGetOpenFirstComment',
                city: _vars.city,
                id: _vars.newsid,
                page: 1,
                picLoad: 1
            }
        })
            .done(function (data) {
                if (data > 0) {
                    $('.commentCount').attr('href', _vars.newsSite + '?c=news&a=getOpenPicsCommentList&id=' + _vars.newsid + '&city=' + _vars.city).append('<em>' + data + '</em>');
                } else {
                    $('.commentCount').attr('href', _vars.newsSite + '?c=news&a=replyOpenComment&id=' + _vars.newsid + '&city=' + _vars.city + '&quoteText=' + _vars.title.split('】')[1]);
                }
            });

        // // 点赞
        // var inAjax = false;
        // var flag = 1;
        // $('.likeComment').on('click', function () {
        //     var $this = $(this);
        //     if (!inAjax && !$this.hasClass('cur')) {
        //         inAjax = true;
        //         $.ajax({
        //             url: _vars.newsSite + '?c=news&a=ajaxNewsZanCai',
        //             type: 'get',
        //             data: {
        //                 newsid: _vars.newsid,
        //                 flag: flag,
        //                 r: Math.random()
        //             }
        //         })
        //         .done(function(data) {
        //             inAjax = false;
        //             $this.addClass('cur');
        //         });
        //     }
        // });

        // 分享
        var SuperShare = require('superShare/2.0.0/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');

        var imgUrl = '', imgs = $('.shareImg');
        if (imgs.length) {
            imgUrl = location.protocol + imgs.attr('src');
        } else {
            imgUrl = 'http://js.soufunimg.com/common_m/m_index/img/soufun.png';
        }
        // 描述
        var description = _vars.description || '把脉房地产市场、实时追踪政策动向、捕捉最新商业趋势，海量资讯尽在房天下。';
        var config = {
            // 分享的内容title
            title: _vars.title,
            // 分享时的图标
            image: imgUrl,
            // 分享内容的详细描述
            desc: description,
            // 分享的链接地址
            url: location.href,
            // 分享的内容来源
            from: '房天下'
        };
        var superShare = new SuperShare(config);
        $(document).on('click', '.share', function () {
            superShare.share();
        });
        new wxShare({
            debug: false,
            shareTitle: config.title,
            descContent: description,
            lineLink: location.href,
            imgUrl: imgUrl
        });

        // 顶部导航
        $('.icon-pic-more').on('click', function () {
            if ($('#nav').hasClass('open')) {
                $('.head-drop').show();
                $('#nav').hide().removeClass('open');
            } else {
                $('.head-drop').toggle();
            }
        });
        $('#channelNav').on('click', function () {
            $('.head-drop').hide();
            $('#nav').toggle().css({
                top: '45px',
                left: '0',
                position: 'absolute'
            }).addClass('open');
            $('body').css('backgroundColor', '#202020');
        });
    };
});