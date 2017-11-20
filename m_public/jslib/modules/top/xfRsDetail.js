/**
 * Created by zdl on 2016/8/25.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/xfRsDetail', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('.lazyload').lazyload();
        // 对页面进行了操作时隐藏更新时间div
        $(document).on('touchstart', function () {
            $('.updata-time').hide();
        });
    };
});
