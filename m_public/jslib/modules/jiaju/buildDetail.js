/**
 * Created by LXM on 15-4-1.
 * Modified by zxw LXM on 15.10.21
 */
define('modules/jiaju/buildDetail', ['jquery', 'lazyload/1.9.1/lazyload', 'superShare/1.0.1/superShare', 'loadMore/1.0.0/loadMore', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var $favoriteId = $('#favorite_msg');
        var $favtId = $('.icon-fav');
        var $nav = $('.icon-nav');
        var $body = $('body');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var superShare = require('superShare/1.0.1/superShare');
        var size = 20;
        var storageType = 'jiaju_build_favorite';
        // 搜索用户行为收集20160114
        var page = 'jj_qjd^xq_wap';

        //20160427新增
        var getmore = $('#getmore');
        var morePic = $('#morePic');
        var hidemore = $('#hidemore');
        getmore.on('click', function () {
            morePic.show();
            hidemore.show();
            getmore.hide();
        });
        hidemore.on('click', function () {
            morePic.hide();
            hidemore.hide();
            getmore.show();
        });

        function getparam(str, name) {
            var paraString = str.split(';');
            var paraObj = {};
            var j;
            for (var i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
            }
            return paraObj[name];
        }

        function hasExistedInLS(value) {
            for (var i = 1; i <= size; i += 1) {
                var ls = localStorage.getItem(storageType + i);
                if (ls) {
                    if (getparam(ls, 'id') === value) {
                        return true;
                    }
                }
            }
            return false;
        }

        function getLSIndex() {
            for (var i = 1;; i++) {
                var ls = localStorage.getItem(storageType + i);
                if (!localStorage.getItem(storageType + 1)) {
                    return 1;
                } else if (!ls) {
                    return i;
                }
            }
        }

        function adjustLS(value) {
            // 先删掉第一个条目
            localStorage.removeItem(storageType + '1');
            for (var i = 2; i <= size; i++) {
                // 依次向前挪一位
                var ls = localStorage.getItem(storageType + i);
                if (ls) {
                    localStorage.setItem(storageType + (i - 1), ls);
                }
            }
            localStorage.setItem(storageType + size, value);
        }

        function favorite() {
            $favoriteId.hide(500);
        }

        function showMsg(isCollect) {
            // isCollect:1:收藏，0：取消收藏
            $favoriteId.show();
            $favoriteId.html(isCollect ? '收藏成功' : '已取消收藏');
            setTimeout(favorite, 3000);
        }

        function getLSKey(value) {
            for (var i = 0; i <= size; i++) {
                var ls = localStorage.getItem(storageType + i);
                if (ls) {
                    if (getparam(ls, 'id') === value) {
                        return storageType + i;
                    }
                }
            }
        }

        function oparation() {
            var item = '';
            if (!$favtId.hasClass('cur')) {
                if (!hasExistedInLS(vars.id)) {
                    item += 'id~' + vars.id + ';';
                    item += 'url~' + location.href + ';';
                    item += 'img~' + (vars.img === null ? '' : vars.img) + ';';
                    item += 'favtitle~' + (vars.favtitle === null ? '' : vars.favtitle) + ';';
                    item += 'price~' + (vars.price === null ? '' : vars.price) + ';';
                    item += 'Model~' + (vars.Model === null ? '' : vars.Model) + ';';
                    item += 'Spec~' + (vars.Spec === null ? '' : vars.Spec) + ';';
                    if (getLSIndex() > size) {
                        alert('您收藏的家具已达到上限，系统已自动覆盖之前的房源信息');
                        adjustLS(item);
                    } else {
                        localStorage.setItem(storageType + getLSIndex(), item);
                    }
                    showMsg(1);
                }
                $favtId.addClass('cur');
            } else {
                if (hasExistedInLS(vars.id)) {
                    localStorage.removeItem(getLSKey(vars.id));
                    showMsg(0);
                }
                $favtId.removeClass('cur');
            }
        }

        $favtId.click(function () {
            var b = 21;
            var p = {
                'vmg.page': page,
                'vmh.materialid': vars.pid
            };
            _ub.collect(b, p);
            oparation();
        });

        $(document).ready(function () {
            $('#PhotoSwipeTarget').css('overflow', 'hidden');
            if (window.location.search.indexOf('?') !== -1) {
                if (window.location.search.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                    $('#foot').css('display', 'none');
                }
            }
            $('footer').append('<div style="width: 100%;height: 50px"><span style="display:block"></span></div>');
        });
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
            $body.css('height', window.innerHeight + 100);
            window.scrollTo(0, 1);
            $body.css('height', window.innerHeight);
        }
        var $focus = $('.focus-opt');
        var $head = $('.head2');
        var maxLen = 200;
        var cLen = 150;
        var $window = $(window);
        var scrollFunc = function () {
            var scrollH = $window.scrollTop();
            // 导航切换效果
            if (scrollH <= maxLen) {
                $head.css('opacity', scrollH / maxLen);
                // 向下移动屏幕
                if (scrollH <= cLen) {
                    $focus.css('opacity', 1 - scrollH / cLen);
                } else {
                    $head.children().filter('.left,.head-icon').css('opacity', scrollH / (maxLen - cLen));
                }
                // 向上移动屏幕
            } else {
                $head.css('opacity', 1);
                $focus.css('opacity', 0);
            }
        };
        $window.on('scroll', scrollFunc);
        $nav.on('click', (function () {
            var isShow = 0;
            return function () {
                isShow = !isShow;
                if (isShow) {
                    $window.off('scroll');
                    $head.css('opacity', 1);
                    $focus.css('opacity', 0);
                } else {
                    $window.on('scroll', scrollFunc);
                    $head.css('opacity', 0);
                    $focus.css('opacity', 1);
                }
            };
        })());

        // 打电话
        function teltj(e, l, f, d, j, h, g, a) {
            $.ajax({
                url: vars.main + 'data.d?m=houseinfotj&city=' + e + '&housetype=' + l + '&houseid=' + f + '&newcode=' + d + '&type=' + j + '&phone=' + h + '&channel=' + g + '&agentid=' + a,
                async: true
            });
        }
        $('.tj-tel').click(function () {
            var b = 31;
            var p = {
                'vmg.page': page,
                'vmh.materialid': vars.pid
            };
            _ub.collect(b, p);
            teltj(vars.city, 'jiaju', vars.id, vars.id, 'call', vars.Telephone, 'wapjiajuinfo', vars.m6);
        });
        // 聊天
        var chatstr = '我对' + vars.ProductName + '很感兴趣 能详细了解一下吗？';

        function chat(b, k, c, j, g, f, l, a, e, h, d) {
            localStorage.setItem(String('h:' + d), encodeURIComponent(e) + ';' + h + ';' + encodeURIComponent(chatstr));
            $.ajax({
                url: vars.chatUrl + 'data.d?m=houseinfotj&city=' + b + '&housetype=' + k + '&houseid=' + c + '&type=' + j + '&phone=' + g + '&channel=' + f + '&agentid=' + a,
                async: false
            });
            setTimeout(function () {
                window.location = vars.chatUrl + 'chat.d?m=chat&username=h:' + l + '&city=' + b + '&type=waphome&projinfo=jiaju&shopid=jl' + vars.pid;
            }, 500);
        }

        $('#chat').click(function () {
            var b = 24;
            var p = {
                'vmg.page': page,
                'vmh.materialid': vars.pid
            };
            _ub.collect(b, p);
            chat(vars.city, 'jiaju', vars.id, 'chat', vars.Telephone, 'wapjiajuinfo', vars.escape, vars.m6, vars.linkMan, vars.userlogo, vars.soufunName);
        });


        // 分享
        (function () {
            var title = '【房天下' + vars.cityname + '家居网】';
            new superShare({
                title: title,
                image: vars.img,
                desc: $.trim(vars.summary)
            });
            $('#jiajushare').click(function () {
                var b = 22;
                var p = {
                    'vmg.page': page,
                    'vmh.materialid': vars.pid
                };
                _ub.collect(b, p);
            });
        })();


        // 照片轮播
        require.async('swipe/3.10/swiper', function (Swiper) {
            var $per = $('.per');
            // 图片总数
            // var total = +$('.total').text();
            Swiper('#swiper', {
                speed: 500,
                loop: false,
                onSlideChangeEnd: function (swiper) {
                    // 序号从零开始
                    $per.text(swiper.activeIndex + 1);
                }
            });
        });
        var $imgs = $('#swiper').find('img');
        var slides = [];
        for (var i = 0, len = $imgs.length; i < len; i++) {
            var $img = $imgs.eq(i);
            slides.push({
                src: $img.attr('src'),
                w: $img.width(),
                h: $img.height()
            });
        }
        var pswp = $('.pswp')[0];
        var $text = $('.textBox');
        $imgs.on('click', function () {
            var index = $(this).parents('.swiper-slide').eq(0).index();
            var options = {
                history: false,
                focus: false,
                index: index,
                escKey: true,
                closeCallback: function () {
                    $text.hide();
                },
                updateCallback: function (index) {
                    $text.find('i').text(index + 1);
                }
            };
            var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, slides, options);
            gallery.init();
            $text.show();
        });


        // 根据DealerType判断是有隐藏.footer
        if (vars.DealerType === '1') {
            $('.footer').hide();
        }
        // 判断是否收藏
        if (storageType && hasExistedInLS(vars.id)) {
            $favtId.addClass('cur');
        }

        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            // 所在城市（中文）
            _ub.city = vars.cityname;
            // 固定值，家居
            _ub.biz = 'h';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = 0;
            var b = 0;
            var p = {
                'vmg.page': page,
                'vmh.brand': encodeURIComponent(vars.BrandName),
                'vmh.materialid': vars.pid
            };
            // 例如_ub.collect(0,{'mhi':' 123456','mh4':'2^4','mh2':'现代简约'})
            _ub.collect(b, p);
        });
        //加载失败
        $('#reload').on('click', function () {
            location.reload();
        });
    };
});