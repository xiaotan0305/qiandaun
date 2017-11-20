define('modules/xf/huXingList', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $('html,body').animate({
        scrollTop: 0
    }, 500);
    var salings = vars.teHuiTotal;
    var sals = salings.split('|');
    for (var i = 0, l = sals.length; i < l; i += 1) {
        var sal = sals[i].split(';;');
        if (sal[1] && sal[1] !== '0') {
            $('#' + sal[0]).html(sal[1] + '套可售');
        }
    }
    $('.huxingdetail').on('click', function () {
        var city = $(this).attr('city');
        var hxid = $(this).attr('hxid');
        var picid = $(this).attr('picid');
        var newcode = $(this).attr('newcode');
        var c = $('#' + picid).text();
        c = c.replace('套可售', '');
        window.location.href = '/xf.d?m=huXingInfo&city=' + city + '&hxid=' + hxid + '&newcode=' + newcode + '&count=' + c;
    });
});