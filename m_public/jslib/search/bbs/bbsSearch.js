/**
 * 论坛搜索主类
 * by blue
 * 调用方式：
 * preload.push('search/search', 'search/bbs/bbsSearch');
 */
define('search/bbs/bbsSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function MapSearch() {
        // 弹窗html字符串
        this.html = '<div class="searchPage">'
        + '<header class="header">'
        + '<div class="left" id="wapbbssy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
        + '<div class="cent"><span>论坛搜索</span></div>'
        + '</header>'
        + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
        + '<div class="searbox" id="wapbbssy_D01_05">'
        + '<div class="ipt">'
        + '<input type="search" name="q" value="" placeholder="楼盘名/小区名/论坛名" autocomplete="off">'
        + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
        + '</div>'
        + '<a href="javascript:void(0);" id="wapbbssy_D01_06" class="btn" rel="nofollow"><i></i></a>'
        + '</div>'
        + '</form>'
        + '<div class="searHistory" id="historyList">'
        + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
        + '<div style="margin-bottom: 50px;"><div class="searList" id="wapbbssy_D01_10"><ul></ul></div>'
        + '<div class="clearBtn" id="wapbbssy_D01_11">'
        + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
        + '<div id="autoPromptList">'
        + '<div style="margin-bottom: 50px;"><div class="searList" id="wapbbssy_D01_10"><ul></ul></div>'
        + '<div class="clearBtn" id="wapbbssy_D01_11"><a href="javascript:void(0);">关闭</a></div></div></div>'
        + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'bbsHistory';
        // 显示弹窗的按钮
        this.showPopBtn = '.searbox';
        // 返回按钮
        this.findBackBtn = '.back';
        // 搜索按钮
        this.findSearchBtn = '.btn';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 搜索的input标签
        this.findSearchInput = 'input';
        // 历史列表ul的父节点
        this.findHistoryList = '#historyList';
        // 清除历史按钮
        this.findDeleteHistoryListBtn = '#historyList a';
        this.ns = '';
        // 自动提示列表ul的父节点
        this.findAutoPromptList = '#autoPromptList';
        // 关闭自动提示按钮
        this.findCloseAutoPromptListBtn = '#autoPromptList a';
        // 历史记录数量
        this.HISTORY_NUMBER = 10;
        this.standardObj = {
            // 搜索的关键字
            key: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(MapSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    MapSearch.prototype.createAutoPromptList = function (inputValue) {
        var that = this;
        if (!that.ns) {
            that.getNS();
        }
        var url = vars.bbsSite + '?c=bbs&a=ajaxGetKeySearch&ns=' + that.ns;
        var obj = {
            q: inputValue,
            city: vars.city
        };
        search.createAutoPromptList.call(that, inputValue, url, obj);
    };

    /**
     * 重写返回操作
     */
    MapSearch.prototype.back = function () {
        var that = this;
        var keywordEl = that.showPopBtn.find('#S_searchtext');
        if (keywordEl.length > 0) {
            // 获取用户输入内容
            var searchInputVal = that.searchInput.val();
            // 格式化用户输入内容
            var formatVal = that.inputFormat(searchInputVal);
            // 去掉开头和结尾的空格
            var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
            keywordEl.val(b);
        }
        search.back.call(that);
    };

    /**
     * 获取自动提示列表内容
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    MapSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var liHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';

        /**
         * 循环遍历，每次组成一条自动提示数据
         */
        for (var i = 0; i < dataArrL; i++) {
            var showWord = dataArr[i].projname;
            // 需要组成自动回复一条数据的hmtl字符串
            var liHtml = liHtmlStr.replace('xx', showWord);
            // 声明跳转条件对象
            var obj = that.getFormatCondition({key: showWord});
            // 要跳转到bbs列表页
            obj.jumpUrl = dataArr[i].url;
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };

    /**
     * 获取南北方
     */
    MapSearch.prototype.getNS = function () {
        var that = this;
        $.get(vars.bbsSite + '/?c=bbs&a=ajaxGetCityNSByName&r=' + Math.random(), function (o) {
            that.ns = o;
        });
    };

    /**
     * 重写showPop
     * 增加获取南北方操作
     */
    MapSearch.prototype.showPop = function () {
        var that = this;
        if (!that.ns) {
            $(document.body).css('background', '#fff');
            that.getNS();
        }
        search.showPop.call(that);
        var keywordEl = that.showPopBtn.find('#S_searchtext');
        if (keywordEl.length > 0) {
            var searchKey = keywordEl.val();
            if (searchKey) {
                that.searchInput.val(searchKey);
                that.offBtn.show();
            }
        }
        that.creatHistoryList();
    };

    /**
     * 点击搜索按钮处理
     */
    MapSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        // 转换当前点击搜索后的关键字为格式化后的条件对象，用来判断是否历史记录中重复
        var obj = that.getFormatCondition({key: b});
        that.clickListSearch(obj);
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    MapSearch.prototype.getHistoryContent = function (arr) {
        var that = this;
        var dataArrL = arr.length;
        var html = '';
        // 普通显示条数的html字符串
        var liHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';

        /**
         * 循环遍历，每次组成一条自动提示数据
         */
        for (var i = 0; i < dataArrL; i++) {
            var obj = arr[i];
            // 修改key为空出现li标签bug
            if (arr[i] && (arr[i].key !== '' && arr[i].jumpUrl !== '')) {
                // 需要组成自动回复一条数据的hmtl字符串
                var liHtml = liHtmlStr.replace('xx', obj.key);
                // 声明跳转条件对象
                liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
                html += liHtml;
            }
        }
        return html;
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    MapSearch.prototype.clickListSearch = function (obj) {
        if (!obj)return;
        var that = this;
        // 将搜索关键字写入搜索input中
        that.searchInput.val(obj.key);
        if (vars.localStorage) {
            // 获取排重后的历史记录字符串
            var history = that.judgeHistoryRepeat(obj);
            // 获取历史记录数组
            var historyList = that.getJumpCondition(history) || [];
            // 头插改搜索数据
            historyList.unshift(obj);
            // 大于最大历史记录数量时删除最后一条数据
            if (historyList.length > that.HISTORY_NUMBER) {
                historyList.splice(that.HISTORY_NUMBER, 1);
            }
            // 将历史记录写入loaclstorage
            vars.localStorage.setItem(that.historyMark, that.setJumpCondition(historyList));
        }
        if (obj.jumpUrl) {
            window.location = obj.jumpUrl;
        } else {
            var url = vars.bbsSite + '?c=bbs&a=search&city=' + vars.city;
            window.location = url + '&q=' + encodeURIComponent(obj.key) + '&r=' + Math.random();
        }

    };
    module.exports = MapSearch;
});