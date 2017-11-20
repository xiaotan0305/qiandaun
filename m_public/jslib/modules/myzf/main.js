define('modules/myzf/main', ['jquery'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars, bua = navigator.userAgent.toLowerCase();
    vars.isApple = bua.indexOf('iphone') !== -1 || bua.indexOf('ios') !== -1;
    window.scrollTo(0, 1);
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 索引localStorage
    var c = window.localStorage;
    // 判断是否可用localStorage并判断是否为隐私模式
    try {
        if (c) {
            c.setItem('testPrivateModel', !1);
        }
    } catch (d) {
        c = null;
    }
    // 经判断是否可用localStorage,以供之后的js使用
    vars.localStorage = c;
    if (bua.indexOf('miuiyellowpage') > -1) {
        require.async(['miuiYellowPage/miuiYellowPage']);
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

    // 下载app临时处理
    if ($('#down-btn-c').length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
        });
    }

    if (vars.action === 'zfPublish') {
        require.async(['view/zfpublishView'], function (run) {
            run();
        });
    }
    // vars.action !== '' && vars.action !== 'zfType'
    if (vars.action !== '' && vars.action !== 'zfType' && vars.action !== 'houseLeaseSuc' && vars.action !== 'zfPublish') {
        require.async(['modules/myzf/' + vars.action], function (run) {
            run();
        });
    }
    // 对租房微信服务号过来的用户重定位
    if (vars.weixin) {
        require.async('modules/index/locate');
    }

    // 如果是首页则加载用户行为统计js
    if (vars.action === 'zfType') {
        require.async('modules/zf/yhxw', function (yhxw) {
            // type 代表动作类型 0 为浏览，pageId 页面标识，curChannel当前频道
            yhxw({type: 0, pageId: 'mzfchooseway', curChannel: 'myzf'});
        });
    }

    // 统计用户行为
    if (vars.action === 'kanFangList' || vars.action === 'comment' || vars.action === 'yykfDatePage' || vars.action === 'yykfSuc') {
        if (vars.city == 'bj' || vars.city == 'sh') {
            require.async('//clickm.fang.com/click/new/clickm.js', function () {
                Clickstat.eventAdd(window, 'load', function () {
                    Clickstat.batchEvent('wapzfdsxq_', vars.city);
                });
            });
        }
    }
    // 加载用户统计js
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});