/**
 * 查房价搜索选择小区
 * by blue
 */
define('search/xiaoqu/xiaoquSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function XiaoquSearch() {
        // 弹窗html字符串
        this.html = '<div id="popBtn">'
            + '<header class="header">'
            + '<div class="left" id="wappinggusy_D03_02_01"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>选择小区</span></div>'
            + '</header>'
            + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt">'
            + '<input id="wappinggusy_D03_02_02" type="search" name="q" value="" placeholder="请输入小区名称" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wappinggusy_D03_02_04" class="btn" rel="nofollow">取消</a>'
            + '</div>'
            + '</form>'
            + '<div id="historyList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wappinggusy_D03_02_05"><ul></ul></div><div class="clearBtn" id="wappinggusy_D03_02_06">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wappinggusy_D03_02_03"><ul></ul></div><div class="clearBtn" id="wappinggusy_D01_09">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'askPrice';
        // 显示弹窗的按钮
        this.showPopBtn = '#xqSearch';
        // 返回按钮
        this.findBackBtn = '.back';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 取消标签
        this.cancelBtn = '.btn';
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
            // 后台返回匹配后与关键字做处理得到的数据
            key: '',
            // 后台返回匹配的楼盘id
            id: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(XiaoquSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    XiaoquSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.pingguSite + '?c=pinggu&a=ajaxGetSearchTip';
        var obj = {
            city: vars.city,
            q: inputValue,
            flag: 1
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    XiaoquSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        $(that.cancelBtn).on('click', function () {
            that.back();
        });
        // 判断是否已经有了关键字,有的话带给搜索弹窗的input
        var searchKey = that.showPopBtn.html();
        if (searchKey && searchKey !== '请选择小区') {
            that.offBtn.show();
        }
        that.creatHistoryList();
    };

    /**
     * 获取自动提示列表内容
     * @param data
     * @returns {string}
     */

    XiaoquSearch.prototype.getAutoPromptListContent = function (data) {
        var that = this;
        var html = '';
        var len = data.length;
        var inputKey = that.searchInput.val();
        var formatKey = that.inputFormat(inputKey);
        var htmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        var reg = new RegExp(formatKey, 'i');
        for (var i = 0; i < len; i++) {
            var key = data[i].name;
            // 标红数据 不区分大小写匹配
            var redKey = key.match(reg);
            if (redKey) {
                key = key.replace(redKey[0], '<em style="font-style: normal;color:#df3031;">' + redKey[0] + '</em>');
            }
            var obj = that.getFormatCondition({key: data[i].name, id: data[i].newcode});
            var li = htmlStr.replace('xx', key);
            li = li.replace('zz', that.setJumpCondition(obj));
            html += li;
        }
        return html;
    };

    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示历史记录，否则相当于删除到了空字符，隐藏自动提示列表
     */
    XiaoquSearch.prototype.inputChange = function () {
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
    XiaoquSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.creatHistoryList();
    };


    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    XiaoquSearch.prototype.getHistoryContent = function (arr) {
        var that = this,
            len = arr.length,
            html = '',
        // lihtml模板字符串
            templateStr = '<li><a><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';

        /**
         * 循环遍历历史记录数据，拼接html字符串
         */
        for (var i = 0; i < len; i++) {
            if (arr[i]) {
                var str = templateStr.replace('zz', that.setJumpCondition(arr[i]));
                str = str.replace('xx', arr[i].key);
                html += str;
            }
        }
        return html;
    };

    /**
     * 点击搜索按钮处理
     */
    XiaoquSearch.prototype.search = function (obj) {
        var that = this;
        that.searchInput.val(obj.key);
        that.showPopBtn.parent().parent().addClass('sele');
        that.showPopBtn.html(obj.key);
        vars.newcode = obj.id;
        vars.projname = obj.key;
        if (vars.localStorage) {
            // 转换当前点击搜索后的关键字为格式化后的条件对象，用来判断是否历史记录中重复
            // 获取消除重复后的历史记录对象字符串
            var history = that.judgeHistoryRepeat(obj);
            // 获取历史记录列表
            var historyList = [];
            if (history) {
                // 如果有历史记录，则获取历史记录localStorage数据数组
                historyList = that.getJumpCondition(history);
            }
            historyList.unshift(obj);
            // 大于历史记录条数则删除最后一条
            if (historyList.length > that.HISTORY_NUMBER) {
                historyList.splice(that.HISTORY_NUMBER, 1);
            }
            // 存入localstorage
            vars.localStorage.setItem(that.historyMark, that.setJumpCondition(historyList));
        }
        window.location.href = vars.xiaoquSite + '?c=xiaoqu&a=askPrice&city='+ vars.city + '&xqid=' + obj.id;

    };

    /**
     * 点击列表条目
     * @param obj
     */
    XiaoquSearch.prototype.clickListSearch = function (obj) {
        var that = this;
        that.search(obj);
    };
    module.exports = XiaoquSearch;
});

