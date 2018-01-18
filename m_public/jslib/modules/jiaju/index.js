/**
 * Created by LXM on 15-5-6.
 * 单量更改于2015-9-9
 * 赵天亮更改于2016-8-3（zhaotianliang@fang.com）
 */
define('modules/jiaju/index', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        require.async(['modules/jiaju/indexAd']);
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        
        // 搜索用户行为收集20160114
        var page = 'mjjhomepage';
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            _ub.biz = 'h';
            _ub.location = 0;
            var b = 1;
            var pTemp = {
                'vmh.city': encodeURIComponent(vars.cityname),
                'vmg.page': page,
                'vmh.key': ''
            };
            var p = [];
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp]) {
                    p[temp] = pTemp[temp];
                }
            }
            _ub.collect(b, p);
        });
        // app下载
        (function (win) {
            var doc = document;
            var $ = win.$;
            var k = function () {
                this.listen();
            };
            k.prototype = {
                listen: function () {
                    var that = this;
                    $('#download').on('click', function (e) {
                        var u;
                        var l;
                        var url = vars.base + 'app/1.0.1/appopen.js';
                        var callback = function (openApp) {
                            var oa = openApp({
                                url: vars.mainSite + 'client.jsp?produce=ftxzx&city=' + vars.city,
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
                    } catch (e) {
                        console.log(e);
                    }
                }
            };
            new k();
        })(window);
        // 装修头条轮播
        var oTurnBox = $('.turnBox');
        if (!oTurnBox.children('a').length) {
            $('.jj-ttBox').hide();
        } else if (oTurnBox.children('a').length === 1) {
            return false;
        } else {
            oTurnBox.append(oTurnBox.children('a').eq(0).clone(true));
            var boxlen = oTurnBox.children('a').length;
            var iNow = 0;
            var timer = null;
            if (boxlen) {
                clearInterval(timer);
                timer = setInterval(function () {
                    iNow++;
                    if (iNow === boxlen - 1) {
                        setTimeout(function () {
                            iNow = 0;
                            oTurnBox.css({
                                top: '0px'
                            });
                        }, 600);
                    }
                    oTurnBox.animate({
                        top: -iNow * 50 + 'px'
                    }, 450);
                }, 3500);
            }
        }
        var $linkbox = $('.linkbox').parent();
        $linkbox.length && $('.jj-formList').find('input').on('focus blur', function () {
            $linkbox.toggle();
        });
        
        //ajax加载装修灵感
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexLgzj&city='+vars.city, function (data) {
            if ($.trim(data)) {
                $('#wapjiajusy_D13_01').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载每日专题
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexZt&city='+vars.city, function (data) {
            if ($.trim(data)) {
                $('#wapjiajusy_D14_01').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载聚优惠
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexJyh', function (data) {
            if ($.trim(data)) {
                $('#jyh').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载活动
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexActivity', function (data) {
            if ($.trim(data)) {
                $('#wapjiajusy_D15_01').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载装修热帖
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexBbs&city='+vars.city, function (data) {
            if ($.trim(data)) {
                $('#bbs').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载装修日记
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexDiary&city='+vars.city, function (data) {
            if ($.trim(data)) {
                $('#diary').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载热门图片
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexPic', function (data) {
            if ($.trim(data)) {
                $('#hotPic').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载问答
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexAsk', function (data) {
            if ($.trim(data)) {
                $('#askList').show().html(data);
                $('.lazyload').lazyload();
            }
        });
        //ajax加载资讯
        $.get(vars.jiajuSite + '?c=jiaju&a=ajaxIndexNewsList&city=' + vars.city, function (data) {
            if ($.trim(data)) {
                $('#newsList').show().html(data);
                $('.lazyload').lazyload();
            }
        });

    };
});