/**
 * Created by zhangjinyu on 2017/9/12.
 */
define('modules/jiajuds/goGetGold', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        //错误提示
        var sendFloat = $('#sendFloat');
        var sendText = $('#sendText');
        // 领取红包的按钮
        var hbopen = $('.hbopen');
        // 是否可以点击的标识
        var clickFlag = !0;
        hbopen.off('click').on('click', function () {
            var $that = $(this);
            if (clickFlag) {
                $that.addClass('rotate3d');
                clickFlag = !1;
                $.get(vars.jiajuSite + '?c=jiajuds&a=ajaxGetGold&city=' + vars.city, function (data) {
                    clickFlag = !0;
                    console.log(data);
                    if (data.issuccess === 'T') {
                        var price = data.results.success_details.split('^')[2];
                        window.location = vars.jiajuSite + '?c=jiajuds&a=getGoldResult&price=' + price + '&city=' + vars.city;
                    } else if (data.message) {
                        toastMsg(data.message);
                    } else {
                        toastMsg('领取失败！请刷新重试');
                    }
                }).complete(function () {
                    clickFlag = !0;
                });
            }
        });
        function toastMsg(msg) {
            sendText.html(msg);
            sendFloat.show();
            setTimeout(function () {
                sendText.html('');
                sendFloat.hide();
                hbopen.removeClass('rotate3d');
            }, 2000);
        }
    };
});