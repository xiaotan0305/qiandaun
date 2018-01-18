/**
 * 查成交新房成交明细页
 * Created by guocheng on 2016/11/17.
 */
define('modules/chengjiao/xFdealList', ['modules/world/yhxw', 'jquery', 'iscroll/2.0.0/iscroll-probe'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        var iscroll = require('iscroll/2.0.0/iscroll-probe');

		// 引入用户行为分析对象-埋码
        var yhxw = require('modules/world/yhxw');
        var maimaParams = {
            'vmg.page': 'cj_xf^gk_wap'
        };
        yhxw({
            pageId: 'cj_xf^gk_wap',
            params: maimaParams
        });
        
        //日月周切换
        var $trendTime = $('.trend-time li');
        if ($trendTime.length) {
            $trendTime.on('click', function () {
                var $this = $(this);
                if ($this.hasClass('on')) {
                    return;
                }
                window.location.href = $this.attr('data_url');
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
        var yearLabel = $('.table-th-box');
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
    };
});