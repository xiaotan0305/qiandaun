//基础工具类
var iterate = function(obj) {
    s = "遍历对象" + obj + "的属性：\n";
    for (i in obj)
        s += i + ":" + obj[i] + "\n";
    return s;
};
var SFUtil = {
    /**
     * 用于合并多个形如{'name':'value',..}的对象
     * 因为js的数组不支持自定义键名，用对象来做类似数组的功能
     */
    objMerge: function() {
        var result = {};
        for (var i = 0; i < arguments.length; i++) {
            if ('object' != typeof (arguments[i])) {
                //alert('argument '+i+' is not an object!');
                break;
            }
            for (j in arguments[i]) {
                result[j] = arguments[i][j];
            }
        }
        return result;
    },
    getStrlen: function(str) {
        var len = str.length;
        var reLen = 0;
        for (var i = 0; i < len; i++) {
            if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                // 全角
                reLen += 2;
            } else {
                reLen++;
            }
        }
        return reLen;
    },
    templateFetch:function (str, obj) {
        var retval = str;
        //其实是顺次对 str 执行正则表达式的替换
        for (var i in obj){
            var re = new RegExp('\\{'+i+'\\}', 'g');
            retval = retval.replace(re, obj[i]);
        }
        return retval;
    },
    subStrcn: function(str, lencn) {
        var len = str.length;
        var reLen = 0;
        var ch = 0;
        for (var i = 0; i < len; i++) {
            if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                ch = 2;
            } else {
                ch = 1;
            }
            reLen += ch;
            if (reLen > lencn) {
                break;
            }
        }
        return str.substring(0, i);
    },
    /*
     xml2json 改编自
     This work is licensed under Creative Commons GNU LGPL License.
     
     License: http://creativecommons.org/licenses/LGPL/2.1/
     Version: 0.9
     Author:  Stefan Goessner/2006
     Web:     http://goessner.net/
     参数：xml XML 节点对象
     返回：JSON 对象
     */
    xml2json: function(xml) {
        var X = {
            toObj: function(xml) {
                var o = {};
                if (xml.nodeType == 1) {   // element node ..
                    if (xml.attributes.length)   // element with attributes  ..
                        for (var i = 0; i < xml.attributes.length; i++)
                            o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                    if (xml.firstChild) { // element has child nodes ..
                        var textChild = 0, cdataChild = 0, hasElementChild = false;
                        for (var n = xml.firstChild; n; n = n.nextSibling) {
                            if (n.nodeType == 1)
                                hasElementChild = true;
                            else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/))
                                textChild++; // non-whitespace text
                            else if (n.nodeType == 4)
                                cdataChild++; // cdata section node
                        }
                        if (hasElementChild) {
                            if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                                X.removeWhite(xml);
                                for (var n = xml.firstChild; n; n = n.nextSibling) {
                                    if (n.nodeType == 3)  // text node
                                        o["#text"] = X.escape(n.nodeValue);
                                    else if (n.nodeType == 4)  // cdata node
                                        //此程序原来还会加上 #cdata 标签，我的后台返回数据把所有节点都做成 CDATA 节点了，所以去掉 #cdata 标签。
                                        //o["#cdata"] = X.escape(n.nodeValue);
                                        o = X.escape(n.nodeValue);
                                    else if (o[n.nodeName]) {  // multiple occurence of element ..
                                        if (o[n.nodeName] instanceof Array)
                                            o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                        else
                                            o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                    }
                                    else  // first occurence of element..
                                        o[n.nodeName] = X.toObj(n);
                                }
                            }
                            else { // mixed content
                                if (!xml.attributes.length)
                                    o = X.escape(X.innerXml(xml));
                                else
                                    o["#text"] = X.escape(X.innerXml(xml));
                            }
                        }
                        else if (textChild) { // pure text
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                        else if (cdataChild) { // cdata
                            if (cdataChild > 1)
                                o = X.escape(X.innerXml(xml));
                            else
                                for (var n = xml.firstChild; n; n = n.nextSibling)
                                    //o["#cdata"] = X.escape(n.nodeValue);
                                    o = X.escape(n.nodeValue);
                        }
                    }
                    if (!xml.attributes.length && !xml.firstChild)
                        o = null;
                }
                else if (xml.nodeType == 9) { // document.node
                    o = X.toObj(xml.documentElement);
                }
                else {
                    //alert("unhandled node type: " + xml.nodeType);
                }
                return o;
            },
            toJson: function(o, name, ind) {
                var json = name ? ("\"" + name + "\"") : "";
                if (o instanceof Array) {
                    for (var i = 0, n = o.length; i < n; i++)
                        o[i] = X.toJson(o[i], "", ind + "\t");
                    json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
                }
                else if (o == null)
                    json += (name && ":") + "null";
                else if (typeof (o) == "object") {
                    var arr = [];
                    for (var m in o)
                        arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                    json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
                }
                else if (typeof (o) == "string")
                    json += (name && ":") + "\"" + o.toString() + "\"";
                else
                    json += (name && ":") + o.toString();
                return json;
            },
            innerXml: function(node) {
                var s = "";
                if ("innerHTML" in node)
                    s = node.innerHTML;
                else {
                    var asXml = function(n) {
                        var s = "";
                        if (n.nodeType == 1) {
                            s += "<" + n.nodeName;
                            for (var i = 0; i < n.attributes.length; i++)
                                s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                            if (n.firstChild) {
                                s += ">";
                                for (var c = n.firstChild; c; c = c.nextSibling)
                                    s += asXml(c);
                                s += "</" + n.nodeName + ">";
                            }
                            else
                                s += "/>";
                        }
                        else if (n.nodeType == 3)
                            s += n.nodeValue;
                        else if (n.nodeType == 4)
                            s += "<![CDATA[" + n.nodeValue + "]]>";
                        return s;
                    };
                    for (var c = node.firstChild; c; c = c.nextSibling)
                        s += asXml(c);
                }
                return s;
            },
            escape: function(txt) {
                return txt.replace(/[\\]/g, "\\\\")
                        .replace(/[\"]/g, '\\"')
                        .replace(/[\n]/g, '\\n')
                        .replace(/[\r]/g, '\\r');
            },
            removeWhite: function(e) {
                e.normalize();
                for (var n = e.firstChild; n; ) {
                    if (n.nodeType == 3) {  // text node
                        if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                            var nxt = n.nextSibling;
                            e.removeChild(n);
                            n = nxt;
                        }
                        else
                            n = n.nextSibling;
                    }
                    else if (n.nodeType == 1) {  // element node
                        X.removeWhite(n);
                        n = n.nextSibling;
                    }
                    else                      // any other node
                        n = n.nextSibling;
                }
                return e;
            }
        };
        if (xml.nodeType == 9) // document node
            xml = xml.documentElement;
        var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");

        //return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
        //原来是返回格式化的字符串，我给改成直接处理成 JSON 对象了，因为我们是自己提供的数据，可以确保安全，从而可以使用最快捷的 eval。不把变量名写在 eval 的参数里，需要使用如下的写法，把 eval 的参数字符串加括号。
        var obj = eval('({' + json + '})');
        return obj;
    },
    //序列化 JSON 对象为字符串
    obj2str: function(o) {
        var r = [];
        if (typeof o == "string") {
            return '"' + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + '"';
        }
        if (typeof o == "object") {
            if (!o.sort) {
                for (var i in o) {
                    r.push(i + ":" + this.obj2str(o[i]));
                }
                if (document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}";
            } else {
                for (var i = 0; i < o.length; i++) {
                    r.push(this.obj2str(o[i]))
                }
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString();
    },
    /**
     * 读取 cookie
     * cookieName, cookie 名字
     */
    getCookie: function(cookieName) {
        var allcookies = document.cookie;
        //alert(allcookies);
        //提取形如  bbsSearch=%E8%81%94%E6%83%B3; 的 cookie 值，要在字符串里表示一个 \，就得写 \\。注意如果这是本站唯一的 cookie，取全部 cookie 字符串时会没有结尾的 ;，所以要用 ;?。
        var reCookieExtract = new RegExp(cookieName + '=(\\S+);?');
        //var arrHistory = [];
        var historyBbs = '';
        var arrMatch;
        if (arrMatch = reCookieExtract.exec(allcookies)) {
            try {
                historyBbs = decodeURIComponent(arrMatch[1]);
            } catch (e) {
                historyBbs = arrMatch[1];
            }
        }
        return historyBbs;
    },
    /**
     设置 cookie，此方法会进行 URI 编码和解码，所以传入参数不用编码。
     要清除 cookie，把 daysToLive  设为 0。
     
     cookieName, cookie 名字
     str	cookie 内容，
     daysToLive cookie 有效期，默认为 30 天，设为 0 时清除 cookie
     path	路径，默认为当前路径
     domain	域名，默认为当前域名
     secure	是否安全
     */
    setCookie: function(cookieName, str, daysToLive, path, domain, secure) {
        var cookie = cookieName + '=' + encodeURIComponent(str);
        if (daysToLive || daysToLive == 0) {
            cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
        }
        if (path) {
            cookie += "; path=" + path;
        }
        if (domain) {
            cookie += "; domain=" + domain;
        }
        if (secure) {
            cookie += "; secure";
        }
        document.cookie = cookie;
    },
    //兼容 IE 和 FF 的事件注册。还没用到注销事件，先不写了。
    eventAdd: function(element, eventType, handler) {
        if (document.addEventListener) {
            element.addEventListener(eventType, handler, false);
        } else if (document.attachEvent) {
            element.attachEvent("on" + eventType, handler);
        }
    },
    containNode: function(container, node) {
        //如果 button 本身就是 tag 节点，直接返回
        if (container == node) {
            return true;
        } else { //否则逐层向上找，找到最近的tag 节点停止
            while (node = node.parentNode) {
                if (container == node) {
                    return true;
                }
            }
        }
    },
    scriptRequest: function(url) {
        var script = document.createElement('script');
        document.body.appendChild(script);
        script.src = url;
    },
    // 把请求文件名和参数对象组织成地址，再调用 scriptRequest 发送请求。
    scriptPut: function(filename, args) {
        var url = filename + '?';
        for (var key in args) {
            url += '&' + key + '=' + args[key];
        }
        this.scriptRequest(url);
    }
};
var SFXHR = function(url, method, params, onComplete, onFailure, loading, encoding) {
    var me = this;
    var getHTTPObject = function() {
        var xmlhttp = false;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    xmlhttp = false;
                }
            }
        }
        return xmlhttp;
    };

    var completeRequest = function() {
        if (me.XHR.readyState == 4) {
            if (me.XHR.status == 200 || me.XHR.status == 304) {
                if (onComplete) {
                    onComplete(me.XHR);
                }
            }
            else
            {
                if (onFailure) {
                    onFailure(me.XHR);
                }
            }
        }
    };

    var process = function() {
        if (loading) {
            loading();
        }
        if (!encoding) {
            encoding = 'utf8';
        }
        var query = '';
        if ('utf8' == encoding) {
            for (var i in params) {
                //query+= i + '='+escape(params[i]) + '&';
                query += i + '=' + encodeURIComponent(params[i]) + '&';
            }
        } else {
            for (var i in params) {
                //query+= i + '='+escape(params[i]) + '&';
                query += i + '=' + params[i] + '&';
            }
        }
        me.XHR.onreadystatechange = completeRequest;
        if ('post' === me.method) {
            me.XHR.open("POST", url, true);
            me.XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            me.XHR.send(query);
        } else {
            url += '?' + query + 'random=' + Math.random();
            me.XHR.open("GET", url, true);
            me.XHR.send(null);
        }
    };
    me.XHR = getHTTPObject();
    me.method = ('get' === method.toLowerCase()) ? 'get' : 'post';
    process();
};