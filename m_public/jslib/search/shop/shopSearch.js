/**
 * 二手房搜索主类
 * by blue
 * 20160120 blue 整理代码，替换样式为最新样式，增加大搜索历史记录功能。
 */
define('search/shop/shopSearch', ['jquery', 'search/mainSearch'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/mainSearch');
    // 页面传入的参数
    var vars = seajs.data.vars;

    function ShopSearch() {
        // 弹窗输入框默认显示内容
        this.titCon = vars.railwayNum ? '请输入小区名称、地铁名称、学校名称...' : '请输入小区名称、学校名称...';
        // 弹窗html字符串
        this.html = '<div class="searchPage">'
            + '<header class="header">'
            + '<div class="left" id="wapesfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>在售房源搜索</span></div>'
            + '</header>'
            + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt" id="wapesfsy_D01_09">'
            + '<input type="search" name="q" value="" placeholder="' + this.titCon+ '" autocomplete="off">'
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
        this.historyMark = vars.city + 'newShopHistory';
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
            purpose: '',
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
            stationId: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(ShopSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    ShopSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.esfSite + '?c=esf&a=ajaxGetAllSearchTip';
        var obj = {
            q: inputValue,
            city: vars.city,
            type: this.columnType,
            purpose: vars.purpose
        };
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    ShopSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var liHtmlStr = '<li><a href="javascript:void(0);"><span class="num"></span>'
            + '<span class="searchListName" data-ywtype=\'zz\'>xx</span><span class="gray-b"> - yy</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 需要组成自动回复一条数据的hmtl字符串
            var liHtml = '';
            // 声明跳转条件对象
            var obj = that.getFormatCondition();
            var singleData = dataArr[i];

            obj.key = obj.showWord = singleData.projname;
            // ++++++++++++++++++++++++++++++++++
            obj.purpose = singleData.purpose;
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
    ShopSearch.prototype.createHotSearch = function () {
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
    ShopSearch.prototype.showPop = function () {
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
    ShopSearch.prototype.search = function () {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        // 房源類型
        var ht = vars.purpose_oper === 'V' ? 'shop_bs/' : 'shop/';
        // 地址拼接
        var url;
        if (vars.purpose_oper === 'R') {
            url = vars.mainSite + 'shop/'  + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_h_a_c_s_x_f/';
        } else if (vars.purpose_oper === 'V') {
            url = vars.mainSite + 'shop_bs/'  + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_a_c_x_p_d/';
        }
        // 如果关键字为空，直接点击搜索按钮时返回到列表页首页
        if (!b) {
            window.location = url;
            that.writeSearchLeaveTimeLog(that.columnType);
            return;
        }
        var str = window.location.href;
        url += '?keyword=' + encodeURIComponent(b);
        // url 中含有cstype 类型 包括（ds 电商类型标示, yzwt: 业主委托类型)则添加到新的url中
        if (str.indexOf('cstype') > -1) {
            var reg = new RegExp('cstype=([^&]*)(&|$)');
            var csTypeVal = str.match(reg);
            url += '&cstype=' + csTypeVal[1];
        }
        // 添加m站首页黄金眼标识参数(waphjy)或者百度网盟参数(utm_source=baidu-wangmeng&utm_term=网盟推广),app黄金眼参数(apphjy）
        if (str.indexOf('utm_source') > -1) {
            var regs = new RegExp('utm_source=([^&]*)(&|$)');
            var utmVal = str.match(regs);
            url += '&utm_source=' + utmVal[1];
        }
        if (str.indexOf('utm_term') > -1) {
            var regs1 = new RegExp('utm_term=([^&]*)(&|$)');
            var termVal = str.match(regs1);
            url += '&utm_term=' + termVal[1];
        }

        // 是否含有类型
        if (str.indexOf('purpose') > -1) {
            url += '&purpose=' + vars.purpose;
        }
        // url += '&type=0&keyword=' + encodeURIComponent(b);
        that.setOtherHistory({key: b, showWord: b, suffix: ''}, url + '&city=' + vars.city);
        // window.location = url + '&city=' + vars.city + '&r=' + Math.random();
        window.location = url;
        that.writeSearchLeaveTimeLog(that.columnType);
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    ShopSearch.prototype.clickListSearch = function (obj) {
        if (!obj)return;
        var that = this;
        // 将搜索关键字写入搜索input中
        that.searchInput.val(obj.key);
        if (obj.historyUrl) {
            that.setOtherHistory(obj, obj.historyUrl);
            window.location = obj.historyUrl;
            return;
        }
        var str = window.location.href, url;
        // url 中含有cstype 类型 包括（ds 电商类型标示, yzwt: 业主委托类型)则添加到新的url中
        if (str.indexOf('cstype') > -1 || str.indexOf('utm_source') > -1) {
            // 如果是电商
            if (str.indexOf('cstype') !== -1) {
                var reg = new RegExp('cstype=([^&]*)(&|$)');
                var csTypeVal = str.match(reg);
                if (csTypeVal && csTypeVal[1]) {
                    url = vars.esfSite + '?cstype=' + csTypeVal[1];
                }
            }
            // 添加m站首页黄金眼标识参数(waphjy)或者百度网盟参数(utm_source=baidu-wangmeng&utm_term=网盟推广),app黄金眼参数(apphjy）
            if (str.indexOf('utm_source') > -1) {
                var regs = new RegExp('utm_source=([^&]*)(&|$)');
                var utmVal = str.match(regs);
                if (utmVal && utmVal[1]) {
                    if (str.indexOf('?') > -1) {
                        url = '?utm_source=' + utmVal[1];
                    } else {
                        url += '&utm_source=' + utmVal[1];
                    }
                }

                if (str.indexOf('utm_term') > -1) {
                    var regs1 = new RegExp('utm_term=([^&]*)(&|$)');
                    var termVal = str.match(regs1);
                    if (termVal && termVal[1]) {
                        url += '&utm_term=' + termVal[1];
                    }
                }
            }

            url += '&keyword=';
        } else {
            if (vars.channelsConfig.currentChannel === 'schoolhouse') {
                // 如果是学区房
                url = vars.schoolhouseSite + '?keyword=';
            } else {
                url = vars.mainSite + 'shop/'  + vars.ecshopids + '/' + vars.coordx + '_' + vars.coordy + '/' + vars.city + '_b_m_h_a_c_s_x_f/';
            }
        }
        // 插入关键字及城市
        url += '?keyword=' + encodeURIComponent(obj.key);
        // 需要保留的参数
        var paramReserved = {
            c: 'tags',
            h: 'room',
            b: 'comarea'
        };
        for (var key in paramReserved) {
            if (obj[paramReserved[key]]) {
                url = url.replace('_' + key + vars[paramReserved[key]], '_' + key + obj[paramReserved[key]]);
            }
        }
        if (obj.purpose) {
            // 是类型
            url += '&purpose=' + encodeURIComponent(obj.purpose);
        }
        that.setOtherHistory(obj, url + '&city=' + vars.city);
        // 跳转搜索地址
        window.location = url + '&r=' + Math.random();
        that.writeSearchLeaveTimeLog(that.columnType);
    };
    module.exports = ShopSearch;
});