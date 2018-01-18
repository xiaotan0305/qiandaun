/*
 * @Author: tankunpeng@fang.com
 * @Date: 2018-01-18 16:16:48
 * @Last Modified by: tankunpeng@fang.com
 * @Last Modified time: 2018-01-18 17:19:32
 * @Description: 网页分享调用app插件
 * 增加qq 微信 等自定义分享地址
 */
(function(w, f) {
    if (typeof define === 'function') {
        // CMD
        define('superShare/2.0.2/superShare', ['jquery', 'UA/1.0.0/UA'], function(require) {
            var $ = require('jquery');
            w.UA = require('UA/1.0.0/UA');
            return f(w, $);
        });
    } else if (typeof module.exports === 'object') {
        // CommonJS
        module.exports = f(w);
    } else {
        window.SuperShare = f(w);
    }
})(window, function(win, $) {
    var vars = null,
        seajs = window.seajs;
    if (seajs && seajs.data && seajs.data.vars) {
        vars = seajs.data.vars;
    }
    win.Base64Obj = {
        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        encode: function(a) {
            a = this.utf8Encode(a);
            var b, c, d, e, f, g, h, i = '', j = 0;
            for (a; j < a.length;) {
                b = a.charCodeAt(j++);
                c = a.charCodeAt(j++);
                d = a.charCodeAt(j++);
                e = b >> 2;
                f = (3 & b) << 4 | c >> 4;
                g = (15 & c) << 2 | d >> 6;
                h = 63 & d;
                isNaN(c) ? g = h = 64 : isNaN(d) && (h = 64);
                i = i + this.keyStr.charAt(e) + this.keyStr.charAt(f) + this.keyStr.charAt(g) + this.keyStr.charAt(h);
            }
            return i;
        },
        decode: function(a) {
            a = a.replace(/[^A-Za-z0-9+/=]/g, '');
            var b, c, d, e, f, g, h, i = '', j = 0;
            for (a; j < a.length;) {
                e = this.keyStr.indexOf(a.charAt(j++));
                f = this.keyStr.indexOf(a.charAt(j++));
                g = this.keyStr.indexOf(a.charAt(j++));
                h = this.keyStr.indexOf(a.charAt(j++));
                b = e << 2 | f >> 4;
                c = (15 & f) << 4 | g >> 2;
                d = (3 & g) << 6 | h;
                i += String.fromCharCode(b);
                g !== 64 && (i += String.fromCharCode(c));
                h !== 64 && (i += String.fromCharCode(d));
            }
            i = this.utf8Decode(i);
            return i;
        },
        utf8Encode: function(a) {
            a = a.replace(/\r\n/g, '\n');
            var b = '';
            for (var c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                if (d < 128) {
                    b += String.fromCharCode(d);
                } else if (d > 127 && d < 2048) {
                    b += String.fromCharCode(d >> 6 | 192);
                    b += String.fromCharCode(63 & d | 128);
                } else {
                    b += String.fromCharCode(d >> 12 | 224);
                    b += String.fromCharCode(d >> 6 & 63 | 128);
                    b += String.fromCharCode(63 & d | 128);
                }
            }
            return b;
        },
        utf8Decode: function(a) {
            var b = '';
            for (var c = 0, d = 0, c1 = 0, c2 = 0; c < a.length;) {
                d = a.charCodeAt(c);
                if (d < 128) {
                    b += String.fromCharCode(d);
                    c++;
                } else if (d > 191 && d < 224) {
                    c2 = a.charCodeAt(c + 1);
                    c += 2;
                } else {
                    c2 = a.charCodeAt(c + 1);
                    c1 = a.charCodeAt(c + 2);
                    b += String.fromCharCode((15 & d) << 12 | (63 & c2) << 6 | 63 & c1);
                    c += 3;
                }
            }
            return b;
        }
    };
    var Base64Obj = win.Base64Obj;


    /**
     * 拼接分享的链接地址
     * @param shareUrl 分享的链接地址
     * @param obj
     * @returns {*} 分享的链接地址
     */
    function concatUrl(shareUrl, obj) {
        var reg, key, str;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
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
            if (obj.hasOwnProperty(key)) {
                reg = new RegExp(key + '=' + obj[key], 'g');
                shareUrl = shareUrl.replace(reg, '');
            }
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
        script.onload = script.onreadystatechange = function() {
            if (this.readyState && this.readyState !== 'loaded' && this.readyState !== 'complete') {
                fun && fun();
                script.onload = script.onreadystatechange = null;
                script.parentNode.removeChild(script);
            }
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
        setTimeout(function() {
            div && div.parentNode && div.parentNode.removeChild(div);
        }, 5000);
    }

    /**
     * 分享功能实现基础类
     */
    function SuperShareClass(config) {
        // 配置信息初始化
        config = config || {};
        this.config = config;
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
        this.ua = win.UA;
        if (!win.UA) {
            console.error('请引入UA.js');
            return;
        }
        this.agent = navigator.userAgent.toLowerCase();
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

        // 浮层插入页面
        this.shareFloat.appendTo(body);
        this.safariFloat.appendTo(body);
        this.weixinFloat.appendTo(body);
        this.otherFloat.appendTo(body);
        this.floatMask.appendTo(body);

        // 初始化
        this.init();
    }

    SuperShareClass.prototype = {
        constructor: SuperShareClass,

        /**
         * 设备信息初始化
         */
        init: function() {
            var that = this;
            var ua = this.ua;

            /**
             * [qApiSrc QQ浏览器分享API地址]
             */
            that.qApiSrc = {
                lower: '//3gimg.qq.com/html5/js/qb.js',
                higher: '//jsapi.qq.com/get?api=app.share'
            };

            /**
             * [version 记录QQ浏览器和UC浏览器的版本号]
             */
            that.version = {
                uc: '',
                qq: ''
            };
            that.version.qq = that.ua.name === 'QQ浏览器' ? this.getVersion(that.agent.split('mqqbrowser/')[1]) : 0;
            that.version.uc = that.ua.name === 'UC浏览器' ? this.getVersion(that.agent.split('ucbrowser/')[1]) : 0;

            // 获取浏览器参数
            if (ua.name === 'QQ浏览器') {
                that.loadqqApi(function() {
                    that.shareWechatByQQBrowser();
                });
            } else {
                ua.name === 'UC浏览器' && (ua.version = this.getVersion(that.agent.split('ucbrowser/')[1]));
            }
            // 添加浮层事件
            that.shareFloat.find('.btn').on('click', function() {
                that.hideFloat();
            });
            that.safariFloat.add(that.weixinFloat).add(that.otherFloat).find('.share-btn').on('click', function() {
                $('.share-s2').hide();
            });
            that.floatMask.on('click', function() {
                that.hideFloat();
            });

            // 分享按钮点击监听事件处理
            $('.sns').on('click', function(ev) {
                var shareType = $(this).attr('data-app');
                that.hideFloat();
                if (that.ua.name === 'PinganWifi') {
                    that.pinganWifiShareTo(shareType);
                } else {
                    that.shareto(shareType, ev);
                }
            });
        },

        /**
         * 隐藏浮层
         */
        hideFloat: function() {
            var that = this;
            that.shareFloat.hide();
            that.floatMask.removeClass('mask-visible');
        },

        /**
         * 信息弹层
         * @param text 文本内容
         * @param time 显示时间
         * @param callback 回调函数
         */
        showMsg: function(text, time, callback) {
            text = text || '信息有误！';
            time = time || 1500;
            var that = this;
            that.msgObj.find('p').html(text);
            that.msgObj.fadeIn();
            clearTimeout(that.timer);
            that.timer = setTimeout(function() {
                that.msgObj.fadeOut();
                callback && callback();
            }, time);
        },

        /**
         * 浮层显示
         * @param obj 对象
         * @param time 显示时间
         * @param callback 回调函数
         */
        showObj: function(obj, time, callback) {
            time = time || '';
            var that = this;
            obj.fadeIn();
            if (time) {
                clearTimeout(that.timer2);
                that.timer2 = setTimeout(function() {
                    obj.fadeOut();
                    callback && callback();
                }, time);
            }
        },

        /**
         * 获取浏览器的版本
         */
        getVersion: function(device) {
            var arr = device.split('.');
            return parseFloat(arr[0] + '.' + arr[1]);
        },

        /**
         * 分享到网页版qq空间
         */
        shareWebQzone: function() {
            var a = 'http://openmobile.qq.com/api/check2?page=qzshare.html&loginpage=loginindex.html&logintype=qzone',
                b = this.desc.substring(0, 200),
                c = ['title=' + encodeURIComponent(this.title), 'imageUrl=' + encodeURIComponent(this.image), 'desc='
                + encodeURIComponent(b), 'summary=' + encodeURIComponent(b), 'url=' + this.url, 'successUrl='
                + this.url, 'failUrl=' + this.url, 'callbackUrl=' + this.url].join('&');
            win.location.href = a + '&' + c;
        },

        /**
         * 分享功能的实现
         * @param shareType 分享到的平台类型
         *           qq qq好友
         *           qzone qq空间
         *           wechattimeline 微信朋友圈
         *           wechatfriends 微信好友
         *           sinaweibo 新浪微博平台
         */
        shareto: function(shareType) {
            var that = this;
            // 判断是否含详细设置
            var shareTypeConfig = that.config[shareType];
            if (!shareTypeConfig || !typeof shareTypeConfig === 'object') {
                shareTypeConfig = {};
            }
            // 分享的网址
            var shareUrl = shareTypeConfig.url || that.url,
                // 设备信息
                ua = that.ua,
                // 分享的内容title
                title = shareTypeConfig.title || that.title,
                // 分享的内容的详细描述
                desc = shareTypeConfig.desc || that.desc,
                // 分享时的图片logo
                sharePic = shareTypeConfig.image || that.image,
                // 分享信息来源
                from = shareTypeConfig.from || that.from,
                // 分享失败的错误回调方法
                failCallback = shareTypeConfig.failCallback || that.failCallback,
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
                };
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
                setTimeout(function() {
                    failCallback && failCallback();
                    if (ua.name === 'Chrome' || ua.os === 'android' && ua.name === '火狐浏览器') {
                        that.showObj(that.weixinFloat);
                    } else if (ua.name !== 'Safari') {
                        that.showObj(that.otherFloat);
                    }
                }, 1000);
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
                setTimeout(function() {
                    failCallback && failCallback();
                    if (ua.name === 'Chrome' || ua.os === 'android' && ua.name === '火狐浏览器') {
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
                    var browser = win.browser;
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
                        } else if (!/huawei/.test(ua.agent)) {
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
                            if (ua.name === 'Chrome' || ua.os === 'android' && ua.name === '火狐浏览器') {
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
        },

        /**
         * [shareByUC 调用 UC浏览器 原生分享]
         */
        shareByUC: function() {
            var that = this;
            var ucweb = win.ucweb,
                ucbrowser = win.ucbrowser;
            // 调用原生分享菜单无法判断分享渠道，暂时统一到微信
            var url = concatUrl(that.url, {
                source: 'weixinpengyouquan_fx'
            });
            if (typeof ucweb !== 'undefined') {
                ucweb.startRequest('shell.page_share', [that.title, that.desc, url, '', '', '', '']);
            } else if (typeof ucbrowser !== 'undefined') {
                ucbrowser.web_share(that.title, that.desc, url, '', '', '', '');
            }
        },

        /**
         * shareByQQ 调用 QQ浏览器 原生分享
         */
        shareByQQ: function(shareType) {
            var that = this;
            var browser = win.browser;
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
            } else if (typeof win.qb !== 'undefined') {
                win.qb.share(ah);
            }
        },

        /**
         * shareBytdApp 调用 房天下土地app原生分享弹层
         */
        shareBytdApp: function() {
            var that = this;
            if (/SFLand_iOS/i.test(this.agent)) {
                shareiOS(that.url, that.title, that.image);
            }else if (/SFLand_Android/i.test(this.agent)) {
                jsObj.shareAndroid(that.url, that.title, that.image);
            }
        },

        /**
         * 在pinganWifi环境下分享功能的实现
         * @param shareType 分享到的平台类型
         *           qq qq好友
         *           qzone qq空间
         *           wechattimeline 微信朋友圈
         *           wechatfriends 微信好友
         *           sinaweibo 新浪微博平台
         */
        pinganWifiShareTo: function(shareType) {
            var that = this;
            // 判断是否含详细设置
            var shareTypeConfig = that.config[shareType];
            if (!shareTypeConfig || !typeof shareTypeConfig === 'object') {
                shareTypeConfig = {};
            }
            // 分享的网址
            var shareUrl = shareTypeConfig.url || that.url,
                // 分享的内容title
                title = shareTypeConfig.title || that.title,
                // 分享的内容的详细描述
                desc = shareTypeConfig.desc || that.desc,
                // 分享时的图片logo
                sharePic = shareTypeConfig.image || that.image;
            // 分享地址
            shareUrl = concatUrl(shareUrl, {
                _once_: shareType + '_pinganwifi'
            });
            if (shareType === 'sohuwd') {
                var type;
                if (typeof gallery === 'undefined') {
                    type = 3;
                } else {
                    type = 4;
                }
                win.location.href = concatUrl('http://h5.t.sohu.com/feed/share', {
                    url: shareUrl,
                    id: that.newsid,
                    type: type,
                    title: title,
                    pic: sharePic,
                    passport: that.sohupassport
                });
            } else {
                win.location.href = concatUrl('pawifishare://', {
                    method: 'sohuShare',
                    shareType: shareType,
                    title: Base64Obj.encode(title || ''),
                    url: Base64Obj.encode(shareUrl),
                    subtitle: Base64Obj.encode(desc || ''),
                    imgurl: Base64Obj.encode(sharePic || '')
                });
            }
        },

        /**
         * 通过QQ浏览器进行微信分享的操作
         */
        shareWechatByQQBrowser: function() {
            var that = this;
            var str = win.location.href.match(/shareApp=(\w+)/i);
            if (str) {
                var shareType = str[1];
                if ($.isFunction(history.replaceState)) {
                    history.replaceState(null, document.title, location.href.replace(/&shareApp=wechatfriends/g, ''));
                    history.replaceState(null, document.title, location.href.replace(/&shareApp=wechattimeline/g, ''));
                    that.shareto(shareType);
                }
            }
        },

        /**
         * 加载QQ浏览器分享API
         */
        loadqqApi: function(fn) {
            var that = this;
            // 如果版本低于5.4，用旧版本api，否则用新api
            var b = that.version.qq < 5.4 ? that.qApiSrc.lower : that.qApiSrc.higher;
            var d = document.createElement('script');
            var a = document.getElementsByTagName('body')[0];
            d.src = b;
            a.appendChild(d);
            d.onload = function() {
                fn && fn();
            };
        },

        /**
         * 分享
         */
        share: function() {
            var that = this;
            var ua = that.ua;
            // 判断浏览器类型;
            // 房天下app
            if (vars && vars.isFangApp) {
                that.weixinFloat.show();
                // 土地app
            } else if (/SFLand_iOS|SFLand_Android/i.test(this.agent)) {
                that.shareBytdApp();
            } else if (ua.name === '微信客户端' || ua.name === '微博客户端' || ua.name === 'QQ客户端' || ua.name === 'QQZone客户端') {
                that.weixinFloat.show();
            } else if (ua.name === 'UC浏览器') {
                that.shareByUC();
            } else if (ua.name === 'QQ浏览器') {
                that.shareByQQ();
            } else {
                that.floatMask.addClass('mask-visible');
                that.shareFloat.show();
            }
        },

        /**
         * 更新新配置信息
         * @param config
         */
        updateConfig: function(config) {
            var that = this;
            that.url = config.url || document.location.href || '';
            that.title = config.title || $('title').text() || '';
            that.desc = config.desc || $('meta[name=description]').attr('content') || that.title;
            // 设置分享时的图片
            that.image = config.image || '';
            that.from = config.from || '房天下';
            that.successCallback = config.successCallback || '';
            that.failCallback = config.failCallback || '';
        }
    };

    // 设置私有变量，该基础类不暴漏出去
    var superShareClass;

    function SuperShare(config) {
        this.options = config;
        superShareClass = new SuperShareClass(this.options);
    }

    SuperShare.prototype = {
        constructor: SuperShare,

        /**
         * 分享
         */
        share: function() {
            superShareClass.share();
        },

        /**
         * 更新新配置信息
         * @param config
         */
        updateConfig: function(ops) {
            superShareClass.updateConfig(ops);
        }
    };
    return SuperShare;
});