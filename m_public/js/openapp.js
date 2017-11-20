/*
*打开房天下app
* 早期版本,新版本autoopenapp
*/
!function(a, b) {
    "use strict"
    function c() {
        var a = {}, b = location.search;
        if (b) {
            var c = b.slice(1).split("&");
            if (c.length)
                for (var d = 0; d < c.length; d++)
                    if (c[d] && -1 != c[d].indexOf("=")) {
                        var e = c[d].split("=");
                        a[e[0]] = e[1]
                    }
        }
        return a
    }
    function d(a) {
        var b = i.createElement("img");
        b.style.cssText = "display:none", b.src = a, i.body.appendChild(b)
    }
    function e(a) {
        a = a || {};
        var b = a.apuri || a.ap_uri;
        if (b) {
            var c = {};
            c.logtype = 2, c.apuri = b, c.cache = parseInt((Math.random() + 1) * Date.now());
            var e = [];
            for (var f in c)
                e.push(f + "=" + encodeURIComponent(c[f]));
            //d("http://wgo.mmstat.com/sb.1.1?" + e.join("&"))
        }
    }
    function f() {
        var a = c(), b = a.ttid, d = /[^@]+\@soufun\_(iphone|android|apad|ipad)\_[\d.]+/i;
        return b = b ? decodeURIComponent(b) : "", d.test(b)
    }
    function g() {
        return !!a.navigator.userAgent.match(/WindVane/)

    }
    function h() {
        return !!a.navigator.userAgent.match(/AlipayClient/i)
    }
    var i = a.document, j = i.cookie.match(/(?:^|\s)cna=([^;]+)(?:;|$)/);
    j && (j = j[1]);
    var k = i.createElement("frame"), l = function(a) {
        var b = this, c = navigator.standalone, d = navigator.userAgent;
        return null != d.match(/iPhone|iPod|iPad/i) ? (this.platform = "ios", this.isIpad = null != d.match(/iPad/i)) : null != d.match(/Android/i) ? null != d.match(/Mobile/i) && (this.platform = "android", this.isChrome = null != d.match(/Chrome/i) && null == d.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i)) : null != d.match(/Linux/i) && (this.platform = "android"), !this.platform || c ? (this.invaliable = !0, null) : (this.init(a) && (this.create(), window.onblur = function() {
            clearTimeout(b.timeload), b.timeload = null
        }), this)
    };
    l.prototype = {constructor: l,init: function(a) {
        var b = this.options = a, d = b.isInstance || function() {
            return g() || f() || h()
        };
        if (d())
            return this.invaliable = !0, null;
        a.version || (a.version = "v1"), this.cover = b.cover || !1, this.isDownload = b.download || !1, this.timeout = b.timeout || 1e3;
        var e = b.from || "h5", k = b.crossplat || !1;
        if ("ios" != this.platform || k) {
            var l = b.url || "//download.3g.fang.com/soufun_android_30007.apk";
            l += -1 == l.indexOf("?") ? "?" : "&", l += location.search.slice(1), this.bannerUrl = l
        } else
            this.bannerUrl = b.appstoreUrl || ("https://itunes.apple.com/cn/app/soufun/id413993350?mt=8&ls=1");
        if (b.href) {
            var m = b.href, n = c(), o = i.getElementById("buried"), p = n.ttid || o && o.value, q = n.refid, r = n.ali_trackid, s = n.pid, t = n.actparam, u = n.actname, v = n.ad_id, w = n.source_type, x = {from: e};
            if (p && (x.ttid = p), q && (x.refid = q), r && (x.ali_trackid = r), s && (x.pid = s), t && (x.actparam = t), u && (x.actname = u), v && (x.ad_id = v), w && (x.source_type = w), x.url = encodeURIComponent(location.href.split(/[?#]/)[0]), j && (x.h5_uid = j), x.ap_uri = "", b.point)
                for (var y in b.point)
                    x[y] = b.point[y];
            if (x = encodeURIComponent(JSON.stringify(x)), m = m.split("#"), -1 == m[0].indexOf("?") ? m[0] += "?" : m[0].indexOf("?") != m.length - 1 && (m[0] += "&"), m[0] += "point=" + x, m = m.join("#"), m = -1 != m.indexOf("://") ? m : "soufun://" + m, this.isChrome) {
                var z = m.split("://"), A = z[0], B = z[1], C = b.bag || "com.soufun.soufun";
                m = "intent://" + B + "#Intent;scheme=" + A + ";package=" + C + ";end"
            }
            this.paramUrl = m
        }
        return !0
    },create: function() {
        this.iClose || (k.parentNode || (k.setAttribute("id", "J_smartFrame"), k.style.cssText = "display:none", i.body.appendChild(k)), this.frame = k)
    },download: function(b) {
        var c = Date.now();
        (!b || c - b < this.timeout + 200) && (this.cover ? a.location.replace(this.bannerUrl) : a.location.href = this.bannerUrl)
    },redirect: function(b) {
        var c = this.options && this.options.version, d = this.frame, f = b ? "click_sb_" + c + "_manual" : "click_sb_" + c + "_auto";
        this.paramUrl && (e({ap_uri: f}), this.paramUrl = this.paramUrl.replace("%22ap_uri%22%3A%22%22", encodeURIComponent('"ap_uri":"' + f + '"')), this.isChrome ? a.location.href = this.paramUrl : d && d.setAttribute("src", this.paramUrl))
    },install: function(a) {
        var b = this, c = Date.now();
        b.isDownload || (b.timeload = setTimeout(function() {
            b.download(c)
        }, b.timeout)), b.redirect(a)
    }}, b.smartbanner = function(a) {
        var c = a.type, d = b.smartbanner.BannerUI, e = b.smartbanner.PopUI;
        if ("banner" !== c && c) {
            if ("pop" === c) {
                if (e)
                    return new e(a)
            } else if ("func" === c)
                return b.smartbanner.getInstance(a)
        } else if (d)
            return new d(a)
    }, b.smartbanner.getInstance = function(a, b) {
        b || (b = Object.create({}));
        for (var c in l.prototype)
            b[c] = l.prototype[c];
        return l.call(b, a)
    }, b.smartbanner.aplus = e, b.smartbanner.getParam = c, b.smartbanner.ttidInTaobaoApp = f, b.smartbanner.uaInTaobaoApp = g
}(window, window.lib || (window.lib = {})), function(a, b) {
    function c(a) {
        var b = document.cookie;
        if (name = a + "=", start = b.indexOf(name), 0 > start)
            return null;
        start += name.length;
        var c = b.indexOf(";", start);
        return c = -1 == c ? b.length : c, b.substring(start, c)
    }
    function d() {
        var a = decodeURIComponent(c("imewweoriw"));
        return a && a.length > 32
    }
    function e(a) {
        var b = window.localStorage;
        if (b) {
            var c = b[a], d = !1;
            if (c) {
                var c = parseInt(c, 10), e = new Date;
                e.setHours(0), e.setMinutes(0), e.setSeconds(0), e.setMilliseconds(0), c > e && (d = !0)
            }
            return d
        }
    }
    function f(a, b) {
        a = a || 0;
        var e = navigator.userAgent, f = j.ali_trackid, g = Boolean(f), h = c("tkmb"), i = h ? h.split("&") : null, k = /400000_.*@\w+_(iphone|android)_.*/i, l = /.+@taobao_(iphone|android|apad|ipad)_.+/i, m = j.ttid, n = m ? decodeURIComponent(m) : "", o = "" != n ? !0 : !1, p = j.ut_sk, q = p ? decodeURIComponent(p) : "", r = "" != q ? !0 : !1, s = q.match(/.+_(\d+)_.+/), t = j.iv, u = k.test(n), v = t && 1 == t || i && "iv=1" === i[1], w = "undefined" != typeof t && 1 == t || i && "iv=0" === i[1], x = g && null != f.match(/^1_.+/i) && ("undefined" == typeof b || 1 == b), y = g && null != f.match(/^1_.+/i) && "undefined" != typeof b && 0 == b, z = !0;
        (o && l.test(n) || null != e.match(/WindVane/)) && (z = !1, !r || null == s || 12278902 != s[1] && 21380790 != s[1] || (z = !0)), null != e.match(/AlipayClient/i) && (z = !1);
        var A = "010";
        var L = {};
        return A && ("1" == A.charAt(0) && (L.isInvoke = !0), "1" == A.charAt(1) && (L.isShow = !0), "1" == A.charAt(2) && (L.isInvokeDay = !0)), L
    }
    function g(a, b, c) {
        if (a) {
            var d, g = f(b, c);
            if (g.isInvoke && (d = d || i(a), d && d.redirect()), g.isShow && (d = d || i(a)), g.isInvokeDay && (d = d || i(a), !e("cloudDate"))) {
                d && d.redirect();
                try {
                    localStorage.cloudDate = Date.now()
                } catch (h) {
                    console.log(h)
                }
            }
            return d
        }
    }
    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)) {
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
    function setCookie(name,value,days){
        var exp = new Date();
        isNaN(days) && (days=3);
        exp.setTime(exp.getTime() + days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + "; path=/; expires=" + exp.toGMTString();
    }
    var h = document, i = b.smartbanner, j = (i.aplus, i.getParam()), k = function(a) {
        a.version = "v1", i.getInstance(a, this), this.calClose() || this.invaliable || (this.setParam(a), this.createHtml())
    };
    k.prototype = {constructor: k,calClose: function() {
        var a = getCookie('clientdownshow_index');
        if (a) {
            this.iClose = !0;
            return this.iClose
        }
    },setParam: function(a) {
        var b = a.color ? "color:" + a.color + ";" : "", c = a.bgcolor ? "background-color:" + a.bgcolor + ";" : "";
        this.styles = b + c, this.isHide = a.hide || !1, this.text = a.text || "", this.title = a.title || ""
    },template: function() {
        var a = this.isHide, _template =
            '<div class="app-pop">'
                +'<a href="javascript:;" class="linkbox">	'
                +	'<img src="//img2.soufun.com/wap/touch/img/sf-72.png" width="36">'
                +	'<div class="text">'
                +		'<p class="f14">上APP查房价<br/>秒懂房价难题</p>'
                +	'</div>'
                +	'<span class="b1">\u7acb\u5373\u6253\u5f00</span>'
                +	'<a href="javascript:;" class="off">x</a>'
                +'</div>'
                +'</div>'
                +'<div class="app-blankbg" style="position:relative;display:block;width:58px">&nbsp;<br/>&nbsp;</div>';
        return _template
    },createHtml: function() {
        var ua = navigator.userAgent.toLowerCase();
        if(null != ua.match(/chrome\/([\d.]+)/)){
            return false;
        }
        if (!this.iClose) {
            var a = this.template(), b = h.createElement("style"), c = h.createElement("div"), d = this.options.dpr || 1;
            c.innerHTML = a, this.smartDom = c.querySelector("div.app-pop"), this.bgDom = c.querySelector("div.app-blankbg"), this.popDom = i({type: "pop",title: this.title,dpr: d});
            b.innerHTML = ".app-pop{ position: fixed;z-index:99999; left:0; bottom:0; background:rgba(0,0,0,.8); width:100%; overflow: hidden;}"
                +".app-pop .linkbox{ padding: 10px 15px; width:100%; box-sizing:border-box; overflow: hidden; display:-webkit-box; display:-moz-box; display:-ms-box; display:box;}"
                +".app-pop img{ margin:1px 10px 0 0; width:36px;}"
                +".app-pop .text{ color:#fff; height:36px; line-height:20px; -webkit-box-flex:1; -moz-box-flex:1; -ms-box-flex:1; box-flex:1;}"
                +".app-pop .text p{ white-space: nowrap; text-overflow:ellipsis; overflow: hidden;}"
                +".app-pop .b1{ display: inline-block; margin-top:5px; border:1px solid #adadad; width:75px; height:25px; line-height:25px; color:#666; font-size: 14px; text-align:center; border-radius:2px; background: -webkit-gradient(linear, left top, right top, from(#f1f1f1), to(#dddddd));background: -webkit-linear-gradient(top, #f1f1f1, #dddddd);background: -moz-linear-gradient(top, #f1f1f1, #dddddd);background: -o-linear-gradient(top, #f1f1f1, #dddddd);background: -ms-linear-gradient(top, #f1f1f1, #dddddd);background: linear-gradient(top, #f1f1f1, #dddddd);background-color: #f1f1f1; box-shadow:inset 0 1px 0 #fff;}"
                +".app-pop .off{ position: absolute; left:-20px; top:-20px; display: block; padding:9px 8px; width: 22px; height: 20px; line-height:32px; text-align:right; background:#000; border-radius:50%; color:#fff; font-size: 13px;}";
            h.body.appendChild(b), h.body.appendChild(this.smartDom),h.body.appendChild(this.bgDom), this.listen()
        }
    },show: function() {
        this.iClose || this.smartDom && (this.smartDom.style.display = "block")&& (this.bgDom.style.display = "block")
    },hide: function() {
        this.iClose || this.smartDom && (this.smartDom.style.display = "none")&& (this.bgDom.style.display = "none")
    },pop: function() {
        this.iClose || this.popDom && this.popDom.open()
    },listen: function() {
        if (!this.iClose) {
            var a = this, b = a.smartDom;
            b.querySelector("a.off").addEventListener("click", function(b) {
                b.preventDefault(), a.hide();
                try {
                    setCookie('clientdownshow_index','1',1),setCookie('clientdownshow','1',3),a.calClose();
                } catch (b) {
                }
            }, !1), b.querySelector("a.linkbox").addEventListener("click", function(b) {
                b.preventDefault(), a.install(!0)
            })
        }
    }}, b.smartbanner.expiresInDay = e, b.smartbanner.smtStatus = f, b.smartbanner.sbLogic = g, b.smartbanner.BannerUI = k
}(window, window.lib || (window.lib = {}));
!function(a, b) {
    var c = a.localStorage;
    try {
        c && c.setItem("testPrivateModel", !1)
    } catch (d) {
        c = null
    }
    b.localStorage = c
}(window, window.lib || (window.lib = {})), function(a, b, c) {
    var l = a.$, m = (Array.prototype.slice, a.navigator), n = m.userAgent, o = /iPad|iPhone|iPod/i.test(n), p = /Android/i.test(n), q = /UCBrowser/i.test(n), r = /MQQBrowser/i.test(n), s = n.indexOf("Chrome") > -1, t = n.match(/iPhone\s+OS\s+([\d_]+)/), u = b.mtop, v = b.login, w = b.smartbanner, x = b.localStorage, y = b.notification, z = c.index || (c.index = {});
    t && (t = parseFloat(t[1].split("_").slice(0, 2).join("."), 10));
    var B = z.schemaUrl = (o ? "soufun://" : "soufunandroid://soufun.a");
    z.ua = {isIOS: o,isAndroid: p,isUC: q,isQQ: r,isChrome: s,iosVersion: t};
    a.SmartbannerJSON = {"mainIndex" : {"href":"#","title":"","text":"","color":"","bgcolor":""}};
    (function() {
        var c = a.SmartbannerJSON;
        if (w)
            if (c && c.mainIndex && !q && !r) {
                var e = c.mainIndex;
                e.href = B, z.smartbanner = w.sbLogic(e, 1)
            }
    })();
}(window, window.lib || (window.lib = {}), window.app || (window.app = {}));