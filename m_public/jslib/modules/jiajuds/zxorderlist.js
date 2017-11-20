define('modules/jiajuds/zxorderlist', ['jquery'],function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        vars.totalcount = 1;
        // 查看更多app下载
        (function (win) {
            var doc = document, $ = win.$, k = function () {
                this.listen();
            };
            k.prototype = {
                listen: function () {
                    var that = this;
                    $('#appDownload').bind('click', function (e) {
                        var u, l, url = vars.public + 'jslib/openapp/openapp.js', callback = function (openApp) {
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
                    } catch(e) {
                    }
                }
            };
            new k();
        })(window);
    };
});