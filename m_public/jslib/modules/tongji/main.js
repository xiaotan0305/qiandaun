define("modules/tongji/main", ['jquery'], function (require, exports, module) {
    "use strict";
    var $ = require("jquery"),
        vars = seajs.data.vars,
        bua = navigator.userAgent.toLowerCase(), preload = [];
    vars.isApple = bua.indexOf('iphone') != -1 || bua.indexOf('ios') != -1;
    (function (win, vars) {
        var controlName = win.lib && win.lib.channelsConfig && win.lib.channelsConfig.currentChannel;
        if (controlName) {
            $.each(vars, function (index, element) {
                win.lib[index] = element;
            });
        }
        var c = win.localStorage;
        try {
            c && c.setItem("testPrivateModel", !1)
        } catch (d) {
            c = null
        }
        vars.localStorage = c;
    })(window, vars);

    if (vars.action != "") {
        preload.push("modules/tongji/" + vars.action);
    }
    require.async(preload);
    //详情页
    if (vars.action != "") {
        require.async(["modules/tongji/" + vars.action], function (run) {
            run();
        });
    }
    //稍作页面滚动，隐藏地址栏
    window.scrollTo(0, 1);
    //判断是否加载显示回顶按钮
    var $window = $(window);
    $window.on('scroll.back', function () {
        if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(["backtop/1.0.0/backtop"], function (backTop) {
                backTop();
            });
            $window.off('scroll.back');
        }
    });

    require.async('count/loadforwapandm.min.js');
    require.async('count/loadonlyga.min.js');
});