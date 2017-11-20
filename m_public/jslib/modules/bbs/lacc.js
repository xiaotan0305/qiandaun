define('modules/bbs/lacc', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        if (!vars.localStorage)return;
        // 常逛论坛处理，最多保留最近常逛的6个论坛
        var bbsLastAcc = vars.localStorage.getItem('bbs_last_acc');
        var lastAcc = $('#lacc').val();
        if (bbsLastAcc) {
            bbsLastAcc = decodeURIComponent(bbsLastAcc);
            if (bbsLastAcc.indexOf(lastAcc) > -1) {
                return;
            }
            var arrBbs = bbsLastAcc.split('||');
            var arrBbsL = arrBbs.length;
            if (arrBbsL >= 6) {
                arrBbs = arrBbs.slice(0, 5);
            }
            lastAcc = encodeURIComponent(arrBbs.join('||') + '||' + lastAcc);
        } else {
            lastAcc = encodeURIComponent(lastAcc);
        }
        vars.localStorage.setItem('bbs_last_acc', lastAcc || '');
    };
});