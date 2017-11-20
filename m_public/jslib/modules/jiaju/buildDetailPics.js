/**
 * Created by LXM on 2015/9/16.
 * Modified by LXM on 15.9.18
 */
define('modules/jiaju/buildDetailPics', ['jquery','swipe/2.0/swipe'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index, element) {
            vars[$(this).attr('data-id')] = element.value;
        });

        $('.hCenter').html('<a>' + 1 + '/' + vars.all + '</a>');
        require.async('swipe/2.0/swipe', function (Swipe) {
            window.mySwipe = new Swipe(document.getElementById('divHeight'), {
                speed: 500,
                continuous: false,
                callback: function (a) {
                    var textindex = a + 1;
                    if (textindex <= vars.all) {
                        $('.hCenter').html('<a>' + textindex + '/' + vars.all + '</a>');
                    }
                }
            });
        });

        var body = $('body');
        body.css('background-color', '#000000');
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
            body.css('height', window.innerHeight + 100);
            window.scrollTo(0, 1);
            body.css('height', window.innerHeight);
        }

        function changPic() {
            var d = document.documentElement.clientWidth;
            var a = document.documentElement.clientHeight;
            var b = document.getElementById('divHeight');
            var e = b.getElementsByTagName('li');
            for (var c = 0; c < e.length; c++) {
                e[c].style.width = d + 'px';
                e[c].getElementsByTagName('img')[0].style.maxWidth = d + 'px';
                if (bua.indexOf('iphone') >= 0 || bua.indexOf('ipod') >= 0) {
                    if (a <= 480) {
                        e[c].style.height = a - 100 + 'px';
                        e[c].getElementsByTagName('img')[0].style.maxHeight = a - 100 + 'px';
                    } else {
                        e[c].style.height = a - 50 + 'px';
                        e[c].getElementsByTagName('img')[0].style.maxHeight = a - 50 + 'px';
                    }
                } else {
                    e[c].style.height = a - 100 + 'px';
                    e[c].getElementsByTagName('img')[0].style.maxHeight = a - 100 + 'px';
                }
            }
        }
        window.onload = changPic;
        window.onresize = changPic;
    };
});