define('modules/zf/housingResourcesOrderDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var iscrollCtrl = require('iscroll/1.0.0/iscroll');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 实现对输入文字的个数判断
        $(document).ready(function () {
            // 对备注信息字数的管理
            var text = $('#str_length').val();
            var counter = text.length;
            $('#str_nums').text('您还可以输入' + (500 - counter) + '个字');
            $('#str_length').on('input propertychange', function () {
                var counter = $(this).val().length;
                $('#str_nums').text('您还可以输入' + (500 - counter) + '个字');
            });
        });
        // 对数据进行提交处理即可，不需要对信息进行确认，因为提交前的必须信息都是已经有
        $('#submit_all').on('click', function () {
            // 实现对数据的提交处理
            var price = $('#price').val();
            var priceReg = /^[-\+]?\d+(\.\d+)?$/;
            if (!price) {
                alert('请完善价格');
                return false;
            } else if (!priceReg.test(price)) {
                alert('请填写正确的价格信息');
                return false;
            }
            // 实现表单提交
            $('form').submit();
        });
    };
});