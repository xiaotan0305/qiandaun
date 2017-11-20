define('modules/my/payIn', ['jquery', 'modules/my/yhxw'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        // 引入用户行为分析对象-埋码
        var yhxw = require('modules/my/yhxw');
        // 判断详情页种类，传入用户行为统计对象
        var pageId = 'mucmymoneycz';
        // 埋码变量数组
        var maiMaParams = {
            'vmg.page': pageId
        };
        yhxw({
            type: 0,
            pageId: pageId,
            params: maiMaParams
        });

        var moneyQuantity = $('#moneyQuantity'),
            error = $('#error');

        function payIn() {
            if ($('#deal').prop('checked') === true || $('#zhifubao').prop('checked') === false) {
                return;
            }
            var money = +moneyQuantity.val();
            var reg = /^[0-9]+(\.[0-9]{0,2})?$/;
            if (money <= 0 || !reg.test(money)) {
                error.show();
                moneyQuantity.focus().select();
                return;
            }
            $('#form').submit();
        }

        moneyQuantity.on('input propertychange', function () {
            if ($(this).val().length > 0) {
                if (+moneyQuantity.val() <= 0) {
                    error.show();
                } else {
                    error.hide();
                    $('#btn a').removeClass('cur').on('click', function () {
                        payIn();
                    });
                }
            } else {
                error.hide();
                $('#btn a').addClass('cur');
            }
        });

        moneyQuantity.on('keyup', function () {
            if (!/^[0-9]+(\.[0-9]{0,2})?$/.test(moneyQuantity.val())) {
                error.show();
                moneyQuantity.val('');
            }
        });
    };
});