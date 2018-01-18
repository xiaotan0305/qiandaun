define('modules/zfhd/lastDataReport', ['jquery', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare', 'rotate/rotate'],
    function (require, exports, module) {

        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            //点击跳转到公寓列表页
            $(".btn01").on("touchstart", function() {
                $(".wrap").unbind();
                window.location = vars.zfSite + vars.encity + '/';
                return false;
            })
            //--创建页面监听，等待微信端页面加载完毕 触发音频播放
            document.addEventListener('DOMContentLoaded', function () {
                function audioAutoPlay() {
                    var audio = document.getElementById('audio');
                    audio.play();
                    document.addEventListener("WeixinJSBridgeReady", function () {
                        audio.play();
                    }, false);
                }
                audioAutoPlay();
            });
            //--创建触摸监听，当浏览器打开页面时，触摸屏幕触发事件，进行音频播放
            document.addEventListener('touchstart', function () {
                function audioAutoPlay() {
                    var audio = document.getElementById('audio');
                    audio.play();
                }
                audioAutoPlay();
            });
            //上下滑动翻页
            var startY;
            $(".wrap").on("touchstart", function(e) {
                // 判断默认行为是否可以被禁用
                if (e.cancelable) {
                    // 判断默认行为是否已经被禁用
                    if (!e.defaultPrevented) {
                        e.preventDefault();
                    }
                }
                startY = e.originalEvent.changedTouches[0].pageY;
            });
            $(".wrap").on("touchend", function(e) {
                var moveEndY = e.originalEvent.changedTouches[0].pageY,
                     Y = moveEndY - startY,
                     that = $(this);
                if ( Y > 30) {
                    if (that.attr('id') === 'page11') {
                        that.hide();
                        that.prev().show();
                    } else if (that.attr('id') !== 'page1') {
                        that.hide();
                        that.prev().show();
                    }
                } else if ( Y < 30 ) {
                    if (that.attr('id') === 'page9') {
                        that.hide();
                        that.next().show();
                    } else if (that.attr('id') !== 'page11') {
                        that.hide();
                        that.next().show();
                    }
                }
            });
            //微信分享显示自定义标题+描述+图
            var Weixin = require('weixin/2.0.0/weixinshare');
            new Weixin({
                debug: false,
                shareTitle: vars.shareTitle,
                // 副标题
                descContent: vars.shareDescription,
                lineLink: location.href,
                imgUrl: window.location.protocol + vars.shareImage,
                swapTitle: false,
            });
            // 分享功能(新)
            var SuperShare = require('superShare/1.0.1/superShare');
            var config = {
                // 分享内容的title
                title: vars.shareTitle,
                // 分享时的图标
                image: vars.shareImage,
                // 分享内容的详细描述
                desc: vars.shareDescription,
                // 分享的链接地址
                url: location.href,
            };
            var superShare = new SuperShare(config);
        };
    });