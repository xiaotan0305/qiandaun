/**
 * @file 产品测评页
 * @author young 2017-08-07
 */
define('modules/jiaju/jcEvalList', ['jquery', 'loadMore/1.0.1/loadMore', 'lazyload/1.9.1/lazyload', 'util/util'], function(require, exports, module) {
    'use strict';
    module.exports = function() {
        var $ = require('jquery');
        var Utils = require('util/util');
        var loadMore = require('loadMore/1.0.1/loadMore');
        require('lazyload/1.9.1/lazyload');
        var vars = seajs.data.vars,
            $window = $(window),
            $main = $('.main'),
            datatimeout = $('#datatimeout'),
            colid = 'col_11004',
            loadingEval = $('#loadingEval'),
            evaltimeout = $('#evaltimeout');
        require.async(['modules/jiaju/ad']);
        pageInit();

        /**
         * [pageInit description] 页面初始化
         * @return {[type]} [description]
         */
        function pageInit() {
            // 图片懒加载
            $('.lazyload').lazyload();
            loadMoreFn();
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
            //tab切换
            $('.overboxIn a').on('click', function() {
                var that = $(this);
                if (!that.hasClass('active')) {
                    evaltimeout.hide();
                    that.siblings().removeClass('active');
                    that.addClass('active');
                    var id = that.attr('id').split('_')[1];
                    $('.evalList ul').hide();
                    if (!$('#content_' + id).find('li').length) {
                        loadingEval.show();
                        loadEval(id);
                    }
                    $('#content_' + id).show();
                    $('.evalList .moreList').hide();
                }
            });
            //超时处理
            evaltimeout.on('click', function() {
                var loadid = $('.overboxIn a.active').attr('id').split('_')[1];
                loadEval(loadid);
            })
            $('.jj-fixedBtn').on('click', function () {
                var suffix =  vars.is_sfapp === '1' ? '&src=client' : '';
                window.location = vars.jiajuSite + '?c=jiaju&a=jcBaoMing&city=' + vars.city + '&SourcePageID=56&refer=' + encodeURIComponent(location.href) + suffix;
            });
        }

        /**
         * [loadMoreFn description] loadmore插件，加载更多功能函数
         * @return {[type]} [description]
         */
        function loadMoreFn() {
            // 防止loadMore.js报错
            var total = vars.total;
            // 加载更多
            for (var i = 11004; i < 11017; i++) {
                loadMore.add({
                    // 加载更多接口地址
                    url: vars.jiajuSite + '?c=jiaju&a=ajaxGetJcEval&cid=' + i,
                    // 每页加载数据条数
                    perPageNum: 20,
                    // 总数据条数
                    total: total,
                    // 当前页加载数据条数
                    pagesize: 20,
                    // 当前加载更多执行所需的元素实例
                    activeEl: '#col_' + i,
                    // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
                    active: 'active',
                    // 加载更多容器的类名或者id或者jquery对象
                    content: '#content_' + i,
                    // 加载更多按钮的类名或者id或者jquery对象
                    moreBtn: '#clickmore_' + i,
                    // 提示文案类名或id或者jquery对象
                    loadPrompt: '#prompt_' + i,
                    // 加载中显示文案,'正在加载请稍后'为默认
                    loadingTxt: '努力加载中...',
                    // 加载完成后显示内容,'加载更多'为默认
                    loadedTxt: '点击加载更多...',
                    firstDragFlag: false
                });
            }
            loadMore.init();
        }

        /**
         * ajax请求-产品测评数据
         * @return {[type]} [description]
         */
        function loadEval(cid) {
            $.ajax({
                url: vars.jiajuSite + '?c=jiaju&a=ajaxGetJcEval&cid=' + cid + '&page=1',
                success: function(data) {
                    if (data) {
                        $('#content_' + cid).prepend(data.res).show().find('.lazyload').lazyload();
                        loadMore.config[cid - 11004].totalPage = data.total;
                        $('#clickmore_' + cid).show();
                        loadingEval.hide();
                        evaltimeout.hide();
                        $('.lazyload').lazyload();
                    } else {
                        loadingEval.hide();
                        evaltimeout.show();
                    }
                }
            });
        }

    };
});