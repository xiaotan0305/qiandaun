/**
 * 二手房搜索主类
 * by blue
 * 20160120 blue 整理代码，替换样式为最新样式，增加大搜索历史记录功能。
 */
define('search/chengjiao/cjSearch', ['jquery', 'search/mainSearch'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/mainSearch');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function cjSearch() {
        // 弹窗输入框默认显示内容
        this.titCon = '请输入小区名查成交';
        // 弹窗html字符串
        this.html = '<div class="searchPage">'
            + '<header class="header">'
            + '<div class="left" id="wapesfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>查成交</span></div>'
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
                // + '<div class="searLast" id="wapesfsy_D01_19"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapesfsy_D01_32">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_31"><ul></ul></div></div>'
            + '</div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'cjHistory';
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
        // 当前列表类型
        this.columnType = 2;
        // 关闭自动提示按钮
        this.findCloseAutoPromptListBtn = '#autoPromptList a';
        // 历史记录数量
        this.HISTORY_NUMBER = 10;
        this.standardObj = {
            // 搜索的关键字
            key: '',
            // 显示字
            showWord: '',
            // 后缀
            suffix: '',
            // 用途
            // purpose: '',
            // 室数
            room: '',
            // 商圈
            comarea: '',
            // 区域
            district: '',
            // 标签
            tags: '',
            // 品牌
            brand: '',
            // 企业
            enterprise: '',
            // 地铁线路
            subwayId: '',
            // 地铁站点
            stationId: '',
            // 是否为小区
            category:'',
            // 小区id
            projcode: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(cjSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    cjSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.esfSite + '?c=esf&a=ajaxGetAllSearchTip';
        var obj = {
            q: inputValue,
            city: vars.city,
            type: this.columnType
            // purpose: vars.purpose
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    cjSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var liHtmlStr = '<li><a href="javascript:void(0);"><span class="num"></span>'
            + '<span class="searchListName" data-ywtype=\'zz\'>xx</span><span class="gray-b"> - yy</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 需要组成自动回复一条数据的hmtl字符串
            var liHtml = '';
            // var suffix = '';
            // var showWord = '';
            // 声明跳转条件对象
            var obj = that.getFormatCondition();
            var singleData = dataArr[i];

            obj.key = obj.showWord = singleData.projname;
            obj.category = singleData.category;
            obj.projcode = singleData.projcode;
            obj.district = singleData.district;
            obj.comarea = singleData.comerce;
            // ++++++++++++++++++++++++++++++++++
            // obj.purpose = singleData.purpose;
            // 用于用户看到的单条楼盘名称
            liHtml = liHtmlStr.replace('xx', singleData.projname);

            // 不显示后缀
            liHtml = liHtml.replace(' - yy', '');
            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };


    // /**
    //  * 创建热词列表
    //  */
    cjSearch.prototype.createHotSearch = function () {
        var that = this;
        // 获取是否有历史数据
        var hasHistory = that.hasHistory();
        // 判断子节点长度，不再每次都调用接口获取热词数据，目的为减少网络请求数
        if (that.hotSearchList.children().length > 0) {
            if (hasHistory) {
                // 有历史情况下
                if (that.scroll) {
                    // 刷新滚动插件，并且重置位置
                    that.scroll.refresh();
                    that.scroll.scrollTo(0, 0);
                } else {
                    // 操作过程中有了历史记录的情况
                    that.hotSearchList.html('<div id="scroller">' + that.hotSearchList.html() + '</div>');
                    that.setScroll();
                }
            } else if (that.scroll) {
                // 操作过程中没有了历史记录，销毁插件，并重新设置热词显示排布
                that.hotSearchList.html(that.hotSearchList.find('#scroller').html());
                that.scroll.destroy();
                that.scroll = undefined;
            }
            return;
        }
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    cjSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        if (!that.hotSearchList) {
            that.hotSearchList = that.searchPop.find(that.findHotSearchList);
            that.hotSearchList.on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
        }
        var keywordEl = that.showPopBtn.find('.inputbox a');
        if (keywordEl.length > 0) {
            var searchKey = keywordEl.text().replace(/(^\s+)|(\s+$)/g, '');
            if (searchKey !== that.titCon) {
                that.searchInput.val(searchKey);
                that.offBtn.show();
            }
        }
        that.writeSearchEnterTimeLog(vars.city, that.columnType);
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * 点击搜索按钮处理
     */
    cjSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        // 地址拼接
        var url;
        url = vars.mainSite + 'chengjiao/' + vars.city + '/';
        if (window.location.href.indexOf('tabindex=1') != -1) {
            url += '?tabindex=1'
        }
        // 如果关键字为空，直接点击搜索按钮时返回到列表页首页
        if (!b) {
            window.location = url;
            that.writeSearchLeaveTimeLog(that.columnType);
            return;
        }
        if (url.indexOf('?') == -1) {
            url += '?keyword=' + encodeURIComponent(b);
        } else {
            url += '&keyword=' + encodeURIComponent(b);
        }
        that.setOtherHistory({key: b, showWord: b, suffix: ''}, url + '&city=' + vars.city);
        window.location = url;
        that.writeSearchLeaveTimeLog(that.columnType);
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    cjSearch.prototype.clickListSearch = function (obj) {
        if (!obj)return;
        var that = this;
        // 将搜索关键字写入搜索input中
        that.searchInput.val(obj.key);
        if (obj.historyUrl) {
            that.setOtherHistory(obj, obj.historyUrl);
            window.location = obj.historyUrl;
            return;
        }
        var url = vars.mainSite + 'chengjiao/' + vars.city + '/';
        // 插入关键字及城市
        url += '?keyword=' + encodeURIComponent(obj.key);
        if (obj.category === '1' && obj.projcode) {
            url += '&projcode=' + obj.projcode;
            if (obj.district) {
                url += '&districtName=' + obj.district;
            }
            if (obj.comarea) {
                url += '&comareaName=' + obj.comarea;
            }
        }
        that.setOtherHistory(obj, url + '&city=' + vars.city);
        // 跳转搜索地址
        window.location = url + '&r=' + Math.random();
        that.writeSearchLeaveTimeLog(that.columnType);
    };
    module.exports = cjSearch;
});