/**
 *问答UI改版 标签列表页
 * modified by zdl 2016-1-11
 * 邮箱地址（zhangdaliang@fang.com）
 */
define('modules/ask/asktaglist', ['jquery', 'iscroll/2.0.0/iscroll-lite',
    'loadMore/1.0.0/loadMore','lazyload/1.9.1/lazyload', 'modules/ask/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 引入iscroll组件用于买房大人头像的滑动
        var iscroll = require('iscroll/2.0.0/iscroll-lite');
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload({
            placeholder: vars.imgUrl + 'images/head.png'
        });

        $('#close').on('click',function (e) {
            e.stopPropagation();
            $('#content').text('').hide();
        });
        // 上拉加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.askSite + '?c=ask&a=ajaxTagAskList&city=' + vars.city + '&tagId=' + vars.tagId,
            total: vars.allcount,
            pagesize: 32,
            pageNumber: 16,
            moreBtnID: '#drag',
            loadPromptID: '.draginner',
            contentID: '.searchList',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '加载中...',
            firstDragFlag: false
        });
        // 买房达人滑动效果start
        var $sliderId = $('#slider');
        var $sliderLen = $sliderId.length;
        if ($sliderLen > 0) {
            // 存取滑动div的宽度
            var leng = 0;
            // 获取买房达人下的li标签的个数
            var $scrollerLi = $sliderId.find('li');
            // 获取滑动ul的总长度
            $scrollerLi.each(function () {
                leng += $(this).width() + 15;
            });
            // 动态设置滑动div ul的宽度
            $('#wapaskbq_D02_01').width(leng);
            // 精选房源添加滑动效果
            new iscroll('#slider', {scrollX: true, bindToWrapper: true, eventPassthrough: true, preventDefault:false});
        }

        /**
         * 滑动页面，将搜索框固定到顶部
         */
        // 目前应为main里面的overflow = "hidden" 导致搜索框的固定问题
        // 获取搜索框容器实例
        var $searchCon = $('.search');
        var fixTop = $searchCon.offset().top;
        $(window).on('scroll', function () {
            if ($(document).scrollTop() > fixTop) {
                $searchCon.addClass('search-b');
            } else {
                $searchCon.removeClass('search-b');
            }
        });

        // 用户行为对象
        var yhxw = require('modules/ask/yhxw');
        yhxw({type: 1, pageId: 'malabellist'});
    };
});