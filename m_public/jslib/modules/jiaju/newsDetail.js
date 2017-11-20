/**
 * Created by LXM on 15-3-10.
 * midified by LXM on 15-9-18.
 */
define('modules/jiaju/newsDetail', ['jquery', 'modules/jiaju/ad', 'app/1.0.0/appdownload', 'lazyload/1.9.1/lazyload', 'modules/jiaju/freeSignup', 'photoswipe/4.0.7/photoswipe', 'photoswipe/4.0.7/photoswipe-ui-default.min', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 广告位
        require.async(['modules/jiaju/ad']);
        $('#moreLoad').click(function () {
            $('#moreLoad').hide();
            $('#conWordMore').show();
            return false;
        });
        // 统一报名
        var freeSignup = require('modules/jiaju/freeSignup');
        freeSignup(true);
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload img').lazyload();
        // 自动推送百度begin
        var bPushScript = document.createElement('script');
        bPushScript.async = true;
        bPushScript.src = 'http://push.zhanzhang.baidu.com/push.js';
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(bPushScript);
        // 自动推送百度end

        // photoswipe
        (function () {
            var $mainContent = $('.mainContent');
            var $imgs = $mainContent.find('img');
            var items = [];
            var pswp = document.querySelector('.pswp');
            var length = $imgs.length;
            $imgs.each(function (index, el) {
                el.dataset.index = index;
                var img = new Image();
                $(img).on('load error', imgLoaded(index));
                img.src = $(el).data('original');
            }).on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
            });

            function imgLoaded(i) {
                return function () {
                    length--;
                    items[i] = {
                        w: this.naturalWidth || 450,
                        h: this.naturalHeight || 450,
                        src: this.src,
                        index: i
                    };
                    if (!length) {
                        $imgs.on('click', function () {
                            var gallery = new window.PhotoSwipe(pswp, window.PhotoSwipeUI_Default, items, {
                                index: +this.dataset.index,
                                history: false
                            });
                            gallery.init();
                        });
                    }
                };
            }
        })();

        require.async('app/1.0.0/appdownload', function ($) {
            $('.bandown').openApp('//download.3g.fang.com/soufun_android_31167.apk');
        });

        function dataurlClick(dom) {
            dom.bind('click', function () {
                setTimeout(function () {
                    window.location.href = dom.attr('data-url');
                }, 500);
            });
        }

        $(document).ready(function () {
            $('[data-url]').each(function (i, n) {
                var thisDom = $(n);
                dataurlClick(thisDom);
            });
            var strurl = window.location.search;
            if (strurl.indexOf('?') !== -1) {
                if (strurl.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                    $('.bandown').css('display', 'none');
                    $('.otherlist').each(function () {
                        $(this).css('display', 'none');
                    });
                    $('.mainContent').find('a').has('img').attr('href', null);
                }
            }
        });
        var page = 'mzxpage';
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            yhxw(0);
        });

        function yhxw(type) {
            _ub.city = vars.cityname;
            // 业务---资讯
            _ub.biz = 'i';
            // 方位（南北方) ，北方为0，南方为1
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 用户动作（浏览0）
            var b = type;
            var channel = '家居';
            var pTemp = {
                'vmi.infocategory': encodeURIComponent(channel),
                'vmi.city': encodeURIComponent(vars.cityname),
                'vmg.page': page,
                'vmi.newsid': vars.newsid
            };
            var p = {};
            // 若p_temp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            // 用户行为(格式：'字段编号':'值')
            // 收集方法
            _ub.collect(b, p);
        }

        // 添加悬浮分享按钮20161025
        var oMore = $('.option-more'),
            toTop = $('.toTop'),
            newsBody = $('body'),
            oCont = $('.option-cont');
        oCont.on('click', function (e) {
            e.stopPropagation();
            oCont.toggleClass('option-plus-active');
            oMore.toggleClass('option-panel-active');
        });
        // 点击更多里的顶部按钮事件
        toTop.on('click', function () {
            animateTo(0);
        });

        function animateTo(pos) {
            newsBody.animate({
                scrollTop: pos
            }, 200);
        }
        var $xgwzList = $('.xgwz_list');
        var $rmwzList = $('.rmwz_list');
        var $moreList = $('.moreList');
        var xgwzAjaxFlag = true;
        var onceClick = true;

        // 添加热门文章tab
        $('.otherlist').find('.tablist a').on('click',function () {
            var $target = $(this);
            if($target.hasClass('a-xgwz')) {
                !$target.hasClass('active') && $target.addClass('active');
                $target.siblings().removeClass('active');
                $xgwzList.show();
                $rmwzList.hide();
            } else {
                if(onceClick) {
                    xgwzAjaxFn(1);
                    onceClick = false;
                }
                if(!onceClick) {
                    $xgwzList.hide();
                    $rmwzList.show();
                    !$target.hasClass('active') && $target.addClass('active');
                    $target.siblings().removeClass('active');
                }
            }
        })
        function xgwzAjaxFn(time) {
            var city = vars.city;
            var title = encodeURIComponent(vars.title);
            var url = vars.jiajuSite + '?c=jiaju&a=ajaxGetRelatedArticles&city=' + city + '&title=' + title + '&ajaxTime=' + time + '&random=' + Math.random();
            if(xgwzAjaxFlag) {
                xgwzAjaxFlag = true;
                $.ajax({
                    url:url,
                    success:function (data) {
                        var wrap = '<ul class="new_list"></ul>';
                        $('.otherlist').find('.tablist a').eq(0).removeClass('active');
                        $('.otherlist').find('.tablist a').eq(1).addClass('active');
                        if(data.indexOf('loadfail') > -1) {
                           $rmwzList.html(data).show();
                           $moreList.show();
                        } else if(data.indexOf('nopic') > -1) {
                           $rmwzList.html(data).show();
                           $moreList.hide();
                        } else {
                            wrap += data;
                            $rmwzList.html(wrap).show();
                            $moreList.hide();
                        }
                        $xgwzList.hide();


                    },
                    complete: function () {
                        xgwzAjaxFlag = true;
                    }
                })
            }
        }
        $moreList.on('click',function () {
            xgwzAjaxFn(2);
            $moreList.hide();
        })


        // 分享浮层
        /* 分享代码*/
        var SuperShare = require('superShare/1.0.1/superShare');
        var weixinshare = require('weixin/2.0.0/weixinshare');
        var shareurl = decodeURIComponent(vars.SourcePageUrl);
        var imageUrl = location.protocol + vars.public + '201511/images/jiajunews.jpg';
        var imgs = $('.mainContent').find('img');
        for (var i=0,len=imgs.length;i<len;i++) {
            if(+imgs.eq(i).attr('img-width')>300 && +imgs.eq(i).attr('img-height')>300) {
                imageUrl = location.protocol + imgs.eq(i).attr('data-original');
                break;
            }
        }
        var title = vars.title + '_房产资讯-' + vars.cityname + '手机房天下';
        var wxDescription = vars.description === '' ? '把脉房地产市场、实时追踪政策动向、捕捉最新商业趋势，海量资讯尽在房天下。' : vars.description;
        // 分享按钮
        var shareA = $('.share');
        shareA.on('click', function () {
            _ub.biz = 'i';
            // 方位 ，网通为0，电信为1，如果无法获取方位，记录0
            _ub.location = 0;
            var b = 22;
            var p = {
                'vmg.page': page,
                'vmi.newsid': vars.newsid
            };
            _ub.collect(b, p);

            oCont.removeClass('option-plus-active');
            oMore.removeClass('option-panel-active');
        });
        var config = {
            // 分享的内容title
            title: title,
            // 分享时的图标
            image: imageUrl,
            // 分享内容的详细描述
            desc: wxDescription,
            // 分享的链接地址
            url: shareurl,
            // 分享的内容来源
            from: ' —搜房' + vars.cityname + '家居资讯'
        };
        new SuperShare(config);

        window.UA.name === '微信客户端' && new weixinshare({
            shareTitle: title,
            descContent: wxDescription,
            lineLink: shareurl,
            imgUrl: imageUrl
        });
    };
});