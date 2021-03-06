/**
 * Created by zhangcongfeng(zhangcongfeng@fang.com) on 2016/3/9.
 * 租房下载页直接打开租房帮app
 */
(function(window, factory) {
    var oa = factory(window)({});
    oa.openApp();
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
        redirect: function() {
            var frame = this.frame;
            // this.paramUrl = this.paramUrl.replace("%22ap_uri%22%3A%22%22", encodeURIComponent('"ap_uri":"' + f + '"'));
            if(this.paramUrl){
                if(this.isChrome || "ios" === this.platform){
                    window.location = this.paramUrl;
                } else if(frame){
                    frame.setAttribute("src", this.paramUrl);
                }
            }
        },
        install: function() {
            var b = this, now = Date.now();
            b.redirect()
        }
    };
    smartApp.fn.init.prototype = smartApp.fn;
    return function(config){
        var self = {},win = window,standalone = win.navigator.standalone, d = win.navigator.userAgent,uc = /UCBrowser/i.test(d), qq = /MQQBrowser/i.test(d),smart;
        self.platform = "android";
        //  !uc && !qq &&
        if(null != d.match(/iPhone|iPod|iPad/i)){
            self.platform = "ios";
            self.isIpad = null != d.match(/iPad/i);
        } else if(null != d.match(/Android/i)){
            if(null != d.match(/Mobile/i)){
                self.isChrome = null != d.match(/Chrome/i) && null == d.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i);
                self.platform = self.isChrome?"":"android"
            }
        }
        var appurl = win.appurl||win.seajs && win.seajs.data.vars.appurl;
        if (!appurl) {
            appurl = 'soufunrent';
        }
        config.href= "ios" != self.platform?"com.soufun.zf://":"soufunzfrent://";
        if (appurl)config.href += appurl;
        smart = !self.platform || standalone ? null : smartApp(config, self);
        return {openApp:function(){
            null != smart && smart.install();
        }}
    };
});