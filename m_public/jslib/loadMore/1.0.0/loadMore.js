/**
 * 加载更多模块
 * by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('loadMore/1.0.0/loadMore', ['jquery', 'lazyload/1.9.1/lazyload'], function (require) {
            // jquery库
            var $ = require('jquery');
            require('lazyload/1.9.1/lazyload');
            return f($);
        });
    } else if (typeof exports === 'object') {
        var $ = require('jquery');
        module.exports = f($);
    } else {
        // 非模块化加载时，请确保加载了jquery和lazyload
        w.LoadMore = f(w.jQuery);
    }
})(window, function ($) {
    'use strict';

    /**
     * 加载更多函数
     * @param options 传入参数
     * 参数类型为
     * {
     * // 接口地址
     * url:
     * 数据总条数
     * total:100
     * // 首屏显示数据条数
     * pagesize:46
     * // 单页加载条数
     * pageNumber:10
     * // 加载更多按钮id
     * moreBtnID:'#drag'
     * //是否需要上拉加载更多功能即是否需要scroll事件监听，可为空，默认为true
     * isScroll:false,
     * //是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
     * firstDragFlag:false,
     * // 加载数据过程显示提示id
     * loadPromptID:'.$loadPrompt'
     * // 数据加载过来的html字符串容器
     * contentID:'#content'
     * // 加载前显示内容
     * loadAgoTxt:'查看更多房源'
     * // 加载中显示内容
     * loadingTxt:'正在加载请稍后'
     * // 加载完成后显示内容
     * loadedTxt:'查看更多'
     * }
     */
    function LoadMore(options) {
        // 是否绑定scroll事件以实现上拉加载功能
        var isScroll = options.hasOwnProperty('isScroll') ? options.isScroll : true;
        // 首屏显示的数据条数
        var firstScreenDataNumber = parseInt(options.pagesize);
        // 总数据条数
        var totalDataNumber = parseInt(options.total);
        // 传入后台对象
        var transfer = {};
        // 页面属性的名称
        var pageAttr = options.hasOwnProperty('page') ? options.page : 'page';
        // 分页显示数据的条数，如果没有设置的话默认为10
        var pageShowDataNumber = parseInt(options.pageNumber) || 10;
        // 第一次拖拽特殊处理标识
        var firstDragFlag = options.hasOwnProperty('firstDragFlag') ? options.firstDragFlag : true;
        // 计算出总页数
        var totalPage = Math.ceil(totalDataNumber / pageShowDataNumber);
        // ！！！分页标识，这里的操作因为找不到是谁写的了，猜测如下：
        // ！！！首先列表页加载不是1页的内容,有可能一次显示了46条，那么下一页也就是加载更多就要从第6页开始加载
        var pageMarloadFlag = Math.ceil(firstScreenDataNumber / pageShowDataNumber) + 1;
        // 加载标识，用于限制ajax调用过程中不允许重复调用
        var loadFlag = true;
        //添加lazyload对象类型
        var lazyCon = options.lazyCon || 'img';
        // window实例
        var $window = $(window);
        // document实例
        var $document = $(document);
        // 获取浏览器UA
        var UA = navigator.userAgent.toLowerCase();
        // 判断是否为iPhone系统
        var isApple = UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1;
        // 加载更多按钮实例
        if (!options.hasOwnProperty('moreBtnID')) {
            console.log('Please set the properties moreBtnID!');
            return;
        }
        var $moreBtn = $(options.moreBtnID);
        // 数据html字符串容器
        if (!options.hasOwnProperty('contentID')) {
            console.log('Please set the properties contentID!');
            return;
        }
        var $content = $(options.contentID);
        // 加载提示
        if (!options.hasOwnProperty('loadPromptID')) {
            console.log('Please set the properties loadPromptID!');
            return;
        }
        var $loadPrompt = '';
        if (options.loadPromptID === options.moreBtnID) {
            $loadPrompt = $moreBtn;
        } else {
            $loadPrompt = $(options.loadPromptID);
        }
        // 判断是否需要加载更多
        if (totalPage <= 1) {
            $moreBtn.hide();
            loadFlag = false;
        }
        // 设置加载前显示内容
        if (options.hasOwnProperty('loadAgoTxt')) {
            $loadPrompt.html(options.loadAgoTxt);
        }
        // 设置加载中显示内容
        options.loadingTxt = options.loadingTxt || '正在加载请稍后';
        // 设置加载后显示内容
        options.loadedTxt = options.loadedTxt || '查看更多';

        // 默认加载图片
        options.lazyPlaceHolder = options.lazyPlaceHolder || '';
        /**
         * 加载更多函数
         */
        function loadMore() {
            loadFlag = false;
            $loadPrompt.html(options.loadingTxt).addClass('loading');
            transfer[pageAttr] = pageMarloadFlag;
            $.get(options.url + '&r=' + Math.random(), transfer, function (data) {
                var $data = $(data);
                $content.append($data);
                var lazySet = {};
                if (options.lazyPlaceHolder) {
                    lazySet.placeholder = options.lazyPlaceHolder;
                }
                $data.find(lazyCon).lazyload(lazySet);
                $loadPrompt.html(options.loadedTxt).removeClass('loading');
                pageMarloadFlag++;
                loadFlag = true;
                if (pageMarloadFlag > totalPage) {
                    $moreBtn.hide();
                    loadFlag = false;
                }
                //当前页数
                $data.pageMarloadFlag = pageMarloadFlag - 1;
                // 增加回调
                options.callback && options.callback($data);
            });
        }

        /**
         * 绑定点击事件，点击加载更多按钮执行加载更多
         */
        $moreBtn.on('click', function () {
            // 修复加载中点击重复加载bug
            loadFlag && loadMore();
        });
        if (isScroll) {
            // ！！！浏览器高度兼容性处理
            var browserHeader = 0;
            if (isApple) {
                // 是iPhone的话浏览器多高出了68像素
                browserHeader = 68;
            } else if (/ucbrowser/i.test(UA)) {
                // 不是苹果手机并且是uc浏览器的话，浏览器多高出了50像素
                browserHeader = 50;
            }

            /**
             * 绑定滚动事件，监听是否到达底部，执行加载更多操作
             */
            $window.on('scroll', function () {
                var scrollH = $document.height() - browserHeader;
                if (loadFlag && $window.scrollTop() + $window.height() >= scrollH) {
                    // 此判断用于当第一次拖拽到底部时允许展示全部底部而不执行加载更多
                    if (firstDragFlag) {
                        firstDragFlag = false;
                    } else {
                        loadMore();
                    }
                }
            });

			// seajs增加判断，适应非模块化调用
			if (!typeof(seajs) == 'undefined') {
				var vars = seajs.data.vars;
				if (vars.action === 'jhdetail' || (vars.action === 'detail' && vars.currentChannel === 'zf')){
					var $content = $('#content');
					$content.off('touchend').on('touchend',function(){
						if(loadFlag){
							// 此判断用于当第一次拖拽到底部时允许展示全部底部而不执行加载更多
							if (firstDragFlag) {
								firstDragFlag = false;
							} else {
								setTimeout(function(){
									loadMore();
								},800);
							}
						}
					});
				}
			}
        }
    }

    return LoadMore;
});