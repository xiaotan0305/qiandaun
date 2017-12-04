/**
 * Created by hanxiao on 2017/11/20.
 */
define('modules/bask/enrollAskUser', ['jquery'], function (require, exports, module) {
    'use strict';
    module.exports = function () {
        var $ = require('jquery');
        var vars = seajs.data.vars;

        $('#sub').on('click', function(){
            if (!vars.loginUrl) {
                if ($(this).hasClass('yes')) {
                    showMsg('您已经报过名了');
                    return false;
                } else {
                    $.ajax({
                        type : 'GET',
                        url : vars.askSite + '?c=bask&a=ajaxEnrollAskDK',
                        success : function(data){
                            if (data === 'true') {
                                showMsg('报名成功');
                                $('#sub').text('');
                                $('#sub').text('已报名');
                                $('#sub').addClass('yes');
                            } else {
                                showMsg('网络错误，请稍后再试');
                            }
                        },
                        error : function(){
                            showMsg('网络错误，请稍后再试');
                        }
                    });
                }
            } else {
                //未登录跳转登录页
                window.location = vars.loginUrl + "?burl=" + encodeURIComponent(location.href);
            }
        });

        var floatTxt = $('.alert');
        function showMsg(str) {
            floatTxt.text(str);
            $('.outBox').show();
            setTimeout(function(){
                $('.outBox').hide();
            }, 2000);
        }
        $('#close').on('click', function(){
            $('.outBox').hide();
        });
    };
});