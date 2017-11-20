/**
 * 付费问答专家主页
 * by chenhongyan
 * 2017.07.12
 */
define('modules/ask/payexpertlist', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'weixin/2.0.1/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 从页面获取的参数
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');

        /*专家头像惰性加载*/
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({
            placeholder: vars.imgUrl + 'images/head.png'
        });

        /*分页效果实现*/
        var url = vars.askSite + "?c=ask&a=ajaxPayExpertList";
        var totalNum = parseInt(vars.totalCount);
        loadMore({
            url: url,
            total:totalNum,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#display_more',
            loadPromptID: '#display_more',
            contentID: '#content',
            loadAgoTxt: '<a href="javascript:void(0);">加载更多</a>',
            loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
            loadedTxt: '',
            firstDragFlag: false,
        });
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: '问答专家-房天下问答',
            descContent: '房天下问答，专业的房产问答平台',
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.public + '201511/images/app_fang.png',
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
    };
});