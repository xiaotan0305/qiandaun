define('modules/esfhd/jjfZt', ['jquery', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare'],
    function (require, exports, module) {

        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            //控制音乐播放
            //点击跳转到公寓列表页
            $(".p5-btn").on("touchstart", function() {
                $(".wrap").unbind();
                window.location = vars.esfSite + vars.encity + '/?a=jjfList&fromsource=indexlist';
                return false;
            });
            var isFirst = true;
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
            document.addEventListener('touchstart', function (event) {
                if(isFirst){
                    isFirst = false;
                    function audioAutoPlay() {
                        var audio = document.getElementById('audio');
                        audio.play();
                    }
                    audioAutoPlay();
                }

            });
            //上下滑动翻页
            var startY;
            $(".wrap").on("touchstart", function(e) {
                touchStart(e);
            });
            $(".wrap").on("touchend", function(e) {
                var event = event || window.event;
                var target = event.target || event.srcElement;
                if(target.className.indexOf('icon_m') !== -1){
                    e.stopPropagation();
                    if (!$(".icon_m").hasClass('play')) {
                        $('#audio')[0].pause();
                        $(".icon_m").addClass('play');
                        $(".icon_m").removeClass('ring');
                    } else {
                        $('#audio')[0].play();
                        $(".icon_m").removeClass('play');
                        $(".icon_m").addClass('ring');
                    }
                    return false;
                }
                touchEnd(e, $(this));
            });
            function touchStart(e) {
                // 判断默认行为是否可以被禁用
                if (e.cancelable) {
                    // 判断默认行为是否已经被禁用
                    if (!e.defaultPrevented) {
                        e.preventDefault();
                    }
                }
                startY = e.originalEvent.changedTouches[0].pageY;
            }
            function touchEnd(e, that) {
                var moveEndY = e.originalEvent.changedTouches[0].pageY,
                    Y = moveEndY - startY;
                if ( Y > 0) {
                    if (that.attr('id') !== 'page1') {
                        that.hide();
                        that.prev().show();
                    }
                } else if ( Y < 0) {
                    if (that.attr('id') !== 'page5') {
                        that.hide();
                        that.next().show();
                    }
                }
            }
            //微信分享显示自定义标题+描述+图
            var Weixin = require('weixin/2.0.0/weixinshare');
            new Weixin({
                debug: false,
                shareTitle: vars.shareTitle,
                // 副标题
                descContent: vars.shareDescription,
                lineLink: location.href,
                imgUrl: vars.shareImage,
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