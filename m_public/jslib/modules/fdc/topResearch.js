/**
 * fdc--top10研究页面
 * @author limengyang.bj@fang.com 2016-11-28
 */
define('modules/fdc/topResearch', ['jquery', 'loadMore/1.0.0/loadMore', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;
        // 图片惰性加载
        require('lazyload/1.9.1/lazyload');
        $('img[data-original]').lazyload();
    };
});