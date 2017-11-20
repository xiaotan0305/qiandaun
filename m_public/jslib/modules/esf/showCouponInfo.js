define('modules/esf/showCouponInfo', ['jquery'], function (require, exports, module) {
    'use strict';
    var vars = seajs.data.vars, $ = require('jquery');
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    function couponStatusFn() {
    }

    couponStatusFn.prototype = {
        init: function () {
            var that = this;
            that.search = $('#search');     // 查询按钮
            that.couponId = $('#couponId');
            that.couponName = $('#couponName');
            that.content = $('#content');
            that.status = $('#status');
            that.phone = $('#phone');
            that.period = $('#period');
            that.prompt = $('#prompt');
            that.rule = $('#rule');

            that.floatLayer = $('#sendFloat');
            that.searchType = '500';        // 查询500优惠券还是200优惠券
            that.bindEvent();
        },
        bindEvent: function () {
            var that = this;
            that.search.on('click', function () {
                that.listenSearch.call(that);
            });
        },
        listenSearch: function () {
            var that = this;
            var couponId = that.couponId.val();
            if (!/^[0-9]+$/.test(couponId)) {
                that.prompt.html('优惠券号为纯数字并且不能为空哟').show();
                return false;
            }
            that.floatLayer.show();
            that.prompt.html('').hide();
            var url = vars.esfSite + '?c=esf&a=ajaxGetCouponInfo';
            var data = {couponId : couponId};
            $.get(url, data, function (mes) {
                // var jsonData = JSON.parse(mes);
                that.floatLayer.hide();
                if (mes.errorCode == '1') {
                    that.prompt.html('').hide();
                    that.status.html(mes.status);
                    that.couponName.html(mes.title);
                    that.content.html(mes.content);
                    that.period.html(mes.expiry);
                    that.rule.html(mes.instructions);
                    that.phone.html(mes.phone);
                } else {
                    that.status.html('');
                    that.couponName.html('');
                    that.content.html('');
                    that.period.html('');
                    that.rule.html('');
                    that.phone.html('&nbsp;');
                    that.prompt.html(mes.errorMessage).show();
                }
            });
        },
    };
    var couponStatusObj = new couponStatusFn;
    couponStatusObj.init();
    module.exports = couponStatusFn;
});
