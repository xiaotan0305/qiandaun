/**
 * 欢迎页（首页入口）
 * by blue
 */
define('modules/welcome/main', ['jquery', 'iscroll/2.0.0/iscroll-lite'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 滑动插件
    var IScrollLite = require('iscroll/2.0.0/iscroll-lite');

    var defalutData = [
        ['北京', 'bj'], ['上海', 'sh'], ['广州', 'gz'],
        ['深圳', 'sz'], ['武汉', 'wuhan'], ['重庆', 'cq'],
        ['成都', 'cd'], ['长沙', 'cs'], ['南京', 'nanjing']
    ];
    var searchInput = $('.cysearch input');
    var list = $('.searcyList');
    // 纵向滑动插件示例
    var iscroll,
    // 自动提示防止网络问题导致的列表错乱，设置ajax索引
        ajax,
        jumpOk = '';

    /**
     * 设置城市列表
     * @param arr 城市数据
     */
    function setList(arr) {
        // 清空列表内容
        list.empty();
        if (iscroll) {
            iscroll.destroy();
            iscroll = null;
        }
        // 获取数据长度
        var l = arr.length,
        // 循环索引
            i = 0,
        // 需要插入到城市列表中的html拼接后的字符串
            html = '<div><ul>';
        // 循环遍历所有城市数据，拼接为li节点以供用户点击选择城市使用
        for (; i < l; i++) {
            var data = arr[i];
            // en为城市缩写
            html += '<li data-en=\'' + data[1] + '\'>' + data[0] + '</li>';
        }
        // 闭合节点
        html += '</ul></div>';
        // 将字符串html插入到城市列表中
        list.html(html);
        // 初始化滑动插件
        iscroll = new IScrollLite(list.find('div')[0], {
            scrollX: false,
            scrollY: true,
            bindToWrapper: true
        });
    }

    /**
     * 格式化用户输入内容并返回格式化后字符串
     * @param str 用户的输入内容
     * @returns {XML|string|void}
     */
    function inputFormat(str) {
        return str.replace(/[~!@#$%^&*()-+_=:]/g, '');
    }

    // 设置置顶浏览器
    $(window).scrollTop(1);
    // 绑定input事件，执行自动提示操作
    searchInput.on('input focus', function () {
        // 获取格式化后的用户输入
        var inputValue = inputFormat(searchInput.val());
        // 存在用户输入时调用ajax获取城市列表
        if (inputValue) {
            // 当前一个ajax存在时中断
            ajax && ajax.abort();
            // 获取最新启动的ajax
            ajax = $.ajax({
                url: '/activity.d?m=getCityPinyinName&cityName=' + inputValue,
                dataType: 'json',
                success: function (data) {
                    jumpOk = '';
                    if (data.length > 0) {
                        if (data.length === 1) {
                            jumpOk = data[0][1];
                        }
                        setList(data);
                    } else {
                        list.empty();
                        if (iscroll) {
                            iscroll.destroy();
                            iscroll = null;
                        }
                    }
                }
            });
        } else {
            // 用户输入为空时传入默认的城市数据
            setList(defalutData);
        }
    });
    // 点击其他位置隐藏选择框操作
    $(window).on('touchstart', function (e) {
        var $target = $(e.target);
        var parent = $target.closest('.cysearch');
        if (parent.length < 1) {
            jumpOk = '';
            list.empty();
            if (iscroll) {
                iscroll.destroy();
                iscroll = null;
                searchInput.blur();
            }
        }
    });
    // 事件委托点击城市列表中的li跳转到指定的城市大首页
    list.on('click', 'li', function () {
        var $this = $(this);
        var en = $this.attr('data-en');
        if (en) {
            searchInput.val($this.html());
            list.empty();
            if (iscroll) {
                iscroll.destroy();
                iscroll = null;
            }
            window.location.href = '/' + en + '.html';
        }
    });
    // 绑定keyup事件，执行当手机端点击了键盘上的搜索按钮时操作
    searchInput.on('keyup', function (e) {
        // 判断为手机端点击搜索按钮
        if (e.keyCode === 13 && jumpOk) {
            list.empty();
            if (iscroll) {
                iscroll.destroy();
                iscroll = null;
            }
            window.location.href = '/' + jumpOk + '.html';
        }
    });
});