/*
 *租房帮app下载浮层
 * 其他城市用
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
    var existFlag = seajs && seajs.data.vars.cd_ver;
    var c = [existFlag, "iClose", "smartDom", "openApp", "preventDefault", "stopPropagation", "mainBody", "floatApp", "style", "createElement", "append", "document", "class", "push",""], f = g[c[11]], e = g.$, a = function() {
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
        var i = [];
        i[c[13]]('<div class="'+c[7]+'">');
        i[c[13]]('<div>')
        i[c[13]]('<a href="#box" class="'+c[14]+'" id="wapzfsy_D05_04">');
        i[c[13]]('<span class="btn">\u7acb\u5373\u4e0b\u8f7d</span>');
        i[c[13]]('<img src="'+seajs.data.vars.public+'img/zf72-72.png" width="36">');
        i[c[13]]('<div class=" text item2">');
        i[c[13]]('<p>\u79df\u623f\u0030\u4e2d\u4ecb\u8d39<br>\u4e00\u5bf9\u4e00\u5168\u7a0b\u5e26\u770b</p>');
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
                i.foo(), i.log(3)
            });
            j.find('a.' + c[14]).bind("click", function(o) {
                var n, k, m = seajs.data.vars.public+"jslib/app/1.0.1/appopen.js", p = function(q) {
                    typeof g[c[3]] === "function" && (q = g[c[3]]);
                    var config_url =(/iPad|iPhone|iPod/i.test(g.navigator.userAgent))?'soufunzfrent://':"com.soufun.zf://";
					var appstoreUrl ='https://itunes.apple.com/cn/app/zu-fang-bang-sou-fang-wang/id626698195?mt=8';
                    var l = q({url: seajs.data.vars.mainSite+"client.jsp?city=bj&produce=soufunrent&os=",href:config_url,appurl:'soufunrent',log: i.log,appstoreUrl:appstoreUrl});
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
    },log: function(i) {
        e.get("/public/?c=public&a=ajaxOpenAppData", {type: i,rfurl: f.referrer})
    },foo: function() {
        this.hide();
        try {
            d(c[0], 1, 2), this.calClose()
        } catch (i) {
        }
    }};
    new a()
}(self, self.lib || (self.lib = {}));