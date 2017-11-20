/**
 * Created by libaowei on 15-3-16.
 * modified by LXM on 15-9-15.
 */
define('modules/jiaju/lginfo', ['jquery', 'photoswipe/4.0.8/photoswipe-ui-default.min', 'photoswipe/4.0.8/photoswipe', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var superShare = require('superShare/1.0.1/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');
        $('header').addClass('head_2');
        $('.icon-nav').addClass('icon-nav2');
        // 顶部导航切换样式切换
        (function () {
            var $header = $('.header');
            $header.hasClass('head_2') && $header.on('click', '.icon-nav', function () {
                $header.toggleClass('head_2');
            });
        })();

        scaleImgFn();

        // 搜索用户行为收集20160114
        var page = 'mjjatlaspage';

        function doYhxw(yhxwId) {
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = vars.ns;
            var b = yhxwId;
            var pTemp = {
                'vmg.page': page,
                'vmh.atlasid': vars.sid
            };
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b, p);
        }

        function yhxw(yhxwId) {
            if (_ub) {
                doYhxw(yhxwId);
            } else {
                require.async('jsub/_ubm.js', function () {
                    doYhxw(yhxwId);
                });
            }
        }

        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            yhxw(0);
        });

        /* 收藏部分 begin*/
        $('li.star').on('click', (function () {
            var lock = true;
            return function () {
                lock && starClick();
            };

            function starClick() {
                lock = false;
                yhxw(21);
                if (parseInt(vars.userid)) {
                    var i;
                    if (parseInt(vars.issc)) {
                        i = {
                            objid: vars.sid,
                            iscanncel: 1,
                            type: 0
                        };
                    } else {
                        i = {
                            objid: vars.sid,
                            iscanncel: 0,
                            type: 0
                        };
                    }
                    var ajaxUrl = vars.jiajuSite + '?c=jiaju&a=ajaxlgds&city=' + vars.city + '&r=' + Math.random();
                    $.get(ajaxUrl, i, function (q) {
                        if (parseInt(q.IsSuccess)) {
                            if (parseInt(vars.issc)) {
                                $('li.star').removeClass('active');
                                vars.issc = 0;
                                $($('.favorite')[1]).show();
                                setTimeout(function () {
                                    $($('.favorite')[1]).hide();
                                }, 2000);
                            } else {
                                $('li.star').addClass('active');
                                vars.issc = 1;
                                $($('.favorite')[0]).show();
                                setTimeout(function () {
                                    $($('.favorite')[0]).hide();
                                }, 2000);
                            }
                        } else {
                            alert(q.Message);
                        }
                    }).complete(function () {
                        lock = true;
                    });
                } else {
                    lock = true;
                    window.location = window.location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                }
            }
        })());

        // 专辑点赞;$('.up a');$('.opt a')
        $('.up').on('click', (function () {
            var lock = true;
            return function () {
                lock && upClick();
            };

            function upClick() {
                lock = false;
                yhxw(55);
                if (parseInt(vars.userid)) {
                    var i = {
                        objid: vars.sid,
                        type: 1,
                        iscanncel: 1
                    };
                    var ajaxUrl = vars.jiajuSite + '?c=jiaju&a=ajaxlgds&city=' + vars.city + '&r=' + Math.random();
                    $.get(ajaxUrl, i, function (q) {
                        var upEm = $('.up em');
                        if (parseInt(q.result)) {
                            if (parseInt(vars.isprise)) {
                                $('.up').removeClass('play');
                                $('.up').removeClass('active');
                                vars.isprise = 0;
                                upEm.text(parseInt(upEm.text()) - 1);
                            } else {
                                $('.up').addClass('active');
                                $('.up').addClass('play');
                                vars.isprise = 1;
                                upEm.text(parseInt(upEm.text()) + 1);
                            }
                        } else {
                            alert(q.message);
                        }
                    }).complete(function () {
                        lock = true;
                    });
                } else {
                    lock = true;
                    window.location = window.location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
                }
            }
        })());


        // 适配图片的宽高 以宽度适应皮屏幕宽度为准得到比例 算高度
        function opImgWH(conW, conH, videoW, videoH) {
            var w = 0,
                h = 0,
                ratio = 1;
            if (videoW > videoH) {
                // w>h 宽视屏
                if (videoW >= conW) {
                    // 比容器还宽 最大的宽就是容器的宽
                    w = conW;
                    ratio = videoW / conW;
                    h = videoH / ratio;
                } else {
                    // 比容器还窄的视屏
                    w = videoW;
                    h = parseInt(videoW * conH / conW);
                }
            } else if (videoH >= conH) {
                // w<h窄视屏
                h = conH;
                ratio = videoH / conH;
                w = videoW / ratio;
            } else {
                // 比容器矮的视屏
                h = videoH;
                w = parseInt(videoH * conW / conH);
            }
            return {
                w: w,
                h: h
            };
        }
        // 分享
        var shareFn = (function () {
            var share;
            var shareWx;
            // 微信分享成功弹层
            var $shareSuc = $('.shareSuc');
            // 微信分享成功弹层关闭按钮点击事件
            $shareSuc.find('.close').on('click', function () {
                $shareSuc.hide();
            });
            return function (config, wxConfig) {
                // 是否初始化,如果初始化，更新配置项，未初始化，初始化
                if (share) {
                    share.updateConfig(config);
                    shareWx.updateOps(wxConfig);
                } else {
                    share = new superShare(config);
                    shareWx = new wxShare(wxConfig, function () {
                        // 微信成功回调
                        $shareSuc.show();
                    });
                    // 此处分享按钮不在main里，分享插件不支持，故重新绑定事件
                    $('.icon-share').on('click', function () {
                        var ua = share.ua;
                        // 判断浏览器类型;
                        if (ua.name === '微信客户端' || ua.name === '微博客户端' || ua.name === 'QQ客户端' || ua.name === 'QQZone客户端') {
                            share.weixinFloat.show();
                        } else if (ua.name === 'UC浏览器') {
                            share.shareByUC();
                        } else if (ua.name === 'QQ浏览器') {
                            share.shareByQQ();
                        } else {
                            share.floatMask.addClass('mask-visible');
                            share.shareFloat.show();
                        }
                    });
                }
            };
        })();

        // 加载展示相册代码
        function ScaleFn(obj) {
            var pswpElement = document.querySelectorAll('.pswp')[0];
            var ratioX = document.documentElement.clientWidth || document.body.clientWidth;
            var ratioY = document.documentElement.clientHeight || document.body.clientHeight;
            var slides = [];
            var index = 0;
            var w = 0,
                h = 0;
            var resultWH = null;
            var len = obj.length;
            var $lgtxt = $('#lg-txt');
            var $totleIndex = $('#totleIndex');
            var image = null;
            var options = {
                index: parseInt(vars.index),
                closeEl: false,
                captionEl: false,
                fullscreenEl: false,
                zoomEl: false,
                shareEl: false,
                counterEl: false,
                arrowEl: false,
                showHideOpacity: true,
                loop: false,
                closeOnScroll: false,
                closeOnVerticalDrag: false,
                pinchToClose: false,
                specialHistoryUrl: true,
                history: false
            };
            var imageLoad = (function (length) {
                var len = length;
                return function () {
                    if (!--len) {
                        var gallery = new window.PhotoSwipe(pswpElement, window.PhotoSwipeUI_Default, slides, options);
                        gallery.listen('beforeChange', function () {
                            // 图片切换时，更新展示信息和分享信息
                            var currentImg = gallery.currItem;
                            var index = currentImg.index;
                            var desc = obj.eq(index).attr('data-des');
                            shareFn({
                                url: location.protocol + vars.jiajuSite + vars.city + '/lginfo_' + vars.sid + '.html',
                                title: vars.wxTheme,
                                desc: desc,
                                image: location.protocol + currentImg.src
                            }, {
                                lineLink: location.protocol + vars.jiajuSite + vars.city + '/lginfo_' + vars.sid + '.html',
                                shareTitle: vars.wxTheme,
                                descContent: desc,
                                imgUrl: location.protocol + currentImg.src
                            });
                            $totleIndex.find('i').text(index + 1);
                            $lgtxt.text(desc);
                        });
                        gallery.init();
                    }
                };
            })(len);
            var loadFn = function (i) {
                return function () {
                    var that = this;
                    w = that.naturalWidth || 320;
                    h = that.naturalHeight || 400;
                    // conW, conH, videoW, videoH
                    resultWH = opImgWH(ratioX, ratioY, w, h);
                    slides[i] = {
                        src: $(that).attr('src'),
                        w: resultWH.w,
                        h: resultWH.h,
                        index: i
                    };
                    imageLoad();
                };
            };
            for (var i = 0; i < len; i++) {
                var $img = obj.eq(i);
                image = new Image();
                image.src = $img.attr('src');
                $(image).on('load', loadFn(i)).on('error', loadFn(i));
            }
        }
        // 适配图片显示
        function scaleImgFn() {
            var imgStrs = $('#divHeight img');
            ScaleFn(imgStrs);
        }
    };
});