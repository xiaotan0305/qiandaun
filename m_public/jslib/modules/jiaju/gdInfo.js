/**
 * Created by Young on 15-7-26.
 */
define('modules/jiaju/gdInfo', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        //惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // app下载
        (function (win) {
            var doc = document,
                $ = win.$,
                k = function () {
                    this.listen();
                };
            k.prototype = {
                listen: function () {
                    var that = this;
                    $('#download').bind('click', function (e) {
                        var u, l, url = vars.public + 'jslib/app/1.0.1/appopen.js',
                            callback = function (openApp) {
                                if (typeof win.openApp === 'function') {
                                    (openApp = win.openApp);
                                }
                                var oa = openApp({
                                    url: '//m.fang.com/client.jsp?produce=ftxzx',
                                    log: that.log,
                                    appurl: 'data/{"address":"home"}',
                                    href: 'fangtxzx://',
                                    appstoreUrl: 'https://itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8'
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
                    } catch (e) {}
                }
            };
            new k();
        })(window);

        // 页面访问失败，点击重新加载
        $('#reload').on('click', function () {
           location.reload();
        });

        var page = 'mjjsitepage';
        function yhxw(type) {
            _ub.city = vars.cityname;
            // 业务---h代表家居
            _ub.biz = 'h';
            // 家居不分南北方，都传0
            _ub.location = 0;
            // 用户动作（浏览0、打电话31、在线咨询24、分享22、收藏21）
            var b = type;
            var p = {
                'vmh.siteid': vars.caseid,
                'vmg.page': page
            };
            // 收集方法
            _ub.collect(b, p);
        }
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            yhxw(0);
        });
    };
});