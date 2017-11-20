/**
 * 微信分享插件
 * by 谭坤鹏 2016-03-24
 * @param {Object} w window
 * @param {Object} f function
 */

(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('weixin/weixinshare', ['weixin/jweixin-1.0.0'], function () {
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
                'onMenuShareWeibo'
            ],
            shareTitle: '搜房网活动~',
            descContent: '搜房网活动,邀您一起来玩啊~',
            lineLink: location.protocol + '//m.fang.com/',
            imgUrl: location.protocol + '//js.soufunimg.com/common_m/m_public/201511/images/logo.png'
        };

        if (!ops.appId || !ops.timestamp || !ops.nonceStr || !ops.signature) {
            alert('微信分享的四个参数缺一不可,请传入!');
            return;
        }

        for (var i in ops) {
            if (ops.hasOwnProperty(i)) {
                this.options[i] = ops[i];
            }
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
                alert('请先引入微信sdkjs或者引入seajs');
                return;
            }
            // 微信配置
            wx.config({
                debug: that.options.debug,
                appId: that.options.appId,
                timestamp: that.options.timestamp,
                nonceStr: that.options.nonceStr,
                signature: that.options.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo'
                ]
            });

            wx.ready(function () {
                // 运行微信的API
                that.runWxAPI();
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
                cancel: function () {
                    // alert('已取消');
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
                trigger: function () {
                    // alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    // alert('已分享');
                    // 执行回调函数
                    that.succfn && that.succfn(res) ;
                },
                cancel: function () {
                    // alert('已取消');
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
                cancel: function () {
                    // alert('已取消');
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
                cancel: function () {
                    // alert('已取消');
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