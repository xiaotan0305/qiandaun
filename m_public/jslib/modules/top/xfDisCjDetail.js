/**
 * 新房区县成交榜详情页
 * Created by limengyang.bj@fang.com on 2016-10-17
 */
define('modules/top/xfDisCjDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 对页面进行了操作时隐藏更新时间div
        $(document).on('touchstart',function () {
            $('.updata-time').hide();
        });
    };
});