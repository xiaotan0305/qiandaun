/**
 * 分享功能组件
 * @author lina.bj@fang.com
 * @Last Modified by: yueyanlei@fang.com
 * time 2017.11.27
 */

(function (window, factory) {
    'use strict';
    var id;
    // id = "//static.soufunimg.com/common_m/pc_public/pcshare/js/share.js";
    id = "//static.test.soufunimg.com/common_m/pc_public/pcshare/js/share.js";
    // id = "//test.fang.com//wap_static/pc_public/pc_share/dev/js/share.js";
    if (typeof define === 'function') {
        // AMD
        define(id, [], function (require) {
            return factory(window, require)
        })
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window)
    } else {
        // browser global
        window.pcShare = factory(window)
    }
})(window, function factory(window, require) {
    'use strict';
    var encodeCom = encodeURIComponent;
    var imgPath = '//static.test.soufunimg.com/common_m/pc_public/pcshare/images/';
    /**
     * 截取字符串到固定长度
     * @param str 截取的字符串
     * @param len 截取长度
     * @returns {string}
     */
    function subStringResult(str, len) {
        if (!str) {
            return '';
        }
        var newLength = 0
        var newStr = ''
        var chineseRegex = /[^\x00-\xff]/g
        var singleChar = ''
        var strLength = str.replace(chineseRegex, '**').length
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString()
            if (singleChar.match(chineseRegex) !== null) {
                newLength += 2
            } else {
                newLength++
            }
            if (newLength > len) {
                break
            }
            newStr += singleChar
        }

        if (strLength > len) {
            newStr += '...'
        }
        return newStr
    }

    // extend objects
    function extend(a, b) {
        for (var prop in b) {
            if (b.hasOwnProperty(prop)) {
                a[prop] = b[prop]
            }
        }
        return a
    }

    /**
     * 奖数组对象转换为字符串
     * @param obj 数组对象
     * @returns {string}
     */
    function toStr(obj) {
        var t = []
        for (var i in obj) {
            var s = i
            var o = obj[s]
            if (Object.prototype.toString.call(o) === '[object Array]') {
                o = o.join(',')
            }
            if (o !== null) {
                o = encodeCom(o)
                t.push(s + '=' + o)
            }
        }
        return t.join('&')
    }

    /**
     * 拼接参数
     * @param name 对象名称
     * @param shareObj 分享对象数组
     * @param opt 选项
     */
    function concatUrl(name, shareObj, opt) {
        var n = shareObj[name]
        opt = opt || {}
        var r = n.url
        var i = n.parse(opt)
        var s = toStr(i)
        r += '?' + s;
        window.open(r);
    }
    // 判断是不是pc
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    /**
     * 分享组件对象
     * @param elem 分享组件绑定的点击按钮
     * @param options 参数数组
     * @returns void（无返回值)
     */
    function pcShare(opt) {
        // 如果页面不存在pcShare对象加载此对象
        if (!(this instanceof pcShare)) {
            return new pcShare(ptions)
        }
        if (this.show()) {
            return;
        }
        var document = window.document;
        var title = document.title;
        var url = window.location.href;
        this.options = {};
        // 获取新浪微博分享标题
        this.options.weiboTitle = title;
        // qq空间分享标题
        this.options.qqTitle = title;
        // qq分享默认分享理由
        this.options.desc = '';
        // 分享图片地址
        this.options.PicUrl = '';
        // 分享的url地址
        this.options.url = url;
        // 楼盘名字
        this.options.buildName = title.split('-')[0];
        // 频道
        this.options.channel = '';
        // 分享摘要
        this.options.summary = '';
        // 分享来源
        this.options.source = '';
        if (typeof opt === "object") {
            for (var prop in opt) {
                if (this.options.hasOwnProperty(prop)) {
                    this.options[prop] = opt[prop];
                }
            }
        }
        // 分享来源
        if(this.options.channel){
            this.options.source = IsPC() ? '&platform='+ this.options.channel +'pc' : '&platform='+ this.options.channel +'wap';
        }
        this.creatHTML();
        var that = this;
        // 取消分享按钮
        var quitBtn = document.getElementById('pcshare_close');
        // 取消分享
        quitBtn.onclick = function () {
            that.hide()
        }
        // 绑定分享到微博，分享到qq空间的事件；
        var iconList = document.getElementsByClassName('pcshare_iconbox');
        for (var i = 0; i < iconList.length; i++) {
            var el = iconList[i];
            el.onclick = (function (obj) {
                return function () {
                    that.share(obj.getAttribute('name'));
                }
            })(el)
        }
        this.copy();
        var sendMailBtn = document.getElementById('pcshare_mail');
        sendMailBtn.onclick = function(){
            that.sendMail();
        };
    }

    /**
     * 拼接显示分享的html结构
     *
     */
    pcShare.prototype.tpl = function () {
        var that = this;
        var url = that.options.url;
        url += url.indexOf('?') > -1 ? '&' :  '?';
        url += 'fshare=weixin' + that.options.source;
        var wxPic = 'http://u.soufun.cn/qrcode.php?url=' + encodeURIComponent(url) + '&type=newhouse&resize=82';
        var tepl = ['<div class="layer_share" id="share_layer"></div>',
            '<div class="share_tucon" id="share_tucon">',
            '<span class="pcshare_close " id="pcshare_close"></span>',
            '<div class="share_icon">',
            '<div class="s_erwei share_icon_zi fl">',
            '<div class="share_tu">',
            '<img style="width:82px;height:82px" src="' + wxPic + '" alt="">',
            '</div><p class="f12 gray3">微信“扫一扫”<br>分享好友</p></div>',
            '<div class="s_weibo share_icon_zi fl pcshare_iconbox link" name="wb">',
            '<div class="share_tu">',
            '<img src="' + imgPath + 'share_weibo.png" alt="">',
            '</div><p class="f12 gray3">点击分享到微博</p>',
            '</div>',
            '<div class="s_qqzone share_icon_zi fl pcshare_iconbox link" name="qz">',
            '<div class="share_tu">',
            '<img src="' + imgPath + 'share_qq.png" alt=""></div><p class="f12 gray3">点击分享到QQ空间</p></div>',
            '<div class="s_mail share_icon_zi fl link" id="pcshare_mail">',
            '<div class="share_tu">',
            '<img src="' + imgPath + 'share_mail.png" alt=""></div><p class="f12 gray3">点击发邮件</p></div>',
            '<div class="s_copy_link share_icon_zi fl link" id="pcshare_copy">',
            '<div class="share_tu" style="border:none">',
            '<img src="' + imgPath + 'share_lianjia.png" alt=""></div><p class="f12 gray3" style="border:none">点击复制地址</p>',
            '</div></div><div class="pcshare_tishi_add" id="pcshare_tishi_add" style="display: none">地址已复制</div></div>'
        ]
        return tepl.join('')
    }

    /**
     * 生成分享html结构
     * @returns void
     */
    pcShare.prototype.creatHTML = function () {
        var oDiv = document.getElementById('askpop')
        // 判断页面上是否已经存在分享的html如果存在则不再创建
        if (oDiv !== null) {
            return false
        }
        var s = document.createElement('style'), tpl = this.tpl(), c = document.createElement('div')
        c.innerHTML = tpl;
        s.innerHTML = '.share_tucon .f12{font-size: 12px;}'
            + '.share_tucon .link{cursor:pointer;}'
            + '.share_tucon .gray3{color: #333!important;}'
            + '.share_tucon span{text-decoration:none!important;color:#333;}'
            + '.share_tucon .fl{float:left;display:inline}'
            + '.share_icon_zi p{margin-top: 10px;line-height: 20px}'
            + '.share_icon_zi .share_tu img{vertical-align:middle}'
            + '.share_icon_zi .share_tu{height: 82px;line-height: 82px; overflow: hidden;'
            + 'border-right: 1px solid #eeeeee;  padding: 0px 30px;  width: 82px;}'
            + '.s_qqzone .share_tu,.s_copy_link .share_tu{border-right: none;}'
            + '.share_tucon {width: 440px;position: fixed;background: #fff;top: 50%;left: 50%;height: 262px;border-radius: 6px;margin-top: -270px;'
            + 'margin-left: -240px;z-index: 10010;padding: 60px 20px 40px 20px;}'
            + '.share_tucon span.pcshare_close {cursor:pointer;position: absolute;top: 20px;right: 20px;width: 14px;height: 14px;background: url(' + imgPath + 'close_share.png) no-repeat;}'
            + '.share_icon_zi{text-align: center;  height: 154px}'
            + '.pcshare_tishi_add{opacity: 0.6;width: 200px;height: 60px;border-radius: 6px;'
            + 'filter: Alpha(Opacity=60);text-align: center;font-size: 16px;color: #ffffff;line-height: 60px;'
            + 'background-color: rgb(0, 0, 0);position: absolute;'
            + 'top:50%;left: 50%;margin-left: -100px;margin-top: -30px}'
            + '.layer_share{height: 100%; width: 100%; position: fixed; left: 0px; top: 0px;filter: progid:DXImageTransform.Microsoft.gradient(enabled=\'true\',startColorstr=\'#99000000\', endColorstr=\'#99000000\');'
            + 'background-color: rgba(0,0,0,0.6); z-index: 10002;}'
        document.body.appendChild(s)
        document.body.appendChild(c)
    }
    /**
     * 分享到新浪微博、分享到qq空间、分享到腾讯微博
     */
    pcShare.prototype.share = function (name) {
        var that = this;
        var shareArr = {
            wb: {
                url: 'http://service.weibo.com/share/share.php',
                parse: function () {
                    var url = that.options.url;
                    url += url.indexOf('?') > -1 ? '&' :  '?';
                    url += 'fshare=weibo' + that.options.source;
                    return {
                        // url地址
                        url: url,
                        // 是否显示分享数目 1显示（可选)
                        count: that.options.count || '',
                        // appkey
                        appkey: '3427098291',
                        // 分享的文字内容（可选)默认为所在页面的title 微博分享摘要（为标题和摘要的组合内容)
                        title: encodeCom(subStringResult(that.options.weiboTitle, 160)),
                        // 分享的图片的路径
                        pic: that.options.PicUrl,
                        // 关联用户的UID，分享微博会@该用户(可选)
                        ralateUid: ''
                    }
                }
            },
            qz: {
                url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
                parse: function () {
                    var url = that.options.url;
                    url += url.indexOf('?') > -1 ? '&' :  '?';
                    url += 'fshare=qq' + that.options.source;
                    return {
                        // 分享内容 url
                        url: url,
                        // 是否显示分享总数,显示：'1'，不显示：'0'
                        showcount: '1',
                        // 分享标题(可选)
                        title: that.options.qqTitle,
                        // 默认分享理由(可选)
                        desc: subStringResult(that.options.desc, 160),
                        // 分享摘要(可选)
                        summary: subStringResult(that.options.summary, 160),
                        // 分享来源 如：腾讯网(可选)
                        site: that.options.url,
                        // 分享图片的路径(可选)
                        pics: that.options.PicUrl,
                    }
                }
            }
        }
        concatUrl(name, shareArr)
    }

    /**
     * 取消分享功能
     */
    pcShare.prototype.hide = function () {
        var cover = document.getElementById('share_layer');
        var content = document.getElementById('share_tucon');
        cover.style.display = 'none';
        content.style.display = 'none';
    }

    /**
     * 显示分享功能
     */
    pcShare.prototype.show = function () {
        var cover = document.getElementById('share_layer');
        var content = document.getElementById('share_tucon');
        if (content) {
            if (cover) {
                cover.style.display = 'block';
            }
            content.style.display = 'block';
            return true;
        }
        return false;

    }
    // 判断是否为iel浏览器并且返回版本
    function judgeIe() {
        var win = window
        var doc = win.document
        var input = doc.createElement('input')
        var ie = (function () {
            if (win.ActiveXObject === undefined) return false
            if (!win.XMLHttpRequest) return 6
            if (!doc.querySelector) return 7
            if (!doc.addEventListener) return 8
            if (!win.atob) return 9
            if (!input.dataset) return 10
            return 11
        })()
        return ie
    }

    /**
     * 复制链接地址功能
     */
    pcShare.prototype.copy = function () {
        var that = this
        var copyBtn = document.getElementById('pcshare_copy');
        var tipDiv = document.getElementById('pcshare_tishi_add');
        // ie8以下浏览器
        if (judgeIe() && judgeIe() < 8) {
            copyBtn.onclick = function () {
                window.clipboardData.setData('Text', that.options.url)
                tipDiv.style.display = 'block'
                setTimeout(function () {
                    tipDiv.style.display = 'none'
                }, 2000)
            }
        } else {
            var Clipboard;
            if (require) {
                Clipboard = require('clipboard');
            } else {
                Clipboard = window.Clipboard;
            }
            if (Clipboard) {
                copyBtn.setAttribute('data-clipboard-text', that.options.url)
                var clipboard = new Clipboard('#pcshare_copy');
                clipboard.on('success', function (e) {
                    tipDiv.style.display = 'block'
                    setTimeout(function () {
                        tipDiv.style.display = 'none'
                    }, 2000)
                    e.clearSelection()
                });
                clipboard.on('error', function (e) {
                    alert('很遗憾，您的浏览器版本过低，复制失败，请手动复制活动链接！')
                });
            }
        }
    }
    /**
     * 发送邮件
     */
    pcShare.prototype.sendMail = function () {
        var that = this;
        var url = that.options.url;
        url += url.indexOf('?') > -1 ? '&' :  '?';
        url += 'fshare=mail' + that.options.source;
        window.open('http://pubtest.dmp.fang.com/mailshare?lpName=' + encodeCom(this.options.buildName) + '&lpLink=' + encodeCom(url));
    }
    return pcShare
})

