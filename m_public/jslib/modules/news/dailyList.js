/**
 * 列表js
 * Created by sunwenxiu on 17-4-20.
 */
define('modules/news/dailyList', ['jquery', 'iscroll/2.0.0/iscroll-lite', 'swipe/3.10/swiper', 'weixin/2.0.1/weixinshare', 'loadMore/1.0.2/loadMore'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var title = document.title;
            var content = $('meta[name="description"]')[0].content;
            var IScroll = require('iscroll/2.0.0/iscroll-lite');
            var Weixin = require('weixin/2.0.1/weixinshare');
            // 日期标签
            var $zblistDate = $('.z-zblist-date');
            // 列表容器
            var $ul = $('.z-zblist-tiao');
            var height = document.body.clientHeight - $('.cent').height() - $('.footer ').height() - $zblistDate.height() - $('.bg-white').height();
            var $content = $('.content');
            // 重新设置高度
            $content.css('height', height + 'px');
            var iscroll = new IScroll('#wrapper', {
                bindToWrapper: true,
                // 滚动为该节点
                scrollX: false,
                // 不可横向滚动
                scrollY: true,
                // 开启纵向滚动
                specialEnd: true
                // 开启特殊滑动结束事件触发机制
            });
            iscroll.on('scrollEnd', function () {
                var num = Math.round(-this.y / $($ul.find('li')[0]).height()) + 1;
                $zblistDate.text($ul.find('li:nth-child(' + num + ')').attr('data-toptime'));
            });
            // 微信分享
            var weixin = new Weixin({
                // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                debug: false,
                shareTitle: title,
                descContent: content,
                lineLink: location.href,
                imgUrl: window.location.protocol + vars.public + '201511/images/newsShare.jpg',
                swapTitle: true
            });
            if (vars.totalCount > 20) {
                var loadMore = require('loadMore/1.0.2/loadMore');
                // ajax加载更多
                loadMore({
                    url: vars.newsSite + '?c=news&a=ajaxDailyList&totalCount=' + vars.totalCount,
                    // 数据总条数
                    total: vars.totalCount + 20,
                    // 页面的部分模块滚动
                    partScroll: true,
                    // 滚动内容的id
                    partSrollerId: '.z-zblist-tiao',
                    // 滚动容器
                    partScrollBox: '#wrapper',
                    // iscroll实例
                    iscroll: iscroll,
                    // 首屏显示数据条数
                    pagesize: 20,
                    // 单页加载条数
                    pageNumber: 20,
                    // 加载更多按钮id
                    moreBtnID: '#drag',
                    // 是否需要第一次上拉到底后不加载更多，第二次后才加载更多，可为空，默认为true
                    firstDragFlag: false,
                    // 加载数据过程显示提示id
                    loadPromptID: '#draginner',
                    // 数据加载过来的html字符串容器
                    contentID: '#zblist',
                    // 加载前显示内容
                    loadAgoTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                    // 加载中显示内容
                    loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
                    // 加载完成后显示内容
                    loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
                    callback: function () {
                        if ($('#drag').is(':hidden')) {
                            $('#dragBox').css('height', 0);
                        }
                        iscroll.refresh();
                    }
                });
            }
        };
    });
