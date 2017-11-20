/*
*打开房天下装修app
*/
(function(window, factory) {
    if (window.location.href.indexOf('from=zxsms')>-1){
        var oa = factory(window)({});
        oa.openApp();
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
                    var z = m.split("://"), A = z[0], B = z[1], C = config.bag || "com.soufun.soufun";
                    m = "intent://" + B + "#Intent;scheme=" + A + ";package=" + C + ";end"
                }
                this.paramUrl = m
            }
            self.create();
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
        redirect: function() {
            var version = this.options.version, frame = this.frame, f = "click_sb_" + version + "_manual";
            if(this.paramUrl){
                if(this.isChrome || this.ios9above){
                    window.location = this.paramUrl
                } else if(frame){
                    frame.setAttribute("src", this.paramUrl)
                }

            }
        },install: function() {
            var b = this, now = Date.now();
            b.redirect()
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
        } else if(null != d.match(/Android/i)){
            if(null != d.match(/Mobile/i)){
                self.isChrome = null != d.match(/Chrome/i) && null == d.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i);
                self.platform = self.isChrome?"":"android"
            }
        }
     //   var appurl = win.appurl||win.seajs && win.seajs.data.vars.appurl;
        var appurl = 'data/{"address":"home"}';
        config.href= "fangtxzx://";
        if (appurl)config.href += appurl;
        smart = !self.platform || standalone ? null : smartApp(config, self);
        return {openApp:function(){
            null != smart && smart.install();
        }}
    };
});