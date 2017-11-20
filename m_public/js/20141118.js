/*
*根据城市使用房天下app下载浮层的不同js文件
* 规则是:'bj'和'sh'用wa20150301
* 'cd','wuhan','gz','sz','tj','cq','suzhou','hz','nanjing'用wa20150302
* 其他城市用wa20150303
*/
!(function(g, i) {
    var e, a, c, h, f, b;
    var d = g.navigator.userAgent; //判断是否为小米黄页
    if(/MiuiYellowPage/i.test(d)) return ;
    var qstring = g.location.search.substr(1);
    var start = qstring.indexOf('sf_source');
    if(start > -1 && (qstring.indexOf('qqbrowser') > -1 || qstring.indexOf('bd_3g') > -1)) {
        return;
    }
    var abnormal = g.browser_abnormal||g.seajs && g.seajs.data.vars.browser_abnormal;
    if(!!abnormal){
        return;
    }
    c = new Date(), h = g.lib && g.lib.city || g.seajs && seajs.data.vars.city || g.city;
    f = "" + c.getFullYear() + c.getMonth() + c.getDate()+c.getHours();
    b = '03';
//    if(h == 'bj' || h == 'sh'){
//        b = '01';
//    } else if (['cd','wuhan','gz','sz','tj','cq','suzhou','hz','nanjing'].indexOf(h)>-1){
//        b = '02';
//    }
    e = i.createElement("script");
    e.async = true;
    var domain = g.seajs && seajs.data.vars.public;
    e.src = domain + "js/wa201503" + b + ".js?_" + f;
    a = i.getElementsByTagName("head")[0];
    a.appendChild(e);
})(window, document);
/*
 QQ浏览器：http://m.fang.com/?sf_source=qqbrowser_mz
 腾讯房产频道：http://m.fang.com/?sf_source=bd_3g.qq_dh
 http://m.fang.com/?sf_source=bd_3g.qq_dj
 */