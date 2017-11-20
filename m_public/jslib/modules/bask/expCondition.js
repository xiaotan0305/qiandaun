define('modules/bask/expCondition',['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        $('#level,#exp').on('click',function () {
            var $that = $(this);
            if (!$that.find('a').hasClass('on')) {
                $('.mBox a').removeClass('on');
                $('.mBox table').hide();
                $('.t3').hide();
                $that.find('a').addClass('on');
                $that.find('table').show();
            } else {
                $that.find('a').removeClass('on');
                $that.find('table').hide();
            }
        });
        $('#richrule').on('click',function () {
            var $that = $(this);
            var thisA = $that.find('a');
            if (!thisA.hasClass('on')) {
                $('.mBox a').removeClass('on');
                $('.mBox table').hide();
                thisA.addClass('on');
                $('.t3').show();
            } else {
                thisA.removeClass('on');
                $('.t3').hide();
            }
        });
    };
});