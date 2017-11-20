/**
 * 经纪人搜索主类
 * 20161124 bjwanghongwei@fang.com
 */
define('search/agent/searchAgent', ['search/mainSearch'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/mainSearch');
    // 页面传入的参数
    var vars = seajs.data.vars;
    //搜索
    function agentSearch() {
        // 弹窗输入框默认显示内容
        this.titCon = '请输入商圈或经纪人姓名';
        // 弹窗html字符串
        this.html = '<div class="searchPage">'
            + '<header class="header">'
            + '<div class="left" id="wapesfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>房天下经纪人</span></div>'
            + '</header>'
            + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt" id="wapesfsy_D01_09">'
            + '<input type="search" name="q" value="" placeholder="' + this.titCon + '" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wapesfsy_D01_18" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapesfsy_D01_32">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_31"><ul></ul></div></div>'
            + '</div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'agentSearchHistory';
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
        // 历史列表ul的父节点
        this.findHistoryList = '#historyList';
        // 清除历史按钮
        this.findDeleteHistoryListBtn = '#historyList a';
        // 历史记录数量
        this.HISTORY_NUMBER = 10;
        this.standardObj = {
            // 搜索的关键字
            key: '',
            // 显示字
            showWord: '',
            // 后缀
            suffix: '',
            // 商圈
            comarea: '',
            // 区域
            district: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(agentSearch.prototype, search);

    /**
     * 重写showPop
     * 点击搜索框弹窗操作
     */
    agentSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        that.creatHistoryList();
    };
    //格式化创建热词功能
    agentSearch.prototype.createHotSearch = function () {
        console.log('sssssss');
    };
    //格式化自动提示列表功能
    agentSearch.prototype.createAutoPromptList = function () {
        console.log('sssssss');
    };
    /**
     * 点击列表条目搜索
     * @param obj
     */
    agentSearch.prototype.clickListSearch = function (obj) {
        if (!obj)return;
        var that = this;
        // 将搜索关键字写入搜索input中
        that.searchInput.val(obj.key);
        if (obj.historyUrl) {
            that.setOtherHistory(obj, obj.historyUrl);
            window.location = obj.historyUrl;
            return;
        }
        that.writeSearchLeaveTimeLog(that.columnType);
    };
    /**
     * 点击搜索按钮处理
     */
    agentSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        // 如果关键字为空，直接点击搜索按钮时返回到列表页首页
        if (!b) {
            window.location = vars.agentSite + vars.city + '/';
            return;
        }
        var url = vars.agentSite + vars.city + '/?';
        url += 'keyword=' + b;
        that.setOtherHistory({key: b, showWord: b, suffix: ''}, url);
        window.location = url + '&x=' + Math.random();
    };
    module.exports = agentSearch;
});

