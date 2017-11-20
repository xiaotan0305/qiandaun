/**
 * 首页大搜索主类
 * by blue
 * 20151110 blue 增加自动提示地铁线入口功能，删除电商和金融中增加了品牌参数的bug，代码规范化整理
 * 20151218 blue 去掉i标签
 * 20150113 blue 删除iscrollLite插件兼容性处理（内部处理了），修改整个搜索形式，增加showWord字段以显示当前用户看到的内容，用来作为比较的条件，去掉Util不存在通用性。
 * 20160204 blue 需求删除直接搜索后修改回退按钮为logo的需求及header条变成搜索结果的需求
 * 20160328 blue 大搜索搜索关键词为新房时需要记录新房数据
 * 20160921 tankunpeng  增加热词前端缓存 减少请求提升响应速度
 */
define('search/home/homeSearch', ['jquery', 'search/mainSearch'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/mainSearch');
    // 页面传入的参数
    var vars = seajs.data.vars;
    // 需要通过参数调整提示语
    var placeholder = vars.subway ? '楼盘名/地铁/房产百科等' : '楼盘名/地名/房产百科等';

    /**
     * 根据住宅用途获取关键字后缀
     * @param str
     * @returns {*}
     * @returns {*}
     */
    function getSuffix(str) {
        if (str === '出租') {
            str = '租房';
        } else if (str === '出售') {
            str = '二手房';
        }
        return str;
    }

    /**
     * 获取楼盘和电商的后缀
     * @param ywtype 销售(出售\出租)类型
     * @param purpose 楼盘类型
     * @param esf 在wap大搜索联想词以及大搜索结果页，对于类别为“别墅出售”“写字楼出售”“商铺出售”的搜索联系词类别以及搜索结果页类别，
        分别对应修改为“别墅出售二手房”、“写字楼出售二手房”、“商铺出售二手房”。 @update tankunpeng 2016/12/23 产品 刘壮壮
     * @returns {*}
     */
    function getPropertySuffix(ywtype, purpose, esf) {
        esf = esf || '';
        if (purpose === '住宅' || purpose === '' || ywtype === '新房') {
            return getSuffix(ywtype);
        }
        return purpose + ywtype + esf;
    }

    /**
     * 获取热词类型，由于接口传回的数据不统一，这里做一下处理0.0!
     * @param type
     * @returns {*}
     */
    function getHotType(type) {
        var s;
        switch (type) {
            case '1':
                s = '出租';
                break;
            case '2':
                s = '出售';
                break;
            case '3':
                s = '新房';
                break;
            default:
                s = '';
                break;
        }
        return s;
    }

    /**
     * 获取楼盘类型显示字符串
     * @param w
     * @param y
     * @returns {*}
     */
    function getType(w, y) {
        if (w === '新房' || w === '二手房' || w === '租房') {
            return w;
        }
        return w + y;
    }

    /**
     * 当纠错后之获取一个数据时获取格式化后的数据
     * @param {{facets:{category:''}}} array
     * @returns {*}
     */
    function getOneData(array) {
        var arr = array.facets.category;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (Number(arr[i][2]) !== 0) {
                if (arr[i][0] === 'ALL') {
                    arr[i][0] = '住宅';
                }
                return arr[i];
            }
        }
        return [];
    }

    /**
     * 主类
     * @constructor
     */
    function HomeSearch() {
        // 弹窗html字符串
        this.html = '<div class="searchPage">' +
            '<header class="header">' +
            '<div class="left" id="wapdsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>' +
            '<div class="cent"><span>搜索</span></div>' +
            '</header>' +
            '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">' +
            '<div class="searbox">' +
            '<div class="ipt" id="wapdsy_D01_09">' +
            '<input type="search" name="q" value="" placeholder="' + placeholder + '" autocomplete="off">' +
            '<a href="javascript:void(0);" class="off" style="display: none;"></a>' +
            '</div>' +
            '<a href="javascript:void(0);" id="wapdsy_D01_18" class="btn" rel="nofollow"><i></i></a>' +
            '</div>' +
            '</form>' +
            '<div class="searLast" id="wapdsy_D01_19"><h3><span class="s-icon-hot"></span><a href="javascript:void(0);" class="icon" id="hotSearchRefresh"></a>最近热搜</h3><div class="cont clearfix refresh-cont" id="hotList"></div></div>' +
            '<div class="searHistory" id="historyList">' +
            '<h3><span class="s-icon-his"></span><a href="javascript:void(0);" class="icon"></a>搜索历史</h3>' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapdsy_D01_10"><ul></ul></div></div>' +
            '</div>' +
            '<div class="searHistory" id="autoPromptList">' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapdsy_D01_31"><ul></ul></div></div>' +
            '</div>' +
            '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'newHomeHistory';
        // 显示弹窗的按钮
        this.showPopBtn = '#wapdsy_D01_04';
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
        // 刷新热搜词
        this.hotSearchRefresh = '#hotSearchRefresh';
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
        // 搜索空跳转地址
        this.searchEmptyJump = vars.mainSite + 'xf/' + vars.city + '.html';
        // 标准条件对象
        this.standardObj = {
            // 搜索的关键字
            key: '',
            // 显示字
            showWord: '',
            // 后缀
            suffix: '',
            // 类型
            ywtype: '',
            // 用途
            purpose: '',
            // 商圈
            comarea: '',
            // 区域
            district: '',
            // 地铁线
            railway: '',
            // 地铁站
            station: '',
            // 标签
            tags: '',
            // 企业
            enterprise: '',
            // 纠错字
            correction: '',
            // 广告位跳转地址
            adUrl: '',
            // 佣金百分之5使用
            ext: '',
            // 金融增加入口要跳转的地址
            finUrl: ''
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(HomeSearch.prototype, search);

    /**
     * 增加热词搜索前端缓存
     */
    HomeSearch.prototype.cacheData = function () {
        var that = this;
        seajs.on('cacheData', function () {
            if (vars.sessionStorage) {
                that.homeHotWord = vars.sessionStorage.getItem(vars.city + 'homeHotWord');
            }

            if (that.homeHotWord) {
                that.hotSearchList.html(that.homeHotWord);
            } else {
                // 如:北京，上海等中文。
                _ub.city = vars.zhcity;
                // 参数固定，此方法获取各业务分值。
                _ub.request('vmg.business', true);
                _ub.onload = function () {
                    // 热搜词权重获取;
                    // 新房
                    var xfRate = _ub.values['vmg.business'].N;
                    // 二手房
                    var esfRate = _ub.values['vmg.business'].E;
                    // 租房
                    var zfRate = _ub.values['vmg.business'].Z;
                    $.get(vars.esfSite + '?c=esf&a=ajaxGetHotWords', {
                        city: vars.city,
                        xfRate: xfRate,
                        esfRate: esfRate,
                        zfRate: zfRate
                    }, function (data) {
                        if (data && $.isArray(data)) {
                            var html = '';
                            // 循环遍历数据，构建列表a标签html字符串
                            for (var i = 0; i < data.length; i++) {
                                var singleData = data[i];
                                if (singleData) {
                                    var obj = that.getFormatCondition({
                                        key: singleData.Keyword,
                                        showWord: singleData.Keyword,
                                        suffix: getSuffix(getHotType(singleData.Type)),
                                        ywtype: getHotType(singleData.Type),
                                        purpose: singleData.Purpose
                                    });
                                    // 如果热词位为广告位
                                    var isAD = singleData.ad;
                                    if (isAD) {
                                        obj.adUrl = singleData.linkUrl;
                                    }
                                    // 如果是广告为显示不同的样式显示
                                    html += '<a href="javascript:void(0);"' + (isAD ? ' id="wapxfsy_D01_32"' : '') +
                                        '>' + (isAD ? '<span class="tag-icon">广告</span>' : '') + '<span class="searchListName" data-ywtype=\'' + that.setJumpCondition(obj) +
                                        '\'>' + singleData.Keyword + '</span></a>';
                                }
                            }
                            if (vars.sessionStorage) {
                                that.homeHotWord = vars.sessionStorage.setItem(vars.city + 'homeHotWord', html);
                            }
                            that.hotSearchList.html(html);
                        }
                    });
                };
            }
        });
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    HomeSearch.prototype.getAutoPromptListContent = function (dataArr,inputValue) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var normalHtml = '<li><a href="javascript:void(0);"><span class="num">约search_num条</span>' +
            '<span class="searchListName" data-ywtype=\'zz\'>xx</span>' +
            '<span class="gray-b"> - yy</span></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 需要组成自动回复一条数据的hmtl字符串
            var liHtml = '';
            // 用户看到的关键字
            var showWord = '';
            // 后缀
            var suffix = '';
            // 声明跳转条件对象
            var obj = that.getFormatCondition();
            // 获取单个数据
            var singleData = dataArr[i];
            // 根据singleData['wordtype']的值分别计算要显示成什么样的lihtml字符串内容，最后在赋值给自动显示列表以供显示
            switch (singleData.wordtype) {
                case '类型':
                    showWord = getType(singleData.word, singleData.ywtype);
                    obj.key = singleData.word !== 'ALL' ? singleData.word : singleData.ywtype;
                    obj.purpose = singleData.word;
                    break;
                case '楼盘':
                    showWord = obj.key = singleData.word;
                    obj.purpose = singleData.purpose;
                    suffix = getPropertySuffix(singleData.ywtype, singleData.purpose, singleData.esftag);
                    break;
                case '商圈':
                    showWord = obj.key = obj.comarea = singleData.word;
                    obj.purpose = singleData.purpose;
                    obj.district = !singleData.district || singleData.district === undefined ? '' : singleData.district;
                    suffix = getSuffix(singleData.ywtype);
                    break;
                case '标签':
                    showWord = obj.key = obj.tags = singleData.word;
                    obj.purpose = singleData.purpose;
                    suffix = getSuffix(singleData.ywtype);
                    break;
                case '品牌':
                    showWord = obj.key = obj.enterprise = singleData.word;
                    obj.purpose = singleData.purpose;
                    suffix = getSuffix(singleData.ywtype);
                    break;
                case '电商':
                    showWord = obj.key = singleData.word;
                    obj.purpose = singleData.purpose;
                    obj.ext = singleData.ext;
                    suffix = getPropertySuffix(singleData.ywtype, singleData.purpose, singleData.esftag) + (singleData.ext || '');
                    break;
                case '金融':
                    showWord = obj.key = singleData.word;
                    obj.purpose = singleData.purpose;
                    obj.finUrl = singleData.url;
                    break;
                case '地铁':
                    showWord = obj.key = singleData.word;
                    // 当不含有subwayline，关键字为地铁线，当含subwayline时，关键字是站名，而该subwayline值为地铁线
                    if (singleData.subwayline) {
                        obj.railway = singleData.subwayline;
                        obj.station = singleData.word;
                    } else {
                        obj.railway = singleData.word;
                    }
                    obj.purpose = singleData.purpose;
                    suffix = getSuffix(singleData.ywtype);
                    break;
                case '问答':
                    showWord = obj.key = singleData.word;
                    suffix = getSuffix(singleData.ywtype);
                    obj.suffix = suffix;
                    break;
                case '资讯':
                    showWord = obj.key = singleData.word;
                    suffix = getSuffix(singleData.ywtype);
                    break;
                case '知识':
                    showWord = obj.key = singleData.word;
                    suffix = getSuffix(singleData.ywtype);
                    break;
                case '学校':
                    showWord = obj.key = singleData.word;
                    suffix = getSuffix(singleData.ywtype);
                    break;
                case '新房':
                	 showWord = obj.key = singleData.word;
                	 suffix = getSuffix(singleData.ywtype);
                	 break;
                case '社区':
                    obj.key = singleData.word;
                    showWord = obj.key;
                    suffix = '社区-' + getSuffix(singleData.ywtype);
                    obj.communityid = singleData.communityid;
                    break;
                default:
                    showWord = obj.key = singleData.word;
                    obj.purpose = singleData.purpose;
                    obj.district = singleData.word;
                    suffix = getSuffix(singleData.ywtype);
            }
            obj.showWord = showWord;
            obj.ywtype = singleData.ywtype;
            obj.suffix = suffix;

            liHtml = normalHtml.replace('xx', showWord.replace(inputValue,'<em>'+inputValue+'</em>'));

            /**
             * tankunpeng 20160815 增加家居广告
             * 增加searchtype  keywords: 正常搜索词 ad:广告 需要加特殊样式(显示广告字样)
             */
            if (singleData.searchtype === 'ad') {
                // liHtml = liHtml.replace('arr-**', 'arr-rt').replace('id-**', 'wapxfsy_D01_40');
                obj.showWord = singleData.word;
                obj.suffix = singleData.wordtype;
                obj.adUrl = singleData.ywtype.indexOf(location.protocol) !== -1 ? singleData.ywtype : location.protocol + '//' + singleData.ywtype;
                // 家居广告统计使用
                obj.adnum = singleData.adnum;
                obj.channel = singleData.channel;
                obj.housetype = 'jiajuad';
                liHtml = liHtml.replace('class="num"', 'class="tag-icon"').replace(' - yy', '');
                // 家居广告展示统计
                $.get('/data.d?m=houseinfotj&city=' + vars.city + '&housetype=' + obj.housetype + '&type=show&newcode=' + obj.adnum + '&channel=' + obj.channel);
            }
            if(singleData.ywtype === '位置'){
            	liHtml = '<li><a href="javascript:void(0);" class="arr-rt-ns"><div class="searchListName" data-ywtype=\'zz\'>'+singleData.word.replace(inputValue,'<em>'+inputValue+'</em>')+'</div><p><em>'+singleData.zmlocal+'</em></p></a></li>';
            }
            if(singleData.wordtype === '楼盘'){
            	liHtml = '<li><a href="javascript:void(0);"><span class="num">约search_num条</span><span class="searchListName" data-ywtype=\'zz\'>'+showWord.replace(inputValue,'<em>'+inputValue+'</em>')+'</span><span class="gray-b"> - yy</span><p>'+singleData.zmlocal+'</p></a></li>';
            }
            if (suffix) {
                liHtml = liHtml.replace('yy', suffix);
            } else {
                liHtml = liHtml.replace(' - yy', '');
            }
            if (obj.finUrl) {
                liHtml = liHtml.replace('约search_num条', '在线申请');
            }

            if (singleData.count === 0 || singleData.count === 'null' || singleData.searchtype === 'ad') {
                // 判断数量如果为0或者为nul时，去除约多少条显示
                liHtml = liHtml.replace('约search_num条', '');
            } else if (singleData.count < 10) {
                // 如果数量小于10直接显示条数
                liHtml = liHtml.replace('约search_num', String(singleData.count));
            } else {
                // 正常显示约为多少条
                liHtml = liHtml.replace('search_num', String(singleData.count));
            }
            // 将所有的条件存储起来以供之后的点击事件使用，目的是为了能够在列表页中显示筛选条件
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    HomeSearch.prototype.createAutoPromptList = function (inputValue) {
        search.createAutoPromptList.call(this, inputValue, vars.esfSite + '?c=esf&a=ajaxGetSearchTip&orderby=esfcount', {
            city: vars.city,
            q: inputValue
        });
    };

    /**
     * 创建热词列表
     */
    HomeSearch.prototype.createHotSearch = function () {
        var that = this;
        if (that.hotSearchList.parent().is(':hidden')) {
            that.hotSearchList.parent().show();
        }
        // 获取是否有历史数据
        var hasHistory = that.hasHistory();
        // 判断子节点长度，目的为减少网络请求数
        if (that.hotSearchList.children().length > 0) {
            // 有历史情况下
            if (hasHistory) {
                // 刷新滚动插件，并且重置位置
                if (that.scroll) {
                    that.scroll.refresh();
                    that.scroll.scrollTo(0, 0);
                } else {
                    // 操作过程中有历史记录的情况
                    that.hotSearchList.html('<div id="scroller">' + that.hotSearchList.html() + '</div>');
                    that.hotSearchRefreshBtn.show();
                    that.setRefreshScroll();
                }
            } else if (that.scroll) {
                // 操作过程中没有历史记录，销毁插件，并重新设置热词显示排布
                that.hotSearchList.html(that.hotSearchList.find('#scroller').html()).css('height', 'auto');
                that.hotSearchRefreshBtn.hide();
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
    HomeSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        // 当进入弹窗前的搜索显示框中有楼盘信息时，使空跳转跳转到该楼盘的详情页
        if (that.showPopBtn.attr('data-url')) {
            that.searchEmptyJump = that.showPopBtn.attr('data-url');
            // @20151218 去掉i标签
            that.searchInput.attr('placeholder', that.showPopBtn.text().trim());
            // @20160729 增加广告标签
            that.searchInput.after('<span class="tag-icon"></span>');
        }else if(vars.searchAdUrl){
        	 that.searchEmptyJump = vars.searchAdUrl;
             // @20151218 去掉i标签
             that.searchInput.attr('placeholder', vars.searchAdTitle.trim());
             // @20160729 增加广告标签
             that.searchInput.after('<span class="tag-icon"></span>');
        }
        that.writeSearchEnterTimeLog(vars.city);
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * 点击搜索按钮处理
     */
    HomeSearch.prototype.search = function () {
        var that = this;
        var searchInputVal = that.searchInput.val();
        if ($.trim(searchInputVal) === '') {
            window.location = that.searchEmptyJump;
            return;
        }
        var formatVal = that.inputFormat(searchInputVal);
        $.get(vars.esfSite + '?c=esf&a=ajaxGetSearchResult', {
            q: formatVal,
            city: vars.city
        }, function (data) {
            if (data) {
                that.autoPromptList.find('ul').empty();
                var dataArr = JSON.parse(data);
                var count = parseInt(dataArr.itemcount);
                var correction = dataArr.correction;
                if (count === 1) {
                    var arr = getOneData(dataArr);
                    var obj = that.getFormatCondition({
                        key: formatVal,
                        ywtype: arr[1],
                        purpose: arr[0]
                    });
                    // 确定不是广告是金融入口
                    if (arr[3] && arr[3] !== 'ad') {
                        obj.finUrl = arr[3];
                    }
                    if (correction) {
                        obj.key = correction;
                        obj.correction = correction + '|' + arr[2] + '|' + formatVal;
                    }
                    that.clickListSearch(obj);
                    return;
                }
                var showTxt = '';
                if (count <= 0) {
                    showTxt = '<h3 class="center pdY10">没有找到“' + formatVal + '”的相关房源，换个关键词试试吧</h3>';
                } else if (correction) {
                    // 存在模糊查询找到的纠错词时，显示该纠错词
                    showTxt = '<h3>您要找的是不是“' + correction + '”，共' +
                        count + '个搜索结果，继续查找“<a href="javascript:void(0);" id="correctionBeforeWord">' +
                        formatVal + '</a>”</h3>';
                } else {
                    showTxt = '<h3>共' + count + '个搜索结果，请选择类别查看</h3>';
                }
                // 当为0时直接显示没有找到就完了
                if (count === 0) {
                    that.autoPromptList.find('ul').html(showTxt);
                    if (that.autoPromptList.is(':hidden')) {
                        that.autoPromptList.show();
                    }
                    return;
                }
                // @20160204 blue 需求删除直接搜索后修改回退按钮为logo的需求及header条变成搜索结果的需求
                // that.searchPop.find('.left').html('<a id="wapesfsy_D01_01" class="logo" href="' + vars.mainSite + vars.city + '.html"></a>');
                // that.searchPop.find('.cent span').html('搜索结果');
                var html = that.getListAfterCorrection(dataArr);
                if (showTxt) {
                    html = showTxt + html;
                }
                that.autoPromptList.find('ul').html(html);
                if (that.autoPromptList.is(':hidden')) {
                    that.autoPromptList.show();
                }
            }
        });
    };

    /**
     * 获取纠错后的列表
     * @param c
     * @returns {string}
     */
    HomeSearch.prototype.getListAfterCorrection = function (c) {
        var that = this;
        var correction = c.correction;
        var arr = c.facets.category;
        var len = arr.length;
        var html = '';
        var specialHtml = '<li><a href="javascript:;"><span class="num">约search_num条</span>' +
            '<span class="searchListName" data-ywtype=\'zz\'>xx</span></a></li>';
        for (var i = 0; i < len; i++) {
            // 广告入口时 arr[i][2] 为跳转地址 转化为数字为0

            if (!arr[i] || arr[i][3] !== 'ad' && (arr[i][2] | 0) <= 0) {
                continue;
            }
            var liHtml = '';
            var xxShow = '';
            var suffix = '';
            var obj = that.getFormatCondition();
            if (correction) {
                obj.key = correction;
            } else {
                obj.key = that.inputFormat(that.searchInput.val());
            }
            if (arr[i][0] === '住宅' || arr[i][0] === 'ALL' && arr[i][1] === '新房') {
                suffix = xxShow = getSuffix(arr[i][1]);
                obj.purpose = '住宅';
            } else if (arr[i][0] === 'ALL' && arr[i][1] !== '新房') {
                suffix = arr[i][1];
                // 资讯知识问答直接搜索显示内容处理
                xxShow = '与<span style="color: #ff6666;">' + obj.key + '</span>相关的' + arr[i][1];
            } else {
                if (arr[i][3]) {
                    // 处理金融显示关键字
                    // 广告增加第四个字段  值为'ad'
                    if (arr[i][3] === 'ad') {
                        suffix = xxShow = arr[i][0];
                    } else if (arr[i][3] === '二手房') {

                        /**
                         *  在wap大搜索联想词以及大搜索结果页，对于类别为“别墅出售”“写字楼出售”“商铺出售”的搜索联系词类别以及搜索结果页类别，
                         分别对应修改为“别墅出售二手房”、“写字楼出售二手房”、“商铺出售二手房”。
                         *  @update tankunpeng 2016/12/23
                         *  后台处理 arr[3]增加'二手房'字段识别
                         *  产品 刘壮壮
                         */
                        suffix = xxShow = arr[i][0] + arr[i][1] + arr[i][3];
                    }
                } else {
                    suffix = xxShow = arr[i][0] + arr[i][1];
                }
                obj.purpose = arr[i][0];
            }
            liHtml = specialHtml.replace('xx', xxShow);
            obj.ywtype = arr[i][1];

            if (arr[i][3]) {
                // 家居广告入口
                if (arr[i][3] === 'ad') {
                    obj.key = arr[i][0];
                    obj.suffix = arr[i][1];
                    obj.adUrl = arr[i][2].indexOf(location.protocol) !== -1 ? arr[i][2] : location.protocol + '//' + arr[i][2];
                    obj.housetype = 'jiajuad';
                    obj.channel = arr[i][4];
                    obj.adnum = arr[i][5];
                    liHtml = liHtml.replace('class="num"', 'class="tag-icon"').replace('约search_num条', '');
                    // 展示统计
                    $.get('/data.d?m=houseinfotj&city=' + vars.city + '&housetype=' + obj.housetype + '&type=show&newcode=' + obj.adnum + '&channel=' + obj.channel);

                    /**
                     *  在wap大搜索联想词以及大搜索结果页，对于类别为“别墅出售”“写字楼出售”“商铺出售”的搜索联系词类别以及搜索结果页类别，
                     分别对应修改为“别墅出售二手房”、“写字楼出售二手房”、“商铺出售二手房”。
                     *  @update tankunpeng 2016/12/23
                     *  后台处理 arr[3]增加'二手房'字段识别
                     *  产品 刘壮壮
                     */
                } else if (arr[i][3] === '二手房') {
                    obj.ywtype = arr[i][1] + arr[i][3];
                } else {
                    // 金融入口
                    obj.key = arr[i][0];
                    obj.finUrl = arr[i][3];
                    liHtml = liHtml.replace('约search_num条', '在线申请');
                }
            }
            obj.showWord = obj.key;
            if (!arr[i][3] || arr[i][3] !== 'ad') {
                obj.suffix = suffix;
            }
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            if (arr[i][2] === 0 || arr[i][2] === 'null') {
                liHtml = liHtml.replace('约search_num条', '');
            } else if (arr[i][2] < 10) {
                liHtml = liHtml.replace('约search_num', arr[i][2]);
            } else {
                liHtml = liHtml.replace('search_num', arr[i][2]);
            }
            html += liHtml;
        }
        return html;
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    HomeSearch.prototype.clickListSearch = function (obj) {
        if (!obj) return;
        var that = this;
        that.searchInput.val(obj.key);
        that.searchInput.parent().find('.tag-icon').hide();
        if (obj.historyUrl) {
            that.setHistory(obj, obj.historyUrl, that.historyMark);
            that.setHistory(obj, obj.historyUrl, vars.city + 'newXfHistory');
            window.location = that.pagetype ? obj.historyUrl + '&f=' + that.pagetype : obj.historyUrl;
            return;
        }
        if (obj.finUrl) {
            window.location = obj.finUrl;
            return;
        }
        if (obj.adUrl) {
            that.setHistory(obj, obj.adUrl, that.historyMark);
            // 区分家居广告类型,如果存在housetype==='jiaju'则为家居广告,需要统计频道(channel)和广告id(adnum)
            var housetype = obj.housetype || '',
                channel = obj.channel || '',
                adnum = obj.adnum || '';
            $.get('/data.d?m=houseinfotj&city=' + vars.city + '&housetype=' + housetype + '&type=click&newcode=' + adnum + '&channel=' + channel, function () {
                window.location = obj.adUrl;
            });
            return;
        }
        var url = '',
            type = 0;
        switch (obj.ywtype) {
            case '新房':
            case '位置':
                type = 0;
                url = vars.mainSite + 'search.d?m=search&keyword=';
                break;
            case '出售':
                type = 1;
                if (obj.ext) {
                    url = vars.esfSite + '?cstype=ds&keyword=';
                } else {
                    url = vars.esfSite + '?keyword=';
                }
                if (obj.communityid) {
                    url = vars.esfSite + '?communityid=' + obj.communityid + '&keyword=';
                } else {
                    url = vars.esfSite + '?keyword=';
                }
                break;
            case '出租':
                type = 2;
                if (obj.communityid) {
                    url = vars.zfSite + '?communityid=' + obj.communityid + '&keyword=';
                } else {
                    url = vars.zfSite + '?keyword=';
                }
                break;
            case '问答':
                type = 3;
                url = vars.askSite + '?c=ask&a=search&keyword=';
                break;
            case '资讯':
                type = 4;
                url = vars.newsSite + '?c=news&a=search&keyword=';
                break;
            case '知识':
                type = 5;
                url = vars.mainSite + 'zhishi/search/?kw=';
                break;
            default:
                break;
        }
        url += (type !== 0 ? encodeURIComponent(obj.key) : obj.key);
        // 知识不需要传入城市
        if (type !== 5) {
            url += '&city=' + vars.city;
        }
        // 当为知识问答资讯搜索关键字时直接跳出不带入其他参数
        if (type >= 3) {
            that.writeSearchLeaveTimeLog(4);
            that.setHistory(obj, url + '&refer=sy&r=' + Math.random(), that.historyMark);
            window.location = url + '&refer=sy&r=' + Math.random();
            return;
        }
        if (type !== 0) {
            // 小于3时需要带入用途
            url += '&purpose=' + (type < 3 ? encodeURIComponent(obj.purpose) : obj.purpose);
        }
        // 根据储存的对象是否含有各个筛选属性，设置筛选属性传值跳转
        if (obj.correction) {
            url += '&correction=' + (type !== 0 ? encodeURIComponent(obj.correction) : obj.correction);
        }
        if (obj.tags) {
            url += '&tags=' + (type !== 0 ? encodeURIComponent(obj.tags) : obj.tags);
        }
        if (obj.enterprise) {
            url += '&enterprise=' + (type !== 0 ? encodeURIComponent(obj.enterprise) : obj.enterprise);
        }
        if (obj.comarea) {
            url += '&comarea=' + (type !== 0 ? encodeURIComponent(obj.comarea) : obj.comarea);
        }
        if (obj.district) {
            url += '&district=' + (type !== 0 ? encodeURIComponent(obj.district) : obj.district);
        }
        if (obj.railway) {
            var railwayKey = 'railway';
            // 二手房的键值与其他不同
            if (type === 1) {
                railwayKey = 'subway_id';
            }
            url += '&' + railwayKey + '=' + (type !== 0 ? encodeURIComponent(obj.railway) : obj.railway);
        }
        if (obj.station) {
            var stationKey = '';
            // 由于各个栏目的属性值都不同，所以判断key值
            if (type === 0) {
                stationKey = 'railway_station';
            } else if (type === 1) {
                stationKey = 'station_id';
            } else {
                stationKey = 'station';
            }
            url += '&' + stationKey + '=' + (type !== 0 ? encodeURIComponent(obj.station) : obj.station);
        }
        that.writeSearchLeaveTimeLog(4);
        that.setHistory(obj, url + '&refer=sy', that.historyMark);
        // 如果是新房，存储历史记录
        if (type === 0) {
            that.setHistory(obj, url + '&refer=sy', vars.city + 'newXfHistory');
        }
        // 这里特别注意这里的refer作用为统计需要
        // 首页改版增加f参数区分改版类型 1: 改版1 2:改版2 所有跳转链接增加该参数 统计改版效果
        window.location = url + (that.pagetype ? '&f=' + that.pagetype : '') + '&refer=sy&r=' + Math.random();
    };
    module.exports = HomeSearch;
});