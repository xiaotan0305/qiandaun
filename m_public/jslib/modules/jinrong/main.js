define('modules/jinrong/main', ['jquery'],function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    var newMsgDom = $('.sms-num');
    // 加载网页导航
    require.async(['navflayer/navflayer_new']);
    // 详情页
    if (vars.action !== '') {
        require.async(['modules/jinrong/' + vars.action], function (run) {
            run();
        });
    }
    // 获取和显示新消息数
    require.async(['newmsgnum/1.0.0/newmsgnum'], function (NewMsgNum) {
        new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
    });
    // 稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
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

    // 搜索页
    if (vars.action === 'search') {
        require.async(['modules/ask/search-more'], function (run) {
            run();
        });
    }
    // 判断是否加载提示下载APP
    require.async(vars.public + 'js/20141106.js');
    // 统计功能
    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});