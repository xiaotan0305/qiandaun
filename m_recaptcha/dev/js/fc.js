(function(window) {
    "use strict";
    if (typeof window === 'undefined') {
        throw new Error('Fangcheck requires browser environment');
    }

    var document = window.document;
    var Math = window.Math;
    var head = document.getElementsByTagName("head")[0];
    var location = window.location;

    function _Object(obj) {
        this._obj = obj;
    }

    _Object.prototype = {
        _each: function(process) {
            var _obj = this._obj;
            for (var k in _obj) {
                if (_obj.hasOwnProperty(k)) {
                    process(k, _obj[k]);
                }
            }
            return this;
        }
    };

    function Config(config) {
        this._init()._extend(config);
    }

    Config.prototype = {
        _init: function() {
            var config = {
                apiserver: (function(host, href) {
                    var result = 'recaptcha.fang.com';
                    if (host === 'activities.test.m.fang.com' || host === 'activities.m.test.fang.com') {
                        // 测试
                        result = 'recaptcha.test.fang.com';
                        if (href.indexOf('mmdebug') > 0) {
                            result = 'myrecaptcha.test.fang.com';
                        }
                    }
                    return result + '/';
                })(location.host, location.href),
                protocol: location.protocol + '//',
                typePath: '/?c=index&a=getType',
                static_servers: (function(host, href) {
                    var result = 'static.soufunimg.com';
                    if (host === 'activities.test.m.fang.com' || host === 'activities.m.test.fang.com') {
                        // 测试
                        result = 'static.test.soufunimg.com';
                    }
                    return result;
                })(location.host, location.href)
            };
            if (config.apiserver === 'recaptcha.fang.com/') {
                config.protocol = 'https://';
            }
            this._extend(config);
            return this;
        },
        _extend: function(obj) {
            var self = this;
            new _Object(obj)._each(function(key, value) {
                self[key] = value;
            })
            return self;
        }
    };
    var isNumber = function(value) {
        return (typeof value === 'number');
    };
    var isString = function(value) {
        return (typeof value === 'string');
    };
    var isBoolean = function(value) {
        return (typeof value === 'boolean');
    };
    var isObject = function(value) {
        return (typeof value === 'object' && value !== null);
    };
    var isFunction = function(value) {
        return (typeof value === 'function');
    };
    var isArray = function(value) {
        return (Array.isArray && Array.isArray(value) || Object.prototype.toString.call(value) === "[object Array]");
    };
    var callbacks = {};
    var status = {};

    var random = function() {
        return parseInt(Math.random() * 10000) + (new Date()).valueOf();
    };

    var loadScript = function(url, cb) {
        var script = document.createElement("script");
        script.charset = "UTF-8";
        script.async = true;

        script.onerror = function() {
            cb(true);
        };
        var loaded = false;
        script.onload = script.onreadystatechange = function() {
            if (!loaded &&
                (!script.readyState ||
                    "loaded" === script.readyState ||
                    "complete" === script.readyState)) {

                loaded = true;
                setTimeout(function() {
                    cb(false);
                }, 0);
            }
        };
        script.src = url;
        head.appendChild(script);
    };

    var normalizeDomain = function(domain) {
        // special domain: uems.sysu.edu.cn/jwxt/Fangcheck/
        // return domain.replace(/^https?:\/\/|\/.*$/g, ''); uems.sysu.edu.cn
        return domain.replace(/^https?:\/\/|\/$/g, ''); // uems.sysu.edu.cn/jwxt/Fangcheck
    };
    var normalizePath = function(path) {
        path = path.replace(/\/+/g, '/');
        if (path.indexOf('/') !== 0) {
            path = '/' + path;
        }
        return path;
    };
    var normalizeQuery = function(query) {
        if (!query) {
            return '';
        }
        var q = '&';
        new _Object(query)._each(function(key, value) {
            if (isString(value) || isNumber(value) || isBoolean(value)) {
                q = q + encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
            }
        });
        if (q === '&') {
            q = '';
        }
        return q.replace(/&$/, '');
    };
    var makeURL = function(protocol, domain, path, query) {
        domain = normalizeDomain(domain);

        var url = normalizePath(path) + normalizeQuery(query);
        if (domain) {
            url = protocol + domain + url;
        }

        return url;
    };

    var load = function(protocol, domains, path, query, cb) {
        if (!isArray(domains)) {
            domains = [domains];
        }
        var tryRequest = function(at) {
            var url = makeURL(protocol, domains[at], path, query);
            loadScript(url, function(err) {
                if (err) {
                    if (at >= domains.length - 1) {
                        cb(true);
                    } else {
                        tryRequest(at + 1);
                    }
                } else {
                    cb(false);
                }
            });
        };
        tryRequest(0);
    };


    var jsonp = function(domains, path, config, callback) {
        // if (isObject(config.getLib)) {
        //     config._extend(config.getLib);
        //     callback(config);
        //     return;
        // }


        var cb = "fangcheck_" + random();
        window[cb] = function(data) {
            callback(data);
            window[cb] = undefined;
            try {
                delete window[cb];
            } catch (e) {}
        };
        load(config.protocol, domains, path, {
            gt: config.gt,
            challenge: config.challenge,
            time: new Date().getTime(),
            callback: cb
        }, function(err) {
            if (err) {
                console.log(err);
            }
        });
    };

    var throwError = function(errorType, config) {
        var errors = {
            networkError: '网络错误',
            gtTypeError: 'fc字段不是字符串类型'
        };
        if (typeof config.onError === 'function') {
            config.onError(errors[errorType]);
        } else {
            throw new Error(errors[errorType]);
        }
    };

    var detect = function() {
        return window.Fangcheck || document.getElementById("fc_lib");
    };

    if (detect()) {
        status.slide = "loaded";
    }

    window.initFangcheck = function(userConfig, callback) {

        var config = new Config(userConfig);

        if (userConfig.http) {
            config.protocol = userConfig.http;
        // } else if (!userConfig.protocol) {
        //     config.protocol = window.location.protocol + '//';
        }

        // if (isObject(userConfig.getType)) {
        //     config._extend(userConfig.getType);
        // }
        jsonp([config.apiserver], config.typePath, config, function(newConfig) {
            if (config.typePath == "/?c=index&a=getType") {
                newConfig = {
                    code: "100",
                    message: "successed",
                    path: "/common_m/m_recaptcha/js/pc.1.0.0.js",
                    static_servers:'static.test.soufunimg.com',
                    theme:"default"
                };
            }
            if (newConfig.code !== '100') {
                throwError('networkError', newConfig);
                return;
            }
            var type = newConfig.type || 'wap';
            var init = function() {
                config._extend(newConfig);
                config._extend({
                    'load': load
                });
                callback(new window.Fangcheck(config));
            };

            callbacks[type] = callbacks[type] || [];
            var s = status[type] || 'init';
            if (s === 'init') {
                status[type] = 'loading';

                callbacks[type].push(init);

                load(config.protocol, newConfig.static_servers || config.static_servers, newConfig[type] || newConfig.path, null, function(err) {
                    if (err) {
                        status[type] = 'fail';
                        throwError('networkError', config);
                    } else {
                        status[type] = 'loaded';
                        var cbs = callbacks[type];
                        for (var i = 0, len = cbs.length; i < len; i = i + 1) {
                            var cb = cbs[i];
                            if (isFunction(cb)) {
                                cb();
                            }
                        }
                        callbacks[type] = [];
                    }
                });
            } else if (s === "loaded") {
                init();
            } else if (s === "fail") {
                throwError('networkError', config);
            } else if (s === "loading") {
                callbacks[type].push(init);
            }
        });

    };
})(this);