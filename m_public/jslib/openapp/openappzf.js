/**
 * Created by zhangcongfeng@fang.com on 2016/3/24.
 * *下载租房帮app,ios直接跳到appstore,安卓有app时打开,没有进入下载
 */
(function(window, factory) {
    if ( typeof define === 'function') {
        // AMD
        define(function() {
            return factory(window);
        });
    } else if ( typeof exports === 'object') {
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
                if (this.isChrome){
                    var z = m.split("://"), A = z[0], B = z[1], C = config.bag || "com.soufun.zf";
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
            if(!this.isChrome && "ios" !== this.platform) {
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
                u.log && u.log.apply(null,[2]);
            }
        },
        redirect: function() {
            var version = this.options.version, frame = this.frame;
            if(this.paramUrl && this.platform !== 'ios'){
                if(this.isChrome){
                    window.location = this.paramUrl;
                } else if(frame){
                    frame.setAttribute("src", this.paramUrl);
                }
            }
        },
        install: function() {
            var b = this, now = Date.now();
            if (this.platform !== 'ios') {
                b.redirect();
            }else {
                b.download(now);
            }
        }
    };
    smartApp.fn.init.prototype = smartApp.fn;
    return function(config){
        var self = {},win = window,standalone = win.navigator.standalone, d = win.navigator.userAgent,uc = /UCBrowser/i.test(d), qq = /MQQBrowser/i.test(d),smart;
        self.platform = "android";
        var ios8below_reg = /OS [0-8]_\d[_\d]* like Mac OS X/gi;
        //  !uc && !qq &&
        if(null != d.match(/iPhone|iPod|iPad/i)){
            self.platform = "ios";
            d.match(ios8below_reg) || (self.ios9above = !0);
            self.isIpad = null != d.match(/iPad/i);
        } else if(null != d.match(/Android/i)){
            if(null != d.match(/Mobile/i)){
                self.isChrome = null != d.match(/Chrome/i) && null == d.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i);
                self.platform = self.isChrome?"":"android"
            }
        }
        self.cover = config.cover || !1,config.crossplat = config.crossplat || !1
        if ("ios" != self.platform || config.crossplat) {
            var l = config.url || '//download.3g.soufun.com/soufunrent_android_4.5.0_730000.apk';
            self.bannerUrl = l;
        } else
        {
            self.bannerUrl = config.appstoreUrl || ("https://itunes.apple.com/cn/app/sou-fang-zu-fang/id626698195?mt=8");
        }
        // var isFangApp = window.is_sfapp || config.isFangApp || window.isFangApp|| '';
        var appurl = win.appurl||win.seajs && seajs.data.vars.appurl;
        if (!appurl) {
            appurl = 'soufunrent';
        }
        config.href= "ios" != self.platform?"com.soufun.zf://":"soufunzfrent://";
        if (appurl)config.href += appurl;
        smart = !self.platform || standalone ? null : smartApp(config, self);
        return {support:null != smart,openApp:function(){
            config.log && config.log.apply(null,[1]);
            if (config.click) {
                var now = Date.now();
                null != smart?smart.download(now)
                    :(config.log && config.log.apply(null,[2]),self.cover ? win.location.replace(self.bannerUrl) : win.location.href = self.bannerUrl);
            }else {
                null != smart?smart.install()
                    :(config.log && config.log.apply(null,[2]),self.cover ? win.location.replace(self.bannerUrl) : win.location.href = self.bannerUrl);
            }
        }}
    };
});