/**
 * 搜房自营搜索主类
 * by tkp
 * 20161031 tankunpeng 搜房自营整合新房和二手房接口,搜索内切换
 */
define('search/zy/zySearch', ['jquery', 'search/mainSearch', 'search/newHouse/newHouseSearch', 'search/esf/esfSearch'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/mainSearch');
    // 引入各搜索模块备用
    var XfSearch = require('search/newHouse/newHouseSearch');
    var EsfSearch = require('search/esf/esfSearch');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function zySearch() {
        // 弹窗输入框默认显示内容
        this.titCon = vars.railwayNum && parseInt(vars.railwayNum) > 0 ? '楼盘名/地铁/开发商/房产百科等' : '楼盘名/地名/开发商/房产百科等';
        // 弹窗html字符串
        this.html = '<div class="searchPage">' + '<header class="header">' +
            '<div class="left" id="wapxfsy_D01_08"><a href="javascript:void(0);" id="wapxfzysy_D01_08" class="back"><i></i></a></div>' +
            '<div class="HlistTab"><ul class="flexbox item-2" id="itemTab">' +
            '<li class="cur"><a href="javascript:void(0);">新房</a></li><li><a href="javascript:void(0);">二手房</a></li>' + '</ul></div>' + '</header>' +
            '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">' + '<div class="searbox">' +
            '<div class="ipt" id="wapxfzysy_D01_09">' + '<input type="search" name="q" value="" placeholder="' + this.titCon + '" autocomplete="off">' +
            '<a href="javascript:void(0);" class="off" style="display: none;"></a>' + '</div>' +
            '<a href="javascript:void(0);" id="wapxfzysy_D01_18" class="btn" rel="nofollow"><i></i></a>' + '</div>' + '</form>' +
            '<div class="searLast" id="wapxfzysy_D01_19"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>' +
            '<div class="searHistory" id="historyList">' + '<h3><span class="s-icon-his"></span>搜索历史</h3>' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapxfzysy_D01_10"><ul></ul></div><div class="clearBtn" id="wapxfzysy_D01_32">' +
            '<a href="javascript:void(0);">清除历史记录</a></div></div></div>' + '<div class="searHistory" id="autoPromptList">' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapxfzysy_D01_31"><ul></ul></div></div>' + '</div>' + '</div>';
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
        // 标签切换
        this.findItemTab = '#itemTab';
        // 标签切换class
        this.activeClass = 'cur';
        // 搜索类型 xf or esf
        this.searchType = vars.subaction === 'zyindex' ? 'esf' : 'xf';
        // 当前列表类型
        this.columnType = this.searchType === 'esf' ? 2 : 3;
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = (vars.paramcity || vars.city) + (this.searchType === 'esf' ? 'newEsf' : 'newXf') + 'History';
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(zySearch.prototype, search);

    /**
     * 初始化函数
     * 获取显示弹窗按钮
     * 给显示弹窗按钮绑定事件
     * 点击弹窗按钮弹出搜索弹窗
     */
    zySearch.prototype.init = function () {
        var that = this;
        // 实例化
        that.xfSearch = new XfSearch();
        that.esfSearch = new EsfSearch();
        // 设置standardObj
        if (this.searchType === 'esf') {
            that.standardObj = that.esfSearch.standardObj;
        } else {
            that.standardObj = that.xfSearch.standardObj;
        }
        // 初始化
        search.init.call(that);
        for (var name in that) {
            if (that.hasOwnProperty(name)) {
                that.xfSearch[name] = that[name];
                that.esfSearch[name] = that[name];
            }
        }
        // 获取清空搜索框操作
        that.itemTabBox = that.searchPop.find(that.findItemTab);
        // 设置获取选中标签
        if (this.searchType === 'esf') {
            that.itemTabBox.children().eq(1).addClass(that.activeClass).siblings().removeClass(that.activeClass);
        }
        // 绑定点击事件，执行关闭自动提示列表
        that.itemTabBox.on('click', 'li', function () {
            var $this = $(this),
                index = $this.index();
            $this.addClass(that.activeClass).siblings().removeClass(that.activeClass);
            switch (index) {
                case 0:
                    that.searchType = 'xf';
                    that.columnType = that.xfSearch.columnType = 3;
                    that.xfSearch.scroll = null;
                    that.xfSearch.historyMark = (vars.paramcity || vars.city) + 'newXfHistory';
                    break;
                case 1:
                    that.searchType = 'esf';
                    that.columnType = that.esfSearch.columnType = 2;
                    that.esfSearch.scroll = null;
                    that.esfSearch.historyMark = (vars.paramcity || vars.city) + 'newEsfHistory';
                    break;
            }
            that.cacheData();
            that.creatHistoryList();
            that.searchInput.val('').focus();
            that.inputChange();
        });
    };

    /**
     * 增加热词搜索前端缓存
     */
    zySearch.prototype.cacheData = function () {
        var that = this;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.cacheData.call(that);
                break;
            case 'esf':
                that.esfSearch.cacheData.call(that);
                break;
        }
    };

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    zySearch.prototype.createAutoPromptList = function (inputValue) {
        var that = this;
        switch (that.searchType) {
            case 'xf':
            // 设置两个统计用id
                that.xfSearch.soureObj = {
                    xfhxcount: {
                        name: '可售户型',
                        clickId: 'wapxfzysy_D01_34'
                    },
                    xfhcount: {
                        name: '可售房源',
                        clickId: 'wapxfzysy_D01_33'
                    }
                };
                that.xfSearch.createAutoPromptList(inputValue);
                break;
            case 'esf':
                that.esfSearch.createAutoPromptList(inputValue);
                break;
        }
    };

    /**
     * 创建热词列表
     */
    zySearch.prototype.createHotSearch = function () {
        var that = this;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.createHotSearch();
                break;
            case 'esf':
                that.esfSearch.createHotSearch();
                break;
        }
    };

    /**
     * 创建历史记录列表
     */
    zySearch.prototype.creatHistoryList = function () {
        var that = this;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.creatHistoryList();
                break;
            case 'esf':
                that.esfSearch.creatHistoryList();
                break;
        }
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    zySearch.prototype.showPop = function () {
        var that = this;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.showPop();
                break;
            case 'esf':
                that.esfSearch.showPop();
                break;
        }
    };

    /**
     * 删除历史记录及关闭历史记录列表
     */
    zySearch.prototype.deleteHistoryList = function () {
        var that = this;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.deleteHistoryList();
                break;
            case 'esf':
                that.esfSearch.deleteHistoryList();
                break;
        }
    };
    zySearch.prototype.formatUrl = function (url, type) {
        // 二手房  http://m.test.fang.com/esf/bj/?cstype=ds&type=esfzy&hf=tab
        // 新房    http://m.test.fang.com/xf/bj/?type=xfzy&hf=tab
        var formatString = '';
        switch (type) {
            case 'xf':
                formatString = url.replace(/esf/g, 'xf').replace('cstype=ds&', '');
                break;
            case 'esf':
                if (!/cstype=ds/.test(url)) {
                    if (/\?/.test(url)) {
                        url = url.replace('?', '?cstype=ds&');
                    } else {
                        url += '?cstype=ds&';
                    }
                }
                formatString = url.replace(/xf/g, 'esf');
                break;
        }
        return formatString;
    };

    /**
     * 点击搜索按钮处理
     */
    zySearch.prototype.search = function () {
        var that = this;
        var str = location.href;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.search(that.formatUrl(str, 'xf'));
                break;
            case 'esf':
                that.esfSearch.search(that.formatUrl(str, 'esf'));
                break;
        }
    };

    /**
     * yangfan add 20160506 为了不影响其他页面搜索功能，同时为了添加 ctm 序号和模块名称
     * 重写获取历史记录内容方法
     */
    zySearch.prototype.getHistoryContent = function (arr) {
        var that = this;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.getHistoryContent(arr);
                break;
            case 'esf':
                that.esfSearch.getHistoryContent(arr);
                break;
        }
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    zySearch.prototype.clickListSearch = function (obj) {
        if (!obj) return;
        var that = this;
        switch (that.searchType) {
            case 'xf':
                that.xfSearch.clickListSearch(obj);
                break;
            case 'esf':
                that.esfSearch.clickListSearch(obj);
                break;
        }
    };
    module.exports = zySearch;
});
