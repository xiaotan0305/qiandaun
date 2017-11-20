/**
 * Created by guocheng on 2016/8/17.
 */
define('modules/chengjiao/dealList', ['jquery', 'loadMore/1.0.0/loadMore', 'iscroll/2.0.0/iscroll-probe'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // 页面传入的参数
        var vars = seajs.data.vars;
        var iscroll = require('iscroll/2.0.0/iscroll-probe');
        //小区成交页
        if (vars.newcode) {

            // 加载更多
            var LoadMore = require('loadMore/1.0.0/loadMore');
            LoadMore({
                url: vars.mainSite + 'chengjiao/?c=chengjiao&a=ajaxDealList&district=' + vars.district + '&commerce=' + vars.commerce + '&newcode=' + vars.newcode,
                total: vars.total,
                pagesize: 32,
                pageNumber: 16,
                moreBtnID: '.moreList',
                loadPromptID: '#loading',
                contentID: '#content'
            });
        } else {
            //日周月切换
            var $time_cjmx = $('.time_cjmx');
            if ($time_cjmx.length) {
                $time_cjmx.on('click', 'li', function () {
                    var $this = $(this);
                    if ($this.hasClass('on')) {
                        return;
                    }
                    window.location.href = vars.typeUrl + 'type=' + $this.attr('data_type');
                });
            }

            // 滑动效果
            // 页面滚动效果
            // 页面加载完之后设置成交明细表的高度
            var listBox = $('#listBox');
            // 获取header高度
            var yearChange = $('#yearChange'),
                yearChangeH = yearChange.outerHeight();
            var yearSpan = $('#yearSpan');
            var newheader = $('#newheader'),
                newheaderH = newheader.outerHeight();
            // 获取footer高度
            var footerEle = $('.footer'),
                footerH = footerEle.outerHeight();
            // 获取屏幕高度
            var winH = $(window).height();
            // 获取listYear 标签高度
            var yearLabel = $('.year_cj');
            var yearLabelArr = [];
            yearLabel.each(function (index, ele) {
                yearLabelArr.push(ele.offsetTop);
            });
            // 设置listBox高度
            listBox.css({
                height: winH - newheaderH - yearChangeH - footerH,
                'overflow-y': 'hidden'
            });
            var scrollObj = new iscroll('#listBox', {
                scrollY: true,
                scrollX: false,
                probeType: 2,
                mouseWheel: true
            });

            scrollObj.on('scroll', function () {
                var scrollTop = Math.abs(Math.round(this.y));
                for (var i = 0, len = yearLabelArr.length; i < len; i++) {
                    var item = yearLabelArr[i];
                    if (item < scrollTop) {
                        yearSpan.text(yearLabel.eq(i).data().year + '年');
                    }
                }
            });
        }
    };
});