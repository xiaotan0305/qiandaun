/**
 * 二手房入口主类
 * by blue
 * 20150928 blue 整理代码，修改引入的搜索为重构后的搜索
 * 20151223 liuxinlu 整理代码，将懒加载插件加入预加载，修改部分格式，去掉详情页引入的搜索js
 * 20160121 blue 新增需求，搜索存储所有筛选字段
 */
define('modules/esf/main', ['jquery'], function (require) {
    'use strict';
    // jquery库
    var $ = require('jquery');
    // 页面传入的参数
    var vars = seajs.data.vars;
    // 浏览器的userAgent
    var UA = navigator.userAgent.toLowerCase();
    var newMsgDom = $('.sms-num');
    // 窗口实例
    var $window = $(window);
    // 用于热combo的
    var preload = [];
    // 插入导航操作js
    // 哥伦布页面不调用头部导航插件 lina 20161130
    var new2Arr = ['yyhdDetail', 'yyhdOrderInfo', 'yyhdSubmitOrder', 'yykfWT', 'esfzyindex', 'newindex', 'jhdetail'];
    if ((vars.action === 'detail' && !vars.isBdclo) || new2Arr.indexOf(vars.action) > -1) {
        preload.push('navflayer/navflayer_new2', 'lazyload/1.9.1/lazyload');
    } else {
        preload.push('navflayer/navflayer_new');
    }
    // 获取页面所有传入值
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 判断插入搜索js,加载提示下载APP
    if (vars.action === 'newindex' || vars.action === 'esfzyindex') {
            preload.push('search/esf/esfSearch');
    }
    //二手房添加
    if (vars.action === 'newindex' || vars.action === 'esfzyindex' || vars.action === 'detail' || vars.action === 'jhdetail') {
        preload.push('swipe/3.10/swiper');
    }
    // 判断localStorage是否可用，同时判断是否为隐私模式
    var c = window.localStorage;
    try {
        if (c) {
            c.setItem('testPrivateModel', !1);
        }
    } catch (d) {
        c = null;
    }
    vars.localStorage = c;
    if (newMsgDom.length > 0) {
        // 判断是否有新消息，如果有插入新消息处理js
        preload.push('newmsgnum/1.0.0/newmsgnum');
    }
    if (vars.action && vars.action !== 'esfzyindex') {
        // 存在栏目主类时，插入栏目主类js
        preload.push('modules/esf/' + vars.action);
    }
    // 插入置顶操作js
    preload.push('backtop/1.0.0/backtop');
    if (UA.indexOf('miuiyellowpage') > -1) {
        // 当为小米黄页时，插入小米黄页特殊处理js
        preload.push('miuiYellowPage/miuiYellowPage');
    }

    // 如果未今日头条app将今日头条参数添加到vars数组。
    if (UA.indexOf('newsarticle') > -1) {
        vars.jrttApp = true;
    }
    // 如页面底部有app下载按钮引入appdownload
    if ($('#down-btn-c').length > 0) {
        preload.push('app/1.0.0/appdownload');
    }
    require.async(preload);

    // 如页面有app下载按钮引入appdownload
    if ($('#down-btn-c').length > 0 || $('.app-down-list').length >0 || $('.app-down-detail').length >0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
            $('.app-down-list').openApp({position: $('.app-down-list').find('a').attr('data-position')});
            $('.app-down-detail').openApp({position: $('.app-down-detail').find('a').attr('data-position')});
        });
    }
    if ($('.loveshare').length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('.loveshare').openApp({appUrl: $('.loveshare').attr('data-androidurl'), universalappurl: $('.loveshare').attr('data-iosurl'), position:'loveShare'});
        });
    }
    // 执行搜索初始化 (如果有自营标识，加载自营专用搜索) onlyesf :: 自营页面只有二手房入口
    if (vars.subaction && vars.subaction === 'zyindex' && !vars.onlyesf) {
        require.async('search/zy/zySearch', function (ZySearch) {
            var zySearch = new ZySearch();
            // @20161122 tankunpeng 搜索存储所有筛选字段
            if (vars.filter) {
                zySearch.setFilterHistory(vars.filter, window.location.href);
            }
            zySearch.init();
        });
    } else if (vars.action === 'newindex' || vars.action === 'esfzyindex') {
        require.async('search/esf/esfSearch', function (EsfSearch) {
            var esfSearch = new EsfSearch();
            if (vars.action === 'detail') {
                // 当不是列表页时，设置搜索按钮
                esfSearch.setShowPopBtn('.icon-sea');
            }
            // @20160121 blue 新增需求，搜索存储所有筛选字段
            if (vars.filter) {
                esfSearch.setFilterHistory(vars.filter, window.location.href);
            }
            esfSearch.init();
        });
    }
    if(vars.action === 'detail' && vars.isBdclo){
        require.async('search/esf/esfSearch', function (EsfSearch) {
            var esfSearch = new EsfSearch();
            // 设置搜索按钮
            esfSearch.setShowPopBtn('.input');
            esfSearch.init();
        });
    }
    // 判断如果有新消息的话，执行新消息操作
    if (newMsgDom.length > 0) {
        require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
    }
    // 如果是欧朋浏览器的话就让页面在初始化的时候刷新一下
    //if (sessionStorage) {
    //    if (!sessionStorage.reload) {
    //        sessionStorage.reload = true;
    //        if (UA.indexOf('opr') > -1 && sessionStorage.reload) {
    //            location.replace(location.href);
    //        }
    //    }
    //}

    // 执行栏目主类
    if (vars.action === 'esfzyindex') {
        require.async(['modules/esf/' + 'newindex'], function (run) {
            run();
        });
    } else if (vars.action) {
        require.async(['modules/esf/' + vars.action], function (run) {
            run();
        });
    }
    // 判断是否加载显示回顶按钮
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(['backtop/1.0.0/backtop'], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });
    if (vars.action === 'newindex' || vars.action === 'detail' || vars.action === 'esfzyindex') {
        // 判断登陆状态
        $.get(vars.esfSite + '?c=esf&a=checkLoginMode', function (data) {
            // 登录注册按钮
            var logRegBox = $('#loginMode,#registerMode');
            if (data === '1') {
                logRegBox.hide();
            } else {
                logRegBox.show();
            }
        });
    }
    // 当为列表页时
    var cityArr = ['bj', 'cd', 'tj', 'wuhan', 'suzhou', 'gz', 'sz', 'sjz', 'sh', 'changchun', 'jn', 'qd', 'zz', 'cq', 'sy', 'hz', 'nanjing', 'cs', 'cz',
        'dg', 'hn', 'hf', 'nc', 'nn', 'nb', 'wuxi', 'xian', 'dl', 'sanya', 'km'];
    if (vars.action === 'newindex') {
        // 加载统计功能代码
        if (vars.jhList) {
            require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapesfyx_', '');
                });
            });
        } else {
            if (cityArr.indexOf(vars.city) > -1) {
                require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
                    Clickstat.eventAdd(window, 'load', function () {
                        Clickstat.batchEvent('wapesfsy_', vars.city);
                    });
                });
            }
        }
    }
    if (vars.action === 'esfzyindex') {
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapesfzysy_', '');
            });
        });
    }
    if (vars.action === 'detail') {
        var clickVal = 'wapesfagantxq_';
        if ('A' === vars.housetype || 'B' === vars.housetype || 'C' === vars.housetype || 'D' === vars.housetype) {
            clickVal = 'wapesfdsxq_';
        }
        if (cityArr.indexOf(vars.city) > -1 || vars.isBdclo) {
            require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
                var Clickstat = window.Clickstat;
                var clickSv;
                if (vars.isBdclo) {// 哥伦布房源
                    clickSv = 'bdclo';
                } else if (vars.validHouseStatus) {// 过期，下架房源
                    clickSv = 'del';
                } else {
                    clickSv = vars.city;
                }
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent(clickVal, clickSv);
                });
            });
        }
    } else if (vars.action === 'jhdetail') {
        require.async(location.protocol + '//clickm.fang.com/click/new/clickm.js', function () {
            Clickstat.eventAdd(window, 'load', function () {
                Clickstat.batchEvent('wapesfyxxq_', '');
            });
        });
    }
    // 引入统计js代码
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});