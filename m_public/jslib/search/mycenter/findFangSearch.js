/**
 * 个人中心帮你找房新房楼盘搜索
 * modified limengyang.bj@fang.com(2017-11-08)
 */

define('search/mycenter/findFangSearch', ['jquery', 'search/search', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 获取滚动插件，新需求中如果有历史记录则热词要变成一行滚动
    var iscorll = require('iscroll/2.0.0/iscroll-lite');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function FindFangSearch() {
        // 弹窗html字符串
        this.html = '<div class="main whitebg">'
            + '<header class="header">'
            + '<div class="left" id="wapzfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>选择意向楼盘</span></div>'
            + '</header>'
            + '<form class="search pdX14" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox flexbox">'
            + '<div class="ipt" id="wapzfsy_D01_09">'
            + '<input type="search" name="q" value="" placeholder="请输入楼盘名" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" class="btn" rel="nofollow">取消</a>'
            + '</div>'
            + '</form>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapzfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapzfsy_D01_09">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapzfsy_D01_08"><ul></ul></div><div class="clearBtn" id="wapzfsy_D01_09">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'myCenterHistory';
        // 显示弹窗的按钮
        this.showPopBtn = '#chooseloupan';
        // 返回按钮
        this.findBackBtn = '.back';
        // 搜索按钮
        //this.findSearchBtn = '.btn';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 取消标签
        this.cancelBtn = '.btn';
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
            key: '',
            // 楼盘id
            newcode: ''

        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(FindFangSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    FindFangSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.mySite + '?c=mycenter&a=ajaxFindFangXfTip';
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
    FindFangSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 输入的词
        var inputValue = that.searchInput.val();
        // 普通显示条数的html字符串
        var normalHtmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 声明跳转条件对象
            var obj = that.getFormatCondition({key: dataArr[i].name, newcode: dataArr[i].newcode});
            var liHtml = normalHtmlStr;
            liHtml = liHtml.replace('xx', dataArr[i].name.replace(inputValue, '<em>' + inputValue + '</em>'));
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
    FindFangSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        // 取消按钮
        $(that.cancelBtn).on('click', function () {
            // 帮你找房输入楼盘名
            that.showPopBtn.text('非必选');
            that.showPopBtn.attr('data-newcode', '');
            // 字体变黑
            that.showPopBtn.parents('li').removeClass('sele');
            that.searchInput.val('');
            that.back();
        });
        var keywordEl = that.showPopBtn.find('.ipt input');
        if (keywordEl.length > 0) {
            var searchKey = keywordEl.val();
            if (searchKey !== '请输入楼盘名' && searchKey !== '') {
                that.searchInput.val(searchKey);
                that.offBtn.show();
            }
        }
        that.creatHistoryList();
    };

    /**
     * 关闭自动提示列表重写
     * 显示历史记录操作
     */
    FindFangSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.creatHistoryList();
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    FindFangSearch.prototype.getHistoryContent = function (arr) {
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
            if (arr[i] && (arr[i].key !== '' || arr[i].newcode !== '')) {
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
    FindFangSearch.prototype.clickListSearch = function (obj) {
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
        // 帮你找房输入楼盘名
        that.showPopBtn.text(obj.key);
        that.showPopBtn.attr('data-newcode', obj.newcode);
        // 字体变黑
        that.showPopBtn.parents('li').addClass('sele');
        // 返回操作
        that.back();
    };
    module.exports = FindFangSearch;
});