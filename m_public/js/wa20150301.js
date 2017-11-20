/*
*房天下app下载浮层
* *大城市用,'bj' || 'sh' || 'gz' || 'sz'
* 主要是样式的区别
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
    // 设置cookie属性值和有效期
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
    // 随机生成class名
    c[7] = (function(){var zimu='abcdefghijklmnopqrstuvwsyz';return zimu.charAt(Math.floor(Math.random()*26))+zimu.charAt(Math.floor(Math.random()*26))+'-'+Math.floor(Math.random()*10000)})();
    c[14] = c[7]+'x';
    a.prototype = {constructor: a,calClose: function() {
        // 浮层标志位
        var i = b(c[0]);
        if (i) {
            this[c[1]] = !0;
            return this[c[1]]
        }
    },template: function() {
        // 模板函数
        var i = [],appImgUrl,title,downtitle= '',btnCon,downBtnCon= '',curModel,curChannel;
        curChannel = (g.lib.channelsConfig && g.lib.channelsConfig.currentChannel)?g.lib.channelsConfig.currentChannel:'';
        // "二手房佣金只收0.5%</p><p>下载APP，独享更多买房优惠"
        title = '\u4e8c\u624b\u623f\u4f63\u91d1\u53ea\u6536\u0030\u002e\u0035\u0025</p><p>\u4e0b\u8f7d\u0041\u0050\u0050\uff0c\u72ec\u4eab\u66f4\u591a\u4e70\u623f\u4f18\u60e0';
        appImgUrl = vars.public+'img/sf-72.png';
        // "立即下载"
        btnCon = '\u7acb\u5373\u4e0b\u8f7d';
		if (g.hasOwnProperty('seajs')) {
            // action
            curModel = seajs.data.vars.action;
            if (seajs.data.vars.channelsConfig) {
                // 频道
                curChannel = seajs.data.vars.channelsConfig.currentChannel
            }
		}else if (g.lib.action) {
            curModel = g.lib.action;
        }
        if (curModel === 'xflist' && curChannel === 'xf') {
            // 新房列表页
            // 下载标题提示文字:"房价那么高，搜房送红包</p><p>互联网购房新模式"
            // 下载按钮提示文字:"下载领红包"
            downtitle = '\u623f\u4ef7\u90a3\u4e48\u9ad8\uff0c\u641c\u623f\u9001\u7ea2\u5305</p><p>\u4e92\u8054\u7f51\u8d2d\u623f\u65b0\u6a21\u5f0f';
            downBtnCon = '\u4e0b\u8f7d\u9886\u7ea2\u5305';
        }else if(curModel === 'main' &&curChannel === 'index') {
            // 大首页
            // 下载标题提示文字 " 二手房佣金仅收0.5%</p><p>下载app，领红包"
            // 下载按钮提示文字"立即下载"
            downtitle = '\u0020\u4e8c\u624b\u623f\u4f63\u91d1\u4ec5\u6536\u0030\u002e\u0035\u0025</p><p>\u4e0b\u8f7d\u0061\u0070\u0070\uff0c\u9886\u7ea2\u5305';
            downBtnCon ='\u7acb\u5373\u4e0b\u8f7d';
        }
        if (downtitle && downtitle.length > 0) {
            title = downtitle;
        }
        if (downBtnCon && downBtnCon.length > 0) {
           btnCon = downBtnCon;
        }
        // 模板数组
        i[c[13]]('<div class="'+c[7]+'">');
        i[c[13]]('<div>')
        i[c[13]]('<a href="javascript:;" class="'+c[14]+'">');
        i[c[13]]('<span class="btn">'+btnCon+'</span>');
        i[c[13]]('<img src="'+appImgUrl+'" width="36">');
        i[c[13]]('<div class="text item2">');
        i[c[13]]('<p>'+title+'</p>');
        i[c[13]]('</div>');
        i[c[13]]('</a>');
        i[c[13]]('<a href="javascript:;" class="off"><span>x</span></a>');
        i[c[13]]('</div>');
        i[c[13]]('</div>');
        // 返回模板字符串
        return i.join("")
    },createHtml: function() {
        if (!this[c[1]]) {
            // 添加浮层
            var l = this.template(), k = f[c[9]](c[8]), o = f[c[9]]("div"), n = [""];
            o.innerHTML = l, this[c[2]] = o.querySelector("." + c[7]);
            /* 浮层 - 立即下载 */
            // css
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
            // append结构和样式
            j[c[10]](k), j[c[10]](this[c[2]]), this.listen();
        }
    },show: function() {
        this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "block")
    },hide: function() {
        this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "none")
    },listen: function() {
        if (!this[c[1]]) {
            var i = this, j = e(i[c[2]]);
            // 关闭浮层并记录日志
            j.find("a.off").bind("click", function(k) {
                // 阻止默认行为和冒泡
                k[c[4]](), k[c[5]]();
                i.foo(), i.log(3);
                $('.remove_bottom').hide();
            });
            // 点击浮层进入房天下app下载页或者打开房天下app(已经下载房天下app)
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
                    var l = q({url: appUrl, appstoreUrl:appstoreUrl, log: i.log, company: company, app:'sfapp'});
                    l[c[3]]()
                };

                o[c[4]](), o[c[5]]();
                // 引入appopen.js,兼容无seajs
                if (typeof g.seajs === "object") {
                    g.seajs.use(m, p)
                } else {
                    n = f[c[9]]("script"), k = f.getElementsByTagName("head")[0], n.async = true, n.src = m, n.onload = p, k[c[10] + "Child"](n)
                }
            })
        }
    },log: function(i, company, app) {
        // 记录日志
        e && e.get("/public/?c=public&a=ajaxOpenAppData", {type: i,rfurl: f.referrer,company:company,app:app})
    },foo: function() {
        // 设置cookie标志位
        this.hide();
        try {
            d(c[0], 1, 2), this.calClose()
        } catch (i) {
        }
    }};
    new a()
}(self, self.lib || (self.lib = {}));