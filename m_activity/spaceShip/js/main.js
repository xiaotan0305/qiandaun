function Orienter() {
    this.initialize.apply(this, arguments)
}
!function(t, e) {
    "function" == typeof define && define.amd ? define([], function() {
        return t.PxLoader = e()
    }) : "object" == typeof module && module.exports ? module.exports = e() : t.PxLoader = e()
}(this, function() {
    function t(t) {
        t = t || {},
        this.settings = t,
        null == t.statusInterval && (t.statusInterval = 5e3),
        null == t.loggingDelay && (t.loggingDelay = 2e4),
        null == t.noProgressTimeout && (t.noProgressTimeout = 1 / 0);
        var i, n = [], r = [], s = [], a = Date.now(), o = {
            QUEUED: 0,
            WAITING: 1,
            LOADED: 2,
            ERROR: 3,
            TIMEOUT: 4
        }, l = function(t) {
            return null == t ? [] : Array.isArray(t) ? t : [t]
        }
        ;
        this.add = function(t) {
            t.tags = new e(t.tags),
            null == t.priority && (t.priority = 1 / 0),
            n.push({
                resource: t,
                status: o.QUEUED
            })
        }
        ,
        this.addProgressListener = function(t, i) {
            s.push({
                callback: t,
                tags: new e(i)
            })
        }
        ,
        this.addCompletionListener = function(t, i) {
            r.push({
                tags: new e(i),
                callback: function(e) {
                    e.completedCount === e.totalCount && t(e)
                }
            })
        }
        ;
        var h = function(t) {
            t = l(t);
            var e = function(e) {
                for (var i = e.resource, n = 1 / 0, r = 0; r < i.tags.length; r++)
                    for (var s = 0; s < Math.min(t.length, n) && !(i.tags.all[r] === t[s] && s < n && (n = s,
                    0 === n)) && 0 !== n; s++)
                        ;
                return n
            }
            ;
            return function(t, i) {
                var n = e(t)
                  , r = e(i);
                return n < r ? -1 : n > r ? 1 : t.priority < i.priority ? -1 : t.priority > i.priority ? 1 : 0
            }
        }
        ;
        this.start = function(t) {
            i = Date.now();
            var e = h(t);
            n.sort(e);
            for (var r = 0, s = n.length; r < s; r++) {
                var a = n[r];
                a.status = o.WAITING,
                a.resource.start(this)
            }
            setTimeout(u, 100)
        }
        ;
        var u = function() {
            for (var e = !1, i = Date.now() - a, r = i >= t.noProgressTimeout, s = i >= t.loggingDelay, l = 0, h = n.length; l < h; l++) {
                var c = n[l];
                c.status === o.WAITING && (c.resource.checkStatus && c.resource.checkStatus(),
                c.status === o.WAITING && (r ? c.resource.onTimeout() : e = !0))
            }
            s && e && p(),
            e && setTimeout(u, t.statusInterval)
        }
        ;
        this.isBusy = function() {
            for (var t = 0, e = n.length; t < e; t++)
                if (n[t].status === o.QUEUED || n[t].status === o.WAITING)
                    return !0;
            return !1
        }
        ;
        var c = function(t, e) {
            var i, l, h, u, c, p = null ;
            for (i = 0,
            l = n.length; i < l; i++)
                if (n[i].resource === t) {
                    p = n[i];
                    break
                }
            if (null != p && p.status === o.WAITING)
                for (p.status = e,
                a = Date.now(),
                h = s.concat(r),
                i = 0,
                l = h.length; i < l; i++)
                    u = h[i],
                    c = 0 === u.tags.length || t.tags.intersects(u.tags),
                    c && f(p, u)
        }
        ;
        this.onLoad = function(t) {
            c(t, o.LOADED)
        }
        ,
        this.onError = function(t) {
            c(t, o.ERROR)
        }
        ,
        this.onTimeout = function(t) {
            c(t, o.TIMEOUT)
        }
        ;
        var f = function(t, e) {
            var i, r, s, a, l = 0, h = 0;
            for (i = 0,
            r = n.length; i < r; i++)
                s = n[i],
                a = !1,
                a = 0 === e.tags.length || s.resource.tags.intersects(e.tags),
                a && (h++,
                s.status !== o.LOADED && s.status !== o.ERROR && s.status !== o.TIMEOUT || l++);
            e.callback({
                resource: t.resource,
                loaded: t.status === o.LOADED,
                error: t.status === o.ERROR,
                timeout: t.status === o.TIMEOUT,
                completedCount: l,
                totalCount: h
            })
        }
          , p = this.log = function(t) {
            if (window.console) {
                var e = Math.round((Date.now() - i) / 1e3);
                window.console.log("PxLoader elapsed: " + e + " sec");
                for (var r = 0, s = n.length; r < s; r++) {
                    var a = n[r];
                    if (t || a.status === o.WAITING) {
                        var l = "PxLoader: #" + r + " " + a.resource.getName();
                        switch (a.status) {
                        case o.QUEUED:
                            l += " (Not Started)";
                            break;
                        case o.WAITING:
                            l += " (Waiting)";
                            break;
                        case o.LOADED:
                            l += " (Loaded)";
                            break;
                        case o.ERROR:
                            l += " (Error)";
                            break;
                        case o.TIMEOUT:
                            l += " (Timeout)"
                        }
                        a.resource.tags.length > 0 && (l += " Tags: [" + a.resource.tags.all.join(",") + "]"),
                        window.console.log(l)
                    }
                }
            }
        }
    }
    function e(t) {
        if (this.all = [],
        this.first = null ,
        this.length = 0,
        this.lookup = {},
        t) {
            if (Array.isArray(t))
                this.all = t.slice(0);
            else if ("object" == typeof t)
                for (var e in t)
                    t.hasOwnProperty(e) && this.all.push(e);
            else
                this.all.push(t);
            this.length = this.all.length,
            this.length > 0 && (this.first = this.all[0]);
            for (var i = 0; i < this.length; i++)
                this.lookup[this.all[i]] = !0
        }
    }
    return e.prototype.intersects = function(t) {
        if (0 === this.length || 0 === t.length)
            return !1;
        if (1 === this.length && 1 === t.length)
            return this.first === t.first;
        if (t.length < this.length)
            return t.intersects(this);
        for (var e in this.lookup)
            if (t.lookup[e])
                return !0;
        return !1
    }
    ,
    t
}),
function(t, e) {
    "function" == typeof define && define.amd ? define(["pxloader"], function(i) {
        return t.PxLoaderImage = e(i)
    }) : "object" == typeof module && module.exports ? module.exports = e(require("pxloader")) : t.PxLoaderImage = e(t.PxLoader)
}(this, function(t) {
    function e(t, e, i, n) {
        n = n || {};
        var r, s = this, a = null ;
        r = this.img = new Image,
        n.origin && (r.crossOrigin = n.origin),
        this.tags = e,
        this.priority = i;
        var o = function() {
            "complete" === s.img.readyState && l()
        }
          , l = function() {
            a.onLoad(s),
            c()
        }
          , h = function() {
            a.onError(s),
            c()
        }
          , u = function() {
            a.onTimeout(s),
            c()
        }
          , c = function() {
            s.unbind("load", l),
            s.unbind("readystatechange", o),
            s.unbind("error", h)
        }
        ;
        this.start = function(e) {
            a = e,
            s.bind("load", l),
            s.bind("readystatechange", o),
            s.bind("error", h),
            s.img.src = t
        }
        ,
        this.checkStatus = function() {
            o()
        }
        ,
        this.onTimeout = function() {
            s.img.complete ? l() : u()
        }
        ,
        this.getName = function() {
            return t
        }
        ,
        this.bind = function(t, e) {
            s.img.addEventListener(t, e, !1)
        }
        ,
        this.unbind = function(t, e) {
            s.img.removeEventListener(t, e, !1)
        }
    }
    return t.prototype.addImage = function(t, i, n, r) {
        var s = new e(t,i,n,r);
        return this.add(s),
        s.img
    }
    ,
    e
}),
function(t, e) {
    "function" == typeof define && define.amd ? define(function() {
        return e(t)
    }) : e(t)
}(this, function(t) {
    var e = function() {
        function e(t) {
            return null == t ? String(t) : H[G.call(t)] || "object"
        }
        function i(t) {
            return "function" == e(t)
        }
        function n(t) {
            return null != t && t == t.window
        }
        function r(t) {
            return null != t && t.nodeType == t.DOCUMENT_NODE
        }
        function s(t) {
            return "object" == e(t)
        }
        function a(t) {
            return s(t) && !n(t) && Object.getPrototypeOf(t) == Object.prototype
        }
        function o(t) {
            var e = !!t && "length"in t && t.length
              , i = O.type(t);
            return "function" != i && !n(t) && ("array" == i || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
        }
        function l(t) {
            return A.call(t, function(t) {
                return null != t
            })
        }
        function h(t) {
            return t.length > 0 ? O.fn.concat.apply([], t) : t
        }
        function u(t) {
            return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
        }
        function c(t) {
            return t in I ? I[t] : I[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
        }
        function f(t, e) {
            return "number" != typeof e || N[u(t)] ? e : e + "px"
        }
        function p(t) {
            var e, i;
            return z[t] || (e = E.createElement(t),
            E.body.appendChild(e),
            i = getComputedStyle(e, "").getPropertyValue("display"),
            e.parentNode.removeChild(e),
            "none" == i && (i = "block"),
            z[t] = i),
            z[t]
        }
        function _(t) {
            return "children"in t ? D.call(t.children) : O.map(t.childNodes, function(t) {
                if (1 == t.nodeType)
                    return t
            })
        }
        function d(t, e) {
            var i, n = t ? t.length : 0;
            for (i = 0; i < n; i++)
                this[i] = t[i];
            this.length = n,
            this.selector = e || ""
        }
        function m(t, e, i) {
            for (P in e)
                i && (a(e[P]) || tt(e[P])) ? (a(e[P]) && !a(t[P]) && (t[P] = {}),
                tt(e[P]) && !tt(t[P]) && (t[P] = []),
                m(t[P], e[P], i)) : e[P] !== w && (t[P] = e[P])
        }
        function g(t, e) {
            return null == e ? O(t) : O(t).filter(e)
        }
        function v(t, e, n, r) {
            return i(e) ? e.call(t, n, r) : e
        }
        function y(t, e, i) {
            null == i ? t.removeAttribute(e) : t.setAttribute(e, i)
        }
        function x(t, e) {
            var i = t.className || ""
              , n = i && i.baseVal !== w;
            return e === w ? n ? i.baseVal : i : void (n ? i.baseVal = e : t.className = e)
        }
        function T(t) {
            try {
                return t ? "true" == t || "false" != t && ("null" == t ? null : +t + "" == t ? +t : /^[\[\{]/.test(t) ? O.parseJSON(t) : t) : t
            } catch (e) {
                return t
            }
        }
        function b(t, e) {
            e(t);
            for (var i = 0, n = t.childNodes.length; i < n; i++)
                b(t.childNodes[i], e)
        }
        var w, P, O, S, k, C, R = [], M = R.concat, A = R.filter, D = R.slice, E = t.document, z = {}, I = {}, N = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
        }, F = /^\s*<(\w+|!)[^>]*>/, L = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, X = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, j = /^(?:body|html)$/i, Y = /([A-Z])/g, B = ["val", "css", "html", "text", "data", "width", "height", "offset"], U = ["after", "prepend", "before", "append"], $ = E.createElement("table"), Z = E.createElement("tr"), q = {
            tr: E.createElement("tbody"),
            tbody: $,
            thead: $,
            tfoot: $,
            td: Z,
            th: Z,
            "*": E.createElement("div")
        }, V = /complete|loaded|interactive/, W = /^[\w-]*$/, H = {}, G = H.toString, Q = {}, J = E.createElement("div"), K = {
            tabindex: "tabIndex",
            readonly: "readOnly",
            for: "htmlFor",
            class: "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        }, tt = Array.isArray || function(t) {
            return t instanceof Array
        }
        ;
        return Q.matches = function(t, e) {
            if (!e || !t || 1 !== t.nodeType)
                return !1;
            var i = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
            if (i)
                return i.call(t, e);
            var n, r = t.parentNode, s = !r;
            return s && (r = J).appendChild(t),
            n = ~Q.qsa(r, e).indexOf(t),
            s && J.removeChild(t),
            n
        }
        ,
        k = function(t) {
            return t.replace(/-+(.)?/g, function(t, e) {
                return e ? e.toUpperCase() : ""
            })
        }
        ,
        C = function(t) {
            return A.call(t, function(e, i) {
                return t.indexOf(e) == i
            })
        }
        ,
        Q.fragment = function(t, e, i) {
            var n, r, s;
            return L.test(t) && (n = O(E.createElement(RegExp.$1))),
            n || (t.replace && (t = t.replace(X, "<$1></$2>")),
            e === w && (e = F.test(t) && RegExp.$1),
            e in q || (e = "*"),
            s = q[e],
            s.innerHTML = "" + t,
            n = O.each(D.call(s.childNodes), function() {
                s.removeChild(this)
            })),
            a(i) && (r = O(n),
            O.each(i, function(t, e) {
                B.indexOf(t) > -1 ? r[t](e) : r.attr(t, e)
            })),
            n
        }
        ,
        Q.Z = function(t, e) {
            return new d(t,e)
        }
        ,
        Q.isZ = function(t) {
            return t instanceof Q.Z
        }
        ,
        Q.init = function(t, e) {
            var n;
            if (!t)
                return Q.Z();
            if ("string" == typeof t)
                if (t = t.trim(),
                "<" == t[0] && F.test(t))
                    n = Q.fragment(t, RegExp.$1, e),
                    t = null ;
                else {
                    if (e !== w)
                        return O(e).find(t);
                    n = Q.qsa(E, t)
                }
            else {
                if (i(t))
                    return O(E).ready(t);
                if (Q.isZ(t))
                    return t;
                if (tt(t))
                    n = l(t);
                else if (s(t))
                    n = [t],
                    t = null ;
                else if (F.test(t))
                    n = Q.fragment(t.trim(), RegExp.$1, e),
                    t = null ;
                else {
                    if (e !== w)
                        return O(e).find(t);
                    n = Q.qsa(E, t)
                }
            }
            return Q.Z(n, t)
        }
        ,
        O = function(t, e) {
            return Q.init(t, e)
        }
        ,
        O.extend = function(t) {
            var e, i = D.call(arguments, 1);
            return "boolean" == typeof t && (e = t,
            t = i.shift()),
            i.forEach(function(i) {
                m(t, i, e)
            }),
            t
        }
        ,
        Q.qsa = function(t, e) {
            var i, n = "#" == e[0], r = !n && "." == e[0], s = n || r ? e.slice(1) : e, a = W.test(s);
            return t.getElementById && a && n ? (i = t.getElementById(s)) ? [i] : [] : 1 !== t.nodeType && 9 !== t.nodeType && 11 !== t.nodeType ? [] : D.call(a && !n && t.getElementsByClassName ? r ? t.getElementsByClassName(s) : t.getElementsByTagName(e) : t.querySelectorAll(e))
        }
        ,
        O.contains = E.documentElement.contains ? function(t, e) {
            return t !== e && t.contains(e)
        }
        : function(t, e) {
            for (; e && (e = e.parentNode); )
                if (e === t)
                    return !0;
            return !1
        }
        ,
        O.type = e,
        O.isFunction = i,
        O.isWindow = n,
        O.isArray = tt,
        O.isPlainObject = a,
        O.isEmptyObject = function(t) {
            var e;
            for (e in t)
                return !1;
            return !0
        }
        ,
        O.isNumeric = function(t) {
            var e = Number(t)
              , i = typeof t;
            return null != t && "boolean" != i && ("string" != i || t.length) && !isNaN(e) && isFinite(e) || !1
        }
        ,
        O.inArray = function(t, e, i) {
            return R.indexOf.call(e, t, i)
        }
        ,
        O.camelCase = k,
        O.trim = function(t) {
            return null == t ? "" : String.prototype.trim.call(t)
        }
        ,
        O.uuid = 0,
        O.support = {},
        O.expr = {},
        O.noop = function() {}
        ,
        O.map = function(t, e) {
            var i, n, r, s = [];
            if (o(t))
                for (n = 0; n < t.length; n++)
                    i = e(t[n], n),
                    null != i && s.push(i);
            else
                for (r in t)
                    i = e(t[r], r),
                    null != i && s.push(i);
            return h(s)
        }
        ,
        O.each = function(t, e) {
            var i, n;
            if (o(t)) {
                for (i = 0; i < t.length; i++)
                    if (e.call(t[i], i, t[i]) === !1)
                        return t
            } else
                for (n in t)
                    if (e.call(t[n], n, t[n]) === !1)
                        return t;
            return t
        }
        ,
        O.grep = function(t, e) {
            return A.call(t, e)
        }
        ,
        t.JSON && (O.parseJSON = JSON.parse),
        O.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
            H["[object " + e + "]"] = e.toLowerCase()
        }),
        O.fn = {
            constructor: Q.Z,
            length: 0,
            forEach: R.forEach,
            reduce: R.reduce,
            push: R.push,
            sort: R.sort,
            splice: R.splice,
            indexOf: R.indexOf,
            concat: function() {
                var t, e, i = [];
                for (t = 0; t < arguments.length; t++)
                    e = arguments[t],
                    i[t] = Q.isZ(e) ? e.toArray() : e;
                return M.apply(Q.isZ(this) ? this.toArray() : this, i)
            },
            map: function(t) {
                return O(O.map(this, function(e, i) {
                    return t.call(e, i, e)
                }))
            },
            slice: function() {
                return O(D.apply(this, arguments))
            },
            ready: function(t) {
                return V.test(E.readyState) && E.body ? t(O) : E.addEventListener("DOMContentLoaded", function() {
                    t(O)
                }, !1),
                this
            },
            get: function(t) {
                return t === w ? D.call(this) : this[t >= 0 ? t : t + this.length]
            },
            toArray: function() {
                return this.get()
            },
            size: function() {
                return this.length
            },
            remove: function() {
                return this.each(function() {
                    null != this.parentNode && this.parentNode.removeChild(this)
                })
            },
            each: function(t) {
                return R.every.call(this, function(e, i) {
                    return t.call(e, i, e) !== !1
                }),
                this
            },
            filter: function(t) {
                return i(t) ? this.not(this.not(t)) : O(A.call(this, function(e) {
                    return Q.matches(e, t)
                }))
            },
            add: function(t, e) {
                return O(C(this.concat(O(t, e))))
            },
            is: function(t) {
                return this.length > 0 && Q.matches(this[0], t)
            },
            not: function(t) {
                var e = [];
                if (i(t) && t.call !== w)
                    this.each(function(i) {
                        t.call(this, i) || e.push(this)
                    });
                else {
                    var n = "string" == typeof t ? this.filter(t) : o(t) && i(t.item) ? D.call(t) : O(t);
                    this.forEach(function(t) {
                        n.indexOf(t) < 0 && e.push(t)
                    })
                }
                return O(e)
            },
            has: function(t) {
                return this.filter(function() {
                    return s(t) ? O.contains(this, t) : O(this).find(t).size()
                })
            },
            eq: function(t) {
                return t === -1 ? this.slice(t) : this.slice(t, +t + 1)
            },
            first: function() {
                var t = this[0];
                return t && !s(t) ? t : O(t)
            },
            last: function() {
                var t = this[this.length - 1];
                return t && !s(t) ? t : O(t)
            },
            find: function(t) {
                var e, i = this;
                return e = t ? "object" == typeof t ? O(t).filter(function() {
                    var t = this;
                    return R.some.call(i, function(e) {
                        return O.contains(e, t)
                    })
                }) : 1 == this.length ? O(Q.qsa(this[0], t)) : this.map(function() {
                    return Q.qsa(this, t)
                }) : O()
            },
            closest: function(t, e) {
                var i = []
                  , n = "object" == typeof t && O(t);
                return this.each(function(s, a) {
                    for (; a && !(n ? n.indexOf(a) >= 0 : Q.matches(a, t)); )
                        a = a !== e && !r(a) && a.parentNode;
                    a && i.indexOf(a) < 0 && i.push(a)
                }),
                O(i)
            },
            parents: function(t) {
                for (var e = [], i = this; i.length > 0; )
                    i = O.map(i, function(t) {
                        if ((t = t.parentNode) && !r(t) && e.indexOf(t) < 0)
                            return e.push(t),
                            t
                    });
                return g(e, t)
            },
            parent: function(t) {
                return g(C(this.pluck("parentNode")), t)
            },
            children: function(t) {
                return g(this.map(function() {
                    return _(this)
                }), t)
            },
            contents: function() {
                return this.map(function() {
                    return this.contentDocument || D.call(this.childNodes)
                })
            },
            siblings: function(t) {
                return g(this.map(function(t, e) {
                    return A.call(_(e.parentNode), function(t) {
                        return t !== e
                    })
                }), t)
            },
            empty: function() {
                return this.each(function() {
                    this.innerHTML = ""
                })
            },
            pluck: function(t) {
                return O.map(this, function(e) {
                    return e[t]
                })
            },
            show: function() {
                return this.each(function() {
                    "none" == this.style.display && (this.style.display = ""),
                    "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = p(this.nodeName))
                })
            },
            replaceWith: function(t) {
                return this.before(t).remove()
            },
            wrap: function(t) {
                var e = i(t);
                if (this[0] && !e)
                    var n = O(t).get(0)
                      , r = n.parentNode || this.length > 1;
                return this.each(function(i) {
                    O(this).wrapAll(e ? t.call(this, i) : r ? n.cloneNode(!0) : n)
                })
            },
            wrapAll: function(t) {
                if (this[0]) {
                    O(this[0]).before(t = O(t));
                    for (var e; (e = t.children()).length; )
                        t = e.first();
                    O(t).append(this)
                }
                return this
            },
            wrapInner: function(t) {
                var e = i(t);
                return this.each(function(i) {
                    var n = O(this)
                      , r = n.contents()
                      , s = e ? t.call(this, i) : t;
                    r.length ? r.wrapAll(s) : n.append(s)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    O(this).replaceWith(O(this).children())
                }),
                this
            },
            clone: function() {
                return this.map(function() {
                    return this.cloneNode(!0)
                })
            },
            hide: function() {
                return this.css("display", "none")
            },
            toggle: function(t) {
                return this.each(function() {
                    var e = O(this);
                    (t === w ? "none" == e.css("display") : t) ? e.show() : e.hide()
                })
            },
            prev: function(t) {
                return O(this.pluck("previousElementSibling")).filter(t || "*")
            },
            next: function(t) {
                return O(this.pluck("nextElementSibling")).filter(t || "*")
            },
            html: function(t) {
                return 0 in arguments ? this.each(function(e) {
                    var i = this.innerHTML;
                    O(this).empty().append(v(this, t, e, i))
                }) : 0 in this ? this[0].innerHTML : null
            },
            text: function(t) {
                return 0 in arguments ? this.each(function(e) {
                    var i = v(this, t, e, this.textContent);
                    this.textContent = null == i ? "" : "" + i
                }) : 0 in this ? this.pluck("textContent").join("") : null
            },
            attr: function(t, e) {
                var i;
                return "string" != typeof t || 1 in arguments ? this.each(function(i) {
                    if (1 === this.nodeType)
                        if (s(t))
                            for (P in t)
                                y(this, P, t[P]);
                        else
                            y(this, t, v(this, e, i, this.getAttribute(t)))
                }) : 0 in this && 1 == this[0].nodeType && null != (i = this[0].getAttribute(t)) ? i : w
            },
            removeAttr: function(t) {
                return this.each(function() {
                    1 === this.nodeType && t.split(" ").forEach(function(t) {
                        y(this, t)
                    }, this)
                })
            },
            prop: function(t, e) {
                return t = K[t] || t,
                1 in arguments ? this.each(function(i) {
                    this[t] = v(this, e, i, this[t])
                }) : this[0] && this[0][t]
            },
            removeProp: function(t) {
                return t = K[t] || t,
                this.each(function() {
                    delete this[t]
                })
            },
            data: function(t, e) {
                var i = "data-" + t.replace(Y, "-$1").toLowerCase()
                  , n = 1 in arguments ? this.attr(i, e) : this.attr(i);
                return null !== n ? T(n) : w
            },
            val: function(t) {
                return 0 in arguments ? (null == t && (t = ""),
                this.each(function(e) {
                    this.value = v(this, t, e, this.value)
                })) : this[0] && (this[0].multiple ? O(this[0]).find("option").filter(function() {
                    return this.selected
                }).pluck("value") : this[0].value)
            },
            offset: function(e) {
                if (e)
                    return this.each(function(t) {
                        var i = O(this)
                          , n = v(this, e, t, i.offset())
                          , r = i.offsetParent().offset()
                          , s = {
                            top: n.top - r.top,
                            left: n.left - r.left
                        };
                        "static" == i.css("position") && (s.position = "relative"),
                        i.css(s)
                    });
                if (!this.length)
                    return null ;
                if (E.documentElement !== this[0] && !O.contains(E.documentElement, this[0]))
                    return {
                        top: 0,
                        left: 0
                    };
                var i = this[0].getBoundingClientRect();
                return {
                    left: i.left + t.pageXOffset,
                    top: i.top + t.pageYOffset,
                    width: Math.round(i.width),
                    height: Math.round(i.height)
                }
            },
            css: function(t, i) {
                if (arguments.length < 2) {
                    var n = this[0];
                    if ("string" == typeof t) {
                        if (!n)
                            return;
                        return n.style[k(t)] || getComputedStyle(n, "").getPropertyValue(t)
                    }
                    if (tt(t)) {
                        if (!n)
                            return;
                        var r = {}
                          , s = getComputedStyle(n, "");
                        return O.each(t, function(t, e) {
                            r[e] = n.style[k(e)] || s.getPropertyValue(e)
                        }),
                        r
                    }
                }
                var a = "";
                if ("string" == e(t))
                    i || 0 === i ? a = u(t) + ":" + f(t, i) : this.each(function() {
                        this.style.removeProperty(u(t))
                    });
                else
                    for (P in t)
                        t[P] || 0 === t[P] ? a += u(P) + ":" + f(P, t[P]) + ";" : this.each(function() {
                            this.style.removeProperty(u(P))
                        });
                return this.each(function() {
                    this.style.cssText += ";" + a
                })
            },
            index: function(t) {
                return t ? this.indexOf(O(t)[0]) : this.parent().children().indexOf(this[0])
            },
            hasClass: function(t) {
                return !!t && R.some.call(this, function(t) {
                    return this.test(x(t))
                }, c(t))
            },
            addClass: function(t) {
                return t ? this.each(function(e) {
                    if ("className"in this) {
                        S = [];
                        var i = x(this)
                          , n = v(this, t, e, i);
                        n.split(/\s+/g).forEach(function(t) {
                            O(this).hasClass(t) || S.push(t)
                        }, this),
                        S.length && x(this, i + (i ? " " : "") + S.join(" "))
                    }
                }) : this
            },
            removeClass: function(t) {
                return this.each(function(e) {
                    if ("className"in this) {
                        if (t === w)
                            return x(this, "");
                        S = x(this),
                        v(this, t, e, S).split(/\s+/g).forEach(function(t) {
                            S = S.replace(c(t), " ")
                        }),
                        x(this, S.trim())
                    }
                })
            },
            toggleClass: function(t, e) {
                return t ? this.each(function(i) {
                    var n = O(this)
                      , r = v(this, t, i, x(this));
                    r.split(/\s+/g).forEach(function(t) {
                        (e === w ? !n.hasClass(t) : e) ? n.addClass(t) : n.removeClass(t)
                    })
                }) : this
            },
            scrollTop: function(t) {
                if (this.length) {
                    var e = "scrollTop"in this[0];
                    return t === w ? e ? this[0].scrollTop : this[0].pageYOffset : this.each(e ? function() {
                        this.scrollTop = t
                    }
                    : function() {
                        this.scrollTo(this.scrollX, t)
                    }
                    )
                }
            },
            scrollLeft: function(t) {
                if (this.length) {
                    var e = "scrollLeft"in this[0];
                    return t === w ? e ? this[0].scrollLeft : this[0].pageXOffset : this.each(e ? function() {
                        this.scrollLeft = t
                    }
                    : function() {
                        this.scrollTo(t, this.scrollY)
                    }
                    )
                }
            },
            position: function() {
                if (this.length) {
                    var t = this[0]
                      , e = this.offsetParent()
                      , i = this.offset()
                      , n = j.test(e[0].nodeName) ? {
                        top: 0,
                        left: 0
                    } : e.offset();
                    return i.top -= parseFloat(O(t).css("margin-top")) || 0,
                    i.left -= parseFloat(O(t).css("margin-left")) || 0,
                    n.top += parseFloat(O(e[0]).css("border-top-width")) || 0,
                    n.left += parseFloat(O(e[0]).css("border-left-width")) || 0,
                    {
                        top: i.top - n.top,
                        left: i.left - n.left
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var t = this.offsetParent || E.body; t && !j.test(t.nodeName) && "static" == O(t).css("position"); )
                        t = t.offsetParent;
                    return t
                })
            }
        },
        O.fn.detach = O.fn.remove,
        ["width", "height"].forEach(function(t) {
            var e = t.replace(/./, function(t) {
                return t[0].toUpperCase()
            });
            O.fn[t] = function(i) {
                var s, a = this[0];
                return i === w ? n(a) ? a["inner" + e] : r(a) ? a.documentElement["scroll" + e] : (s = this.offset()) && s[t] : this.each(function(e) {
                    a = O(this),
                    a.css(t, v(this, i, e, a[t]()))
                })
            }
        }),
        U.forEach(function(i, n) {
            var r = n % 2;
            O.fn[i] = function() {
                var i, s, a = O.map(arguments, function(t) {
                    var n = [];
                    return i = e(t),
                    "array" == i ? (t.forEach(function(t) {
                        return t.nodeType !== w ? n.push(t) : O.zepto.isZ(t) ? n = n.concat(t.get()) : void (n = n.concat(Q.fragment(t)))
                    }),
                    n) : "object" == i || null == t ? t : Q.fragment(t)
                }), o = this.length > 1;
                return a.length < 1 ? this : this.each(function(e, i) {
                    s = r ? i : i.parentNode,
                    i = 0 == n ? i.nextSibling : 1 == n ? i.firstChild : 2 == n ? i : null ;
                    var l = O.contains(E.documentElement, s);
                    a.forEach(function(e) {
                        if (o)
                            e = e.cloneNode(!0);
                        else if (!s)
                            return O(e).remove();
                        s.insertBefore(e, i),
                        l && b(e, function(e) {
                            if (!(null == e.nodeName || "SCRIPT" !== e.nodeName.toUpperCase() || e.type && "text/javascript" !== e.type || e.src)) {
                                var i = e.ownerDocument ? e.ownerDocument.defaultView : t;
                                i.eval.call(i, e.innerHTML)
                            }
                        })
                    })
                })
            }
            ,
            O.fn[r ? i + "To" : "insert" + (n ? "Before" : "After")] = function(t) {
                return O(t)[i](this),
                this
            }
        }),
        Q.Z.prototype = d.prototype = O.fn,
        Q.uniq = C,
        Q.deserializeValue = T,
        O.zepto = Q,
        O
    }();
    return t.Zepto = e,
    void 0 === t.$ && (t.$ = e),
    function(e) {
        function i(t) {
            return t._zid || (t._zid = p++)
        }
        function n(t, e, n, a) {
            if (e = r(e),
            e.ns)
                var o = s(e.ns);
            return (g[i(t)] || []).filter(function(t) {
                return t && (!e.e || t.e == e.e) && (!e.ns || o.test(t.ns)) && (!n || i(t.fn) === i(n)) && (!a || t.sel == a)
            })
        }
        function r(t) {
            var e = ("" + t).split(".");
            return {
                e: e[0],
                ns: e.slice(1).sort().join(" ")
            }
        }
        function s(t) {
            return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
        }
        function a(t, e) {
            return t.del && !y && t.e in x || !!e
        }
        function o(t) {
            return T[t] || y && x[t] || t
        }
        function l(t, n, s, l, h, c, p) {
            var _ = i(t)
              , d = g[_] || (g[_] = []);
            n.split(/\s/).forEach(function(i) {
                if ("ready" == i)
                    return e(document).ready(s);
                var n = r(i);
                n.fn = s,
                n.sel = h,
                n.e in T && (s = function(t) {
                    var i = t.relatedTarget;
                    if (!i || i !== this && !e.contains(this, i))
                        return n.fn.apply(this, arguments)
                }
                ),
                n.del = c;
                var _ = c || s;
                n.proxy = function(e) {
                    if (e = u(e),
                    !e.isImmediatePropagationStopped()) {
                        e.data = l;
                        var i = _.apply(t, e._args == f ? [e] : [e].concat(e._args));
                        return i === !1 && (e.preventDefault(),
                        e.stopPropagation()),
                        i
                    }
                }
                ,
                n.i = d.length,
                d.push(n),
                "addEventListener"in t && t.addEventListener(o(n.e), n.proxy, a(n, p))
            })
        }
        function h(t, e, r, s, l) {
            var h = i(t);
            (e || "").split(/\s/).forEach(function(e) {
                n(t, e, r, s).forEach(function(e) {
                    delete g[h][e.i],
                    "removeEventListener"in t && t.removeEventListener(o(e.e), e.proxy, a(e, l))
                })
            })
        }
        function u(t, i) {
            if (i || !t.isDefaultPrevented) {
                i || (i = t),
                e.each(O, function(e, n) {
                    var r = i[e];
                    t[e] = function() {
                        return this[n] = b,
                        r && r.apply(i, arguments)
                    }
                    ,
                    t[n] = w
                });
                try {
                    t.timeStamp || (t.timeStamp = Date.now())
                } catch (t) {}
                (i.defaultPrevented !== f ? i.defaultPrevented : "returnValue"in i ? i.returnValue === !1 : i.getPreventDefault && i.getPreventDefault()) && (t.isDefaultPrevented = b)
            }
            return t
        }
        function c(t) {
            var e, i = {
                originalEvent: t
            };
            for (e in t)
                P.test(e) || t[e] === f || (i[e] = t[e]);
            return u(i, t)
        }
        var f, p = 1, _ = Array.prototype.slice, d = e.isFunction, m = function(t) {
            return "string" == typeof t
        }
        , g = {}, v = {}, y = "onfocusin"in t, x = {
            focus: "focusin",
            blur: "focusout"
        }, T = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        };
        v.click = v.mousedown = v.mouseup = v.mousemove = "MouseEvents",
        e.event = {
            add: l,
            remove: h
        },
        e.proxy = function(t, n) {
            var r = 2 in arguments && _.call(arguments, 2);
            if (d(t)) {
                var s = function() {
                    return t.apply(n, r ? r.concat(_.call(arguments)) : arguments)
                }
                ;
                return s._zid = i(t),
                s
            }
            if (m(n))
                return r ? (r.unshift(t[n], t),
                e.proxy.apply(null , r)) : e.proxy(t[n], t);
            throw new TypeError("expected function")
        }
        ,
        e.fn.bind = function(t, e, i) {
            return this.on(t, e, i)
        }
        ,
        e.fn.unbind = function(t, e) {
            return this.off(t, e)
        }
        ,
        e.fn.one = function(t, e, i, n) {
            return this.on(t, e, i, n, 1)
        }
        ;
        var b = function() {
            return !0
        }
          , w = function() {
            return !1
        }
          , P = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/
          , O = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        };
        e.fn.delegate = function(t, e, i) {
            return this.on(e, t, i)
        }
        ,
        e.fn.undelegate = function(t, e, i) {
            return this.off(e, t, i)
        }
        ,
        e.fn.live = function(t, i) {
            return e(document.body).delegate(this.selector, t, i),
            this
        }
        ,
        e.fn.die = function(t, i) {
            return e(document.body).undelegate(this.selector, t, i),
            this
        }
        ,
        e.fn.on = function(t, i, n, r, s) {
            var a, o, u = this;
            return t && !m(t) ? (e.each(t, function(t, e) {
                u.on(t, i, n, e, s)
            }),
            u) : (m(i) || d(r) || r === !1 || (r = n,
            n = i,
            i = f),
            r !== f && n !== !1 || (r = n,
            n = f),
            r === !1 && (r = w),
            u.each(function(u, f) {
                s && (a = function(t) {
                    return h(f, t.type, r),
                    r.apply(this, arguments)
                }
                ),
                i && (o = function(t) {
                    var n, s = e(t.target).closest(i, f).get(0);
                    if (s && s !== f)
                        return n = e.extend(c(t), {
                            currentTarget: s,
                            liveFired: f
                        }),
                        (a || r).apply(s, [n].concat(_.call(arguments, 1)))
                }
                ),
                l(f, t, r, n, i, o || a)
            }))
        }
        ,
        e.fn.off = function(t, i, n) {
            var r = this;
            return t && !m(t) ? (e.each(t, function(t, e) {
                r.off(t, i, e)
            }),
            r) : (m(i) || d(n) || n === !1 || (n = i,
            i = f),
            n === !1 && (n = w),
            r.each(function() {
                h(this, t, n, i)
            }))
        }
        ,
        e.fn.trigger = function(t, i) {
            return t = m(t) || e.isPlainObject(t) ? e.Event(t) : u(t),
            t._args = i,
            this.each(function() {
                t.type in x && "function" == typeof this[t.type] ? this[t.type]() : "dispatchEvent"in this ? this.dispatchEvent(t) : e(this).triggerHandler(t, i)
            })
        }
        ,
        e.fn.triggerHandler = function(t, i) {
            var r, s;
            return this.each(function(a, o) {
                r = c(m(t) ? e.Event(t) : t),
                r._args = i,
                r.target = o,
                e.each(n(o, t.type || t), function(t, e) {
                    if (s = e.proxy(r),
                    r.isImmediatePropagationStopped())
                        return !1
                })
            }),
            s
        }
        ,
        "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(t) {
            e.fn[t] = function(e) {
                return 0 in arguments ? this.bind(t, e) : this.trigger(t)
            }
        }),
        e.Event = function(t, e) {
            m(t) || (e = t,
            t = e.type);
            var i = document.createEvent(v[t] || "Events")
              , n = !0;
            if (e)
                for (var r in e)
                    "bubbles" == r ? n = !!e[r] : i[r] = e[r];
            return i.initEvent(t, n, !0),
            u(i)
        }
    }(e),
    function(e) {
        function i(t, i, n) {
            var r = e.Event(i);
            return e(t).trigger(r, n),
            !r.isDefaultPrevented()
        }
        function n(t, e, n, r) {
            if (t.global)
                return i(e || x, n, r)
        }
        function r(t) {
            t.global && 0 === e.active++ && n(t, null , "ajaxStart")
        }
        function s(t) {
            t.global && !--e.active && n(t, null , "ajaxStop")
        }
        function a(t, e) {
            var i = e.context;
            return e.beforeSend.call(i, t, e) !== !1 && n(e, i, "ajaxBeforeSend", [t, e]) !== !1 && void n(e, i, "ajaxSend", [t, e])
        }
        function o(t, e, i, r) {
            var s = i.context
              , a = "success";
            i.success.call(s, t, a, e),
            r && r.resolveWith(s, [t, a, e]),
            n(i, s, "ajaxSuccess", [e, i, t]),
            h(a, e, i)
        }
        function l(t, e, i, r, s) {
            var a = r.context;
            r.error.call(a, i, e, t),
            s && s.rejectWith(a, [i, e, t]),
            n(r, a, "ajaxError", [i, r, t || e]),
            h(e, i, r)
        }
        function h(t, e, i) {
            var r = i.context;
            i.complete.call(r, e, t),
            n(i, r, "ajaxComplete", [e, i]),
            s(i)
        }
        function u(t, e, i) {
            if (i.dataFilter == c)
                return t;
            var n = i.context;
            return i.dataFilter.call(n, t, e)
        }
        function c() {}
        function f(t) {
            return t && (t = t.split(";", 2)[0]),
            t && (t == O ? "html" : t == P ? "json" : b.test(t) ? "script" : w.test(t) && "xml") || "text"
        }
        function p(t, e) {
            return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
        }
        function _(t) {
            t.processData && t.data && "string" != e.type(t.data) && (t.data = e.param(t.data, t.traditional)),
            !t.data || t.type && "GET" != t.type.toUpperCase() && "jsonp" != t.dataType || (t.url = p(t.url, t.data),
            t.data = void 0)
        }
        function d(t, i, n, r) {
            return e.isFunction(i) && (r = n,
            n = i,
            i = void 0),
            e.isFunction(n) || (r = n,
            n = void 0),
            {
                url: t,
                data: i,
                success: n,
                dataType: r
            }
        }
        function m(t, i, n, r) {
            var s, a = e.isArray(i), o = e.isPlainObject(i);
            e.each(i, function(i, l) {
                s = e.type(l),
                r && (i = n ? r : r + "[" + (o || "object" == s || "array" == s ? i : "") + "]"),
                !r && a ? t.add(l.name, l.value) : "array" == s || !n && "object" == s ? m(t, l, n, i) : t.add(i, l)
            })
        }
        var g, v, y = +new Date, x = t.document, T = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, b = /^(?:text|application)\/javascript/i, w = /^(?:text|application)\/xml/i, P = "application/json", O = "text/html", S = /^\s*$/, k = x.createElement("a");
        k.href = t.location.href,
        e.active = 0,
        e.ajaxJSONP = function(i, n) {
            if (!("type"in i))
                return e.ajax(i);
            var r, s, h = i.jsonpCallback, u = (e.isFunction(h) ? h() : h) || "Zepto" + y++, c = x.createElement("script"), f = t[u], p = function(t) {
                e(c).triggerHandler("error", t || "abort")
            }
            , _ = {
                abort: p
            };
            return n && n.promise(_),
            e(c).on("load error", function(a, h) {
                clearTimeout(s),
                e(c).off().remove(),
                "error" != a.type && r ? o(r[0], _, i, n) : l(null , h || "error", _, i, n),
                t[u] = f,
                r && e.isFunction(f) && f(r[0]),
                f = r = void 0
            }),
            a(_, i) === !1 ? (p("abort"),
            _) : (t[u] = function() {
                r = arguments
            }
            ,
            c.src = i.url.replace(/\?(.+)=\?/, "?$1=" + u),
            x.head.appendChild(c),
            i.timeout > 0 && (s = setTimeout(function() {
                p("timeout")
            }, i.timeout)),
            _)
        }
        ,
        e.ajaxSettings = {
            type: "GET",
            beforeSend: c,
            success: c,
            error: c,
            complete: c,
            context: null ,
            global: !0,
            xhr: function() {
                return new t.XMLHttpRequest
            },
            accepts: {
                script: "text/javascript, application/javascript, application/x-javascript",
                json: P,
                xml: "application/xml, text/xml",
                html: O,
                text: "text/plain"
            },
            crossDomain: !1,
            timeout: 0,
            processData: !0,
            cache: !0,
            dataFilter: c
        },
        e.ajax = function(i) {
            var n, s, h = e.extend({}, i || {}), d = e.Deferred && e.Deferred();
            for (g in e.ajaxSettings)
                void 0 === h[g] && (h[g] = e.ajaxSettings[g]);
            r(h),
            h.crossDomain || (n = x.createElement("a"),
            n.href = h.url,
            n.href = n.href,
            h.crossDomain = k.protocol + "//" + k.host != n.protocol + "//" + n.host),
            h.url || (h.url = t.location.toString()),
            (s = h.url.indexOf("#")) > -1 && (h.url = h.url.slice(0, s)),
            _(h);
            var m = h.dataType
              , y = /\?.+=\?/.test(h.url);
            if (y && (m = "jsonp"),
            h.cache !== !1 && (i && i.cache === !0 || "script" != m && "jsonp" != m) || (h.url = p(h.url, "_=" + Date.now())),
            "jsonp" == m)
                return y || (h.url = p(h.url, h.jsonp ? h.jsonp + "=?" : h.jsonp === !1 ? "" : "callback=?")),
                e.ajaxJSONP(h, d);
            var T, b = h.accepts[m], w = {}, P = function(t, e) {
                w[t.toLowerCase()] = [t, e]
            }
            , O = /^([\w-]+:)\/\//.test(h.url) ? RegExp.$1 : t.location.protocol, C = h.xhr(), R = C.setRequestHeader;
            if (d && d.promise(C),
            h.crossDomain || P("X-Requested-With", "XMLHttpRequest"),
            P("Accept", b || "*/*"),
            (b = h.mimeType || b) && (b.indexOf(",") > -1 && (b = b.split(",", 2)[0]),
            C.overrideMimeType && C.overrideMimeType(b)),
            (h.contentType || h.contentType !== !1 && h.data && "GET" != h.type.toUpperCase()) && P("Content-Type", h.contentType || "application/x-www-form-urlencoded"),
            h.headers)
                for (v in h.headers)
                    P(v, h.headers[v]);
            if (C.setRequestHeader = P,
            C.onreadystatechange = function() {
                if (4 == C.readyState) {
                    C.onreadystatechange = c,
                    clearTimeout(T);
                    var t, i = !1;
                    if (C.status >= 200 && C.status < 300 || 304 == C.status || 0 == C.status && "file:" == O) {
                        if (m = m || f(h.mimeType || C.getResponseHeader("content-type")),
                        "arraybuffer" == C.responseType || "blob" == C.responseType)
                            t = C.response;
                        else {
                            t = C.responseText;
                            try {
                                t = u(t, m, h),
                                "script" == m ? (0,
                                eval)(t) : "xml" == m ? t = C.responseXML : "json" == m && (t = S.test(t) ? null : e.parseJSON(t))
                            } catch (t) {
                                i = t
                            }
                            if (i)
                                return l(i, "parsererror", C, h, d)
                        }
                        o(t, C, h, d)
                    } else
                        l(C.statusText || null , C.status ? "error" : "abort", C, h, d)
                }
            }
            ,
            a(C, h) === !1)
                return C.abort(),
                l(null , "abort", C, h, d),
                C;
            var M = !("async"in h) || h.async;
            if (C.open(h.type, h.url, M, h.username, h.password),
            h.xhrFields)
                for (v in h.xhrFields)
                    C[v] = h.xhrFields[v];
            for (v in w)
                R.apply(C, w[v]);
            return h.timeout > 0 && (T = setTimeout(function() {
                C.onreadystatechange = c,
                C.abort(),
                l(null , "timeout", C, h, d)
            }, h.timeout)),
            C.send(h.data ? h.data : null ),
            C
        }
        ,
        e.get = function() {
            return e.ajax(d.apply(null , arguments))
        }
        ,
        e.post = function() {
            var t = d.apply(null , arguments);
            return t.type = "POST",
            e.ajax(t)
        }
        ,
        e.getJSON = function() {
            var t = d.apply(null , arguments);
            return t.dataType = "json",
            e.ajax(t)
        }
        ,
        e.fn.load = function(t, i, n) {
            if (!this.length)
                return this;
            var r, s = this, a = t.split(/\s/), o = d(t, i, n), l = o.success;
            return a.length > 1 && (o.url = a[0],
            r = a[1]),
            o.success = function(t) {
                s.html(r ? e("<div>").html(t.replace(T, "")).find(r) : t),
                l && l.apply(s, arguments)
            }
            ,
            e.ajax(o),
            this
        }
        ;
        var C = encodeURIComponent;
        e.param = function(t, i) {
            var n = [];
            return n.add = function(t, i) {
                e.isFunction(i) && (i = i()),
                null == i && (i = ""),
                this.push(C(t) + "=" + C(i))
            }
            ,
            m(n, t, i),
            n.join("&").replace(/%20/g, "+")
        }
    }(e),
    function(e) {
        function i(t, e, i, n) {
            return Math.abs(t - e) >= Math.abs(i - n) ? t - e > 0 ? "Left" : "Right" : i - n > 0 ? "Up" : "Down"
        }
        function n() {
            c = null ,
            p.last && (p.el.trigger("longTap"),
            p = {})
        }
        function r() {
            c && clearTimeout(c),
            c = null
        }
        function s() {
            l && clearTimeout(l),
            h && clearTimeout(h),
            u && clearTimeout(u),
            c && clearTimeout(c),
            l = h = u = c = null ,
            p = {}
        }
        function a(t) {
            return ("touch" == t.pointerType || t.pointerType == t.MSPOINTER_TYPE_TOUCH) && t.isPrimary
        }
        function o(t, e) {
            return t.type == "pointer" + e || t.type.toLowerCase() == "mspointer" + e
        }
        var l, h, u, c, f, p = {}, _ = 750;
        e(document).ready(function() {
            var d, m, g, v, y = 0, x = 0;
            "MSGesture"in t && (f = new MSGesture,
            f.target = document.body),
            e(document).bind("MSGestureEnd", function(t) {
                var e = t.velocityX > 1 ? "Right" : t.velocityX < -1 ? "Left" : t.velocityY > 1 ? "Down" : t.velocityY < -1 ? "Up" : null ;
                e && (p.el.trigger("swipe"),
                p.el.trigger("swipe" + e))
            }).on("touchstart MSPointerDown pointerdown", function(t) {
                (v = o(t, "down")) && !a(t) || (g = v ? t : t.touches[0],
                t.touches && 1 === t.touches.length && p.x2 && (p.x2 = void 0,
                p.y2 = void 0),
                d = Date.now(),
                m = d - (p.last || d),
                p.el = e("tagName"in g.target ? g.target : g.target.parentNode),
                l && clearTimeout(l),
                p.x1 = g.pageX,
                p.y1 = g.pageY,
                m > 0 && m <= 250 && (p.isDoubleTap = !0),
                p.last = d,
                c = setTimeout(n, _),
                f && v && f.addPointer(t.pointerId))
            }).on("touchmove MSPointerMove pointermove", function(t) {
                (v = o(t, "move")) && !a(t) || (g = v ? t : t.touches[0],
                r(),
                p.x2 = g.pageX,
                p.y2 = g.pageY,
                y += Math.abs(p.x1 - p.x2),
                x += Math.abs(p.y1 - p.y2))
            }).on("touchend MSPointerUp pointerup", function(t) {
                (v = o(t, "up")) && !a(t) || (r(),
                p.x2 && Math.abs(p.x1 - p.x2) > 30 || p.y2 && Math.abs(p.y1 - p.y2) > 30 ? u = setTimeout(function() {
                    p.el && (p.el.trigger("swipe"),
                    p.el.trigger("swipe" + i(p.x1, p.x2, p.y1, p.y2))),
                    p = {}
                }, 0) : "last"in p && (y < 30 && x < 30 ? h = setTimeout(function() {
                    var t = e.Event("tap");
                    t.cancelTouch = s,
                    p.el && p.el.trigger(t),
                    p.isDoubleTap ? (p.el && p.el.trigger("doubleTap"),
                    p = {}) : l = setTimeout(function() {
                        l = null ,
                        p.el && p.el.trigger("singleTap"),
                        p = {}
                    }, 250)
                }, 0) : p = {}),
                y = x = 0)
            }).on("touchcancel MSPointerCancel pointercancel", s),
            e(t).on("scroll", s)
        }),
        ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(t) {
            e.fn[t] = function(e) {
                return this.on(t, e)
            }
        })
    }(e),
    e
});
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function() {
    "use strict";
    _gsScope._gsDefine("TweenMax", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(t, e, i) {
        var n = function(t) {
            var e, i = [], n = t.length;
            for (e = 0; e !== n; i.push(t[e++]))
                ;
            return i
        }
          , r = function(t, e, i) {
            var n, r, s = t.cycle;
            for (n in s)
                r = s[n],
                t[n] = "function" == typeof r ? r(i, e[i]) : r[i % r.length];
            delete t.cycle
        }
          , s = function(t, e, n) {
            i.call(this, t, e, n),
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._dirty = !0,
            this.render = s.prototype.render
        }
          , a = 1e-10
          , o = i._internals
          , l = o.isSelector
          , h = o.isArray
          , u = s.prototype = i.to({}, .1, {})
          , c = [];
        s.version = "1.19.0",
        u.constructor = s,
        u.kill()._gc = !1,
        s.killTweensOf = s.killDelayedCallsTo = i.killTweensOf,
        s.getTweensOf = i.getTweensOf,
        s.lagSmoothing = i.lagSmoothing,
        s.ticker = i.ticker,
        s.render = i.render,
        u.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            i.prototype.invalidate.call(this)
        }
        ,
        u.updateTo = function(t, e) {
            var n, r = this.ratio, s = this.vars.immediateRender || t.immediateRender;
            e && this._startTime < this._timeline._time && (this._startTime = this._timeline._time,
            this._uncache(!1),
            this._gc ? this._enabled(!0, !1) : this._timeline.insert(this, this._startTime - this._delay));
            for (n in t)
                this.vars[n] = t[n];
            if (this._initted || s)
                if (e)
                    this._initted = !1,
                    s && this.render(0, !0, !0);
                else if (this._gc && this._enabled(!0, !1),
                this._notifyPluginsOfEnabled && this._firstPT && i._onPluginEvent("_onDisable", this),
                this._time / this._duration > .998) {
                    var a = this._totalTime;
                    this.render(0, !0, !1),
                    this._initted = !1,
                    this.render(a, !0, !1)
                } else if (this._initted = !1,
                this._init(),
                this._time > 0 || s)
                    for (var o, l = 1 / (1 - r), h = this._firstPT; h; )
                        o = h.s + h.c,
                        h.c *= l,
                        h.s = o - h.c,
                        h = h._next;
            return this
        }
        ,
        u.render = function(t, e, i) {
            this._initted || 0 === this._duration && this.vars.repeat && this.invalidate();
            var n, r, s, l, h, u, c, f, p = this._dirty ? this.totalDuration() : this._totalDuration, _ = this._time, d = this._totalTime, m = this._cycle, g = this._duration, v = this._rawPrevTime;
            if (t >= p - 1e-7 ? (this._totalTime = p,
            this._cycle = this._repeat,
            this._yoyo && 0 !== (1 & this._cycle) ? (this._time = 0,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0) : (this._time = g,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1),
            this._reversed || (n = !0,
            r = "onComplete",
            i = i || this._timeline.autoRemoveChildren),
            0 === g && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0),
            (0 > v || 0 >= t && t >= -1e-7 || v === a && "isPause" !== this.data) && v !== t && (i = !0,
            v > a && (r = "onReverseComplete")),
            this._rawPrevTime = f = !e || t || v === t ? t : a)) : 1e-7 > t ? (this._totalTime = this._time = this._cycle = 0,
            this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
            (0 !== d || 0 === g && v > 0) && (r = "onReverseComplete",
            n = this._reversed),
            0 > t && (this._active = !1,
            0 === g && (this._initted || !this.vars.lazy || i) && (v >= 0 && (i = !0),
            this._rawPrevTime = f = !e || t || v === t ? t : a)),
            this._initted || (i = !0)) : (this._totalTime = this._time = t,
            0 !== this._repeat && (l = g + this._repeatDelay,
            this._cycle = this._totalTime / l >> 0,
            0 !== this._cycle && this._cycle === this._totalTime / l && t >= d && this._cycle--,
            this._time = this._totalTime - this._cycle * l,
            this._yoyo && 0 !== (1 & this._cycle) && (this._time = g - this._time),
            this._time > g ? this._time = g : this._time < 0 && (this._time = 0)),
            this._easeType ? (h = this._time / g,
            u = this._easeType,
            c = this._easePower,
            (1 === u || 3 === u && h >= .5) && (h = 1 - h),
            3 === u && (h *= 2),
            1 === c ? h *= h : 2 === c ? h *= h * h : 3 === c ? h *= h * h * h : 4 === c && (h *= h * h * h * h),
            1 === u ? this.ratio = 1 - h : 2 === u ? this.ratio = h : this._time / g < .5 ? this.ratio = h / 2 : this.ratio = 1 - h / 2) : this.ratio = this._ease.getRatio(this._time / g)),
            _ === this._time && !i && m === this._cycle)
                return void (d !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate")));
            if (!this._initted) {
                if (this._init(),
                !this._initted || this._gc)
                    return;
                if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))
                    return this._time = _,
                    this._totalTime = d,
                    this._rawPrevTime = v,
                    this._cycle = m,
                    o.lazyTweens.push(this),
                    void (this._lazy = [t, e]);
                this._time && !n ? this.ratio = this._ease.getRatio(this._time / g) : n && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
            }
            for (this._lazy !== !1 && (this._lazy = !1),
            this._active || !this._paused && this._time !== _ && t >= 0 && (this._active = !0),
            0 === d && (2 === this._initted && t > 0 && this._init(),
            this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")),
            this.vars.onStart && (0 !== this._totalTime || 0 === g) && (e || this._callback("onStart"))),
            s = this._firstPT; s; )
                s.f ? s.t[s.p](s.c * this.ratio + s.s) : s.t[s.p] = s.c * this.ratio + s.s,
                s = s._next;
            this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i),
            e || (this._totalTime !== d || r) && this._callback("onUpdate")),
            this._cycle !== m && (e || this._gc || this.vars.onRepeat && this._callback("onRepeat")),
            r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i),
            n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
            this._active = !1),
            !e && this.vars[r] && this._callback(r),
            0 === g && this._rawPrevTime === a && f !== a && (this._rawPrevTime = 0))
        }
        ,
        s.to = function(t, e, i) {
            return new s(t,e,i)
        }
        ,
        s.from = function(t, e, i) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            new s(t,e,i)
        }
        ,
        s.fromTo = function(t, e, i, n) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            new s(t,e,n)
        }
        ,
        s.staggerTo = s.allTo = function(t, e, a, o, u, f, p) {
            o = o || 0;
            var _, d, m, g, v = 0, y = [], x = function() {
                a.onComplete && a.onComplete.apply(a.onCompleteScope || this, arguments),
                u.apply(p || a.callbackScope || this, f || c)
            }
            , T = a.cycle, b = a.startAt && a.startAt.cycle;
            for (h(t) || ("string" == typeof t && (t = i.selector(t) || t),
            l(t) && (t = n(t))),
            t = t || [],
            0 > o && (t = n(t),
            t.reverse(),
            o *= -1),
            _ = t.length - 1,
            m = 0; _ >= m; m++) {
                d = {};
                for (g in a)
                    d[g] = a[g];
                if (T && (r(d, t, m),
                null != d.duration && (e = d.duration,
                delete d.duration)),
                b) {
                    b = d.startAt = {};
                    for (g in a.startAt)
                        b[g] = a.startAt[g];
                    r(d.startAt, t, m)
                }
                d.delay = v + (d.delay || 0),
                m === _ && u && (d.onComplete = x),
                y[m] = new s(t[m],e,d),
                v += o
            }
            return y
        }
        ,
        s.staggerFrom = s.allFrom = function(t, e, i, n, r, a, o) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            s.staggerTo(t, e, i, n, r, a, o)
        }
        ,
        s.staggerFromTo = s.allFromTo = function(t, e, i, n, r, a, o, l) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            s.staggerTo(t, e, n, r, a, o, l)
        }
        ,
        s.delayedCall = function(t, e, i, n, r) {
            return new s(e,0,{
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                callbackScope: n,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                immediateRender: !1,
                useFrames: r,
                overwrite: 0
            })
        }
        ,
        s.set = function(t, e) {
            return new s(t,0,e)
        }
        ,
        s.isTweening = function(t) {
            return i.getTweensOf(t, !0).length > 0
        }
        ;
        var f = function(t, e) {
            for (var n = [], r = 0, s = t._first; s; )
                s instanceof i ? n[r++] = s : (e && (n[r++] = s),
                n = n.concat(f(s, e)),
                r = n.length),
                s = s._next;
            return n
        }
          , p = s.getAllTweens = function(e) {
            return f(t._rootTimeline, e).concat(f(t._rootFramesTimeline, e))
        }
        ;
        s.killAll = function(t, i, n, r) {
            null == i && (i = !0),
            null == n && (n = !0);
            var s, a, o, l = p(0 != r), h = l.length, u = i && n && r;
            for (o = 0; h > o; o++)
                a = l[o],
                (u || a instanceof e || (s = a.target === a.vars.onComplete) && n || i && !s) && (t ? a.totalTime(a._reversed ? 0 : a.totalDuration()) : a._enabled(!1, !1))
        }
        ,
        s.killChildTweensOf = function(t, e) {
            if (null != t) {
                var r, a, u, c, f, p = o.tweenLookup;
                if ("string" == typeof t && (t = i.selector(t) || t),
                l(t) && (t = n(t)),
                h(t))
                    for (c = t.length; --c > -1; )
                        s.killChildTweensOf(t[c], e);
                else {
                    r = [];
                    for (u in p)
                        for (a = p[u].target.parentNode; a; )
                            a === t && (r = r.concat(p[u].tweens)),
                            a = a.parentNode;
                    for (f = r.length,
                    c = 0; f > c; c++)
                        e && r[c].totalTime(r[c].totalDuration()),
                        r[c]._enabled(!1, !1)
                }
            }
        }
        ;
        var _ = function(t, i, n, r) {
            i = i !== !1,
            n = n !== !1,
            r = r !== !1;
            for (var s, a, o = p(r), l = i && n && r, h = o.length; --h > -1; )
                a = o[h],
                (l || a instanceof e || (s = a.target === a.vars.onComplete) && n || i && !s) && a.paused(t)
        }
        ;
        return s.pauseAll = function(t, e, i) {
            _(!0, t, e, i)
        }
        ,
        s.resumeAll = function(t, e, i) {
            _(!1, t, e, i)
        }
        ,
        s.globalTimeScale = function(e) {
            var n = t._rootTimeline
              , r = i.ticker.time;
            return arguments.length ? (e = e || a,
            n._startTime = r - (r - n._startTime) * n._timeScale / e,
            n = t._rootFramesTimeline,
            r = i.ticker.frame,
            n._startTime = r - (r - n._startTime) * n._timeScale / e,
            n._timeScale = t._rootTimeline._timeScale = e,
            e) : n._timeScale
        }
        ,
        u.progress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration()
        }
        ,
        u.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration()
        }
        ,
        u.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            t > this._duration && (t = this._duration),
            this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)),
            this.totalTime(t, e)) : this._time
        }
        ,
        u.duration = function(e) {
            return arguments.length ? t.prototype.duration.call(this, e) : this._duration
        }
        ,
        u.totalDuration = function(t) {
            return arguments.length ? -1 === this._repeat ? this : this.duration((t - this._repeat * this._repeatDelay) / (this._repeat + 1)) : (this._dirty && (this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat,
            this._dirty = !1),
            this._totalDuration)
        }
        ,
        u.repeat = function(t) {
            return arguments.length ? (this._repeat = t,
            this._uncache(!0)) : this._repeat
        }
        ,
        u.repeatDelay = function(t) {
            return arguments.length ? (this._repeatDelay = t,
            this._uncache(!0)) : this._repeatDelay
        }
        ,
        u.yoyo = function(t) {
            return arguments.length ? (this._yoyo = t,
            this) : this._yoyo
        }
        ,
        s
    }, !0),
    _gsScope._gsDefine("TimelineLite", ["core.Animation", "core.SimpleTimeline", "TweenLite"], function(t, e, i) {
        var n = function(t) {
            e.call(this, t),
            this._labels = {},
            this.autoRemoveChildren = this.vars.autoRemoveChildren === !0,
            this.smoothChildTiming = this.vars.smoothChildTiming === !0,
            this._sortChildren = !0,
            this._onUpdate = this.vars.onUpdate;
            var i, n, r = this.vars;
            for (n in r)
                i = r[n],
                l(i) && -1 !== i.join("").indexOf("{self}") && (r[n] = this._swapSelfInParams(i));
            l(r.tweens) && this.add(r.tweens, 0, r.align, r.stagger)
        }
          , r = 1e-10
          , s = i._internals
          , a = n._internals = {}
          , o = s.isSelector
          , l = s.isArray
          , h = s.lazyTweens
          , u = s.lazyRender
          , c = _gsScope._gsDefine.globals
          , f = function(t) {
            var e, i = {};
            for (e in t)
                i[e] = t[e];
            return i
        }
          , p = function(t, e, i) {
            var n, r, s = t.cycle;
            for (n in s)
                r = s[n],
                t[n] = "function" == typeof r ? r.call(e[i], i) : r[i % r.length];
            delete t.cycle
        }
          , _ = a.pauseCallback = function() {}
          , d = function(t) {
            var e, i = [], n = t.length;
            for (e = 0; e !== n; i.push(t[e++]))
                ;
            return i
        }
          , m = n.prototype = new e;
        return n.version = "1.19.0",
        m.constructor = n,
        m.kill()._gc = m._forcingPlayhead = m._hasPause = !1,
        m.to = function(t, e, n, r) {
            var s = n.repeat && c.TweenMax || i;
            return e ? this.add(new s(t,e,n), r) : this.set(t, n, r)
        }
        ,
        m.from = function(t, e, n, r) {
            return this.add((n.repeat && c.TweenMax || i).from(t, e, n), r)
        }
        ,
        m.fromTo = function(t, e, n, r, s) {
            var a = r.repeat && c.TweenMax || i;
            return e ? this.add(a.fromTo(t, e, n, r), s) : this.set(t, r, s)
        }
        ,
        m.staggerTo = function(t, e, r, s, a, l, h, u) {
            var c, _, m = new n({
                onComplete: l,
                onCompleteParams: h,
                callbackScope: u,
                smoothChildTiming: this.smoothChildTiming
            }), g = r.cycle;
            for ("string" == typeof t && (t = i.selector(t) || t),
            t = t || [],
            o(t) && (t = d(t)),
            s = s || 0,
            0 > s && (t = d(t),
            t.reverse(),
            s *= -1),
            _ = 0; _ < t.length; _++)
                c = f(r),
                c.startAt && (c.startAt = f(c.startAt),
                c.startAt.cycle && p(c.startAt, t, _)),
                g && (p(c, t, _),
                null != c.duration && (e = c.duration,
                delete c.duration)),
                m.to(t[_], e, c, _ * s);
            return this.add(m, a)
        }
        ,
        m.staggerFrom = function(t, e, i, n, r, s, a, o) {
            return i.immediateRender = 0 != i.immediateRender,
            i.runBackwards = !0,
            this.staggerTo(t, e, i, n, r, s, a, o)
        }
        ,
        m.staggerFromTo = function(t, e, i, n, r, s, a, o, l) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            this.staggerTo(t, e, n, r, s, a, o, l)
        }
        ,
        m.call = function(t, e, n, r) {
            return this.add(i.delayedCall(0, t, e, n), r)
        }
        ,
        m.set = function(t, e, n) {
            return n = this._parseTimeOrLabel(n, 0, !0),
            null == e.immediateRender && (e.immediateRender = n === this._time && !this._paused),
            this.add(new i(t,0,e), n)
        }
        ,
        n.exportRoot = function(t, e) {
            t = t || {},
            null == t.smoothChildTiming && (t.smoothChildTiming = !0);
            var r, s, a = new n(t), o = a._timeline;
            for (null == e && (e = !0),
            o._remove(a, !0),
            a._startTime = 0,
            a._rawPrevTime = a._time = a._totalTime = o._time,
            r = o._first; r; )
                s = r._next,
                e && r instanceof i && r.target === r.vars.onComplete || a.add(r, r._startTime - r._delay),
                r = s;
            return o.add(a, 0),
            a
        }
        ,
        m.add = function(r, s, a, o) {
            var h, u, c, f, p, _;
            if ("number" != typeof s && (s = this._parseTimeOrLabel(s, 0, !0, r)),
            !(r instanceof t)) {
                if (r instanceof Array || r && r.push && l(r)) {
                    for (a = a || "normal",
                    o = o || 0,
                    h = s,
                    u = r.length,
                    c = 0; u > c; c++)
                        l(f = r[c]) && (f = new n({
                            tweens: f
                        })),
                        this.add(f, h),
                        "string" != typeof f && "function" != typeof f && ("sequence" === a ? h = f._startTime + f.totalDuration() / f._timeScale : "start" === a && (f._startTime -= f.delay())),
                        h += o;
                    return this._uncache(!0)
                }
                if ("string" == typeof r)
                    return this.addLabel(r, s);
                if ("function" != typeof r)
                    throw "Cannot add " + r + " into the timeline; it is not a tween, timeline, function, or string.";
                r = i.delayedCall(0, r)
            }
            if (e.prototype.add.call(this, r, s),
            (this._gc || this._time === this._duration) && !this._paused && this._duration < this.duration())
                for (p = this,
                _ = p.rawTime() > r._startTime; p._timeline; )
                    _ && p._timeline.smoothChildTiming ? p.totalTime(p._totalTime, !0) : p._gc && p._enabled(!0, !1),
                    p = p._timeline;
            return this
        }
        ,
        m.remove = function(e) {
            if (e instanceof t) {
                this._remove(e, !1);
                var i = e._timeline = e.vars.useFrames ? t._rootFramesTimeline : t._rootTimeline;
                return e._startTime = (e._paused ? e._pauseTime : i._time) - (e._reversed ? e.totalDuration() - e._totalTime : e._totalTime) / e._timeScale,
                this
            }
            if (e instanceof Array || e && e.push && l(e)) {
                for (var n = e.length; --n > -1; )
                    this.remove(e[n]);
                return this
            }
            return "string" == typeof e ? this.removeLabel(e) : this.kill(null , e)
        }
        ,
        m._remove = function(t, i) {
            e.prototype._remove.call(this, t, i);
            var n = this._last;
            return n ? this._time > n._startTime + n._totalDuration / n._timeScale && (this._time = this.duration(),
            this._totalTime = this._totalDuration) : this._time = this._totalTime = this._duration = this._totalDuration = 0,
            this
        }
        ,
        m.append = function(t, e) {
            return this.add(t, this._parseTimeOrLabel(null , e, !0, t))
        }
        ,
        m.insert = m.insertMultiple = function(t, e, i, n) {
            return this.add(t, e || 0, i, n)
        }
        ,
        m.appendMultiple = function(t, e, i, n) {
            return this.add(t, this._parseTimeOrLabel(null , e, !0, t), i, n)
        }
        ,
        m.addLabel = function(t, e) {
            return this._labels[t] = this._parseTimeOrLabel(e),
            this
        }
        ,
        m.addPause = function(t, e, n, r) {
            var s = i.delayedCall(0, _, n, r || this);
            return s.vars.onComplete = s.vars.onReverseComplete = e,
            s.data = "isPause",
            this._hasPause = !0,
            this.add(s, t)
        }
        ,
        m.removeLabel = function(t) {
            return delete this._labels[t],
            this
        }
        ,
        m.getLabelTime = function(t) {
            return null != this._labels[t] ? this._labels[t] : -1
        }
        ,
        m._parseTimeOrLabel = function(e, i, n, r) {
            var s;
            if (r instanceof t && r.timeline === this)
                this.remove(r);
            else if (r && (r instanceof Array || r.push && l(r)))
                for (s = r.length; --s > -1; )
                    r[s]instanceof t && r[s].timeline === this && this.remove(r[s]);
            if ("string" == typeof i)
                return this._parseTimeOrLabel(i, n && "number" == typeof e && null == this._labels[i] ? e - this.duration() : 0, n);
            if (i = i || 0,
            "string" != typeof e || !isNaN(e) && null == this._labels[e])
                null == e && (e = this.duration());
            else {
                if (s = e.indexOf("="),
                -1 === s)
                    return null == this._labels[e] ? n ? this._labels[e] = this.duration() + i : i : this._labels[e] + i;
                i = parseInt(e.charAt(s - 1) + "1", 10) * Number(e.substr(s + 1)),
                e = s > 1 ? this._parseTimeOrLabel(e.substr(0, s - 1), 0, n) : this.duration()
            }
            return Number(e) + i
        }
        ,
        m.seek = function(t, e) {
            return this.totalTime("number" == typeof t ? t : this._parseTimeOrLabel(t), e !== !1)
        }
        ,
        m.stop = function() {
            return this.paused(!0)
        }
        ,
        m.gotoAndPlay = function(t, e) {
            return this.play(t, e)
        }
        ,
        m.gotoAndStop = function(t, e) {
            return this.pause(t, e)
        }
        ,
        m.render = function(t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n, s, a, o, l, c, f, p = this._dirty ? this.totalDuration() : this._totalDuration, _ = this._time, d = this._startTime, m = this._timeScale, g = this._paused;
            if (t >= p - 1e-7)
                this._totalTime = this._time = p,
                this._reversed || this._hasPausedChild() || (s = !0,
                o = "onComplete",
                l = !!this._timeline.autoRemoveChildren,
                0 === this._duration && (0 >= t && t >= -1e-7 || this._rawPrevTime < 0 || this._rawPrevTime === r) && this._rawPrevTime !== t && this._first && (l = !0,
                this._rawPrevTime > r && (o = "onReverseComplete"))),
                this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r,
                t = p + 1e-4;
            else if (1e-7 > t)
                if (this._totalTime = this._time = 0,
                (0 !== _ || 0 === this._duration && this._rawPrevTime !== r && (this._rawPrevTime > 0 || 0 > t && this._rawPrevTime >= 0)) && (o = "onReverseComplete",
                s = this._reversed),
                0 > t)
                    this._active = !1,
                    this._timeline.autoRemoveChildren && this._reversed ? (l = s = !0,
                    o = "onReverseComplete") : this._rawPrevTime >= 0 && this._first && (l = !0),
                    this._rawPrevTime = t;
                else {
                    if (this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r,
                    0 === t && s)
                        for (n = this._first; n && 0 === n._startTime; )
                            n._duration || (s = !1),
                            n = n._next;
                    t = 0,
                    this._initted || (l = !0)
                }
            else {
                if (this._hasPause && !this._forcingPlayhead && !e) {
                    if (t >= _)
                        for (n = this._first; n && n._startTime <= t && !c; )
                            n._duration || "isPause" !== n.data || n.ratio || 0 === n._startTime && 0 === this._rawPrevTime || (c = n),
                            n = n._next;
                    else
                        for (n = this._last; n && n._startTime >= t && !c; )
                            n._duration || "isPause" === n.data && n._rawPrevTime > 0 && (c = n),
                            n = n._prev;
                    c && (this._time = t = c._startTime,
                    this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay))
                }
                this._totalTime = this._time = this._rawPrevTime = t
            }
            if (this._time !== _ && this._first || i || l || c) {
                if (this._initted || (this._initted = !0),
                this._active || !this._paused && this._time !== _ && t > 0 && (this._active = !0),
                0 === _ && this.vars.onStart && (0 === this._time && this._duration || e || this._callback("onStart")),
                f = this._time,
                f >= _)
                    for (n = this._first; n && (a = n._next,
                    f === this._time && (!this._paused || g)); )
                        (n._active || n._startTime <= f && !n._paused && !n._gc) && (c === n && this.pause(),
                        n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
                        n = a;
                else
                    for (n = this._last; n && (a = n._prev,
                    f === this._time && (!this._paused || g)); ) {
                        if (n._active || n._startTime <= _ && !n._paused && !n._gc) {
                            if (c === n) {
                                for (c = n._prev; c && c.endTime() > this._time; )
                                    c.render(c._reversed ? c.totalDuration() - (t - c._startTime) * c._timeScale : (t - c._startTime) * c._timeScale, e, i),
                                    c = c._prev;
                                c = null ,
                                this.pause()
                            }
                            n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)
                        }
                        n = a
                    }
                this._onUpdate && (e || (h.length && u(),
                this._callback("onUpdate"))),
                o && (this._gc || (d === this._startTime || m !== this._timeScale) && (0 === this._time || p >= this.totalDuration()) && (s && (h.length && u(),
                this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                this._active = !1),
                !e && this.vars[o] && this._callback(o)))
            }
        }
        ,
        m._hasPausedChild = function() {
            for (var t = this._first; t; ) {
                if (t._paused || t instanceof n && t._hasPausedChild())
                    return !0;
                t = t._next
            }
            return !1
        }
        ,
        m.getChildren = function(t, e, n, r) {
            r = r || -9999999999;
            for (var s = [], a = this._first, o = 0; a; )
                a._startTime < r || (a instanceof i ? e !== !1 && (s[o++] = a) : (n !== !1 && (s[o++] = a),
                t !== !1 && (s = s.concat(a.getChildren(!0, e, n)),
                o = s.length))),
                a = a._next;
            return s
        }
        ,
        m.getTweensOf = function(t, e) {
            var n, r, s = this._gc, a = [], o = 0;
            for (s && this._enabled(!0, !0),
            n = i.getTweensOf(t),
            r = n.length; --r > -1; )
                (n[r].timeline === this || e && this._contains(n[r])) && (a[o++] = n[r]);
            return s && this._enabled(!1, !0),
            a
        }
        ,
        m.recent = function() {
            return this._recent
        }
        ,
        m._contains = function(t) {
            for (var e = t.timeline; e; ) {
                if (e === this)
                    return !0;
                e = e.timeline
            }
            return !1
        }
        ,
        m.shiftChildren = function(t, e, i) {
            i = i || 0;
            for (var n, r = this._first, s = this._labels; r; )
                r._startTime >= i && (r._startTime += t),
                r = r._next;
            if (e)
                for (n in s)
                    s[n] >= i && (s[n] += t);
            return this._uncache(!0)
        }
        ,
        m._kill = function(t, e) {
            if (!t && !e)
                return this._enabled(!1, !1);
            for (var i = e ? this.getTweensOf(e) : this.getChildren(!0, !0, !1), n = i.length, r = !1; --n > -1; )
                i[n]._kill(t, e) && (r = !0);
            return r
        }
        ,
        m.clear = function(t) {
            var e = this.getChildren(!1, !0, !0)
              , i = e.length;
            for (this._time = this._totalTime = 0; --i > -1; )
                e[i]._enabled(!1, !1);
            return t !== !1 && (this._labels = {}),
            this._uncache(!0)
        }
        ,
        m.invalidate = function() {
            for (var e = this._first; e; )
                e.invalidate(),
                e = e._next;
            return t.prototype.invalidate.call(this)
        }
        ,
        m._enabled = function(t, i) {
            if (t === this._gc)
                for (var n = this._first; n; )
                    n._enabled(t, !0),
                    n = n._next;
            return e.prototype._enabled.call(this, t, i)
        }
        ,
        m.totalTime = function(e, i, n) {
            this._forcingPlayhead = !0;
            var r = t.prototype.totalTime.apply(this, arguments);
            return this._forcingPlayhead = !1,
            r
        }
        ,
        m.duration = function(t) {
            return arguments.length ? (0 !== this.duration() && 0 !== t && this.timeScale(this._duration / t),
            this) : (this._dirty && this.totalDuration(),
            this._duration)
        }
        ,
        m.totalDuration = function(t) {
            if (!arguments.length) {
                if (this._dirty) {
                    for (var e, i, n = 0, r = this._last, s = 999999999999; r; )
                        e = r._prev,
                        r._dirty && r.totalDuration(),
                        r._startTime > s && this._sortChildren && !r._paused ? this.add(r, r._startTime - r._delay) : s = r._startTime,
                        r._startTime < 0 && !r._paused && (n -= r._startTime,
                        this._timeline.smoothChildTiming && (this._startTime += r._startTime / this._timeScale),
                        this.shiftChildren(-r._startTime, !1, -9999999999),
                        s = 0),
                        i = r._startTime + r._totalDuration / r._timeScale,
                        i > n && (n = i),
                        r = e;
                    this._duration = this._totalDuration = n,
                    this._dirty = !1
                }
                return this._totalDuration
            }
            return t && this.totalDuration() ? this.timeScale(this._totalDuration / t) : this
        }
        ,
        m.paused = function(e) {
            if (!e)
                for (var i = this._first, n = this._time; i; )
                    i._startTime === n && "isPause" === i.data && (i._rawPrevTime = 0),
                    i = i._next;
            return t.prototype.paused.apply(this, arguments)
        }
        ,
        m.usesFrames = function() {
            for (var e = this._timeline; e._timeline; )
                e = e._timeline;
            return e === t._rootFramesTimeline
        }
        ,
        m.rawTime = function() {
            return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale
        }
        ,
        n
    }, !0),
    _gsScope._gsDefine("TimelineMax", ["TimelineLite", "TweenLite", "easing.Ease"], function(t, e, i) {
        var n = function(e) {
            t.call(this, e),
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._cycle = 0,
            this._yoyo = this.vars.yoyo === !0,
            this._dirty = !0
        }
          , r = 1e-10
          , s = e._internals
          , a = s.lazyTweens
          , o = s.lazyRender
          , l = _gsScope._gsDefine.globals
          , h = new i(null ,null ,1,0)
          , u = n.prototype = new t;
        return u.constructor = n,
        u.kill()._gc = !1,
        n.version = "1.19.0",
        u.invalidate = function() {
            return this._yoyo = this.vars.yoyo === !0,
            this._repeat = this.vars.repeat || 0,
            this._repeatDelay = this.vars.repeatDelay || 0,
            this._uncache(!0),
            t.prototype.invalidate.call(this)
        }
        ,
        u.addCallback = function(t, i, n, r) {
            return this.add(e.delayedCall(0, t, n, r), i)
        }
        ,
        u.removeCallback = function(t, e) {
            if (t)
                if (null == e)
                    this._kill(null , t);
                else
                    for (var i = this.getTweensOf(t, !1), n = i.length, r = this._parseTimeOrLabel(e); --n > -1; )
                        i[n]._startTime === r && i[n]._enabled(!1, !1);
            return this
        }
        ,
        u.removePause = function(e) {
            return this.removeCallback(t._internals.pauseCallback, e)
        }
        ,
        u.tweenTo = function(t, i) {
            i = i || {};
            var n, r, s, a = {
                ease: h,
                useFrames: this.usesFrames(),
                immediateRender: !1
            }, o = i.repeat && l.TweenMax || e;
            for (r in i)
                a[r] = i[r];
            return a.time = this._parseTimeOrLabel(t),
            n = Math.abs(Number(a.time) - this._time) / this._timeScale || .001,
            s = new o(this,n,a),
            a.onStart = function() {
                s.target.paused(!0),
                s.vars.time !== s.target.time() && n === s.duration() && s.duration(Math.abs(s.vars.time - s.target.time()) / s.target._timeScale),
                i.onStart && s._callback("onStart")
            }
            ,
            s
        }
        ,
        u.tweenFromTo = function(t, e, i) {
            i = i || {},
            t = this._parseTimeOrLabel(t),
            i.startAt = {
                onComplete: this.seek,
                onCompleteParams: [t],
                callbackScope: this
            },
            i.immediateRender = i.immediateRender !== !1;
            var n = this.tweenTo(e, i);
            return n.duration(Math.abs(n.vars.time - t) / this._timeScale || .001)
        }
        ,
        u.render = function(t, e, i) {
            this._gc && this._enabled(!0, !1);
            var n, s, l, h, u, c, f, p, _ = this._dirty ? this.totalDuration() : this._totalDuration, d = this._duration, m = this._time, g = this._totalTime, v = this._startTime, y = this._timeScale, x = this._rawPrevTime, T = this._paused, b = this._cycle;
            if (t >= _ - 1e-7)
                this._locked || (this._totalTime = _,
                this._cycle = this._repeat),
                this._reversed || this._hasPausedChild() || (s = !0,
                h = "onComplete",
                u = !!this._timeline.autoRemoveChildren,
                0 === this._duration && (0 >= t && t >= -1e-7 || 0 > x || x === r) && x !== t && this._first && (u = !0,
                x > r && (h = "onReverseComplete"))),
                this._rawPrevTime = this._duration || !e || t || this._rawPrevTime === t ? t : r,
                this._yoyo && 0 !== (1 & this._cycle) ? this._time = t = 0 : (this._time = d,
                t = d + 1e-4);
            else if (1e-7 > t)
                if (this._locked || (this._totalTime = this._cycle = 0),
                this._time = 0,
                (0 !== m || 0 === d && x !== r && (x > 0 || 0 > t && x >= 0) && !this._locked) && (h = "onReverseComplete",
                s = this._reversed),
                0 > t)
                    this._active = !1,
                    this._timeline.autoRemoveChildren && this._reversed ? (u = s = !0,
                    h = "onReverseComplete") : x >= 0 && this._first && (u = !0),
                    this._rawPrevTime = t;
                else {
                    if (this._rawPrevTime = d || !e || t || this._rawPrevTime === t ? t : r,
                    0 === t && s)
                        for (n = this._first; n && 0 === n._startTime; )
                            n._duration || (s = !1),
                            n = n._next;
                    t = 0,
                    this._initted || (u = !0)
                }
            else if (0 === d && 0 > x && (u = !0),
            this._time = this._rawPrevTime = t,
            this._locked || (this._totalTime = t,
            0 !== this._repeat && (c = d + this._repeatDelay,
            this._cycle = this._totalTime / c >> 0,
            0 !== this._cycle && this._cycle === this._totalTime / c && t >= g && this._cycle--,
            this._time = this._totalTime - this._cycle * c,
            this._yoyo && 0 !== (1 & this._cycle) && (this._time = d - this._time),
            this._time > d ? (this._time = d,
            t = d + 1e-4) : this._time < 0 ? this._time = t = 0 : t = this._time)),
            this._hasPause && !this._forcingPlayhead && !e) {
                if (t = this._time,
                t >= m)
                    for (n = this._first; n && n._startTime <= t && !f; )
                        n._duration || "isPause" !== n.data || n.ratio || 0 === n._startTime && 0 === this._rawPrevTime || (f = n),
                        n = n._next;
                else
                    for (n = this._last; n && n._startTime >= t && !f; )
                        n._duration || "isPause" === n.data && n._rawPrevTime > 0 && (f = n),
                        n = n._prev;
                f && (this._time = t = f._startTime,
                this._totalTime = t + this._cycle * (this._totalDuration + this._repeatDelay))
            }
            if (this._cycle !== b && !this._locked) {
                var w = this._yoyo && 0 !== (1 & b)
                  , P = w === (this._yoyo && 0 !== (1 & this._cycle))
                  , O = this._totalTime
                  , S = this._cycle
                  , k = this._rawPrevTime
                  , C = this._time;
                if (this._totalTime = b * d,
                this._cycle < b ? w = !w : this._totalTime += d,
                this._time = m,
                this._rawPrevTime = 0 === d ? x - 1e-4 : x,
                this._cycle = b,
                this._locked = !0,
                m = w ? 0 : d,
                this.render(m, e, 0 === d),
                e || this._gc || this.vars.onRepeat && this._callback("onRepeat"),
                m !== this._time)
                    return;
                if (P && (m = w ? d + 1e-4 : -1e-4,
                this.render(m, !0, !1)),
                this._locked = !1,
                this._paused && !T)
                    return;
                this._time = C,
                this._totalTime = O,
                this._cycle = S,
                this._rawPrevTime = k
            }
            if (!(this._time !== m && this._first || i || u || f))
                return void (g !== this._totalTime && this._onUpdate && (e || this._callback("onUpdate")));
            if (this._initted || (this._initted = !0),
            this._active || !this._paused && this._totalTime !== g && t > 0 && (this._active = !0),
            0 === g && this.vars.onStart && (0 === this._totalTime && this._totalDuration || e || this._callback("onStart")),
            p = this._time,
            p >= m)
                for (n = this._first; n && (l = n._next,
                p === this._time && (!this._paused || T)); )
                    (n._active || n._startTime <= this._time && !n._paused && !n._gc) && (f === n && this.pause(),
                    n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)),
                    n = l;
            else
                for (n = this._last; n && (l = n._prev,
                p === this._time && (!this._paused || T)); ) {
                    if (n._active || n._startTime <= m && !n._paused && !n._gc) {
                        if (f === n) {
                            for (f = n._prev; f && f.endTime() > this._time; )
                                f.render(f._reversed ? f.totalDuration() - (t - f._startTime) * f._timeScale : (t - f._startTime) * f._timeScale, e, i),
                                f = f._prev;
                            f = null ,
                            this.pause()
                        }
                        n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)
                    }
                    n = l
                }
            this._onUpdate && (e || (a.length && o(),
            this._callback("onUpdate"))),
            h && (this._locked || this._gc || (v === this._startTime || y !== this._timeScale) && (0 === this._time || _ >= this.totalDuration()) && (s && (a.length && o(),
            this._timeline.autoRemoveChildren && this._enabled(!1, !1),
            this._active = !1),
            !e && this.vars[h] && this._callback(h)))
        }
        ,
        u.getActive = function(t, e, i) {
            null == t && (t = !0),
            null == e && (e = !0),
            null == i && (i = !1);
            var n, r, s = [], a = this.getChildren(t, e, i), o = 0, l = a.length;
            for (n = 0; l > n; n++)
                r = a[n],
                r.isActive() && (s[o++] = r);
            return s
        }
        ,
        u.getLabelAfter = function(t) {
            t || 0 !== t && (t = this._time);
            var e, i = this.getLabelsArray(), n = i.length;
            for (e = 0; n > e; e++)
                if (i[e].time > t)
                    return i[e].name;
            return null
        }
        ,
        u.getLabelBefore = function(t) {
            null == t && (t = this._time);
            for (var e = this.getLabelsArray(), i = e.length; --i > -1; )
                if (e[i].time < t)
                    return e[i].name;
            return null
        }
        ,
        u.getLabelsArray = function() {
            var t, e = [], i = 0;
            for (t in this._labels)
                e[i++] = {
                    time: this._labels[t],
                    name: t
                };
            return e.sort(function(t, e) {
                return t.time - e.time
            }),
            e
        }
        ,
        u.progress = function(t, e) {
            return arguments.length ? this.totalTime(this.duration() * (this._yoyo && 0 !== (1 & this._cycle) ? 1 - t : t) + this._cycle * (this._duration + this._repeatDelay), e) : this._time / this.duration()
        }
        ,
        u.totalProgress = function(t, e) {
            return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this._totalTime / this.totalDuration()
        }
        ,
        u.totalDuration = function(e) {
            return arguments.length ? -1 !== this._repeat && e ? this.timeScale(this.totalDuration() / e) : this : (this._dirty && (t.prototype.totalDuration.call(this),
            this._totalDuration = -1 === this._repeat ? 999999999999 : this._duration * (this._repeat + 1) + this._repeatDelay * this._repeat),
            this._totalDuration)
        }
        ,
        u.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            t > this._duration && (t = this._duration),
            this._yoyo && 0 !== (1 & this._cycle) ? t = this._duration - t + this._cycle * (this._duration + this._repeatDelay) : 0 !== this._repeat && (t += this._cycle * (this._duration + this._repeatDelay)),
            this.totalTime(t, e)) : this._time
        }
        ,
        u.repeat = function(t) {
            return arguments.length ? (this._repeat = t,
            this._uncache(!0)) : this._repeat
        }
        ,
        u.repeatDelay = function(t) {
            return arguments.length ? (this._repeatDelay = t,
            this._uncache(!0)) : this._repeatDelay
        }
        ,
        u.yoyo = function(t) {
            return arguments.length ? (this._yoyo = t,
            this) : this._yoyo
        }
        ,
        u.currentLabel = function(t) {
            return arguments.length ? this.seek(t, !0) : this.getLabelBefore(this._time + 1e-8)
        }
        ,
        n
    }, !0),
    function() {
        var t = 180 / Math.PI
          , e = []
          , i = []
          , n = []
          , r = {}
          , s = _gsScope._gsDefine.globals
          , a = function(t, e, i, n) {
            i === n && (i = n - (n - e) / 1e6),
            t === e && (e = t + (i - t) / 1e6),
            this.a = t,
            this.b = e,
            this.c = i,
            this.d = n,
            this.da = n - t,
            this.ca = i - t,
            this.ba = e - t
        }
          , o = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,"
          , l = function(t, e, i, n) {
            var r = {
                a: t
            }
              , s = {}
              , a = {}
              , o = {
                c: n
            }
              , l = (t + e) / 2
              , h = (e + i) / 2
              , u = (i + n) / 2
              , c = (l + h) / 2
              , f = (h + u) / 2
              , p = (f - c) / 8;
            return r.b = l + (t - l) / 4,
            s.b = c + p,
            r.c = s.a = (r.b + s.b) / 2,
            s.c = a.a = (c + f) / 2,
            a.b = f - p,
            o.b = u + (n - u) / 4,
            a.c = o.a = (a.b + o.b) / 2,
            [r, s, a, o]
        }
          , h = function(t, r, s, a, o) {
            var h, u, c, f, p, _, d, m, g, v, y, x, T, b = t.length - 1, w = 0, P = t[0].a;
            for (h = 0; b > h; h++)
                p = t[w],
                u = p.a,
                c = p.d,
                f = t[w + 1].d,
                o ? (y = e[h],
                x = i[h],
                T = (x + y) * r * .25 / (a ? .5 : n[h] || .5),
                _ = c - (c - u) * (a ? .5 * r : 0 !== y ? T / y : 0),
                d = c + (f - c) * (a ? .5 * r : 0 !== x ? T / x : 0),
                m = c - (_ + ((d - _) * (3 * y / (y + x) + .5) / 4 || 0))) : (_ = c - (c - u) * r * .5,
                d = c + (f - c) * r * .5,
                m = c - (_ + d) / 2),
                _ += m,
                d += m,
                p.c = g = _,
                0 !== h ? p.b = P : p.b = P = p.a + .6 * (p.c - p.a),
                p.da = c - u,
                p.ca = g - u,
                p.ba = P - u,
                s ? (v = l(u, P, g, c),
                t.splice(w, 1, v[0], v[1], v[2], v[3]),
                w += 4) : w++,
                P = d;
            p = t[w],
            p.b = P,
            p.c = P + .4 * (p.d - P),
            p.da = p.d - p.a,
            p.ca = p.c - p.a,
            p.ba = P - p.a,
            s && (v = l(p.a, P, p.c, p.d),
            t.splice(w, 1, v[0], v[1], v[2], v[3]))
        }
          , u = function(t, n, r, s) {
            var o, l, h, u, c, f, p = [];
            if (s)
                for (t = [s].concat(t),
                l = t.length; --l > -1; )
                    "string" == typeof (f = t[l][n]) && "=" === f.charAt(1) && (t[l][n] = s[n] + Number(f.charAt(0) + f.substr(2)));
            if (o = t.length - 2,
            0 > o)
                return p[0] = new a(t[0][n],0,0,t[-1 > o ? 0 : 1][n]),
                p;
            for (l = 0; o > l; l++)
                h = t[l][n],
                u = t[l + 1][n],
                p[l] = new a(h,0,0,u),
                r && (c = t[l + 2][n],
                e[l] = (e[l] || 0) + (u - h) * (u - h),
                i[l] = (i[l] || 0) + (c - u) * (c - u));
            return p[l] = new a(t[l][n],0,0,t[l + 1][n]),
            p
        }
          , c = function(t, s, a, l, c, f) {
            var p, _, d, m, g, v, y, x, T = {}, b = [], w = f || t[0];
            c = "string" == typeof c ? "," + c + "," : o,
            null == s && (s = 1);
            for (_ in t[0])
                b.push(_);
            if (t.length > 1) {
                for (x = t[t.length - 1],
                y = !0,
                p = b.length; --p > -1; )
                    if (_ = b[p],
                    Math.abs(w[_] - x[_]) > .05) {
                        y = !1;
                        break
                    }
                y && (t = t.concat(),
                f && t.unshift(f),
                t.push(t[1]),
                f = t[t.length - 3])
            }
            for (e.length = i.length = n.length = 0,
            p = b.length; --p > -1; )
                _ = b[p],
                r[_] = -1 !== c.indexOf("," + _ + ","),
                T[_] = u(t, _, r[_], f);
            for (p = e.length; --p > -1; )
                e[p] = Math.sqrt(e[p]),
                i[p] = Math.sqrt(i[p]);
            if (!l) {
                for (p = b.length; --p > -1; )
                    if (r[_])
                        for (d = T[b[p]],
                        v = d.length - 1,
                        m = 0; v > m; m++)
                            g = d[m + 1].da / i[m] + d[m].da / e[m] || 0,
                            n[m] = (n[m] || 0) + g * g;
                for (p = n.length; --p > -1; )
                    n[p] = Math.sqrt(n[p])
            }
            for (p = b.length,
            m = a ? 4 : 1; --p > -1; )
                _ = b[p],
                d = T[_],
                h(d, s, a, l, r[_]),
                y && (d.splice(0, m),
                d.splice(d.length - m, m));
            return T
        }
          , f = function(t, e, i) {
            e = e || "soft";
            var n, r, s, o, l, h, u, c, f, p, _, d = {}, m = "cubic" === e ? 3 : 2, g = "soft" === e, v = [];
            if (g && i && (t = [i].concat(t)),
            null == t || t.length < m + 1)
                throw "invalid Bezier data";
            for (f in t[0])
                v.push(f);
            for (h = v.length; --h > -1; ) {
                for (f = v[h],
                d[f] = l = [],
                p = 0,
                c = t.length,
                u = 0; c > u; u++)
                    n = null == i ? t[u][f] : "string" == typeof (_ = t[u][f]) && "=" === _.charAt(1) ? i[f] + Number(_.charAt(0) + _.substr(2)) : Number(_),
                    g && u > 1 && c - 1 > u && (l[p++] = (n + l[p - 2]) / 2),
                    l[p++] = n;
                for (c = p - m + 1,
                p = 0,
                u = 0; c > u; u += m)
                    n = l[u],
                    r = l[u + 1],
                    s = l[u + 2],
                    o = 2 === m ? 0 : l[u + 3],
                    l[p++] = _ = 3 === m ? new a(n,r,s,o) : new a(n,(2 * r + n) / 3,(2 * r + s) / 3,s);
                l.length = p
            }
            return d
        }
          , p = function(t, e, i) {
            for (var n, r, s, a, o, l, h, u, c, f, p, _ = 1 / i, d = t.length; --d > -1; )
                for (f = t[d],
                s = f.a,
                a = f.d - s,
                o = f.c - s,
                l = f.b - s,
                n = r = 0,
                u = 1; i >= u; u++)
                    h = _ * u,
                    c = 1 - h,
                    n = r - (r = (h * h * a + 3 * c * (h * o + c * l)) * h),
                    p = d * i + u - 1,
                    e[p] = (e[p] || 0) + n * n
        }
          , _ = function(t, e) {
            e = e >> 0 || 6;
            var i, n, r, s, a = [], o = [], l = 0, h = 0, u = e - 1, c = [], f = [];
            for (i in t)
                p(t[i], a, e);
            for (r = a.length,
            n = 0; r > n; n++)
                l += Math.sqrt(a[n]),
                s = n % e,
                f[s] = l,
                s === u && (h += l,
                s = n / e >> 0,
                c[s] = f,
                o[s] = h,
                l = 0,
                f = []);
            return {
                length: h,
                lengths: o,
                segments: c
            }
        }
          , d = _gsScope._gsDefine.plugin({
            propName: "bezier",
            priority: -1,
            version: "1.3.7",
            API: 2,
            global: !0,
            init: function(t, e, i) {
                this._target = t,
                e instanceof Array && (e = {
                    values: e
                }),
                this._func = {},
                this._mod = {},
                this._props = [],
                this._timeRes = null == e.timeResolution ? 6 : parseInt(e.timeResolution, 10);
                var n, r, s, a, o, l = e.values || [], h = {}, u = l[0], p = e.autoRotate || i.vars.orientToBezier;
                this._autoRotate = p ? p instanceof Array ? p : [["x", "y", "rotation", p === !0 ? 0 : Number(p) || 0]] : null ;
                for (n in u)
                    this._props.push(n);
                for (s = this._props.length; --s > -1; )
                    n = this._props[s],
                    this._overwriteProps.push(n),
                    r = this._func[n] = "function" == typeof t[n],
                    h[n] = r ? t[n.indexOf("set") || "function" != typeof t["get" + n.substr(3)] ? n : "get" + n.substr(3)]() : parseFloat(t[n]),
                    o || h[n] !== l[0][n] && (o = h);
                if (this._beziers = "cubic" !== e.type && "quadratic" !== e.type && "soft" !== e.type ? c(l, isNaN(e.curviness) ? 1 : e.curviness, !1, "thruBasic" === e.type, e.correlate, o) : f(l, e.type, h),
                this._segCount = this._beziers[n].length,
                this._timeRes) {
                    var d = _(this._beziers, this._timeRes);
                    this._length = d.length,
                    this._lengths = d.lengths,
                    this._segments = d.segments,
                    this._l1 = this._li = this._s1 = this._si = 0,
                    this._l2 = this._lengths[0],
                    this._curSeg = this._segments[0],
                    this._s2 = this._curSeg[0],
                    this._prec = 1 / this._curSeg.length
                }
                if (p = this._autoRotate)
                    for (this._initialRotations = [],
                    p[0]instanceof Array || (this._autoRotate = p = [p]),
                    s = p.length; --s > -1; ) {
                        for (a = 0; 3 > a; a++)
                            n = p[s][a],
                            this._func[n] = "function" == typeof t[n] && t[n.indexOf("set") || "function" != typeof t["get" + n.substr(3)] ? n : "get" + n.substr(3)];
                        n = p[s][2],
                        this._initialRotations[s] = (this._func[n] ? this._func[n].call(this._target) : this._target[n]) || 0,
                        this._overwriteProps.push(n)
                    }
                return this._startRatio = i.vars.runBackwards ? 1 : 0,
                !0
            },
            set: function(e) {
                var i, n, r, s, a, o, l, h, u, c, f = this._segCount, p = this._func, _ = this._target, d = e !== this._startRatio;
                if (this._timeRes) {
                    if (u = this._lengths,
                    c = this._curSeg,
                    e *= this._length,
                    r = this._li,
                    e > this._l2 && f - 1 > r) {
                        for (h = f - 1; h > r && (this._l2 = u[++r]) <= e; )
                            ;
                        this._l1 = u[r - 1],
                        this._li = r,
                        this._curSeg = c = this._segments[r],
                        this._s2 = c[this._s1 = this._si = 0]
                    } else if (e < this._l1 && r > 0) {
                        for (; r > 0 && (this._l1 = u[--r]) >= e; )
                            ;
                        0 === r && e < this._l1 ? this._l1 = 0 : r++,
                        this._l2 = u[r],
                        this._li = r,
                        this._curSeg = c = this._segments[r],
                        this._s1 = c[(this._si = c.length - 1) - 1] || 0,
                        this._s2 = c[this._si]
                    }
                    if (i = r,
                    e -= this._l1,
                    r = this._si,
                    e > this._s2 && r < c.length - 1) {
                        for (h = c.length - 1; h > r && (this._s2 = c[++r]) <= e; )
                            ;
                        this._s1 = c[r - 1],
                        this._si = r
                    } else if (e < this._s1 && r > 0) {
                        for (; r > 0 && (this._s1 = c[--r]) >= e; )
                            ;
                        0 === r && e < this._s1 ? this._s1 = 0 : r++,
                        this._s2 = c[r],
                        this._si = r
                    }
                    o = (r + (e - this._s1) / (this._s2 - this._s1)) * this._prec || 0
                } else
                    i = 0 > e ? 0 : e >= 1 ? f - 1 : f * e >> 0,
                    o = (e - i * (1 / f)) * f;
                for (n = 1 - o,
                r = this._props.length; --r > -1; )
                    s = this._props[r],
                    a = this._beziers[s][i],
                    l = (o * o * a.da + 3 * n * (o * a.ca + n * a.ba)) * o + a.a,
                    this._mod[s] && (l = this._mod[s](l, _)),
                    p[s] ? _[s](l) : _[s] = l;
                if (this._autoRotate) {
                    var m, g, v, y, x, T, b, w = this._autoRotate;
                    for (r = w.length; --r > -1; )
                        s = w[r][2],
                        T = w[r][3] || 0,
                        b = w[r][4] === !0 ? 1 : t,
                        a = this._beziers[w[r][0]],
                        m = this._beziers[w[r][1]],
                        a && m && (a = a[i],
                        m = m[i],
                        g = a.a + (a.b - a.a) * o,
                        y = a.b + (a.c - a.b) * o,
                        g += (y - g) * o,
                        y += (a.c + (a.d - a.c) * o - y) * o,
                        v = m.a + (m.b - m.a) * o,
                        x = m.b + (m.c - m.b) * o,
                        v += (x - v) * o,
                        x += (m.c + (m.d - m.c) * o - x) * o,
                        l = d ? Math.atan2(x - v, y - g) * b + T : this._initialRotations[r],
                        this._mod[s] && (l = this._mod[s](l, _)),
                        p[s] ? _[s](l) : _[s] = l)
                }
            }
        })
          , m = d.prototype;
        d.bezierThrough = c,
        d.cubicToQuadratic = l,
        d._autoCSS = !0,
        d.quadraticToCubic = function(t, e, i) {
            return new a(t,(2 * e + t) / 3,(2 * e + i) / 3,i)
        }
        ,
        d._cssRegister = function() {
            var t = s.CSSPlugin;
            if (t) {
                var e = t._internals
                  , i = e._parseToProxy
                  , n = e._setPluginRatio
                  , r = e.CSSPropTween;
                e._registerComplexSpecialProp("bezier", {
                    parser: function(t, e, s, a, o, l) {
                        e instanceof Array && (e = {
                            values: e
                        }),
                        l = new d;
                        var h, u, c, f = e.values, p = f.length - 1, _ = [], m = {};
                        if (0 > p)
                            return o;
                        for (h = 0; p >= h; h++)
                            c = i(t, f[h], a, o, l, p !== h),
                            _[h] = c.end;
                        for (u in e)
                            m[u] = e[u];
                        return m.values = _,
                        o = new r(t,"bezier",0,0,c.pt,2),
                        o.data = c,
                        o.plugin = l,
                        o.setRatio = n,
                        0 === m.autoRotate && (m.autoRotate = !0),
                        !m.autoRotate || m.autoRotate instanceof Array || (h = m.autoRotate === !0 ? 0 : Number(m.autoRotate),
                        m.autoRotate = null != c.end.left ? [["left", "top", "rotation", h, !1]] : null != c.end.x && [["x", "y", "rotation", h, !1]]),
                        m.autoRotate && (a._transform || a._enableTransforms(!1),
                        c.autoRotate = a._target._gsTransform,
                        c.proxy.rotation = c.autoRotate.rotation || 0,
                        a._overwriteProps.push("rotation")),
                        l._onInitTween(c.proxy, m, a._tween),
                        o
                    }
                })
            }
        }
        ,
        m._mod = function(t) {
            for (var e, i = this._overwriteProps, n = i.length; --n > -1; )
                e = t[i[n]],
                e && "function" == typeof e && (this._mod[i[n]] = e)
        }
        ,
        m._kill = function(t) {
            var e, i, n = this._props;
            for (e in this._beziers)
                if (e in t)
                    for (delete this._beziers[e],
                    delete this._func[e],
                    i = n.length; --i > -1; )
                        n[i] === e && n.splice(i, 1);
            if (n = this._autoRotate)
                for (i = n.length; --i > -1; )
                    t[n[i][2]] && n.splice(i, 1);
            return this._super._kill.call(this, t)
        }
    }(),
    _gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin", "TweenLite"], function(t, e) {
        var i, n, r, s, a = function() {
            t.call(this, "css"),
            this._overwriteProps.length = 0,
            this.setRatio = a.prototype.setRatio
        }
        , o = _gsScope._gsDefine.globals, l = {}, h = a.prototype = new t("css");
        h.constructor = a,
        a.version = "1.19.0",
        a.API = 2,
        a.defaultTransformPerspective = 0,
        a.defaultSkewType = "compensated",
        a.defaultSmoothOrigin = !0,
        h = "px",
        a.suffixMap = {
            top: h,
            right: h,
            bottom: h,
            left: h,
            width: h,
            height: h,
            fontSize: h,
            padding: h,
            margin: h,
            perspective: h,
            lineHeight: ""
        };
        var u, c, f, p, _, d, m, g, v = /(?:\-|\.|\b)(\d|\.|e\-)+/g, y = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g, x = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, T = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, b = /(?:\d|\-|\+|=|#|\.)*/g, w = /opacity *= *([^)]*)/i, P = /opacity:([^;]*)/i, O = /alpha\(opacity *=.+?\)/i, S = /^(rgb|hsl)/, k = /([A-Z])/g, C = /-([a-z])/gi, R = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, M = function(t, e) {
            return e.toUpperCase()
        }
        , A = /(?:Left|Right|Width)/i, D = /(M11|M12|M21|M22)=[\d\-\.e]+/gi, E = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i, z = /,(?=[^\)]*(?:\(|$))/gi, I = /[\s,\(]/i, N = Math.PI / 180, F = 180 / Math.PI, L = {}, X = document, j = function(t) {
            return X.createElementNS ? X.createElementNS("http://www.w3.org/1999/xhtml", t) : X.createElement(t)
        }
        , Y = j("div"), B = j("img"), U = a._internals = {
            _specialProps: l
        }, $ = navigator.userAgent, Z = function() {
            var t = $.indexOf("Android")
              , e = j("a");
            return f = -1 !== $.indexOf("Safari") && -1 === $.indexOf("Chrome") && (-1 === t || Number($.substr(t + 8, 1)) > 3),
            _ = f && Number($.substr($.indexOf("Version/") + 8, 1)) < 6,
            p = -1 !== $.indexOf("Firefox"),
            (/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec($) || /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec($)) && (d = parseFloat(RegExp.$1)),
            !!e && (e.style.cssText = "top:1px;opacity:.55;",
            /^0.55/.test(e.style.opacity))
        }(), q = function(t) {
            return w.test("string" == typeof t ? t : (t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? parseFloat(RegExp.$1) / 100 : 1
        }
        , V = function(t) {
            window.console && console.log(t)
        }
        , W = "", H = "", G = function(t, e) {
            e = e || Y;
            var i, n, r = e.style;
            if (void 0 !== r[t])
                return t;
            for (t = t.charAt(0).toUpperCase() + t.substr(1),
            i = ["O", "Moz", "ms", "Ms", "Webkit"],
            n = 5; --n > -1 && void 0 === r[i[n] + t]; )
                ;
            return n >= 0 ? (H = 3 === n ? "ms" : i[n],
            W = "-" + H.toLowerCase() + "-",
            H + t) : null
        }
        , Q = X.defaultView ? X.defaultView.getComputedStyle : function() {}
        , J = a.getStyle = function(t, e, i, n, r) {
            var s;
            return Z || "opacity" !== e ? (!n && t.style[e] ? s = t.style[e] : (i = i || Q(t)) ? s = i[e] || i.getPropertyValue(e) || i.getPropertyValue(e.replace(k, "-$1").toLowerCase()) : t.currentStyle && (s = t.currentStyle[e]),
            null == r || s && "none" !== s && "auto" !== s && "auto auto" !== s ? s : r) : q(t)
        }
        , K = U.convertToPixels = function(t, i, n, r, s) {
            if ("px" === r || !r)
                return n;
            if ("auto" === r || !n)
                return 0;
            var o, l, h, u = A.test(i), c = t, f = Y.style, p = 0 > n, _ = 1 === n;
            if (p && (n = -n),
            _ && (n *= 100),
            "%" === r && -1 !== i.indexOf("border"))
                o = n / 100 * (u ? t.clientWidth : t.clientHeight);
            else {
                if (f.cssText = "border:0 solid red;position:" + J(t, "position") + ";line-height:0;",
                "%" !== r && c.appendChild && "v" !== r.charAt(0) && "rem" !== r)
                    f[u ? "borderLeftWidth" : "borderTopWidth"] = n + r;
                else {
                    if (c = t.parentNode || X.body,
                    l = c._gsCache,
                    h = e.ticker.frame,
                    l && u && l.time === h)
                        return l.width * n / 100;
                    f[u ? "width" : "height"] = n + r
                }
                c.appendChild(Y),
                o = parseFloat(Y[u ? "offsetWidth" : "offsetHeight"]),
                c.removeChild(Y),
                u && "%" === r && a.cacheWidths !== !1 && (l = c._gsCache = c._gsCache || {},
                l.time = h,
                l.width = o / n * 100),
                0 !== o || s || (o = K(t, i, n, r, !0))
            }
            return _ && (o /= 100),
            p ? -o : o
        }
        , tt = U.calculateOffset = function(t, e, i) {
            if ("absolute" !== J(t, "position", i))
                return 0;
            var n = "left" === e ? "Left" : "Top"
              , r = J(t, "margin" + n, i);
            return t["offset" + n] - (K(t, e, parseFloat(r), r.replace(b, "")) || 0)
        }
        , et = function(t, e) {
            var i, n, r, s = {};
            if (e = e || Q(t, null ))
                if (i = e.length)
                    for (; --i > -1; )
                        r = e[i],
                        (-1 === r.indexOf("-transform") || Ct === r) && (s[r.replace(C, M)] = e.getPropertyValue(r));
                else
                    for (i in e)
                        (-1 === i.indexOf("Transform") || kt === i) && (s[i] = e[i]);
            else if (e = t.currentStyle || t.style)
                for (i in e)
                    "string" == typeof i && void 0 === s[i] && (s[i.replace(C, M)] = e[i]);
            return Z || (s.opacity = q(t)),
            n = Yt(t, e, !1),
            s.rotation = n.rotation,
            s.skewX = n.skewX,
            s.scaleX = n.scaleX,
            s.scaleY = n.scaleY,
            s.x = n.x,
            s.y = n.y,
            Mt && (s.z = n.z,
            s.rotationX = n.rotationX,
            s.rotationY = n.rotationY,
            s.scaleZ = n.scaleZ),
            s.filters && delete s.filters,
            s
        }
        , it = function(t, e, i, n, r) {
            var s, a, o, l = {}, h = t.style;
            for (a in i)
                "cssText" !== a && "length" !== a && isNaN(a) && (e[a] !== (s = i[a]) || r && r[a]) && -1 === a.indexOf("Origin") && ("number" == typeof s || "string" == typeof s) && (l[a] = "auto" !== s || "left" !== a && "top" !== a ? "" !== s && "auto" !== s && "none" !== s || "string" != typeof e[a] || "" === e[a].replace(T, "") ? s : 0 : tt(t, a),
                void 0 !== h[a] && (o = new gt(h,a,h[a],o)));
            if (n)
                for (a in n)
                    "className" !== a && (l[a] = n[a]);
            return {
                difs: l,
                firstMPT: o
            }
        }
        , nt = {
            width: ["Left", "Right"],
            height: ["Top", "Bottom"]
        }, rt = ["marginLeft", "marginRight", "marginTop", "marginBottom"], st = function(t, e, i) {
            if ("svg" === (t.nodeName + "").toLowerCase())
                return (i || Q(t))[e] || 0;
            if (t.getBBox && Lt(t))
                return t.getBBox()[e] || 0;
            var n = parseFloat("width" === e ? t.offsetWidth : t.offsetHeight)
              , r = nt[e]
              , s = r.length;
            for (i = i || Q(t, null ); --s > -1; )
                n -= parseFloat(J(t, "padding" + r[s], i, !0)) || 0,
                n -= parseFloat(J(t, "border" + r[s] + "Width", i, !0)) || 0;
            return n
        }
        , at = function(t, e) {
            if ("contain" === t || "auto" === t || "auto auto" === t)
                return t + " ";
            (null == t || "" === t) && (t = "0 0");
            var i, n = t.split(" "), r = -1 !== t.indexOf("left") ? "0%" : -1 !== t.indexOf("right") ? "100%" : n[0], s = -1 !== t.indexOf("top") ? "0%" : -1 !== t.indexOf("bottom") ? "100%" : n[1];
            if (n.length > 3 && !e) {
                for (n = t.split(", ").join(",").split(","),
                t = [],
                i = 0; i < n.length; i++)
                    t.push(at(n[i]));
                return t.join(",")
            }
            return null == s ? s = "center" === r ? "50%" : "0" : "center" === s && (s = "50%"),
            ("center" === r || isNaN(parseFloat(r)) && -1 === (r + "").indexOf("=")) && (r = "50%"),
            t = r + " " + s + (n.length > 2 ? " " + n[2] : ""),
            e && (e.oxp = -1 !== r.indexOf("%"),
            e.oyp = -1 !== s.indexOf("%"),
            e.oxr = "=" === r.charAt(1),
            e.oyr = "=" === s.charAt(1),
            e.ox = parseFloat(r.replace(T, "")),
            e.oy = parseFloat(s.replace(T, "")),
            e.v = t),
            e || t
        }
        , ot = function(t, e) {
            return "function" == typeof t && (t = t(g, m)),
            "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) : parseFloat(t) - parseFloat(e) || 0
        }
        , lt = function(t, e) {
            return "function" == typeof t && (t = t(g, m)),
            null == t ? e : "string" == typeof t && "=" === t.charAt(1) ? parseInt(t.charAt(0) + "1", 10) * parseFloat(t.substr(2)) + e : parseFloat(t) || 0
        }
        , ht = function(t, e, i, n) {
            var r, s, a, o, l, h = 1e-6;
            return "function" == typeof t && (t = t(g, m)),
            null == t ? o = e : "number" == typeof t ? o = t : (r = 360,
            s = t.split("_"),
            l = "=" === t.charAt(1),
            a = (l ? parseInt(t.charAt(0) + "1", 10) * parseFloat(s[0].substr(2)) : parseFloat(s[0])) * (-1 === t.indexOf("rad") ? 1 : F) - (l ? 0 : e),
            s.length && (n && (n[i] = e + a),
            -1 !== t.indexOf("short") && (a %= r,
            a !== a % (r / 2) && (a = 0 > a ? a + r : a - r)),
            -1 !== t.indexOf("_cw") && 0 > a ? a = (a + 9999999999 * r) % r - (a / r | 0) * r : -1 !== t.indexOf("ccw") && a > 0 && (a = (a - 9999999999 * r) % r - (a / r | 0) * r)),
            o = e + a),
            h > o && o > -h && (o = 0),
            o
        }
        , ut = {
            aqua: [0, 255, 255],
            lime: [0, 255, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, 255],
            navy: [0, 0, 128],
            white: [255, 255, 255],
            fuchsia: [255, 0, 255],
            olive: [128, 128, 0],
            yellow: [255, 255, 0],
            orange: [255, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [255, 0, 0],
            pink: [255, 192, 203],
            cyan: [0, 255, 255],
            transparent: [255, 255, 255, 0]
        }, ct = function(t, e, i) {
            return t = 0 > t ? t + 1 : t > 1 ? t - 1 : t,
            255 * (1 > 6 * t ? e + (i - e) * t * 6 : .5 > t ? i : 2 > 3 * t ? e + (i - e) * (2 / 3 - t) * 6 : e) + .5 | 0
        }
        , ft = a.parseColor = function(t, e) {
            var i, n, r, s, a, o, l, h, u, c, f;
            if (t)
                if ("number" == typeof t)
                    i = [t >> 16, t >> 8 & 255, 255 & t];
                else {
                    if ("," === t.charAt(t.length - 1) && (t = t.substr(0, t.length - 1)),
                    ut[t])
                        i = ut[t];
                    else if ("#" === t.charAt(0))
                        4 === t.length && (n = t.charAt(1),
                        r = t.charAt(2),
                        s = t.charAt(3),
                        t = "#" + n + n + r + r + s + s),
                        t = parseInt(t.substr(1), 16),
                        i = [t >> 16, t >> 8 & 255, 255 & t];
                    else if ("hsl" === t.substr(0, 3))
                        if (i = f = t.match(v),
                        e) {
                            if (-1 !== t.indexOf("="))
                                return t.match(y)
                        } else
                            a = Number(i[0]) % 360 / 360,
                            o = Number(i[1]) / 100,
                            l = Number(i[2]) / 100,
                            r = .5 >= l ? l * (o + 1) : l + o - l * o,
                            n = 2 * l - r,
                            i.length > 3 && (i[3] = Number(t[3])),
                            i[0] = ct(a + 1 / 3, n, r),
                            i[1] = ct(a, n, r),
                            i[2] = ct(a - 1 / 3, n, r);
                    else
                        i = t.match(v) || ut.transparent;
                    i[0] = Number(i[0]),
                    i[1] = Number(i[1]),
                    i[2] = Number(i[2]),
                    i.length > 3 && (i[3] = Number(i[3]))
                }
            else
                i = ut.black;
            return e && !f && (n = i[0] / 255,
            r = i[1] / 255,
            s = i[2] / 255,
            h = Math.max(n, r, s),
            u = Math.min(n, r, s),
            l = (h + u) / 2,
            h === u ? a = o = 0 : (c = h - u,
            o = l > .5 ? c / (2 - h - u) : c / (h + u),
            a = h === n ? (r - s) / c + (s > r ? 6 : 0) : h === r ? (s - n) / c + 2 : (n - r) / c + 4,
            a *= 60),
            i[0] = a + .5 | 0,
            i[1] = 100 * o + .5 | 0,
            i[2] = 100 * l + .5 | 0),
            i
        }
        , pt = function(t, e) {
            var i, n, r, s = t.match(_t) || [], a = 0, o = s.length ? "" : t;
            for (i = 0; i < s.length; i++)
                n = s[i],
                r = t.substr(a, t.indexOf(n, a) - a),
                a += r.length + n.length,
                n = ft(n, e),
                3 === n.length && n.push(1),
                o += r + (e ? "hsla(" + n[0] + "," + n[1] + "%," + n[2] + "%," + n[3] : "rgba(" + n.join(",")) + ")";
            return o + t.substr(a)
        }
        , _t = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";
        for (h in ut)
            _t += "|" + h + "\\b";
        _t = new RegExp(_t + ")","gi"),
        a.colorStringFilter = function(t) {
            var e, i = t[0] + t[1];
            _t.test(i) && (e = -1 !== i.indexOf("hsl(") || -1 !== i.indexOf("hsla("),
            t[0] = pt(t[0], e),
            t[1] = pt(t[1], e)),
            _t.lastIndex = 0
        }
        ,
        e.defaultStringFilter || (e.defaultStringFilter = a.colorStringFilter);
        var dt = function(t, e, i, n) {
            if (null == t)
                return function(t) {
                    return t
                }
                ;
            var r, s = e ? (t.match(_t) || [""])[0] : "", a = t.split(s).join("").match(x) || [], o = t.substr(0, t.indexOf(a[0])), l = ")" === t.charAt(t.length - 1) ? ")" : "", h = -1 !== t.indexOf(" ") ? " " : ",", u = a.length, c = u > 0 ? a[0].replace(v, "") : "";
            return u ? r = e ? function(t) {
                var e, f, p, _;
                if ("number" == typeof t)
                    t += c;
                else if (n && z.test(t)) {
                    for (_ = t.replace(z, "|").split("|"),
                    p = 0; p < _.length; p++)
                        _[p] = r(_[p]);
                    return _.join(",")
                }
                if (e = (t.match(_t) || [s])[0],
                f = t.split(e).join("").match(x) || [],
                p = f.length,
                u > p--)
                    for (; ++p < u; )
                        f[p] = i ? f[(p - 1) / 2 | 0] : a[p];
                return o + f.join(h) + h + e + l + (-1 !== t.indexOf("inset") ? " inset" : "")
            }
            : function(t) {
                var e, s, f;
                if ("number" == typeof t)
                    t += c;
                else if (n && z.test(t)) {
                    for (s = t.replace(z, "|").split("|"),
                    f = 0; f < s.length; f++)
                        s[f] = r(s[f]);
                    return s.join(",")
                }
                if (e = t.match(x) || [],
                f = e.length,
                u > f--)
                    for (; ++f < u; )
                        e[f] = i ? e[(f - 1) / 2 | 0] : a[f];
                return o + e.join(h) + l
            }
            : function(t) {
                return t
            }
        }
          , mt = function(t) {
            return t = t.split(","),
            function(e, i, n, r, s, a, o) {
                var l, h = (i + "").split(" ");
                for (o = {},
                l = 0; 4 > l; l++)
                    o[t[l]] = h[l] = h[l] || h[(l - 1) / 2 >> 0];
                return r.parse(e, o, s, a)
            }
        }
          , gt = (U._setPluginRatio = function(t) {
            this.plugin.setRatio(t);
            for (var e, i, n, r, s, a = this.data, o = a.proxy, l = a.firstMPT, h = 1e-6; l; )
                e = o[l.v],
                l.r ? e = Math.round(e) : h > e && e > -h && (e = 0),
                l.t[l.p] = e,
                l = l._next;
            if (a.autoRotate && (a.autoRotate.rotation = a.mod ? a.mod(o.rotation, this.t) : o.rotation),
            1 === t || 0 === t)
                for (l = a.firstMPT,
                s = 1 === t ? "e" : "b"; l; ) {
                    if (i = l.t,
                    i.type) {
                        if (1 === i.type) {
                            for (r = i.xs0 + i.s + i.xs1,
                            n = 1; n < i.l; n++)
                                r += i["xn" + n] + i["xs" + (n + 1)];
                            i[s] = r
                        }
                    } else
                        i[s] = i.s + i.xs0;
                    l = l._next
                }
        }
        ,
        function(t, e, i, n, r) {
            this.t = t,
            this.p = e,
            this.v = i,
            this.r = r,
            n && (n._prev = this,
            this._next = n)
        }
        )
          , vt = (U._parseToProxy = function(t, e, i, n, r, s) {
            var a, o, l, h, u, c = n, f = {}, p = {}, _ = i._transform, d = L;
            for (i._transform = null ,
            L = e,
            n = u = i.parse(t, e, n, r),
            L = d,
            s && (i._transform = _,
            c && (c._prev = null ,
            c._prev && (c._prev._next = null ))); n && n !== c; ) {
                if (n.type <= 1 && (o = n.p,
                p[o] = n.s + n.c,
                f[o] = n.s,
                s || (h = new gt(n,"s",o,h,n.r),
                n.c = 0),
                1 === n.type))
                    for (a = n.l; --a > 0; )
                        l = "xn" + a,
                        o = n.p + "_" + l,
                        p[o] = n.data[l],
                        f[o] = n[l],
                        s || (h = new gt(n,l,o,h,n.rxp[l]));
                n = n._next
            }
            return {
                proxy: f,
                end: p,
                firstMPT: h,
                pt: u
            }
        }
        ,
        U.CSSPropTween = function(t, e, n, r, a, o, l, h, u, c, f) {
            this.t = t,
            this.p = e,
            this.s = n,
            this.c = r,
            this.n = l || e,
            t instanceof vt || s.push(this.n),
            this.r = h,
            this.type = o || 0,
            u && (this.pr = u,
            i = !0),
            this.b = void 0 === c ? n : c,
            this.e = void 0 === f ? n + r : f,
            a && (this._next = a,
            a._prev = this)
        }
        )
          , yt = function(t, e, i, n, r, s) {
            var a = new vt(t,e,i,n - i,r,(-1),s);
            return a.b = i,
            a.e = a.xs0 = n,
            a
        }
          , xt = a.parseComplex = function(t, e, i, n, r, s, o, l, h, c) {
            i = i || s || "",
            "function" == typeof n && (n = n(g, m)),
            o = new vt(t,e,0,0,o,c ? 2 : 1,null ,(!1),l,i,n),
            n += "",
            r && _t.test(n + i) && (n = [i, n],
            a.colorStringFilter(n),
            i = n[0],
            n = n[1]);
            var f, p, _, d, x, T, b, w, P, O, S, k, C, R = i.split(", ").join(",").split(" "), M = n.split(", ").join(",").split(" "), A = R.length, D = u !== !1;
            for ((-1 !== n.indexOf(",") || -1 !== i.indexOf(",")) && (R = R.join(" ").replace(z, ", ").split(" "),
            M = M.join(" ").replace(z, ", ").split(" "),
            A = R.length),
            A !== M.length && (R = (s || "").split(" "),
            A = R.length),
            o.plugin = h,
            o.setRatio = c,
            _t.lastIndex = 0,
            f = 0; A > f; f++)
                if (d = R[f],
                x = M[f],
                w = parseFloat(d),
                w || 0 === w)
                    o.appendXtra("", w, ot(x, w), x.replace(y, ""), D && -1 !== x.indexOf("px"), !0);
                else if (r && _t.test(d))
                    k = x.indexOf(")") + 1,
                    k = ")" + (k ? x.substr(k) : ""),
                    C = -1 !== x.indexOf("hsl") && Z,
                    d = ft(d, C),
                    x = ft(x, C),
                    P = d.length + x.length > 6,
                    P && !Z && 0 === x[3] ? (o["xs" + o.l] += o.l ? " transparent" : "transparent",
                    o.e = o.e.split(M[f]).join("transparent")) : (Z || (P = !1),
                    C ? o.appendXtra(P ? "hsla(" : "hsl(", d[0], ot(x[0], d[0]), ",", !1, !0).appendXtra("", d[1], ot(x[1], d[1]), "%,", !1).appendXtra("", d[2], ot(x[2], d[2]), P ? "%," : "%" + k, !1) : o.appendXtra(P ? "rgba(" : "rgb(", d[0], x[0] - d[0], ",", !0, !0).appendXtra("", d[1], x[1] - d[1], ",", !0).appendXtra("", d[2], x[2] - d[2], P ? "," : k, !0),
                    P && (d = d.length < 4 ? 1 : d[3],
                    o.appendXtra("", d, (x.length < 4 ? 1 : x[3]) - d, k, !1))),
                    _t.lastIndex = 0;
                else if (T = d.match(v)) {
                    if (b = x.match(y),
                    !b || b.length !== T.length)
                        return o;
                    for (_ = 0,
                    p = 0; p < T.length; p++)
                        S = T[p],
                        O = d.indexOf(S, _),
                        o.appendXtra(d.substr(_, O - _), Number(S), ot(b[p], S), "", D && "px" === d.substr(O + S.length, 2), 0 === p),
                        _ = O + S.length;
                    o["xs" + o.l] += d.substr(_)
                } else
                    o["xs" + o.l] += o.l || o["xs" + o.l] ? " " + x : x;
            if (-1 !== n.indexOf("=") && o.data) {
                for (k = o.xs0 + o.data.s,
                f = 1; f < o.l; f++)
                    k += o["xs" + f] + o.data["xn" + f];
                o.e = k + o["xs" + f]
            }
            return o.l || (o.type = -1,
            o.xs0 = o.e),
            o.xfirst || o
        }
          , Tt = 9;
        for (h = vt.prototype,
        h.l = h.pr = 0; --Tt > 0; )
            h["xn" + Tt] = 0,
            h["xs" + Tt] = "";
        h.xs0 = "",
        h._next = h._prev = h.xfirst = h.data = h.plugin = h.setRatio = h.rxp = null ,
        h.appendXtra = function(t, e, i, n, r, s) {
            var a = this
              , o = a.l;
            return a["xs" + o] += s && (o || a["xs" + o]) ? " " + t : t || "",
            i || 0 === o || a.plugin ? (a.l++,
            a.type = a.setRatio ? 2 : 1,
            a["xs" + a.l] = n || "",
            o > 0 ? (a.data["xn" + o] = e + i,
            a.rxp["xn" + o] = r,
            a["xn" + o] = e,
            a.plugin || (a.xfirst = new vt(a,"xn" + o,e,i,a.xfirst || a,0,a.n,r,a.pr),
            a.xfirst.xs0 = 0),
            a) : (a.data = {
                s: e + i
            },
            a.rxp = {},
            a.s = e,
            a.c = i,
            a.r = r,
            a)) : (a["xs" + o] += e + (n || ""),
            a)
        }
        ;
        var bt = function(t, e) {
            e = e || {},
            this.p = e.prefix ? G(t) || t : t,
            l[t] = l[this.p] = this,
            this.format = e.formatter || dt(e.defaultValue, e.color, e.collapsible, e.multi),
            e.parser && (this.parse = e.parser),
            this.clrs = e.color,
            this.multi = e.multi,
            this.keyword = e.keyword,
            this.dflt = e.defaultValue,
            this.pr = e.priority || 0
        }
          , wt = U._registerComplexSpecialProp = function(t, e, i) {
            "object" != typeof e && (e = {
                parser: i
            });
            var n, r, s = t.split(","), a = e.defaultValue;
            for (i = i || [a],
            n = 0; n < s.length; n++)
                e.prefix = 0 === n && e.prefix,
                e.defaultValue = i[n] || a,
                r = new bt(s[n],e)
        }
          , Pt = U._registerPluginProp = function(t) {
            if (!l[t]) {
                var e = t.charAt(0).toUpperCase() + t.substr(1) + "Plugin";
                wt(t, {
                    parser: function(t, i, n, r, s, a, h) {
                        var u = o.com.greensock.plugins[e];
                        return u ? (u._cssRegister(),
                        l[n].parse(t, i, n, r, s, a, h)) : (V("Error: " + e + " js file not loaded."),
                        s)
                    }
                })
            }
        }
        ;
        h = bt.prototype,
        h.parseComplex = function(t, e, i, n, r, s) {
            var a, o, l, h, u, c, f = this.keyword;
            if (this.multi && (z.test(i) || z.test(e) ? (o = e.replace(z, "|").split("|"),
            l = i.replace(z, "|").split("|")) : f && (o = [e],
            l = [i])),
            l) {
                for (h = l.length > o.length ? l.length : o.length,
                a = 0; h > a; a++)
                    e = o[a] = o[a] || this.dflt,
                    i = l[a] = l[a] || this.dflt,
                    f && (u = e.indexOf(f),
                    c = i.indexOf(f),
                    u !== c && (-1 === c ? o[a] = o[a].split(f).join("") : -1 === u && (o[a] += " " + f)));
                e = o.join(", "),
                i = l.join(", ")
            }
            return xt(t, this.p, e, i, this.clrs, this.dflt, n, this.pr, r, s)
        }
        ,
        h.parse = function(t, e, i, n, s, a, o) {
            return this.parseComplex(t.style, this.format(J(t, this.p, r, !1, this.dflt)), this.format(e), s, a)
        }
        ,
        a.registerSpecialProp = function(t, e, i) {
            wt(t, {
                parser: function(t, n, r, s, a, o, l) {
                    var h = new vt(t,r,0,0,a,2,r,(!1),i);
                    return h.plugin = o,
                    h.setRatio = e(t, n, s._tween, r),
                    h
                },
                priority: i
            })
        }
        ,
        a.useSVGTransformAttr = f || p;
        var Ot, St = "scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent".split(","), kt = G("transform"), Ct = W + "transform", Rt = G("transformOrigin"), Mt = null !== G("perspective"), At = U.Transform = function() {
            this.perspective = parseFloat(a.defaultTransformPerspective) || 0,
            this.force3D = !(a.defaultForce3D === !1 || !Mt) && (a.defaultForce3D || "auto")
        }
        , Dt = window.SVGElement, Et = function(t, e, i) {
            var n, r = X.createElementNS("http://www.w3.org/2000/svg", t), s = /([a-z])([A-Z])/g;
            for (n in i)
                r.setAttributeNS(null , n.replace(s, "$1-$2").toLowerCase(), i[n]);
            return e.appendChild(r),
            r
        }
        , zt = X.documentElement, It = function() {
            var t, e, i, n = d || /Android/i.test($) && !window.chrome;
            return X.createElementNS && !n && (t = Et("svg", zt),
            e = Et("rect", t, {
                width: 100,
                height: 50,
                x: 100
            }),
            i = e.getBoundingClientRect().width,
            e.style[Rt] = "50% 50%",
            e.style[kt] = "scaleX(0.5)",
            n = i === e.getBoundingClientRect().width && !(p && Mt),
            zt.removeChild(t)),
            n
        }(), Nt = function(t, e, i, n, r, s) {
            var o, l, h, u, c, f, p, _, d, m, g, v, y, x, T = t._gsTransform, b = jt(t, !0);
            T && (y = T.xOrigin,
            x = T.yOrigin),
            (!n || (o = n.split(" ")).length < 2) && (p = t.getBBox(),
            e = at(e).split(" "),
            o = [(-1 !== e[0].indexOf("%") ? parseFloat(e[0]) / 100 * p.width : parseFloat(e[0])) + p.x, (-1 !== e[1].indexOf("%") ? parseFloat(e[1]) / 100 * p.height : parseFloat(e[1])) + p.y]),
            i.xOrigin = u = parseFloat(o[0]),
            i.yOrigin = c = parseFloat(o[1]),
            n && b !== Xt && (f = b[0],
            p = b[1],
            _ = b[2],
            d = b[3],
            m = b[4],
            g = b[5],
            v = f * d - p * _,
            l = u * (d / v) + c * (-_ / v) + (_ * g - d * m) / v,
            h = u * (-p / v) + c * (f / v) - (f * g - p * m) / v,
            u = i.xOrigin = o[0] = l,
            c = i.yOrigin = o[1] = h),
            T && (s && (i.xOffset = T.xOffset,
            i.yOffset = T.yOffset,
            T = i),
            r || r !== !1 && a.defaultSmoothOrigin !== !1 ? (l = u - y,
            h = c - x,
            T.xOffset += l * b[0] + h * b[2] - l,
            T.yOffset += l * b[1] + h * b[3] - h) : T.xOffset = T.yOffset = 0),
            s || t.setAttribute("data-svg-origin", o.join(" "))
        }
        , Ft = function(t) {
            try {
                return t.getBBox()
            } catch (t) {}
        }
        , Lt = function(t) {
            return !!(Dt && t.getBBox && t.getCTM && Ft(t) && (!t.parentNode || t.parentNode.getBBox && t.parentNode.getCTM))
        }
        , Xt = [1, 0, 0, 1, 0, 0], jt = function(t, e) {
            var i, n, r, s, a, o, l = t._gsTransform || new At, h = 1e5, u = t.style;
            if (kt ? n = J(t, Ct, null , !0) : t.currentStyle && (n = t.currentStyle.filter.match(D),
            n = n && 4 === n.length ? [n[0].substr(4), Number(n[2].substr(4)), Number(n[1].substr(4)), n[3].substr(4), l.x || 0, l.y || 0].join(",") : ""),
            i = !n || "none" === n || "matrix(1, 0, 0, 1, 0, 0)" === n,
            i && kt && ((o = "none" === Q(t).display) || !t.parentNode) && (o && (s = u.display,
            u.display = "block"),
            t.parentNode || (a = 1,
            zt.appendChild(t)),
            n = J(t, Ct, null , !0),
            i = !n || "none" === n || "matrix(1, 0, 0, 1, 0, 0)" === n,
            s ? u.display = s : o && Zt(u, "display"),
            a && zt.removeChild(t)),
            (l.svg || t.getBBox && Lt(t)) && (i && -1 !== (u[kt] + "").indexOf("matrix") && (n = u[kt],
            i = 0),
            r = t.getAttribute("transform"),
            i && r && (-1 !== r.indexOf("matrix") ? (n = r,
            i = 0) : -1 !== r.indexOf("translate") && (n = "matrix(1,0,0,1," + r.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")",
            i = 0))),
            i)
                return Xt;
            for (r = (n || "").match(v) || [],
            Tt = r.length; --Tt > -1; )
                s = Number(r[Tt]),
                r[Tt] = (a = s - (s |= 0)) ? (a * h + (0 > a ? -.5 : .5) | 0) / h + s : s;
            return e && r.length > 6 ? [r[0], r[1], r[4], r[5], r[12], r[13]] : r
        }
        , Yt = U.getTransform = function(t, i, n, r) {
            if (t._gsTransform && n && !r)
                return t._gsTransform;
            var s, o, l, h, u, c, f = n ? t._gsTransform || new At : new At, p = f.scaleX < 0, _ = 2e-5, d = 1e5, m = Mt ? parseFloat(J(t, Rt, i, !1, "0 0 0").split(" ")[2]) || f.zOrigin || 0 : 0, g = parseFloat(a.defaultTransformPerspective) || 0;
            if (f.svg = !(!t.getBBox || !Lt(t)),
            f.svg && (Nt(t, J(t, Rt, i, !1, "50% 50%") + "", f, t.getAttribute("data-svg-origin")),
            Ot = a.useSVGTransformAttr || It),
            s = jt(t),
            s !== Xt) {
                if (16 === s.length) {
                    var v, y, x, T, b, w = s[0], P = s[1], O = s[2], S = s[3], k = s[4], C = s[5], R = s[6], M = s[7], A = s[8], D = s[9], E = s[10], z = s[12], I = s[13], N = s[14], L = s[11], X = Math.atan2(R, E);
                    f.zOrigin && (N = -f.zOrigin,
                    z = A * N - s[12],
                    I = D * N - s[13],
                    N = E * N + f.zOrigin - s[14]),
                    f.rotationX = X * F,
                    X && (T = Math.cos(-X),
                    b = Math.sin(-X),
                    v = k * T + A * b,
                    y = C * T + D * b,
                    x = R * T + E * b,
                    A = k * -b + A * T,
                    D = C * -b + D * T,
                    E = R * -b + E * T,
                    L = M * -b + L * T,
                    k = v,
                    C = y,
                    R = x),
                    X = Math.atan2(-O, E),
                    f.rotationY = X * F,
                    X && (T = Math.cos(-X),
                    b = Math.sin(-X),
                    v = w * T - A * b,
                    y = P * T - D * b,
                    x = O * T - E * b,
                    D = P * b + D * T,
                    E = O * b + E * T,
                    L = S * b + L * T,
                    w = v,
                    P = y,
                    O = x),
                    X = Math.atan2(P, w),
                    f.rotation = X * F,
                    X && (T = Math.cos(-X),
                    b = Math.sin(-X),
                    w = w * T + k * b,
                    y = P * T + C * b,
                    C = P * -b + C * T,
                    R = O * -b + R * T,
                    P = y),
                    f.rotationX && Math.abs(f.rotationX) + Math.abs(f.rotation) > 359.9 && (f.rotationX = f.rotation = 0,
                    f.rotationY = 180 - f.rotationY),
                    f.scaleX = (Math.sqrt(w * w + P * P) * d + .5 | 0) / d,
                    f.scaleY = (Math.sqrt(C * C + D * D) * d + .5 | 0) / d,
                    f.scaleZ = (Math.sqrt(R * R + E * E) * d + .5 | 0) / d,
                    f.rotationX || f.rotationY ? f.skewX = 0 : (f.skewX = k || C ? Math.atan2(k, C) * F + f.rotation : f.skewX || 0,
                    Math.abs(f.skewX) > 90 && Math.abs(f.skewX) < 270 && (p ? (f.scaleX *= -1,
                    f.skewX += f.rotation <= 0 ? 180 : -180,
                    f.rotation += f.rotation <= 0 ? 180 : -180) : (f.scaleY *= -1,
                    f.skewX += f.skewX <= 0 ? 180 : -180))),
                    f.perspective = L ? 1 / (0 > L ? -L : L) : 0,
                    f.x = z,
                    f.y = I,
                    f.z = N,
                    f.svg && (f.x -= f.xOrigin - (f.xOrigin * w - f.yOrigin * k),
                    f.y -= f.yOrigin - (f.yOrigin * P - f.xOrigin * C))
                } else if (!Mt || r || !s.length || f.x !== s[4] || f.y !== s[5] || !f.rotationX && !f.rotationY) {
                    var j = s.length >= 6
                      , Y = j ? s[0] : 1
                      , B = s[1] || 0
                      , U = s[2] || 0
                      , $ = j ? s[3] : 1;
                    f.x = s[4] || 0,
                    f.y = s[5] || 0,
                    l = Math.sqrt(Y * Y + B * B),
                    h = Math.sqrt($ * $ + U * U),
                    u = Y || B ? Math.atan2(B, Y) * F : f.rotation || 0,
                    c = U || $ ? Math.atan2(U, $) * F + u : f.skewX || 0,
                    Math.abs(c) > 90 && Math.abs(c) < 270 && (p ? (l *= -1,
                    c += 0 >= u ? 180 : -180,
                    u += 0 >= u ? 180 : -180) : (h *= -1,
                    c += 0 >= c ? 180 : -180)),
                    f.scaleX = l,
                    f.scaleY = h,
                    f.rotation = u,
                    f.skewX = c,
                    Mt && (f.rotationX = f.rotationY = f.z = 0,
                    f.perspective = g,
                    f.scaleZ = 1),
                    f.svg && (f.x -= f.xOrigin - (f.xOrigin * Y + f.yOrigin * U),
                    f.y -= f.yOrigin - (f.xOrigin * B + f.yOrigin * $))
                }
                f.zOrigin = m;
                for (o in f)
                    f[o] < _ && f[o] > -_ && (f[o] = 0)
            }
            return n && (t._gsTransform = f,
            f.svg && (Ot && t.style[kt] ? e.delayedCall(.001, function() {
                Zt(t.style, kt)
            }) : !Ot && t.getAttribute("transform") && e.delayedCall(.001, function() {
                t.removeAttribute("transform")
            }))),
            f
        }
        , Bt = function(t) {
            var e, i, n = this.data, r = -n.rotation * N, s = r + n.skewX * N, a = 1e5, o = (Math.cos(r) * n.scaleX * a | 0) / a, l = (Math.sin(r) * n.scaleX * a | 0) / a, h = (Math.sin(s) * -n.scaleY * a | 0) / a, u = (Math.cos(s) * n.scaleY * a | 0) / a, c = this.t.style, f = this.t.currentStyle;
            if (f) {
                i = l,
                l = -h,
                h = -i,
                e = f.filter,
                c.filter = "";
                var p, _, m = this.t.offsetWidth, g = this.t.offsetHeight, v = "absolute" !== f.position, y = "progid:DXImageTransform.Microsoft.Matrix(M11=" + o + ", M12=" + l + ", M21=" + h + ", M22=" + u, x = n.x + m * n.xPercent / 100, T = n.y + g * n.yPercent / 100;
                if (null != n.ox && (p = (n.oxp ? m * n.ox * .01 : n.ox) - m / 2,
                _ = (n.oyp ? g * n.oy * .01 : n.oy) - g / 2,
                x += p - (p * o + _ * l),
                T += _ - (p * h + _ * u)),
                v ? (p = m / 2,
                _ = g / 2,
                y += ", Dx=" + (p - (p * o + _ * l) + x) + ", Dy=" + (_ - (p * h + _ * u) + T) + ")") : y += ", sizingMethod='auto expand')",
                -1 !== e.indexOf("DXImageTransform.Microsoft.Matrix(") ? c.filter = e.replace(E, y) : c.filter = y + " " + e,
                (0 === t || 1 === t) && 1 === o && 0 === l && 0 === h && 1 === u && (v && -1 === y.indexOf("Dx=0, Dy=0") || w.test(e) && 100 !== parseFloat(RegExp.$1) || -1 === e.indexOf(e.indexOf("Alpha")) && c.removeAttribute("filter")),
                !v) {
                    var P, O, S, k = 8 > d ? 1 : -1;
                    for (p = n.ieOffsetX || 0,
                    _ = n.ieOffsetY || 0,
                    n.ieOffsetX = Math.round((m - ((0 > o ? -o : o) * m + (0 > l ? -l : l) * g)) / 2 + x),
                    n.ieOffsetY = Math.round((g - ((0 > u ? -u : u) * g + (0 > h ? -h : h) * m)) / 2 + T),
                    Tt = 0; 4 > Tt; Tt++)
                        O = rt[Tt],
                        P = f[O],
                        i = -1 !== P.indexOf("px") ? parseFloat(P) : K(this.t, O, parseFloat(P), P.replace(b, "")) || 0,
                        S = i !== n[O] ? 2 > Tt ? -n.ieOffsetX : -n.ieOffsetY : 2 > Tt ? p - n.ieOffsetX : _ - n.ieOffsetY,
                        c[O] = (n[O] = Math.round(i - S * (0 === Tt || 2 === Tt ? 1 : k))) + "px"
                }
            }
        }
        , Ut = U.set3DTransformRatio = U.setTransformRatio = function(t) {
            var e, i, n, r, s, a, o, l, h, u, c, f, _, d, m, g, v, y, x, T, b, w, P, O = this.data, S = this.t.style, k = O.rotation, C = O.rotationX, R = O.rotationY, M = O.scaleX, A = O.scaleY, D = O.scaleZ, E = O.x, z = O.y, I = O.z, F = O.svg, L = O.perspective, X = O.force3D;
            if (((1 === t || 0 === t) && "auto" === X && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime) || !X) && !I && !L && !R && !C && 1 === D || Ot && F || !Mt)
                return void (k || O.skewX || F ? (k *= N,
                w = O.skewX * N,
                P = 1e5,
                e = Math.cos(k) * M,
                r = Math.sin(k) * M,
                i = Math.sin(k - w) * -A,
                s = Math.cos(k - w) * A,
                w && "simple" === O.skewType && (v = Math.tan(w - O.skewY * N),
                v = Math.sqrt(1 + v * v),
                i *= v,
                s *= v,
                O.skewY && (v = Math.tan(O.skewY * N),
                v = Math.sqrt(1 + v * v),
                e *= v,
                r *= v)),
                F && (E += O.xOrigin - (O.xOrigin * e + O.yOrigin * i) + O.xOffset,
                z += O.yOrigin - (O.xOrigin * r + O.yOrigin * s) + O.yOffset,
                Ot && (O.xPercent || O.yPercent) && (d = this.t.getBBox(),
                E += .01 * O.xPercent * d.width,
                z += .01 * O.yPercent * d.height),
                d = 1e-6,
                d > E && E > -d && (E = 0),
                d > z && z > -d && (z = 0)),
                x = (e * P | 0) / P + "," + (r * P | 0) / P + "," + (i * P | 0) / P + "," + (s * P | 0) / P + "," + E + "," + z + ")",
                F && Ot ? this.t.setAttribute("transform", "matrix(" + x) : S[kt] = (O.xPercent || O.yPercent ? "translate(" + O.xPercent + "%," + O.yPercent + "%) matrix(" : "matrix(") + x) : S[kt] = (O.xPercent || O.yPercent ? "translate(" + O.xPercent + "%," + O.yPercent + "%) matrix(" : "matrix(") + M + ",0,0," + A + "," + E + "," + z + ")");
            if (p && (d = 1e-4,
            d > M && M > -d && (M = D = 2e-5),
            d > A && A > -d && (A = D = 2e-5),
            !L || O.z || O.rotationX || O.rotationY || (L = 0)),
            k || O.skewX)
                k *= N,
                m = e = Math.cos(k),
                g = r = Math.sin(k),
                O.skewX && (k -= O.skewX * N,
                m = Math.cos(k),
                g = Math.sin(k),
                "simple" === O.skewType && (v = Math.tan((O.skewX - O.skewY) * N),
                v = Math.sqrt(1 + v * v),
                m *= v,
                g *= v,
                O.skewY && (v = Math.tan(O.skewY * N),
                v = Math.sqrt(1 + v * v),
                e *= v,
                r *= v))),
                i = -g,
                s = m;
            else {
                if (!(R || C || 1 !== D || L || F))
                    return void (S[kt] = (O.xPercent || O.yPercent ? "translate(" + O.xPercent + "%," + O.yPercent + "%) translate3d(" : "translate3d(") + E + "px," + z + "px," + I + "px)" + (1 !== M || 1 !== A ? " scale(" + M + "," + A + ")" : ""));
                e = s = 1,
                i = r = 0
            }
            h = 1,
            n = a = o = l = u = c = 0,
            f = L ? -1 / L : 0,
            _ = O.zOrigin,
            d = 1e-6,
            T = ",",
            b = "0",
            k = R * N,
            k && (m = Math.cos(k),
            g = Math.sin(k),
            o = -g,
            u = f * -g,
            n = e * g,
            a = r * g,
            h = m,
            f *= m,
            e *= m,
            r *= m),
            k = C * N,
            k && (m = Math.cos(k),
            g = Math.sin(k),
            v = i * m + n * g,
            y = s * m + a * g,
            l = h * g,
            c = f * g,
            n = i * -g + n * m,
            a = s * -g + a * m,
            h *= m,
            f *= m,
            i = v,
            s = y),
            1 !== D && (n *= D,
            a *= D,
            h *= D,
            f *= D),
            1 !== A && (i *= A,
            s *= A,
            l *= A,
            c *= A),
            1 !== M && (e *= M,
            r *= M,
            o *= M,
            u *= M),
            (_ || F) && (_ && (E += n * -_,
            z += a * -_,
            I += h * -_ + _),
            F && (E += O.xOrigin - (O.xOrigin * e + O.yOrigin * i) + O.xOffset,
            z += O.yOrigin - (O.xOrigin * r + O.yOrigin * s) + O.yOffset),
            d > E && E > -d && (E = b),
            d > z && z > -d && (z = b),
            d > I && I > -d && (I = 0)),
            x = O.xPercent || O.yPercent ? "translate(" + O.xPercent + "%," + O.yPercent + "%) matrix3d(" : "matrix3d(",
            x += (d > e && e > -d ? b : e) + T + (d > r && r > -d ? b : r) + T + (d > o && o > -d ? b : o),
            x += T + (d > u && u > -d ? b : u) + T + (d > i && i > -d ? b : i) + T + (d > s && s > -d ? b : s),
            C || R || 1 !== D ? (x += T + (d > l && l > -d ? b : l) + T + (d > c && c > -d ? b : c) + T + (d > n && n > -d ? b : n),
            x += T + (d > a && a > -d ? b : a) + T + (d > h && h > -d ? b : h) + T + (d > f && f > -d ? b : f) + T) : x += ",0,0,0,0,1,0,",
            x += E + T + z + T + I + T + (L ? 1 + -I / L : 1) + ")",
            S[kt] = x
        }
        ;
        h = At.prototype,
        h.x = h.y = h.z = h.skewX = h.skewY = h.rotation = h.rotationX = h.rotationY = h.zOrigin = h.xPercent = h.yPercent = h.xOffset = h.yOffset = 0,
        h.scaleX = h.scaleY = h.scaleZ = 1,
        wt("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {
            parser: function(t, e, i, n, s, o, l) {
                if (n._lastParsedTransform === l)
                    return s;
                n._lastParsedTransform = l;
                var h;
                "function" == typeof l[i] && (h = l[i],
                l[i] = e);
                var u, c, f, p, _, d, v, y, x, T = t._gsTransform, b = t.style, w = 1e-6, P = St.length, O = l, S = {}, k = "transformOrigin", C = Yt(t, r, !0, O.parseTransform), R = O.transform && ("function" == typeof O.transform ? O.transform(g, m) : O.transform);
                if (n._transform = C,
                R && "string" == typeof R && kt)
                    c = Y.style,
                    c[kt] = R,
                    c.display = "block",
                    c.position = "absolute",
                    X.body.appendChild(Y),
                    u = Yt(Y, null , !1),
                    C.svg && (d = C.xOrigin,
                    v = C.yOrigin,
                    u.x -= C.xOffset,
                    u.y -= C.yOffset,
                    (O.transformOrigin || O.svgOrigin) && (R = {},
                    Nt(t, at(O.transformOrigin), R, O.svgOrigin, O.smoothOrigin, !0),
                    d = R.xOrigin,
                    v = R.yOrigin,
                    u.x -= R.xOffset - C.xOffset,
                    u.y -= R.yOffset - C.yOffset),
                    (d || v) && (y = jt(Y, !0),
                    u.x -= d - (d * y[0] + v * y[2]),
                    u.y -= v - (d * y[1] + v * y[3]))),
                    X.body.removeChild(Y),
                    u.perspective || (u.perspective = C.perspective),
                    null != O.xPercent && (u.xPercent = lt(O.xPercent, C.xPercent)),
                    null != O.yPercent && (u.yPercent = lt(O.yPercent, C.yPercent));
                else if ("object" == typeof O) {
                    if (u = {
                        scaleX: lt(null != O.scaleX ? O.scaleX : O.scale, C.scaleX),
                        scaleY: lt(null != O.scaleY ? O.scaleY : O.scale, C.scaleY),
                        scaleZ: lt(O.scaleZ, C.scaleZ),
                        x: lt(O.x, C.x),
                        y: lt(O.y, C.y),
                        z: lt(O.z, C.z),
                        xPercent: lt(O.xPercent, C.xPercent),
                        yPercent: lt(O.yPercent, C.yPercent),
                        perspective: lt(O.transformPerspective, C.perspective)
                    },
                    _ = O.directionalRotation,
                    null != _)
                        if ("object" == typeof _)
                            for (c in _)
                                O[c] = _[c];
                        else
                            O.rotation = _;
                    "string" == typeof O.x && -1 !== O.x.indexOf("%") && (u.x = 0,
                    u.xPercent = lt(O.x, C.xPercent)),
                    "string" == typeof O.y && -1 !== O.y.indexOf("%") && (u.y = 0,
                    u.yPercent = lt(O.y, C.yPercent)),
                    u.rotation = ht("rotation"in O ? O.rotation : "shortRotation"in O ? O.shortRotation + "_short" : "rotationZ"in O ? O.rotationZ : C.rotation - C.skewY, C.rotation - C.skewY, "rotation", S),
                    Mt && (u.rotationX = ht("rotationX"in O ? O.rotationX : "shortRotationX"in O ? O.shortRotationX + "_short" : C.rotationX || 0, C.rotationX, "rotationX", S),
                    u.rotationY = ht("rotationY"in O ? O.rotationY : "shortRotationY"in O ? O.shortRotationY + "_short" : C.rotationY || 0, C.rotationY, "rotationY", S)),
                    u.skewX = ht(O.skewX, C.skewX - C.skewY),
                    (u.skewY = ht(O.skewY, C.skewY)) && (u.skewX += u.skewY,
                    u.rotation += u.skewY)
                }
                for (Mt && null != O.force3D && (C.force3D = O.force3D,
                p = !0),
                C.skewType = O.skewType || C.skewType || a.defaultSkewType,
                f = C.force3D || C.z || C.rotationX || C.rotationY || u.z || u.rotationX || u.rotationY || u.perspective,
                f || null == O.scale || (u.scaleZ = 1); --P > -1; )
                    x = St[P],
                    R = u[x] - C[x],
                    (R > w || -w > R || null != O[x] || null != L[x]) && (p = !0,
                    s = new vt(C,x,C[x],R,s),
                    x in S && (s.e = S[x]),
                    s.xs0 = 0,
                    s.plugin = o,
                    n._overwriteProps.push(s.n));
                return R = O.transformOrigin,
                C.svg && (R || O.svgOrigin) && (d = C.xOffset,
                v = C.yOffset,
                Nt(t, at(R), u, O.svgOrigin, O.smoothOrigin),
                s = yt(C, "xOrigin", (T ? C : u).xOrigin, u.xOrigin, s, k),
                s = yt(C, "yOrigin", (T ? C : u).yOrigin, u.yOrigin, s, k),
                (d !== C.xOffset || v !== C.yOffset) && (s = yt(C, "xOffset", T ? d : C.xOffset, C.xOffset, s, k),
                s = yt(C, "yOffset", T ? v : C.yOffset, C.yOffset, s, k)),
                R = Ot ? null : "0px 0px"),
                (R || Mt && f && C.zOrigin) && (kt ? (p = !0,
                x = Rt,
                R = (R || J(t, x, r, !1, "50% 50%")) + "",
                s = new vt(b,x,0,0,s,(-1),k),
                s.b = b[x],
                s.plugin = o,
                Mt ? (c = C.zOrigin,
                R = R.split(" "),
                C.zOrigin = (R.length > 2 && (0 === c || "0px" !== R[2]) ? parseFloat(R[2]) : c) || 0,
                s.xs0 = s.e = R[0] + " " + (R[1] || "50%") + " 0px",
                s = new vt(C,"zOrigin",0,0,s,(-1),s.n),
                s.b = c,
                s.xs0 = s.e = C.zOrigin) : s.xs0 = s.e = R) : at(R + "", C)),
                p && (n._transformType = C.svg && Ot || !f && 3 !== this._transformType ? 2 : 3),
                h && (l[i] = h),
                s
            },
            prefix: !0
        }),
        wt("boxShadow", {
            defaultValue: "0px 0px 0px 0px #999",
            prefix: !0,
            color: !0,
            multi: !0,
            keyword: "inset"
        }),
        wt("borderRadius", {
            defaultValue: "0px",
            parser: function(t, e, i, s, a, o) {
                e = this.format(e);
                var l, h, u, c, f, p, _, d, m, g, v, y, x, T, b, w, P = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"], O = t.style;
                for (m = parseFloat(t.offsetWidth),
                g = parseFloat(t.offsetHeight),
                l = e.split(" "),
                h = 0; h < P.length; h++)
                    this.p.indexOf("border") && (P[h] = G(P[h])),
                    f = c = J(t, P[h], r, !1, "0px"),
                    -1 !== f.indexOf(" ") && (c = f.split(" "),
                    f = c[0],
                    c = c[1]),
                    p = u = l[h],
                    _ = parseFloat(f),
                    y = f.substr((_ + "").length),
                    x = "=" === p.charAt(1),
                    x ? (d = parseInt(p.charAt(0) + "1", 10),
                    p = p.substr(2),
                    d *= parseFloat(p),
                    v = p.substr((d + "").length - (0 > d ? 1 : 0)) || "") : (d = parseFloat(p),
                    v = p.substr((d + "").length)),
                    "" === v && (v = n[i] || y),
                    v !== y && (T = K(t, "borderLeft", _, y),
                    b = K(t, "borderTop", _, y),
                    "%" === v ? (f = T / m * 100 + "%",
                    c = b / g * 100 + "%") : "em" === v ? (w = K(t, "borderLeft", 1, "em"),
                    f = T / w + "em",
                    c = b / w + "em") : (f = T + "px",
                    c = b + "px"),
                    x && (p = parseFloat(f) + d + v,
                    u = parseFloat(c) + d + v)),
                    a = xt(O, P[h], f + " " + c, p + " " + u, !1, "0px", a);
                return a
            },
            prefix: !0,
            formatter: dt("0px 0px 0px 0px", !1, !0)
        }),
        wt("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {
            defaultValue: "0px",
            parser: function(t, e, i, n, s, a) {
                return xt(t.style, i, this.format(J(t, i, r, !1, "0px 0px")), this.format(e), !1, "0px", s)
            },
            prefix: !0,
            formatter: dt("0px 0px", !1, !0)
        }),
        wt("backgroundPosition", {
            defaultValue: "0 0",
            parser: function(t, e, i, n, s, a) {
                var o, l, h, u, c, f, p = "background-position", _ = r || Q(t, null ), m = this.format((_ ? d ? _.getPropertyValue(p + "-x") + " " + _.getPropertyValue(p + "-y") : _.getPropertyValue(p) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), g = this.format(e);
                if (-1 !== m.indexOf("%") != (-1 !== g.indexOf("%")) && g.split(",").length < 2 && (f = J(t, "backgroundImage").replace(R, ""),
                f && "none" !== f)) {
                    for (o = m.split(" "),
                    l = g.split(" "),
                    B.setAttribute("src", f),
                    h = 2; --h > -1; )
                        m = o[h],
                        u = -1 !== m.indexOf("%"),
                        u !== (-1 !== l[h].indexOf("%")) && (c = 0 === h ? t.offsetWidth - B.width : t.offsetHeight - B.height,
                        o[h] = u ? parseFloat(m) / 100 * c + "px" : parseFloat(m) / c * 100 + "%");
                    m = o.join(" ")
                }
                return this.parseComplex(t.style, m, g, s, a)
            },
            formatter: at
        }),
        wt("backgroundSize", {
            defaultValue: "0 0",
            formatter: function(t) {
                return t += "",
                at(-1 === t.indexOf(" ") ? t + " " + t : t)
            }
        }),
        wt("perspective", {
            defaultValue: "0px",
            prefix: !0
        }),
        wt("perspectiveOrigin", {
            defaultValue: "50% 50%",
            prefix: !0
        }),
        wt("transformStyle", {
            prefix: !0
        }),
        wt("backfaceVisibility", {
            prefix: !0
        }),
        wt("userSelect", {
            prefix: !0
        }),
        wt("margin", {
            parser: mt("marginTop,marginRight,marginBottom,marginLeft")
        }),
        wt("padding", {
            parser: mt("paddingTop,paddingRight,paddingBottom,paddingLeft")
        }),
        wt("clip", {
            defaultValue: "rect(0px,0px,0px,0px)",
            parser: function(t, e, i, n, s, a) {
                var o, l, h;
                return 9 > d ? (l = t.currentStyle,
                h = 8 > d ? " " : ",",
                o = "rect(" + l.clipTop + h + l.clipRight + h + l.clipBottom + h + l.clipLeft + ")",
                e = this.format(e).split(",").join(h)) : (o = this.format(J(t, this.p, r, !1, this.dflt)),
                e = this.format(e)),
                this.parseComplex(t.style, o, e, s, a)
            }
        }),
        wt("textShadow", {
            defaultValue: "0px 0px 0px #999",
            color: !0,
            multi: !0
        }),
        wt("autoRound,strictUnits", {
            parser: function(t, e, i, n, r) {
                return r
            }
        }),
        wt("border", {
            defaultValue: "0px solid #000",
            parser: function(t, e, i, n, s, a) {
                var o = J(t, "borderTopWidth", r, !1, "0px")
                  , l = this.format(e).split(" ")
                  , h = l[0].replace(b, "");
                return "px" !== h && (o = parseFloat(o) / K(t, "borderTopWidth", 1, h) + h),
                this.parseComplex(t.style, this.format(o + " " + J(t, "borderTopStyle", r, !1, "solid") + " " + J(t, "borderTopColor", r, !1, "#000")), l.join(" "), s, a)
            },
            color: !0,
            formatter: function(t) {
                var e = t.split(" ");
                return e[0] + " " + (e[1] || "solid") + " " + (t.match(_t) || ["#000"])[0]
            }
        }),
        wt("borderWidth", {
            parser: mt("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")
        }),
        wt("float,cssFloat,styleFloat", {
            parser: function(t, e, i, n, r, s) {
                var a = t.style
                  , o = "cssFloat"in a ? "cssFloat" : "styleFloat";
                return new vt(a,o,0,0,r,(-1),i,(!1),0,a[o],e)
            }
        });
        var $t = function(t) {
            var e, i = this.t, n = i.filter || J(this.data, "filter") || "", r = this.s + this.c * t | 0;
            100 === r && (-1 === n.indexOf("atrix(") && -1 === n.indexOf("radient(") && -1 === n.indexOf("oader(") ? (i.removeAttribute("filter"),
            e = !J(this.data, "filter")) : (i.filter = n.replace(O, ""),
            e = !0)),
            e || (this.xn1 && (i.filter = n = n || "alpha(opacity=" + r + ")"),
            -1 === n.indexOf("pacity") ? 0 === r && this.xn1 || (i.filter = n + " alpha(opacity=" + r + ")") : i.filter = n.replace(w, "opacity=" + r))
        }
        ;
        wt("opacity,alpha,autoAlpha", {
            defaultValue: "1",
            parser: function(t, e, i, n, s, a) {
                var o = parseFloat(J(t, "opacity", r, !1, "1"))
                  , l = t.style
                  , h = "autoAlpha" === i;
                return "string" == typeof e && "=" === e.charAt(1) && (e = ("-" === e.charAt(0) ? -1 : 1) * parseFloat(e.substr(2)) + o),
                h && 1 === o && "hidden" === J(t, "visibility", r) && 0 !== e && (o = 0),
                Z ? s = new vt(l,"opacity",o,e - o,s) : (s = new vt(l,"opacity",100 * o,100 * (e - o),s),
                s.xn1 = h ? 1 : 0,
                l.zoom = 1,
                s.type = 2,
                s.b = "alpha(opacity=" + s.s + ")",
                s.e = "alpha(opacity=" + (s.s + s.c) + ")",
                s.data = t,
                s.plugin = a,
                s.setRatio = $t),
                h && (s = new vt(l,"visibility",0,0,s,(-1),null ,(!1),0,0 !== o ? "inherit" : "hidden",0 === e ? "hidden" : "inherit"),
                s.xs0 = "inherit",
                n._overwriteProps.push(s.n),
                n._overwriteProps.push(i)),
                s
            }
        });
        var Zt = function(t, e) {
            e && (t.removeProperty ? (("ms" === e.substr(0, 2) || "webkit" === e.substr(0, 6)) && (e = "-" + e),
            t.removeProperty(e.replace(k, "-$1").toLowerCase())) : t.removeAttribute(e))
        }
          , qt = function(t) {
            if (this.t._gsClassPT = this,
            1 === t || 0 === t) {
                this.t.setAttribute("class", 0 === t ? this.b : this.e);
                for (var e = this.data, i = this.t.style; e; )
                    e.v ? i[e.p] = e.v : Zt(i, e.p),
                    e = e._next;
                1 === t && this.t._gsClassPT === this && (this.t._gsClassPT = null )
            } else
                this.t.getAttribute("class") !== this.e && this.t.setAttribute("class", this.e)
        }
        ;
        wt("className", {
            parser: function(t, e, n, s, a, o, l) {
                var h, u, c, f, p, _ = t.getAttribute("class") || "", d = t.style.cssText;
                if (a = s._classNamePT = new vt(t,n,0,0,a,2),
                a.setRatio = qt,
                a.pr = -11,
                i = !0,
                a.b = _,
                u = et(t, r),
                c = t._gsClassPT) {
                    for (f = {},
                    p = c.data; p; )
                        f[p.p] = 1,
                        p = p._next;
                    c.setRatio(1)
                }
                return t._gsClassPT = a,
                a.e = "=" !== e.charAt(1) ? e : _.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ("+" === e.charAt(0) ? " " + e.substr(2) : ""),
                t.setAttribute("class", a.e),
                h = it(t, u, et(t), l, f),
                t.setAttribute("class", _),
                a.data = h.firstMPT,
                t.style.cssText = d,
                a = a.xfirst = s.parse(t, h.difs, a, o)
            }
        });
        var Vt = function(t) {
            if ((1 === t || 0 === t) && this.data._totalTime === this.data._totalDuration && "isFromStart" !== this.data.data) {
                var e, i, n, r, s, a = this.t.style, o = l.transform.parse;
                if ("all" === this.e)
                    a.cssText = "",
                    r = !0;
                else
                    for (e = this.e.split(" ").join("").split(","),
                    n = e.length; --n > -1; )
                        i = e[n],
                        l[i] && (l[i].parse === o ? r = !0 : i = "transformOrigin" === i ? Rt : l[i].p),
                        Zt(a, i);
                r && (Zt(a, kt),
                s = this.t._gsTransform,
                s && (s.svg && (this.t.removeAttribute("data-svg-origin"),
                this.t.removeAttribute("transform")),
                delete this.t._gsTransform))
            }
        }
        ;
        for (wt("clearProps", {
            parser: function(t, e, n, r, s) {
                return s = new vt(t,n,0,0,s,2),
                s.setRatio = Vt,
                s.e = e,
                s.pr = -10,
                s.data = r._tween,
                i = !0,
                s
            }
        }),
        h = "bezier,throwProps,physicsProps,physics2D".split(","),
        Tt = h.length; Tt--; )
            Pt(h[Tt]);
        h = a.prototype,
        h._firstPT = h._lastParsedTransform = h._transform = null ,
        h._onInitTween = function(t, e, o, h) {
            if (!t.nodeType)
                return !1;
            this._target = m = t,
            this._tween = o,
            this._vars = e,
            g = h,
            u = e.autoRound,
            i = !1,
            n = e.suffixMap || a.suffixMap,
            r = Q(t, ""),
            s = this._overwriteProps;
            var p, d, v, y, x, T, b, w, O, S = t.style;
            if (c && "" === S.zIndex && (p = J(t, "zIndex", r),
            ("auto" === p || "" === p) && this._addLazySet(S, "zIndex", 0)),
            "string" == typeof e && (y = S.cssText,
            p = et(t, r),
            S.cssText = y + ";" + e,
            p = it(t, p, et(t)).difs,
            !Z && P.test(e) && (p.opacity = parseFloat(RegExp.$1)),
            e = p,
            S.cssText = y),
            e.className ? this._firstPT = d = l.className.parse(t, e.className, "className", this, null , null , e) : this._firstPT = d = this.parse(t, e, null ),
            this._transformType) {
                for (O = 3 === this._transformType,
                kt ? f && (c = !0,
                "" === S.zIndex && (b = J(t, "zIndex", r),
                ("auto" === b || "" === b) && this._addLazySet(S, "zIndex", 0)),
                _ && this._addLazySet(S, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (O ? "visible" : "hidden"))) : S.zoom = 1,
                v = d; v && v._next; )
                    v = v._next;
                w = new vt(t,"transform",0,0,null ,2),
                this._linkCSSP(w, null , v),
                w.setRatio = kt ? Ut : Bt,
                w.data = this._transform || Yt(t, r, !0),
                w.tween = o,
                w.pr = -1,
                s.pop()
            }
            if (i) {
                for (; d; ) {
                    for (T = d._next,
                    v = y; v && v.pr > d.pr; )
                        v = v._next;
                    (d._prev = v ? v._prev : x) ? d._prev._next = d : y = d,
                    (d._next = v) ? v._prev = d : x = d,
                    d = T
                }
                this._firstPT = y
            }
            return !0
        }
        ,
        h.parse = function(t, e, i, s) {
            var a, o, h, c, f, p, _, d, v, y, x = t.style;
            for (a in e)
                p = e[a],
                "function" == typeof p && (p = p(g, m)),
                o = l[a],
                o ? i = o.parse(t, p, a, this, i, s, e) : (f = J(t, a, r) + "",
                v = "string" == typeof p,
                "color" === a || "fill" === a || "stroke" === a || -1 !== a.indexOf("Color") || v && S.test(p) ? (v || (p = ft(p),
                p = (p.length > 3 ? "rgba(" : "rgb(") + p.join(",") + ")"),
                i = xt(x, a, f, p, !0, "transparent", i, 0, s)) : v && I.test(p) ? i = xt(x, a, f, p, !0, null , i, 0, s) : (h = parseFloat(f),
                _ = h || 0 === h ? f.substr((h + "").length) : "",
                ("" === f || "auto" === f) && ("width" === a || "height" === a ? (h = st(t, a, r),
                _ = "px") : "left" === a || "top" === a ? (h = tt(t, a, r),
                _ = "px") : (h = "opacity" !== a ? 0 : 1,
                _ = "")),
                y = v && "=" === p.charAt(1),
                y ? (c = parseInt(p.charAt(0) + "1", 10),
                p = p.substr(2),
                c *= parseFloat(p),
                d = p.replace(b, "")) : (c = parseFloat(p),
                d = v ? p.replace(b, "") : ""),
                "" === d && (d = a in n ? n[a] : _),
                p = c || 0 === c ? (y ? c + h : c) + d : e[a],
                _ !== d && "" !== d && (c || 0 === c) && h && (h = K(t, a, h, _),
                "%" === d ? (h /= K(t, a, 100, "%") / 100,
                e.strictUnits !== !0 && (f = h + "%")) : "em" === d || "rem" === d || "vw" === d || "vh" === d ? h /= K(t, a, 1, d) : "px" !== d && (c = K(t, a, c, d),
                d = "px"),
                y && (c || 0 === c) && (p = c + h + d)),
                y && (c += h),
                !h && 0 !== h || !c && 0 !== c ? void 0 !== x[a] && (p || p + "" != "NaN" && null != p) ? (i = new vt(x,a,c || h || 0,0,i,(-1),a,(!1),0,f,p),
                i.xs0 = "none" !== p || "display" !== a && -1 === a.indexOf("Style") ? p : f) : V("invalid " + a + " tween value: " + e[a]) : (i = new vt(x,a,h,c - h,i,0,a,u !== !1 && ("px" === d || "zIndex" === a),0,f,p),
                i.xs0 = d))),
                s && i && !i.plugin && (i.plugin = s);
            return i
        }
        ,
        h.setRatio = function(t) {
            var e, i, n, r = this._firstPT, s = 1e-6;
            if (1 !== t || this._tween._time !== this._tween._duration && 0 !== this._tween._time)
                if (t || this._tween._time !== this._tween._duration && 0 !== this._tween._time || this._tween._rawPrevTime === -1e-6)
                    for (; r; ) {
                        if (e = r.c * t + r.s,
                        r.r ? e = Math.round(e) : s > e && e > -s && (e = 0),
                        r.type)
                            if (1 === r.type)
                                if (n = r.l,
                                2 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2;
                                else if (3 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3;
                                else if (4 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4;
                                else if (5 === n)
                                    r.t[r.p] = r.xs0 + e + r.xs1 + r.xn1 + r.xs2 + r.xn2 + r.xs3 + r.xn3 + r.xs4 + r.xn4 + r.xs5;
                                else {
                                    for (i = r.xs0 + e + r.xs1,
                                    n = 1; n < r.l; n++)
                                        i += r["xn" + n] + r["xs" + (n + 1)];
                                    r.t[r.p] = i
                                }
                            else
                                -1 === r.type ? r.t[r.p] = r.xs0 : r.setRatio && r.setRatio(t);
                        else
                            r.t[r.p] = e + r.xs0;
                        r = r._next
                    }
                else
                    for (; r; )
                        2 !== r.type ? r.t[r.p] = r.b : r.setRatio(t),
                        r = r._next;
            else
                for (; r; ) {
                    if (2 !== r.type)
                        if (r.r && -1 !== r.type)
                            if (e = Math.round(r.s + r.c),
                            r.type) {
                                if (1 === r.type) {
                                    for (n = r.l,
                                    i = r.xs0 + e + r.xs1,
                                    n = 1; n < r.l; n++)
                                        i += r["xn" + n] + r["xs" + (n + 1)];
                                    r.t[r.p] = i
                                }
                            } else
                                r.t[r.p] = e + r.xs0;
                        else
                            r.t[r.p] = r.e;
                    else
                        r.setRatio(t);
                    r = r._next
                }
        }
        ,
        h._enableTransforms = function(t) {
            this._transform = this._transform || Yt(this._target, r, !0),
            this._transformType = this._transform.svg && Ot || !t && 3 !== this._transformType ? 2 : 3
        }
        ;
        var Wt = function(t) {
            this.t[this.p] = this.e,
            this.data._linkCSSP(this, this._next, null , !0)
        }
        ;
        h._addLazySet = function(t, e, i) {
            var n = this._firstPT = new vt(t,e,0,0,this._firstPT,2);
            n.e = i,
            n.setRatio = Wt,
            n.data = this
        }
        ,
        h._linkCSSP = function(t, e, i, n) {
            return t && (e && (e._prev = t),
            t._next && (t._next._prev = t._prev),
            t._prev ? t._prev._next = t._next : this._firstPT === t && (this._firstPT = t._next,
            n = !0),
            i ? i._next = t : n || null !== this._firstPT || (this._firstPT = t),
            t._next = e,
            t._prev = i),
            t
        }
        ,
        h._mod = function(t) {
            for (var e = this._firstPT; e; )
                "function" == typeof t[e.p] && t[e.p] === Math.round && (e.r = 1),
                e = e._next
        }
        ,
        h._kill = function(e) {
            var i, n, r, s = e;
            if (e.autoAlpha || e.alpha) {
                s = {};
                for (n in e)
                    s[n] = e[n];
                s.opacity = 1,
                s.autoAlpha && (s.visibility = 1)
            }
            for (e.className && (i = this._classNamePT) && (r = i.xfirst,
            r && r._prev ? this._linkCSSP(r._prev, i._next, r._prev._prev) : r === this._firstPT && (this._firstPT = i._next),
            i._next && this._linkCSSP(i._next, i._next._next, r._prev),
            this._classNamePT = null ),
            i = this._firstPT; i; )
                i.plugin && i.plugin !== n && i.plugin._kill && (i.plugin._kill(e),
                n = i.plugin),
                i = i._next;
            return t.prototype._kill.call(this, s)
        }
        ;
        var Ht = function(t, e, i) {
            var n, r, s, a;
            if (t.slice)
                for (r = t.length; --r > -1; )
                    Ht(t[r], e, i);
            else
                for (n = t.childNodes,
                r = n.length; --r > -1; )
                    s = n[r],
                    a = s.type,
                    s.style && (e.push(et(s)),
                    i && i.push(s)),
                    1 !== a && 9 !== a && 11 !== a || !s.childNodes.length || Ht(s, e, i)
        }
        ;
        return a.cascadeTo = function(t, i, n) {
            var r, s, a, o, l = e.to(t, i, n), h = [l], u = [], c = [], f = [], p = e._internals.reservedProps;
            for (t = l._targets || l.target,
            Ht(t, u, f),
            l.render(i, !0, !0),
            Ht(t, c),
            l.render(0, !0, !0),
            l._enabled(!0),
            r = f.length; --r > -1; )
                if (s = it(f[r], u[r], c[r]),
                s.firstMPT) {
                    s = s.difs;
                    for (a in n)
                        p[a] && (s[a] = n[a]);
                    o = {};
                    for (a in s)
                        o[a] = u[r][a];
                    h.push(e.fromTo(f[r], i, o, s))
                }
            return h
        }
        ,
        t.activate([a]),
        a
    }, !0),
    function() {
        var t = _gsScope._gsDefine.plugin({
            propName: "roundProps",
            version: "1.6.0",
            priority: -1,
            API: 2,
            init: function(t, e, i) {
                return this._tween = i,
                !0
            }
        })
          , e = function(t) {
            for (; t; )
                t.f || t.blob || (t.m = Math.round),
                t = t._next
        }
          , i = t.prototype;
        i._onInitAllProps = function() {
            for (var t, i, n, r = this._tween, s = r.vars.roundProps.join ? r.vars.roundProps : r.vars.roundProps.split(","), a = s.length, o = {}, l = r._propLookup.roundProps; --a > -1; )
                o[s[a]] = Math.round;
            for (a = s.length; --a > -1; )
                for (t = s[a],
                i = r._firstPT; i; )
                    n = i._next,
                    i.pg ? i.t._mod(o) : i.n === t && (2 === i.f && i.t ? e(i.t._firstPT) : (this._add(i.t, t, i.s, i.c),
                    n && (n._prev = i._prev),
                    i._prev ? i._prev._next = n : r._firstPT === i && (r._firstPT = n),
                    i._next = i._prev = null ,
                    r._propLookup[t] = l)),
                    i = n;
            return !1
        }
        ,
        i._add = function(t, e, i, n) {
            this._addTween(t, e, i, i + n, e, Math.round),
            this._overwriteProps.push(e)
        }
    }(),
    function() {
        _gsScope._gsDefine.plugin({
            propName: "attr",
            API: 2,
            version: "0.6.0",
            init: function(t, e, i, n) {
                var r, s;
                if ("function" != typeof t.setAttribute)
                    return !1;
                for (r in e)
                    s = e[r],
                    "function" == typeof s && (s = s(n, t)),
                    this._addTween(t, "setAttribute", t.getAttribute(r) + "", s + "", r, !1, r),
                    this._overwriteProps.push(r);
                return !0
            }
        })
    }(),
    _gsScope._gsDefine.plugin({
        propName: "directionalRotation",
        version: "0.3.0",
        API: 2,
        init: function(t, e, i, n) {
            "object" != typeof e && (e = {
                rotation: e
            }),
            this.finals = {};
            var r, s, a, o, l, h, u = e.useRadians === !0 ? 2 * Math.PI : 360, c = 1e-6;
            for (r in e)
                "useRadians" !== r && (o = e[r],
                "function" == typeof o && (o = o(n, t)),
                h = (o + "").split("_"),
                s = h[0],
                a = parseFloat("function" != typeof t[r] ? t[r] : t[r.indexOf("set") || "function" != typeof t["get" + r.substr(3)] ? r : "get" + r.substr(3)]()),
                o = this.finals[r] = "string" == typeof s && "=" === s.charAt(1) ? a + parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2)) : Number(s) || 0,
                l = o - a,
                h.length && (s = h.join("_"),
                -1 !== s.indexOf("short") && (l %= u,
                l !== l % (u / 2) && (l = 0 > l ? l + u : l - u)),
                -1 !== s.indexOf("_cw") && 0 > l ? l = (l + 9999999999 * u) % u - (l / u | 0) * u : -1 !== s.indexOf("ccw") && l > 0 && (l = (l - 9999999999 * u) % u - (l / u | 0) * u)),
                (l > c || -c > l) && (this._addTween(t, r, a, a + l, r),
                this._overwriteProps.push(r)));
            return !0
        },
        set: function(t) {
            var e;
            if (1 !== t)
                this._super.setRatio.call(this, t);
            else
                for (e = this._firstPT; e; )
                    e.f ? e.t[e.p](this.finals[e.p]) : e.t[e.p] = this.finals[e.p],
                    e = e._next
        }
    })._autoCSS = !0,
    _gsScope._gsDefine("easing.Back", ["easing.Ease"], function(t) {
        var e, i, n, r = _gsScope.GreenSockGlobals || _gsScope, s = r.com.greensock, a = 2 * Math.PI, o = Math.PI / 2, l = s._class, h = function(e, i) {
            var n = l("easing." + e, function() {}, !0)
              , r = n.prototype = new t;
            return r.constructor = n,
            r.getRatio = i,
            n
        }
        , u = t.register || function() {}
        , c = function(t, e, i, n, r) {
            var s = l("easing." + t, {
                easeOut: new e,
                easeIn: new i,
                easeInOut: new n
            }, !0);
            return u(s, t),
            s
        }
        , f = function(t, e, i) {
            this.t = t,
            this.v = e,
            i && (this.next = i,
            i.prev = this,
            this.c = i.v - e,
            this.gap = i.t - t)
        }
        , p = function(e, i) {
            var n = l("easing." + e, function(t) {
                this._p1 = t || 0 === t ? t : 1.70158,
                this._p2 = 1.525 * this._p1
            }, !0)
              , r = n.prototype = new t;
            return r.constructor = n,
            r.getRatio = i,
            r.config = function(t) {
                return new n(t)
            }
            ,
            n
        }
        , _ = c("Back", p("BackOut", function(t) {
            return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1
        }), p("BackIn", function(t) {
            return t * t * ((this._p1 + 1) * t - this._p1)
        }), p("BackInOut", function(t) {
            return (t *= 2) < 1 ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2)
        })), d = l("easing.SlowMo", function(t, e, i) {
            e = e || 0 === e ? e : .7,
            null == t ? t = .7 : t > 1 && (t = 1),
            this._p = 1 !== t ? e : 0,
            this._p1 = (1 - t) / 2,
            this._p2 = t,
            this._p3 = this._p1 + this._p2,
            this._calcEnd = i === !0
        }, !0), m = d.prototype = new t;
        return m.constructor = d,
        m.getRatio = function(t) {
            var e = t + (.5 - t) * this._p;
            return t < this._p1 ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e
        }
        ,
        d.ease = new d(.7,.7),
        m.config = d.config = function(t, e, i) {
            return new d(t,e,i)
        }
        ,
        e = l("easing.SteppedEase", function(t) {
            t = t || 1,
            this._p1 = 1 / t,
            this._p2 = t + 1
        }, !0),
        m = e.prototype = new t,
        m.constructor = e,
        m.getRatio = function(t) {
            return 0 > t ? t = 0 : t >= 1 && (t = .999999999),
            (this._p2 * t >> 0) * this._p1
        }
        ,
        m.config = e.config = function(t) {
            return new e(t)
        }
        ,
        i = l("easing.RoughEase", function(e) {
            e = e || {};
            for (var i, n, r, s, a, o, l = e.taper || "none", h = [], u = 0, c = 0 | (e.points || 20), p = c, _ = e.randomize !== !1, d = e.clamp === !0, m = e.template instanceof t ? e.template : null , g = "number" == typeof e.strength ? .4 * e.strength : .4; --p > -1; )
                i = _ ? Math.random() : 1 / c * p,
                n = m ? m.getRatio(i) : i,
                "none" === l ? r = g : "out" === l ? (s = 1 - i,
                r = s * s * g) : "in" === l ? r = i * i * g : .5 > i ? (s = 2 * i,
                r = s * s * .5 * g) : (s = 2 * (1 - i),
                r = s * s * .5 * g),
                _ ? n += Math.random() * r - .5 * r : p % 2 ? n += .5 * r : n -= .5 * r,
                d && (n > 1 ? n = 1 : 0 > n && (n = 0)),
                h[u++] = {
                    x: i,
                    y: n
                };
            for (h.sort(function(t, e) {
                return t.x - e.x
            }),
            o = new f(1,1,null ),
            p = c; --p > -1; )
                a = h[p],
                o = new f(a.x,a.y,o);
            this._prev = new f(0,0,0 !== o.t ? o : o.next)
        }, !0),
        m = i.prototype = new t,
        m.constructor = i,
        m.getRatio = function(t) {
            var e = this._prev;
            if (t > e.t) {
                for (; e.next && t >= e.t; )
                    e = e.next;
                e = e.prev
            } else
                for (; e.prev && t <= e.t; )
                    e = e.prev;
            return this._prev = e,
            e.v + (t - e.t) / e.gap * e.c
        }
        ,
        m.config = function(t) {
            return new i(t)
        }
        ,
        i.ease = new i,
        c("Bounce", h("BounceOut", function(t) {
            return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
        }), h("BounceIn", function(t) {
            return (t = 1 - t) < 1 / 2.75 ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375)
        }), h("BounceInOut", function(t) {
            var e = .5 > t;
            return t = e ? 1 - 2 * t : 2 * t - 1,
            t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375,
            e ? .5 * (1 - t) : .5 * t + .5
        })),
        c("Circ", h("CircOut", function(t) {
            return Math.sqrt(1 - (t -= 1) * t)
        }), h("CircIn", function(t) {
            return -(Math.sqrt(1 - t * t) - 1)
        }), h("CircInOut", function(t) {
            return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
        })),
        n = function(e, i, n) {
            var r = l("easing." + e, function(t, e) {
                this._p1 = t >= 1 ? t : 1,
                this._p2 = (e || n) / (1 > t ? t : 1),
                this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0),
                this._p2 = a / this._p2
            }, !0)
              , s = r.prototype = new t;
            return s.constructor = r,
            s.getRatio = i,
            s.config = function(t, e) {
                return new r(t,e)
            }
            ,
            r
        }
        ,
        c("Elastic", n("ElasticOut", function(t) {
            return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * this._p2) + 1
        }, .3), n("ElasticIn", function(t) {
            return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2))
        }, .3), n("ElasticInOut", function(t) {
            return (t *= 2) < 1 ? -.5 * (this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * this._p2) * .5 + 1
        }, .45)),
        c("Expo", h("ExpoOut", function(t) {
            return 1 - Math.pow(2, -10 * t)
        }), h("ExpoIn", function(t) {
            return Math.pow(2, 10 * (t - 1)) - .001
        }), h("ExpoInOut", function(t) {
            return (t *= 2) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)))
        })),
        c("Sine", h("SineOut", function(t) {
            return Math.sin(t * o)
        }), h("SineIn", function(t) {
            return -Math.cos(t * o) + 1
        }), h("SineInOut", function(t) {
            return -.5 * (Math.cos(Math.PI * t) - 1)
        })),
        l("easing.EaseLookup", {
            find: function(e) {
                return t.map[e]
            }
        }, !0),
        u(r.SlowMo, "SlowMo", "ease,"),
        u(i, "RoughEase", "ease,"),
        u(e, "SteppedEase", "ease,"),
        _
    }, !0)
}),
_gsScope._gsDefine && _gsScope._gsQueue.pop()(),
function(t, e) {
    "use strict";
    var i = {}
      , n = t.GreenSockGlobals = t.GreenSockGlobals || t;
    if (!n.TweenLite) {
        var r, s, a, o, l, h = function(t) {
            var e, i = t.split("."), r = n;
            for (e = 0; e < i.length; e++)
                r[i[e]] = r = r[i[e]] || {};
            return r
        }
        , u = h("com.greensock"), c = 1e-10, f = function(t) {
            var e, i = [], n = t.length;
            for (e = 0; e !== n; i.push(t[e++]))
                ;
            return i
        }
        , p = function() {}
        , _ = function() {
            var t = Object.prototype.toString
              , e = t.call([]);
            return function(i) {
                return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e)
            }
        }(), d = {}, m = function(r, s, a, o) {
            this.sc = d[r] ? d[r].sc : [],
            d[r] = this,
            this.gsClass = null ,
            this.func = a;
            var l = [];
            this.check = function(u) {
                for (var c, f, p, _, g, v = s.length, y = v; --v > -1; )
                    (c = d[s[v]] || new m(s[v],[])).gsClass ? (l[v] = c.gsClass,
                    y--) : u && c.sc.push(this);
                if (0 === y && a) {
                    if (f = ("com.greensock." + r).split("."),
                    p = f.pop(),
                    _ = h(f.join("."))[p] = this.gsClass = a.apply(a, l),
                    o)
                        if (n[p] = i[p] = _,
                        g = "undefined" != typeof module && module.exports,
                        !g && "function" == typeof define && define.amd)
                            define((t.GreenSockAMDPath ? t.GreenSockAMDPath + "/" : "") + r.split(".").pop(), [], function() {
                                return _
                            });
                        else if (g)
                            if (r === e) {
                                module.exports = i[e] = _;
                                for (v in i)
                                    _[v] = i[v]
                            } else
                                i[e] && (i[e][p] = _);
                    for (v = 0; v < this.sc.length; v++)
                        this.sc[v].check()
                }
            }
            ,
            this.check(!0)
        }
        , g = t._gsDefine = function(t, e, i, n) {
            return new m(t,e,i,n)
        }
        , v = u._class = function(t, e, i) {
            return e = e || function() {}
            ,
            g(t, [], function() {
                return e
            }, i),
            e
        }
        ;
        g.globals = n;
        var y = [0, 0, 1, 1]
          , x = v("easing.Ease", function(t, e, i, n) {
            this._func = t,
            this._type = i || 0,
            this._power = n || 0,
            this._params = e ? y.concat(e) : y
        }, !0)
          , T = x.map = {}
          , b = x.register = function(t, e, i, n) {
            for (var r, s, a, o, l = e.split(","), h = l.length, c = (i || "easeIn,easeOut,easeInOut").split(","); --h > -1; )
                for (s = l[h],
                r = n ? v("easing." + s, null , !0) : u.easing[s] || {},
                a = c.length; --a > -1; )
                    o = c[a],
                    T[s + "." + o] = T[o + s] = r[o] = t.getRatio ? t : t[o] || new t
        }
        ;
        for (a = x.prototype,
        a._calcEnd = !1,
        a.getRatio = function(t) {
            if (this._func)
                return this._params[0] = t,
                this._func.apply(null , this._params);
            var e = this._type
              , i = this._power
              , n = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);
            return 1 === i ? n *= n : 2 === i ? n *= n * n : 3 === i ? n *= n * n * n : 4 === i && (n *= n * n * n * n),
            1 === e ? 1 - n : 2 === e ? n : .5 > t ? n / 2 : 1 - n / 2
        }
        ,
        r = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"],
        s = r.length; --s > -1; )
            a = r[s] + ",Power" + s,
            b(new x(null ,null ,1,s), a, "easeOut", !0),
            b(new x(null ,null ,2,s), a, "easeIn" + (0 === s ? ",easeNone" : "")),
            b(new x(null ,null ,3,s), a, "easeInOut");
        T.linear = u.easing.Linear.easeIn,
        T.swing = u.easing.Quad.easeInOut;
        var w = v("events.EventDispatcher", function(t) {
            this._listeners = {},
            this._eventTarget = t || this
        });
        a = w.prototype,
        a.addEventListener = function(t, e, i, n, r) {
            r = r || 0;
            var s, a, h = this._listeners[t], u = 0;
            for (this !== o || l || o.wake(),
            null == h && (this._listeners[t] = h = []),
            a = h.length; --a > -1; )
                s = h[a],
                s.c === e && s.s === i ? h.splice(a, 1) : 0 === u && s.pr < r && (u = a + 1);
            h.splice(u, 0, {
                c: e,
                s: i,
                up: n,
                pr: r
            })
        }
        ,
        a.removeEventListener = function(t, e) {
            var i, n = this._listeners[t];
            if (n)
                for (i = n.length; --i > -1; )
                    if (n[i].c === e)
                        return void n.splice(i, 1)
        }
        ,
        a.dispatchEvent = function(t) {
            var e, i, n, r = this._listeners[t];
            if (r)
                for (e = r.length,
                e > 1 && (r = r.slice(0)),
                i = this._eventTarget; --e > -1; )
                    n = r[e],
                    n && (n.up ? n.c.call(n.s || i, {
                        type: t,
                        target: i
                    }) : n.c.call(n.s || i))
        }
        ;
        var P = t.requestAnimationFrame
          , O = t.cancelAnimationFrame
          , S = Date.now || function() {
            return (new Date).getTime()
        }
          , k = S();
        for (r = ["ms", "moz", "webkit", "o"],
        s = r.length; --s > -1 && !P; )
            P = t[r[s] + "RequestAnimationFrame"],
            O = t[r[s] + "CancelAnimationFrame"] || t[r[s] + "CancelRequestAnimationFrame"];
        v("Ticker", function(t, e) {
            var i, n, r, s, a, h = this, u = S(), f = !(e === !1 || !P) && "auto", _ = 500, d = 33, m = "tick", g = function(t) {
                var e, o, l = S() - k;
                l > _ && (u += l - d),
                k += l,
                h.time = (k - u) / 1e3,
                e = h.time - a,
                (!i || e > 0 || t === !0) && (h.frame++,
                a += e + (e >= s ? .004 : s - e),
                o = !0),
                t !== !0 && (r = n(g)),
                o && h.dispatchEvent(m)
            }
            ;
            w.call(h),
            h.time = h.frame = 0,
            h.tick = function() {
                g(!0)
            }
            ,
            h.lagSmoothing = function(t, e) {
                _ = t || 1 / c,
                d = Math.min(e, _, 0)
            }
            ,
            h.sleep = function() {
                null != r && (f && O ? O(r) : clearTimeout(r),
                n = p,
                r = null ,
                h === o && (l = !1))
            }
            ,
            h.wake = function(t) {
                null !== r ? h.sleep() : t ? u += -k + (k = S()) : h.frame > 10 && (k = S() - _ + 5),
                n = 0 === i ? p : f && P ? P : function(t) {
                    return setTimeout(t, 1e3 * (a - h.time) + 1 | 0)
                }
                ,
                h === o && (l = !0),
                g(2)
            }
            ,
            h.fps = function(t) {
                return arguments.length ? (i = t,
                s = 1 / (i || 60),
                a = this.time + s,
                void h.wake()) : i
            }
            ,
            h.useRAF = function(t) {
                return arguments.length ? (h.sleep(),
                f = t,
                void h.fps(i)) : f
            }
            ,
            h.fps(t),
            setTimeout(function() {
                "auto" === f && h.frame < 5 && "hidden" !== document.visibilityState && h.useRAF(!1)
            }, 1500)
        }),
        a = u.Ticker.prototype = new u.events.EventDispatcher,
        a.constructor = u.Ticker;
        var C = v("core.Animation", function(t, e) {
            if (this.vars = e = e || {},
            this._duration = this._totalDuration = t || 0,
            this._delay = Number(e.delay) || 0,
            this._timeScale = 1,
            this._active = e.immediateRender === !0,
            this.data = e.data,
            this._reversed = e.reversed === !0,
            V) {
                l || o.wake();
                var i = this.vars.useFrames ? q : V;
                i.add(this, i._time),
                this.vars.paused && this.paused(!0)
            }
        });
        o = C.ticker = new u.Ticker,
        a = C.prototype,
        a._dirty = a._gc = a._initted = a._paused = !1,
        a._totalTime = a._time = 0,
        a._rawPrevTime = -1,
        a._next = a._last = a._onUpdate = a._timeline = a.timeline = null ,
        a._paused = !1;
        var R = function() {
            l && S() - k > 2e3 && o.wake(),
            setTimeout(R, 2e3)
        }
        ;
        R(),
        a.play = function(t, e) {
            return null != t && this.seek(t, e),
            this.reversed(!1).paused(!1)
        }
        ,
        a.pause = function(t, e) {
            return null != t && this.seek(t, e),
            this.paused(!0)
        }
        ,
        a.resume = function(t, e) {
            return null != t && this.seek(t, e),
            this.paused(!1)
        }
        ,
        a.seek = function(t, e) {
            return this.totalTime(Number(t), e !== !1)
        }
        ,
        a.restart = function(t, e) {
            return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0)
        }
        ,
        a.reverse = function(t, e) {
            return null != t && this.seek(t || this.totalDuration(), e),
            this.reversed(!0).paused(!1)
        }
        ,
        a.render = function(t, e, i) {}
        ,
        a.invalidate = function() {
            return this._time = this._totalTime = 0,
            this._initted = this._gc = !1,
            this._rawPrevTime = -1,
            (this._gc || !this.timeline) && this._enabled(!0),
            this
        }
        ,
        a.isActive = function() {
            var t, e = this._timeline, i = this._startTime;
            return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && t < i + this.totalDuration() / this._timeScale
        }
        ,
        a._enabled = function(t, e) {
            return l || o.wake(),
            this._gc = !t,
            this._active = this.isActive(),
            e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)),
            !1
        }
        ,
        a._kill = function(t, e) {
            return this._enabled(!1, !1)
        }
        ,
        a.kill = function(t, e) {
            return this._kill(t, e),
            this
        }
        ,
        a._uncache = function(t) {
            for (var e = t ? this : this.timeline; e; )
                e._dirty = !0,
                e = e.timeline;
            return this
        }
        ,
        a._swapSelfInParams = function(t) {
            for (var e = t.length, i = t.concat(); --e > -1; )
                "{self}" === t[e] && (i[e] = this);
            return i
        }
        ,
        a._callback = function(t) {
            var e = this.vars
              , i = e[t]
              , n = e[t + "Params"]
              , r = e[t + "Scope"] || e.callbackScope || this
              , s = n ? n.length : 0;
            switch (s) {
            case 0:
                i.call(r);
                break;
            case 1:
                i.call(r, n[0]);
                break;
            case 2:
                i.call(r, n[0], n[1]);
                break;
            default:
                i.apply(r, n)
            }
        }
        ,
        a.eventCallback = function(t, e, i, n) {
            if ("on" === (t || "").substr(0, 2)) {
                var r = this.vars;
                if (1 === arguments.length)
                    return r[t];
                null == e ? delete r[t] : (r[t] = e,
                r[t + "Params"] = _(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i,
                r[t + "Scope"] = n),
                "onUpdate" === t && (this._onUpdate = e)
            }
            return this
        }
        ,
        a.delay = function(t) {
            return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay),
            this._delay = t,
            this) : this._delay
        }
        ,
        a.duration = function(t) {
            return arguments.length ? (this._duration = this._totalDuration = t,
            this._uncache(!0),
            this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0),
            this) : (this._dirty = !1,
            this._duration)
        }
        ,
        a.totalDuration = function(t) {
            return this._dirty = !1,
            arguments.length ? this.duration(t) : this._totalDuration
        }
        ,
        a.time = function(t, e) {
            return arguments.length ? (this._dirty && this.totalDuration(),
            this.totalTime(t > this._duration ? this._duration : t, e)) : this._time
        }
        ,
        a.totalTime = function(t, e, i) {
            if (l || o.wake(),
            !arguments.length)
                return this._totalTime;
            if (this._timeline) {
                if (0 > t && !i && (t += this.totalDuration()),
                this._timeline.smoothChildTiming) {
                    this._dirty && this.totalDuration();
                    var n = this._totalDuration
                      , r = this._timeline;
                    if (t > n && !i && (t = n),
                    this._startTime = (this._paused ? this._pauseTime : r._time) - (this._reversed ? n - t : t) / this._timeScale,
                    r._dirty || this._uncache(!1),
                    r._timeline)
                        for (; r._timeline; )
                            r._timeline._time !== (r._startTime + r._totalTime) / r._timeScale && r.totalTime(r._totalTime, !0),
                            r = r._timeline
                }
                this._gc && this._enabled(!0, !1),
                (this._totalTime !== t || 0 === this._duration) && (z.length && H(),
                this.render(t, e, !1),
                z.length && H())
            }
            return this
        }
        ,
        a.progress = a.totalProgress = function(t, e) {
            var i = this.duration();
            return arguments.length ? this.totalTime(i * t, e) : i ? this._time / i : this.ratio
        }
        ,
        a.startTime = function(t) {
            return arguments.length ? (t !== this._startTime && (this._startTime = t,
            this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)),
            this) : this._startTime
        }
        ,
        a.endTime = function(t) {
            return this._startTime + (0 != t ? this.totalDuration() : this.duration()) / this._timeScale
        }
        ,
        a.timeScale = function(t) {
            if (!arguments.length)
                return this._timeScale;
            if (t = t || c,
            this._timeline && this._timeline.smoothChildTiming) {
                var e = this._pauseTime
                  , i = e || 0 === e ? e : this._timeline.totalTime();
                this._startTime = i - (i - this._startTime) * this._timeScale / t
            }
            return this._timeScale = t,
            this._uncache(!1)
        }
        ,
        a.reversed = function(t) {
            return arguments.length ? (t != this._reversed && (this._reversed = t,
            this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)),
            this) : this._reversed
        }
        ,
        a.paused = function(t) {
            if (!arguments.length)
                return this._paused;
            var e, i, n = this._timeline;
            return t != this._paused && n && (l || t || o.wake(),
            e = n.rawTime(),
            i = e - this._pauseTime,
            !t && n.smoothChildTiming && (this._startTime += i,
            this._uncache(!1)),
            this._pauseTime = t ? e : null ,
            this._paused = t,
            this._active = this.isActive(),
            !t && 0 !== i && this._initted && this.duration() && (e = n.smoothChildTiming ? this._totalTime : (e - this._startTime) / this._timeScale,
            this.render(e, e === this._totalTime, !0))),
            this._gc && !t && this._enabled(!0, !1),
            this
        }
        ;
        var M = v("core.SimpleTimeline", function(t) {
            C.call(this, 0, t),
            this.autoRemoveChildren = this.smoothChildTiming = !0
        });
        a = M.prototype = new C,
        a.constructor = M,
        a.kill()._gc = !1,
        a._first = a._last = a._recent = null ,
        a._sortChildren = !1,
        a.add = a.insert = function(t, e, i, n) {
            var r, s;
            if (t._startTime = Number(e || 0) + t._delay,
            t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale),
            t.timeline && t.timeline._remove(t, !0),
            t.timeline = t._timeline = this,
            t._gc && t._enabled(!0, !0),
            r = this._last,
            this._sortChildren)
                for (s = t._startTime; r && r._startTime > s; )
                    r = r._prev;
            return r ? (t._next = r._next,
            r._next = t) : (t._next = this._first,
            this._first = t),
            t._next ? t._next._prev = t : this._last = t,
            t._prev = r,
            this._recent = t,
            this._timeline && this._uncache(!0),
            this
        }
        ,
        a._remove = function(t, e) {
            return t.timeline === this && (e || t._enabled(!1, !0),
            t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next),
            t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev),
            t._next = t._prev = t.timeline = null ,
            t === this._recent && (this._recent = this._last),
            this._timeline && this._uncache(!0)),
            this
        }
        ,
        a.render = function(t, e, i) {
            var n, r = this._first;
            for (this._totalTime = this._time = this._rawPrevTime = t; r; )
                n = r._next,
                (r._active || t >= r._startTime && !r._paused) && (r._reversed ? r.render((r._dirty ? r.totalDuration() : r._totalDuration) - (t - r._startTime) * r._timeScale, e, i) : r.render((t - r._startTime) * r._timeScale, e, i)),
                r = n
        }
        ,
        a.rawTime = function() {
            return l || o.wake(),
            this._totalTime
        }
        ;
        var A = v("TweenLite", function(e, i, n) {
            if (C.call(this, i, n),
            this.render = A.prototype.render,
            null == e)
                throw "Cannot tween a null target.";
            this.target = e = "string" != typeof e ? e : A.selector(e) || e;
            var r, s, a, o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType), l = this.vars.overwrite;
            if (this._overwrite = l = null == l ? Z[A.defaultOverwrite] : "number" == typeof l ? l >> 0 : Z[l],
            (o || e instanceof Array || e.push && _(e)) && "number" != typeof e[0])
                for (this._targets = a = f(e),
                this._propLookup = [],
                this._siblings = [],
                r = 0; r < a.length; r++)
                    s = a[r],
                    s ? "string" != typeof s ? s.length && s !== t && s[0] && (s[0] === t || s[0].nodeType && s[0].style && !s.nodeType) ? (a.splice(r--, 1),
                    this._targets = a = a.concat(f(s))) : (this._siblings[r] = G(s, this, !1),
                    1 === l && this._siblings[r].length > 1 && J(s, this, null , 1, this._siblings[r])) : (s = a[r--] = A.selector(s),
                    "string" == typeof s && a.splice(r + 1, 1)) : a.splice(r--, 1);
            else
                this._propLookup = {},
                this._siblings = G(e, this, !1),
                1 === l && this._siblings.length > 1 && J(e, this, null , 1, this._siblings);
            (this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -c,
            this.render(Math.min(0, -this._delay)))
        }, !0)
          , D = function(e) {
            return e && e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType)
        }
          , E = function(t, e) {
            var i, n = {};
            for (i in t)
                $[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!Y[i] || Y[i] && Y[i]._autoCSS) || (n[i] = t[i],
                delete t[i]);
            t.css = n
        }
        ;
        a = A.prototype = new C,
        a.constructor = A,
        a.kill()._gc = !1,
        a.ratio = 0,
        a._firstPT = a._targets = a._overwrittenProps = a._startAt = null ,
        a._notifyPluginsOfEnabled = a._lazy = !1,
        A.version = "1.19.0",
        A.defaultEase = a._ease = new x(null ,null ,1,1),
        A.defaultOverwrite = "auto",
        A.ticker = o,
        A.autoSleep = 120,
        A.lagSmoothing = function(t, e) {
            o.lagSmoothing(t, e)
        }
        ,
        A.selector = t.$ || t.jQuery || function(e) {
            var i = t.$ || t.jQuery;
            return i ? (A.selector = i,
            i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e)
        }
        ;
        var z = []
          , I = {}
          , N = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi
          , F = function(t) {
            for (var e, i = this._firstPT, n = 1e-6; i; )
                e = i.blob ? t ? this.join("") : this.start : i.c * t + i.s,
                i.m ? e = i.m(e, this._target || i.t) : n > e && e > -n && (e = 0),
                i.f ? i.fp ? i.t[i.p](i.fp, e) : i.t[i.p](e) : i.t[i.p] = e,
                i = i._next
        }
          , L = function(t, e, i, n) {
            var r, s, a, o, l, h, u, c = [t, e], f = 0, p = "", _ = 0;
            for (c.start = t,
            i && (i(c),
            t = c[0],
            e = c[1]),
            c.length = 0,
            r = t.match(N) || [],
            s = e.match(N) || [],
            n && (n._next = null ,
            n.blob = 1,
            c._firstPT = c._applyPT = n),
            l = s.length,
            o = 0; l > o; o++)
                u = s[o],
                h = e.substr(f, e.indexOf(u, f) - f),
                p += h || !o ? h : ",",
                f += h.length,
                _ ? _ = (_ + 1) % 5 : "rgba(" === h.substr(-5) && (_ = 1),
                u === r[o] || r.length <= o ? p += u : (p && (c.push(p),
                p = ""),
                a = parseFloat(r[o]),
                c.push(a),
                c._firstPT = {
                    _next: c._firstPT,
                    t: c,
                    p: c.length - 1,
                    s: a,
                    c: ("=" === u.charAt(1) ? parseInt(u.charAt(0) + "1", 10) * parseFloat(u.substr(2)) : parseFloat(u) - a) || 0,
                    f: 0,
                    m: _ && 4 > _ ? Math.round : 0
                }),
                f += u.length;
            return p += e.substr(f),
            p && c.push(p),
            c.setRatio = F,
            c
        }
          , X = function(t, e, i, n, r, s, a, o, l) {
            "function" == typeof n && (n = n(l || 0, t));
            var h, u, c = "get" === i ? t[e] : i, f = typeof t[e], p = "string" == typeof n && "=" === n.charAt(1), _ = {
                t: t,
                p: e,
                s: c,
                f: "function" === f,
                pg: 0,
                n: r || e,
                m: s ? "function" == typeof s ? s : Math.round : 0,
                pr: 0,
                c: p ? parseInt(n.charAt(0) + "1", 10) * parseFloat(n.substr(2)) : parseFloat(n) - c || 0
            };
            return "number" !== f && ("function" === f && "get" === i && (u = e.indexOf("set") || "function" != typeof t["get" + e.substr(3)] ? e : "get" + e.substr(3),
            _.s = c = a ? t[u](a) : t[u]()),
            "string" == typeof c && (a || isNaN(c)) ? (_.fp = a,
            h = L(c, n, o || A.defaultStringFilter, _),
            _ = {
                t: h,
                p: "setRatio",
                s: 0,
                c: 1,
                f: 2,
                pg: 0,
                n: r || e,
                pr: 0,
                m: 0
            }) : p || (_.s = parseFloat(c),
            _.c = parseFloat(n) - _.s || 0)),
            _.c ? ((_._next = this._firstPT) && (_._next._prev = _),
            this._firstPT = _,
            _) : void 0
        }
          , j = A._internals = {
            isArray: _,
            isSelector: D,
            lazyTweens: z,
            blobDif: L
        }
          , Y = A._plugins = {}
          , B = j.tweenLookup = {}
          , U = 0
          , $ = j.reservedProps = {
            ease: 1,
            delay: 1,
            overwrite: 1,
            onComplete: 1,
            onCompleteParams: 1,
            onCompleteScope: 1,
            useFrames: 1,
            runBackwards: 1,
            startAt: 1,
            onUpdate: 1,
            onUpdateParams: 1,
            onUpdateScope: 1,
            onStart: 1,
            onStartParams: 1,
            onStartScope: 1,
            onReverseComplete: 1,
            onReverseCompleteParams: 1,
            onReverseCompleteScope: 1,
            onRepeat: 1,
            onRepeatParams: 1,
            onRepeatScope: 1,
            easeParams: 1,
            yoyo: 1,
            immediateRender: 1,
            repeat: 1,
            repeatDelay: 1,
            data: 1,
            paused: 1,
            reversed: 1,
            autoCSS: 1,
            lazy: 1,
            onOverwrite: 1,
            callbackScope: 1,
            stringFilter: 1,
            id: 1
        }
          , Z = {
            none: 0,
            all: 1,
            auto: 2,
            concurrent: 3,
            allOnStart: 4,
            preexisting: 5,
            true: 1,
            false: 0
        }
          , q = C._rootFramesTimeline = new M
          , V = C._rootTimeline = new M
          , W = 30
          , H = j.lazyRender = function() {
            var t, e = z.length;
            for (I = {}; --e > -1; )
                t = z[e],
                t && t._lazy !== !1 && (t.render(t._lazy[0], t._lazy[1], !0),
                t._lazy = !1);
            z.length = 0
        }
        ;
        V._startTime = o.time,
        q._startTime = o.frame,
        V._active = q._active = !0,
        setTimeout(H, 1),
        C._updateRoot = A.render = function() {
            var t, e, i;
            if (z.length && H(),
            V.render((o.time - V._startTime) * V._timeScale, !1, !1),
            q.render((o.frame - q._startTime) * q._timeScale, !1, !1),
            z.length && H(),
            o.frame >= W) {
                W = o.frame + (parseInt(A.autoSleep, 10) || 120);
                for (i in B) {
                    for (e = B[i].tweens,
                    t = e.length; --t > -1; )
                        e[t]._gc && e.splice(t, 1);
                    0 === e.length && delete B[i]
                }
                if (i = V._first,
                (!i || i._paused) && A.autoSleep && !q._first && 1 === o._listeners.tick.length) {
                    for (; i && i._paused; )
                        i = i._next;
                    i || o.sleep()
                }
            }
        }
        ,
        o.addEventListener("tick", C._updateRoot);
        var G = function(t, e, i) {
            var n, r, s = t._gsTweenID;
            if (B[s || (t._gsTweenID = s = "t" + U++)] || (B[s] = {
                target: t,
                tweens: []
            }),
            e && (n = B[s].tweens,
            n[r = n.length] = e,
            i))
                for (; --r > -1; )
                    n[r] === e && n.splice(r, 1);
            return B[s].tweens
        }
          , Q = function(t, e, i, n) {
            var r, s, a = t.vars.onOverwrite;
            return a && (r = a(t, e, i, n)),
            a = A.onOverwrite,
            a && (s = a(t, e, i, n)),
            r !== !1 && s !== !1
        }
          , J = function(t, e, i, n, r) {
            var s, a, o, l;
            if (1 === n || n >= 4) {
                for (l = r.length,
                s = 0; l > s; s++)
                    if ((o = r[s]) !== e)
                        o._gc || o._kill(null , t, e) && (a = !0);
                    else if (5 === n)
                        break;
                return a
            }
            var h, u = e._startTime + c, f = [], p = 0, _ = 0 === e._duration;
            for (s = r.length; --s > -1; )
                (o = r[s]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || K(e, 0, _),
                0 === K(o, h, _) && (f[p++] = o)) : o._startTime <= u && o._startTime + o.totalDuration() / o._timeScale > u && ((_ || !o._initted) && u - o._startTime <= 2e-10 || (f[p++] = o)));
            for (s = p; --s > -1; )
                if (o = f[s],
                2 === n && o._kill(i, t, e) && (a = !0),
                2 !== n || !o._firstPT && o._initted) {
                    if (2 !== n && !Q(o, e))
                        continue;o._enabled(!1, !1) && (a = !0)
                }
            return a
        }
          , K = function(t, e, i) {
            for (var n = t._timeline, r = n._timeScale, s = t._startTime; n._timeline; ) {
                if (s += n._startTime,
                r *= n._timeScale,
                n._paused)
                    return -100;
                n = n._timeline
            }
            return s /= r,
            s > e ? s - e : i && s === e || !t._initted && 2 * c > s - e ? c : (s += t.totalDuration() / t._timeScale / r) > e + c ? 0 : s - e - c
        }
        ;
        a._init = function() {
            var t, e, i, n, r, s, a = this.vars, o = this._overwrittenProps, l = this._duration, h = !!a.immediateRender, u = a.ease;
            if (a.startAt) {
                this._startAt && (this._startAt.render(-1, !0),
                this._startAt.kill()),
                r = {};
                for (n in a.startAt)
                    r[n] = a.startAt[n];
                if (r.overwrite = !1,
                r.immediateRender = !0,
                r.lazy = h && a.lazy !== !1,
                r.startAt = r.delay = null ,
                this._startAt = A.to(this.target, 0, r),
                h)
                    if (this._time > 0)
                        this._startAt = null ;
                    else if (0 !== l)
                        return
            } else if (a.runBackwards && 0 !== l)
                if (this._startAt)
                    this._startAt.render(-1, !0),
                    this._startAt.kill(),
                    this._startAt = null ;
                else {
                    0 !== this._time && (h = !1),
                    i = {};
                    for (n in a)
                        $[n] && "autoCSS" !== n || (i[n] = a[n]);
                    if (i.overwrite = 0,
                    i.data = "isFromStart",
                    i.lazy = h && a.lazy !== !1,
                    i.immediateRender = h,
                    this._startAt = A.to(this.target, 0, i),
                    h) {
                        if (0 === this._time)
                            return
                    } else
                        this._startAt._init(),
                        this._startAt._enabled(!1),
                        this.vars.immediateRender && (this._startAt = null )
                }
            if (this._ease = u = u ? u instanceof x ? u : "function" == typeof u ? new x(u,a.easeParams) : T[u] || A.defaultEase : A.defaultEase,
            a.easeParams instanceof Array && u.config && (this._ease = u.config.apply(u, a.easeParams)),
            this._easeType = this._ease._type,
            this._easePower = this._ease._power,
            this._firstPT = null ,
            this._targets)
                for (s = this._targets.length,
                t = 0; s > t; t++)
                    this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], o ? o[t] : null , t) && (e = !0);
            else
                e = this._initProps(this.target, this._propLookup, this._siblings, o, 0);
            if (e && A._onPluginEvent("_onInitAllProps", this),
            o && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)),
            a.runBackwards)
                for (i = this._firstPT; i; )
                    i.s += i.c,
                    i.c = -i.c,
                    i = i._next;
            this._onUpdate = a.onUpdate,
            this._initted = !0
        }
        ,
        a._initProps = function(e, i, n, r, s) {
            var a, o, l, h, u, c;
            if (null == e)
                return !1;
            I[e._gsTweenID] && H(),
            this.vars.css || e.style && e !== t && e.nodeType && Y.css && this.vars.autoCSS !== !1 && E(this.vars, e);
            for (a in this.vars)
                if (c = this.vars[a],
                $[a])
                    c && (c instanceof Array || c.push && _(c)) && -1 !== c.join("").indexOf("{self}") && (this.vars[a] = c = this._swapSelfInParams(c, this));
                else if (Y[a] && (h = new Y[a])._onInitTween(e, this.vars[a], this, s)) {
                    for (this._firstPT = u = {
                        _next: this._firstPT,
                        t: h,
                        p: "setRatio",
                        s: 0,
                        c: 1,
                        f: 1,
                        n: a,
                        pg: 1,
                        pr: h._priority,
                        m: 0
                    },
                    o = h._overwriteProps.length; --o > -1; )
                        i[h._overwriteProps[o]] = this._firstPT;
                    (h._priority || h._onInitAllProps) && (l = !0),
                    (h._onDisable || h._onEnable) && (this._notifyPluginsOfEnabled = !0),
                    u._next && (u._next._prev = u)
                } else
                    i[a] = X.call(this, e, a, "get", c, a, 0, null , this.vars.stringFilter, s);
            return r && this._kill(r, e) ? this._initProps(e, i, n, r, s) : this._overwrite > 1 && this._firstPT && n.length > 1 && J(e, this, i, this._overwrite, n) ? (this._kill(i, e),
            this._initProps(e, i, n, r, s)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (I[e._gsTweenID] = !0),
            l)
        }
        ,
        a.render = function(t, e, i) {
            var n, r, s, a, o = this._time, l = this._duration, h = this._rawPrevTime;
            if (t >= l - 1e-7)
                this._totalTime = this._time = l,
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1,
                this._reversed || (n = !0,
                r = "onComplete",
                i = i || this._timeline.autoRemoveChildren),
                0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0),
                (0 > h || 0 >= t && t >= -1e-7 || h === c && "isPause" !== this.data) && h !== t && (i = !0,
                h > c && (r = "onReverseComplete")),
                this._rawPrevTime = a = !e || t || h === t ? t : c);
            else if (1e-7 > t)
                this._totalTime = this._time = 0,
                this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0,
                (0 !== o || 0 === l && h > 0) && (r = "onReverseComplete",
                n = this._reversed),
                0 > t && (this._active = !1,
                0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (h !== c || "isPause" !== this.data) && (i = !0),
                this._rawPrevTime = a = !e || t || h === t ? t : c)),
                this._initted || (i = !0);
            else if (this._totalTime = this._time = t,
            this._easeType) {
                var u = t / l
                  , f = this._easeType
                  , p = this._easePower;
                (1 === f || 3 === f && u >= .5) && (u = 1 - u),
                3 === f && (u *= 2),
                1 === p ? u *= u : 2 === p ? u *= u * u : 3 === p ? u *= u * u * u : 4 === p && (u *= u * u * u * u),
                1 === f ? this.ratio = 1 - u : 2 === f ? this.ratio = u : .5 > t / l ? this.ratio = u / 2 : this.ratio = 1 - u / 2
            } else
                this.ratio = this._ease.getRatio(t / l);
            if (this._time !== o || i) {
                if (!this._initted) {
                    if (this._init(),
                    !this._initted || this._gc)
                        return;
                    if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration))
                        return this._time = this._totalTime = o,
                        this._rawPrevTime = h,
                        z.push(this),
                        void (this._lazy = [t, e]);
                    this._time && !n ? this.ratio = this._ease.getRatio(this._time / l) : n && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1))
                }
                for (this._lazy !== !1 && (this._lazy = !1),
                this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0),
                0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : r || (r = "_dummyGS")),
                this.vars.onStart && (0 !== this._time || 0 === l) && (e || this._callback("onStart"))),
                s = this._firstPT; s; )
                    s.f ? s.t[s.p](s.c * this.ratio + s.s) : s.t[s.p] = s.c * this.ratio + s.s,
                    s = s._next;
                this._onUpdate && (0 > t && this._startAt && t !== -1e-4 && this._startAt.render(t, e, i),
                e || (this._time !== o || n || i) && this._callback("onUpdate")),
                r && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && t !== -1e-4 && this._startAt.render(t, e, i),
                n && (this._timeline.autoRemoveChildren && this._enabled(!1, !1),
                this._active = !1),
                !e && this.vars[r] && this._callback(r),
                0 === l && this._rawPrevTime === c && a !== c && (this._rawPrevTime = 0))
            }
        }
        ,
        a._kill = function(t, e, i) {
            if ("all" === t && (t = null ),
            null == t && (null == e || e === this.target))
                return this._lazy = !1,
                this._enabled(!1, !1);
            e = "string" != typeof e ? e || this._targets || this.target : A.selector(e) || e;
            var n, r, s, a, o, l, h, u, c, f = i && this._time && i._startTime === this._startTime && this._timeline === i._timeline;
            if ((_(e) || D(e)) && "number" != typeof e[0])
                for (n = e.length; --n > -1; )
                    this._kill(t, e[n], i) && (l = !0);
            else {
                if (this._targets) {
                    for (n = this._targets.length; --n > -1; )
                        if (e === this._targets[n]) {
                            o = this._propLookup[n] || {},
                            this._overwrittenProps = this._overwrittenProps || [],
                            r = this._overwrittenProps[n] = t ? this._overwrittenProps[n] || {} : "all";
                            break
                        }
                } else {
                    if (e !== this.target)
                        return !1;
                    o = this._propLookup,
                    r = this._overwrittenProps = t ? this._overwrittenProps || {} : "all"
                }
                if (o) {
                    if (h = t || o,
                    u = t !== r && "all" !== r && t !== o && ("object" != typeof t || !t._tempKill),
                    i && (A.onOverwrite || this.vars.onOverwrite)) {
                        for (s in h)
                            o[s] && (c || (c = []),
                            c.push(s));
                        if ((c || !t) && !Q(this, i, e, c))
                            return !1
                    }
                    for (s in h)
                        (a = o[s]) && (f && (a.f ? a.t[a.p](a.s) : a.t[a.p] = a.s,
                        l = !0),
                        a.pg && a.t._kill(h) && (l = !0),
                        a.pg && 0 !== a.t._overwriteProps.length || (a._prev ? a._prev._next = a._next : a === this._firstPT && (this._firstPT = a._next),
                        a._next && (a._next._prev = a._prev),
                        a._next = a._prev = null ),
                        delete o[s]),
                        u && (r[s] = 1);
                    !this._firstPT && this._initted && this._enabled(!1, !1)
                }
            }
            return l
        }
        ,
        a.invalidate = function() {
            return this._notifyPluginsOfEnabled && A._onPluginEvent("_onDisable", this),
            this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null ,
            this._notifyPluginsOfEnabled = this._active = this._lazy = !1,
            this._propLookup = this._targets ? {} : [],
            C.prototype.invalidate.call(this),
            this.vars.immediateRender && (this._time = -c,
            this.render(Math.min(0, -this._delay))),
            this
        }
        ,
        a._enabled = function(t, e) {
            if (l || o.wake(),
            t && this._gc) {
                var i, n = this._targets;
                if (n)
                    for (i = n.length; --i > -1; )
                        this._siblings[i] = G(n[i], this, !0);
                else
                    this._siblings = G(this.target, this, !0)
            }
            return C.prototype._enabled.call(this, t, e),
            !(!this._notifyPluginsOfEnabled || !this._firstPT) && A._onPluginEvent(t ? "_onEnable" : "_onDisable", this)
        }
        ,
        A.to = function(t, e, i) {
            return new A(t,e,i)
        }
        ,
        A.from = function(t, e, i) {
            return i.runBackwards = !0,
            i.immediateRender = 0 != i.immediateRender,
            new A(t,e,i)
        }
        ,
        A.fromTo = function(t, e, i, n) {
            return n.startAt = i,
            n.immediateRender = 0 != n.immediateRender && 0 != i.immediateRender,
            new A(t,e,n)
        }
        ,
        A.delayedCall = function(t, e, i, n, r) {
            return new A(e,0,{
                delay: t,
                onComplete: e,
                onCompleteParams: i,
                callbackScope: n,
                onReverseComplete: e,
                onReverseCompleteParams: i,
                immediateRender: !1,
                lazy: !1,
                useFrames: r,
                overwrite: 0
            })
        }
        ,
        A.set = function(t, e) {
            return new A(t,0,e)
        }
        ,
        A.getTweensOf = function(t, e) {
            if (null == t)
                return [];
            t = "string" != typeof t ? t : A.selector(t) || t;
            var i, n, r, s;
            if ((_(t) || D(t)) && "number" != typeof t[0]) {
                for (i = t.length,
                n = []; --i > -1; )
                    n = n.concat(A.getTweensOf(t[i], e));
                for (i = n.length; --i > -1; )
                    for (s = n[i],
                    r = i; --r > -1; )
                        s === n[r] && n.splice(i, 1)
            } else
                for (n = G(t).concat(),
                i = n.length; --i > -1; )
                    (n[i]._gc || e && !n[i].isActive()) && n.splice(i, 1);
            return n
        }
        ,
        A.killTweensOf = A.killDelayedCallsTo = function(t, e, i) {
            "object" == typeof e && (i = e,
            e = !1);
            for (var n = A.getTweensOf(t, e), r = n.length; --r > -1; )
                n[r]._kill(i, t)
        }
        ;
        var tt = v("plugins.TweenPlugin", function(t, e) {
            this._overwriteProps = (t || "").split(","),
            this._propName = this._overwriteProps[0],
            this._priority = e || 0,
            this._super = tt.prototype
        }, !0);
        if (a = tt.prototype,
        tt.version = "1.19.0",
        tt.API = 2,
        a._firstPT = null ,
        a._addTween = X,
        a.setRatio = F,
        a._kill = function(t) {
            var e, i = this._overwriteProps, n = this._firstPT;
            if (null != t[this._propName])
                this._overwriteProps = [];
            else
                for (e = i.length; --e > -1; )
                    null != t[i[e]] && i.splice(e, 1);
            for (; n; )
                null != t[n.n] && (n._next && (n._next._prev = n._prev),
                n._prev ? (n._prev._next = n._next,
                n._prev = null ) : this._firstPT === n && (this._firstPT = n._next)),
                n = n._next;
            return !1
        }
        ,
        a._mod = a._roundProps = function(t) {
            for (var e, i = this._firstPT; i; )
                e = t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")],
                e && "function" == typeof e && (2 === i.f ? i.t._applyPT.m = e : i.m = e),
                i = i._next
        }
        ,
        A._onPluginEvent = function(t, e) {
            var i, n, r, s, a, o = e._firstPT;
            if ("_onInitAllProps" === t) {
                for (; o; ) {
                    for (a = o._next,
                    n = r; n && n.pr > o.pr; )
                        n = n._next;
                    (o._prev = n ? n._prev : s) ? o._prev._next = o : r = o,
                    (o._next = n) ? n._prev = o : s = o,
                    o = a
                }
                o = e._firstPT = r
            }
            for (; o; )
                o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0),
                o = o._next;
            return i
        }
        ,
        tt.activate = function(t) {
            for (var e = t.length; --e > -1; )
                t[e].API === tt.API && (Y[(new t[e])._propName] = t[e]);
            return !0
        }
        ,
        g.plugin = function(t) {
            if (!(t && t.propName && t.init && t.API))
                throw "illegal plugin definition.";
            var e, i = t.propName, n = t.priority || 0, r = t.overwriteProps, s = {
                init: "_onInitTween",
                set: "setRatio",
                kill: "_kill",
                round: "_mod",
                mod: "_mod",
                initAll: "_onInitAllProps"
            }, a = v("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function() {
                tt.call(this, i, n),
                this._overwriteProps = r || []
            }, t.global === !0), o = a.prototype = new tt(i);
            o.constructor = a,
            a.API = t.API;
            for (e in s)
                "function" == typeof t[e] && (o[s[e]] = t[e]);
            return a.version = t.version,
            tt.activate([a]),
            a
        }
        ,
        r = t._gsQueue) {
            for (s = 0; s < r.length; s++)
                r[s]();
            for (a in d)
                d[a].func || t.console.log("GSAP encountered missing dependency: " + a)
        }
        l = !1
    }
}("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenMax"),
function(t) {
    var e = "object" == typeof self && self.self == self && self || "object" == typeof global && global.global == global && global;
    "function" == typeof define && define.amd ? define(["exports"], function(i) {
        e.C3D = t(e, i)
    }) : "undefined" != typeof exports ? t(e, exports) : e.C3D = t(e, {})
}(function(t, e) {
    function mathRound(t) {
        return Math.round(t)
    }
    function mathRoundAcc(t) {
        return Math.round(100 * t) / 100
    }
    function r(t) {
        return t.replace(/\b(\w)|\s(\w)/g, function(t) {
            return t.toUpperCase()
        })
    }
    function s(t) {
        var i;
        switch (t.type) {
        case "sprite":
            i = new e.Sprite(t.el ? {
                el: t.el
            } : void 0);
            break;
        case "plane":
            i = new e.Plane(t.el ? {
                el: t.el
            } : void 0);
            break;
        case "box":
            i = new e.Box(t.el ? {
                el: t.el
            } : void 0);
            break;
        case "skybox":
            i = new e.Skybox(t.el ? {
                el: t.el
            } : void 0)
        }
        if (void 0 != t.size && i.size.apply(i, t.size),
        void 0 != t.position && i.position.apply(i, t.position),
        void 0 != t.rotation && i.rotation.apply(i, t.rotation),
        void 0 != t.scale && i.scale.apply(i, t.scale),
        void 0 != t.origin && i.origin.apply(i, t.origin),
        void 0 != t.visibility && i.visibility.apply(i, t.visibility),
        void 0 != t.material && i.material.apply(i, t.material),
        void 0 != t.filter && i.filter.apply(i, t.filter),
        void 0 != t.name && i.name.apply(i, [t.name]),
        i.update(),
        t.children)
            for (var n = 0, r = t.children.length; n < r; n++) {
                var a = t.children[n]
                  , o = s(a);
                i.addChild(o)
            }
        return i
    }
    var a = function(t) {
        var e = [];
        for (var i in t)
            e.push(i);
        return e
    }, 
    o = function(t) {
        var e = arguments.length;
        if (e < 2 || null == t)
            return t;
        for (var i = 1; i < e; i++)
            for (var n = arguments[i], r = a(n), s = r.length, o = 0; o < s; o++) {
                var l = r[o];
                t[l] = n[l]
            }
        return t
    },
    l = function(t, e) {
        var i, n = this;
        i = t && Object.prototype.hasOwnProperty.call(t, "constructor") ? t.constructor : function() {
            return n.apply(this, arguments)
        }
        ,
        o(i, n, e);
        var r = function() {
            this.constructor = i
        }
        ;
        return r.prototype = n.prototype,
        i.prototype = new r,
        t && o(i.prototype, t),
        i.__super__ = n.prototype,
        i
    },
    h = "";
    return function() {
        var t = document.createElement("div")
          , e = ["Webkit", "Moz", "Ms", "O"];
        for (var i in e)
            if (e[i] + "Transform"in t.style) {
                h = e[i];
                break
            }
    }(),
    e.Object = function() {
        this.initialize.apply(this, arguments)
    }
    ,
    o(e.Object.prototype, {
        x: 0,
        y: 0,
        z: 0,
        position: function(t, e, i) {
            switch (arguments.length) {
            case 1:
                this.x = t,
                this.y = t,
                this.z = t;
                break;
            case 2:
                this.x = t,
                this.y = e;
                break;
            case 3:
                this.x = t,
                this.y = e,
                this.z = i
            }
            return this
        },
        move: function(t, e, i) {
            switch (arguments.length) {
            case 1:
                this.x += t,
                this.y += t,
                this.z += t;
                break;
            case 2:
                this.x += t,
                this.y += e;
                break;
            case 3:
                this.x += t,
                this.y += e,
                this.z += i
            }
            return this
        },
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        rotation: function(t, e, i) {
            switch (arguments.length) {
            case 1:
                this.rotationX = t,
                this.rotationY = t,
                this.rotationZ = t;
                break;
            case 2:
                this.rotationX = t,
                this.rotationY = e;
                break;
            case 3:
                this.rotationX = t,
                this.rotationY = e,
                this.rotationZ = i
            }
            return this
        },
        rotate: function(t, e, i) {
            switch (arguments.length) {
            case 1:
                this.rotationX += t,
                this.rotationY += t,
                this.rotationZ += t;
                break;
            case 2:
                this.rotationX += t,
                this.rotationY += e;
                break;
            case 3:
                this.rotationX += t,
                this.rotationY += e,
                this.rotationZ += i
            }
            return this
        },
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        scale: function(t, e, i) {
            switch (arguments.length) {
            case 1:
                this.scaleX = t,
                this.scaleY = t,
                this.scaleZ = t;
                break;
            case 2:
                this.scaleX = t,
                this.scaleY = e;
                break;
            case 3:
                this.scaleX = t,
                this.scaleY = e,
                this.scaleZ = i
            }
            return this
        },
        width: 0,
        height: 0,
        depth: 0,
        size: function(t, e, i) {
            switch (arguments.length) {
            case 1:
                this.width = t,
                this.height = t,
                this.depth = t;
                break;
            case 2:
                this.width = t,
                this.height = e;
                break;
            case 3:
                this.width = t,
                this.height = e,
                this.depth = i
            }
            return this
        },
        originX: 0,
        originY: 0,
        originZ: 0,
        __orgO: {
            x: 0,
            y: 0,
            z: 0
        },
        __orgT: {
            x: 0,
            y: 0,
            z: 0
        },
        __orgF: {
            x: 0,
            y: 0,
            z: 0
        },
        origin: function(t, e, i) {
            switch (arguments.length) {
            case 1:
                this.originX = t,
                this.originY = t,
                this.originZ = t;
                break;
            case 2:
                this.originX = t,
                this.originY = e;
                break;
            case 3:
                this.originX = t,
                this.originY = e,
                this.originZ = i
            }
            return this
        },
        __name: "",
        name: function(t) {
            return this.__name = t,
            "" == t ? delete this.el.dataset.name : this.el.dataset.name = t,
            this
        },
        __sort: ["X", "Y", "Z"],
        sort: function(t, e, i) {
            if (arguments.length > 3)
                throw "sort arguments is wrong!";
            return this.__sort = [t, e, i],
            this
        },
        initialize: function() {
            this.x = 0,
            this.y = 0,
            this.z = 0,
            this.rotationX = 0,
            this.rotationY = 0,
            this.rotationZ = 0,
            this.scaleX = 1,
            this.scaleY = 1,
            this.scaleZ = 1,
            this.width = 0,
            this.height = 0,
            this.depth = 0,
            this.originX = "50%",
            this.originY = "50%",
            this.originZ = "0px",
            this.__orgO = {
                x: "50%",
                y: "50%",
                z: "0px"
            },
            this.__orgT = {
                x: "-50%",
                y: "-50%",
                z: "0px"
            },
            this.__orgF = {
                x: 0,
                y: 0,
                z: 0
            },
            this.children = [],
            this.__name = ""
        },
        parent: null ,
        children: null ,
        addChild: function(t) {
            if (null != t.parent && t.parent.removeChild(t),
            "" != t.__name) {
                if (void 0 !== this[t.__name])
                    throw t.__name + " already exist!";
                this[t.__name] = t
            }
            return this.children.push(t),
            t.parent = this,
            this
        },
        removeChild: function(t) {
            for (var e = this.children.length - 1; e >= 0; e--)
                if (this.children[e] === t)
                    return "" != t.__name && delete this[t.__name],
                    this.children.splice(e, 1),
                    t.parent = null ,
                    this;
            return this
        },
        removeAllChild: function() {
            for (var t = this.children.length - 1; t >= 0; t--) {
                var e = this.children[t];
                "" != e.__name && delete this[e.__name],
                e.parent = null
            }
            return this.children = [],
            this
        },
        remove: function() {
            return null != this.parent && this.parent.removeChild(this),
            this
        }
    }),
    e.Object.extend = l,
    e.Sprite = e.Object.extend({
        el: null ,
        alpha: 1,
        visible: !0,
        initialize: function(t) {
            e.Sprite.__super__.initialize.apply(this, [t]),
            this.alpha = 1,
            this.visible = !0;
            var i;
            if (t && t.el)
                switch (typeof t.el) {
                case "string":
                    i = document.createElement("div"),
                    i.innerHTML = t.el;
                    break;
                case "object":
                    1 === t.el.nodeType && (i = t.el)
                }
            i || (i = document.createElement("div")),
            i.style.position = "absolute",
            i.style[h + "Transform"] = "translateZ(0px)",
            i.style[h + "TransformStyle"] = "preserve-3d",
            this.el = i,
            i.le = this
        },
        update: function() {
            return this.updateS(),
            this.updateM(),
            this.updateO(),
            this.updateT(),
            this.updateV(),
            this
        },
        updateS: function() {
            return this
        },
        updateM: function() {
            if (!this.__mat)
                return this;
            for (var t in this.__mat)
                switch (t) {
                case "bothsides":
                    this.el.style[h + "BackfaceVisibility"] = this.__mat[t] ? "visible" : "hidden";
                    break;
                case "image":
                    this.el.style["background" + r(t)] = "" !== this.__mat[t] ? "url(" + this.__mat[t] + ")" : "";
                    break;
                default:
                    this.el.style["background" + r(t)] = this.__mat[t]
                }
            return this
        },
        updateO: function() {
            if ("number" == typeof this.originX) {
                var t = mathRound(this.originX - this.__orgF.x);
                this.__orgO.x = t + "px",
                this.__orgT.x = -t + "px"
            } else
                this.__orgO.x = this.originX,
                this.__orgT.x = "-" + this.originX;
            if ("number" == typeof this.originY) {
                var e = mathRound(this.originY - this.__orgF.y);
                this.__orgO.y = e + "px",
                this.__orgT.y = -e + "px"
            } else
                this.__orgO.y = this.originY,
                this.__orgT.y = "-" + this.originY;
            if ("number" == typeof this.originZ) {
                var n = mathRound(this.originZ - this.__orgF.z);
                this.__orgO.z = n + "px",
                this.__orgT.z = -n + "px"
            } else
                this.__orgO.z = this.__orgT.z = "0px";
            return this.el.style[h + "TransformOrigin"] = this.__orgO.x + " " + this.__orgO.y + " " + this.__orgO.z,
            this
        },
        updateT: function() {
            var t = this.__sort[0]
              , e = this.__sort[1]
              , i = this.__sort[2];
            return this.el.style[h + "Transform"] = "translate3d(" + this.__orgT.x + ", " + this.__orgT.y + ", " + this.__orgT.z + ") translate3d(" + mathRoundAcc(this.x) + "px," + mathRoundAcc(this.y) + "px," + mathRoundAcc(this.z) + "px) rotate" + t + "(" + mathRoundAcc(this["rotation" + t]) % 360 + "deg) rotate" + e + "(" + mathRoundAcc(this["rotation" + e]) % 360 + "deg) rotate" + i + "(" + mathRoundAcc(this["rotation" + i]) % 360 + "deg) scale3d(" + mathRoundAcc(this.scaleX) + ", " + mathRoundAcc(this.scaleY) + ", " + mathRoundAcc(this.scaleZ) + ") ",
            this
        },
        updateV: function() {
            return this.el.style.opacity = this.alpha,
            this.el.style.display = this.visible ? "block" : "none",
            this
        },
        addChild: function(t) {
            return e.Sprite.__super__.addChild.apply(this, [t]),
            this.el && t.el && this.el.appendChild(t.el),
            this
        },
        removeChild: function(t) {
            for (var e = this.children.length - 1; e >= 0; e--)
                if (this.children[e] === t)
                    return "" != t.__name && delete this[t.__name],
                    this.children.splice(e, 1),
                    t.parent = null ,
                    this.el.removeChild(t.el),
                    this;
            return this
        },
        removeAllChild: function() {
            for (var t = this.children.length - 1; t >= 0; t--) {
                var e = this.children[t];
                "" != e.__name && delete this[e.__name],
                e.parent = null ,
                this.el.removeChild(e.el)
            }
            return this.children = [],
            this
        },
        on: function(t) {
            if ("object" == typeof t)
                for (var e in t)
                    this.el.addEventListener(e, t[e], !1);
            else
                2 === arguments.length ? this.el.addEventListener(arguments[0], arguments[1], !1) : 3 === arguments.length && this.el.addEventListener(arguments[0], arguments[1], arguments[2]);
            return this
        },
        off: function(t) {
            if ("object" == typeof t)
                for (var e in t)
                    this.el.removeEventListener(e, t[e], !1);
            else
                2 === arguments.length && this.el.removeEventListener(arguments[0], arguments[1], !1);
            return this
        },
        buttonMode: function(t) {
            return t ? this.el.style.cursor = "pointer" : this.el.style.cursor = "auto",
            this
        },
        __mat: null ,
        material: function(t) {
            return this.__mat = t,
            this
        },
        visibility: function(t) {
            return void 0 !== t.visible && (this.visible = t.visible),
            void 0 !== t.alpha && (this.alpha = t.alpha),
            this
        }
    }),
    e.Stage = e.Sprite.extend({
        camera: null ,
        fov: null ,
        __rfix: null ,
        __pfix: null ,
        initialize: function(t) {
            e.Stage.__super__.initialize.apply(this, [t]),
            t && t.el || (this.el.style.top = "0px",
            this.el.style.left = "0px",
            this.el.style.width = "0px",
            this.el.style.height = "0px"),
            this.el.style[h + "Perspective"] = "800px",
            this.el.style[h + "TransformStyle"] = "flat",
            this.el.style[h + "Transform"] = "",
            this.el.style.overflow = "hidden",
            this.__rfix = new e.Sprite,
            this.el.appendChild(this.__rfix.el),
            this.__pfix = new e.Sprite,
            this.__rfix.el.appendChild(this.__pfix.el),
            this.setCamera(new e.Camera)
        },
        updateS: function() {
            return this.el.style.width = mathRound(this.width) + "px",
            this.el.style.height = mathRound(this.height) + "px",
            this
        },
        updateT: function() {
            return this.fov = mathRound(.5 / Math.tan(.5 * this.camera.fov / 180 * Math.PI) * this.height),
            this.el.style[h + "Perspective"] = this.fov + "px",
            this.__rfix.position(mathRound(this.width / 2), mathRound(this.height / 2), this.fov).rotation(-this.camera.rotationX, -this.camera.rotationY, -this.camera.rotationZ).updateT(),
            this.__pfix.position(-this.camera.x, -this.camera.y, -this.camera.z).updateT(),
            this
        },
        addChild: function(t) {
            return this.__pfix.addChild(t),
            this
        },
        removeChild: function(t) {
            return this.__pfix.removeChild(t),
            this
        },
        setCamera: function(t) {
            return this.camera && (this.camera.stage = null ),
            this.camera = t,
            this.camera.stage = this,
            this
        }
    }),
    e.Camera = e.Object.extend({
        fov: null ,
        stage: null ,
        initialize: function(t) {
            e.Camera.__super__.initialize.apply(this, [t]),
            this.fov = 75
        },
        update: function() {
            return this.updateT(),
            this
        },
        updateS: function() {
            return this
        },
        updateM: function() {
            return this
        },
        updateT: function() {
            return this.stage && this.stage.updateT(),
            this
        },
        updateV: function() {
            return this
        }
    }),
    e.Plane = e.Sprite.extend({
        initialize: function(t) {
            e.Plane.__super__.initialize.apply(this, [t])
        },
        update: function() {
            return e.Plane.__super__.update.apply(this),
            this.updateF(),
            this
        },
        updateS: function() {
            return this.el.style.width = mathRound(this.width) + "px",
            this.el.style.height = mathRound(this.height) + "px",
            this
        },
        updateF: function() {
            if (!this.__flt)
                return this;
            var t = "";
            for (var e in this.__flt)
                t += "" !== this.__flt[e] ? e + "(" + this.__flt[e].join(",") + ")" : "";
            return "" !== t && (this.el.style[h + "Filter"] = t),
            this
        },
        __flt: null ,
        filter: function(t) {
            return this.__flt = t,
            this
        }
    }),
    e.create = function(t) {
        var e;
        switch (typeof t) {
        case "array":
            e = {
                type: "sprite",
                children: t
            };
            break;
        case "object":
            e = t;
            break;
        default:
            return
        }
        return s(e)
    }
    ,
    e
}),
Orienter.prototype = {
    lon: 0,
    lat: 0,
    direction: 0,
    fix: 0,
    os: "",
    initialize: function() {
        switch (this.lon = 0,
        this.lat = 0,
        this.direction = window.orientation || 0,
        this.direction) {
        case 0:
            this.fix = 0;
            break;
        case 90:
            this.fix = -270;
            break;
        case -90:
            this.fix = -90
        }
        navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? this.os = "ios" : this.os = navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux") ? "android" : ""
    },
    init: function() {
        this._orient = this.orientHandler.bind(this),
        window.addEventListener("deviceorientation", this._orient, !1),
        this._change = this.changeHandler.bind(this),
        window.addEventListener("orientationchange", this._change, !1)
    },
    destroy: function() {
        window.removeEventListener("deviceorientation", this._orient, !1),
        window.removeEventListener("orientationchange", this._change, !1)
    },
    changeHandler: function(t) {
        this.direction = window.orientation
    },
    orientHandler: function(t) {
        switch (this.os) {
        case "ios":
            switch (this.direction) {
            case 0:
                this.lon = t.alpha + t.gamma,
                t.beta > 0 && (this.lat = t.beta - 90);
                break;
            case 90:
                t.gamma < 0 ? this.lon = t.alpha - 90 : this.lon = t.alpha - 270,
                t.gamma > 0 ? this.lat = 90 - t.gamma : this.lat = -90 - t.gamma;
                break;
            case -90:
                t.gamma < 0 ? this.lon = t.alpha - 90 : this.lon = t.alpha - 270,
                t.gamma < 0 ? this.lat = 90 + t.gamma : this.lat = -90 + t.gamma
            }
            break;
        case "android":
            switch (this.direction) {
            case 0:
                this.lon = t.alpha + t.gamma + 30,
                t.gamma > 90 ? this.lat = 90 - t.beta : this.lat = t.beta - 90;
                break;
            case 90:
                this.lon = t.alpha - 230,
                t.gamma > 0 ? this.lat = 270 - t.gamma : this.lat = -90 - t.gamma;
                break;
            case -90:
                this.lon = t.alpha - 180,
                this.lat = -90 + t.gamma
            }
        }
        this.lon += this.fix,
        this.lon %= 360,
        this.lon < 0 && (this.lon += 360),
        this.lon = Math.round(this.lon),
        this.lat = Math.round(this.lat),
        this.handler && this.handler.apply(this, [{
            a: Math.round(t.alpha),
            b: Math.round(t.beta),
            g: Math.round(t.gamma),
            lon: this.lon,
            lat: this.lat,
            dir: this.direction
        }])
    }
};
(function() {
    function fireRender() {
        function prepareBG() {
            var t, bgPiece, i, n, r = bgSlice, bgBox = new C3D.Sprite;
            for (bgBox.name("bg").position(0, 0, 0).update(),
            t = 0; t < r; t++)
                bgPiece = new C3D.Plane,
                bgPiece.el.className = "pbg bg-" + (t < 9 ? "0" : "") + (t + 1),
                i = -360 / r * t,
                n = i * Math.PI / 180,
                bgPiece.position(Math.sin(n) * P, 0, Math.cos(n) * P).rotation(0, i + 180, 0).updateO().updateT(),
                bgBox.addChild(bgPiece);
            return bgBox
        }
        function addPoints() {
            var index, point, curPoint,
            pointArr = [{
                // 数据中心1
                i: -16,
                x: -250,
                y: -215,
                z: 477
            }, {
                // 广州1
                i: -89,
                x: -427,
                y: 49,
                z: 100
            }, {
                // 广州2
                i: -89,
                x: -387,
                y: 309,
                z: 100
            }, {
                // 北京1
                i: -127,
                x: -495,
                y: -311,
                z: -202
            }, {
                // 北京2
                i: -133,
                x: -361,
                y: -65,
                z: -340
            }, {
                // VR左
                i: -170,
                x: -100,
                y: 300,
                z: -482
            }, {
                // VR中
                i: -165,
                x: 100,
                y: -2,
                z: -482
            }, {
                // VR右
                i: -209,
                x: 50,
                y: -249,
                z: -438
            }, {
                // 上海1
                i: -242,
                x: 410,
                y: -300,
                z: -329
            }, {
                // 上海底
                i: -242,
                x: 442,
                y: 150,
                z: -286
            }, {
                // 南京
                i: -280,
                x: 489,
                y: -480,
                z: -20
            }, {
                // 南京
                i: -280,
                x: 489,
                y: 0,
                z: -20
            }, {
                // 天津
                i: -336,
                x: 200,
                y: -67,
                z: 455
            }, {
                // 天津
                i: -336,
                x: 295,
                y: -267,
                z: 400
            }],
            pointLen = pointArr.length;
            for (index = 0; index < pointLen; index++)
                point = new C3D.Plane,
                point.el.className = "point-bg",
                curPoint = pointArr[index],
                point.position(curPoint.x, curPoint.y, curPoint.z).rotation(0, curPoint.i + 180, 0).updateO().updateT(),
                point.el.index = index,
                point.on("touchend", showPop),
                bg.addChild(point);
            return bg
        }
        function startRender() {
            container.on("touchstart", onTouchStart),
            $(window).on("resize", resize),
            $("#popup .close-pop").on("touchend", closePop),
            $("#popup .popup-slide-btn").on("touchend", slideTo),
            isHandler = !1,
            requestAnimationFrame(render)
        }
        function render() {
            requestAnimationFrame(render);
            var t = (renderCoords.lon + fixCoords.lon + fixed.lon) % 360
              , e = .35 * (renderCoords.lat + fixCoords.lat + fixed.lat);
            t - bg.rotationY > 180 && (bg.rotationY += 360),
            t - bg.rotationY < -180 && (bg.rotationY -= 360),
            bg.rotationY += .35 * (t - bg.rotationY),
            bg.rotationX += .15 * (e - bg.rotationX),
            bg.updateT();
            var i = -200 - 20 * Math.abs(t - bg.rotationY);
            bgBox.z += .04 * (i - bgBox.z),
            bgBox.updateT()
        }
        function flyAni() {
            clearInterval(matrixInterval);
            $("#loading_bg").remove()
            $(".loading").remove()
            startRender()
            var a = 0;
            timeLine.to(bgBox, .8, {
                y: 0,
                onUpdate: function() {
                    bgBox.updateT()
                }
            }, a)
            
        }
        function onTouchStart(t) {
            var ev = t.originalEvent.targetTouches[0];
            touchStart.x = ev.pageX,
            touchStart.y = ev.pageY,
            container.on("touchmove", onTouchMove),
            container.on("touchend", onTouchEnd)
        }
        function onTouchMove(t) {
            var ev = t.originalEvent.targetTouches[0];
            return afterLimit.x = getInt(ev.pageX - touchStart.x),
            afterLimit.y = getInt(ev.pageY - touchStart.y),
            touchStart.x = ev.pageX,
            touchStart.y = ev.pageY,
            limitCoords(afterLimit)
        }
        function onTouchEnd(t) {
            return container.off("touchmove", onTouchMove),
            container.off("touchend", onTouchEnd)
        }
        function showPop() {
            var t = this.index;
            popIndex = t,
            $("#popup").show(),
            $(".popup-item").hide().eq(t).show()
        }
        function closePop() {
            $("#popup").hide()
        }
        /**
         * [slideTo 点击弹框左右按钮]
         */
        function slideTo() {
            if (!slideDone) {
                var preSlide = slideToArr[popIndex];
                $(this).hasClass("left") ? popIndex -= 1 : popIndex += 1,
                popIndex < 0 ? popIndex += slideToArrLen : popIndex === slideToArrLen && (popIndex -= slideToArrLen),
                $(".popup-item").hide().eq(popIndex).show();
                var curSlide = slideToArr[popIndex],
                    slideRound = curSlide - preSlide;
                renderCoords.lon = renderCoords.lon % 360,
                slideRound > 180 ? slideRound -= 360 : slideRound < -180 && (slideRound += 360),
                slideDone = !0;
                var slideDist = getInt(Math.abs(slideRound) / 60);
                slideDist = Math.min(.6, Math.max(.3, slideDist)),
                TweenMax.to(renderCoords, slideDist, {
                    lon: slideRound + renderCoords.lon,
                    onComplete: function() {
                        slideDone = !1
                    }
                })
            }
        }
        // 纠正重力感应Y轴方向
        function gHandler(t) {
            fixCoords.lon = -t.lon,
            fixCoords.lat = t.lat,
            isHandler && (fixed.lat = -fixCoords.lat, fixed.lon = -fixCoords.lon)
        }
        // 如果用户反转手机
        function resize(ev) {
            timeOut && clearTimeout(timeOut),
            timeOut = setTimeout(function() {
                containerStage.size(window.innerWidth, window.innerHeight).update()
            }, 100)
        }
        // 将X轴坐标限制在+-360，Y轴限制在+-90
        function limitCoords(t) {
            renderCoords.lon = (renderCoords.lon - .2 * t.x) % 360,
            renderCoords.lat = Math.max(-90, Math.min(90, renderCoords.lat + .2 * t.y))
        }
        // 取整
        function getInt(t) {
            return Math.floor(100 * t) / 100
        }
        var timeOut, popIndex, 
        P = 547.6, 
        fromTop = 1420, 
        bgSlice = 20,
        container = $("#container"),
        containerStage = new C3D.Stage({
            el: container[0]
        }), 
        touchStart = {
            x: 0,
            y: 0
        }, 
        afterLimit = {
            x: 0,
            y: 0
        }, 
        renderCoords = {
            lon: 0,
            lat: 0
        }, 
        fixCoords = {
            lon: 0,
            lat: 0
        }, 
        fixed = {
            lon: 0,
            lat: 0
        }, 
        isHandler = !0, 
        slideToArr = [-185, -140, -135, -105, -85, -50, -30, -20, 20, 25, 50, 55, 110, 120],
                    // 数顶, 广底, 广顶, 北顶, 北底, V底, V顶, V中,     ,   ,   ,   ,    ,    
        slideToArrLen = slideToArr.length, 
        timeLine = new TimelineLite, 
        slideDone = !1;
        containerStage.camera.fov = 75,
        containerStage.size(window.innerWidth, window.innerHeight).update();
        var bgBox = new C3D.Sprite;
        // 加载完毕后，场景从上到下，由position的第二个参数决定
        bgBox.position(0, -(fromTop + window.innerHeight) / 2, -200).rotation(0, -14.4, 0).update(),
        containerStage.addChild(bgBox);
        var bg = prepareBG();
        addPoints(),
        bgBox.addChild(bg);
        var G = new Orienter;
        G.handler = gHandler,
        G.init(),
        $('.point-bg').css({
            width: '100px',
            height: '100px',
            display: 'block'
        }).append('<div class="open-action"><div class="action action-01"></div><div class="action action-02"></div><div class="action action-03"></div><div class="action action-04"></div><div class="action action-05"></div></div>'),
        $('[data-name="bg"]').append('<div class="floats" id="floats"><div class="float float1"><div class="fl_bg bg01 fl_UD4"></div><div class="fl_bg bg02 fl_movie5"></div><div class="fl_bg bg03"></div></div><div class="float float2"><div class="fl_bg bg04 fl_UD1"></div><div class="fl_bg bg05 fl_movie4"></div><div class="fl_bg bg06 fl_UD2"></div><div class="fl_bg bg07 fl_UD3"></div><div class="fl_bg bg08"></div></div></div>')
        setTimeout(flyAni, 233)
    }
    function startLoad() {
        function progress(param) {
            var percent = Math.round(param.completedCount / param.totalCount * 100);
            $(".loading-words").html(percent + "%")
        }
        function complete() {
            clearTimeout(timer),
            hideOvertime(),
            fireRender()
        }
        function overtimeFn() {
            showOvertime()
        }
        function showOvertime() {
            $("#overtime").show()
        }
        function hideOvertime() {
            $("#overtime").hide()
        }
        for (var timer, loadArr = [assetsURL + "images/bg696.jpg", assetsURL + "images/pic-circle1.png", assetsURL + "images/pic-circle1.png", assetsURL + "images/pic-circle2.png", assetsURL + "images/pic-circle3.png", assetsURL + "images/pic-circle4.png", assetsURL + "images/pic-circle5.png", assetsURL + "images/pic-feichuan4.png", assetsURL + "images/pic-ufo.png", assetsURL + "images/pic-tkman.png", assetsURL + "images/pic-mini.png", assetsURL + "images/pic-star1.png", assetsURL + "images/pic-star3.png", assetsURL + "images/pic-feichuan3.png", assetsURL + "images/pic-feichuan2.png", assetsURL + "images/pic-feichuan.png", assetsURL + "images/pop-close.png", assetsURL + "images/pop-btn.png", assetsURL + "images/pop-bg.png", assetsURL + "images/pop-slider.png"], overtime = 90000, pxLoader = new PxLoader({
            statusInterval: 400
        }), u = 0, c = loadArr.length; u < c; u++)
        pxLoader.addImage(loadArr[u]);
        pxLoader.addProgressListener(progress),
        pxLoader.addCompletionListener(complete),
        pxLoader.start(),
        timer = setTimeout(overtimeFn, overtime)
    }
    // canvas实现0、1矩阵落下
    function canvasMatrix() {
        var c = document.getElementById("matrix");
        c.height = window.screen.height;
        c.width = window.screen.width;
        
        var fontSize = 12;
        var colums = c.width / fontSize;

        var Texto1 = "0";
        Texto1 = Texto1.split("");
        var Texto2 = "1";
        Texto2 = Texto2.split("");

        var letras = [];
        for(var i = 0; i < colums; i++){
            letras[i] = 1;
        }
        contexto = c.getContext('2d');

        function renderMatrix(){
            contexto.fillStyle = 'rgba(0,0,0,0.05)';
            contexto.fillRect(0,0,c.width,c.height);
            contexto.fillStyle = '#0f0';
            contexto.font = fontSize + 'px';
            for (var i = 0; i < letras.length; i++) {
                text = Texto1;
                text2 = Texto2;
                if (i % 2 == 1) {
                    contexto.fillText(text, i * fontSize, letras[i] * fontSize);
                }else{
                    contexto.fillText(text2, i * fontSize, letras[i] * fontSize);
                }
                if(letras[i] * fontSize > c.height && Math.random() > 0.975){
                    letras[i] = 0;
                }
                letras[i]++;
            }
            // requestAnimationFrame(renderMatrix);
        }
        // requestAnimationFrame(renderMatrix);
        // 锤子手机用raf特别慢，因此此处用定时器
        matrixInterval = setInterval(renderMatrix,16)
    }
    // raf兼容
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 50 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }
    })();
    function init() {
        var started = false;
        function showLoading() {
            if (!started) {
                started = true,
                $(".loading-progress").show(),
                playBGM(),
                startLoad()
            }
        }
        function refresh(ev) {
            ev.preventDefault(),
            location.reload()
        }
        function playBGM() {
            var ua = navigator.userAgent.toLowerCase();
            var isiOS = ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ios') > -1;
            var isAndroid = ua.indexOf('android') > -1 || ua.indexOf('adr') > -1 || ua.indexOf('linux;') > -1;

            var bgm = $("#bgm")[0];
            if (isiOS) {
                bgm.loop = true;
            }else if (isAndroid) {
                bgm.loop = false;
                bgm.addEventListener('ended', function(){
                    this.play();
                })
            }
            bgm.play()
        }
        function orientChange() {
            if (window.orientation == undefined) {return};
            if (window.orientation !== 0) {
                $('#rotate_lock').show();
            }else {
                $('#rotate_lock').hide();
            }
        }
        $("#loading_start").on("touchend", showLoading),
        $("#overtime .popup-close-btn").on("touchend", refresh),
        $("#overtime .popup-btn").on("touchend", refresh),
        canvasMatrix(),
        $(window).on('touchmove', function(event) {
            event.preventDefault();
        });
        window.addEventListener('orientationchange', orientChange, false);
    }
    var matrixInterval;
    var assetsURL = 'http://static.test.soufunimg.com/common_m/m_activity/spaceShip/';
    init();
})();
