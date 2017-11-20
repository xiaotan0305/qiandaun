define('modules/myesf/statisticFlow', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // var $ = require('jquery');
        var dctc = _dctc || {};
        dctc._account = dctc._account || ['UA-24140496-1', 'UA-24140496-20'];
        dctc.bid = 1;
        dctc.isNorth = dctc.isNorth || 'N';
        (function () {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'http://js.soufunimg.com/count/load.min.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        })();
    };
});