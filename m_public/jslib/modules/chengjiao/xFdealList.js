/**
 * 查成交新房成交明细页
 * Created by guocheng on 2016/11/17.
 */
define('modules/chengjiao/xFdealList', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        // jquery库
        var $ = require('jquery');
        
        //固定头部
        $(window).scroll(function () {
            var tableT= $('.trend-table-t'),
                toff = $(this).scrollTop();
            if(toff > 44){
                tableT.addClass('fixed');
            }else{
                tableT.removeClass('fixed');;
            }
        });
    };
});