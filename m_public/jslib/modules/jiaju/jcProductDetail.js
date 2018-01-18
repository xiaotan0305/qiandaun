/**
 * 建材产品详情
 * Created on 2017/7/27.
 */
 define('modules/jiaju/jcProductDetail', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'iscroll/2.0.0/iscroll-lite',
    'modules/jiaju/yhxw',
    'modules/jiaju/jcFootPrint',
    'weixin/2.0.2/weixinshare',
    'superShare/2.0.1/superShare'
    ], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var $window = $(window);
            var $document = $(document);
            var isScroll = require('iscroll/2.0.0/iscroll-lite');
            require('lazyload/1.9.1/lazyload');
            $('.lazyload').lazyload({
                threshold: 200,
                event: 'scroll click'
            });
        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'jj_jc^xq_wap',
            companyid: vars.companyid,
            id: vars.id
        });
        // 优惠券
        var swiperCoupons = $('#swiperCoupons');
        if (swiperCoupons.length) {
            var swiperCouponsWidth = 0;
            swiperCoupons.find('li').each(function () {
                var $that = $(this);
                swiperCouponsWidth += parseFloat($that.width()) + 30;
            });
            swiperCoupons.find('ul').width(swiperCouponsWidth);
            new isScroll('#swiperCoupons', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        }
        // 足迹
        require.async('modules/jiaju/jcFootPrint', function (run) {
            run();
        });



        /**
         * 错误提示
         */
         var alertFloat = $('#alertFloat');
         var alertText = $('#alertText');
         function toastFn(msg) {
            alertText.html(msg);
            alertFloat.show();
            setTimeout(function () {
                alertText.html('');
                alertFloat.hide();
            }, 2000);
        }
        //产品详情头部的滑动图
        var stage = $('.but-stage');
        require.async('swipe/3.10/swiper', function (Swiper) {
            new Swiper('.swiper-container', {
                direction: 'horizontal',
                lazyLoading: true,
                onInit: function (swiper) {
                    stage.find('span').text('1/' + swiper.slides.length);
                },
                onSlideChangeEnd: function (swiper) {
                    stage.find('span').text( swiper.activeIndex + 1 + '/' + swiper.slides.length);
                }
            });
        });
        // 查看更多活动
        var moreActivict = $('#moreActivict');
        if (moreActivict.length) {
            moreActivict.on('click', function () {
                var $that = $(this);
                $that.siblings().find('li').show();
                $that.hide();
            });
        }

        //页面底部的聊天
        var onlineChat = $('#onlineChat');
        onlineChat.on('click', function () {
             //获取服务器时间戳
             var content = '';
             $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetServerDate', function(info){
                if (vars.localStorage) {
                    var lastTime = vars.localStorage.getItem('jcinfo_'+vars.id);
                    if (info - lastTime > 1800) {
                            //需要更新状态
                            vars.localStorage.setItem('jcinfo_'+vars.id, info);
                            content = encodeURIComponent($('title').text()+window.location.href);
                        }
                    }
                });
             if (vars.imid) {
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetUserInfoById&uid=' + vars.imid + '&city=' + vars.city, function (data) {
                    if (data && data.userid) {
                        if (vars.localStorage) {
                            vars.localStorage.setItem(String('j:' + data.username), encodeURIComponent(data.username) + ';' + data.imgurl + ';;');
                        }
                        window.location = '/chat.d?m=chat&username=j:' + data.username + '&city=' + vars.city + '&type=waphome&content=' + encodeURIComponent(content);
                    } else {
                        toastFn('获取用户信息失败，请重试!');
                    }
                });
            } else {
                toastFn('获取用户信息失败，请重试!');
            }
        });

        var scrollTop, productNav = $('.productNav');
        // 导航点击跳到某个模块
        productNav.on('click', function () {
            var $that = $(this);
            setTimeout(function (){
                scrollTop = $document.scrollTop() - 45;
                $document.scrollTop(scrollTop);
            },0);
            $that.addClass('active').siblings('a').removeClass('active');
        });
        // 页面滚动当前窗口的1/3就显示新的导航
        var secTab = $('.secTab');
        $window.on('scroll', function () {
            if ($window.scrollTop() > $window.height()/3) {
                secTab.addClass('tabFixed').fadeIn();
            }else{
                secTab.addClass('tabFixed').fadeOut();
            }
        });
        /**
         * 判断当前是否登录
         */
         function checkLogin() {
            var res = true;
            if (!vars.login_visit_mode) {
                res = false;
                window.location.href = vars.loginUrl;
            }
            return res;
        }
        /**
         * 底部的预约到店和优惠券的预约
         */
         var yuyueBtn = $('.yuyueBtn');
         yuyueBtn.on('click', function () {
            var $that = $(this);
            var params = {
                companyId: $that.attr('data-companyId'),
                companyName: $that.attr('data-companyName'),
                sourceType: $that.attr('data-sourceType')
            };
            var objectId = $that.attr('data-objectId');
            var objectName = $that.attr('data-objectName');
            var brandName = $that.attr('data-brandName');
            var brandId = $that.attr('data-brandId');
            var category = $that.attr('data-category');
            if (parseInt(objectId)) {
                params.objectId = objectId;
            }
            if (objectName) {
                params.objectName = encodeURIComponent(objectName);
            }
            if (brandName) {
                params.productBrand = encodeURIComponent(brandName);
            }
            if (parseInt(brandId)) {
                params.productBrandId = brandId;
            }
            if (category) {
                params.category = encodeURIComponent(category);
            }
            var yuyueFlag = true;
            if (yuyueFlag && checkLogin()) {
                yuyueFlag = false;
                $.post(vars.jiajuSite + '?c=jiaju&a=ajaxJCAppointment&city=' + vars.city, params, function (data) {
                    yuyueFlag = true;
                    if (data) {
                        toastFn(data.message);
                    } else {
                        toastFn('预约失败');
                    }
                });
            }
        });

         /* 分享*/
         var detailOptions = {
            // 分享给朋友
            onMenuShareAppMessage: {
                shareTitle: vars.shareTitle,
                descContent: '刚在房天下看到一个不错的商品，赶快进去看看！'
            },
            // 分享到朋友圈
            onMenuShareTimeline: {
                shareTitle: vars.shareTitle,
                descContent: ''
            }
        };
        var Weixin = require('weixin/2.0.2/weixinshare');
        new Weixin({
            debug: false,
            detailOptions: detailOptions,
            lineLink: location.href,
            imgUrl: location.protocol + vars.shareImage,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.1/superShare');
        var superShare = new SuperShare({
            image: location.protocol + vars.shareImage,
            url: location.href,
            from: '房天下家居'
        }, detailOptions);
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});
