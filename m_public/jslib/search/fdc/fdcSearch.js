/**
 * fdc搜索主类
 * by blue
 * modified by icy(taoxudong@fang.com)
 */
define('search/fdc/fdcSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var search = require('search/search');
    var vars = seajs.data.vars;
    var type;
    switch (vars.action) {
        case 'getReportInfo':
            type = 'report';
            break;
        case 'getWenkuInfo':
            type = 'wenku';
            break;
        case 'getNewsList':
            type = 'news';
            break;
        default:
            type = vars.type || 'report';
            break;
    }
    var channelList = {
        wenku: ['文库'],
        report: ['报告'],
        news: ['资讯']
    };
    var clickList = {};
    var clickId = clickList[vars.action] ? {
        back: clickList[vars.action] + '_D21_16',
        clear: clickList[vars.action] + '_D21_21',
        searchIpt: clickList[vars.action] + '_D21_15',
        searchBtn: clickList[vars.action] + '_D21_20',
        clearHis: clickList[vars.action] + '_D21_13',
        hisList: clickList[vars.action] + '_D21_14',
        searLast: clickList[vars.action] + '_D21_19'
    } : {
        back: '',
        clear: '',
        searchIpt: '',
        searchBtn: '',
        clearHis: '',
        hisList: '',
        searLast: ''
    };

    function fdcSearch() {
        // 弹窗html字符串
        this.html = '<div class="searchPage">' + '<header class="header">' + '<div class="left" id="' + clickId.back + '"><a href="javascript:void(0);" class="back"><i></i></a></div>' + '<div class="cent">' + channelList[type][0] + '搜索' + '</div>' + '</header>' + '<form class="search flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' + '<div class="searbox">' + '<div class="ipt">' + '<input id="' + clickId.searchIpt + '" type="search" name="q" value="" placeholder="请输入关键字" autocomplete="off">' + '<a href="javascript:void(0);" class="off" style="display: none;" id="' + clickId.clear + '"></a>' + '</div>' + '<a href="javascript:void(0);" id="' + clickId.searLast + '" class="btn" rel="nofollow"><i></i></a>' + '</div>' + '</form>' + '<div class="searLast" id="' + clickId.searchBtn + '"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>' + '<div class="searHistory" id="historyList">' + '<h3><span class="s-icon-his"></span>搜索历史</h3>' + '<div style="margin-bottom: 50px;"><div class="searList" id="' + clickId.hisList + '"><ul></ul></div><div class="clearBtn" id="' + clickId.clearHis + '">' + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>' + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = 'fdcHistory' + type;
        // 显示弹窗的按钮
        this.showPopBtn = '#searchtext';
        // 返回按钮
        this.findBackBtn = '.back';
        // 搜索按钮
        this.findSearchBtn = '.btn';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 搜索的input标签
        this.findSearchInput = 'input';
        // 热搜词列表
        this.findHotSearchList = '#hotList';
        // 历史列表ul的父节点
        this.findHistoryList = '#historyList';
        // 清除历史按钮
        this.findDeleteHistoryListBtn = '#historyList a';
        // 自动提示列表ul的父节点
        this.findAutoPromptList = '#autoPromptList';
        // 关闭自动提示按钮
        this.findCloseAutoPromptListBtn = '#autoPromptList a';
        // 历史记录数量
        this.HISTORY_NUMBER = 5;
        this.standardObj = {
            // 搜索的关键字
            key: ''
        };
        this.HOTSEARCH_ARR = vars.hotWords.split(',');
        // 页面地址
        this.location = vars.fdcSite + '?c=fdc&a=searchResult&type=' + type;
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(fdcSearch.prototype, search);

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    fdcSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        if (!that.hotSearchList) {
            that.hotSearchList = that.searchPop.find(that.findHotSearchList);
            that.hotSearchList.on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
        }
        var searchKey = vars.keyword;
        if (searchKey) {
            that.searchInput.val(searchKey);
            that.offBtn.show();
        }
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * 创建热词列表
     */
    fdcSearch.prototype.createHotSearch = function () {
        var that = this;
        if (that.HOTSEARCH_ARR.length) {
            if (that.hotSearchList.parent().is(':hidden')) {
                that.hotSearchList.parent().show();
            }
            // 获取是否有历史数据
            var hasHistory = that.hasHistory();
            // 判断子节点长度，不再每次都调用接口获取热词数据，目的为减少网络请求数
            if (that.hotSearchList.children().length > 0) {
                return;
            }
            that.createHotList(that.HOTSEARCH_ARR);
        } else {
            that.hotSearchList.parent().hide();
        }
    };

    /**
     * 生成热搜列表
     * @param arr
     */
    fdcSearch.prototype.createHotList = function (data) {
        var that = this;
        if (data && $.isArray(data)) {
            var html = '';
            // 循环遍历数据，构建热词列表a标签html字符串
            for (var i = 0; i < data.length; i++) {
                if (data[i]) {
                    var obj = that.getFormatCondition({
                        key: data[i]
                    });
                    html += '<a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'' + that.setJumpCondition(obj) + '\'>' + data[i] + '</span></a>';
                }
            }
            that.hotSearchList.html(html);
            // 有历史则声明滚动插件实现热词滚动
        }
    };

    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示热搜词，否则隐藏热搜词
     */
    fdcSearch.prototype.inputChange = function () {
        var that = this;
        var inputValue = that.searchInput.val();
        if ($.trim(inputValue) === '') {
            if (that.offBtn.is(':visible')) {
                that.offBtn.hide();
            }
        } else {
            if (that.offBtn.is(':hidden')) {
                that.offBtn.show();
            }
        }
    };

    /**
     * 点击搜索按钮处理
     */
    fdcSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        that.searchInput.val(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        if (vars.localStorage && b) {
            // 转换当前点击搜索后的关键字为格式化后的条件对象，用来判断是否历史记录中重复
            var obj = that.getFormatCondition({
                key: b
            });
            // 获取消除重复后的历史记录对象字符串
            var history = that.judgeHistoryRepeat(obj);
            // 获取历史记录列表
            var historyList = that.getJumpCondition(history) || [];
            // 将当前条件对象插入历史记录
            historyList.unshift(obj);
            // 大于历史记录条数则删除最后一条
            if (historyList.length > that.HISTORY_NUMBER) {
                historyList.splice(that.HISTORY_NUMBER, 1);
            }
            // 存入localstorage
            vars.localStorage.setItem(that.historyMark, that.setJumpCondition(historyList));
            // 搜索跳转地址
            window.location = that.location + '&keyword=' + encodeURIComponent(b);
        }
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    fdcSearch.prototype.getHistoryContent = function (arr) {
        var that = this,
            len = arr.length,
            html = '';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';

        /**
         * 循环遍历历史记录数据，拼接html字符串
         */
        for (var i = 0; i < len; i++) {
            // 修改key为空出现li标签bug
            if (arr[i] && (arr[i].key !== '' || arr[i].jumpUrl !== '')) {
                var liHtml = normalHtmlStr;
                liHtml = liHtml.replace('xx', arr[i].key);
                // 储存条件对象数据
                liHtml = liHtml.replace('zz', that.setJumpCondition(arr[i]));
                html += liHtml;
            }
        }
        if (html === '') {
            that.deleteHistoryList();
        }
        return html;
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    fdcSearch.prototype.clickListSearch = function (obj) {
        if (!obj) return;
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
        // 搜索跳转地址
        window.location = that.location + '&keyword=' + encodeURIComponent(obj.key);
    };
    module.exports = fdcSearch;
});
