/**
 * 搜索原型类
 * !!!纯模块化不再兼容普通js载入方式
 * by blue
 */
define('search/search', ['jquery'], function (require, exports, module) {
    'use strict';
    // jquery索引
    var $ = require('jquery');
    // 页面传入参数
    var vars = seajs.data.vars;
    // 设置检测是否为无痕模式，无痕模式不开启localStorage
    if (!vars.localStorage) {
        var c = window.localStorage;
        try {
            if (c) {
                c.setItem('testPrivateModel', !1);
            }
        } catch (d) {
            c = null;
        }
        vars.localStorage = c;
    }

    /**
     * 由于页面中参数是通过lib传入程序了，这里做一个兼容，如果存在lib，则遍历的将lib属性和值传给vars
     */
    if (window.lib) {
        for (var p in window.lib) {
            vars[p] = window.lib[p];
        }
    }
    module.exports = {

        /**
         * 初始化函数
         * 获取显示弹窗按钮
         * 给显示弹窗按钮绑定事件
         * 点击弹窗按钮弹出搜索弹窗
         */
        init: function () {
            var that = this;
            that.showPopBtn = $(that.showPopBtn);
            that.showPopBtn.on('click', function (e) {
                // 如果点击目标为地图图标或者今日头条合作页面中点击城市切换则直接跳转
                var el = $(e.target);
                if (!el.hasClass('mapbtn') && !el.hasClass('cityChoo') && !el.parent().hasClass('cityChoo')) {
                    that.hideBody();
                    that.showPop();
                    if (vars.action === 'delegateAndResale') {
                        that.showHotBuilding();
                    }
                }
            });
        },

        /**
         * 设置显示搜索弹窗的按钮ID或者类名,形如#id或者.class
         * @param str
         */
        setShowPopBtn: function (str) {
            this.showPopBtn = str;
        },

        /**
         * 隐藏文档流
         * 用来获取弹窗显示前所有css属性不为display:none的body上的所有节点
         * 将这些节点隐藏
         */
        hideBody: function () {
            var that = this;
            // 如果有动画效果，去除动画效果
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
            var that = this,valArr;
            that.ajaxFlag = 0;
            if (!that.searchPop) {
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
                    if (vars.action === 'delegateAndResale' && !vars.buildNum && $.trim(that.searchInput.val()) !== '') {
                        valArr ={'projname': $.trim(that.searchInput.val())};
                        vars.vue.$emit('setVueValue', valArr);
                        vars.vue.$emit('callMethod', 'setHis', 'projname', $.trim(that.searchInput.val()));
                    }
                    that.back();
                });
                // 获取搜索弹窗上搜索按钮
                that.searchBtn = that.searchPop.find(that.findSearchBtn);
                // 绑定点击事件，执行点击搜索操作
                that.searchBtn.on('click', function () {
                    if (vars.action === 'cfjMap') {
                        if (that.searchInput.val()) {
                            if (that.autoPromptList.find('ul li a').length) {
                               /* if (that.searchInput.val() === that.autoPromptList.find('ul li a').eq(0).find('.searchListName').text()) {
                                    that.autoPromptList.find('ul li a').eq(0).trigger('click');
                                }else {
                                    that.search($(this));
                                }*/
                                that.autoPromptList.find('ul li a').eq(0).trigger('click');
                            }else {
                                that.search($(this));
                            }
                        }else {
                            that.backBtn.trigger('click');
                        }
                    }else {
                        that.search($(this));
                    }
                    
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
                        that.searchBtn.trigger('click');
                    }
                });
                // 获取历史列表容器
                that.historyList = that.searchPop.find(that.findHistoryList);
                // 获取历史记录列表中ul显示列表并绑定点击事件，事件委托方式，执行获取点击的楼盘信息后操作
                that.historyList.find('ul').on('click', 'a', function () {
                    if ($(this).find('.searchListName').attr('data-ywtype')) {
                        var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                    }
                    if (vars.action === 'cfjMap') {
                        var type = $(this).attr('data-type')? $(this).attr('data-type'): '';
                        var cfjid = $(this).attr('data-id')? $(this).attr('data-id'): '';
                        if (!type && !cfjid) {
                            var data = {
                                strKeyword: $(this).find('.searchListName').text()
                            }
                        }else {
                            var data = {
                                strKeyword: $(this).find('.searchListName').text(),
                                type: type,
                                id: cfjid,
                                associate: true
                            }
                        }  
                    }
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
                    if(vars.action === 'xqRecommend'){
                        if(vars.agentType === 'DS'){
                            var $ele = $(this).find('span').eq(0);
                        }else{
                            var $ele = $(this).find('span').eq(2);
                        }
                        var data = {
                            projname: $ele.text(),
                            comarea: $ele.attr('data-comarea'),
                            newcode:$ele.parent('a').attr('newcode')
                        };
                    }else if (vars.action === 'cfjMap') {
                        var $that = $(this);
                        var data = {
                            strKeyword: $that.find('.searchListName').text(),
                            type: $that.attr('data-type'),
                            id: $that.attr('data-id'),
                            associate: true
                        }
                    }else{
                        if ($(this).find('.searchListName').attr('data-ywtype')) {
                            var data = that.getJumpCondition($(this).find('.searchListName').attr('data-ywtype'));
                        }
                        
                    }
                    that.clickListSearch(data);
                });
                // 获取关闭自动提示按钮
                that.closeAutoPromptListBtn = that.searchPop.find(that.findCloseAutoPromptListBtn);
                // 绑定点击事件，执行关闭自动提示列表
                that.closeAutoPromptListBtn.on('click', function () {
                    that.offBtn.hide();
                    that.closeAutoPromptList();
                });
            }
            // @update yueyanlei 之前用append会受统计图片的影响，故改成prepend
            $(document.body).prepend(that.searchPop);
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
            $.fx.off = false;
            this.clearAllList();
            this.searchPop.detach();
            this.body.show();
        },

        /**
         * 清除所有列表
         */
        clearAllList: function () {
            var that = this;
            that.hideHistoryList();
            that.hideAutoPromptList();
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
            } else {
                if (that.offBtn.is(':hidden')) {
                    that.offBtn.show();
                }
                if (that.historyList.is(':visible')) {
                    that.historyList.hide();
                }
                if (that.historyList.is(':visible')) {
                    that.historyList.hide();
                }
                that.createAutoPromptList(inputValue);
            }
        },

        /**
         * 创建历史记录列表
         */
        creatHistoryList: function () {
            var that = this, historyData;
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
                var list = that.autoPromptList.find('ul');
                if (data && $.trim(that.searchInput.val()) !== '') {
                    if(vars.action === 'xqRecommend' || vars.action === 'xqSearchSpecial'){
                        if($.isArray(data.hit)){
                            var dataArr = data.hit;
                        }else{
                            var arr = [];
                            var jsonObj = data.hit;
                            for(var key in jsonObj){
                                arr.push (jsonObj[key]);
                            }
                            var dataArr = arr;
                        }

                    }else{
                        var dataArr = typeof data === 'string' ? JSON.parse(data) : data;
                    }
                    var html, valArr;
                    list.empty();
                    if ($.isArray(dataArr) && dataArr.length > 0) {
                        if (vars.action === 'delegateAndResale') {
                            if (vars.firstlistds) {
                                // 二十八电商城市显示没有对应小区的提示
                                valArr = {'nodata': false};
                                vars.vue.$emit('setVueValue', valArr);
                                //that.nodata = false;
                            } else {
                                // 非28电商城市显示区域商圈的选择框
                                valArr = {'noloupan': false};
                                vars.vue.$emit('setVueValue', valArr);
                                //that.noloupan = false;
                            }
                        }
                        html = that.getAutoPromptListContent(dataArr);
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
                }else if(vars.action === 'xqRecommend' && $.trim(that.searchInput.val()) !== ''){
                    var html = '<li style="text-align: center"><a href="javascript:void(0);"><span class="searchListName" >暂无搜索的楼盘，请尝试搜索其他楼盘</span></a></li>';
                    list.html(html);
                    that.autoPromptList.show();
                }else if(vars.action === 'xqSearchSpecial' && $.trim(that.searchInput.val()) !== ''){
                    var html = '<div class="dpnoresult"><div><img src="'+ vars.imgSrc + '" width="71">'
                        + '<h3>您搜索的小区无结果，请换个小区试试</h3></div></div>';
                    list.html(html);
                    that.autoPromptList.show();
                } else if (vars.action === 'delegateAndResale') {
                    valArr = {'nodata': false, 'noloupan': false, 'refprice': '', 'tipShow': false};
                    vars.vue.$emit('setVueValue', valArr);
                    var html = '<li><a href="javascript:void(0);" ><span class="searchListName">没有找到对应住宅楼盘</span></a></li>';
                    list.html(html);
                    that.autoPromptList.show();
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
            $.get(vars.esfSite + '?c=esf&a=ajaxWriteSearchLeaveTimeLog', {type: type});
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
         * 判断历史记录是否有重复
         */
        judgeHistoryRepeat: function (obj) {
            var that = this;
            var history = vars.localStorage.getItem(that.historyMark);
            if (history) {
                var singleData = that.setJumpCondition(obj);
                var idx = history.indexOf(singleData);
                if (idx !== -1) {
                    if (history.charAt(idx - 1) === ',') {
                        history = history.replace(',' + singleData, '');
                    } else if (history.charAt(singleData.length + 1) === ',') {
                        history = history.replace(singleData + ',', '');
                    } else {
                        history = history.replace(singleData, '');
                    }
                }
            }
            return history;
        }
    };
});