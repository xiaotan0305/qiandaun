/**
 * 资讯搜索主类
 * by blue
 * modified by zdl 15-12-8
 */

define('search/news/newsSearch', ['jquery', 'search/search', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 获取滚动插件，新需求中如果有历史记录则热词要变成一行滚动
    var iscorll = require('iscroll/2.0.0/iscroll-lite');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function ZxSearch() {
        // 弹窗html字符串
        this.html = '<div class="main whitebg">'
            + '<header class="header">'
            + '<div class="left" id="wapzfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>资讯搜索</span></div>'
            + '</header>'
            + '<form class="search pdX14" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox flexbox">'
            + '<div class="ipt" id="wapzfsy_D01_09">'
            + '<input type="search" name="q" value="" placeholder="请输入您的问题" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wapzfsy_D01_18" class="btn"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searLast" id="wapzfsy_D01_19"><h3><span class="s-icon-his"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapzfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapzfsy_D01_09">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapzfsy_D01_08"><ul></ul></div><div class="clearBtn" id="wapzfsy_D01_09">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'newsHistory';
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
    $.extend(ZxSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    ZxSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.newsSite + '?c=news&a=ajaxGetSearchTip';
        var obj = {
            keyword: inputValue,
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
    ZxSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 声明跳转条件对象
            var obj = that.getFormatCondition({key: dataArr[i].word});
            var liHtml = normalHtmlStr;
            liHtml = liHtml.replace('xx', dataArr[i].word);
            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };

    /**
     * 创建热词列表
     */
    ZxSearch.prototype.createHotSearch = function () {
        var that = this;
        if (that.hotSearchList.parent().is(':hidden')) {
            that.hotSearchList.parent().show();
        }
        // 获取是否有历史数据
        var hasHistory = that.hasHistory();
        // 判断子节点长度，不再每次都调用接口获取热词数据，目的为减少网络请求数
        if (that.hotSearchList.children().length > 0) {
            if (hasHistory) {
                // 有历史情况下
                if (that.scroll) {
                    // 刷新滚动插件，并且重置位置
                    that.scroll.refresh();
                    that.scroll.scrollTo(0, 0);
                } else {
                    // 操作过程中有了历史记录的情况
                    that.hotSearchList.html('<div id="scroller">' + that.hotSearchList.html() + '</div>');
                    that.setScroll();
                }
            } else if (that.scroll) {
                // 操作过程中没有了历史记录，销毁插件，并重新设置热词显示排布
                that.hotSearchList.html(that.hotSearchList.find('#scroller').html());
                that.scroll.destroy();
                that.scroll = undefined;
            }
            return;
        }

        /**
         * 调用获取热词数据接口
         */
        $.get(vars.newsSite + '?c=news&a=ajaxGetSearchHot', {
            city: vars.city
        }, function (data) {
            if (data && $.isArray(data)) {
                var html = '';

                /**
                 * 循环遍历数据，构建热词列表a标签html字符串
                 */
                for (var i = 0; i < data.length; i++) {
                    if (data[i]) {
                        var obj = that.getFormatCondition({
                            key: data[i]['Keyword'],
                            purpose: data[i].Purpose
                        });
                        html += '<a href="javascript:void(0);"><span class="searchListName" data-ywtype=\''
                            + that.setJumpCondition(obj) + '\'>' + data[i]['Keyword'] + '</span></a>';
                    }
                }
                // 有历史则需要加入滚动插件固定节点
                if (hasHistory) {
                    html = '<div id="scroller">' + html + '</div>';
                }
                that.hotSearchList.html(html);
                // 有历史则声明滚动插件实现热词滚动
                if (hasHistory) {
                    that.setScroll();
                }
            }
        });
    };

    /**
     * 当有历史记录时，设置热词变成一行并滚动
     */
    ZxSearch.prototype.setScroll = function () {
        var that = this;
        // 通过获取热词中的a标签节点数组算出组成一行需要的宽度
        var aArr = that.hotSearchList.find('a'), l = aArr.length, leng = 0;
        for (var i = 0; i < l; i++) {
            leng += aArr.eq(i).outerWidth(true);
        }
        that.hotSearchList.find('#scroller').width(leng + 1);
        if (!that.scroll) {
            that.scroll = new iscorll(that.hotSearchList[0], {
                bindToWrapper: true, scrollY: false, scrollX: true
            });
            that.scroll.refresh();
            that.scroll.scrollTo(0, 0);
        } else {
            that.scroll.refresh();
            that.scroll.scrollTo(0, 0);
        }
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    ZxSearch.prototype.showPop = function () {
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
    ZxSearch.prototype.inputChange = function () {
        var that = this;
        search.inputChange.call(that);
        if ($.trim(that.searchInput.val()) !== '') {
            if (that.hotSearchList.parent().is(':visible')) {
                that.hotSearchList.parent().hide();
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
    ZxSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * 重写clearAllList方法
     * 增加清除所有列表之后也清除热词列表
     */
    ZxSearch.prototype.clearAllList = function () {
        var that = this;
        search.clearAllList.call(that);
        that.clearHotSearch();
    };

    /**
     * 清除热词
     */
    ZxSearch.prototype.clearHotSearch = function () {
        var that = this;
        that.hotSearchList.empty();
        // 清除滚动插件
        if (that.scroll) {
            that.scroll.destroy();
            that.scroll = undefined;
        }
        if (that.hotSearchList.parent().is(':visible')) {
            that.hotSearchList.parent().hide();
        }
    };

    /**
     * 重写清除历史记录方法
     * 增加之后重建热词列表
     */
    ZxSearch.prototype.deleteHistoryList = function () {
        var that = this;
        search.deleteHistoryList.call(that);
        that.createHotSearch();
    };

    /**
     * 点击搜索按钮处理
     */
    ZxSearch.prototype.search = function () {
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
        window.location = vars.newsSite + '?c=news&a=search&city=' + vars.city + '&keyword=' + b;
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    ZxSearch.prototype.getHistoryContent = function (arr) {
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
    ZxSearch.prototype.clickListSearch = function (obj) {
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
        // 跳转搜索地址
        window.location = vars.newsSite + '?c=news&a=search&city=' + vars.city + '&keyword=' + encodeURIComponent(obj.key);
        that.writeSearchLeaveTimeLog(that.columnType);
    };
    module.exports = ZxSearch;
});