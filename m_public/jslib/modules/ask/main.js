/**
 * 问答入口文件
 * by blue
 * 20150916 blue 整理代码，删除冗长代码，提高代码效率，修改搜索为最新整合的搜索模块，增加了一个localStorge的判断，方便其他js使用
 * 20151201 blue 增加input类型为hidden数据的获取
 */
define('modules/ask/main', ['jquery'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 从页面获取的参数
    var vars = seajs.data.vars;
    // 由于热combo需要，增加的一个异步加载预加载数组
    var preload = [];
    // 获取新消息显示数的实例，用于之后对新消息的处理函数
    var newMsgDom = $('.sms-num');
    // 设置localStorage，方便之后的所有类中使用localStorage，直接判断是否存在即可，不存在就说明无法使用（为隐私模式或者不能用）
    var c = window.localStorage;
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    // 获取浏览器ua信息
    var UA = navigator.userAgent.toLowerCase();
    // 判断是否是小米黄页，是的话加载小米黄页特殊处理js
    // ！！！这里也是有问题的，为什么在jslib中的一个模块确没有实现模块化处理，而是直接用自调用匿名函数写了个js，找不到作者也，肯定是要改的
    if (UA.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }

    // 下载app
    var downBtn = $('#down-btn-c');
    // 如页面底部有app下载按钮引入appdownload
    if (downBtn.length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    // 判断是列表页或者搜索更多或者问答标签列表页或者seo列表页时，加载搜索js
    if (vars.action === 'index' || vars.action === 'search-more' || vars.action === 'asktaglist'
        || vars.action === 'seoList' || (vars.action === 'detail' && vars.sf_source != 'baidumip') || vars.action === 'seoDetail'
        || vars.action === 'askDailyDetail' || vars.action === 'askDailyList'
        || vars.action === 'funReply' || vars.action === 'payAskList') {
        preload.push('search/ask/askSearch');
    }
    // 加载导航操作js
    preload.push('navflayer/navflayer_new3');
    // 加载新消息处理js和置顶操作js
    preload.push('newmsgnum/1.0.0/newmsgnum', 'backtop/1.0.2/backtop');
    // 如果为列表页的话还需要加载滑动筛选框类
    // ！！！这里需要注意，应该替换为最新的slideFilterBox模块，旧版的iscroll已经作废了
    if (vars.action === 'index' || vars.action === 'payAskList') {
        preload.push('iscroll/1.0.0/iscroll');
    }
    // 如果是搜索页还要增加搜素更多处理js，！！！由于对业务的不熟悉不知道这个js是做什么用的，难道不会与搜索js重复吗？
    if (vars.action === 'search') {
        preload.push('modules/ask/search-more');
    }

    // 用户登录信息，！！！这里的判断猜测为，通过判断userinfo这个节点是否存在来判断是否登录，这种方式我认为不太好，起码不够严谨，
    if ($('#userinfo').length > 0) {
        preload.push('modules/ask/userinfo');
    }
    // 当如果不为空时，加载相应的主操作js
    if (vars.action !== '') {
        preload.push('modules/ask/' + vars.action);
    }
    // 判断是否加载提示下载APP
    function getCookie(name) {
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        var arr = document.cookie.match(reg);
        if (arr) {
            return arr[2];
        }
        return null;
    }

    // @20151201 增加input类型为hidden数据的获取
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    // 这里的判断是专为下载浮层使用的
    if (vars.action === 'detail' || vars.action === 'index' || vars.action === 'askDailyList') {
        // vars.downtitle = 'App答题赚更多积分<br>可以换礼物喔~';
        // if (vars.action === 'detail' || vars.action === 'index' || vars.action === 'askDailyList') {
        // if (!getCookie('clientdownshow_index')) {
        // $(document.body).append('<div class="remove_bottom" style="padding-bottom:50px;">&nbsp;</div>');
        // }
        // }
        // 家居装修来访对首页和详情页浮层做专门处理
        var prevUrl = 'com/jiaju';
        var curUrl = 'from=jiaju';
        if ((vars.action === 'index' && (document.referrer.indexOf(prevUrl) !== -1 || window.location.href.indexOf(curUrl) !== -1))
            || (vars.action === 'detail' && vars.class_id === 2)) {
            vars.downtitle = '\u0020\u623f\u5929\u4e0b\u88c5\u4fee\u0061\u0070\u0070<br>\u770b\u7f8e\u56fe\u0020\u5b66\u77e5\u8bc6\u0020\u76ef\u8fdb\u5ea6';
            vars.appImgUrl = vars.public + 'img/app_jiaju_logo.png';
            vars.appurl = vars.mainSite + 'client.jsp?produce=ftxzx';
            vars.appstoreurl = 'https://itunes.apple.com/cn/app/fang-tian-xia-zhuang-xiu/id966474506?mt=8';
        }
        if (vars.action !== 'detail' && vars.action !== 'index') {
            require.async(vars.public + 'js/ask20141106.js');
        }

    }
    // 将所有需要加载的js用异步方式载入
    require.async(preload);
    if (downBtn.length > 0) {
        require.async('app/1.0.0/appdownload', function () {
            if (vars.position) {
                downBtn.openApp({position: vars.position});
            } else {
                downBtn.openApp();
            }
        });
    }
    // 判断是列表页或者搜索更多或者问答标签列表页或者seo列表页时，执行搜索初始化
    if (vars.action === 'index' || vars.action === 'search-more' || vars.action === 'asktaglist' || vars.action === 'seoList' || vars.action === 'payAskList') {
        require.async('search/ask/askSearch', function (Search) {
            var askSearch = new Search();
            askSearch.init();
        });
    }
    // 如果是详情页或者SEO详情页时，搜索变成了一个图标
    /* 如果是百度官方号合作页面的话，即sf_source=baidumip,搜索直接跳转到大搜索 */
    if ((vars.action === 'detail' && vars.sf_source != 'baidumip') || vars.action === 'seoDetail'
        || vars.action === 'askDailyDetail' || vars.action === 'askDailyList' || vars.action === 'funReply' || (vars.action === 'payDetail' && vars.sf_source != 'baidumip')) {
        require.async('search/ask/askSearch', function (Search) {
            var askSearch = new Search();
            askSearch.setShowPopBtn('.icon-sea');
            askSearch.init();
        });
    }
    // 获取和显示新消息数
    require.async('newmsgnum/1.0.0/newmsgnum', function (NewMsgNum) {
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });
    // 稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
    // 判断是否加载显示回顶按钮
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.2/backtop'], function (backTop) {
                if (vars.action == 'payAskList' || vars.action == 'hotClassAsk' || vars.action == 'payHotTopic') {
                    var opts = {
                        'right' : '30px',
                        'bottom' : '40px'
                    };
                    backTop(opts);
                } else {
                    backTop();
                }

            });
            $window.off('scroll.back');
        }
    });

    // 首页和分类查看页
    if (vars.action === 'index' || vars.action === 'class' || vars.action === 'search' || vars.action === 'payAskList') {
        $('div.hotkey').on('click', 'a', function () {
            window.location = vars.askSite + '?c=ask&a=search&city=' + vars.city + '&keyword=' + encodeURIComponent($(this).html()) + '&r=' + Math.random();
        });
        // 搜索页
        if (vars.action === 'search') {
            require.async(['modules/ask/search-more'], function (run) {
                if (run)run();
            });
        }
    }
    // 用户登录信息
    if ($('#userinfo').length > 0) {
        require.async('modules/ask/userinfo', function (userInfo) {
            userInfo(vars);
        });
    }

    // 当如果不为空时，执行主操作js
    if (vars.action !== '') {
        require.async(['modules/ask/' + vars.action], function (run) {
            run();
        });
    }
    // 统计功能
    if (vars.action === 'index' || vars.action === 'search-more' || vars.action === 'asktaglist' || vars.action === 'detail') {
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            if (vars.action === 'index') {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapasksy_', '');
                });
            } else if (vars.action === 'search-more') {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapasklist_', '');
                });
            } else if (vars.action === 'asktaglist') {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapaskbq_', '');
                });
            } else if (vars.action === 'detail') {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapaskxq_', '');
                });
            }
        });
    }
    // 加载统计需要的js
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});