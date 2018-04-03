
define('modules/jiaju/sjsList',[
    'jquery',
    'loadMore/1.0.0/loadMore',
    'lazyload/1.9.1/lazyload',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw'
],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        require.async(['modules/jiaju/ad']);
        $('.lazyload').lazyload();
        var loadMore = require('loadMore/1.0.0/loadMore');
        $('#datatimeout').on('click', function () {
            window.location.reload();
        });
        // 用户行为统计
        var yhxw = require('modules/jiaju/yhxw');
        if (vars.companyid) {
            yhxw({
                page: 'jj_sjs^lb_wap',
                type: 1,
                companyid: vars.companyid
            });
        } else {
            yhxw({
                page: 'jj_sjs^lb_wap',
                type: 1,
                key: $('#searchtext').text().trim(),
                style: $('#style').text().trim(),
                charge: $('#price').text().trim(),
                decorationage: $('#year').text().trim(),
                order: $('#order').text().trim()
            });
        }
        // 曝光量统计
        vars.bgtj && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', vars.bgtj);
        loadMoreFn();
        function loadMoreFn() {
            loadMore({
                // 接口地址
                // 需要传入经纬度以及定位城市中文
                url: location.protocol + vars.jiajuSite + '?c=jiaju&a=ajaxGetSjsList&city=' + vars.city + '&style=' + vars.style
                 + '&price=' + vars.price + '&year=' + vars.year + '&order=' + vars.order + '&companyid=' + vars.companyid,
                // 数据总条数
                total: vars.total,
                // 首屏显示数据条数
                pagesize: 20,
                // 单页加载条数，可不设置
                pageNumber: 20,
                // 加载更多按钮id
                moreBtnID: '#clickmore',
                // 加载数据过程显示提示id
                loadPromptID: '#prompt',
                // 数据加载过来的html字符串容器
                contentID: '#content',
                loadingTxt: '努力加载中...',
                loadAgoTxt: '点击加载更多...',
                callback: function (data) {
                    // 曝光量统计
                    var bgtjMore = $('#bgtj_' + data.pageMarloadFlag).val();
                    bgtjMore && $.post(location.protocol + '//esfbg.3g.fang.com/homebg.html', bgtjMore);
                }
            });
        }
        // 分享功能
        var shareTitle = vars.cityname + '优质设计师';
        var shareDesc = '在房天下有很多优质的设计师提供设计服务，推荐给大家';
        var shareImg = location.protocol + $('#content').find('.img img').eq(0).attr('data-original');
        var shareLink;
        if (location.href.indexOf('?') === -1) {
            shareLink = location.href + '?source=fx_sjs';
        } else {
            shareLink = location.href.indexOf('source=fx_sjs') === -1 ? location.href + '&source=fx_sjs' : location.href;
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

