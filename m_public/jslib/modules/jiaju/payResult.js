/**
 * @file 爆款, 优惠券的支付结果页
 * @author 汤贺翔(tanghexiang@fang.com)
 */
define('modules/jiaju/payResult', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 根据type区分商品和优惠券
    var isSuc = vars.suc;
    if (isSuc === '1') {
        setTimeout(function () {
            location.href = vars.goonurl;
        }, 3000);
    } else {
        // toast提示
        var $sendFloat = $('#sendFloat');
        var $sendText = $('#sendText');
        var toastMsg = function (msg) {
            $sendText.text(msg);
            $sendFloat.show();
            setTimeout(function () {
                $sendFloat.hide();
            }, 2000);
        };
        // 重新支付功能
        var canAjax = true;
        var reOrder = function () {
            var reOrderUrl = vars.jiajuSite + '?c=jiaju&a=ajaxReOrder&city=' + vars.city + '&interface_mode=' + vars.interface_mode + '&r=' + Math.random();
            if (vars.browsermode) {
                reOrderUrl += 'src=client';
            }
            var reOrderData = {
                type: vars.type,
                orderid: vars.orderid,
                platformid: vars.platformid,
                sourceid: vars.sourceid,
                positionid: vars.positionid,
                activityid: vars.activityid,
                activitydes: vars.activitydes,

            };
            $.ajax({
                type: 'get',
                url: reOrderUrl,
                data: reOrderData,
                success: function (obj) {
                    if (obj.issuccess === '1') {
                        // 填充收银台表单, 并提交表单
                        $('#biz_id').val(obj.info.biz_id);
                        $('#call_time').val(obj.info.call_time);
                        $('#charset').val(obj.info.charset);
                        $('#extra_param').val(obj.info.extra_param);
                        $('#invoker').val(obj.info.invoker);
                        $('#notify_url').val(obj.info.notify_url);
                        $('#origin').val(obj.info.origin);
                        $('#out_trade_no').val(obj.info.out_trade_no);
                        $('#paid_amount').val(obj.info.paid_amount);
                        $('#platform').val(obj.info.platform);
                        $('#quantity').val(obj.info.quantity);
                        $('#return_url').val(obj.info.return_url);
                        $('#service').val(obj.info.service);
                        $('#sign_type').val(obj.info.sign_type);
                        $('#subject').val(obj.info.subject);
                        $('#title').val(obj.info.title);
                        $('#total').val(obj.info.price);
                        $('#trade_amount').val(obj.info.trade_amount);
                        $('#trade_type').val(obj.info.trade_type);
                        $('#user_id').val(obj.info.user_id);
                        $('#version').val(obj.info.version);
                        $('#sign').val(obj.info.sign);
                        $('#form').submit();
                    } else {
                        // 重新生成的错误处理
                        toastMsg(obj.errormessage);
                    }
                },
                complete: function () {
                    canAjax = true;
                }
            });
        };
        $('#reOrder').on('click', function () {
            if (canAjax) {
                canAjax = false;
                reOrder();
            }
        });
    }
});