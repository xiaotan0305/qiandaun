/**
 * 问答列表页主类
 * by blue
 * 20151127 blue 整理代码，优化冗长代码，更换显示效果用插件实现（我很欣赏用原生代码写出来效果，但是！如果不能保证自己写的代码包括兼容性，效率等达到要求，请不要轻易尝试），增加注释
 * modified by zdl 20160111
 */
define('modules/ask/index', ['jquery', 'iscroll/2.0.0/iscroll-lite',
    'slideFilterBox/1.0.0/slideFilterBox', 'swipe/3.10/swiper',
    'lazyload/1.9.1/lazyload', 'modules/ask/yhxw', 'app/1.0.0/appdownload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 滑动插件
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        // 筛选框插件
        var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
        // swiper滚动插件类，！！！这里为实例，不需要new创建
        var Swiper = require('swipe/3.10/swiper');
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 文档jquery对象索引
        var $doc = $(document);
        // 窗口jquery对象索引ß
        var $win = $(window);
        // 处理两个滑动轮播
        // 问答日报轮播容器
        var $container = $('#container');
        // 房产知识轮播容器
        var $zhishiCon = $('#container_zhishi');
        // 两个轮播插件的实例索引
        var swiper0 = null,
            swiper1 = null;
        // 筛选栏按钮即容器start

        // 常见问题排序和答案按钮容器
        var $tabSX = $('#tabSX');

        // 常见问题第一级选项列表容器
        var $qstCon = $('#fclass_section');
        // 常见问题选择列表容器
        var cont = $('#changeUrl');
        // 常见问题第一级选择列表
        var father = cont.find('.father');
        // 所有常见问题列表中对应第一级选项的第二级选项列表容器，包括了所有对应的选项列表容器
        var $sonCon = $('.son');

        // 筛选栏按钮即容器start

        // 常见问题和排序点击后的黑色浮层实例
        var $float = $('.float');
        var $searchCon = $('.search');
        // 计算出需要固定在顶部所需要滚动的距离
        var fixTop;
        if ($searchCon.length > 0) {
            fixTop = $searchCon.offset().top;
        }
        // 获取头部ul
        var headul = $('#head_ul');
        // 操作搜索框下面的滑动选择项
        // 滑动选项总容器节点
        var $askTag = $('#askTag');
        // 滑动选项中的所有选项节点数组
        var askTagArr = $askTag.find('a');
        // 所有选项节点个数
        var askTagArrL = askTagArr.length;
        // 选项卡总宽度索引
        var totalW = 0;
        
        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'malist'});

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.preventDefault();
        }

        /**
         * 禁止页面滑动
         */
        function unable() {
            $doc.on('touchmove', pdEvent);
        }

        /**
         * 允许页面滑动
         */
        function enable() {
            $doc.off('touchmove', pdEvent);
        }


        /**
         * 重置广告轮播宽度
         * @param el 需要重置宽度的节点
         * @param swiper 该节点下绑定的swiper插件实例
         */
        function imgResize(el, swiper) {
            if (swiper) {
                // 其宽度为它宽度乘以插件中总展示节点个数的值
                el.width(el.width() * swiper.slides.length);
            }
        }
        // 搜索框
        var $seachbox = $('#searchbox');
        // 首页常见问题按钮
        var $qstbtn = $('.questionbtn');
        // 浮层常见问题按钮
        var $fcwtbtn = $('#cjwenti');
        $fcwtbtn.on('click',function () {
            $tabSX.hide();
            $seachbox.show();
            $float.hide();
            enable();
        });
        
        // 点击常见问题按钮操作
        $qstbtn.on('click', function () {
            // 隐藏筛选栏上面的部分
            $seachbox.hide();
            // 给常见问题添加活动样式
            $tabSX.show();
            // 设置整个选择浮动在浮层背景之上
            $tabSX.addClass('tabSX');
            // 显示列表
            cont.show();
            // 显示一级列表
            father.show();
            // 如果是选中的第二级选择列表中的选项
            if (father.find('.active').length > 0) {
                var idx = father.find('.active').find('a').attr('data-father');
                // 显示到二级选择列表
                $('#son' + idx).show();
                // 设置纵向滑动筛选框
                slideFilterBox.refresh('#son' + idx);
            }
            // 将常见问题上面的分类ul背景设置成白色，遮盖下面的页面
            headul.css('backgroundColor','#FFF');
            $float.show().css('top', $tabSX.height() + 'px');
            // 禁止滑动文档
            unable();
        });

        // 事件委托，点击常见问题选项列表中的a标签选项时操作,第一级选择列表操作
        $qstCon.on('click', 'a', function () {
            // 获取当前点击选项的问题id标识
            var dataId = $(this).attr('data-father');
            // 存在选择项id并且不是常见问题选项,常见问题直接跳转页面
			$fcwtbtn.find('span').text($(this).text());
            if (dataId && dataId !== 'all') {
                // 消除所有选项选中状态
                $qstCon.find('dd').removeClass('active');
                // 设置当前点击选项为选中状态
                $qstCon.find('#fclass_' + dataId).addClass('active');
                // 隐藏所有第二级选项列表
                $sonCon.hide();
                // 根据当前点击选项展示第二级选项列表
                $('#son' + dataId).show();
                // 设置第二级选项列表纵向滚动
                slideFilterBox.refresh('#son' + dataId);
            }
        });


        // 监听历史记录变化，根据是否显示答案替换历史记录
        /*$win.on('popstate', function (e) {
            if (!/s1|s2/g.test(e.originalEvent.state.url)) {
                return;
            }
            if ($answerSpan.text() === '只看问题') {
                $('.answer').hide();
                changeUrl('s2', 's1', true);
            } else {
                $('.answer').show();
                changeUrl('s2', 's1', true);
            }
        });*/

        if (!vars.issfapp) {
            // 不是搜房app中打开时，滑动页面，将搜索框固定到顶部
            $win.on('scroll', function () {
                if ($doc.scrollTop() > fixTop) {
                    $searchCon.addClass('search-b');
                } else {
                    $searchCon.removeClass('search-b');
                }
            });
        }
        // 下一页数据标识索引
        var page = 2;
        // 更多按钮实例
        var $moreBtn = $('.more-list');
        // 点击加载更多按钮
        $moreBtn.on('click', function () {
            var url = '';
            // 没有参数时
            if (vars.classid !== '') {
                // 判断是否是三级分类
                if (vars.qtype !== '3') {
                    url = vars.askSite + '?c=ask&a=ajaxgetAskByClass&city=' + vars.city + '&classid='
                        + vars.classid + '&page=' + page + '&r=' + Math.random();
                } else {
                    url = vars.askSite + '?c=ask&a=ajaxgetAskByClass&city=' + vars.city + '&classid='
                        + vars.classid + '&qtype=3&page=' + page + '&r=' + Math.random();
                }
            } else {
                url = vars.askSite + '?c=ask&a=ajaxGetAskList&city=' + vars.city + '&page=' + page
                + '&r=' + Math.random();
            }
            $.ajax({
                url: url,
                success: function (moredata) {
                    // 判断有数据
                    if (moredata !== ' ') {
                        // 获取当前数据的jquery对象
                        var $moreCon = $(moredata);
                        // 插入到更多div之前
                        $('#moreContents').before($moreCon);
                        // 设置加载更多按钮显示
                        $moreBtn.text('加载更多');
                        page++;
                    } else {
                        // 没有数据显示及解绑事件
                        $moreBtn.text('没有更多了');
                        $moreBtn.off();
                    }
                }
            });
        });
        //  阴影浮层
        $float.on('click', function () {
            if ($float.is(':visible')) {
                // $main1Class.show();
                $float.hide();
                $seachbox.show();
                // 隐藏常见问题列表
                $tabSX.hide();
                // ++++++++++隐藏问题查看列表
                //$answerConId.is(':visible') && $answerConId.hide();
                // 删除选择活动样式
                $qstbtn.hasClass('active') && $qstbtn.removeClass('active');
                // +++++++++++去除只看问题按钮的活动样式
                // $xsycSwitchId.hasClass('active') && $xsycSwitchId.removeClass('active');
                // 删除为了将选择列表置于背景之上做的操作
                $tabSX.removeClass('tabSX');
                enable();
            }
        });

        // 搜索框下部滑动选项卡初始化
        for (var i = 0; i < askTagArrL; i++) {
            var el = askTagArr.eq(i);
            // 这里的10是外边距
            totalW += Math.round(el.outerWidth()) + 10;
        }
        // 设置滑动块宽度
        if ($askTag.length > 0) {
            $askTag.width(totalW);
            // 初始化滑动控制插件
            new IScroll('.askTag', {
                scrollX: true,
                scrollY: false,
                bindToWrapper: true
            });
        }
        // 问答日报滑动轮播图
        if ($container.length > 0) {
            // 初始化滑动轮播插件
            swiper0 = Swiper('#container', {
                // 滑动速度
                speed: 500,
                // 自动滑动时间间隔
                autoplay: 3000,
                // 无限滑动
                autoplayDisableOnInteraction: false,
                // 循环滑动
                loop: true,
                // 当前滑动块类名
                wrapperClass: 'blue_W',
                // 滑动块中每个节点的类名
                slideClass: 'blue_S',
                // 导航容器
                pagination: '#focus_daily',
                // 单个导航使用的元素名称
                paginationElement: 'span',
                // 展示状态类名
                bulletActiveClass: 'cur'
            });
            imgResize($container.find('.blue_W'), swiper0);
        }

        // 房产知识横切
        if ($zhishiCon.length > 0) {
            swiper1 = Swiper('#container_zhishi', {
                speed: 500,
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                loop: true,
                wrapperClass: 'blue_W',
                slideClass: 'blue_S',
                pagination: '#focus_house',
                paginationElement: 'span',
                bulletActiveClass: 'cur'
            });
            imgResize($zhishiCon.find('.blue_W'), swiper1);
        }
        // ！这里需要特别注意，当页面发生重置性变化时，比如用户拖拽导致窗口变小，需要重置宽度
        if ($container.length > 0 || $zhishiCon.length > 0) {
            // 监听页面变化重置两个滑动轮播的滑动块宽度
            $(window).on('resize', function () {
                swiper0 && imgResize($container.find('.blue_W'), swiper0);
                swiper1 && imgResize($zhishiCon.find('.blue_W'), swiper1);
            });
        }

        /* 图片惰性加载*/
        require('lazyload/1.9.1/lazyload');
        var swipLazy = $('.lazyload'), delay = 0;
        if (swipLazy) {
            swipLazy.lazyload();
            swipLazy.each(function (index, ele) {
                setTimeout(function () {
                    var thisEle = $(ele);
                    if (thisEle.attr('src') !== thisEle.attr('data-original')) {
                        thisEle.attr('src', thisEle.attr('data-original'));
                    }
                }, delay + 20);
            });
        }
        // 下载弹层
        require.async('app/1.0.0/appdownload', function () {
            // 顶部弹层
            $('#indexDownload').openApp({
                position: 'askIndexTopBtn'
            });
        });
    };
});