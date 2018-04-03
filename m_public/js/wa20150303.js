/*
 *房天下app下载浮层，添加微信应用宝下载地址
 */
! function (g, h) {
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
  if (window.navigator.userAgent.indexOf('com.fang') >= 0) {
    return;
  }
  var seajs = g.seajs;
  var vars = seajs.data.vars;
  var existFlag = vars.cd_ver;
  var c = [existFlag, "iClose", "smartDom", "openApp", "preventDefault", "stopPropagation", "mainBody", "floatApp", "style", "createElement", "append", "document", "class", "push", ""],
    f = g[c[11]],
    e = g.$,
    a = function () {
      this.calClose() || this.createHtml()
    };
  c[7] = (function () {
    var zimu = 'abcdefghijklmnopqrstuvwsyz';
    return zimu.charAt(Math.floor(Math.random() * 26)) + zimu.charAt(Math.floor(Math.random() * 26)) + '-' + Math.floor(Math.random() * 10000)
  })();
  c[14] = c[7] + 'x';
  a.prototype = {
    constructor: a,
    calClose: function () {
      var i = b(c[0]);
      if (i) {
        this[c[1]] = !0;
        return this[c[1]]
      }
    },
    template: function () {
      var i = [],
        appImgUrl, title, downtitle = '',
        btnCon, downBtnCon = '',
        curModel, curChannel;
      // "房天下APP优惠多,速度快</p><p>买好房，就上房天下Fang.com!"
      var curChannel = vars.currentChannel;
      if (window.location.href.indexOf('soufun') > -1) {
        title = '下载房天下APP</p><p>掌握第一手房源信息，更快更准更优惠';
        if (curChannel === 'index') {
          title = '下载房天下APP</p><p>掌握第一手房源信息，更快更准更优惠';
        }
      } else {
        title = '下载房天下APP</p><p>掌握第一手房源信息，更快更准更优惠';
        if (curChannel === 'index') {
          title = '下载房天下APP</p><p>掌握第一手房源信息，更快更准更优惠';
        }
      }
      appImgUrl = vars.public + 'img/sf-72.png';
      btnCon = '\u7acb\u5373\u4e0b\u8f7d';
    //var pathId=201600441;
    $.ajax({
        url: window.location.origin + '/public/?c=public&a=getAppInfo&id=201600441',
        async:false,
        success:function(data) {
            if (data && data.resulteState == 'SUCCESS') {
                var res = data.result[0].normalColumnData;
                title = res.title + '</p><p>'+res.summary+'</p>';
            }
        },
        faile:function(data) {
            console.log(data);
        }
    });
      if (g.hasOwnProperty('seajs')) {
        curModel = seajs.data.vars.action;
      } else if (g.lib.action) {
        curModel = g.lib.action;
      }

      var clickId = 'wapdsy_D05_04';
      var push = c[13];
      i[push]('<div class="' + c[7] + '">');
      i[push]('<div>');
      i[push]('<a href="#box" class="' + c[14] + '" id="' + clickId + '">');
      i[push]('<span class="btn">' + btnCon + '</span>');
      i[push]('<img src="' + appImgUrl + '" width="36">');
      i[push]('<div class=" text item2">');
      i[push]('<p>' + title + '</p>');
      i[push]('</div>');
      i[push]('</a>');
      i[push]('<a href="#off" class="off"><span>x</span></a>');
      i[push]('</div>');
      i[push]('</div>');
      return i.join("")
    },
    createHtml: function () {
      if (!this[c[1]]) {
        var l = this.template(),
          k = f[c[9]](c[8]),
          o = f[c[9]]("div"),
          n = [""];
        o.innerHTML = l, this[c[2]] = o.querySelector("." + c[7]);
        var push = c[13];
        if (vars.currentChannel) {
          n[push]("{ height:44px;display:none;}");
        } else {
          n[push]("{ height:44px;}");
        }
        n[push]("> div{position: fixed; left:0; bottom:0; background:rgba(0,0,0,.8); width:100%; height:44px; overflow: hidden;z-index:5;}");
        n[push]("." + c[14] + "{ display: block; width:100%;}");
        n[push]("img{ float: left; margin:6px 9px 6px 20px; width:32px;}");
        n[push](".text{ color:#fff;line-height:26px;padding:9px 0;font-size:11px;color:#fff;}");
        n[push](".text p{ white-space: nowrap; text-overflow:ellipsis; overflow: hidden;}");
        n[push](".text.item2{line-height:13px;}");
        n[push](".btn{float: right; width:80px; height:44px; line-height:44px; background:#ff9b05; color:#ffffff; font-size: 13px; text-align:center;}");
        n[push](".off{position: absolute; left: -20px; top: -20px; display: block; width: 40px; height: 40px; line-height: 40px; background: #000; border-radius: 50%; color:#b3b3b3 !important; font-size: 14px; text-align: center; clip: rect(20px,40px,40px,20px);}");
        n[push](".off span{ position: relative; left: 8px; top: 7px;}");
        k.innerHTML = n.join("\n." + c[7] + " ");
        var j = e(f.body);
        j[c[10]](k), j[c[10]](this[c[2]]), this.listen();
      }
    },
    show: function () {
      this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "block")
    },
    hide: function () {
      this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "none")
    },
    listen: function () {
      if (!this[c[1]]) {
        var i = this,
          j = e(i[c[2]]);
        vars.appFloatBox = this;
        j.find("a.off").bind("click", function (k) {
          k[c[4]](), k[c[5]]();
          i.foo(), i.log(3)
        });
        j.find('a.' + c[14]).bind("click", function (o) {
          var n, k, p = function (q) {
            typeof g[c[3]] === "function" && (q = g[c[3]]);
            // 添加应用宝下载地址
            var appUrl, company, wxUrl;
            if (vars.currentChannel === 'index') {
              appUrl = '//download.3g.fang.com/fang_android_31296.apk';
              wxUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.soufun.app&ckey=CK1359051358343';
              company = '1296';
            } else if (vars.action === 'xflist') {
              appUrl = '//download.3g.fang.com/fang_android_31299.apk';
              company = '1299';
            } else if (vars.currentChannel === 'esf' && (vars.action === 'index' || vars.action === 'newindex')) {
              appUrl = '//download.3g.fang.com/fang_android_31300.apk';
              company = '1300';
            } else {
              appUrl = '//download.3g.fang.com/fang_android_31076.apk';
              company = '1076';
            }
            var l = q({
              url: appUrl,
              log: i.log,
              company: company,
              app: 'sfapp',
              wxUrl: wxUrl
            });
            l[c[3]]()
          };

          o[c[4]](), o[c[5]]();
          p(g.openApp);
        })
      }
    },
    log: function (i, company, app) {
      e.get("/public/?c=public&a=ajaxOpenAppData", {
        type: i,
        rfurl: f.referrer,
        company: company,
        app: app
      })
    },
    foo: function () {
      this.hide();
      try {
        d(c[0], 1, 2), this.calClose()
      } catch (i) {}
    }
  };
  new a();
}(self, self.lib || (self.lib = {}));


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
      async: false,
      success: function (data) {
        if (data) {
          if (key != 'self') {
            obj[key] = data;
            res = 'waptoapp/' + JSON.stringify(obj);
          } else {
            res = data;
          }
        }
      },
      error: function (data) {
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
          x = {
            from: config.from
          };
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