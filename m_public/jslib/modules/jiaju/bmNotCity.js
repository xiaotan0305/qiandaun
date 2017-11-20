/**
 * Created by zhangjinyu on 2017/9/6.
 */
define('modules/jiaju/bmNotCity',function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var vars = seajs.data.vars;
        var bmUrls = vars.bmUrls;
        setTimeout(function () {
            // 返回进入报名入口页面
            window.location = bmUrls.getUrl(3);
        }, 3000);
    };
});
