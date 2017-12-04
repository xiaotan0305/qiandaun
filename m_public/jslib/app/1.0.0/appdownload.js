(function(window, factory) {
    if ( typeof define === 'function') {
        // AMD
        define('app/1.0.0/appdownload',[],function(req) {
            return factory(window,req);
        });
    } else if ( typeof module === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        window.appdo = factory(window);
    }
})(window, function (win,req) {
    "use strict";
    var seajs = win.seajs;
    var vars = seajs ? seajs.data.vars : '';
     var $ = win.$ || win.jQuery;
    var isWeiXin = '';
    var pub = '';
    if(typeof (_vars) == 'undefined'){
        isWeiXin = false;
    } else {
        isWeiXin = _vars.isWeiXin;
        pub = _vars.public;
    }
    function DApp (appdoUrl, apk){
        var that = this;       
        that.apk = apk;
        that.appdoUrl = appdoUrl;
        //如果不是微信打开，但是url中存在from=weixin，直接执行点对点打开
        if (isWeiXin != true) {
            if (win.location.href.indexOf('from=weixin') > -1) {
                $(document).ready(function(){
                    that.listen()(null);
                })
            }
        }
    }
    DApp.prototype = {
        listen:function(e){
        //    window.event.preventDefault();
            var that = this;
            return function(e){
                var callback = function (openApp) {
                    // 获取下载链接
                    var apkUrl = (that.appdoUrl && typeof that.appdoUrl !== 'object') ? that.appdoUrl: "//download.3g.fang.com/fang_android_31256.apk",company;

                    // 获取渠道号（首页app下载按钮地址为/clientindex.jsp?city=bj&flag=download&f=1113,其它页面地址类型为//download.3g.fang.com/fang_android_31076.apk）
                    var cIndex = apkUrl.lastIndexOf('.apk'),scIndex = apkUrl.lastIndexOf('&f='), wxUrl = '';
                    if (cIndex > -1) {
                        company =  apkUrl.slice(cIndex-4, -4);
                    } else if(scIndex > -1) {
                        company  = apkUrl.slice(scIndex + 3);
                    }
                    // 点对点打开地址
                    var desUrl = '', universalappurl = '';
                    // 非天津城市下载渠道号以及微信地址

                        // 添加微信浏览器下载地址
                    if (typeof that.appdoUrl !== 'object') {
                        // 首页顶部下载按钮
                        var el = $(e.target);
                        if (el.attr('class') === 'icon-down' || el.parent('a').attr('class') === 'icon-down') {

                            wxUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1358437680501';

                            // 页面底部下载按钮
                        } else if (el.attr('class') === 'appDown' || el.parent('a').attr('class') === 'appDown' || el.attr('id') === 'down-btn-c' || el.parent('a').attr('id') === 'down-btn-c') {
                            wxUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1358437780736';

                        } else if (vars.currentChannel === 'news' && vars.action === 'detail' && (el.attr('class') === 'appdown' || el.parents('.appdown').length)) {
                            wxUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1358437680505';
                        }
                    } else {

                        // 获取下载按钮具体位置
                        var position = that.appdoUrl.position || 'downBtn';

                        // 获取点对点appUrl
                        desUrl = that.appdoUrl.appUrl || '';
                        // 获取点对点
                        universalappurl = that.appdoUrl.universalappurl || '';
                        // 添加天津下载渠道号配置
                        var tjConfig = {
                            // 首页顶部
                            indexTopBtn: {
                                company: 1302,
                                appUrl: '//download.3g.fang.com/fang_android_31302.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359051980880'
                            },
                            //合作首页顶部
                            hezuoTopBtn: {
                                company: 1322,
                                appUrl: '//download.3g.fang.com/fang_android_31322.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1371137304401'
                            },
                            // 首页猜你喜欢
                            indexCnxh: {
                                company: 1303,
                                appUrl: '//download.3g.fang.com/fang_android_31303.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359051980881'
                            },
                            // 新房查成交
                            xfCcjIndex: {
                                company: '1304',
                                appUrl: '//download.3g.fang.com/fang_android_31304.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052085901'
                            },
                            // 二手房查成交
                            ccjIndex: {
                                company: '1305',
                                appUrl: '//download.3g.fang.com/fang_android_31305.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052219072'
                            },
                            // 新房顶部
                            xfTopBtn: {
                                company: 1299,
                                appUrl: '//download.3g.fang.com/fang_android_31299.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359051710048'
                            },
                            // wap新房列表feed下载
                            xfIndexMid: {
                                company: 1306,
                                appUrl: '//download.3g.fang.com/fang_android_31306.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359051980882'
                            },
	                        // 新房详情页
	                        xfDetailMid: {
		                        company: 1315,
		                        appUrl: '//download.3g.fang.com/fang_android_31315.apk',
		                        wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1368630084683'
	                        },
                            // wap新房IM引导下载
                            xfIm: {
                                company: 1307,
                                appUrl: '//download.3g.fang.com/fang_android_31307.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052289763'
                            },
                            // wap二手房顶部
                            esfIndexTop: {
                                company: 1300,
                                appUrl: '//download.3g.fang.com/fang_android_31300.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359051710049'
                            },
                            //wap二手房列表feed下载
                            esfIndexMid: {
                                company: 1308,
                                appUrl: '//download.3g.fang.com/fang_android_31308.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052289764'
                            },
                            // wap资讯详情页顶部
                            newsDetailTopBtn: {
                                company: 1309,
                                appUrl: '//download.3g.fang.com/fang_android_31309.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052289765'
                            },
                            // wap资讯大家都在看
                            newsLookBtn: {
                                company: 1309,
                                appUrl: '//download.3g.fang.com/fang_android_31309.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052289765'
                            },
                            // wap首页底部logo下载
                            indexBottomLogo: {
                                company: 1114,
                                appUrl: '//download.3g.fang.com/fang_android_31114.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052289766'
                            },
                            // WAP底部app下载
                            downBtn: {
                                company: 1298,
                                appUrl: '//download.3g.fang.com/fang_android_31298.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359051280826'
                            },
                            // wap知识资讯详情页引流
                            newsDetailBtn: {
                                company: 1301,
                                appUrl: '//download.3g.fang.com/fang_android_31301.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359052219071'
                            },
                            // 问答首页顶部按钮
                            askIndexTopBtn: {
                                company: 1311,
                                appUrl: '//download.3g.fang.com/fang_android_31311.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1360859826782'
                            },
                            // 问答详情页顶部按钮
                            askDetailTopBtn: {
                                company: 1320,
                                appUrl: '//download.3g.fang.com/fang_android_31320.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1368630199001'
                            },
                            // 二手房搜房帮详情页按钮
                            esfdetail: {
                                company: 1312,
                                appUrl: '//download.3g.fang.com/fang_android_31312.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1368630053177'
                            },
                            // 二手房电商详情页按钮
                            esfdsDetail: {
                                company: 1313,
                                appUrl: '//download.3g.fang.com/fang_android_31313.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1368630198999'
                            },
                            // 二手房聚合详情页按钮
                            esfjhDetail: {
                                company: 1314,
                                appUrl: '//download.3g.fang.com/fang_android_31314.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1368630199000'
                            },
                            // 小区详情页按钮
                            xqDetail: {
                                company: 1319,
                                appUrl: '//download.3g.fang.com/fang_android_31319.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1368630528695'
                            },
                            // 小区点评活动按钮
                            xqDphd: {
                                company: 1323,
                                appUrl: '//download.3g.fang.com/fang_android_31323.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1374526736197'
                            },
                            //租房详情页wap端点对点打开app
                            zfDetail: {
                                company: 1168,
                                appUrl: '//download.3g.fang.com/soufun_android_31168.apk',
                                wxUrl: ''
                            },
                            //ofo合作
                            zhuantiofo: {
                                company: 1325,
                                appUrl: '//download.3g.fang.com/fang_android_31325.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1375122840341'
                            },
                            //mobike(摩拜)合作
                            zhuantimobike: {
                                company: 1326,
                                appUrl: '//download.3g.fang.com/fang_android_31326.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1376583510820'
                            },
                            //mobike(摩拜)合作
                            videoDetail: {
                                company: 1324,
                                appUrl: '//download.3g.fang.com/fang_android_31324.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1374526736197'
                            },
                            //爱分享
                            loveShare:{
                                company: 1334,
                                appUrl: '//download.3g.fang.com/fang_android_31334.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1379433661734'
                            },
			    // 租房新点对点打开app
                            zfnewdetail: {
                                company: 1325,
                                appUrl: '//download.3g.fang.com/fang_android_31325.apk',
                                wxUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1375122840341'
                            }
                        };
                        apkUrl = tjConfig[position].appUrl;
                        wxUrl = tjConfig[position].wxUrl;
                        company = tjConfig[position].company;
                    }
                    var ctmNo = e.data && e.data.ctmNo ? e.data.ctmNo : '';
                    // yangfan add 20160510 添加 ctm 参数属性
                    var oa = openApp({
                        // 如果给出下载链接则使用给出的下载链接否则使用默认下载链接
                        url: apkUrl,
                        company: company,
                        log: that.log,
                        // 记录何种app下载
                        app: 'sfapp',
                        ctm: 'ctm=2.xf_search.tail.' + ctmNo,
                        wxUrl: wxUrl,
                        appurl:desUrl,
                        universalappurl: universalappurl
                    });
                    //如果是微信访问
                    oa.openApp();
                };
                if(e){
                    e.preventDefault();
                    e.stopPropagation();
                }
                callback(win.openApp);
                return false;
            };
        },
        log:function(type,company,app){
            $ && $.get("/public/?c=public&a=ajaxOpenAppData", {
                type:type,
                rfurl:win.document.referrer,
                company: company,
                app: app
            });

        }
    };

    $.fn.openApp = function(apk){
        var dApp = new DApp(apk);
        var $this = $(this);
        // yangfan add 20160510 添加 ctm 参数顺序号
        var ctmNo = $this.filter(':visible').index()+1;
        $this.on('click', {ctmNo: ctmNo}, dApp.listen());
    };
    return $;
});
/**
 * by liuxinlu 下载app功能，添加默认应用宝打开地址，FangApp专用
 */
(function (window, factory) {
    window.openApp = factory(window);
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