/**
 * @author lipengkun@fang.com  APP小区点评抽奖活动相关功能
 */
define('modules/esfhd/xqcomlot', ['jquery', 'superShare/2.0.0/superShare', 'weixin/2.0.0/weixinshare', 'swipe/3.10/swiper'],  function (require,exports,module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var shareA = $('.share');
    var Swiper = require('swipe/3.10/swiper');
    // 微信分享，调用微信分享的插件
    var Weixin = require('weixin/2.0.0/weixinshare');
    var wx = new Weixin({
        debug: false,
        shareTitle: shareA.attr('newsline'),
        // 副标题
        descContent: '',
        lineLink: shareA.attr('jumpath'),
        imgUrl: shareA.attr('imgpath'),
        swapTitle: false
    });
    // 普通分享
    var SuperShare = require('superShare/2.0.0/superShare');
    var config = {
        // 分享的内容title
        title: shareA.attr('newsline'),
        // 副标题
        desc: '',
        // 分享时的图标
        image: shareA.attr('imgpath'),
        // 分享的链接地址
        url: shareA.attr('jumpath'),
        // 分享的内容来源
        from: ' —房天下'
    };
    var superShare = new SuperShare(config);
    // 更新配置函数
    shareA.on('click', function () {
        superShare.share();
    });

    //****滚动条****
    var mySwiper = new Swiper('#scrollobj', {
        autoplay: 2000,//可选选项，自动滑动
        loop:true,
        autoplayDisableOnInteraction : false,
        observer:true,
        observeParents:true,
    });

    //活动展开
    $('.bg_huodong span').click(function(){
        $(this).toggleClass('on');
        $('.ruler_huodong').toggle();
    })
    //排名展开/合上
    $('.pull_down').click(function(){
        $(this).toggleClass('pull_down_on');
        $('.hidestyle').toggle();
    });

});