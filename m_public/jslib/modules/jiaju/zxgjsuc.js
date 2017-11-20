/**
 * Created by LXM on 2015/9/18.
 * 装修计算器-申请免费报价-申请成功--zxgjsuca.html
 *
 */
define('modules/jiaju/zxgjsuc', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        var strurl = window.location.search;
        $(document).ready(function () {
            if (strurl.indexOf('?') !== -1) {
                if (strurl.indexOf('src=client') !== -1) {
                    $('header').css('display', 'none');
                }
            }
            // $('.hLeft a').attr('href', vars.jiajuUrl);
        });
    };
});