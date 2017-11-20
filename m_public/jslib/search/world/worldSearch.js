/**
 * 家居搜索主类
 * by blue
 * modified by icy(taoxudong@fang.com)
 */
define('search/world/worldSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var search = require('search/search');
    var vars = seajs.data.vars;
    var channelList = {
        ask: ['问答搜索', '请输入您的问题'],
        estate: ['海外房产', '楼盘名/地名/开发商', '?c=world&a=ajaxGetSearchTip']
    };
    var mtLocation = {
        ask: '?c=world&a=askList&keyword=',
        estate: 'list/_l' + (vars.listType || '') + '/?keyword='
    };


    function WorldSearch() {
        // 弹窗html字符串
        this.html = null;
        this.htmlTemp = '<div class="searchPage">' + '<header class="header">' + '<div class="left"><a href="javascript:void(0);" class="back"><i></i></a></div>' + '<div class="cent">ph-ttl</div>' + '</header>' + '<form class="search flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' + '<div class="searbox">' + '<div class="ipt">' + '<input type="search" name="q" value="" placeholder="ph-ph" autocomplete="off">' + '<a href="javascript:void(0);" class="off" style="display: none;"></a>' + '</div>' + '<a href="javascript:void(0);" class="btn" rel="nofollow"><i></i></a>' + '</div>' + '</form>' + '<div class="searHistory" id="autoPromptList">' + '<div style="margin-bottom: 50px;"><div class="searList"><ul></ul></div><div class="clearBtn2">' + '<a href="javascript:void(0);">关闭</a></div></div></div>' + '</div>';
        // 显示弹窗的按钮
        this.showPopBtn = '#new_searchtext,#hsearch';
        // 返回按钮
        this.findBackBtn = '.back';
        // 搜索按钮
        this.findSearchBtn = '.btn';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 搜索的input标签
        this.findSearchInput = 'input';
        // 自动提示列表ul的父节点
        this.findAutoPromptList = '#autoPromptList';
        // 关闭自动提示按钮
        this.findCloseAutoPromptListBtn = '#autoPromptList a';
        this.standardObj = {
            // 搜索的关键字
            key: ''
        };
        // 页面地址
        this.location = vars.worldSite;
        // 当前搜索类别
        this.channel = null;
        this.channelbak = null;
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(WorldSearch.prototype, search);

    // 重写init传入searchbtn给showpop
    WorldSearch.prototype.init = function () {
        var that = this;
        that.showPopBtn = $(that.showPopBtn);
        that.showPopBtn.on('click', function () {
            // 如果点击目标为地图图标或者今日头条合作页面中点击城市切换则直接跳转
            var $this = $(this);
            if (!$this.hasClass('mapbtn') && !$this.hasClass('cityChoo') && !$this.parent().hasClass('cityChoo')) {
                that.hideBody();
                that.showPop(this);
            }
        });
    };

    /**
     * 重写showPop
     *
     */
    WorldSearch.prototype.showPop = function (el) {
        var that = this;
        var id = el.id;
        switch (id) {
            case 'new_searchtext':
                that.channel = 'ask';
                break;
            default:
                that.channel = 'estate';
                break;
        }
        if (that.channelbak !== that.channel) {
            that.html = that.htmlTemp.replace('ph-ttl', channelList[that.channel][0]).replace('ph-ph', channelList[that.channel][1]);
            that.searchPop = null;
            that.channelbak = that.channel;
        }
        search.showPop.call(that);
        if (that.channel === 'ask') {
            var keywordEl = that.showPopBtn.find('.input');
            var searchKey = keywordEl && keywordEl.attr('data-q');
            if (searchKey) {
                that.searchInput.val(searchKey);
                that.offBtn.show();
            }
        }
    };

    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示热搜词，否则隐藏热搜词
     */
    WorldSearch.prototype.inputChange = function () {
        var that = this;
        search.inputChange.call(that);
        if (!$.trim(that.searchInput.val())) {
            that.closeAutoPromptList();
        }
    };

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    WorldSearch.prototype.createAutoPromptList = function (inputValue) {
        // 如果不存在联想地址，不需要联想
        if (channelList[this.channel][2]) {
            var url = this.location + channelList[this.channel][2];
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
    WorldSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 声明跳转条件对象
            var obj = that.getFormatCondition({
                key: dataArr[i]
            });
            var liHtml = normalHtmlStr;
            liHtml = liHtml.replace('xx', dataArr[i]);
            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };

    /**
     * 点击搜索按钮处理
     */
    WorldSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        that.searchInput.val(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        b && (window.location.href = that.location + mtLocation[that.channel] + encodeURIComponent(b));
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    WorldSearch.prototype.clickListSearch = function (obj) {
        if (!obj) return;
        var b = obj.key;
        var that = this;
        // 将搜索关键字写入搜索input中
        that.searchInput.val(b);
        // 搜索跳转地址
        b && (window.location.href = that.location + mtLocation[that.channel] + encodeURIComponent(b));
    };
    module.exports = WorldSearch;
});