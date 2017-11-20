/**
 * @file 爆款聚合页
 * create by young 2016-9-30
 */
define('modules/jiaju/vipChannel', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'iscroll/2.0.0/iscroll-lite', 'util/util'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var jiajuUtils = vars.jiajuUtils;
        var IScroll = require('iscroll/2.0.0/iscroll-lite');

        var lazy = require('lazyload/1.9.1/lazyload');
        var util = require('util');
        lazy('.lazyload').lazyload();

        // 数据请求失败时, 点击刷新
        $('#notfound').on('click', function () {
            window.location.reload();
        });
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            // 接口地址
            url: vars.jiajuSite + '?c=jiaju&a=ajaxGetVipChannel&city=' + vars.city + '&platformid=' + vars.platformid + '&sourceid=' + vars.sourceid + '&positionid=' + vars.positionid + '&activityid=' + vars.activityid + '&src=' + vars.src + '&activitydes=' + vars.activitydes + '&cid=' + vars.cid + '&bids=' + vars.bids,
            // 数据总条数
            total: vars.total,
            // 首屏显示数据条数
            pagesize: 10,
            // 单页加载条数，可不设置
            pageNumber: vars.pagesize,
            // 加载更多按钮id
            moreBtnID: '#loadMore',
            // 加载数据过程显示提示id
            loadPromptID: '#moreContent',
            // 数据加载过来的html字符串容器
            contentID: '#loadstart',
            loadingTxt: '<i></i>努力加载中...',
            loadAgoTxt: '点击加载更多...'
        });
        // 栏目标题滑动固定
        var $houseList = $('.houseList');
        var topOffset = $houseList.offset().top;
        var $window = $(window);
        $window.on('scroll', (function () {
            var isFixed = false;
            var fixedNow;
            return function () {
                fixedNow = $window.scrollTop() > topOffset;
                if (fixedNow !== isFixed) {
                    isFixed = fixedNow;
                    $houseList.toggleClass('houseList-fixed');
                }
            };
        })());
        var scrollFlag = util.getCookie('scrollFlag');
        util.delCookie('scrollFlag');
        scrollFlag && $window.scrollTop(topOffset);
        // 筛选
        var $tabSX = $('.tabSX');
        // 遮罩
        var $float = $('.float');
        // 一级筛选，品类
        var $category = $tabSX.find('.category');
        // 二级筛选，品牌
        var $check = $tabSX.find('.check');
        // 重置
        var $btnReset = $('.btnReset');
        // 确认
        var $btnSubmit = $('.btnSubmit');
        // 记录已经选择品牌和品类信息
        var $brandList, $brandListBak;
        var cid = +vars.cid;
        var cidBak = cid;
        var bids = vars.bids ? vars.bids.split('_') : [];
        var bidsBak = bids;
        // 点击切换筛选框显示
        $('.fenlei,.float').on('click', (function () {
            var isShow = false;
            $btnReset[bids.length ? 'removeClass' : 'addClass']('noClick');
            $brandListBak = $brandList = $check.find('div[data-id=' + cid + ']');
            return function () {
                isShow = !isShow;
                $tabSX.toggle();
                $float.toggle();
                new IScroll('.category');
                new IScroll($brandList[0]);
                jiajuUtils.toggleTouchmove(isShow);
                isShow || $window.scrollTop(topOffset);
            };
        })());
        // 品类选择
        $category.on('click', 'dd', function () {
            var $this = $(this);
            $this.addClass('active').siblings().removeClass('active');
            cid = $this.data('id');
            if (cidBak === cid) {
                $brandList = $brandListBak;
                bids = bidsBak;
                $btnReset[bids.length ? 'removeClass' : 'addClass']('noClick');
            } else {
                // 切换品类显示相应品牌
                $brandList = $check.find('div[data-id=' + cid + ']');
                $btnReset.addClass('noClick');
                bids = [];
            }
            $brandList.show().siblings().hide();
            new IScroll($brandList[0]);
        });
        // 品牌选择，最多三个
        $check.on('click', 'dd', (function () {
            var canAjax = true;
            return function () {
                if (canAjax) {
                    canAjax = false;
                    var $this = $(this);
                    if (cidBak !== cid) {
                        // 选择品牌后，如果当前品类与记录品类不同，清楚之前品类下选择的品牌
                        cidBak = cid;
                        $brandListBak.find('.active').removeClass('active');
                        $brandListBak = $brandList;
                    }
                    var bid = $this.attr('data-id');
                    var hasActive = $this.hasClass('active');
                    // 取消选择，或者少于三个已选的再选择时生效
                    if (hasActive || bids.length < 3) {
                        // 更新已选品牌
                        if (hasActive) {
                            bids.splice($.inArray(bid, bids), 1);
                        } else {
                            bids.push(bid);
                        }
                        $this.toggleClass('active');
                    }
                    bidsBak = bids;
                    $btnReset[bids.length ? 'removeClass' : 'addClass']('noClick');
                    setTimeout(function () {
                        canAjax = true;
                    }, 100);
                }
            };
        })());
        // 重置品牌选择
        $btnReset.on('click', function () {
            var $this = $(this);
            if (!$this.hasClass('noClick')) {
                $brandList.find('.active').removeClass('active');
                $btnReset.addClass('noClick');
                bids = bidsBak = [];
            }
        });
        // 提交根据选择进行跳转
        $btnSubmit.on('click', function () {
            util.setCookie('scrollFlag', '1', 1);
            if (vars.rewriteFlag) {
                location.href = vars.jiajuSite + 'vip/' + vars.city + '/' + vars.platformid + '_' + vars.sourceid + '_' + vars.positionid + '_' + vars.activityid + '_' + vars.src + '/' + cid + '_' + bids.join('_') + '/' + vars.activitydes;
            } else {
                location.href = vars.jiajuSite + '?c=jiaju&a=vip&city=' + vars.city + '&cid=' + cid + '&bids=' + bids.join('_') + '&platformid=' + vars.platformid + '&sourceid=' + vars.sourceid + '&positionid=' + vars.positionid + '&activityid=' + vars.activityid + '&src=' + vars.src + '&activitydes=' + vars.activitydes;
            }
        });
    };
});