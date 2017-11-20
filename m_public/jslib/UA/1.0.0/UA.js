/**
 * 获取浏览器类型以及版本号
 * 支持国产客户端:qq、微信、微博等.
 * 支持国产浏览器:猎豹浏览器、搜狗浏览器、傲游浏览器、360极速浏览器、360安全浏览器、QQ浏览器、百度浏览器等.
 * 支持国外浏览器:IE,Firefox,Chrome,safari,Opera等.
 * 使用方法:
 * 获取浏览器版本:UA.version
 * 获取浏览器名称(外壳):UA.name
 * @author:tankunpeng
 * @since :2016-9-5
 **/
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        //  CMD
        define('UA/1.0.0/UA', [], function (require) {
            return f(w, require);
        });
    } else if (typeof exports === 'object') {
        //  CommonJS
        module.exports = f(w);
    } else {
        //  browser global
        window.UA = f(w);
    }
})(window, function () {
    'use strict';
    var document = window.document,
        navigator = window.navigator,
        agent = navigator.userAgent.toLowerCase(),
        // IE8+支持.返回浏览器渲染当前文档所用的模式
        // IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
        // IE10:10(兼容模式7||8||9)
        IEMode = document.documentMode,
        // chorme
        chrome = window.chrome || false,
        System = {
            // user-agent
            agent: agent,
            // 是否为IE
            isIE: /msie/.test(agent),
            // Gecko内核
            isGecko: agent.indexOf('gecko') !== -1 && agent.indexOf('like gecko') < 0,
            // webkit内核
            isWebkit: agent.indexOf('webkit') !== -1,
            // 是否为标准模式
            isStrict: document.compatMode === 'CSS1Compat',
            os: {},
            // 是否支持subtitle
            supportSubTitle: function () {
                return 'track' in document.createElement('track');
            },
            // 是否支持scoped
            supportScope: function () {
                return 'scoped' in document.createElement('style');
            },
            // 获取IE的版本号
            ieVersion: function () {
                try {
                    return agent.match(/msie ([\d.]+)/)[1] || 0;
                } catch (e) {
                    console.log('error');
                    return IEMode;
                }
            },
            // Opera版本号
            operaVersion: function () {
                var ver = '0';
                try {
                    if (window.opera) {
                        ver = agent.match(/opera.([\d.]+)/)[1];
                    } else if (agent.indexOf('opr') !== -1) {
                        ver = agent.match(/opr\/([\d.]+)/)[1];
                    }
                } catch (e) {
                    console.log('error');
                    ver = 0;
                }
                return ver;
            },
            // 描述:version过滤.如31.0.252.152 只保留31.0
            versionFilter: function () {
                if (arguments.length === 1 && typeof arguments[0] === 'string') {
                    var version = arguments[0],
                        start = version.indexOf('.');
                    if (start !== -1) {
                        var end = version.indexOf('.', start + 1);
                        if (end !== -1) {
                            return version.substr(0, end);
                        }
                    }
                    return version;
                } else if (arguments.length === 1) {
                    return arguments[0];
                }
                return 0;
            }
        };


    try {
        // 平台类型
        if (agent.indexOf('macintosh') !== -1) {
            System.os = 'Mac';
        } else if (agent.indexOf('windows') !== -1) {
            System.os = 'Windows';
        } else if (agent.indexOf('iphone') !== -1 || agent.indexOf('ipad') !== -1 || agent.indexOf('ios') !== -1) {
            System.os = 'ios';
            try {
                System.osVer = parseInt(agent.match(/os\s+\d+(_\d+)*/g)[0].match(/\d+/g)[0]);
            } catch (e) {
                System.osVer = '9';
            }
        } else if (agent.indexOf('android') !== -1 || agent.indexOf('adr') !== -1 || agent.indexOf('linux;') !== -1) {
            System.os = 'android';
        }

        // 浏览器类型(IE、Opera、Chrome、Safari、Firefox)
        if (System.isIE) {
            System.type = 'IE';
        } else if (window.opera || agent.indexOf('opr') !== -1) {
            System.type = 'Opera';
        } else if (agent.indexOf('chrome') !== -1) {
            System.type = 'Chrome';
        } else if (agent.indexOf('firefox') !== -1) {
            System.type = 'Firefox';
        } else if (agent.indexOf('safari') !== -1 && window.openDatabase) {
            System.type = 'Safari';
        } else {
            System.type = 'unknow';
        }
        // 版本号
        if (System.type === 'IE') {
            System.version = System.ieVersion();
        } else if (System.type === 'Firefox') {
            System.version = agent.match(/firefox\/([\d.]+)/) ? agent.match(/firefox\/([\d.]+)/)[1] : '0';
        } else if (System.type === 'Chrome') {
            System.version = agent.match(/chrome\/([\d.]+)/) ? agent.match(/chrome\/([\d.]+)/)[1] : '0';
        } else if (System.type === 'Opera') {
            System.version = System.operaVersion();
        } else if (System.type === 'Safari') {
            System.version = agent.match(/version\/([\d.]+)/) ? agent.match(/version\/([\d.]+)/)[1] : '0';
        } else {
            System.version = '0';
        }
        // 浏览器外壳
        System.shell = function () {
            // 360判断
            var track = 'track' in document.createElement('track');
            var name = 'unknow';
            if (agent.indexOf('micromessenger') !== -1) {
                // 微信
                System.version = agent.match(/micromessenger\/([\d.]+)/)[1] || System.version;
                name = '微信客户端';
            } else if (agent.indexOf('qq/') !== -1) {
                // QQ客户端
                System.version = agent.match(/qq\/([\d.]+)/)[1] || System.version;
                name = 'QQ客户端';
            } else if (agent.indexOf('weibo') !== -1) {
                // 微博客户端
                System.version = agent.match(/weibo__([\d.]+)/)[1] || System.version;
                name = '微博客户端';
            } else if (agent.indexOf('qzone/') !== -1) {
                // QQZone客户端
                System.version = agent.match(/qzone\/([\d.]+)/)[1] || System.version;
                name = 'QQZone客户端';
            } else if (/firefox\/|fxios\//.test(agent)) {
                // 火狐浏览器
                System.version = agent.match(/(?:firefox\/|fxios\/)(\d+\.\d+)?/) && agent.match(/(?:firefox\/|fxios\/)(\d+\.\d+)?/)[1] || System.version;
                name = '火狐浏览器';
            } else if (agent.indexOf('ucbrowser/') !== -1) {
                // UC浏览器
                System.version = agent.match(/ucbrowser\/([\d.]+)/)[1] || System.version;
                name = 'UC浏览器';
            } else if (agent.indexOf('qqbrowser/') !== -1) {
                // QQ浏览器
                System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                name = 'QQ浏览器';
            } else if (agent.indexOf('sogou') !== -1) {
                // 搜狗浏览器
                System.version = agent.match(/browser\/([\d.]+)/)[1] || System.version;
                name = '搜狗浏览器';
            } else if (agent.indexOf('maxthon') !== -1) {
                // 遨游浏览器
                System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                name = '傲游浏览器';
            } else if (agent.indexOf('baidubrowser') !== -1) {
                // 百度浏览器
                System.version = agent.match(/baidubrowser\/([\d.]+)/)[1] || agent.match(/chrome\/([\d.]+)/)[1];
                name = '百度浏览器';
            } else if (agent.indexOf('lbbrowser') !== -1 || agent.indexOf('liebaofast') !== -1) {
                System.version = agent.match(/lbbrowser\/([\d.]+)/) && agent.match(/lbbrowser\/([\d.]+)/)[1]
                    || agent.match(/liebaofast\/([\d.]+)/) && agent.match(/liebaofast\/([\d.]+)/)[1];
                name = '猎豹浏览器';
            } else if (/samsungbrowser\//.test(agent)) {
                System.version = agent.match(/samsungbrowser\/([\d.]+)/) && agent.match(/samsungbrowser\/([\d.]+)/)[1];
                name = '三星浏览器';
            } else if (agent.indexOf('qhbrowser') !== -1) {
                // 360浏览器
                System.version = agent.match(/qhbrowser\/([\d.]+)/) && agent.match(/qhbrowser\/([\d.]+)/)[1] || System.version;
                name = '360浏览器';
            } else if (agent.indexOf('crios') !== -1) {
                // ios chrome浏览器判断
                System.version = agent.match(/crios\/([\d.]+)/) && agent.match(/crios\/([\d.]+)/)[1] || System.version;
                name = 'Chrome';
            } else if (chrome && System.type !== 'Opera') {
                // 360浏览器 or Chrome
                if (track) {
                    System.version = agent.match(/qhbrowser\/([\d.]+)/) && agent.match(/qhbrowser\/([\d.]+)/)[1] || System.version;
                    var version = parseInt(System.version);
                    name = (version > 48 || version < 10) && track ? 'Chrome' : '360浏览器';
                }
            } else if (System.os === 'ios') {
                var ver = agent.match(/safari\/([\d.]+)/) && parseInt(agent.match(/safari\/([\d.]+)/)[1]);
                if (ver > 1000) {
                    name = 'other';
                } else {
                    name = System.type;
                }

            } else {
                name = 'other';
            }
            return name;
        };

        // 浏览器名称(如果是壳浏览器,则返回壳名称)
        System.name = System.shell();
        // 对版本号进行过滤过处理
        System.version = System.versionFilter(System.version);
    } catch (e) {
        console.error('error:', e);
    }
    return System;
});