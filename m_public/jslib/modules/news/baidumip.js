/**
 * 北京时间合作列表页
 * Created by limengyang.bj@fang.com 2017-5-10
 */
define('modules/news/baidumip', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        // 图片惰性加载
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
        // 正文查看更多显示判断
        var $moreArticle = $('.more_zkxq');
        var $conWord = $('.bd-conWord');
        // 正文大于10行
        if ($conWord.height() > 310) {
            $conWord.css('max-height', '310px');
            $moreArticle.show();
            // 正文查看更多点击
            $moreArticle.on('click', function () {
                $conWord.css('max-height', '');
                $moreArticle.hide();
            });
        }
        // 导购页面需要滑动功能
        if (vars.channelid === '12188') {
            require.async('swipe/3.3.1/swiper', function (Swipe) {
                var swipeFunc = function (swipeId, swipePoint) {
                    var swiperEle = $(swipeId);
                    var $wrap = swiperEle.find('.swipe-wrap');
                    var $slide = swiperEle.find('.swiper-slide').show();
                    var length = $slide.length;
                    var $swipePointList = swiperEle.find('.swipe-point').find(swipePoint);
                    $wrap.css('width', parseInt(swiperEle.css('width'), 10) * (length + 2));
                    new Swipe(swipeId, {
                        loop: true,
                        autoplay: 3000,
                        autoplayDisableOnInteraction: false,
                        speed: 500,
                        autoHeight: true,
                        wrapperClass: 'swipe-wrap',
                        onTransitionEnd: function (swiper) {
                            var index = swiper.activeIndex % length || length;
                            $swipePointList.eq(index - 1).addClass('cur').siblings().removeClass('cur');
                        }
                    });
                };
                swipeFunc('#mentionedhouse', 'span');
                swipeFunc('#mentionedcomment', 'span');
                // 图片惰性加载，保证滑动图片也生效
                var imgs = $('img[data-original]');
                imgs.each(function () {
                    var $this = $(this);
                    $this.is(':visible') && $this.attr('src', $this.data('original'));
                });
            });
        }
        // ajax赞踩标识
        var inAjax = false;
        // 赞踩按钮
        var zancaibtn = $('.zancaibtn');
        // 显示提示信息,flag赞踩标识（0=查看，-1=踩，1=赞）
        var ajaxZanCai = function (flag) {
            var url = vars.newsSite + '?c=news&a=ajaxNewsZanCai&newsid=' + vars.newsid + '&flag=' + flag + '&r=' + Math.random();
            $.get(url, function (data) {
                // 查到数据
                if (data && data.state === '100') {
                    // 赞踩的数量
                    var favNum = +data.item.zancount;
                    var hatNum = +data.item.caicount;
                    var $rate = $('.bd-vote-line').find('span');
                    // 百分比对象
                    var $fav = $rate.eq(0);
                    var $hat = $rate.eq(1);
                    // 对比条
                    $fav.css('width', favNum / (favNum + hatNum) * 100 + '%');
                    $hat.css('width', hatNum / (favNum + hatNum) * 100 + '%');
                    // 显示的数量
                    $('.zanno').text(favNum);
                    $('.caino').text(hatNum);
                    // 赞踩成功按钮不能再点
                    if (flag !== '0') {
                        zancaibtn.off('click');
                        if (flag === '1') {
                            $('.ding').addClass('cur');
                        } else if (flag === '-1') {
                            $('.cai').addClass('cur');
                        }
                    }
                }
            }).complete(function () {
                inAjax = false;
            });
        };
        // 先查询一次赞踩
        ajaxZanCai('0');
        // 点赞点踩
        zancaibtn.on('click', function () {
            if (!inAjax) {
                inAjax = true;
                var $this = $(this);
                // 赞踩标识，1=赞，-1=踩
                var flag = $this.attr('data-flag');
                if (vars.newsid && flag) {
                    ajaxZanCai(flag);
                }
            }
        });
        // 百度官方号需要
        if (vars.sfSource === 'baidumip') {
            $('.main').after('<script type="application/ld+json">{ "@context": "https://zhanzhang.baidu.com/contexts/cambrian.jsonld","@id": "https://zhanzhang.baidu.com/","title":"' + vars.title
                + '","images": ["' + vars.imgpath + '"]","description":"' + vars.description + '","pubDate": "' + vars.pubdate + '","isOriginal": "0"}</script>');
        }
    };
});