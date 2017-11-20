define('modules/jinrong/nav', ['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var header = $('header');
        var iconav = header.find('a.dh');
        var nav = $('#nav');
        var newMsg = $('#newMsgNum');
        var btnClose = nav.find('a').filter(':last');
        var navOpen = function () {
            if (nav.is(':hidden')) {
                nav.show();
                newMsg.hide();
            }else {
                nav.hide();
                var newMsgNum = parseInt($('#newMsgNum').html());
                if (newMsgNum < 100 && newMsgNum > 0) {
                    newMsg.show();
                }
            }
        };
        iconav.add(btnClose).click(function () {
            navOpen();
        });
    };
});