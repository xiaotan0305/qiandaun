define('modules/jiaju/xgtDetail', [
    'jquery',
    'photoswipe/4.0.8/photoswipe',
    'photoswipe/4.0.8/photoswipe-ui-default.min',
    'superShare/1.0.1/superShare',
    'weixin/2.0.0/weixinshare',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var superShare = require('superShare/1.0.1/superShare');
        var wxShare = require('weixin/2.0.0/weixinshare');
        var vars = seajs.data.vars;
        var hasLoadPicIds = [];
        var picUrl = vars.jiajuSite + '?c=jiaju&a=ajaxGetPic&q=' + vars.q;
        // 头部样式
        $('header').addClass('head_2');
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        var yhxw = require('modules/jiaju/yhxw');
        var page = 'jj_mt^xgtxq_wap';
        yhxw({
            page: page,
            id: vars.picid
        });

        var leftEnd = false;
        var rightEnd = false;
        var currentImg = null;
        var comData = null;
        // 分享按钮
        var $iconFav = $('.icon-fav');
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
                            page: page,
                            type: 22,
                            id: vars.picid
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

        // 初始化数据
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
                        // 图片切换更新分享信息和展示信息
                        currentImg = lightBox.currItem;
                        comData = lightBox.currItem.comment;
                        $iconFav[+comData.isCollect ? 'addClass' : 'removeClass']('cur');
                        shareFn({
                            url: location.protocol + vars.jiajuSite + vars.city + '/xgt_' + comData.picid + '.html',
                            title: comData.NewTitle,
                            desc: comData.NewTitle,
                            image: comData.picurl
                        }, {
                            lineLink: location.protocol + vars.jiajuSite + vars.city + '/xgt_' + comData.picid + '.html',
                            shareTitle: comData.NewTitle,
                            descContent: comData.NewTitle,
                            imgUrl: comData.picurl
                        }, comData.picid);
                        if (to) {
                            // 添加附加信息--设计师--点赞--标点等
                            addOtherInfo(comData);
                            // 预加载图片基本链接
                            addPic(to, Number(comData.picid));
                        }
                    });
                    lightBox.init();
                }
            });
        });
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
        // 收藏
        $iconFav.on('click', (function () {
            var canAjax = true;
            return function () {
                if (canAjax && comData) {
                    yhxw({
                        page: page,
                        type: 21,
                        id: vars.picid
                    });
                    // 判断是否登录，无登录跳登录页
                    if (vars.isLogin) {
                        var $this = $(this);
                        canAjax = false;
                        var isCollected = $this.hasClass('cur');
                        // 收藏ajax请求
                        $.ajax({
                            url: vars.jiajuSite + '?c=jiaju&a=ajaxPicCollect',
                            data: {
                                // choice:2取消收藏,3收藏
                                choice: isCollected ? 2 : 3,
                                // infoType:2单图，1案例
                                infoType: 2,
                                InfoId: comData.picid,
                                picUrl: comData.picurl,
                                title: comData.NewTitle,
                                infoSoufunId: comData.soufunID
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



        // 添加标点
        var oPoint0 = $('#wapzxxgtxq_B01_12');
        var oPoint1 = $('#set_tag_pos1');
        var hasLoadPoint = [];

        function removePoint() {
            oPoint0.hide();
            oPoint1.hide();
        }

        function setPoint(node, point) {
            var ppx = parseInt(currentImg.w * currentImg.initialZoomLevel * point.x + currentImg.initialPosition.x) + 'px',
                ppy = parseInt(currentImg.h * currentImg.initialZoomLevel * point.y + currentImg.initialPosition.y) + 'px';
            node.find('i').css({
                top: ppy,
                left: ppx
            });
            node.show();
            node.click(function () {
                window.location = point.url;
            });
        }

        function showPoint(pointList) {
            for (var i in pointList) {
                if (pointList.hasOwnProperty(i)) {
                    if (i === '0') {
                        setPoint(oPoint0, pointList[i]);
                    }
                    if (i === '1') {
                        setPoint(oPoint1, pointList[i]);
                    }
                }
            }
        }

        function addPoint(objData) {
            if (Number(objData.ispoint) === 0) {
                removePoint();
                return;
            }
            if (hasLoadPoint[Number(objData.picid)]) {
                showPoint(hasLoadPoint[Number(objData.picid)]);
                return;
            }
            $.post(vars.jiajuSite + '?c=jiaju&a=ajaxGetPoint&picid=' + objData.picid, {}, function (ret) {
                var infof = JSON.parse(ret);
                hasLoadPoint[Number(objData.picid)] = infof;
                showPoint(infof);
            });
        }

        // 添加图片附属信息
        function addOtherInfo(objData) {
            // 添加标点
            addPoint(objData);
            // 显示图片标题
            showPicTitle(objData);
        }

        function showPicTitle(objData) {
            var picTitle = $('#picTitle p');
            picTitle.html(objData.NewTitle);
        }

        function addPic(where, curPicId) {
            var direction = where > 0 ? 'right' : 'left';
            var hasLoadPicLen = hasLoadPicIds.length;
            var picid = where > 0 ? hasLoadPicIds[Number(hasLoadPicLen - 1)] : hasLoadPicIds[0];
            // 获取头部或者末尾的图片id
            var currentPicIndexInHasload = $.inArray(curPicId, hasLoadPicIds);
            // 获取当前图片id所处已加载图片数组的索引位置
            if (picid === 0) {
                return;
            }
            if (where > 0) {
                //  右滑预加载已经超过五张--如果已加载图片数组总长度减去当前位置大于5 说明向右 预加载图片已经超过五张
                if (hasLoadPicLen - currentPicIndexInHasload > 5 || rightEnd) {
                    return;
                }
            } else if (currentPicIndexInHasload > 5 || leftEnd) {
                //  左滑预加载已经超过五张或者 左边已经没有更多图片了
                return;
            }

            $.post(picUrl + '&picid=' + picid + '&direction=' + direction, {}, function (ret) {
                var data = typeof ret === 'string' ? JSON.parse(ret) : ret;
                var length = data && data.length;
                if (typeof length !== 'number') {
                    return;
                }
                if (length < 5) {
                    if (where > 0) {
                        rightEnd = true;
                    } else {
                        leftEnd = true;
                    }
                }
                var loadImg = [];
                for (var i = 0; i < length; i++) {
                    $.inArray(+data[i].picid, hasLoadPicIds) < 0 && loadImg.push(data[i]);
                }
                var items = [];
                var needLoad = loadImg.length;
                var addCount = where > 0 ? 0 : needLoad;
                $.each(loadImg, function (index, data) {
                    var image = new Image();
                    image.src = data.cdnpicurl;
                    $(image).on('load', imgLoadedFn(index, 1)).on('error', imgLoadedFn(index, 0));
                });

                function imgLoadedFn(index, loaded) {
                    return function () {
                        if (loaded && $.inArray(+loadImg[index].picid, hasLoadPicIds) < 0) {
                            var item = {
                                src: loadImg[index].cdnpicurl,
                                w: this.naturalWidth || 600,
                                h: this.naturalHeight || 400,
                                comment: loadImg[index]
                            };
                            hasLoadPicIds[where > 0 ? 'push' : 'unshift'](+loadImg[index].picid);
                            items[index] = item;
                        } else {
                            addCount && addCount--;
                        }

                        if (!--needLoad) {
                            for (var i = items.length - 1; i >= 0; i--) {
                                items[i] || items.splice(i, 1);
                            }
                            if (items.length) {
                                if (where > 0) {
                                    Array.prototype.splice.apply(lightBox.items, [lightBox.items.length, 0].concat(items));
                                } else {
                                    Array.prototype.splice.apply(lightBox.items, [0, 0].concat(items.reverse()));
                                }
                                if (addCount !== 0) {
                                    var newIndex = lightBox.getCurrentIndex() + addCount;
                                    lightBox.setCurrentIndex(newIndex);
                                }
                            }
                        }
                    };
                }
            });
        }
        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapzxxgtxq_', '');
            });
        });
    };
});