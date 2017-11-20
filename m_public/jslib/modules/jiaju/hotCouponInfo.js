/**
 * @file 爆款详情页
 * Modified by xuying 2016-8-17
 */
define('modules/jiaju/hotCouponInfo', [
    'jquery',
    'photoswipe/4.0.7/photoswipe',
    'photoswipe/4.0.7/photoswipe-ui-default.min',
    'iscroll/2.0.0/iscroll-lite',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'mjjvipinfo'
        });

        if (vars.xiajia) {
            setTimeout(function () {
                location.href = vars.xiajia;
            }, 2000);
        } else {
            var buyNow = $('#buyNow');
            var wxTip = $('#wxTip');
            var tips = $('#tips');
            var $nav = $('.icon-nav');
            var $body = $('body');
            var jiajuUtils = vars.jiajuUtils;
            // 数据请求失败时, 点击刷新
            $('#notfound').on('click', function () {
                window.location.reload();
            });
            var bua = navigator.userAgent.toLowerCase();
            if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
                $body.css('height', window.innerHeight + 100);
                window.scrollTo(0, 1);
                $body.css('height', window.innerHeight);
            }
            var $focus = $('.focus-opt');
            var $head = $('.head2');
            var maxLen = 200;
            var cLen = 150;
            var $window = $(window);
            var scrollFunc = function () {
                var scrollH = $window.scrollTop();
                // 导航切换效果
                if (scrollH <= maxLen) {
                    $head.css('opacity', scrollH / maxLen);
                    // 向下移动屏幕
                    if (scrollH <= cLen) {
                        $focus.css('opacity', 1 - scrollH / cLen);
                    } else {
                        $head.children().filter('.left,.head-icon').css('opacity', scrollH / (maxLen - cLen));
                    }
                    // 向上移动屏幕
                } else {
                    $head.css('opacity', 1);
                    $focus.css('opacity', 0);
                }
            };
            if ($('.nodata1').length) {
                $head.removeClass('head2');
                $nav.on('click', function () {
                    $head.css('position', 'relative');
                });
            } else {
                $window.on('scroll', scrollFunc);
            }


            // 照片轮播
            var imgLen = $('.swiper-slide').length;
            if (imgLen > 1) {
                require.async('swipe/3.10/swiper', function (Swiper) {
                    var $per = $('.per');
                    var imgLen = $('.swiper-slide').length;
                    new Swiper('#swiper', {
                        // 切换速度
                        speed: 500,
                        // 自动切换间隔
                        autoplay: 3000,
                        // 循环
                        loop: true,
                        autoplayDisableOnInteraction: false,
                        onSlideChangeEnd: function (swiper) {
                            // 序号从零开始
                            $per.text(swiper.activeIndex % imgLen || imgLen);
                        }
                    });
                });
            }
            // 弹层
            var toast = (function () {
                var time;
                return function (msg) {
                    // 若可购买量为0，停留在本页面
                    tips.find('span').html(msg || '');
                    tips.show();
                    jiajuUtils.toggleTouchmove(1);
                    time && clearTimeout(time);
                    time = setTimeout(function () {
                        tips.hide();
                        jiajuUtils.toggleTouchmove();
                    }, 2000);
                };
            })();
            // 立即购买
            // 锁
            var lock = true;
            buyNow.on('click', function () {
                if (lock) {
                    lock = false;
                    if (/micromessenger/i.test(bua)) {
                        wxTip.show();
                        jiajuUtils.toggleTouchmove(1);
                        if (wxTip.show()) {
                            wxTip.on('click', function () {
                                jiajuUtils.toggleTouchmove();
                                wxTip.hide();
                            });
                        }
                        lock = true;
                    } else {
                        var checkNumUrl = vars.jiajuSite + '?c=jiaju&a=ajaxHotCouponInfo';
                        // 如果是建材代金券详情需要带定位参数
                        var orderUrl = vars.jiajuSite + '?c=jiaju&a=generateOrder&city=' + vars.city + '&type=' + vars.coupontype + '&id=' + vars.couponId + vars.actParam;
                        // 1. 判断库存
                        $.ajax({
                            type: 'post',
                            url: checkNumUrl,
                            data: {
                                type: vars.coupontype,
                                id: vars.couponId,
                                mobile: vars.mobile,
                                from: vars.from,
                                ischeck: 1
                            },
                            success: function (data) {
                                // 若库存量为0，则弹窗提示“非常抱歉，该商品暂时缺货，请您稍后再来。”
                                if (data.info.LeftNum > 0) {
                                    // 未登录进入提交订单页面
                                    if (vars.mobile) {
                                        // 若可购买数量大于1则进入到订单页面
                                        if (data.info.LimitNum > 0) {
                                            window.location.href = orderUrl;
                                        } else {
                                            toast('抱歉，您已超过可购买数量限制。');
                                        }
                                    } else {
                                        window.location.href = location.protocol + orderUrl;
                                    }
                                } else {
                                    toast('该商品暂时缺货，<br>请您稍后再来。');
                                }
                            },
                            complete: function () {
                                lock = true;
                            }
                        });
                    }
                }
            });
        }
    };
});