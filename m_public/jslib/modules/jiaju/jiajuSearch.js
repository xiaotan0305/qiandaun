/**
 * 家居搜索主类
 * by blue
 * modified by icy(taoxudong@fang.com)
 */
define('search/jiaju/jiajuSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var search = require('search/search');
    var vars = seajs.data.vars;
    var channelList = {
        designerList: ['设计师', '设计师/公司/门店等'],
        jjList: ['家具', '请输入家具品牌', '?c=jiaju&a=ajaxGetJcSearchTip'],
        buildList: ['主材', '请输入建材品牌', '?c=jiaju&a=ajaxGetJcSearchTip'],
        xgtList: ['美图', '功能间/风格/居室等'],
        zxbj: ['美图', '楼盘/户型/功能间/风格等'],
        visitGd: ['工地', '请输入楼盘/姓名等']
    };
    var clickList = {
        designerList: 'wapdesignnerlist',
        buildList: 'wapjclist',
        jjList: 'wapjclist',
        xgtList: 'wapzxxgt',
        zxbj: 'wapzxbj'
    };
    var clickId = clickList[vars.action] ? {
        back: clickList[vars.action] + '_D21_16',
        clear: clickList[vars.action] + '_D21_21',
        searchIpt: clickList[vars.action] + '_D21_15',
        searchBtn: clickList[vars.action] + '_D21_20',
        clearHis: clickList[vars.action] + '_D21_13',
        hisList: clickList[vars.action] + '_D21_14'
    } : {
        back: '',
        clear: '',
        searchIpt: '',
        searchBtn: '',
        clearHis: '',
        hisList: ''
    };


    function JjSearch() {
        // 弹窗html字符串
        this.html = '<div>'
            + '<header class="header">'
            + '<div class="left" id="' + clickId.back + '"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent">' + channelList[vars.action][0] + '搜索' + '</div>'
            + '</header>'
            + '<form class="search flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt">'
            + '<input id="' + clickId.searchIpt + '" type="search" name="q" value="" placeholder="' + channelList[vars.action][1] + '" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;" id="' + clickId.clear + '"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="' + clickId.searchBtn + '" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="' + clickId.hisList + '"><ul></ul></div><div class="clearBtn2" id="'
            + clickId.clearHis + '">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div class="searHistory" id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="' + clickId.hisList + '"><ul></ul></div><div class="clearBtn2" id="'
            + clickId.clearHis + '">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = 'jiajuHistory' + vars.action;
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
        // 历史列表ul的父节点
        this.findHistoryList = '#historyList';
        // 清除历史按钮
        this.findDeleteHistoryListBtn = '#historyList a';
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
        // 页面地址
        this.location = window.location.href.replace('#', '');
        // 装修美图
        if ($.inArray(vars.action, ['xgtList']) !== -1) {
            this.location = '/jiaju/bj/xgt.html';
        }
        if ($.inArray(vars.action, ['zxbj']) !== -1) {
            this.location = '/jiaju/bj/zxbj.html';
        }
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(JjSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    JjSearch.prototype.createAutoPromptList = function (inputValue) {
        // 如果不存在联想地址，不需要联想
        if (channelList[vars.action][2]) {
            var url = vars.jiajuSite + channelList[vars.action][2];
            var obj = {
                q: inputValue,
                city: vars.city
            };
            search.createAutoPromptList.call(this, inputValue, url, obj);
        }
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    JjSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"  data-id="wapjjsy"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 声明跳转条件对象
            var obj = that.getFormatCondition({key: dataArr[i].name});
            var liHtml = normalHtmlStr;
            liHtml = liHtml.replace('xx', dataArr[i].name);
            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };


    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    JjSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        var searchKey = '';
        var keywordEl = that.showPopBtn.find('.input');
        searchKey = keywordEl.data('q');
        if (searchKey !== '') {
            that.searchInput.val(searchKey);
            that.offBtn.show();
        }
        if ($.inArray(vars.action, ['zxbj', 'xgtList']) === -1) {
            that.creatHistoryList();
        } else {
            that.historyList.hide();
        }
    };

    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示热搜词，否则隐藏热搜词
     */
    JjSearch.prototype.inputChange = function () {
        var that = this;
        search.inputChange.call(that);
        if ($.trim(that.searchInput.val()) !== '') {
            if (that.historyList.is(':visible')) {
                that.historyList.hide();
            }
        } else {
            that.closeAutoPromptList();
        }
    };

    /**
     * 关闭自动提示列表重写
     * 增加显示热词和显示历史记录操作
     */
    JjSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        if ($.inArray(vars.action, ['zxbj', 'xgtList']) === -1) {
            that.creatHistoryList();
        }
    };

    /**
     * 点击搜索按钮处理
     */
    JjSearch.prototype.search = function () {
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
            var obj = that.getFormatCondition({key: b});
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
        }
        that.back();
        // 搜索跳转地址
        if (/[&?]q=/i.test(that.location)) {
            window.location = that.location.replace(/([&?]q=)([^&]*)(&|$)/i, '$1' + encodeURIComponent(b) + '$3');
        } else {
            var hasQ = /[?]/i.test(that.location);
            window.location = that.location + (hasQ ? '&q=' : '?q=') + encodeURIComponent(b);
        }
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    JjSearch.prototype.getHistoryContent = function (arr) {
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
    JjSearch.prototype.clickListSearch = function (obj) {
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
        that.back();
        // 搜索跳转地址
        if (/[&?]q=/i.test(that.location)) {
            window.location = that.location.replace(/([&?]q=)([^&]*)(&|$)/i, '$1' + encodeURIComponent(obj.key) + '$3');
        } else {
            var hasQ = /[?]/i.test(that.location);
            window.location = that.location + (hasQ ? '&q=' : '?q=') + encodeURIComponent(obj.key);
        }
        that.writeSearchLeaveTimeLog(that.columnType);
    };
    module.exports = JjSearch;
});