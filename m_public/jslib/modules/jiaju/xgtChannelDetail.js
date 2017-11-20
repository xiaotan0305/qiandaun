/**
 * @file 效果图明细:下载、悬浮
 * @author 徐颖(bjxuying@soufun.com)
 * @modified by 袁辉辉(yuanhuihui@soufun.com)
 */
define('modules/jiaju/xgtChannelDetail', ['jquery', 'photoswipe/4.0.8/photoswipe', 'photoswipe/4.0.8/photoswipe-ui-default'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var hasLoadPicIds = [];
        var picUrl = vars.jiajuSite + '?c=jiaju&a=ajaxGetPic&q=' + vars.q + '&ischannel=1';
        // 头部样式
        $('header').addClass('head_2');
        $('.icon-nav').addClass('icon-nav2');
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });

        // 顶部导航切换样式切换
        (function () {
            var $header = $('.header');
            $header.hasClass('head_2') && $header.on('click', '.icon-nav', function () {
                $header.toggleClass('head_2');
            });
        })();

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

        var leftEnd = false;
        var rightEnd = false;
        var currentImg = null;
        var comData = null;
        var page = 5;
        var countNumber = 100;
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
                imgThis = $this.find('img');
            image.src = imgThis.attr('src');
            image.onload = function () {
                total--;
                var result = opImgWH(this.width, this.height);
                var item = {
                    src: $href,
                    w: result.w || 600,
                    h: result.h || 400,
                    comment: $comment
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
                        if (to) {
                            // currentImg = lightBox.currItem;
                            // comData = lightBox.currItem.comment;
                            // // 预加载图片基本链接
                            // addPic(to, Number(comData.picid));
                            var currentIndex = lightBox.getCurrentIndex();
                            var galleryLength = lightBox.items.length;
                            if(galleryLength - currentIndex < 8 && pageFlag) {
                                pageFlag = false;
                                toEndAjaxFn();
                            }
                        }
                    });
                    lightBox.listen( 'pointerDown', function(e) {
                        $('#jjNav').hide();
                    });
                    lightBox.init();
                    if(pic.length === +vars.index + 1 && pageFlag) {
                            pageFlag = false;
                            toEndAjaxFn();
                    }
                }
            };
        });

        function toEndAjaxFn () {
            var items = [];
            var channelId = vars.channelId;
            var url = vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreChannelPic';
            url += '&channelId=' + channelId + '&isdetail=1&r=' + Math.random() + '&page=' + page;
            $.ajax({
                url: url,
                type: 'get',
                async: true,
                success: function (data) {
                    var total = data.length;
                    countNumber = 100;
                    data.forEach(function (partdata,index) {
                        var image = new Image();
                        image.src = partdata.picurl;
                        partdata.order = countNumber;
                        countNumber --; 
                        $(image).on('load',function () {
                            total--;
                            var result = opImgWH(this.width, this.height);
                            var item = {
                                src: partdata.picurl,
                                w: result.w || 600,
                                h: result.h || 400,
                                comment: '',
                                order: partdata.order
                            };
                            items.push(item);
                            if(!total) {
                                items.sort(compare('order'));
                          
                                Array.prototype.splice.apply(lightBox.items, [lightBox.items.length, 0].concat(items));
                                console.log(lightBox.items.length);
                                pageFlag = true;
                                lightBox.updateSize(true);
                            }
            
                        }).on('error',function () {
                            total--;
                        });
                    });

                },
                complete: function () {
                    page += 1;
                    

                }
            });
        }
        function compare(propertyName) {
            return function (object1,object2) {
                return object2[propertyName] - object1[propertyName];
            }
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
                    image.src = data.picurl;
                    $(image).on('load', imgLoadedFn(index, 1)).on('error', imgLoadedFn(index, 0));
                });

                function imgLoadedFn(index, loaded) {
                    return function () {
                        if (loaded && $.inArray(+loadImg[index].picid, hasLoadPicIds) < 0) {
                            var item = {
                                src: loadImg[index].picurl,
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
    };
});