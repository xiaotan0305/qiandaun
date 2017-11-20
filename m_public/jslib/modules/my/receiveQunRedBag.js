/**
 * @file OA系统IM收红包-群收红包
 * @author 袁辉辉(yuanhuihui@fang.com) 2016年12月05日17:40:59
 */
define('modules/my/receiveQunRedBag', ['jquery', 'rsa/1.0.0/rsa', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 获取页面数据
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        var openHB = $('#openHB');
        var hblogojump = $('#hblogojump');
        var url = location.href;
        // 查看大家手气
        hblogojump.on('click', function () {
            window.location.href = url + '&lookmore=1';
        });
        $('#showmore').on('click', function () {
            $('.li_more').show();
            $(this).hide();
        });
        // 防止重复点击
        var canClick = !0;
        // 拆红包
        openHB.off('click').on('click', function () {
            var $this = $(this);
            if (canClick) {
                $this.addClass('rotate3d');
                canClick = !1;
                var url = vars.mySite + '?c=my&a=openQunRedBag';
                var data = {
                    // 收红包人的id
                    acceptPid: vars.receiverPassportId,
                    // 发红包人的IM用户名
                    imSendUname: encodeURIComponent(vars.imSendUname),
                    // 收红包人的IM用户名
                    imAcceptUname: encodeURIComponent(vars.imAcceptUname),
                    city: encodeURIComponent(vars.city),
                    // 红包订单号
                    redBagId: vars.redBagId,
                    // 群id
                    groupid: vars.groupid,
                    // 收红包人的OAid
                    receiveOAId: vars.receiveOAId,
                    // 来源
                    origin: vars.origin,
                    src: vars.src,
                    // 发红包人的OAid
                    sendOAId: vars.sendOAId
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
