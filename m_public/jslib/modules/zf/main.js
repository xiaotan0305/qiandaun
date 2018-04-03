/**
 * 租房入口类
 * by blue
 * 20151010 blue 整理代码，删除没用代码，搜索替换为最新重构的搜索
 * @20160121 blue 新增需求，搜索存储所有筛选字段
 */
define('modules/zf/main', ['jquery'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 页面传入的参数
    var vars = seajs.data.vars,
    // 浏览器useragent
        UA = navigator.userAgent.toLowerCase(),
    // 热combo所需的数组
        preLoad = [],
    // 新消息显示个数实例
        newMsgDom = $('.sms-num'),
    // 设置localStorage，判断是否可用并判断是否为隐私模式
        c = window.localStorage,
    // window的jquery对象实例
        $window = $(window);
    // footer 中下载按钮
    var downBtn = $('#down-btn-c');
    try {
        if (c) {
            c.setItem('testPrivateModel', !1);
        }
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    // 将后台使用input类型为hidden传入页面的数据赋值到vars上，以便之后的js使用
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    // 春节送福袋活动
    if (vars.action === 'detail') {
        require.async(['modules/esf/cjfd'], function (run) {
            run();
        });
    }
    if (vars.action === 'index' || vars.action === 'getReportHouseType') {
        preLoad.push('search/zf/zfSearch');
    }

    // 当为小米黄页时，插入小米黄页特殊处理js
    if (UA.indexOf('miuiyellowpage') > -1) {
        preLoad.push('miuiYellowPage/miuiYellowPage');
    }
    // 插入置顶操作js
    preLoad.push('backtop/1.0.0/backtop');
    // 插入导航操作js
    if (vars.action === 'index' || vars.action === 'detail' || vars.action === 'getReportHouseType' || vars.action === 'successReportHouse'
        || vars.action === 'getDSReportHouseType' || vars.action === 'successDSReportHouse') {
        preLoad.push('navflayer/navflayer_new2');
    } else {
        preLoad.push('navflayer/navflayer_new');
    }
    // 判断是否有新消息，有则插入新消息处理js
    if (newMsgDom.length > 0) {
        preLoad.push('newmsgnum/1.0.0/newmsgnum');
    }
    // 如果存在操作主类则，插入操作主类
    if (vars.action && vars.action !== 'busStationDetail' && vars.action !== 'wapToApp' && vars.action !== 'wapToAppList') {
        preLoad.push('modules/zf/' + vars.action);
    }
    //插入swiper插件
    if (vars.action === 'index' || vars.action === 'detail') {
        preLoad.push('swipe/3.10/swiper');
    }

    // 下载app临时处理
    if (downBtn.length > 0) {
        preLoad.push('app/1.0.0/appdownload');
    }

    // 添加下载浮层
    if (vars.action === 'index') {
        preLoad.push(vars.public + 'js/zu20141106.js');
    }
    // 预加载所需js
    require.async(preLoad);

    // 下载app临时处理
    if (downBtn.length > 0 || $('.app-down-detail').length >0 || $('.app-down-zfJXDetail').length > 0 || $('.app-down-waptoapp').length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
            $('.app-down-detail').openApp({position: $('.app-down-detail').find('a').attr('data-position')});
            $('.app-down-zfJXDetail').openApp({position: $('.app-down-zfJXDetail').find('a').attr('data-position')});
            $('.app-down-waptoapp').openApp({position: $('.app-down-waptoapp').find('a').attr('data-position')});
        });
    }
    if ($('.loveshare').length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('.loveshare').openApp({appUrl: $('.loveshare').attr('data-androidurl'), universalappurl: $('.loveshare').attr('data-iosurl'), position:'loveShare'});
        });
    }
    //打开页面立即跳转,PC租房个人详情页
    if (vars.action === 'wapToApp' && UA.match(/Android/i) != null) {
        require.async(['app/1.0.6/pctoapp'], function (pctoapp) {
            var config = {
                // 安卓跳转地址
                url: '//download.3g.fang.com/fang_android_3' + vars.company + '.apk',
                // appstore 地址
                appstoreUrl: vars.appstoreUrl,
                // 版本号,没有用
                company: vars.company,
                // 房天下app微信浏览器中应用宝跳转地址
                wxUrl: vars.wxUrl,
                // 打开APP规则，例如：waptoapp/{"destination":"home"}
                appurl: vars.appurl,
                // 通用连接规则
                universalappurl: vars.universalappurl,
            };
            pctoapp(config).openApp();
        });
    }
    // 执行搜索初始化
    if (vars.action === 'index' || vars.action === 'getReportHouseType') {
        require.async('search/zf/zfSearch', function (ZfSearch) {
            var zfSearch = new ZfSearch();
            if (vars.action === 'detail' || vars.action === 'getReportHouseType') {
                // 当不是列表页时，设置搜索按钮
                zfSearch.setShowPopBtn('.icon-sea');
            }
            // @20160121 blue 新增需求，搜索存储所有筛选字段
            if (vars.filter) {
                zfSearch.setFilterHistory(vars.filter, window.location.href);
            }
            zfSearch.init();
        });
    }

    // 设置滚动1像素，隐藏uc浏览器头 因去快筛部分功能冲突引起bug，现已去掉
    //  $window.scrollTop(1);
    // 判断是否加载显示回顶按钮
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async('backtop/1.0.0/backtop', function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    // 有新消息则初始化新消息处理类
    if (newMsgDom && newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }

    if (vars.action === 'index' || vars.action === 'detail') {
        // 判断登陆状态
        $.get(vars.zfSite + '?c=zf&a=checkLoginMode', function (data) {
            var loginResBox = $('#loginMode,#registerMode');
            if (parseInt(data) === 1) {
                loginResBox.hide();
            } else {
                loginResBox.show();
            }
        });
    }
    // 运行操作主类
    if (vars.action && vars.action !== 'successDSReportHouse' && vars.action !== 'busStationDetail' && vars.action !== 'wapToApp' && vars.action !== 'wapToAppList') {
        require.async(['modules/zf/' + vars.action], function (run) {
            run();
        });
    }
    // 当页面为列表也是统计用户行为
    if (vars.action === 'index') {
        // 加载提示下载APP
        if ('cd' === vars.city || 'bj' === vars.city || 'wuhan' === vars.city || 'suzhou' === vars.city || 'tj' === vars.city) {
            require.async('//clickm.fang.com/click/new/clickm.js', function () {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapzfsy_', vars.city);
                });
            });
        }
    }
    // 当页面为普通详情页，统计用户行为 modified by lipengkun 20161019
    if (vars.action === 'detail') {
        // 详情页/电商详情-北京上海 click
        var clickVal = 'wapzfxqy_';
        if (vars.housetype === 'DS' || vars.housetype === 'DSHZ') {
            clickVal = 'wapzfdsxq_';
        }
        if ('bj' === vars.city || 'sh' === vars.city) {
            require.async('//clickm.fang.com/click/new/clickm.js', function () {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent(clickVal, vars.city);
                });
            });
        }
        // 非电商详情-成都click
        if ('cd' === vars.city && 'DS' != vars.housetype && vars.housetype != 'DSHZ') {
            require.async('//click.fang.com/stats/click2011.js', function () {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent(clickVal, vars.city);
                });
            });
        }
    }
    // 加载用户统计js
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});