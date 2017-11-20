/*
 *问答频道
 *根据不同城市使用不同的房天下浮层js文件
 * @author liuxinl@fang.com 修改下载规则
 * 所有城市下载浮层统一使用2015032302
 */
!(function(g, i, e, a, c, h, f, b) {
	var d = g.navigator.userAgent;
    // 判断是否为小米黄页
    if(/MiuiYellowPage/i.test(d)) return ;
    c = new Date(), h = g.lib && g.lib.city || g.seajs && seajs.data.vars.city || g.city;
    var cMonth = c.getMonth() + 1,cDate = c.getDate();
    var monthDay = cMonth < 10 ? '0' + cMonth : cMonth;
    var gDate = cDate < 10 ? '0' + cDate : cDate;
    f = '' + c.getFullYear() + monthDay + gDate + c.getHours();
    b = '02';
    e = i.createElement("script");
    e.async = true;
    var damain = g.seajs && seajs.data.vars.public;
    e.src = damain + "js/wa20150323" + b + ".js?_" + f;
    a = i.getElementsByTagName("head")[0];
    a.appendChild(e);
})(window, document);
