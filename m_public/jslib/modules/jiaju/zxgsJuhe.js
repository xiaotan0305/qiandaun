/**
 * @file wap装饰公司聚合列表
 */
define('modules/jiaju/zxgsJuhe', [
    'jquery',
    'loadMore/1.0.1/loadMore',
    'lazyload/1.9.1/lazyload',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        /** 下拉加载更多*/
        var loadMore = require('loadMore/1.0.1/loadMore');
        var companyids = JSON.parse(vars.companyids);
        console.log(companyids);
        if (companyids.length >= 2) {
            var ii = [];
            function loadmoreData() {
                loadMore.add({
                    // 接口地址
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxZxgsJuhe&city=' + vars.city + '&id=' + vars.ztId,
                    transfer: {companyids: companyids[1].join(',')},
                    // 数据总条数
                    total: vars.total,
                    // 首屏显示数据条数
                    pagesize: 10,
                    // 单页加载条数，可不设置
                    perPageNum: 10,
                    loadPrompt: '#clickmore',
                    moreBtn: '#prompt',
                    // 数据加载过来的html字符串容器
                    content: '#content',
                    loadingTxt: '努力加载中...',
                    loadedTxt: '点击加载更多...',
                    callback: function (data) {
                        if (data.pageMarloadFlag >= 2) {
                            ii = companyids[data.pageMarloadFlag];
                            if (ii instanceof Array) {
                                data.transfer.companyids = ii.join(',');
                            }
                        }
                    }
                });
                loadMore.init();
            }
            loadmoreData();
        }


        /** 分享*/
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: vars.shareTitle,
            descContent: vars.shareDesc,
            lineLink: location.href,
            imgUrl: location.protocol + vars.shareImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var sShare = new SuperShare({
            // 分享的内容title
            title: vars.shareTitle,
            // 分享时的图标
            image: location.protocol + vars.shareImg,
            // 分享内容的详细描述
            desc: vars.shareDesc,
            // 分享的链接地址
            url: location.href,
            // 分享的内容来源
            from: '房天下家居' + vars.imgUrl + 'images/app_jiaju_logo.png'
        });
        // 点击分享按钮
        $('.icon-share').on('click', function () {
            sShare.share();
        });
    };
});