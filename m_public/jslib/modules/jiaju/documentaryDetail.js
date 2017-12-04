/**
 * Created by thx on 2016-01-04.
 */
define('modules/jiaju/documentaryDetail', [
    'jquery',
    'lazyload/1.9.1/lazyload',
    'photoswipe/4.0.8/photoswipe',
    'photoswipe/4.0.8/photoswipe-ui-default.min',
    'superShare/1.0.1/superShare',
    'weixin/2.0.0/weixinshare',
    'modules/jiaju/openapp',
    'modules/jiaju/yhxw'
], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        //用户行为
        var yhxw = require('modules/jiaju/yhxw');
        var tagBox = $('.tagBox');
        yhxw({
            page: 'jj_zxriji^xq_wap',
            id: vars.documentaryId,
            style: tagBox.find('span:eq(0)').text(),
            housetype: tagBox.find('span:eq(1)').text(),
            totalprice: tagBox.find('span:eq(2)').text(),
            area: vars.area
        });
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({
            skip_invisible: false,
            threshold: 600
        });
        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        var nodeIdPre = vars.nodeId;
        nodeIdPre && (window.location.href = '#' + nodeIdPre);
        // 点赞
        var isAjaxing = false;
        $('.support').on('click', function (e) {
            e.stopPropagation();
            if (isAjaxing) {
                return false;
            }
            isAjaxing = true;
            var url = window.location.href.replace(/#\w*/, '');
            var nodeId = $(this).parents('.step')[0].id;
            var hasParam = url.indexOf('?') !== -1;
            var hasNodeId = url.indexOf('nodeId') !== -1;
            if (hasNodeId) {
                url = url.replace(/(nodeId=)\w+/, '$1' + nodeId);
            } else {
                url += (hasParam ? '&' : '?') + 'nodeId=' + nodeId;
            }
            if (!vars.userLogin) {
                window.location = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(url);
                return false;
            }
            var ajaxLikeUrl = vars.jiajuSite + '?c=jiaju&a=ajaxDocumentaryLike&r=' + Math.random();
            var like = $(this);
            $.ajax({
                url: ajaxLikeUrl,
                data: {
                    nodeId: nodeId,
                    nodeLike: $(this).attr('data-like'),
                    url: url
                },
                dataType: 'json',
                type: 'GET',
                success: function (data) {
                    if (data.issuccess === '1') {
                        var likeClass = like.attr('class');
                        if ('support flor active' === likeClass) {
                            like.removeClass('active');
                            like.html('<i>+1</i>' + (parseInt(like.text().substr(2), 10) - 1));
                            like.attr('data-like', '1');
                        } else if ('support flor' === likeClass) {
                            like.addClass('play');
                            like.html('<i>+1</i>' + (parseInt(like.text().substr(2), 10) + 1));
                            like.attr('data-like', '-1');
                        } else {
                            like.removeClass('play');
                            like.html('<i>+1</i>' + (parseInt(like.text().substr(2), 10) - 1));
                            like.attr('data-like', '1');
                        }
                    }
                    isAjaxing = false;
                },
                error: function () {
                    isAjaxing = false;
                }
            });
        });
        // 导航
        function preventDefault(e) {
            e.preventDefault();
        }
        // 禁用/启用touchmove
        function toggleTouchmove(unable) {
            document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault);
        }
        // 导航页
        var $navList = $('.jj-process');
        // 导航按钮
        var $navBtn = $('.menu-cont');
        // 记录每个步骤在dom中距离文档顶部的高度
        $navBtn.on('click', function () {
            $navList.show();
            toggleTouchmove(1);
        });
        $navList.on('click', function (e) {
            var $target = $(e.target);
            if ($target.hasClass('jj-process')) {
                $navList.hide();
                toggleTouchmove();
            }
        });
        // 导航项
        var $window = $(window);
        var $steps = $('.jj-recSteps');
        var $title = $steps.find('.ttl');
        var $navItem = $('.jj-process').find('.able');
        // 记录offset
        $navItem.each(function (index) {
            $(this).data('stepIndex', index);
        }).on('click', function () {
            var $this = $(this);
            var index = $this.data('stepIndex');
            $navList.hide();
            toggleTouchmove();
            $window.scrollTop($steps.eq(index).offset().top);
            setTimeout(function () {
                $navBtn.show();
            }, 50);
        });
        // 显示隐藏导航按钮
        var $nav = $('#nav');
        (function () {
            var scrollTopOld = $window.scrollTop();
            $window.on('scroll', function () {
                if ($nav.is(':hidden')) {
                    var scrollTop = $window.scrollTop();
                    if (scrollTop > scrollTopOld) {
                        $navBtn.hide();
                    } else if (scrollTop < scrollTopOld) {
                        $navBtn.show();
                    }
                    scrollTopOld = scrollTop;
                }
            });
        })();
        // 滚动条事件 处理steps标题置顶
        $window.on('scroll', function () {
            if ($nav.is(':hidden')) {
                // 标题高度
                var top = 43;
                var offsets = [];
                $steps.each(function () {
                    offsets.push($(this).offset().top);
                });
                var scrollTop = $window.scrollTop();
                var length = $steps.length;
                var i;
                for (i = 0; i < length; i++) {
                    if (scrollTop < offsets[i]) {
                        break;
                    }
                }
                i--;
                var $nowTitle;
                if (i < 0) {
                    // 所有回归文档
                    $navItem.eq(0).addClass('active').siblings().removeClass('active');
                    $title.removeClass('fixed');
                } else {
                    // 第n个脱离文档
                    var fixedTop = offsets[i + 1] - scrollTop;
                    $navItem.eq(i).addClass('active').siblings().removeClass('active');
                    $nowTitle = $title.eq(i);
                    $title.removeClass('fixed');
                    $nowTitle.addClass('fixed');
                    if (fixedTop < top) {
                        $title.find('h2').css('top', 0);
                        $nowTitle.find('h2').css('top', fixedTop - top + 'px');
                    } else {
                        $title.find('h2').css('top', 0);
                    }
                }
            }
        });
        // 照片墙
        $steps.on('click', 'img', function (e) {
            e.stopPropagation();
            var $this = $(this);
            var $parent = $this.parent();
            // 照片序号
            var index = $parent[0].tagName.toLowerCase() === 'div' ? $this.index() : $parent.index() + 1;
            // 当前照片栏照片信息
            var $gallery = $this.parents('.step').eq(0).find('.gallery');
            var $imgs = $gallery.find('img');
            var items = [];
            for (var i = 0, length = $imgs.length; i < length; i++) {
                items.push({
                    // 照片src, 宽, 高
                    src: $imgs.eq(i).attr('data-original'),
                    w: parseInt($imgs[i].width, 10),
                    h: parseInt($imgs[i].height, 10)
                });
            }
            var pswp = $('.pswp')[0];
            var options = {
                index: index,
                history: false
            };
            // 显示照片墙
            var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, items, options);
            gallery.init();
        });
        // 分享
        var superShare = require('superShare/1.0.1/superShare');
        var weixinShare = require('weixin/2.0.0/weixinshare');
        var linkurl = vars.currentUrl;
        var imgurl = location.protocol + vars.imgurl;
        var title = vars.title;
        var desc = "房天下装修网，装修日记频道为您提供" + vars.desc + "装修日记，包含开工准备，拆改、水电、泥木、验收各阶段装修日记图片、材料清单等，分享装修经验，记录装修点滴。";
        new superShare({
            url: linkurl,
            title: title,
            desc: desc,
            image: imgurl
        });
        new weixinShare({
            lineLink: linkurl,
            shareTitle: title,
            descContent: desc,
            imgUrl: imgurl
        });
        // click流量统计
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            window.Clickstat.eventAdd(window, 'load', function () {
                window.Clickstat.batchEvent('wapgjiajurj_', '');
            });
        });
        $('.pingl-num').on('click', function () {
            $('.tz-box').show();
        });
        $('#qx').on('click', function () {
            $('.tz-box').hide();
        });
        $('#qd').on('click', function () {
            // 打开APP
            var openapp = require('modules/jiaju/openapp');
            openapp.init({
                openQueue: ['zxapp', 'url'],
                openappEl: '#qd',
                androidurl: location.protocol + vars.mainSite + 'client.jsp?produce=ftxzx&company=60119'
            });
        });
    };
});