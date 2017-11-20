/**
 * 返回按钮特殊处理类，用来解决在魅族自带浏览器中点击a链接跳转返回使用时使用history出现bug的兼容性问题
 * by blue
 */
(function (w, f) {
    'use strict';
    if (typeof define === 'function') {
        define('back/1.0.0/back', ['jquery'], function (require) {
            var $ = require('jquery');
            return f(w, $);
        });
    } else if (typeof exports === 'object') {
        module.exports = f(w);
    } else {
        w.Back = f(w, w.jQuery);
    }
})(window, function (w, $) {
    'use strict';

    /**
     * 设置返回按钮操作
     * @param str 返回按钮的id或者类名
     */
    function setBack(str) {
        var backId = str ? str : '.back';
        var $backID = $(backId);
        $backID.attr('href', 'javascript:void(0);');
        if ($backID.length > 0 && document.referrer) {
            var UA = w.navigator.userAgent.toLowerCase();
            if ($backID.is(':hidden')) {
                $backID.show();
            }
            $backID.click(function () {
                if (/mx/.test(UA) || /meizu/.test(UA)) {
                    w.location = document.referrer;
                } else {
                    w.history.go(-1);
                }
            });
        }
    }

    return setBack;
});
