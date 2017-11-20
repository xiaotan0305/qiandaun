/**
* modified by 张达亮 on 15.9.23
*/
define('modules/jiajuds/oneTo3Suc', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        $('#share').on('click', function () {
            $('#shadow').show();
        });
        $('#shadow').on('click', function () {
            $(this).hide();
        });
        // app下载
        (function (win) {
            var doc = document, $ = win.$, k = function () {
                this.listen();
            };
            k.prototype = {
                listen: function () {
                    var that = this;
                    $('#download').bind('click', function (e) {
                        var u, l,url = vars.public + 'jslib/app/1.0.1/appopen.js', callback = function (openApp) {
                            typeof win.openApp === 'function' && (openApp = win.openApp);
                            var oa = openApp({
                                url: '//m.fang.com/client.jsp?produce=ftxzx',
                                log: that.log,
                                appurl: 'data/{"address":"home"}',
                                href: 'fangtxzx://',
                                appstoreUrl: 'https://itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8'
                            });
                            oa.openApp();
                        };
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof win.seajs === 'object') {
                            win.seajs.use(url, callback);
                        } else {
                            u = doc.createElement('script');
                            l = doc.getElementsByTagName('head')[0];
                            u.async = true;
                            u.src = url;
                            u.onload = callback;
                            l.appendChild(u);
                        }
                        return false;
                    });
                },
                log: function (type) {
                    try {
                        $.get('/public/?c=public&a=ajaxOpenAppData', {
                            type: type,
                            rfurl: doc.referrer
                        });
                    } catch (e) {
                    }
                }
            };
            new k();
        })(window);
        // 微信分享
        wx.config({
            //  必填，公众号的唯一标识
            appId: vars.appId,
            // 必填，生成签名的时间戳
            timestamp: vars.timestamp,
            //  必填，生成签名的随机串
            nonceStr: vars.nonceStr,
            //  必填，签名，见附录1
            signature: vars.signature,
            //  必填，需要使用的JS接口列表，所有JS接口列表见附录2
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        var shareurl = vars.jiajuSite + '?c=jiajuds&a=oneToThree&src=clientwx';
        wx.ready(function () {
            //  获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                //  分享标题
                title: '3000元礼包大放送，房天下装修，只为您精致的家！',
                link: shareurl,
                //  分享图标
                imgUrl: vars.public + 'img/app_jiaju_logo.png'
            });
            //  获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                //  分享标题
                title: '3000元礼包大放送，房天下装修，只为您精致的家！',
                //  分享描述
                desc: '我刚刚领取了3000元装修券，你也来试试吧！',
                link: shareurl,
                // 分享图标
                imgUrl: vars.public + 'img/app_jiaju_logo.png'
            });
        });
    };
});