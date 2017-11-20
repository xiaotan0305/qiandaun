define('modules/mycenter/user', ['jquery', 'lazyload/1.9.1/lazyload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var delay = 0;
    $ = require('lazyload/1.9.1/lazyload');
    return {
        lazyload: function (img) {
            var dataOriginal = img.attr('data-original');
            if (img.attr('src') === dataOriginal) {
                return;
            }
            img.attr('src', vars.public + 'images/loadingpic.jpg');
            setTimeout(function () {
                img.attr('src', dataOriginal);
            }, delay += 200);
        },

        // 从数组中查找指定值对应的区间右侧索引

        find: function (arr, val) {
            // 如果值小于arr最小的值时，则返回0
            if (val < Math.min.apply(null, arr)) {
                return 0;
            }
            // 如果值大于arr最大的值时，则返回最高索引
            if (val > Math.max.apply(null, arr)) {
                return arr.length - 1;
            }
            var idx = 0,
                i = 0,
                j = arr.length;
            for (; i < j; i++) {
                if (arr[i] > val) {
                    idx = i;
                    break;
                }
            }
            return idx;
        },
        // 猜你喜欢,获取结果出来之后，得出相关参数的值

        cainixihuan: function () {
            var that = this;
            require.async('jsub/_ubm.js', function () {
                _ub.city = vars.zhcity;
                _ub.request('mp3', true);
                var xfScores = 0, esfScores = 0, zfScores = 0;
                _ub.onload = function () {
                    if (_ub.values.mp3 && !(_ub.values.mp3 instanceof Array)) {
                        xfScores = _ub.values.mp3.N;
                        esfScores = _ub.values.mp3.E;
                        zfScores = _ub.values.mp3.Z;
                        _ub.request('mn9,mn5,me0,me4,mz3,mz0');
                        return;
                    }
                    var xfXQ = _ub.mn9, xfWY = _ub.mn5, esfQYSQ = _ub.me0, esfHX = _ub.me4, zfHX = _ub.mz3, zfQYSQ = _ub.mz0;
                    $.get(vars.mySite + '?c=mycenter&a=ajaxlike&city=' + vars.city,
                        {
                            xfXQ: xfXQ,
                            xfWY: xfWY,
                            esfQYSQ: esfQYSQ,
                            esfHX: esfHX,
                            zfHX: zfHX,
                            zfQYSQ: zfQYSQ,
                            xfScores: xfScores,
                            esfScores: esfScores,
                            zfScores: zfScores
                        },
                        function (result) {
                            var $mrtj = $('#mrtj');
                            if ($.trim(result)) {
                                $mrtj.html(result).find('img[data-original]').lazyload();
                                $('img[data-original]').each(function (index, element) {
                                    that.lazyload($(element));
                                });
                                var $tjlist = $('#tjlist'), $wapper = $('#wapper'), w = 0, wid = $(window).width(), scroll = [], speed = 3000;
                                $tjlist.find('li').each(function (index, ele) {
                                    var $ele = $(ele), elew = $ele.width();
                                    scroll.push(w);
                                    w += elew + 11;
                                });
                                // 每日推荐自动滚动效果
                                if (w > wid) {
                                    require.async('iscroll/2.0.0/iscroll-lite', function (iscrollLite) {
                                        $wapper.width(wid);
                                        // safari浏览器兼容处理
                                        if (navigator.userAgent.toLocaleLowerCase().indexOf('safari') > -1) {
                                            w += 10;
                                        }
                                        $tjlist.width(w).find('ul').eq(0).width(w);
                                        var wapper = new iscrollLite('#wapper', {
                                                scrollX: true,
                                                scrollY: false,
                                                bindToWrapper: true,
                                                eventPassthrough: true
                                            }), i = 0;
                                        var imgScroll = function () {
                                            i = i === 0 ? 0 : that.find(scroll, Math.abs(wapper.x));
                                            if (w - scroll[i] < wid) {
                                                wapper.scrollTo(wid - w, 0, 500);
                                                i = -1;
                                            } else {
                                                wapper.scrollTo(-scroll[i], 0, 500);
                                            }
                                            i++;
                                        };
                                        setInterval(imgScroll, speed);
                                    });
                                }
                            } else {
                                $mrtj.hide();
                            }
                        });
                };
            });
        },
        // 用户行为
        yhxw: function (type) {
            require.async('jsub/_ubm.js', function () {
                _ub.city = vars.cityname;
                _ub.biz = 'e';
                //  业务---WAP端
                var ns = vars.ns === 'n' ? 0 : 1;
                _ub.location = ns;
                //  方位（南北方) ，北方为0，南方为1
                var b = type;
                // 用户动作（浏览0、打电话31、在线咨询24、分享22、收藏21）
                var district = $('#district').text();
                var comarea = $('#comarea').text();
                var price = $('#price').text();
                var pricetype = $('#pricetype').text();
                var roomnum = vars.roomnum > 0 ? vars.roomnum : 0;
                var housesource = '', pTemp = {}, agentid;
                if (vars.housetype === 'AGT') {
                    housesource = encodeURIComponent('经纪人');
                } else if (vars.housetype === 'A' || vars.housetype === 'B') {
                    housesource = encodeURIComponent('佣金0.5%');
                } else {
                    housesource = encodeURIComponent('个人');
                }
                if (vars.purpose === '住宅') {
                    if (type === 0) {
                        // 浏览
                        pTemp = {
                            me18: vars.houseid,
                            me0: encodeURIComponent(district) + '^' + encodeURIComponent(comarea) + '^1',
                            me1: vars.plotid,
                            me2: price + '^' + encodeURIComponent(pricetype),
                            me3: vars.allacreage,
                            me4: encodeURIComponent(roomnum + '居'),
                            mee: housesource
                        };
                    } else if (type === 31 || type === 24) {
                        // 打电话  在线咨询
                        agentid = vars.agentid;
                        pTemp = {
                            me18: vars.houseid,
                            me1: vars.plotid,
                            met: agentid
                        };
                    } else if (type === 22 || type === 21) {
                        // 分享  收藏
                        pTemp = {
                            me18: vars.houseid,
                            me1: vars.plotid
                        };
                    }
                } else if (vars.purpose === '别墅') {
                    if (type === 0) {
                        pTemp = {
                            met19: vars.houseid,
                            meg: encodeURIComponent(district) + '^' + encodeURIComponent(comarea) + '^1',
                            meh: vars.plotid,
                            mei: price + '^' + encodeURIComponent(pricetype),
                            mek: vars.allacreage,
                            mej: encodeURIComponent(vars.buildtype),
                            me10: housesource,
                            // 来源
                            meq: encodeURIComponent(vars.fitment)
                            // 装修
                        };
                    } else if (type === 31 || type === 24) {
                        // 打电话  在线咨询
                        agentid = vars.agentid;
                        pTemp = {
                            met19: vars.houseid,
                            // 房源ID
                            meh: vars.plotid,
                            // 楼盘ID
                            met: agentid
                            // 经纪人ID
                        };
                    } else if (type === 22 || type === 21) {
                        // 分享  收藏
                        pTemp = {
                            met19: vars.houseid,
                            // 房源ID
                            meh: vars.plotid
                            // 楼盘ID
                        };
                    }
                }
                var p = {};
                // 若pTemp中属性为空或者无效，则不传入p中
                for (var temp in pTemp) {
                    if (pTemp.hasOwnProperty(temp)) {
                        if (pTemp[temp] !== null && '' !== pTemp[temp] && undefined !== pTemp[temp] && 'undefined' !== pTemp[temp]) {
                            p[temp] = pTemp[temp];
                        }
                    }
                }
                //  用户行为(格式：'字段编号':'值')
                _ub.collect(b, p);
                //  收集方法
            });
        }
    };
});