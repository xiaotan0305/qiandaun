define('modules/xf/dianpingSuc', ['jquery', 'util/util', 'superShare/1.0.1/superShare', 'weixin/1.0.1/weixinshare'], function (require) {
    'use strict';
    var $ = require('jquery');
    var cookiefile = require('util/util');
    var sfut = cookiefile.getCookie('sfut');

    // 微信分享功能
    var wx = require('weixin/1.0.1/weixinshare');
    var reg = /搜房网/g;
    var weixin = new wx({
        shareTitle: ($('.bgproname').html() + '怎么样').replace(reg, '房天下'),
        descContent: ('综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论').replace(reg, '房天下'),
        imgUrl: $('.bgpic').html()? $('.bgpic').html().trim() : '',
        lineLink: window.location.href
    });

    // 分享功能新
    $('.com-btn span').addClass('share');
    var SuperShare = require('superShare/1.0.1/superShare');
    var config = {
        // 分享内容的title
        title: $('.bgproname').html() + '怎么样',
        // 分享时的图标
        image: $('.bgpic').html()? $('.bgpic').html().trim() : '',
        // 分享内容的详细描述
        desc: '综合评分：' +  $('.bgscore').html() + '分\n' + '共' + $('.bgcount').html() + '条评论',
        // 分享的链接地址
        url: location.href,
        // 分享的内容来源
        from: 'xf'
    };
    var superShare = new SuperShare(config);
});