define('modules/jiajuds/juneSuc', ['jquery'], function (require, exports, module) {
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
            var doc = document;
            var $ = win.$;
            var k = function () {
                this.listen();
            };
            k.prototype = {
                listen: function () {
                    var that = this;
                    $('#download').bind('click', function (e) {
                        var u;
                        var l;
                        var url = '//js.soufunimg.com/common_m/m_public/jslib/app/1.0.1/appopen.js';
                        var callback = function (openApp) {
                            if (typeof win.openApp === 'function') {
                                openApp = win.openApp;
                            }
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
                        console.log(e);
                    }
                }
            };
            new k();
        })(window);
        // 微信分享
        window.wx.config({
            appId: vars.appId,
            timestamp: vars.timestamp,
            nonceStr: vars.nonceStr,
            signature: vars.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        var shareurl = vars.jiajuSite + '?c=jiajuds&a=jjhdlist&src=clientwx&shareid=' + vars.shareid;

        /* 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口*/
        window.wx.ready(function () {
            window.wx.onMenuShareTimeline({
                title: '房天下请你装修啦！我刚刚领取了500元装修券，你也来试试吧！',
                link: shareurl,
                imgUrl: '//js.soufunimg.com/common_m/m_public/img/app_jiaju_logo.png',
                success: function () {
                    // 用户确认分享后执行的回调函数
                    var okurl = vars.jiajuSite + '?c=jiajuds&a=ajaxshareCount&r=' + Math.random();
                    $.ajax(okurl);
                }
            });

            /* 获取“分享给朋友”按钮点击状态及自定义分享内容接口*/
            window.wx.onMenuShareAppMessage({
                title: '房天下请你装修啦！',
                desc: '我刚刚领取了500元装修券，你也来试试吧！',
                link: shareurl,
                imgUrl: '//js.soufunimg.com/common_m/m_public/img/app_jiaju_logo.png',
                success: function () {
                    // 用户确认分享后执行的回调函数
                    var okurl = vars.jiajuSite + '?c=jiajuds&a=ajaxshareCount&r=' + Math.random();
                    $.ajax(okurl);
                }
            });
        });
    };
});