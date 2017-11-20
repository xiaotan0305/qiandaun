/**
 * 相关专题列表页JS
 * by hxxiao 20160809
 */
define('modules/ask/topiclist', ['jquery','lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        // 文档jquery对象索引
        var $doc = $(document);
        // 专家加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        var vars = seajs.data.vars;
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxGetMoreTopic&topictype=' + vars.topictype,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#loadMore',
            loadPromptID: '#loadMore',
            contentID: '.ztlist',
            loadAgoTxt: '<span><i></i>加载更多</span>',
            loadingTxt: '<span><i></i>努力加载中...</span>',
            loadedTxt: '<span><i></i>加载更多</span>',
            lazyCon: 'img[data-original]',
            firstDragFlag: false
        });
        // 惰性加载
        require('lazyload/1.9.1/lazyload');
        $('img[data-original]').lazyload();

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
        // 专题类型列表容器
        var $tabSX = $('.tabSX');
        // 黑色浮层实例
        var $float = $('.float');
        // $main1Class 筛选栏上部的div
        var $main1Class = $('.main1');
        var headUl = $('#head_ul');
        // 展示筛选菜单
        $('#experttitle').on('click',function () {
            $tabSX.show();
            // 隐藏筛选栏上面的部分
            $main1Class.hide();
            // 设置整个选择浮动在浮层背景之上
            $tabSX.addClass('tabSX');
            // 显示列表
            $float.show().css('top', $tabSX.height() + 'px');
            // 将头部ul背景设置成白色，遮盖下面的页面
            headUl.css('backgroundColor','#FFF');
            // 禁止滑动文档
            unable();
        });
        // 隐藏筛选菜单
        $('#topicDiv').on('click',function () {
            $tabSX.hide();
            $main1Class.show();
            $float.hide();
            enable();
        });
        // 为列表中每一个dd定义点击事件，点击时改变样式
        $('#topicList').find('dd').on('click',function () {
            var dd = $(this);
            if (!dd.hasClass('active')) {
                dd.addClass('active');
                dd.siblings().removeClass('active');
            }
        });
        // 阴影浮层
        $float.on('click', function () {
            $float.hide();
            $tabSX.hide();
            $main1Class.show();
            enable();
        });
    };
});