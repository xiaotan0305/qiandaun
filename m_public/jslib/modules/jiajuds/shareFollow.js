define('modules/jiajuds/shareFollow', ['jquery'],function (require,exports,module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        $('input[type=hidden]').each(function (index,element) {
            vars[$(this).attr('data-id')] = element.value;
        });
        var scroller = $('#scroller');
        require.async('./iscroll.js',function () {
            var count = vars.count;
            var myScroll;
            var x = count * 75;
            scroller.find('ul').width(x);
            scroller.find('ul').height(scroller.find('ul').parent().height());
            myScroll = new IScroll('#scroller', {eventPassthrough: true, scrollX: true, scrollY: false, preventDefault: false});
        });
        var floatImg = $('.floatImg');
        scroller.on('click','li',function () {
            var floatimg = $(this).find('img').attr('data-original');
            floatImg.find('img').attr('src', floatimg);
            floatImg.show();
        });
        floatImg.on('click',function (e) {
            if (this === e.target) {
                $(this).hide();
            }
        });
        (function (win) {
            var doc = document,$ = win.$,k = function () {
                this.listen();
            };
            k.prototype = {
                listen: function () {
                    var that = this;
                    $('#down').bind('click', function (e) {
                        var u;
                        var l;
                        var url = vars.public + 'jslib/openapp/openapp.js',callback = function (openApp) {
                            typeof win.openApp === 'function' && (openApp = win.openApp);
                            var oa = openApp({
                                url: vars.mainSite + 'clientindex.jsp?company=1076',
                                log: that.log
                            });
                            oa.openApp();
                        };
                        e.preventDefault();
                        e.stopPropagation();
                        if (typeof win.seajs === 'object') {
                            win.seajs.use(url, callback);
                        } else {
                            u = doc.createElement('script');
                            l = doc.getElementsByTagName('head')[0];
                            u.async = true;
                            u.src = url;
                            u.onload = callback;
                            l.appendChild(u);
                        }
                        return false;
                    });
                },
                log: function (type) {
                    try {
                        $.get('/public/?c=public&a=ajaxOpenAppData', {
                            type: type,
                            rfurl: doc.referrer
                        });
                    } catch(e) {}
                }
            };
            new k();
        })(window);
    };
});