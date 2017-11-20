/**
 * 地图搜索主类
 * by blue
 * 20151105 blue 重构代码，整理拼接地址参数，删除显示隐藏搜索弹窗检测代码
 * 20160120 blue 整理代码，调整为最新搜索样式，修复一个setXXX的bug
 * 20160216 blue 由于新房栏目跳转不需要转码所有判断了新房条件，但是地图中全部由php实现不需要做判断删除
 */
define('search/map/mapSearch', ['jquery', 'search/search', 'iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/search');
    // 获取滚动插件，新需求中如果有历史记录则热词要变成一行滚动
    var IScroll = require('iscroll/2.0.0/iscroll-lite');
    // 页面传入的参数
    var vars = seajs.data.vars;
    // 储存显示后缀
    var suffixArr = ['出租', '出售', '新房'];
    var placeholderArr = ['请输入小区、地名、开发商…', '请输入小区、地铁、开发商…', '请输入小区名、地铁或地名', '楼盘名/地名/开发商等', '请输入区域、商圈、小区查房价'];
    vars.purpose = vars.purpose || '住宅';

    /**
     * 获取当前的栏目
     * @returns {number} 1 租房 2 二手房 3 新房 4查房价
     */
    var columnType = (function getNowColumnType() {
        if (vars.action === 'esfMap') {
            return 2;
        } else if (vars.action === 'zfMap') {
            return 1;
        } else if (vars.action === 'cfjMap') {
            return 4;
        }
        return 3;
    })();

    var placeholder = placeholderArr[parseInt(vars.keywordNum) - 1];

    /**
     * 统一类型标识，返回关键词类别以便添加关键词后缀，id为整数值时进行处理，为brandcooperation时直接返回。
     * ！！！这地方太搞了吧，所有分类都是数字，到了品牌合作变成了一串字符串，这接口。。。我也是醉了
     * @param id 类别值
     * @returns {*}
     */
    function getCategoryId(id) {
        var res;
        // 如果是个字符串我转成数字9了，保持接口统一性
        if (id === 'brandcooperation') {
            res = 9;
        } else if (parseInt(id) === 5) {
            res = 7;
        } else if (parseInt(id) === 7) {
            res = 8;
        } else {
            res = parseInt(id);
        }
        return res;
    }

    /**
     * 自动提示接口返回的数据格式化
     * @param {{countinfo,projname,category}} obj
     * @returns {{}}
     */
    function autoPromptFormat(obj) {
        // 首先获取类别id
        var cId = getCategoryId(obj.category),
        // 声明一个后缀对象，通过键对值，当类型时3或者4的时候，显示列表中的li要在楼盘名后面加上后缀
            yysetWords = {3: ' - 房企', 4: ' - 品牌', 9: ' - 品牌直销'},
        // 声明一个储存了格式化自动提示内容的对象
            params = {},
        // 获取楼盘名称
            showCon = obj.projname;
        params.cId = cId;
        // 当类别id小于8时，显示的li内容都是楼盘名+出售
        params.showWord = showCon;
        // 当类别是3或者4时，设置后缀
        params.yySet = yysetWords[cId] || ' - ' + suffixArr[columnType - 1];
        params.num = obj.countinfo || 0;
        params.searchKey = showCon;
        return params;
    }

    /**
     * 获取室数后缀
     * @param num
     * @returns {string}
     */
    function getRoomSuffix(num) {
        var n = Number(num) - 1;
        var roomSuffixArr = ['一居', '二居', '三居', '四居', '五居', '五居以上'];
        if (n > 4) {
            return roomSuffixArr[5];
        }
        return roomSuffixArr[n];
    }

    /**
     * 获取室数
     * @param obj
     * @returns {Array}
     */
    function getRoomCount(obj) {
        var arr = [];
        for (var i = 1; i <= 4; i++) {
            if (obj.hasOwnProperty('esfcount' + i) && parseInt(obj['esfcount' + i]) > 0) {
                arr.push({
                    type: i,
                    num: parseInt(obj['esfcount' + i])
                });
            }
            if (obj.hasOwnProperty('rentcount' + i) && parseInt(obj['rentcount' + i]) > 0) {
                arr.push({
                    type: i,
                    num: parseInt(obj['rentcount' + i])
                });
            }
        }
        return arr;
    }

    /**
     * 获取可售房源和可售户型的后缀数量
     * @param obj
     * @returns {Array}
     */
    function getSoureCount(obj) {
        var arr = [];
        // 新房房源数目
        if (obj.hasOwnProperty('xfhcount') && parseInt(obj.xfhcount) > 0) {
            arr.push({
                num: parseInt(obj.xfhcount),
                type: 'xfhcount'
            });
        }
        // 新房户型数目
        if (obj.hasOwnProperty('xfhxcount') && parseInt(obj.xfhxcount) > 0) {
            arr.push({
                num: parseInt(obj.xfhxcount),
                type: 'xfhxcount'
            });
        }
        return arr;
    }

    function MapSearch() {
        // 弹窗html字符串
        this.html = '<div class="searchPage">'
            + '<header class="header">'
            + '<div class="left" id="wapxfditu_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
            + '<div class="cent"><span>地图搜索</span></div>'
            + '</header>'
            + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
            + '<div class="searbox">'
            + '<div class="ipt" id="wapxfditu_D01_09">'
            + '<input type="search" name="q" value="" placeholder="' + placeholder + '" autocomplete="off">'
            + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
            + '</div>'
            + '<a href="javascript:void(0);" id="wapxfditu_D01_18" class="btn" rel="nofollow"><i></i></a>'
            + '</div>'
            + '</form>'
            + '<div class="searLast" id="wapxfditu_D01_19"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>'
            + '<div class="searHistory" id="historyList">'
            + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapxfditu_D01_10"><ul></ul></div><div class="clearBtn" id="wapesfsy_D01_09">'
            + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
            + '<div id="autoPromptList">'
            + '<div style="margin-bottom: 50px;"><div class="searList" id="wapxfditu_D01_31"><ul></ul></div></div>'
            + '</div>'
            + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + columnType + 'newMapHistory';
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
        this.columnType = columnType;
        // 关闭自动提示按钮
        this.findCloseAutoPromptListBtn = '#autoPromptList a';
        // 历史记录数量
        this.HISTORY_NUMBER = 10;
        this.standardObj = {
            // 搜索的关键字
            strKeyword: '',
            // 房企
            enterprise: '',
            // 品牌
            brand: '',
            // 价格区间
            strPrice: '',
            // 房间数
            bedrooms: '',
            // 面积区间
            purposeArea: '',
            // 广告位跳转地址
            adUrl: '',
            // 房源类型，分为可售房源和可售户型，当点击这两个类型时url要发生变化
            soure: '',
            // 新房需求，当点击的楼盘为单个楼盘时，直接跳转到详情页
            loupanurl: '',
            // 租房来源
            housetype: '',
            // 租房整租
            rtype: '',
            // 特色
            tag: '',
            // 朝向
            towards: '',
            // 楼层
            floor: '',
            // 装修
            equipment: '',
            // 物业类型
            purpose: '',
            // 二手房房龄
            age: '',
            // 新房环线
            round: '',
            // 新房开盘时间
            saleDate: '',
            // 二手房别墅类型
            buildclass: ''
        };
        // 新房可售房源和可售户型的后缀显示和监听id
        this.soureObj = {
            xfhxcount: {name: '可售户型', clickId: 'wapxfsy_D01_34'},
            xfhcount: {name: '可售房源', clickId: 'wapxfsy_D01_33'}
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(MapSearch.prototype, search);

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    MapSearch.prototype.createAutoPromptList = function (inputValue) {
        if (this.columnType !== 4) {
            var url = vars.esfSite + '?c=esf&a=ajaxGetAllSearchTip';
            var obj = {
                q: inputValue,
                city: vars.city,
                type: this.columnType,
                purpose: vars.purpose
            };
            // 新房需求，为新房时，特殊处理烟台，为了能够显示其他周边楼盘
            if (this.columnType === 3 && vars.city === 'yt') {
                obj.showyd = 1;
            }
        }else {
            var url = vars.mapSite + '?c=map&a=ajaxGetCfjSearchTip';
            var obj = {
                q: inputValue,
                city: vars.city
            };
        }
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    MapSearch.prototype.getAutoPromptListContent = function (dataArr) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        if (that.columnType !== 4) {
            var liHtmlStr = '<li><a href="javascript:void(0);"  data-id="wapxfsy"><span class="num">约search_num条</span>'
            + '<span class="searchListName" data-ywtype=\'zz\'>xx</span><span class="gray-b">yy</span></a></li>';
            for (var i = 0; i < dataArrL; i++) {
                // 需要组成自动回复一条数据的hmtl字符串
                var liHtml = '';
                // 声明跳转条件对象
                var obj = that.getFormatCondition();
                // 获取自动提示后台数据格式化后的数据
                var formatObj = autoPromptFormat(dataArr[i]);
                // 搜索关键字赋值
                obj.strKeyword = formatObj.searchKey;
                // 新房需求，如果点击的列表单项是单个楼盘，则直接跳转到详情页
                if (formatObj.loupanurl) {
                    obj.loupanurl = formatObj.loupanurl;
                }
                that.setCondition(obj);
                // 用于用户看到的单条楼盘名称
                liHtml = liHtmlStr.replace('xx', formatObj.showWord);
                if (i === dataArrL - 1 && dataArr[i].hasOwnProperty('searchtype') && dataArr[i].searchtype === 'zt') {
                    liHtml = liHtml.replace('data-id="wapxfsy"', 'id="wapxfditu_D01_33"');
                }
                /**
                 * 判断楼盘条数
                 * 为空或者为0时，不显示后缀
                 * 小于10时，显示后缀为约数
                 * 大于等于10条则显示准确数据
                 */
                if (!formatObj.num || formatObj.num === 0) {
                    liHtml = liHtml.replace('约search_num条', '');
                } else if (formatObj.num < 10) {
                    liHtml = liHtml.replace('约search_num', formatObj.num);
                } else {
                    liHtml = liHtml.replace('search_num', formatObj.num);
                }
                // 用于用户看到的单条楼盘前缀，如-房企、-品牌等
                liHtml = liHtml.replace('yy', formatObj.yySet);
                if (formatObj.cId === 3) {
                    obj.enterprise = 1;
                } else if (formatObj.cId === 4) {
                    obj.brand = 1;
                }
                // 储存条件对象数据
                liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
                html += liHtml;

                /**
                 * ！！！这里要特别注意，在新房栏目中，后台数据的第一条数据有可能是可售房源或者可售户型这种需要特殊跳转地址的类型，要单独处理
                 */
                if (i === 0 && that.columnType === 3) {
                    html += that.getXfSoureHtml(dataArr[i], liHtmlStr, formatObj);
                }

                /**
                 * 当类型id小于3时有可能会存在显示室数的情况
                 */
                if (that.columnType !== 3 && formatObj.cId < 3) {
                    html += that.getRoomHtml(dataArr[i], liHtmlStr, formatObj);
                }
            }
        }else {
            var liHtmlStr = '';
            for (var i = 0; i < dataArrL; i++) {
                var formatObj = dataArr[i];
                var priceStr = formatObj.price !== '0'? formatObj.price + '元/平': '暂无均价';
                if (formatObj.name && formatObj.id && formatObj.type) {
                    liHtmlStr = '<li><a href="javascript:void(0);"  data-id="' + formatObj.id + '" data-type="' + formatObj.type + '"><span class="num">' + priceStr + '</span>'
                        + '<span class="searchListName">' + formatObj.name + '</span></a></li>';
                }else {
                    liHtmlStr = '';
                }
                html += liHtmlStr;
            }
        }
        return html;
    };

    /**
     * 获取新房可售房源和可售户型的html字符串
     * @param arr
     * @param str
     * @param formatObj
     * @returns {string}
     */
    MapSearch.prototype.getXfSoureHtml = function (arr, str, formatObj) {
        var that = this;
        // 可售房源、可售户型数量及类型的对象
        var roomCountArr = getSoureCount(arr);
        var roomCountArrL = roomCountArr.length;
        var html = '';
        var obj, ob, num;

        /**
         * 循环设置可售房源和可售户型的条件及增加用户统计
         */
        for (var j = 0; j < roomCountArrL; j++) {
            var htmlStr = str;
            // 声明跳转条件对象
            obj = that.getFormatCondition({strKeyword: formatObj.searchKey});
            ob = roomCountArr[j];
            num = ob.num;
            if (that.soureObj[ob.type]) {
                //
                /**
                 * 设置用户统计
                 * @type {string}
                 */
                htmlStr = htmlStr.replace('data-id', 'id');
                htmlStr = htmlStr.replace('wapxfsy', that.soureObj[ob.type].clickId);
                // 存在可售房源和可售户型类型时，用户看到的楼盘名要增加可售房源或者可售户型的显示
                formatObj.showWord = arr.projname + that.soureObj[ob.type].name;
                // 赋值来源，用于判断是可售房源或者可售户型
                obj.soure = ob.type;
            }
            htmlStr = htmlStr.replace('xx', formatObj.showWord);
            if (!num || num === 0) {
                htmlStr = htmlStr.replace('约search_num条', '');
            } else if (num < 10) {
                htmlStr = htmlStr.replace('约search_num', num);
            } else {
                htmlStr = htmlStr.replace('search_num', num);
            }
            htmlStr = htmlStr.replace('yy', '');
            htmlStr = htmlStr.replace('zz', that.setJumpCondition(obj));
            html += htmlStr;
        }
        return html;
    };

    /**
     * 获取租房和二手房的局数
     * @param arr
     * @param str
     * @param formatObj
     * @returns {string}
     */
    MapSearch.prototype.getRoomHtml = function (arr, str, formatObj) {
        var that = this;
        // 可售房源、可售户型数量及类型的对象
        var roomCountArr = getRoomCount(arr);
        var roomCountArrL = roomCountArr.length;
        var html = '', obj, ob, num;

        /**
         * 循环设置可售房源和可售户型的条件及增加用户统计
         */
        for (var j = 0; j < roomCountArrL; j++) {
            // 声明跳转条件对象
            obj = that.getFormatCondition({strKeyword: formatObj.searchKey});
            ob = roomCountArr[j];
            num = ob.num;
            obj.bedrooms = ob.type;
            var htmlStr = str.replace('xx', formatObj.showWord);
            if (!num || num === 0) {
                htmlStr = htmlStr.replace('约search_num条', '');
            } else if (num < 10) {
                htmlStr = htmlStr.replace('约search_num', num);
            } else {
                htmlStr = htmlStr.replace('search_num', num);
            }
            that.setCondition(obj);
            htmlStr = htmlStr.replace('yy', ' - ' + getRoomSuffix(ob.type));
            htmlStr = htmlStr.replace('zz', that.setJumpCondition(obj));
            html += htmlStr;
        }
        return html;
    };

    /**
     * 设置跳转条件
     * @param obj
     */
    MapSearch.prototype.setCondition = function (obj) {
        var that = this;
        var params = that.showPopBtn.attr('params-str');
        if (params) {
            params = params.split(';');
            // 1是租房地图搜索
            if (that.columnType === 1) {
                obj.purpose = encodeURIComponent(params[0]);
                obj.strPrice = params[1];
                obj.bedrooms = params[2];
                obj.rtype = params[3];
                obj.tag = params[4];
                obj.housetype = params[5];
                obj.towards = params[6];
                obj.floor = params[7];
                obj.equipment = params[8];
            } else if (that.columnType === 2) {
                // 二手房
                obj.purpose = encodeURIComponent(params[0]);
                obj.strPrice = params[1];
                obj.bedrooms = params[2];
                obj.purposeArea = params[3];
                obj.tag = params[4];
                obj.buildclass = params[5];
                obj.equipment = params[6];
                obj.floor = params[7];
                obj.age = params[8];
            } else {
                // 新房
                obj.strPrice = params[0];
                obj.tag = params[1];
                obj.purpose = params[2];
                obj.saleDate = params[3];
                obj.round = params[4];
                obj.equipment = params[5];
            }
        }
    };

    /**
     * 创建热词列表
     */
    MapSearch.prototype.createHotSearch = function () {
        var that = this;
        if (that.hotSearchList.parent().is(':hidden')) {
            that.hotSearchList.parent().show();
        }
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

        /**
         * 调用获取热词数据接口
         */
        if (that.columnType !== 4) {
            $.get(vars.esfSite + '?c=esf&a=ajaxGetHotWords',{
                city: vars.city,
                type: that.columnType
            },

            /**
             * @param {{1:{Keyword,ad,linkUrl},length}} data
             */
            function (data) {
                if (data && $.isArray(data)) {
                    var html = '';

                    /**
                     * 循环遍历数据，构建热词列表a标签html字符串
                     */
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]) {
                            var obj = that.getFormatCondition({
                                strKeyword: data[i].Keyword
                            });
                            // 判断是否当前热词为广告位
                            var isAD = data[i].ad;
                            if (isAD) {
                                obj.adUrl = data[i].linkUrl;
                            }
                            that.setCondition(obj);
                            html += '<a href="javascript:void(0);"' + (isAD ? ' id="wapxfditu_D01_32"' : '')
                                + '><span class="searchListName" data-ywtype=\'' + that.setJumpCondition(obj)
                                + '\'>' + data[i].Keyword + '</span>' + (isAD ? '<i></i>' : '') + '</a>';
                        }
                    }
                    // 有历史则需要加入滚动插件固定节点
                    if (hasHistory) {
                        html = '<div id="scroller">' + html + '</div>';
                    }
                    that.hotSearchList.html(html);
                    // 有历史则声明滚动插件实现热词滚动
                    if (hasHistory) {
                        that.setScroll();
                    }
                }
            });
        }else {
            $('#wapxfditu_D01_19').hide();
        }
        
    };

    /**
     * 当有历史记录时，设置热词变成一行并滚动
     */
    MapSearch.prototype.setScroll = function () {
        var that = this;
        // 通过获取热词中的a标签节点数组算出组成一行需要的宽度
        var aArr = that.hotSearchList.find('a'), l = aArr.length, leng = 0;
        for (var i = 0; i < l; i++) {
            var el = aArr.eq(i);
            leng += el.outerWidth(true);
        }
        that.hotSearchList.find('#scroller').width(leng + 1);
        if (!that.scroll) {
            that.scroll = new IScroll(that.hotSearchList[0], {
                bindToWrapper: true, scrollY: false, scrollX: true
            });
            that.scroll.refresh();
            that.scroll.scrollTo(0, 0);
        } else {
            that.scroll.refresh();
            that.scroll.scrollTo(0, 0);
        }
    };

    /**
     * 重写showPop
     * 增加热词点击和显示热词操作
     */
    MapSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        if (!that.hotSearchList) {
            that.hotSearchList = that.searchPop.find(that.findHotSearchList);
            that.hotSearchList.on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
        }
        var searchKey = that.showPopBtn.text();
        if ($.trim(searchKey) !== placeholder) {
            that.offBtn.show();
        }
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * inputChange方法重写
     * 增加功能在input没有输入内容时显示热搜词，否则隐藏热搜词
     */
    MapSearch.prototype.inputChange = function () {
        var that = this;
        search.inputChange.call(that);
        if ($.trim(that.searchInput.val()) !== '') {
            if (that.hotSearchList.parent().is(':visible')) {
                that.hotSearchList.parent().hide();
            }
            if (that.historyList.is(':visible')) {
                that.historyList.hide();
            }
        } else {
            that.closeAutoPromptList();
        }
    };

    /**
     * 关闭自动提示列表重写
     * 增加显示热词和显示历史记录操作
     */
    MapSearch.prototype.closeAutoPromptList = function () {
        var that = this;
        search.closeAutoPromptList.call(that);
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * 重写clearAllList方法
     * 增加清除所有列表之后也清除热词列表
     */
    MapSearch.prototype.clearAllList = function () {
        var that = this;
        search.clearAllList.call(that);
        that.clearHotSearch();
    };

    /**
     * 清除热词
     */
    MapSearch.prototype.clearHotSearch = function () {
        var that = this;
        that.hotSearchList.empty();
        // 清除滚动插件
        if (that.scroll) {
            that.scroll.destroy();
            that.scroll = undefined;
        }
        if (that.hotSearchList.parent().is(':visible')) {
            that.hotSearchList.parent().hide();
        }
    };

    /**
     * 重写清除历史记录方法
     * 增加之后重建热词列表
     */
    MapSearch.prototype.deleteHistoryList = function () {
        var that = this;
        search.deleteHistoryList.call(that);
        that.createHotSearch();
    };

    /**
     * 点击搜索按钮处理
     */
    MapSearch.prototype.search = function (srcobj) {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        // 转换当前点击搜索后的关键字为格式化后的条件对象，用来判断是否历史记录中重复
        if (srcobj.hasClass('btn') && that.columnType === 4) {
            var obj = {
                strKeyword: searchInputVal
            }
        }else {
            var obj = that.getFormatCondition({strKeyword: b});
        }
        that.setCondition(obj);
        that.clickListSearch(obj);
        
    };

    /**
     * 生成历史列表lihtml字符串
     * @param arr
     * @returns {string}
     */
    MapSearch.prototype.getHistoryContent = function (arr) {
        var that = this,
            len = arr.length,
            html = '';
        // lihtml模板字符串
        var templateStr = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span>'
            + '<span class="gray-b">yy</span></a></li>';
        var cfjStr = '';
        /**
         * 循环遍历历史记录数据，拼接html字符串
         */
        for (var i = 0; i < len; i++) {
            if (arr[i]) {
                if (that.columnType !== 4) {
                    var yySet = ' - ' + suffixArr[columnType - 1];
                    if (arr[i].bedrooms) {
                        if (isNaN(arr[i].bedrooms)) {
                            yySet = ' - ' + arr[i].bedrooms;
                        } else {
                            yySet = ' - ' + getRoomSuffix(arr[i].bedrooms);
                        }
                    }
                    if (arr[i].brand) {
                        yySet = ' - 品牌';
                    }
                    if (arr[i].enterprise) {
                        yySet = ' - 房企';
                    }
                    // 设置前缀
                    var str = templateStr.replace('yy', yySet);
                    // 设置条件
                    str = str.replace('zz', that.setJumpCondition(arr[i]));
                    str = str.replace('xx', arr[i].strKeyword);
                    html += str;
                }else {
                    var dataID = arr[i].id? arr[i].id: '';
                    var dataType = arr[i].type? arr[i].type: '';
                    cfjStr = '<li><a href="javascript:void(0);" data-id ="' + dataID + '" data-type="' + dataType + '"><span class="searchListName">' +  arr[i].strKeyword+ '</span></a></li>';
                    html += cfjStr;
                }
            }
        }
        return html;
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    MapSearch.prototype.clickListSearch = function (obj) {
        if (!obj)return;
        var that = this;
        // 将搜索关键字写入搜索input中
        that.searchInput.val(obj.strKeyword);
        if (obj.adUrl) {
            // 如果点击热词是广告位，则统计后跳转到广告页面
            $.get('/data.d?m=adtj&city=' + encodeURIComponent(encodeURIComponent(vars.city)) + '&url=' + document.URL, function () {
                window.location = obj.adUrl;
            });
            return;
        }
        if (obj.loupanurl) {
            // 如果点击的列表单项是单个楼盘，则直接跳转到详情页
            window.location = obj.loupanurl;
            return;
        }
        if (vars.localStorage && obj.strKeyword) {
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
        var url = '';
        if (obj.soure === 'xfhxcount') {
            // 如果是可售户型，更改url
            url = vars.mainSite + 'xf.d?m=searchHuXingList';
        } else if (obj.soure === 'xfhcount') {
            // 如果是可售房源，更改url
            url = vars.mainSite + 'xf.d?m=getPrivilegeHouseList';
        } else {
            if (that.columnType !== 4) {
                url = vars.mapSite + '?c=map&a=' + vars.action + '&city=' + vars.city;
                if (obj.strPrice) {
                    url += '&strPrice=' + obj.strPrice;
                }
                if (obj.bedrooms) {
                    url += '&bedrooms=' + obj.bedrooms;
                }
                if (obj.purposeArea) {
                    url += '&purposeArea=' + obj.purposeArea;
                }
                if (obj.floor) {
                    url += '&floor=' + obj.floor;
                }
                // 租房新加条件
                if (that.columnType === 1) {
                    if (obj.purpose) {
                        url += '&purpose=' + obj.purpose;
                    }
                    if (obj.housetype) {
                        url += '&housetype=' + obj.housetype;
                    }
                    if (obj.rtype) {
                        url += '&rtype=' + obj.rtype;
                    }
                    if (obj.towards) {
                        url += '&towards=' + obj.towards;
                    }
                    if (obj.equipment) {
                        url += '&equipment=' + obj.equipment;
                    }
                    if (obj.tag) {
                        url += '&tag=' + obj.tag;
                    }
                } else if (that.columnType === 2) {
                    if (obj.purpose) {
                        url += '&purpose=' + obj.purpose;
                    }
                    if (obj.age) {
                        url += '&age=' + obj.age;
                    }
                    if (obj.tag) {
                        url += '&tag=' + obj.tag;
                    }
                    if (obj.buildclass) {
                        url += '&buildclass=' + obj.buildclass;
                    }
                    if (obj.equipment) {
                        url += '&equipment=' + obj.equipment;
                    }
                } else {
                    if (obj.tag) {
                        url += '&character=' + obj.tag;
                    }
                    if (obj.purpose) {
                        url += '&strPurpose=' + obj.purpose;
                    }
                    if (obj.saleDate) {
                        url += '&saleDate=' + obj.saleDate;
                    }
                    if (obj.round) {
                        url += '&strRoundStation=' + obj.round;
                    }
                    if (obj.equipment) {
                        url += '&fitment=' + obj.equipment;
                    }
                }
            }else {
                url = vars.mapSite + '?c=map&a=ajaxCfjSearch&city=' + vars.city;
                url += '&keyword=' + obj.strKeyword;
                url += '&searchtype=xiaoqu';
            }
            
        }
        if (that.columnType !== 4) {
            // @20160216 blue 由于新房栏目跳转不需要转码所有判断了新房条件，但是地图中全部由php实现不需要做判断删除
            window.location = url + '&strKeyword=' + encodeURIComponent(obj.strKeyword) + '&r=' + Math.random();
        }else {
            /*if (obj.associate) {
                $.ajax({
                    url: vars.mapSite + '?c=map&a=ajaxCfjSearch&city=' + vars.city + '&name=' + obj.strKeyword,
                    type: 'GET',
                    data: {
                        associate: obj.associate,
                        searchtype: obj.type,
                        id: obj.id
                    },
                }).done(function(data) {
                    $('#wapxfditu_D01_08 a.back').trigger('click');
                    if (data.mapx && data.mapy && data.searchtype) {
                        that.mapx = data.mapx;
                        that.mapy = data.mapy;
                        require.async('modules/map/cfj', function (cfj) {
                            var recoveryMap = function () {
                                var zoom, type;
                                if (data.searchtype === 'xiaoqu') {
                                    zoom = 17;
                                    type = '个小区';
                                }else if (data.searchtype === 'comarea') {
                                    zoom = 15;
                                    type = '个商圈';
                                }else if (data.searchtype === 'district') {
                                    zoom = 11;
                                    type = '个区县';
                                }
                                if (cfj.priceHsliderDj) {
                                    cfj.priceHsliderDj._initPos('不限', '不限');
                                }
                                cfj.map.clearOverlays();
                                //cfj.map.map.panTo(new BMap.Point(data.mapx, data.mapy));
                                cfj.map.map.centerAndZoom(new BMap.Point(data.mapx, data.mapy), zoom);
                                var drawmap = function () {
                                    var bounds = cfj.map.gethdBounds();
                                    cfj.params.x1 = bounds.MinLng;
                                    cfj.params.y1 = bounds.MinLat;
                                    cfj.params.x2 = bounds.MaxLng;
                                    cfj.params.y2 = bounds.MaxLat;
                                    cfj.params.searchtype = data.searchtype;
                                    cfj.params.price = '';
                                    $.ajax({
                                        url: vars.protocol + vars.mapSite + '?',
                                        type: 'GET',
                                        dataType: 'json',
                                        data: cfj.params,
                                    })
                                    .done(function(data) {
                                        if (data) {
                                            cfj.map.map.panTo(new BMap.Point(that.mapx, that.mapy));
                                            $('.mapOption').find('p').text('共为您找到 ' + data.count + type);
                                            cfj.map.drawMarkers(data.list, false, '', cfj.markerFunc);
                                        }
                                        if (cfj.positionStatus && cfj.positionPoint) {
                                            cfj.map.drawMarker({mapx: cfj.positionPoint.lng, mapy: cfj.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                        }
                                    });
                                    cfj.map.map.removeEventListener('tilesloaded', drawmap);
                                    return;
                                }
                                cfj.map.map.addEventListener('tilesloaded', drawmap);
                                cfj.map.map.removeEventListener('tilesloaded', recoveryMap);
                            }
                            cfj.map.map.addEventListener('tilesloaded', recoveryMap);
                        });
                    }
                });
            }else {
                $.ajax({
                    url: url,
                    type: 'GET',
                    data: {
                        searchtype: obj.type,
                        id: obj.id
                    },
                }).done(function(data) {
                    $('#wapxfditu_D01_08 a.back').trigger('click');
                    if (data.mapx && data.mapy && data.searchtype) {
                        that.mapx = data.mapx;
                        that.mapy = data.mapy;
                        
                        require.async('modules/map/cfj', function (cfj) {
                            var recoveryMap = function () {
                                var zoom, type;
                                if (data.searchtype === 'xiaoqu') {
                                    zoom = 17;
                                    type = '个小区';
                                }else if (data.searchtype === 'comarea') {
                                    zoom = 15;
                                    type = '个商圈';
                                }else if (data.searchtype === 'district') {
                                    zoom = 11;
                                    type = '个区县';
                                }
                                if (cfj.priceHsliderDj) {
                                    cfj.priceHsliderDj._initPos('不限', '不限');
                                }
                                cfj.map.clearOverlays();
                                //cfj.map.map.panTo(new BMap.Point(data.mapx, data.mapy));
                                cfj.map.map.centerAndZoom(new BMap.Point(data.mapx, data.mapy), zoom);
                                var drawmap = function () {
                                    var bounds = cfj.map.gethdBounds();
                                    cfj.params.x1 = bounds.MinLng;
                                    cfj.params.y1 = bounds.MinLat;
                                    cfj.params.x2 = bounds.MaxLng;
                                    cfj.params.y2 = bounds.MaxLat;
                                    cfj.params.searchtype = data.searchtype;
                                    cfj.params.price = '';
                                    $.ajax({
                                        url: vars.protocol + vars.mapSite + '?',
                                        type: 'GET',
                                        dataType: 'json',
                                        data: cfj.params,
                                    })
                                    .done(function(data) {
                                        if (data) {
                                            cfj.map.map.panTo(new BMap.Point(that.mapx, that.mapy));
                                            $('.mapOption').find('p').text('共为您找到 ' + data.count + type);
                                            cfj.map.drawMarkers(data.list, false, '', cfj.markerFunc);
                                        }
                                        if (cfj.positionStatus && cfj.positionPoint) {
                                            cfj.map.drawMarker({mapx: cfj.positionPoint.lng, mapy: cfj.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                        }
                                    });
                                    cfj.map.map.removeEventListener('tilesloaded', drawmap);
                                    return;
                                }
                                cfj.map.map.addEventListener('tilesloaded', drawmap);
                                cfj.map.map.removeEventListener('tilesloaded', recoveryMap);
                            }
                            cfj.map.map.addEventListener('tilesloaded', recoveryMap);
                        });
                    }else {
                        $('#housePrompt').text('没找到与 ' + that.searchInput.val() + ' 相关的小区');
                        $('#housePrompt').show(200).delay(2000).hide(200);
                    }
                });
            }*/
            if (obj.associate) {
                var urlstr = vars.mapSite + '?c=map&a=ajaxCfjSearch&city=' + vars.city + '&name=' + obj.strKeyword + '&searchtype=' + obj.type;
            } else {
                var urlstr = vars.mapSite + '?c=map&a=ajaxCfjSearch&city=' + vars.city + '&keyword=' + obj.strKeyword + '&searchtype=xiaoqu';
            }
            $.ajax({
                url: urlstr,
                type: 'GET',
                /*data: {
                    associate: obj.associate,
                    searchtype: obj.type,
                    id: obj.id
                },*/
            }).done(function(data) {
                $('#wapxfditu_D01_08 a.back').trigger('click');
                if (data.mapx && data.mapy && data.searchtype) {
                    that.mapx = data.mapx;
                    that.mapy = data.mapy;
                    require.async('modules/map/cfj', function (cfj) {
                        var recoveryMap = function () {
                            var zoom, type;
                            if (data.searchtype === 'xiaoqu') {
                                zoom = 17;
                                type = '个小区';
                            }else if (data.searchtype === 'comarea') {
                                zoom = 15;
                                type = '个商圈';
                            }else if (data.searchtype === 'district') {
                                zoom = 11;
                                type = '个区县';
                            }
                            if (cfj.priceHsliderDj) {
                                cfj.priceHsliderDj._initPos('不限', '不限');
                            }
                            cfj.map.clearOverlays();
                            //cfj.map.map.panTo(new BMap.Point(data.mapx, data.mapy));
                            cfj.map.map.centerAndZoom(new BMap.Point(data.mapx, data.mapy), zoom);
                            var drawmap = function () {
                                var bounds = cfj.map.gethdBounds();
                                cfj.params.x1 = bounds.MinLng;
                                cfj.params.y1 = bounds.MinLat;
                                cfj.params.x2 = bounds.MaxLng;
                                cfj.params.y2 = bounds.MaxLat;
                                cfj.params.searchtype = data.searchtype;
                                cfj.params.price = '';
                                $.ajax({
                                    url: vars.protocol + vars.mapSite + '?',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: cfj.params,
                                })
                                .done(function(data) {
                                    if (data) {
                                        cfj.map.map.panTo(new BMap.Point(that.mapx, that.mapy));
                                        $('.mapOption').find('p').text('共为您找到 ' + data.count + type);
                                        cfj.map.drawMarkers(data.list, false, '', cfj.markerFunc);
                                    }
                                    if (cfj.positionStatus && cfj.positionPoint) {
                                        cfj.map.drawMarker({mapx: cfj.positionPoint.lng, mapy: cfj.positionPoint.lat}, '<div class="map-wz"><span></span><i></i></div>');
                                    }
                                });
                                cfj.map.map.removeEventListener('tilesloaded', drawmap);
                                return;
                            }
                            cfj.map.map.addEventListener('tilesloaded', drawmap);
                            cfj.map.map.removeEventListener('tilesloaded', recoveryMap);
                        }
                        cfj.map.map.addEventListener('tilesloaded', recoveryMap);
                    });
                }else {
                    $('#housePrompt').text('没找到与 ' + that.searchInput.val() + ' 相关的小区');
                    $('#housePrompt').show(200).delay(2000).hide(200);
                }
            });
        }
    };
    module.exports = MapSearch;
});