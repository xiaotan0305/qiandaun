/**
 * 房产词汇快查
 * create by zhangjinyu
 * 20160726
 */
define('modules/zhishi/quickSearch', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        var iscroll = require('iscroll/2.0.0/iscroll-lite');
        // 页面传入的参数
        var vars = seajs.data.vars;
        // 清除按钮
        var offBtn = $('.off');
        // 搜索输入框
        var searchInput = $('#searchInput');
        // 词汇的容器
        var zsContainer = $('.zs-search');
        // 关键词
        var sKword = $('.sKword');
        // 词汇浮层
        var zsFloat = $('.zs-s-out');
        // 词汇浮层title
        var zsTitle = $('#zsTitle');
        // 词汇浮层content
        var zsContent = $('#zsContent');
        // 词汇浮层搜索按钮
        var zsSearchBtn = $('#zsSearchBtn');
        // 灰色遮罩层
        var blackBg = $('.blackBg');

        // 控制页面显示
        var mBox = document.querySelector('.main');
        var kcMain = document.querySelector('.kc-main');
        var bHeight = document.body.offsetHeight - 132;
        mBox.style.minHeight = 0 + 'px';
        kcMain.style.minHeight = bHeight + 'px';

        var $doc = $(document);

        /**
         * 为了方便解绑事件，声明一个阻止页面默认事件的函数
         * @param e
         */
        function pdEvent(e) {
            e.stopPropagation();
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

        // 搜索提示
        var promptKeywords = function () {
            // 初始化
            if (zsContainer.is(':visible')) {
                zsContainer.hide();
            }
            zsContainer.empty();
            var keyword = searchInput.val();
            if (keyword.length > 0) {
                offBtn.show();
                $.get(vars.zhishiSite + '?c=zhishi&a=ajaxQuickSearchTips&kw=' + keyword + '&city=' + vars.city, function (data) {
                    if (data && data.length > 0) {
                        // 要放入容器的字符串
                        var kwStr = '';
                        for (var i = 0; i < data.length; i++) {
                            kwStr += '<a class="sKword" href="javascript:void(0);" data-link="' + data[i]['tagLink']
                            + '" data-con="' + data[i]['content'] + '">' + data[i]['keyword'] + '</a>';
                        }
                        zsContainer.html(kwStr);
                        zsContainer.show();
                    }
                });
            } else {
                offBtn.hide();
            }
        };
        // 键盘输入的时候就调用搜索接口取词
        searchInput.on('input keyup focus', promptKeywords);

        // 点击关键词显示浮层
        zsContainer.on('click', '.sKword', function () {
            var $that = $(this);
            var title = $that.html();
            var tagLink = $that.data('link');
            var content = $that.data('con');
            // 如果词汇有解释，就显示解释浮层
            if (content) {
                zsTitle.html(title);
                zsContent.html(content);
                zsSearchBtn.attr('href', tagLink);
                zsFloat.show();
                blackBg.show();
                unable();
                setTimeout(function () {
                    new iscroll('#zsContentDiv', {
                        scrollX: false,
                        scrollY: true,
                        bindToWrapper: true,
                        eventPassthrough: false,
                        preventDefault: true
                    });
                }, 200);

            } else {
                // 如果词汇的解释content为空的话，点击不显示解释浮层直接跳转到标签列表页
                window.location.href = tagLink;
            }
        });
        // 点击隐藏解释
        zsFloat.on('click', function (e) {
            enable();
            var el = $(e.target);
            if (!el.hasClass('close') && !el.hasClass('zs-s-out') && el.attr('id') !== 'zsSearchBtn') {
                return false;
            }
            $(this).hide();
            blackBg.hide();
        });
        // 清除搜索框
        offBtn.on('click', function () {
            searchInput.val('');
            offBtn.hide();
        });

        // 点击搜索按钮
        $('.searchBtn').on('click', function () {
            window.location.href = vars.zhishiSite + 'search/?kw=' + searchInput.val().replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
        });
    };
});
