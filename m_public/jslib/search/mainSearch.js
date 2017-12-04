/**
 * 搜索原型类
 * !!!纯模块化不再兼容普通js载入方式
 * by blue
 * 20160119 增加储存频道地址功能并且增加历史记录功能
 * by tankunpeng 20160921 增加热词前端缓存 减少请求提升响应速度
 */
define('search/mainSearch', ['jquery', 'iscroll/2.0.0/iscroll'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 获取滚动插件，首页新需求中如果有历史记录则热词要变成一行滚动
    var iscorll = require('iscroll/2.0.0/iscroll');
    // 页面传入参数
    var vars = seajs.data.vars;
    // 设置检测是否为无痕模式，无痕模式不开启localStorage,sessionStorage
    if (!vars.localStorage || !vars.sessionStorage) {
        var local = window.localStorage,
            session = window.sessionStorage;
        try {
            if (local) {
                local.setItem('testPrivateModel', !1);
            }
        } catch (d) {
            local = null;
            session = null;
        }
        vars.localStorage = local;
        vars.sessionStorage = session;
    }

    /**
     * 由于页面中参数是通过lib传入程序了，这里做一个兼容，如果存在lib，则遍历的将lib属性和值传给vars
     */
    if (window.lib) {
        for (var p in window.lib) {
            if (window.lib.hasOwnProperty(p)) {
                vars[p] = window.lib[p];
            }
        }
    }

    /**
     * 格式化后缀，由于大搜索内容要和各个频道的后缀做比较去重，并且各频道后缀名不能统一，所以增加一个过滤函数
     * @param str
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

    module.exports = {
        // 历史记录的规范格式
        historyObj: {
            // 关键词
            key: '',
            // 显示内容
            showWord: '',
            // 后缀
            suffix: '',
            // 居室
            room: '',
            // v字显示
            certitype: '',
            // 筛选
            filter: '',
            // 筛选类型
            filterType: '',
            // 跳转地址
            historyUrl: '',
            // 存储的时间戳
            timestamp: ''
        },

        /**
         * 初始化函数
         * 获取显示弹窗按钮
         * 给显示弹窗按钮绑定事件
         * 点击弹窗按钮弹出搜索弹窗
         */
        init: function () {
            var that = this;
            // 获取显示搜索弹窗按钮
            that.showPopBtn = $(that.showPopBtn);
            // 点击操作
            that.showPopBtn.on('click', function (e) {
                // 如果点击目标为地图图标或者今日头条合作页面中点击城市切换则直接跳转
                var el = $(e.target);
                // !!!当显示弹窗按钮包含了地图按钮或者点击选择城市按钮时不引起搜索弹窗
                if (!el.hasClass('mapbtn') && !el.hasClass('cityChoo') && !el.parent().hasClass('cityChoo')) {
                    that.hideBody();
                    that.showPop();
                }
            });
            var lh = location.href;
            // 初始化弹窗
            var UA = window.navigator.userAgent.toLocaleLowerCase();
            if (/miuiyellowpage/i.test(UA)) {
                that.html = that.html.replace(/<header.*<\/header>/g, '');
            }
            that.searchPop = $(that.html);
            // 获取返回按钮
            that.backBtn = that.searchPop.find(that.findBackBtn);
            // 绑定点击事件，执行清空所有列表、隐藏搜索弹窗、显示之前页面操作
            that.backBtn.on('click', function () {
                that.back();
            });
            // 获取搜索弹窗上搜索按钮
            that.searchBtn = that.searchPop.find(that.findSearchBtn);
            // 绑定点击事件，执行点击搜索操作
            that.searchBtn.on('click', function () {
                that.search();
            });
            // 获取清空搜索框操作
            that.offBtn = that.searchPop.find(that.findOffBtn);
            // 绑定点击事件，执行关闭自动提示列表
            that.offBtn.on('click', function () {
                that.offBtn.hide();
                that.closeAutoPromptList();
            });
            // 获取搜索框input
            that.searchInput = that.searchPop.find(that.findSearchInput);
            // 绑定input事件，执行自动提示操作
            that.searchInput.on('input', function () {
                that.inputChange();
            });
            // 绑定keyup事件，执行当手机端点击了键盘上的搜索按钮时操作
            that.searchInput.on('keyup', function (e) {
                // 判断为手机端点击搜索按钮
                if (e.keyCode === 13) {
                    that.search();
                }
            });
            // 获取热词容器
            that.hotSearchList = that.searchPop.find(that.findHotSearchList);
            // 获取热词列表中ul显示列表并绑定点击事件，事件委托方式，执行获取点击的楼盘信息后操作
            that.hotSearchList.on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
            // 刷新热搜词列表
            that.hotSearchRefreshBtn = that.searchPop.find(that.hotSearchRefresh);
            that.hotSearchRefreshBtn.on('click', function () {
                that.refressScroll();
            });
            // 获取历史列表容器
            that.historyList = that.searchPop.find(that.findHistoryList);
            // 获取历史记录列表中ul显示列表并绑定点击事件，事件委托方式，执行获取点击的楼盘信息后操作
            that.historyList.find('ul').on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
            // 获取删除历史记录按钮
            that.deleteHistoryListBtn = that.searchPop.find(that.findDeleteHistoryListBtn);
            // 绑定点击事件，执行删除历史记录及历史记录列表操作
            that.deleteHistoryListBtn.on('click', function () {
                that.deleteHistoryList();
            });
            // 获取自动提示列表容器
            that.autoPromptList = that.searchPop.find(that.findAutoPromptList);
            // 获取自动提示列表中ul显示列表并绑定点击事件，事件委托方式，执行获取点击的楼盘信息后操作
            that.autoPromptList.find('ul').on('click', 'a', function () {
                var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                that.clickListSearch(data);
            });
            // 获取关闭自动提示按钮
            that.closeAutoPromptListBtn = that.searchPop.find(that.findCloseAutoPromptListBtn);
            // 绑定点击事件，执行关闭自动提示列表
            that.closeAutoPromptListBtn.on('click', function () {
                that.offBtn.hide();
                that.closeAutoPromptList();
            });
            // @update yueyanlei 之前用append会受统计图片的影响，故改成prepend
            // @update tankunpeng 修改为进入页面初始化的时候生成页面结构,点击控制显示隐藏
            that.searchPop.hide();
            $(document.body).prepend(that.searchPop);
            that.cacheData && that.cacheData();
            if (/cps=coop/.test(lh)||/cps=baidumip/.test(lh) || /cps=xmzhida/.test(lh)) {
           	 that.hideBody();
                that.showPop();
           }
	        if(/cps=xmzhida/.test(lh)){
	        	$('.back').hide();
	        }
        },

        /**
         * 设置显示搜索弹窗的按钮ID或者类名,形如#id或者.class
         * @param str
         */
        setShowPopBtn: function (str) {
            this.showPopBtn = str;
        },

        /**
         * 获取猜你喜欢和还浏览了规则
         */
        getRules: function (historyMark) {
            var that = this,
                historyData, obj = {};
            if (vars.localStorage) {
                historyData = vars.localStorage.getItem(historyMark);
                if (historyData) {
                    historyData = that.getJumpCondition(historyData);
                }
            }
            if ($.isArray(historyData) && historyData.length > 0) {
                var firstData = historyData[0];
                var key = '',
                    type = '';
                // 判断是不是快筛
                if (firstData.filter) {
                    // 判断该快筛是不是和关键同时存在
                    if (firstData.filterType) {
                        // 如果只有快筛存在，不存在和关键字重复的情况，获取快筛第一条
                        key = firstData.key.split(' ')[0];
                        // 设置快筛类型
                        type = firstData.filterType;
                    } else {
                        // 如果快筛和关键字同时存在，则直接获取下一条历史记录内容
                        firstData = historyData[1];
                        key = firstData.key;
                    }
                } else {
                    key = firstData.key;
                }
                // 设置需要传入后台的对象
                obj.type = type;
                // 新房需要转码两次
                obj.key = encodeURIComponent(encodeURIComponent(key));
                obj.timestamp = firstData.timestamp;
            }
            return obj;
        },

        /**
         * 设置快筛
         * @param key
         * @param url
         * @param filterType 快筛类型
         */
        setFilterHistory: function (key, url, filterType) {
            this.setHistory({
                key: key,
                showWord: key,
                filter: this.historyMark,
                filterType: filterType
            }, url, this.historyMark);
            // 设置大搜索快筛
            this.setHistory({
                key: key,
                showWord: key,
                filter: this.historyMark,
                filterType: filterType
            }, url, (vars.city || vars.paramcity) + 'newHomeHistory');
        },

        /**
         * 设置二手房租房新房频道的历史记录
         * @param obj
         * @param url
         */
        setOtherHistory: function (obj, url) {
            this.setHistory(obj, url, this.historyMark);
            this.setHistory(obj, url, (vars.city || vars.paramcity) + 'newHomeHistory');
        },

        /**
         * 隐藏文档流
         * 用来获取弹窗显示前所有css属性不为display:none的body上的所有节点
         * 将这些节点隐藏
         */
        hideBody: function () {
            var that = this;
            $.fx.off = true;
            if (that.body) {
                that.body.hide();
            } else {
                that.body = $(document.body).children().filter(function () {
                    var $this = $(this);
                    return $this.css('display') !== 'none';
                });
                that.body.hide();
            }
        },

        /**
         * 显示弹窗
         * 判断是否为小米黄页，是的话隐藏header，操作为直接替换掉header
         * 将弹窗jquery对象加载到文档流
         * 获取后退按钮、搜索按钮、删除输入内容按钮、搜索框input、历史记录列表容器，
         */
        showPop: function () {
            var that = this;
            that.ajaxFlag = 0;

            that.searchPop.show();
            // 显示弹窗时，如果自动提示列表是显示的则执行隐藏操作
            if (that.autoPromptList.is(':visible')) {
                that.autoPromptList.hide();
            }
            that.searchInput.focus();
        },

        /**
         * 点击返回按钮操作
         */
        back: function () {
        	var lh = location.href;
        	 if (/cps=coop/.test(lh)||/cps=baidumip/.test(lh) || /cps=xmzhida/.test(lh)) {
        		 history.back(-1);
        	 }else{
        	$.fx.off = false;
            // this.clearAllList();
            this.searchPop.hide();
            this.body.show();
        	 }
        },

        /**
         * 设置滑动操作
         */
        setScroll: function () {
            var that = this;
            // 通过获取热词中的a标签节点数组算出组成一行需要的宽度
            var aArr = that.hotSearchList.find('a'),
                l = aArr.length,
                leng = 0;
            for (var i = 0; i < l; i++) {
                var el = aArr.eq(i);
                leng += el.outerWidth(true);
            }
            // 这里加1是因为这样获取有小数的情况，导致有可能显示两排的bug
            that.hotSearchList.find('#scroller').width(leng + 1);
            if (!that.scroll) {
                that.scroll = new iscorll(that.hotSearchList[0], {
                    bindToWrapper: true,
                    scrollY: false,
                    scrollX: true,
                    click: true
                });
            }
            that.scroll.refresh();
            that.scroll.scrollTo(0, 0);
        },

        /**
         * 设置新版滑动操作
         */
        setRefreshScroll: function (rows) {
            var that = this;
            // 设置纵向显示行数 默认显示三行
            rows = rows || 3;
            var scroller = that.hotSearchList.find('#scroller');
            var a0 = scroller.find('a');
            var a0H = a0.outerHeight() + parseInt(a0.css('marginBottom')) + parseInt(a0.css('marginTop'));
            that.hotSearchList.height(a0H * rows);
            if (!that.scroll) {
                that.scroll = new iscorll(that.hotSearchList[0], {
                    bindToWrapper: true,
                    scrollY: true,
                    scrollX: false,
                    snap: true,
                    click: true
                });
            }
            if (that.scroll.pages[0].length <= 1) {
                that.hotSearchRefreshBtn.hide();
            }
            that.scroll.refresh();
            that.scroll.scrollTo(0, 0);
            window.scroll = that.scroll;
        },

        /**
         * 热搜词刷新按钮
         */
        refressScroll: function () {
            var that = this;
            if (that.scroll) {
                var len = that.scroll.pages[0].length;
                var currentPage = that.scroll.currentPage.pageY;
                currentPage++;
                that.scroll.goToPage(0, currentPage % len, 500);
            }
        },

        /**
         * 清除所有列表
         */
        clearAllList: function () {
            var that = this;
            that.hideHistoryList();
            that.hideAutoPromptList();
            that.clearHotSearch();
        },

        /**
         * 清除热词
         */
        clearHotSearch: function () {
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
        },

        /**
         * input变化，即输入自动提示
         */
        inputChange: function () {
            var that = this;
            var inputValue = that.searchInput.val();
            if ($.trim(inputValue) === '') {
                if (that.offBtn.is(':visible')) {
                    that.offBtn.hide();
                }
                that.closeAutoPromptList();
            } else {
                if (that.offBtn.is(':hidden')) {
                    that.offBtn.show();
                }
                if (that.historyList.is(':visible')) {
                    that.historyList.hide();
                }
                if (that.hotSearchList.parent().is(':visible')) {
                    that.hotSearchList.parent().hide();
                }
                that.createAutoPromptList(inputValue);
            }
        },

        /**
         * 创建历史记录列表
         */
        creatHistoryList: function () {
            var that = this,
                historyData;
            if (vars.localStorage) {
                historyData = vars.localStorage.getItem(that.historyMark);
                if (historyData) {
                    historyData = that.getJumpCondition(historyData);
                }
            }
            var html;
            if ($.isArray(historyData) && historyData.length > 0) {
                html = that.getHistoryContent(historyData);
                if (html) {
                    that.historyList.find('ul').html(html);
                    if (that.historyList.is(':hidden')) {
                        that.historyList.show();
                    }
                }
            } else {
                that.hideHistoryList();
            }
        },

        /**
         * 创建自动提示列表
         * @param inputValue 用户输入框输入的内容
         * @param url 自动提示后台地址
         * @param obj 传入后台的参数内容
         */
        createAutoPromptList: function (inputValue, url, obj) {
            var that = this;
            // 如果再次调用时前一个ajax在执行，kill掉
            if (that.ajaxFlag) {
                that.ajaxFlag.abort();
                that.ajaxFlag = 0;
            }
            that.ajaxFlag = $.get(url, obj, function (data) {
                that.ajaxFlag = 0;
                if (data && $.trim(that.searchInput.val()) !== '') {
                    var list = that.autoPromptList.find('ul');
                    var dataArr = typeof data === 'string' ? JSON.parse(data) : data;
                    var html;
                    list.empty();
                    if ($.isArray(dataArr) && dataArr.length > 0) {
                        html = that.getAutoPromptListContent(dataArr,inputValue);
                        if (html) {
                            list.html(html);
                            if (that.autoPromptList.is(':hidden')) {
                                that.autoPromptList.show();
                            }
                        } else {
                            that.hideAutoPromptList();
                        }
                    } else {
                        that.hideAutoPromptList();
                    }
                }
            });
        },

        /**
         * 获取格式化条件
         * @returns {{}}
         */
        getFormatCondition: function (obj) {
            var that = this,
                a = {};
            for (var op in that.standardObj) {
                a[op] = '';
                if (obj && obj[op]) {
                    a[op] = obj[op];
                }
            }
            return a;
        },

        /**
         * 设置跳转条件
         * 这里可能需要存在格式化验证
         * @param obj
         */
        setJumpCondition: function (obj) {
            return JSON.stringify(obj);
        },

        /**
         * 获取跳转条件
         * 这里可能需要存在格式化验证
         * @param str
         */
        getJumpCondition: function (str) {
            return JSON.parse(str);
        },

        /**
         * 删除历史记录及关闭历史记录列表
         */
        deleteHistoryList: function () {
            var that = this;
            vars.localStorage && vars.localStorage.removeItem(that.historyMark);
            that.hideHistoryList();
            that.createHotSearch();
        },

        /**
         * 隐藏历史记录
         */
        hideHistoryList: function () {
            var that = this;
            if (that.historyList.is(':visible')) {
                that.historyList.find('ul').empty();
                that.historyList.hide();
            }
        },

        /**
         * 关闭自动提示列表
         */
        closeAutoPromptList: function () {
            this.searchInput.val('');
            this.hideAutoPromptList();
            this.createHotSearch();
            this.creatHistoryList();
        },

        /**
         * 隐藏自动提示
         */
        hideAutoPromptList: function () {
            var that = this;
            if (that.autoPromptList.is(':visible')) {
                that.autoPromptList.find('ul').empty();
                that.autoPromptList.hide();
            }
        },

        /**
         * 判断是否有历史记录
         * @returns {Storage|*|null}
         */
        hasHistory: function () {
            return vars.localStorage && vars.localStorage.getItem(this.historyMark);
        },

        /**
         * 格式化用户输入
         * 一切用户输入都不可信，屏蔽掉script代码
         * @param str
         * @returns {void|XML|string|*}
         */
        inputFormat: function (str) {
            return str.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g, '');
        },

        /**
         * 记录用户离开搜索页面的时间
         * 离开动作包括，①直接点击搜索按钮到列表页，②点击历史记录到列表页，③点击自动
         * 提示到列表页，④点击最近热搜到列表页
         * @param type 租房1 二手房2 新房3 大搜索4
         */
        writeSearchLeaveTimeLog: function (type) {
            $.get(vars.esfSite + '?c=esf&a=ajaxWriteSearchLeaveTimeLog', {
                type: type
            });
        },

        /**
         * 记录用户进入搜索页面的日志（searchuv类型）
         * @param city 城市简拼
         * @param type [频道类型] 1：租房 2：二手房  3：新房  4/空 首页
         */
        writeSearchEnterTimeLog: function (city, type) {
            $.get(vars.esfSite + '?c=esf&a=writeEnterOfSearchuv', {
                city: city,
                type: type
            });
        },

        /**
         * 获取格式化后的历史记录
         * @param obj
         */
        getformatHistory: function (obj) {
            var o = {};
            for (var key in this.historyObj) {
                if (this.historyObj.hasOwnProperty(key)) {
                    o[key] = obj[key] || '';
                }
            }
            o.timestamp = new Date().getTime().toString();
            return o;
        },

        /**
         * 判断历史记录信息是否一致
         */
        compareHistory: function (a, b) {
            return a.showWord === b.showWord && getSuffix(a.suffix) === getSuffix(b.suffix) || (a.filter && b.filter && a.filter === b.filter);
        },

        /**
         * 设置历史记录
         * @param obj 历史记录数据
         * @param url 历史记录要跳转的地址
         * @param historyMark 历史记录的标识
         * @returns {*}
         */
        setHistory: function (obj, url, historyMark) {
            var that = this;
            if (!vars.localStorage) return;
            var ob = that.getformatHistory(obj);
            ob.historyUrl = url;
            var history = vars.localStorage.getItem(historyMark);
            if (history) {
                history = that.getJumpCondition(history);
                var l = history.length;
                for (var i = l - 1; i >= 0; i--) {
                    var singleData = history[i];
                    if (that.compareHistory(ob, singleData)) {
                        history.splice(i, 1);
                    }
                }
            } else {
                history = [];
            }
            history.unshift(ob);
            if (history.length > that.HISTORY_NUMBER) {
                history.pop();
            }
            vars.localStorage.setItem(historyMark, that.setJumpCondition(history));
        },

        /**
         * 获取历史记录内容
         */
        getHistoryContent: function (arr) {
            var that = this,
                len = arr.length,
                html = '',
                specailHtml = '<li><a href="javascript:void(0);"><span class="searchListName" data-ywtype=\'zz\'>xx</span>' +
                    '<span class="gray-b"> - yy</span>**</a></li>';
            for (var i = 0; i < len; i++) {
                if (arr[i]) {
                    // 显示用户看到的字段
                    var str = specailHtml.replace('xx', arr[i].showWord);
                    // 设置显示后缀信息
                    if (arr[i].suffix) {
                        str = str.replace('yy', getSuffix(arr[i].suffix));
                    } else {
                        str = str.replace(' - yy', '');
                    }
                    // 设置显示认证
                    if (arr[i].certitype) {
                        str = str.replace('**', '<i class="sea-v"></i>');
                    } else {
                        str = str.replace('**', '');
                    }
                    // 存入条件
                    str = str.replace('zz', that.setJumpCondition(arr[i]));
                    html += str;
                }
            }
            return html;
        }
    };
});
