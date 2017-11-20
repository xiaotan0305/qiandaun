/**
 * @file 房源点评列表类
 * @link https://m.fang.com/my/?c=myesf&a=commentList&city=bj&houseid=606911&indexid=101023 （用户名17701306507  密码：123456）
 */
define('modules/myesf/commentList', ['jquery','lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var localStorage = vars.localStorage;
        var yhxw = require('modules/esf/yhxw');

		/* 图片惰性加载*/
        require.async('lazyload/1.9.1/lazyload',function () {
            $('img[data-original]').lazyload();
        });
		// 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.mySite + '?c=myesf&a=ajaxCommentList' + '&city=' + vars.city + '&houseid=' + vars.houseid + '&ProjCode=' + vars.ProjCode,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.moreList',
            loadPromptID: '.draginner',
            contentID: '.dpList',
            loadAgoTxt: '<i></i>上拉加载更多',
            loadingTxt: '<i></i>加载中...',
            firstDragFlag: false
        });
        // 查看全部
        $('.more_xq').on('click', function () {
            var $that = $(this);
            $that.toggleClass('up');
            $that.siblings('.xqIntro').toggleClass('all');
        });
        function chat(data) {
            var xiaoqu = $('#xiaoqu').html() || '';
            var room = $('#room').html() || '';
            var price = $('#price').html() || '';
            var url = '/data.d?m=houseinfotj&city=' + data[1] + '&housetype='
                + data[2] + '&houseid=' + $.trim(data[3]) + '&newcode=' + $.trim(data[4])
                + '&type=' + data[5] + '&phone=' + $.trim(data[6]) + '&channel=' + $.trim(data[7]) + '&agentid='
                + $.trim(data[10]) + '&order=' + data[11] + '&housefrom=';
            if ('A' === vars.housetype || 'B' === vars.housetype || 'C' === vars.housetype || 'D' === vars.housetype) {
                if (vars.localStorage) {
                    vars.localStorage.setItem(data[8], encodeURIComponent(data[9]) + ';' + data[11]
                        + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的电商'));
                }
            } else if (vars.localStorage) {
                vars.localStorage.setItem(data[8], encodeURIComponent(data[9]) + ';' + data[12]
                    + ';' + encodeURIComponent(xiaoqu + '的' + room + '价格为' + price + '的委托')
                    + ';' + vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html');
            }
            if (vars.hasOwnProperty('from') && vars.from.length > 0) {
                url += vars.from + '&product=soufun';
            } else {
                url += data[13];
            }
            $.ajax(url);
            setTimeout(function () {
                window.location = '/chat.d?m=chat&username=' + data[8] + '&city=' + data[1];
            }, 500);
            yhxw(24);
        }
        // 留言
        $('.mes').on('click', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chat(dataArr);
        });

        var url = '';
        // 点击头像进入经纪人店铺
        $('.user-list').on('click', function () {
            var $that = $(this);
            var e = $that.attr('data-e');
            var aid = $that.attr('data-aid');
            if (e) {
                url = vars.mainSite + 'agent/' + vars.city + '/1_' + aid + '.html';
            } else {
                url = vars.mainSite + 'agent/' + vars.city + '/' + aid + '.html';
            }
            window.location.href = url;
        });
    };
});