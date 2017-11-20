/**
 * @file app分享结果wap页
 * @author limengyang.bj@fang.com 2017-10-19
 */
define('modules/mycenter/myFavShare', ['jquery', 'lazyload/1.9.1/lazyload'], function (require) {
    'use strict';
    var $ = require('jquery');
    var vars = seajs.data.vars;
    // 图片惰性加载
    var lazyLoad = require('lazyload/1.9.1/lazyload');
    lazyLoad('img[data-original]').lazyload();
});