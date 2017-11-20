/**
 * Created by tankunpeng on 16/7/22.
 */
/**
 * 进行base64转码功能
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        //  CMD
        define('superShare/1.0.1/superShare', ['jquery', 'UA/1.0.0/UA'], function (require) {
            var $ = require('jquery');
            w.UA = require('UA/1.0.0/UA');
            return f(w, require);
        });
    } else if (typeof exports === 'object') {
        //  CommonJS
        module.exports = f(w);
    } else {
        window.SuperShare = f(w);
    }
})(window, function (win, require) {

    var vars = null,
        seajs = window.seajs;
    if (seajs && seajs.data && seajs.data.vars) {
        vars = seajs.data.vars;
    }
    win.Base64Obj = {
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        encode: function (a) {
            var b, c, d, e, f, g, h, i = '', j = 0;
            for (a = Base64Obj._utf8_encode(a); j < a.length;)
                b = a.charCodeAt(j++),
                    c = a.charCodeAt(j++),
                    d = a.charCodeAt(j++),
                    e = b >> 2,
                    f = (3 & b) << 4 | c >> 4,
                    g = (15 & c) << 2 | d >> 6,
                    h = 63 & d,
                    isNaN(c) ? g = h = 64 : isNaN(d) && (h = 64),
                    i = i + this._keyStr.charAt(e) + this._keyStr.charAt(f) + this._keyStr.charAt(g) + this._keyStr.charAt(h);
            return i;
        },
        decode: function (a) {
            var b, c, d, e, f, g, h, i = '', j = 0;
            for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ''); j < a.length;)
                e = this._keyStr.indexOf(a.charAt(j++)),
                    f = this._keyStr.indexOf(a.charAt(j++)),
                    g = this._keyStr.indexOf(a.charAt(j++)),
                    h = this._keyStr.indexOf(a.charAt(j++)),
                    b = e << 2 | f >> 4,
                    c = (15 & f) << 4 | g >> 2,
                    d = (3 & g) << 6 | h,
                    i += String.fromCharCode(b),
                64 != g && (i += String.fromCharCode(c)),
                64 != h && (i += String.fromCharCode(d));
            return i = Base64Obj._utf8_decode(i);
        },
        _utf8_encode: function (a) {
            a = a.replace(/\r\n/g, '\n');
            for (var b = '', c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
                    b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                    b += String.fromCharCode(d >> 6 & 63 | 128),
                    b += String.fromCharCode(63 & d | 128))
            }
            return b;
        },
        _utf8_decode: function (a) {
            for (var b = '', c = 0, d = c1 = c2 = 0; c < a.length;)
                d = a.charCodeAt(c),
                    128 > d ? (b += String.fromCharCode(d),
                        c++) : d > 191 && 224 > d ? (c2 = a.charCodeAt(c + 1),
                        b += String.fromCharCode((31 & d) << 6 | 63 & c2),
                        c += 2) : (c2 = a.charCodeAt(c + 1),
                        c3 = a.charCodeAt(c + 2),
                        b += String.fromCharCode((15 & d) << 12 | (63 & c2) << 6 | 63 & c3),
                        c += 3);
            return b;
        }
    };

    /**
     * 分享功能实现
     */
    function SuperShare(config) {

        /**
         * 拼接分享的链接地址
         * @param shareUrl 分享的链接地址
         * @param obj
         * @returns {*} 分享的链接地址
         */
        function concatUrl(shareUrl, obj) {
            var reg, key, str;
            for (key in obj) {
                str = obj[key];
                reg = new RegExp('(' + key + '=)[^&]+', 'i');
                if (shareUrl.match(reg)) {
                    shareUrl = shareUrl.replace(reg, '$1' + str);
                } else if (shareUrl.indexOf('?') === -1) {
                    shareUrl += '?' + key + '=' + str;
                } else {
                    shareUrl += '&' + key + '=' + str;
                }
            }
            return shareUrl;
        }

        /**
         * 删除的链接指定的参数
         * @param shareUrl 分享的链接地址
         * @param obj 要删除的参数对象
         * @returns {*} 处理后的链接地址
         */
        function formatUrl(shareUrl, obj) {
            var reg;
            for (var key in obj) {
                reg = new RegExp(key + '=' + obj[key], 'g');
                shareUrl = shareUrl.replace(reg, '');
            }
            return shareUrl;
        }

        /**
         * 获取地址参数
         * @param url 链接地址
         * @returns {*} 处理后的json对象
         */
        function getUrlParam(url) {
            var json = {};
            var tmparr = url.split('?');
            if (tmparr.length === 2) {
                url = tmparr[1];
                var arr = url.split('&');
                for (var i = 0; i < arr.length; i++) {
                    var arr2 = arr[i].split('=');
                    json[arr2[0]] = arr2[1];
                }
            }
            return json;
        }

        /**
         * 通过QQBrowser分享给微信时给body动态添加shareJsApi
         * @param shareJsApi
         * @param fun 分享时的处理方法
         */
        function f(shareJsApi, fun) {
            var script = document.createElement('script');
            var body = document.getElementsByTagName('body')[0];
            script.setAttribute('src', shareJsApi);
            script.onload = script.onreadystatechange = function () {
                this.readyState && 'loaded' != this.readyState && 'complete' != this.readyState || (fun && fun(),
                    script.onload = script.onreadystatechange = null ,
                    script.parentNode.removeChild(script));
            };
            body.appendChild(script);
        }

        /**
         * 低版本ios<8  动态生成iframe 调用 微信朋友或者朋友圈
         * @param url
         */
        function g(url) {
            var div = document.createElement('div');
            div.style.visibility = 'hidden';
            div.innerHTML = '<iframe src= "' + url + '" scrolling="no" width="1" height="1"></iframe>';
            document.body.appendChild(div);
            setTimeout(function () {
                div && div.parentNode && div.parentNode.removeChild(div);
            }, 5000);
        }


        /**
         * 配置信息初始化
         */
        config = config || {};
        var that = this;
        this.url = config.url || document.location.href || '';
        this.title = config.title || $('title').text() || '';
        this.desc = config.desc || $('meta[name=description]').attr('content') || this.title;
        // 设置分享时的图片
        this.image = config.image || '';
        this.from = config.from || '房天下';
        this.newsid = config.newsid || '';
        this.sohupassport = config.passport || '';
        this.appList = {
            sinaweibo: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
            wechatfriends: ['kWeixin', 'WechatFriends', 1, '微信好友'],
            wechattimeline: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
            qq: ['kQQ', 'QQ', '4', 'QQ好友'],
            qzone: ['kQZone', 'QZone', '3', 'QQ空间']
        };
        this.successCallback = config.successCallback || '';
        this.failCallback = config.failCallback || '';
        this.timer = null;
        this.timer2 = null;
        this.ua = window.UA;
        if (!window.UA) {
            console.error('请引入UA.js');
            return;
        }
        var agent = navigator.userAgent.toLowerCase();
        if (this.ua.name === '微信客户端') {
            this.url += '&source=weixin_fx';
        }
        // 增加弹层
        this.msgObj = $('<div id="msg"><p>分享失败！请直接复制链接并打开客户端进行分享！</p></div>');
        var body = $(document.body);
        this.msgObj.css({
            position: 'fixed',
            left: '50%',
            top: '90%',
            zIndex: 1999,
            textAlign: 'center',
            width: '11rem',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '0.5rem',
            marginLeft: '-5.5rem',
            marginTop: '-4rem',
            borderRadius: '0.4rem',
            color: '#fff',
            fontSize: '14px',
            display: 'none'
        }).appendTo(body);

        this.imgUrl = '//static.' + (location.origin.indexOf('test') !== -1 ? 'test.' : '') + 'soufunimg.com/common_m/m_public/201511/images/';
        // 浮层
        this.shareFloat = $('<div class="share-s1 none"><h2>分享到</h2><div class="shareCon"><ul>'
            + '<li class="sns" data-app="wechattimeline"><a href="javascript:;"><i class="pyq"></i><p>朋友圈</p></a></li>'
            + '<li class="sns" data-app="wechatfriends"> <a href="javascript:;"><i class="wx"></i><p>微信好友</p></a></li>'
            + '<li class="sns" data-app="qq"><a href="javascript:;"><i class="qq"></i><p>QQ好友</p></a></li>'
            + '</ul><ul>'
            + '<li class="sns" data-app="qzone"><a href="javascript:;"><i class="zoom"></i><p>QQ空间</p></a></li>'
            + '<li class="sns" data-app="sinaweibo"><a href="javascript:;"><i class="wb"></i><p>新浪微博</p></a></li>'
            // + '<li class="sns" data-app="copy"><a href="javascript:;"><i class="copy"></i><p>复制</p></a></li>'
            + '</ul></div><div class="btn"><a href="javascript:;">取消</a></div></div>');

        // safari专用提示弹层
        this.safariFloat = $('<div class="share-s2 bg2 none"><div class="pic3"><img src="'
            + this.imgUrl + 'share_a1.png" width="100%">'
            + '<img src="' + this.imgUrl + 'share_a2.png" width="100%"><img src="'
            + this.imgUrl + 'share_a3.png" width="100%">'
            + '<img src="' + this.imgUrl + 'share_a4.png" width="100%"></div><a href="javascript:;" class="share-btn"><img src="'
            + this.imgUrl + 'share_know.png"></a></div>');
        // 微信浏览器提示弹层
        this.weixinFloat = $('<div class="share-s2 none"><div class="pic1"><img src="'
            + this.imgUrl + 'share_pic1.png" width="100%"></div>'
            + '<a href="javascript:;" class="share-btn"><img src="'
            + this.imgUrl + 'share_know.png"></a></div>');
        // 其他浏览器提示弹层
        this.otherFloat = $('<div class="share-s2 none"><div class="share-b"><a href="javascript:;" class="share-btn"><img src="'
            + this.imgUrl + 'share_know.png"></a>' + '<div class="pic2"><img src="'
            + this.imgUrl + 'share_pic2.png" width="100%"></div></div></div>');
        // 遮罩层
        this.floatMask = $('<div class="float-mask"></div>');

        this.shareFloat.appendTo(body).find('.btn').on('click', function () {
            that.hideFloat();
        });
        this.safariFloat.appendTo(body);
        this.weixinFloat.appendTo(body);
        this.otherFloat.appendTo(body);
        this.floatMask.appendTo(body);

        this.safariFloat.add(this.weixinFloat).add(this.otherFloat).find('.share-btn').on('click', function () {
            $('.share-s2').hide();
        });

        this.hideFloat = function () {
            that.shareFloat.hide();
            that.floatMask.removeClass('mask-visible');
        };

        /**
         * 信息弹层
         * @param text 文本内容
         * @param time 显示时间
         * @param callback 回调函数
         */
        this.showMsg = function (text, time, callback) {
            text = text || '信息有误！';
            time = time || 1500;
            var that = this;
            that.msgObj.find('p').html(text);
            that.msgObj.fadeIn();
            clearTimeout(that.timer);
            that.timer = setTimeout(function () {
                that.msgObj.fadeOut();
                callback && callback();
            }, time);
        };

        /**
         * 浮层显示
         * @param obj 对象
         * @param time 显示时间
         * @param callback 回调函数
         */
        this.showObj = function (obj, time, callback) {
            time = time || '';
            var that = this;
            obj.fadeIn();
            if (time) {
                clearTimeout(that.timer2);
                that.timer2 = setTimeout(function () {
                    obj.fadeOut();
                    callback && callback();
                }, time);
            }
        };

        /**
         * 获取浏览器的版本
         */
        this.getVersion = function (device) {
            var arr = device.split('.');
            return parseFloat(arr[0] + '.' + arr[1]);
        };
        this.shareWebQzone = function () {
            var a = 'http://openmobile.qq.com/api/check2?page=qzshare.html&loginpage=loginindex.html&logintype=qzone',
                b = this.desc.substring(0, 200),
                c = ['title=' + encodeURIComponent(this.title), 'imageUrl=' + encodeURIComponent(this.image), 'desc='
                + encodeURIComponent(b), 'summary=' + encodeURIComponent(b), 'url=' + this.url, 'successUrl='
                + this.url, 'failUrl=' + this.url, 'callbackUrl=' + this.url].join('&');
            win.location.href = a + '&' + c;
        };

        /**
         * 分享功能的实现
         * @param shareType 分享到的平台类型
         *           qq qq好友
         *           qzone qq空间
         *           wechattimeline 微信朋友圈
         *           wechatfriends 微信好友
         *           sinaweibo 新浪微博平台
         */
        this.shareto = function (shareType) {
            // 分享的网址
            var shareUrl = this.url,
                that = this,
                // 设备信息
                ua = this.ua,
                // 分享的内容title
                title = this.title,
                // 分享的内容的详细描述
                desc = this.desc,
                // 分享时的图片logo
                sharePic = this.image,
                // 分享信息来源
                from = this.from,
                // 分享失败的错误回调方法
                failCallback = this.failCallback,
                n = 0, timer;


            if (shareType === 'qzone') {
                shareUrl = Base64Obj.encode(concatUrl(shareUrl, {
                    source: 'qqkj_fx'
                }));
                sharePic = Base64Obj.encode(sharePic);
                title = Base64Obj.encode(title);
                desc = Base64Obj.encode(desc);
                from = Base64Obj.encode(from);
                var deviceUrl = {
                    android: 'mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1',
                    ios: 'mqqapi://share/to_fri?file_type=news&src_type=app&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A&'
                }, t = Date.now();
                if (ua.os === 'android') {
                    if (ua.name === 'UC浏览器') {
                        g(concatUrl(deviceUrl.android, {
                            url: shareUrl,
                            image_url: sharePic,
                            title: title,
                            description: desc,
                            app_name: from
                        }));
                    } else {
                        win.location.href = concatUrl(deviceUrl.android, {
                            url: shareUrl,
                            previewimageUrl: sharePic,
                            title: title,
                            description: desc,
                            thirdAppDisplayName: from
                        });
                    }
                } else if (ua.name !== 'Safari') {
                    win.location.href = concatUrl(deviceUrl.ios, {
                        url: shareUrl,
                        previewimageUrl: sharePic,
                        title: title,
                        description: desc,
                        thirdAppDisplayName: from
                    });
                } else {
                    that.showObj(that.safariFloat);
                }
                setTimeout(function () {
                    failCallback && failCallback();
                    if (ua.name === 'Chrome' || (ua.os === 'android' && ua.name === '火狐浏览器')) {
                        that.showObj(that.weixinFloat);
                    } else if (ua.name !== 'Safari') {
                        that.showObj(that.otherFloat);
                    }
                }, 1e3);
            } else if (shareType === 'qq') {
                shareUrl = concatUrl(shareUrl, {
                    source: 'qq_fx'
                });
                if (ua.name !== 'Safari') {
                    win.location.href = concatUrl('mqqapi://share/to_fri?src_type=web&version=1&file_type=news', {
                        share_id: '1101685683',
                        title: Base64Obj.encode(title),
                        thirdAppDisplayName: Base64Obj.encode('房天下'),
                        url: Base64Obj.encode(shareUrl)
                    });
                } else {
                    that.showObj(that.safariFloat);
                }
                setTimeout(function () {
                    failCallback && failCallback();
                    if (ua.name === 'Chrome' || (ua.os === 'android' && ua.name === '火狐浏览器')) {
                        that.showObj(that.weixinFloat);
                    } else if (ua.name !== 'Safari') {
                        that.showObj(that.otherFloat);
                    }
                }, 1000);
            } else if (shareType === 'wechatfriends' || shareType === 'wechattimeline') {
                if (ua.name === 'QQ浏览器') {
                    shareType = this.appList[shareType][2];
                    var obj = {
                        url: shareUrl,
                        title: title,
                        img_url: sharePic,
                        to_app: shareType,
                        cus_txt: title + ' @房天下 '
                    };
                    if (browser && browser.app && browser.app.share) {
                        browser.app.share(obj);
                    } else {
                        console.log('QQBrowser native share bypass.');
                    }
                } else {
                    shareUrl = concatUrl(shareUrl, {
                        shareApp: shareType,
                        source: shareType === 'wechatfriends' ? 'weixinhaoyou_fx' : 'weixinpengyouquan_fx'
                    });
                    if (ua.name !== 'Safari') {
                        if (ua.os === 'ios' && ua.osVer > 8) {
                            win.location.href = 'mttbrowser://url=' + shareUrl;
                        } else {
                            g('mttbrowser://url=' + shareUrl);
                        }
                    } else {
                        that.showObj(that.safariFloat);
                    }
                    var w = function x() {
                        n += 1;
                        if (n < 3) {
                            clearTimeout(timer);
                            timer = setTimeout(x, 600);
                        } else {
                            failCallback && failCallback();
                            if (ua.name === 'Chrome' || (ua.os === 'android' && ua.name === '火狐浏览器')) {
                                that.showObj(that.weixinFloat);
                            } else if (ua.name !== 'Safari') {
                                that.showObj(that.otherFloat);
                            }
                        }
                    };
                    timer = setTimeout(w, 600);
                }
            } else if (shareType === 'sinaweibo') {
                shareUrl = concatUrl(shareUrl, {
                    source: 'xinlangweibo_fx'
                });
                var sharePage = concatUrl('http://service.weibo.com/share/mobile.php?', {
                    title: title,
                    url: shareUrl,
                    appkey: '3427098291',
                    pic: sharePic,
                    ralateUid: '',
                    count: '',
                    size: 'middle'
                });
                win.location.href = 'https://passport.weibo.cn/signin/login?entry=mweibo&res=wel&wm=3349&r=' + encodeURIComponent(sharePage);
            }
        };

        /**
         * 在pinganWifi环境下分享功能的实现
         * @param shareType 分享到的平台类型
         *           qq qq好友
         *           qzone qq空间
         *           wechattimeline 微信朋友圈
         *           wechatfriends 微信好友
         *           sinaweibo 新浪微博平台
         */
        this.pinganWifiShareTo = function (shareType) {
            // 分享地址
            var shareUrl = concatUrl(this.url, {
                _once_: h.shareback + shareType + '_pinganwifi'
            });
            console.log('inter pingan wifi');
            if (shareType === 'sohuwd') {
                var type;
                if (typeof gallery === 'undefined') {
                    type = 3;
                } else {
                    type = 4;
                }
                win.location.href = concatUrl('http://h5.t.sohu.com/feed/share', {
                    url: shareUrl,
                    id: this.newsid,
                    type: type,
                    title: this.title,
                    pic: this.image,
                    passport: this.sohupassport
                });
            } else {
                win.location.href = concatUrl('pawifishare://', {
                    method: 'sohuShare',
                    shareType: shareType,
                    title: Base64Obj.encode(this.title || ''),
                    url: Base64Obj.encode(shareUrl),
                    subtitle: Base64Obj.encode(this.desc || ''),
                    imgurl: Base64Obj.encode(this.image || '')
                });
            }
        };

        /**
         * 通过QQ浏览器进行微信分享的操作
         */
        this.shareWechatByQQBrowser = function () {
            var str = win.location.href.match(/shareApp=(\w+)/i);
            if (str) {
                var shareType = str[1];
                if ($.isFunction(history.replaceState)) {
                    history.replaceState(null, document.title, location.href.replace(/&shareApp=wechatfriends/g, ''));
                    history.replaceState(null, document.title, location.href.replace(/&shareApp=wechattimeline/g, ''));
                    that.shareto(shareType);
                }
            }
        };

        /**
         * [qApiSrc QQ浏览器分享API地址]
         */
        var qApiSrc = {
            lower: '//3gimg.qq.com/html5/js/qb.js',
            higher: '//jsapi.qq.com/get?api=app.share'
        };

        /**
         * [version 记录QQ浏览器和UC浏览器的版本号]
         */
        var version = {
            uc: '',
            qq: ''
        };
        version.qq = that.ua.name === 'QQ浏览器' ? this.getVersion(agent.split('mqqbrowser/')[1]) : 0;
        version.uc = that.ua.name === 'UC浏览器' ? this.getVersion(agent.split('ucbrowser/')[1]) : 0;

        /**
         * [loadqqApi 加载QQ浏览器分享API]
         */
        this.loadqqApi = function (fn) {
            // 如果版本低于5.4，用旧版本api，否则用新api
            var b = version.qq < 5.4 ? qApiSrc.lower : qApiSrc.higher;
            var d = document.createElement('script');
            var a = document.getElementsByTagName('body')[0];
            d.src = b;
            a.appendChild(d);
            d.onload = function () {
                fn && fn();
            };
        };

        /**
         * [shareByUC 调用 UC浏览器 原生分享]
         */
        this.shareByUC = function () {
            // 调用原生分享菜单无法判断分享渠道，暂时统一到微信
            var url = concatUrl(that.url, {
                source: 'weixinpengyouquan_fx'
            });
            if (typeof(ucweb) != 'undefined') {
                ucweb.startRequest('shell.page_share', [that.title, that.desc, url, '', '', '', '']);
            } else {
                if (typeof(ucbrowser) != 'undefined') {
                    ucbrowser.web_share(that.title, that.desc, url, '', '', '', '');
                } else {
                }
            }
        };

        /**
         * [shareByQQ 调用 QQ浏览器 原生分享]
         */
        this.shareByQQ = function (shareType) {
            // 调用原生分享菜单无法判断分享渠道，暂时统一到微信
            var url = concatUrl(that.url, {
                source: 'weixinpengyouquan_fx'
            });
            var ah = {
                url: url,
                title: that.title,
                description: that.desc,
                img_url: that.ua.os === 'android' ? '' : that.image,
                // 微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
                toApp: shareType || '',
                cusTxt: that.title + ' @房天下'
            };
            if (typeof browser !== 'undefined') {
                if (typeof browser.app !== 'undefined') {
                    browser.app.share(ah);
                }
            } else {
                if (typeof window.qb !== 'undefined') {
                    window.qb.share(ah);
                }
            }
        };

        /**
         * shareBytdApp 调用 房天下土地app原生分享弹层
         */
        this.shareBytdApp = function () {
            var that = this;
            if (/SFLand_iOS/i.test(agent)) {
                shareiOS(that.url, that.title, that.image);
            } else if (/SFLand_Android/i.test(agent)) {
                jsObj.shareAndroid(that.url, that.title, that.image);
            }
        };

        // 更新新配置信息
        this.updateConfig = function (config) {
            this.url = config.url || document.location.href || '';
            this.title = config.title || $('title').text() || '';
            this.desc = config.desc || $('meta[name=description]').attr('content') || this.title;
            // 设置分享时的图片
            this.image = config.image || '';
            this.from = config.from || '房天下';
            this.successCallback = config.successCallback || '';
            this.failCallback = config.failCallback || '';
        };

        /**
         * 设备信息初始化
         */
        this.init = function () {
            var ua = this.ua;
            // 获取浏览器参数
            if (ua.name === 'QQ浏览器') {
                that.loadqqApi(function () {
                    that.shareWechatByQQBrowser();
                });
            } else {
                ua.name === 'UC浏览器' && (ua.version = this.getVersion(agent.split('ucbrowser/')[1]));
            }
        };
        this.init();
        // 分享按钮点击监听事件处理
        $('.sns').on('click', function (ev) {
            var shareType = $(this).attr('data-app');
            that.hideFloat();
            if (that.ua.name === 'PinganWifi') {
                that.pinganWifiShareTo(shareType);
            } else {
                that.shareto(shareType, ev);
            }
        });
        that.floatMask.on('click', function () {
            that.hideFloat();
        });

        $('.share').on('click', function () {
            var ua = that.ua;
            // 判断浏览器类型;

            // 房天下app
            if (vars && vars.isFangApp) {
                that.weixinFloat.show();
                // 土地app
            } else if (/SFLand_iOS|SFLand_Android/i.test(agent)) {
                that.shareBytdApp();
            } else if (ua.name === '微信客户端' || ua.name === '微博客户端' || ua.name === 'QQ客户端' || ua.name === 'QQZone客户端') {
                that.weixinFloat.show();
            } else if (ua.name === 'UC浏览器' && (ua.os === 'android' && ua.version < 11 || ua.os === 'ios')) {
                that.shareByUC();
            } else if (ua.name === 'QQ浏览器') {
                that.shareByQQ();
            } else {
                that.floatMask.addClass('mask-visible');
                that.shareFloat.show();
            }
        });
    }

    return SuperShare;
});