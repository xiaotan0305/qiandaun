/**
 * 查房价活动页搜索类
 * by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        // seajs模块化兼容性写法
        define('activity', ['jquery'], function () {
            var vars = seajs.data.vars;
            var $ = require('jquery');
            f(w, vars, $);
        });
    } else if (typeof exports === 'object') {
        // commonjs模块
        module.exports = f(w);
    } else {
        // 普通引用
        f(w, w.lib);
    }
})(window, function (w, vars, $) {
    'use strict';
    // 整个搜索相关的父容器
    var $searchCon = $('#searchCon');
    // 搜索输入input实例
    var searchInput = $searchCon.find('input');
    // 搜索按钮实例
    var searchBtn = $searchCon.find('.btn');
    // 清除按钮实例
    var offBtn = $searchCon.find('.off');
    // 自动提示列表实例
    var autoPromptList = $searchCon.find('#autoPromptList');
    // 显示自动提示个数
    var autoPromptNumber = 4;

    /**
     * 搜索函数，用于执行点击搜索按钮和手机端点击键盘搜索操作
     * @param key
     */
    function search(key) {
        // 拼接跳转地址后跳转
        window.location = vars.pingguSite + '?c=pinggu&a=list&keyword=' + encodeURIComponent(key)
            + '&city=' + vars.city + '&actType=szact' + '&r=' + Math.random();
        autoPromptList.hide();
        offBtn.hide();
    }

    /**
     * 获取自动提示列表中的列表内容
     * @param arr
     * @returns {string}
     */
    function getAutoPromptContent(arr) {
        // 用于li显示的拼接字符串
        var liHtmlStr = '<li><a href=\'javascript:void(0);\'>xx</a></li>',
            arrL = arr.length,
            html = '',
            len = autoPromptNumber > arrL ? arrL : autoPromptNumber;

        /**
         * 循环遍历自动提示接口返回的数组
         * 拼接获取需要显示li字符串
         */
        for (var i = 0; i < len; i++) {
            // 将每一个获取搜索关键词拼接到li字符串中并通过字符串拼接起来
            html += liHtmlStr.replace('xx', arr[i]);
        }
        return html;
    }

    /**
     * 获取自动提示列表
     * @param key
     */
    function getAutoPromptList(key) {
        // 调用后台接口获取数据
        $.get(vars.pingguSite + '?c=pinggu&a=ajaxGetSearchTip', {city: vars.city, q: key}, function (data) {
            // 清空自动提示列表
            if (data) {
                var arr = JSON.parse(data);
                var htmlStr = getAutoPromptContent(arr);
                if (htmlStr) {
                    autoPromptList.show().find('ul').html(htmlStr);
                }
            } else {
                autoPromptList.find('ul').empty();
            }
        });
    }

    /**
     * 清除自动提示列表
     */
    function clearList() {
        autoPromptList.find('ul').empty();
    }

    autoPromptList.on('click', 'a', function () {
        search($(this).html());
    });

    /**
     * 绑定input事件，自动提示用户操作监听
     */
    searchInput.on('input', function () {
        var key = $.trim(searchInput.val());
        if (key) {
            if (offBtn.is(':hidden')) {
                offBtn.show();
            }
            getAutoPromptList(key);
        } else {
            if (offBtn.is(':visible')) {
                offBtn.hide();
            }
            clearList();
        }
    });

    /**
     * 绑定keyup事件，用户手机端点击搜索操作
     */
    searchInput.on('keyup', function (e) {
        if (e.keyCode === 13) {
            var key = $.trim(searchInput.val());
            if (key) {
                search(key);
            }
        }
    });

    // 上推
    searchInput.on('focus', function () {
        $('html,body').animate({scrollTop: $(this).offset().top});
    });

    /**
     * 绑定click事件，用户点击搜索按钮操作
     */
    searchBtn.on('click', function () {
        var key = $.trim(searchInput.val());
        if (key) {
            search(key);
        }
    });

    /**
     * 绑定click事件，用户点击自动清除按钮操作
     */
    offBtn.on('click', function () {
        offBtn.hide();
        searchInput.val('');
        clearList();
    });
});
