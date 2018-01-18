/**
 *问答UI改版
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/askDailyList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var lazyload = require('lazyload/1.9.1/lazyload');
        var vars = seajs.data.vars;
        // +++++++++++++++++++++++++++++++++++
        // 页面浮沉提示
        var $promptId = $('#prompt');

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'wd_wd^rblb_wap'});

        /**
         * 隐藏浮层提示函数
         */
        function hidePrompt() {
            setTimeout(function () {
                $promptId.hide();
            }, 2000);
        }

        /**
         * 执行浮层的提示与隐藏操作函数
         * @param content 浮层提示的内容
         */
        function PromptExecution(content) {
            $('#promptContent').html(content);
            $promptId.show();
            hidePrompt();
        }
        // 对图片加载使用lazyload
        lazyload('dt[data-original]').lazyload();

        /**
         * 日报列表页的日期操作函数
         */
        function addActive() {
            // 获取页面中所有带有日期的元素
            var allDate = $('.rb-title');
            // 定义一个数组用来存放 每个拥有日期的元素距离顶部的位置
            var elemTop = [];
            // 将拥有日期的元素距离顶部的位置存入数组
            allDate.each(function (index) {
                elemTop[index] = $(this).offset().top;
            });
            // 拥有日期的元素的长度
            var length = elemTop.length;
            // 页面滚动的时候添加去除相应的样式
            $(window).on('scroll', function () {
                for (var i = 0; i < length; i++) {
                    if (document.body.scrollTop > elemTop[i] || document.documentElement.scrollTop > elemTop[i]) {
                        $(allDate[i]).attr('class', 'rb-title active');
                    } else {
                        $(allDate[i]).attr('class', 'rb-title');
                    }
                }
            });
        }

        // 该页面的加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxGetAskDailyList&day=10&type=' + vars.type,
            total: vars.allcount,
            pagesize: 7,
            pageNumber: 7,
            moreBtnID: '#drag',
            loadPromptID: '.draginner',
            contentID: '#ajax',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            lazyCon: 'dt[data-original]',
            firstDragFlag: false,
			callback: function() {
				addActive();
            }
        });

        addActive();
    };
});
