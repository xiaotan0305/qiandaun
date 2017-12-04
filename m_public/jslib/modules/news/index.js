/**
 * Created by LXM on 14-12-4.
 */
define('modules/news/index', ['jquery', 'lazyload/1.9.1/lazyload', 'loadMore/1.0.0/loadMore', 'swipe/3.3.1/swiper'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var lazyLoad = require('lazyload/1.9.1/lazyload');
        var loadMore = require('loadMore/1.0.0/loadMore');
        var vars = seajs.data.vars;
        var zhcity = vars.hicityname;
        var showZf = vars.show_zf;
        var most;
        var less;
        var lest;
        if (vars.localStorage) {
            var localStorage = vars.localStorage;
            // 读取localstorage，如果没有该值，则读取猜你喜欢
            most = localStorage.mostvalue;
            less = localStorage.lessvalue;
            lest = localStorage.lestvalue;
        }

        var lanmuStr;
        // 搜索用户行为收集20160114
        var pages = {
            top: 'mzxlistfirst',
            daogou: 'mzxlistdg',
            esf: 'mzxlistesf',
            zf: 'mzxlistzf',
            jiaju: 'mzxlistjj',
            local: 'mzxlisthot',
            lppc: 'mzxlistlppc',
            mfbk: 'mzxlistmfbk',
            xfpk: 'mzxlistxfpk'
        };
        var page = pages[vars.channel];
        require.async('jsub/_vb.js?c=' + page);
        require.async('jsub/_ubm.js', function () {
            _ub.city = vars.cityname;
            _ub.biz = 'i';
            // 业务---资讯
            var ns = vars.ns === 'n' ? 0 : 1;
            _ub.location = ns;
            // 方位（南北方) ，北方为0，南方为1
            var b = 1;

            var pTemp = vars.channel ? {
                    'vmg.page': page,
                    'vmi.city': encodeURIComponent(vars.cityname)
                } : '';
            var p = {};
            // 若pTemp中属性为空或者无效，则不传入p中
            for (var temp in pTemp) {
                if (pTemp[temp] && pTemp.hasOwnProperty(temp)) {
                    p[temp] = pTemp[temp];
                }
            }
            // 用户行为(格式：'字段编号':'值')
            _ub.collect(b, p);
            // 声明要获取的参数
            var zfScores = '';
            var xfScores = '';
            var esfScores = '';
            if (most) {
                _ub.request('mp3', true);
                // 参数固定
                _ub.onload = function () {
                    if (_ub.values.mp3 && !(_ub.values.mp3 instanceof Array)) {
                        // 获取权重分值N为新房、E为二手房、Z为租房
                        xfScores = _ub.values.mp3.N;
                        esfScores = _ub.values.mp3.E;
                        zfScores = _ub.values.mp3.Z;
                        // 下面为声明获取，与搜索接口调用传入参数有关的参数（只获取权重分值的可以不关心）
                        _ub.request('mn9,mn5,me0,me4,mz3,mz0');
                        return;
                    }
                    var mostvalue;
                    var lessvalue = '';
                    var lestvalue;
                    // 对这三个值的大小进行判断来实现对样式的控制
                    if (xfScores && esfScores) {
                        if (showZf == 1) {
                            lessvalue = 'zf';
                        }
                        // 完成对三者的排序工作
                        if (xfScores > esfScores) {
                            if (lessvalue) {
                                if (zfScores > esfScores && zfScores < xfScores) {
                                    lestvalue = 'esf';
                                    mostvalue = 'xf';
                                } else if (zfScores <= esfScores) {
                                    mostvalue = 'xf';
                                    lestvalue = 'zf';
                                    lessvalue = 'esf';
                                } else {
                                    mostvalue = 'zf';
                                    lessvalue = 'xf';
                                    lestvalue = 'esf';
                                }
                            } else {
                                mostvalue = 'xf';
                                lestvalue = 'esf';
                            }
                        } else {
                            if (lessvalue) {
                                if (zfScores > xfScores && zfScores < esfScores) {
                                    mostvalue = 'esf';
                                    lestvalue = 'xf';
                                } else if (zfScores <= xfScores) {
                                    mostvalue = 'esf';
                                    lestvalue = 'zf';
                                    lessvalue = 'xf';
                                } else {
                                    mostvalue = 'zf';
                                    lessvalue = 'esf';
                                    lestvalue = 'xf';
                                }
                            } else {
                                mostvalue = 'esf';
                                lestvalue = 'xf';
                            }
                        }
                    }
                    // 写入localstorage
                    if (vars.localStorage && mostvalue && lestvalue && lanmuStr) {
                        localStorage.mostvalue = mostvalue;
                        localStorage.lestvalue = lestvalue;
                        if (showZf == 1) {
                            localStorage.lessvalue = lessvalue;
                        }
                    }
                    // 将其排序样式改变
                    var $nav2 = $('#nav2');
                    if (most && lest && !lanmuStr) {
                        var $most = $('#' + most).remove();
                        if (showZf == 1) {
                            var $less = $('#' + less).remove();
                        }
                        var $lest = $('#' + lest).remove();
                        var $jiaju = $('#jiaju').remove();
                        $nav2.append($most);
                        if (showZf == 1) {
                            $nav2.append($less);
                        }
                        $nav2.append($lest);
                        $nav2.append($jiaju);
                    }
                };
            }
        });
        // 对拖拽的localstorage进行处理
        if (vars.localStorage && localStorage.lanmu) {
            lanmuStr = localStorage.lanmu;
            var arr = lanmuStr.split(',');
            var arrLanmu = [];
            var lanmuZf;
            for (var i = 0; i < arr.length - 1; i++) {
                if (arr[i] === 'zf') {
                    lanmuZf = 'zf';
                }
            }
            if (lanmuZf || showZf != 1) {
                for (var j = 0; j < arr.length - 1; j++) {
                    var $arrType = $('#' + arr[j]).remove();
                    arrLanmu[j] = $arrType;
                }
                $('#nav2').empty();
                for (var k = 0; k < arr.length - 1; k++) {
                    arrLanmu[k].appendTo('#nav2');
                }
            }
        }
        $('#nav2').show();

        // 头部广告
        var Swiper = require('swipe/3.3.1/swiper');
        (function () {
            var swiperEle = $('#swiperEle');
            var $imgs = swiperEle.find('img');
            if ($imgs.length > 1) {
                var $wrap = swiperEle.find('.swipe-wrap');
                var $slide = swiperEle.find('.swiper-slide').show();
                var length = $slide.length;
                var $swipePointList = swiperEle.find('.swipe-point').find('li');
                var $swipeTxtList = swiperEle.find('.swipe-txt').find('li');
                $wrap.css('width', parseInt(swiperEle.css('width'), 10) * (length + 2));
                new Swiper('#swiperEle', {
                    loop: true,
                    autoplay: 3000,
                    speed: 500,
                    autoHeight: true,
                    wrapperClass: 'swipe-wrap',
                    onTransitionEnd: function (swiper) {
                        var index = swiper.activeIndex % length || length;
                        $swipePointList.eq(index - 1).addClass('cur').siblings().removeClass('cur');
                        $swipeTxtList.eq(index - 1).show().siblings().hide();
                    }
                });
            }
        })();
        // 懒加载
        lazyLoad('img[data-original]').lazyload();

        // 注意这里的合作渠道统计，调用该方法即可
        function hezuofunc(city, housetype, houseid, phone, type, phone1, channel, agentid, order, housefrom) {
            $.ajax({
                url: '//api.m.test.fang.com/data/data.php?city=' + city + '&housetype=XF&houseid=' + houseid + '&phone=' + phone + '&type=' + type + '&channel=' + channel + '&product=' + agentid + '&order=' + order + '&housefrom=' + housefrom,
                async: false
            });
        };
        // 对合作渠道加一个类型使得合作渠道能够在点击时触发合作渠道统计方法
        $('.hezuo_url').each(function () {
            $(this).on('click', function () {
                // 对频道的处理
                var thisChannel = $(this).attr('data_channel');
                var hezuoChannel = '';
                switch (thisChannel) {
                    case 'top':
                        hezuoChannel = 'waptt_hz';
                        break;
                    case 'daogou':
                        hezuoChannel = 'wapdg_hz';
                        break;
                    case 'zf':
                        hezuoChannel = 'wapzf_hz';
                        break;
                    case 'esf':
                        hezuoChannel = 'wapesf_hz';
                        break;
                    case 'jiaju':
                        hezuoChannel = 'wapjj_hz';
                        break;
                }
                // 调用统计方法
                hezuofunc(encodeURIComponent(zhcity), '', $(this).attr('data_news_id'), encodeURIComponent($(this).attr('data_news_quarry')), 'click', '', hezuoChannel, 'soufun', $(this).attr('data_sition'), '\'' + $(this).attr('data_url') + '\'');
                location.href = $(this).attr('data_url');
            });
        });
        // 加载更多功能
        var pagesize = vars.pagesize;
        var pageUrl = vars.newsSite + '?c=news&a=ajaxIndex&channel=' + vars.channel + '&r=' + Math.random();
        pageUrl = vars.channelid ? pageUrl + '&channelid=' + vars.channelid : pageUrl;
        pageUrl = vars.type ? pageUrl + '&type=' + vars.type : pageUrl;
        pageUrl = vars.agentid ? pageUrl + '&agentid=' + vars.agentid : pageUrl;
        loadMore({
            total: vars.total_count,
            pagesize: pagesize,
            firstDragFlag: false,
            pageNumber: 10,
            moreBtnID: '#drag',
            loadPromptID: '#draginner',
            contentID: '[type_id="content"]:last',
            loadAgoTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
            loadingTxt: '<div class="moreList graybg"><span><i></i>努力加载中...</span></div>',
            loadedTxt: '<div class="moreList"><a class="bt">查看更多</a></div>',
            url: pageUrl
        });
        // 对租房微信服务号过来的用户重定位
        if (vars.weixin) {
            require.async('modules/index/locate');
        }
        // 查看更多点击进APP
        // app下载
        if (vars.channel === 'top') {
            (function (win) {
                var doc = document,
                    $ = win.$,
                    k = function () {
                        this.listen();
                    };
                k.prototype = {
                    listen: function () {
                        var that = this;
                        $('#draginner').on('click', function (e) {
                            var u;
                            var l;
                            var url = vars.public + 'jslib/app/1.0.1/appopen.js';
                            var callback = function (openApp) {
                                var oa = openApp({
                                    url: vars.mainSite + 'client.jsp?produce=soufun&city=' + win.lib.city,
                                    log: that.log,
                                    appurl: 'waptoapp/{"destination":"appzxlist"}',
                                    href: 'soufun://'
                                });
                                oa.openApp();
                            };
                            e.preventDefault();
                            e.stopPropagation();
                            if (typeof win.seajs === 'object') {
                                win.seajs.use(url, callback);
                            } else {
                                u = doc.createElement('script');
                                l = doc.getElementsByTagName('head')[0];
                                u.async = true;
                                u.src = url;
                                u.onload = callback;
                                l.appendChild(u);
                            }
                            return false;
                        });
                    },
                    log: function (type) {
                        try {
                            $.get('/public/?c=public&a=ajaxOpenAppData', {
                                type: type,
                                rfurl: doc.referrer
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                };
                new k();
            })(window);
        }
    };
});