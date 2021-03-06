/**
 * Created on 2017/7/27.
 */
 define('modules/jiaju/jcCompanyDetail', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'iscroll/2.0.0/iscroll-lite',
    'modules/jiaju/yhxw',
    'weixin/2.0.2/weixinshare',
    'superShare/2.0.1/superShare',
    'modules/jiaju/jcFootPrint'
    ], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var isScroll = require('iscroll/2.0.0/iscroll-lite');
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({
            threshold: 200,
            event: 'scroll click'
        });
        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        var page = 'jj_jc^dpxq_wap';
        yhxw({
            page: page,
            companyid: vars.companyid,
            type: 0
        });
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

        // 详情头部的滑动图
        var stage = $('.but-stage');
        var jcCompanyDetail = $('#jcCompanyDetail');
        require.async('swipe/3.10/swiper', function (Swiper) {
            if (jcCompanyDetail) {
                new Swiper('#jcCompanyDetail', {
                    direction: 'horizontal',
                    lazyLoading: true,
                    onInit: function (swiper) {
                        stage.find('span').text('1/' + swiper.slides.length);
                    },
                    onSlideChangeEnd: function (swiper) {
                        stage.find('span').text(swiper.activeIndex + 1 + '/' + swiper.slides.length);
                    }
                });
            }
        });
        // 店铺导购
        var swiperVideos = $('#swiperVideos');
        if (swiperVideos.length) {
            swiperVideos.find('ul').width(swiperVideos.find('li').length * 174 + 14);
            new isScroll("#swiperVideos", {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        }
        // 主营商品
        var swiperGoods = $('#swiperGoods');
        if (swiperGoods.length) {
            swiperGoods.find('ul').width(swiperGoods.find('li').length * 135);
            new isScroll('#swiperGoods', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true,
                eventPassthrough: true
            });
        }

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

        /**
         * 商家活动
         */
         var moreActivict = $('#moreActivict');
         if (moreActivict.length) {
            moreActivict.on('click', function () {
                $('div.listBox').show();
                $(this).hide();
            });
        }

        // 打电话用户行为
        var tel = $('.tel:eq(1)');
        tel.on('click', function () {
            yhxw({
                page: page,
                companyid: vars.companyid,
                type: 31
            });
        });

        /**
         * 页面底部的聊天
         */
         var onlineChat = $('#onlineChat');
         onlineChat.on('click', function () {
            // 用户行为
            yhxw({
                page: page,
                companyid: vars.companyid,
                type: 24
            });
            //获取服务器时间戳
            var content = '';
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetServerDate', function(info){
                if (vars.localStorage) {
                    var lastTime = vars.localStorage.getItem('shopinfo_'+vars.companyid);
                    if (info - lastTime > 1800) {
                            //需要更新状态
                            vars.localStorage.setItem('shopinfo_'+vars.companyid, info);
                            content = encodeURIComponent($('title').text()+window.location.href);
                        }
                    }
                });
            if (vars.imid) {
                $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetUserInfoById&uid=' + vars.imid + '&city=' + vars.city, function (data) {
                    if (data && data.userid) {
                        if (vars.localStorage) {
                            vars.localStorage.setItem(String('h:' + data.username), encodeURIComponent(data.username) + ';' + data.imgurl + ';;');
                        }
                        window.location = vars.mainSite + '/chat.d?m=chat&username=h:' + data.username + '&city=' + vars.city + '&type=waphome&content=' + encodeURIComponent(content) + '&projinfo=jiaju&shopid=jd' + vars.companyid;
                    } else {
                        toastFn('获取用户信息失败，请重试!');
                    }
                });
            } else {
                toastFn('获取用户信息失败，请重试!');
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
        /* 统计日志*/
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxZXLog&city=' + vars.city + '&typeid=52&objid=' + vars.companyid + '&refer='
            + encodeURIComponent(document.referrer) + '&sorce=' + encodeURIComponent(location.href));
        /* 收藏*/
        var collect = $('#collect');
        collect.on('click', function () {
            // 用户行为
            !collect.hasClass('on') && yhxw({
                page: page,
                companyid: vars.companyid,
                type: 21
            });
            var canAjax = true;

            if (canAjax && checkLogin()) {
                canAjax = false;
                $.ajax({
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxCompanyCollect&companyid=' + vars.companyid + '&r=' + Math.random(),
                    success: function (data) {
                        if (!data) {
                            var Msg = '收藏失败, 请刷新重试';
                            if (collect.hasClass('on')) {
                                Msg = '取消' + Msg;
                            }
                            toastFn(Msg);
                        } else if (data.IsSuccess === '0') {
                            toastFn(data.Message);
                        } else if (data.IsSuccess === '1') {
                            collect.toggleClass('on');
                            toastFn(data.CollectStatus === '1' ? '收藏成功' : '取消收藏成功');
                        }
                    },
                    complete: function () {
                        canAjax = true;
                    }
                });
            }
        });
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
            params.sourcePageUrl = encodeURIComponent(location.href);
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
                descContent: '刚在房天下看到一家不错的店铺，赶快进去看看！'
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
            yhxw({
                page: page,
                companyid: vars.companyid,
                type: 22
            });
            superShare.share();
        });
        //ajax加载兄弟门店个数
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetBroCompanyCount&companyid=' + vars.companyid, function (data) {
            if ($.trim(data)) {
                $('#broCompanySec').show().html(data);
            }
        });
        //商家信息加载更多
        var intro = $('#p_intro'),
        intro_up = $('#intro_up'),
        intro_down = $('#intro_down');
        if (intro.height() > 60) {
            introHide();
        }
        intro_down.on('click', function(){
            introShow();
        })
        intro_up.on('click', function(){
            introHide();
        })
        function introShow(){
            intro.css('height', 'auto');
            intro_down.hide();
            intro_up.show();
        }
        function introHide(){
            intro.css('height', '60px');
            intro_down.show();
            intro_up.hide();
        }
    }
});
