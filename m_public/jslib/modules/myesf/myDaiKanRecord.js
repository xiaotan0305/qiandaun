define('modules/myesf/myDaiKanRecord', ['jquery', 'modules/mycenter/common', 'loadMore/1.0.0/loadMore', 'modules/esf/yhxw'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var yhxw = require('modules/esf/yhxw');
        var common = require('modules/mycenter/common');
        // 打电话
        $('a').on('click', '.call, .serviceTel', function () {
            common.teltj(this, $(this).attr('data-teltj').split(','));
        });
        // 首页加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.mySite + '?c=myesf&a=ajaxMyDaiKanRecord' + '&city=' + vars.city + '&projcode=' + vars.projcode + '&houseid=' + vars.houseid,
            total: vars.totalCount,
            pagesize: 20,
            pageNumber: 20,
            moreBtnID: '.moreList',
            loadPromptID: '.draginner',
            contentID: '.dktimeline',
            loadAgoTxt: '<i></i>上拉加载更多',
            loadingTxt: '<i></i>加载中...',
            firstDragFlag: false
        });
        // 统计用户浏览行为
        var pageId = 'muchelpsellleadvisit';
        yhxw({type: 0,pageId: pageId,curChannel: 'myesf'});
        function telCall(teldata) {
            $.ajax({
                url: '/data.d?m=houseinfotj&city=' + teldata[0] + '&housetype=' + teldata[1] + '&houseid=' + teldata[2] + '&newcode='
                + teldata[3] + '&type=' + teldata[4] + '&phone=' + teldata[5] + '&channel=' + teldata[6] + '&agentid=' + teldata[7],
                async: true
            });
            if (typeof yhxw !== 'undefined' && yhxw && typeof _ub !== 'undefined' && _ub && typeof _ub.collect !== 'undefined'
                && _ub.collect) {
                yhxw(31);
            }
        }
        $('.call').on('click', function () {
            var teldata = $(this).find('a').attr('data-teltj').split(',');
            telCall(teldata);
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
    };
});