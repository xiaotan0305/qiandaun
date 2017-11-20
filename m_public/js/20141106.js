/*
 *根据不同城市使用不同的房天下浮层js文件
 * 规则是:'bj' 'sh' 'gz' 'sz'四个城市用wa20150301
 * 'hz','tj','suzhou','cd','nanjing','wuhan', 'qd','dl','dg','jn', 'sjz', 'zz',
 *'changchun', 'cs','fz','km','nc','nanning','sy', 'wuxi', 'xian','zh','xm'这些城市用wa20150302
 *其他城市用wa20150303
 */
!(function (g, i) {
    var e, a, c, h, f, b;
    var d = g.navigator.userAgent;
    // 判断是否为小米黄页
    if (/(MiuiYellowPage|NewsArticle)/i.test(d)) return;
    var qstring = g.location.search.substr(1);
    var start = qstring.indexOf('sf_source');
    if (start > -1 && (qstring.indexOf('qqbrowser') > -1 || qstring.indexOf('bd_3g') > -1)) {
        return;
    }
    if(g.document.referrer.indexOf('baidu.com')>-1){
    	return;
    }
    var seajs = g.seajs;
    if (seajs) {
        var data = seajs.data;
        var abnormal = g.browser_abnormal || data.vars.browser_abnormal;
        if (abnormal) {
            return;
        }
        seajs.use([data.vars.public + 'js/wa20150303.js']);
    }

    // h:城市
    // c = new Date(), h = g.lib && g.lib.city || data && data.vars.city || g.city;
    // js版本号vars.img_ver
    // var fVersion = g.seajs && seajs.data.vars.img_ver;
    // var cMonth = c.getMonth() + 1,cDate = c.getDate();
    // var monthDay = cMonth < 10 ? '0' + cMonth : cMonth;
    // var gDate = cDate < 10 ? '0' + cDate : cDate;
    // 之前使用当前时间(2016031614)作为版本号,精确到分钟
    //f = '' + c.getFullYear() + monthDay + gDate + c.getHours();
//    b = '03';
//    if (h === 'bj' || h === 'sh' || h === 'gz' || h === 'sz') {
//        b = '01';
//    } else if (['hz','tj','suzhou','cd','nanjing','wuhan', 'qd','dl','dg','jn', 'sjz', 'zz',
//                'changchun', 'cs','fz','km','nc','nanning','sy', 'wuxi', 'xian','zh','xm'].indexOf(h) > -1) {
//        b = '02';
//    }

    /*e = i.createElement('script');
     e.async = true;
     var domain = g.seajs && seajs.data.vars.public
     e.src = domain + 'js/wa201503' + b + '.js?_' + fVersion;
     a = i.getElementsByTagName('head')[0];
     a.appendChild(e);*/
})(window, document);

/*
 QQ浏览器：http://m.fang.com/?sf_source=qqbrowser_mz
 腾讯房产频道：http://m.fang.com/?sf_source=bd_3g.qq_dh
 http://m.fang.com/?sf_source=bd_3g.qq_dj
 */