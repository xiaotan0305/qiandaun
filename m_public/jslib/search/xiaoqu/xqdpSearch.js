/**
 * Created by lina on 2017/4/26.
 * 小区点评搜索
 */
define('search/xiaoqu/xqdpSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;
    function xqdpSearch() {
        // 弹窗html字符串
        this.html = '<div id="popBtn" class="whitebg" style="height: 100%">'
            + '<header class="header">'
            + '<div class="left" id="wapschoolhousesy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>小区搜索</span></div>'
            + '<div class="clear"></div>'
            + '</header>'
            + '<form class="search flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox" style="border: 1px solid #e3e7ed">'
            + '<div class="sel"  id = "selTab"></div>'
            + '<div class="ipt" id="wapschoolhousesy_D01_09">'
            + '<input id="S_searchtext" type="search" name="q" value="" placeholder="请输入小区名字" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '</div>'
            + '</form>'
            + '<div id="historyList" class="searHistory" style="display: none">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wappinggusy_D03_02_05"><ul></ul></div><div class="clearBtn" id="wappinggusy_D03_02_06">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wappinggusy_D03_02_03"><ul></ul></div><div class="clearBtn" id="wappinggusy_D01_09">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'xqdpHistory';
        // 显示弹窗的按钮
        this.showPopBtn = '.searbox';
        // 返回按钮
        this.findBackBtn = '.back';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 搜索按钮
        this.findSearchBtn = '.btn';
        // 搜索的input标签
        this.findSearchInput = 'input';
        // 自动提示列表ul的父节点
        this.findAutoPromptList = '#autoPromptList';
        // 关闭自动提示按钮
        this.findCloseAutoPromptListBtn = '#autoPromptList a';
        // 标识选择类别
        this.selTab = '#selTab';
        // 历史列表ul的父节点
        this.findHistoryList = '#historyList';
        // 清除历史按钮
        this.findDeleteHistoryListBtn = '#historyList a';
        // 历史记录数量
        this.HISTORY_NUMBER = 10;
        this.standardObj = {
            // 后台返回匹配后与关键字做处理得到的数据
            key: '',
            // 后台返回匹配的楼盘id
            id: ''
        };
        $(this.showPopBtn).on('click', function () {
            $.get(vars.esfSite + '?c=esfhd&a=ajaxGetHousingResources&city=' + vars.city + '&isFilter=1', {
                city: vars.city,
                type: 2
            });
        });
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(xqdpSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    xqdpSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.esfSite + '?c=esfhd&a=ajaxGetHousingResources&city=' + vars.city + '&q=' + inputValue + '&isFilter=1';
        var obj = {
            city: vars.city,
            q: inputValue,
            type: 2,
            purpose: vars.total
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */

    xqdpSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        $('#S_searchtext').val('');
        if(vars.localStorage.getItem(that.historyMark)){
            that.creatHistoryList();
            if($('.dpnoresult').length){
                $('.dpnoresult').hide();
            }
        }else{
            var html = '<div class="dpnoresult"><div><img src="'+ vars.imgSrc + '" width="71">'
                + '<h3>没有任何搜索历史</h3></div></div>';
            if(!$('.dpnoresult').length){
                $('#popBtn').append(html);
            }else{
                $('.dpnoresult').show();
            }
        }
    };

    /**
     * 获取自动提示列表内容
     * @param data
     * @returns {string}
     */
    xqdpSearch.prototype.getAutoPromptListContent = function (data) {
        var that = this;
        var html = '';
        var len = data.length;
        var inputKey = that.searchInput.val();
        if($('.dpnoresult').length){
            $('.dpnoresult').hide();
        }
        var formatKey = that.inputFormat(inputKey);
        var htmlStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        var reg = new RegExp(formatKey, 'i');
        for (var i = 0; i < len; i++) {
            var key = data[i].projname;
            // 标红数据 不区分大小写匹配
            var redKey = key.match(reg);
            if (redKey) {
                key = key.replace(redKey[0], '<em style="font-style: normal;color:#df3031;">' + redKey[0] + '</em>');
            }
            var obj = that.getFormatCondition({key: data[i].projname, id: data[i].newcode});
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
    xqdpSearch.prototype.inputChange = function () {
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
    xqdpSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        if(vars.localStorage.getItem(that.historyMark)){
            that.creatHistoryList();
            if($('.dpnoresult').length){
                $('.dpnoresult').hide();
            }
        }else{
            var html = '<div class="dpnoresult"><div><img src="'+ vars.imgSrc + '" width="71">'
                + '<h3>没有任何搜索历史</h3></div></div>';
            if(!$('.dpnoresult').length){
                $('#popBtn').append(html);
            }else{
                $('.dpnoresult').show();
            }
        }

    };
    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    xqdpSearch.prototype.getHistoryContent = function (arr) {
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
    xqdpSearch.prototype.search = function (obj) {
        var that = this;
        // 获取用户输入内容
        var param = {};
        param.city = vars.city;
        param.projname = obj.key;
        param.newcode = obj.id;
        // 去掉开头和结尾的空格
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
        var $floatAlert = $('.dplayer');
        $.ajax({
            url: vars.xiaoquSite + '?a=ajaxHaveComment',
            data: param,
            success:function(data){
                if(data){
                    if(data.code === '100'){
                        window.location.href = vars.xiaoquSite + '?a=xqWriteComment&projname='+ obj.key +'&city=' + vars.city + '&newcode=' + obj.id;
                    }else if(data.code === '2'){
                        $floatAlert.show();
                        setTimeout(function(){
                            $floatAlert.hide()
                        },2000);
                    }else if(data.code === '404'){
                        alert('网络错误，请稍后重试');
                    }
                }
            }

        });




    };
    /**
     * 点击列表条目
     * @param obj
     */
    xqdpSearch.prototype.clickListSearch = function (obj) {
        var that = this;
        that.search(obj);
    };
    module.exports = xqdpSearch;
});

