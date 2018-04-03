
define('modules/jiaju/broCompanyList',[
    'jquery',
    'lazyload/1.9.1/lazyload'
],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        $('#datatimeout').on('click', function () {
            window.location.reload();
        });
    };
});

