/**
 * 分享功能组件
 */

(function (window, factory) {
    'use strict';
    if (typeof define === 'function') {
        // AMD
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

    /**
     * 截取字符串到固定长度
     * @param str 截取的字符串
     * @param len 截取长度
     * @returns {string}
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

    /**
     * 奖数组对象转换为字符串
     * @param obj 数组对象
     * @returns {string}
     */
    function toStr(obj) {
        var t = [];
        for (var i in obj) {
            var s = i;
            var o = obj[s];
            if (Object.prototype.toString.call(o) === '[object Array]') {
                o = o.join(',');
            }
            if (o !== null ) {
                o = encodeURIComponent(o);
                t.push(s + '=' + o);
            }
        }
        return t.join('&');
    }


    /**
     * 拼接参数
     * @param name 对象名称
     * @param shareObj 分享对象数组
     * @param opt 选项
     */
    function concatUrl(name, shareObj, opt) {
        var n = shareObj[name];
        opt = opt || {};
        var r = n.url;
        var i = n.parse(opt);
        var s = toStr(i);
        r += '?' + s;
        window.location.href = r;
    }

    /**
     * 分享组件对象
     * @param elem 分享组件绑定的点击按钮
     * @param options 参数数组
     * @returns void（无返回值)
     */
    function myShare(elem, options) {
        // 如果页面不存在myShare对象加载此对象
        if (!(this instanceof myShare)) {
            return new myShare(elem, options);
        }
        // 获取绑定对象
        this.container = elem;
        // 获取参数数组
        this.options = extend({}, options);
        // 获取新浪微博分享标题
        this.options.titStr = (typeof this.options.tit_con !== 'undefined') ? this.options.tit_con : this.options.title;
        // qq空间分享标题（titlesina为新房微博分享标题/qq空间分享标题)
        this.options.tit = this.options.titlesina || this.options.title;
        // 分享图片地址
        this.options.PicUrl = this.options.PicUrl || '';
        // 分享来源类型
        this.options.type = this.options.type || 'sf';
        // 分享的url地址
        this.options.url = this.options.backUrl || window.location.href;
        // 分享摘要
        this.options.summary = this.container.getAttribute('data-text') || this.options.summary || '';
        this.creatHTML();
        // 取消分享按钮
        var quitBtn = document.getElementById('quitBtn');
        var that = this;
        quitBtn.onclick = function () {
            that.quit();
        };
        var sharetype = document.getElementById('share_iconbox');
        var iconList = sharetype.childNodes;
        for (var i = 0; i < iconList.length; i++) {
            var el = iconList[i];
            el.onclick =(function (obj) {
                return function () {
                    that.share(obj.name);
                };
            })(el);
        }
    }

    /**
     * 拼接显示分享的html结构
     *
     */
    myShare.prototype.tpl = function () {
        var url = seajs && seajs.data.vars.public;
        if (!url) url = '//static.soufunimg.com/common_m/m_public/';
        var tepl = ['<div class="askpop" id="askpop"><div class="popshare">',
            '<div class="icon_box" id="share_iconbox">',
            '<a href="javascript:void(0);" name="wb"><img src="'+url+'images/s_wb.png">新浪微博</a>',
            '<a href="javascript:void(0);" name="qwb"><img src="'+url+'images/s_ten.png">腾讯微博</a>',
            '<a href="javascript:void(0);" name="qz"><img src="'+url+'images/s_qz.png">QQ空间</a>',
            '</div><div class="m_share_btn"><a href="javascript:void(0);" id="quitBtn">取 消</a></div></div></div>'];
        return tepl.join('');
    };

    /**
     * 生成分享html结构
     * @returns void
     */
    myShare.prototype.creatHTML = function () {
        var oDiv = document.getElementById('askpop');
        // 判断页面上是否已经存在分享的html如果存在则不再创建
        if (oDiv !== null) {
            return false;
        }
        var s = document.createElement('style'), tpl = this.tpl(), c = document.createElement('div');
        c.innerHTML = tpl;
        this.smartTpl = c.querySelector('#askpop');
        s.innerHTML = 'a{text-decoration:none;}.askpop{position:fixed;top:30%;left:50%;border-radius:3px;width:300px;'
            + 'margin:0 0 0 -150px;z-index:1000;background:rgba(0,0,0,0.8);border-radius:3px; }.popshare{ padding:30px 0 25px 0;}'
            + '.popshare .icon_box{ text-align:center; font-size:0;}'
            + '.popshare .icon_box a{display:inline-block;vertical-align:middle;margin:0 15px;font-size:15px;color:#fff;}'
            + '.popshare .icon_box img{margin-bottom:5px;display:block;width:62px;height:57px;}'
            + '.popshare .m_share_btn{ color:#fff; text-align:center;}'
            + '.popshare .m_share_btn a{margin-top:18px;display:inline-block;width:240px;height:34px;line-height:34px;color:#333;font-size:18px;'
            + 'background:#fff;border-radius:3px;}';
        document.body.appendChild(s);
        document.body.appendChild(this.smartTpl);
    };
    /**
     * 分享到新浪微博、分享到qq空间、分享到腾讯微博
     */
    myShare.prototype.share = function (name) {
        var that = this;
        var shareArr = {
            wb: {
                url: 'http://service.weibo.com/share/share.php',
                parse: function () {
                    return {
                        // url地址
                        url:(that.options.url.indexOf('?') > -1) ? that.options.url + '&source=xinlangweibo_fx': that.options.url + '?source=xinlangweibo_fx',
                        // 是否显示分享数目 1显示（可选)
                        count: that.options.count || '',
                        // appkey
                        appkey: '3427098291',
                        // 分享的文字内容（可选)默认为所在页面的title 微博分享摘要（为标题和摘要的组合内容)
                        title: encodeURIComponent(that.options.tit + subStringResult(that.options.titStr + that.options.summary, 160)),
                        // 分享的图片的路径
                        pic: that.options.PicUrl,
                        // 关联用户的UID，分享微博会@该用户(可选)
                        ralateUid: '',
                        // 记录分享来源频道类型 默认为sf
                        sf_source: that.options.type,
                        // 记录分享工具
                        source: 'xinlangweibo_fx'
                    };
                }
            },
            qz: {
                url: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey',
                parse: function () {
                    return {
                        // 分享内容 url
                        url: (that.options.url.indexOf('?') > -1) ? that.options.url + '&source=xinlangweibo_fx': that.options.url + '?source=qqkj_fx',
                        // 是否显示分享总数,显示：'1'，不显示：'0'
                        showcount: '1',
                        // 默认分享理由(可选)
                        desc: subStringResult(that.options.title + that.options.summary, 160),
                        // 分享摘要(可选)
                        summary: subStringResult(that.options.summary, 160),
                        // 分享标题(可选)
                        title: that.options.tit,
                        // 分享来源 如：腾讯网(可选)
                        site: that.options.url,
                        // 分享图片的路径(可选)
                        pics: that.options.PicUrl,
                        // 记录分享来源频道类型 默认为sf
                        sf_source: that.options.type,
                        // 记录分享工具
                        source: 'qqkj_fx'
                    };
                }
            },
            qwb: {
                url: 'http://share.v.t.qq.com/index.php',
                parse: function () {
                    return {
                        // 分享的功能参数
                        c: 'share',
                        // 分享功能参数
                        a: 'index',
                        f: 'f1',
                        m: 1,
                        // appkey
                        appkey: '801192940',
                        // 分享地址
                        url: that.options.url,
                        // 分享标题 腾讯微博的title为标题加摘要的组合内容
                        title: subStringResult(that.options.title + that.options.summary, 160),
                        // 图片地址
                        pic: that.options.PicUrl,
                        // 记录分享来源频道类型 默认为sf
                        sf_source: that.options.type
                    };
                }
            }
        };
        concatUrl(name, shareArr);
    };

    /**
     * 取消分享功能
     */
    myShare.prototype.quit = function () {
        var askpop = document.getElementById('askpop');
        document.body.removeChild(askpop);
    };
    // 判断是否为iel浏览器并且返回版本
    var judgeIe = (function() {
      var win = window;
      var doc = win.document;
      var input = doc.createElement("input");

      var ie = (function () {
        if (win.ActiveXObject === undefined) return null;
        if (!win.XMLHttpRequest) return 6;
        if (!doc.querySelector) return 7;
        if (!doc.addEventListener) return 8;
        if (!win.atob) return 9;
        if (!input.dataset) return 10;
        return 11;
      })();
      return ie;
    })();
  /**
   * 复制链接地址功能
   */
  myShare.prototype.copy = function(){
    var that = this;
    var copyBtn = document.getElementById(that.options.copyBtn);
    // ie8以下浏览器
    if(judge && judgeIe < 8){
      copyBtn.onclick = function(){
        window.clipboardData.setData("Text","this is for ie");
        alert("你已经复制活动链接，赶快粘贴给好友吧,this is ie！");
      }
    }else{
      if(window.Clipboard){
        copyBtn.setAttribute('data-clipboard-text',window.loaction.href);
        var clipboard = new Clipboard('.btn');
        clipboard.on('success', function(e) {
          alert('你已经复制活动链接，赶快粘贴给好友吧,this is clipboard！');
          e.clearSelection();
        });
        clipboard.on('error', function(e) {
          alert('很遗憾，您的浏览器版本过低，复制失败，请手动复制活动链接！');
        });
      }
    }



  }
  return myShare;
});
