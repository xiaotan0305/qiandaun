/**
 * @file wap商家列表页
 * @author muzhaoyang 2017-05-02
 */
define('modules/jiaju/mainProductList', ['jquery', 'loadMore/1.0.1/loadMore', 'lazyload/1.9.1/lazyload', 'util/util'], function(require, exports, module) {
    'use strict';
    module.exports = function() {
        var $ = require('jquery');
        var Utils = require('util/util');
        require('lazyload/1.9.1/lazyload');
        var loadMore = require('loadMore/1.0.1/loadMore');
        var vars = seajs.data.vars;
        var $window = $(window);
        var $main = $('.main');
        var datatimeout = $('#datatimeout');
        var $float = $('.float');
        var canAjax = true;
        var time = $('#timeHref'),
            price = $('#priceHref'),
            timeclick = $('#time_clickmore'),
            priceclick = $('#price_clickmore'),
            timecon = $('#time_content'),
            pricecon = $('#price_content');            ;
        pageInit();

        /**
         * [pageInit description] 页面初始化
         * @return {[type]} [description]
         */
        function pageInit() {
            // 图片懒加载
            $('.lazyload').lazyload();
            // 绑定页面dom元素事件
            eventInit();
        }

        /**
         * [eventInit description] 事件初始化
         * @return {[type]} [description]
         */
        function eventInit() {
            //没有请求到数据，点击重新加载
            datatimeout.on('click', function() {
                window.location.reload();
            });
            loadMoreFn();
            //ajax请求价格降序数据
            $.ajax({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMainProList&city=' + vars.city + '&sortid=33&companyid=' + vars.companyid + '&page=1',
                success: function(data) {
                    if (data) {
                        pricecon.prepend(data.res).find('.lazyload').lazyload();
                        loadMore.config[1].totalPage = data.total;
                    }
                }
            });
            //点击价格降序
            price.on('click', function() {
                var that = $(this);
                if (!that.parent().hasClass('active')) {
                    time.parent().removeClass('active');
                    time.removeClass('active');
                    that.parent().addClass('active');
                    that.addClass('active');
                    timeclick.hide();
                    priceclick.show();
                    if (!pricecon.find('li').length) {
                        //ajax请求数据
                        if (canAjax) {
                            canAjax = false;
                            $.ajax({
                                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMainProList&city=' + vars.city + '&sortid=33&companyid=' + vars.companyid + '&page=1',
                                success: function(data) {
                                    if (!data) {
                                        alert('数据请求失败，请重试');
                                    } else {
                                        timecon.hide();
                                        pricecon.prepend(data.res).show().find('.lazyload').lazyload();
                                        loadMore.config[1].totalPage = data.total;
                                    }
                                },
                                complete: function() {
                                    canAjax = true;
                                }
                            });
                        }
                    } else {
                        timecon.hide();
                        pricecon.show();
                    }
                    $('.lazyLoad').lazyload();
                }
            });
            //点击最近更新
            time.on('click', function() {
                var that = $(this);
                if (!that.parent().hasClass('active')) {
                    price.removeClass('active');
                    price.parent().removeClass('active');
                    that.parent().addClass('active');
                    that.addClass('active');
                    priceclick.hide();
                    timeclick.show();
                    pricecon.hide();
                    timecon.show();
                }
            });
        }
        /**
         * [loadMoreFn description] loadmore插件，加载更多功能函数
         * @return {[type]} [description]
         */
        function loadMoreFn() {
            // 楼盘问题总数-传1防止loadMore.js报错
            var timeTotal = vars.timeTotal > 0 ? vars.timeTotal : 1;
            // 常见问题总数
            var priceTotal = 1;
            // 楼盘问题加载更多

            loadMore.add({
                // 加载更多接口地址
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMainProList&city=' + vars.city + '&sortid=34&companyid=' + vars.companyid,
                // 每页加载数据条数
                perPageNum: 10,
                // 总数据条数
                total: timeTotal,
                // 当前页加载数据条数
                pagesize: 10,
                // 当前加载更多执行所需的元素实例
                activeEl: '#timeHref',
                // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                active: 'active',
                // 加载更多容器的类名或者id或者jquery对象
                content: '#time_content',
                // 加载更多按钮的类名或者id或者jquery对象
                moreBtn: '#time_clickmore',
                // 提示文案类名或id或者jquery对象
                loadPrompt: '#time_prompt',
                // 加载中显示文案,'正在加载请稍后'为默认
                loadingTxt: '努力加载中...',
                // 加载完成后显示内容,'加载更多'为默认
                loadedTxt: '点击加载更多...',
                firstDragFlag: false
            });
            loadMore.add({
                // 加载更多接口地址  tag是用来区分用户是否设置过标签,没有设置过要调用不同的接口
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetMainProList&city=' + vars.city + '&sortid=33&companyid=' + vars.companyid,
                // 每页加载数据条数
                perPageNum: 10,
                // 总数据条数
                total: priceTotal,
                // 当前页加载数据条数
                pagesize: 10,
                // 当前加载更多执行所需的元素实例
                activeEl: '#priceHref',
                // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                active: 'active',
                // 加载更多容器的类名或者id或者jquery对象
                content: '#price_content',
                // 加载更多按钮的类名或者id或者jquery对象
                moreBtn: '#price_clickmore',
                // 提示文案类名或id或者jquery对象
                loadPrompt: '#price_prompt',
                // 加载中显示文案,'正在加载请稍后'为默认
                loadingTxt: '努力加载中...',
                // 加载完成后显示内容,'加载更多'为默认
                loadedTxt: '点击加载更多...',
                firstDragFlag: false
            });
            loadMore.init();
        }



    };
});