/**
 * Created by hanxiao on 2017/7/7.
 */
/**
 * Created by hanxiao on 2017/7/4.
 */
define('modules/job/companyIntroduction', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 导航按钮
        var $nav = $('.menu-cont');
        // 导航按钮点击后展开菜单
        $nav.on('click', function(){
            $('.zp-menu').show();
        });
        // 隐藏菜单
        $('.zp-menu').on('click', function(){
            $(this).hide();
        });
        $('.menuList').on('click',function(e){
            e.stopPropagation();
        });
    }
});