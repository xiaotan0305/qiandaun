/** 二手房全景h5
 * Created by lina on 2016/12/5.
 */
define('modules/esf/esfh5qj', ['jquery','modules/esf/h5animation', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var isSwipeX = null,
            swipeUpFlag;
            // jquery库
        var $ = require('jquery');
        var vars = seajs.data.vars,
            // 屏幕宽
            winWid = $(document).width(),
            // 屏幕高
            winHei =$(document).height(),
            CSSAnimations = require('modules/esf/h5animation');
        // 滑动插件
            $.fn.swipeUp = function (options) {
                var _data = this.data("data");
                if (_data != null) {
                    if (_data.index != options.index) {
                        var _c = this.children(_data.childrenClass), _sp = _c.get(options.index);
                        _c.css({zIndex: "18", display: "none"});
                        $(_sp).css({zIndex: "20", display: "block"})
                    }
                    this.data("data", $.extend({}, _data, options));
                    _data = this.data("data");
                    return
                }
                var defaults = {
                    index: 0,
                    speed: 300,
                    childrenClass: '.page'
                };
                var opts = $.extend({}, defaults, options);
                return this.each(function () {
                    var that = $(this);
                    var h = parseInt(that.css('height'));
                    var childrenObj = that.children(opts.childrenClass),
                        slideBgObj = childrenObj.find(opts.mbgcClass + 'img');
                    var currObj, prevObj, nextObj;
                    // 滑动后更新当前活动页的index
                    var freshObj = function () {
                        childrenObj.css({
                            '-webkit-transform': 'translate3d(0,0,0)',
                            '-webkit-transition-duration': '0ms',
                            opacity: 1,
                            display: 'none'
                        });
                        currObj = prevObj = nextObj = null;
                        if (opts.index < 0) {
                            currObj = $(childrenObj[childrenObj.length - 1]).show().css({
                                zIndex: '20'
                            });
                            opts.index = childrenObj.length - 1;
                        } else {
                            if (opts.index === childrenObj.length) {
                                currObj = $(childrenObj[0]).show().css({
                                    zIndex: '20'
                                });
                                opts.index = 0;
                            } else {
                                currObj = $(childrenObj[opts.index]).show().css({
                                    zIndex: '20'
                                });
                            }
                        }
                        if (opts.index > 0) {
                            prevObj = $(childrenObj[opts.index - 1]);
                        } else {
                            prevObj = $(childrenObj[childrenObj.length - 1]);
                        }
                        if (opts.index < childrenObj.length - 1) {
                            nextObj = $(childrenObj[opts.index + 1]);
                        } else {
                            nextObj = $(childrenObj[0]);
                        }
                    };
                    var setState = function (Obj, state) {
                        var img = $(Obj).find('.imgs-box img');
                        if (img.length > 0) {
                            $(img).css({
                                '-webkit-animation-play-state': state,
                                'animation-play-state': state
                            });
                        }
                    };
                    freshObj();
                    var startY = 0,
                        moveY = 0,
                        endY = 0;
                    swipeUpFlag = true;
                    // 滑动开始
                    this.addEventListener('touchstart', function (e) {
                        if (!swipeUpFlag)
                            return;
                        if (opts.beforeSwipe) {
                            opts.beforeSwipe(opts.index);
                        }
                        startY = e.touches[0].pageY,
                            endY = 0;
                        childrenObj.css({
                            '-webkit-transition-duration': '0ms'
                        });
                        $(slideBgObj).css({
                            '-webkit-animation-play-state': 'paused',
                            'animation-play-state': 'paused'
                        });
                        if (prevObj.find('.imgs-box').length) {
                            prevObj.children('div').not('.imgs-box').hide();

                        } else {
                            prevObj.children().hide();
                        }
                        if (nextObj.find('.imgs-box').length) {
                            nextObj.children('div').not('.imgs-box').hide();
                        } else {
                            nextObj.children().hide();
                        }
                        setState(currObj, 'paused');
                    });
                    // 在滑动中
                    this.addEventListener('touchmove', function (e) {
                        if (!swipeUpFlag || isSwipeX !== null && isSwipeX !== false)
                            return;
                        e.preventDefault();
                        moveY = e.touches[0].pageY;
                        endY = moveY - startY;
                        var e = false;
                        if (prevObj) {
                            if (endY > 0) {
                                prevObj.css({
                                    zIndex: 18,
                                    display: 'block'
                                });
                            } else {
                                prevObj.hide();
                            }
                        } else if (endY > 0) {
                            e = true;
                        }
                        if (nextObj) {
                            if (endY < 0) {
                                nextObj.css({
                                    zIndex: 18,
                                    display: 'block'
                                });
                            } else {
                                nextObj.hide();
                            }
                        } else if (endY < 0) {
                            e = true;
                        }
                        if (e) {
                            endY = endY / 2;
                        }
                        currObj.find('.tel-box').show();
                        currObj.css({
                            '-webkit-transform': 'translate3d(0,' + endY + 'px,0)'
                        });
                    });
                    // 滑动结束
                    this.addEventListener('touchend', function (e) {
                        if (!swipeUpFlag || isSwipeX !== null && isSwipeX !== false) {
                            return;
                        }
                        if (Math.abs(endY) > 0) {
                            childrenObj.css({
                                '-webkit-transition-duration': opts.speed + 'ms'
                            });
                            if (Math.abs(endY) < h / 8) {
                                currObj.css({
                                    '-webkit-transform': 'translate3d(0,0,0)',
                                    opacity: 1
                                });
                                setState(currObj, 'running');
                                if (nextObj) {
                                    nextObj.css({
                                        display: 'none',
                                        opacity: 1
                                    });

                                }
                                if (prevObj) {
                                    nextObj.css({
                                        display: 'none',
                                        opacity: 1
                                    });
                                }
                            } else {
                                e.preventDefault();
                                var _my = 0;
                                if (endY < 0 && nextObj) {
                                    setState(currObj, 'paused');
                                    nextObj.css({
                                        opacity: 1
                                    });
                                    opts.index++;
                                    _my = -1 * h;
                                } else if (endY > 0 && prevObj) {
                                    setState(currObj, 'paused');
                                    prevObj.css({
                                        opacity: 1
                                    });
                                    if (nextObj.find('.imgs-box').length) {
                                        nextObj.find('.imgs-box').hide();
                                    }
                                    if (prevObj.find('.imgs-box').length) {
                                        prevObj.find('.imgs-box').hide();
                                    }
                                    opts.index--;
                                    _my = h;
                                } else {
                                    _my = 0;
                                }
                                endY = 0;
                                swipeUpFlag = false;
                                currObj.css({
                                    '-webkit-transform': 'translate3d(0,' + _my + 'px,0)',
                                    opacity: _my === 0 ? 1 : 0,
                                    zIndex: 20
                                });
                                setTimeout(function () {
                                    freshObj();
                                    setState(currObj, 'running');
                                    swipeUpFlag = true;
                                    if (opts.afterSwipe) {
                                        currObj.children().show();
                                        opts.afterSwipe(opts.index);
                                    }
                                }, opts.speed);
                            }
                        } else {
                            setState(currObj, 'running');
                        }
                        that.attr('data-indexNum', opts.index);
                    });
                    if (opts.init) {
                        opts.init();
                    }
                });
                return this;
            };
        function slideUp() {
            var _pw = $('#pages .page'),
                _index = 0;
            if (typeof isWxBack != "undefined" && isWxBack == "true") {
                _pw.each(function (c) {
                    if ($(this).hasClass("userpage")) {
                        _index = c;
                    }
                })
            }
            $('#pages').swipeUp({
                index: _index,
                childrenClass: '.page',
                mbgcClass: '.imgs-box',
                init: function () {
                    var _pw = $('#pages .page'),
                        _page = $(_pw.get(_index));
                    _page.addClass('active');
                    _page.attr("visited", "true");
                    setTimeout(function () {
                        var img = _page.find('.imgs-box img');
                        if (img.length > 0) {
                            $(img).css({'-webkit-animation-play-state': 'running', 'animation-play-state': 'running'});
                        }
                    }, 500);
                },
                afterSwipe: function (index) {
                    var currentSection = _pw.get(index);
                    _pw.removeClass('active');
                    $(currentSection).addClass('active');
                }
            });
        }
        // 给所有图片添加动画
        function setImgAnimation(img) {
            var $pic = $(img)
                , _w = $($pic).data('sw') || $pic.width()
                , _h = $($pic).data('sh') || $pic.height()
                , $mtw = winWid
                , $mth = winHei;
            var b = _w * 1.5 / $mtw
                , pdelay = Math.ceil(50 / (b + 1))
                , adelay = Math.ceil((b + .5) * 100 / (b + 1))
                , t = b + 1;
            var a_webkit = {
                '0%': {
                    '-webkit-transform': 'translate3d(0,0,0)'
                },
                '100%': {
                    '-webkit-transform': 'translate3d(' + ($mtw - _w) + 'px,0,0)'
                }
            };
            a_webkit[pdelay + '%'] = {
                '-webkit-transform': 'translate3d(0,0,0)'
            };
            a_webkit[adelay + '%'] = {
                '-webkit-transform': 'translate3d(' + ($mtw - _w) + 'px,0,0)'
            };
            var anim_webkit = CSSAnimations.create(a_webkit);
            var a = {
                '0%': {
                    transform: 'translate3d(0,0,0)'
                },
                '100%': {
                    transform: 'translate3d(' + ($mtw - _w) + 'px,0,0)'
                }
            };
            a[pdelay + '%'] = {
                transform: 'translate3d(0,0,0)'
            };
            a[adelay + '%'] = {
                transform: 'translate3d(' + ($mtw - _w) + 'px,0,0)'
            };
            var anim = CSSAnimations.create(a);
            $pic.css({
                '-webkit-animation': anim_webkit.name + '' + t + 's linear infinite alternate',
                animation: anim.name + ' ' + t + 's linear infinite alternate',
                '-webkit-animation-play-state': 'paused',
                'animation-play-state': 'paused'
            });
         /*  var pic = $pic.get(0);
            pic.style.webkitAnimation = anim_webkit.name + '' + t + 's linear infinite alternate';
            pic.style.animation= anim.name + ' ' + t + 's linear infinite alternate';
            pic.style.webkitAnimationPlayState = 'paused';
            pic.style.animationPlayState = 'paused';*/
        }

        // 重置所有图片宽高
        function resizePic(n) {
            var $thisw = $(n).data('w') || $(n).width()
                , $thish = $(n).data('h') || $(n).height()
                , $mtw = winWid
                , $mth = winHei;
            var $wr = $thisw / $mtw
                , $hr = $thish / $mth;
            var $r = Math.min($wr, $hr)
                , _w = Math.floor($thisw / $r)
                , _h = Math.floor($thish / $r);
            if (_w === $mtw) {
                _w += 60;
            }
            $(n).width(_w).height(_h);
            $(n).data('sw', _w);
            $(n).data('sh', _h);
            if (_w > $mtw * 1.15) {
                $(n).addClass('pic-anim');
            }
            if (_h > $mth) {
                $(n).css({
                    'margin-top': '-' + (_h - $mth) / 2 + 'px'
                });
            }
            // 为每张图片添加动画
            setImgAnimation(n);
        }

        // 加载所有图片
        function SetMoveImgs() {
            var imgs = $('img.pic-show'),
                len = imgs.length,
                i = 0;
            imgs.attr('src', function () {
                return $(this).attr('origin');
            }).one('load', function () {
                $(this).data('w', this.width);
                $(this).data('h', this.height);
                resizePic(this);
                i++;
                if (i === 3) {
                    $('#loader').hide();
                   $('.page1').children().not('.imgs-box').show();
                    slideUp();
                }
            }).each(function () {
                if (this.complete) {
                    $(this).trigger('load');
                }
            });
        }

        setTimeout(function () {
            SetMoveImgs();
        }, 0);


        // 微信分享，调用微信分享的插件
        var shareBox = $('.share');
        var Weixin = require('weixin/2.0.0/weixinshare');
        var wx = new Weixin({
            debug: false,
            shareTitle: shareBox.attr('newsline'),
            // 副标题
            descContent: '我在房天下发布了一套房源，点击查看详情',
            lineLink: location.href,
            imgUrl: window.location.protocol + shareBox.attr('imgpath'),
            swapTitle: false
        });
        var SuperShare = require('superShare/1.0.1/superShare');
        var config = {
            // 分享内容的title
            title: shareBox.attr('newsline'),
            // 分享时的图标
            image: window.location.protocol + shareBox.attr('imgpath'),
            // 分享内容的详细描述
            desc: '我在房天下发布了一套房源，点击查看详情',
            // 分享的链接地址
            url: location.href,
            // 分享的内容来源
            from: ' 房天下' + vars.cityname + '二手房'
        };
        new SuperShare(config);
    };
});
