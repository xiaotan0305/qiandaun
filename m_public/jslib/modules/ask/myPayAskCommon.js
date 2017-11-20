/**
 * 我的问答普通用户页
 * by hanxiao 20160907
 */
define('modules/ask/myPayAskCommon', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.1/loadMore'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 从页面获取的参数
        var vars = seajs.data.vars;
        /* 图片惰性加载*/
        require('lazyload/1.9.1/lazyload');
        // 问题加载更多
        var loadMore = require('loadMore/1.0.1/loadMore');
        var swipLazy = $('.lazyload'), delay = 0;
        if (swipLazy) {
            swipLazy.lazyload();
            swipLazy.each(function (index, ele) {
                setTimeout(function () {
                    var thisEle = $(ele);
                    if (thisEle.attr('src') !== thisEle.attr('data-original')) {
                        thisEle.attr('src', thisEle.attr('data-original'));
                    }
                }, delay + 10);
            });
        }
        // 我的提问按钮
        var myAskBtn = $('#myAskBtn');
        // 我的回答按钮
        var myAnswerBtn = $('#myAnswerBtn');
        // 我的围观按钮
        var myLookBtn = $('#myLookBtn');
        // 我的关注按钮
        var myAttenBtn = $('#myAttenBtn');
        // 我的提问容器
        var myAskBox = $('#myAskBox');
        // 我的回答容器
        var myAnswerBox = $('#myAnswerBox');
        // 我的围观容器
        var myLookBox = $('#myLookBox');
        // 我的关注容器
        var myAttenBox = $('#myAttenBox');
        myAskBtn.on('click', function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            myAskBox.show().siblings().hide();
            $('.askMyTab').show();
            $('.moreList').hide();
            $('#myAskMore').show();
        });
        myAnswerBtn.on('click', function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            myAnswerBox.show().siblings().hide();
            $('.askMyTab').show();
            $('.moreList').hide();
            $('#myAnswerMore').show();
        });
        myLookBtn.on('click', function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            myLookBox.show().siblings().hide();
            $('.askMyTab').show();
            $('.moreList').hide();
            $('#MyWatchMore').show();
        });
        myAttenBtn.on('click', function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            myAttenBox.show().siblings().hide();
            $('.askMyTab').show();
            $('.moreList').hide();
        });
        // 我的提问问题总数-传1防止loadMore.js报错
        var myAskTotal = vars.myAskTotal > 0 ? vars.myAskTotal : 1;
        // 我的回答问题总数
        var answerTotal = vars.answerTotal > 0 ? vars.answerTotal : 1;
        // 我的围观问题总数
        var watchedTotal = vars.watchedTotal > 0 ? vars.watchedTotal : 1;
        // 我的提问问题加载更多
        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + '?c=ask&a=ajaxGetMoreMyAskList',
            // 每页加载数据条数
            perPageNum: 10,
            // 总数据条数
            total: myAskTotal,
            // 当前页加载数据条数
            pagesize: 10,
            // 当前加载更多执行所需的元素实例
            activeEl: '#myAskBtn',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'cur',
            // 加载更多容器的类名或者id或者jquery对象
            content: '#myAskListUl',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '#myAskMore',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '#myAskMore',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a>努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a>没有更多了</a>',
            firstDragFlag: false
        });
        // 我的回答加载更多
        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + '?c=ask&a=ajaxGetMoreMyAnswerList&type=common',
            // 每页加载数据条数
            perPageNum: 10,
            // 总数据条数
            total: answerTotal,
            // 当前页加载数据条数
            pagesize: 10,
            // 当前加载更多执行所需的元素实例
            activeEl: '#myAnswerBtn',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'cur',
            // 加载更多容器的类名或者id或者jquery对象
            content: '#myAnswerListUl',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '#myAnswerMore',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '#myAnswerMore',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a>努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a>没有更多了</a>',
            firstDragFlag: false
        });
        // 我的围观加载更多
        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + '?c=ask&a=ajaxGetMoreMyWatchedList',
            // 每页加载数据条数
            perPageNum: 10,
            // 总数据条数
            total: watchedTotal,
            // 当前页加载数据条数
            pagesize: 10,
            // 当前加载更多执行所需的元素实例
            activeEl: '#myLookBtn',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'cur',
            // 加载更多容器的类名或者id或者jquery对象
            content: '#myLookListUl',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '#MyWatchMore',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '#MyWatchMore',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a>努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a>没有更多了</a>',
            firstDragFlag: false
        });
        loadMore.init();
    };
});