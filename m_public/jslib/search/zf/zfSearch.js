/**
 * 租房搜索主类
 * by blue
 * 20160120 blue 整理代码，设置新的样式，将之前难以理解的函数去掉使用switch的方式呈现自动提示内容，增加大搜索历史记录添加功能。
 */
define('search/zf/zfSearch', ['jquery', 'search/mainSearch'],
    function (require, exports, module) {
        'use strict';
        // jquery索引
        var $ = require('jquery');
        // 公共方法对象索引
        var search = require('search/mainSearch');
        // 页面传入的参数
        var vars = seajs.data.vars;
        function ZfSearch() {
            // 弹窗输入框默认显示内容
            this.titCon = vars.railwayNum ? '请输入小区名、地铁或地名' : '楼盘名/地名/开发商等';
            // 弹窗html字符串
            this.html = '<div class="searchPage">'
                + '<header class="header">'
                + '<div class="left" id="wapzfsy_D01_08"><a href="javascript:void(0);" class="back"><i></i></a></div>'
                + '<div class="cent"><span>租房搜索</span></div>'
                + '</header>'
                + '<form class="search" action="" onsubmit="return false;" method="get" autocomplete="off">'
                + '<div class="searbox">'
                + '<div class="ipt" id="wapzfsy_D01_09">'
                + '<input type="search" name="q" value="" placeholder="' + this.titCon + '" autocomplete="off">'
                + '<a href="javascript:void(0);" class="off" style="display: none;"></a>'
                + '</div>'
                + '<a href="javascript:void(0);" id="wapzfsy_D01_18" class="btn" rel="nofollow"><i></i></a>'
                + '</div>'
                + '</form>'
                + '<div class="searLast" id="wapzfsy_D01_19" style="display: none;"><h3><span class="s-icon-hot"></span>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>'
                + '<div class="searHistory" id="historyList">'
                + '<h3><span class="s-icon-his"></span>搜索历史</h3>'
                + '<div style="margin-bottom: 50px;"><div class="searList" id="wapzfsy_D01_10"><ul></ul></div><div class="clearBtn" id="wapzfsy_D01_32">'
                + '<a href="javascript:void(0);">清除历史记录</a></div></div></div>'
                + '<div id="autoPromptList">'
                + '<div style="margin-bottom: 50px;"><div class="searList" id="wapzfsy_D01_31"><ul></ul></div></div>'
                + '</div>'
                + '</div>';
            // 历史标识，用来存储在localstorge的标识
            this.historyMark = vars.city + 'newZfHistory';
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
            this.columnType = 1;
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
                // 地铁站
                railway: '',
                // 地铁站
                station: ''
            };
        }

        /**
         * 原形链对象继承
         * 这里使用了jquery中的对象复制函数，实际上可以自己写一个遍历search的方法然后赋给HomeSearch原形链到达同样效果
         */
        $.extend(ZfSearch.prototype, search);

        /**
         * 增加热词搜索前端缓存
         */
        ZfSearch.prototype.cacheData = function () {
            var that = this;
            if (vars.sessionStorage) {
                that.zfHotWord = vars.sessionStorage.getItem(vars.purpose_oper + vars.city + 'zfHotWord');
            }
            if (that.zfHotWord) {
                that.hotSearchList.html(that.zfHotWord);
            } else {
                // 调用获取热词数据接口
                $.get(vars.esfSite + '?c=esf&a=ajaxGetHotWords', {
                    city: vars.city,
                    type: that.columnType,
                    purpose_oper: vars.purpose_oper
                }, function (data) {
                    if (data && $.isArray(data)) {
                        var html = '';
                        // 循环遍历数据，构建热词列表a标签html字符串
                        for (var i = 0; i < data.length; i++) {
                            if (data[i]) {
                                var obj = that.getFormatCondition({
                                    key: data[i].Keyword,
                                    purpose: data[i].Purpose,
                                    showWord: data[i].Keyword,
                                    suffix: '出租'
                                });
                                // 如果热词位为广告位
                                var isAD = data[i].ad;
                                if (isAD) {
                                    obj.adUrl = data[i].linkUrl;
                                }
                                // 如果是广告为显示不同的样式显示
                                html += '<a href="javascript:void(0);"'
                                    + (isAD ? ' id="wapxfsy_D01_32"' : '') + '>'
                                    + (isAD ? '<span class="tag-icon">广告</span>' : '')
                                    + '<span class="searchListName" data-ywtype=\'' + that.setJumpCondition(obj)
                                    + '\'>' + data[i].Keyword + '</span></a>';
                            }
                        }
                        if (vars.sessionStorage) {
                            that.zfHotWord = vars.sessionStorage.setItem(vars.purpose_oper + vars.city + 'zfHotWord', html);
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
        ZfSearch.prototype.createAutoPromptList = function (inputValue) {
            var url = vars.esfSite + '?c=esf&a=ajaxGetAllSearchTip';
            var obj = {
                q: inputValue,
                city: vars.city,
                type: this.columnType,
                purpose: vars.purpose
            };
            // 特价房需要加个参数
            var str = location.href;
            if (/tjftype/.test(str)) {
                obj.tjf = str.match(/tjftype=([^&]*)(&|$)/)[1];
            }
            // 聚和搜索需要加个参数
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
        ZfSearch.prototype.getAutoPromptListContent = function (dataArr, inputValue) {
            var that = this;
            var dataArrL = dataArr.length;
            var str = location.href;
            var html = '';
            // 普通显示条数的html字符串
            var liHtmlStr = '<li><a href="javascript:void(0);"><span class="num">约search_num条</span>'
                + '<span class="searchListName" data-ywtype=\'zz\'>xx</span><span class="gray-b"> - yy</span><p>hh</p></a></li>';
            for (var i = 0; i < dataArrL; i++) {
                // 需要组成自动回复一条数据的hmtl字符串
                var liHtml = '';
                var showWord = '';
                var suffix = '';
                // 声明跳转条件对象
                var obj = that.getFormatCondition();
                var singleData = dataArr[i];
                // category 类型（1：楼盘名(缺少新房楼盘名)；2：学校；3：用户词(按照热度排序，不是房源量)；
                // 4：新房可评估楼盘；4：物业类型；6：区县；7：商圈；8：房源标签；
                // 9：租房小产权房；10：新房楼盘名(不能和分类4一起使用)；11：地铁线；12：地铁站）

                // 1：楼盘名；3：用户词；
                // 4：新房可评估楼盘；5：物业类型；
                // 6：区县；7：商圈；8：房源标签；
                // 9：租房小产权房
                switch (singleData.category) {
                    case '1':
                    case '4':
                    case '5':
                    case '9':
                        obj.key = showWord = singleData.projname;
                        suffix = '出租';
                        break;
                    case '3':
                        obj.key = showWord = singleData.projname + '出租';
                        suffix = '房企';
                        break;
                    case '6':
                        obj.key = showWord = singleData.projname;
                        obj.district = singleData.district;
                        suffix = '出租';
                        break;
                    case '7':
                        obj.key = showWord = singleData.projname;
                        obj.comarea = singleData.comarea;
                        obj.district = singleData.district;
                        suffix = '出租';
                        break;
                    case '8':
                        obj.key = showWord = singleData.projname + '出租';
                        suffix = '标签';
                        break;
                    case '11':
                        obj.key = showWord = singleData.projname;
                        obj.subwayId = singleData.word;
                        suffix = '出租';
                        break;
                    case '12':
                        obj.key = showWord = singleData.projname;
                        obj.subwayId = singleData.subwayline;
                        obj.stationId = singleData.word;
                        suffix = '出租';
                        break;
                    case '14':
                        obj.key = showWord = singleData.projname;
                        obj.communityid = singleData.communityid;
                        suffix = '社区-租房';
                        break;
                }
                obj.showWord = showWord;
                obj.suffix = suffix;
                // 用于用户看到的单条楼盘名称
                liHtml = liHtmlStr.replace('xx', showWord.replace(inputValue, '<em>' + inputValue + '</em>'));
                // 判断楼盘条数,为空或者为0时，不显示后缀,小于10时，显示后缀为约数,大于等于10条则显示准确数据
                if (!Number(singleData.countinfo)) {
                    liHtml = liHtml.replace('约search_num条', '');
                } else if (Number(singleData.countinfo) < 10) {
                    liHtml = liHtml.replace('约search_num', singleData.countinfo);
                } else {
                    liHtml = liHtml.replace('search_num', singleData.countinfo);
                }
                // 用于用户看到的单条楼盘前缀，如-房企、-品牌等
                if (suffix) {
                    if ('社区-租房' === suffix) {
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
                // 判断类型
                obj.purpose = vars.purpose;

                // 特价房
                if (singleData.tjftype || /tjftype/.test(str)) {
                    obj.tjftype = singleData.tjftype || str.match(/tjftype=([^&]*)(&|$)/)[1];
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
        ZfSearch.prototype.createHotSearch = function () {
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
        ZfSearch.prototype.showPop = function () {
            var that = this;
            search.showPop.call(that);
            var keywordEl = that.showPopBtn.find('.ipt a');
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
        ZfSearch.prototype.search = function () {
            var that = this;
            // 获取用户输入内容
            var searchInputVal = that.searchInput.val();
            // 格式化用户输入内容
            var formatVal = that.inputFormat(searchInputVal);
            // 去掉开头和结尾的空格
            var b = formatVal.replace(/(^\s+)|(\s+$)/g, '');
            var str = location.href;
            if (!b) {
                window.location = vars.zfSite + vars.city + '/' + (/tjftype/.test(str) ? '?tjftype=zf' : '');
                that.writeSearchLeaveTimeLog(that.columnType);
                return;
            }
            if(searchInputVal === '月付'){
                window.location.href = vars.zfSite + vars.city +'/c200s1/';
                return;
            }
            var url = vars.zfSite + '?c=zf&a=index';
            // 特价房
            if (str.indexOf('tjftype') > -1) {
                var regs2 = new RegExp('tjftype=([^&]*)(&|$)');
                var tjfVal = str.match(regs2);
                url += '&tjftype=' + tjfVal[1];
            }

            if (vars.purpose) {
                url += '&purpose=' + encodeURIComponent(vars.purpose);
            }
            url += '&type=0&keyword=' + encodeURIComponent(b);
            that.setOtherHistory({key: b, showWord: b, suffix: '出租'}, url + '&city=' + vars.city);
            window.location = url + '&city=' + vars.city + '&r=' + Math.random();
            that.writeSearchLeaveTimeLog(that.columnType);
        };

        /**
         * 点击列表条目搜索
         * @param obj
         */
        ZfSearch.prototype.clickListSearch = function (obj) {
            if (!obj)return;
            var that = this;
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
            var url = vars.zfSite + '?keyword=' + encodeURIComponent(obj.key);
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
            if (obj.railway) {
                // 地铁线
                url += '&railway=' + encodeURIComponent(obj.railway);
            }
            if (obj.station) {
                // 地铁站
                url += '&station=' + encodeURIComponent(obj.station);
            }
            // 特价房
            if (obj.tjftype) {
                url += '&tjftype=' + encodeURIComponent(obj.tjftype);
            }
            //社区搜索
            if (obj.communityid) {
                url += '&communityid=' + encodeURIComponent(obj.communityid);
                that.setOtherHistory(obj, url + '&city=' + vars.city + '&r=' + Math.random());
            } else {
                that.setOtherHistory(obj, url + '&city=' + vars.city);
            }
            // 跳转搜索地址
            window.location = url + '&city=' + vars.city + '&r=' + Math.random();
            that.writeSearchLeaveTimeLog(that.columnType);
        };
        module.exports = ZfSearch;
    });