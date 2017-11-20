/**
 * 春节篇业主委托活动
 * Created by chenhongyan on 16/2/2.
 */
define('modules/esfhd/entrustAct', ['jquery', 'lazyload/1.9.1/lazyload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    //vars.type == 'dym' || vars.type == 'ymdr' || vars.type == "edy"
    require.async("lazyload/1.9.1/lazyload", function () {
        $("img[data-original]").lazyload();
    });
    if (vars.type == '') {
        $('.message').each(function(){
            var that = $(this);
            that.click(function(){
                window.location = vars.esfSite + '?c=esfhd&a=entrustAct&type=' + that.attr('data-type');
            });
        });
    }
    if (vars.type != '') {
        var _timer;
        var msgID;
        //发消息效果
        $(".main").fadeIn(500,function(){
            msgID=1;
            _timer = setInterval(function(){
                if(msgID<=5){
                    if ($('#msg'+msgID).length > 0) {
                        $('#sound').attr('src', vars.public.replace('public','esf') + 'hd_images/bg1.mp3');
                        $('#msg'+msgID).fadeIn();
                    }
                }else{
                    clearInterval(_timer);
                }
                msgID++;
            },2000)
        });
    }

    var url = vars.public.replace('public','jiaju') + 'other_js/jweixin-1.0.0.js';
        var shareurl = vars.esfSite + '?c=esfhd&a=entrustAct';
        var imgUrl = vars.public.replace('public','esf') + 'hd_images/share.png'
        /* 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口*/
        require.async(url,function (wx) {
            wx.config({
                // 必填，公众号的唯一标识
                appId: vars.appId,
                // 必填，生成签名的时间戳
                timestamp: vars.timestamp,
                // 必填，生成签名的随机串
                nonceStr: vars.nonceStr,
                // 必填，签名，见附录1
                signature: vars.signature,
                // 必填，需要使用的JS接口列表，所有JS接口列表见附录2*/
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
            });

            wx.ready(function () {
                wx.onMenuShareTimeline({
                    title: '结婚前，你们竟然跟我说这个！！', //分享标题
                    link: vars.esfSite + '?c=esfhd&a=entrustAct', //分享链接
                    desc: 'm.fang.com',
                    imgUrl: imgUrl
                });
                wx.onMenuShareAppMessage({
                    title: '结婚前，你们竟然跟我说这个！！',
                    desc: 'm.fang.com',
                    link: vars.esfSite + '?c=esfhd&a=entrustAct',
                    imgUrl: imgUrl
                });
            });
        });
});