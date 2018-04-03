/**
 * Created by hanxiao on 2018/1/25.
 */
define('modules/ask/jiajuAskList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.2/loadMore', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 从页面获取的参数
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.2/loadMore');

        /*最新提问列表的分页效果实现*/
        var url = vars.askSite + '?c=ask&a=ajaxGetJiajuAskList&type=' + vars.type;
        loadMore({
            url: url,
            total: parseInt($("#display_more").attr('data-total')),
            pagesize: 10,
            pageNumber: 10,
            moreBtnID: '#display_more',
            loadPromptID: '#display_more',
            contentID: '#content',
            loadAgoTxt: '<a href="javascript:void(0);">查看更多问题</a>',
            loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
            loadedTxt: '',
            firstDragFlag: false,
        });

        // 微信分享
        var ua = navigator.userAgent.toLowerCase();
        var weixin;
        if (ua.indexOf('micromessenger') > -1) {
            require.async('weixin/2.0.0/weixinshare', function (Weixin) {
                weixin = new Weixin({
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: vars.appId,
                    // 必填，生成签名的时间戳
                    timestamp: vars.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: vars.nonceStr,
                    // 必填，签名，见附录1
                    signature: vars.signature,
                    shareTitle: '房天下装修问答',
                    descContent: vars.askCount + '个装修问题，'+ vars.peopleCount + '条专业回答',
                    lineLink: location.href,
                    imgUrl: 'https:' + vars.imgUrl
                });
            });
        }
    };
});