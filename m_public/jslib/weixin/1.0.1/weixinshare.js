/**
 * 微信分享插件
 * by 谭坤鹏 2016-08-09
 * 更新: 去除分享调用config appId等四个参数传入
 * @param {Object} w window
 * @param {Object} f function
 */

(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('weixin/1.0.1/weixinshare', ['weixin/jweixin-1.0.0'], function (require) {
            var wx = require('weixin/jweixin-1.0.0');
            return f(wx);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        var wx = window.wx;
        w.Weixin = f(wx);
    }
})(window, function (wx) {
    'use strict';

    function Weixin(ops,succfn,errfn) {
        this.options = {
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            // ajax 方式
            type: 'GET',
            // 必填，公众号的唯一标识
            appId: '',
            // 必填，生成签名的时间戳
            timestamp: '',
            // 必填，生成签名的随机串
            nonceStr: '',
            // 必填，签名，见附录1
            signature: '',
            // 需要使用的网页服务接口
            jsApiList: [
                // 判断当前客户端版本是否支持指定JS接口
                'checkJsApi',
                // 分享给好友
                'onMenuShareTimeline',
                // 分享到朋友圈
                'onMenuShareAppMessage',
                // 分享到QQ
                'onMenuShareQQ',
                // 分享到微博
                'onMenuShareWeibo',
                // 分享到QQ空间
                'onMenuShareQZone'
            ],
            shareTitle: '搜房网活动~',
            descContent: '搜房网活动,邀您一起来玩啊~',
            lineLink: location.protocol + '//m.fang.com/',
            imgUrl: location.protocol + '//js.soufunimg.com/common_m/m_public/201511/images/logo.png'
        };

        // if (!ops.appId || !ops.timestamp || !ops.nonceStr || !ops.signature ) {
        //     console.error('微信分享的四个参数缺一不可,请传入!');
        //     return;
        // }

        var UA = navigator.userAgent.toLowerCase();
        if (UA.indexOf('micromessenger') == -1 ) {
            if (location.href.indexOf('test.') !== -1) {
                console.warn('非微信浏览器中不允许调用该插件!');
            }
            return;
        }

        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
        }

        if (this.options.type === 'jsonp') {
            this.jsonp = true;
        }
        this.succfn = succfn;
        this.errfn = errfn;
        this.init();
    }

    Weixin.prototype = {
        constructor: Weixin,
        init: function () {
            var that = this;
            if (!wx) {
                console.error('请先引入微信sdkjs或者引入seajs');
                return;
            }

            that.getConfig(function (config) {
                // 微信配置
                wx.config({
                    debug: that.options.debug,
                    appId: that.options.appId || config.appId,
                    timestamp: that.options.timestamp || config.timestamp,
                    nonceStr: that.options.nonceStr || config.nonceStr,
                    signature: that.options.signature || config.signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone'
                    ]
                });

                wx.ready(function () {
                    // 运行微信的API
                    that.runWxAPI();
                });
            },function (data) {
                console.error('微信接口请求失败',data);
            });
        },
        getConfig: function (succfn,errfn) {
            var reg = /test\.|local/;
            var that = this;
            var urlOrigin = reg.test(location.origin) ? location.protocol + '//m.test.fang.com' : location.protocol + '//m.fang.com';
            $.ajax({
                url: urlOrigin + '/huodongAC.d?m=wxShareInfo&class=ActivityIExpiresinTimeMc',
                type: 'GET',
                data: {
                    shareurl: location.href
                },
                dataType: that.jsonp ? 'jsonp' : 'xml',
                success: function (data) {
                    var config;
                    if (that.jsonp) {
                        config = data;
                    }else {
                        var $doc = $(data);
                        config = {
                            appId: $doc.find('appId').text(),
                            timestamp: $doc.find('timestamp').text(),
                            nonceStr: $doc.find('nonceStr').text(),
                            signature: $doc.find('signature').text()
                        };
                    }
                    console.log(config);
                    succfn && succfn(config);
                },
                error: function (data) {
                    errfn && errfn(data);
                }
            });
        },
        runWxAPI: function () {
            var that = this;

            /**
             * success：接口调用成功时执行的回调函数。
             * fail：接口调用失败时执行的回调函数。
             * complete：接口调用完成时执行的回调函数，无论成功或失败都会执行。
             * cancel：用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
             * trigger: 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
             */

            // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
            wx.checkJsApi({
                jsApiList: [
                    'getNetworkType',
                    'previewImage'
                ],
                success: function () {

                }
            });
            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage({
                title: that.options.shareTitle,
                desc: that.options.descContent,
                link: that.options.lineLink,
                imgUrl: that.options.imgUrl,
                trigger: function () {
                    // alert('用户点击发送给朋友');
                },
                success: function (res) {
                    // alert('已分享');
                    // 执行回调函数
                    that.succfn && that.succfn(res) ;
                },
                cancel: function (res) {
                    // alert('已取消');
                    that.errfn && that.errfn(res);
                },
                fail: function (res) {
                    that.errfn && that.errfn(res);
                }
            });
            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
                title: that.options.shareTitle,
                desc: that.options.descContent,
                link: that.options.lineLink,
                imgUrl: that.options.imgUrl,
                trigger: function (res) {
                    // alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    // alert('已分享');
                    // 执行回调函数
                    that.succfn && that.succfn(res) ;
                },
                cancel: function (res) {
                    // alert('已取消');
                    that.errfn && that.errfn(res);
                },
                fail: function (res) {
                    that.errfn && that.errfn(res);
                }
            });
            // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQQ({
                title: that.options.shareTitle,
                desc: that.options.descContent,
                link: that.options.lineLink,
                imgUrl: that.options.imgUrl,
                trigger: function () {
                    // alert('用户点击分享到QQ');
                },
                complete: function () {
                    // alert(JSON.stringify(res));
                },
                success: function (res) {
                    // alert('已分享');
                    that.succfn && that.succfn(res) ;
                },
                cancel: function (res) {
                    // alert('已取消');
                    that.errfn && that.errfn(res);
                },
                fail: function (res) {
                    that.errfn && that.errfn(res);
                }
            });

            // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo({
                title: that.options.shareTitle,
                desc: that.options.descContent,
                link: that.options.lineLink,
                imgUrl: that.options.imgUrl,
                trigger: function () {
                    // alert('用户点击分享到微博');
                },
                complete: function () {
                    // alert(JSON.stringify(res));
                },
                success: function (res) {
                    // alert('已分享');
                    that.succfn && that.succfn(res) ;
                },
                cancel: function (res) {
                    // alert('已取消');
                    that.errfn && that.errfn(res);
                },
                fail: function (res) {
                    that.errfn && that.errfn(res);
                }
            });
            // 2.5 监听“分享到qq空间”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQZone({
                title: that.options.shareTitle,
                desc: that.options.descContent,
                link: that.options.lineLink,
                imgUrl: that.options.imgUrl,
                success: function (res) {
                    // 用户确认分享后执行的回调函数
                    that.succfn && that.succfn(res) ;
                },
                cancel: function (res) {
                    // 用户取消分享后执行的回调函数
                    that.errfn && that.errfn(res);
                },
                fail: function (res) {
                    that.errfn && that.errfn(res);
                }
            });
        },

        /**
         * 更改微信分享参数
         * @param ops 参数 {}
         */
        updateOps: function (ops) {
            var that = this;
            for (var i in ops) {
                if (ops.hasOwnProperty(i)) {
                    that.options[i] = ops[i];
                }
            }
            that.runWxAPI();
        }
    };
    return Weixin;
});