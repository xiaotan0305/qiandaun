/**
 * Created by zdl on 2016/8/25.
 * 邮箱 zhangdaliang@fang.com
 * 二手房区县成交榜
 */
define('modules/top/esfQxSqList', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 对页面进行了操作时隐藏更新时间div
        $(document).on('touchstart',function () {
            $('.updata-time').hide();
        });
    };
});