/**
 * fdc--产业网首页
 * @author lijianin@fang.com on 2016/8/17
 * @modify circle(yuanhuihui@fang.com) 2016年08月26日13:54:40
 */
define('modules/fdc/industryIndex', ['jquery', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 懒加载
        require('lazyload/1.9.1/lazyload');
        $('img[data-original]').lazyload();
    };
});
