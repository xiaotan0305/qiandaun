/**
 * 开放平台个人主页
 * Created by limengyang.bj@fang.com 2017-1-21
 */
define('modules/news/articleList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.1/loadMore', 'modules/news/kfptGz', 'weixin/2.0.0/weixinshare', 'superShare/1.0.1/superShare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 图片惰性加载
        var lazyLoad = require('lazyload/1.9.1/lazyload');
        lazyLoad('img[data-original]').lazyload();

        // 全部列表tap
        var fcqAll = $('.fcqAll'),
            // 直播列表tap
            fcqLive = $('.fcqLive'),
            // 问答tab
            fcqAsk = $('.fcqAsk'),
            // 无数据显示
            noAllData = $('.noAllData');

        // 点击全部tap，显示全部列表，隐藏直播列表
        $('.fcqShowAll').on('click', function () {
            var $that = $(this);
            if (!$that.hasClass('cur')) {
                $that.addClass('cur').siblings().removeClass('cur');
                // 多个loadmore调用时，激活当前的，去除之前激活的
                fcqLive.hide().removeClass('loadMore');
                fcqAsk.hide().removeClass('loadMore');
                fcqAll.show().addClass('loadMore');
                if (vars.totalCount === '0') {
                    noAllData.show();
                }
            }
        });
        var firstClick = true;
        var firstAskClick = true;
        // 点击视频tab，显示直播列表，隐藏其他列表
        $('.fcqShowLive').on('click', function () {
            var $that = $(this);
            if (!$that.hasClass('cur')) {
                $that.addClass('cur').siblings().removeClass('cur');
                fcqAll.hide().removeClass('loadMore');
                fcqAsk.hide().removeClass('loadMore');
                fcqLive.show().addClass('loadMore');
                noAllData.hide();
                // 第一次点击直播tap时，再执行一次惰性加载
                if (firstClick) {
                    lazyLoad('img[data-original]').lazyload();
                    firstClick = false;
                }
            }
        });
        // 点击问答tab，显示问答列表，隐藏其他列表
        $('.fcqShowAsk').on('click', function () {
            var $that = $(this);
            if (!$that.hasClass('cur')) {
                $that.addClass('cur').siblings().removeClass('cur');
                fcqAll.hide().removeClass('loadMore');
                fcqLive.hide().removeClass('loadMore');
                fcqAsk.show().addClass('loadMore');
                noAllData.hide();
                // 第一次点击问答tab时，再执行一次惰性加载
                if (firstAskClick) {
                    lazyLoad('img[data-original]').lazyload();
                    firstAskClick = false;
                }
            }
        });

        // 是否调用加载更多
        var liveVodTotalCount = parseInt(vars.liveVodTotalCount);
        var liveVodPageSize = parseInt(vars.liveVodPageSize);
        var answerCount = parseInt(vars.answerCount);
        if (vars.totalCount > 20 || liveVodTotalCount > liveVodPageSize || answerCount > 20) {
            // 加载更多
            var loadMore = require('loadMore/1.0.1/loadMore');
            // ajax全部tap加载更多
            if (vars.totalCount > 20) {
                loadMore.add({
                    url: vars.newsSite + '?c=news&a=ajaxGetArticleList&city=' + vars.city + '&uid=' + vars.uid,
                    // 数据总条数
                    total: vars.totalCount,
                    // 首屏显示数据条数
                    pagesize: 20,
                    // 单页加载条数
                    perPageNum: 20,
                    // 当前加载更多执行所需的元素实例
                    activeEl: fcqAll,
                    // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                    active: 'loadMore',
                    // 加载更多按钮id
                    moreBtn: '#drag',
                    // 第一次触发底部是否需要加载更多
                    firstDragFlag: false,
                    // 加载数据过程显示提示id
                    loadPrompt: '#draginner',
                    // 数据加载过来的html字符串容器
                    content: '.listUlAll',
                    // 加载中显示内容
                    loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                    // 加载完成后显示内容
                    loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>'
                });
            }
            // ajaj视频tap加载更多
            if (liveVodTotalCount > liveVodPageSize) {
                loadMore.add({
                    url: vars.newsSite + '?c=news&a=ajaxGetFcqLiveVodList&city=' + vars.city + '&uid=' + vars.fcqPassportId,
                    // 数据总条数
                    total: liveVodTotalCount,
                    // 首屏显示数据条数
                    pagesize: liveVodPageSize,
                    // 单页加载条数
                    perPageNum: 20,
                    // 当前加载更多执行所需的元素实例
                    activeEl: fcqLive,
                    // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                    active: 'loadMore',
                    // 加载更多按钮id
                    moreBtn: '#dragMoreLive',
                    // 第一次触发底部是否需要加载更多
                    firstDragFlag: false,
                    // 加载数据过程显示提示id
                    loadPrompt: '#dragLiveinner',
                    // 数据加载过来的html字符串容器
                    content: '.listUlLive',
                    // 加载中显示内容
                    loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                    // 加载完成后显示内容
                    loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>'
                });
            }
            // 问答tap加载更多
            if (answerCount > 20) {
                loadMore.add({
                    url: vars.newsSite + '?c=news&a=ajaxGetArticleList&city=' + vars.city + '&uid=' + vars.uid + '&askUserId=' + vars.fcqPassportId,
                    // 数据总条数
                    total: answerCount,
                    // 首屏显示数据条数
                    pagesize: 20,
                    // 单页加载条数
                    perPageNum: 20,
                    // 当前加载更多执行所需的元素实例
                    activeEl: fcqAsk,
                    // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                    active: 'loadMore',
                    // 加载更多按钮id
                    moreBtn: '#dragMoreAsk',
                    // 第一次触发底部是否需要加载更多
                    firstDragFlag: false,
                    // 加载数据过程显示提示id
                    loadPrompt: '#dragAskinner',
                    // 数据加载过来的html字符串容器
                    content: '.listUlAsk',
                    // 加载中显示内容
                    loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                    // 加载完成后显示内容
                    loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>'
                });
            }
            loadMore.init();
        }
        // 加载关注功能
        require('modules/news/kfptGz');
        // 微信分享配置
        var imgUrl = location.protocol + $('.shareImg').attr('src');
        var description = '我们都在看【' + vars.title + '】的房产圈，很有料哦，快来看看吧！';
        // 不赋值默认为当前地址
        var linkUrl;
        // 分享
        (function () {
            var superShare = require('superShare/1.0.1/superShare');
            var wxShare = require('weixin/2.0.0/weixinshare');
            new superShare({
                url: linkUrl,
                title: vars.title,
                desc: description,
                image: imgUrl
            });
            new wxShare({
                debug: false,
                shareTitle: vars.title,
                descContent: description,
                lineLink: linkUrl,
                imgUrl: imgUrl
            });
        })();
    };
});