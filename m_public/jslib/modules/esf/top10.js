define('modules/esf/top10',['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        
        $('.mt10').last().hide();
        $('.left').hide();
        require.async('lazyload/1.9.1/lazyload', function () {
            $('img[data-original]').lazyload();
        });
    };
});