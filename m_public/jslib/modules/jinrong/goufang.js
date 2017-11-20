define('modules/jinrong/goufang', ['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('#houseApply').click(function () {
            var pId = $('#pId').val();
            var cityEName = $('#cityEName').val();
            var money = $('#applyMoney').val();
            if (money === '') {
                money = $('#loan').val();
            }
            var month = $('#applyMonth').val();
            if (month === '') {
                month = $('#month').val();
            }
            var proName = $('#proName').val();
            var instName = $('#instName').val();
            window.location = vars.jinrongSite + '?c=jinrong&a=houseapply&pId=' + pId + '&pType=2&lType=goufang&cityEName=' + cityEName
                + '&loanMoney=' + money + '&loanMonth=' + month + '&proName=' + proName + '&instName=' + instName + '&r=' + Math.random();
        });
        $('#calculator').click(function () {
            var pId = $('#pId').val();
            var money = $('#applyMoney').val();
            if (money === '') {
                money = $('#loan').val();
            }
            var month = $('#applyMonth').val();
            if (month === '') {
                month = $('#month').val();
            }
            $.ajax({url: vars.jinrongSite + '?c=jinrong&a=ajaxGetGoufang&id=' + pId + '&money=' + money + '&month=' + month + '&r='
            + Math.random(),success: function (moredata) {
                if (moredata) {
                    $('#loanhouse').html(moredata);
                }
            }});
        });
        var applyDefaultId = {applyMoney: 'loan',applyMonth: 'month'};
        $('#loanhouse').on('click','input[type=tel]',function () {
                $(this).val('');
            }).on('blur','input[type=tel]',function () {
                var self = $(this);
                if (self.val() === '') {
                    self.val($('#' + applyDefaultId[self.attr('id')]).val());
                }
            });
    };
});