/**
 * esf学区搜索
 * by zhangcongfeng
 */
define('search/esf/schoolSearch', ['jquery', 'search/search'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function SchoolSearch() {
        // 弹窗html字符串
        this.html = '<div id="popBtn">'
            + '<header class="header">'
            + '<div class="left" id="wapschoolhousesy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>学区搜索</span></div>'
            + '<div class="clear"></div>'
            + '</header>'
            + '<form class="search flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="sel"  id = "selTab"><span class="choosed">学校</span><div class="drop" style="display:none;">'
            + '<ul><li><i class="j-sch"></i>学校</li><li><i class="j-nei"></i>小区</li></ul>'
            + '<i></i></div></div>'
            + '<div class="ipt" id="wapschoolhousesy_D01_09">'
            + '<input id="S_searchtext" type="search" name="q" value="" placeholder=" 请输入学校或小区名" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wapschoolhousesy_D01_18" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div id="historyList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="">'
            + '<ul class="s-lx"></ul></div><div class="clearBtn" id="">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;">'
            + '<div class="searList" id="wapschoolhousesy_D01_10"><ul></ul></div><div class="clearBtn" id="wapschoolhousesy_D01_11">'
            + '<a href="javascript:void(0);">关闭</a></div></div></div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'esfSchoolHistory';
        // 显示弹窗的按钮
        this.showPopBtn = '#new_searchtext';
        // 返回按钮
        this.findBackBtn = '.back';
        // 删除input内容按钮
        this.findOffBtn = '.off';
        // 搜索按钮
        this.findSearchBtn = '.btn';
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
        // 标识选择类别
        this.selTab = '#selTab';
        // 历史记录数量
        this.HISTORY_NUMBER = 10;
        this.standardObj = {
            // 后台返回匹配后与关键字做处理得到的数据
            key: '',
            // 后台返回匹配的楼盘id
            id: '',
            seletEle: ''
        };
        $(this.showPopBtn).on('click', function () {
            $.get(vars.esfSite + '?c=esf&a=writeEnterOfSearchuv', {
                city: vars.city,
                type: 2
            });
        });
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(SchoolSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    SchoolSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.esfSite + '?c=esf&a=ajaxGetAllSearchTip';
        var obj = {
            city: vars.city,
            q: inputValue,
            type: 2,
            purpose: vars.total,
            channel: 'schoolhouse',
            category: $('.choosed').text() === '学校' ? 2 : 1
        };
        if (vars.city === 'yt') {
            obj.showyd = 1;
        }
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };
    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    SchoolSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        // 选择学校或者小区点击框
        var choosed = $('.choosed');
        // 选择小区或者学校弹框
        var drop = $('.drop');
        // 初次进入页面，清空type值
        if(!location.href.match('keyword')){
            localStorage.removeItem('type')
        }
        // 每次加载的时候先判定有没有搜索类型，然后给搜索条件框赋初值
        if(localStorage.getItem('type')){
            choosed.text(localStorage.getItem('type'));
        } else {
            choosed.text('学校');
        }
        // 选择学校或者是小区   lina 20160902
        var searchtext = $('#S_searchtext');
        searchtext.attr('placeholder', '请输入' + choosed.text() + '名称');
        $(that.selTab).on('click', 'li,span', function () {
            var el = $(this);
            if (el.hasClass('choosed')) {
                drop.show();
            } else {
                choosed.html(el.text());
                searchtext.attr('placeholder', '请输入' + el.text() + '名称');
                drop.hide();
            }
            showDiffer();
        });
        $(that.cancelBtn).on('click', function () {
            that.back();
        });

        // 判断是否已经有了关键字,有的话带给搜索弹窗的input
        var searchKey = that.showPopBtn.children().children().text();
        if (searchKey && searchKey.trim() !== '请输入学校或小区名') {
            that.searchInput.val(searchKey);
            that.offBtn.show();
        }
        that.creatHistoryList();
        /**
         * 根据不同的搜索类型显示不同的搜索历史记录，小区是小区的，学校是学校的
         */
        function showDiffer() {
            // 生成的历史记录li的长度
            var thisLi = $('.s-lx').find('li');
            var cleanBtn = $('.clearBtn');
            var next = false;
            // 循环遍历li，找出符合条件的li使其显示
            for (var i = 0; i < thisLi.length; i++) {
                var hisType = JSON.parse(thisLi.eq(i).find('span').attr('data-ywtype')).seletEle;
                if (choosed.text() === hisType) {
                    thisLi.eq(i).show();
                } else{
                    thisLi.eq(i).hide();
                }
                if(i === thisLi.length - 1){
                    next = true;
                }
            }
            // 小区，学校不同条件下，若无搜索记录隐藏搜索记录
            if (next) {
                thisLi.each(function () {
                    if ($(this).is(':visible')) {
                        cleanBtn.show();
                        return false;
                    } else {
                        cleanBtn.hide();
                    }
                });
            }
        }
        // 初始化时调用区分历史记录的函数
        showDiffer();
        // 对input事件进行监听，当文本框内容为空时调用区分历史记录的函数
        searchtext.on('input', function () {
            if (searchtext.val().length === 0) {
                showDiffer();
            }
        });
        // 点击搜索框里的清除按钮
        $('.off').on('click',function(){
            showDiffer();
        });
    };
    // 获取楼盘信息
    SchoolSearch.prototype.getCon = function (obj) {
        var that = this;
        // 获取楼盘标识
        var cId = parseInt(obj.category);
        var tArr = {3: 'enterprise', 5: 'purpose', 6: 'district', 7: 'comerce', 8: 'tags', 4: 'brand'};
        var params = {};
        var showCon = obj.projname;
        params.cId = cId;
        if (typeof tArr[cId] !== 'undefined') {
            params[tArr[cId]] = showCon;
            params.cKey = tArr[cId];
        }
        params.searchKey = showCon;
        return params;
    };

    /**
     * 获取自动提示列表内容
     * @param data
     * @returns {string}
     */
    SchoolSearch.prototype.getAutoPromptListContent = function (data) {
        var that = this;
        var len = data.length;
        var htmlStr = '<li><a href="javascript:void(0);" data-id="wapxfsy">'
            + '<span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        var b = [];
        for (var i = 0; i < len; i++) {
            var str = htmlStr,
                sArr = that.getCon(data[i]);
            var con = {searchKey: '', purpose: '', district: '', comerce: '', tags: '', room: '', enterprise: ''};
            // 判断是否携带参数
            con.searchKey = sArr.searchKey;
            sArr.cKey && (con[sArr.cKey] = sArr[sArr.cKey]);
            // 删除显示多少条的代码,修改xx里的文字显示 lina 20160902
            str = str.replace('xx', con.searchKey);
            str = str.replace('zz', '{"searchKey":"' + con.searchKey + '","purpose":"' + con.purpose + '","district":"' + con.district + '","comerce":"'
                + con.comerce + '","room":"' + con.room + '","tags":"' + con.tags + '","enterprise":"' + con.enterprise + '"}');
            b.push(str);
        }
        return b.join('');
    };
    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示历史记录，否则相当于删除到了空字符，隐藏自动提示列表
     */
    SchoolSearch.prototype.inputChange = function () {
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
    SchoolSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.creatHistoryList();
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    SchoolSearch.prototype.getHistoryContent = function (arr) {
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
    SchoolSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        var select = $('.choosed').text();
        if (vars.localStorage) {
            // 转换当前点击搜索后的关键字为格式化后的条件对象，用来判断是否历史记录中重复
            var obj = that.getFormatCondition({key: b, seletEle: select});
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
            var number = 0;
            var indexAll = [];
            var delet = true;
            $('.s-lx').find('li').each(function(){
                if($(this).css('display') !== 'none') {
                    number += 1;
                    indexAll.push($(this).index());
                }
                if($(this).text() === $('#S_searchtext').val()){
                    delet = false;
                }
            });
            // 大于历史记录条数则删除最后一条
            if (number >= that.HISTORY_NUMBER && delet) {
                historyList.splice(indexAll[number - 1], 1);
            }
            // 存入localstorage
            vars.localStorage.setItem(that.historyMark, that.setJumpCondition(historyList));
            // 存取搜索类别
            localStorage.setItem('type', select);
        }
        var url = vars.schoolhouseSite + '?c=schoolhouse&a=index&keyword=' + encodeURIComponent(b);
        if (select === '小区') {
            url += '&searchType=xq';
        }
        window.location = url + '&city=' + vars.city + '&r=' + Math.random();
    };

    /**
     * 点击列表条目
     * @param obj
     */
    SchoolSearch.prototype.clickListSearch = function (obj) {
        var that = this;
        // 将搜索关键字写入搜索input中
        if(obj.key){
            that.searchInput.val(obj.key);
        } else {
            that.searchInput.val(obj.searchKey);
        }
        that.search(obj);
    };
    module.exports = SchoolSearch;
});
