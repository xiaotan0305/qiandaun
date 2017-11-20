/**
 * bbs入口主类
 * by blue
 * 20151106 blue 整理代码，删除冗长，替换搜索为最新重构版本
 * @Last Modified by:   liyingying
 * @Last Modified time: 2016/1/5
 */
define('modules/bbs/main', ['jquery'], function (require) {
    'use strict';
    // jquery库

    var $ = require('jquery');
    // 页面传入的参数
    var vars = seajs.data.vars,
    // 获取浏览器userAgent信息
        UA = navigator.userAgent.toLowerCase();
    // 获取新消息节点
    var newMsgDom = $('.sms-num'),
    // 用于热combo
        preload = [];
    // 窗口jquery对象
    var $window = $(window);
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 下载app
    var downBtn = $('#down-btn-c');
    if (downBtn.length > 0) {
        require.async('app/1.0.0/appdownload', function () {
            downBtn.openApp();
        });
    }
    // 判断是否为苹果手机
    vars.isApple = UA.indexOf('iphone') !== -1 || UA.indexOf('ios') !== -1;
    // 实现获取cookie功能
    function getCookie(name) {
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        var arr = document.cookie.match(reg);
        if (arr) {
            return arr[2];
        }
        return null;
    }

    // 只有bbs首页用到了搜索
    if (vars.action === 'index') {
        preload.push('search/bbs/bbsSearch');
    }

    if (UA.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 插入新消息处理
    if (newMsgDom.length > 0) {
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    // 插入导航操作
    preload.push('navflayer/navflayer_new3');
    // 如果是列表页，添加到常用论坛localStorage
    if (vars.action === 'bbsPostList') {
        preload.push('modules/bbs/lacc');
    }

    // 插入页面操作主类,这里判断是因为有可能用不到
    if (vars.action) {
        preload.push('modules/bbs/' + vars.action);
    }
    // 异步加载所有插入数组中的js文件，实现热combo
    require.async(preload);
    if (vars.action === 'index' || vars.action === 'search') {
        // 搜索初始化
        require.async('search/bbs/bbsSearch', function (BbsSearch) {
            var bbsSearch = new BbsSearch();
            bbsSearch.init();
        });
    }
    // 新消息处理方法初始化
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }

    // 执行主类方法
    if (vars.action) {
        require.async(['modules/bbs/' + vars.action], function (run) {
            run();
        });
    }
    // 稍作页面滚动，隐藏地址栏
    $window.scrollTop(1);
    // 判断是否加载显示回顶按钮
    if (vars.action !== 'postinfo' && vars.action !== 'quanpostinfo') {
        $window.on('scroll.back', function () {
            if ($window.scrollTop() > $window.height() * 2 - 60) {
                require.async(['backtop/1.0.0/backtop'], function (backTop) {
                    backTop();
                });
                $window.off('scroll.back');
            }
        });
    }
    // 判断是否加载提示下载APP
    if (vars.action === 'topic') {
        vars.downtitle = '房天下业主圈<br>专注“房事”的朋友圈';
    }
    // app下载浮层处理
    if (vars.action !== 'replypost' && vars.action !== 'replycomment' && vars.action !== 'quanpostinfo' && vars.action !== 'bbsboxdetail'
        && vars.action !== 'topicPost' && vars.action !== 'topicComment' && vars.action !== 'postinfo') {
        require.async(vars.public + 'js/20141106.js');
    }
    // ！！！这里的方法操作不明
    if (vars.action === 'getInboxMessage' || vars.action === 'bbsboxlist') {
        if (!getCookie(vars.cd_ver)) {
            $(document.body).append('<div class="remove_bottom" style="padding-bottom:36px;">&nbsp;</div>');
        }
    }
    // localStorage
    var c = window.localStorage;
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    // 部署统计
    // postinfo和quanpostinfo部分地区统计
    var myCitys = [];
    // 用wapbbssy_的方法
    var myArr = ['index', 'mybbslist', 'getUserFollow', 'getUserFans', 'post', 'postinfo', 'quanpostinfo'];
    if (vars.action === 'quanpostinfo' || vars.action === 'postinfo') {
        myCitys = ['bj', 'sh', 'gz', 'sz', 'tj', 'cd', 'cq', 'wuhan', 'suzhou', 'hz', 'nanjing'];
    }

    if ($.inArray(vars.action, myArr) !== -1) {
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            if (vars.action === 'index' || vars.action === 'mybbslist'
                || vars.action === 'getUserFollow' || vars.action === 'getUserFans' || vars.action === 'post') {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapbbssy_', '');
                });
            } else if ((vars.action === 'postinfo' || vars.action === 'quanpostinfo') && myCitys.indexOf(vars.city) > -1) {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapbbsxq_', vars.city);
                });
            } else if (vars.action === 'postlist' || vars.action === 'postlistgood') {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapbbslist_', '');
                });
            }
        });
    }

    // 统计功能
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});