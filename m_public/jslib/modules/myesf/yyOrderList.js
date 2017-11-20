/**
 * 我的看房清单类型
 *  @description http://m.test.fang.com/my/index.php?c=myesf&a=yyOrderList&city=bj&refresh
 */
define('modules/myesf/yyOrderList', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars, preload = [];
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        preload.push('modules/myesf/loadnewmore', 'lazyload/1.9.1/lazyload', vars.public + 'js/autoopenapp_sfut.js');
        require.async(preload);
        var $content = $('#content');
        $content.find('div').eq(0).addClass('nob');

        $content.on('click', '.btn_cancle', function () {
            var orderid = $(this).attr('data-orderid');
            if (window.confirm('是否取消看房 ?')) {
                var jsondata = {
                    city: vars.city,
                    orderID: orderid,
                    r: Math.random()
                };
                var ajaxUrl = 'index.php?c=myesf&a=yyCancleOrder';
                $.get(ajaxUrl, jsondata,
                    function (data) {
                        if (data === '1') {
                            location.reload(true);
                        } else {
                            // 失败
                            alert('取消预约失败，请稍后再试');
                        }
                    });
            }
        });

        function teltj(city, housetype, houseid, newcode, type, phone, channel, agentid, order, housefrom) {
            $.ajax({
                url: vars.mainSite + 'data.d?m=houseinfotj&city=' + city + '&housetype=' + housetype + '&houseid=' + houseid + '&newcode='
                + newcode + '&type=' + type + '&phone=' + phone + '&channel=' + channel + '&agentid=' + agentid + '&order=' + order + '&housefrom='
                + housefrom,
                async: true
            });
        }
        $content.on('click', '.tj-tel', function () {
            var data = $(this).attr('data-teltj');
            var dataArr = data.split(',');
            teltj.apply(this, dataArr);
        });

        // 点击 写评价
        $content.on('click', '.btn_pj', function () {
            var orderid = $(this).attr('data-orderid');
            var msg = $(this).attr('data-msg');
            if (vars.localStorage) {
                window.localStorage.setItem('msg', msg);
            }
            window.location.href = vars.mySite + 'index.php?c=myesf&a=yiKanEvaluation&city=' + vars.city + '&orderid=' + orderid;
        });

        // ajax调用
        require.async('modules/myesf/loadnewmore', function (run) {
            run({
                a: 'myesf',
                url: vars.mySite + 'index.php?c=myesf&a=ajaxGetYyOrderList&city=' + vars.city + '&pagesize=' + vars.pagesize
            });
        });
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
    };
});