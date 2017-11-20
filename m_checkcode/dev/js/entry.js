/**
 * @Author: fenglinzeng@fang.com
 * @Description: 验证插件
 * @Usage:
 * 1. $('.drag-content').slideVerify();
 */

$.fn.slideVerify = function (options) {
    var tool = require('./util/tool.js');

    // 默认配置项
    var config = require('./default.js');
    // 用传入的配置项覆盖默认配置项
    config.opts = config.merge(options);
    var opts = config.opts;

    var action = require('./action.js');

    window.$that = this;

    tool.loadStyleFile(opts.url.cssURL, function () {
        action.init();
    }, function () {
        console.error('slideVerify - CSS文件加载失败');
    });
};