/**
 * 新房入口
 * by WeiRF
 * 20151203 WeiRF 删除冗余代码，并将登陆后获取用户信息从各模块提出放入入口模块
 * 20151204 WeiRF 增加APP下载需求
 * 20151209 WeiRF 头部全部改为navflayer_new2
 * 20160121 blue 新增需求，搜索存储所有筛选字段，添加input[type=hidden]存入vars的处理
 */
define('modules/xf/main', ['jquery', 'util/util', 'app/1.0.0/appdownload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var Util = require('util/util');
    // 登录时候cookie标志
    var sfut = Util.getCookie('sfut');
    var vars = seajs.data.vars;
    var c = window.localStorage;
    // 处理localStorage，防止在隐私模式下出错
    try {
        c && c.setItem('testPrivateModel', !1);
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    // 根据是否登陆来确定用哪个底部
    if (sfut) {
        $('#LoginID').show();
    } else {
        $('#notLoginID').show();
    }
    // 登录后获取用户名，手机号和用户ID
    vars.getSfutInfo = function (callback) {
        $.get('/user.d?m=getUserinfoBySfut', {sfut: sfut}, function (data) {
            if (data) {
                var returnResult = data.root.return_result;
                if (returnResult == '100') {
                    callback(data.root);
                }
            }
        });
    };
    // 将后台使用input类型为hidden传入页面的数据赋值到vars上，以便之后的js使用
    $('input[type=hidden]').each(function () {
        var $this = $(this);
        vars[$this.attr('data-id')] = $this.val();
    });
    var preload = [];
    // 小米黄页
    var bua = navigator.userAgent.toLowerCase();
    if (bua.indexOf('miuiyellowpage') > -1) {
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 引入公共头部
    preload.push('navflayer/navflayer_new2');
    require.async(preload);
    // 各个主页面的主js入口
    if (vars.action !== '') {
        var action = 'modules/xf/' + (vars.subaction ? vars.subaction : vars.action);
        require.async([action], function (run) {
            if (run && run['init']) {
                run.init();
            }
        });
    }
    // 最下面广告浮层
    if ((vars.action === 'mfbdList' || vars.action === 'searchHuXingList'
        || vars.action === 'dongtaiList' || vars.action === 'commentList'
        || vars.action === 'huxingcommentlist') && !/src=client/.test(location.href)) {
        require.async(vars.public + 'js/20141106.js');
    }
    // 搜索
    var Search, newHouseSearch,zySearch;
    // 执行搜索初始化 (如果有自营标识，加载自营专用搜索) onlyxf :: 自营页面只有二手房入口
    if (vars.subaction === 'xfzylist' && !vars.onlyxf) {
        require.async('search/zy/zySearch',function (Search) {
            zySearch = new Search();
            // @20161031 tankunpeng 新增需求，自营新增一个搜索
            if (vars.filter) {
                zySearch.setFilterHistory(vars.filter, window.location.href,vars.filterType);
            }
            zySearch.init();
        });
    }else if (vars.action === 'xflist' || vars.action === 'searchHuXingList' || vars.action === 'getPrivilegeHouseList') {
        require.async('search/newHouse/newHouseSearch',function (Search) {
            newHouseSearch = new Search();
            // @20160121 blue 新增需求，搜索存储所有筛选字段
            if (vars.filter) {
                newHouseSearch.setFilterHistory(vars.filter, window.location.href,vars.filterType);
            }
            if (vars.action === 'getPrivilegeHouseList') {
                newHouseSearch.setShowPopBtn('#show_search');
            }
            newHouseSearch.init();
        });
    }
    // 引入统计代码
    require.async('count/loadforwapandm.min.js');
    var googleAnalyticsImageUrlUp = $('#googleAnalyticsImageUrlUp').val();
    if (googleAnalyticsImageUrlUp) {
        var imgUp = new Image();
        imgUp.src = googleAnalyticsImageUrlUp;
    }
    var googleAnalyticsImageUrlDown = $('#googleAnalyticsImageUrlDown').val();
    if (googleAnalyticsImageUrlDown) {
        var imgDown = new Image();
        imgDown.src = googleAnalyticsImageUrlDown;
    }
    // 判断是否加载显示回顶按钮
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    // 设置cookie存入当前城市缩写
    var curcity = vars.paramcity || 'bj';
    Util.setCookie('mencity', curcity, 24 * 30);
    // 引入APP下载和打开
    var appdown = require('app/1.0.0/appdownload');
    appdown('.appDown').openApp('/clientindex.jsp?city=' + vars.city + '&flag=download&f=1256');
});
	