define('modules/jiaju/xgtCaseDetail', ['jquery', 'photoswipe/4.0.8/photoswipe', 'photoswipe/4.0.8/photoswipe-ui-default.min', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var superShare = require('superShare/1.0.1/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');
        var currentSpan = $('#currentItem');
        var dataNotFound = $('#notfound');
        var $iconFav = $('.icon-fav');
        var $shareSuc = $('.shareSuc');
        var toastTime;
        var $sendFloat = $('.favorite');
        var $sendText = $sendFloat;
        var vars = seajs.data.vars;
        var hasLoadPicIds = [];
        var comData = null;
        var share;
        var shareWx;
        var hasCollect;
        pageInit();

        /**
         * [pageInit description] page初始化
         * @return {[type]} [description]
         */
        function pageInit() {
            // 头部样式
            $('header').addClass('head_2');
            // photoSwiper初始化
            photoSwiperInit();
            // 页面事件初始化
            eventInit();
            // hasCollect初始化
            hasCollect = $iconFav.hasClass('cur') ? true : false;
        }

        /**
         * [eventInit description] 事件初始化
         * @return {[type]} [description]
         */
        function eventInit() {
            // 数据请求失败时, 点击刷新
            dataNotFound.on('click', function () {
                window.location.reload();
            });
            // 微信分享成功弹层关闭按钮事件
            $shareSuc.find('.close').on('click', function () {
                $shareSuc.hide();
            });
            // 收藏
            $iconFav.on('click', (function () {
                var canAjax = true;
                return function () {
                    if (canAjax && comData) {
                        // 判断是否登录，无登录跳登录页
                        if (vars.isLogin) {
                            var $this = $(this);
                            canAjax = false;
                            // var isCollected = $this.hasClass('cur');
                            // 收藏ajax请求
                            $.ajax({
                                url: vars.jiajuSite + '?c=jiaju&a=ajaxPicCollect',
                                data: {
                                    // choice:2取消收藏,3收藏
                                    choice: hasCollect ? 2 : 3,
                                    // infoType:2单图，1案例
                                    infoType: 1,
                                    InfoId: vars.caseId,
                                    picUrl: comData.picurl,
                                    title: vars.title,
                                    infoSoufunId: comData.soufunID
                                },
                                success: function (response) {
                                    if (+response.Message.Code === 1) {
                                        $this.toggleClass('cur');
                                        toast(hasCollect ? '取消收藏成功' : '收藏成功');
                                        hasCollect = !hasCollect;
                                        // comData.isCollect = !isCollected;
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
        } 
        
        /**
         * [shareFn description] 页面分享初始化
         * @param  {[type]} config   [description] superShare options
         * @param  {[type]} wxConfig [description] 微信分享options
         * @return {[type]}          [description]
         */
        function shareFn(config, wxConfig) {
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

        /**
         * [photoSwiperInit description] photoSwiper插件初始化
         * @return {[type]} [description]
         */
        function photoSwiperInit() {
            var items = [],
            $pics = $('.picture').find('a'),
            total = $pics.length,
            lightBox;
            $pics.each(function (index, pic) {
                hasLoadPicIds.push($(this).data('picid'));
                var image = new Image(),
                    $pic = $(pic);
                var $href = $pic.attr('href'),
                    $comment = $pic.data('comment'),
                    $imgThis = $pic.find('img');
                image.src = $imgThis.attr('src');
                $(image).on('load error', function () {
                    total--;
                    items[index] = {
                        src: $href,
                        w: this.naturalWidth,
                        h: this.naturalHeight,
                        comment: $comment
                    };
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
                            history: false
                        };
                        //  Initialize PhotoSwipe
                        lightBox = new window.PhotoSwipe($pswp, window.PhotoSwipeUI_Default, items, options);

                        // 判断方向
                        lightBox.listen('beforeChange', function (to) {
                            comData = lightBox.currItem.comment;
                            // 初始化当前图片是否已经被收藏
                            // $iconFav[+comData.isCollect ? 'addClass' : 'removeClass']('cur');
                            // 初始化当前图片分享链接
                            shareFn({
                                    url: location.href.replace(/picid=\d+$/,'picid=' + comData.picid),
                                    title: comData.NewTitle,
                                    desc: comData.NewTitle,
                                    image: comData.picurl
                                    }, {
                                    lineLink: location.href.replace(/picid=\d+$/,'picid=' + comData.picid),
                                    shareTitle: comData.NewTitle,
                                    descContent: comData.NewTitle,
                                    imgUrl: comData.picurl
                                    });
                            //初始化当前元素的描述,初始化当前元素的索引
                            var partHtml = '<h3>' + '&nbsp;<span><i>' + (+lightBox.getCurrentIndex() + 1) + '</i>/' + lightBox.items.length + '</span></h3>' 
                                            + '<p class="f13 ellips_three" style="max-height:none;">' + (comData.Description ? comData.Description : '&nbsp;') + '</p>'

                            currentSpan.html(partHtml);
                        });
                        lightBox.init();
                    }
                });
            });
        }

        /**
         * [toast description] 收藏功能tip
         * @param  {[type]} msgType [description] 提示信息
         * @return {[type]}         [description]
         */
        function toast(msgType) {
            $sendText.text(msgType);
            $sendFloat.show();
            toastTime && clearTimeout(toastTime);
            toastTime = setTimeout(function () {
                $sendFloat.hide();
            }, 2000);
        }; 
    };
});