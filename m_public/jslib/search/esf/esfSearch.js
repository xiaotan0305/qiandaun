/**
 * 二手房搜索主类
 * by blue
 * 20160120 blue 整理代码，替换样式为最新样式，增加大搜索历史记录功能。
 */
define('search/esf/esfSearch', ['jquery', 'search/mainSearch'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/mainSearch');
    // 页面传入的参数
    var vars = seajs.data.vars;
    vars.city = vars.city || vars.paramcity;

    function EsfSearch() {
        // 弹窗输入框默认显示内容
        this.titCon = $('.input').text().trim();
        // 弹窗html字符串
        if (vars.jhList) {
            this.html = '<div class="searchPage">' + '<header class="header">' +
            '<div class="left" id="wapesfyx_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>' +
            '<div class="cent"><span>二手房搜索</span></div>' + '</header>' +
            '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">' + '<div class="searbox">' +
            '<div class="ipt" id="wapesfyx_D01_09">' + '<input type="search" name="q" value="" placeholder="' + this.titCon + '" autocomplete="off">' +
            '<a href="javascript:void(0);" class="off" style="display: none;"></a>' + '</div>' +
            '<a href="javascript:void(0);" id="wapesfyx_D01_18" class="btn" rel="nofollow"><i></i></a>' + '</div>' + '</form>' +
            '<div class="searLast" id="wapesfyx_D01_19" style="display: none;"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>' +
            '<div class="searHistory" id="historyList">' + '<h3><span class="s-icon-his"></span>搜索历史</h3>' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfyx_D01_10"><ul></ul></div><div class="clearBtn" id="wapesfyx_D01_32">' +
            '<a href="javascript:void(0);">清除历史记录</a></div></div></div>' + '<div id="autoPromptList">' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfyx_D01_31"><ul></ul></div></div>' + '</div>' + '</div>';
        } else if (vars.fromsource === 'sfbapp') {
            this.html = '<div class="searchPage">' +
            '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">' + '<div class="searbox">' +
            '<div class="ipt" id="wapesfsy_D01_09">' + '<input type="search" name="q" value="" placeholder="' + this.titCon + '" autocomplete="off">' +
            '<a href="javascript:void(0);" class="off" style="display: none;"></a>' + '</div>' +
            '<a href="javascript:void(0);" id="wapesfsy_D01_18" class="btn" rel="nofollow"><i></i></a>' + '</div>' + '</form>' +
            '<div class="searLast" id="wapesfsy_D01_19" style="display: none;"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>' +
            '<div class="searHistory" id="historyList">' + '<h3><span class="s-icon-his"></span>搜索历史</h3>' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapesfsy_D01_32">' +
            '<a href="javascript:void(0);">清除历史记录</a></div></div></div>' + '<div id="autoPromptList">' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_31"><ul></ul></div></div>' + '</div>' + '</div>';
        } else {
            this.html = '<div class="searchPage">' + '<header class="header">' +
            '<div class="left" id="wapesfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>' +
            '<div class="cent"><span>二手房搜索</span></div>' + '</header>' +
            '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">' + '<div class="searbox">' +
            '<div class="ipt" id="wapesfsy_D01_09">' + '<input type="search" name="q" value="" placeholder="' + this.titCon + '" autocomplete="off">' +
            '<a href="javascript:void(0);" class="off" style="display: none;"></a>' + '</div>' +
            '<a href="javascript:void(0);" id="wapesfsy_D01_18" class="btn" rel="nofollow"><i></i></a>' + '</div>' + '</form>' +
            '<div class="searLast" id="wapesfsy_D01_19" style="display: none;"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>' +
            '<div class="searHistory" id="historyList">' + '<h3><span class="s-icon-his"></span>搜索历史</h3>' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapesfsy_D01_32">' +
            '<a href="javascript:void(0);">清除历史记录</a></div></div></div>' + '<div id="autoPromptList">' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapesfsy_D01_31"><ul></ul></div></div>' + '</div>' + '</div>';
        }
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.city + 'newEsfHistory';
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
            // 广告位跳转地址
            adUrl: '',
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
    $.extend(EsfSearch.prototype, search);

    /**
     * 增加热词搜索前端缓存
     */
    EsfSearch.prototype.cacheData = function () {
        var that = this;
        if (vars.sessionStorage) {
            that.esfHotWord = vars.sessionStorage.getItem(vars.city + 'esfHotWord');
        }

        if (that.esfHotWord) {
            that.hotSearchList.html(that.esfHotWord);
        } else {
            $.get(vars.esfSite + '?c=esf&a=ajaxGetHotWords', {
                city: vars.city,
                type: that.columnType,
                purpose_oper: vars.purpose_oper
            }, function (data) {
                if (data && $.isArray(data)) {
                    var html = '';

                    /**
                     * 循环遍历数据，构建热词列表a标签html字符串
                     */
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]) {
                            var obj = that.getFormatCondition({
                                key: data[i].Keyword,
                                purpose: data[i].Purpose,
                                showWord: data[i].Keyword,
                                suffix: '出售'
                            });
                            // 如果热词位为广告位
                            var isAD = data[i].ad;
                            if (isAD) {
                                obj.adUrl = data[i].linkUrl;
                            }
                            // 聚合搜索判断
                            if (/jhtype/.test(location.href)) {
                                obj.jhtype = location.href.match(/jhtype=([^&]*)(&|$)/)[1];
                            }
                            // 降价房搜索
                            if (vars.action === 'jjfList') {
                                obj.a = 'jjfList';
                                if (vars.fromsource) {
                                   obj.fromsource = vars.fromsource;
                                }
                            }
                            if (/hjzy=esf/.test(location.href)) {
                                obj.hjzy = 'esf';
                            }
                            if (vars.jhList) {
                                // 如果是广告为显示不同的样式显示
                                html += '<a href="javascript:void(0);"'
                                + (isAD ? ' id="wapxfyx_D01_32"' : '') + '>'
                                + (isAD ? '<span class="tag-icon">广告</span>' : '')
                                + '<span class="searchListName" data-ywtype=\'' + that.setJumpCondition(obj)
                                + '\'>' + data[i].Keyword + '</span></a>';
                            } else {
                               // 如果是广告为显示不同的样式显示
                                html += '<a href="javascript:void(0);"'
                                + (isAD ? ' id="wapxfsy_D01_32"' : '') + '>'
                                + (isAD ? '<span class="tag-icon">广告</span>' : '')
                                + '<span class="searchListName" data-ywtype=\'' + that.setJumpCondition(obj)
                                + '\'>' + data[i].Keyword + '</span></a>'; 
                            }
                        }
                        if (vars.sessionStorage) {
                            that.esfHotWord = vars.sessionStorage.setItem(vars.purpose_oper + vars.city + 'esfHotWord', html);
                        }
                        that.hotSearchList.html(html);
                    }
                }
            });
        }
    };

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    EsfSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.esfSite + '?c=esf&a=ajaxGetAllSearchTip';
        var str = location.href;
        var obj = {
            q: inputValue,
            city: vars.city,
            type: this.columnType,
            purpose: vars.purpose
        };
        // 特价房需要加个参数
        if (/tjftype/.test(str)) {
            obj.tjftype = str.match(/tjftype=([^&]*)(&|$)/)[1];
        }

        // 聚众搜索需要加个参数
        if (/jhtype/.test(str)) {
            obj.jhtype = str.match(/jhtype=([^&]*)(&|$)/)[1];
        }
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    EsfSearch.prototype.getAutoPromptListContent = function (dataArr, inputValue) {
        var that = this;
        var dataArrL = dataArr.length;
        var html = '';
        // 普通显示条数的html字符串
        var liHtmlStr = '<li><a href="javascript:void(0);"><span class="num">约search_num条</span>'
            + '<span class="searchListName" data-ywtype=\'zz\'>xx</span><span class="gray-b"> - yy</span><p>hh</p></a></li>';
        for (var i = 0; i < dataArrL; i++) {
            // 需要组成自动回复一条数据的hmtl字符串
            var liHtml = '';
            var suffix = '';
            var showWord = '';
            // 声明跳转条件对象
            var obj = that.getFormatCondition();
            var singleData = dataArr[i];
            // category 类型（1：楼盘名(缺少新房楼盘名)；2：学校；3：用户词(按照热度排序，不是房源量)；
            // 4：新房可评估楼盘；4：物业类型；6：区县；7：商圈；8：房源标签；
            // 9：租房小产权房；10：新房楼盘名(不能和分类4一起使用)；11：地铁线；12：地铁站）

            // 1：楼盘名；2：学校；3：用户词；
            // 4：新房可评估楼盘；5：物业类型；
            // 6：区县；7：商圈；8：房源标签；
            //13:知名位置
            switch (singleData.category) {
                case '1':
                case '2':
                case '4':
                case '5':
                    obj.key = showWord = singleData.projname;
                    suffix = '出售';
                    break;
                case '3':
                    obj.key = showWord = singleData.projname + '出售';
                    suffix = '房企';
                    break;
                case '6':
                    obj.key = showWord = singleData.projname;
                    obj.district = singleData.district;
                    suffix = '出售';
                    break;
                case '7':
                    obj.key = showWord = singleData.projname;
                    obj.comarea = singleData.comarea;
                    obj.district = singleData.district;
                    suffix = '出售';
                    break;
                case '8':
                    obj.key = showWord = singleData.projname + '出售';
                    suffix = '标签';
                    break;
                case '11':
                    obj.key = showWord = singleData.projname;
                    obj.subwayId = singleData.word;
                    suffix = '出售';
                    break;
                case '12':
                    obj.key = showWord = singleData.projname;
                    obj.subwayId = singleData.subwayline;
                    obj.stationId = singleData.word;
                    suffix = '出售';
                    break;
                case '13':
                    obj.key = showWord = singleData.projname;
                    break;
                case '14':
                    obj.key = showWord = singleData.projname;
                    obj.communityid = singleData.communityid;
                    suffix = '社区-二手房';
                    break;
            }
            obj.showWord = showWord;
            obj.suffix = suffix;
            // ++++++++++++++++++++++++++++++++++
            obj.purpose = singleData.purpose;
            // 用于用户看到的单条楼盘名称
            liHtml = liHtmlStr.replace('xx', showWord.replace(inputValue, '<em>' + inputValue + '</em>'));

            /**
             * 判断楼盘条数
             * 为空或者为0时，不显示后缀
             * 小于10时，显示后缀为约数
             * 大于等于10条则显示准确数据
             */
            if (!Number(singleData.countinfo)) {
                liHtml = liHtml.replace('约search_num条', '');
            } else if (Number(singleData.countinfo) < 10) {
                liHtml = liHtml.replace('约search_num', singleData.countinfo);
            } else {
                liHtml = liHtml.replace('search_num', singleData.countinfo);
            }
            // 用于用户看到的单条楼盘前缀，如-房企、-品牌等
            if (suffix) {
                if ('社区-二手房' === suffix) {
                    liHtml = liHtml.replace('yy', '社区');
                } else {
                    liHtml = liHtml.replace('yy', suffix);
                }
            } else {
                liHtml = liHtml.replace(' - yy', '');
            }
            //替换显示的区县商圈，或者知名位置等
            if (singleData.zmlocal) {
                liHtml = liHtml.replace('hh', singleData.zmlocal);
            } else {
                liHtml = liHtml.replace('<p>hh</p>', '');
            }
            // 判断类型+++++++++++++++++++++++++++++++++++++++++
            // obj.purpose = vars.purpose;

            // 特价房
            if (singleData.tjftype || /tjftype/.test(location.href)) {
                obj.tjftype = singleData.tjftype || location.href.match(/tjftype=([^&]*)(&|$)/)[1];
            }

            // 聚众搜索
            if (singleData.jhtype || /jhtype/.test(location.href)) {
                obj.jhtype = singleData.jhtype || location.href.match(/jhtype=([^&]*)(&|$)/)[1];
            }
            // 降价房搜索
            if (vars.action === 'jjfList') {
                obj.a = 'jjfList';
                if (vars.fromsource) {
                   obj.fromsource = vars.fromsource;
                }
            }
            // 回家置业专题参数
            if (/hjzy=esf/.test(location.href)) {
                obj.hjzy = 'esf';
            }

            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
            html += liHtml;
        }
        return html;
    };


    /**
     * 创建热词列表
     */
    EsfSearch.prototype.createHotSearch = function () {
        var that = this;
        // 特价房不需要热搜词
        if (/tjftype/.test(location.href)) {
            that.hotSearchList.parent().hide();
            return;
        }

        that.hotSearchList.parent().show();
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
    EsfSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
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
     * @param  {string} urlString 地址,用于区分自营页面搜索记录
     */
    EsfSearch.prototype.search = function (urlString) {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        var str = window.location.href;
        var jumpUrl;
        // 如果关键字为空，直接点击搜索按钮时返回到列表页首页
        if (!b) {
            //降价房搜索
            if (vars.action === 'jjfList') {
                //自动化专题 url不一样
                if (vars.autozt) {
                    var urlReg = new RegExp('[esf|esf_bs]\/auto_([0-9]*)\/');
                    var currentUrl = window.location.href;
                    var urlMatch = currentUrl.match(urlReg);
                    vars.esfSite = vars.esfSite.replace('/esf/', '/esf/auto_' + urlMatch[1] + '/');
                    vars.esfSite = vars.esfSite.replace('/esf_bs/', '/esf_bs/auto_' + urlMatch[1] + '/');
                }
                var urlTemp = vars.esfSite + vars.city + '/?a=jjfList';
                if (vars.fromsource) {
                    urlTemp = urlTemp + '&fromsource=' + vars.fromsource;
                }
                // if (vars.tags) {
                //     urlTemp = urlTemp + '&tags=' + vars.tags;
                // }
                if (str.indexOf('datetime') > -1) {
                    var reg = new RegExp('datetime=([^&]*)(&|$)');
                    var utmTime = str.match(reg);
                    urlTemp = urlTemp + '&datetime=' + utmTime[1];
                }
                if (str.indexOf('cycle') > -1) {
                    var reg = new RegExp('cycle=([^&]*)(&|$)');
                    var utmcycle = str.match(reg);
                    urlTemp = urlTemp + '&cycle=' + utmcycle[1];
                }
                window.location = urlTemp;
                return;
            }
            if (/tjftype/.test(str)) {
                jumpUrl = vars.esfSite + vars.city + '/?tjftype=esf';
            }else if (/jhtype/.test(str)) {
                jumpUrl = vars.esfSite + vars.city + '/?jhtype=esf';
            }else if (str.indexOf('utm_source') > -1){
                var reg = new RegExp('utm_source=([^&]*)(&|$)');
                var utmV = str.match(reg);
                jumpUrl = vars.esfSite + vars.city + '/?utm_source=' + utmV[1];
            }else {
                jumpUrl = vars.esfSite + vars.city + '/';
            }
            if (/hjzy=esf/.test(str)) {
                jumpUrl = /\?/.test(jumpUrl) ? '&hjzy=esf' : '?hjzy=esf';
            }
            window.location = jumpUrl;
            that.writeSearchLeaveTimeLog(that.columnType);
            return;
        }
        var url = urlString || vars.esfSite + '?c=esf&a=index';
        //自动化专题 url不一样
        if (vars.autozt) {
            var urlReg = new RegExp('[esf|esf_bs]\/auto_([0-9]*)\/');
            var currentUrl = window.location.href;
            var urlMatch = currentUrl.match(urlReg);
            url= url.replace('/esf/', '/esf/auto_' + urlMatch[1] + '/' + vars.city + '/');
            url = url.replace('/esf_bs/', '/esf_bs/auto_' + urlMatch[1] + '/' + vars.city + '/');
            url = url.replace('&a=index', '');
        }
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
        // 特价房
        if (str.indexOf('tjftype') > -1) {
            var regs2 = new RegExp('tjftype=([^&]*)(&|$)');
            var tjfVal = str.match(regs2);
            url += '&tjftype=' + tjfVal[1];
        }

        // 聚众搜索
        if (str.indexOf('jhtype') > -1) {
            var regs3 = new RegExp('jhtype=([^&]*)(&|$)');
            var jhVal = str.match(regs3);
            url += '&jhtype=' + jhVal[1];
        }
        //降价房搜索
        if (vars.action === 'jjfList') {
            url += '&a=jjfList';
            if (vars.fromsource) {
               url += '&fromsource=' + vars.fromsource;
            }
        }
        // 是否含有类型
        if (vars.purpose) {
            url += '&purpose=' + encodeURIComponent(vars.purpose);
        }

        // 回家置业
        if (vars.hjzy) {
            url += '&hjzy=esf';
        }
        //自动化专题
        if (vars.autozt) {
            // if (vars.tags) {
            //     url = url + '&tags=' + vars.tags;
            // }
            if (str.indexOf('datetime') > -1) {
                var reg = new RegExp('datetime=([^&]*)(&|$)');
                var utmTime = str.match(reg);
                url = url + '&datetime=' + utmTime[1];
            }
            if (str.indexOf('cycle') > -1) {
                var reg = new RegExp('cycle=([^&]*)(&|$)');
                var utmcycle = str.match(reg);
                url = url + '&cycle=' + utmcycle[1];
            } 
        }
        url += '&type=0&keyword=' + encodeURIComponent(b);
        that.setOtherHistory({key: b, showWord: b, suffix: '出售'}, url + '&city=' + vars.city);
        window.location = url + '&city=' + vars.city + '&r=' + Math.random();
        that.writeSearchLeaveTimeLog(that.columnType);
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    EsfSearch.prototype.clickListSearch = function (obj) {
        if (!obj) return;
        var that = this;
        // 将别名过滤掉，不传给keyword
        obj.key = obj.key.replace(/（.*）/, '');
        // 将搜索关键字写入搜索input中
        that.searchInput.val(obj.key);
        if (obj.adUrl) {
            // 如果点击热词是广告位，则统计后跳转到广告页面
            $.get('/data.d?m=adtj&city=' + encodeURIComponent(encodeURIComponent(vars.city)) + '&url=' + document.URL, function () {
                window.location = obj.adUrl;
            });
            return;
        }
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
            if (vars.channelsConfig && vars.channelsConfig.currentChannel === 'schoolhouse') {
                // 如果是学区房
                url = vars.schoolhouseSite + '?keyword=';
            } else {
                url = vars.esfSite + '?keyword=';
            }
        }
        // 插入关键字及城市
        url += encodeURIComponent(obj.key);
        if (obj.purpose) {
            // 是类型
            url += '&purpose=' + encodeURIComponent(obj.purpose);
        }
        if (obj.tags) {
            // 是标签
            url += '&tags=' + encodeURIComponent(obj.tags);
        }
        if (obj.enterprise) {
            // 是品牌
            url += '&enterprise=' + encodeURIComponent(obj.enterprise);
        }
        if (obj.room) {
            url += '&room=' + encodeURIComponent(obj.room);
        }
        if (obj.comarea) {
            // 是商圈
            url += '&comarea=' + encodeURIComponent(obj.comarea);
        }
        if (obj.district) {
            // 是区域
            url += '&district=' + encodeURIComponent(obj.district);
        }

        if (obj.subwayId) {
            // 为地铁线
            url += '&subway_id=' + encodeURIComponent(obj.subwayId);
        }

        if (obj.stationId) {
            // 为地铁站
            url += '&station_id=' + encodeURIComponent(obj.stationId);
        }

        // 特价房
        if (obj.tjftype) {
            url += '&tjftype=' + encodeURIComponent(obj.tjftype);
        }

        // 聚众搜索
        if (obj.jhtype) {
            url += '&jhtype=' + encodeURIComponent(obj.jhtype);
        }
        //降价房搜索
        if (vars.action === 'jjfList') {
            url += '&a=jjfList';
            if (vars.fromsource) {
               url += '&fromsource=' + vars.fromsource;
            }
        }
        //社区搜索
        if (obj.communityid) {
            url += '&communityid=' + encodeURIComponent(obj.communityid);
            that.setOtherHistory(obj, url + '&city=' + vars.city + '&r=' + Math.random());
        } else {
            that.setOtherHistory(obj, url + '&city=' + vars.city);
        }
        if (obj.hjzy) {
            url += '&hjzy=esf';
        }
        //自动化专题 url不一样
        if (vars.autozt) {
            // if (vars.tags) {
            //     url = url + '&tags=' + vars.tags;
            // }
            if (str.indexOf('datetime') > -1) {
                var reg = new RegExp('datetime=([^&]*)(&|$)');
                var utmTime = str.match(reg);
                url = url + '&datetime=' + utmTime[1];
            }
            if (str.indexOf('cycle') > -1) {
                var reg = new RegExp('cycle=([^&]*)(&|$)');
                var utmcycle = str.match(reg);
                url = url + '&cycle=' + utmcycle[1];
            }
            var urlReg = new RegExp('[esf|esf_bs]\/auto_([0-9]*)\/');
            var currentUrl = window.location.href;
            var urlMatch = currentUrl.match(urlReg);
            url = url.replace('/esf/', '/esf/auto_' + urlMatch[1] + '/' + vars.city + '/');
            url = url.replace('/esf_bs/', '/esf_bs/auto_' + urlMatch[1] + '/' + vars.city + '/');
        }
        // 跳转搜索地址
        window.location = url + '&city=' + vars.city + '&r=' + Math.random();
        that.writeSearchLeaveTimeLog(that.columnType);
    };
    module.exports = EsfSearch;
});
