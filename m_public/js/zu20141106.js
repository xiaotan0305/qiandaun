/*
*根据城市使用对应租房app下载浮层js文件
*规则是:北京和上海用wa2015031901
* 广州、深圳、武汉、重庆、成都、长沙、南京、天津、苏州、西安、青岛、沈阳、杭州、石家庄、东莞、济南、大连、无锡、郑州、南昌、昆明、长春、南宁用wa2015031902
* 其他城市用wa2015031903
*/
!(function(g, i) {
    var e, a, c, h, f, b;
    var d = g.navigator.userAgent; //判断是否为小米黄页
    if(/(MiuiYellowPage|NewsArticle)/i.test(d)) return ;
    var qstring = g.location.search.substr(1);
    var start = qstring.indexOf('sf_source');
    if(start > -1 && (qstring.indexOf('qqbrowser') || qstring.indexOf('bd_3g'))) {
        return;
    }
    var abnormal = g.browser_abnormal||g.seajs && g.seajs.data.vars.browser_abnormal;
    if(!!abnormal){
        return;
    }
    c = new Date(), h = g.lib && g.lib.city || g.seajs && seajs.data.vars.city || g.city;
    var cMonth = c.getMonth() + 1,cDate = c.getDate();
    var monthDay = cMonth < 10 ? '0' + cMonth : cMonth;
    var gDate = cDate < 10 ? '0' + cDate : cDate;
    f = '' + c.getFullYear() + monthDay + gDate + c.getHours();
    b = '03';
    if(h == 'bj' || h == 'sh'){
        b = '01';
    } else if (['gz','sz','wuhan','cq','cd','cs','nanjing','tj','suzhou','xian','qd','sy','hz','sjz','dg','jn','dl','wuxi','zz','nc','km','changchun','nn'].indexOf(h)>-1){
        //广州、深圳、武汉、重庆、成都、长沙、南京、天津、苏州、西安、青岛、沈阳、杭州、石家庄、东莞、济南、大连、无锡、郑州、南昌、昆明、长春、南宁
        b = '02';
    }
    e = i.createElement("script");
    e.async = true;
    var domain = g.seajs && seajs.data.vars.public;
    e.src = domain + "js/wa20150319" + b + ".js?_" + f;
    a = i.getElementsByTagName("head")[0];
    a.appendChild(e);
})(window, document);
/*
 QQ浏览器：http://m.fang.com/?sf_source=qqbrowser_mz
 腾讯房产频道：http://m.fang.com/?sf_source=bd_3g.qq_dh
 http://m.fang.com/?sf_source=bd_3g.qq_dj
 */