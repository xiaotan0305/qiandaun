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
        define('superShare/1.0.0/superShare', function (require) {
            return f(w, require);
        });
    } else if (typeof exports === 'object') {
        //  CommonJS
        module.exports = f(w);
    } else {
        //  browser global
        window.SuperShare = f(w);
    }
})(window, function (win, require) {
    win.Base64 = {
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        encode: function (a) {
            var b, c, d, e, f, g, h, i = '', j = 0;
            for (a = Base64._utf8_encode(a); j < a.length;)
                b = a.charCodeAt(j++),
                    c = a.charCodeAt(j++),
                    d = a.charCodeAt(j++),
                    e = b >> 2,
                    f = (3 & b) << 4 | c >> 4,
                    g = (15 & c) << 2 | d >> 6,
                    h = 63 & d,
                    isNaN(c) ? g = h = 64 : isNaN(d) && (h = 64),
                    i = i + this._keyStr.charAt(e) + this._keyStr.charAt(f) + this._keyStr.charAt(g) + this._keyStr.charAt(h);
            return i
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
            return i = Base64._utf8_decode(i)
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
            return b
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
                shareUrl.match(reg) ? shareUrl = shareUrl.replace(reg, '$1' + str) : shareUrl += -1 === shareUrl.indexOf('?') ? '?' + key + '=' + str : '&' + key + '=' + str;
            }
            return shareUrl;
        }

        /**
         * 转化分享的链接地址
         * @param shareUrl 分享的链接地址
         * @param obj
         * @returns {*} 分享的链接地址
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
                    script.parentNode.removeChild(script))
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
                div && div.parentNode && div.parentNode.removeChild(div)
            }, 5e3);
        }

        /**
         * 配置信息初始化
         */
        config = config || {};
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
        // 增加弹层
        this.msgObj = $('<div id="msg"><p>分享失败！请直接复制链接并打开客户端进行分享！</p></div>');
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
        }).appendTo($(document.body));

        var h = {
            share: config.shareOnceCode || '000022_share_',
            shareback: config.sharebackOnceCode || '000022_shareback_'
        };
        var ua = navigator.userAgent.toLowerCase();
        this.device = {
            os: {
                version: 0,
                isiOS: ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ios') > -1,
                isAndroid: ua.indexOf('android') > -1 || ua.indexOf('adr') > -1 || ua.indexOf('linux;') > -1
            },
            browser: {
                version: 0,
                isQQ: ua.indexOf('mqqbrowser/') > -1,
                isUC: ua.indexOf('ucbrowser/') > -1,
                isWechat: ua.indexOf('micromessenger') > -1,
                isWeibo: ua.indexOf('weibo') > -1,
                isSamsung: ua.indexOf('samsungbrowser/') > -1,
                isSogou: ua.indexOf('sogoumobilebrowser/') > -1,
                isPinganWifi: ua.indexOf('pawifi') > -1
            }
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
            var shareUrl,
                $this = this,
                // 设备信息
                device = this.device,
                // 分享的内容title
                title = this.title,
                // 分享的内容的详细描述
                desc = this.desc,
                // 分享时的图片logo
                sharePic = this.image,
                // 分享信息来源
                from = this.from,
                // 分享的新闻的newsid
                newsid = this.newsid,
                // 分享失败的错误回调方法
                failCallback = this.failCallback,
                n = 0, timer;
            if (device.browser.isUC) {
                shareUrl = concatUrl(this.url, {
                    _once_: h.shareback + shareType + '_uc'
                });
            } else if (device.browser.isQQ) {
                shareUrl = concatUrl(this.url, {
                    _once_: h.shareback + shareType + '_qq'
                });
            } else if (device.browser.isSogou) {
                shareUrl = concatUrl(this.url, {
                    _once_: h.shareback + shareType + '_sogou'
                });
            } else {
                shareUrl = concatUrl(this.url, {
                    _once_: h.shareback + shareType
                });
            }

            if (shareType === 'sohuwd') {
                var type;
                if (typeof gallery === 'undefined') {
                    type = 3;
                } else {
                    type = 4;
                }
                win.location.href = concatUrl('http://h5.t.sohu.com/feed/share', {
                    url: shareUrl,
                    id: newsid,
                    type: type,
                    title: title,
                    pic: sharePic,
                    passport: this.sohupassport
                });
            } else if (shareType === 'qzone') {
                shareUrl = Base64.encode(shareUrl),
                    sharePic = Base64.encode(sharePic),
                    title = Base64.encode(title),
                    desc = Base64.encode(desc),
                    from = Base64.encode(from);
                var deviceUrl = {
                    android: 'mqqapi://share/to_qzone?src_type=app&version=1&file_type=news&req_type=1',
                    ios: 'mqqapi://share/to_fri?file_type=news&src_type=app&version=1&generalpastboard=1&shareType=1&cflag=1&objectlocation=pasteboard&callback_type=scheme&callback_name=QQ41AF4B2A&'
                }, t = Date.now();
                if (device.os.isAndroid) {
                    if (device.browser.isUC) {
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
                } else {
                    win.location.href = concatUrl(deviceUrl.ios, {
                        url: shareUrl,
                        previewimageUrl: sharePic,
                        title: title,
                        description: desc,
                        thirdAppDisplayName: from
                    });
                }
                setTimeout(function () {
                    failCallback && failCallback();
                    var con = device.browser.isWechat || device.browser.isWeibo ? '分享失败！请使用自带功能进行分享！' : '分享失败！请直接复制链接并打开客户端进行分享！';
                    $this.showMsg(con);
                }, 1e3)
            } else if (shareType === 'qq') {
                win.location.href = concatUrl('mqqapi://share/to_fri?src_type=web&version=1&file_type=news', {
                    share_id: '1101685683',
                    title: Base64.encode(title),
                    thirdAppDisplayName: Base64.encode('房天下'),
                    url: Base64.encode(shareUrl)
                });
                setTimeout(function () {
                    failCallback && failCallback();
                    var con = device.browser.isWechat || device.browser.isWeibo ? '分享失败！请使用自带功能进行分享！' : '分享失败！请直接复制链接并打开客户端进行分享！';
                    $this.showMsg(con);
                }, 1000);
            } else if (shareType === 'wechatfriends' || shareType === 'wechattimeline' || shareType === 'sinaweibo') {
                if (device.browser.isUC) {
                    if (device.os.isiOS && 'undefined' !== typeof ucbrowser) {
                        shareType = this.appList[shareType][0];
                        ucbrowser.web_share(title, title, shareUrl, shareType, '', ' @' + from + ' ', '');
                    } else if (typeof ucweb != 'undefined') {
                        shareType = this.appList[shareType][1];
                        ucweb.startRequest('shell.page_share', [title, title + ' @' + from + ' ', shareUrl, shareType, '', '', '']);
                    } else {
                        console.log('UCBrowser native share bypass.');
                    }
                } else if (device.browser.isQQ) {
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
                } else if (device.browser.isSogou) {
                    var obj = {
                        shareTitle: title,
                        shareContent: desc,
                        shareImageUrl: sharePic,
                        shareUrl: shareUrl,
                        shareSnapshotTab: '',
                        shareType: null
                    };
                    if (shareType === 'wechatfriends' || shareType === 'wechattimeline') {
                        if (shareType === 'wechatfriends') {
                            obj.shareType = 2;
                        } else if (shareType === 'wechattimeline') {
                            obj.shareType = 4;
                            if (SogouMse && SogouMse.Utility && SogouMse.Utility.shareWithInfo) {
                                SogouMse.Utility.shareWithInfo(obj);
                            } else {
                                console.log('sogouBrowser native share error.');
                                setTimeout(function () {
                                    failCallback && failCallback();
                                    var con = device.browser.isWechat || device.browser.isWeibo ? '分享失败！请使用自带功能进行分享！' : '分享失败！请直接复制链接并打开客户端进行分享！';
                                    $this.showMsg(con);
                                }, 1000);
                            }
                        }
                    } else {
                        win.location.href = concatUrl('http://service.weibo.com/share/share.php?', {
                            title: encodeURIComponent(title),
                            url: encodeURIComponent(shareUrl),
                            appkey: '217550396',
                            pic: sharePic,
                            ralateUid: '1934323297',
                            count: 'n',
                            size: 'middle'
                        });
                    }
                } else if (shareType === 'wechatfriends' || shareType === 'wechattimeline') {
                    shareUrl = formatUrl(shareUrl, {
                        _once_: '000022_shareback_' + shareType
                    });
                    shareUrl = concatUrl(shareUrl, {
                        shareApp: shareType
                    });
                    if (device.os.isiOS && device.os.version > 8) {
                        win.location.href = 'mttbrowser://url=' + shareUrl;
                    } else {
                        g('mttbrowser://url=' + shareUrl);
                    }
                    var w = function x() {
                        n += 1;
                        if (n < 3) {
                            clearTimeout(timer);
                            timer = setTimeout(x, 600);
                        } else {
                            failCallback && failCallback();
                            var con = device.browser.isWechat || device.browser.isWeibo ? '分享失败！请使用自带功能进行分享！' : '分享失败！请直接复制链接并打开客户端进行分享！';
                            $this.showMsg(con);
                        }
                    };
                    timer = setTimeout(w, 600);
                } else {
                    if (shareType === 'sinaweibo') {
                        win.location.href = concatUrl('http://service.weibo.com/share/share.php?', {
                            title: encodeURIComponent(title),
                            url: encodeURIComponent(shareUrl),
                            appkey: '217550396',
                            pic: sharePic,
                            ralateUid: '1934323297',
                            count: 'n',
                            size: 'middle'
                        });
                    }
                }
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
                })
            } else {
                win.location.href = concatUrl('pawifishare://', {
                    method: 'sohuShare',
                    shareType: shareType,
                    title: Base64.encode(this.title || ''),
                    url: Base64.encode(shareUrl),
                    subtitle: Base64.encode(this.desc || ''),
                    imgurl: Base64.encode(this.image || '')
                });
            }
        };
        var $this = this;

        /**
         * 通过QQ浏览器进行微信分享的操作
         */
        this.shareWechatByQQBrowser = function () {
            var str = win.location.href.match(/shareApp=(\w+)/i);
            if (str) {
                var shareType = str[1];
                if ($.isFunction(history.replaceState)) {
                    history.replaceState(null, document.title, location.href.replace(/shareApp=wechatfriends/g, ''));
                    history.replaceState(null, document.title, location.href.replace(/shareApp=wechattimeline/g, ''));
                    $this.shareto(shareType);
                }
            }
        };

        /**
         * 设备信息初始化
         */
        this.init = function () {
            var device = this.device;
            if (device.browser.isQQ) {
                if (typeof browser === 'undefined') {
                    f('http://jsapi.qq.com/get?api=app.share', function () {
                        $this.shareWechatByQQBrowser();
                    });
                } else {
                    $this.shareWechatByQQBrowser();
                    device.browser.version = this.getVersion(ua.split('mqqbrowser/')[1]);
                }
            } else {
                device.browser.isUC && (device.browser.version = this.getVersion(ua.split('ucbrowser/')[1]));
                device.os.isiOS && (device.os.version = parseInt(ua.match(/\s*os\s*\d/gi)[0].split(' ')[2], 10));
            }
        };
        this.init();
        // 分享按钮点击监听事件处理
        $('.sns').on('click', function (ev) {
            var shareType = $(this).attr('data-app');
            if ($this.device.browser.isPinganWifi) {
                $this.pinganWifiShareTo(shareType);
            } else {
                $this.shareto(shareType, ev);
            }
        });
        return this;
    }

    return SuperShare;
});