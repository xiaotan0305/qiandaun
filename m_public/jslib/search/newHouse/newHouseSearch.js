/**
 * 新房搜索主类
 * by blue
 * 20160118 blue 整理代码，删除Util引用，增加注释，重构历史记录
 * 20160508 yangfan 跳转添加 ctm 参数。发现新房页面没有 vars.city ，统一改为 vars.paramcity ；
 */
define('search/newHouse/newHouseSearch', [
    'jquery',
    'search/mainSearch'
], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 公共方法对象索引
    var search = require('search/mainSearch');
    // 页面传入的参数
    var vars = seajs.data.vars;
    // 设置两种户型列表名称数组
    var libXfaction = ['getPrivilegeHouseList', 'searchHuXingList'];

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

    function NewHouseSearch() {
        // 弹窗输入框默认显示内容
        this.titCon = vars.railwayNum && parseInt(vars.railwayNum) > 0 ? '楼盘名/地铁/开发商/房产百科等' : '楼盘名/地名/开发商/房产百科等';
        // 弹窗html字符串
        this.html = '<div class="searchPage">' + '<header class="header">' +
            '<div class="left" id="wapxfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>' +
            '<div class="cent"><span>新房搜索</span></div>' + '</header>' +
            '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">' + '<div class="searbox">' +
            '<div class="ipt" id="wapxfsy_D01_09">' + '<input type="search" name="q" value="" placeholder="' + this.titCon + '" autocomplete="off">' +
            '<a href="javascript:void(0);" class="off" style="display: none;"></a>' + '</div>' +
            '<a href="javascript:void(0);" id="wapxfsy_D01_18" class="btn" rel="nofollow"><i></i></a>' + '</div>' + '</form>' +
            '<div class="searLast" id="wapxfsy_D01_19" style="display: none;"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>' +
            '<div class="searHistory" id="historyList">' + '<h3><span class="s-icon-his"></span>搜索历史</h3>' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapxfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapxfsy_D01_32">' +
            '<a href="javascript:void(0);">清除历史记录</a></div></div></div>' + '<div class="searHistory" id="autoPromptList">' +
            '<div style="margin-bottom: 50px;"><div class="searList" id="wapxfsy_D01_31"><ul></ul></div></div>' + '</div>' + '</div>';
        // 历史标识，用来存储在localstorge的标识
        this.historyMark = vars.paramcity + 'newXfHistory';
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
        this.columnType = 3;
        // 关闭自动提示按钮
        this.findCloseAutoPromptListBtn = '#autoPromptList a';
        // 历史记录数量
        this.HISTORY_NUMBER = 10;
        // yangfan rewrite 点击查询按钮，路径经常出现类似 http://m.test.fang.com/xf/undefined/ 路径，
        // 发现 vars.city 为 undefined，统一改为 vars.paramcity
        this.searchEmptyJump = '/xf/' + vars.paramcity + '/';
        this.standardObj = {
            // 搜索的关键字
            key: '',
            // 显示字
            showWord: '',
            // 后缀
            suffix: '',
            // 用途
            purpose: '',
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
            // 房源类型，分为可售房源和可售户型，当点击这两个类型时url要发生变化
            soure: '',
            // 广告位跳转地址
            adUrl: '',
            // 如果搜索结果为1并且是楼盘，则直接跳转到详情页需求，增加一个字段表示要跳转的楼盘url
            loupanurl: '',
            // 地铁线
            railway: '',
            // 地铁站
            railwayStation: '',
            // 知识提示标志
            zhishiTips: ''
        };
        // 设置两个统计用id
        this.soureObj = {
            xfhxcount: {
                name: '可售户型',
                clickId: 'wapxfsy_D01_34'
            },
            xfhcount: {
                name: '可售房源',
                clickId: 'wapxfsy_D01_33'
            }
        };
    }

    /**
     * 原形链对象继承
     * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
     */
    $.extend(NewHouseSearch.prototype, search);

    /**
     * 增加热词搜索前端缓存
     */
    NewHouseSearch.prototype.cacheData = function () {
        var that = this;
        if (vars.sessionStorage) {
            that.xfHotWord = vars.sessionStorage.getItem(vars.paramcity + 'xfHotWord');
        }
        if (that.xfHotWord) {
            that.hotSearchList.html(that.xfHotWord);
        } else {
            $.get(vars.esfSite + '?c=esf&a=ajaxGetHotWords', {
                city: vars.paramcity,
                type: that.columnType
            }, function (data) {
                if (data && $.isArray(data)) {
                    var html = '';
                    // 循环遍历数据，构建热词列表a标签html字符串
                    for (var i = 0; i < data.length; i++) {
                        var singleData = data[i];
                        if (singleData) {
                            var obj = that.getFormatCondition({
                                key: singleData.Keyword,
                                purpose: singleData.Purpose,
                                showWord: singleData.Keyword,
                                suffix: '新房'
                            });
                            // 判断是否当前热词为广告位
                            var isAD = singleData.ad;
                            if (isAD) {
                                obj.adUrl = singleData.linkUrl;
                            }
                            // 这里的需求为当热词是搜房红包时设置其直接跳转，由于与单个楼盘直接跳转详情页功能相同所以直接赋值给loupanurl
                            if (singleData.hongbao) {
                                obj.loupanurl = singleData.linkUrl;
                            }
                            // yangfan add 20160506
                            obj.ctmNo = i + 1;
                            obj.ctmModule = 'search_hot';
                            html += '<a href="javascript:void(0);"' + (isAD ? ' id="wapxfsy_D01_32"' : '') + '>' + (isAD ?
                                    '<span class="tag-icon">广告</span>' : '') + '<span class="searchListName" data-ywtype=\'' + that.setJumpCondition(
                                    obj) + '\'>' + singleData.Keyword + '</span></a>';
                        }
                    }
                    if (vars.sessionStorage) {
                        that.xfHotWord = vars.sessionStorage.setItem(vars.paramcity + 'xfHotWord', html);
                    }
                    that.hotSearchList.html(html);
                }
            });
        }
    };

    /**
     * 重写创建自动提示列表方法，传入需要的接口地址及接口传参
     * @param inputValue
     */
    NewHouseSearch.prototype.createAutoPromptList = function (inputValue) {
        var url = vars.esfSite + '?c=esf&a=ajaxGetAllSearchTip';
        var obj = {
            q: inputValue,
            city: vars.paramcity,
            type: this.columnType,
            purpose: vars.purposes
        };
        // 特殊处理烟台，为了能够显示其他周边楼盘
        if (vars.paramcity === 'yt') {
            obj.showyd = 1;
        }
        // 特价房需要加个参数
        var str = location.href;
        if (/tjftype/.test(str)) {
            obj.tjf = str.match(/tjftype=([^&]*)(&|$)/)[1];
        }
        search.createAutoPromptList.call(this, inputValue, url, obj);
    };

    /**
     * 获取自动提示列表内容
     * ！！！这个函数必须要提一下，从接口读到的数据竟然需要前端去做非常多的处理，因为判断无规律无法优化
     * @param dataArr 传入的数据数组
     * @returns {string} 返回需要显示列表html字符串
     */
    NewHouseSearch.prototype.getAutoPromptListContent = function (dataArr,inputValue) {
        var that = this;
        var dataArrL = dataArr.length;
        var str = location.href;
        // 这里是为了设置认证楼盘后面的V图片
        var certIcon = '<i class="sea-v"></i>';
        var html = '';
        // 普通显示条数的html字符串
        var liHtmlStr = '<li><a href="javascript:void(0);" id="id-**" data-id="wapxfsy" class="arr-**"><span class="num">约search_num条</span>' +
            '<span class="searchListName" data-ywtype=\'zz\'>xx</span><span class="setXXX"> - yy</span>rz</a></li>';
        // yangfan add 20160506 添加列表序号，为了生成 ctm 参数
        var liNo = 1;
        for (var i = 0; i < dataArrL; i++) {
            // 需要组成自动回复一条数据的hmtl字符串
            var liHtml = '';
            var showWord = '';
            var suffix = '';
            // 声明跳转条件对象
            var obj = that.getFormatCondition();
            var singleData = dataArr[i];
            // 区县（6）、商圈（5）、品牌（4）、新房（1）、二手房（2）、标签（7）、学校(8) 、 地铁(9) 、 知识(10)、品牌直销(brandcooperation)
            switch (singleData.category) {
                // 新房中有可能出现红包和单一楼盘的情况
                case '1':
                case '8':
                    obj.key = showWord = singleData.projname;
                    suffix = '新房';
                    break;
                // case '2':
                // break;
                case '3':
                    obj.key = showWord = singleData.projname;
                    suffix = '房企';
                    break;
                case '4':
                    obj.key = singleData.projname;
                    showWord = singleData.projname + '新房';
                    suffix = '品牌';
                    break;
                case '5':
                    obj.key = showWord = singleData.projname;
                    obj.comarea = singleData.comarea;
                    obj.district = singleData.district;
                    suffix = '新房';
                    break;
                case '6':
                    obj.key = showWord = singleData.projname;
                    obj.district = singleData.district;
                    suffix = '新房';
                    break;
                // case '7':
                //     break;
                case '9':
                    obj.key = showWord = singleData.projname;
                    if (singleData.subwayline) {
                        obj.railway = singleData.subwayline;
                        obj.railwayStation = singleData.word;
                    } else {
                        obj.railway = singleData.word;
                    }
                    suffix = '新房';
                    break;
                case '10':
                    obj.key = showWord = singleData.projname;
                    obj.zhishiTips = singleData.projname;
                    suffix = '购房技巧';
                    break;
                case 'brandcooperation':
                    obj.key = showWord = singleData.projname;
                    suffix = '品牌直销';
                    break;
                case '11':
                    obj.key = showWord = singleData.projname;
                    suffix = '位置';
                    break;
            }
            // 设置如果唯一有详情页的话设置跳转地址
            if (singleData.loupanurl) {
                obj.loupanurl = singleData.loupanurl;
            }
            // 设置用户看到的字段
            obj.showWord = showWord;

            // 用于用户看到的单条楼盘名称
            liHtml = liHtmlStr.replace('xx', showWord.replace(inputValue,'<em>'+inputValue+'</em>'));

            /**
             * tankunpeng 20160513 专题入口增加样式
             * 增加searchtype  keywords: 正常搜索词 zt:专题入口 需要加特殊样式(右侧箭头)
             * tankunpeng 20160530 专题入口增加click id
             * id-** 专题需要增加统计id  wapxfsy_D01_40
             */
            if (singleData.searchtype === 'zt') {
                liHtml = liHtml.replace('arr-**', 'arr-rt').replace('id-**', 'wapxfsy_D01_40');
            }

            // 如果存在认证标识并且认证标识的数量不为0那么显示认证图标
            if (singleData.certitype && parseInt(singleData.certitype) > 0) {
                obj.certitype = singleData.certitype;
                liHtml = liHtml.replace('rz', certIcon);
            } else {
                liHtml = liHtml.replace('rz', '');
            }
            // 如果存在红包标识并且红包的数量不为0那么现实搜房红包可用
            if (singleData.ishongbao && parseInt(singleData.ishongbao) > 0) {
                liHtml = liHtml.replace('约search_num条', '搜房红包可用');
            } else if (!singleData.countinfo) {
                // 判断楼盘条数,为空或者为0时，不显示后缀,小于10时，显示后缀为约数,大于等于10条则显示准确数据
                liHtml = liHtml.replace('约search_num条', '');
            } else if (singleData.countinfo < 10) {
                liHtml = liHtml.replace('约search_num', singleData.countinfo);
            } else {
                liHtml = liHtml.replace('search_num', singleData.countinfo);
            }
            // 设置后缀
            obj.suffix = suffix;
            // yangfan add 20160506
            obj.ctmNo = liNo++;
            obj.ctmModule = 'search';
            // 用于用户看到的单条楼盘前缀，如-房企、-品牌等
            if (suffix) {
                liHtml = liHtml.replace('yy', suffix);
            } else {
                liHtml = liHtml.replace(' - yy', '');
            }
            // 修改提示列表单条数据后缀词样式,品牌直销采用特殊样式
            if (singleData.category === 'brandcooperation') {
                liHtml = liHtml.replace('setXXX', 'sf-nh-hbrand');
            } else {
                liHtml = liHtml.replace('setXXX', 'gray-b');
            }

            // 特价房
            if (singleData.tjftype || /tjftype/.test(str)) {
                obj.tjftype = singleData.tjftype || str.match(/tjftype=([^&]*)(&|$)/)[1];
            }
            if(singleData.category === '1' || singleData.category === '8'){
            	var disAndCom = singleData.district;
            	if(singleData.comerce){
            		disAndCom += '-'+singleData.comerce;
            	}
            var showDisAndCom = disAndCom?'<p>'+disAndCom+'</p>':'';
            	liHtml = '<li><a href="javascript:void(0);" id="id-**" data-id="wapxfsy" class="arr-rt-ns"><span class="searchListName" data-ywtype=\'zz\'>'+singleData.projname.replace(inputValue,'<em>'+inputValue+'</em>')+'</span>'+showDisAndCom+'</a></li>';
            
            }
            if(singleData.category === '11'){
            	liHtml = '<li><a href="javascript:void(0);" id="id-**" data-id="wapxfsy" class="arr-rt-ns"><span class="searchListName" data-ywtype=\'zz\'>'+singleData.projname.replace(inputValue,'<em>'+inputValue+'</em>')+'</span><p><em>'+singleData.zmlocal+'</em></p></a></li>';
            }
            // 储存条件对象数据
            liHtml = liHtml.replace('zz', that.setJumpCondition(obj));
           
            html += (singleData.category !== '7') ? liHtml : '';
            // ！！！这里要特别注意，在新房栏目中，后台数据的第一条数据有可能是可售房源或者可售户型这种需要特殊跳转地址的类型，要单独处理
            // 新房大列表不在显示 可售户型和可售房源
            if (i === 0 && vars.action !== 'xflist') {
                // 可售房源、可售户型数量及类型的对象
                var roomCountArr = getSoureCount(singleData);
                var roomCountArrL = roomCountArr.length;
                // 循环设置可售房源和可售户型的条件及增加用户统计
                for (var j = 0; j < roomCountArrL; j++) {
                    var htmlStr = liHtmlStr.replace('rz', '');
                    // 声明跳转条件对象
                    obj.soure = '';
                    obj.showWord = singleData.projname;
                    // yangfan add 20160506
                    obj.ctmNo = liNo++;
                    var ob = roomCountArr[j],
                        num = ob.num;
                    if (that.soureObj[ob.type]) {
                        // 设置用户统计
                        htmlStr = htmlStr.replace('id-**', that.soureObj[ob.type].clickId);
                        // 存在可售房源和可售户型类型时，用户看到的楼盘名要增加可售房源或者可售户型的显示
                        showWord = singleData.projname + that.soureObj[ob.type].name;
                        // 赋值来源，用于判断是可售房源或者可售户型
                        obj.soure = ob.type;
                    }
                    htmlStr = htmlStr.replace('xx', showWord);
                    if (!num) {
                        htmlStr = htmlStr.replace('约search_num条', '');
                    } else if (num < 10) {
                        htmlStr = htmlStr.replace('约search_num', num);
                    } else {
                        htmlStr = htmlStr.replace('search_num', num);
                    }
                    htmlStr = htmlStr.replace(' - yy', '');
                    htmlStr = htmlStr.replace('zz', that.setJumpCondition(obj));
                    html += htmlStr;
                }
            }
        }
        return html;
    };

    /**
     * 创建热词列表
     */
    NewHouseSearch.prototype.createHotSearch = function () {
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
    NewHouseSearch.prototype.showPop = function () {
        var that = this;
        search.showPop.call(that);
        var keywordEl;
        // 增加上海城市改变兼容
        if (vars.paramcity === 'sh') {
            keywordEl = that.showPopBtn;
        } else {
            keywordEl = that.showPopBtn.find('.input');
        }

        if (keywordEl.length > 0) {
            var searchKey;
            if (vars.paramcity === 'sh') {
                searchKey = keywordEl.attr('data-title');
            } else {
                searchKey = keywordEl.text().trim();
            }

            if (keywordEl.attr('data-url')) {
                that.searchEmptyJump = keywordEl.attr('data-url');
                that.searchInput.attr('placeholder', searchKey);
                // @20160729 增加广告标签
                that.searchInput.after('<span class="tag-icon"></span>');
            } else if (searchKey !== this.titCon) {
                that.searchInput.val(searchKey);
            }
        }
        // 添加进入搜索功能日志记录 searchuv
        that.writeSearchEnterTimeLog(vars.paramcity, that.columnType);
        that.createHotSearch();
        that.creatHistoryList();
    };

    /**
     * [search 点击搜索按钮处理]
     * @param  {string} urlString 地址,用于区分自营页面搜索记录
     * @return {[type]}     [description]
     */
    NewHouseSearch.prototype.search = function (urlString) {
        var that = this;
        // 获取用户输入内容
        var searchInputVal = that.searchInput.val();
        // 格式化用户输入内容
        var formatVal = that.inputFormat(searchInputVal);
        // 去掉开头和结尾的空格
        var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
        var str = urlString || window.location.href;
        // yangfan add 20160506 变量 ctm 参数字符串;
        var ctm = 'ctm=2.' + vars.paramcity + '.xf_search.search.0';
        if (!b) {
            window.location = that.searchEmptyJump + (/tjftype/.test(str) ? '?tjftype=xf' : '');
            return;
        }
        if (str.indexOf('zttype=pt') === -1 && str.indexOf('zttype=DS') === -1) {
            // 当前地址不含有zttype=pt和zttype=DS时,pt代表普通房源，DS代表电商房源
            // by tankunpeng 2016/08/26
            // 搜索结果不区分直销和全部楼盘 red=hb 代表直销楼盘
            // str = str.replace(/&red=hb|\?red=hb/,'');
            // 2016/11/03 自营搜索直接跳转至新房列表 type=xfzy 和 hf=tab
            str = str.replace(/\?type=xfzy(?:&hf=tab|)$|type=xfzy(?:&hf=tab|)&/, '');
            var exp = '?';
            // 当前地址是否含有关键字
            var hasKey = /keyword=(.+?)&/i.test(str);
            if (hasKey) {
                // 有关键字则直接将关键字替换为当前用户输入的关键字，
                str = str.replace(/keyword=(.+?)&/i, 'keyword=' + b + '&');
                that.setOtherHistory({
                    key: b,
                    showWord: b,
                    suffix: '新房'
                }, str);
                window.location = replaceUrlArg(str, 'ctm', ctm);
                return;
            }
            // 不含有关键字时
            var idx = str.indexOf('keyword=');
            if (idx !== -1) {
                // 含有keyword=内容
                var cr = str.charAt(idx - 1);
                // 当keyword=之前是&时，将连接符修改为&
                if (cr === '&') exp = '&';
                // 获取keyword=之前的所有地址字符串
                str = str.substring(0, idx - 1);
            } else if (str.indexOf('?') !== -1) {
                // 不存在keyword=并且不存在?时，将连接符修改为&
                exp = '&';
            }
            that.setOtherHistory({
                key: b,
                showWord: b,
                suffix: '新房'
            }, str + exp + 'keyword=' + b);
            window.location = replaceUrlArg(str + exp + 'keyword=' + b + '&r=' + Math.random(), 'ctm', ctm);
            return;
        }
        var url = vars.mainSite;
        if (vars.action && $.inArray(vars.action, libXfaction) > -1) {
            url += 'xf.d?m=' + vars.action;
        } else {
            url += 'search.d?m=search';
        }
        url += '&type=0&keyword=' + b + '&city=' + vars.paramcity;

        // 特价房
        if (str.indexOf('tjftype') > -1) {
            var regs2 = new RegExp('tjftype=([^&]*)(&|$)');
            var tjfVal = str.match(regs2);
            url += '&tjftype=' + tjfVal[1];
        }

        that.setOtherHistory({
            key: b,
            showWord: b,
            suffix: '新房'
        }, url);
        window.location = replaceUrlArg(url + '&r=' + Math.random(), 'ctm', ctm);
        that.writeSearchLeaveTimeLog(that.columnType);
    };

    /**
     * yangfan add 20160506 为了不影响其他页面搜索功能，同时为了添加 ctm 序号和模块名称
     * 重写获取历史记录内容方法
     */
    NewHouseSearch.prototype.getHistoryContent = function (arr) {
        var that = this,
            len = arr.length,
            html = '',
            specailHtml = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span>' +
                '<span class="gray-b"> - yy</span>**</a></li>';
        var arrNo = 1;
        for (var i = 0; i < len; i++) {
            if (arr[i]) {
                // 显示用户看到的字段
                var str = specailHtml.replace('xx', arr[i].showWord);
                // 设置显示后缀信息
                if (arr[i].suffix) {
                    str = str.replace('yy', arr[i].suffix);
                } else {
                    str = str.replace(' - yy', '');
                }
                // 设置显示认证
                if (arr[i].certitype) {
                    str = str.replace('**', '<i class="sea-v"></i>');
                } else {
                    str = str.replace('**', '');
                }
                // yangfan add 20160508 给历史记录列表添加 ctm 参数属性
                arr[i].ctmNo = arrNo++;
                arr[i].ctmModule = 'search_his';
                // 存入条件
                str = str.replace('zz', that.setJumpCondition(arr[i]));
                html += str;
            }
        }
        return html;
    };

    /**
     * 点击列表条目搜索
     * @param obj
     */
    NewHouseSearch.prototype.clickListSearch = function (obj) {
        if (!obj) return;
        var that = this;
        var url;

        /**
         * yangfan add 20160506 添加 ctm 参数
         * ctm 参数规则：ctm=a.b.c.d.e
         * a：wap端为2；
         * b：城市缩写；
         * c：页面简称，由需求方指定；
         * d：模块简称，由需求方指定；
         * e：模块内链接按顺序自动获取，1,2,3,…..
         */
        var ctm = 'ctm=2.' + vars.paramcity + '.xf_search.' + obj.ctmModule + '.' + obj.ctmNo || '';

        // 将搜索关键字写入搜索input中
        that.searchInput.val(obj.key);
        if (obj.historyUrl) {
            that.setOtherHistory(obj, obj.historyUrl);
            // yangfan rewrite 20160508 进行 url 参数替换或添加
            window.location = replaceUrlArg(obj.historyUrl, 'ctm', ctm);
            return;
        }
        if (obj.adUrl) {
            that.setOtherHistory(obj, obj.adUrl);
            // 如果点击热词是广告位，则统计后跳转到广告页面
            $.get('/data.d?m=adtj&city=' + encodeURIComponent(encodeURIComponent(vars.paramcity)) + '&url=' + document.URL, function () {
                window.location = replaceUrlArg(obj.adUrl, 'ctm', ctm);
            });
            return;
        }
        if (obj.loupanurl) {
            that.setOtherHistory(obj, obj.loupanurl);
            // 如果点击的列表单项是单个楼盘，则直接跳转到详情页
            window.location = replaceUrlArg(obj.loupanurl, 'ctm', ctm);
            return;
        }
        if (obj.soure === 'xfhxcount') {
            // 如果是可售户型，更改url
            url = vars.mainSite + 'xf.d?m=searchHuXingList&keyword=';
        } else if (obj.soure === 'xfhcount') {
            // 如果是可售房源，更改url
            url = vars.mainSite + 'xf.d?m=getPrivilegeHouseList&keyword=';
        } else if (obj.zhishiTips) {
            url = vars.zhishiSite + 'search/?kw=';
        } else if (vars.action) {
            // 都不是 当含有action属性时，更改url
            url = vars.mainSite + 'xf.d?m=' + vars.action + '&type=0&keyword=';
        } else {
            // 否则按照默认的搜索地址
            url = vars.mainSite + 'search.d?m=search&keyword=';
        }

        // 如果为品牌 keyword 换成 brand
        if (obj.suffix === '品牌') {
            url = url.replace('keyword', 'brand');
        }
        // 插入关键字及城市
        url += obj.key + '&city=' + vars.paramcity;
        if (obj.tags) {
            // 是标签
            url += '&tags=' + obj.tags;
        }
        if (obj.enterprise) {
            // 是品牌
            url += '&enterprise=' + obj.enterprise;
        }
        if (obj.comarea) {
            // 是商圈
            url += '&comarea=' + obj.comarea;
        }
        if (obj.district) {
            // 是区域ƒƒ
            url += '&district=' + obj.district;
        }
        // 地铁线
        if (obj.railway) {
            url += '&railway=' + obj.railway;
        }
        // 地铁站
        if (obj.railwayStation) {
            url += '&railway_station=' + obj.railwayStation;
        }
        // 特价房
        if (obj.tjftype) {
            url += '&tjftype=' + encodeURIComponent(obj.tjftype);
        }
        that.setOtherHistory(obj, url);
        // 跳转搜索地址
        window.location = replaceUrlArg(url + '&r=' + Math.random(), 'ctm', ctm);
        that.writeSearchLeaveTimeLog(that.columnType);
    };

    /**
     * yangfan add 20160508 替换 url 中的指定参数
     * 判断 url 是否有 u 参数，如果有跳转到 u 参数地址并添加 ctm 参数
     * url 目标url
     * arg 需要替换的参数名称 ctm
     * text 替换后的参数的名称和值 ctm=2.xf_search.search.0
     * return url 参数替换后的url
     */
    function replaceUrlArg(pUrl, arg, text) {
        var url = pUrl.trim();
        var pattern = 'u=https?:([^&]*)';
        if (url.match(pattern)) {
            url = location.protocol + url.match(pattern)[1].trim();
        }
        // 由于热搜中 url 在正式站上还没有更新，所以以此兼容正式站
        pattern = '\\\?https?:([^&]*)';
        if (url.match('\\\?https?:([^&]*)')) {
            url = location.protocol + url.match(pattern)[1].trim();
        }
        pattern = arg + '=([^&]*)';
        if (url.match(pattern)) {
            var rex = new RegExp('(' + arg + '=)([^&]*)', 'ig');
            return url.replace(rex, text);
        }

        return url + (/&|\?/.test(url) ? '&' : '?') + text;
    }

    module.exports = NewHouseSearch;
});
