/*
 *房天下app下载浮层
 * 小城市用,'hz','tj','suzhou','cd','nanjing','wuhan','cq', 'qd','dl','dg','jn', 'sjz', 'zz',
 *'changchun', 'cs','fz','km','nc','nanning','sy', 'wuxi', 'xian','zh','xm'
 * 大城市的用20150301
 * 除了这些城市的其他的用20150303
 */
!function(g, h) {
    function b(j) {
        var i, k = new RegExp("(^| )" + j + "=([^;]*)(;|$)");
        if (i = g[c[11]].cookie.match(k)) {
            return decodeURIComponent(i[2])
        } else {
            return null
        }
    }
    function d(i, j, l) {
        var k = new Date();
        isNaN(l) && (l = 3);
        k.setTime(k.getTime() + l * 24 * 60 * 60 * 1000);
        g[c[11]].cookie = i + "=" + encodeURIComponent(j) + "; path=/; expires=" + k.toGMTString()
    }
    var seajs = g.seajs;
    var vars = seajs.data.vars;
    var existFlag = vars.cd_ver;
    var c = [existFlag, "iClose", "smartDom", "openApp", "preventDefault", "stopPropagation", "mainBody", "floatApp", "style", "createElement", "append", "document", "class", "push", ""], f = g[c[11]], e = g.$, a = function() {
        this.calClose() || this.createHtml()
    };
	c[7] = (function(){var zimu='abcdefghijklmnopqrstuvwsyz';return zimu.charAt(Math.floor(Math.random()*26))+zimu.charAt(Math.floor(Math.random()*26))+'-'+Math.floor(Math.random()*10000)})();
	c[14] = c[7]+'x';
    a.prototype = {constructor: a,calClose: function() {
        var i = b(c[0]);
        if (i) {
            this[c[1]] = !0;
            return this[c[1]]
        }
    },template: function() {
        var i = [],appImgUrl,title,downtitle= '',btnCon,downBtnCon= '',curModel,curChannel;
        curChannel = (g.lib.channelsConfig && g.lib.channelsConfig.currentChannel)?g.lib.channelsConfig.currentChannel:'';
        title = '\u4e8c\u624b\u623f\u4f63\u91d1\u53ea\u6536\u0030\u002e\u0035\u0025</p><p>\u4e0b\u8f7d\u0041\u0050\u0050\uff0c\u72ec\u4eab\u66f4\u591a\u4e70\u623f\u4f18\u60e0';
        appImgUrl = vars.public + 'img/sf-72.png';
        btnCon = '\u7acb\u5373\u4e0b\u8f7d';
        if (g.hasOwnProperty('seajs')) {
            curModel = seajs.data.vars.action;
            if (seajs.data.vars.channelsConfig) {
                curChannel = seajs.data.vars.channelsConfig.currentChannel
            }
		}else if (g.lib.action) {
            curModel = g.lib.action;
        }
        if(curModel === 'xflist' &&curChannel === 'xf') {
            downtitle = '\u623f\u4ef7\u90a3\u4e48\u9ad8\uff0c\u641c\u623f\u9001\u7ea2\u5305</p><p>\u4e92\u8054\u7f51\u8d2d\u623f\u65b0\u6a21\u5f0f';
            downBtnCon ='\u4e0b\u8f7d\u9886\u7ea2\u5305';
        }else if(curModel === 'main' &&curChannel === 'index') {
            downtitle = '\u0020\u4e8c\u624b\u623f\u4f63\u91d1\u4ec5\u6536\u0030\u002e\u0035\u0025</p><p>\u4e0b\u8f7d\u0061\u0070\u0070\uff0c\u9886\u7ea2\u5305';
            downBtnCon ='\u7acb\u5373\u4e0b\u8f7d';
        }
        if(downtitle && downtitle.length>0) {
            title = downtitle;
        }
        if (downBtnCon && downBtnCon.length>0) {
            btnCon = downBtnCon;
        }
        i[c[13]]('<div class="'+c[7]+'">');
        i[c[13]]('<div>')
        i[c[13]]('<a href="#box" class="'+c[14]+'">');
        i[c[13]]('<span class="btn">'+btnCon+'</span>');
        i[c[13]]('<img src="'+appImgUrl+'" width="36">');
        i[c[13]]('<div class="text item2">');
        i[c[13]]('<p>'+title+'</p>');
        i[c[13]]('</div>');
        i[c[13]]('</a>');
        i[c[13]]('<a href="#off" class="off"><span>x</span></a>');
        i[c[13]]('</div>');
        i[c[13]]('</div>');
        return i.join("")
    },createHtml: function() {
        if (!this[c[1]]) {
            var l = this.template(), k = f[c[9]](c[8]), o = f[c[9]]("div"), n = [""];
            o.innerHTML = l, this[c[2]] = o.querySelector("." + c[7]);
            n[c[13]]("{ height:44px;}");
            n[c[13]]("> div{position: fixed; left:0; bottom:0; background:rgba(0,0,0,.8); width:100%; height:44px; overflow: hidden;z-index:5;}");
            n[c[13]]("."+c[14]+"{ display: block; width:100%;}");
            n[c[13]]("img{ float: left; margin:6px 9px 6px 20px; width:32px;}");
            n[c[13]](".text{ color:#fff;line-height:26px;padding:9px 0;font-size:11px;color:#fff;}");
            n[c[13]](".text p{ white-space: nowrap; text-overflow:ellipsis; overflow: hidden;}");
            n[c[13]](".text.item2{line-height:13px;}");
            n[c[13]](".btn{ float: right; width:80px; height:44px; line-height:44px; background:#de3031; color:#ffffff; font-size: 13px; text-align:center;}");
            n[c[13]](".off{ position: absolute; left: -20px; top: -20px; display: block; width: 40px; height: 40px; line-height: 40px; background: #000; border-radius: 50%; color:#b3b3b3 !important; font-size: 14px; text-align: center; clip: rect(20px,40px,40px,20px);}");
            n[c[13]](".off span{ position: relative; left: 8px; top: 7px;}");
            k.innerHTML = n.join("\n." + c[7] + " ");
            var j = e(f.body);
            j[c[10]](k), j[c[10]](this[c[2]]), this.listen();
        }
    },show: function() {
        this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "block")
    },hide: function() {
        this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "none")
    },listen: function() {
        if (!this[c[1]]) {
            var i = this, j = e(i[c[2]]);
            j.find("a.off").bind("click", function(k) {
                k[c[4]](), k[c[5]]();
                // 点击下载浮层关闭按钮纪录日志 type值为3
                i.foo(), i.log(3)
            });
            j.find('a.' + c[14]).bind("click", function(o) {
                var n, k, m = seajs.data.vars.public+"jslib/app/1.0.1/appopen.js", p = function(q) {
                    typeof g[c[3]] === "function" && (q = g[c[3]]);
                    var appUrl,company;
                    if (g.lib.action && g.lib.action === 'xflist') {
                        appUrl = seajs.data.vars.mainSite+"clientindex.jsp?company=1178";
                        company = '1178';
                    } else {
                        appUrl = seajs.data.vars.mainSite+"clientindex.jsp?company=1109";
                        company = '1109';
                    }
                    var appstoreUrl ='https://itunes.apple.com/cn/app/soufun/id413993350?mt=8&ls=1';
                    var l = q({url: appUrl, appstoreUrl:appstoreUrl, log: i.log, company: company, app: 'sfapp'});
                    l[c[3]]()
                };

                o[c[4]](), o[c[5]]();
                if (typeof g.seajs === "object") {
                    g.seajs.use(m, p)
                } else {
                    n = f[c[9]]("script"), k = f.getElementsByTagName("head")[0], n.async = true, n.src = m, n.onload = p, k[c[10] + "Child"](n)
                }
            })
        }
    },log: function(i,company, app) {
        e.get("/public/?c=public&a=ajaxOpenAppData", {type: i,rfurl: f.referrer,company:company,app:app})
    },foo: function() {
        this.hide();
        try {
            d(c[0], 1, 2), this.calClose()
        } catch (i) {
        }
    }};
    new a()
}(self, self.lib || (self.lib = {}));