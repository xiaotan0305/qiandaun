/** 二手房特价房OpenHouse --一元看房活动，确认预约信息页面
 * Create by liuxinlu on 2017/04/24.
 * @file 提交房源和用户信息
 */
define('modules/esf/yyhdOrderInfo', ['iscroll/2.0.0/iscroll-lite'], function (require, exports, module) {
   'use strict';
    module.exports = function(){
        // jquery对象
        var $ = require('jquery');
        // 页面数据对象
        var vars = seajs.data.vars;
        var iscrollCtrl = require('iscroll/2.0.0/iscroll-lite');
        var box = document.querySelector('.raincont');
        var boxTop = box.offsetTop;
        var dHeight= document.body.offsetHeight - boxTop;
        box.style.height = dHeight - 60 + 'px';
        box.style.overflow = 'auto';
        new iscrollCtrl('#yyCon', {scrollY: true,scrollX: false,click:true,preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}});
        // 查询支付情况
        $('.arr-jump').click(function() {
                $.ajax({
                    url: vars.esfSite + '?a=ajaxYyhdPayOrder',
                    data:{
                        orderno: vars.orderno
                    },
                    success: function (data) {
                        if (data) {
                            if (data.errcode == 100) {
                                if (data.orderstatus === "1" || data.orderstatus === "3") {
                                    if (data.cashParam) {
                                        $.each(data.cashParam, function (index, val) {
                                            $('#' + index).val(val);
                                        });
                                        $('#form').submit();
                                    }
                                } else {
                                    alert(data.errmsg);
                                    window.location.href = location.protocol + vars.esfSite +  vars.city + '/PayReturn_' + vars.orderno + '.html';

                                }
                            }
                        }
                    }
                });
        });
    };
});