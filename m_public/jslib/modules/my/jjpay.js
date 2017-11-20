define('modules/my/jjpay', ['jquery'], function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    module.exports = function () {
        var vars = seajs.data.vars;
        // var city = vars.city;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('name')] = element.value;
        });
        // var url = vars.jiajuSite;
        // var yemon = vars.Balance;
        // var OrderID = vars.orderid;
        var targetURL = vars.targetURL;
        var zfbUrl = vars.zfbUrl;

        $(function () {
            $('#c1').click(function () {
                if (parseInt($('#mon').text() * 100) <= parseInt($('#mon1').text() * 100)) {
                    // 余额足
                } else if ($('#c1').prop('checked') === true) {
                    alert('您的余额不足，请充值');
                }
            });
        });

        function Signup() {
            $('.mt20').css({
                'background-color': '#d7d7d7'
            });
            // var Title = $('#tex').text();
            // var Description=$('#des').text();
            // var MoneyQuantity = $('#mon').text();
            // var ExtOrderID = OrderID;
            var YlAndZfb = $('#zf_0').prop('checked') || $('#zf_1').prop('checked');
            console.log(YlAndZfb);
            if (YlAndZfb && $('#c1').prop('checked')) {
                alert('只能选择一种付款方式');
                return false;
            }
            if (!YlAndZfb && !$('#c1').prop('checked')) {
                alert('必须选择一种付款方式');
                return false;
            }
            if ($('#c1').prop('checked')) {
                if (parseInt($('#mon').text() * 100) <= parseInt($('#mon1').text() * 100)) {
                    $('#form').submit();
                } else if ($('#c1').prop('checked') === true) {
                    alert('您的余额不足，请充值');
                }
            }
            if (YlAndZfb) {
                if ($('#zf_0').prop('checked')) {
                    $('#form').attr('action', targetURL);
                    $('#form').submit();
                }
            }
            if (YlAndZfb) {
                if ($('#zf_1').prop('checked')) {
                    $('#form').attr('action', zfbUrl);
                    $('#form').submit();
                }
            }
        }
        $('#zhifu').on('click', function () {
            Signup();
        });
    };
});