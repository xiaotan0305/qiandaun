/**
 * 问答列表页主类
 * by blue
 * 20151127 blue 整理代码，优化冗长代码，更换显示效果用插件实现（我很欣赏用原生代码写出来效果，但是！如果不能保证自己写的代码包括兼容性，效率等达到要求，请不要轻易尝试），增加注释
 * modified by zdl 20160111
 */
define('modules/ask/payAskList', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'swipe/3.10/swiper',
    'lazyload/1.9.1/lazyload','iscroll/2.0.0/iscroll-lite', 'modules/ask/yhxw', 'app/1.0.0/appdownload', 'loadMore/1.0.0/loadMore',
    'weixin/2.0.1/weixinshare', 'slideFilterBox/1.0.0/slideFilterBox'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 筛选框插件
        var scrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        // swiper滚动插件类，！！！这里为实例，不需要new创建
        var Swiper = require('swipe/3.10/swiper');
        // 筛选框插件
        var slideFilterBox = require('slideFilterBox/1.0.0/slideFilterBox');
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 文档jquery对象索引
        var $doc = $(document);
        // 窗口jquery对象索引ß
        var $win = $(window);
        var $searchCon = $('.search');
        // 问答日报轮播容器
        var $container = $('#container');

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

        // 常见问题和排序点击后的黑色浮层实例
        var $float = $('.float');

        // 获取头部ul
        var headul = $('#head_ul');

        // 计算出需要固定在顶部所需要滚动的距离
        var fixTop;
        if ($searchCon.length > 0) {
            fixTop = $searchCon.offset().top;
        }

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

        var page = 2;
        $('#newsload').on('click', function() {
            var allpage = Math.ceil(vars.newspayCount/20)
            $.get(vars.askSite + '?c=ask&a=ajaxGetPayAskInfoList&page=' + page, function(data) {
                if (data) {
                    $('#paynewcontent').append(data);
                    page++;
                    if (page>allpage) {
                        $('#newsload').hide();
                    }
                    /*图片惰性加载*/
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
                }
            })
        });

        /*热门专家滑动效果*/
        var $ulList = $('#ulList');
        var expertNum = $ulList.find('li').length;
        if (expertNum > 0) {
            $ulList.css('width',expertNum * 305 + 'px');
            new scrollCtrl('#expertList',{
                scrollX:true,
                scrollY:false,
                eventPassthrough: true,
                preventDefault: false
            });
        }
        /*热门分类滑动效果*/
        var hotClassUlList = $('#hotClassUlList');
        var hotClassNum = hotClassUlList.find('li').length;
        if (hotClassNum > 0) {
            hotClassUlList.css('width',hotClassNum * 79 + 'px');
            new scrollCtrl('#hotClassList',{
                scrollX:true,
                scrollY:false,
                eventPassthrough: true,
                preventDefault: false
            });
        }
        
        // 上拉加载更多
        var url = '';
        var loadMore = require('loadMore/1.0.0/loadMore');
        url = vars.askSite + '?c=ask&a=ajaxGetAskList&city=' + vars.city + '&r=' + Math.random();
        loadMore({
            url: url,
            total: vars.askListCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#askload',
            loadPromptID: '#askload',
            contentID: '#askcontent',
            loadAgoTxt: '<a href="javascript:void(0);">加载更多</a>',
            loadingTxt: '<a href="javascript:void(0);">加载中...</a>',
            firstDragFlag: true
        });

        if ($('#wentilist')) {
            url = vars.askSite + '?c=ask&a=ajaxGetMoreProblem&classid=' + vars.classid;
            loadMore({
                url: url,
                total: vars.problemCount,
                pagesize: 20,
                pageNumber: 20,
                moreBtnID: '#moreContents',
                loadPromptID: '#moreContents',
                contentID: '#wentilist',
                loadAgoTxt: '<a class="more-list" href="javascript:void(0);" id="wapasksy_D14_07">加载更多</a>',
                loadingTxt: '<a class="more-list" href="javascript:void(0);" id="wapasksy_D14_07">加载中...</a>',
                firstDragFlag: true
            });
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


        // 解决专题图片高度浏览器不兼容问题
        var mySwipe = $('#myBanner');
        mySwipe.find('.lazyload').lazyload();
        mySwipe.find('.lazyload').each(function () {
            var $that = $(this);
            if ($that.attr('data-original') && $that.attr('src') !== $that.attr('data-original')) {
                $that.attr('src', $that.attr('data-original'));
            }
        });
        var $swipCon = $('.blue_M');
        var liLen = parseInt(vars.bannerCount) + 2;
        var winWidth = $(document).width();
        //轮播个数
        var bannerCount = vars.bannerCount;
        //判断是否需要轮播
        var isautoplay;
        //判断是否循环滑动
        var isloop;
        if (bannerCount ==  1) {
            isautoplay = 0;
            isloop = false;
        } else {
            isautoplay = 3000;
            isloop = true;
        }
        $swipCon.css('width', winWidth * liLen + 'px');
        // 初始化滑动轮播插件
        Swiper('#myBanner', {
            // 滑动速度
            speed: 500,
            // 自动滑动时间间隔
            autoplay: isautoplay,
            // 无限滑动 如果设置为true用户手动滑动后将不会再自动滑动
            autoplayDisableOnInteraction: false,
            // 循环滑动
            loop: isloop,
            // 当前滑动块类名
            wrapperClass: 'blue_M',
            // 滑动块中每个节点的类名
            slideClass: 'blue_S',
            // 导航容器
            pagination: '#focus_daily',
            // 单个导航使用的元素名称
            paginationElement: 'li',
            // 展示状态类名
            bulletActiveClass: 'cur'
        });
        // 问答日报滑动轮播图
        if ($container.length > 0) {
            // 初始化滑动轮播插件
            var swiper0 = Swiper('#container', {
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
                pagination: '#focus_askDaily',
                // 单个导航使用的元素名称
                paginationElement: 'span',
                // 展示状态类名
                bulletActiveClass: 'cur'
            });
            imgResize($container.find('.blue_W'), swiper0);
        }
        // 下载弹层
        require.async('app/1.0.0/appdownload', function () {
            // 顶部弹层
            $('#indexDownload').openApp({
                position: 'askIndexTopBtn'
            });
        });
        var Weixin = require('weixin/2.0.1/weixinshare');
        new Weixin({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: vars.cityname + '房产问答-房天下问答',
            descContent: '房天下问答，专业的房产问答平台',
            lineLink: location.href,
            imgUrl: window.location.protocol + vars.public + '201511/images/app_fang.png',
            // 对调标题 和 描述(微信下分享到朋友圈默认只显示标题,有时需要显示描述则开启此开关,默认关闭)
            swapTitle: false
        });
    };
});