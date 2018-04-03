/**
 * 新版本加载更多操作，增加可以多个加载更多并存的情况，不再兼容非seajs模块化形式
 * by blue
 */
define('loadMore/1.0.1/loadMore', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 加载jquery惰性加载插件
    require('lazyload/1.9.1/lazyload');
    // 获取浏览器UA
    var UA = navigator.userAgent.toLowerCase();
    // 判断是否为iPhone系统
    var isApple = UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1;
    // window实例
    var $win = $(window);
    // document实例
    var $doc = $(document);
    // ！！！浏览器高度兼容性处理
    var browserHeader = 0;
    if (isApple) {
        // 是iPhone的话浏览器多高出了68像素
        browserHeader = 68;
    } else if (/ucbrowser/i.test(UA)) {
        // 不是苹果手机并且是uc浏览器的话，浏览器多高出了50像素
        browserHeader = 50;
    }

    /**
     * 加载类
     * @param obj
     * @constructor
     */
    function SingleMore(obj) {
        // 过滤配置
        var ob = this.formatObj(obj);
        // 如果返回一个字符串说明有一些必须传入的参数没有传入
        if (typeof ob === 'string') {
            console.error(ob);
            return;
        }
        // 循环过滤后的配置赋值私有成员
        for (var k in ob) {
            if (ob.hasOwnProperty(k)) {
                this[k] = ob[k];
            }
        }
        this.init();
    }

    /**
     * 初始化绑定加载更多按钮
     */
    SingleMore.prototype.init = function () {
        var that = this;
        if (that.moreBtn) {
            that.moreBtn.on('click', function () {
                if (that.judgeLoad()) {
                    that.loadMore();
                }
            });
        }
    };

    /**
     * 过滤配置
     */
    SingleMore.prototype.formatObj = function (obj) {
        var ob = {};
        // 获取加载更多接口地址
        if (obj.url && $.trim(obj.url)) {
            ob.url = obj.url;
        } else {
            return '请写入配置url键值对（加载更多接口地址）,url不能为空字符串且为必须传入的值';
        }
        // 获取每页加载数据条数
        var perPageNum = parseInt(obj.perPageNum) || 10;
        // 获取加载更多接口后台页码键名
        ob.pageName = obj.pageName || 'page';
        if (obj.transfer) {
            ob.transfer = obj.transfer;
        } else {
            ob.transfer = {};
        }
        // 获取总页数和当前页数
        if (obj.pagesize && obj.total) {
            ob.totalPage = Math.ceil(parseInt(obj.total) / perPageNum);
            ob.transfer[ob.pageName] = Math.ceil(parseInt(obj.pagesize) / perPageNum) + 1;
        } else {
            return '请写入配置pagesize键值对(首屏加载数据条数)和total键值对(总数据条数)';
        }
        // 多个加载更多切换条件
        if (obj.activeEl && obj.active) {
            ob.activeEl = typeof obj.activeEl === 'string' ? $(obj.activeEl) : obj.activeEl;
            ob.active = obj.active;
        }
        // 第一次触发底部是否需要加载更多
        ob.firstDragFlag = Boolean(obj.firstDragFlag);
        // 初始化加载更多标识
        ob.loadFlag = true;
        // 设置提示文案实例
        if (obj.loadPrompt) {
            ob.loadPrompt = typeof obj.loadPrompt === 'string' ? $(obj.loadPrompt) : obj.loadPrompt;
        }
        // 设置加载更多动画类
        if (obj.loadingCls) {
            ob.loadingCls = obj.loadingCls;
        }
        // 设置加载更多容器
        if (obj.content) {
            ob.content = typeof obj.content === 'string' ? $(obj.content) : obj.content;
        } else {
            return '请写入配置loadPrompt键值对(加载更多提示文案容器)';
        }
        // 设置惰性加载标识
        ob.lazyMark = obj.lazyMark || 'img';
        // 设置更多按钮实例
        if (obj.moreBtn) {
            ob.moreBtn = typeof obj.moreBtn === 'string' ? $(obj.moreBtn) : obj.moreBtn;
        }
        // 加载中显示文案
        ob.loadingTxt = obj.loadingTxt || '正在加载请稍后';
        // 加载完成后显示内容
        ob.loadedTxt = obj.loadedTxt || '加载更多';
        // ！！！分页标识，这里的操作因为找不到是谁写的了，猜测如下：
        // ！！！首先列表页加载不是1页的内容,有可能一次显示了46条，那么下一页也就是加载更多就要从第6页开始加载
        var pageMarloadFlag = Math.ceil(parseInt(obj.pagesize) / perPageNum) + 1;
        if(obj.callback) {
            ob.callback = obj.callback;
        }
        return ob;
    };

    /**
     * 判断是否应该加载更多
     * @returns {boolean}
     */
    SingleMore.prototype.judgeLoad = function () {
        var that = this;
        // 当存在多个加载更多操作时，以activeEl为标识，当改jquery对象存在传入active类名时执行加载更多
        if (that.activeEl && that.active && !that.activeEl.hasClass(that.active)) {
            return false;
        }
        // 当设置第一次下拉不加载更多时，第一次加载更多操作不进行
        if (that.firstDragFlag) {
            that.firstDragFlag = false;
            return false;
        }
        // 当后台没有返回时不加载更多
        if (!that.loadFlag) {
            return false;
        }
        // 可以加载更多返回真
        return true;
    };

    /**
     * 加载更多
     */
    SingleMore.prototype.loadMore = function () {
        var that = this;
        // 设置调用后台标识为开始调用
        that.loadFlag = false;
        if (that.loadPrompt && that.loadPrompt.length > 0) {
            // 加载提示信息jquery对象赋值加载中文案
            that.loadPrompt.html(that.loadingTxt);
            // 如果加载有其他效果，如加载圈转动等类名，设置loadingCls
            if (that.loadingCls) {
                that.loadPrompt.addClass(that.loadingCls);
            }
        }
        // 调用加载更多接口，transfer为接口所需参数，注意这里可以通过传入pageName来设置页数的键名
        $.get(that.url + '&r=' + Math.random(), that.transfer, function (data) {
            if (data) {
                // 将获取到的html字符串转换为jquery对象
                var $data = $(data);
                // 添加到加载更多容器实例中
                that.content.append($data);
                // 当存在需要惰性加载的标识时，执行惰性加载
                if (that.lazyMark) {
                    $data.find(that.lazyMark).lazyload();
                }
                if (that.loadPrompt && that.loadPrompt.length > 0) {
                    // 设置加载完成显示文案
                    that.loadPrompt.html(that.loadedTxt);
                    // 存在加载过程动画时，删除加载过程动画
                    if (that.loadingCls) {
                        that.loadPrompt.removeClass(that.loadingCls);
                    }
                }
                // 页码加一
                that.transfer[that.pageName]++;
                // 设置调用后台标识结束，可以再次发起加载更多请求
                that.loadFlag = true;
                // 判断当前页码是否大于等于最大页码数
                // @update yueyanlei 去掉了等号
                if (that.transfer[that.pageName] > that.totalPage) {
                    // 隐藏提示文案实例
                    that.loadPrompt.hide();
                    // 如果存在加载更多按钮并且为显示状态，则隐藏加载更多
                    if (that.moreBtn && that.moreBtn.is(':visible')) {
                        that.moreBtn.hide();
                    }
                    // 不允许再次请求加载更多
                    that.loadFlag = false;
                }
                // 当前页数
                $data.pageMarloadFlag = that.transfer[that.pageName] - 1;
                // 总页数
                $data.totalPage = that.totalPage;
                // 有可能在加载更多后有特殊操作的情况，执行回调函数
                that.callback && that.callback($data);
            } else {
                that.loadError();
            }
        });
    };

    /**
     * 加载接口数据异常处理
     */
    SingleMore.prototype.loadError = function () {
        var that = this;
        // 设置调用后台接口结束，可再次发起请求
        that.loadFlag = true;
        // 加载失败提示
        that.loadPrompt.html(that.errorTxt);
        if (that.loadingCls) {
            that.loadPrompt.removeClass(that.loadingCls);
        }
    };

    /**
     * 加载更多主类
     * @constructor
     */
    function LoadMore() {
        this.config = [];
    }

    /**
     * 初始化函数
     */
    LoadMore.prototype.init = function () {
        var that = this;
        // 绑定滚动事件，监听是否到达底部，执行加载更多操作
        $win.on('scroll.loadMore', function () {
            // 滚动条距离加上窗口高度大于等于文档流高度减去特殊浏览器需要高度
            if ($win.scrollTop() + $win.height() >= $doc.height() - browserHeader) {
                that.run();
            }
        });
    };

    /**
     * 执行加载更多
     */
    LoadMore.prototype.run = function () {
        var that = this;
        var l = that.config.length;
        var i = 0;
        // 循环所有加载类，根据是否加载结果执行加载更多操作
        for (; i < l; i++) {
            var singleLoadCls = that.config[i];
            if (singleLoadCls.judgeLoad()) {
                singleLoadCls.loadMore();
            }
        }
    };

    /**
     * 添加一个新的配置
     * @param obj
     * { // 加载更多接口地址
        url:'',
        // 每页加载数据条数，10默认
        perPageNum:10,
        // 加载更多接口后台页码键名,page默认
        pageName:'page',
        // 加载更多接口需要传入的参数对象
        transfer:{},
        // 总数据条数
        total:100,
        // 当前页加载数据条数
        pagesize:46,
        // 当前加载更多执行所需的元素实例
        activeEl:'',
        // 根据当前加载更多所需元素实例是否存在该类名决定是否启动加载更多操作
        active:'',
        // 第一次触发底部是否需要加载更多
        firstDragFlag:false,
        // 提示文案类名或id或者jquery对象
        loadPrompt：，
        // 加载更多动画类名，这里是加载提示文案实例上的
        loadingCls:'',
        // 加载更多容器的类名或者id或者jquery对象
        content:,
        // 惰性加载标识,img为默认
        lazyMark :'img',
        // 加载更多按钮的类名或者id或者jquery对象
        moreBtn:,
        // 加载中显示文案,'正在加载请稍后'为默认
        loadingTxt:'正在加载请稍后';
        // 加载完成后显示内容,'加载更多'为默认
        loadedTxt:'加载更多';
     * }
     */
    LoadMore.prototype.add = function (obj) {
        // 将该配置实例化加载类并插入到配置数组中
        this.config.push(new SingleMore(obj));
    };
    module.exports = new LoadMore();
});