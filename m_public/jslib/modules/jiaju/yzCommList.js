/**
 * @fileOverview 评论页
 * Created by Young on 2016-9-8.
 */
define('modules/jiaju/yzCommList', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.1/loadMore'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 懒加载
    require('lazyload/1.9.1/lazyload');
    // 加载更多
    var loadMore = require('loadMore/1.0.1/loadMore');
    var jiajuUtils = vars.jiajuUtils;

    var yzCommList = {
        init: function () {
            var that = this;
            // 评论类别导航
            that.$commTab = $('.commTab');
            // 评论列表
            that.$diaryList = $('.diaryList');
            that.$commList = $('.commList');
            that.canAjax = true;
            that.commListAjaxUrl = vars.jiajuSite + '?c=jiaju&a=ajaxGetMoreYzComm&CompanyID=' + vars.CompanyID + '&CommentLevel=';
            that.praiseAjaxUrl = vars.jiajuSite + '?c=jiaju&a=ajaxDianZan&CompanyID=' + vars.CompanyID;
            // toast提示
            that.$sendFloat = $('#sendFloat');
            that.$sendText = $('#sendText');
            that.toastMsg = {};
            // 加载状态
            that.status = [];
            that.initStatus();
            that.loadMore();
            that.bindEvent();
        },

        initStatus: function () {
            var that = this;
            that.$commTab.each(function () {
                that.status.push($(this).hasClass('active'));
            });
        },
        loadMore: function () {
            var that = this;
            that.$commTab.each(function (index, tab) {
                var $tab = $(tab);
                var total = $tab.data('total');
                var $list = that.$commList.eq(index);
                total > 10 && loadMore.add({
                    url: that.commListAjaxUrl + index,
                    // 总条数
                    total: total,
                    // 首页加载条数
                    pagesize: 10,
                    // 每页加载条数
                    perPageNum: 10,
                    content: $list.find('.content'),
                    moreBtn: $list.find('.moreList').show(),
                    loadPrompt: $list.find('.loadPrompt'),
                    activeEl: $tab,
                    active: 'active'
                });
            });
            loadMore.init();
        },
        bindEvent: function () {
            var that = this;
            // 惰性加载
            $('.lazyload').lazyload();
            // 数据请求失败时, 点击刷新
            $('#notfound').on('click', function () {
                window.location.reload();
            });
            // tab点击切换
            that.$commTab.on('click', function () {
                if (that.canAjax) {
                    that.canAjax = false;
                    that.activeIndex = $(this).index();
                    that.status[that.activeIndex] ? that.switchTab() : that.loadContent();
                }
            });
            // 点赞
            that.$diaryList.on('click', '.opt', function () {
                if (that.canAjax && that.checkLogin()) {
                    that.canAjax = false;
                    that.activeOpt = this;
                    that.praiseFn();
                }
            });
        },
        // tab 切换事件
        switchTab: function () {
            var that = this;
            that.canAjax = true;
            that.$commTab.eq(that.activeIndex).addClass('active').siblings().removeClass('active');
            that.$commList.eq(that.activeIndex).show().siblings().hide();
        },
        // 首次加载数据
        loadContent: function () {
            var that = this;
            var activeIndex = that.activeIndex;
            var $tab = that.$commTab.eq(activeIndex);
            $tab.data('total') ? $.ajax({
                url: that.commListAjaxUrl + activeIndex + '&page=1',
                success: function (data) {
                    if (data) {
                        var $data = $(data);
                        $data.find('.lazyload').lazyload();
                        that.$commList.eq(activeIndex).find('.content').append($data);
                        that.status[activeIndex] = true;
                        that.switchTab();
                    } else {
                        that.canAjax = true;
                        that.toast('网络开小差了，再试一次吧');
                    }
                },
                error: function () {
                    that.canAjax = true;
                    that.toast('网络开小差了，再试一次吧');
                }
            }) : that.switchTab();
        },
        // 检查是否登录，未登陆跳转登录页
        checkLogin: function () {
            var res = true;
            if (!vars.mobile) {
                res = false;
                window.location.href = '//m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(window.location.href);
            }
            return res;
        },
        // 点赞
        praiseFn: function () {
            var that = this;
            var $activeShc = $(that.activeOpt).find('.shc');
            // 评论id
            var commentID = $activeShc.data('id');
            // 点赞数
            var num = $activeShc.data('num');
            // 1：点赞，2取消赞
            var operateType = $activeShc.hasClass('cur') + 1;
            $.ajax({
                url: that.praiseAjaxUrl + '&CommentID=' + commentID + '&OperateType=' + operateType,
                success: function (data) {
                    if (+data.issuccess) {
                        // 不同列表有两个相同评论，分别更新
                        var $opts = that.$diaryList.find('.' + commentID);
                        var $add = $opts.find('.add');
                        var $num = $opts.find('.num');
                        var newNum = num + (operateType === 1 ? 1 : -1);
                        // 更新赞数
                        $num.text(newNum);
                        $opts.data('num', newNum).toggleClass('cur');
                        // 点赞显示点赞效果
                        operateType === 1 && $add.show().on('webkitAnimationEnd animationend', function () {
                            $add.hide();
                        });
                        that.toast(operateType === 1 ? '点赞成功' : '取消点赞成功');
                    } else {
                        that.toast('网络开小差了，再试一次吧');
                    }
                },
                error: function () {
                    that.toast('网络开小差了，再试一次吧');
                },
                complete: function () {
                    that.canAjax = true;
                }
            });
        },
        toast: function (msgType) {
            var that = this;
            that.$sendText.text(that.toastMsg[msgType] || msgType);
            that.$sendFloat.show();
            jiajuUtils.toggleTouchmove(1);
            that.toastTime && clearTimeout(that.toastTime);
            that.toastTime = setTimeout(function () {
                that.$sendFloat.hide();
                jiajuUtils.toggleTouchmove();
            }, 2000);
        }
    };
    module.exports = yzCommList;
});