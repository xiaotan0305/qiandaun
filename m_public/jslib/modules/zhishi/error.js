define('modules/zhishi/error', function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        setTimeout(function () {
            window.location.href = vars.jumpurl;
        }, 2000);
    };
});