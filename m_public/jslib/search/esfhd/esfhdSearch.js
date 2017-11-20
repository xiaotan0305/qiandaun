/**
 * esf学区搜索
 * by zhangcongfeng
 */
define('search/esfhd/esfhdSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function esfhdSearch() {
        // 弹窗html字符串
        this.html = '<div id="popBtn">'
            + '<header class="header">'
            + '<div class="left" id="wapschoolhousesy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>小区搜索</span></div>'
            + '<div class="clear"></div>'
            + '</header>'
            + '<form class="search flexbox pdX15" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="sel"  id = "selTab"></div>'
            + '<div class="ipt" id="wapschoolhousesy_D01_09">'
            + '<input id="S_searchtext" type="search" name="q" value="" placeholder="请输入小区名字" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wapschoolhousesy_D01_18" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;">'
            + '<div class="searList" id="wapschoolhousesy_D01_10"><ul></ul></div><div class="clearBtn" id="wapschoolhousesy_D01_11">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
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
        this.standardObj = {
            // 后台返回匹配后与关键字做处理得到的数据
            projname: '',
            // 后台返回匹配的楼盘id
            comarea: '',
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
    $.extend(esfhdSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    esfhdSearch.prototype.createAutoPromptList = function (inputValue) {
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

    esfhdSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        $('#S_searchtext').val('');
    };

    /**
     * 获取自动提示列表内容
     * @param data
     * @returns {string}
     */
    esfhdSearch.prototype.getAutoPromptListContent = function (data) {
        var htmlStr = '';
        if(data){
            var len = data.length;
            if(vars.agentType === 'DS'){
                for (var i = 0; i < len; i++) {
                    htmlStr += '<li><a newcode="' + data[i].newcode +'" href="javascript:void(0);" >'
                        + '<span class="searchListName" data-comarea='+ data[i].district + '-' + data[i].comarea + '>'+ data[i].projname + '</span></a></li>';
                }
            }else{
                for (var i = 0; i < len; i++) {
                    htmlStr += '<li><a newcode="' + data[i].newcode +'" href="javascript:void(0);" >'
                        + '<span style="float:right;color:#aaa">'+ data[i].comarea + '</span>'
                        + '<span style="float:right;color:#aaa;margin-right:10px">'+ data[i].district + '</span>'
                        + '<span class="searchListName" data-comarea='+ data[i].district + '-' + data[i].comarea + '>'+ data[i].projname + '</span></a></li>';
                }
            }
        }
        return htmlStr;
    };
    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示历史记录，否则相当于删除到了空字符，隐藏自动提示列表
     */
    esfhdSearch.prototype.inputChange = function () {
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
    esfhdSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.creatHistoryList();
    };

    /**
     * 点击搜索按钮处理
     */
    esfhdSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var $xqObj = $('.build-xq');
        var $xq = $xqObj.length ? $xqObj.find('p') : $('.xq-cont').find('p');
        var $main = $('.main');
        var $name = $xq.eq(0);
        var $comarea = $('.shangquan').find('span');
        var $inputBtn = $main.find('.searbox a');
        if(!formatVal){
            alert('请输入小区名字');
            return false;
        }
        $('.searList').find('li').each(function(){
            if(vars.agentType === 'DS'){
                var $ele = $(this).find('span').eq(0);
            }else{
                var $ele = $(this).find('span').eq(2);
            }
            if(formatVal && formatVal === $ele.text()){
                $name.html('<span class="ls4">小区名：</span>' + $ele.text());
                $comarea.html($ele.attr('data-comarea'));
                $inputBtn.html('<i></i>'+ $ele.text());
                $inputBtn.attr('newcode',$ele.parent('a').attr('newcode'));
                $inputBtn.css('color','#000');
                $('#popBtn').detach();
                $main.show();
                return false;
            }else{
                var html = '<li style="text-align: center"><a href="javascript:void(0);"><span class="searchListName" >暂无搜索的楼盘，请尝试搜索其他楼盘</span></a></li>';
                $('.searList').find('ul').html(html);
            }
        });
    };
    /**
     * 点击列表条目
     * @param obj
     */
    esfhdSearch.prototype.clickListSearch = function (obj) {
        var $xqObj = $('.build-xq');
        var $xq = $xqObj.length ? $xqObj.find('p') : $('.xq-cont').find('p');
        var $mian = $('.main');
        var $name = $xq.eq(0);
        var $comarea = $('.shangquan').find('span');
        var $inputBtn = $mian.find('.searbox').find('a');
        $name.html('<span class="ls4">小区名：</span>' + obj.projname);
        $comarea.html( obj.comarea);
        $('#popBtn').detach();
        $inputBtn.html('<i></i>'+ obj.projname);
        $inputBtn.attr('newcode',obj.newcode);
        $inputBtn.css('color','#000');
        $mian.show();

    };
    module.exports = esfhdSearch;
});
