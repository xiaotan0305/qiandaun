/**
 * Created by zxw on 15-8-18.
 * modified by LXM on 15-9-15.
 */
define('modules/jiaju/lglist', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        //惰性加载
        var lazy = require('lazyload/1.9.1/lazyload');
        lazy('.lazyload').lazyload();
          // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });

        // 搜索用户行为收集20160114
        var ubpage = 'mjjatlaslist';
        require.async('jsub/_vb.js?c=' + ubpage);
        require.async('jsub/_ubm.js', function () {
            var b = 1;
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = vars.ns;
            var key = encodeURIComponent($('#S_searchtext').val());
            var style, roomtype;
            if (parseInt(vars.tagNumber) > 0 && parseInt(vars.tagNumber) <= 10) {
                // 风格
                style = encodeURIComponent(vars.tag);
            }
            if (parseInt(vars.tagNumber) > 10 && parseInt(vars.tagNumber) <= 20) {
                roomtype = encodeURIComponent(vars.tag);
            }
            var pTemp = {
                'vmg.page': ubpage,
                'vmh.key': key,
                'vmh.style': style,
                'vmh.roomtype': roomtype
            };
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b, p);
        });
        <!-- 对用户的相关信息进行收集 end -->

        var spanBtn = $('.btn span');
        var zxCategory = $('.zx-category');
        $(function () {
            spanBtn.click(function () {
                $('.zx-category').toggleClass('show');
            });

            // 下拉搜索栏添加滑动功能---LXM
            // start--->>>
            var startY;
            spanBtn.bind('touchstart', function (event) {
                var startTouch = event.originalEvent.touches[0];
                startY = startTouch.clientY;
            });
            spanBtn.bind('touchmove', function (event) {
                event.preventDefault();
                var moveTouch = event.originalEvent.touches[0];
                var moveY = moveTouch.clientY;
                if (moveY > startY) {
                    $('.zx-category').addClass('show');
                } else {
                    $('.zx-category').removeClass('show');
                }
            });

            var categoryStartY;
            zxCategory.bind('touchstart', function (event) {
                var startTouch = event.originalEvent.touches[0];
                categoryStartY = startTouch.clientY;
            });
            zxCategory.bind('touchmove', function (event) {
                event.preventDefault();
                var moveTouch = event.originalEvent.touches[0];
                var moveY = moveTouch.clientY;
                if (moveY <= categoryStartY) {
                    zxCategory.removeClass('show');
                }
            });
            // <<------end
        });
        $('.cont a').each(function () {
            if ($(this).text() === vars.tag) {
                $(this).addClass('cur');
            }
        });
        var d = window.navigator.userAgent;
        if (vars.browser_abnormal === 1 && !/MicroMessenger/i.test(d)) {
            zxCategory.css('top', 0);
        }
        $(window).scroll(function () {
            var scheight = document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop;
            if (vars.browser_abnormal === 1 && !/MicroMessenger/i.test(d)) {
                zxCategory.css('top', 0);
            } else if (scheight === 0) {
                zxCategory.css('top', '44px');
            } else if (scheight > 0 && scheight <= 44) {
                zxCategory.css('top', 44 - parseInt(scheight) + 'px');
            } else {
                zxCategory.css('top', 0);
            }
        });

        // end    
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxlglist&style=' + vars.style + '&room='
                + vars.room + '&q=' + vars.q + '&tagname=' + vars.tagname,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 10,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart'
        });

        // 监听搜素按钮
        $(window).keydown(function (event) {
            if (event.which === 13) {
                $('a.btn').trigger('click');
            }
        });

        $('a.btn').click(function () {
            var nowUrl = window.location.href.toString();
            var q = encodeURIComponent($('#S_searchtext').val());
            if (q) {
                if (nowUrl.indexOf('?q=') !== -1) {
                    window.location.href = nowUrl.replace(/\?q=.+/g, '?q=' + q);
                } else if (nowUrl.indexOf('&q=') !== -1) {
                    window.location.href = nowUrl.replace(/&q=.+/g, '&q=' + q);
                } else if (nowUrl.indexOf('.html') !== -1) {
                    window.location.href = nowUrl + '?q=' + q;
                } else {
                    window.location.href = nowUrl + '&q=' + q;
                }
            }
        });
    };
});