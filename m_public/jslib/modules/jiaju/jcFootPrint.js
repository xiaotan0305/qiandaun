define('modules/jiaju/jcFootPrint', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        if (!vars.localStorage) {
            return;
        }

        var getCurDetailType = function () {
            var url = location.href, type;
            if (url.indexOf('/jcinfo/') > -1 || url.indexOf('a=jcProductDetail') > -1) {
                type = 'product';
            } else if (url.indexOf('/shopinfo/') > -1 || url.indexOf('a=jcCompanyDetail') > -1) {
                type = 'shop';
            }
            return type;
        };
        var jcDetails = vars.localStorage.getItem('jcDetails');
        var jcid = $('#jcid').val().trim();
        var newData = $('#lacc').val().trim();

        if (jcDetails) {
            // 如果不是建材产品详情或者建材店铺详情，则返回空
            var type = getCurDetailType();
            if (type !== 'product' && type !== 'shop') {
                return;
            }
            jcDetails = decodeURIComponent(jcDetails);
            if (jcDetails.indexOf(type + '@@' + jcid) > -1) {
                return;
            }
            var detailsArr = jcDetails.split('||');
            var detailsArrLen = detailsArr.length;

            if (detailsArrLen >= 3) {
                detailsArr = detailsArr.slice(0, 2);
            }
            newData = encodeURIComponent(newData + '||' + detailsArr.join('||'));
        } else {
            newData = encodeURIComponent(newData);
        }
        vars.localStorage.setItem('jcDetails', newData);
    };
});