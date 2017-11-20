/**
 * 问答搜索主类
 * by blue
 */
define('search/ask/askSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;

    /**
     * 主类
     * @constructor
     */
    function AskSearch() {
        // 弹窗html字符串
        this.html = '<div class="searchPage">'
            + '<header class="header">'
            + '<div class="left" id="wapasksy_D11_01"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>问答搜索</span></div>'
            + '</header>'
            + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt" id="wapasksy_D11_02">'
            + '<input type="search" name="q" value="" placeholder="请输入您的问题" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" id="wapasksy_D11_09" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wapasksy_D11_03" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searLast">'
            + '<h3 id="wapasksy_D11_04"><a href="javascript:void(0);" class="change" id="changeBtn">换一批</a><span class="s-icon-hot"></span>最近热搜</h3>'
            + '<div class="cont clearfix" id="wapasksy_D11_05"><section id="hotList"></section></div>'
            + '</div>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapasksy_D11_07">'
            + '<ul></ul></div><div class="clearBtn" id="wapasksy_D11_08">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapasksy_D11_06">'
            + '<ul class="s-lx"></ul></div></div>'
            + '</div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'askHistory';
        // 显示弹窗的按钮
        this.showPopBtn = '#new_searchtext';
        // 返回按钮
        this.findBackBtn = '.back';
        // 搜索按钮
        this.findSearchBtn = '.btn';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 搜索的input标签
        this.findSearchInput = 'input';
        // 换一换按钮
        this.findChangeBtn = '#changeBtn';
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
        this.HISTORY_NUMBER = 10;
        this.standardObj = {
            // 搜索的关键字
            key: '',
            // 跳转的地址
            jumpUrl: '',
            // 回答人数
            asNum: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(AskSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    AskSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.askSite + '?c=ask&a=ajaxGetSearchTip';
        var obj = {
            q: inputValue,
            city: vars.city
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    AskSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 问答数据html显示字符串
        var askHtmlStr = '<li><a href="javascript:void(0);"><span class="num">yy人回答</span>'
            + '<span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            var liHtml = '';
            var singleData = dataArr[i];
            // 声明跳转条件对象
            var obj = that.getFormatCondition({key: singleData.name});
            if (singleData.answercount) {
                liHtml = askHtmlStr.replace('yy', singleData.answercount);
                obj.asNum = singleData.answercount;
            } else {
                liHtml = normalHtmlStr;
            }
            liHtml = liHtml.replace('xx', dataArr[i].name);
            obj.jumpUrl = singleData.url;
            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };

    /**
     * 创建热词列表
     */
    AskSearch.prototype.createHotSearch = function () {
        var that = this;
        if (that.hotSearchListParent.is(':hidden')) {
            that.hotSearchListParent.show();
        }
        // 判断子节点长度，不再每次都调用接口获取热词数据，目的为减少网络请求数
        if (that.hotSearchList.children().length > 0) {
            return;
        }
        // 调用获取热词数据接口
        $.get(vars.askSite + '?c=ask&a=ajaxGetHotkeywordList', {
            city: vars.city
        }, function (data) {
            if (data) {
                var html = '';
                // 循环遍历数据，构建热词列表a标签html字符串
                for (var i = 0; i < data.length; i++) {
                    var singleData = data[i];
                    if (singleData) {
                        var obj = that.getFormatCondition({
                            key: singleData.Keyword,
                            jumpUrl: singleData.url
                        });
                        html += '<a href="javascript:void(0);"><h2 class="searchListName" data-ywtype=\''
                            + that.setJumpCondition(obj) + '\'>' + singleData.Keyword + '</h2></a>';
                    }
                }
                that.hotSearchList.html(html);
            }
        });
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    AskSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        if (!that.hotSearchList) {
            that.hotSearchList = that.searchPop.find(that.findHotSearchList);
            that.hotSearchListParent = that.hotSearchList.closest('.searLast');
            that.changeBtn = that.searchPop.find(that.findChangeBtn);
            // 执行换一换操作
            that.changeBtn.on('click', function () {
                that.hotSearchList.empty();
                that.createHotSearch();
            });
            that.hotSearchList.on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
        }
        var keywordEl = that.showPopBtn;
        if (keywordEl.length > 0) {
            var searchKey = keywordEl.text();
            if (searchKey && searchKey !== '请输入您的问题') {
                that.searchInput.val(searchKey);
                that.offBtn.show();
            }
        }
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示热搜词，否则隐藏热搜词
     */
    AskSearch.prototype.inputChange = function () {
        var that = this;
        search.inputChange.call(that);
        if ($.trim(that.searchInput.val())) {
            if (that.hotSearchListParent.is(':visible')) {
                that.hotSearchListParent.hide();
            }
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
    AskSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * 重写clearAllList方法
     * 增加清除所有列表之后也清除热词列表
     */
    AskSearch.prototype.clearAllList = function () {
        var that = this;
        search.clearAllList.call(that);
        that.clearHotSearch();
    };

    /**
     * 清除热词
     */
    AskSearch.prototype.clearHotSearch = function () {
        var that = this;
        that.hotSearchList.empty();
        if (that.hotSearchListParent.is(':visible')) {
            that.hotSearchListParent.hide();
        }
    };

    /**
     * 重写清除历史记录方法
     * 增加之后重建热词列表
     */
    AskSearch.prototype.deleteHistoryList = function () {
        var that = this;
        search.deleteHistoryList.call(that);
        that.createHotSearch();
    };

    /**
     * 点击搜索按钮处理
     */
    AskSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        if (!b) {
            window.location = vars.askSite + vars.city + '.html';
            return;
        }
        if (vars.localStorage) {
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
        window.location = vars.askSite + '?c=ask&a=search&keyword=' + encodeURIComponent(b) + '&city=' + vars.city + '&r=' + Math.random();
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    AskSearch.prototype.getHistoryContent = function (arr) {
        var that = this,
            len = arr.length,
            html = '';
        // 问答数据html显示字符串
        var askHtmlStr = '<li><a href="javascript:void(0);"><span class="num">yy人回答</span>'
            + '<span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        // 循环遍历历史记录数据，拼接html字符串
        for (var i = 0; i < len; i++) {
            var singleData = arr[i];
            if (singleData) {
                var liHtml = '';
                // 声明跳转条件对象
                if (singleData.asNum) {
                    liHtml = askHtmlStr.replace('yy', singleData.asNum);
                } else {
                    liHtml = normalHtmlStr;
                }
                liHtml = liHtml.replace('xx', arr[i].key);
                // 储存条件对象数据
                liHtml = liHtml.replace('zz', that.setJumpCondition(arr[i]));
                html += liHtml;
            }
        }
        return html;
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    AskSearch.prototype.clickListSearch = function (obj) {
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
            return;
        }
        window.location = vars.askSite + '?c=ask&a=search&keyword=' + encodeURIComponent(obj.key) + '&city=' + vars.city + '&r=' + Math.random();
    };
    module.exports = AskSearch;
});