var tool = require('./util/tool.js');
var encryptor = {
    LZString: {
        compress: function (uncompressed) {
            var that = this;
            return this.baseCompress(uncompressed, 16, function (a) {
                return that.toChart16(String.fromCharCode(a));
            });
        },
        baseCompress: function (uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed === null) return '';
            var i, value,
                contextDictionary = {},
                contextDictionaryToCreate = {},
                contextC = '',
                contextWc = '',
                contextW = '',
                // Compensate for the first entry which should not count
                contextEnlargeIn = 2,
                contextDictSize = 3,
                contextNumBits = 2,
                contextData = [],
                contextDataVal = 0,
                contextDataPosition = 0,
                ii;

            for (ii = 0; ii < uncompressed.length; ii += 1) {
                contextC = uncompressed.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(contextDictionary, contextC)) {
                    contextDictionary[contextC] = contextDictSize++;
                    contextDictionaryToCreate[contextC] = true;
                }

                contextWc = contextW + contextC;
                if (Object.prototype.hasOwnProperty.call(contextDictionary, contextWc)) {
                    contextW = contextWc;
                } else {
                    if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
                        if (contextW.charCodeAt(0) < 256) {
                            for (i = 0; i < contextNumBits; i++) {
                                contextDataVal = (contextDataVal << 1);
                                if (contextDataPosition == bitsPerChar - 1) {
                                    contextDataPosition = 0;
                                    contextData.push(getCharFromInt(contextDataVal));
                                    contextDataVal = 0;
                                } else {
                                    contextDataPosition++;
                                }
                            }
                            value = contextW.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                contextDataVal = (contextDataVal << 1) | (value & 1);
                                if (contextDataPosition == bitsPerChar - 1) {
                                    contextDataPosition = 0;
                                    contextData.push(getCharFromInt(contextDataVal));
                                    contextDataVal = 0;
                                } else {
                                    contextDataPosition++;
                                }
                                value = value >> 1;
                            }
                        } else {
                            value = 1;
                            for (i = 0; i < contextNumBits; i++) {
                                contextDataVal = (contextDataVal << 1) | value;
                                if (contextDataPosition == bitsPerChar - 1) {
                                    contextDataPosition = 0;
                                    contextData.push(getCharFromInt(contextDataVal));
                                    contextDataVal = 0;
                                } else {
                                    contextDataPosition++;
                                }
                                value = 0;
                            }
                            value = contextW.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                contextDataVal = (contextDataVal << 1) | (value & 1);
                                if (contextDataPosition == bitsPerChar - 1) {
                                    contextDataPosition = 0;
                                    contextData.push(getCharFromInt(contextDataVal));
                                    contextDataVal = 0;
                                } else {
                                    contextDataPosition++;
                                }
                                value = value >> 1;
                            }
                        }
                        contextEnlargeIn--;
                        if (contextEnlargeIn == 0) {
                            contextEnlargeIn = Math.pow(2, contextNumBits);
                            contextNumBits++;
                        }
                        delete contextDictionaryToCreate[contextW];
                    } else {
                        value = contextDictionary[contextW];
                        for (i = 0; i < contextNumBits; i++) {
                            contextDataVal = (contextDataVal << 1) | (value & 1);
                            if (contextDataPosition == bitsPerChar - 1) {
                                contextDataPosition = 0;
                                contextData.push(getCharFromInt(contextDataVal));
                                contextDataVal = 0;
                            } else {
                                contextDataPosition++;
                            }
                            value = value >> 1;
                        }


                    }
                    contextEnlargeIn--;
                    if (contextEnlargeIn == 0) {
                        contextEnlargeIn = Math.pow(2, contextNumBits);
                        contextNumBits++;
                    }
                    // Add wc to the dictionary.
                    contextDictionary[contextWc] = contextDictSize++;
                    contextW = String(contextC);
                }
            }

            // Output the code for w.
            if (contextW !== '') {
                if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
                    if (contextW.charCodeAt(0) < 256) {
                        for (i = 0; i < contextNumBits; i++) {
                            contextDataVal = (contextDataVal << 1);
                            if (contextDataPosition == bitsPerChar - 1) {
                                contextDataPosition = 0;
                                contextData.push(getCharFromInt(contextDataVal));
                                contextDataVal = 0;
                            } else {
                                contextDataPosition++;
                            }
                        }
                        value = contextW.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            contextDataVal = (contextDataVal << 1) | (value & 1);
                            if (contextDataPosition == bitsPerChar - 1) {
                                contextDataPosition = 0;
                                contextData.push(getCharFromInt(contextDataVal));
                                contextDataVal = 0;
                            } else {
                                contextDataPosition++;
                            }
                            value = value >> 1;
                        }
                    } else {
                        value = 1;
                        for (i = 0; i < contextNumBits; i++) {
                            contextDataVal = (contextDataVal << 1) | value;
                            if (contextDataPosition == bitsPerChar - 1) {
                                contextDataPosition = 0;
                                contextData.push(getCharFromInt(contextDataVal));
                                contextDataVal = 0;
                            } else {
                                contextDataPosition++;
                            }
                            value = 0;
                        }
                        value = contextW.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            contextDataVal = (contextDataVal << 1) | (value & 1);
                            if (contextDataPosition == bitsPerChar - 1) {
                                contextDataPosition = 0;
                                contextData.push(getCharFromInt(contextDataVal));
                                contextDataVal = 0;
                            } else {
                                contextDataPosition++;
                            }
                            value = value >> 1;
                        }
                    }
                    contextEnlargeIn--;
                    if (contextEnlargeIn == 0) {
                        contextEnlargeIn = Math.pow(2, contextNumBits);
                        contextNumBits++;
                    }
                    delete contextDictionaryToCreate[contextW];
                } else {
                    value = contextDictionary[contextW];
                    for (i = 0; i < contextNumBits; i++) {
                        contextDataVal = (contextDataVal << 1) | (value & 1);
                        if (contextDataPosition == bitsPerChar - 1) {
                            contextDataPosition = 0;
                            contextData.push(getCharFromInt(contextDataVal));
                            contextDataVal = 0;
                        } else {
                            contextDataPosition++;
                        }
                        value = value >> 1;
                    }


                }
                contextEnlargeIn--;
                if (contextEnlargeIn == 0) {
                    contextEnlargeIn = Math.pow(2, contextNumBits);
                    contextNumBits++;
                }
            }

            // Mark the end of the stream
            value = 2;
            for (i = 0; i < contextNumBits; i++) {
                contextDataVal = (contextDataVal << 1) | (value & 1);
                if (contextDataPosition == bitsPerChar - 1) {
                    contextDataPosition = 0;
                    contextData.push(getCharFromInt(contextDataVal));
                    contextDataVal = 0;
                } else {
                    contextDataPosition++;
                }
                value = value >> 1;
            }
            // Flush the last char
            while (true) {
                contextDataVal = (contextDataVal << 1);
                if (contextDataPosition == bitsPerChar - 1) {
                    contextData.push(getCharFromInt(contextDataVal));
                    break;
                } else contextDataPosition++;
            }
            return contextData.join('');
        },
        toChart16: function (str) {
            var string = '',
                strLen = str.length;
            for (var i = 0; i < strLen; i++) {
                var item = str.charCodeAt(i).toString(16),
                    len = item.length;
                if (len < 4) {
                    var n = 4 - len;
                    var itemS = '';
                    for (var j = 0; j < n; j++) {
                        itemS += '0';
                    }
                    item = itemS + item;
                } else if (len > 4) {
                    console.log('More than four', item);
                }
                string += item;
            }
            return string;
        }
    },


    /**
     * [encryptTouch 加密用户行为数据]
     * @param  {[type]} b [用户行为数组]
     * @return {[type]}   [加密后的字符串]
     */
    encryptTouch: function (b) {
        function c(b) {
            for (var c = '', d = b.length / 6, e = 0; e < d; e += 1){
                c += j.charAt(window.parseInt(b.slice(6 * e, 6 * (e + 1)), 2));
            }
            return c
        }
        function d(a, b) {
            for (var c = a.toString(2), d = c.length, e = '', f = d + 1; f <= b; f += 1){
                e += '0';
            }
            return c = e + c
        }
        function e(a, b) {
            for (var c = [], d = 0, e = a.length; d < e; d += 1){
                c.push(b(a[d]));
            }
            return c
        }
        function f(a, b) {
            var c = [];
            return e(a, function(a) {
                b(a) && c.push(a)
            }),
            c
        }
        function g(a) {
            a = e(a, function(a) {
                return a > 32767 ? 32767 : a < -32767 ? -32767 : a
            });
            for (var b = a.length, c = 0, d = []; c < b; ) {
                for (var f = 1, g = a[c], h = Math.abs(g); ; ) {
                    if (c + f >= b)
                        break;
                    if (a[c + f] !== g)
                        break;
                    if (h >= 127 || f >= 127)
                        break;
                    f += 1
                }
                f > 1 ? d.push((g < 0 ? 49152 : 32768) | f << 7 | h) : d.push(g),
                c += f
            }
            return d
        }
        function h(a, b) {
            return 0 === a ? 0 : Math.log(a) / Math.log(b)
        }
        function i(a, b) {
            a = g(a);
            var c, i = [], j = [];
            e(a, function(a) {
                var b = Math.ceil(h(Math.abs(a) + 1, 16));
                0 === b && (b = 1),
                i.push(d(b - 1, 2)),
                j.push(d(Math.abs(a), 4 * b))
            });
            var k = i.join('')
              , l = j.join('');
            return c = b ? e(f(a, function(a) {
                return 0 != a && a >> 15 != 1
            }), function(a) {
                return a < 0 ? '1' : '0'
            }).join('') : '',
            d(32768 | a.length, 16) + k + l + c
        }
        var j = '()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~',
            k = {
                touchmove: 0,
                touchstart: 1,
                touchend: 2,
                scroll: 3,
                focus: 4,
                blur: 5,
                unload: 6,
                unknown: 7
            },
            l = function(a) {
                for (var b = [], c = a.length, e = 0; e < c; ) {
                    for (var f = a[e], g = 0; ; ) {
                        if (g >= 16)
                            break;
                        var h = e + g + 1;
                        if (h >= c)
                            break;
                        if (a[h] !== f)
                            break;
                        g += 1
                    }
                    e = e + 1 + g;
                    var i = k[f];
                    0 != g ? (b.push(8 | i),
                    b.push(g - 1)) : b.push(i)
                }
                for (var j = d(32768 | c, 16), l = '', m = 0, n = b.length; m < n; m += 1){
                    l += d(b[m], 4);
                }
                return j + l
            };
        return function(a) {
            for (var b = [], e = [], f = [], g = [], h = 0, j = a.length; h < j; h += 1) {
                var k = a[h]
                  , m = k.length;
                b.push(k[0]),
                e.push(2 === m ? k[1] : k[2]),
                3 === m && (f.push(k[1][0]),
                g.push(k[1][1]))
            }
            var n = l(b)
              , o = i(e, !1)
              , p = i(f, !0)
              , q = i(g, !0)
              , r = n + o + p + q
              , s = r.length;
            return s % 6 != 0 && (r += d(0, 6 - s % 6)),
            c(r)
        }(b)
    },
    encryptedPageInfo: function () {
        var b = window
          , c = this
          , d = this.getPageInfo();
        d.performanceTiming = function() {
            if (encryptor.isUndefined(b.performance))
                return c.wd;
            var a, d, e = b.performance.timing, f = ['navigationStart', 'redirectStart', 'redirectEnd', 'fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart'], g = ['responseEnd', 'unloadEventStart', 'unloadEventEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd', 'msFirstPaint'], h = [];
            for (a = 1,
            d = f.length; a < d; a += 1) {
                var i = e[f[a]];
                if (0 === i)
                    h.push(c.wd);
                else
                    for (var j = a - 1; j >= 0; j -= 1) {
                        var k = e[f[j]];
                        if (0 !== k) {
                            h.push(i - k);
                            break
                        }
                    }
            }
            var l = e[f[f.length - 1]];
            for (a = 0,
            d = g.length; a < d; a += 1) {
                var m = e[g[a]];
                0 === m || encryptor.isUndefined(m) ? h.push(c.wd) : h.push(m - l)
            }
            return h.join(',')
        }(),
        d.timestamp = tool.now();
        var e = [];
        this.getInfoList().map(function(a) {
            var b = d[a];
            e.push(b == undefined ? -1 : b)
        });
        return encodeURIComponent(e.join('!!'))
    },

    unknownEncrypt: function (a) {
        function b(a, b) {
            return a << b | a >>> 32 - b
        }
        function c(a, b) {
            var c, d, e, f, g;
            return e = 2147483648 & a,
            f = 2147483648 & b,
            c = 1073741824 & a,
            d = 1073741824 & b,
            g = (1073741823 & a) + (1073741823 & b),
            c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
        }
        function d(a, b, c) {
            return a & b | ~a & c
        }
        function e(a, b, c) {
            return a & c | b & ~c
        }
        function f(a, b, c) {
            return a ^ b ^ c
        }
        function g(a, b, c) {
            return b ^ (a | ~c)
        }
        function h(a, e, f, g, h, i, j) {
            return a = c(a, c(c(d(e, f, g), h), j)),
            c(b(a, i), e)
        }
        function i(a, d, f, g, h, i, j) {
            return a = c(a, c(c(e(d, f, g), h), j)),
            c(b(a, i), d)
        }
        function j(a, d, e, g, h, i, j) {
            return a = c(a, c(c(f(d, e, g), h), j)),
            c(b(a, i), d)
        }
        function k(a, d, e, f, h, i, j) {
            return a = c(a, c(c(g(d, e, f), h), j)),
            c(b(a, i), d)
        }
        function l(a) {
            var b, c, d = '', e = '';
            for (c = 0; c <= 3; c++)
                b = a >>> 8 * c & 255,
                e = '0' + b.toString(16),
                d += e.substr(e.length - 2, 2);
            return d
        }
        var m, n, o, p, q, r, s, t, u, v = [];
        for (a = function(a) {
            a = a.replace(/\r\n/g, '\n');
            for (var b = '', c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                d < 128 ? b += String.fromCharCode(d) : d > 127 && d < 2048 ? (b += String.fromCharCode(d >> 6 | 192),
                b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                b += String.fromCharCode(d >> 6 & 63 | 128),
                b += String.fromCharCode(63 & d | 128))
            }
            return b
        }(a),
        v = function(a) {
            for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = Array(f - 1), h = 0, i = 0; i < c; )
                b = (i - i % 4) / 4,
                h = i % 4 * 8,
                g[b] = g[b] | a.charCodeAt(i) << h,
                i++;
            return b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | 128 << h,
            g[f - 2] = c << 3,
            g[f - 1] = c >>> 29,
            g
        }(a),
        r = 1732584193,
        s = 4023233417,
        t = 2562383102,
        u = 271733878,
        m = 0; m < v.length; m += 16)
            n = r,
            o = s,
            p = t,
            q = u,
            r = h(r, s, t, u, v[m + 0], 7, 3614090360),
            u = h(u, r, s, t, v[m + 1], 12, 3905402710),
            t = h(t, u, r, s, v[m + 2], 17, 606105819),
            s = h(s, t, u, r, v[m + 3], 22, 3250441966),
            r = h(r, s, t, u, v[m + 4], 7, 4118548399),
            u = h(u, r, s, t, v[m + 5], 12, 1200080426),
            t = h(t, u, r, s, v[m + 6], 17, 2821735955),
            s = h(s, t, u, r, v[m + 7], 22, 4249261313),
            r = h(r, s, t, u, v[m + 8], 7, 1770035416),
            u = h(u, r, s, t, v[m + 9], 12, 2336552879),
            t = h(t, u, r, s, v[m + 10], 17, 4294925233),
            s = h(s, t, u, r, v[m + 11], 22, 2304563134),
            r = h(r, s, t, u, v[m + 12], 7, 1804603682),
            u = h(u, r, s, t, v[m + 13], 12, 4254626195),
            t = h(t, u, r, s, v[m + 14], 17, 2792965006),
            s = h(s, t, u, r, v[m + 15], 22, 1236535329),
            r = i(r, s, t, u, v[m + 1], 5, 4129170786),
            u = i(u, r, s, t, v[m + 6], 9, 3225465664),
            t = i(t, u, r, s, v[m + 11], 14, 643717713),
            s = i(s, t, u, r, v[m + 0], 20, 3921069994),
            r = i(r, s, t, u, v[m + 5], 5, 3593408605),
            u = i(u, r, s, t, v[m + 10], 9, 38016083),
            t = i(t, u, r, s, v[m + 15], 14, 3634488961),
            s = i(s, t, u, r, v[m + 4], 20, 3889429448),
            r = i(r, s, t, u, v[m + 9], 5, 568446438),
            u = i(u, r, s, t, v[m + 14], 9, 3275163606),
            t = i(t, u, r, s, v[m + 3], 14, 4107603335),
            s = i(s, t, u, r, v[m + 8], 20, 1163531501),
            r = i(r, s, t, u, v[m + 13], 5, 2850285829),
            u = i(u, r, s, t, v[m + 2], 9, 4243563512),
            t = i(t, u, r, s, v[m + 7], 14, 1735328473),
            s = i(s, t, u, r, v[m + 12], 20, 2368359562),
            r = j(r, s, t, u, v[m + 5], 4, 4294588738),
            u = j(u, r, s, t, v[m + 8], 11, 2272392833),
            t = j(t, u, r, s, v[m + 11], 16, 1839030562),
            s = j(s, t, u, r, v[m + 14], 23, 4259657740),
            r = j(r, s, t, u, v[m + 1], 4, 2763975236),
            u = j(u, r, s, t, v[m + 4], 11, 1272893353),
            t = j(t, u, r, s, v[m + 7], 16, 4139469664),
            s = j(s, t, u, r, v[m + 10], 23, 3200236656),
            r = j(r, s, t, u, v[m + 13], 4, 681279174),
            u = j(u, r, s, t, v[m + 0], 11, 3936430074),
            t = j(t, u, r, s, v[m + 3], 16, 3572445317),
            s = j(s, t, u, r, v[m + 6], 23, 76029189),
            r = j(r, s, t, u, v[m + 9], 4, 3654602809),
            u = j(u, r, s, t, v[m + 12], 11, 3873151461),
            t = j(t, u, r, s, v[m + 15], 16, 530742520),
            s = j(s, t, u, r, v[m + 2], 23, 3299628645),
            r = k(r, s, t, u, v[m + 0], 6, 4096336452),
            u = k(u, r, s, t, v[m + 7], 10, 1126891415),
            t = k(t, u, r, s, v[m + 14], 15, 2878612391),
            s = k(s, t, u, r, v[m + 5], 21, 4237533241),
            r = k(r, s, t, u, v[m + 12], 6, 1700485571),
            u = k(u, r, s, t, v[m + 3], 10, 2399980690),
            t = k(t, u, r, s, v[m + 10], 15, 4293915773),
            s = k(s, t, u, r, v[m + 1], 21, 2240044497),
            r = k(r, s, t, u, v[m + 8], 6, 1873313359),
            u = k(u, r, s, t, v[m + 15], 10, 4264355552),
            t = k(t, u, r, s, v[m + 6], 15, 2734768916),
            s = k(s, t, u, r, v[m + 13], 21, 1309151649),
            r = k(r, s, t, u, v[m + 4], 6, 4149444226),
            u = k(u, r, s, t, v[m + 11], 10, 3174756917),
            t = k(t, u, r, s, v[m + 2], 15, 718787259),
            s = k(s, t, u, r, v[m + 9], 21, 3951481745),
            r = c(r, n),
            s = c(s, o),
            t = c(t, p),
            u = c(u, q);
        return (l(r) + l(s) + l(t) + l(u)).toLowerCase()
    },




    /**
     * [parseTouch 整理touch数据]
     * @param  {[arr]} route [touch数据]
     * @return {[arr]}       [整理后的touch数据]
     */
    parseTouch: function (route) {
        var limit = 300;
        var clickX = 0,
            clickY = 0,
            d = 0,
            e = 0,
            eventTime = 0,
            arr = [];
        if (route.length <= 0) {
            return [];
        }
        for (var routeLen = route.length, index = routeLen < limit ? 0 : routeLen - limit; index < routeLen; index += 1) {
            var routeItem = route[index],
                eventType = routeItem.e;
            if ('scroll' === eventType) {
                arr.push(
                    [eventType,
                    [routeItem.x - d, routeItem.y - e],
                    this.roundNum(eventTime ? routeItem.t - eventTime : 0)],
                    d = routeItem.x,
                    e = routeItem.y,
                    eventTime = routeItem.t
                ) 
            }else {
                if (['touchstart', 'touchmove', 'touchend'].indexOf(eventType) > -1) {
                    (arr.push([eventType, [routeItem.x - clickX, routeItem.y - clickY], this.roundNum(eventTime ? routeItem.t - eventTime : 0)]),
                    clickX = routeItem.x,
                    clickY = routeItem.y,
                    eventTime = routeItem.t)
                }else {
                    if (['blur', 'focus', 'unload'].indexOf(eventType) > -1) {
                        (arr.push([eventType, this.roundNum(eventTime ? routeItem.x - eventTime : 0)]),
                        eventTime = routeItem.x)
                    }
                }
                
            }
        }
        return arr
    },

    /**
     * [roundNum 返回四舍五入的数字]
     * @param  {[Number]} a [数字]
     * @return {[Number]}   [四舍五入后的数字]
     */
    roundNum: function (num) {
        if ('number' != typeof num) {
            return num
        }else {
            if (num > 32767) {
                return num = 32767
            }else {
                if (num < -32767) {
                    return num = -32767
                }else {
                    return Math.round(num)
                }
            }
        }
    },

    Bd: ['A', 'ARTICLE', 'ASIDE', 'AUDIO', 'BASE', 'BUTTON', 'CANVAS', 'CODE', 'IFRAME', 'IMG', 'INPUT', 'LABEL', 'LINK', 'NAV', 'OBJECT', 'OL', 'PICTURE', 'PRE', 'SECTION', 'SELECT', 'SOURCE', 'SPAN', 'STYLE', 'TABLE', 'TEXTAREA', 'VIDEO'],
    getInfoList: function () {
        return ['textLength', 'HTMLLength', 'documentMode'].concat(encryptor.Bd).concat(['screenLeft', 'screenTop', 'screenAvailLeft', 'screenAvailTop', 'innerWidth', 'innerHeight', 'outerWidth', 'outerHeight', 'browserLanguage', 'browserLanguages', 'systemLanguage', 'devicePixelRatio', 'colorDepth', 'userAgent', 'cookieEnabled', 'netEnabled', 'screenWidth', 'screenHeight', 'screenAvailWidth', 'screenAvailHeight', 'localStorageEnabled', 'sessionStorageEnabled', 'indexedDBEnabled', 'CPUClass', 'platform', 'doNotTrack', 'timezone', 'canvas2DFP', 'canvas3DFP', 'plugins', 'maxTouchPoints', 'flashEnabled', 'javaEnabled', 'hardwareConcurrency', 'jsFonts', 'timestamp', 'performanceTiming']);
    },

    getPageInfo: function (that) {
        var b = window,
            c = b.screen,
            d = b.document,
            e = b.navigator,
            g = d.documentElement,
            k = {};
        var tagList = ['A', 'ARTICLE', 'ASIDE', 'AUDIO', 'BASE', 'BUTTON', 'CANVAS', 'CODE', 'IFRAME', 'IMG', 'INPUT', 'LABEL', 'LINK', 'NAV', 'OBJECT', 'OL', 'PICTURE', 'PRE', 'SECTION', 'SELECT', 'SOURCE', 'SPAN', 'STYLE', 'TABLE', 'TEXTAREA', 'VIDEO'];
        var bodyNodeType = document.body.nodeType;
        var l = function (doc) {
            if (doc) {
                var nodeType = doc.nodeType,
                    tagName = doc.nodeName.toUpperCase();
                if (nodeType === bodyNodeType) {
                    if (tagList.indexOf(tagName) > -1) {
                        if (k[tagName]) {
                            k[tagName] += 1;
                        }else {
                            k[tagName] = 1;
                        }
                    }
                }
                for (var nodes = doc.childNodes, e = 0, nodeLen = nodes.length; e < nodeLen; e++) {
                    l(nodes[e]);
                }
            }
        };
        l(d);
        var m = g.textContent || g.innerText;
        k.textLength = m.length;
        var n = g.innerHTML;
        return k.HTMLLength = n.length,
        k.documentMode = d.documentMode || d.compatMode,
        k.browserLanguage = e.language || e.userLanguage,
        k.browserLanguages = e.languages && e.languages.join(','),
        k.systemLanguage = b.systemLanguage,
        k.devicePixelRatio = b.devicePixelRatio,
        k.colorDepth = c.colorDepth,
        k.userAgent = e.userAgent,
        k.cookieEnabled = (e.cookieEnabled) ? 1 : 0,
        k.netEnabled = (e.onLine) ? 1 : 0,
        k.innerWidth = b.innerWidth,
        k.innerHeight = b.innerHeight,
        k.outerWidth = b.outerWidth,
        k.outerHeight = b.outerHeight,
        k.screenWidth = c.width,
        k.screenHeight = c.height,
        k.screenAvailWidth = c.availWidth,
        k.screenAvailHeight = c.availHeight,
        k.screenLeft = c.left || b.screenLeft,
        k.screenTop = c.top || b.screenTop,
        k.screenAvailLeft = c.availLeft,
        k.screenAvailTop = c.availTop,
        k.localStorageEnabled = (b.localStorage) ? 1 : 0,
        k.sessionStorageEnabled = (b.sessionStorage) ? 1 : 0,
        k.indexedDBEnabled = (b.indexedDB) ? 1 : 0,
        k.CPUClass = e.cpuClass,
        k.platform = e.platform,
        k.doNotTrack = (e.doNotTrack) ? 1 : 0,
        k.timezone = (new Date).getTimezoneOffset() / 60,
        k.canvas2DFP = function() {
            var a = d.createElement('canvas')
              , b = a.getContext && a.getContext('2d');
            if (b) {
                var c = [];
                return a.width = 2e3,
                a.height = 200,
                a.style.display = 'inline',
                b.rect(0, 0, 11, 11),
                b.rect(3, 3, 6, 6),
                c.push('canvas winding:' + (!1 === b.isPointInPath(5, 5, 'evenodd') ? 'yes' : 'no')),
                b.textBaseline = 'alphabetic',
                b.fillStyle = '#f60',
                b.fillRect(125, 1, 62, 20),
                b.fillStyle = '#069',
                b.font = '11pt Arial',
                b.fillText('Cwm fjordbank glyphs vext quiz, 😃', 2, 15),
                b.fillStyle = 'rgba(102, 204, 0, 0.7)',
                b.font = '18pt Arial',
                b.fillText('Cwm fjordbank glyphs vext quiz, 😃', 4, 45),
                b.globalCompositeOperation = 'multiply',
                b.fillStyle = 'rgb(255,0,255)',
                b.beginPath(),
                b.arc(52, 50, 50, 0, 2 * Math.PI, !0),
                b.closePath(),
                b.fill(),
                b.fillStyle = 'rgb(0,255,255)',
                b.beginPath(),
                b.arc(100, 50, 50, 0, 2 * Math.PI, !0),
                b.closePath(),
                b.fill(),
                b.fillStyle = 'rgb(255,255,0)',
                b.beginPath(),
                b.arc(75, 100, 50, 0, 2 * Math.PI, !0),
                b.closePath(),
                b.fill(),
                b.fillStyle = 'rgb(255,0,255)',
                b.arc(75, 75, 75, 0, 2 * Math.PI, !0),
                b.arc(75, 75, 25, 0, 2 * Math.PI, !0),
                b.fill('evenodd'),
                c.push('canvas fp:' + a.toDataURL()),
                encryptor.unknownEncrypt(c.join('~'))
            }
            return 0
        }(),
        k.canvas3DFP = function() {
            var a = d.createElement('canvas')
              , b = a.getContext && (a.getContext('webgl') || a.getContext('experimental-webgl'));
            if (b) {
                var c = function(a) {
                    return b.clearColor(0, 0, 0, 1),
                    b.enable(b.DEPTH_TEST),
                    b.depthFunc(b.LEQUAL),
                    b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT),
                    '[' + a[0] + ', ' + a[1] + ']'
                }
                  , e = []
                  , f = b.createBuffer();
                b.bindBuffer(b.ARRAY_BUFFER, f);
                var g = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
                b.bufferData(b.ARRAY_BUFFER, g, b.STATIC_DRAW),
                f.itemSize = 3,
                f.numItems = 3;
                var h = b.createProgram()
                  , i = b.createShader(b.VERTEX_SHADER);
                b.shaderSource(i, 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}'),
                b.compileShader(i);
                var k = b.createShader(b.FRAGMENT_SHADER);
                return b.shaderSource(k, 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}'),
                (b.compileShader(k),
                b.attachShader(h, i),
                b.attachShader(h, k),
                b.linkProgram(h),
                b.useProgram(h),
                h.vertexPosAttrib = b.getAttribLocation(h, 'attrVertex'),
                h.offsetUniform = b.getUniformLocation(h, 'uniformOffset'),
                b.enableVertexAttribArray(h.vertexPosArray),
                b.vertexAttribPointer(h.vertexPosAttrib, f.itemSize, b.FLOAT, !1, 0, 0),
                b.uniform2f(h.offsetUniform, 1, 1),
                b.drawArrays(b.TRIANGLE_STRIP, 0, f.numItems),
                null != b.canvas && e.push(b.canvas.toDataURL()),
                e.push('extensions:' + b.getSupportedExtensions().join(';')),
                e.push('webgl aliased line width range:' + c(b.getParameter(b.ALIASED_LINE_WIDTH_RANGE))),
                e.push('webgl aliased point size range:' + c(b.getParameter(b.ALIASED_POINT_SIZE_RANGE))),
                e.push('webgl alpha bits:' + b.getParameter(b.ALPHA_BITS)),
                e.push('webgl antialiasing:' + (b.getContextAttributes().antialias ? 'yes' : 'no')),
                e.push('webgl blue bits:' + b.getParameter(b.BLUE_BITS)),
                e.push('webgl depth bits:' + b.getParameter(b.DEPTH_BITS)),
                e.push('webgl green bits:' + b.getParameter(b.GREEN_BITS)),
                e.push('webgl max anisotropy:' + function(a) {
                    var b, c = a.getExtension('EXT_texture_filter_anisotropic') || a.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || a.getExtension('MOZ_EXT_texture_filter_anisotropic');
                    return c ? (b = a.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT),
                    0 === b && (b = 2),
                    b) : null
                }(b)),
                e.push('webgl max combined texture image units:' + b.getParameter(b.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),
                e.push('webgl max cube map texture size:' + b.getParameter(b.MAX_CUBE_MAP_TEXTURE_SIZE)),
                e.push('webgl max fragment uniform vectors:' + b.getParameter(b.MAX_FRAGMENT_UNIFORM_VECTORS)),
                e.push('webgl max render buffer size:' + b.getParameter(b.MAX_RENDERBUFFER_SIZE)),
                e.push('webgl max texture image units:' + b.getParameter(b.MAX_TEXTURE_IMAGE_UNITS)),
                e.push('webgl max texture size:' + b.getParameter(b.MAX_TEXTURE_SIZE)),
                e.push('webgl max varying vectors:' + b.getParameter(b.MAX_VARYING_VECTORS)),
                e.push('webgl max vertex attribs:' + b.getParameter(b.MAX_VERTEX_ATTRIBS)),
                e.push('webgl max vertex texture image units:' + b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)),
                e.push('webgl max vertex uniform vectors:' + b.getParameter(b.MAX_VERTEX_UNIFORM_VECTORS)),
                e.push('webgl max viewport dims:' + c(b.getParameter(b.MAX_VIEWPORT_DIMS))),
                e.push('webgl red bits:' + b.getParameter(b.RED_BITS)),
                e.push('webgl renderer:' + b.getParameter(b.RENDERER)),
                e.push('webgl shading language version:' + b.getParameter(b.SHADING_LANGUAGE_VERSION)),
                e.push('webgl stencil bits:' + b.getParameter(b.STENCIL_BITS)),
                e.push('webgl vendor:' + b.getParameter(b.VENDOR)),
                e.push('webgl version:' + b.getParameter(b.VERSION)),
                b.getShaderPrecisionFormat) ? (e.push('webgl vertex shader high float precision:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.HIGH_FLOAT).precision),
                e.push('webgl vertex shader high float precision rangeMin:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.HIGH_FLOAT).rangeMin),
                e.push('webgl vertex shader high float precision rangeMax:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.HIGH_FLOAT).rangeMax),
                e.push('webgl vertex shader medium float precision:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.MEDIUM_FLOAT).precision),
                e.push('webgl vertex shader medium float precision rangeMin:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.MEDIUM_FLOAT).rangeMin),
                e.push('webgl vertex shader medium float precision rangeMax:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.MEDIUM_FLOAT).rangeMax),
                e.push('webgl vertex shader low float precision:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.LOW_FLOAT).precision),
                e.push('webgl vertex shader low float precision rangeMin:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.LOW_FLOAT).rangeMin),
                e.push('webgl vertex shader low float precision rangeMax:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.LOW_FLOAT).rangeMax),
                e.push('webgl fragment shader high float precision:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.HIGH_FLOAT).precision),
                e.push('webgl fragment shader high float precision rangeMin:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.HIGH_FLOAT).rangeMin),
                e.push('webgl fragment shader high float precision rangeMax:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.HIGH_FLOAT).rangeMax),
                e.push('webgl fragment shader medium float precision:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.MEDIUM_FLOAT).precision),
                e.push('webgl fragment shader medium float precision rangeMin:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.MEDIUM_FLOAT).rangeMin),
                e.push('webgl fragment shader medium float precision rangeMax:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.MEDIUM_FLOAT).rangeMax),
                e.push('webgl fragment shader low float precision:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.LOW_FLOAT).precision),
                e.push('webgl fragment shader low float precision rangeMin:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.LOW_FLOAT).rangeMin),
                e.push('webgl fragment shader low float precision rangeMax:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.LOW_FLOAT).rangeMax),
                e.push('webgl vertex shader high int precision:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.HIGH_INT).precision),
                e.push('webgl vertex shader high int precision rangeMin:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.HIGH_INT).rangeMin),
                e.push('webgl vertex shader high int precision rangeMax:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.HIGH_INT).rangeMax),
                e.push('webgl vertex shader medium int precision:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.MEDIUM_INT).precision),
                e.push('webgl vertex shader medium int precision rangeMin:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.MEDIUM_INT).rangeMin),
                e.push('webgl vertex shader medium int precision rangeMax:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.MEDIUM_INT).rangeMax),
                e.push('webgl vertex shader low int precision:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.LOW_INT).precision),
                e.push('webgl vertex shader low int precision rangeMin:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.LOW_INT).rangeMin),
                e.push('webgl vertex shader low int precision rangeMax:' + b.getShaderPrecisionFormat(b.VERTEX_SHADER, b.LOW_INT).rangeMax),
                e.push('webgl fragment shader high int precision:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.HIGH_INT).precision),
                e.push('webgl fragment shader high int precision rangeMin:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.HIGH_INT).rangeMin),
                e.push('webgl fragment shader high int precision rangeMax:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.HIGH_INT).rangeMax),
                e.push('webgl fragment shader medium int precision:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.MEDIUM_INT).precision),
                e.push('webgl fragment shader medium int precision rangeMin:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.MEDIUM_INT).rangeMin),
                e.push('webgl fragment shader medium int precision rangeMax:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.MEDIUM_INT).rangeMax),
                e.push('webgl fragment shader low int precision:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.LOW_INT).precision),
                e.push('webgl fragment shader low int precision rangeMin:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.LOW_INT).rangeMin),
                e.push('webgl fragment shader low int precision rangeMax:' + b.getShaderPrecisionFormat(b.FRAGMENT_SHADER, b.LOW_INT).rangeMax),
                encryptor.unknownEncrypt(e.join('~'))) : encryptor.unknownEncrypt(e.join('~'))
            }
            return 0
        }(),
        k.plugins = function() {
            if (!e.plugins)
                return -1;
            for (var a = [], b = 0, c = e.plugins.length; b < c; b += 1) {
                var d = e.plugins[b];
                a.push(d.name.replace(/\s/g, '')),
                a.push(d.filename.replace(/\s/g, ''))
            }
            return a.join(',')
        }(),
        k.maxTouchPoints = function() {
            return encryptor.isUndefined(e.maxTouchPoints) ? encryptor.isUndefined(e.msMaxTouchPoints) ? 0 : e.msMaxTouchPoints : e.maxTouchPoints
        }(),
        k.flashEnabled = function() {
            return encryptor.isUndefined(b.swfobject) ? -1 : this.isTrue(b.swfobject.hasFlashPlayerVersion('9.0.0'))
        }(),
        k.javaEnabled = function() {
            try {
                return encryptor.isUndefined(e.javaEnabled) ? -1 : this.isTrue(e.javaEnabled())
            } catch (a) {
                return -1
            }
        }(),
        k.hardwareConcurrency = e.hardwareConcurrency,
        k.jsFonts = function() {
            var a = ['monospace', 'sans-serif', 'serif']
              , b = ['Andale Mono', 'Arial', 'Arial Black', 'Arial Hebrew', 'Arial MT', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Bitstream Vera Sans Mono', 'Book Antiqua', 'Bookman Old Style', 'Calibri', 'Cambria', 'Cambria Math', 'Century', 'Century Gothic', 'Century Schoolbook', 'Comic Sans', 'Comic Sans MS', 'Consolas', 'Courier', 'Courier New', 'Garamond', 'Geneva', 'Georgia', 'Helvetica', 'Helvetica Neue', 'Impact', 'Lucida Bright', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Fax', 'LUCIDA GRANDE', 'Lucida Handwriting', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Monaco', 'Monotype Corsiva', 'MS Gothic', 'MS Outlook', 'MS PGothic', 'MS Reference Sans Serif', 'MS Sans Serif', 'MS Serif', 'MYRIAD', 'MYRIAD PRO', 'Palatino', 'Palatino Linotype', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Light', 'Segoe UI Semibold', 'Segoe UI Symbol', 'Tahoma', 'Times', 'Times New Roman', 'Times New Roman PS', 'Trebuchet MS', 'Verdana', 'Wingdings', 'Wingdings 2', 'Wingdings 3']
              , c = document.getElementsByTagName('body')[0]
              , d = document.createElement('div')
              , e = document.createElement('div')
              , f = {}
              , g = {}
              , h = function() {
                var a = document.createElement('span');
                return a.style.position = 'absolute',
                a.style.left = '-9999px',
                a.style.fontSize = '72px',
                a.innerHTML = 'mmmmmmmmmmlli',
                a
            }
              , i = function(a, b) {
                var c = h();
                return c.style.fontFamily = '"' + a + '",' + b,
                c
            }
              , j = function() {
                for (var b = [], c = 0, e = a.length; c < e; c++) {
                    var f = h();
                    f.style.fontFamily = a[c],
                    d.appendChild(f),
                    b.push(f)
                }
                return b
            }();
            c.appendChild(d);
            for (var k = 0, l = a.length; k < l; k++)
                f[a[k]] = j[k].offsetWidth,
                g[a[k]] = j[k].offsetHeight;
            var m = function() {
                for (var c = {}, d = 0, f = b.length; d < f; d++) {
                    for (var g = [], h = 0, j = a.length; h < j; h++) {
                        var k = i(b[d], a[h]);
                        e.appendChild(k),
                        g.push(k)
                    }
                    c[b[d]] = g
                }
                return c
            }();
            c.appendChild(e);
            for (var n = [], o = 0, p = b.length; o < p; o++)
                (function(b) {
                    for (var c = !1, d = 0; d < a.length; d++)
                        if (c = b[d].offsetWidth !== f[a[d]] || b[d].offsetHeight !== g[a[d]])
                            return c;
                    return c
                })(m[b[o]]) && n.push(b[o].replace(/\s/g, ''));
            var q = n.join(',');
            return c.removeChild(e),
            c.removeChild(d),
            q
        }(),
        k
    },
    isUndefined: function (a) {
        return undefined === a
    },

    isTrue: function (a) {
        return a ? 1 : 0
    }
}
module.exports = encryptor;