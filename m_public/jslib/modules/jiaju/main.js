/**
 * 单量更改于2015-9-9
 * modified by YuanHH on 15-11-26
 */
define('modules/jiaju/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    var bua = navigator.userAgent.toLowerCase();
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    var newMsgDom = $('.sms-num');
    var $window = $(window);
    var preload = [];
    var win = window;
    // 通用方法
    vars.jiajuUtils = {
        // 禁用/启用touchmove
        toggleTouchmove: (function () {
            function preventDefault(e) {
                e.preventDefault();
            }
            return function (unable) {
                document[unable ? 'addEventListener' : 'removeEventListener']('touchmove', preventDefault,{passive: false});
            };
        })()
    };

    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // ui底部修改
    if ($.inArray(vars.action, ['buildCate', 'jjCate', 'zxReserve', 'zxOver', 'zxgjsu', 'zxgjsuc', 'jctj', 'goodsDjqList', 'showActivity']) === -1) {
        var url = vars.jiajuSite + '?c=jiaju&a=checkLoginMode&r=' + Math.random();
        $.get(url, '', function (q) {
            if (q === '1') {
                vars.isLogin = true;
                $('#loginMode').hide();
            } else {
                vars.isLogin = false;
                $('#loginMode').show();
            }
        });
    }

    // UI改版
    if ($.inArray(vars.action, ['buildCate', 'jjCate', 'zxReserve', 'zxOver', 'zxgjsu', 'zxgjsuc', 'jctj', 'goodsDjqList', 'showActivity']) === -1) {
        preload.push('modules/jiaju/jiajuNavflayer');
        // 下载app
        var downBtn = $('#down-btn-c');
        if (downBtn.length > 0) {
            require.async('app/1.0.0/appdownload', function () {
                downBtn.openApp('//appdownload.3g.fang.com/home/ftxzx_android_60000_3.2.0.apk');
            });
        }
    } else {
        preload.push('navflayer/navflayer_new');
    }
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    var needFilters = 0;
    if (vars.action && vars.action !== 'brandQjdInfo') {
        preload.push('modules/jiaju/' + vars.action);
        if ($.inArray(vars.action, ['cashCouponList', 'storeList', 'lglist', 'buildList', 'gzList', 'jjList', 'designerList', 'visitGd', 'zxbj',
                'xgtList', 'designerList', 'brandQjd', 'companyNewList', 'zxCaseList','firmList','sjsList','loupanCaseList', 'sjsCaseList', 'shopList','productList','companyCaseList','qjList'
            ]) !== -1) {
            needFilters = 1;
            preload.push('iscroll/1.0.0/iscroll', 'modules/jiaju/filters');
        }
    }
    if ($window.scrollTop() > $window.height() * 2 - 60) {
        preload.push('backtop/1.0.0/backtop');
    }
    require.async(preload);

    var c = win.localStorage;
    try {
        c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;

    function dataurlClick(dom) {
        setTimeout(function () {
            window.location.href = dom.attr('data-url');
        }, 500);
    }

    // 日记列表跳详情bug修改
    if (vars.action !== 'diaryList') {
        $('[data-url]').each(function (i, n) {
            var thisDom = $(n);
            thisDom.on('click', function () {
                dataurlClick(thisDom);
            });
        });
    }
    if (bua.indexOf('miuiyellowpage') > -1) {
        require.async(['miuiYellowPage/miuiYellowPage']);
    }
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 其他入口
    if (vars.action && vars.action !== 'brandQjdInfo') {
        require.async(['modules/jiaju/' + vars.action], function (run) {
            // 兼容暴露接口类型: object等其他类型不执行
            if (typeof run === 'function') {
                run();
            } else if (typeof run === 'object' && typeof run.init === 'function') {
                run.init();
            }
        });
        // 快筛
        needFilters && require.async(['modules/jiaju/filters'], function (filter) {
            filter();
        });
    }
    // 搜索
    if ($.inArray(vars.action, ['designerList', 'visitGd', 'jjList', 'buildList', 'xgtList', 'zxbj', 'lglist', 'buildPartList', 'companyNewList','firmList','shopList','productList','sjsList','zxCaseList']) !== -1) {
        require.async('search/jiaju/jiajuSearch', function (Search) {
            var jiajuSearch = new Search();
            if (vars.action === 'lglist') {
                jiajuSearch.setShowPopBtn('#searchBtn');
            }
            jiajuSearch.init();
        });
    }
    vars.action === 'index' && require.async('search/jiaju/jiajuIndexSearch', function (Search) {
        var jiajuIndexSearch = new Search();
        jiajuIndexSearch.init();
    });

    // 稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
    // 判断是否加载显示回顶按钮
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60 && !vars.needBackTopBtn) {// 报名页不需要回顶按钮
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    if ($.inArray(vars.action, ['index', 'designerList', 'gzList']) !== -1) {
        require.async(vars.public + 'js/jiaju20141106.js');
    }

    function clickmfunc() {
        window.Clickstat.eventAdd(window, 'load', function () {
            window.Clickstat.batchEvent('wapjiajusy_', vars.city);
        });
    }

    if (vars.action === 'index') {
        // 加载提示下载APP
        // require.async(vars.public + 'js/20141106.js');
        // 统计功能
        (function () {
            var url = location.protocol + '//clickm.fang.com/click/new/clickm.js';
            require.async(url, function () {
                clickmfunc();
            });
        })();
    }
    /* 报名和报价需要返回的地址*/
    if ($.inArray(vars.action, ['bmFreeSignUp', 'bmOption', 'quoteTotalPrice', 'zxBaoJiaOption', 'bmNotCity']) !== -1) {
        vars.bmUrls = {
            setUrl: (function () {
                if (vars.action === 'bmFreeSignUp' || vars.action === 'quoteTotalPrice') {
                    vars.localStorage.setItem('urls', document.referrer);
                }
                var urlsKey = vars.localStorage.getItem('urls');
                if (!urlsKey) {
                    vars.localStorage.setItem('urls', location.href);
                } else {
                    var arr = urlsKey.split('$$$');
                    arr.unshift(location.href);
                    if (arr.length > 4) {
                        var newArr = arr.splice(0, -4);
                        vars.localStorage.setItem('urls', newArr.join('$$$'));
                    } else {
                        vars.localStorage.setItem('urls', arr.join('$$$'));
                    }
                }
            })(),
            getUrl: function (num) {
                var urls = vars.localStorage.getItem('urls');
                if (urls) {
                    return urls.split('$$$').length >= (num +1)  ? urls.split('$$$')[num] : vars.jiajuSite + vars.city + '.html';
                } else {
                    return vars.jiajuSite + vars.city + '.html';
                }
            }
        };
    }

    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});
