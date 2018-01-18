/**
 * by liuxinlu 下载app功能，添加默认应用宝打开地址，FangApp专用
 */
(function (window, factory) {
    if (typeof define === 'function') {
        // AMD
        define(function (require, exports, module) {
            module.exports = factory(window);
        });
    } else if (typeof module === 'object') {
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
        smartApp = function (config, self) {
            return (local = self, new smartApp.fn.init(config));
        };
        function des(obj, key) {
            var res;
            var appData = obj[key];
            if (key == 'self') {
                appData = JSON.stringify(obj);
            }
            $.ajax({
                url: '//m.fang.com/public/?c=public&a=ajaxGetUniverAppUrl&appurl=' + appData,
                async:false,
                success: function(data) {
                        if (data) {
                            if (key != 'self') {
                                obj[key] = data;
                                res = 'waptoapp/' + JSON.stringify(obj);
                            } else {
                                res = data;
                            }
                        }
                },
                error:function(data) {
                    console.log(data);
                }
            })
            return res;
        }
    smartApp.fn = smartApp.prototype = {
        constructor: smartApp,
        init: function (config) {
            var self = this;
            for (var c in local) self[c] = local[c];
            this.options = config, config.version = "v1", this.isDownload = config.download || !1, this.timeout = config.timeout || 1e3, config.from = config.from || "h5";
            if (config.href) {
                var m = config.href,
                    x = { from: config.from };
                if (this.isChrome) {
                    var z = m.split("://"),
                        A = z[0],
                        B = z[1],
                        C = config.bag || "com.soufun.soufun";
                    m = "intent://" + B + "#Intent;scheme=" + A + ";package=" + C + ";end"
                }
                this.paramUrl = m;
            }
            self.create();
            window.onblur = function () {
                clearTimeout(self.timeload), self.timeload = null;
            };
        },
        create: function () {
            if (!this.isChrome && !this.ios9above) {
                this.frame = frame;
                if (!this.frame.parentNode) {
                    this.frame.setAttribute("id", "J_smartFrame");
                    this.frame.style.cssText = "display:none";
                    document.body.appendChild(this.frame);
                }
            }
        },
        download: function (time) {
            var now = Date.now(),
                u = this.options;
            if (!time || now - time < this.timeout + 200) {
                if (this.cover) {
                    window.location.replace(this.bannerUrl)
                } else {
                    window.location = this.bannerUrl;
                }
                u.log && u.log.apply(null, [2, u.company, u.app]);
            }
        },
        // ios9以上临时处理
        redirect: function () {
            var frame = this.frame;
            if (this.paramUrl) {
                if (this.isChrome || this.ios9above) {
                    if (this.ios9above) {
                        window.open(this.paramUrl, '_top');
                    } else {
                        window.location = this.paramUrl;
                    }
                } else if (frame) {
                    frame.setAttribute("src", this.paramUrl);
                }

            }
        },
        install: function () {
            var b = this,
                now = Date.now();
            if (this.ios9above) return b.redirect();
            b.isDownload || (b.timeload = setTimeout(function () {
                b.download(now)
            }, b.timeout)), b.redirect()
        }
    };
    smartApp.fn.init.prototype = smartApp.fn;
    return function (config) {
        var self = {},
            win = window,
            standalone = win.navigator.standalone,
            d = win.navigator.userAgent,
            uc = /UCBrowser/i.test(d),
            qq = /MQQBrowser/i.test(d),
            smart;
        self.platform = "android";
        self.ios9above = !1;
        var ios8below_reg = /OS [0-8]_\d[_\d]* like Mac OS X/gi;
        //  !uc && !qq &&
        if (null != d.match(/iPhone|iPod|iPad/i)) {
            self.platform = "ios";
            d.match(ios8below_reg) || (self.ios9above = !0);
            self.isIpad = null != d.match(/iPad/i);
            self.QQBrowser = null != d.match(/MQQBrowser/i);
            if (!self.QQBrowser) {
                self.isSafari = null != d.match(/Safari/i);
            }
        } else if (null != d.match(/Android/i)) {
            if (null != d.match(/Mobile/i)) {
                self.isChrome = null != d.match(/Chrome/i) && null == d.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i);
                // 增加360等类chrome 浏览器判断
                if (d.indexOf('qhbrowser') !== -1) {
                    self.isChrome = false;
                }
                var track = 'track' in document.createElement('track');
                var version = parseInt(d.match(/qhbrowser\/([\d.]+)/) && d.match(/qhbrowser\/([\d.]+)/)[1] || (d.match(/chrome\/([\d.]+)/i) ? d.match(/chrome\/([\d.]+)/i)[1] : '0'));
                if (version > 10 && version < 48 || !track) {
                    self.isChrome = false;
                }
                self.platform = self.isChrome ? "" : "android";
            }
        }

        self.cover = config.cover || !1, config.crossplat = config.crossplat || !1;
        // 添加微信判断，检测是否为微信浏览器打开如是则打开微信浏览器下载地址

        // 添加房天下app微信浏览器中应用宝跳转地址
        if (/MicroMessenger/i.test(d)) {
            self.bannerUrl = config.wxUrl || "http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1358430372554";

        } else if ("ios" != self.platform || config.crossplat) {
            // 安卓跳转地址
            var l = config.url || "//download.3g.fang.com/fang_android_30007.apk";
            self.bannerUrl = l;
            // ios跳转地址
        } else {
            self.bannerUrl = config.appstoreUrl || 'itms-appss://itunes.apple.com/cn/app/soufun/id413993350?mt=8&ls=1';
        }
        // yangfan add 20160510 跳转目标添加 ctm 参数
        /*if (config.ctm) {
            self.bannerUrl = self.bannerUrl + (/&|\?/.test(self.bannerUrl) ? '&' : '?') + config.ctm;
        }*/
        // 获取页面通用连接标识
        var appurl = config.appurl || win.appurl || win.seajs && win.seajs.data.vars.appurl;
        if (!appurl) {
            appurl = 'waptoapp/{"destination":"home"}';
        }

        // 为ios9以及以上系统打开app添加通用链接
        if (!self.ios9above) {
            if (!config.href || config.href == '') {
                config.href = "ios" != self.platform ? "soufunandroid://" : "soufun://";
            }
            if (appurl) {
                config.href += appurl;
            }
        } else {
            var universalappurl = config.universalappurl || win.universalappurl || win.seajs && win.seajs.data.vars.universalappurl;
            if (!universalappurl) {
                var desObj = JSON.parse(appurl.replace("waptoapp/", ''));
                universalappurl = des(desObj, 'self');
            }
            config.href = 'https://m2c.fang.com/waptoapp/' + universalappurl;
        }
        // 如果没有传入版本号则赋值为空（php日志记录参数）
        if (!config.company) {
            config.company = '';
        }

        // 如未传入app类型默认为搜房app（php日志记录参数)
        if (!config.app) {
            config.app = 'sfapp';
        }
        smart = !self.platform || standalone ? null : smartApp(config, self);
        return {
            support: null != smart,
            openApp: function () {
                config.log && config.log.apply(null, [1, config.company, config.app]);
                null != smart ? smart.install() :
                    (config.log && config.log.apply(null, [2, config.company, config.app]), self.cover ? win.location.replace(self.bannerUrl) : win.location.href = self.bannerUrl);
            }
        }
    };
});