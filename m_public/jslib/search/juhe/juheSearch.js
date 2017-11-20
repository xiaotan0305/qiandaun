/**
 * 聚合搜索主类
 * by blue
 */
define('search/juhe/juheSearch', ['jquery', 'search/search'], function (require, exports, module) {
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
    function JuheSearch() {
        // 增加一个变量，由于知识比较特殊，新房知识是经过了css改造的新版但是其他的都不是
        // 为了以后全部修改完之后做准备单独分离出两个html字符串显示搜索，直接删掉旧版html字符串即可
        var html = '';
        html = '<div class="searchPage">'
            + '<header class="header">'
            + '<div class="left"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>聚合搜索</span></div>'
            + '</header>'
            + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt">'
            + '<input type="search" name="q" value="" placeholder="请输入您的问题" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searLast">'
            + '<h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>'
            + '<div style="margin-bottom: 50px;" class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div class="searList"><ul></ul></div>'
            + '<div class="clearBtn">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div>'
            + '<div style="margin-bottom: 50px;" id="autoPromptList">'
            + '<div class="searList"><ul></ul></div>'
            + '<div class="clearBtn">'
            + '<a href="javascript:void(0);">关闭</a></div></div>'
            + '</div>';
        // 弹窗html字符串
        this.html = html;
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'juheHistory';
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
            key: '',
            // 跳转的地址
            jumpUrl: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(JuheSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    JuheSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.juheSite + '?c=juhe&a=ajaxGetSearchTip';
        var obj = {
            kw: inputValue,
            city: vars.city
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    JuheSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 声明跳转条件对象
            var obj = that.getFormatCondition({key: dataArr[i].title});
            var liHtml = normalHtmlStr.replace('xx', dataArr[i].title);
            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };

    /**
     * 创建热词列表
     */
    JuheSearch.prototype.createHotSearch = function () {
        var that = this;
        if (that.hotSearchListParent.is(':hidden')) {
            that.hotSearchListParent.show();
        }
        // 判断子节点长度，不再每次都调用接口获取热词数据，目的为减少网络请求数
        if (that.hotSearchList.children().length > 0) {
            return;
        }

        /**
         * 调用获取热词数据接口
         */
        $.get(vars.juheSite + '?c=juhe&a=ajaxGetHotTags', {
            city: vars.city
        }, function (data) {
            if (data && $.isArray(data)) {
                var html = '';
                // 循环遍历数据，构建热词列表a标签html字符串
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        var obj = that.getFormatCondition({
                            key: data[i].keyword,
                            jumpUrl: data[i].detailUrl
                        });
                        html += '<a href="javascript:void(0);"><h2 class="searchListName" data-ywtype=\'' + that.setJumpCondition(obj)
                            + '\'>' + data[i].keyword + '</h2></a>';
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
    JuheSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        if (!that.hotSearchList) {
            that.hotSearchList = that.searchPop.find(that.findHotSearchList);
            that.hotSearchListParent = that.hotSearchList.parent();
            that.hotSearchList.on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
        }
        var keywordEl = that.showPopBtn.find('.ipt input');
        if (keywordEl.length > 0) {
            var searchKey = keywordEl.val();
            if (searchKey !== '请输入您的问题' && searchKey !== '') {
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
    JuheSearch.prototype.inputChange = function () {
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
    JuheSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * 重写clearAllList方法
     * 增加清除所有列表之后也清除热词列表
     */
    JuheSearch.prototype.clearAllList = function () {
        var that = this;
        search.clearAllList.call(that);
        that.clearHotSearch();
    };

    /**
     * 清除热词
     */
    JuheSearch.prototype.clearHotSearch = function () {
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
    JuheSearch.prototype.deleteHistoryList = function () {
        var that = this;
        search.deleteHistoryList.call(that);
        that.createHotSearch();
    };

    /**
     * 点击搜索按钮处理
     */
    JuheSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
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
        window.location = vars.juheSite + '?c=juhe&a=search&keyword=' + encodeURIComponent(b) + '&r=' + Math.random();
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    JuheSearch.prototype.getHistoryContent = function (arr) {
        var that = this,
            len = arr.length,
            html = '';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        // 循环遍历历史记录数据，拼接html字符串
        for (var i = 0; i < len; i++) {
            // 修改key为空出现li标签bug
            if (arr[i] && (arr[i].key !== '' || arr[i].jumpUrl !== '')) {
                var liHtml = normalHtmlStr.replace('xx', arr[i].key);
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
    JuheSearch.prototype.clickListSearch = function (obj) {
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
        window.location = vars.juheSite + '?c=juhe&a=search&keyword=' + encodeURIComponent(obj.key) + '&r=' + Math.random();
    };
    module.exports = JuheSearch;
});