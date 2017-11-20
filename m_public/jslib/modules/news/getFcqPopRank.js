/**
 * 房产圈（开放平台）文章详情页图片轮播js
 * Created by fenglinzeng on 17-03-22.
 */
define('modules/news/getFcqPopRank', ['jquery', 'loadMore/1.0.1/loadMore', 'iscroll/2.0.0/iscroll-lite', 'superShare/1.0.1/superShare', 'weixin/2.0.0/weixinshare'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        // 引入jQuery
        var $ = require('jquery');
        // 加载更多
        var loadMore = require('loadMore/1.0.1/loadMore');
        var loadMoreUrl;
        // 滚动
        var IScroll = require('iscroll/2.0.0/iscroll-lite');
        
        // 为了方便解绑事件，声明一个阻止页面默认事件的函数
        function pdEvent(e) {
            e.preventDefault();
        }
        // 禁用屏幕滑动
        function unable() {
            window.addEventListener('touchmove', pdEvent, {passive: false});
        }
        // 启用屏幕滑动
        function enable() {
            window.removeEventListener('touchmove', pdEvent, {passive: true});
        }

        // 月榜城市及全国容器
        var monthCityRank = $('.monthCityRank');
        var monthQgRank = $('.monthQgRank');
         // 周榜城市及全国数据容器
        var weekCityRank = $('.weekCityRank');
        var weekQgRank = $('.weekQgRank');
        // 需要动态加载的榜单类型
       
        var ajaxType = vars.rankType === '1' ? '2' : '1';
        // incDatas为1获取城市和全国数据，2只获得城市数据
        if (vars.incDatas === '1') {
            loadMoreUrl = vars.newsSite + '?c=news&a=ajaxGetFcqPopRank&city=qg&startTime=';
            // ajax加载当前城市榜单
            $.get(vars.newsSite, {
                c: 'news',
                a: 'ajaxGetFcqPopRank',
                city: vars.city,
                type: ajaxType,
                page: 1,
                pageSize: 3
            },function (data) {
                if (data) {
                    if (ajaxType === '1') {
                        weekCityRank.find('ul').html(data);
                    } else {
                        monthCityRank.find('ul').html(data);
                    }
                }
            });
            // ajax加载当前全国榜单
            $.get(vars.newsSite, {
                c: 'news',
                a: 'ajaxGetFcqPopRank',
                city: 'qg',
                type: ajaxType,
                page: 1,
                pageSize: 20
            },function (data) {
                if (data) {
                    if (ajaxType === '1') {
                        weekQgRank.find('ul').html(data);
                        vars.weekQgTotal = $('input[data-id=weekQgTotal]').val();
                    } else {
                        monthQgRank.find('ul').html(data);
                        vars.monthQgTotal = $('input[data-id=monthQgTotal]').val();
                    }
                     // 周榜全国数据加载更多
                    if (vars.weekQgTotal > 20) {
                        loadMore.add({
                            // 加载更多接口地址
                            url: loadMoreUrl + (vars.weekStartTime || '') + '&endTime=' + (vars.weekEndTime || '') + '&type=1&timeType=' + (vars.rankType === '1' ? vars.timeType : 'current'),
                            // 每页加载数据条数，10默认
                            perPageNum: 20,
                            // 总数据条数
                            total: vars.weekQgTotal,
                            // 当前页加载数据条数
                            pagesize: 20,
                            // 当前加载更多执行所需的元素实例
                            activeEl: '.weekRank',
                            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                            active: 'cur',
                            // 加载更多容器的类名或者id或者jquery对象
                            content: '.weekQgRank ul',
                            // 加载更多按钮的类名或者id或者jquery对象
                            moreBtn: '.weekBt',
                            // 提示文案类名或id或者jquery对象
                            loadPrompt: '.moreWeekList',
                            errorTxt: '',
                            // 加载中显示文案,'正在加载请稍后'为默认
                            loadingTxt: '<div class="moreList moreWeekList"><span><i></i>努力加载中...</span></div>',
                            // 加载完成后显示内容,'加载更多'为默认
                            loadedTxt: '<div class="mb8 moreList moreWeekList"><a href="javascript:void(0)" class="bt weekBt">查看更多</a></div>'
                        });
                    } else {
                        $('.moreWeekList').hide();
                    }
                    
                    // 月榜全国数据加载更多
                    if (vars.monthQgTotal > 20) {
                        loadMore.add({
                            // 加载更多接口地址
                            url: loadMoreUrl + (vars.monthStartTime || '') + '&endTime=' + (vars.monthEndTime || '') + '&type=2&timeType=' + (vars.rankType === '2' ? vars.timeType : 'current'),
                            // 每页加载数据条数，10默认
                            perPageNum: 20,
                            // 总数据条数
                            total: vars.monthQgTotal,
                            // 当前页加载数据条数
                            pagesize: 20,
                            // 当前加载更多执行所需的元素实例
                            activeEl: '.monthRank',
                            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                            active: 'cur',
                            // 加载更多容器的类名或者id或者jquery对象
                            content: '.monthQgRank ul',
                            // 加载更多按钮的类名或者id或者jquery对象
                            moreBtn: '.monthBt',
                            // 提示文案类名或id或者jquery对象
                            loadPrompt: '.moreMonthList',
                            errorTxt: '',
                            // 加载中显示文案,'正在加载请稍后'为默认
                            loadingTxt: '<div class="moreList moreMonthList"><span><i></i>努力加载中...</span></div>',
                            // 加载完成后显示内容,'加载更多'为默认
                            loadedTxt: '<div class="mb8 moreList moreMonthList"><a href="javascript:void(0)" class="bt monthBt">查看更多</a></div>'
                        });
                    } else {
                        $('.moreMonthList').hide();
                    }
                    // 初始化加载更多实例
                    loadMore.init();
                }
            });
           
        } else {
            loadMoreUrl = vars.newsSite + '?c=news&a=ajaxGetFcqPopRank&city=' + vars.city + '&startTime=';
            $.get(vars.newsSite, {
                c: 'news',
                a: 'ajaxGetFcqPopRank',
                city: vars.city,
                type: ajaxType,
                page: 1,
                pageSize: 20
            },function (data) {
                if (data) {
                    if (ajaxType === '1') {
                        weekCityRank.find('ul').html(data);
                        vars.weekCityTotal = $('input[data-id=weekCityTotal]').val();
                    } else {
                        monthCityRank.find('ul').html(data);
                        vars.monthCityTotal = $('input[data-id=monthCityTotal]').val();
                    }
                    // 周榜城市数据加载更多
                    if (vars.weekCityTotal > 20) {
                        loadMore.add({
                            // 加载更多接口地址
                            url: loadMoreUrl + (vars.weekStartTime || '') + '&endTime=' + (vars.weekEndTime || '') + '&type=1&timeType=' + (vars.rankType === '1' ? vars.timeType : 'current'),
                            // 每页加载数据条数，10默认
                            perPageNum: 20,
                            // 总数据条数
                            total: vars.weekCityTotal,
                            // 当前页加载数据条数
                            pagesize: 20,
                            // 当前加载更多执行所需的元素实例
                            activeEl: '.weekRank',
                            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                            active: 'cur',
                            // 加载更多容器的类名或者id或者jquery对象
                            content: '.weekCityRank ul',
                            // 加载更多按钮的类名或者id或者jquery对象
                            moreBtn: '.weekBt',
                            // 提示文案类名或id或者jquery对象
                            loadPrompt: '.moreWeekList',
                            // 加载中显示文案,'正在加载请稍后'为默认
                            loadingTxt: '<div class="moreList moreWeekList"><span><i></i>努力加载中...</span></div>',
                            // 加载完成后显示内容,'加载更多'为默认
                            loadedTxt: '<div class="mb8 moreList moreWeekList"><a href="javascript:void(0)" class="bt weekBt">查看更多</a></div>'
                        });
                    } else {
                        $('.moreWeekList').hide();
                    }
                    
                    // 月榜城市数据加载更多
                    if (vars.monthCityTotal > 20) {
                        loadMore.add({
                            // 加载更多接口地址
                            url: loadMoreUrl + (vars.monthStartTime || '') + '&endTime=' + (vars.monthEndTime || '') + '&type=2&timeType=' + (vars.rankType === '2' ? vars.timeType : 'current'),
                            // 每页加载数据条数，10默认
                            perPageNum: 20,
                            // 总数据条数
                            total: vars.monthCityTotal,
                            // 当前页加载数据条数
                            pagesize: 20,
                            // 当前加载更多执行所需的元素实例
                            activeEl: '.monthRank',
                            // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                            active: 'cur',
                            // 加载更多容器的类名或者id或者jquery对象
                            content: '.monthCityRank ul',
                            // 加载更多按钮的类名或者id或者jquery对象
                            moreBtn: '.monthBt',
                            // 提示文案类名或id或者jquery对象
                            loadPrompt: '.moreMonthList',
                            // 加载中显示文案,'正在加载请稍后'为默认
                            loadingTxt: '<div class="moreList moreMonthList"><span><i></i>努力加载中...</span></div>',
                            // 加载完成后显示内容,'加载更多'为默认
                            loadedTxt: '<div class="mb8 moreList moreMonthList"><a href="javascript:void(0)" class="bt monthBt">查看更多</a></div>'
                        });
                    } else {
                        $('.moreMonthList').hide();
                    }
                    
                    // 初始化加载更多实例
                    loadMore.init();
                }
            });
        }
        // 顶部周榜月榜tap固定
        $(window).scroll(function () {
            if (window.scrollY > $('.header').height()) {
                $('.fixedTop').show();
            } else {
                $('.fixedTop').hide();
            }
        });
        // 周榜月榜切换
        // 切换头部标签
        var weekRank = $('.weekRank');
        var monthRank = $('.monthRank');
        var firstChange = true;
        // 显示周榜
        weekRank.on('click', function () {
            if (firstChange) {
                $(window).scrollTop(0);
            }
            firstChange = false;
            monthRank.removeClass('cur');
            monthCityRank.hide();
            monthQgRank.hide();
            weekRank.addClass('cur');
            weekCityRank.show();
            weekQgRank.show();
        });
        // 显示月榜
        monthRank.on('click', function () {
            if (firstChange) {
                $(window).scrollTop(0);
            }
            firstChange = false;
            weekRank.removeClass('cur');
            weekCityRank.hide();
            weekQgRank.hide();
            monthRank.addClass('cur');
            monthCityRank.show();
            monthQgRank.show();
        });
        
        // 弹出及隐藏榜单说明浮层
        var rankInfo = $('.rankInfo');
        var showRankInfo = $('.showRankInfo');
        showRankInfo.on('click', function () {
            // 取消事件冒泡
            event.stopPropagation();
            var $this = $(this);
            if ($this.hasClass('cur')) {
                $this.removeClass('cur');
                rankInfo.hide();
                enable();
            } else {
                $this.addClass('cur');
                rankInfo.show();
                unable();
                new IScroll('#rankInfoScroll');
            }
        });
        // 点击确认，隐藏榜单说明浮层
        $('.hideRankInfo').on('click', function () {
            // 取消事件冒泡
            event.stopPropagation();
            showRankInfo.removeClass('cur');
            rankInfo.hide();
            enable();
        });

        // 弹出与收起往期榜单浮层
        // 周榜
        var hisWeekList = $('.hisWeekList');
        // 月榜
        var hisMonthList = $('.hisMonthList');
        var showHisList = $('.showHisList');
        showHisList.on('click', function () {
            // 取消事件冒泡
            event.stopPropagation();
            unable();
            var $this = $(this);
            showRankInfo.removeClass('cur');
            rankInfo.hide();
            $this.addClass('cur');
            if (weekRank.hasClass('cur')) {
                unable();
                hisWeekList.show();
                new IScroll('#hisWeekScroll');
            }
            if (monthRank.hasClass('cur')) {
                hisMonthList.show();
                new IScroll('#hisMonthScroll');
            }
        });
        // 点击取消，隐藏往期榜单浮层
        $('.hideHisWeekList').on('click', function () {
            // 取消事件冒泡
            event.stopPropagation();
            showHisList.removeClass('cur');
            hisWeekList.hide();
            enable();
        });
        $('.hideHisMonthList').on('click', function () {
            // 取消事件冒泡
            event.stopPropagation();
            showHisList.removeClass('cur');
            hisMonthList.hide();
            enable();
        });

        // 点击浮层以外部分，隐藏浮层
        $('.bg-f8').on('click', function (event) {
            enable();
            if (!$(event.target).parents('.inFloatAlert').length) {
                showHisList.removeClass('cur');
                hisWeekList.hide();
                hisMonthList.hide();
                showRankInfo.removeClass('cur');
                rankInfo.hide();
            }
        });

        // 分享图片
        var imgUrl = window.location.protocol + vars.public + '201511/images/newsImg_03.jpg';
        // 分享
        (function () {
            var superShare = require('superShare/1.0.1/superShare');
            var wxShare = require('weixin/2.0.0/weixinshare');
            new superShare({
                url: window.location.href,
                title: vars.title,
                desc: vars.description,
                image: imgUrl
            });
            new wxShare({
                debug: false,
                shareTitle: vars.title,
                descContent: vars.description,
                lineLink: window.location.href,
                imgUrl: imgUrl
            });
        })();
    };
});
