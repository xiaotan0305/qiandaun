define('modules/bask/index', ['jquery', 'loadMore/1.0.1/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // jquery库
        var $ = require('jquery');
        // 问题加载更多
        var loadMore = require('loadMore/1.0.1/loadMore');
        var $askind = $('.ask-kinds');
        // 头部固定问题
        $askind.css({position: 'fixed', 'z-Index': '10000', background: '#ffffff'});
        if (vars.nobanner === 'error') {
            $('.goodTag').css('marginTop', '48px');
            $('.concernBuild').css('marginTop', '48px');
        }
        // 集团类别不是1,2时隐藏常见问题按钮,此时去掉下方的margin-top
        if ($askind.is(':hidden')) {
            $('.goodTag').css('marginTop', '0px');
            $('.concernBuild').css('marginTop', '0px');
        }
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();

        // 文档jquery对象索引
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
        if (vars.float !== 'hide') {
            unable();
        }
        // 常见问题按钮
        var $question = $('.question').find('li');
        var $a = $question.find('a');
        $a.on('click', function () {
            var $this = $(this);
            // 给当前点击的按钮加样式
            if (!$this.hasClass('active')) {
                $a.removeClass('active');
                $this.addClass('active');
            }
            // 切换常见问题与楼盘问题列表
            if ($this.hasClass('lpquestion') || $this.hasClass('xqquestion')) {
                // 隐藏常见问题列表
                $('.cjquestionlist').hide();
                // 隐藏常见问题错误页(如果有)
                $('.cjquestionerror').hide();
                // 展示楼盘/小区问题列表
                $('.lpquestionlist').show();
                // 展示楼盘/小区错误页(如果有)
                $('.lpquestionerror').show();
                // 隐藏擅长标签
                $('.goodTag').hide();
                // 展示关注楼盘/小区
                $('.concernBuild').show();
                // 隐藏常见问题的加载更多
                $('.cjMore').hide();
                // 显示楼盘/小区问题的加载更多
                $('.lpxqMore').show();
            } else if ($this.hasClass('cjquestion')) {
                // 隐藏楼盘/小区问题列表
                $('.lpquestionlist').hide();
                // 隐藏楼盘/小区错误页(如果有)
                $('.lpquestionerror').hide();
                // 展示常见问题列表
                $('.cjquestionlist').show();
                // 展示常见问题错误页(如果有)
                $('.cjquestionerror').show();
                // 展示擅长标签
                $('.goodTag').show();
                // 隐藏关注楼盘/小区
                $('.concernBuild').hide();
                // 显示常见问题的加载更多
                $('.cjMore').show();
                // 隐藏楼盘/小区的加载更多
                $('.lpxqMore').hide();
            }
        });

        /**
         * 点击楼盘问题或常见问题页面原始位置不动
         * @type {number}
         */
        var sScroll1 = 0,
            sScroll2 = 0;
        localStorage.a = '0';
        localStorage.b = '0';

        $(document).scrollTop('0');
        // 点击常见问题
        $('.cjquestion').click(function () {
            // 获取当前页面的滚动值
            sScroll1 = $(document).scrollTop();
            // 存储当前页面的滚动值
            localStorage.a = sScroll1;
            // 对新的页面赋旧值
            $(document).scrollTop(localStorage.b);
        });
        // 点击楼盘问题
        $('.lpquestion').click(function () {
            // 获取当前页面的滚动值
            sScroll2 = $(document).scrollTop();
            // 存储当前页面的滚动值
            localStorage.b = sScroll2;
            // 对新的页面赋旧值
            $(document).scrollTop(localStorage.a);
        });

        // 楼盘问题总数-传1防止loadMore.js报错
        var lptotal = vars.lptotalCount > 0 ? vars.lptotalCount : 1;
        // 常见问题总数
        var cjtotal = vars.cjtotalCount > 0 ? vars.cjtotalCount : 1;
        // 楼盘问题加载更多


        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + '?c=bask&a=ajaxGetMoreQuestion&cityname=' + vars.cityname + '&grouptype=' + vars.grouptype + '&sort=2',
            // 每页加载数据条数
            perPageNum: 20,
            // 总数据条数
            total: lptotal,
            // 当前页加载数据条数
            pagesize: 20,
            // 当前加载更多执行所需的元素实例
            activeEl: '#lpHref',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'active',
            // 加载更多容器的类名或者id或者jquery对象
            content: '.lpquestionlist',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '.lpxqMore',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '.lpxqMorebox',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a href="javascript:void(0);">努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a href="javascript:void(0);">上划加载更多</a>',
            firstDragFlag: false
        });
        loadMore.add({
            // 加载更多接口地址  tag是用来区分用户是否设置过标签,没有设置过要调用不同的接口
            url: vars.askSite + '?c=bask&a=ajaxGetMoreQuestion&cityname=' + vars.cityname + '&grouptype=' + vars.grouptype + '&tag=' + vars.tag + '&sort=1',
            // 每页加载数据条数
            perPageNum: 20,
            // 总数据条数
            total: cjtotal,
            // 当前页加载数据条数
            pagesize: 20,
            // 当前加载更多执行所需的元素实例
            activeEl: '#cjHref',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'active',
            // 加载更多容器的类名或者id或者jquery对象
            content: '.cjquestionlist',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '.cjMore',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '.cjMorebox',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a href="javascript:void(0);">努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a href="javascript:void(0);">上划加载更多</a>',
            firstDragFlag: false
        });
        loadMore.init();

        $('.close').on('click', function(){
            $('.w-outbg').hide();
            $('.w-outbox').hide();
            enable();
        });
    };
});