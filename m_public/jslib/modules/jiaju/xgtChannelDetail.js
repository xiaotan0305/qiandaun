/**
 * @file 效果图明细:下载、悬浮
 * @author 徐颖(bjxuying@soufun.com)
 * @modified by 袁辉辉(yuanhuihui@soufun.com)
 */
 define('modules/jiaju/xgtChannelDetail', [
     'jquery',
     'photoswipe/4.0.8/photoswipe',
     'photoswipe/4.0.8/photoswipe-ui-default',
     'superShare/1.0.1/superShare',
     'weixin/2.0.0/weixinshare',
     'modules/jiaju/yhxw'
 ], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var superShare = require('superShare/1.0.1/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');
        var hasLoadPicIds = [];
        // 收藏按钮
        var $iconFav = $('.icon-fav');
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        // 用户行为
        var yhxw = require('modules/jiaju/yhxw');
        var pageId = 'jj_mt^xgtcxq_wap';

        // 适配图片的宽高 以宽度适应皮屏幕宽度为准得到比例 算高度
        function opImgWH(videoW, videoH) {
            var conW = document.documentElement.clientWidth || document.body.clientWidth;
            var conH = document.documentElement.clientHeight || document.body.clientHeight;
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

        var currentImg = null;
        var comData = null;
        var countNumber = 78;
        // 初始化数据
        var items = [],
        pic = $('.zxPicture').find('a'),
        total = pic.length,
        lightBox,
        pageFlag = true;
        pic.each(function () {
            hasLoadPicIds.push($(this).data('picid'));
            var image = new Image(),
            $this = $(this);
            var $href = $this.attr('href'),
            $comment = $(this).data('comment'),
            imgThis = $this.find('img'),
            picid = $(this).data('picid'),
            isCollect = $(this).data('iscollect');
            image.src = imgThis.attr('src');
            image.onload = function () {
                total--;
                var result = opImgWH(this.width, this.height);
                var item = {
                    src: $href,
                    w: result.w || 600,
                    h: result.h || 400,
                    comment: $comment,
                    picid: picid,
                    isCollect: isCollect
                };
                items.push(item);
                if (!total) {
                    var $pswp = $('.pswp')[0];
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
                        history: false,
                        terminalCallback: function (to) {
                            // location.href = vars.jiajuSite + vars.city + '/xgt.html';
                        }
                    };
                    //  Initialize PhotoSwipe
                    lightBox = new window.PhotoSwipe($pswp, window.PhotoSwipeUI_Default, items, options);
                    // 判断方向
                    lightBox.listen('beforeChange', function (to) {
                        // 图片切换更新分享信息和展示信息
                        // currentImg = lightBox.currItem;
                        comData = lightBox.currItem;
                        $iconFav[+comData.isCollect ? 'addClass' : 'removeClass']('cur');
                        shareFn({
                            url: location.protocol + vars.jiajuSite + 'xgt_c' + comData.picid + '.html?channelId=' + vars.channelId,
                            title: comData.pictitle,
                            desc: comData.pictitle,
                            image: comData.src
                        }, {
                            lineLink: location.protocol + vars.jiajuSite + 'xgt_c' + comData.picid + '.html?channelId=' + vars.channelId,
                            shareTitle: comData.pictitle,
                            descContent: comData.pictitle,
                            imgUrl: comData.src
                        }, comData.picid);
                        showPicTitle(lightBox.currItem.comment);
                    });           
                    lightBox.init();
                }
            };
        });

        function showPicTitle(objData) {
            var picTitle = $('#picTitle p');
            picTitle.html(objData);
        }

        /* app download*/
        (function (win) {
            var doc = document,
            $ = win.$,
            k = function () {
                this.listen();
            };
            k.prototype = {
                listen: function () {
                    var that = this;
                    $('#download').bind('click', function (e) {
                        var u;
                        var l;
                        var url = vars.public + 'jslib/app/1.0.2/appopen.js';
                        var callback = function (openApp) {
                            if (typeof win.openApp === 'function') {
                                (openApp = win.openApp);
                            }
                            var apphref = /iPad|iPhone|iPod/i.test(win.navigator.userAgent) ? 'newzhuangxiu://' : 'fangtxzx://';
                            var oa = openApp({
                                url: location.protocol + '//m.fang.com/clientindex.jsp?produce=ftxzx&flag=download&os=&company=0091',
                                log: that.log,
                                appurl: 'data/{"address":"home"}',
                                href: apphref,
                                appstoreUrl: location.protocol + '//itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8'
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
                    } catch (error) {
                        console.log(error);
                    }
                }
            };
            new k();
        })(window);

        /* --appdownload tips*/
        var storage = window.localStorage;
        if (!storage.getItem('pageLoadCount')) storage.setItem('pageLoadCount', 0);
        storage.pageLoadCount = parseInt(storage.getItem('pageLoadCount')) + 1;

        /*直接去掉浮层*/
        var maskMax = $('.maskMax');
        maskMax.hide();
        // 关闭右上角导航
        $(function () {
            // 此两处禁止触摸滑动
            $('header,.jj-zxtu').on('touchmove', function (e) {
                e.preventDefault();
            });

            $(document).on('touchmove', function (e) {
                // 有浮层时触摸不响应
                if (!maskMax.is(':hidden')) {
                    e.preventDefault();
                }
            });
        });
         // 收藏
         $iconFav.on('click', (function () {
            var canAjax = true;
            return function () {
                if (canAjax) {
                    var $this = $(this);
                    var isCollected = $this.hasClass('cur');
                    // 只统计收藏状态
                    !isCollected && yhxw({
                        page: pageId,
                        type: 21,
                        id: comData.picid
                    });
                    
                    // 判断是否登录，无登录跳登录页
                    if (vars.isLogin) {
                        canAjax = false;
                        // 收藏ajax请求
                        $.ajax({
                            url: vars.jiajuSite + '?c=jiaju&a=ajaxPicCollect',
                            data: {
                                // choice:2取消收藏,3收藏
                                choice: isCollected ? 2 : 3,
                                // infoType:2单图，1案例
                                infoType: 2,
                                InfoId: comData.picid,
                                picUrl: comData.src,
                                title: comData.comment,
                                channelId: vars.channelId
                            },
                            success: function (response) {
                                if (+response.Message.Code === 1) {
                                    $this.toggleClass('cur');
                                    toast(isCollected ? '取消收藏成功' : '收藏成功');
                                    comData.isCollect = !isCollected;
                                }
                            },
                            complete: function () {
                                canAjax = true;
                            }
                        });
                    } else {
                        location.href = location.protocol + '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(location.href.replace(/\d{8}/, comData.picid));
                    }
                }
            };
        })());

         var toast = (function () {
            var toastTime;
            var $sendFloat = $('.favorite');
            var $sendText = $sendFloat;
            var toastMsg = {};
            return function (msgType, cb) {
                $sendText.text(toastMsg[msgType] || msgType);
                $sendFloat.show();
                toastTime && clearTimeout(toastTime);
                toastTime = setTimeout(function () {
                    $sendFloat.hide();
                    cb && cb();
                }, 2000);
            };
        })();
        // 分享按钮
        // var $iconFav = $('.icon-fav');
        // 分享
        var shareFn = (function () {
            var share;
            var shareWx;
            // 微信分享成功弹层
            var $shareSuc = $('.shareSuc');
            // 微信分享成功弹层关闭按钮事件
            $shareSuc.find('.close').on('click', function () {
                $shareSuc.hide();
            });
            var picIds = {};
            // 存储图片id,用于分享成功弹层判断展示信息
            $shareSuc.find('li').each(function () {
                picIds.last = picIds[$(this).attr('data-picid')] = $(this);
            });
            return function (config, wxConfig, picId) {
                // 浏览用户行为
                yhxw({
                    page: pageId,
                    type: 0,
                    id: picId
                });      
                // 展示更当前picid 不用的前三条信息
                (picIds[picId] ? picIds[picId] : picIds.last).hide().siblings().show();
                if (share) {
                    // 更新分享信息
                    share.updateConfig(config);
                    shareWx.updateOps(wxConfig);
                } else {
                    // 初始化分享
                    share = new superShare(config);
                    shareWx = new wxShare(wxConfig, function () {
                        // 微信成功回调
                        $shareSuc.show();
                    });
                    // 此处分享按钮不在main里，分享插件不支持，故重新绑定事件
                    $('.icon-share').on('click', function () {
                        yhxw({
                            page: pageId,
                            type: 22,
                            id: comData.picid
                        });
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
    };
});