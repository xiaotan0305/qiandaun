/**
 * 家居搜索主类
 * by blue
 * modified by icy(taoxudong@fang.com)
 */
define('search/jiaju/jiajuIndexSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var search = require('search/search');
    var vars = seajs.data.vars;
    var channelInfo = {
        p: {
            channelName: '美图',
            title: '搜索',
            placeholder: '风格/户型/空间等',
            url: vars.jiajuSite + '?c=jiaju&a=lglist&q='
        },
        a: {
            channelName: '问答',
            title: '搜索',
            placeholder: '问题名称',
            url: vars.askSite + '?c=ask&a=search&keyword='
        },
        d: {
            channelName: '设计师',
            title: '搜索',
            placeholder: '设计师/公司/门店等',
            url: vars.jiajuSite + vars.city + '/des.html?q='
        },
        s: {
            channelName: '工地',
            title: '搜索',
            placeholder: '楼盘/居室等',
            url: vars.jiajuSite + vars.city + '/cggd.html?q='
        }
    };

    function JjSearch() {
        // 弹窗html字符串
        this.html = '<div>'
            + '<header class="header">'
            + '<div class="left"><a href="javascript:void(0);" class="back" id="wapjiajusy_D01_16"><i></i></a></div>'
            + '<div class="cent searchTtl">搜索</div>'
            + '</header>'
            + '<form class="search flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="sel" style="max-width:60px;">'
            +    '<span class="channelBtn">美图</span>'
            +    '<div class="drop">'
            +        '<ul>'
            +            '<li data-id="p" id="wapjiajusy_D01_15_02"><i class="j-pic"></i>美图</li>'
            +            '<li data-id="a" id="wapjiajusy_D01_15_03"><i class="j-ask"></i>问答</li>'
            +            '<li data-id="d" id="wapjiajusy_D01_15_04"><i class="j-deg"></i>设计师</li>'
            +            '<li data-id="s" id="wapjiajusy_D01_15_05"><i class="j-site"></i>工地</li>'
            +        '</ul>'
            +        '<i></i>'
            +    '</div>'
            + '</div>'
            + '<div class="ipt">'
            + '<input type="search" name="q" value="" placeholder="风格/户型/空间等" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" class="btn" rel="nofollow" id="wapjiajusy_D01_15_01"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" ><ul id="wapjiajusy_D01_15_06"></ul></div><div class="clearBtn">'
            + '<a href="javascript:void(0);" id="wapjiajusy_D01_15_07">清除历史记录</a></div></div></div>'
            + '</div>';


        // 历史标识，用来存储在localstorge的标识
        this.historyMark = 'jiajuIndexHistory' + vars.action;
        // 显示弹窗的按钮
        this.showPopBtn = '#searchtext';
        // 返回按钮searchInput
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
            key: ''
        };
        // 当前活跃频道
        this.activeChannel = 'p';
        // 搜索页标题
        this.findSearchTtl = '.searchTtl';
        // 频道切换按钮
        this.findChannelBtn = '.channelBtn';
        // 频道下拉菜单
        this.findDropList = '.drop';
        this.$jjNav = $('#jjNav');
    }
    
    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(JjSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，家居首页不需要联想功能
     * @param inputValue
     */
    JjSearch.prototype.createAutoPromptList = function () {};
    
    /**
     * 重写hideBody
     * 隐藏导航弹出页
     */
    JjSearch.prototype.hideBody = function () {
        var that = this;
        that.$jjNav.hide();
        search.hideBody.call(that);
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
        searchKey = keywordEl && keywordEl.attr('data-q');
        if (searchKey) {
            that.searchInput.val(searchKey);
            that.offBtn.show();
        }
        that.creatHistoryList();
        that.searchTtl = that.searchPop.find(that.findSearchTtl);
        that.channelBtn = that.searchPop.find(that.findChannelBtn);
        that.dropList = that.searchPop.find(that.findDropList);
        that.channelBtn.on('click',function () {
            that.dropList.show();
        });
        that.dropList.on('click','li',function () {
            that.changeChannel(this);
        });
    };
    
    /**
     * 添加下拉菜单切换方法
     */
    JjSearch.prototype.changeChannel = function (ele) {
        var that = this;
        var channel = $(ele).data('id');
        if (channel !== that.activeChannel) {
            that.searchTtl.text(channelInfo[channel].title);
            that.searchInput.attr('placeholder',channelInfo[channel].placeholder);
            that.channelBtn.text(channelInfo[channel].channelName);
            that.activeChannel = channel;
        }
        that.dropList.hide();
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
        // 记录channel
        if (vars.localStorage && b) {
            // 转换当前点击搜索后的关键字为格式化后的条件对象，用来判断是否历史记录中重复
            var obj = that.getFormatCondition({key: b + ',' + that.activeChannel});
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
            window.location = channelInfo[that.activeChannel].url + encodeURIComponent(b);
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
        var normalHtmlStr = '<li><a href="javascript:void(0);">'
            + '<span class="searchListName " data-ywtype="zz">xx</span> - <span class="gray-b">yy</span>'
            + '</a></li>';

        // 循环遍历历史记录数据，拼接html字符串
        for (var i = 0; i < len; i++) {
            // 修改key为空出现li标签bug
            if (arr[i] && (arr[i].key !== '' || arr[i].jumpUrl !== '')) {
                var keyInfoArr = arr[i].key.split(',');
                var liHtml = normalHtmlStr;
                liHtml = liHtml.replace('xx', keyInfoArr[0]);
                liHtml = liHtml.replace('yy', channelInfo[keyInfoArr[1]].channelName);
                // 储存条件对象数据
                liHtml = liHtml.replace('zz', that.setJumpCondition(arr[i]));
                html += liHtml;
            }
        }
        html || that.deleteHistoryList();
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
        var keyInfoArr = obj.key.split(',');
        that.searchInput.val(keyInfoArr[0]);
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
        window.location = channelInfo[that.activeChannel].url + encodeURIComponent(keyInfoArr[0]);
    };
    module.exports = JjSearch;
});