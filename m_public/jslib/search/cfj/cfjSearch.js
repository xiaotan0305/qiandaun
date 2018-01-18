/**
 * 查房价搜索主类
 * by blue
 */
define('search/cfj/cfjSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function CfjSearch() {
        // 弹窗html字符串
        this.html = '<div class="searchPage">'
            + '<header class="header">'
            + '<div class="left" id="wappinggusy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>查房价搜索</span></div>'
            + '</header>'
            + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt" id="wappinggusy_D01_09">'
            + '<input type="search" name="q" value="" placeholder="楼盘/地名/开发商等" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wappinggusy_D01_18" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wappinggusy_D01_10"><ul></ul></div><div class="clearBtn" id="wappinggusy_D01_09">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wappinggusy_D01_08"><ul></ul></div><div class="clearBtn" id="wappinggusy_D01_09">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'cfjHistory';
        // 显示弹窗的按钮
        this.showPopBtn = '#S_searchtext';
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
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(CfjSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    CfjSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.pingguSite + '?c=pinggu&a=ajaxGetSearchTip';
        var obj = {
            q: inputValue,
            city: vars.city
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    CfjSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 输入的值(搜索词)
        var inputKey = that.searchInput.val();
        var formatKey = that.inputFormat(inputKey);
        var reg = new RegExp(formatKey, 'i');
        //  普通显示条数的html字符串
        var liHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 联想数据
            var key = dataArr[i];
            // 标红数据 不区分大小写匹配
            var redKey = key.match(reg);
            if (redKey) {
                key = key.replace(redKey[0], '<em style="font-style: normal;color:#df3031">' + redKey[0] + '</em>');
            }
            var obj = that.getFormatCondition({key: dataArr[i]});
            var li = liHtmlStr.replace('xx', key);
            li = li.replace('zz', that.setJumpCondition(obj));
            html += li;
        }
        return html;
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    CfjSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        // 判断是否已经有了关键字,有的话带给搜索弹窗的input
        var searchKey = that.showPopBtn.val();
        if (searchKey) {
            that.searchInput.val(searchKey);
            that.offBtn.show();
        }
        that.creatHistoryList();
    };

    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示历史记录，否则相当于删除到了空字符，隐藏自动提示列表
     */
    CfjSearch.prototype.inputChange = function () {
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
     * 增加显示历史记录操作
     */
    CfjSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.creatHistoryList();
    };

    /**
     * 点击搜索按钮处理
     */
    CfjSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        if (vars.localStorage) {
            // 转换当前点击搜索后的关键字为格式化后的条件对象，用来判断是否历史记录中重复
            var obj = that.getFormatCondition({key: b});
            // 获取消除重复后的历史记录对象字符串
            var history = that.judgeHistoryRepeat(obj);
            // 获取历史记录列表
            var historyList = [];
            if (history) {
                // 如果有历史记录，则获取历史记录localStorage数据数组
                historyList = that.getJumpCondition(history);
            }
            // 将当前条件对象插入历史记录
            if (b !== '') {
                historyList.unshift(obj);
            }
            // 大于历史记录条数则删除最后一条
            if (historyList.length > that.HISTORY_NUMBER) {
                historyList.splice(that.HISTORY_NUMBER, 1);
            }
            // 存入localstorage
            vars.localStorage.setItem(that.historyMark, that.setJumpCondition(historyList));
        }
        var url = vars.pingguSite + '?c=pinggu&a=list&keyword=' + encodeURIComponent(b);
        window.location = url + '&city=' + vars.city + '&r=' + Math.random();
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    CfjSearch.prototype.getHistoryContent = function (arr) {
        var that = this,
            len = arr.length,
            html = '',
        // lihtml模板字符串
            templateStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';

        /**
         * 循环遍历历史记录数据，拼接html字符串
         */
        for (var i = 0; i < len; i++) {
            if (arr[i] && arr[i] !== '') {
                var str = templateStr.replace('zz', that.setJumpCondition(arr[i]));
                str = str.replace('xx', arr[i].key);
                html += str;
            }
        }
        return html;
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    CfjSearch.prototype.clickListSearch = function (obj) {
        var that = this;
        // 将别名过滤掉，不传给keyword
        obj.key = obj.key.replace(/（.*）/, '');
        that.searchInput.val(obj.key);
        that.search();
    };
    module.exports = CfjSearch;
})
;