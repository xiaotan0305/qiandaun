define('modules/xf/xfinfodtlist',['jquery','util/util'], function (require,exports,module) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;

    //  click-------start
    var click = function () {
        $('#showmore').click(function () {
            $('.showmore').hide();
            $('.showless').show();$('.moredongtai').show();
        });
        $('#showless').click(function () {
            $('.showless').hide();
            $('.showmore').show();$('.moredongtai').hide();
        });
    };
    //  click-------end

    module.exports = {
        init: function () {
            click();
        }
    };
});