/**
 * Created by hanxiao on 2017/10/11.
 */
define('modules/job/recruitGameIndex', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        // 页面传入的数据
        var vars = seajs.data.vars;
        // 点击按钮显示序言
        $('.p1_img3, .p1_img4').on('click', function(){
            if ($(this).hasClass('p1_img3')) {
                $('.p1_img3').hide();
                $('.p1_img4').show();
                setTimeout(function(){
                    $('#beginGame').show();
                    $('.page-current').hide();
                },1000);
            } else {
                $('.p1_img4').hide();
                $('.p1_img3').show();
                $('#beginGame').hide();
                $('.page-current').show();
            }
        });
        // 点击接受挑战跳往地图
        $('#goToMap').on('click', function(){
            window.location.href = vars.jobSite + '?c=job&a=gameMap';
        });
    }
});