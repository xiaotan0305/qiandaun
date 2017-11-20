define('modules/zf/housingResourcesAdd', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var iscrollCtrl = require('iscroll/1.0.0/iscroll');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        // 实现对输入文字的个数判断
        // 楼盘名上加事件
        // 这里并不存在事件冒泡，而是在于输入的字的值的调用，每次输入一个字符都进行一次调用【与事件冒泡无关】
        $(document).ready(function () {
            // 对备注信息字数的管理
            var text = $('#str_length').val();
            var counter = text.length;
            $('#str_nums').text('您还可以输入' + (500 - counter) + '个字');
            $('#str_length').on('input propertychange', function () {
                var counter = $(this).val().length;
                $('#str_nums').text('您还可以输入' + (500 - counter) + '个字');
            });
            // 对楼盘的查询管理
            $('#loupan').keyup(function () {
                var q = $('#loupan').val();
                var ajaxdata;
                var urlAjax = vars.zfSite + '?c=zf&a=ajaxgethousingResourcesName&city=bj&q=' + q;
                // 先实现ajax调用，将取到的数据进行添加节点之后进行样式控制
                $.get(urlAjax, function (data) {
                    $('.dropcont ul li').remove();
                    $('.dropcont ul').append(data);
                    $('.dropcont ul li').click(function () {
                        var text = $(this).text();
                        var value = $(this).val();
                        // console.log(dataProj);
                        var dataProj = $(this).attr('data');
                        // $('#loupan').attr('placeholder',value);
                        $('#loupanhidden').val(value);
                        $('#loupan').val(text);
                        // 将楼盘信息进行统一填充
                        $('#loupandetailhidden').val(dataProj);
                        $('.dropcont').css('display', 'none');
                    });
                });

                $('.dropcont').css('display', 'block');
                $('#loupan').click(function () {
                    $('.dropcont').css('display', 'none');
                });
            });
            // 对页面中进行正则匹配
            $('#form_submit').on('click', function () {
                // 这里进行必选项的正则匹配，return false
                var loupan = $('#loupanhidden').val();
                var strReg = /^[a-zA-Z0-9_]+$/;
                if (!loupan) {
                    alert('请选定楼盘');
                    return false;
                }
                var zuodong = $('#zuodong').val();
                if (!zuodong) {
                    alert('请填写座栋信息');
                    return false;
                } else if (!strReg.test(zuodong)) {
                    alert('请填写正确的楼栋信息');
                    return false;
                }
                var danyuan = $('#danyuan').val();
                if (!danyuan) {
                    alert('请填写单元信息');
                    return false;
                } else if (!strReg.test(danyuan)) {
                    alert('请填写正确的单元信息');
                    return false;
                }
                var fanghao = $('#fanghao').val();
                if (!fanghao) {
                    alert('请完善房号信息');
                    return false;
                } else if (!strReg.test(fanghao)) {
                    alert('请填写正确的房号信息');
                    return false;
                }
                var price = $('#price').val();
                // 针对面积和价格的双精度问题
                var priceReg = /^[-\+]?\d+(\.\d+)?$/;
                if (!price) {
                    alert('请完善价格信息');
                    return false;
                } else if (!priceReg.test(price)) {
                    alert('请填写正确的价格信息');
                    return false;
                }
                var area = $('#area').val();
                if (!area) {
                    alert('请完善面积信息');
                    return false;
                } else if (!priceReg.test(area)) {
                    alert('请填写正确的面积信息');
                    return false;
                }
                var fangdongtel = $('#fangdongtel').val();
                // 验证以1开头，控制位数
                var telReg = /^1[0-9]{10}$/;
                if (!fangdongtel) {
                    alert('请完善房东电话');
                    return false;
                } else if (!telReg.test(fangdongtel)) {
                    alert('请填写正确的房东电话');
                    return false;
                }
                var fangdongname = $('#fangdongname').val();
                if (!fangdongname) {
                    alert('请填写房东姓名');
                    return false;
                }
                $('form').submit();
            });
            // 这里是document结束
        });
    };
});