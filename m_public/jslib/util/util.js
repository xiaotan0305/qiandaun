define('util/util', ['jquery'], function (require, exports, module) {
    // 引入依赖
    var $ = require('jquery'),
        vars = seajs.data.vars;
    var Util = function () {
        //在这里定义变量
    };
    //在这里定义函数
    Util.prototype.down = function () {
        var bua = navigator.userAgent.toLowerCase();
        if (bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1) {
            window.location = 'https://itunes.apple.com/cn/app/soufun/id413993350?mt=8&ls=1';
        } else if (bua.indexOf('android') != -1) {
            window.location = '//download.3g.fang.com/SouFun_APP_4.2.3_3100.apk';
        } else {
            window.location = vars.mainSite + 'clientindex.jsp?city=bj';
        }
    };
    //获取以及重置焦点函数
    Util.prototype.seFocus = function (textarea) {
        textarea.focus();
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(textarea[0]);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    };
    Util.prototype.getparam = function (str, name) {
        var paraString = str.split(';');
        var paraObj = {};
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf('~')).toLowerCase()] = j.substring(j.indexOf('~') + 1, j.length);
        }
        return paraObj[name];
    };
    ////页面滚动函数
    Util.prototype.topPosition = function (obj) {
        var $obj = $(obj);
        var p = $('#replyPostPosition');
        if ($obj == p) {
            $('.comBoxMain').hide();
        }
        if ($('#nav').is(':visible')) $('#nav').hide();
        var length = $obj.offset().top - 51;
        if (length) {
            $('body').animate({
                scrollTop: length
            });
        }
        $('header').css({
            position: 'fixed',
            width: '100%',
            top: '0',
            display: 'block'
        });
    };
    //添加历史记录
    Util.prototype.showrewrite = function () {
        var content = historyName + '_' + postList_url;
        try {
            localStorage.setItem('bbs_last_acc', content);
        } catch (e) {

        }
        window.location.href = postList_url;
    };

    Util.prototype.logout = function () {
        var url = window.location.href + '&r=' + Math.random();
        if (confirm('您确定要退出系统吗？'))
            jQuery.ajax({
                url: '?c=bbs&a=ajaxLogout&r=' + Math.random(),
                success: function (stat) {
                    window.location = url;
                }
            });
    };
    Util.prototype.login = function (back) {
        var burl = back != undefined ? back : window.location.href;
        var url = 'https://m.fang.com/passport/login.aspx?burl=' + encodeURIComponent(burl);
        window.location = url + '&r=' + Math.random();
    };
    Util.prototype.getCookie = function (name) {
        var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            var str;
            try {
                str = decodeURIComponent(arr[2]);
            } catch (e) {
                str = unescape(arr[2]);
            }
            return str;
        }
        return '';
    };
    Util.prototype.setCookie = function (name, value, days) {
        if (days === 0) {
            document.cookie = name + '=' + encodeURIComponent(value);
            return;
        }
        var exp = new Date();
        isNaN(days) && (days = 3);
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; expires=' + exp.toGMTString();
    };
    Util.prototype.delCookie = function (e) {
        var t = new Date;
        t.setTime(t.getTime() - 1);
        var n = this.getCookie(e);
        n && (document.cookie = e + '=' + n + ';expires=' + t.toGMTString() + '; path=/');
    };

    /**
     * 获取地址栏参数
     * @param key 无参数返回json对象
     * @returns {*}
     */
    Util.prototype.getQuery = function (url,key) {
        var search = url.split('?');
        var queryStr = search.length > 1 ? search[1] : '';
        var value = undefined;
        var json = {};

        if (queryStr) {
            var arr = queryStr.split('&');
            for (var i = 0, len = arr.length; i < len; i++) {
                var arr2 = arr[i].split('=');
                json[arr2[0]] = arr2[1];
                if (arr2[0] === key) {
                    value = arr2[1];
                }
            }
        }
        return key && typeof key === 'string' ? decodeURIComponent(value) : json;
    };

    /**
     * 获取地址栏参数
     * @param json json对象
     * @returns {*}
     */
    Util.prototype.setQuery = function (json) {
        var arr = [];
        for (var name in json) {
            if (json.hasOwnProperty(name)) {
                var value = json[name];
                var str = '';
                if (typeof value === 'object') {
                    str = name + '=' + JSON.stringify(value);
                } else {
                    str = name + '=' + value;
                }
                arr.push(str);
            }
        }
        return arr.join('&');
    };

    // 暴露对应接口
    module.exports = new Util();
});