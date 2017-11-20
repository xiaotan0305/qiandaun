define('modules/ask/rich',['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        $(function () {
            $('.circleBar').each(function () {
                var num = $(this).find('.circle span').text() * 3.6;
                if (num <= 180) {
                    $(this).find('.pie2').css('-webkit-transform', 'rotate(' + -num + 'deg)');
                    $(this).find('.pie2').css('-moz-transform', 'rotate(' + -num + 'deg)');
                    $(this).find('.pie2').css('-ms-transform', 'rotate(' + -num + 'deg)');
                    $(this).find('.pie2').css('transform', 'rotate(' + -num + 'deg)');
                } else {
                    $(this).find('.pie2').css('-webkit-transform', 'rotate(-180deg)');
                    $(this).find('.pie2').css('-moz-transform', 'rotate(-180deg)');
                    $(this).find('.pie2').css('-ms-transform', 'rotate(-180deg)');
                    $(this).find('.pie2').css('transform', 'rotate(-180deg)');
                    $(this).find('.pie1').css('-webkit-transform', 'rotate(' + (-num - 180) + 'deg)');
                    $(this).find('.pie1').css('-moz-transform', 'rotate(' + (-num - 180) + 'deg)');
                    $(this).find('.pie1').css('-ms-transform', 'rotate(' + (-num - 180) + 'deg)');
                    $(this).find('.pie1').css('transform', 'rotate(' + (-num - 180) + 'deg)');
                }
            });
        });

        $('#level').click(function () {
            dltoggle('level');
        });
        $('#exp').click(function () {
            dltoggle('exp');
        });
        $('#richrule').click(function () {
            dltoggle('richrule');
        });
        $('#fastup').click(function () {
            dltoggle('fastup');
        });
        function dltoggle(id) {
            if ($('#' + id + ' dd').attr('class') === 'none') {
                $('.mBox dt').removeClass('arr-o').addClass('arr-c');
                $('.mBox dd').addClass('none');
                $('#' + id + ' dt').removeClass('arr-c').addClass('arr-o');
                $('#' + id + ' dd').removeClass('none');
            } else {
                $('#' + id + ' dt').removeClass('arr-o').addClass('arr-c');
                $('#' + id + ' dd').addClass('none');
            }
        }
        $(function () {
            $('footer').css('display','none');
        });
    };
});