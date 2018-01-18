define('modules/jiaju/qjInfo',[
    'jquery',
    'superShare/2.0.0/superShare',
    'weixin/2.0.1/weixinshare',
    'modules/jiaju/yhxw'
],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        var Weixin = require('weixin/2.0.1/weixinshare');
        /** 用户行为*/
        var yhxw = require('modules/jiaju/yhxw');
        var page = 'jj_mt^qjtxq_wap';
        yhxw({
            page: page,
            id: vars.id
        });
        
        /**
         * 分享
         */
        var shareTitle = vars.style + '风格3D全景图';
        var shareDesc = '我在房天下发现了这套' + vars.style + '风格的' + vars.house + '3D全景图，一起来欣赏吧';
        var shareLink = location.href;
        var shareImg = vars.imageUrl;
        new Weixin({
            debug: false,
            shareTitle: shareTitle,
            descContent: shareDesc,
            lineLink: shareLink,
            imgUrl: shareImg,
            swapTitle: false
        });
        var SuperShare = require('superShare/2.0.0/superShare');
        var config = {
            title: shareTitle,
            image: shareImg,
            desc: shareDesc,
            url: shareLink,
            from: '房天下家居'
        };
        var superShare = new SuperShare(config);
        // 点击分享按钮
        $('.icon-share').on('click', function () {
            // 分享用户行为
            yhxw({
                page: page,
                id: vars.id,
                type: 22
            });
            superShare.share();
        });
    };
});

