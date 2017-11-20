/**
 * Created by zdl on 2016/8/25.
 * 邮箱 zhangdaliang@fang.com
 */
define('modules/top/xfGzList', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
        $('.lazyload').lazyload();
    };
});
