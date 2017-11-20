define('modules/myesf/weituoAgentListDS', ['jquery','lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'modules/esf/yhxw'],
    function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        var yhxw = require('modules/esf/yhxw');

        /* 图片惰性加载*/
        require.async('lazyload/1.9.1/lazyload',function () {
            $('img[data-original]').lazyload();
        });
        // 加载更多
        var loadMore = require('loadMore/1.0.0/loadMore');
        loadMore({
            url: vars.mySite + '?c=myesf&a=ajaxWeiTuoAgentListDS' + '&city=' + vars.city + '&houseid=' + vars.houseid
            + '&indexid=' + vars.indexid + '&ProjCode=' + vars.ProjCode + '&type=' + vars.type + '&oldId=' + vars.oldId,
            total: vars.totalCount,
            pagesize: 4,
            pageNumber: 4,
            moreBtnID: '.moreList',
            loadPromptID: '.draginner',
            contentID: '.jjrList',
            loadAgoTxt: '<i></i>上拉加载更多',
            loadingTxt: '<i></i>加载中...',
            firstDragFlag: false
        });

        // 打电话
        $('.tel').on('click', function () {
            var teldata = $(this).find('a').attr('data-teltj').split(',');
            $.ajax({
                url: '/data.d?m=houseinfotj&city=' + teldata[0] + '&housetype=' + teldata[1] + '&houseid=' + teldata[2] + '&newcode='
                + teldata[3] + '&type=' + teldata[4] + '&phone=' + teldata[5] + '&channel=' + teldata[6] + '&agentid=' + teldata[7],
                async: true
            });
            if (typeof yhxw !== 'undefined' && yhxw && typeof _ub !== 'undefined' && _ub && typeof _ub.collect !== 'undefined'
                && _ub.collect) {
                yhxw(31);
            }
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
        var muserList = $('.muser-list');
		// 留言
        muserList.find('.arr-rt').on('click', function () {
            var data = $(this).parent().parent().find('li[data-chat]').attr('data-chat');
            var dataArr = data.split(',');
            chat(dataArr);
        });
        $('.managesTaba').on('click', 'li[data-chat]', function () {
            var data = $(this).attr('data-chat');
            var dataArr = data.split(',');
            chat(dataArr);
        });
        // 修改专属经纪人
        var inputFlag = false;
        var jjrpjbtn = $('.jjrpjbtn');
        $('.manageseller').on('click', 'a', function () {
            var $that = $(this);
            var inputs = $that.find('input');
            if (inputs.attr('checked')) {
                inputs.attr('checked', false);
            } else {
                inputs.attr('checked', true);
            }
            if ($('.ipt-rd').is(':checked')) {
                inputFlag = true;
            } else {
                inputFlag = false;
            }
            if (inputFlag) {
                jjrpjbtn.css({backgroundColor: '#df3031'});
            } else {
                jjrpjbtn.css({backgroundColor: 'grey'});
            }
        });
        jjrpjbtn.on('click', function () {
            if (inputFlag) {
                var agentid = $('input[checked=checked]').attr('data-aid');
                var url = vars.mySite + '?c=myesf&a=setExclusiveAgent&city=' + vars.city + '&houseid='
                    + vars.houseid + '&agentid=' + agentid;
                $.get(url, function (data) {
                    if (data && data.result === '1') {
                        alert(data.message);
                        window.location.href = vars.mySite + '?c=myesf&a=houseDetail&city=' + vars.city
                        + '&indexId=' + vars.indexid + '&houseid=' + vars.houseid;
                    } else if (data.message) {
                        alert(data.message);
                    } else {
                        alert('网络不给力，请刷新重试！');
                    }
                });
            } else {
                return false;
            }
        });
        var url = '';
        // 点击头像进入经纪人店铺
        muserList.find('img').on('click', function () {
            var $that = $(this).parent();
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
    // end of module.exports
});