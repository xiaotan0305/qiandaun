/**
 * 新房区县关注榜详情页
 * Created by lmy on 2016/10/17.
 * 邮箱 limengyang.bj@fang.com
 * Modify by limengyang.bj@fang.com on 2016-10-17，增加分享
 */
define('modules/top/xfDisGzDetail', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 对页面进行了操作时隐藏更新时间div
        $(document).on('touchstart',function () {
            $('.updata-time').hide();
        });
    };
});