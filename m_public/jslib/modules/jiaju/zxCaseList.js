/**
 * Created by LXM on 15-3-16.
 * 单量更改于2015-9-9
 */
define('modules/jiaju/zxCaseList', [
    'jquery',
    'loadMore/1.0.0/loadMore',
    'lazyload/1.9.1/lazyload',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();

        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        yhxw({
            page: 'jj_mt^allb_wap',
            type: 1,
            key: $('#searchtext').text().trim(),
            style: $('#style').text().trim(),
            housetype: $('#room').text().trim(),
            area: $('#area').text().trim(),
            totalprice: $('#price').text().trim()
        });

        // 曝光量统计
        vars.bgtj && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', vars.bgtj);

        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxZxCaseList&CaseStyle=' + vars.CaseStyle + '&CaseRoom=' + vars.CaseRoom + '&Area=' + vars.Area
             + '&Price=' + vars.Price + '&cityID=' + vars.cityID + '&q=' + encodeURIComponent(vars.q)+'&isDefault='+vars.isDefault,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 10,
            // 单页加载条数，可不设置
            pageNumber: 10,
            // 加载更多按钮id
            moreBtnID: '#clickmore',
            // 加载数据过程显示提示id
            loadPromptID: '#prompt',
            // 数据加载过来的html字符串容器
            contentID: '#content',
            callback: function (data) {
                // 曝光量统计
                var bgtjMore = $('#bgtj_' + data.pageMarloadFlag).val();
                bgtjMore && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', bgtjMore);
            }
        });
                               

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });

        // 分享功能
        var shareTitle = '优质装修案例';
        var shareDesc = '在房天下有很多优质的装修设计案例，快来学习吧！';
        var shareImg = location.protocol + $('#content').find('img').eq(0).attr('data-original');
        var shareLink;
        if (location.href.indexOf('?') === -1) {
            shareLink = location.href + '?source=fx_zxal';
        } else {
            shareLink = location.href.indexOf('source=fx_zxal') === -1 ? location.href + '&source=fx_zxal' : location.href;
        }
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: shareTitle,
            descContent: shareDesc,
            lineLink: shareLink,
            imgUrl: shareImg,
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: shareTitle,
            // 分享时的图标
            image: shareImg,
            // 分享内容的详细描述
            desc: shareDesc,
            // 分享的链接地址
            url: shareLink,
            // 分享的内容来源
            from: '房天下家居' + vars.imgUrl + 'images/app_jiaju_logo.png'
        };
        new SuperShare(config);
    };
});