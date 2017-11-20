/**
 * blog详情页
 * by zhangdaliang
 * 20160415
 */
define('modules/blog/detail', ['jquery', 'lazyload/1.9.1/lazyload', 'swipe/3.10/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 从页面获取的参数
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // swiper滚动插件类，！！！这里为实例，不需要new创建
        var Swiper = require('swipe/3.10/swiper');
        // =====
        // 上划加载下一篇
        var tru = true;
        // 当前url地址
        var nowUrl = [];
        nowUrl[0] = window.location.href;
        // 页面传递的url地址
        var dropDownLists = vars.dropDownList.split(',');
        // 最终的url地址
        var dropDownList = nowUrl.concat(dropDownLists);
        var num = 0;
        var height = [];
        var title = [];
        height[0] = 0;
        title[0] = $('.xqBox h1:eq(0)').html() + '- 房天下博客';
        var myHeight;
        var $moreListId = $('#morelist');
        var replaceURL = function () {
            var i = 0;
            // 文档顶部距离窗口顶部的的距离（浏览器窗口之上隐藏的文档高度）
            myHeight = $(document).scrollTop();
            while (title[i]) {
                if (height[i] > myHeight) {
                    break;
                }
                i++;
            }
            i--;
            $('title').html(title[i]);
            window.history.replaceState({}, title[i], dropDownList[i]);
        };
        // 判断是否加载了用户行为ubjs文件，执行猜你喜欢展示
        if ('undefined' !== typeof _ub) {
            setCaiNiXiHuan($('.cnxh'),0);
        } else {
            require.async('jsub/_ubm.js', function () {
                setCaiNiXiHuan($('.cnxh'),0);
            });
        }
        $('.showmore').on('click', function () {
            $(this).parent().find('li').show();
            $(this).hide();
        })
        function scrollArticle() {
            if (num < 5) {
                // 文章在下拉的时候更改文本提示
                $moreListId.html('<span><i></i>努力加载中...</span>');
                if (tru) {
                    tru = false;
                    if (dropDownList[num + 1]) {
                        $.ajax({
                            type: 'get',
                            url: dropDownList[num + 1],
                            data: {
                                // 后台用于判断是否是第一屏
                                istw: 'n'
                            },
                            success: function (result) {


                                // 下拉加载更多文章一共就五篇文章 当加载到第五篇文章时将底部的加载更多隐藏
                                if (num === 4) {
                                    $moreListId.hide();
                                }
                                // 防止加载过快时数组值未定义
                                while (title[num]) {
                                    num++;
                                }
                                var $result = $(result);
                                $moreListId.html('<a class="bt">上拉加载下一篇博文</a>');
                                $('#dropDownList').before($result);
                                var $cnxh = $($result[1]);
                                $($result[0]).find('.lazyload').lazyload();

                                // $('.lazyload').lazyload();
                                // window.history.replaceState({}, title[num], dropDownList[num]);
                                // window.history.pushState({}, title[num], dropDownList[num]);
                                // 存放该片文章加载出来时 文档在窗口顶部隐藏的高度
                                height[num] = $(document).scrollTop();
                                // 存放该片文章的标题
                                title[num] = $(result).find('h1:eq(0)').html() + '- 房天下博客';

                                tru = true;
                                // 判断是否加载了用户行为ubjs文件，执行猜你喜欢展示
                                if ('undefined' !== typeof _ub) {
                                    setCaiNiXiHuan($cnxh,num);
                                } else {
                                    require.async('jsub/_ubm.js', function () {
                                        setCaiNiXiHuan($cnxh,num);
                                    });
                                }
                                $('.showmore').on('click', function () {
                                	$(this).parent().find('li').show();
                                	$(this).hide();
                                })
                            },
                            error: function () {
                                tru = true;
                            }
                        });
                    }
                }
            }
        }

        // 当页面滑动到距离底部350时执行aiax请求下一篇 并改变地址栏中url的值
        $(document).on('scroll', function () {
            if ($(document).scrollTop() > $(document).height() - $(window).height() - 350) {
                scrollArticle();
            }
            replaceURL();
        });
        // 第一屏文章太短时 触发以下操作
        if ($(document).height() <= $(window).height()) {
            scrollArticle();
            replaceURL();
        }

        /* 猜你喜欢*/
        var setCaiNiXiHuan = function ($cnxh,num) {
            var business = '';
            _ub.city = vars.cityname;

            _ub.request('vmg.business,vmh.style,vmh.roomtype,vmn.unitprice', function () {
                // 选取权重最大的值 _ub.load(2)是时间最近的值
                _ub.load(1);
                // 以下添加业务逻辑
                // console.log(_ub['vmg.business']);// 使用_ub['编号']的形式来获取，如： _ub['vmn.unitprice']
                business = _ub['vmg.business'];
                switch (business) {
                    case 'N':
                        business = 'xf';
                        break;
                    case 'E':
                        business = 'esf';
                        break;
                    case 'H':
                        business = 'jiaju';
                        break;
                    default:
                        business = 'xf';
                        break;
                }
                if (business === 'jiaju') {
                    var style = _ub['vmh.style'] || '';
                    var roomType = _ub['vmh.roomtype'] || '';
                    $.get(vars.blogSite + '?c=blog&a=ajaxCaiNiXiHuan&city=' + vars.city + '&type=' + business + '&style='
                        + style + '&roomType=' + roomType , function (data) {
                        if (data) {
                            var $data = $(data);
                            $cnxh.before($data);
                            $data.find('.jj-fav').addClass('cnxh' + num);
                            $data.find('.swipe-point').addClass('point' + num);
                            if (num !== 0) {
                                $data.find('.jj-fav').removeClass('cnxh0');
                                $data.find('.swipe-point').removeClass('point0');
                            }
                            $data.find('.lazyload').lazyload();
                            $data.find('.lazyload').each(function () {
                                var $that = $(this);
                                if ($that.attr('data-original') && $that.attr('src') !== $that.attr('data-original')) {
                                    $that.attr('src', $that.attr('data-original'));
                                }
                            });
                            $('.fav-list').css('width', $('.fav-list').find('li').eq(0).width() * 5);
                            // 初始化滑动轮播插件
                            Swiper('.cnxh' + num , {
                                // 滑动速度
                                speed: 500,
                                // 自动滑动时间间隔
                                autoplay: 3000,
                                // 无限滑动 如果设置为true用户手动滑动后将不会再自动滑动
                                autoplayDisableOnInteraction: false,
                                // 循环滑动
                                loop: true,
                                // 当前滑动块类名
                                wrapperClass: 'fav-list',
                                // 滑动块中每个节点的类名
                                slideClass: 'blue_S',
                                // 导航容器
                                pagination: '.point' + num,
                                // 单个导航使用的元素名称
                                paginationElement: 'li',
                                // 展示状态类名
                                bulletActiveClass: 'cur'
                            });
                        }
                    });
                } else if (business === 'esf') {
                    var unitprice = _ub['vmn.unitprice'] || '';
                    $.get(vars.blogSite + '?c=blog&a=ajaxCaiNiXiHuan&city=' + vars.city + '&type=' + business + '&unitprice='
                        + unitprice, function (data) {
                        if (data) {
                            var $data = $(data);
                            $cnxh.after($data);
                            $data.find('.lazyload').lazyload();
                        }
                    });
                } else {
                    var unitprice = _ub['vmn.unitprice'] || '';
                     $.get(vars.blogSite + '?c=blog&a=ajaxCaiNiXiHuan&city=' + vars.city + '&type=' + business + '&unitprice='
                        + unitprice, function (data) {
                        if (data) {
                            var $data = $(data);
                            $cnxh.after($data);
                            $data.find('.lazyload').lazyload();
                        }
                    });

                }

            });
        };

    };
});