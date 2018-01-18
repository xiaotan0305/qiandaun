(function(window, factory) {
    if ( typeof define === 'function') {
        // AMD
        define(function(require, exports, module) {
            module.exports = factory(window);
        });
    } else if ( typeof module === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        window.openApp = factory(window);
    }
})(window, function factory(window) {
    "use strict";
    var document = window.document,
        frame = document.createElement("frame"),
        local = {},
        smartApp = function(config,self) {
            return (local = self,new smartApp.fn.init(config));
        };
    smartApp.fn = smartApp.prototype = {
        constructor: smartApp,
        init:function(config){
            var self = this;
            for (var c in local)self[c] = local[c];
            this.options = config,config.version = "v1", this.isDownload = config.download || !1, this.timeout = config.timeout || 1e3,config.from = config.from || "h5";
            if (config.href) {
                var m = config.href, x = {from: config.from};
                /*
                 x.url = encodeURIComponent(window.location.href.split(/[?#]/)[0]), x.ap_uri = "";
                 x = encodeURIComponent(JSON.stringify(x))
                 m = m.split("#");
                 -1 == m[0].indexOf("?") ?
                 m[0] += "?" :
                 m[0].indexOf("?") != m.length - 1 && (m[0] += "&");
                 m[0] += "point=" + x;
                 m = m.join("#");
                 */
                //m = -1 != m.indexOf("://") ? m : "soufun://" + m;
                if (this.isChrome){
                    var z = m.split("://"), A = z[0], B = z[1], C = config.bag || "com.soufun.soufun";
                    m = "intent://" + B + "#Intent;scheme=" + A + ";package=" + C + ";end"
                }
                this.paramUrl = m
            }
            self.create();
            window.onblur = function() {
                clearTimeout(self.timeload), self.timeload = null
            }
        },
        create: function() {
            if(!this.isChrome && !this.ios9above) {
                this.frame = frame;
                if (!this.frame.parentNode) {
                    this.frame.setAttribute("id", "J_smartFrame");
                    this.frame.style.cssText = "display:none";
                    document.body.appendChild(this.frame);
                }
            }
        },
        download: function(time) {
            var now = Date.now(),u=this.options;
            if(!time || now - time < this.timeout + 200){
                if(this.cover){
                    window.location.replace(this.bannerUrl)
                }else{
                    window.location = this.bannerUrl;
                }
                u.log && u.log.apply(null,[2])
            }
        },
        redirect: function() {
            var version = this.options.version, frame = this.frame, f = "click_sb_" + version + "_manual";
            //this.paramUrl = this.paramUrl.replace("%22ap_uri%22%3A%22%22", encodeURIComponent('"ap_uri":"' + f + '"'));
            if(this.paramUrl){
                if(this.isChrome || this.ios9above && !this.isSafari){
                    window.location = this.paramUrl
                } else if(frame){
                    frame.setAttribute("src", this.paramUrl)
                }

            }
        },
        install: function() {
            var b = this, now = Date.now();
            b.isDownload || (b.timeload = setTimeout(function() {
                b.download(now)
            }, b.timeout)), b.redirect()
        }
    };
    smartApp.fn.init.prototype = smartApp.fn;
    return function(config){
        var self = {},win = window,standalone = win.navigator.standalone, d = win.navigator.userAgent,uc = /UCBrowser/i.test(d), qq = /MQQBrowser/i.test(d),smart;
        self.platform = "android";
        self.ios9above = !1;
        var ios8below_reg = /OS [0-8]_\d[_\d]* like Mac OS X/gi;
        //  !uc && !qq &&
        if(null != d.match(/iPhone|iPod|iPad/i)){
            self.platform = "ios";
            d.match(ios8below_reg) || (self.ios9above = !0);
            self.isIpad = null != d.match(/iPad/i);
	        self.QQBrowser = null != d.match(/MQQBrowser/i);
	        if (!self.QQBrowser) {
		        self.isSafari = null != d.match(/Safari/i);
	        }
        } else if(null != d.match(/Android/i)){
            if(null != d.match(/Mobile/i)){
                self.isChrome = null != d.match(/Chrome/i) && null == d.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i);
                self.platform = self.isChrome?"":"android"
            }
        }
        self.cover = config.cover || !1,config.crossplat = config.crossplat || !1;
        if(/MicroMessenger/i.test(d)) {
            var wxUrl = config.weiXinUrl || "http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.decoration.app";
            self.bannerUrl = wxUrl;
        } else if ("ios" != self.platform || config.crossplat) {
            var l = config.url || "//download.3g.fang.com/soufun_android_30007.apk";
            self.bannerUrl = l;
        } else {
            self.bannerUrl = config.appstoreUrl || 'https://itunes.apple.com/cn/app/soufun/id413993350?mt=8&ls=1';
        }
        var appurl = config.appurl||win.appurl||win.seajs && win.seajs.data.vars.appurl;
        if (!appurl) {
            appurl = 'waptoapp/{"destination":"home"}';
        }
        if(!config.href || config.href=='')
            config.href= "ios" != self.platform?"soufunandroid://":"soufun://";
        if (appurl)config.href += appurl;
        smart = !self.platform || standalone ? null : smartApp(config, self);
        return {support:null != smart,openApp:function(){
            config.log && config.log.apply(null,[1]);
            null != smart?smart.install()
                :(config.log && config.log.apply(null,[2]),self.cover ? win.location.replace(self.bannerUrl) : win.location.href = self.bannerUrl);
        }};
    };
});
