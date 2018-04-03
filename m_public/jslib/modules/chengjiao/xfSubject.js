/**
 * Created by lvyan on 2018/2/7.
 */
define('modules/chengjiao/xfSubject', ['lazyload/1.9.1/lazyload', 'superShare/2.0.0/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        // 二手房详情页图片增加惰性加载功能 modified by zdl
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        //显示更多
        var $dqMore = $('.arr-rt-n');
        if ($dqMore.length > 0) {
            $dqMore.on('click', function() {
                $('.dq-flist li').show();
                $dqMore.hide();
            });
        }

        /*分享*/
        var sTitle = vars.cityname + '成交楼盘榜单出炉';
        var sDesc = '及时关注榜单，成交信息早知道';
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            // 分享的内容title
            title: sTitle,
            // 分享时的图标
            image: location.protocol + vars.shareImg,
            // 分享内容的详细描述
            desc: sDesc,
            // 分享的链接地址
            url: location.href,
        };
        var superShare = new SuperShare(config);
        // 点击分享按钮
        $('.icon-share').on('click', function () {
            superShare.share();
        });

        // 微信分享
        var Weixin = require('weixin/2.0.0/weixinshare');
        new Weixin({
            debug: false,
            shareTitle: sTitle,
            // 副标题
            descContent: sDesc,
            lineLink: location.href,
            imgUrl: location.protocol + vars.shareImg,
            swapTitle: false
        });
    };
});