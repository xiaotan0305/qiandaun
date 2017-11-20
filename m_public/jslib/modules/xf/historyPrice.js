/**
 * 房价历史页面
 * 2016/04/13 by wangfengchao@fang.com
 */
define('modules/xf/historyPrice', ['jquery', 'loadMore/1.0.0/loadMore'],
    function (require) {
        'use strict';
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var loadMore = require('loadMore/1.0.0/loadMore');
        var houseid = vars.houseid;
        var total = vars.total;
        // 取居室的数字,如果没有就为''表示全部
        var room = parseInt(window.location.href.split('&room=')[1]) || '';

        var $headerOut = $('.header-out');
        var $drag = $('#drag');
        var $word = $('.word');

        // 筛选功能
        $word.on('click', function () {
            if ($headerOut.is(':hidden')) {
                $headerOut.show();
            } else {
                $headerOut.hide();
            }
        });

        // 点击筛选后收起
        $('.header-out a').on('click', function () {
            $headerOut.hide();
        });

        // 上拉加载更多
        loadMore({
            url: '/xf.d?m=historyPrice&id=' + houseid + '&room=' + room,
            total: total,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '#drag',
            loadPromptID: '.bt',
            contentID: '.his-list',
            loadAgoTxt: '上拉加载更多',
            loadingTxt: '正在加载...',
            loadedTxt: '上拉加载更多',
            firstDragFlag: false
        });

        // 无内容提示
        if (!$('.his-list li').length) {
            $drag.html('没有符合条件的户型');
            $drag.show();
        }
        if (total > 20) {
            $drag.show();
        }
    }
);