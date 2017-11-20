/**
 * fdc--土地晚聚焦页
 * @author lijianlin@fang.com 2016-7-28
 */
define('modules/fdc/tdNightPaper', ['jquery', 'weixin/2.0.0/weixinshare', 'lazyload/1.9.1/lazyload'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var Wx = require('weixin/2.0.0/weixinshare');
        var vars = seajs.data.vars;
        require('lazyload/1.9.1/lazyload');
        // 图片惰性加载
        $('.lazyload').lazyload();
        var $navSec;
        new Wx({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            shareTitle: $('title').html(),
            descContent: $('meta[name="description"]')[0].content,
            lineLink: location.href,
            imgUrl: location.protocol + vars.public + '201511/images/fdc-eveningshare.jpg'
        });
        // 切换
        $('.tabNav a').on('click', function () {
            var $that = $(this);
            if (!$that.is('active')) {
                // 当前点击增加active样式，兄弟节点去掉active样式
                $that.addClass('active').siblings().removeClass('active');
                // 切换内容的样式
                $navSec = $that.attr('data-Sec');
                // 切换内容隐藏，点击的显示
                $('.navSection').hide();
                $('.' + $navSec).show();
                // 图片惰性加载
                $('.lazyload').lazyload();
            }
        });
    };
});