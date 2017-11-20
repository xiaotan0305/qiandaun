/**
 * Created by hanxiao on 2017/7/10.
 */
define('modules/job/commonProblem', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        $('#allProblem').on('click', function(){
            $('.zp_answer').show();
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
        $('#aboutRegister').on('click', function(){
            $('.zp_answer').hide();
            $('.zp_answer_zc').show();
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
        $('#zplc').on('click', function(){
            $('.zp_answer').hide();
            $('.zp_answer_lc').show();
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
        $('#zwsq').on('click', function(){
            $('.zp_answer').hide();
            $('.zp_answer_sq').show();
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
    }
});