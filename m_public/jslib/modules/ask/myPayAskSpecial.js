/**
 * 我的问答专家页
 * by hanxiao 20160906
 */
define('modules/ask/myPayAskSpecial', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.1/loadMore'], function (require, exports, module) {
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
        // 向我提问按钮
        var askBtn = $('#askBtn');
        // 我的回答按钮
        var ansBtn = $('#answerBtn');
        // 向我提问问题列表
        var askListBox = $('.payasklist');
        // 我的回答问题列表
        var ansListBox = $('.answerMylist');
        // 点击向我提问按钮
        askBtn.on('click', function(){
            askBtn.addClass('cur');
            ansBtn.removeClass('cur');
            askListBox.show();
            ansListBox.hide();
            $('#askMore').show();
            $('#answerMore').hide();
        });
        // 点击我的回答按钮
        ansBtn.on('click', function(){
            ansBtn.addClass('cur');
            askBtn.removeClass('cur');
            ansListBox.show();
            askListBox.hide();
            $('#answerMore').show();
            $('#askMore').hide();
        });
        // 向我提问问题总数-传1防止loadMore.js报错
        var askTotal = vars.askTotal > 0 ? vars.askTotal : 1;
        // 我的回答问题总数
        var answerTotal = vars.answerTotal > 0 ? vars.answerTotal : 1;
        // 向我提问问题加载更多
        loadMore.add({
            // 加载更多接口地址
            url: vars.askSite + '?c=ask&a=ajaxGetMoreAskMeList',
            // 每页加载数据条数
            perPageNum: 10,
            // 总数据条数
            total: askTotal,
            // 当前页加载数据条数
            pagesize: 10,
            // 当前加载更多执行所需的元素实例
            activeEl: '#askBtn',
            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
            active: 'cur',
            // 加载更多容器的类名或者id或者jquery对象
            content: '#askListUl',
            // 加载更多按钮的类名或者id或者jquery对象
            moreBtn: '#askMore',
            // 提示文案类名或id或者jquery对象
            loadPrompt: '#askMore',
            // 加载中显示文案,'正在加载请稍后'为默认
            loadingTxt: '<a>努力加载中</a>',
            // 加载完成后显示内容,'加载更多'为默认
            loadedTxt: '<a>没有更多了</a>',
            firstDragFlag: false
        });
        loadMore.add({
             // 加载更多接口地址
             url: vars.askSite + '?c=ask&a=ajaxGetMoreMyAnswerList&type=special',
             // 每页加载数据条数
             perPageNum: 10,
             // 总数据条数
             total: answerTotal,
             // 当前页加载数据条数
             pagesize: 10,
             // 当前加载更多执行所需的元素实例
             activeEl: '#answerBtn',
             // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
             active: 'cur',
             // 加载更多容器的类名或者id或者jquery对象
             content: '#answerListUl',
             // 加载更多按钮的类名或者id或者jquery对象
             moreBtn: '#answerMore',
             // 提示文案类名或id或者jquery对象
             loadPrompt: '#answerMore',
             // 加载中显示文案,'正在加载请稍后'为默认
             loadingTxt: '<a>努力加载中</a>',
             // 加载完成后显示内容,'加载更多'为默认
             loadedTxt: '<a>没有更多了</a>',
             firstDragFlag: false
         });
        loadMore.init();
    };
});