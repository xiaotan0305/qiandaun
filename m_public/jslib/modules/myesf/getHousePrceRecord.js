/**
 * @file调价记录类
 * @link  https://m.fang.com/my/?c=myesf&a=getHousePrceRecord&city=bj&houseId=606911&indexid=101023 （用户名17701306507  密码：123456）
 */
define('modules/myesf/getHousePrceRecord',
    ['jquery', 'modules/mycenter/common', 'modules/esf/yhxw','lazyload/1.9.1/lazyload'],
    function (require, exports, module) {
        'use strict';
        module.exports = function () {
            var $ = require('jquery');
            var vars = seajs.data.vars;
            var common = require('modules/mycenter/common');
            var yhxw = require('modules/esf/yhxw');
			/* 图片惰性加载*/
            require.async('lazyload/1.9.1/lazyload',function () {
                $('img[data-original]').lazyload();
            });
            // 打电话
            $('a').on('click', '.tel', function () {
                common.apply(this, $(this).attr('data-teltj').split(','));
            });

            // 打电话
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
            $('.tel').on('click', function () {
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
            $('.giveme').on('click', function () {
                var data = $('.giveme').attr('data-chat');
                var dataArr = data.split(',');
                chat(dataArr);
            });
            $('.arr-rt').on('click', function () {
                var data = $('.giveme').attr('data-chat');
                var dataArr = data.split(',');
                chat(dataArr);
            });

            // 点击经纪人头像进入店铺
            $('#agentImg').on('click', function () {
                var url = '';
                if (vars.ebstatus) {
                    url = vars.mainSite + 'agent/' + vars.city + '/1_' + vars.agentid + '.html';
                } else {
                    url = vars.mainSite + 'agent/' + vars.city + '/' + vars.agentid + '.html';
                }
                window.location.href = url;
            });
        };
    });