/**
 * @file wap商家活动预约结果页
 * @author muzhaoyang 2018-3-22
 */
 define('modules/jiaju/jcOrderResult', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'weixin/2.0.1/weixinshare',
    'superShare/2.0.0/superShare',
    'iscroll/2.0.0/iscroll-lite',
    ], function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            require('lazyload/1.9.1/lazyload');
            var vars = seajs.data.vars;
            var datatimeout = $('#datatimeout');
            var isScroll = require('iscroll/2.0.0/iscroll-lite');

            pageInit();

        /**
         * [pageInit description] 页面初始化
         * @return {[type]} [description]
         */
         function pageInit() {
            // 图片懒加载
            $('.lazyload').lazyload();
            //ajax加载主营商品
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetDealerInfo&cid=' + vars.cid, function (data) {
                if ($.trim(data)) {
                    $('#goodsSec').show().html(data);
                    $('.lazyload').lazyload();
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
                }
            });
            //ajax加载商家活动
            $.get(vars.jiajuSite + '?c=jiaju&a=ajaxGetActivityList&cid=' + vars.cid + '&aid=' + vars.aid, function (data) {
                if ($.trim(data)) {
                    $('#activitySec').show().html(data);
                    $('.lazyload').lazyload();
                }
            });
            // 绑定页面dom元素事件
            eventInit();             
        }

        /**
         * [eventInit description] 事件初始化
         * @return {[type]} [description]
         */
         function eventInit() {
            //没有请求到数据，点击重新加载
            datatimeout.on('click', function () {
                window.location.reload();
            });
            //报名失败
            $('#bmErr').on('click',function(){
                window.history.go(-1);
            })
        }

        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: vars.shareTitle,
            descContent: vars.shareDesc,
            lineLink: location.protocol + vars.activityUrl,
            imgUrl: vars.shareImage,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: vars.shareTitle,
            // 分享时的图标
            image: vars.shareImage,
            // 分享内容的详细描述
            desc: vars.shareDesc,
            // 分享的链接地址
            url: location.protocol + vars.activityUrl,
            // 分享的内容来源
            from: '房天下家居' + vars.imgUrl + 'images/app_jiaju_logo.png'
        };
        var superShare = new SuperShare(config);
        // 点击分享按钮
        $('.icon-share').on('click', function () {
            superShare.share();
        });
    };
});