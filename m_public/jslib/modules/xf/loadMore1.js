/**
 * Created by WeiRF on 2015/11/4.
 */
/**
 * 参数说明
 * var options = {
	moreBtnID : '#drag',   //加载更多按钮
	loadPromptID : '#loading',  //显示努力加载中ID
	contentID : '#xfContentList', //ajax请求成功后append的容器
	ajaxUrl : '/xf.d',  //ajax请求的URL
	ajaxData : dataConfig  //ajac请求的data
	ajaxFn : 需要在ajax请求后调用的函数
  }
 */
define('modules/xf/loadMore1', ['jquery','lazyload/1.9.1/lazyload'],
    function (require,exports, module) {
        'use strict';
        var $ = require('jquery');
        var lazy = require('lazyload/1.9.1/lazyload');
        function LoadMore(options) {
            // 加载标识，用于限制ajax调用过程中不允许重复调用
            var loadFlag = true;
            // window实例
            var $window = $(window);
            // document实例
            var $document = $(document);
            var $content = $(options.contentID);
            var $moreBtn = $(options.moreBtnID);
            var $loadPrompt = '';
            var loadMoreFlag = false;
            var moreText = $moreBtn.find('a').html() || '';
            var vars = seajs.data.vars;
            // 加载更多和点击加载按钮是否为同一个
            if (options.loadPromptID === options.moreBtnID) {
                $loadPrompt = $moreBtn;
                loadMoreFlag = true;
            } else {
                $loadPrompt = $(options.loadPromptID);
            }
            // 总数据屏数
            var totalDataNumber = parseInt(options.total);
            // 分页显示数据的条数，如果没有设置的话默认为10
            var pageShowDataNumber = parseInt(options.pageNumber) || 10;
            var configData = options.ajaxData;
            var configDataEndpage = options.ajaxDataEndPage;
            // 获取浏览器UA
            var UA = navigator.userAgent.toLowerCase();
            // 判断是否为iPhone系统
            var isApple = UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1;
            // ！！！浏览器高度兼容性处理
            var browserHeader = 0;
            if (isApple) {
                // 是iPhone的话浏览器多高出了68像素
                browserHeader = 68;
            } else if (/ucbrowser/i.test(UA)) {
                // 不是苹果手机并且是uc浏览器的话，浏览器多高出了50像素
                browserHeader = 50;
            }
            // 如果总信息数少于第一屏显示的最大数时，则隐藏查看更多楼盘按钮并且不进行ajax请求
            if (totalDataNumber < 2) {
                $moreBtn.hide();
                $loadPrompt.hide();
                loadFlag = false;
            }

            /*
             * 绑定滚动事件，监听是否到达底部，执行加载更多操作
             */
            $window.on('scroll', function () {
                var scrollH = $document.height() - browserHeader;
                if (loadFlag && $window.scrollTop() + $window.height() >= scrollH) {
                    loadMore();
                }
            });

            /**
             * 绑定点击事件，点击加载更多按钮执行加载更多
             */
            $moreBtn.on('click', function () {
                if (loadFlag) {
                    loadMore();
                }
            });

            /**
             * 加载更多函数
             */
            var isEndPage = false;
            function loadMore() {
                loadFlag = false;
                if (loadMoreFlag) {
                    $moreBtn.find('a').css({background: 'url('+vars.public+'images/loader.gif) 20px 50% no-repeat'}).html('正在加载...');
                }
                // 加载最后一页并且有loadprice参数时判断
                if (configData.p == totalDataNumber && vars.loadprice && vars.keyword == '') {
                    isEndPage = true;
                }
                if (isEndPage) {
                    configData = configDataEndpage;
                    isEndPage = false;
                }
                $moreBtn.hide();
                $loadPrompt.show();
                $.ajax({
                    type: 'POST',
                    url: options.ajaxUrl,
                    data: configData ,
                    datatype: 'json',
                    success: function (data) {
                        $content.append(data);
                        lazy('img[data-original]').lazyload();
                        if (loadMore) {
                            $moreBtn.find('a').css({background: ''}).html(moreText);
                        }
                        $loadPrompt.hide();
                        $moreBtn.show();
                        configData.p++;
                        if (options.ajaxFn) {
                            for (var ajaxfn in options.ajaxFn) {
                                options.ajaxFn[ajaxfn].init();
                            }
                        }
                        loadFlag = true;
                        if (configData.p > totalDataNumber || configData.p == 1) {
                            loadFlag = false;
                            $moreBtn.hide();
                            $loadPrompt.hide();
                        }
                    }
                });
            }
        }
        module.exports = LoadMore;
    });