/*!
 * clipboard.js v1.7.1
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT Â© Zeno Rocha
 */
!function(t) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = t();
    else if ("function" == typeof define && define.amd)
        define('clipboard', [], t);
    else {
        var e;
        e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this,
        e.Clipboard = t()
    }
}(function() {
    var t, e, n;
    return function t(e, n, o) {
        function i(a, c) {
            if (!n[a]) {
                if (!e[a]) {
                    var l = "function" == typeof require && require;
                    if (!c && l)
                        return l(a, !0);
                    if (r)
                        return r(a, !0);
                    var s = new Error("Cannot find module '" + a + "'");
                    throw s.code = "MODULE_NOT_FOUND",
                    s
                }
                var u = n[a] = {
                    exports: {}
                };
                e[a][0].call(u.exports, function(t) {
                    var n = e[a][1][t];
                    return i(n || t)
                }, u, u.exports, t, e, n, o)
            }
            return n[a].exports
        }
        for (var r = "function" == typeof require && require, a = 0; a < o.length; a++)
            i(o[a]);
        return i
    }({
        1: [function(t, e, n) {
            function o(t, e) {
                for (; t && t.nodeType !== i; ) {
                    if ("function" == typeof t.matches && t.matches(e))
                        return t;
                    t = t.parentNode
                }
            }
            var i = 9;
            if ("undefined" != typeof Element && !Element.prototype.matches) {
                var r = Element.prototype;
                r.matches = r.matchesSelector || r.mozMatchesSelector || r.msMatchesSelector || r.oMatchesSelector || r.webkitMatchesSelector
            }
            e.exports = o
        }
        , {}],
        2: [function(t, e, n) {
            function o(t, e, n, o, r) {
                var a = i.apply(this, arguments);
                return t.addEventListener(n, a, r),
                {
                    destroy: function() {
                        t.removeEventListener(n, a, r)
                    }
                }
            }
            function i(t, e, n, o) {
                return function(n) {
                    n.delegateTarget = r(n.target, e),
                    n.delegateTarget && o.call(t, n)
                }
            }
            var r = t("./closest");
            e.exports = o
        }
        , {
            "./closest": 1
        }],
        3: [function(t, e, n) {
            n.node = function(t) {
                return void 0 !== t && t instanceof HTMLElement && 1 === t.nodeType
            }
            ,
            n.nodeList = function(t) {
                var e = Object.prototype.toString.call(t);
                return void 0 !== t && ("[object NodeList]" === e || "[object HTMLCollection]" === e) && "length"in t && (0 === t.length || n.node(t[0]))
            }
            ,
            n.string = function(t) {
                return "string" == typeof t || t instanceof String
            }
            ,
            n.fn = function(t) {
                return "[object Function]" === Object.prototype.toString.call(t)
            }
        }
        , {}],
        4: [function(t, e, n) {
            function o(t, e, n) {
                if (!t && !e && !n)
                    throw new Error("Missing required arguments");
                if (!c.string(e))
                    throw new TypeError("Second argument must be a String");
                if (!c.fn(n))
                    throw new TypeError("Third argument must be a Function");
                if (c.node(t))
                    return i(t, e, n);
                if (c.nodeList(t))
                    return r(t, e, n);
                if (c.string(t))
                    return a(t, e, n);
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")
            }
            function i(t, e, n) {
                return t.addEventListener(e, n),
                {
                    destroy: function() {
                        t.removeEventListener(e, n)
                    }
                }
            }
            function r(t, e, n) {
                return Array.prototype.forEach.call(t, function(t) {
                    t.addEventListener(e, n)
                }),
                {
                    destroy: function() {
                        Array.prototype.forEach.call(t, function(t) {
                            t.removeEventListener(e, n)
                        })
                    }
                }
            }
            function a(t, e, n) {
                return l(document.body, t, e, n)
            }
            var c = t("./is")
              , l = t("delegate");
            e.exports = o
        }
        , {
            "./is": 3,
            delegate: 2
        }],
        5: [function(t, e, n) {
            function o(t) {
                var e;
                if ("SELECT" === t.nodeName)
                    t.focus(),
                    e = t.value;
                else if ("INPUT" === t.nodeName || "TEXTAREA" === t.nodeName) {
                    var n = t.hasAttribute("readonly");
                    n || t.setAttribute("readonly", ""),
                    t.select(),
                    t.setSelectionRange(0, t.value.length),
                    n || t.removeAttribute("readonly"),
                    e = t.value
                } else {
                    t.hasAttribute("contenteditable") && t.focus();
                    var o = window.getSelection()
                      , i = document.createRange();
                    i.selectNodeContents(t),
                    o.removeAllRanges(),
                    o.addRange(i),
                    e = o.toString()
                }
                return e
            }
            e.exports = o
        }
        , {}],
        6: [function(t, e, n) {
            function o() {}
            o.prototype = {
                on: function(t, e, n) {
                    var o = this.e || (this.e = {});
                    return (o[t] || (o[t] = [])).push({
                        fn: e,
                        ctx: n
                    }),
                    this
                },
                once: function(t, e, n) {
                    function o() {
                        i.off(t, o),
                        e.apply(n, arguments)
                    }
                    var i = this;
                    return o._ = e,
                    this.on(t, o, n)
                },
                emit: function(t) {
                    var e = [].slice.call(arguments, 1)
                      , n = ((this.e || (this.e = {}))[t] || []).slice()
                      , o = 0
                      , i = n.length;
                    for (o; o < i; o++)
                        n[o].fn.apply(n[o].ctx, e);
                    return this
                },
                off: function(t, e) {
                    var n = this.e || (this.e = {})
                      , o = n[t]
                      , i = [];
                    if (o && e)
                        for (var r = 0, a = o.length; r < a; r++)
                            o[r].fn !== e && o[r].fn._ !== e && i.push(o[r]);
                    return i.length ? n[t] = i : delete n[t],
                    this
                }
            },
            e.exports = o
        }
        , {}],
        7: [function(e, n, o) {
            !function(i, r) {
                if ("function" == typeof t && t.amd)
                    t(["module", "select"], r);
                else if (void 0 !== o)
                    r(n, e("select"));
                else {
                    var a = {
                        exports: {}
                    };
                    r(a, i.select),
                    i.clipboardAction = a.exports
                }
            }(this, function(t, e) {
                "use strict";
                function n(t) {
                    return t && t.__esModule ? t : {
                        default: t
                    }
                }
                function o(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }
                var i = n(e)
                  , r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                  , a = function() {
                    function t(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var o = e[n];
                            o.enumerable = o.enumerable || !1,
                            o.configurable = !0,
                            "value"in o && (o.writable = !0),
                            Object.defineProperty(t, o.key, o)
                        }
                    }
                    return function(e, n, o) {
                        return n && t(e.prototype, n),
                        o && t(e, o),
                        e
                    }
                }()
                  , c = function() {
                    function t(e) {
                        o(this, t),
                        this.resolveOptions(e),
                        this.initSelection()
                    }
                    return a(t, [{
                        key: "resolveOptions",
                        value: function t() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            this.action = e.action,
                            this.container = e.container,
                            this.emitter = e.emitter,
                            this.target = e.target,
                            this.text = e.text,
                            this.trigger = e.trigger,
                            this.selectedText = ""
                        }
                    }, {
                        key: "initSelection",
                        value: function t() {
                            this.text ? this.selectFake() : this.target && this.selectTarget()
                        }
                    }, {
                        key: "selectFake",
                        value: function t() {
                            var e = this
                              , n = "rtl" == document.documentElement.getAttribute("dir");
                            this.removeFake(),
                            this.fakeHandlerCallback = function() {
                                return e.removeFake()
                            }
                            ,
                            this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || !0,
                            this.fakeElem = document.createElement("textarea"),
                            this.fakeElem.style.fontSize = "12pt",
                            this.fakeElem.style.border = "0",
                            this.fakeElem.style.padding = "0",
                            this.fakeElem.style.margin = "0",
                            this.fakeElem.style.position = "absolute",
                            this.fakeElem.style[n ? "right" : "left"] = "-9999px";
                            var o = window.pageYOffset || document.documentElement.scrollTop;
                            this.fakeElem.style.top = o + "px",
                            this.fakeElem.setAttribute("readonly", ""),
                            this.fakeElem.value = this.text,
                            this.container.appendChild(this.fakeElem),
                            this.selectedText = (0,
                            i.default)(this.fakeElem),
                            this.copyText()
                        }
                    }, {
                        key: "removeFake",
                        value: function t() {
                            this.fakeHandler && (this.container.removeEventListener("click", this.fakeHandlerCallback),
                            this.fakeHandler = null,
                            this.fakeHandlerCallback = null),
                            this.fakeElem && (this.container.removeChild(this.fakeElem),
                            this.fakeElem = null)
                        }
                    }, {
                        key: "selectTarget",
                        value: function t() {
                            this.selectedText = (0,
                            i.default)(this.target),
                            this.copyText()
                        }
                    }, {
                        key: "copyText",
                        value: function t() {
                            var e = void 0;
                            try {
                                e = document.execCommand(this.action)
                            } catch (t) {
                                e = !1
                            }
                            this.handleResult(e)
                        }
                    }, {
                        key: "handleResult",
                        value: function t(e) {
                            this.emitter.emit(e ? "success" : "error", {
                                action: this.action,
                                text: this.selectedText,
                                trigger: this.trigger,
                                clearSelection: this.clearSelection.bind(this)
                            })
                        }
                    }, {
                        key: "clearSelection",
                        value: function t() {
                            this.trigger && this.trigger.focus(),
                            window.getSelection().removeAllRanges()
                        }
                    }, {
                        key: "destroy",
                        value: function t() {
                            this.removeFake()
                        }
                    }, {
                        key: "action",
                        set: function t() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "copy";
                            if (this._action = e,
                            "copy" !== this._action && "cut" !== this._action)
                                throw new Error('Invalid "action" value, use either "copy" or "cut"')
                        },
                        get: function t() {
                            return this._action
                        }
                    }, {
                        key: "target",
                        set: function t(e) {
                            if (void 0 !== e) {
                                if (!e || "object" !== (void 0 === e ? "undefined" : r(e)) || 1 !== e.nodeType)
                                    throw new Error('Invalid "target" value, use a valid Element');
                                if ("copy" === this.action && e.hasAttribute("disabled"))
                                    throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                if ("cut" === this.action && (e.hasAttribute("readonly") || e.hasAttribute("disabled")))
                                    throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                this._target = e
                            }
                        },
                        get: function t() {
                            return this._target
                        }
                    }]),
                    t
                }();
                t.exports = c
            })
        }
        , {
            select: 5
        }],
        8: [function(e, n, o) {
            !function(i, r) {
                if ("function" == typeof t && t.amd)
                    t(["module", "./clipboard-action", "tiny-emitter", "good-listener"], r);
                else if (void 0 !== o)
                    r(n, e("./clipboard-action"), e("tiny-emitter"), e("good-listener"));
                else {
                    var a = {
                        exports: {}
                    };
                    r(a, i.clipboardAction, i.tinyEmitter, i.goodListener),
                    i.clipboard = a.exports
                }
            }(this, function(t, e, n, o) {
                "use strict";
                function i(t) {
                    return t && t.__esModule ? t : {
                        default: t
                    }
                }
                function r(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }
                function a(t, e) {
                    if (!t)
                        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !e || "object" != typeof e && "function" != typeof e ? t : e
                }
                function c(t, e) {
                    if ("function" != typeof e && null !== e)
                        throw new TypeError("Super expression must either be null or a function, not " + typeof e);
                    t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                            value: t,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e)
                }
                function l(t, e) {
                    var n = "data-clipboard-" + t;
                    if (e.hasAttribute(n))
                        return e.getAttribute(n)
                }
                var s = i(e)
                  , u = i(n)
                  , f = i(o)
                  , d = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                  , h = function() {
                    function t(t, e) {
                        for (var n = 0; n < e.length; n++) {
                            var o = e[n];
                            o.enumerable = o.enumerable || !1,
                            o.configurable = !0,
                            "value"in o && (o.writable = !0),
                            Object.defineProperty(t, o.key, o)
                        }
                    }
                    return function(e, n, o) {
                        return n && t(e.prototype, n),
                        o && t(e, o),
                        e
                    }
                }()
                  , p = function(t) {
                    function e(t, n) {
                        r(this, e);
                        var o = a(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                        return o.resolveOptions(n),
                        o.listenClick(t),
                        o
                    }
                    return c(e, t),
                    h(e, [{
                        key: "resolveOptions",
                        value: function t() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            this.action = "function" == typeof e.action ? e.action : this.defaultAction,
                            this.target = "function" == typeof e.target ? e.target : this.defaultTarget,
                            this.text = "function" == typeof e.text ? e.text : this.defaultText,
                            this.container = "object" === d(e.container) ? e.container : document.body
                        }
                    }, {
                        key: "listenClick",
                        value: function t(e) {
                            var n = this;
                            this.listener = (0,
                            f.default)(e, "click", function(t) {
                                return n.onClick(t)
                            })
                        }
                    }, {
                        key: "onClick",
                        value: function t(e) {
                            var n = e.delegateTarget || e.currentTarget;
                            this.clipboardAction && (this.clipboardAction = null),
                            this.clipboardAction = new s.default({
                                action: this.action(n),
                                target: this.target(n),
                                text: this.text(n),
                                container: this.container,
                                trigger: n,
                                emitter: this
                            })
                        }
                    }, {
                        key: "defaultAction",
                        value: function t(e) {
                            return l("action", e)
                        }
                    }, {
                        key: "defaultTarget",
                        value: function t(e) {
                            var n = l("target", e);
                            if (n)
                                return document.querySelector(n)
                        }
                    }, {
                        key: "defaultText",
                        value: function t(e) {
                            return l("text", e)
                        }
                    }, {
                        key: "destroy",
                        value: function t() {
                            this.listener.destroy(),
                            this.clipboardAction && (this.clipboardAction.destroy(),
                            this.clipboardAction = null)
                        }
                    }], [{
                        key: "isSupported",
                        value: function t() {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ["copy", "cut"]
                              , n = "string" == typeof e ? [e] : e
                              , o = !!document.queryCommandSupported;
                            return n.forEach(function(t) {
                                o = o && !!document.queryCommandSupported(t)
                            }),
                            o
                        }
                    }]),
                    e
                }(u.default);
                t.exports = p
            })
        }
        , {
            "./clipboard-action": 7,
            "good-listener": 4,
            "tiny-emitter": 6
        }]
    }, {}, [8])(8)
});