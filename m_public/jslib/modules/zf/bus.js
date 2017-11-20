/**
 * 租房公交查询列表页
 * create by zdl 20160512
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/zf/bus',['jquery','lazyload/1.9.1/lazyload','loadMore/1.0.1/loadMore'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        // 引入jquery
        var $ = require('jquery');
        // 引入页面中通过input传入的参数
        var vars = seajs.data.vars;
        // 引入lazyload组件
        require('lazyload/1.9.1/lazyload');
        // 引入下拉加载更多组件
        var loadMore = require('loadMore/1.0.1/loadMore');
        // 首屏图片添加lazyload
        $('.lazyload').lazyload();

        var $doc = $(document);

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

        // 筛选栏容器
        var $tabBox = $('#tabSX');
        // 给筛选栏中的li标签添加点击事件
        $('.flexbox').find('li').on('click',function () {
            //  存取当前点击的li标签元素
            var thisEl = $(this);
            // idVal为当前点击的筛选栏li标签元素的id
            var idVal = thisEl.attr('id');
            // contFlexbox为点击的筛选栏li标签元素对应的内容元素
            var contFlexbox = $('#' + idVal + '_div');
            // 点击筛选栏的样式切换
            thisEl.toggleClass('active').siblings().removeClass('active');
            // 点击筛选栏对应的内容容器显示隐藏切换
            contFlexbox.toggle().siblings().not('ul').hide();
            // tabBox容器样式切换以及浮层显示隐藏切换
            if (thisEl.hasClass('active')) {
                // 点击的li筛选元素有选中样式 筛选容器添加tabSX样式
                $tabBox.addClass('tabSX');
                // 点击的li筛选元素有选中样式 显示浮层
                $('#tabFloat').show();
                // 禁止页面滑动
                unable();
            } else {
                // 点击的li筛选元素没有选中样式 筛选容器添加tabSX样式
                $tabBox.removeClass('tabSX');
                // 点击的li筛选元素没有选中样式 显示浮层
                $('#tabFloat').hide();
                // 允许页面滑动
                enable();
            }
        });
        // 浮层元素添加点击事件
        $('#tabFloat').on('click',function () {
            // 去除筛选容器的tabSX样式
            $tabBox.removeClass('tabSX');
            // 隐藏筛选容器中的类容div元素
            $tabBox.find('.lbTab > div').hide();
            // 去除筛选栏中li标签元素的选中样式
            $tabBox.find('.lbTab > ul > li').removeClass('active');
            // 隐藏浮层元素
            $(this).hide();
            // 允许页面滑动
            enable();
        });

        // 调用上拉加载更多
        loadMore.add({
            // 加载更多请求地址
            url: vars.zfSite + vars.nowUrl + 'c=zf&a=ajaxGetBus' + '&city=' + vars.city + '&busStation=' + vars.busStation,
            // 总条数
            total: vars.total,
            // 首屏加载数据条数
            pagesize: 30,
            // 初始化下拉每次加载更多的条数
            pageNumber: 10,
            // lazyload样式
            lazyMark: '.lazyload',
            // 加载更多列表容器
            content: '#content',
            // 加载更多div
            moreBtn: '#drag',
            // 加载中提示内容更换容器
            loadPrompt: '.draginner',
            // 加载完成后的显示内容,'加载更多'为默认
            loadedTxt: '查看更多楼盘'
        });
        loadMore.init();
    };
});
