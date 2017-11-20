/**
 * 首页内容列表置顶操作类
 * by blue
 */
(function (f) {
    if (typeof define === "function") {
        define("topEffect/1.0.0/topEffect", ['jquery'], function (require) {
            var $ = require('jquery');
            return f($);
        });
    } else if (typeof exports === "object") {
        module.exports = f($);
    } else {
        window.TopEffect = f($);
    }
})(function factory() {
    if (!window.localStorage) {
        alert('This browser does NOT support localStorage');
        return;
    }
    function topEffect(ops) {
        this.options = {
            id: "#customList",
            manageId: ".manageIndex",
            tabClass: ".tab-change",
            tabActive: "on",
            storageType: "home_private_custom",
            topBtn: "a",
            topClass: "top",
            closeClass: "close",
            parentName: ".block",
            zTop: ".zd-tip"
        };
        for (var i in ops) {
            this.options[i] = ops[i];
        }
        this.con = $(this.options.id);
        this.zTop = $(this.options.zTop);
        this.manageCon = $(this.options.manageId);
        this.childObj = {};
        try {
            this.ls = window.localStorage.getItem(this.options.storageType) ? window.localStorage.getItem(this.options.storageType) : "";
        } catch (e) {
            this.ls = "";
        }
        this._init();
    }

    topEffect.prototype = {
        _init: function () {
            var th = this,
                con = th.con,
                pn = th.options.parentName;
            if (th.ls == "") {
                var cl = con.children().length;
                for (var i = 0; i < cl; i++) {
                    var child = $(con.children()[i]);
                    th.childObj[child.attr("id")] = child;
                    th.ls += '{"id":"' + child.attr("id") + '","type":""},';
                }
                th.ls = "[" + th.ls.substr(0, th.ls.length - 1) + "]";
                setTimeout(function () {
                    th.zTop.hide();
                }, 3000);
            } else {
                cl = con.children().length;
                for (i = 0; i < cl; i++) {
                    child = $(con.children()[i]);
                    th.childObj[child.attr("id")] = child;
                }
                con.empty();
                var arr = eval("(" + th.ls + ")");
                var al = arr.length;
                for (i = 0; i < al; i++) {
                    var data = arr[i];
                    var id = data["id"];
                    var type = data["type"];
                    if (type != th.options.closeClass) {
                        con.append(th.childObj[id]);
                    }
                }
                th.zTop.hide();
            }
            con.fadeIn("slow");
        },
        change: function (id) {
            var th = this;
            var con = th.con;
            var pn = th.options.parentName;
            var prt = $("#" + id);
            con.css({
                "pointer-events": "none"
            });
            var cll = con.children().length;
            for (var i = 0; i < cll; i++) {
                var cld = $(con.children()[i]);
                if (cld.attr("id") == id) {
                    prt.css({
                        "-webkit-transition": "-webkit-transform 0.52s ease",
                        "transition": "-webkit-transform 0.52s ease",
                        "-webkit-transform": "translate3d(0px," + (con.offset().top - prt.offset().top) + "px,0px)"
                    });
                    break;
                } else {
                    cld.css({
                        "-webkit-transition": "-webkit-transform 0.52s ease",
                        "transition": "-webkit-transform 0.52s ease",
                        "-webkit-transform": "translate3d(0px," + prt.outerHeight(true) + "px,0px)"
                    });
                }
            }
            var top = '{"id":"' + id + '","type":""}';
            var judgeStr = top;
            if (th.ls.indexOf(id) != -1) {
                if (th.ls.charAt(th.ls.indexOf(top) - 1) == ",") {
                    judgeStr = "," + judgeStr;
                } else {
                    judgeStr += ",";
                }
                th.ls = th.ls.replace(judgeStr, "");
            }
            th.ls = "[" + top + "," + th.ls.substr(1, th.ls.length);
            try {
                window.localStorage.setItem(th.options.storageType, th.ls);
            } catch (e) {

            }
            setTimeout(function () {
                con.children().eq(0).before(prt);
                setTimeout(function () {
                    con.children().attr("style", "");
                    con.attr("style", "");
                }, 0);
            }, 500);
        },
        remove: function (id) {
            if (typeof id != "string") {
                var arr = eval("(" + this.ls + ")");
                id = arr[id]["id"];
            }
            $("#" + id).remove();
            var judgeStr = '{"id":"' + id + '","type":""}';
            if (this.ls.indexOf(id) != -1) {
                this.ls = this.ls.replace(judgeStr, '{"id":"' + id + '","type":"' + this.options.closeClass + '"}');
            }
            try {
                window.localStorage.setItem(this.options.storageType, this.ls);
            } catch (e) {

            }

        },
        add: function (id) {
            if (typeof id != "string") {
                var arr = eval("(" + this.ls + ")");
                id = arr[id]["id"];
            }
            this.con.append(this.childObj[id]);
            var judgeStr = '{"id":"' + id + '","type":"' + this.options.closeClass + '"}';
            if (this.ls.indexOf(id) != -1) {
                if (this.ls.charAt(this.ls.indexOf(judgeStr) - 1) == ",") {
                    judgeStr = "," + judgeStr;
                } else {
                    judgeStr += ",";
                }
                this.ls = this.ls.replace(judgeStr, "");
            }
            var tail = '{"id":"' + id + '","type":""}';
            this.ls = this.ls.substr(0, this.ls.length - 1) + "," + tail + "]";
            try {
                window.localStorage.setItem(this.options.storageType, this.ls);
            } catch (e) {

            }
        },
        manageShow: function () {
            var tC = this.options.tabClass;
            var tA = this.options.tabActive;
            var mCon = this.manageCon;
            var arr = eval("(" + this.ls + ")");
            var al = arr.length;
            for (i = 0; i < al; i++) {
                var id = arr[i]["id"];
                var type = arr[i]["type"];
                var tc = getTc(id, mCon.find(tC));
                if (tc) {
                    if (type == this.options.closeClass) {
                        if (tc.hasClass(tA)) tc.removeClass(tA);
                    } else {
                        tc.addClass(tA);
                    }
                }
            }
        }
    };
    function getTc(id, arr) {
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            var tc = $(arr[i]);
            if (tc.attr("data-id") == id) {
                return tc;
            }
        }
        return null;
    }

    return topEffect;
});