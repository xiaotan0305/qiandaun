/**
 * 分享功能组件
 */

(function (window, factory) {
    'use strict';
    if (typeof define === 'function') {
        // cMD
        define('share/share', [], function () {
            return factory(window);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        window.myShare = factory(window);
    }
})(window, function factory(window) {
        'use strict';
        var $ = window.jQuery;
       // var console = window.console;
        // var hasConsole = typeof console !== 'undefined';

        /**
         * 截取字符串
         *
         */
        function subStringResult(str, len) {
            var newLength = 0;
            var newStr = '';
            var chineseRegex = /[^\x00-\xff]/g;
            var singleChar = '';
            var strLength = str.replace(chineseRegex, '**').length;
            for (var i = 0; i < strLength; i++) {
                singleChar = str.charAt(i).toString();
                if (singleChar.match(chineseRegex) !== null) {
                    newLength += 2;
                } else {
                    newLength++;
                }
                if (newLength > len) {
                    break;
                }
                newStr += singleChar;
            }

            if (strLength > len) {
                newStr += '...';
            }
            return newStr;
        }

        // extend objects
        function extend(a, b) {
            for (var prop in b) {
                if (b.hasOwnProperty(prop)) {
                    a[prop] = b[prop];
                }
            }
            return a;
        }

        var objToString = Object.prototype.toString;

        function isArray(obj) {
            return objToString.call(obj) === '[object Array]';
        }

        // turn element or nodeList into an array
        function makeArray(obj) {
            var ary = [];
            if (isArray(obj)) {
                // use object if already an array
                ary = obj;
            } else if (typeof obj.length === 'number') {
                // convert nodeList to array
                for (var i = 0, len = obj.length; i < len; i++) {
                    ary.push(obj[i]);
                }
            } else {
                // array of single index
                ary.push(obj);
            }
            return ary;
        }

        function concatUrl(url, name, value) {
            var res = '';
            if (url.indexOf('?') > -1) {
                res = url + '&' + name + '=' + value;
            } else {
                res = url + '?' + name + '=' + value;
            }
            return res;
        }

        var dis = true;

        function myShare(elem, options, callsBAck) {
            if (!(this instanceof myShare)) {
                return new myShare(elem, options);
            }
            this.container = elem;
            this.options = extend({}, options);
            this.creatHTML();
            var quitBtn = document.getElementById('quitBtn');
            var that = this;
            quitBtn.onclick = function () {
                that.quit();
            };
            var sharetype = document.getElementById('share_iconbox');
            var iconList = sharetype.childNodes;
            for (var i = 0; i < iconList.length; i++) {
                iconList[i].onclick = function () {
                    that.share(this.name);
                };
            }
        }

        myShare.prototype.tpl = function () {
            var tepl = ['<div class="askpop" id="askpop"><div class="popshare">',
                '<div class="icon_box" id="share_iconbox">',
                '<a href="javascript:void(0);" name="wb"><img src="//js.soufunimg.com/common_m/m_ask/images/s_wb.png">新浪微博</a>',
                '<a href="javascript:void(0);" name="qwb"><img src="//js.soufunimg.com/common_m/m_ask/images/s_ten.png">腾讯微博</a>',
                '<a href="javascript:void(0);" name="qz"><img src="//js.soufunimg.com/common_m/m_ask/images/s_qz.png">QQ空间</a>',
                '</div><div class="m_share_btn"><a href="javascript:void(0);" id="quitBtn">取 消</a></div></div></div>'];
            return tepl.join('');
        };
        myShare.prototype.creatHTML = function () {
            var oDiv = document.getElementById('askpop');
            if (oDiv !== null) {
                return false;
            }
            var s = document.createElement('style'), tpl = this.tpl(), c = document.createElement('div');
            c.innerHTML = tpl;
            this.smartTpl = c.querySelector('#askpop');
            s.innerHTML = 'a{text-decoration:none;}.askpop{position:fixed;top:30%;left:50%;border-radius:3px;width:300px;margin:0 0 0 -150px;z-index:1000;background:rgba(0,0,0,0.8);border-radius:3px; }.popshare{ padding:30px 0 25px 0;}.popshare .icon_box{ text-align:center; font-size:0;}.popshare .icon_box a{display:inline-block;vertical-align:middle;margin:0 15px;font-size:15px;color:#fff;}.popshare .icon_box img{margin-bottom:5px;display:block;width:62px;height:57px;}.popshare .m_share_btn{ color:#fff; text-align:center;}.popshare .m_share_btn a{margin-top:18px;display:inline-block;width:240px;height:34px;line-height:34px;color:#333;font-size:18px;background:#fff;border-radius:3px;}';
            document.body.appendChild(s);
            document.body.appendChild(this.smartTpl);
        };

        myShare.prototype.quit = function () {
            var askpop = document.getElementById('askpop');
            document.body.removeChild(askpop);
            if (typeof this.options.onCancellation !== 'undefined') {
                this.options.onCancellation();
            }
        };
        // 分享到新浪微博、分享到qq空间、分享到腾讯微博
        myShare.prototype.share = function (name) {
            var con = this.container.getAttribute('data-text') || this.options.summary;
            var ru = this.options.backUrl || window.location.href;
            var type = this.options.type || 'sf';
            con = subStringResult(con, 160);
            type += name;
            ru = encodeURIComponent(concatUrl(ru, 'sf_source', type));
            var rt = encodeURI(this.options.titlesina) || encodeURI(this.options.title);
            var content = encodeURI($.trim(con));
            var picUrl = encodeURI(this.options.PicUrl) || '';
            var titStr = (typeof this.options.tit_con !== 'undefined') ? this.options.tit_con : this.options.title;
            var _t_s = titStr + $.trim(con);
            _t_s = subStringResult(_t_s, 160);
            _t_s = encodeURI(_t_s);
            var _t = this.options.title + $.trim(con);
            _t = subStringResult(_t, 160);
            _t = encodeURI(_t);
            var shareUrls = new Array();
            shareUrls['wb'] = 'http://service.weibo.com/share/share.php?url=' + ru + '&title=' + rt + _t_s + '&pic=' + picUrl + '&st=' + Math.random() + '&appkey=3427098291&type=3&dpc=1';
            shareUrls['qwb'] = 'http://share.v.t.qq.com/index.php?c=share&a=index&f=f1&m=1&appkey=801192940&url=' + ru + '&title=' + _t + '&pic=' + picUrl;
            shareUrls['qz'] = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + ru + '&title=' + rt + '&summary=' + content + '&pics=' + picUrl;
            window.location.href = shareUrls[name];
        };
        return myShare;
    });
