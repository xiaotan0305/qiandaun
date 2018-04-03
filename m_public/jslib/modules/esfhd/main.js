/**
 * 优惠券入口主类
 * by loupeiye
 * 20151203 loupeiye
 */
define('modules/esfhd/main', [], function (require) {
    'use strict';
    // 页面传入的参数
    var vars = seajs.data.vars;
    $('input[type=hidden]').each(function (index, element) {
        vars[$(this).attr('data-id')] = element.value;
    });
    // 浏览器的userAgent
    var UA = navigator.userAgent.toLowerCase();
    // var newMsgDom = $('.sms-num');
    // 用于热combo的
    var preload = [];
    // 判断localStorage是否可用，同时判断是否为隐私模式

    if (vars.action) {
        // 存在栏目主类时，插入栏目主类js
        preload.push('modules/esfhd/' + vars.action);
    }
    
    // 插入置顶操作js
    preload.push('backtop/1.0.0/backtop');
    if (UA.indexOf('miuiyellowpage') > -1) {
        // 当为小米黄页时，插入小米黄页特殊处理js
        preload.push('miuiYellowPage/miuiYellowPage');
    }
    // 如页面底部有app下载按钮引入appdownload
    if ($('#down-btn-c').length > 0 || $('.autogeneration').length > 0) {
        require.async('app/1.0.0/appdownload', function ($) {
            $('#down-btn-c').openApp();
            $('.autogeneration').openApp({position: 'autogeneration'});
        });
    }
    if (vars.action !== '') {
        require.async(['modules/esfhd/' + vars.action], function (run) {
            run();
        });
    }else{
        require.async(preload);
    }
    if (vars.action === 'xqRecommend') {
        require.async('search/esfhd/esfhdSearch', function (esfhdSearch) {
            var esfhdSearch = new esfhdSearch();
            esfhdSearch.init();
        });
    }
    if (vars.action === 'sfbHPXQList') {
        require.async('search/esfhd/sfbHPXQListSearch', function (sfbHPXQListSearch) {
            var sfbHPXQListSearch = new sfbHPXQListSearch();
            sfbHPXQListSearch.init();
        });
    }

    // 引入统计js代码
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});