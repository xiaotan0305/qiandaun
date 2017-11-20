/**
 * @file 收红包
 * @created by 袁辉辉(yuanhuihui@fang.com)
 */
define('modules/my/receiveRedBag', ['jquery', 'rsa/1.0.0/rsa'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 获取页面数据
        var vars = seajs.data.vars;
        var openHB = $('#openHB');
        // 防止重复点击
        var canClick = !0;
        // 拆红包
        openHB.off('click').on('click', function () {
            var $this = $(this);
            if (canClick) {
                $this.addClass('rotate3d');
                canClick = !1;
                var url = vars.mySite + '?c=my&a=openRedBag';
                var data = {
                    // 发红包人的id
                    sendPid: vars.sendPid,
                    // 发红包人用户名
                    sendUname: encodeURIComponent(vars.sendUname),
                    // 收红包人用户名
                    accpetUname: encodeURIComponent(vars.acceptUname),
                    // 收红包人的id
                    acceptPid: vars.acceptPid,
                    // 发红包人的IM用户名
                    imSendUname: encodeURIComponent(vars.imSendUname),
                    // 收红包人的IM用户名
                    imAcceptUname: encodeURIComponent(vars.imAcceptUname),
                    // 商业编号
                    biz_id: vars.biz_id,
                    city: encodeURIComponent(vars.city),
                    // 红包订单号
                    redBagId: vars.redBagId,
                    // 发送人的oaid
                    sendOAId: vars.sendOAId,
                    // 接收人的oaid
                    acceptOAId: vars.acceptOAId
                };
                $.ajax({
                    type: 'post',
                    url: url,
                    data: data,
                    dataType: 'json',
                    success: function () {
                        canClick = !0;
                        // 成功与否只需要刷新状态
                        window.location.reload();
                    },
                    error: function () {
                        canClick = !0;
                        window.location.reload();
                    }
                });
            }
        });
    };
});
